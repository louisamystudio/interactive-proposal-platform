'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { DollarSign, Target } from 'lucide-react'

interface CostRange {
  min: number
  target: number
  max: number
  current: number
}

interface CostRangeSlidersProps {
  newConstruction: CostRange
  remodel: CostRange
  onNewChange: (value: number) => void
  onRemodelChange: (value: number) => void
  disabled?: boolean
}

export function CostRangeSliders({
  newConstruction,
  remodel,
  onNewChange,
  onRemodelChange,
  disabled = false
}: CostRangeSlidersProps) {
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Cost Targets
        </CardTitle>
        <CardDescription>
          Per square foot pricing based on Puerto Rico construction cost database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Construction PSF */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              New Construction PSF
            </label>
            <span className="text-lg font-bold text-blue-600">
              {formatCurrency(newConstruction.current)}/ft²
            </span>
          </div>
          
          <div className="relative">
            <Slider
              value={[newConstruction.current]}
              onValueChange={([value]) => onNewChange(value)}
              min={newConstruction.min}
              max={newConstruction.max}
              step={1}
              disabled={disabled}
              className="relative"
            />
            
            {/* Range indicators */}
            <div className="relative mt-1 h-6">
              {/* Min marker */}
              <div 
                className="absolute flex flex-col items-center"
                style={{ left: '0%' }}
              >
                <div className="w-0.5 h-3 bg-gray-400" />
                <span className="text-xs text-gray-500 mt-1">
                  {formatCurrency(newConstruction.min)}
                </span>
              </div>
              
              {/* Target marker (DB default) */}
              <div 
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${((newConstruction.target - newConstruction.min) / (newConstruction.max - newConstruction.min)) * 100}%` 
                }}
              >
                <div className="w-0.5 h-4 bg-blue-500" />
                <span className="text-xs font-semibold text-blue-600 mt-1">
                  DB: {formatCurrency(newConstruction.target)}
                </span>
              </div>
              
              {/* Max marker */}
              <div 
                className="absolute flex flex-col items-center"
                style={{ left: '100%', transform: 'translateX(-100%)' }}
              >
                <div className="w-0.5 h-3 bg-gray-400" />
                <span className="text-xs text-gray-500 mt-1">
                  {formatCurrency(newConstruction.max)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Variance from DB default */}
          {Math.abs(newConstruction.current - newConstruction.target) > 5 && (
            <div className="text-xs text-orange-600">
              {newConstruction.current > newConstruction.target ? '+' : ''}
              {formatCurrency(newConstruction.current - newConstruction.target)} from DB default
            </div>
          )}
        </div>
        
        {/* Remodel PSF */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Remodel PSF
            </label>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(remodel.current)}/ft²
            </span>
          </div>
          
          <div className="relative">
            <Slider
              value={[remodel.current]}
              onValueChange={([value]) => onRemodelChange(value)}
              min={remodel.min}
              max={remodel.max}
              step={1}
              disabled={disabled}
              className="relative"
            />
            
            {/* Range indicators */}
            <div className="relative mt-1 h-6">
              {/* Min marker */}
              <div 
                className="absolute flex flex-col items-center"
                style={{ left: '0%' }}
              >
                <div className="w-0.5 h-3 bg-gray-400" />
                <span className="text-xs text-gray-500 mt-1">
                  {formatCurrency(remodel.min)}
                </span>
              </div>
              
              {/* Target marker (DB default) */}
              <div 
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${((remodel.target - remodel.min) / (remodel.max - remodel.min)) * 100}%` 
                }}
              >
                <div className="w-0.5 h-4 bg-green-500" />
                <span className="text-xs font-semibold text-green-600 mt-1">
                  DB: {formatCurrency(remodel.target)}
                </span>
              </div>
              
              {/* Max marker */}
              <div 
                className="absolute flex flex-col items-center"
                style={{ left: '100%', transform: 'translateX(-100%)' }}
              >
                <div className="w-0.5 h-3 bg-gray-400" />
                <span className="text-xs text-gray-500 mt-1">
                  {formatCurrency(remodel.max)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Variance from DB default */}
          {Math.abs(remodel.current - remodel.target) > 5 && (
            <div className="text-xs text-orange-600">
              {remodel.current > remodel.target ? '+' : ''}
              {formatCurrency(remodel.current - remodel.target)} from DB default
            </div>
          )}
        </div>
        
        {/* Database status note */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Database Status:</strong> Min/Target/Max values from Puerto Rico construction cost index. 
            Target represents typical costs for this building classification.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}