import { supabase } from '../supabase'
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

// Row type matching Supabase table schema (used internally by queries)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PrConstructionCostIndex2025Row = {
  id: string
  building_use: string
  building_type: string
  category: number
  building_tier: string
  shell_new_min: number | null
  shell_existing_min: number | null
  shell_new_target: number | null
  shell_existing_target: number | null
  shell_new_max: number | null
  shell_existing_max: number | null
  interior_new_min: number | null
  interior_existing_min: number | null
  interior_new_target: number | null
  interior_existing_target: number | null
  interior_new_max: number | null
  interior_existing_max: number | null
  landscape_new_min: number | null
  landscape_existing_min: number | null
  landscape_new_target: number | null
  landscape_existing_target: number | null
  landscape_new_max: number | null
  landscape_existing_max: number | null
  pool_new_min: number | null
  pool_existing_min: number | null
  pool_new_target: number | null
  pool_existing_target: number | null
  pool_new_max: number | null
  pool_existing_max: number | null
  project_shell_share_pct: number | null
  project_interior_share_pct: number | null
  project_landscape_share_pct: number | null
  architectural_design_share_pct: number | null
  interior_design_share_pct: number | null
  landscape_design_share_pct: number | null
  structural_design_share_pct: number | null
  civil_design_share_pct: number | null
  mechanical_design_share_pct: number | null
  electrical_design_share_pct: number | null
  plumbing_design_share_pct: number | null
  telecommunication_design_share_pct: number | null
}

// Service functions for construction cost data
export const constructionCostService = {
  // Get all unique building uses
  async getBuildingUses(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('pr_construction_cost_index_2025')
        .select('building_use')
        .order('building_use')
      
      if (error) throw error
      
      // Get unique values
      const uniqueUses = Array.from(new Set((data || []).map((item) => item.building_use)))
      return uniqueUses
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
      const { data, error } = await supabase
        .from('pr_construction_cost_index_2025')
        .select('building_type')
        .eq('building_use', buildingUse)
        .order('building_type')
      
      if (error) throw error
      
      // Get unique values
      const uniqueTypes = Array.from(new Set((data || []).map((item) => item.building_type)))
      return uniqueTypes
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
      const { data, error } = await supabase
        .from('pr_construction_cost_index_2025')
        .select('building_tier')
        .eq('building_use', buildingUse)
        .eq('building_type', buildingType)
        .order('building_tier')
      
      if (error) throw error
      
      // Get unique values
      const uniqueTiers = Array.from(new Set((data || []).map((item) => item.building_tier)))
      return uniqueTiers
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
      const { data, error } = await supabase
        .from('pr_construction_cost_index_2025')
        .select('category')
        .eq('building_use', buildingUse)
        .eq('building_type', buildingType)
        .order('category')
      
      if (error) throw error
      
      // Get unique values
      const uniqueCategories = Array.from(new Set((data || []).map((item) => item.category)))
      return uniqueCategories
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
      const { data, error } = await supabase
        .from('pr_construction_cost_index_2025')
        .select('*')
        .eq('building_use', buildingUse)
        .eq('building_type', buildingType)
        .eq('category', category)
        .eq('building_tier', buildingTier)
        .single()
      
      if (error) throw error
      
      if (!data) return null
      
      // Transform database data to our interface
      return {
        id: data.id as unknown as number, // Not used outside; preserve shape
        buildingUse: data.building_use,
        buildingType: data.building_type,
        category: data.category,
        buildingTier: data.building_tier,
        costRanges: {
          shell: {
            newMin: Number(data.shell_new_min),
            newTarget: Number(data.shell_new_target),
            newMax: Number(data.shell_new_max),
            remodelMin: Number(data.shell_existing_min),
            remodelTarget: Number(data.shell_existing_target),
            remodelMax: Number(data.shell_existing_max)
          },
          interior: {
            newMin: Number(data.interior_new_min),
            newTarget: Number(data.interior_new_target),
            newMax: Number(data.interior_new_max),
            remodelMin: Number(data.interior_existing_min),
            remodelTarget: Number(data.interior_existing_target),
            remodelMax: Number(data.interior_existing_max)
          },
          landscape: {
            newMin: Number(data.landscape_new_min),
            newTarget: Number(data.landscape_new_target),
            newMax: Number(data.landscape_new_max),
            remodelMin: Number(data.landscape_existing_min),
            remodelTarget: Number(data.landscape_existing_target),
            remodelMax: Number(data.landscape_existing_max)
          },
          pool: {
            newMin: Number(data.pool_new_min),
            newTarget: Number(data.pool_new_target),
            newMax: Number(data.pool_new_max),
            remodelMin: Number(data.pool_existing_min),
            remodelTarget: Number(data.pool_existing_target),
            remodelMax: Number(data.pool_existing_max)
          }
        },
        projectShares: {
          shellShare: Number(data.project_shell_share_pct) / 100, // Use percentage column
          interiorShare: Number(data.project_interior_share_pct) / 100,
          landscapeShare: Number(data.project_landscape_share_pct) / 100
        },
        designShares: {
          architectural: Number(data.architectural_design_share_pct) / 100,
          interior: Number(data.interior_design_share_pct) / 100,
          landscape: Number(data.landscape_design_share_pct) / 100,
          structural: Number(data.structural_design_share_pct) / 100,
          civil: Number(data.civil_design_share_pct) / 100,
          mechanical: Number(data.mechanical_design_share_pct) / 100,
          electrical: Number(data.electrical_design_share_pct) / 100,
          plumbing: Number(data.plumbing_design_share_pct) / 100,
          telecommunication: Number(data.telecommunication_design_share_pct) / 100
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
      const { data, error } = await supabase
        .from('calculation_constants')
        .select('key, value')
      
      if (error) throw error
      
      // Convert to key-value object
      const constants: Record<string, number> = {}
      data?.forEach(item => {
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
      const { data, error } = await supabase
        .from('category_multipliers')
        .select('multiplier')
        .eq('category', category)
        .single()
      
      if (error) throw error
      
      return Number(data?.multiplier || 1.0)
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

