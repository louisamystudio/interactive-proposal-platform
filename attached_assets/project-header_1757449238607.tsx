import { Badge } from "@/components/ui/badge";

interface ProjectHeaderProps {
  buildingType: string;
  category: number;
  designLevel: number;
}

export const ProjectHeader = ({ buildingType, category, designLevel }: ProjectHeaderProps) => {
  return (
    <header className="bg-white border-b border-uber-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-uber-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LA</span>
              </div>
              <span className="ml-3 text-heading font-semibold">Louis Amy Engineering</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-uber-blue font-medium border-b-2 border-uber-blue pb-4">
                Cost Calculator
              </a>
              <a href="#" className="text-uber-dark-gray hover:text-uber-text pb-4">
                Projects
              </a>
              <a href="#" className="text-uber-dark-gray hover:text-uber-text pb-4">
                Reports
              </a>
              <a href="#" className="text-uber-dark-gray hover:text-uber-text pb-4">
                Settings
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              Export Report
            </button>
            <div className="w-8 h-8 bg-uber-black rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center text-label text-uber-dark-gray mb-2">
          <span>Projects</span>
          <span className="mx-2">›</span>
          <span className="text-uber-text">Engineering Cost Calculator</span>
        </div>
        <h1 className="text-display font-bold text-uber-black">Residential Project Analysis</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="bg-uber-light text-uber-text">
            {buildingType}
          </Badge>
          <Badge variant="outline" className="border-uber-gray text-uber-dark-gray">
            Category {category}
          </Badge>
          <Badge variant="outline" className="border-uber-gray text-uber-dark-gray">
            Design Level {designLevel}
          </Badge>
        </div>
      </div>
    </header>
  );
};
