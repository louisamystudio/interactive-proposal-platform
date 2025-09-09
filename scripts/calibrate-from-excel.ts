// scripts/calibrate-from-excel.ts - Excel/CSV calibration script
import fs from 'fs'
import path from 'path'

/**
 * Calibration script to derive constants from Excel/CSV data
 * Ensures app calculations match spreadsheet results exactly
 */

// Golden test case from Excel (Dr. De Jesús project)
const GOLDEN_TEST_CASE = {
  // Project parameters  
  buildingType: 'Custom Houses',
  category: 5,
  totalArea: 4407,
  newAreaFt2: 0,
  existingAreaFt2: 4407,
  newTargetPSF: 390,
  remodelTargetPSF: 195,
  historicMultiplier: 1.0,
  remodelMultiplier: 0.5,
  
  // Expected outputs from Excel (update these from your spreadsheet)
  expectedTotalBudget: 859365,
  expectedShellBudget: 567180.9,
  expectedInteriorBudget: 189060.3,
  expectedLandscapeBudget: 103123.8,
  expectedTotalHours: 1184,      // Update if Excel shows different
  expectedContractPrice: 137743.5 // Update if Excel shows different
}

/**
 * Solve for HFA_OFFSET to match Excel hours
 */
function calibrateHoursFormula() {
  const { totalArea, category, expectedTotalHours, existingAreaFt2 } = GOLDEN_TEST_CASE
  
  // Base hours formula components
  const base = 0.21767 + 11.21274 * Math.pow(totalArea, -0.53816)
  const categoryMultiplier = 1.3 // Category 5
  
  // Solve for HFA_OFFSET: expectedHours = (base - offset) * 0.77 * catMult * area
  const remodelFactor = 0.77 * categoryMultiplier * existingAreaFt2
  const requiredAlt = expectedTotalHours / remodelFactor
  const calculatedOffset = base - requiredAlt
  
  return {
    originalOffset: 0.08,
    calculatedOffset: Math.round(calculatedOffset * 1000) / 1000,
    baseFormula: base,
    expectedHours: expectedTotalHours
  }
}

/**
 * Solve for fee constants to match Excel contract price
 */
function calibrateFeeStructure() {
  const { expectedTotalHours, expectedContractPrice, expectedTotalBudget, category } = GOLDEN_TEST_CASE
  
  // Market fee calculation
  const marketFeeRate = 0.178025631
  const categoryMultiplier = 1.3
  const marketFee = expectedTotalBudget * marketFeeRate * categoryMultiplier
  
  // Solve for required bottom-up parameters
  const avgLaborRate = 35.73
  const avgOverheadRate = 46.10
  const currentLouisAmyFee = expectedTotalHours * (avgLaborRate + avgOverheadRate) * 2.0
  
  // Calculate what discount would be needed
  const impliedDiscount = (marketFee - expectedContractPrice) / marketFee
  
  return {
    marketFee: Math.round(marketFee * 100) / 100,
    louisAmyFee: Math.round(currentLouisAmyFee * 100) / 100,
    expectedContract: expectedContractPrice,
    impliedDiscount: Math.round(impliedDiscount * 1000) / 1000,
    recommendedMaxDiscount: 0.25
  }
}

/**
 * Main calibration function
 */
function runCalibration() {
  console.log('🔧 Calibrating SSOT constants from Excel reference...\n')
  
  // Hours formula calibration
  const hoursCalibration = calibrateHoursFormula()
  console.log('📊 Hours Formula Calibration:')
  console.log(`  Original HFA_OFFSET: ${hoursCalibration.originalOffset}`)
  console.log(`  Calculated HFA_OFFSET: ${hoursCalibration.calculatedOffset}`)
  console.log(`  To match Excel hours: ${hoursCalibration.expectedHours}`)
  console.log('')
  
  // Fee structure calibration  
  const feeCalibration = calibrateFeeStructure()
  console.log('💰 Fee Structure Calibration:')
  console.log(`  Market Fee: $${feeCalibration.marketFee.toLocaleString()}`)
  console.log(`  Louis Amy Fee: $${feeCalibration.louisAmyFee.toLocaleString()}`)
  console.log(`  Expected Contract: $${feeCalibration.expectedContract.toLocaleString()}`)
  console.log(`  Implied Discount: ${(feeCalibration.impliedDiscount * 100).toFixed(1)}%`)
  console.log('')

  // Generate constants file
  const constants = {
    // Hours formula
    HFA_OFFSET: hoursCalibration.calculatedOffset,
    
    // Fee structure
    MARKET_FEE_RATE: 0.178025631,
    AVG_LABOR_RATE: 35.73,
    AVG_OVERHEAD_RATE: 46.10,
    MARKUP: 2.0,
    MAX_DISCOUNT: Math.max(feeCalibration.impliedDiscount, 0.25),
    
    // Category multipliers
    CATEGORY_MULTIPLIERS: {
      1: 0.9, 2: 1.0, 3: 1.1, 4: 1.2, 5: 1.3
    },
    
    // Validation targets
    DR_DE_JESUS_VALIDATION: {
      totalBudget: GOLDEN_TEST_CASE.expectedTotalBudget,
      totalHours: GOLDEN_TEST_CASE.expectedTotalHours,
      contractPrice: GOLDEN_TEST_CASE.expectedContractPrice
    }
  }

  // Write calibrated constants
  const outputPath = path.join(process.cwd(), 'data', 'constants.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(constants, null, 2))
  
  console.log(`📁 Constants written to: ${outputPath}`)
  console.log('')
  console.log('✅ Calibration complete!')
  console.log('')
  console.log('🔄 Next steps:')
  console.log('1. Review calibrated constants in data/constants.json')
  console.log('2. Update lib/calculations.ts if needed')
  console.log('3. Run npm test to verify SSOT alignment')
  console.log('4. Update GOLDEN_TEST_CASE if Excel values differ')
}

/**
 * Quick validation without writing files
 */
function validateCurrentSSO() {
  console.log('🧮 Current SSOT Validation (HFA_OFFSET=0.08):')
  
  // Calculate with current constants
  const totalArea = GOLDEN_TEST_CASE.totalArea
  const base = 0.21767 + 11.21274 * Math.pow(totalArea, -0.53816)
  const alt = base - 0.08 // Current HFA_OFFSET
  const totalHours = alt * 0.77 * 1.3 * GOLDEN_TEST_CASE.existingAreaFt2
  
  const totalBudget = GOLDEN_TEST_CASE.existingAreaFt2 * GOLDEN_TEST_CASE.remodelTargetPSF * GOLDEN_TEST_CASE.remodelMultiplier
  const marketFee = totalBudget * 0.178025631 * 1.3
  const louisAmyFee = totalHours * (35.73 + 46.10) * 2.0
  const contractPrice = Math.max(marketFee * 0.75, louisAmyFee)
  
  console.log(`  Calculated Total Budget: $${totalBudget.toLocaleString()}`)
  console.log(`  Calculated Hours: ${Math.round(totalHours * 100) / 100}`)
  console.log(`  Calculated Contract Price: $${Math.round(contractPrice * 100) / 100}`)
  console.log(`  
  Expected from Excel:
    Budget: $${GOLDEN_TEST_CASE.expectedTotalBudget.toLocaleString()}
    Hours: ${GOLDEN_TEST_CASE.expectedTotalHours}  
    Contract: $${GOLDEN_TEST_CASE.expectedContractPrice.toLocaleString()}`)
}

// Run calibration based on command line argument
if (process.argv[2] === 'validate') {
  validateCurrentSSO()
} else {
  runCalibration()
}

export { runCalibration, validateCurrentSSO }
