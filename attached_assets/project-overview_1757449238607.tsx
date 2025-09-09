import type { BudgetCalculation } from "@shared/schema";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface ProjectOverviewProps {
  budgetCalculation: BudgetCalculation;
  buildingArea: number;
  siteArea: number;
  costPerSqFt: number;
}

export const ProjectOverview = ({ 
  budgetCalculation, 
  buildingArea, 
  siteArea, 
  costPerSqFt 
}: ProjectOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div className="budget-card">
        <div className="metric-label mb-2">Total Budget</div>
        <div className="metric-value">{formatCurrency(budgetCalculation.totalBudget)}</div>
        <div className="text-label text-uber-success mt-1">
          {budgetCalculation.remodelBudget > 0 ? "100% Remodel" : "100% New Construction"}
        </div>
      </div>
      
      <div className="budget-card">
        <div className="metric-label mb-2">Building Area</div>
        <div className="metric-value">{formatNumber(buildingArea)}</div>
        <div className="text-label text-uber-dark-gray mt-1">sq ft existing</div>
      </div>
      
      <div className="budget-card">
        <div className="metric-label mb-2">Site Area</div>
        <div className="metric-value">{formatNumber(siteArea)}</div>
        <div className="text-label text-uber-dark-gray mt-1">m² total site</div>
      </div>
      
      <div className="budget-card">
        <div className="metric-label mb-2">Cost per sq ft</div>
        <div className="metric-value">{formatCurrency(costPerSqFt)}</div>
        <div className="text-label text-uber-dark-gray mt-1">remodel target</div>
      </div>
    </div>
  );
};
