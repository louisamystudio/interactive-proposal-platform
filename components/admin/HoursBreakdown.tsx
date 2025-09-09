'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Clock, Users, Briefcase, HardHat } from 'lucide-react'
import { CalculationResults } from '@/lib/types'

interface HoursBreakdownProps {
  results: CalculationResults
}

export function HoursBreakdown({ results }: HoursBreakdownProps) {
  const { hours, fees } = results
  
  // Phase data for bar chart
  const phaseData = [
    { name: 'SD', hours: hours.byPhase.SD, percentage: (hours.byPhase.SD / fees.totalHours * 100).toFixed(1) },
    { name: 'DD', hours: hours.byPhase.DD, percentage: (hours.byPhase.DD / fees.totalHours * 100).toFixed(1) },
    { name: 'CD', hours: hours.byPhase.CD, percentage: (hours.byPhase.CD / fees.totalHours * 100).toFixed(1) },
    { name: 'CA', hours: hours.byPhase.CA, percentage: (hours.byPhase.CA / fees.totalHours * 100).toFixed(1) }
  ]
  
  // Role data for donut chart
  const roleData = [
    { name: 'Principal', value: hours.byRole.principal, color: '#3B82F6' },
    { name: 'PM', value: hours.byRole.pm, color: '#10B981' },
    { name: 'Designer', value: hours.byRole.designer, color: '#8B5CF6' },
    { name: 'Drafter', value: hours.byRole.drafter, color: '#F59E0B' }
  ]
  
  // Discipline breakdown
  const disciplineData = [
    { name: 'Architecture', hours: Math.round(fees.totalHours * 0.45), percentage: 45, color: '#3B82F6' },
    { name: 'Structural', hours: Math.round(fees.totalHours * 0.25), percentage: 25, color: '#10B981' },
    { name: 'MEP', hours: Math.round(fees.totalHours * 0.20), percentage: 20, color: '#8B5CF6' },
    { name: 'Civil', hours: Math.round(fees.totalHours * 0.10), percentage: 10, color: '#F59E0B' }
  ]
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{label || payload[0].name}</p>
          <p className="text-lg font-bold">{payload[0].value.toLocaleString()} hrs</p>
          {payload[0].payload.percentage && (
            <p className="text-xs text-gray-500">{payload[0].payload.percentage}% of total</p>
          )}
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{fees.totalHours.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blended Rate</p>
                <p className="text-2xl font-bold">${fees.blendedRate}/hr</p>
              </div>
              <Users className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Labor Cost</p>
                <p className="text-2xl font-bold">${(fees.totalHours * fees.blendedRate).toLocaleString()}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Overhead</p>
                <p className="text-2xl font-bold">${fees.louisAmyFee.toLocaleString()}</p>
              </div>
              <HardHat className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Phase Breakdown Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Hours by Phase</CardTitle>
          <CardDescription>
            Distribution of hours across project phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                {phaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Phase Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {phaseData.map((phase, index) => (
              <div key={phase.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index] }}
                  />
                  <span className="text-sm font-medium">{phase.name}</span>
                </div>
                <span className="text-sm text-gray-600">{phase.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hours by Role</CardTitle>
            <CardDescription>
              Team composition and effort distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Role Legend */}
            <div className="space-y-2 mt-4">
              {roleData.map((role) => (
                <div key={role.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="text-sm">{role.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{role.value.toLocaleString()} hrs</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(role.value / fees.totalHours * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Discipline Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Hours by Discipline</CardTitle>
            <CardDescription>
              Engineering discipline allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disciplineData.map((discipline) => (
                <div key={discipline.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{discipline.name}</span>
                    <span className="text-sm text-gray-600">
                      {discipline.hours.toLocaleString()} hrs ({discipline.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${discipline.percentage}%`,
                        backgroundColor: discipline.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Discipline Details */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Discipline Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture includes:</span>
                  <span>Design, coordination, drawings</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Structural includes:</span>
                  <span>Analysis, calculations, details</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MEP includes:</span>
                  <span>Mechanical, electrical, plumbing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Civil includes:</span>
                  <span>Site, drainage, utilities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Non-Linear Hours Formula Note */}
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Non-Linear Hours Calculation</h4>
              <p className="text-sm text-gray-600">
                Hours are calculated using a non-linear formula that accounts for project complexity, 
                area size, building type, and tier. The formula includes logarithmic scaling for larger 
                projects and complexity multipliers for high-end designs, ensuring accurate resource allocation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}