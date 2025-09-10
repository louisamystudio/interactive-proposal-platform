'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Building2, Layers, Target, AlertCircle } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface ProjectSetupFormProps {
  onConfigChange: (config: any) => void
  loading?: boolean
}

interface BuildingOption {
  use: string
  types: string[]
}

// Fallback building options when database is unavailable
const fallbackBuildingOptions: BuildingOption[] = [
  { use: 'Residential', types: ['Custom Houses', 'Standard Houses', 'Apartments'] },
  { use: 'Commercial', types: ['Office Buildings', 'Retail Spaces'] },
  { use: 'Hospitality', types: ['Hotels', 'Restaurants'] },
  { use: 'Healthcare', types: ['Medical Offices', 'Hospitals'] },
  { use: 'Education', types: ['Schools'] },
  { use: 'Industrial', types: ['Warehouses'] },
  { use: 'Mixed Use', types: ['Residential/Commercial'] }
]

const tierLabels: Record<number, string> = {
  1: 'Basic - Essential design documentation',
  2: 'Standard - Comprehensive design package',
  3: 'Full - Complete architectural service'
}

export function ProjectSetupForm({ onConfigChange, loading = false }: ProjectSetupFormProps) {
  const [buildingUse, setBuildingUse] = useState<string>('Residential')
  const [buildingType, setBuildingType] = useState<string>('Custom Houses')
  const [designTier, setDesignTier] = useState<number>(3)
  const [buildingOptions, setBuildingOptions] = useState<BuildingOption[]>(fallbackBuildingOptions)
  const [availableTypes, setAvailableTypes] = useState<string[]>(['Custom Houses', 'Standard Houses', 'Apartments'])
  const [fetchingConfig, setFetchingConfig] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)

  // Debounce the configuration fetch
  const debouncedUse = useDebounce(buildingUse, 300)
  const debouncedType = useDebounce(buildingType, 300)
  const debouncedTier = useDebounce(designTier, 300)

  // Fetch available building uses and types on mount
  useEffect(() => {
    async function fetchBuildingOptions() {
      try {
        const response = await fetch('/api/building-options')
        if (response.ok) {
          const data = await response.json()
          setBuildingOptions(data.options || fallbackBuildingOptions)
          setUsingFallback(false)
        } else {
          setUsingFallback(true)
        }
      } catch (error) {
        console.warn('Could not fetch building options, using fallback:', error)
        setUsingFallback(true)
      }
    }
    fetchBuildingOptions()
  }, [])

  // Update available types when building use changes
  useEffect(() => {
    const option = buildingOptions.find(opt => opt.use === buildingUse)
    if (option) {
      setAvailableTypes(option.types)
      // Reset building type if current type is not in new list
      if (!option.types.includes(buildingType)) {
        setBuildingType(option.types[0])
      }
    }
  }, [buildingUse, buildingOptions, buildingType])

  // Fetch cost configuration when selections change
  useEffect(() => {
    if (debouncedUse && debouncedType && debouncedTier) {
      fetchCostConfig()
    }
  }, [debouncedUse, debouncedType, debouncedTier])

  async function fetchCostConfig() {
    setFetchingConfig(true)
    try {
      const params = new URLSearchParams({
        use: debouncedUse,
        type: debouncedType,
        tier: debouncedTier.toString()
      })
      
      const response = await fetch(`/api/cost-config?${params}`)
      if (response.ok) {
        const config = await response.json()
        onConfigChange(config)
        setUsingFallback(false)
      } else {
        console.error('Failed to fetch cost config')
        setUsingFallback(true)
      }
    } catch (error) {
      console.error('Error fetching cost config:', error)
      setUsingFallback(true)
    } finally {
      setFetchingConfig(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Project Definition
        </CardTitle>
        <CardDescription>
          Select your building classification to load cost data from the Puerto Rico construction database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Building Use */}
          <div className="space-y-2">
            <Label htmlFor="building-use" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Building Use
            </Label>
            <Select value={buildingUse} onValueChange={setBuildingUse} disabled={loading}>
              <SelectTrigger id="building-use">
                <SelectValue placeholder="Select building use" />
              </SelectTrigger>
              <SelectContent>
                {buildingOptions.map(option => (
                  <SelectItem key={option.use} value={option.use}>
                    {option.use}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Building Type */}
          <div className="space-y-2">
            <Label htmlFor="building-type" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Building Type
            </Label>
            <Select value={buildingType} onValueChange={setBuildingType} disabled={loading}>
              <SelectTrigger id="building-type">
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Design Tier */}
          <div className="space-y-2">
            <Label htmlFor="design-tier" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Design Tier / Level of Detail
            </Label>
            <Select value={designTier.toString()} onValueChange={(v) => setDesignTier(parseInt(v))} disabled={loading}>
              <SelectTrigger id="design-tier">
                <SelectValue placeholder="Select design tier" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map(tier => (
                  <SelectItem key={tier} value={tier.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">Tier {tier}</span>
                      <span className="text-xs text-muted-foreground">
                        {tierLabels[tier]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Important:</strong> The <strong>construction budget</strong> shown represents the{' '}
              <strong>minimum cost to build</strong> based on the Puerto Rico construction cost database.{' '}
              <strong>Design fees</strong> are calculated separately and are not included in the construction budget.
            </p>
          </div>

          {/* Fallback Warning */}
          {usingFallback && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-900">
                Using safe default values. Database connection unavailable.
              </p>
            </div>
          )}

          {/* Loading State */}
          {fetchingConfig && (
            <div className="text-sm text-muted-foreground text-center py-2">
              Loading cost configuration...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}