'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Clock, Users, AlertCircle } from 'lucide-react'
import { ProjectHours } from '@/lib/types'

interface HoursBreakdownProps {
  hours: ProjectHours
}

// Fixed phase distribution percentages
const PHASE_DISTRIBUTION = {
  discovery: 0.08,
  creativeConceptual: 0.08,
  creativeSchematic: 0.34,
  creativePreliminary: 0.08,
  technicalSchematic: 0.34,
  technicalPreliminary: 0.08
}

// Fixed role distribution (example percentages, adjust as needed)
const ROLE_DISTRIBUTION = {
  designer1: 0.25,
  designer2: 0.20,
  architect: 0.30,
  engineer: 0.15,
  principal: 0.10
}

const PHASE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
const ROLE_COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed']

export function HoursBreakdown({ hours }: HoursBreakdownProps) {
  const totalHours = hours.totalHours

  // Calculate phase hours
  const phaseData = [
    { name: 'Discovery', hours: Math.round(totalHours * PHASE_DISTRIBUTION.discovery), percentage: 8 },
    { name: 'Creative - Conceptual', hours: Math.round(totalHours * PHASE_DISTRIBUTION.creativeConceptual), percentage: 8 },
    { name: 'Creative - Schematic', hours: Math.round(totalHours * PHASE_DISTRIBUTION.creativeSchematic), percentage: 34 },
    { name: 'Creative - Preliminary', hours: Math.round(totalHours * PHASE_DISTRIBUTION.creativePreliminary), percentage: 8 },
    { name: 'Technical - Schematic', hours: Math.round(totalHours * PHASE_DISTRIBUTION.technicalSchematic), percentage: 34 },
    { name: 'Technical - Preliminary', hours: Math.round(totalHours * PHASE_DISTRIBUTION.technicalPreliminary), percentage: 8 }
  ]

  // Calculate role hours
  const roleData = [
    { name: 'Designer 1', value: Math.round(totalHours * ROLE_DISTRIBUTION.designer1), percentage: 25 },
    { name: 'Designer 2', value: Math.round(totalHours * ROLE_DISTRIBUTION.designer2), percentage: 20 },
    { name: 'Architect', value: Math.round(totalHours * ROLE_DISTRIBUTION.architect), percentage: 30 },
    { name: 'Engineer', value: Math.round(totalHours * ROLE_DISTRIBUTION.engineer), percentage: 15 },
    { name: 'Principal', value: Math.round(totalHours * ROLE_DISTRIBUTION.principal), percentage: 10 }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">Hours: {payload[0].value}</p>
          <p className="text-sm text-gray-600">({payload[0].payload.percentage}%)</p>
        </div>
      )
    }
    return null
  }

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {value}h
      </text>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hours Distribution (Admin Only)
            </CardTitle>
            <CardDescription>
              Internal analysis of project phases and team leverage. Never shown to clients.
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Hours</div>
            <div className="text-2xl font-bold">{totalHours.toLocaleString()}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase Distribution Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Project Phases</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PHASE_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Leverage Donut Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Team Leverage
              <Users className="h-4 w-4 text-gray-400" />
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomPieLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Role Breakdown Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours by Role</h3>
            <div className="space-y-2">
              {roleData.map((role, index) => (
                <div key={role.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: ROLE_COLORS[index] }}
                    />
                    <span className="font-medium">{role.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{role.value}h</span>
                    <span className="text-sm text-gray-600 ml-2">({role.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Internal Use Only</p>
              <p className="text-sm text-red-700 mt-1">
                This hours breakdown is for internal project management only. 
                <strong> Never expose hours or hourly rates to clients.</strong> Client proposals 
                should focus on value, outcomes, and fixed investment amounts only.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
