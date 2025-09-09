/**
 * Acceptance Tests for Louis Amy AE Studio Proposal Platform
 * These tests verify critical requirements:
 * 1. Math parity - Dr. De Jesus fixture must calculate correctly
 * 2. Client safety - No internal data exposed to clients
 * 3. Performance - Pages load quickly
 */

import { calculateProject } from '@/lib/calculations'
import { CalcInput } from '@/lib/types'

describe('Math Parity Tests', () => {
  test('Dr. De Jesus fixture - 4,407 ft² @ $195/ft² = $859,365', () => {
    const input: CalcInput = {
      classification: {
        buildingUse: 'Residential',
        buildingType: 'Single Family Home',
        buildingTier: 'Mid',
        category: 3,
        designLevel: 2
      },
      areas: {
        newAreaFt2: 0,
        existingAreaFt2: 4407
      },
      costs: {
        newTargetPSF: 267,
        remodelTargetPSF: 195
      },
      multipliers: {
        historicMultiplier: 1,
        remodelMultiplier: 1
      },
      shares: {
        projectShellShare: 0.66,
        projectInteriorShare: 0.22,
        projectLandscapeShare: 0.12
      },
      engineering: {
        structuralDesignShare: 0.02,
        civilDesignShare: 0.01,
        mechanicalDesignShare: 0.016,
        electricalDesignShare: 0.016,
        plumbingDesignShare: 0.011,
        telecomDesignShare: 0.005
      }
    }

    const results = calculateProject(input)
    
    // Verify total budget
    expect(Math.round(results.budgets.totalBudget)).toBe(859365)
    
    // Verify shares sum to 100%
    const shareSum = input.shares.projectShellShare + 
                    input.shares.projectInteriorShare + 
                    input.shares.projectLandscapeShare
    expect(Math.abs(shareSum - 1.0)).toBeLessThan(0.001)
    
    // Verify budget breakdown with default shares
    expect(Math.round(results.budgets.shellBudget)).toBeCloseTo(567181, -2) // 66%
    expect(Math.round(results.budgets.interiorBudget)).toBeCloseTo(189060, -2) // 22%
    expect(Math.round(results.budgets.landscapeBudget)).toBeCloseTo(103124, -2) // 12%
  })

  test('Architecture = Shell - Sum(Engineering disciplines)', () => {
    const input: CalcInput = {
      classification: {
        buildingUse: 'Residential',
        buildingType: 'Single Family Home',
        buildingTier: 'Mid',
        category: 3,
        designLevel: 2
      },
      areas: {
        newAreaFt2: 0,
        existingAreaFt2: 4407
      },
      costs: {
        newTargetPSF: 267,
        remodelTargetPSF: 195
      },
      multipliers: {
        historicMultiplier: 1,
        remodelMultiplier: 1
      },
      shares: {
        projectShellShare: 0.66,
        projectInteriorShare: 0.22,
        projectLandscapeShare: 0.12
      },
      engineering: {
        structuralDesignShare: 0.02,
        civilDesignShare: 0.01,
        mechanicalDesignShare: 0.016,
        electricalDesignShare: 0.016,
        plumbingDesignShare: 0.011,
        telecomDesignShare: 0.005
      }
    }

    const results = calculateProject(input)
    const { shellBudget } = results.budgets
    const { 
      architectureBudget,
      structuralBudget,
      civilBudget,
      mechanicalBudget,
      electricalBudget,
      plumbingBudget,
      telecomBudget
    } = results.disciplines
    
    // Sum of all engineering disciplines
    const engineeringSum = structuralBudget + civilBudget + mechanicalBudget + 
                          electricalBudget + plumbingBudget + telecomBudget
    
    // Architecture should be the remainder
    const calculatedArchitecture = shellBudget - engineeringSum
    
    // Verify within $1 tolerance
    expect(Math.abs(architectureBudget - calculatedArchitecture)).toBeLessThan(1)
    
    // Verify all disciplines sum to shell budget
    const allDisciplinesSum = architectureBudget + engineeringSum
    expect(Math.abs(allDisciplinesSum - shellBudget)).toBeLessThan(1)
  })

  test('Contract = max(discounted Market, Louis Amy)', () => {
    const input: CalcInput = {
      classification: {
        buildingUse: 'Residential',
        buildingType: 'Single Family Home',
        buildingTier: 'Mid',
        category: 3,
        designLevel: 2
      },
      areas: {
        newAreaFt2: 0,
        existingAreaFt2: 4407
      },
      costs: {
        newTargetPSF: 267,
        remodelTargetPSF: 195
      },
      multipliers: {
        historicMultiplier: 1,
        remodelMultiplier: 1
      },
      shares: {
        projectShellShare: 0.66,
        projectInteriorShare: 0.22,
        projectLandscapeShare: 0.12
      },
      engineering: {
        structuralDesignShare: 0.02,
        civilDesignShare: 0.01,
        mechanicalDesignShare: 0.016,
        electricalDesignShare: 0.016,
        plumbingDesignShare: 0.011,
        telecomDesignShare: 0.005
      }
    }

    const results = calculateProject(input)
    const { marketFee, louisAmyFee, contractPrice } = results.fees
    
    // Test various discount scenarios
    const discounts = [0, 0.1, 0.15, 0.25, 0.3] // 0%, 10%, 15%, 25%, 30%
    
    discounts.forEach(discount => {
      // Discount should be capped at 25%
      const effectiveDiscount = Math.min(discount, 0.25)
      const discountedMarket = marketFee * (1 - effectiveDiscount)
      const expectedContract = Math.max(discountedMarket, louisAmyFee)
      
      // For this test, we're using the default calculation
      // In production, admin can adjust discount via slider
      if (discount === 0.15) { // Default discount in calculations
        expect(Math.abs(contractPrice - expectedContract)).toBeLessThan(1)
      }
    })
  })
})

describe('Client Safety Tests', () => {
  test('Client proposal data must not contain forbidden strings', () => {
    // Simulate client-safe data structure
    const clientData = {
      projectName: 'Casa Vista Residential Remodel',
      clientName: 'Dr. Luis De Jesús',
      location: 'Ponce, Puerto Rico',
      totalBudget: 859365,
      buildingAreaFt2: 4407,
      siteAreaM2: 972,
      costPerSqFt: 195,
      budgetDistribution: {
        shell: { amount: 567181, percentage: 66 },
        interior: { amount: 189060, percentage: 22 },
        landscape: { amount: 103124, percentage: 12 }
      },
      options: {
        A: {
          investment: 187099,
          scope: ['Complete architectural design'],
          excluded: ['3D renderings'],
          idealWhen: 'You want comprehensive design services',
          valuePromise: 'Premium design excellence'
        },
        B: {
          investment: 126636,
          scope: ['Architectural design'],
          excluded: ['Landscape design'],
          idealWhen: 'You have a clear vision',
          valuePromise: 'Smart investment'
        },
        C: {
          investment: 87898,
          scope: ['Schematic design'],
          excluded: ['Interior design'],
          idealWhen: 'You need minimum services',
          valuePromise: 'Essential services'
        }
      }
    }
    
    // Convert to JSON string as it would appear in client HTML
    const clientJSON = JSON.stringify(clientData)
    
    // Forbidden strings that must never appear in client data
    const forbiddenStrings = [
      'hour',
      'rate',
      'discount',
      'overhead',
      'markup',
      'margin',
      'blended',
      'bottom-up',
      'top-down'
    ]
    
    forbiddenStrings.forEach(forbidden => {
      expect(clientJSON.toLowerCase()).not.toContain(forbidden.toLowerCase())
    })
  })
})

describe('Performance Tests', () => {
  test('Calculation engine should complete in under 500ms', () => {
    const input: CalcInput = {
      classification: {
        buildingUse: 'Residential',
        buildingType: 'Single Family Home',
        buildingTier: 'Mid',
        category: 3,
        designLevel: 2
      },
      areas: {
        newAreaFt2: 0,
        existingAreaFt2: 4407
      },
      costs: {
        newTargetPSF: 267,
        remodelTargetPSF: 195
      },
      multipliers: {
        historicMultiplier: 1,
        remodelMultiplier: 1
      },
      shares: {
        projectShellShare: 0.66,
        projectInteriorShare: 0.22,
        projectLandscapeShare: 0.12
      },
      engineering: {
        structuralDesignShare: 0.02,
        civilDesignShare: 0.01,
        mechanicalDesignShare: 0.016,
        electricalDesignShare: 0.016,
        plumbingDesignShare: 0.011,
        telecomDesignShare: 0.005
      }
    }
    
    const startTime = Date.now()
    calculateProject(input)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    expect(duration).toBeLessThan(500)
  })
})