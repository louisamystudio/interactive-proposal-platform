// Database-aware calculation functions
import { CalcInput, CalculationResults } from '../types'
import { constructionCostService, ConstructionCostData } from './construction-costs'

/**
 * Calculate project using database values and constants
 * This ensures all calculations are aligned with database-stored formulas
 */
export async function calculateProjectWithDatabase(input: CalcInput): Promise<CalculationResults> {
  // Get calculation constants from database
  const constants = await constructionCostService.getCalculationConstants()
  
  // Get category multiplier from database
  const categoryMultiplier = await constructionCostService.getCategoryMultiplier(input.classification.category)
  
  // Get cost data to ensure we have the right shares
  const costData = await constructionCostService.getCostData(
    input.classification.buildingUse,
    input.classification.buildingType,
    input.classification.category,
    input.classification.buildingTier
  )
  
  // Step 1: Calculate Budget
  const budget = calculateBudget(input)
  
  // Step 2: Distribute Budget by Shares (from database)
  const distributedBudgets = distributeBudget(budget, costData)
  
  // Step 3: Calculate Hours using database formula
  const hours = calculateHours(input, constants, categoryMultiplier)
  
  // Step 4: Calculate Fees using database constants
  const fees = calculateFees(budget.totalBudget, hours.totalHours, constants, categoryMultiplier)
  
  // Step 5: Calculate Engineering Disciplines
  const disciplines = calculateDisciplines(distributedBudgets.shellBudget, costData)
  
  // Step 6: Generate Client Options (fixed values)
  const options = generateClientOptions()
  
  return {
    budgets: distributedBudgets,
    disciplines,
    hours,
    fees,
    options
  }
}

function calculateBudget(input: CalcInput) {
  const { newAreaFt2, existingAreaFt2 } = input.areas
  const { newTargetPSF, remodelTargetPSF } = input.costs
  const { historicMultiplier, remodelMultiplier } = input.multipliers
  
  // Apply multipliers to costs
  const adjustedNewPSF = newTargetPSF * historicMultiplier
  const adjustedRemodelPSF = remodelTargetPSF * remodelMultiplier
  
  // Calculate budgets
  const newBudget = newAreaFt2 * adjustedNewPSF
  const remodelBudget = existingAreaFt2 * adjustedRemodelPSF
  const totalBudget = newBudget + remodelBudget
  
  return {
    newBudget: Math.round(newBudget * 100) / 100,
    remodelBudget: Math.round(remodelBudget * 100) / 100,
    totalBudget: Math.round(totalBudget * 100) / 100
  }
}

function distributeBudget(budget: { newBudget: number; remodelBudget: number; totalBudget: number }, costData: { projectShares: { shellShare: number; interiorShare: number; landscapeShare: number } } | null) {
  if (!costData) {
    // Fallback to defaults if no cost data
    return {
      ...budget,
      shellBudget: Math.round(budget.totalBudget * 0.66 * 100) / 100,
      interiorBudget: Math.round(budget.totalBudget * 0.22 * 100) / 100,
      landscapeBudget: Math.round(budget.totalBudget * 0.12 * 100) / 100
    }
  }
  
  return {
    ...budget,
    shellBudget: Math.round(budget.totalBudget * costData.projectShares.shellShare * 100) / 100,
    interiorBudget: Math.round(budget.totalBudget * costData.projectShares.interiorShare * 100) / 100,
    landscapeBudget: Math.round(budget.totalBudget * costData.projectShares.landscapeShare * 100) / 100
  }
}

function calculateHours(input: CalcInput, constants: Record<string, number>, categoryMultiplier: number) {
  const { newAreaFt2, existingAreaFt2 } = input.areas
  const totalArea = newAreaFt2 + existingAreaFt2
  
  // Excel formula: base = 0.21767 + 11.21274 * (totalArea ^ -0.53816)
  const base = constants.HOURS_BASE_A + 
               constants.HOURS_BASE_B * Math.pow(totalArea, constants.HOURS_EXPONENT)
  
  // Hours factor = base - HFA_OFFSET
  const hoursFactor = base - constants.HFA_OFFSET
  
  // Apply construction type factors and category multiplier
  const newHours = newAreaFt2 * hoursFactor * constants.NEW_CONSTRUCTION_FACTOR * categoryMultiplier
  const remodelHours = existingAreaFt2 * hoursFactor * constants.REMODEL_FACTOR * categoryMultiplier
  const totalHours = newHours + remodelHours
  
  return {
    totalHours: Math.round(totalHours * 100) / 100,
    newHours: Math.round(newHours * 100) / 100,
    remodelHours: Math.round(remodelHours * 100) / 100
  }
}

function calculateFees(totalBudget: number, totalHours: number, constants: Record<string, number>, categoryMultiplier: number) {
  // Market fee (top-down approach)
  const marketFee = totalBudget * constants.MARKET_FEE_RATE * categoryMultiplier
  
  // Louis Amy fee (bottom-up approach)
  const laborCost = totalHours * constants.AVG_LABOR_RATE
  const overheadCost = totalHours * constants.AVG_OVERHEAD_RATE
  const totalCost = laborCost + overheadCost
  const louisAmyFee = totalCost * constants.PRICING_MARKUP
  
  // Contract price (strategic pricing with discount)
  const contractPrice = Math.max(
    marketFee * (1 - constants.MAX_DISCOUNT),
    louisAmyFee
  )
  
  return {
    marketFee: Math.round(marketFee * 100) / 100,
    louisAmyFee: Math.round(louisAmyFee * 100) / 100,
    contractPrice: Math.round(contractPrice * 100) / 100
  }
}

function calculateDisciplines(shellBudget: number, costData: ConstructionCostData | null) {
  if (!costData) {
    // Fallback to default shares
    return {
      architectureBudget: Math.round(shellBudget * 0.7879 * 100) / 100,
      structuralBudget: Math.round(shellBudget * 0.0858 * 100) / 100,
      civilBudget: Math.round(shellBudget * 0.033 * 100) / 100,
      mechanicalBudget: Math.round(shellBudget * 0.0396 * 100) / 100,
      electricalBudget: Math.round(shellBudget * 0.0297 * 100) / 100,
      plumbingBudget: Math.round(shellBudget * 0.0231 * 100) / 100,
      telecomBudget: Math.round(shellBudget * 0.0099 * 100) / 100
    }
  }
  
  const shares = costData.designShares
  const structuralBudget = shellBudget * shares.structural
  const civilBudget = shellBudget * shares.civil
  const mechanicalBudget = shellBudget * shares.mechanical
  const electricalBudget = shellBudget * shares.electrical
  const plumbingBudget = shellBudget * shares.plumbing
  const telecomBudget = shellBudget * shares.telecommunication
  
  // Architecture gets the remainder
  const totalEngineering = structuralBudget + civilBudget + mechanicalBudget + 
                          electricalBudget + plumbingBudget + telecomBudget
  const architectureBudget = shellBudget - totalEngineering
  
  return {
    architectureBudget: Math.round(architectureBudget * 100) / 100,
    structuralBudget: Math.round(structuralBudget * 100) / 100,
    civilBudget: Math.round(civilBudget * 100) / 100,
    mechanicalBudget: Math.round(mechanicalBudget * 100) / 100,
    electricalBudget: Math.round(electricalBudget * 100) / 100,
    plumbingBudget: Math.round(plumbingBudget * 100) / 100,
    telecomBudget: Math.round(telecomBudget * 100) / 100
  }
}

function generateClientOptions() {
  // Fixed client options as per Chris Do methodology
  return {
    A: {
      investment: 187099,
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
      valuePromise: 'The pinnacle of bespoke luxury - one team, one vision, zero compromises'
    },
    B: {
      investment: 126636,
      scope: [
        'Architecture + Structural/Civil/Plumbing',
        'Design Integration & Coordination with client ID',
        'Landscape by Louis Amy',
        'Exterior VR (interior as add-on)',
        'BIM federation and clash resolution'
      ],
      excluded: ['Interior design authorship'],
      idealWhen: 'Keep trusted designer while preserving architectural coherence and technical integrity',
      valuePromise: 'Seamless alliance - we lead integration with your interior designer'
    },
    C: {
      investment: 87898,
      scope: [
        'Architecture + Structural/Civil/Plumbing permits',
        'Reality Capture baseline',
        'Exterior visualization only'
      ],
      excluded: ['Interior design', 'Landscape authoring', 'Interior coordination'],
      idealWhen: 'Self-manage interiors and coordination risk with your designer',
      valuePromise: 'Robust foundation - permit-ready shell with self-managed coordination'
    }
  }
}

/**
 * Detailed calculation flow documentation
 * 
 * STEP 1: BUDGET CALCULATION
 * - Input: Areas (new/existing) × Cost PSF × Multipliers
 * - Formula: Budget = Area × PSF × Multiplier
 * - Database: Uses historic and remodel multipliers
 * 
 * STEP 2: BUDGET DISTRIBUTION
 * - Input: Total Budget × Project Shares (from database)
 * - Shell = Total × Shell% (e.g., 66%)
 * - Interior = Total × Interior% (e.g., 22%)
 * - Landscape = Total × Landscape% (e.g., 12%)
 * 
 * STEP 3: HOURS CALCULATION
 * - Formula: base = 0.21767 + 11.21274 × (totalArea ^ -0.53816)
 * - Hours Factor = base - HFA_OFFSET (0.08)
 * - New Hours = NewArea × HoursFactor × 0.9 × CategoryMultiplier
 * - Remodel Hours = ExistingArea × HoursFactor × 0.77 × CategoryMultiplier
 * 
 * STEP 4: FEE CALCULATION
 * - Market Fee = TotalBudget × 0.178025631 × CategoryMultiplier
 * - Labor Cost = TotalHours × $35.73/hr
 * - Overhead = TotalHours × $39.41/hr (or $46.10/hr)
 * - Louis Amy Fee = (Labor + Overhead) × 2.0 markup
 * - Contract Price = Market Fee × (1 - 0.25 discount)
 * 
 * STEP 5: DISCIPLINE BUDGETS
 * - Each discipline gets percentage of Shell Budget
 * - Architecture gets remainder after all engineering
 * - Percentages from database based on building type
 * 
 * STEP 6: CLIENT OPTIONS
 * - Fixed pricing: A=$187,099, B=$126,636, C=$87,898
 * - Strategic value messaging per Chris Do
 */
