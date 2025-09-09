'use client'

import { useState, useEffect } from 'react'
import { calculateProject, DR_DE_JESUS_PROJECT } from '@/lib/calculations'
import { CalculationResults, CalcInput, ProjectClassification } from '@/lib/types'
import { useBuildingClassification } from '@/lib/hooks/useBuildingClassification'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Calculator, Building2, DollarSign, PieChart, Send, Copy, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import { BudgetDonutChart } from '@/components/ui/budget-donut-chart'
import { DisciplineChart } from '@/components/ui/discipline-chart'

export default function AdminCalculatorPage() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [clientName, setClientName] = useState('Dr. Luis De Jesús')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [proposalUrl, setProposalUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  
  // Use building classification hook for database integration
  const buildingClass = useBuildingClassification({
    buildingUse: 'Residential',
    buildingType: 'Custom Houses',
    buildingTier: 'High',
    category: 5
  })

  // Add database status indicator
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  
  // Initialize project data with database values
  const [projectData, setProjectData] = useState<CalcInput>(DR_DE_JESUS_PROJECT)

  // Update project data when database values change
  useEffect(() => {
    if (!buildingClass.costData) return

    const costRanges = buildingClass.getCostRanges()
    const projectShares = buildingClass.getProjectShares()
    const designShares = buildingClass.getDesignShares()

    setProjectData(prev => ({
      ...prev,
      classification: {
        ...prev.classification,
        buildingUse: buildingClass.buildingUse as ProjectClassification['buildingUse'],
        buildingType: buildingClass.buildingType,
        buildingTier: buildingClass.buildingTier as ProjectClassification['buildingTier'],
        category: buildingClass.category as ProjectClassification['category']
      },
      costs: {
        ...prev.costs,
        newTargetPSF: costRanges.newTarget,
        remodelTargetPSF: costRanges.remodelTarget
      },
      shares: projectShares,
      engineering: designShares
    }))
  }, [buildingClass.costData, buildingClass])

  // Check database status
  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch('/api/database-status')
        const data = await response.json()

        if (data.status === 'connected') {
          setDbStatus('connected')
        } else {
          setDbStatus('error')
        }
      } catch (error) {
        console.warn('Database status check failed:', error)
        // Fallback to hook-based status
        if (buildingClass.error) {
          setDbStatus('error')
        } else if (buildingClass.costData) {
          setDbStatus('connected')
        } else {
          setDbStatus('connecting')
        }
      }
    }

    checkDatabaseStatus()
  }, [buildingClass.error, buildingClass.costData])

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

  const generateProposal = async () => {
    if (!clientName || !results) {
      alert('Please enter client name and ensure calculations are complete')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData,
          clientName,
          clientEmail,
          notes
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setProposalUrl(data.data.url)
        // Copy to clipboard
        navigator.clipboard.writeText(data.data.url)
      } else {
        alert('Failed to generate proposal: ' + data.error)
      }
    } catch (error) {
      alert('Error generating proposal')
      console.error(error)
    } finally {
      setGenerating(false)
    }
  }

  const openProposal = () => {
    if (proposalUrl) {
      window.open(proposalUrl, '_blank')
    }
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
                {buildingClass.error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{buildingClass.error}</span>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Building Use</label>
                  <Select
                    value={buildingClass.buildingUse}
                    onValueChange={buildingClass.setBuildingUse}
                    disabled={buildingClass.buildingUses.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building use" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingClass.buildingUses.map(use => (
                        <SelectItem key={use} value={use}>{use}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Building Type</label>
                  <Select
                    value={buildingClass.buildingType}
                    onValueChange={buildingClass.setBuildingType}
                    disabled={buildingClass.buildingTypes.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingClass.buildingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Building Tier</label>
                  <Select
                    value={buildingClass.buildingTier}
                    onValueChange={buildingClass.setBuildingTier}
                    disabled={buildingClass.buildingTiers.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingClass.buildingTiers.map(tier => (
                        <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category (Complexity)</label>
                  <Select
                    value={buildingClass.category.toString()}
                    onValueChange={(value) => buildingClass.setCategory(parseInt(value))}
                    disabled={buildingClass.categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingClass.categories.map(cat => (
                        <SelectItem key={cat} value={cat.toString()}>
                          {cat} - {cat === 1 ? 'Simple' : cat === 2 ? 'Standard' : cat === 3 ? 'Medium' : cat === 4 ? 'High' : 'Very High'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {buildingClass.loading && (
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading cost data...
                  </div>
                )}
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
                    min={buildingClass.getCostRanges().newMin}
                    max={buildingClass.getCostRanges().newMax}
                    step={5}
                    className="w-full"
                    disabled={!buildingClass.costData}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${buildingClass.getCostRanges().newMin}</span>
                    <span className="font-medium">${buildingClass.getCostRanges().newTarget} (target)</span>
                    <span>${buildingClass.getCostRanges().newMax}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Remodel: ${projectData.costs.remodelTargetPSF}/ft²
                  </label>
                  <Slider
                    value={[projectData.costs.remodelTargetPSF]}
                    onValueChange={([value]) => updateCosts({ remodelTargetPSF: value })}
                    min={buildingClass.getCostRanges().remodelMin}
                    max={buildingClass.getCostRanges().remodelMax}
                    step={5}
                    className="w-full"
                    disabled={!buildingClass.costData}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${buildingClass.getCostRanges().remodelMin}</span>
                    <span className="font-medium">${buildingClass.getCostRanges().remodelTarget} (target)</span>
                    <span>${buildingClass.getCostRanges().remodelMax}</span>
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
                {/* Database Status Card */}
                <Card className={`mb-6 border ${
                  dbStatus === 'connected' ? 'bg-green-50 border-green-200' :
                  dbStatus === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {dbStatus === 'connected' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {dbStatus === 'connecting' && <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />}
                      {dbStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      Database Status: {
                        dbStatus === 'connected' ? 'Connected' :
                        dbStatus === 'connecting' ? 'Connecting...' :
                        'Connection Error'
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs space-y-1">
                      {dbStatus === 'connected' && buildingClass.costData && (
                        <>
                          <p><span className="font-medium">Selection:</span> {buildingClass.buildingUse} • {buildingClass.buildingType}</p>
                          <p><span className="font-medium">Tier:</span> {buildingClass.buildingTier} • <span className="font-medium">Category:</span> {buildingClass.category}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-green-600">✅ Cost ranges and shares loaded from database</p>
                            <p className="text-green-600">✅ Database-aware calculations active</p>
                            <p className="text-green-600">✅ Real-time validation enabled</p>
                          </div>
                        </>
                      )}
                      {dbStatus === 'connecting' && (
                        <>
                          <p className="text-yellow-600">⏳ Connecting to database...</p>
                          <p className="text-gray-600 mt-1">Using fallback values until connection established</p>
                        </>
                      )}
                      {dbStatus === 'error' && (
                        <>
                          <p className="text-red-600">❌ Database connection failed</p>
                          <p className="text-gray-600 mt-1">Using default values. Check database configuration.</p>
                          {buildingClass.error && (
                            <p className="text-red-500 mt-2 font-mono text-xs">{buildingClass.error}</p>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

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
                      <p className="text-xs text-gray-500 mt-1">
                        Market: ${results.fees.marketFee?.toLocaleString() || 'N/A'}
                      </p>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Budget Numbers */}
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
                        <div className="border-t pt-3 mt-4">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total Budget</span>
                            <span className="text-xl">${results.budgets.totalBudget.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Budget Donut Chart */}
                      <div className="flex flex-col items-center">
                        <BudgetDonutChart
                          shellBudget={results.budgets.shellBudget}
                          interiorBudget={results.budgets.interiorBudget}
                          landscapeBudget={results.budgets.landscapeBudget}
                          totalBudget={results.budgets.totalBudget}
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Interactive • Hover for details
                        </p>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Discipline Numbers */}
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
                          <span>Civil</span>
                          <span>${results.disciplines.civilBudget.toLocaleString()}</span>
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
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Telecom</span>
                        <span>${results.disciplines.telecomBudget.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Interactive Discipline Chart */}
                    <div className="flex flex-col items-center">
                      <DisciplineChart
                        architectureBudget={results.disciplines.architectureBudget}
                        structuralBudget={results.disciplines.structuralBudget}
                        civilBudget={results.disciplines.civilBudget}
                        mechanicalBudget={results.disciplines.mechanicalBudget}
                        electricalBudget={results.disciplines.electricalBudget}
                        plumbingBudget={results.disciplines.plumbingBudget}
                        telecomBudget={results.disciplines.telecomBudget}
                        totalBudget={results.budgets.shellBudget}
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
                            &ldquo;{option.valuePromise}&rdquo;
                          </p>

                          <div className="text-xs text-gray-500">
                            <div className="font-medium mb-1">What&apos;s Included:</div>
                            <ul className="space-y-1">
                              {option.scope.slice(0, 3).map((item: string, idx: number) => (
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
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Client Name *</label>
                        <Input
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Dr. Luis De Jesús"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Client Email</label>
                        <Input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Internal Notes</label>
                      <Input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special considerations..."
                      />
                    </div>

                    {proposalUrl ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">Proposal Generated!</span>
                          <span className="text-xs text-green-600">Link copied to clipboard</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={proposalUrl}
                            readOnly
                            className="bg-white"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(proposalUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={openProposal}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          className="flex-1" 
                          size="lg"
                          onClick={generateProposal}
                          disabled={generating || !clientName}
                        >
                          {generating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Generate Proposal Link
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => window.open('/proposal/preview', '_blank')}
                        >
                          Preview Client View
                        </Button>
                      </div>
                    )}
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
