'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface BudgetData {
  name: string
  value: number
  percentage: number
  color: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: BudgetData
  }>
}


interface BudgetDonutChartProps {
  shellBudget: number
  interiorBudget: number
  landscapeBudget: number
  totalBudget: number
  className?: string
}

export function BudgetDonutChart({ 
  shellBudget, 
  interiorBudget, 
  landscapeBudget, 
  totalBudget,
  className = '' 
}: BudgetDonutChartProps) {
  const data: BudgetData[] = [
    {
      name: 'Shell',
      value: shellBudget,
      percentage: (shellBudget / totalBudget) * 100,
      color: '#2563eb' // Blue
    },
    {
      name: 'Interior',
      value: interiorBudget,
      percentage: (interiorBudget / totalBudget) * 100,
      color: '#7c3aed' // Purple
    },
    {
      name: 'Landscape',
      value: landscapeBudget,
      percentage: (landscapeBudget / totalBudget) * 100,
      color: '#059669' // Emerald
    }
  ]

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }


  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage.toFixed(1)}%`}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            strokeWidth={2}
            stroke="white"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
