import { Button } from "@/components/ui/button";
import { Download, Save, FileText } from "lucide-react";

export const ActionButtons = () => {
  const handleSaveDraft = () => {
    // TODO: Implement save functionality
    console.log('Saving draft...');
  };

  const handleGenerateProposal = () => {
    // TODO: Implement proposal generation
    console.log('Generating proposal...');
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Exporting to PDF...');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <Button variant="outline" onClick={handleSaveDraft} className="btn-secondary">
        <Save className="w-4 h-4 mr-2" />
        Save as Draft
      </Button>
      
      <Button onClick={handleGenerateProposal} className="btn-primary">
        <FileText className="w-4 h-4 mr-2" />
        Generate Proposal
      </Button>
      
      <Button onClick={handleExportPDF} className="btn-dark">
        <Download className="w-4 h-4 mr-2" />
        Export to PDF
      </Button>
    </div>
  );
};
