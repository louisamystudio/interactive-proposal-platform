'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Star, ArrowRight } from 'lucide-react'
import { ThreeOptions } from '@/lib/types'

interface OptionCardsProps {
  options: ThreeOptions
  onSelect?: (option: 'A' | 'B' | 'C') => void
}

export function OptionCards({ options, onSelect }: OptionCardsProps) {
  const optionsList = [
    { key: 'A', data: options.A, emphasis: 'premium', order: 1 },
    { key: 'B', data: options.B, emphasis: 'standard', order: 2 },
    { key: 'C', data: options.C, emphasis: 'basic', order: 3 }
  ]
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Investment Level</h2>
        <p className="text-lg text-muted-foreground">
          Each option is carefully designed to deliver exceptional value at different investment points
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {optionsList.map((option) => {
          const isRecommended = option.key === 'A'
          
          return (
            <Card 
              key={option.key}
              className={`relative transition-all hover:shadow-lg ${
                isRecommended 
                  ? 'ring-2 ring-blue-500 shadow-xl scale-105 lg:scale-110' 
                  : 'hover:scale-105'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="h-3 w-3 mr-1" />
                    RECOMMENDED
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-2xl">
                  Option {option.key}
                </CardTitle>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    {formatCurrency(option.data.investment)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fixed Investment
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Value Promise */}
                <div className="text-center pb-4 border-b">
                  <p className="text-sm italic text-gray-600">
                    "{option.data.valuePromise}"
                  </p>
                </div>
                
                {/* What's Included */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm uppercase tracking-wide text-gray-500">
                    Included Services
                  </p>
                  <ul className="space-y-2">
                    {option.data.scope.slice(0, 5).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          isRecommended ? 'text-blue-500' : 'text-green-500'
                        }`} />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                    {option.data.scope.length > 5 && (
                      <li className="text-sm text-muted-foreground ml-6">
                        + {option.data.scope.length - 5} more services
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Not Included (if available) */}
                {option.data.notIncluded && option.data.notIncluded.length > 0 && (
                  <div className="space-y-2 pt-3 border-t">
                    <p className="font-semibold text-sm uppercase tracking-wide text-gray-500">
                      Not Included
                    </p>
                    <ul className="space-y-1">
                      {option.data.notIncluded.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* CTA Button */}
                <div className="pt-4">
                  <Button 
                    variant={isRecommended ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => onSelect?.(option.key as 'A' | 'B' | 'C')}
                  >
                    Select Option {option.key}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Value Anchoring Statement */}
      <div className="text-center pt-6">
        <Card className="bg-blue-50 border-blue-200 max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>Why Option A?</strong> Our most comprehensive package ensures complete peace of mind 
              with full architectural and engineering integration, maximizing your property's value and 
              minimizing costly revisions during construction.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}