// lib/types.ts - Single Source of Truth for all data structures
export type Category = 1|2|3|4|5

export interface BudgetShares {
  projectShellShare: number  // e.g., 0.66
  projectInteriorShare: number // 0.22
  projectLandscapeShare: number // 0.12
}

export interface EngineeringShares {
  structuralDesignShare: number
  civilDesignShare: number
  mechanicalDesignShare: number
  electricalDesignShare: number
  plumbingDesignShare: number
  telecomDesignShare: number
}

export interface ProjectClassification {
  buildingUse: 'Residential'|'Commercial'|'Healthcare'|'Educational'|'Industrial'
  buildingType: string
  buildingTier: 'Low'|'Mid'|'High'
  category: Category
  designLevel: 1|2|3
}

export interface CalcInput {
  classification: ProjectClassification
  areas: { newAreaFt2: number; existingAreaFt2: number }
  costs: { newTargetPSF: number; remodelTargetPSF: number }
  multipliers: { historicMultiplier: number; remodelMultiplier: number }
  shares: BudgetShares
  engineering: EngineeringShares
}

export interface ProjectBudgets {
  newBudget: number
  remodelBudget: number
  totalBudget: number
  shellBudget: number
  interiorBudget: number
  landscapeBudget: number
}

export interface DisciplineBudgets {
  architectureBudget: number
  structuralBudget: number
  civilBudget: number
  mechanicalBudget: number
  electricalBudget: number
  plumbingBudget: number
  telecomBudget: number
}

export interface ProjectHours {
  totalHours: number
  newHours: number
  remodelHours: number
}

export interface FeeStructure {
  marketFee: number
  louisAmyFee: number
  contractPrice: number
}

export interface Option {
  investment: number
  scope: string[]
  excluded: string[]
  idealWhen: string
  valuePromise: string
}

export interface ThreeOptions {
  A: Option
  B: Option
  C: Option
}

export interface CalculationResults {
  budgets: ProjectBudgets
  disciplines: DisciplineBudgets
  hours: ProjectHours
  fees: FeeStructure
  options: ThreeOptions
}

// Client-safe proposal data (never expose internal calculations)
export interface ClientProposalData {
  projectName: string
  clientName: string
  location: string
  totalBudget: number
  buildingAreaFt2: number
  siteAreaM2: number
  costPerSqFt: number
  budgetDistribution: {
    shell: { amount: number; percentage: number }
    interior: { amount: number; percentage: number }
    landscape: { amount: number; percentage: number }
  }
  options: ThreeOptions
  // Never include: hours, hourly rates, internal fees, margins
}
