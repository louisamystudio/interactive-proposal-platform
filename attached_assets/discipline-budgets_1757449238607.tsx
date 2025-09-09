import { Switch } from "@/components/ui/switch";
import type { DisciplineBudget } from "@shared/schema";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface DisciplineBudgetsProps {
  disciplineBudgets: DisciplineBudget[];
  onDisciplineToggle: (discipline: string, isInHouse: boolean) => void;
}

export const DisciplineBudgets = ({ disciplineBudgets, onDisciplineToggle }: DisciplineBudgetsProps) => {
  const getStatusColor = (isInHouse: boolean) => {
    return isInHouse ? 'text-uber-success' : 'text-uber-warning';
  };

  const getStatusBadge = (isInHouse: boolean) => {
    return isInHouse ? 'bg-uber-success' : 'bg-uber-warning';
  };

  const getProgressColor = (isInHouse: boolean) => {
    return isInHouse ? 'bg-uber-blue' : 'bg-uber-warning';
  };

  return (
    <div className="mb-8">
      <h3 className="text-heading font-semibold mb-6">Discipline Budget Allocation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {disciplineBudgets.map((discipline, index) => (
          <div key={index} className="budget-card">
            <div className="flex items-center justify-between mb-4">
              <div className="text-label text-uber-dark-gray">{discipline.discipline}</div>
              <div className="flex items-center space-x-2">
                <span className={`text-label ${getStatusColor(discipline.isInHouse)}`}>
                  {discipline.isInHouse ? 'In-House' : 'Consultant'}
                </span>
                <Switch
                  checked={discipline.isInHouse}
                  onCheckedChange={(checked) => onDisciplineToggle(discipline.discipline, checked)}
                />
              </div>
            </div>
            
            <div className="metric-value text-lg">{formatCurrency(discipline.budget)}</div>
            <div className="text-label text-uber-dark-gray mt-1">
              {formatNumber(discipline.percentage)}% total share
            </div>
            
            <div className="mt-4 progress-bar">
              <div 
                className={`progress-fill ${getProgressColor(discipline.isInHouse)}`} 
                style={{ width: `${Math.min(discipline.percentage * 2, 100)}%` }}
              />
            </div>
            
            {(discipline.newPortion > 0 || discipline.remodelPortion > 0) && (
              <div className="mt-3 text-xs text-uber-dark-gray">
                {discipline.newPortion > 0 && (
                  <div>New: {formatCurrency(discipline.newPortion)}</div>
                )}
                {discipline.remodelPortion > 0 && (
                  <div>Remodel: {formatCurrency(discipline.remodelPortion)}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
