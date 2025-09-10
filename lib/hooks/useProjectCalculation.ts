// lib/hooks/useProjectCalculation.ts - Correct state management architecture
import { useState, useEffect, useMemo, useCallback } from 'react'
import { calculateProject, DR_DE_JESUS_PROJECT } from '../calculations'
import { CalcInput, CalculationResults } from '../types'
import { constructionCostService } from '../db/construction-costs-client'

interface DatabaseDefaults {
  costRanges: {
    shell: { newMin: number; newTarget: number; newMax: number; remodelMin: number; remodelTarget: number; remodelMax: number }
    interior: { newMin: number; newTarget: number; newMax: number; remodelMin: number; remodelTarget: number; remodelMax: number }
    landscape: { newMin: number; newTarget: number; newMax: number; remodelMin: number; remodelTarget: number; remodelMax: number }
  }
  projectShares: {
    projectShellShare: number
    projectInteriorShare: number
    projectLandscapeShare: number
  }
  designShares: {
    structuralDesignShare: number
    civilDesignShare: number
    mechanicalDesignShare: number
    electricalDesignShare: number
    plumbingDesignShare: number
    telecomDesignShare: number
  }
}

interface ProjectOverrides {
  costs?: {
    newTargetPSF?: number
    remodelTargetPSF?: number
  }
  shares?: Partial<{
    projectShellShare: number
    projectInteriorShare: number
    projectLandscapeShare: number
  }>
  engineering?: Partial<{
    structuralDesignShare: number
    civilDesignShare: number
    mechanicalDesignShare: number
    electricalDesignShare: number
    plumbingDesignShare: number
    telecomDesignShare: number
  }>
  multipliers?: {
    historicMultiplier?: number
    remodelMultiplier?: number
  }
  areas?: {
    newAreaFt2?: number
    existingAreaFt2?: number
  }
}

export interface UseProjectCalculationReturn {
  // Current calculation inputs (defaults + overrides)
  projectData: CalcInput

  // Calculation results
  results: CalculationResults | null

  // Database defaults (read-only)
  databaseDefaults: DatabaseDefaults | null

  // Current overrides (live editable)
  overrides: ProjectOverrides

  // Update functions (only affect overrides, not database)
  updateCosts: (costs: Partial<CalcInput['costs']>) => void
  updateShares: (shares: Partial<CalcInput['shares']>) => void
  updateEngineering: (eng: Partial<CalcInput['engineering']>) => void
  updateMultipliers: (mult: Partial<CalcInput['multipliers']>) => void
  updateAreas: (areas: Partial<CalcInput['areas']>) => void

  // Reset functions
  resetToDefaults: () => void
  resetCosts: () => void
  resetShares: () => void
  resetEngineering: () => void

  // Project management
  saveProject: (name: string, clientData?: { name: string; email: string }) => Promise<string>
  loadProject: (id: string) => Promise<void>

  // Available ranges for sliders
  availableRanges: {
    newCost: { min: number; max: number; default: number }
    remodelCost: { min: number; max: number; default: number }
  } | null

  // Status
  loading: boolean
  error: string | null
  hasChanges: boolean
}

export function useProjectCalculation(
  initialClassification: CalcInput['classification'] = {
    buildingUse: 'Residential',
    buildingType: 'Custom Houses',
    buildingTier: 'High',
    category: 5,
    designLevel: 3
  }
): UseProjectCalculationReturn {

  const [databaseDefaults, setDatabaseDefaults] = useState<DatabaseDefaults | null>(null)
  const [overrides, setOverrides] = useState<ProjectOverrides>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load database defaults once (read-only, never changes)
  useEffect(() => {
    async function loadDefaults() {
      setLoading(true)
      setError(null)

      try {
        const costData = await constructionCostService.getCostData(
          initialClassification.buildingUse,
          initialClassification.buildingType,
          initialClassification.category,
          initialClassification.buildingTier
        )

        if (!costData) {
          console.log('📋 Using fallback defaults for project calculation')
          // Use fallback defaults from DR_DE_JESUS_PROJECT
          setDatabaseDefaults({
            costRanges: {
              shell: { newMin: 380, newTarget: 390, newMax: 400, remodelMin: 190, remodelTarget: 195, remodelMax: 200 },
              interior: { newMin: 50, newTarget: 60, newMax: 70, remodelMin: 25, remodelTarget: 30, remodelMax: 35 },
              landscape: { newMin: 15, newTarget: 20, newMax: 25, remodelMin: 8, remodelTarget: 10, remodelMax: 12 }
            },
            projectShares: {
              projectShellShare: 0.66,
              projectInteriorShare: 0.22,
              projectLandscapeShare: 0.12
            },
            designShares: {
              structuralDesignShare: 0.0858,
              civilDesignShare: 0.033,
              mechanicalDesignShare: 0.0396,
              electricalDesignShare: 0.0297,
              plumbingDesignShare: 0.0231,
              telecomDesignShare: 0.0099
            }
          })
        } else {
          console.log('🎯 Loaded database defaults for project calculation')
          setDatabaseDefaults({
            costRanges: costData.costRanges,
            projectShares: {
              projectShellShare: costData.projectShares.shellShare,
              projectInteriorShare: costData.projectShares.interiorShare,
              projectLandscapeShare: costData.projectShares.landscapeShare
            },
            designShares: {
              structuralDesignShare: costData.designShares.structural,
              civilDesignShare: costData.designShares.civil,
              mechanicalDesignShare: costData.designShares.mechanical,
              electricalDesignShare: costData.designShares.electrical,
              plumbingDesignShare: costData.designShares.plumbing,
              telecomDesignShare: (costData.designShares as any).telecommunication || 0.0099
            }
          })
        }

      } catch (err) {
        console.error('Error loading database defaults:', err)
        setError('Failed to load database defaults')
        // Still set fallback defaults so app can work
        setDatabaseDefaults({
          costRanges: {
            shell: { newMin: 380, newTarget: 390, newMax: 400, remodelMin: 190, remodelTarget: 195, remodelMax: 200 },
            interior: { newMin: 50, newTarget: 60, newMax: 70, remodelMin: 25, remodelTarget: 30, remodelMax: 35 },
            landscape: { newMin: 15, newTarget: 20, newMax: 25, remodelMin: 8, remodelTarget: 10, remodelMax: 12 }
          },
          projectShares: {
            projectShellShare: 0.66,
            projectInteriorShare: 0.22,
            projectLandscapeShare: 0.12
          },
          designShares: {
            structuralDesignShare: 0.0858,
            civilDesignShare: 0.033,
            mechanicalDesignShare: 0.0396,
            electricalDesignShare: 0.0297,
            plumbingDesignShare: 0.0231,
            telecomDesignShare: 0.0099
          }
        })
      } finally {
        setLoading(false)
      }
    }

    loadDefaults()
  }, []) // Only load ONCE - never reload database defaults

  // Merge database defaults with project overrides to create effective project data
  const projectData = useMemo<CalcInput>(() => {
    if (!databaseDefaults) {
      return DR_DE_JESUS_PROJECT // Fallback while loading
    }

    // Start with database defaults
    const baseData: CalcInput = {
      classification: initialClassification,
      areas: {
        newAreaFt2: overrides.areas?.newAreaFt2 ?? DR_DE_JESUS_PROJECT.areas.newAreaFt2,
        existingAreaFt2: overrides.areas?.existingAreaFt2 ?? DR_DE_JESUS_PROJECT.areas.existingAreaFt2
      },
      costs: {
        newTargetPSF: overrides.costs?.newTargetPSF ?? databaseDefaults.costRanges.shell.newTarget,
        remodelTargetPSF: overrides.costs?.remodelTargetPSF ?? databaseDefaults.costRanges.shell.remodelTarget
      },
      multipliers: {
        historicMultiplier: overrides.multipliers?.historicMultiplier ?? DR_DE_JESUS_PROJECT.multipliers.historicMultiplier,
        remodelMultiplier: overrides.multipliers?.remodelMultiplier ?? DR_DE_JESUS_PROJECT.multipliers.remodelMultiplier
      },
      shares: {
        projectShellShare: overrides.shares?.projectShellShare ?? databaseDefaults.projectShares.projectShellShare,
        projectInteriorShare: overrides.shares?.projectInteriorShare ?? databaseDefaults.projectShares.projectInteriorShare,
        projectLandscapeShare: overrides.shares?.projectLandscapeShare ?? databaseDefaults.projectShares.projectLandscapeShare
      },
      engineering: {
        structuralDesignShare: overrides.engineering?.structuralDesignShare ?? databaseDefaults.designShares.structuralDesignShare,
        civilDesignShare: overrides.engineering?.civilDesignShare ?? databaseDefaults.designShares.civilDesignShare,
        mechanicalDesignShare: overrides.engineering?.mechanicalDesignShare ?? databaseDefaults.designShares.mechanicalDesignShare,
        electricalDesignShare: overrides.engineering?.electricalDesignShare ?? databaseDefaults.designShares.electricalDesignShare,
        plumbingDesignShare: overrides.engineering?.plumbingDesignShare ?? databaseDefaults.designShares.plumbingDesignShare,
        telecomDesignShare: overrides.engineering?.telecomDesignShare ?? databaseDefaults.designShares.telecomDesignShare
      }
    }

    return baseData
  }, [databaseDefaults, overrides, initialClassification])

  // Calculate results when project data changes
  const results = useMemo<CalculationResults | null>(() => {
    try {
      return calculateProject(projectData)
    } catch (err) {
      console.error('Calculation error:', err)
      return null
    }
  }, [projectData])

  // Update functions - ONLY modify overrides, never database
  const updateCosts = useCallback((costs: Partial<CalcInput['costs']>) => {
    setOverrides(prev => ({
      ...prev,
      costs: { ...prev.costs, ...costs }
    }))
  }, [])

  const updateShares = useCallback((shares: Partial<CalcInput['shares']>) => {
    setOverrides(prev => ({
      ...prev,
      shares: { ...prev.shares, ...shares }
    }))
  }, [])

  const updateEngineering = useCallback((engineering: Partial<CalcInput['engineering']>) => {
    setOverrides(prev => ({
      ...prev,
      engineering: { ...prev.engineering, ...engineering }
    }))
  }, [])

  const updateMultipliers = useCallback((multipliers: Partial<CalcInput['multipliers']>) => {
    setOverrides(prev => ({
      ...prev,
      multipliers: { ...prev.multipliers, ...multipliers }
    }))
  }, [])

  const updateAreas = useCallback((areas: Partial<CalcInput['areas']>) => {
    setOverrides(prev => ({
      ...prev,
      areas: { ...prev.areas, ...areas }
    }))
  }, [])

  // Reset functions - Remove overrides to return to database defaults
  const resetToDefaults = useCallback(() => {
    setOverrides({})
  }, [])

  const resetCosts = useCallback(() => {
    setOverrides(prev => ({
      ...prev,
      costs: undefined
    }))
  }, [])

  const resetShares = useCallback(() => {
    setOverrides(prev => ({
      ...prev,
      shares: undefined
    }))
  }, [])

  const resetEngineering = useCallback(() => {
    setOverrides(prev => ({
      ...prev,
      engineering: undefined
    }))
  }, [])

  // Project management - Save to separate projects table
  const saveProject = useCallback(async (name: string, clientData?: { name: string; email: string }): Promise<string> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          projectData,
          clientData,
          overrides,
          databaseDefaults
        })
      })

      if (!response.ok) throw new Error('Failed to save project')

      const result = await response.json()
      return result.data.id
    } catch (err) {
      console.error('Error saving project:', err)
      throw err
    }
  }, [projectData, overrides, databaseDefaults])

  const loadProject = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)

      if (!response.ok) throw new Error('Failed to load project')

      const result = await response.json()
      const { overrides: savedOverrides } = result.data

      setOverrides(savedOverrides || {})
    } catch (err) {
      console.error('Error loading project:', err)
      throw err
    }
  }, [])

  // Check if user has made changes from database defaults
  const hasChanges = useMemo(() => {
    return Object.keys(overrides).length > 0 &&
           Object.values(overrides).some(value =>
             value !== undefined &&
             (typeof value === 'object' ? Object.keys(value).length > 0 : true)
           )
  }, [overrides])

  // Available cost ranges for sliders (from database defaults)
  const availableRanges = useMemo(() => {
    if (!databaseDefaults) return null

    return {
      newCost: {
        min: databaseDefaults.costRanges.shell.newMin,
        max: databaseDefaults.costRanges.shell.newMax,
        default: databaseDefaults.costRanges.shell.newTarget
      },
      remodelCost: {
        min: databaseDefaults.costRanges.shell.remodelMin,
        max: databaseDefaults.costRanges.shell.remodelMax,
        default: databaseDefaults.costRanges.shell.remodelTarget
      }
    }
  }, [databaseDefaults])

  return {
    projectData,
    results,
    databaseDefaults,
    overrides,
    updateCosts,
    updateShares,
    updateEngineering,
    updateMultipliers,
    updateAreas,
    resetToDefaults,
    resetCosts,
    resetShares,
    resetEngineering,
    saveProject,
    loadProject,
    loading,
    error,
    hasChanges,
    availableRanges
  } as UseProjectCalculationReturn
}