'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Building, Wrench } from 'lucide-react'
import { DisciplineBudgets, ProjectBudgets } from '@/lib/types'

interface DisciplineAllocationCardProps {
  disciplines: DisciplineBudgets
  budgets: ProjectBudgets
  newPercent: number
  remodelPercent: number
}

interface DisciplineCardProps {
  name: string
  amount: number
  percentage: number
  shellBudget: number
  newPercent: number
  remodelPercent: number
  icon?: React.ReactNode
  isRemainder?: boolean
}

function DisciplineCard({ 
  name, 
  amount, 
  percentage, 
  shellBudget, 
  newPercent, 
  remodelPercent,
  icon,
  isRemainder 
}: DisciplineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const newAmount = (amount * newPercent) / 100
  const remodelAmount = (amount * remodelPercent) / 100

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      isRemainder ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {icon || <Wrench className="h-5 w-5 text-gray-500" />}
          <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p className="text-sm text-gray-600">
              {percentage.toFixed(1)}% of Shell Budget
              {isRemainder && ' (remainder)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold">${amount.toLocaleString()}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">New Construction ({newPercent.toFixed(0)}%)</span>
            <span className="font-medium">${newAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remodel ({remodelPercent.toFixed(0)}%)</span>
            <span className="font-medium">${remodelAmount.toLocaleString()}</span>
          </div>
          <div className="mt-2 pt-2 border-t flex justify-between text-sm font-semibold">
            <span>Total {name}</span>
            <span>${amount.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function DisciplineAllocationCard({ 
  disciplines, 
  budgets, 
  newPercent, 
  remodelPercent 
}: DisciplineAllocationCardProps) {
  // Calculate percentages of shell budget
  const architecturePercent = (disciplines.architectureBudget / budgets.shellBudget) * 100
  const structuralPercent = (disciplines.structuralBudget / budgets.shellBudget) * 100
  const civilPercent = (disciplines.civilBudget / budgets.shellBudget) * 100
  const mechanicalPercent = (disciplines.mechanicalBudget / budgets.shellBudget) * 100
  const electricalPercent = (disciplines.electricalBudget / budgets.shellBudget) * 100
  const plumbingPercent = (disciplines.plumbingBudget / budgets.shellBudget) * 100
  const telecomPercent = (disciplines.telecomBudget / budgets.shellBudget) * 100

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Discipline Allocation</CardTitle>
        <CardDescription>
          How the Shell budget ({budgets.shellBudget.toLocaleString()}) is distributed across disciplines.
          Architecture receives the remainder after engineering allocations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Architecture - shown first as it's the largest */}
          <DisciplineCard
            name="Architecture"
            amount={disciplines.architectureBudget}
            percentage={architecturePercent}
            shellBudget={budgets.shellBudget}
            newPercent={newPercent}
            remodelPercent={remodelPercent}
            icon={<Building className="h-5 w-5 text-blue-600" />}
            isRemainder={true}
          />
          
          {/* Engineering disciplines */}
          <DisciplineCard
            name="Structural Engineering"
            amount={disciplines.structuralBudget}
            percentage={structuralPercent}
            shellBudget={budgets.shellBudget}
            newPercent={newPercent}
            remodelPercent={remodelPercent}
          />
          
          <DisciplineCard
            name="Civil Engineering"
            amount={disciplines.civilBudget}
            percentage={civilPercent}
            shellBudget={budgets.shellBudget}
            newPercent={newPercent}
            remodelPercent={remodelPercent}
          />
          
          <DisciplineCard
            name="Mechanical Engineering"
            amount={disciplines.mechanicalBudget}
            percentage={mechanicalPercent}
            shellBudget={budgets.shellBudget}
            newPercent={newPercent}
            remodelPercent={remodelPercent}
          />
          
          <DisciplineCard
            name="Electrical Engineering"
            amount={disciplines.electricalBudget}
            percentage={electricalPercent}
            shellBudget={budgets.shellBudget}
            newPercent={newPercent}
            remodelPercent={remodelPercent}
          />
          
          <DisciplineCard
            name="Plumbing Engineering"
            amount={disciplines.plumbingBudget}
            percentage={plumbingPercent}
            shellBudget={budgets.shellBudget}
            newPercent={newPercent}
            remodelPercent={remodelPercent}
          />
          
          <DisciplineCard
            name="Telecom Engineering"
            amount={disciplines.telecomBudget}
            percentage={telecomPercent}
            shellBudget={budgets.shellBudget}
            newPercent={newPercent}
            remodelPercent={remodelPercent}
          />
        </div>
        
        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Shell Budget Allocated</span>
            <span className="text-lg font-bold">${budgets.shellBudget.toLocaleString()}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Architecture = Shell Budget - Σ(Engineering Disciplines)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
