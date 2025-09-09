import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ProjectPhasesProps {
  totalHours: number;
}

export const ProjectPhases = ({ totalHours }: ProjectPhasesProps) => {
  const phaseData = [
    { phase: 'Discovery', percentage: 8, hours: Math.round(totalHours * 0.08) },
    { phase: 'Creative - Conceptual', percentage: 8, hours: Math.round(totalHours * 0.08) },
    { phase: 'Creative - Schematic', percentage: 34, hours: Math.round(totalHours * 0.34) },
    { phase: 'Creative - Preliminary', percentage: 8, hours: Math.round(totalHours * 0.08) },
    { phase: 'Technical - Schematic', percentage: 34, hours: Math.round(totalHours * 0.34) },
    { phase: 'Technical - Preliminary', percentage: 8, hours: Math.round(totalHours * 0.08) },
  ];

  const teamLeverageData = [
    { role: 'Designer 1', hours: 324, color: '#1785FB' },
    { role: 'Designer 2', hours: 324, color: '#05944F' },
    { role: 'Architect', hours: 307, color: '#FFC043' },
    { role: 'Engineer', hours: 171, color: '#8B5CF6' },
    { role: 'Principal', hours: 58, color: '#EF4444' },
  ];

  return (
    <div className="budget-card mb-8">
      <h3 className="text-heading font-semibold mb-6">Project Phases & Hours Distribution</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-label font-semibold mb-4 text-uber-dark-gray">Phase Distribution</h4>
          <div className="space-y-4">
            {phaseData.map((phase, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label">
                    {phase.phase} ({phase.percentage}%)
                  </span>
                  <span className="text-label font-semibold">
                    {phase.hours} hrs
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${
                      phase.percentage >= 30 ? 'bg-uber-success' : 'bg-uber-blue'
                    }`} 
                    style={{ width: `${Math.min(phase.percentage * 2.5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-label font-semibold mb-4 text-uber-dark-gray">Team Leverage</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamLeverageData}>
                <XAxis 
                  dataKey="role" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value} hours`, 'Hours']}
                  labelStyle={{ color: '#323232' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#1785FB"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
