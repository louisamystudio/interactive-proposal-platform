'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetDonutChart } from '@/components/ui/budget-donut-chart'
import { Building2, DollarSign, Info } from 'lucide-react'
import { ProjectBudgets } from '@/lib/types'

interface BudgetOverviewCardProps {
  budgets: ProjectBudgets
  newAreaFt2: number
  existingAreaFt2: number
}

export function BudgetOverviewCard({ budgets, newAreaFt2, existingAreaFt2 }: BudgetOverviewCardProps) {
  const totalArea = newAreaFt2 + existingAreaFt2
  const newPercent = totalArea > 0 ? (newAreaFt2 / totalArea) * 100 : 0
  const remodelPercent = totalArea > 0 ? (existingAreaFt2 / totalArea) * 100 : 0

  const constructionBudgetData = [
    { name: 'Shell', value: budgets.shellBudget, percentage: 66, color: '#2563eb' },
    { name: 'Interior', value: budgets.interiorBudget, percentage: 22, color: '#10b981' },
    { name: 'Landscape', value: budgets.landscapeBudget, percentage: 12, color: '#f59e0b' }
  ]

  const areaDistributionData = [
    { name: 'New Construction', value: budgets.newBudget, percentage: newPercent, color: '#8b5cf6' },
    { name: 'Remodel', value: budgets.remodelBudget, percentage: remodelPercent, color: '#ec4899' }
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Construction Budget Overview
            </CardTitle>
            <CardDescription className="mt-2 max-w-3xl">
              Estimated minimum cost to execute construction based on PR building-cost database.
              <span className="font-semibold text-blue-600"> Design fees are calculated separately.</span>
            </CardDescription>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Construction Budget</div>
            <div className="text-2xl font-bold text-blue-900">
              ${budgets.totalBudget.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New vs Remodel Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Area Distribution
              <Info className="h-4 w-4 text-gray-400" />
            </h3>
            <BudgetDonutChart
              data={areaDistributionData}
              totalLabel="Total Budget"
              centerValue={`$${budgets.totalBudget.toLocaleString()}`}
            />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  New ({newAreaFt2.toLocaleString()} ft²)
                </span>
                <span className="font-medium">${budgets.newBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
                  Remodel ({existingAreaFt2.toLocaleString()} ft²)
                </span>
                <span className="font-medium">${budgets.remodelBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Budget Category Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Budget Categories
              <Info className="h-4 w-4 text-gray-400" />
            </h3>
            <BudgetDonutChart
              data={constructionBudgetData}
              totalLabel="Categories"
              centerValue="100%"
            />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  Shell (66%)
                </span>
                <span className="font-medium">${budgets.shellBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  Interior (22%)
                </span>
                <span className="font-medium">${budgets.interiorBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                  Landscape (12%)
                </span>
                <span className="font-medium">${budgets.landscapeBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Message */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Important Distinction</p>
              <p className="text-sm text-amber-700 mt-1">
                This construction budget represents the <strong>minimum cost to build</strong> your project. 
                Professional design fees are calculated separately based on project complexity and scope of services.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
