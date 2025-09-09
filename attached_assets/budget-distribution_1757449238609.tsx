import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { BudgetCalculation } from "@shared/schema";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface BudgetDistributionProps {
  budgetCalculation: BudgetCalculation;
  onBudgetShareChange?: (type: 'shell' | 'interior' | 'landscape', value: number) => void;
}

export const BudgetDistribution = ({ 
  budgetCalculation, 
  onBudgetShareChange 
}: BudgetDistributionProps) => {
  const distributionData = [
    {
      name: 'New Construction',
      value: budgetCalculation.newConstructionBudget,
      percentage: (budgetCalculation.newConstructionBudget / budgetCalculation.totalBudget) * 100,
      color: '#1785FB'
    },
    {
      name: 'Remodel',
      value: budgetCalculation.remodelBudget,
      percentage: (budgetCalculation.remodelBudget / budgetCalculation.totalBudget) * 100,
      color: '#05944F'
    }
  ];

  const budgetCards = [
    {
      title: 'Shell Budget',
      amount: budgetCalculation.shellBudget,
      percentage: 66,
      color: 'bg-uber-blue',
      type: 'shell' as const
    },
    {
      title: 'Interior Budget',
      amount: budgetCalculation.interiorBudget,
      percentage: 22,
      color: 'bg-uber-warning',
      type: 'interior' as const
    },
    {
      title: 'Landscape Budget',
      amount: budgetCalculation.landscapeBudget,
      percentage: 12,
      color: 'bg-uber-success',
      type: 'landscape' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-1">
        <div className="budget-card">
          <h3 className="text-heading font-semibold mb-4">Budget Distribution</h3>
          <div className="relative w-48 h-48 mx-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-label">{item.name}</span>
                </div>
                <span className="text-label font-semibold">
                  {formatNumber(item.percentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {budgetCards.map((card, index) => (
            <div key={index} className="budget-card">
              <div className="metric-label mb-2">{card.title}</div>
              <div className="metric-value">{formatCurrency(card.amount)}</div>
              <div className="text-label text-uber-dark-gray mt-1">
                {card.percentage}% of total
              </div>
              <div className="mt-4">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${card.color}`} 
                    style={{ width: `${card.percentage}%` }}
                  />
                </div>
              </div>
              <button className="text-label text-uber-blue mt-2 hover:underline">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
