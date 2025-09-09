import type { FeeAnalysis } from "@shared/schema";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface FeeAnalysisTablesProps {
  feeAnalysis: FeeAnalysis;
}

export const FeeAnalysisTables = ({ feeAnalysis }: FeeAnalysisTablesProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
      {/* Top-Down Analysis */}
      <div className="budget-card">
        <h3 className="text-heading font-semibold mb-6">Top-Down Fee Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-label">
            <thead className="bg-uber-light">
              <tr>
                <th className="text-left p-3 font-medium text-uber-dark-gray">Scope</th>
                <th className="text-right p-3 font-medium text-uber-dark-gray">Market Fee</th>
                <th className="text-right p-3 font-medium text-uber-dark-gray">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-uber-gray">
              {feeAnalysis.topDown.disciplines.map((discipline, index) => (
                <tr key={index}>
                  <td className="p-3 font-medium">{discipline.name}</td>
                  <td className={`p-3 text-right font-semibold ${
                    discipline.isConsultant ? 'text-uber-warning' : ''
                  }`}>
                    {formatCurrency(discipline.fee)}
                  </td>
                  <td className="p-3 text-right">
                    {discipline.hours > 0 ? formatNumber(discipline.hours) : '-'}
                  </td>
                </tr>
              ))}
              <tr className="bg-uber-light font-semibold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right text-uber-blue">
                  {formatCurrency(feeAnalysis.topDown.marketFee)}
                </td>
                <td className="p-3 text-right">
                  {formatNumber(feeAnalysis.topDown.hours)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom-Up Analysis */}
      <div className="budget-card">
        <h3 className="text-heading font-semibold mb-6">Bottom-Up Fee Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-label">
            <thead className="bg-uber-light">
              <tr>
                <th className="text-left p-3 font-medium text-uber-dark-gray">Team Member</th>
                <th className="text-right p-3 font-medium text-uber-dark-gray">Hours</th>
                <th className="text-right p-3 font-medium text-uber-dark-gray">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-uber-gray">
              {feeAnalysis.bottomUp.teamMembers.map((member, index) => (
                <tr key={index}>
                  <td className="p-3 font-medium">{member.role}</td>
                  <td className="p-3 text-right">{formatNumber(member.hours)}</td>
                  <td className="p-3 text-right font-semibold">
                    {formatCurrency(member.cost)}
                  </td>
                </tr>
              ))}
              <tr className="bg-uber-light font-semibold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">
                  {formatNumber(feeAnalysis.bottomUp.totalHours)}
                </td>
                <td className="p-3 text-right text-uber-success">
                  {formatCurrency(feeAnalysis.bottomUp.totalCost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-uber-light rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-label font-medium">Average Rate:</span>
            <span className="text-label font-bold">
              {formatCurrency(feeAnalysis.bottomUp.averageRate)}/hour
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
