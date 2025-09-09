import { Building2, MapPin, Home } from "lucide-react";

interface BaseProjectHeaderProps {
  buildingType: string;
  category: number;
  designLevel: number;
}

export const BaseProjectHeader = ({ buildingType, category, designLevel }: BaseProjectHeaderProps) => {
  const designLevelText = designLevel === 1 ? "Basic" : designLevel === 2 ? "Standard" : "Full";
  
  return (
    <header className="bg-primary" style={{ background: 'var(--color-primary)' }}>
      <div className="base-container" style={{ padding: `var(--space-8) var(--space-6)` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8" style={{ color: 'var(--color-text-inverse)' }} />
              <div>
                <h1 className="text-display-lg" style={{ 
                  color: 'var(--color-text-inverse)',
                  fontSize: 'var(--font-display-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  lineHeight: 'var(--line-height-tight)'
                }}>
                  Louis Amy Engineering
                </h1>
                <p className="text-label" style={{ 
                  color: 'var(--color-gray-300)',
                  fontSize: 'var(--font-label)',
                  marginTop: 'var(--space-1)'
                }}>
                  Construction Cost Analysis Dashboard
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-label-sm" style={{ 
                color: 'var(--color-gray-300)',
                fontSize: 'var(--font-label-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Building Type
              </div>
              <div className="text-label-lg" style={{ 
                color: 'var(--color-text-inverse)',
                fontSize: 'var(--font-label-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginTop: 'var(--space-1)'
              }}>
                {buildingType}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-label-sm" style={{ 
                color: 'var(--color-gray-300)',
                fontSize: 'var(--font-label-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Category
              </div>
              <div className="text-label-lg" style={{ 
                color: 'var(--color-text-inverse)',
                fontSize: 'var(--font-label-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginTop: 'var(--space-1)'
              }}>
                Category {category}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-label-sm" style={{ 
                color: 'var(--color-gray-300)',
                fontSize: 'var(--font-label-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Design Level
              </div>
              <div className="text-label-lg" style={{ 
                color: 'var(--color-text-inverse)',
                fontSize: 'var(--font-label-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginTop: 'var(--space-1)'
              }}>
                {designLevelText} Design
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};