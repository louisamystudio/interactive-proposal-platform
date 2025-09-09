import { formatCurrency } from "@/lib/calculations";
import { CheckCircle2, TrendingDown, Building2, Users } from "lucide-react";

interface ClosureSectionProps {
  fullMarketPrice?: number;
  inHouseMarketPrice?: number;
  inHouseDiscountedPrice?: number;
  discountAmount?: number;
}

export const ClosureSection = ({ 
  fullMarketPrice = 187099,
  inHouseMarketPrice = 183658,
  inHouseDiscountedPrice = 137744,
  discountAmount = 45914
}: ClosureSectionProps) => {
  const services = [
    { name: 'Laser Scan', amount: 5700, icon: '📡' },
    { name: 'Architecture', amount: 52730, icon: '🏛️' },
    { name: 'Interior Design', amount: 35848, icon: '🎨' },
    { name: 'Landscape Architecture', amount: 16953, icon: '🌳' },
    { name: 'Structural Engineer', amount: 10291, icon: '🔧' },
    { name: 'Civil / Site Engineer', amount: 5715, icon: '📐' },
    { name: 'Plumbing Engineer', amount: 4737, icon: '🚿' },
  ];

  const designSummary = [
    { category: 'Laser Scan', amount: 5700, percentage: 4 },
    { category: 'Building Shell', amount: 82899, percentage: 60 },
    { category: 'Interior', amount: 35848, percentage: 24 },
    { category: 'Landscape', amount: 16953, percentage: 12 },
  ];

  const savingsPercentage = ((discountAmount / inHouseMarketPrice) * 100).toFixed(1);

  return (
    <div className="space-y-8 mb-8">
      {/* Value Proposition Header */}
      <div className="budget-card bg-gradient-to-r from-uber-blue to-blue-600 text-white">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Your Investment Summary</h2>
          <p className="text-xl opacity-90">
            Comprehensive Design Services by Louis Amy Engineering
          </p>
        </div>
      </div>

      {/* Pricing Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="budget-card border-2 border-uber-gray">
          <div className="text-center space-y-3">
            <div className="text-label text-uber-dark-gray">Market Rate</div>
            <div className="text-3xl font-bold text-uber-dark-gray">
              {formatCurrency(fullMarketPrice)}
            </div>
            <div className="text-sm text-uber-dark-gray">Industry Standard Pricing</div>
          </div>
        </div>

        <div className="budget-card border-2 border-uber-blue">
          <div className="text-center space-y-3">
            <div className="text-label text-uber-blue">Louis Amy Price</div>
            <div className="text-3xl font-bold text-uber-blue">
              {formatCurrency(inHouseMarketPrice)}
            </div>
            <div className="text-sm text-uber-dark-gray">In-House Expertise</div>
          </div>
        </div>

        <div className="budget-card border-4 border-uber-success bg-green-50">
          <div className="text-center space-y-3">
            <div className="text-label font-bold text-uber-success">Final Proposal Price</div>
            <div className="text-3xl font-bold text-uber-success">
              {formatCurrency(inHouseDiscountedPrice)}
            </div>
            <div className="flex items-center justify-center gap-2 text-uber-success font-semibold">
              <TrendingDown className="h-5 w-5" />
              Total Value: {formatCurrency(discountAmount)} Below Market
            </div>
          </div>
        </div>
      </div>

      {/* Services Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="budget-card">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-uber-blue" />
            In-House Services Included
          </h3>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-uber-light rounded-lg hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <span className="font-semibold text-uber-blue">
                  {formatCurrency(service.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="budget-card">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-uber-success" />
            Design Services Distribution
          </h3>
          <div className="space-y-4">
            {designSummary.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm text-uber-dark-gray">{item.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-gradient-to-r from-uber-blue to-uber-success"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-right text-sm font-semibold text-uber-blue">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="budget-card bg-gradient-to-br from-uber-success to-green-600 text-white">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">Why Choose Louis Amy Engineering?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold mb-1">Exceptional Value</div>
                <div className="text-sm opacity-90">
                  {formatCurrency(discountAmount)} below market rates with premium quality and service
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold mb-1">Full In-House Team</div>
                <div className="text-sm opacity-90">
                  Direct access to architects, engineers, and designers under one roof
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold mb-1">Integrated Design Approach</div>
                <div className="text-sm opacity-90">
                  Seamless coordination between all disciplines for optimal results
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold mb-1">Proven Track Record</div>
                <div className="text-sm opacity-90">
                  Decades of experience delivering exceptional residential projects
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur">
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold">
                Ready to Begin Your Project
              </div>
              <div className="text-xl">
                Final Proposal Price: {formatCurrency(inHouseDiscountedPrice)}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button className="px-8 py-3 bg-white text-uber-success font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Accept Proposal
                </button>
                <button className="px-8 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};