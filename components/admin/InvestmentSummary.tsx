'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, TrendingUp, Building2, Palette, Trees, Scan } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface InvestmentSummaryProps {
  marketRate: number
  louisAmyPrice: number
  finalContractPrice: number
  totalSavings: number
  services: {
    scanToBIM: { included: boolean, fee: number }
    scanToSite: { included: boolean, fee: number }
    architecture: { included: boolean, fee: number }
    interior: { included: boolean, fee: number }
    landscape: { included: boolean, fee: number }
    structural: { included: boolean, fee: number }
    civil: { included: boolean, fee: number }
    plumbing: { included: boolean, fee: number }
  }
  distributionData: {
    scanToBIM: number
    buildingShell: number
    interior: number
    landscape: number
  }
}

export function InvestmentSummary({
  marketRate,
  louisAmyPrice,
  finalContractPrice,
  totalSavings,
  services,
  distributionData
}: InvestmentSummaryProps) {
  const chartData = [
    { name: 'Scan to BIM', value: distributionData.scanToBIM, percentage: 4 },
    { name: 'Building Shell', value: distributionData.buildingShell, percentage: 60 },
    { name: 'Interior', value: distributionData.interior, percentage: 24 },
    { name: 'Landscape', value: distributionData.landscape, percentage: 12 }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-lg font-bold">${payload[0].value.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{payload[0].payload.percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-2 border-gray-800 bg-gray-50">
      <CardHeader className="bg-gray-800 text-white">
        <CardTitle className="text-2xl text-center">Your Investment Summary</CardTitle>
        <CardDescription className="text-gray-300 text-center">
          Comprehensive Design Services by Louis Amy Engineering
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        {/* Price Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">MARKET RATE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-400">${marketRate.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-2">Industry Standard</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">LOUIS AMY PRICE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">${louisAmyPrice.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-2">In-House Expertise</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-700">FINAL CONTRACT PRICE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${finalContractPrice.toLocaleString()}</div>
              <p className="text-sm font-semibold text-green-700 mt-2">
                Total Savings: ${totalSavings.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services and Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* In-House Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              In-House Services Included
            </h3>
            <div className="space-y-3">
              {Object.entries(services).map(([key, service]) => {
                if (!service.included) return null
                const icons: { [key: string]: any } = {
                  scanToBIM: Scan,
                  scanToSite: MapPin,
                  architecture: Building2,
                  interior: Palette,
                  landscape: Trees,
                  structural: Building2,
                  civil: Building2,
                  plumbing: Building2
                }
                const Icon = icons[key] || Building2
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">${service.fee.toLocaleString()}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Design Services Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Design Services Distribution
            </h3>
            
            <div className="bg-white p-4 rounded-lg border">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${percentage}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <div>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                      <span className="text-sm text-gray-500 ml-2">${item.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Louis Amy */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-center">Why Choose Louis Amy Engineering?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold">Exceptional Value</p>
                  <p className="text-sm text-gray-600">${totalSavings.toLocaleString()} below market rates with premium quality and service</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold">Full In-House Team</p>
                  <p className="text-sm text-gray-600">Direct access to architects, engineers, and designers under one roof</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold">Integrated Design Approach</p>
                  <p className="text-sm text-gray-600">Seamless coordination between all disciplines for optimal results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold">Proven Track Record</p>
                  <p className="text-sm text-gray-600">Decades of experience delivering exceptional residential projects</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg text-center">
              <h4 className="text-lg font-semibold mb-2">Ready to Begin Your Project</h4>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                Final Proposal Price: ${finalContractPrice.toLocaleString()}
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Accept Proposal
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// Need to import MapPin
import { MapPin } from 'lucide-react'