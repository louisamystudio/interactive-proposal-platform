# Application Logic & Calculation Engine

## 🧮 Core Calculation Formulas

### **Calibrated Constants System**
```typescript
// Constants imported from lib/constants.ts (supports EXCEL/SSOT modes)
import { CONFIG, MODE } from './constants'

// Active configuration (tuned to match desired Excel or SSOT behavior)
export const {
  HFA_OFFSET,           // Hours formula adjustment
  MARKET_FEE_RATE,      // Architecture fee percentage  
  AVG_LABOR_RATE,       // $/hour average
  AVG_OVERHEAD_RATE,    // $/hour average
  MARKUP,               // Markup factor
  MAX_DISCOUNT,         // Maximum discount
  CATEGORY_MULTIPLIERS  // Category 1-5 complexity scaling
} = CONFIG

// Current mode and validation targets
console.log(`📊 Active Mode: ${MODE}`)
console.log(`📋 Validation Targets:`, CONFIG.VALIDATION)
```

### **Calibration Modes**
- **EXCEL Mode:** Reproduces original Excel hours (1,184) and contract price ($137,743.50)
- **SSOT Mode:** Uses current app calculation constants (1,148.27 hours, $187,925.55 contract)
- **Switch modes** in `lib/constants.ts` by changing `MODE = 'EXCEL' | 'SSOT'`

### **1. Building Classification System**

```typescript
interface ProjectClassification {
  buildingUse: 'Residential' | 'Commercial' | 'Healthcare' | 'Educational' | 'Industrial'
  buildingType: string // e.g., 'Custom Houses', 'Private Housing Development'
  buildingTier: 'Low' | 'Mid' | 'High' // Mapped from design level
  category: 1 | 2 | 3 | 4 | 5 // Complexity rating
  designLevel: 1 | 2 | 3 // 1=Basic, 2=Standard, 3=Full Design
}

// Category to multiplier mapping
const categoryMultipliers = {
  1: 0.9, // Simple projects
  2: 1.0, // Standard projects  
  3: 1.1, // Medium complexity
  4: 1.2, // High complexity
  5: 1.3  // Very high complexity (Dr. De Jesús project)
}
```

### **2. Project Budget Calculations**

```typescript
// Cost per square foot lookup (from database)
interface CostRanges {
  newConstructionMin: number    // e.g., $380/ft²
  newConstructionTarget: number // e.g., $390/ft² 
  newConstructionMax: number    // e.g., $400/ft²
  remodelMin: number           // e.g., $190/ft²
  remodelTarget: number        // e.g., $195/ft²
  remodelMax: number           // e.g., $200/ft²
}

// Budget calculation formula
function calculateBudgets(params: {
  newAreaFt2: number,
  existingAreaFt2: number,
  newTargetPSF: number,
  remodelTargetPSF: number,
  historicMultiplier: number,
  remodelMultiplier: number
}) {
  // Apply multipliers to costs
  const adjustedNewPSF = params.newTargetPSF * params.historicMultiplier
  const adjustedRemodelPSF = params.remodelTargetPSF * params.remodelMultiplier
  
  // Calculate individual budgets
  const newBudget = params.newAreaFt2 * adjustedNewPSF
  const remodelBudget = params.existingAreaFt2 * adjustedRemodelPSF
  const totalBudget = newBudget + remodelBudget
  
  return { newBudget, remodelBudget, totalBudget }
}
```

### **3. Budget Allocation System**

```typescript
// Default shares from database (can be overridden)
interface BudgetShares {
  projectShellShare: number    // Default: 66%
  projectInteriorShare: number // Default: 22%
  projectLandscapeShare: number // Default: 12%
}

// Budget distribution calculation
function distributeBudget(totalBudget: number, shares: BudgetShares) {
  // Normalize shares to ensure they sum to 100%
  const total = shares.projectShellShare + shares.projectInteriorShare + shares.projectLandscapeShare
  const normalizer = total !== 1.0 ? 1.0 / total : 1.0
  
  const shellBudget = totalBudget * shares.projectShellShare * normalizer
  const interiorBudget = totalBudget * shares.projectInteriorShare * normalizer
  const landscapeBudget = totalBudget * shares.projectLandscapeShare * normalizer
  
  return { shellBudget, interiorBudget, landscapeBudget }
}
```

### **4. Engineering Discipline Allocation**

```typescript
// Engineering percentages (varies by building type and tier)
interface EngineeringShares {
  structuralDesignShare: number    // e.g., 0.1716 (new), 0.0858 (remodel)
  civilDesignShare: number         // e.g., 0.033 (both new and remodel)
  mechanicalDesignShare: number    // e.g., 0.0396
  electricalDesignShare: number    // e.g., 0.0297  
  plumbingDesignShare: number      // e.g., 0.0231
  telecomDesignShare: number       // e.g., 0.0099
}

// Architecture gets remainder after engineering
function calculateDisciplineBudgets(shellBudget: number, engineering: EngineeringShares) {
  const structuralBudget = shellBudget * engineering.structuralDesignShare
  const civilBudget = shellBudget * engineering.civilDesignShare
  const mechanicalBudget = shellBudget * engineering.mechanicalDesignShare
  const electricalBudget = shellBudget * engineering.electricalDesignShare
  const plumbingBudget = shellBudget * engineering.plumbingDesignShare
  const telecomBudget = shellBudget * engineering.telecomDesignShare
  
  // Architecture gets what's left
  const totalEngineering = structuralBudget + civilBudget + mechanicalBudget + 
                          electricalBudget + plumbingBudget + telecomBudget
  const architectureBudget = shellBudget - totalEngineering
  
  return { architectureBudget, structuralBudget, civilBudget, 
          mechanicalBudget, electricalBudget, plumbingBudget, telecomBudget }
}
```

### **5. Hours Calculation (Non-Linear Formula)**

```typescript
// Critical: This is the exact formula from Excel model
function calculateProjectHours(params: {
  newAreaFt2: number,
  existingAreaFt2: number,
  categoryMultiplier: number
}) {
  const totalArea = params.newAreaFt2 + params.existingAreaFt2
  
  // Base hours factor formula (from Excel)
  const hoursFactorBase = 0.21767 + 11.21274 * Math.pow(totalArea, -0.53816)
  const hoursFactorAlt = hoursFactorBase - 0.08
  
  // Apply construction type and category factors
  const newFactor = hoursFactorAlt * 0.9 * params.categoryMultiplier
  const remodelFactor = hoursFactorAlt * 0.77 * params.categoryMultiplier
  
  // Calculate total hours
  const newHours = newFactor * params.newAreaFt2
  const remodelHours = remodelFactor * params.existingAreaFt2  
  const totalHours = newHours + remodelHours
  
  return { totalHours, newHours, remodelHours }
}
```

### **6. Fee Structure Generation**

```typescript
// Market rate vs Louis Amy pricing
function calculateFees(params: {
  totalBudget: number,
  totalHours: number,
  categoryMultiplier: number,
  disciplines: DisciplineBudgets
}) {
  // Market rate (top-down approach)
  const marketFeeRate = 0.178025631 // From Excel model for architecture
  const marketFee = params.totalBudget * marketFeeRate * params.categoryMultiplier
  
  // Louis Amy rate (bottom-up approach)
  const avgLaborRate = 35.73 // $/hour
  const avgOverheadRate = 46.10 // $/hour  
  const markup = 2.0 // 100% markup
  const louisAmyFee = params.totalHours * (avgLaborRate + avgOverheadRate) * markup
  
  // Contract price (with strategic discount)
  const maxDiscount = 0.25 // Maximum 25% discount
  const contractPrice = Math.max(marketFee * (1 - maxDiscount), louisAmyFee)
  
  return { marketFee, louisAmyFee, contractPrice }
}
```

## 🎨 Three-Option Generation Logic

### **Option A: Fully Integrated Vision ($187,099)**
```typescript
const optionA = {
  investment: 187099,
  scope: [
    'Architecture + Interiors + Landscape',
    'Full Structural/Civil/Plumbing coordination', 
    'Reality Capture (Scan-to-BIM)',
    'Interior & Exterior VR',
    'Construction oversight'
  ],
  excluded: [],
  idealWhen: 'Maximum cohesion, single-point accountability'
}
```

### **Option B: Collaborative Partnership ($126,636)**
```typescript
const optionB = {
  investment: 126636,
  scope: [
    'Architecture + Structural/Civil/Plumbing',
    'Design Integration & Coordination with client ID',
    'Landscape by Louis Amy',
    'Exterior VR (interior as add-on)',
    'BIM federation and clash resolution'
  ],
  excluded: ['Interior design authorship'],
  idealWhen: 'Keep trusted designer while preserving technical integrity'
}
```

### **Option C: Architectural Foundation ($87,898)**
```typescript
const optionC = {
  investment: 87898,
  scope: [
    'Architecture + Structural/Civil/Plumbing permits',
    'Reality Capture baseline',
    'Exterior visualization only'
  ],
  excluded: ['Interior design', 'Landscape authoring', 'Interior coordination'],
  idealWhen: 'Self-manage interiors and coordination risk'
}
```

## 📊 Data Flow Architecture

### **Admin Tool Data Flow**
```
User Input → Validation → Database Lookup → Calculation Engine → Results Display
     ↓
Generate Proposal → Client Data Preparation → Proposal Link Creation
```

### **Client Proposal Data Flow**
```
Proposal Token → Database Query → Client-Safe Data → Interactive Display → Conversion Flow
```

### **Database Schema (Supabase)**
```sql
-- Core cost data
CREATE TABLE building_cost_data (
  id SERIAL PRIMARY KEY,
  building_use TEXT NOT NULL,
  building_type TEXT NOT NULL,
  building_tier TEXT NOT NULL,
  category INTEGER NOT NULL,
  shell_new_min DECIMAL,
  shell_new_target DECIMAL,
  shell_new_max DECIMAL,
  shell_remodel_min DECIMAL,
  shell_remodel_target DECIMAL,
  shell_remodel_max DECIMAL,
  interior_new_min DECIMAL,
  interior_new_target DECIMAL,
  interior_new_max DECIMAL,
  project_shell_share DECIMAL,
  project_interior_share DECIMAL,
  project_landscape_share DECIMAL,
  architectural_design_share DECIMAL,
  structural_design_share DECIMAL,
  civil_design_share DECIMAL,
  mechanical_design_share DECIMAL,
  electrical_design_share DECIMAL,
  plumbing_design_share DECIMAL,
  telecom_design_share DECIMAL
);

-- Proposal management
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  project_data JSONB NOT NULL,
  calculations JSONB NOT NULL,
  options JSONB NOT NULL
);
```

## 🔄 Real-Time Calculation Updates

### **React State Management**
```typescript
// Admin calculator state
interface CalculatorState {
  // Inputs
  buildingClassification: ProjectClassification
  areas: { new: number, existing: number, site: number }
  multipliers: { historic: number, remodel: number }
  overrides: BudgetShares & CostOverrides
  
  // Calculated results (auto-update on input change)
  budgets: ProjectBudgets
  disciplines: DisciplineBudgets  
  hours: ProjectHours
  fees: FeeStructure
  options: ThreeOptions
}

// Update trigger system
useEffect(() => {
  const results = runCalculations(calculatorState)
  setResults(results)
}, [calculatorState]) // Recalculate on any input change
```

## 🎯 Validation & Quality Assurance

### **Formula Validation Tests**
```typescript
// Test against known Excel outputs
describe('Budget Calculations', () => {
  test('Dr. De Jesús project matches calibrated expectations', () => {
    // Use constants to avoid hardcoding expectations
    import { DR_DE_JESUS_PROJECT, CONFIG } from '@/lib/constants'
    
    const result = calculateBudgets(DR_DE_JESUS_PROJECT)
    
    expect(result.totalBudget).toBeCloseTo(CONFIG.VALIDATION.totalBudget, 0)
    expect(result.shellBudget).toBeCloseTo(CONFIG.VALIDATION.shellBudget, 1)
    expect(result.interiorBudget).toBeCloseTo(CONFIG.VALIDATION.interiorBudget, 1)
    expect(result.landscapeBudget).toBeCloseTo(CONFIG.VALIDATION.landscapeBudget, 1)
    
    // Budget consistency check: 4,407 ft² × $195/ft² × 1.0 = $859,365 ✓
    const expectedBudget = 4407 * 195 * 1.0
    expect(expectedBudget).toBeCloseTo(859365, 0)
  })
})
```

### **Client Experience Validation**
- [ ] No hourly rates visible anywhere in client interface
- [ ] Option A always displayed first (anchor high)
- [ ] All dollar amounts formatted properly ($123,456)
- [ ] Chris Do language principles followed
- [ ] Mobile responsiveness verified

## 🔄 Update Triggers & Performance

### **Real-Time Calculations**
- **Debounced updates:** 300ms delay on slider changes
- **Optimistic UI:** Show changes immediately, validate async
- **Error handling:** Graceful fallbacks for invalid inputs
- **Performance target:** < 100ms calculation time

### **Data Persistence**
- **Admin tool:** Auto-save project configurations
- **Client proposals:** Version lock on acceptance
- **Analytics:** Track all client interactions
- **Audit trail:** Log all calculation parameter changes

---

## 🚨 Implementation Priorities for AI Agents

### **Phase 1: Core Engine (Hours 2-8)**
1. Implement exact formulas from Excel model
2. Database lookup functions for cost ranges
3. Budget and discipline calculations
4. Hours calculation with non-linear formula
5. Three-option generation logic

### **Phase 2: Admin Interface (Hours 8-12)**  
1. Project setup forms with validation
2. Real-time calculation displays
3. Interactive sliders and overrides
4. Data visualization components
5. Proposal generation and preview

### **Phase 3: Client Experience (Hours 12-20)**
1. Personalized proposal pages
2. Interactive option comparison
3. Budget visualization (no internal data)
4. 3D model integration
5. Conversion flow interface

### **Phase 4: Integration (Hours 20-24)**
1. Admin → Client data pipeline
2. Nira 3D model embedding
3. Performance optimization
4. Dr. De Jesús project setup
5. Production deployment

**Critical:** Every AI agent must maintain calculation accuracy and Chris Do principles throughout development.
