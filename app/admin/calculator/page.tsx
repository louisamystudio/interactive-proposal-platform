'use client'

import { useState } from 'react'
import { useProjectCalculation } from '@/lib/hooks/useProjectCalculation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Calculator, Building2, DollarSign, PieChart, Send, Copy, ExternalLink, AlertCircle, CheckCircle, RotateCcw, Info } from 'lucide-react'
import { BudgetDonutChart } from '@/components/ui/budget-donut-chart'
import { DisciplineChart } from '@/components/ui/discipline-chart'

// Import new narrative components
import { BudgetOverviewCard } from '@/components/admin/BudgetOverviewCard'
import { DisciplineAllocationCard } from '@/components/admin/DisciplineAllocationCard'
import { FeeComparison } from '@/components/admin/FeeComparison'
import { HoursBreakdown } from '@/components/admin/HoursBreakdown'
import { SanityCheckSection } from '@/components/admin/SanityCheckSection'

export default function AdminCalculatorPage() {
  const [clientName, setClientName] = useState('Dr. Luis De Jesús')
  const [clientEmail, setClientEmail] = useState('')
  const [proposalUrl, setProposalUrl] = useState('')
  const [generating, setGenerating] = useState(false)

  // Use project calculation hook - NO infinite loops, database-safe
  const project = useProjectCalculation({
    buildingUse: 'Residential',
    buildingType: 'Custom Houses',
    buildingTier: 'High',
    category: 5,
    designLevel: 3
  })

  // Generate proposal (saves to separate proposals table)
  const generateProposal = async () => {
    if (!project.results) return

    setGenerating(true)
    try {
      // Create client-safe data (no hours, rates, internal calculations)
      const clientSafeData = {
        classification: project.projectData.classification,
        areas: project.projectData.areas,
        multipliers: project.projectData.multipliers,
        budgets: project.results.budgets,
        disciplines: project.results.disciplines,
        options: project.results.options
        // Explicitly exclude: hours, fees (internal calculations)
      }

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: clientSafeData,
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
          <p>Loading database defaults...</p>
          <p className="text-sm text-gray-500 mt-2">Database read-only • Project overrides in memory</p>
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
                Database: {project.databaseDefaults ? 'Connected (Read-Only)' : 'Fallback Mode'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Input Controls - NON-DESTRUCTIVE OVERRIDES */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Project Information
                </CardTitle>
                <CardDescription>Database defaults + Live overrides</CardDescription>
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

            {/* Project Areas - LIVE OVERRIDES */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Project Areas</CardTitle>
                    <CardDescription>Building square footage</CardDescription>
                  </div>
                  {(project.overrides.areas?.newAreaFt2 !== undefined || project.overrides.areas?.existingAreaFt2 !== undefined) && (
                    <Button variant="ghost" size="sm" onClick={() => 
                      project.updateAreas({ newAreaFt2: undefined, existingAreaFt2: undefined })
                    }>
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    New Construction: {project.projectData.areas.newAreaFt2.toLocaleString()} ft²
                  </label>
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
                  <label className="text-sm font-medium mb-2 block">
                    Remodel Area: {project.projectData.areas.existingAreaFt2.toLocaleString()} ft²
                  </label>
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

            {/* Cost Targets - LIVE OVERRIDES within database ranges */}
            {project.availableRanges && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Cost Targets</CardTitle>
                      <CardDescription>Live overrides • Database read-only</CardDescription>
                    </div>
                    {(project.overrides.costs?.newTargetPSF !== undefined || project.overrides.costs?.remodelTargetPSF !== undefined) && (
                      <Button variant="ghost" size="sm" onClick={project.resetCosts}>
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset to DB
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      New Construction: ${project.projectData.costs.newTargetPSF}/ft²
                      {project.overrides.costs?.newTargetPSF !== undefined && (
                        <span className="text-xs text-orange-600 ml-2">(modified)</span>
                      )}
                    </label>
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
                      <span className="font-medium">${project.availableRanges.newCost.default} (DB default)</span>
                      <span>${project.availableRanges.newCost.max}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Remodel: ${project.projectData.costs.remodelTargetPSF}/ft²
                      {project.overrides.costs?.remodelTargetPSF !== undefined && (
                        <span className="text-xs text-orange-600 ml-2">(modified)</span>
                      )}
                    </label>
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
                      <span className="font-medium">${project.availableRanges.remodelCost.default} (DB default)</span>
                      <span>${project.availableRanges.remodelCost.max}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Budget Shares - LIVE OVERRIDES */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Budget Shares</CardTitle>
                    <CardDescription>
                      {project.hasChanges ? 'Modified from database defaults' : 'Using database defaults'}
                    </CardDescription>
                  </div>
                  {(project.overrides.shares?.projectShellShare !== undefined || 
                    project.overrides.shares?.projectInteriorShare !== undefined ||
                    project.overrides.shares?.projectLandscapeShare !== undefined) && (
                    <Button variant="ghost" size="sm" onClick={project.resetShares}>
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset to DB
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Shell: {Math.round(project.projectData.shares.projectShellShare * 100)}%
                    {project.overrides.shares?.projectShellShare !== undefined && (
                      <span className="text-xs text-orange-600 ml-2">(modified)</span>
                    )}
                  </label>
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
                    {project.overrides.shares?.projectInteriorShare !== undefined && (
                      <span className="text-xs text-orange-600 ml-2">(modified)</span>
                    )}
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
                    {project.overrides.shares?.projectLandscapeShare !== undefined && (
                      <span className="text-xs text-orange-600 ml-2">(modified)</span>
                    )}
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
                      Modified Project (Live Overrides Active)
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Using Database Defaults (No Overrides)
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">Database Status:</span> {project.databaseDefaults ? 'Connected (Read-Only)' : 'Using CSV fallback'}</p>
                  <p><span className="font-medium">Active Overrides:</span> {project.hasChanges ? 'YES - Live calculations with modified values' : 'NO - Pure database defaults'}</p>
                  <p><span className="font-medium">Main Cost DB:</span> Never modified during editing • Remains pristine</p>
                  {project.hasChanges && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={project.resetCosts}>
                          Reset Costs
                        </Button>
                        <Button variant="outline" size="sm" onClick={project.resetShares}>
                          Reset Shares  
                        </Button>
                        <Button variant="outline" size="sm" onClick={project.resetEngineering}>
                          Reset Engineering
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NARRATIVE FLOW: Results Section */}
            {project.results && (() => {
              const totalArea = project.projectData.areas.newAreaFt2 + project.projectData.areas.existingAreaFt2;
              
              return (
              <>
                {/* 1. PROJECT DEFINITION - Context First */}
                <Card className="col-span-2 mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Building2 className="h-6 w-6" />
                      Project Definition
                    </CardTitle>
                    <CardDescription>
                      Building context and parameters that drive all calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Building Use/Type</div>
                        <div className="font-semibold">{project.projectData.classification.buildingUse} - {project.projectData.classification.buildingType}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Category & Tier</div>
                        <div className="font-semibold">Cat {project.projectData.classification.category} - {project.projectData.classification.buildingTier}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Total Area</div>
                        <div className="font-semibold">
                          {(project.projectData.areas.newAreaFt2 + project.projectData.areas.existingAreaFt2).toLocaleString()} ft²
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Design Level</div>
                        <div className="font-semibold">Level {project.projectData.classification.designLevel}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-800">
                          This budget represents the <strong>minimum construction cost</strong> estimate from the PR building-cost database. 
                          Professional design fees are calculated separately.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. CONSTRUCTION BUDGET - Minimum Cost to Build */}
                <BudgetOverviewCard 
                  budgets={project.results.budgets}
                  newAreaFt2={project.projectData.areas.newAreaFt2}
                  existingAreaFt2={project.projectData.areas.existingAreaFt2}
                />

                {/* 3. DISCIPLINE ALLOCATION - How Shell Splits */}
                <DisciplineAllocationCard 
                  disciplines={project.results.disciplines}
                  budgets={project.results.budgets}
                  newPercent={totalArea > 0 ? (project.projectData.areas.newAreaFt2 / totalArea) * 100 : 0}
                  remodelPercent={totalArea > 0 ? (project.projectData.areas.existingAreaFt2 / totalArea) * 100 : 0}
                />

                {/* 4. DESIGN FEE ANALYSIS - Two Non-Linear Views */}
                <FeeComparison 
                  fees={project.results.fees}
                  totalBudget={project.results.budgets.totalBudget}
                  totalHours={project.results.hours.totalHours}
                  category={project.projectData.classification.category}
                  onDiscountChange={(discount) => {
                    // Handle discount changes if needed
                  }}
                />

                {/* 5. HOURS DISTRIBUTION - Admin Only Diagnostics */}
                <HoursBreakdown 
                  hours={project.results.hours}
                />

                {/* 6. SANITY CHECK & PRICING */}
                <SanityCheckSection 
                  fees={project.results.fees}
                  totalBudget={project.results.budgets.totalBudget}
                  onDiscountChange={(discount) => {
                    // Could update project state with discount if needed
                  }}
                />

                {/* Client Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Options (Chris Do Compliant)</CardTitle>
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
                            &ldquo;{option.valuePromise}&rdquo;
                          </p>
                          <div className="text-xs text-gray-500">
                            <p className="font-medium mb-1">Includes:</p>
                            <ul className="space-y-1">
                              {option.scope.slice(0, 3).map((item: string, idx: number) => (
                                <li key={idx} className="truncate">• {item}</li>
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

                {/* Action Buttons - SAVE TO SEPARATE TABLE */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => project.saveProject(`Project-${Date.now()}`, { name: clientName, email: clientEmail })}
                      disabled={!project.results}
                      variant="outline"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Save Project Snapshot
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

                {/* Architecture Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Database Architecture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Main Cost DB (pr_construction_cost_index_2025):</span>
                        <span className="text-green-600 font-medium">READ-ONLY ✅</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Project Overrides:</span>
                        <span className="text-blue-600 font-medium">LIVE STATE 🔄</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Proposals:</span>
                        <span className="text-purple-600 font-medium">SEPARATE TABLE 💾</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
                        <span className="font-medium">Architecture:</span> Database defaults → Live overrides → Proposal snapshots
                        <br />
                        <span className="font-medium">Result:</span> No infinite loops • No database corruption • Professional workflow
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
              )
            })()}

            {project.error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Error: {project.error}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
