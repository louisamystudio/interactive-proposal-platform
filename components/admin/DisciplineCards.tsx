'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Building2, HardHat, Wrench, Zap, Droplets, Wifi } from 'lucide-react'
import { CalculationResults } from '@/lib/types'

interface DisciplineCardsProps {
  results: CalculationResults
}

const disciplineIcons = {
  Architecture: Building2,
  Structural: HardHat,
  Civil: Wrench,
  Mechanical: Zap,
  Electrical: Zap,
  Plumbing: Droplets,
  Telecom: Wifi
}

export function DisciplineCards({ results }: DisciplineCardsProps) {
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const { budgets, disciplines } = results
  
  // For area split, we'll use budget ratios since areas aren't directly available
  const totalBudget = budgets.totalBudget
  const newBudgetRatio = totalBudget > 0 ? budgets.newBudget / totalBudget : 0.5
  const remodelBudgetRatio = totalBudget > 0 ? budgets.remodelBudget / totalBudget : 0.5
  
  const toggleCard = (discipline: string) => {
    setExpandedCards(prev =>
      prev.includes(discipline)
        ? prev.filter(d => d !== discipline)
        : [...prev, discipline]
    )
  }
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  
  // Get disciplines array with percentages
  const disciplinesList = [
    {
      name: 'Architecture',
      amount: disciplines.architectureBudget,
      percentage: (disciplines.architectureBudget / budgets.shellBudget) * 100,
      isRemainder: true
    },
    {
      name: 'Structural',
      amount: disciplines.structuralBudget,
      percentage: (disciplines.structuralBudget / budgets.shellBudget) * 100,
      isRemainder: false
    },
    {
      name: 'Civil',
      amount: disciplines.civilBudget,
      percentage: (disciplines.civilBudget / budgets.shellBudget) * 100,
      isRemainder: false
    },
    {
      name: 'Mechanical',
      amount: disciplines.mechanicalBudget,
      percentage: (disciplines.mechanicalBudget / budgets.shellBudget) * 100,
      isRemainder: false
    },
    {
      name: 'Electrical',
      amount: disciplines.electricalBudget,
      percentage: (disciplines.electricalBudget / budgets.shellBudget) * 100,
      isRemainder: false
    },
    {
      name: 'Plumbing',
      amount: disciplines.plumbingBudget,
      percentage: (disciplines.plumbingBudget / budgets.shellBudget) * 100,
      isRemainder: false
    },
    {
      name: 'Telecom',
      amount: disciplines.telecomBudget,
      percentage: (disciplines.telecomBudget / budgets.shellBudget) * 100,
      isRemainder: false
    }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Engineering Disciplines</h3>
        <span className="text-sm text-muted-foreground">
          Total Shell: {formatCurrency(budgets.shellBudget)}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {disciplinesList.map((discipline) => {
          const Icon = disciplineIcons[discipline.name as keyof typeof disciplineIcons] || Building2
          const isExpanded = expandedCards.includes(discipline.name)
          const newAmount = discipline.amount * newBudgetRatio
          const remodelAmount = discipline.amount * remodelBudgetRatio
          
          return (
            <Card 
              key={discipline.name}
              className={`transition-all ${discipline.isRemainder ? 'ring-2 ring-blue-500/20' : ''}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{discipline.name}</span>
                    {discipline.isRemainder && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        Remainder
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleCard(discipline.name)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold">
                      {formatCurrency(discipline.amount)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(discipline.percentage)} of Shell
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        discipline.isRemainder ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(discipline.percentage, 100)}%` }}
                    />
                  </div>
                  
                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">New Construction:</span>
                          <span className="font-medium">{formatCurrency(newAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remodel:</span>
                          <span className="font-medium">{formatCurrency(remodelAmount)}</span>
                        </div>
                      </div>
                      {discipline.isRemainder && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Architecture = Shell - Σ(Engineering Disciplines)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Summary note */}
      <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
        <p>
          💡 <strong>Note:</strong> Architecture is calculated as the remainder after all engineering 
          disciplines are subtracted from the Shell budget. This ensures all Shell costs are 
          properly allocated across disciplines.
        </p>
      </div>
    </div>
  )
}