'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react'
import { CalculationResults } from '@/lib/types'

interface SanityCheckProps {
  results: CalculationResults
  discount: number
}

export function SanityCheck({ results, discount }: SanityCheckProps) {
  const { fees, budgets } = results
  
  // Calculate metrics
  const topDownFee = fees.marketFee
  const bottomUpFee = fees.louisAmyFee
  const discountedMarketFee = topDownFee * (1 - discount / 100)
  const contractPrice = Math.max(discountedMarketFee, bottomUpFee)
  
  // Calculate variance
  const variance = ((topDownFee - bottomUpFee) / topDownFee * 100)
  // Use total budget / average PSF as a proxy for area
  const estimatedArea = budgets.totalBudget / 195 // Using $195/sqft as average
  const effectiveRate = estimatedArea > 0 ? contractPrice / estimatedArea : 0
  const margin = ((contractPrice - bottomUpFee) / contractPrice * 100)
  
  // Determine which method wins
  const winner = discountedMarketFee > bottomUpFee ? 'market' : 'bottomUp'
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${Math.abs(value).toFixed(1)}%`
  
  const cards = [
    {
      title: 'Top-Down (Market)',
      value: topDownFee,
      subtitle: `${(topDownFee / budgets.totalBudget * 100).toFixed(2)}% of budget`,
      color: 'blue'
    },
    {
      title: 'Bottom-Up (Louis Amy)',
      value: bottomUpFee,
      subtitle: `Internal cost basis`,
      color: 'green'
    },
    {
      title: 'Contract Price',
      value: contractPrice,
      subtitle: `Max of two methods`,
      color: winner === 'market' ? 'blue' : 'green',
      isWinner: true
    }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sanity Check</h3>
        <div className="flex gap-2">
          <Badge variant={Math.abs(variance) < 10 ? 'default' : 'secondary'}>
            Variance: {formatPercentage(variance)}
            {variance > 0 ? <TrendingUp className="ml-1 h-3 w-3 inline" /> : <TrendingDown className="ml-1 h-3 w-3 inline" />}
          </Badge>
          <Badge variant="outline">
            Effective: ${effectiveRate.toFixed(0)}/ft²
          </Badge>
          {margin > 0 && (
            <Badge variant="outline" className="text-green-600">
              Margin: {formatPercentage(margin)}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card 
            key={card.title}
            className={`relative ${card.isWinner ? 'ring-2 ring-green-500' : ''}`}
          >
            {card.isWinner && winner && (
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Winner
                </Badge>
              </div>
            )}
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{formatCurrency(card.value)}</p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                
                {/* Visual indicator bar */}
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        card.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((card.value / topDownFee) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Analysis Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Method Used</p>
              <p className="font-semibold capitalize">
                {winner === 'market' ? 'Market (Top-Down)' : 'Cost-Plus (Bottom-Up)'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Client Savings</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(topDownFee - contractPrice)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Applied Discount</p>
              <p className="font-semibold">{discount}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price Confidence</p>
              <p className="font-semibold">
                {Math.abs(variance) < 10 ? '✅ High' : Math.abs(variance) < 20 ? '⚠️ Medium' : '⚡ Review'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}