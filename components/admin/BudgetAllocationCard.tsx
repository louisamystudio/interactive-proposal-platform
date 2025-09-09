'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Home, Trees } from 'lucide-react'
import { CalculationResults } from '@/lib/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface BudgetAllocationCardProps {
  results: CalculationResults
}

export function BudgetAllocationCard({ results }: BudgetAllocationCardProps) {
  const { budgets } = results
  
  // Calculate normalized percentages (should sum to 100%)
  const total = budgets.totalBudget
  const shellPercentage = (budgets.shell / total * 100)
  const interiorPercentage = (budgets.interior / total * 100)
  const landscapePercentage = (budgets.landscape / total * 100)
  
  // Default expected percentages
  const defaultPercentages = {
    shell: 66,
    interior: 22,
    landscape: 12
  }
  
  // Data for the donut chart
  const chartData = [
    { 
      name: 'Shell', 
      value: budgets.shell, 
      percentage: shellPercentage,
      color: '#3B82F6',
      icon: Building2
    },
    { 
      name: 'Interior', 
      value: budgets.interior, 
      percentage: interiorPercentage,
      color: '#10B981',
      icon: Home
    },
    { 
      name: 'Landscape', 
      value: budgets.landscape, 
      percentage: landscapePercentage,
      color: '#F59E0B',
      icon: Trees
    }
  ]
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  
  // Custom label for the donut chart
  const renderCustomLabel = (entry: any) => {
    return `${entry.name}: ${formatPercentage(entry.percentage)}`
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Budget Allocation</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total: {formatCurrency(budgets.totalBudget)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Detailed Breakdown */}
          <div className="space-y-4">
            {chartData.map((item) => {
              const Icon = item.icon
              const variance = item.percentage - defaultPercentages[item.name.toLowerCase() as keyof typeof defaultPercentages]
              const isDefault = Math.abs(variance) < 0.5
              
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: item.color }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(item.value)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatPercentage(item.percentage)}
                        {!isDefault && (
                          <span className={`ml-1 text-xs ${variance > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                            ({variance > 0 ? '+' : ''}{variance.toFixed(1)}% vs default)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar showing percentage */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                  
                  {/* Default tick mark */}
                  <div className="relative h-2">
                    <div 
                      className="absolute w-0.5 h-2 bg-gray-400"
                      style={{ left: `${defaultPercentages[item.name.toLowerCase() as keyof typeof defaultPercentages]}%` }}
                      title={`Default: ${defaultPercentages[item.name.toLowerCase() as keyof typeof defaultPercentages]}%`}
                    />
                  </div>
                </div>
              )
            })}
            
            {/* Normalization Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Normalized to 100%:</strong> Shell ({formatPercentage(shellPercentage)}) + 
                Interior ({formatPercentage(interiorPercentage)}) + 
                Landscape ({formatPercentage(landscapePercentage)}) = 100%
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Default distribution: Shell 66% • Interior 22% • Landscape 12%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}