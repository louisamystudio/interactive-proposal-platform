'use client'

import { useState } from 'react'
import { useProjectCalculation } from '@/lib/hooks/useProjectCalculation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Calculator, Building2, DollarSign, PieChart, Send, Copy, ExternalLink, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react'
import { BudgetDonutChart } from '@/components/ui/budget-donut-chart'
import { DisciplineChart } from '@/components/ui/discipline-chart'

export default function AdminCalculatorPageNew() {
  const [clientName, setClientName] = useState('Dr. Luis De Jesús')
  const [clientEmail, setClientEmail] = useState('')
  const [proposalUrl, setProposalUrl] = useState('')
  const [generating, setGenerating] = useState(false)

  // Use new project calculation hook (eliminates infinite loops)
  const project = useProjectCalculation({
    buildingUse: 'Residential',
    buildingType: 'Custom Houses',
    buildingTier: 'High',
    category: 5,
    designLevel: 3
  })

  // Generate proposal
  const generateProposal = async () => {
    if (!project.results) return

    setGenerating(true)
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: project.projectData,
          clientName,
          clientEmail,
          notes: `Generated from admin calculator. Overrides: ${project.hasChanges ? 'YES' : 'NO'}`
        })
      })

      if (!response.ok) throw new Error('Failed to generate proposal')

      const result = await response.json()
      setProposalUrl(result.data.url)
    } catch (error) {
      console.error('Error generating proposal:', error)
    } finally {
      setGenerating(false)
    }
  }

  const openProposal = () => {
    if (proposalUrl) {
      window.open(proposalUrl, '_blank')
    }
  }

  const copyProposalUrl = () => {
    if (proposalUrl) {
      navigator.clipboard.writeText(proposalUrl)
    }
  }

  if (project.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading project configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Louis Amy AE Studio</h1>
                <p className="text-gray-600">Interactive Proposal Calculator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {project.hasChanges && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Modified from defaults</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={project.resetToDefaults}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                Database: {project.databaseDefaults ? 'Connected' : 'Fallback'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Input Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client Name</label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Client Email</label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Project Areas</CardTitle>
                <CardDescription>Building square footage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      New Construction: {project.projectData.areas.newAreaFt2.toLocaleString()} ft²
                    </label>
                    {project.overrides.areas?.newAreaFt2 !== undefined && (
                      <Button variant="ghost" size="sm" onClick={() => 
                        project.updateAreas({ newAreaFt2: undefined })
                      }>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Slider
                    value={[project.projectData.areas.newAreaFt2]}
                    onValueChange={([value]) => project.updateAreas({ newAreaFt2: value })}
                    min={0}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      Remodel Area: {project.projectData.areas.existingAreaFt2.toLocaleString()} ft²
                    </label>
                    {project.overrides.areas?.existingAreaFt2 !== undefined && (
                      <Button variant="ghost" size="sm" onClick={() => 
                        project.updateAreas({ existingAreaFt2: undefined })
                      }>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Slider
                    value={[project.projectData.areas.existingAreaFt2]}
                    onValueChange={([value]) => project.updateAreas({ existingAreaFt2: value })}
                    min={0}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cost Targets - Only allow within database ranges */}
            {project.availableRanges && (
              <Card>
                <CardHeader>
                  <CardTitle>Cost Targets</CardTitle>
                  <CardDescription>Adjust within database ranges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">
                        New Construction: ${project.projectData.costs.newTargetPSF}/ft²
                      </label>
                      {project.overrides.costs?.newTargetPSF !== undefined && (
                        <Button variant="ghost" size="sm" onClick={project.resetCosts}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Slider
                      value={[project.projectData.costs.newTargetPSF]}
                      onValueChange={([value]) => project.updateCosts({ newTargetPSF: value })}
                      min={project.availableRanges.newCost.min}
                      max={project.availableRanges.newCost.max}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>${project.availableRanges.newCost.min}</span>
                      <span className="font-medium">${project.availableRanges.newCost.default} (default)</span>
                      <span>${project.availableRanges.newCost.max}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">
                        Remodel: ${project.projectData.costs.remodelTargetPSF}/ft²
                      </label>
                      {project.overrides.costs?.remodelTargetPSF !== undefined && (
                        <Button variant="ghost" size="sm" onClick={project.resetCosts}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Slider
                      value={[project.projectData.costs.remodelTargetPSF]}
                      onValueChange={([value]) => project.updateCosts({ remodelTargetPSF: value })}
                      min={project.availableRanges.remodelCost.min}
                      max={project.availableRanges.remodelCost.max}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>${project.availableRanges.remodelCost.min}</span>
                      <span className="font-medium">${project.availableRanges.remodelCost.default} (default)</span>
                      <span>${project.availableRanges.remodelCost.max}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Budget Shares */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Shares</CardTitle>
                <CardDescription>
                  {project.hasChanges ? 'Modified from database defaults' : 'Using database defaults'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      Shell: {Math.round(project.projectData.shares.projectShellShare * 100)}%
                    </label>
                    {project.overrides.shares?.projectShellShare !== undefined && (
                      <Button variant="ghost" size="sm" onClick={project.resetShares}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Slider
                    value={[project.projectData.shares.projectShellShare]}
                    onValueChange={([value]) => project.updateShares({ projectShellShare: value })}
                    min={0.5}
                    max={0.8}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Interior: {Math.round(project.projectData.shares.projectInteriorShare * 100)}%
                  </label>
                  <Slider
                    value={[project.projectData.shares.projectInteriorShare]}
                    onValueChange={([value]) => project.updateShares({ projectInteriorShare: value })}
                    min={0.1}
                    max={0.4}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Landscape: {Math.round(project.projectData.shares.projectLandscapeShare * 100)}%
                  </label>
                  <Slider
                    value={[project.projectData.shares.projectLandscapeShare]}
                    onValueChange={([value]) => project.updateShares({ projectLandscapeShare: value })}
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
          <div className="lg:col-span-3 space-y-6">
            {/* Status Indicator */}
            <Card className={`border ${project.hasChanges ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {project.hasChanges ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      Modified Project (Overrides Active)
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Using Database Defaults
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">Database Defaults:</span> {project.databaseDefaults ? 'Loaded' : 'Using fallback'}</p>
                  <p><span className="font-medium">Active Overrides:</span> {project.hasChanges ? 'YES' : 'NO'}</p>
                  <p><span className="font-medium">Project Classification:</span> {project.projectData.classification.buildingUse} • {project.projectData.classification.buildingType}</p>
                  {project.hasChanges && (
                    <div className="mt-2 pt-2 border-t">
                      <Button variant="outline" size="sm" onClick={project.resetToDefaults}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset All to Defaults
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            {project.results && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${project.results.budgets.totalBudget.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {project.projectData.areas.newAreaFt2 + project.projectData.areas.existingAreaFt2} ft² total
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Contract Price</CardTitle>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${project.results.fees.contractPrice.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {project.results.hours.totalHours.toLocaleString()} hours
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Option A</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${project.results.options.A.investment.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Premium anchor</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Savings</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${(project.results.options.A.investment - project.results.fees.contractPrice).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">vs Option A</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Budget Breakdown with Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Breakdown</CardTitle>
                    <CardDescription>
                      Construction costs distributed by discipline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Budget Numbers */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Shell & Structure</span>
                          <span className="text-lg font-semibold">${project.results.budgets.shellBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>Interior Finishes</span>
                          <span>${project.results.budgets.interiorBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>Landscape</span>
                          <span>${project.results.budgets.landscapeBudget.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-3 mt-4">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total Budget</span>
                            <span className="text-xl">${project.results.budgets.totalBudget.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Budget Donut Chart */}
                      <div className="flex flex-col items-center">
                        <BudgetDonutChart
                          shellBudget={project.results.budgets.shellBudget}
                          interiorBudget={project.results.budgets.interiorBudget}
                          landscapeBudget={project.results.budgets.landscapeBudget}
                          totalBudget={project.results.budgets.totalBudget}
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Interactive • Hover for details
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Engineering Disciplines with Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Engineering Disciplines</CardTitle>
                    <CardDescription>
                      Architecture and engineering allocation within shell budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Discipline Numbers */}
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Architecture</span>
                          <span className="font-semibold">${project.results.disciplines.architectureBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Structural</span>
                          <span>${project.results.disciplines.structuralBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Civil</span>
                          <span>${project.results.disciplines.civilBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Mechanical</span>
                          <span>${project.results.disciplines.mechanicalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Electrical</span>
                          <span>${project.results.disciplines.electricalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Plumbing</span>
                          <span>${project.results.disciplines.plumbingBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Telecom</span>
                          <span>${project.results.disciplines.telecomBudget.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Interactive Discipline Chart */}
                      <div className="flex flex-col items-center">
                        <DisciplineChart
                          architectureBudget={project.results.disciplines.architectureBudget}
                          structuralBudget={project.results.disciplines.structuralBudget}
                          civilBudget={project.results.disciplines.civilBudget}
                          mechanicalBudget={project.results.disciplines.mechanicalBudget}
                          electricalBudget={project.results.disciplines.electricalBudget}
                          plumbingBudget={project.results.disciplines.plumbingBudget}
                          telecomBudget={project.results.disciplines.telecomBudget}
                          totalBudget={project.results.budgets.shellBudget}
                          className="mt-4"
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Engineering Discipline Distribution • Hover for budget details
                        </p>
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
                      {Object.entries(project.results.options).map(([key, option]) => (
                        <div
                          key={key}
                          className={`border rounded-lg p-4 ${
                            key === 'A' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="font-semibold text-lg mb-2">
                            Option {key}: ${option.investment.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {option.valuePromise}
                          </p>
                          <p className="text-xs text-gray-500">
                            {option.idealWhen}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => project.saveProject(`Project-${Date.now()}`, { name: clientName, email: clientEmail })}
                      disabled={!project.results}
                      variant="outline"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Save Project
                    </Button>
                    
                    <Button
                      onClick={generateProposal}
                      disabled={!project.results || generating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {generating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Generate Proposal
                    </Button>
                  </div>

                  {proposalUrl && (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={copyProposalUrl}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                      <Button onClick={openProposal}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Proposal
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
