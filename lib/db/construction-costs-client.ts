// Client-side version of construction costs service that uses API routes
import { getFallbackData, COMPREHENSIVE_FALLBACK_DATA } from '../comprehensive-fallback-data'

// Types for construction cost data
export interface BuildingClassification {
  buildingUse: string
  buildingType: string
  category: number
  buildingTier: string
}

export interface CostRanges {
  shell: {
    newMin: number
    newTarget: number
    newMax: number
    remodelMin: number
    remodelTarget: number
    remodelMax: number
  }
  interior: {
    newMin: number
    newTarget: number
    newMax: number
    remodelMin: number
    remodelTarget: number
    remodelMax: number
  }
  landscape: {
    newMin: number
    newTarget: number
    newMax: number
    remodelMin: number
    remodelTarget: number
    remodelMax: number
  }
  pool: {
    newMin: number
    newTarget: number
    newMax: number
    remodelMin: number
    remodelTarget: number
    remodelMax: number
  }
}

export interface ProjectShares {
  shellShare: number
  interiorShare: number
  landscapeShare: number
}

export interface DesignShares {
  architectural: number
  interior: number
  landscape: number
  structural: number
  civil: number
  mechanical: number
  electrical: number
  plumbing: number
  telecommunication: number
}

export interface ConstructionCostData {
  id: number
  buildingUse: string
  buildingType: string
  category: number
  buildingTier: string
  costRanges: CostRanges
  projectShares: ProjectShares
  designShares: DesignShares
}

// Client-side service that uses API routes instead of direct database access
export const constructionCostService = {
  // Get all unique building uses
  async getBuildingUses(): Promise<string[]> {
    try {
      const response = await fetch('/api/cost-config', {
        method: 'OPTIONS'
      })
      if (!response.ok) throw new Error('Failed to fetch building uses')
      const data = await response.json()
      return data.uses || Object.keys(COMPREHENSIVE_FALLBACK_DATA)
    } catch (error) {
      console.error('Error fetching building uses:', error)
      console.log('🔄 Using comprehensive fallback building uses...')
      return Object.keys(COMPREHENSIVE_FALLBACK_DATA)
    }
  },

  // Get building types for a specific building use
  async getBuildingTypes(buildingUse: string): Promise<string[]> {
    try {
      const response = await fetch('/api/building-options')
      if (!response.ok) throw new Error('Failed to fetch building options')
      const data = await response.json()
      
      const option = data.options?.find((opt: any) => opt.use === buildingUse)
      if (option?.types) {
        return option.types
      }
      
      throw new Error('No types found for building use')
    } catch (error) {
      console.error('Error fetching building types:', error)
      console.log('🔄 Using comprehensive fallback building types...')
      
      const useData = COMPREHENSIVE_FALLBACK_DATA[buildingUse as keyof typeof COMPREHENSIVE_FALLBACK_DATA]
      if (useData) {
        return Object.keys(useData)
      }
      return []
    }
  },

  // Get building tiers for a specific building type
  async getBuildingTiers(buildingUse: string, buildingType: string): Promise<string[]> {
    // For now, return standard tiers
    return ['Low', 'Mid', 'High']
  },

  // Get categories for a building type
  async getCategories(buildingUse: string, buildingType: string): Promise<number[]> {
    // For now, return standard categories
    return [1, 2, 3, 4, 5]
  },

  // Get complete cost data for specific classification
  async getCostData(
    buildingUse: string,
    buildingType: string,
    category: number,
    buildingTier: string
  ): Promise<ConstructionCostData | null> {
    try {
      // Map tier names for API compatibility
      const tierMap: Record<string, number> = {
        'Low': 1,
        'Mid': 2,
        'High': 3
      }
      const tierNumber = tierMap[buildingTier] || 2

      const response = await fetch(`/api/cost-config?use=${encodeURIComponent(buildingUse)}&type=${encodeURIComponent(buildingType)}&tier=${tierNumber}`)
      if (!response.ok) {
        // Don't throw error, just use fallback gracefully
        console.warn('Using fallback data - API returned non-OK status')
        return this.getFallbackCostData(buildingUse, buildingType, category, buildingTier)
      }
      
      const config = await response.json()
      
      // Transform API response to our interface
      const targetNewPSF = config.psf?.new?.target || 200
      const targetRemodelPSF = config.psf?.remodel?.target || 150
      
      // Use actual shares from database (already normalized to 100%)
      const shellShare = config.shares_default?.shell || 0.70
      const interiorShare = config.shares_default?.interior || 0.22
      const landscapeShare = config.shares_default?.landscape || 0.08
      
      return {
        id: 0,
        buildingUse,
        buildingType,
        category: config.classification?.category || category,
        buildingTier,
        costRanges: {
          shell: {
            newMin: targetNewPSF * shellShare * 0.9,
            newTarget: targetNewPSF * shellShare,
            newMax: targetNewPSF * shellShare * 1.15,
            remodelMin: targetRemodelPSF * shellShare * 0.9,
            remodelTarget: targetRemodelPSF * shellShare,
            remodelMax: targetRemodelPSF * shellShare * 1.15
          },
          interior: {
            newMin: targetNewPSF * interiorShare * 0.8,
            newTarget: targetNewPSF * interiorShare,
            newMax: targetNewPSF * interiorShare * 1.3,
            remodelMin: targetRemodelPSF * interiorShare * 0.8,
            remodelTarget: targetRemodelPSF * interiorShare,
            remodelMax: targetRemodelPSF * interiorShare * 1.3
          },
          landscape: {
            newMin: targetNewPSF * landscapeShare * 0.7,
            newTarget: targetNewPSF * landscapeShare,
            newMax: targetNewPSF * landscapeShare * 1.5,
            remodelMin: targetRemodelPSF * landscapeShare * 0.7,
            remodelTarget: targetRemodelPSF * landscapeShare,
            remodelMax: targetRemodelPSF * landscapeShare * 1.5
          },
          pool: {
            newMin: 0, newTarget: 0, newMax: 0,
            remodelMin: 0, remodelTarget: 0, remodelMax: 0
          }
        },
        projectShares: {
          shellShare,
          interiorShare,
          landscapeShare
        },
        designShares: {
          architectural: 0.055,
          interior: 0.023,
          landscape: 0.009,
          structural: 0.016,
          civil: 0.008,
          mechanical: 0.013,
          electrical: 0.013,
          plumbing: 0.009,
          telecommunication: 0.004
        }
      }
    } catch (error) {
      // Handle network errors gracefully without throwing
      console.warn('Network error, using fallback data:', error)
      return this.getFallbackCostData(buildingUse, buildingType, category, buildingTier)
    }
  },

  // Helper method to get fallback data
  getFallbackCostData(
    buildingUse: string,
    buildingType: string,
    category: number,
    buildingTier: string
  ): ConstructionCostData | null {
    console.log('🔄 Using comprehensive fallback data...')
    
    const fallbackData = getFallbackData(buildingUse, buildingType, category, buildingTier)
    
    if (!fallbackData) {
      console.error(`No fallback data available for: ${buildingUse}/${buildingType}/${category}/${buildingTier}`)
      return null
    }
    
    return {
      id: 0,
      buildingUse,
      buildingType,
      category,
      buildingTier,
      costRanges: {
        shell: fallbackData.costRanges.shell,
        interior: fallbackData.costRanges.interior,
        landscape: fallbackData.costRanges.landscape,
        pool: {
          newMin: 0, newTarget: 0, newMax: 0,
          remodelMin: 0, remodelTarget: 0, remodelMax: 0
        }
      },
      projectShares: fallbackData.projectShares,
      designShares: fallbackData.designShares
    }
  },

  // Get calculation constants from database
  async getCalculationConstants(): Promise<Record<string, number>> {
    // Return Excel defaults for client-side
    return {
      HFA_OFFSET: 0.08,
      HOURS_BASE_A: 0.21767,
      HOURS_BASE_B: 11.21274,
      HOURS_EXPONENT: -0.53816,
      NEW_CONSTRUCTION_FACTOR: 0.9,
      REMODEL_FACTOR: 0.77,
      MARKET_FEE_RATE: 0.178025631,
      MAX_DISCOUNT: 0.25,
      AVG_LABOR_RATE: 35.72987981,
      AVG_OVERHEAD_RATE: 39.40706103,
      PRICING_MARKUP: 2.0
    }
  },

  // Get category multiplier
  async getCategoryMultiplier(category: number): Promise<number> {
    const multipliers: Record<number, number> = {
      1: 0.9,
      2: 1.0,
      3: 1.1,
      4: 1.2,
      5: 1.3
    }
    return multipliers[category] || 1.0
  }
}