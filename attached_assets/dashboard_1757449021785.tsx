import { BaseProjectHeader } from "@/components/base-project-header";
import { BaseProjectOverview } from "@/components/base-project-overview";
import { BudgetDistribution } from "@/components/budget-distribution";
import { CostRangeSliders } from "@/components/cost-range-sliders";
import { DisciplineBudgets } from "@/components/discipline-budgets";
import { FeeAnalysisTables } from "@/components/fee-analysis-tables";
import { ProjectPhases } from "@/components/project-phases";
import { SanityCheck } from "@/components/sanity-check";
import { ClosureSection } from "@/components/closure-section";
import { ActionButtons } from "@/components/action-buttons";
import { useProjectData } from "@/hooks/use-project-data";

export default function Dashboard() {
  const {
    projectData,
    budgetCalculation,
    disciplineBudgets,
    feeAnalysis,
    contractPricing,
    discountPercentage,
    setDiscountPercentage,
    updateCostRange,
    updateBudgetShare,
    updateDisciplineShare,
  } = useProjectData();

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <BaseProjectHeader 
        buildingType={projectData.buildingType}
        category={projectData.category}
        designLevel={projectData.designLevel}
      />
      
      <div className="base-container" style={{ 
        maxWidth: '1440px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-6)'
      }}>
        <BaseProjectOverview 
          budgetCalculation={budgetCalculation}
          buildingArea={projectData.buildingArea}
          siteArea={projectData.siteArea}
          costPerSqFt={projectData.costRanges.remodelTarget}
        />
        
        <BudgetDistribution 
          budgetCalculation={budgetCalculation}
          onBudgetShareChange={updateBudgetShare}
        />
        
        <CostRangeSliders 
          costRanges={projectData.costRanges}
          onCostRangeChange={updateCostRange}
        />
        
        <DisciplineBudgets 
          disciplineBudgets={disciplineBudgets}
          onDisciplineToggle={(discipline, isInHouse) => 
            updateDisciplineShare(discipline, { isInHouse })
          }
        />
        
        <FeeAnalysisTables feeAnalysis={feeAnalysis} />
        
        <ProjectPhases totalHours={feeAnalysis.bottomUp.totalHours} />
        
        <SanityCheck 
          feeAnalysis={feeAnalysis}
          contractPricing={contractPricing}
          discountPercentage={discountPercentage}
          onDiscountChange={setDiscountPercentage}
          constructionBudget={budgetCalculation.totalBudget}
          buildingArea={projectData.buildingArea}
        />
        
        <ClosureSection 
          fullMarketPrice={187099}
          inHouseMarketPrice={183658}
          inHouseDiscountedPrice={146926}
          discountAmount={36732}
        />
        
        <ActionButtons />
      </div>
    </div>
  );
}
