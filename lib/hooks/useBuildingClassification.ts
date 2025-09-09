import { useState, useEffect, useRef, useCallback } from "react";
import {
  constructionCostService,
  type ConstructionCostData,
} from "../db/construction-costs";

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

  // Use refs to track the current values without causing re-renders
  const buildingUseRef = useRef(state.buildingUse)
  const buildingTypeRef = useRef(state.buildingType)
  const buildingTierRef = useRef(state.buildingTier)
  const categoryRef = useRef(state.category)

  // Update refs when state changes
  useEffect(() => {
    buildingUseRef.current = state.buildingUse
    buildingTypeRef.current = state.buildingType
    buildingTierRef.current = state.buildingTier
    categoryRef.current = state.category
  }, [state.buildingUse, state.buildingType, state.buildingTier, state.category])

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
    const currentBuildingUse = buildingUseRef.current
    
    async function loadBuildingTypes() {
      if (!currentBuildingUse) return
      
      try {
        const types = await constructionCostService.getBuildingTypes(currentBuildingUse)
        setState(prev => {
          // Only update if this effect is still relevant
          if (buildingUseRef.current !== currentBuildingUse) return prev
          
          return { 
            ...prev, 
            buildingTypes: types,
            // Reset building type if not in new list
            buildingType: types.includes(prev.buildingType) ? prev.buildingType : types[0] || ''
          }
        })
      } catch (error) {
        console.error('Error loading building types:', error)
      }
    }
    loadBuildingTypes()
  }, [state.buildingUse])

  // Load tiers and categories when building type changes
  useEffect(() => {
    const currentBuildingUse = buildingUseRef.current
    const currentBuildingType = buildingTypeRef.current
    
    async function loadTiersAndCategories() {
      if (!currentBuildingUse || !currentBuildingType) return
      
      try {
        const [tiers, categories] = await Promise.all([
          constructionCostService.getBuildingTiers(currentBuildingUse, currentBuildingType),
          constructionCostService.getCategories(currentBuildingUse, currentBuildingType)
        ])
        
        setState(prev => {
          // Only update if this effect is still relevant
          if (buildingUseRef.current !== currentBuildingUse || 
              buildingTypeRef.current !== currentBuildingType) return prev
          
          return { 
            ...prev, 
            buildingTiers: tiers,
            categories: categories,
            // Reset tier if not in new list
            buildingTier: tiers.includes(prev.buildingTier) ? prev.buildingTier : tiers[0] || '',
            // Reset category if not in new list
            category: categories.includes(prev.category) ? prev.category : categories[0] || 1
          }
        })
      } catch (error) {
        console.error('Error loading tiers and categories:', error)
      }
    }
    loadTiersAndCategories()
  }, [state.buildingUse, state.buildingType])

  // Load cost data when all selections are made
  useEffect(() => {
    const currentBuildingUse = buildingUseRef.current
    const currentBuildingType = buildingTypeRef.current
    const currentBuildingTier = buildingTierRef.current
    const currentCategory = categoryRef.current
    
    async function loadCostData() {
      if (!currentBuildingUse || !currentBuildingType || !currentBuildingTier || !currentCategory) {
        setState(prev => ({ ...prev, costData: null, loading: false }))
        return
      }
      
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const costData = await constructionCostService.getCostData(
          currentBuildingUse,
          currentBuildingType,
          currentCategory,
          currentBuildingTier
        )
        
        setState(prev => {
          // Only update if this effect is still relevant
          if (buildingUseRef.current !== currentBuildingUse || 
              buildingTypeRef.current !== currentBuildingType ||
              buildingTierRef.current !== currentBuildingTier ||
              categoryRef.current !== currentCategory) return prev
          
          return { 
            ...prev, 
            costData,
            loading: false,
            error: costData ? null : 'No cost data found for this combination'
          }
        })
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

  // Calculate multiplier based on category
  const getCategoryMultiplier = () => {
    if (!state.category) return 1
    
    // Category multipliers (from constants)
    const multipliers: Record<number, number> = {
      1: 1.0,  // Simple
      2: 1.1,  // Standard
      3: 1.2,  // Medium
      4: 1.3,  // High
      5: 1.4,  // Very High
    }
    
    return multipliers[state.category] || 1
  }

  // Get current construction costs
  const getConstructionCosts = () => {
    if (!state.costData) return null
    
    const multiplier = getCategoryMultiplier()
    
    return {
      shell: {
        newMin: state.costData.costRanges.shell.newMin * multiplier,
        newTarget: state.costData.costRanges.shell.newTarget * multiplier,
        newMax: state.costData.costRanges.shell.newMax * multiplier,
        remodelMin: state.costData.costRanges.shell.remodelMin * multiplier,
        remodelTarget: state.costData.costRanges.shell.remodelTarget * multiplier,
        remodelMax: state.costData.costRanges.shell.remodelMax * multiplier,
      },
      interior: {
        newMin: state.costData.costRanges.interior.newMin * multiplier,
        newTarget: state.costData.costRanges.interior.newTarget * multiplier,
        newMax: state.costData.costRanges.interior.newMax * multiplier,
        remodelMin: state.costData.costRanges.interior.remodelMin * multiplier,
        remodelTarget: state.costData.costRanges.interior.remodelTarget * multiplier,
        remodelMax: state.costData.costRanges.interior.remodelMax * multiplier,
      },
      outdoor: state.costData.costRanges.landscape ? {
        newMin: state.costData.costRanges.landscape.newMin * multiplier,
        newTarget: state.costData.costRanges.landscape.newTarget * multiplier,
        newMax: state.costData.costRanges.landscape.newMax * multiplier,
        remodelMin: state.costData.costRanges.landscape.remodelMin * multiplier,
        remodelTarget: state.costData.costRanges.landscape.remodelTarget * multiplier,
        remodelMax: state.costData.costRanges.landscape.remodelMax * multiplier,
      } : null,
      pool: state.costData.costRanges.pool ? {
        newMin: state.costData.costRanges.pool.newMin * multiplier,
        newTarget: state.costData.costRanges.pool.newTarget * multiplier,
        newMax: state.costData.costRanges.pool.newMax * multiplier,
        remodelMin: state.costData.costRanges.pool.remodelMin * multiplier,
        remodelTarget: state.costData.costRanges.pool.remodelTarget * multiplier,
        remodelMax: state.costData.costRanges.pool.remodelMax * multiplier,
      } : null
    }
  }

  // Get cost ranges for sliders (simplified shell costs)
  const getCostRanges = () => {
    if (!state.costData) {
      return {
        newMin: 0,
        newTarget: 0,
        newMax: 0,
        remodelMin: 0,
        remodelTarget: 0,
        remodelMax: 0
      }
    }
    
    const multiplier = getCategoryMultiplier()
    
    return {
      newMin: state.costData.costRanges.shell.newMin * multiplier,
      newTarget: state.costData.costRanges.shell.newTarget * multiplier,
      newMax: state.costData.costRanges.shell.newMax * multiplier,
      remodelMin: state.costData.costRanges.shell.remodelMin * multiplier,
      remodelTarget: state.costData.costRanges.shell.remodelTarget * multiplier,
      remodelMax: state.costData.costRanges.shell.remodelMax * multiplier
    }
  }

  // Get project shares
  const getProjectShares = () => {
    if (!state.costData) {
      return {
        shell: 0.45,
        interior: 0.35,
        landscape: 0.20,
        pool: 0,
        // Also include the required properties for BudgetShares
        projectShellShare: 0.45,
        projectInteriorShare: 0.35,
        projectLandscapeShare: 0.20
      }
    }
    
    return {
      shell: state.costData.projectShares.shellShare,
      interior: state.costData.projectShares.interiorShare,
      landscape: state.costData.projectShares.landscapeShare,
      pool: 0, // Not in the data
      // Also include the required properties for BudgetShares
      projectShellShare: state.costData.projectShares.shellShare,
      projectInteriorShare: state.costData.projectShares.interiorShare,
      projectLandscapeShare: state.costData.projectShares.landscapeShare
    }
  }

  // Get design shares
  const getDesignShares = () => {
    if (!state.costData) {
      return {
        architectural: 0.30,
        interior: 0.15,
        landscape: 0.05,
        structural: 0.15,
        civil: 0.10,
        mechanical: 0.10,
        electrical: 0.08,
        plumbing: 0.05,
        telecommunications: 0.02
      }
    }
    
    return {
      architectural: state.costData.designShares.architectural,
      interior: state.costData.designShares.interior,
      landscape: state.costData.designShares.landscape,
      structural: state.costData.designShares.structural,
      civil: state.costData.designShares.civil,
      mechanical: state.costData.designShares.mechanical,
      electrical: state.costData.designShares.electrical,
      plumbing: state.costData.designShares.plumbing,
      telecommunications: state.costData.designShares.telecommunication || 0.02
    }
  }

  return {
    ...state,
    setBuildingUse,
    setBuildingType,
    setBuildingTier,
    setCategory,
    getCategoryMultiplier,
    getConstructionCosts,
    getCostRanges,
    getProjectShares,
    getDesignShares
  }
}