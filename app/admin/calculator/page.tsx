'use client'

import { useState, useEffect } from 'react'
import { useProjectCalculation } from '@/lib/hooks/useProjectCalculation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Calculator, Building2, DollarSign, PieChart, Send, Copy, ExternalLink, AlertCircle, CheckCircle, RotateCcw, ChevronDown } from 'lucide-react'
import { BudgetDonutChart } from '@/components/ui/budget-donut-chart'
import { DisciplineChart } from '@/components/ui/discipline-chart'
import { ProjectOverview } from '@/components/admin/ProjectOverview'
import { FeeAnalysis } from '@/components/admin/FeeAnalysis'
import { ProjectPhases } from '@/components/admin/ProjectPhases'
import { SanityCheck } from '@/components/admin/SanityCheck'
import { InvestmentSummary } from '@/components/admin/InvestmentSummary'
import { FeeComparison } from '@/components/admin/FeeComparison'
import { HoursBreakdown } from '@/components/admin/HoursBreakdown'
import { DisciplineCards } from '@/components/admin/DisciplineCards'
import { BudgetAllocationCard } from '@/components/admin/BudgetAllocationCard'
import { ProjectSetupForm } from '@/components/admin/ProjectSetupForm'
import { CostRangeSliders } from '@/components/admin/CostRangeSliders'

export default function AdminCalculatorPage() {
  const [clientName, setClientName] = useState('Dr. Luis De Jesús')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [proposalUrl, setProposalUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const [discount, setDiscount] = useState(15)
  const [costConfig, setCostConfig] = useState<any>(null)

  const project = useProjectCalculation(
    costConfig ? {
      buildingUse: costConfig.classification.building_use,
      buildingType: costConfig.classification.building_type,
      buildingTier: costConfig.classification.design_tier === 3 ? 'High' : 
                    costConfig.classification.design_tier === 2 ? 'Mid' : 'Low',
      category: costConfig.classification.category,
      designLevel: costConfig.classification.design_tier
    } : {
      buildingUse: 'Residential',
      buildingType: 'Custom Houses',
      buildingTier: 'High',
      category: 5,
      designLevel: 3
    }
  )
  
  useEffect(() => {
    if (costConfig && project.updateCosts) {
      project.updateCosts({
        newTargetPSF: costConfig.psf.new.target,
        remodelTargetPSF: costConfig.psf.remodel.target
      })
    }
    if (costConfig && project.updateShares) {
      project.updateShares({
        projectShellShare: costConfig.shares_default.shell,
        projectInteriorShare: costConfig.shares_default.interior,
        projectLandscapeShare: costConfig.shares_default.landscape
      })
    }
  }, [costConfig])

  const generateProposal = async () => {
    if (!project.results) return

    setGenerating(true)
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: project.projectData,
          results: project.results,
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
      {/* Header */}
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
          {/* Input Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            <ProjectSetupForm 
              onConfigChange={setCostConfig}
              loading={project.loading}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Client Name</label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Dr. Luis De Jesús"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@example.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Internal Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3}
                    placeholder="Any special requirements..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Project Areas
                </CardTitle>
                <CardDescription>
                  Square footage for construction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    New Construction (ft²)
                    {project.overrides.areas?.newAreaFt2 !== undefined && (
                      <span className="text-xs text-orange-600 ml-2">(modified)</span>
                    )}
                  </label>
                  <Input
                    type="number"
                    value={project.projectData.areas.newAreaFt2}
                    onChange={(e) => project.updateAreas({ newAreaFt2: Number(e.target.value) })}
                    placeholder="2,000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Existing/Remodel (ft²)
                    {project.overrides.areas?.existingAreaFt2 !== undefined && (
                      <span className="text-xs text-orange-600 ml-2">(modified)</span>
                    )}
                  </label>
                  <Input
                    type="number"
                    value={project.projectData.areas.existingAreaFt2}
                    onChange={(e) => project.updateAreas({ existingAreaFt2: Number(e.target.value) })}
                    placeholder="2,407"
                  />
                </div>
              </CardContent>
            </Card>

            {costConfig && (
              <CostRangeSliders
                costs={project.projectData.costs}
                ranges={costConfig.psf}
                onUpdate={project.updateCosts}
                overrides={project.overrides.costs}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Budget Distribution
                </CardTitle>
                <CardDescription>
                  Adjust project component shares
                </CardDescription>
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
            
            {/* Project Overview */}
            {project.results && (
              <ProjectOverview
                projectData={{
                  buildingUse: project.projectData.classification.buildingUse,
                  buildingType: project.projectData.classification.buildingType,
                  buildingTier: project.projectData.classification.buildingTier,
                  category: project.projectData.classification.category,
                  designLevel: project.projectData.classification.designLevel,
                  areas: {
                    newAreaFt2: project.projectData.areas.newAreaFt2,
                    existingAreaFt2: project.projectData.areas.existingAreaFt2,
                    siteAreaM2: 972
                  }
                }}
                budgets={project.results.budgets}
                costs={project.projectData.costs}
              />
            )}

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

            {/* CONSTRUCTION COST PIPELINE */}
            <div className="border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    Construction Budget Analysis
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Minimum cost to build the project</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  Areas × PSF × Shares = Budget
                </span>
              </div>

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
                        <CardTitle className="text-sm font-medium">Shell Budget</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${project.results.budgets.shellBudget.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(project.projectData.shares.projectShellShare * 100)}% of total
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Interior Budget</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${project.results.budgets.interiorBudget.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(project.projectData.shares.projectInteriorShare * 100)}% of total
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Landscape Budget</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${project.results.budgets.landscapeBudget.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(project.projectData.shares.projectLandscapeShare * 100)}% of total
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <BudgetAllocationCard results={project.results} />
                  <DisciplineCards results={project.results} />
                </>
              )}
            </div>

            {/* DESIGN FEES PIPELINE */}
            <div className="border-t-4 border-green-500 bg-green-50/30 rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    Design Fee Analysis
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">What Louis Amy charges for professional services</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  Hours × Rates = Fees
                </span>
              </div>

              {project.results && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Contract Price</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${project.results.fees.contractPrice.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          Max(Market, LA) after discount
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{project.results.hours.totalHours.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          Non-linear formula
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Option A Price</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${project.results.options.A.investment.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Premium anchor</p>
                      </CardContent>
                    </Card>
                  </div>

                  <FeeComparison 
                    results={project.results}
                    discount={discount}
                    onDiscountChange={setDiscount}
                  />

                  <SanityCheck 
                    results={project.results}
                    discount={discount}
                  />

                  <HoursBreakdown results={project.results} />
                </>
              )}
            </div>

            {/* CLIENT OPTIONS */}
            {project.results && (
              <div className="border-t-4 border-purple-500 bg-purple-50/30 rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ChevronDown className="h-6 w-6 text-purple-600" />
                      Client Presentation Options
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Strategic pricing for client proposals</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    Chris Do Compliant
                  </span>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Options</CardTitle>
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
              </div>
            )}

            {/* Action Buttons */}
            {project.results && (
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
            )}

            {/* Architecture Information */}
            {project.results && (
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
            )}

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