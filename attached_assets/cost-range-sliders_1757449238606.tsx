import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/calculations";

interface CostRangeSlidersProps {
  costRanges: {
    newMin: number;
    newMax: number;
    newTarget: number;
    remodelMin: number;
    remodelMax: number;
    remodelTarget: number;
  };
  onCostRangeChange: (type: 'new' | 'remodel', value: number) => void;
}

export const CostRangeSliders = ({ costRanges, onCostRangeChange }: CostRangeSlidersProps) => {
  return (
    <div className="base-section" style={{ marginBottom: 'var(--space-10)' }}>
      <h2 className="text-heading-xl" style={{ 
        fontSize: 'var(--font-heading-xl)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-6)'
      }}>Cost Range Configuration</h2>
      <div className="base-card" style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-6)',
        transition: 'all var(--transition-base)'
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-8)' }}>
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label className="text-label" style={{
                fontSize: 'var(--font-label)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-secondary)',
                display: 'block',
                marginBottom: 'var(--space-3)'
              }}>
                New Construction ($/ft²)
              </label>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <Slider
                  value={[costRanges.newTarget]}
                  onValueChange={(value) => onCostRangeChange('new', value[0])}
                  max={costRanges.newMax}
                  min={costRanges.newMin}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-label-sm" style={{
                  fontSize: 'var(--font-label-sm)',
                  color: 'var(--color-text-muted)'
                }}>{formatCurrency(costRanges.newMin)}</span>
                <span className="text-label-lg" style={{
                  fontSize: 'var(--font-label-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-secondary)'
                }}>
                  {formatCurrency(costRanges.newTarget)}
                </span>
                <span className="text-label-sm" style={{
                  fontSize: 'var(--font-label-sm)',
                  color: 'var(--color-text-muted)'
                }}>{formatCurrency(costRanges.newMax)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label className="text-label" style={{
                fontSize: 'var(--font-label)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-secondary)',
                display: 'block',
                marginBottom: 'var(--space-3)'
              }}>
                Remodel ($/ft²)
              </label>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <Slider
                  value={[costRanges.remodelTarget]}
                  onValueChange={(value) => onCostRangeChange('remodel', value[0])}
                  max={costRanges.remodelMax}
                  min={costRanges.remodelMin}
                  step={0.5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-label-sm" style={{
                  fontSize: 'var(--font-label-sm)',
                  color: 'var(--color-text-muted)'
                }}>{formatCurrency(costRanges.remodelMin)}</span>
                <span className="text-label-lg" style={{
                  fontSize: 'var(--font-label-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-success)'
                }}>
                  {formatCurrency(costRanges.remodelTarget)}
                </span>
                <span className="text-label-sm" style={{
                  fontSize: 'var(--font-label-sm)',
                  color: 'var(--color-text-muted)'
                }}>{formatCurrency(costRanges.remodelMax)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
