import { useState, useEffect } from 'react'
import { constructionCostService, ConstructionCostData } from '../db/construction-costs'

export interface BuildingClassificationState {
  // Current selections
  buildingUse: string
  buildingType: string
  buildingTier: string
  category: number
  
  // Available options
  buildingUses: string[]
  buildingTypes: string[]
  buildingTiers: string[]
  categories: number[]
  
  // Cost data from database
  costData: ConstructionCostData | null
  
  // Loading states
  loading: boolean
  error: string | null
}

export function useBuildingClassification(defaultValues?: Partial<BuildingClassificationState>) {
  const [state, setState] = useState<BuildingClassificationState>({
    buildingUse: defaultValues?.buildingUse || 'Residential',
    buildingType: defaultValues?.buildingType || 'Custom Houses',
    buildingTier: defaultValues?.buildingTier || 'High',
    category: defaultValues?.category || 5,
    buildingUses: [],
    buildingTypes: [],
    buildingTiers: [],
    categories: [],
    costData: null,
    loading: true,
    error: null
  })

  // Load building uses on mount
  useEffect(() => {
    async function loadBuildingUses() {
      try {
        const uses = await constructionCostService.getBuildingUses()
        setState(prev => ({ ...prev, buildingUses: uses }))
      } catch (error) {
        console.error('Error loading building uses:', error)
        setState(prev => ({ ...prev, error: 'Failed to load building uses' }))
      }
    }
    loadBuildingUses()
  }, [])

  // Load building types when building use changes
  useEffect(() => {
    async function loadBuildingTypes() {
      if (!state.buildingUse) return
      
      try {
        const types = await constructionCostService.getBuildingTypes(state.buildingUse)
        setState(prev => ({ 
          ...prev, 
          buildingTypes: types,
          // Reset building type if not in new list
          buildingType: types.includes(prev.buildingType) ? prev.buildingType : types[0] || ''
        }))
      } catch (error) {
        console.error('Error loading building types:', error)
      }
    }
    loadBuildingTypes()
  }, [state.buildingUse])

  // Load tiers and categories when building type changes
  useEffect(() => {
    async function loadTiersAndCategories() {
      if (!state.buildingUse || !state.buildingType) return
      
      try {
        const [tiers, categories] = await Promise.all([
          constructionCostService.getBuildingTiers(state.buildingUse, state.buildingType),
          constructionCostService.getCategories(state.buildingUse, state.buildingType)
        ])
        
        setState(prev => ({ 
          ...prev, 
          buildingTiers: tiers,
          categories: categories,
          // Reset tier if not in new list
          buildingTier: tiers.includes(prev.buildingTier) ? prev.buildingTier : tiers[0] || '',
          // Reset category if not in new list
          category: categories.includes(prev.category) ? prev.category : categories[0] || 1
        }))
      } catch (error) {
        console.error('Error loading tiers and categories:', error)
      }
    }
    loadTiersAndCategories()
  }, [state.buildingUse, state.buildingType])

  // Load cost data when all selections are made
  useEffect(() => {
    async function loadCostData() {
      if (!state.buildingUse || !state.buildingType || !state.buildingTier || !state.category) {
        setState(prev => ({ ...prev, costData: null, loading: false }))
        return
      }
      
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const costData = await constructionCostService.getCostData(
          state.buildingUse,
          state.buildingType,
          state.category,
          state.buildingTier
        )
        
        setState(prev => ({ 
          ...prev, 
          costData,
          loading: false,
          error: costData ? null : 'No cost data found for this combination'
        }))
      } catch (error) {
        console.error('Error loading cost data:', error)
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to load cost data',
          loading: false 
        }))
      }
    }
    loadCostData()
  }, [state.buildingUse, state.buildingType, state.buildingTier, state.category])

  // Update functions
  const setBuildingUse = (buildingUse: string) => {
    setState(prev => ({ ...prev, buildingUse }))
  }

  const setBuildingType = (buildingType: string) => {
    setState(prev => ({ ...prev, buildingType }))
  }

  const setBuildingTier = (buildingTier: string) => {
    setState(prev => ({ ...prev, buildingTier }))
  }

  const setCategory = (category: number) => {
    setState(prev => ({ ...prev, category }))
  }

  // Get cost ranges based on current selection
  const getCostRanges = () => {
    if (!state.costData) {
      // Return defaults if no data
      return {
        newMin: 380,
        newTarget: 390,
        newMax: 400,
        remodelMin: 190,
        remodelTarget: 195,
        remodelMax: 200
      }
    }

    // Return shell costs (primary construction costs)
    return {
      newMin: state.costData.costRanges.shell.newMin,
      newTarget: state.costData.costRanges.shell.newTarget,
      newMax: state.costData.costRanges.shell.newMax,
      remodelMin: state.costData.costRanges.shell.remodelMin,
      remodelTarget: state.costData.costRanges.shell.remodelTarget,
      remodelMax: state.costData.costRanges.shell.remodelMax
    }
  }

  // Get project shares
  const getProjectShares = () => {
    if (!state.costData) {
      // Return defaults
      return {
        projectShellShare: 0.66,
        projectInteriorShare: 0.22,
        projectLandscapeShare: 0.12
      }
    }

    return {
      projectShellShare: state.costData.projectShares.shellShare,
      projectInteriorShare: state.costData.projectShares.interiorShare,
      projectLandscapeShare: state.costData.projectShares.landscapeShare
    }
  }

  // Get design shares
  const getDesignShares = () => {
    if (!state.costData) {
      // Return defaults
      return {
        structuralDesignShare: 0.0858,
        civilDesignShare: 0.033,
        mechanicalDesignShare: 0.0396,
        electricalDesignShare: 0.0297,
        plumbingDesignShare: 0.0231,
        telecomDesignShare: 0.0099
      }
    }

    return {
      structuralDesignShare: state.costData.designShares.structural,
      civilDesignShare: state.costData.designShares.civil,
      mechanicalDesignShare: state.costData.designShares.mechanical,
      electricalDesignShare: state.costData.designShares.electrical,
      plumbingDesignShare: state.costData.designShares.plumbing,
      telecomDesignShare: state.costData.designShares.telecommunication
    }
  }

  return {
    // State
    ...state,
    
    // Setters
    setBuildingUse,
    setBuildingType,
    setBuildingTier,
    setCategory,
    
    // Getters
    getCostRanges,
    getProjectShares,
    getDesignShares
  }
}
