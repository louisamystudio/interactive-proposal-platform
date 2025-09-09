'use client'

import { useState } from 'react'
import { calculateProject, DR_DE_JESUS_PROJECT } from '@/lib/calculations'
import { CalculationResults } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, CheckCircle, Eye, Star, ArrowRight, Phone, Mail } from 'lucide-react'

interface ProposalPageProps {
  params: { token: string }
}

export default function ProposalPage({ params }: ProposalPageProps) {
  const [results] = useState<CalculationResults>(() =>
    calculateProject(DR_DE_JESUS_PROJECT)
  )
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(null)
  const [showDetails, setShowDetails] = useState(false)

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
                Welcome, Dr. Luis De Jesús
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Your vision for a legacy residence at Mansion del Lago, meticulously brought to life
              </p>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">4,407</div>
                  <div className="text-blue-200">sq ft existing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">Category 5</div>
                  <div className="text-blue-200">complexity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">$859K</div>
                  <div className="text-blue-200">total budget</div>
                </div>
              </div>

              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Eye className="h-4 w-4 mr-2" />
                View 3D Model
              </Button>
            </div>

            {/* 3D Model Placeholder */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="w-full h-64 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Building2 className="h-16 w-16 text-white/60 mx-auto mb-4" />
                  <p className="text-white/80">Interactive 3D Model</p>
                  <p className="text-sm text-white/60">Casa Vista Exterior</p>
                </div>
              </div>
              <p className="text-sm text-blue-200">
                Explore your future home in immersive detail
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Options */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Choose Your Investment Level
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three carefully crafted options designed to bring your architectural vision to life with uncompromising precision and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Object.entries(results.options).map(([key, option]) => (
            <Card
              key={key}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                selectedOption === key
                  ? 'border-blue-500 shadow-2xl scale-105'
                  : key === 'A'
                  ? 'border-blue-300 shadow-lg'
                  : 'border-gray-200'
              }`}
            >
              {/* Recommended Badge */}
              {key === 'A' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    ⭐ Recommended
                  </div>
                </div>
              )}

              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Option {key}</h4>
                  <div className="text-5xl font-extrabold text-blue-600 mb-2">
                    ${option.investment.toLocaleString()}
                  </div>
                  <p className="text-gray-600">Fixed Investment</p>
                </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">What's Included:</h5>
                <ul className="space-y-2">
                  {option.scope.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {option.excluded.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">Not Included:</h5>
                  <ul className="space-y-2">
                    {option.excluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

                {/* Value Promise */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-center text-gray-800 font-medium italic">
                    "{option.valuePromise}"
                  </p>
                </div>

                {/* Select Button */}
                <Button
                  onClick={() => setSelectedOption(key as 'A' | 'B' | 'C')}
                  className={`w-full py-3 text-lg font-semibold transition-all ${
                    selectedOption === key
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  size="lg"
                >
                  {selectedOption === key ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Selected
                    </>
                  ) : (
                    <>
                      Select Option {key}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
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
                  You've selected Option {selectedOption} with an investment of{' '}
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
                <p>📞 (787) 555-0123</p>
                <p>📧 info@louisamy.com</p>
                <p>📍 Ponce, Puerto Rico</p>
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
      