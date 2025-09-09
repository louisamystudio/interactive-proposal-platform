'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Calculator, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import { FeeStructure } from '@/lib/types'

interface FeeComparisonProps {
  fees: FeeStructure
  totalBudget: number
  totalHours: number
  category: number
  onDiscountChange?: (discount: number) => void
}

export function FeeComparison({ 
  fees, 
  totalBudget, 
  totalHours,
  category,
  onDiscountChange 
}: FeeComparisonProps) {
  const [discount, setDiscount] = useState(0)
  
  // Calculate discounted market fee
  const discountedMarketFee = fees.marketFee * (1 - discount / 100)
  
  // Final contract price is the higher of discounted market or Louis Amy fee
  const contractPrice = Math.max(discountedMarketFee, fees.louisAmyFee)
  
  // Calculate variance
  const variance = ((contractPrice - fees.louisAmyFee) / fees.louisAmyFee * 100).toFixed(1)
  
  const handleDiscountChange = (value: number[]) => {
    setDiscount(value[0])
    if (onDiscountChange) {
      onDiscountChange(value[0])
    }
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Design Fee Analysis</CardTitle>
        <CardDescription>
          Comparing two non-linear fee models to determine professional service pricing.
          Design fees are separate from construction costs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Two Fee Models Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top-Down (Market) */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Top-Down (Market)</h3>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              Industry-standard fee as % of construction cost for Category {category}
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Construction Budget</span>
                <span className="font-medium">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Market Fee Rate</span>
                <span className="font-medium">{(fees.marketFee / totalBudget * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Category {category} Multiplier</span>
                <span className="font-medium">1.{category * 10}x</span>
              </div>
              <div className="pt-3 border-t border-blue-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">Market Fee</span>
                  <span className="text-xl font-bold text-blue-900">
                    ${fees.marketFee.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Up (Louis Amy) */}
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Bottom-Up (Louis Amy)</h3>
            </div>
            <p className="text-sm text-green-700 mb-4">
              Time-based fee from non-linear hours curve and internal costs
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Estimated Hours</span>
                <span className="font-medium">{totalHours.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Blended Rate</span>
                <span className="font-medium">${Math.round(fees.louisAmyFee / totalHours)}/hr</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Internal Markup</span>
                <span className="font-medium">Included</span>
              </div>
              <div className="pt-3 border-t border-green-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">Louis Amy Fee</span>
                  <span className="text-xl font-bold text-green-900">
                    ${fees.louisAmyFee.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Slider (Admin Only) */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Market Discount (Admin Only)</h3>
              <p className="text-sm text-gray-600">Apply discount to market fee (max 25%)</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{discount}%</div>
              <div className="text-sm text-gray-600">
                Saves ${((fees.marketFee * discount / 100)).toLocaleString()}
              </div>
            </div>
          </div>
          <Slider
            value={[discount]}
            onValueChange={handleDiscountChange}
            max={25}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>25% (max)</span>
          </div>
        </div>

        {/* Sanity Check Trio */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Top-Down</div>
            <div className="text-lg font-semibold text-blue-600">
              ${discountedMarketFee.toLocaleString()}
            </div>
            {discount > 0 && (
              <div className="text-xs text-gray-500">({discount}% discount)</div>
            )}
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Bottom-Up</div>
            <div className="text-lg font-semibold text-green-600">
              ${fees.louisAmyFee.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">(internal cost)</div>
          </div>
          <div className="text-center p-4 border rounded-lg bg-purple-50 border-purple-300">
            <div className="text-sm text-gray-600 mb-1">Contract Price</div>
            <div className="text-xl font-bold text-purple-900">
              ${contractPrice.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600">
              {contractPrice === fees.louisAmyFee ? 'Bottom-Up' : 'Top-Down'} ({variance}% margin)
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Contract Price Logic</p>
              <p className="text-sm text-amber-700 mt-1">
                The final contract price is set to the <strong>higher of</strong> the discounted market fee 
                or Louis Amy's bottom-up fee. This ensures profitability while remaining competitive.
                Maximum discount is capped at 25% to protect margins.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
