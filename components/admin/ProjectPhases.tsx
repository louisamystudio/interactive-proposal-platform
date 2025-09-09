'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ProjectPhasesProps {
  phases: {
    discovery: number
    creativeConceptual: number
    creativeSchematic: number
    creativePreliminary: number
    technicalSchematic: number
    technicalPreliminary: number
  }
  teamLeverage: {
    designer1: number
    designer2: number
    architect: number
    engineer: number
    principal: number
  }
  totalHours: number
}

export function ProjectPhases({ phases, teamLeverage, totalHours }: ProjectPhasesProps) {
  const phaseData = [
    { name: 'Discovery', hours: phases.discovery, percent: 8 },
    { name: 'Creative - Conceptual', hours: phases.creativeConceptual, percent: 8 },
    { name: 'Creative - Schematic', hours: phases.creativeSchematic, percent: 34 },
    { name: 'Creative - Preliminary', hours: phases.creativePreliminary, percent: 8 },
    { name: 'Technical - Schematic', hours: phases.technicalSchematic, percent: 34 },
    { name: 'Technical - Preliminary', hours: phases.technicalPreliminary, percent: 8 }
  ]

  const teamData = [
    { name: 'Designer 1', value: teamLeverage.designer1, hours: `${teamLeverage.designer1}h` },
    { name: 'Designer 2', value: teamLeverage.designer2, hours: `${teamLeverage.designer2}h` },
    { name: 'Architect', value: teamLeverage.architect, hours: `${teamLeverage.architect}h` },
    { name: 'Engineer', value: teamLeverage.engineer, hours: `${teamLeverage.engineer}h` },
    { name: 'Principal', value: teamLeverage.principal, hours: `${teamLeverage.principal}h` }
  ]

  const COLORS = {
    phases: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'],
    team: ['#60A5FA', '#34D399', '#A78BFA', '#FBBF24', '#F87171']
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value} hours</p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy }: any) => {
    return (
      <text x={cx} y={cy} fill="black" textAnchor="middle" dominantBaseline="central">
        <tspan x={cx} dy="-0.2em" className="text-2xl font-bold">{totalHours.toLocaleString()}</tspan>
        <tspan x={cx} dy="1.5em" className="text-sm text-gray-500">TOTAL HOURS</tspan>
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Phases & Hours Distribution</CardTitle>
        <CardDescription>Time allocation across project phases and team members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phase Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-4">Phase Distribution</h3>
            <div className="space-y-3">
              {phaseData.map((phase, index) => (
                <div key={phase.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{phase.name} ({phase.percent}%)</span>
                    <span className="text-sm font-medium">{phase.hours} hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className="h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(phase.hours / totalHours) * 100}%`,
                        backgroundColor: COLORS.phases[index]
                      }}
                    >
                      <span className="text-xs text-white font-medium">
                        {phase.hours}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Leverage */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Team Leverage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={teamData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {teamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.team[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
              {teamData.map((member, index) => (
                <div key={member.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS.team[index] }}
                  />
                  <span className="text-sm">{member.name}: {member.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}