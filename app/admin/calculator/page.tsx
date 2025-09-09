'use client'

import { useState, useEffect } from 'react'
import { calculateProject, DR_DE_JESUS_PROJECT } from '@/lib/calculations'
import { CalculationResults, CalcInput } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Calculator, Building2, DollarSign, Clock, PieChart, BarChart3 } from 'lucide-react'

export default function AdminCalculatorPage() {
  const [projectData, setProjectData] = useState<CalcInput>(DR_DE_JESUS_PROJECT)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [loading, setLoading] = useState(false)

  // Real-time calculation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const calculatedResults = calculateProject(projectData)
        setResults(calculatedResults)
        setLoading(false)
      } catch (error) {
        console.error('Calculation error:', error)
        setLoading(false)
      }
    }, 300) // 300ms debouncing

    return () => clearTimeout(timer)
  }, [projectData])

  const updateProjectData = (updates: Partial<CalcInput>) => {
    setProjectData(prev => ({ ...prev, ...updates }))
    setLoading(true)
  }

  const updateAreas = (updates: Partial<CalcInput['areas']>) => {
    setProjectData(prev => ({
      ...prev,
      areas: { ...prev.areas, ...updates }
    }))
    setLoading(true)
  }

  const updateCosts = (updates: Partial<CalcInput['costs']>) => {
    setProjectData(prev => ({
      ...prev,
      costs: { ...prev.costs, ...updates }
    }))
    setLoading(true)
  }

  const updateShares = (updates: Partial<CalcInput['shares']>) => {
    setProjectData(prev => ({
      ...prev,
      shares: { ...prev.shares, ...updates }
    }))
    setLoading(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Louis Amy AE Studio - Proposal Calculator
              </h1>
              <p className="text-gray-600">
                Generate accurate proposals with Chris Do value-based pricing
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Project Classification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project Classification
                </CardTitle>
                <CardDescription>
                  Building type and complexity parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Building Use</label>
                  <Select
                    value={projectData.classification.buildingUse}
                    onValueChange={(value: any) =>
                      updateProjectData({
                        classification: { ...projectData.classification, buildingUse: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Building Type</label>
                  <Input
                    value={projectData.classification.buildingType}
                    onChange={(e) =>
                      updateProjectData({
                        classification: { ...projectData.classification, buildingType: e.target.value }
                      })
                    }
                    placeholder="e.g., Custom Houses"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category (1-5)</label>
                  <Select
                    value={projectData.classification.category.toString()}
                    onValueChange={(value) =>
                      updateProjectData({
                        classification: { ...projectData.classification, category: parseInt(value) as 1|2|3|4|5 }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Simple</SelectItem>
                      <SelectItem value="2">2 - Standard</SelectItem>
                      <SelectItem value="3">3 - Medium</SelectItem>
                      <SelectItem value="4">4 - High</SelectItem>
                      <SelectItem value="5">5 - Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Areas (sq ft)</CardTitle>
                <CardDescription>
                  New construction and existing remodel areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">New Construction</label>
                  <Input
                    type="number"
                    value={projectData.areas.newAreaFt2}
                    onChange={(e) => updateAreas({ newAreaFt2: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Existing Remodel</label>
                  <Input
                    type="number"
                    value={projectData.areas.existingAreaFt2}
                    onChange={(e) => updateAreas({ existingAreaFt2: parseFloat(e.target.value) || 0 })}
                    placeholder="4407"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cost per Square Foot */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost per Square Foot
                </CardTitle>
                <CardDescription>
                  Adjust construction costs within market ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    New Construction: ${projectData.costs.newTargetPSF}/ft²
                  </label>
                  <Slider
                    value={[projectData.costs.newTargetPSF]}
                    onValueChange={([value]) => updateCosts({ newTargetPSF: value })}
                    min={200}
                    max={600}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$200</span>
                    <span>$600</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Remodel: ${projectData.costs.remodelTargetPSF}/ft²
                  </label>
                  <Slider
                    value={[projectData.costs.remodelTargetPSF]}
                    onValueChange={([value]) => updateCosts({ remodelTargetPSF: value })}
                    min={100}
                    max={300}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$100</span>
                    <span>$300</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Budget Allocation
                </CardTitle>
                <CardDescription>
                  Distribution between shell, interior, and landscape
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Shell: {Math.round(projectData.shares.projectShellShare * 100)}%
                  </label>
                  <Slider
                    value={[projectData.shares.projectShellShare]}
                    onValueChange={([value]) => updateShares({ projectShellShare: value })}
                    min={0.5}
                    max={0.8}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Interior: {Math.round(projectData.shares.projectInteriorShare * 100)}%
                  </label>
                  <Slider
                    value={[projectData.shares.projectInteriorShare]}
                    onValueChange={([value]) => updateShares({ projectInteriorShare: value })}
                    min={0.1}
                    max={0.4}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Landscape: {Math.round(projectData.shares.projectLandscapeShare * 100)}%
                  </label>
                  <Slider
                    value={[projectData.shares.projectLandscapeShare]}
                    onValueChange={([value]) => updateShares({ projectLandscapeShare: value })}
                    min={0.05}
                    max={0.2}
                    step={0.01}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Summary Cards */}
            {results && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Budget</CardDescription>
                      <CardTitle className="text-2xl">
                        ${results.budgets.totalBudget.toLocaleString()}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Contract Price</CardDescription>
                      <CardTitle className="text-2xl text-green-600">
                        ${results.fees.contractPrice.toLocaleString()}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Hours</CardDescription>
                      <CardTitle className="text-2xl">
                        {results.hours.totalHours.toFixed(0)}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Category</CardDescription>
                      <CardTitle className="text-2xl">
                        {projectData.classification.category}/5
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                {/* Budget Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Breakdown</CardTitle>
                    <CardDescription>
                      Construction costs distributed by discipline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Shell & Structure</span>
                        <span className="text-lg font-semibold">${results.budgets.shellBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Interior Finishes</span>
                        <span>${results.budgets.interiorBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Landscape</span>
                        <span>${results.budgets.landscapeBudget.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Engineering Disciplines */}
                <Card>
                  <CardHeader>
                    <CardTitle>Engineering Disciplines</CardTitle>
                    <CardDescription>
                      Architecture and engineering allocation within shell budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Architecture</span>
                        <span className="font-semibold">${results.disciplines.architectureBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Structural</span>
                        <span>${results.disciplines.structuralBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Mechanical</span>
                        <span>${results.disciplines.mechanicalBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Electrical</span>
                        <span>${results.disciplines.electricalBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Plumbing</span>
                        <span>${results.disciplines.plumbingBudget.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Options (Value-Messaged)</CardTitle>
                    <CardDescription>
                      Strategic pricing options for client presentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(results.options).map(([key, option]) => (
                        <div
                          key={key}
                          className={`border rounded-lg p-4 ${
                            key === 'A' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {key === 'A' && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Recommended
                              </span>
                            )}
                            <h4 className="font-semibold">Option {key}</h4>
                          </div>

                          <div className="text-2xl font-bold mb-3">
                            ${option.investment.toLocaleString()}
                          </div>

                          <p className="text-sm text-gray-600 mb-3 italic">
                            "{option.valuePromise}"
                          </p>

                          <div className="text-xs text-gray-500">
                            <div className="font-medium mb-1">What's Included:</div>
                            <ul className="space-y-1">
                              {option.scope.slice(0, 3).map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))}
                              {option.scope.length > 3 && (
                                <li className="text-gray-400">• +{option.scope.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Client Proposal</CardTitle>
                    <CardDescription>
                      Create personalized proposal link for client review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="flex-1" size="lg">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Proposal Link
                      </Button>
                      <Button variant="outline" size="lg">
                        Preview Client View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Loading State */}
            {loading && (
              <Card>
                <CardContent className="py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3">Calculating...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Initial State */}
            {!results && !loading && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-gray-600">
                    Adjust the parameters on the left to see real-time calculations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
