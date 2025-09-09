'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface BudgetDonutProps {
  scanToBIM: number
  buildingShell: number
  interior: number
  landscape: number
  total: number
}

export function BudgetDonut({ 
  scanToBIM, 
  buildingShell, 
  interior, 
  landscape,
  total 
}: BudgetDonutProps) {
  
  // Client-safe budget categories (no internal calculations exposed)
  const data = [
    { 
      name: 'Scan to BIM', 
      value: scanToBIM,
      percentage: ((scanToBIM / total) * 100).toFixed(1),
      color: '#6366F1',
      description: '3D digital twin creation'
    },
    { 
      name: 'Building Shell', 
      value: buildingShell,
      percentage: ((buildingShell / total) * 100).toFixed(1),
      color: '#3B82F6',
      description: 'Architecture & engineering'
    },
    { 
      name: 'Interior Design', 
      value: interior,
      percentage: ((interior / total) * 100).toFixed(1),
      color: '#10B981',
      description: 'Finishes & specifications'
    },
    { 
      name: 'Landscape', 
      value: landscape,
      percentage: ((landscape / total) * 100).toFixed(1),
      color: '#F59E0B',
      description: 'Site & outdoor spaces'
    }
  ]
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">{data.description}</p>
          <p className="font-bold mt-1">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-500">{data.percentage}% of total</p>
        </div>
      )
    }
    return null
  }
  
  // Custom label
  const renderCustomLabel = ({ cx, cy }: any) => {
    return (
      <text 
        x={cx} 
        y={cy} 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="fill-current"
      >
        <tspan x={cx} dy="-0.5em" className="text-lg font-semibold">
          Total Investment
        </tspan>
        <tspan x={cx} dy="1.5em" className="text-2xl font-bold">
          {formatCurrency(total)}
        </tspan>
      </text>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Breakdown</CardTitle>
        <CardDescription>
          Comprehensive design services allocation across all project phases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Detailed Breakdown */}
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.value)}</p>
                    <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
            
            {/* Total Summary */}
            <div className="pt-4 mt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Total Design Investment</p>
                <p className="text-xl font-bold">{formatCurrency(total)}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive architectural and engineering services
              </p>
            </div>
          </div>
        </div>
        
        {/* Value Statement */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Investment Value:</strong> Every dollar invested in professional design services 
            typically saves 3-5 dollars in construction costs through optimized planning, 
            accurate documentation, and reduced change orders.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}