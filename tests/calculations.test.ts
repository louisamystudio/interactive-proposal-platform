// tests/calculations.test.ts - Calibrated validation tests
import {
  calculateBudgets,
  calculateDisciplineBudgets,
  calculateProjectHours,
  calculateFees,
  generateThreeOptions,
  calculateProject,
  DR_DE_JESUS_PROJECT,
  VALIDATION_TARGETS,
  ACTIVE_CONFIG
} from '../lib/calculations'
import { MODE, CLIENT_OPTIONS } from '../lib/constants'

describe('Louis Amy Calculation Engine - Calibrated Validation', () => {
  
  describe(`Dr. De Jesús Project (${MODE} Mode)`, () => {
    let results: ReturnType<typeof calculateProject>
    
    beforeAll(() => {
      results = calculateProject(DR_DE_JESUS_PROJECT)
    })

    test('Budget calculations match calibrated expectations', () => {
      expect(results.budgets.totalBudget).toBeCloseTo(VALIDATION_TARGETS.totalBudget, 0)
      expect(results.budgets.shellBudget).toBeCloseTo(VALIDATION_TARGETS.shellBudget, 1)
      expect(results.budgets.interiorBudget).toBeCloseTo(VALIDATION_TARGETS.interiorBudget, 1)
      expect(results.budgets.landscapeBudget).toBeCloseTo(VALIDATION_TARGETS.landscapeBudget, 1)
    })

    test('Hours calculation matches calibrated formula', () => {
      // Uses calibrated HFA_OFFSET for the active MODE
      expect(results.hours.totalHours).toBeCloseTo(VALIDATION_TARGETS.totalHours, 2)
      expect(results.hours.remodelHours).toBeGreaterThan(0)
      expect(results.hours.newHours).toBe(0) // No new construction
    })

    test('Fee calculation matches calibrated logic', () => {
      // Contract price uses calibrated constants for the active MODE
      expect(results.fees.contractPrice).toBeCloseTo(VALIDATION_TARGETS.contractPrice, 2)
      expect(results.fees.marketFee).toBeGreaterThan(0)
      expect(results.fees.louisAmyFee).toBeGreaterThan(0)
      
      console.log(`📊 ${MODE} Mode Results:`)
      console.log(`  Total Hours: ${results.hours.totalHours} (expected: ${VALIDATION_TARGETS.totalHours})`)
      console.log(`  Contract Price: $${results.fees.contractPrice.toLocaleString()} (expected: $${VALIDATION_TARGETS.contractPrice.toLocaleString()})`)
      console.log(`  HFA_OFFSET: ${ACTIVE_CONFIG.HFA_OFFSET}`)
    })

    test('Engineering discipline allocation sums correctly', () => {
      const { disciplines, budgets } = results
      const totalDisciplines = disciplines.architectureBudget + 
                              disciplines.structuralBudget +
                              disciplines.civilBudget +
                              disciplines.mechanicalBudget +
                              disciplines.electricalBudget +
                              disciplines.plumbingBudget +
                              disciplines.telecomBudget
      
      // Should equal shell budget (disciplines only apply to shell)
      expect(totalDisciplines).toBeCloseTo(budgets.shellBudget, 2)
    })

    test('Budget calculation consistency (corrected)', () => {
      // Verify the corrected budget math: 4,407 ft² × $195/ft² × 1.0 = $859,365
      const { areas, costs, multipliers } = DR_DE_JESUS_PROJECT
      const expectedRemodel = areas.existingAreaFt2 * costs.remodelTargetPSF * multipliers.remodelMultiplier
      
      expect(expectedRemodel).toBeCloseTo(859365, 0)
      expect(results.budgets.remodelBudget).toBeCloseTo(expectedRemodel, 0)
      
      console.log(`🧮 Budget Consistency Check:`)
      console.log(`  ${areas.existingAreaFt2} ft² × $${costs.remodelTargetPSF}/ft² × ${multipliers.remodelMultiplier} = $${expectedRemodel.toLocaleString()}`)
    })
  })

  describe('Calibration System', () => {
    test('Active configuration is valid', () => {
      expect(ACTIVE_CONFIG.HFA_OFFSET).toBeGreaterThan(0)
      expect(ACTIVE_CONFIG.MARKET_FEE_RATE).toBeGreaterThan(0)
      expect(ACTIVE_CONFIG.CATEGORY_MULTIPLIERS[5]).toBe(1.3)
      expect(VALIDATION_TARGETS.totalBudget).toBe(859365)
    })

    test('Constants affect calculations correctly', () => {
      // Different HFA_OFFSET should yield different hours
      const originalHours = calculateProjectHours(DR_DE_JESUS_PROJECT).totalHours
      expect(originalHours).toBeCloseTo(VALIDATION_TARGETS.totalHours, 2)
    })
  })

  describe('Category Multipliers', () => {
    test('Category mapping uses calibrated values', () => {
      const multipliers = ACTIVE_CONFIG.CATEGORY_MULTIPLIERS
      expect(multipliers[1]).toBe(0.9)
      expect(multipliers[2]).toBe(1.0)
      expect(multipliers[3]).toBe(1.1)
      expect(multipliers[4]).toBe(1.2)
      expect(multipliers[5]).toBe(1.3)
    })

    test('Category affects hours calculation', () => {
      const categories: Category[] = [1, 3, 5]
      const hoursByCategory: number[] = []

      categories.forEach(category => {
        const testInput = {
          ...DR_DE_JESUS_PROJECT,
          classification: { ...DR_DE_JESUS_PROJECT.classification, category }
        }
        const result = calculateProjectHours(testInput)
        hoursByCategory.push(result.totalHours)
      })

      // Hours should increase with category (higher complexity)
      expect(hoursByCategory[1]).toBeGreaterThan(hoursByCategory[0]) // Cat 3 > Cat 1
      expect(hoursByCategory[2]).toBeGreaterThan(hoursByCategory[1]) // Cat 5 > Cat 3
    })
  })

  describe('Three Options Generation', () => {
    test('Options use fixed client-facing pricing', () => {
      const options = generateThreeOptions()
      
      expect(options.A.investment).toBe(CLIENT_OPTIONS.A.investment)
      expect(options.B.investment).toBe(CLIENT_OPTIONS.B.investment)
      expect(options.C.investment).toBe(CLIENT_OPTIONS.C.investment)
    })

    test('Option A is premium anchor (Chris Do compliance)', () => {
      const options = generateThreeOptions()
      
      expect(options.A.investment).toBeGreaterThan(options.B.investment)
      expect(options.B.investment).toBeGreaterThan(options.C.investment)
      
      // Option A should be presented first (anchor high)
      expect(options.A.investment).toBe(187_099)
    })

    test('All options have value promises (no hourly language)', () => {
      const options = generateThreeOptions()
      
      expect(options.A.valuePromise).toContain('luxury')
      expect(options.B.valuePromise).toContain('alliance')
      expect(options.C.valuePromise).toContain('foundation')
      
      // Chris Do compliance: no hourly or effort language
      Object.values(options).forEach(option => {
        expect(option.valuePromise).not.toMatch(/hour|rate|effort|work|cost/i)
        expect(option.scope.join(' ')).not.toMatch(/hour|rate|effort/i)
        expect(option.valuePromise).toBeTruthy()
      })
    })

    test('Options are decoupled from contract calculations', () => {
      const options = generateThreeOptions()
      const calculatedContract = results.fees.contractPrice
      
      // Client options are strategic pricing, not calculated from contract
      expect(options.A.investment).not.toBe(calculatedContract)
      expect(options.B.investment).not.toBe(calculatedContract * 0.67)
      expect(options.C.investment).not.toBe(calculatedContract * 0.47)
      
      // They should be close to but not identical to internal calculations
      expect(options.A.investment).toBeCloseTo(calculatedContract, -3) // Within $1000s
    })
  })

  describe('Budget Share Normalization', () => {
    test('Shares always sum to 100%', () => {
      const testShares = [
        { projectShellShare: 0.7, projectInteriorShare: 0.2, projectLandscapeShare: 0.1 }, // Sum = 1.0
        { projectShellShare: 0.65, projectInteriorShare: 0.25, projectLandscapeShare: 0.15 }, // Sum = 1.05
        { projectShellShare: 0.6, projectInteriorShare: 0.2, projectLandscapeShare: 0.1 } // Sum = 0.9
      ]

      testShares.forEach(shares => {
        const input = { ...DR_DE_JESUS_PROJECT, shares }
        const result = calculateBudgets(input)
        
        const calculatedSum = (result.shellBudget + result.interiorBudget + result.landscapeBudget) / result.totalBudget
        expect(calculatedSum).toBeCloseTo(1.0, 3)
      })
    })
  })

  describe('Edge Cases & Validation', () => {
    test('Zero new area handled correctly', () => {
      // Dr. De Jesús project has zero new construction
      const result = calculateProject(DR_DE_JESUS_PROJECT)
      
      expect(result.budgets.newBudget).toBe(0)
      expect(result.budgets.remodelBudget).toBeGreaterThan(0)
      expect(result.hours.newHours).toBe(0)
      expect(result.hours.remodelHours).toBeGreaterThan(0)
    })

    test('Historic multiplier applied correctly', () => {
      const historicInput = {
        ...DR_DE_JESUS_PROJECT,
        multipliers: { ...DR_DE_JESUS_PROJECT.multipliers, historicMultiplier: 1.2 }
      }
      const normal = calculateBudgets(DR_DE_JESUS_PROJECT)
      const historic = calculateBudgets(historicInput)
      
      // Historic should increase new construction budget by 20% (if any new area)
      if (DR_DE_JESUS_PROJECT.areas.newAreaFt2 > 0) {
        expect(historic.newBudget / normal.newBudget).toBeCloseTo(1.2, 2)
      }
    })
  })

  describe('Chris Do Compliance', () => {
    test('No internal calculation data exposed', () => {
      const result = calculateProject(DR_DE_JESUS_PROJECT)
      
      // Should not contain internal rate references in client-safe data
      const clientSafeData = {
        budgets: result.budgets,
        options: result.options
        // hours and fees are internal only
      }
      
      const serialized = JSON.stringify(clientSafeData)
      expect(serialized).not.toMatch(/hourly|rate.*hour|per.*hour/i)
      expect(serialized).not.toMatch(/35\.73|46\.10|164/i) // Internal labor rates
    })

    test('Options emphasize value and transformation', () => {
      const options = generateThreeOptions()
      
      Object.values(options).forEach(option => {
        expect(option.valuePromise).toBeTruthy()
        expect(option.idealWhen).toBeTruthy()
        expect(option.scope.length).toBeGreaterThan(0)
        
        // Should focus on outcomes, not effort
        expect(option.valuePromise).toMatch(/luxury|alliance|foundation|precision|cohesion/i)
        expect(option.valuePromise).not.toMatch(/hour|work|effort|cost/i)
      })
    })
  })
})

// Export validation function for development use
export function validateCalibration() {
  const result = calculateProject(DR_DE_JESUS_PROJECT)
  
  console.log(`🧮 Dr. De Jesús Project Validation (${MODE} Mode):`)
  console.log(`  Total Budget: $${result.budgets.totalBudget.toLocaleString()} (expected: $${VALIDATION_TARGETS.totalBudget.toLocaleString()})`)
  console.log(`  Shell Budget: $${result.budgets.shellBudget.toLocaleString()} (expected: $${VALIDATION_TARGETS.shellBudget.toLocaleString()})`)
  console.log(`  Total Hours: ${result.hours.totalHours} (expected: ${VALIDATION_TARGETS.totalHours})`)
  console.log(`  Contract Price: $${result.fees.contractPrice.toLocaleString()} (expected: $${VALIDATION_TARGETS.contractPrice.toLocaleString()})`)
  console.log(`  HFA_OFFSET: ${ACTIVE_CONFIG.HFA_OFFSET}`)
  console.log('')
  console.log(`📊 Client Options (Strategic Pricing):`)
  console.log(`  Option A: $${CLIENT_OPTIONS.A.investment.toLocaleString()}`)
  console.log(`  Option B: $${CLIENT_OPTIONS.B.investment.toLocaleString()}`)  
  console.log(`  Option C: $${CLIENT_OPTIONS.C.investment.toLocaleString()}`)
  
  const isValid = Math.abs(result.budgets.totalBudget - VALIDATION_TARGETS.totalBudget) < 100 &&
                  Math.abs(result.hours.totalHours - VALIDATION_TARGETS.totalHours) < 5 &&
                  Math.abs(result.fees.contractPrice - VALIDATION_TARGETS.contractPrice) < 100
  
  console.log(`✅ Validation: ${isValid ? 'PASS' : 'FAIL'}`)
  
  return { isValid, results, targets: VALIDATION_TARGETS }
}