// lib/calculations.ts - Calibrated calculation engine using constants
import { 
  BudgetShares, 
  CalcInput, 
  CalculationResults, 
  DisciplineBudgets, 
  FeeStructure, 
  ProjectBudgets, 
  ProjectHours,
  ThreeOptions,
  Category
} from './types'

// Import calibrated constants (MODE can be 'EXCEL' or 'SSOT')
import { CONFIG, CLIENT_OPTIONS, DR_DE_JESUS_PROJECT as PROJECT_REFERENCE, MODE } from './constants'
import { calculateExcelProject } from './excel-aligned-calculations'
// Database-aware calculation is lazy-loaded to avoid initializing Supabase during tests

// Export active configuration for validation
export const ACTIVE_CONFIG = CONFIG
export const VALIDATION_TARGETS = CONFIG.VALIDATION

// Export database-aware calculation function (lazy import)
export async function calculateProjectWithDatabase(input: CalcInput) {
  const mod = await import('./db/database-calculations')
  return mod.calculateProjectWithDatabase(input)
}

// Utility functions
export const round2 = (n: number) => Math.round(n * 100) / 100
export const round0 = (n: number) => Math.round(n)

/**
 * Calculate project budgets from areas and costs
 */
export function calculateBudgets(input: CalcInput): ProjectBudgets {
  const { newAreaFt2, existingAreaFt2 } = input.areas
  const { newTargetPSF, remodelTargetPSF } = input.costs
  const { historicMultiplier, remodelMultiplier } = input.multipliers

  // Apply multipliers to costs
  const adjustedNewPSF = newTargetPSF * historicMultiplier
  const adjustedRemodelPSF = remodelTargetPSF * remodelMultiplier

  // Calculate individual budgets
  const newBudget = newAreaFt2 * adjustedNewPSF
  const remodelBudget = existingAreaFt2 * adjustedRemodelPSF
  const totalBudget = newBudget + remodelBudget

  // Normalize shares to ensure they sum to 100%
  const shares = normalizeShares(input.shares)
  
  // Distribute total budget
  const shellBudget = totalBudget * shares.projectShellShare
  const interiorBudget = totalBudget * shares.projectInteriorShare
  const landscapeBudget = totalBudget * shares.projectLandscapeShare

  return {
    newBudget: round2(newBudget),
    remodelBudget: round2(remodelBudget),
    totalBudget: round2(totalBudget),
    shellBudget: round2(shellBudget),
    interiorBudget: round2(interiorBudget),
    landscapeBudget: round2(landscapeBudget)
  }
}

/**
 * Normalize budget shares to sum to 100%
 */
function normalizeShares(shares: BudgetShares): BudgetShares {
  const sum = shares.projectShellShare + shares.projectInteriorShare + shares.projectLandscapeShare
  
  if (Math.abs(sum - 1.0) < 0.001) return shares // Already normalized
  
  return {
    projectShellShare: shares.projectShellShare / sum,
    projectInteriorShare: shares.projectInteriorShare / sum,
    projectLandscapeShare: shares.projectLandscapeShare / sum
  }
}

/**
 * Calculate engineering discipline budgets (applied to shell budget only)
 */
export function calculateDisciplineBudgets(
  shellBudget: number, 
  engineering: CalcInput['engineering']
): DisciplineBudgets {
  // First round each engineering discipline to 2 decimals
  const structuralBudget = round2(shellBudget * engineering.structuralDesignShare)
  const civilBudget = round2(shellBudget * engineering.civilDesignShare)
  const mechanicalBudget = round2(shellBudget * engineering.mechanicalDesignShare)
  const electricalBudget = round2(shellBudget * engineering.electricalDesignShare)
  const plumbingBudget = round2(shellBudget * engineering.plumbingDesignShare)
  const telecomBudget = round2(shellBudget * engineering.telecomDesignShare)

  // Architecture gets exact remainder so totals match shellBudget at cent precision
  const totalEngineeringRounded = structuralBudget + civilBudget + mechanicalBudget +
    electricalBudget + plumbingBudget + telecomBudget
  const architectureBudget = round2(shellBudget - totalEngineeringRounded)

  return {
    architectureBudget,
    structuralBudget,
    civilBudget,
    mechanicalBudget,
    electricalBudget,
    plumbingBudget,
    telecomBudget
  }
}

/**
 * Calculate project hours using calibrated non-linear formula
 */
export function calculateProjectHours(input: CalcInput): ProjectHours {
  const { newAreaFt2, existingAreaFt2 } = input.areas
  const totalArea = newAreaFt2 + existingAreaFt2
  const categoryMultiplier = CONFIG.CATEGORY_MULTIPLIERS[input.classification.category]

  // Non-linear hours formula with calibrated offset
  const base = 0.21767 + 11.21274 * Math.pow(totalArea, -0.53816)
  const alt = base - CONFIG.HFA_OFFSET

  // Apply construction type and category factors
  const newFactor = alt * 0.9 * categoryMultiplier
  const remodelFactor = alt * 0.77 * categoryMultiplier

  // Calculate hours by construction type
  const newHours = newFactor * newAreaFt2
  const remodelHours = remodelFactor * existingAreaFt2
  const totalHours = newHours + remodelHours

  return {
    totalHours: round2(totalHours),
    newHours: round2(newHours),
    remodelHours: round2(remodelHours)
  }
}

/**
 * Calculate fee structures using calibrated constants
 */
export function calculateFees(
  totalBudget: number, 
  totalHours: number, 
  category: Category
): FeeStructure {
  const categoryMultiplier = CONFIG.CATEGORY_MULTIPLIERS[category]

  // Market fee (top-down approach) with calibrated rate
  const marketFee = totalBudget * CONFIG.MARKET_FEE_RATE * categoryMultiplier

  // Louis Amy fee (bottom-up approach) with calibrated rates
  const louisAmyFee = totalHours * (CONFIG.AVG_LABOR_RATE + CONFIG.AVG_OVERHEAD_RATE) * CONFIG.MARKUP

  // Contract price (strategic pricing) with calibrated discount
  const contractPrice = Math.max(
    marketFee * (1 - CONFIG.MAX_DISCOUNT), 
    louisAmyFee
  )

  return {
    marketFee: round2(marketFee),
    louisAmyFee: round2(louisAmyFee),
    contractPrice: round2(contractPrice)
  }
}

/**
 * Generate three client-facing options using constants
 */
export function generateThreeOptions(): ThreeOptions {
  // Use CLIENT_OPTIONS from constants to ensure consistency
  return {
    A: {
      investment: CLIENT_OPTIONS.A.investment,
      scope: [
        'Architecture + Interiors + Landscape',
        'Full Structural/Civil/Plumbing coordination',
        'Reality Capture (Scan-to-BIM)',
        'Interior & Exterior VR',
        'Construction oversight',
        'Single accountable team'
      ],
      excluded: [],
      idealWhen: 'Maximum cohesion, speed of decisions, and single-point accountability',
      valuePromise: CLIENT_OPTIONS.A.valuePromise
    },
    B: {
      investment: CLIENT_OPTIONS.B.investment,
      scope: [
        'Architecture + Structural/Civil/Plumbing',
        'Design Integration & Coordination with client ID',
        'Landscape by Louis Amy',
        'Exterior VR (interior as add-on)',
        'BIM federation and clash resolution'
      ],
      excluded: ['Interior design authorship'],
      idealWhen: 'Keep trusted designer while preserving architectural coherence and technical integrity',
      valuePromise: CLIENT_OPTIONS.B.valuePromise
    },
    C: {
      investment: CLIENT_OPTIONS.C.investment,
      scope: [
        'Architecture + Structural/Civil/Plumbing permits',
        'Reality Capture baseline',
        'Exterior visualization only'
      ],
      excluded: ['Interior design', 'Landscape authoring', 'Interior coordination'],
      idealWhen: 'Self-manage interiors and coordination risk with your designer',
      valuePromise: CLIENT_OPTIONS.C.valuePromise
    }
  }
}

/**
 * Main calculation orchestrator
 */
export function calculateProject(input: CalcInput): CalculationResults {
  // Use Excel-aligned calculations when in EXCEL mode
  if (MODE === 'EXCEL') {
    const excelResults = calculateExcelProject(input)
    
    // Calculate disciplines using Excel budget
    const disciplines = calculateDisciplineBudgets(excelResults.budgets.shellBudget, input.engineering)
    
    return {
      budgets: excelResults.budgets,
      disciplines,
      hours: excelResults.hours,
      fees: excelResults.fees,
      options: generateThreeOptions() // Still use the fixed client options
    }
  }
  
  // Original SSOT calculations
  const budgets = calculateBudgets(input)
  const disciplines = calculateDisciplineBudgets(budgets.shellBudget, input.engineering)
  const hours = calculateProjectHours(input)
  const fees = calculateFees(budgets.totalBudget, hours.totalHours, input.classification.category)
  const options = generateThreeOptions()

  return {
    budgets,
    disciplines, 
    hours,
    fees,
    options
  }
}

// Export reference project for validation (uses corrected multiplier)
export const DR_DE_JESUS_PROJECT = PROJECT_REFERENCE
