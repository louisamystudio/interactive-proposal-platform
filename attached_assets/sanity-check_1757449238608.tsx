import { Slider } from "@/components/ui/slider";
import type { FeeAnalysis } from "@shared/schema";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface SanityCheckProps {
  feeAnalysis: FeeAnalysis;
  contractPricing: {
    marketPrice: number;
    maxDiscount: number;
    appliedDiscount: number;
    finalPrice: number;
    effectiveRate: number;
    projectMargin: number;
    totalHours: number;
  };
  discountPercentage: number;
  onDiscountChange: (value: number) => void;
  constructionBudget: number;
  buildingArea: number;
}

export const SanityCheck = ({ 
  feeAnalysis, 
  contractPricing, 
  discountPercentage,
  onDiscountChange,
  constructionBudget,
  buildingArea
}: SanityCheckProps) => {
  const topDownPercent = (feeAnalysis.topDown.marketFee / constructionBudget) * 100;
  const bottomUpPercent = (feeAnalysis.bottomUp.totalCost / constructionBudget) * 100;
  const variance = feeAnalysis.bottomUp.totalCost - feeAnalysis.topDown.marketFee;
  const variancePercent = (variance / feeAnalysis.topDown.marketFee) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="budget-card">
        <h3 className="text-heading font-semibold mb-4">Sanity Check</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-label text-uber-dark-gray">Top-Down</span>
              <span className="text-label font-bold text-uber-blue">
                {formatCurrency(feeAnalysis.topDown.marketFee)}
              </span>
            </div>
            <div className="text-label text-uber-dark-gray">
              {formatNumber(topDownPercent, 1)}% of construction • {formatNumber(feeAnalysis.topDown.hours)} hrs
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-label text-uber-dark-gray">Bottom-Up</span>
              <span className="text-label font-bold text-uber-success">
                {formatCurrency(feeAnalysis.bottomUp.totalCost)}
              </span>
            </div>
            <div className="text-label text-uber-dark-gray">
              {formatNumber(bottomUpPercent, 1)}% of construction • {formatNumber(feeAnalysis.bottomUp.totalHours)} hrs
            </div>
          </div>
          
          <div className="pt-2 border-t border-uber-gray">
            <div className="flex justify-between items-center">
              <span className="text-label font-medium">Variance</span>
              <span className={`text-label font-bold ${
                variance < 0 ? 'text-uber-warning' : 'text-uber-success'
              }`}>
                {formatCurrency(variance)}
              </span>
            </div>
            <div className="text-label text-uber-dark-gray">
              {formatNumber(variancePercent, 1)}% difference
            </div>
          </div>
        </div>
      </div>

      <div className="budget-card">
        <h3 className="text-heading font-semibold mb-4">Market Pricing</h3>
        <div className="space-y-4">
          <div>
            <div className="text-label text-uber-dark-gray mb-2">Market Price</div>
            <div className="text-heading font-bold text-uber-black">
              {formatCurrency(contractPricing.marketPrice)}
            </div>
          </div>
          
          <div>
            <div className="text-label text-uber-dark-gray mb-2">Maximum Discount</div>
            <div className="text-heading font-bold text-uber-warning">
              {formatCurrency(contractPricing.maxDiscount)}
            </div>
            <div className="text-label text-uber-dark-gray">4% maximum</div>
          </div>
          
          <div>
            <div className="text-label text-uber-dark-gray mb-2">Applied Discount</div>
            <div className="mb-2">
              <Slider
                value={[discountPercentage]}
                onValueChange={(value) => onDiscountChange(value[0])}
                max={25}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-label text-uber-dark-gray">
              <span>0%</span>
              <span className="font-semibold text-uber-warning">
                {discountPercentage}%
              </span>
              <span>25%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="budget-card">
        <h3 className="text-heading font-semibold mb-4">Contract Price</h3>
        <div className="space-y-4">
          <div>
            <div className="text-label text-uber-dark-gray mb-2">Final Contract Price</div>
            <div className="text-display font-bold text-uber-success">
              {formatCurrency(contractPricing.finalPrice)}
            </div>
          </div>
          
          <div>
            <div className="text-label text-uber-dark-gray mb-2">Effective Rate</div>
            <div className="text-heading font-bold text-uber-black">
              {formatCurrency(contractPricing.effectiveRate)}/ft²
            </div>
          </div>
          
          <div>
            <div className="text-label text-uber-dark-gray mb-2">Project Margin</div>
            <div className="text-heading font-bold text-uber-success">
              {formatNumber(contractPricing.projectMargin * 100, 1)}%
            </div>
          </div>
          
          <div>
            <div className="text-label text-uber-dark-gray mb-2">Total Hours</div>
            <div className="text-heading font-bold text-uber-black">
              {formatNumber(contractPricing.totalHours)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
