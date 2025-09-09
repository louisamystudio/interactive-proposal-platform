import type { BudgetCalculation } from "@shared/schema";
import { formatCurrency, formatNumber } from "@/lib/calculations";
import { TrendingUp, Building, MapPin, DollarSign } from "lucide-react";

interface BaseProjectOverviewProps {
  budgetCalculation: BudgetCalculation;
  buildingArea: number;
  siteArea: number;
  costPerSqFt: number;
}

export const BaseProjectOverview = ({ 
  budgetCalculation, 
  buildingArea, 
  siteArea, 
  costPerSqFt 
}: BaseProjectOverviewProps) => {
  return (
    <div className="base-section" style={{ marginBottom: 'var(--space-10)' }}>
      <h2 className="text-heading-xl" style={{ 
        fontSize: 'var(--font-heading-xl)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-6)'
      }}>
        Project Overview
      </h2>
      
      <div className="base-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-6)'
      }}>
        <div className="base-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          transition: 'all var(--transition-base)'
        }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg" style={{ 
              background: 'var(--color-secondary)',
              opacity: '0.1'
            }}>
              <DollarSign className="h-6 w-6" style={{ color: 'var(--color-secondary)' }} />
            </div>
            <div className="flex-1">
              <div className="text-label-sm" style={{
                fontSize: 'var(--font-label-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                Total Budget
              </div>
              <div className="text-display" style={{
                fontSize: 'var(--font-display)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-tight)',
                color: 'var(--color-text-primary)'
              }}>
                {formatCurrency(budgetCalculation.totalBudget)}
              </div>
              <div className="text-label" style={{
                fontSize: 'var(--font-label)',
                color: 'var(--color-success)',
                marginTop: 'var(--space-2)'
              }}>
                {budgetCalculation.remodelBudget > 0 ? "100% Remodel" : "100% New Construction"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="base-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          transition: 'all var(--transition-base)'
        }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg" style={{ 
              background: 'var(--color-gray-100)'
            }}>
              <Building className="h-6 w-6" style={{ color: 'var(--color-gray-600)' }} />
            </div>
            <div className="flex-1">
              <div className="text-label-sm" style={{
                fontSize: 'var(--font-label-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                Building Area
              </div>
              <div className="text-display" style={{
                fontSize: 'var(--font-display)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-tight)',
                color: 'var(--color-text-primary)'
              }}>
                {formatNumber(buildingArea)}
              </div>
              <div className="text-label" style={{
                fontSize: 'var(--font-label)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)'
              }}>
                sq ft existing
              </div>
            </div>
          </div>
        </div>
        
        <div className="base-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          transition: 'all var(--transition-base)'
        }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg" style={{ 
              background: 'var(--color-gray-100)'
            }}>
              <MapPin className="h-6 w-6" style={{ color: 'var(--color-gray-600)' }} />
            </div>
            <div className="flex-1">
              <div className="text-label-sm" style={{
                fontSize: 'var(--font-label-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                Site Area
              </div>
              <div className="text-display" style={{
                fontSize: 'var(--font-display)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-tight)',
                color: 'var(--color-text-primary)'
              }}>
                {formatNumber(siteArea)}
              </div>
              <div className="text-label" style={{
                fontSize: 'var(--font-label)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)'
              }}>
                m² total site
              </div>
            </div>
          </div>
        </div>
        
        <div className="base-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          transition: 'all var(--transition-base)'
        }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg" style={{ 
              background: 'var(--color-gray-100)'
            }}>
              <TrendingUp className="h-6 w-6" style={{ color: 'var(--color-gray-600)' }} />
            </div>
            <div className="flex-1">
              <div className="text-label-sm" style={{
                fontSize: 'var(--font-label-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                Cost per sq ft
              </div>
              <div className="text-display" style={{
                fontSize: 'var(--font-display)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-tight)',
                color: 'var(--color-text-primary)'
              }}>
                {formatCurrency(costPerSqFt)}
              </div>
              <div className="text-label" style={{
                fontSize: 'var(--font-label)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)'
              }}>
                remodel target
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};