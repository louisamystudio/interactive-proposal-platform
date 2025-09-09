'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface DisciplineData {
  name: string
  budget: number
  percentage: number
  color: string
}

interface TooltipData {
  active?: boolean
  payload?: Array<{
    payload: DisciplineData
  }>
  label?: string
}

interface DisciplineChartProps {
  architectureBudget: number
  structuralBudget: number
  civilBudget: number
  mechanicalBudget: number
  electricalBudget: number
  plumbingBudget: number
  telecomBudget: number
  totalBudget: number
  className?: string
}

export function DisciplineChart({ 
  architectureBudget,
  structuralBudget,
  civilBudget,
  mechanicalBudget,
  electricalBudget,
  plumbingBudget,
  telecomBudget,
  totalBudget,
  className = '' 
}: DisciplineChartProps) {
  const data: DisciplineData[] = [
    {
      name: 'Architecture',
      budget: architectureBudget,
      percentage: (architectureBudget / totalBudget) * 100,
      color: '#2563eb'
    },
    {
      name: 'Structural',
      budget: structuralBudget,
      percentage: (structuralBudget / totalBudget) * 100,
      color: '#dc2626'
    },
    {
      name: 'Civil',
      budget: civilBudget,
      percentage: (civilBudget / totalBudget) * 100,
      color: '#ea580c'
    },
    {
      name: 'Mechanical',
      budget: mechanicalBudget,
      percentage: (mechanicalBudget / totalBudget) * 100,
      color: '#059669'
    },
    {
      name: 'Electrical',
      budget: electricalBudget,
      percentage: (electricalBudget / totalBudget) * 100,
      color: '#7c2d12'
    },
    {
      name: 'Plumbing',
      budget: plumbingBudget,
      percentage: (plumbingBudget / totalBudget) * 100,
      color: '#1e40af'
    },
    {
      name: 'Telecom',
      budget: telecomBudget,
      percentage: (telecomBudget / totalBudget) * 100,
      color: '#7c3aed'
    }
  ].filter(item => item.budget > 0) // Only show disciplines with budget

  const CustomTooltip = ({ active, payload, label }: TooltipData) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Budget: {formatCurrency(data.budget)}
          </p>
          <p className="text-sm text-gray-600">
            Share: {data.percentage.toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="budget" 
            radius={[4, 4, 0, 0]}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
