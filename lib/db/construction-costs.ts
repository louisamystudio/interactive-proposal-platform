import { query, querySingle } from '../db'
import { getFallbackData, COMPREHENSIVE_FALLBACK_DATA } from '../comprehensive-fallback-data'
import { createClient } from '@supabase/supabase-js'

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

// Service functions for construction cost data
export const constructionCostService = {
  // Get all unique building uses
  async getBuildingUses(): Promise<string[]> {
    try {
      const data = await query<{ building_use: string }>(`
        SELECT DISTINCT building_use 
        FROM pr_construction_cost_index_2025 
        ORDER BY building_use
      `)

      if (!data || data.length === 0) {
        throw new Error('No data found')
      }

      return data.map(item => item.building_use)
    } catch (error) {
      console.error('Error fetching building uses:', error)
      console.log('🔄 Using comprehensive fallback building uses...')

      // Extract all building uses from comprehensive fallback data
      return Object.keys(COMPREHENSIVE_FALLBACK_DATA)
    }
  },

  // Get building types for a specific building use
  async getBuildingTypes(buildingUse: string): Promise<string[]> {
    try {
      const data = await query<{ building_type: string }>(`
        SELECT DISTINCT building_type 
        FROM pr_construction_cost_index_2025 
        WHERE building_use = $1
        ORDER BY building_type
      `, [buildingUse])

      if (!data || data.length === 0) {
        throw new Error('No data found')
      }

      return data.map(item => item.building_type)
    } catch (error) {
      console.error('Error fetching building types:', error)
      console.log('🔄 Using comprehensive fallback building types...')

      // Extract building types for the specific use from comprehensive fallback
      const useData = COMPREHENSIVE_FALLBACK_DATA[buildingUse as keyof typeof COMPREHENSIVE_FALLBACK_DATA]
      if (useData) {
        return Object.keys(useData)
      }

      return []
    }
  },

  // Get building tiers for a specific building type
  async getBuildingTiers(buildingUse: string, buildingType: string): Promise<string[]> {
    try {
      const data = await query<{ building_tier: string }>(`
        SELECT DISTINCT building_tier 
        FROM pr_construction_cost_index_2025 
        WHERE building_use = $1 AND building_type = $2
        ORDER BY building_tier
      `, [buildingUse, buildingType])

      if (!data || data.length === 0) {
        throw new Error('No data found')
      }

      return data.map(item => item.building_tier)
    } catch (error) {
      console.error('Error fetching building tiers:', error)
      console.log('🔄 Using comprehensive fallback building tiers...')

      // Extract tiers for the specific use/type from comprehensive fallback
      const useData = COMPREHENSIVE_FALLBACK_DATA[buildingUse as keyof typeof COMPREHENSIVE_FALLBACK_DATA]
      const typeData = useData?.[buildingType as keyof typeof useData]

      if (typeData) {
        // Get all tiers across all categories
        const allTiers = new Set<string>()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any  
        Object.values(typeData).forEach((categoryData: any) => {
          Object.keys(categoryData).forEach(tier => allTiers.add(tier))
        })
        return Array.from(allTiers).sort()
      }

      return ['Low', 'Mid', 'High']
    }
  },

  // Get categories for a building type
  async getCategories(buildingUse: string, buildingType: string): Promise<number[]> {
    try {
      const data = await query<{ category: number }>(`
        SELECT DISTINCT category 
        FROM pr_construction_cost_index_2025 
        WHERE building_use = $1 AND building_type = $2
        ORDER BY category
      `, [buildingUse, buildingType])

      if (!data || data.length === 0) {
        throw new Error('No data found')
      }

      return data.map(item => item.category)
    } catch (error) {
      console.error('Error fetching categories:', error)
      console.log('🔄 Using comprehensive fallback categories...')

      // Extract categories for the specific use/type from comprehensive fallback
      const useData = COMPREHENSIVE_FALLBACK_DATA[buildingUse as keyof typeof COMPREHENSIVE_FALLBACK_DATA]
      const typeData = useData?.[buildingType as keyof typeof useData]

      if (typeData) {
        const categories = Object.keys(typeData).map(Number).filter(n => !isNaN(n))
        return categories.sort((a, b) => a - b)
      }

      return [1, 2, 3, 4, 5]
    }
  },

  // Get complete cost data for specific classification
  async getCostData(
    buildingUse: string,
    buildingType: string,
    category: number,
    buildingTier: string
  ): Promise<ConstructionCostData | null> {
    try {
      const data = await querySingle<any>(`
        SELECT * FROM pr_construction_cost_index_2025 
        WHERE building_use = $1 
        AND building_type = $2 
        AND category = $3 
        AND building_tier = $4
        LIMIT 1
      `, [buildingUse, buildingType, category, buildingTier])

      if (!data) {
        throw new Error('No data found')
      }

      // Transform database data to our interface
      return {
        id: 0, // Not used; preserve shape
        buildingUse: data.building_use,
        buildingType: data.building_type,
        category: data.category,
        buildingTier: data.building_tier,
        costRanges: {
          shell: {
            newMin: Number(data.shell_new_min || 0),
            newTarget: Number(data.shell_new_target || 0),
            newMax: Number(data.shell_new_max || 0),
            remodelMin: Number(data.shell_existing_min || 0),
            remodelTarget: Number(data.shell_existing_target || 0),
            remodelMax: Number(data.shell_existing_max || 0)
          },
          interior: {
            newMin: Number(data.interior_new_min || 0),
            newTarget: Number(data.interior_new_target || 0),
            newMax: Number(data.interior_new_max || 0),
            remodelMin: Number(data.interior_existing_min || 0),
            remodelTarget: Number(data.interior_existing_target || 0),
            remodelMax: Number(data.interior_existing_max || 0)
          },
          landscape: {
            newMin: Number(data.landscape_new_min || 0),
            newTarget: Number(data.landscape_new_target || 0),
            newMax: Number(data.landscape_new_max || 0),
            remodelMin: Number(data.landscape_existing_min || 0),
            remodelTarget: Number(data.landscape_existing_target || 0),
            remodelMax: Number(data.landscape_existing_max || 0)
          },
          pool: {
            newMin: Number(data.pool_new_min || 0),
            newTarget: Number(data.pool_new_target || 0),
            newMax: Number(data.pool_new_max || 0),
            remodelMin: Number(data.pool_existing_min || 0),
            remodelTarget: Number(data.pool_existing_target || 0),
            remodelMax: Number(data.pool_existing_max || 0)
          }
        },
        projectShares: {
          shellShare: Number(data.project_shell_share_pct || 0) / 100, // Use percentage column
          interiorShare: Number(data.project_interior_share_pct || 0) / 100,
          landscapeShare: Number(data.project_landscape_share_pct || 0) / 100
        },
        designShares: {
          architectural: Number(data.architectural_design_share_pct || 0) / 100,
          interior: Number(data.interior_design_share_pct || 0) / 100,
          landscape: Number(data.landscape_design_share_pct || 0) / 100,
          structural: Number(data.structural_design_share_pct || 0) / 100,
          civil: Number(data.civil_design_share_pct || 0) / 100,
          mechanical: Number(data.mechanical_design_share_pct || 0) / 100,
          electrical: Number(data.electrical_design_share_pct || 0) / 100,
          plumbing: Number(data.plumbing_design_share_pct || 0) / 100,
          telecommunication: Number(data.telecommunication_design_share_pct || 0) / 100
        }
      }
    } catch (error) {
      console.error('Error fetching cost data:', error)
      console.log('🔄 Using comprehensive fallback data...')

      // Use comprehensive fallback data generated from CSV
      const fallbackData = getFallbackData(buildingUse, buildingType, category, buildingTier)

      if (!fallbackData) {
        console.error(`No fallback data available for: ${buildingUse}/${buildingType}/${category}/${buildingTier}`)
        return null
      }

      return {
        id: 0, // Fallback ID
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
    }
  },

  // Get calculation constants from database
  async getCalculationConstants(): Promise<Record<string, number>> {
    try {
      const data = await query<{ key: string; value: number }>(`
        SELECT key, value FROM calculation_constants
      `)

      if (!data || data.length === 0) {
        throw new Error('No constants found')
      }

      // Convert to key-value object
      const constants: Record<string, number> = {}
      data.forEach(item => {
        constants[item.key] = Number(item.value)
      })

      return constants
    } catch (error) {
      console.error('Error fetching calculation constants:', error)
      // Return Excel defaults
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
    }
  },

  // Get category multiplier
  async getCategoryMultiplier(category: number): Promise<number> {
    try {
      const data = await querySingle<{ multiplier: number }>(`
        SELECT multiplier FROM category_multipliers 
        WHERE category = $1
        LIMIT 1
      `, [category])

      if (!data) {
        throw new Error('No multiplier found')
      }

      return Number(data.multiplier)
    } catch (error) {
      console.error('Error fetching category multiplier:', error)
      // Fallback to default multipliers
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
}