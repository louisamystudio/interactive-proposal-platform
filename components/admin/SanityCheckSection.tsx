'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { AlertCircle, TrendingUp, Calculator, DollarSign } from 'lucide-react'
import { FeeStructure } from '@/lib/types'

interface SanityCheckSectionProps {
  fees: FeeStructure
  totalBudget: number
  onDiscountChange?: (discount: number) => void
}

export function SanityCheckSection({ fees, totalBudget, onDiscountChange }: SanityCheckSectionProps) {
  const [discount, setDiscount] = useState(0)
  
  // Calculate discounted market fee
  const discountedMarketFee = fees.marketFee * (1 - discount / 100)
  
  // Final contract price is the higher of discounted market or Louis Amy fee
  const contractPrice = Math.max(discountedMarketFee, fees.louisAmyFee)
  
  // Calculate variance
  const variance = ((fees.marketFee - fees.louisAmyFee) / fees.louisAmyFee * 100).toFixed(1)
  const isNegativeVariance = parseFloat(variance) < 0
  
  const handleDiscountChange = (value: number[]) => {
    const newDiscount = value[0]
    setDiscount(newDiscount)
    onDiscountChange?.(newDiscount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sanity Check & Pricing</CardTitle>
            <CardDescription>
              Compare market rate vs internal cost to set final contract price
            </CardDescription>
          </div>
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trio of cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top-Down (Market) */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top-Down (Market)
              </CardTitle>
              <CardDescription className="text-xs">
                {(fees.marketPercentage * 100).toFixed(1)}% of construction • 1,025 hrs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${fees.marketFee.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Industry standard
              </div>
            </CardContent>
          </Card>

          {/* Bottom-Up (Louis Amy) */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Bottom-Up (Louis Amy)
              </CardTitle>
              <CardDescription className="text-xs">
                {(fees.louisAmyPercentage * 100).toFixed(1)}% of construction • 1,184 hrs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${fees.louisAmyFee.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Internal cost
              </div>
            </CardContent>
          </Card>

          {/* Contract Price */}
          <Card className="border-2 border-green-500 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Contract Price
              </CardTitle>
              <CardDescription className="text-xs">
                Final client price
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                ${contractPrice.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {discount > 0 ? `${discount}% discount applied` : 'No discount'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variance indicator */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Market vs Internal Variance</span>
            <span className={`text-sm font-bold ${isNegativeVariance ? 'text-red-600' : 'text-green-600'}`}>
              {isNegativeVariance ? '' : '+'}{variance}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {isNegativeVariance 
              ? 'Internal cost exceeds market rate - consider market pricing'
              : 'Market rate exceeds internal cost - opportunity for value pricing'}
          </div>
        </div>

        {/* Discount slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Market Discount</h4>
              <p className="text-sm text-muted-foreground">
                Apply discount to market rate (max 25%)
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{discount}%</div>
              <div className="text-sm text-muted-foreground">
                Saves ${((fees.marketFee * discount / 100)).toLocaleString()}
              </div>
            </div>
          </div>
          
          <Slider
            value={[discount]}
            onValueChange={handleDiscountChange}
            max={25}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>25%</span>
          </div>
        </div>

        {/* Final pricing summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Final Contract Price</p>
              <p className="text-sm text-muted-foreground">
                Maximum of discounted market or internal cost
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                ${contractPrice.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Effective rate: ${(contractPrice / totalBudget * 100).toFixed(1)}/ft²
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
