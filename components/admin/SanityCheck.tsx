'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Info, TrendingUp, DollarSign, Clock } from 'lucide-react'
import { useState } from 'react'

interface SanityCheckProps {
  topDownFee: number
  bottomUpFee: number
  contractPrice: number
  totalHours: number
  constructionBudget: number
  onDiscountChange?: (discount: number) => void
}

export function SanityCheck({
  topDownFee,
  bottomUpFee,
  contractPrice,
  totalHours,
  constructionBudget,
  onDiscountChange
}: SanityCheckProps) {
  const [discount, setDiscount] = useState(25)
  const variance = bottomUpFee - topDownFee
  const variancePercent = ((variance / topDownFee) * 100).toFixed(1)
  const projectMargin = ((contractPrice - bottomUpFee) / contractPrice * 100).toFixed(1)
  const effectiveRate = contractPrice / totalHours

  const handleDiscountChange = (value: number[]) => {
    setDiscount(value[0])
    onDiscountChange?.(value[0])
  }

  const marketPrice = topDownFee
  const discountedMarket = marketPrice * (1 - discount / 100)
  const finalContract = Math.max(discountedMarket, bottomUpFee)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sanity Check & Pricing</CardTitle>
          <CardDescription>Comprehensive fee analysis and contract validation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Three-Column Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sanity Check */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sanity Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Top-Down</div>
                  <div className="text-2xl font-bold text-blue-600">${topDownFee.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">
                    {((topDownFee / constructionBudget) * 100).toFixed(1)}% of construction • {totalHours.toLocaleString()} hrs
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scan to BIM (1%)</span>
                    <span>${(constructionBudget * 0.01).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Building Shell (12%)</span>
                    <span>${(constructionBudget * 0.12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interior (5%)</span>
                    <span>${(constructionBudget * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Landscape (3%)</span>
                    <span>${(constructionBudget * 0.03).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-1">Bottom-Up</div>
                  <div className="text-2xl font-bold text-green-600">${bottomUpFee.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">
                    {((bottomUpFee / constructionBudget) * 100).toFixed(1)}% of construction • {totalHours.toLocaleString()} hrs
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scan to BIM (1%)</span>
                    <span>${(constructionBudget * 0.01).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Building Shell (10%)</span>
                    <span>${(constructionBudget * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interior (5%)</span>
                    <span>${(constructionBudget * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Landscape (3%)</span>
                    <span>${(constructionBudget * 0.03).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-1">Variance</div>
                  <div className={`text-xl font-bold ${variance < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {variancePercent}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {variance < 0 ? 'Below market' : 'Above market'} by ${Math.abs(variance).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Pricing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Market Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Market Price</div>
                  <div className="text-3xl font-bold">${marketPrice.toLocaleString()}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Maximum Discount</label>
                      <span className="text-sm font-bold text-blue-600">-{discount}%</span>
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
                      <span>25%</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Discount Selection</div>
                    <div className="mt-2 h-8 relative bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded">
                      <div
                        className="absolute top-0 h-full w-1 bg-blue-600"
                        style={{ left: `${discount * 4}%` }}
                      />
                      <div
                        className="absolute -top-6 text-xs font-medium"
                        style={{ left: `${discount * 4}%`, transform: 'translateX(-50%)' }}
                      >
                        {discount}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Applied Discount</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${(marketPrice * discount / 100).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Price */}
            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contract Price</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Final Contract Price</div>
                  <div className="text-3xl font-bold text-blue-600">${contractPrice.toLocaleString()}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Effective Rate</div>
                    <div className="text-xl font-semibold">${effectiveRate.toFixed(0)}/ft²</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Project Margin</div>
                    <div className={`text-xl font-semibold ${Number(projectMargin) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {projectMargin}%
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                    <div className="text-xl font-semibold">{totalHours.toLocaleString()}</div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-600">
                    Contract = max(Market × {100 - discount}%, Bottom-Up)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  )
}