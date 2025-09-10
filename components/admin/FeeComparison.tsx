'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react'
import { CalculationResults } from '@/lib/types'

interface FeeComparisonProps {
  results: CalculationResults
  discount: number
  onDiscountChange: (value: number) => void
}

export function FeeComparison({ results, discount, onDiscountChange }: FeeComparisonProps) {
  if (!results || !results.fees || !results.hours) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Loading fee comparison...
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const { fees, hours } = results
  
  // Calculate blended rate from fees/hours
  const blendedRate = hours.totalHours > 0 ? Math.round(fees.louisAmyFee / hours.totalHours / 1.6) : 120
  
  // Calculate discounted market fee
  const discountedMarketFee = fees.marketFee * (1 - discount / 100)
  
  // Contract price is max of discounted market or Louis Amy bottom-up
  const contractPrice = Math.max(discountedMarketFee, fees.louisAmyFee)
  
  // Determine which method wins
  const winningMethod = contractPrice === discountedMarketFee ? 'market' : 'louisAmy'
  
  return (
    <div className="space-y-6">
      {/* Top-Down vs Bottom-Up Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Down Market Analysis */}
        <Card className={winningMethod === 'market' ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top-Down Market Analysis</CardTitle>
              <Badge variant={winningMethod === 'market' ? 'default' : 'secondary'}>
                Market-Based
              </Badge>
            </div>
            <CardDescription>
              Industry standard pricing based on construction budget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Market Rate (21.79%)</span>
                <span className="font-semibold">${fees.marketFee?.toLocaleString() || '0'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Discount ({discount}%)</span>
                <span className="text-red-600">-${((fees.marketFee || 0) * discount / 100).toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Discounted Market</span>
                  <span className="text-xl font-bold">${discountedMarketFee?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
            
            {/* Breakdown by scope */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <div className="text-xs font-medium text-gray-600 mb-2">Market Breakdown</div>
              <div className="flex justify-between text-sm">
                <span>Shell (15%)</span>
                <span>${((results.budgets?.shellBudget || 0) * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Interior (35%)</span>
                <span>${((results.budgets?.interiorBudget || 0) * 0.35).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Landscape (12%)</span>
                <span>${((results.budgets?.landscapeBudget || 0) * 0.12).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom-Up Louis Amy Analysis */}
        <Card className={winningMethod === 'louisAmy' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bottom-Up Louis Amy Analysis</CardTitle>
              <Badge variant={winningMethod === 'louisAmy' ? 'success' : 'secondary'}>
                Hours-Based
              </Badge>
            </div>
            <CardDescription>
              Precise calculation based on actual hours and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Hours</span>
                <span className="font-semibold">{hours.totalHours?.toLocaleString() || '0'} hrs</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Blended Rate</span>
                <span className="font-semibold">${blendedRate}/hr</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overhead (1.6x)</span>
                <span className="text-gray-600">${((hours.totalHours || 0) * blendedRate * 0.6).toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Louis Amy Fee</span>
                  <span className="text-xl font-bold">${fees.louisAmyFee?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
            
            {/* Hours by discipline */}
            <div className="bg-green-50 rounded-lg p-3 space-y-1">
              <div className="text-xs font-medium text-gray-600 mb-2">Hours by Discipline</div>
              <div className="flex justify-between text-sm">
                <span>Architecture</span>
                <span>{Math.round((hours.totalHours || 0) * 0.45).toLocaleString()} hrs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Structural</span>
                <span>{Math.round((hours.totalHours || 0) * 0.25).toLocaleString()} hrs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>MEP/Civil</span>
                <span>{Math.round((hours.totalHours || 0) * 0.30).toLocaleString()} hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Price Result */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contract Price</CardTitle>
            <Badge variant="default" className="text-lg px-3 py-1">
              ${contractPrice?.toLocaleString() || '0'}
            </Badge>
          </div>
          <CardDescription>
            Maximum of discounted market (${discountedMarketFee?.toLocaleString() || '0'}) and Louis Amy (${fees.louisAmyFee?.toLocaleString() || '0'})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Discount Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Admin Discount</label>
                <span className="text-sm font-bold">{discount}%</span>
              </div>
              <Slider
                value={[discount]}
                onValueChange={(values) => onDiscountChange(values[0])}
                max={25}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Max 25%</span>
              </div>
            </div>
            
            {/* Winner Indicator */}
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
              {winningMethod === 'market' ? (
                <>
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">
                    <strong>Market method wins</strong> - Discounted market price is higher than bottom-up calculation
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm">
                    <strong>Louis Amy method wins</strong> - Bottom-up calculation exceeds discounted market price
                  </span>
                </>
              )}
            </div>
            
            {/* Savings Display */}
            <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-700" />
                <span className="font-medium">Client Savings</span>
              </div>
              <span className="text-xl font-bold text-green-700">
                ${((fees.marketFee || 0) - (contractPrice || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Options</CardTitle>
          <CardDescription>
            Three strategic tiers based on contract price
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-700 mb-1">Option A (Premium)</div>
              <div className="text-2xl font-bold">${results.options?.A?.investment?.toLocaleString() || '0'}</div>
              <div className="text-xs text-gray-600 mt-1">Market Rate</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-700 mb-1">Option B (Contract)</div>
              <div className="text-2xl font-bold">${results.options?.B?.investment?.toLocaleString() || '0'}</div>
              <div className="text-xs text-gray-600 mt-1">Recommended</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">Option C (Essential)</div>
              <div className="text-2xl font-bold">${results.options?.C?.investment?.toLocaleString() || '0'}</div>
              <div className="text-xs text-gray-600 mt-1">Permit-Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}