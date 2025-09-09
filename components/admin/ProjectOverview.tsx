'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, MapPin, DollarSign, BarChart, Square, Ruler, Home } from 'lucide-react'

interface ProjectOverviewProps {
  projectData: {
    buildingUse: string
    buildingType: string
    buildingTier: string
    category: number
    designLevel: number
    areas: {
      newAreaFt2: number
      existingAreaFt2: number
      siteAreaM2: number
    }
  }
  budgets: {
    totalBudget: number
    newBudget: number
    remodelBudget: number
  }
  costs: {
    newTargetPSF: number
    remodelTargetPSF: number
  }
}

export function ProjectOverview({ projectData, budgets, costs }: ProjectOverviewProps) {
  const totalArea = projectData.areas.newAreaFt2 + projectData.areas.existingAreaFt2
  const newPercentage = totalArea > 0 ? (projectData.areas.newAreaFt2 / totalArea * 100).toFixed(0) : '0'
  const remodelPercentage = totalArea > 0 ? (projectData.areas.existingAreaFt2 / totalArea * 100).toFixed(0) : '0'
  const effectivePSF = totalArea > 0 ? budgets.totalBudget / totalArea : 0
  
  const getCategoryLabel = (category: number) => {
    const categories = ['', 'Very Simple', 'Simple', 'Average', 'Complex', 'Very Complex']
    return categories[category] || 'Unknown'
  }

  const getDesignLevelLabel = (level: number) => {
    const levels = ['', 'Basic', 'Standard', 'Premium', 'Luxury', 'Ultra-Luxury']
    return levels[level] || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl">Project Overview</CardTitle>
          <CardDescription className="text-base">
            <span className="font-medium">{projectData.buildingUse}</span> • 
            <span className="font-medium"> {projectData.buildingType}</span> • 
            <span className="font-medium"> {projectData.buildingTier} Tier</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-gray-600">Category</div>
                <div className="font-semibold">{getCategoryLabel(projectData.category)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-gray-600">Design Level</div>
                <div className="font-semibold">{getDesignLevelLabel(projectData.designLevel)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-gray-600">Total Area</div>
                <div className="font-semibold">{totalArea.toLocaleString()} ft²</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-gray-600">Site Area</div>
                <div className="font-semibold">{(projectData.areas.siteAreaM2 || 972).toLocaleString()} m²</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Important:</span> The budget shown represents the{' '}
              <span className="font-semibold text-blue-700">minimum construction cost estimate</span>{' '}
              based on the Puerto Rico building cost database. Design fees are calculated separately 
              and are not included in the construction budget.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">TOTAL BUDGET</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${budgets.totalBudget.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              {remodelPercentage}% Remodel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">BUILDING AREA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalArea.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              sq ft existing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">SITE AREA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(projectData.areas.siteAreaM2 || 972).toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              m² total site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">COST PER SQ FT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${effectivePSF.toFixed(0)}</div>
            <p className="text-xs text-gray-500 mt-1">
              remodel target
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}