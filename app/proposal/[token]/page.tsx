'use client'

import { useState, useEffect } from 'react'
import { calculateProject, calculateProjectWithDatabase, DR_DE_JESUS_PROJECT } from '@/lib/calculations'
import { CalculationResults, CalcInput } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, CheckCircle, Eye, ArrowRight, Phone, Mail } from 'lucide-react'
import { ThreeDModelViewer } from '@/components/ui/3d-model-viewer'
import { OptionCards } from '@/components/client/OptionCards'
import { BudgetDonut } from '@/components/client/BudgetDonut'
import { ProofOfPrecision } from '@/components/client/ProofOfPrecision'
import { ConversionCTA } from '@/components/client/ConversionCTA'

interface ProposalPageProps {
  params: { token: string }
}

export default function ProposalPage({ params }: ProposalPageProps) {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [clientName, setClientName] = useState<string>('Valued Client')
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(null)

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/proposals/${params.token}`)
        const data = await response.json()

        if (data.success && data.data) {
          const projectData = data.data.project_data as CalcInput

          // Try database-aware calculations first, fallback to regular calculations
          try {
            const calculationResults = await calculateProjectWithDatabase(projectData)
            setResults(calculationResults)
          } catch (error) {
            console.warn('Database calculations failed, using fallback:', error)
            const calculationResults = calculateProject(projectData)
            setResults(calculationResults)
          }

          setClientName(data.data.client_name || 'Valued Client')
          
          // Mark as viewed if not already
          if (!data.data.viewed_at) {
            await fetch(`/api/proposals/${params.token}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                viewed_at: new Date().toISOString(),
                status: 'viewed'
              })
            })
          }
        } else {
          // Fallback to default project for preview
          try {
            setResults(await calculateProjectWithDatabase(DR_DE_JESUS_PROJECT))
          } catch (error) {
            console.warn('Database calculations failed for preview, using fallback:', error)
            setResults(calculateProject(DR_DE_JESUS_PROJECT))
          }
          setClientName('Dr. Luis De Jesús')
        }
      } catch (err) {
        console.error('Error fetching proposal:', err)
        // Fallback to default project
        try {
          setResults(await calculateProjectWithDatabase(DR_DE_JESUS_PROJECT))
        } catch (error) {
          console.warn('Database calculations failed, using fallback:', error)
          setResults(calculateProject(DR_DE_JESUS_PROJECT))
        }
        setClientName('Dr. Luis De Jesús')
      } finally {
        setLoading(false)
      }
    }

    fetchProposal()
  }, [params.token])

  const handleOptionSelect = async (option: 'A' | 'B' | 'C') => {
    setSelectedOption(option)
    
    // Update proposal with selected option
    try {
      await fetch(`/api/proposals/${params.token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          selected_option: option,
          status: 'selected'
        })
      })
    } catch (err) {
      console.error('Error updating proposal:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your proposal...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load proposal. Please contact us for assistance.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Premium Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Louis Amy AE Studio
                </h1>
                <p className="text-gray-600">Where Vision Meets Bold Innovation</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Proposal ID</div>
              <div className="font-mono text-sm font-medium">{params.token.slice(0, 8).toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with 3D Model */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">
                Welcome, {clientName}
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Your vision for a legacy residence, meticulously brought to life
              </p>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {(results.budgets.newBudget > 0 ? results.budgets.newBudget : results.budgets.remodelBudget / results.budgets.totalBudget * 100).toFixed(0).toLocaleString()}
                  </div>
                  <div className="text-blue-200">
                    {results.budgets.newBudget > 0 ? 'sq ft new' : 'sq ft existing'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">Category {params.token === 'preview' ? '5' : '5'}</div>
                  <div className="text-blue-200">complexity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">${(results.budgets.totalBudget / 1000).toFixed(0)}K</div>
                  <div className="text-blue-200">total budget</div>
                </div>
              </div>

              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Eye className="h-4 w-4 mr-2" />
                View 3D Model
              </Button>
            </div>

            {/* Interactive 3D Model */}
            <ThreeDModelViewer
              title="Casa Vista Exterior"
              showQRCode={true}
              className="bg-white/10 backdrop-blur-sm"
            />
            <p className="text-sm text-blue-200 text-center mt-4">
              Explore your future home in immersive detail
            </p>
          </div>
        </div>
      </div>

      {/* Investment Options - Using New Client Components */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <OptionCards 
          options={results.options} 
          onSelect={handleOptionSelect}
        />
      </div>
      
      {/* Budget Breakdown */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <BudgetDonut
          scanToBIM={results.budgets.totalBudget * 0.01}
          buildingShell={results.budgets.shellBudget}
          interior={results.budgets.interiorBudget}
          landscape={results.budgets.landscapeBudget}
          total={results.fees.contractPrice}
        />
      </div>
      
      {/* 3D Model Proof */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <ProofOfPrecision
          modelUrl="https://nira.app/embed/your-model-id"
        />
      </div>

        {/* Selected Option Next Steps */}
        {selectedOption && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>

                <h4 className="text-3xl font-bold text-gray-900 mb-4">
                  Excellent Choice, Dr. De Jesús!
                </h4>

                <p className="text-lg text-gray-600 mb-8">
                  You&apos;ve selected Option {selectedOption} with an investment of{' '}
                  <span className="font-bold text-blue-600">
                    ${results.options[selectedOption].investment.toLocaleString()}
                  </span>
                  . This comprehensive package will bring your vision to life with unparalleled precision and peace of mind.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h5 className="font-semibold mb-2">Next Step</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        Schedule your complimentary consultation
                      </p>
                      <Button className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Reserve Studio Window
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <h5 className="font-semibold mb-2">Questions?</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        Our team is here to help
                      </p>
                      <Button variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Us
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-sm text-gray-500">
                  This proposal is confidential and valid for 30 days. All investments are fixed-price with no hourly billing.
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Final Call to Action */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <ConversionCTA
          onAccept={() => handleOptionSelect(selectedOption || 'A')}
          onScheduleCall={() => window.open('https://calendly.com/louisamy', '_blank')}
          onAskQuestion={() => window.location.href = 'mailto:projects@louisamy.com'}
        />
      </div>
      
      {/* Premium Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Louis Amy AE Studio</h4>
              <p className="text-gray-400 text-sm">
                Where Vision Meets Bold Innovation
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                                <p>Phone: (787) 555-0123</p>`r`n                <p>Email: info@louisamy.com</p>`r`n                <p>Location: Ponce, Puerto Rico</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Proposal Details</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Confidential - Dr. Luis De Jesús only</p>
                <p>Valid for 30 days from {new Date().toLocaleDateString()}</p>
                <p>Proposal ID: {params.token.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Louis Amy AE Studio. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


