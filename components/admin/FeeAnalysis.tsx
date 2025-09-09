'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Info, TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'

interface FeeAnalysisProps {
  topDownFee: number
  bottomUpFee: number
  contractPrice: number
  totalHours: number
  disciplines: {
    scanToBIM: { fee: number, hours: number, isInHouse: boolean }
    scanToSite: { fee: number, hours: number, isInHouse: boolean }
    architecture: { fee: number, hours: number, isInHouse: boolean }
    interior: { fee: number, hours: number, isInHouse: boolean }
    landscape: { fee: number, hours: number, isInHouse: boolean }
    structural: { fee: number, hours: number, isInHouse: boolean }
    civil: { fee: number, hours: number, isInHouse: boolean }
    mechanical: { fee: number, hours: number, isInHouse: boolean }
    electrical: { fee: number, hours: number, isInHouse: boolean }
    plumbing: { fee: number, hours: number, isInHouse: boolean }
    telecommunications: { fee: number, hours: number, isInHouse: boolean }
  }
  teamBreakdown: {
    designer1: { hours: number, cost: number }
    designer2: { hours: number, cost: number }
    architect: { hours: number, cost: number }
    engineer: { hours: number, cost: number }
    principal: { hours: number, cost: number }
  }
  onDiscountChange?: (discount: number) => void
  onDisciplineToggle?: (discipline: string, isInHouse: boolean) => void
}

export function FeeAnalysis({
  topDownFee,
  bottomUpFee,
  contractPrice,
  totalHours,
  disciplines,
  teamBreakdown,
  onDiscountChange,
  onDisciplineToggle
}: FeeAnalysisProps) {
  const [discount, setDiscount] = useState(25)
  const variance = bottomUpFee - topDownFee
  const variancePercent = ((variance / topDownFee) * 100).toFixed(1)
  
  const handleDiscountChange = (value: number[]) => {
    setDiscount(value[0])
    onDiscountChange?.(value[0])
  }

  const totalTeamCost = Object.values(teamBreakdown).reduce((sum, member) => sum + member.cost, 0)
  const averageRate = totalTeamCost / totalHours

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Down Fee Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Top-Down Fee Analysis
              <Info className="h-4 w-4 text-gray-400" />
            </CardTitle>
            <CardDescription>Market-based pricing approach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-600">SCOPE</div>
                
                {Object.entries(disciplines).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        value.isInHouse ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {value.isInHouse ? 'In-House' : 'Consultant'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={value.isInHouse}
                        onCheckedChange={(checked) => onDisciplineToggle?.(key, checked)}
                        className="scale-75"
                      />
                      <div className="text-right">
                        <div className="font-semibold">${value.fee.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{value.hours} hrs</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Market Fee</span>
                  <span className="text-2xl font-bold">${topDownFee.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  21.8% of construction • {totalHours.toLocaleString()} hrs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom-Up Fee Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Bottom-Up Fee Analysis
              <Info className="h-4 w-4 text-gray-400" />
            </CardTitle>
            <CardDescription>Team-based cost approach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-600">TEAM MEMBER</div>
                
                {Object.entries(teamBreakdown).map(([role, data]) => (
                  <div key={role} className="flex justify-between items-center py-1">
                    <span className="text-sm capitalize">{role.replace(/\d/, ' $&')}</span>
                    <div className="text-right">
                      <div className="font-semibold">${data.cost.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{data.hours} hrs</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total Internal Cost</span>
                  <span className="text-2xl font-bold text-green-600">${bottomUpFee.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Average Rate: ${averageRate.toFixed(0)}/hour
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variance Analysis */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Variance Analysis</CardTitle>
          <CardDescription>Comparison between market and internal pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Top-Down</div>
              <div className="text-2xl font-bold">${topDownFee.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Market Rate</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Bottom-Up</div>
              <div className="text-2xl font-bold text-green-600">${bottomUpFee.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Internal Cost</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Variance</div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                {variance > 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                )}
                <span className={variance > 0 ? 'text-red-600' : 'text-green-600'}>
                  ${Math.abs(variance).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">{variancePercent}% difference</div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Applied Discount</label>
                <span className="text-sm font-bold text-blue-600">{discount}%</span>
              </div>
              <Slider
                value={[discount]}
                onValueChange={handleDiscountChange}
                min={0}
                max={25}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Maximum: 25%</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium">Final Contract Price</span>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">${contractPrice.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  Effective Rate: ${(contractPrice / totalHours).toFixed(0)}/hr
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}