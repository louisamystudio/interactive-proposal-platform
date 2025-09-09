// Simple JavaScript test for Louis Amy calculations (no TypeScript dependencies)
console.log('🧮 Testing Louis Amy Calculation Engine...')
console.log('=========================================')

// Test data from Dr. De Jesús project
const testData = {
  buildingType: 'Custom Houses',
  category: 5,
  newAreaFt2: 0,
  existingAreaFt2: 4407,
  newTargetPSF: 390,
  remodelTargetPSF: 195,
  historicMultiplier: 1.0,
  remodelMultiplier: 1.0
}

// Constants
const CATEGORY_MULTIPLIERS = { 1: 0.9, 2: 1.0, 3: 1.1, 4: 1.2, 5: 1.3 }
const HFA_OFFSET = 0.08
const MARKET_FEE_RATE = 0.178025631
const AVG_LABOR_RATE = 35.73
const AVG_OVERHEAD_RATE = 46.10
const MARKUP = 2.0
const MAX_DISCOUNT = 0.25

// Budget shares (66% shell, 22% interior, 12% landscape)
const shares = {
  projectShellShare: 0.66,
  projectInteriorShare: 0.22,
  projectLandscapeShare: 0.12
}

// Engineering shares for shell budget
const engineering = {
  structuralDesignShare: 0.0858,
  civilDesignShare: 0.033,
  mechanicalDesignShare: 0.0396,
  electricalDesignShare: 0.0297,
  plumbingDesignShare: 0.0231,
  telecomDesignShare: 0.0099
}

// Utility functions
function round2(n) { return Math.round(n * 100) / 100 }
function round0(n) { return Math.round(n) }

// Budget calculation
function calculateBudgets() {
  const { newAreaFt2, existingAreaFt2, newTargetPSF, remodelTargetPSF, historicMultiplier, remodelMultiplier } = testData

  // Apply multipliers to costs
  const adjustedNewPSF = newTargetPSF * historicMultiplier
  const adjustedRemodelPSF = remodelTargetPSF * remodelMultiplier

  // Calculate individual budgets
  const newBudget = newAreaFt2 * adjustedNewPSF
  const remodelBudget = existingAreaFt2 * adjustedRemodelPSF
  const totalBudget = newBudget + remodelBudget

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

// Hours calculation
function calculateHours() {
  const { newAreaFt2, existingAreaFt2 } = testData
  const totalArea = newAreaFt2 + existingAreaFt2
  const categoryMultiplier = CATEGORY_MULTIPLIERS[testData.category]

  // Non-linear hours formula (exact from Excel)
  const base = 0.21767 + 11.21274 * Math.pow(totalArea, -0.53816)
  const alt = base - HFA_OFFSET

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

// Fee calculation
function calculateFees(totalBudget, totalHours) {
  const categoryMultiplier = CATEGORY_MULTIPLIERS[testData.category]

  // Market fee (top-down approach)
  const marketFee = totalBudget * MARKET_FEE_RATE * categoryMultiplier

  // Louis Amy fee (bottom-up approach)
  const louisAmyFee = totalHours * (AVG_LABOR_RATE + AVG_OVERHEAD_RATE) * MARKUP

  // Contract price (strategic pricing)
  const contractPrice = Math.max(
    marketFee * (1 - MAX_DISCOUNT),
    louisAmyFee
  )

  return {
    marketFee: round2(marketFee),
    louisAmyFee: round2(louisAmyFee),
    contractPrice: round2(contractPrice)
  }
}

// Run calculations
const budgets = calculateBudgets()
const hours = calculateHours()
const fees = calculateFees(budgets.totalBudget, hours.totalHours)

// Expected results for validation
const expectedResults = {
  totalBudget: 859365,
  shellBudget: 567180.9,
  interiorBudget: 189060.3,
  landscapeBudget: 103123.8,
  totalHours: 1148.27,
  contractPrice: 187925.55,
  optionA: 187099,
  optionB: 126636,
  optionC: 87898
}

// Display results
console.log('\n📊 Budget Results:')
console.log(`Total Budget: $${budgets.totalBudget.toLocaleString()} (Expected: $${expectedResults.totalBudget.toLocaleString()})`)
console.log(`Shell Budget: $${budgets.shellBudget.toLocaleString()} (Expected: $${expectedResults.shellBudget.toLocaleString()})`)
console.log(`Interior Budget: $${budgets.interiorBudget.toLocaleString()} (Expected: $${expectedResults.interiorBudget.toLocaleString()})`)
console.log(`Landscape Budget: $${budgets.landscapeBudget.toLocaleString()} (Expected: $${expectedResults.landscapeBudget.toLocaleString()})`)

console.log('\n⏰ Hours Results:')
console.log(`Total Hours: ${hours.totalHours} (Expected: ${expectedResults.totalHours})`)

console.log('\n💰 Fee Results:')
console.log(`Contract Price: $${fees.contractPrice.toLocaleString()} (Expected: $${expectedResults.contractPrice.toLocaleString()})`)

// Validation
const budgetMatch = Math.abs(budgets.totalBudget - expectedResults.totalBudget) < 100
const shellMatch = Math.abs(budgets.shellBudget - expectedResults.shellBudget) < 10
const interiorMatch = Math.abs(budgets.interiorBudget - expectedResults.interiorBudget) < 10
const landscapeMatch = Math.abs(budgets.landscapeBudget - expectedResults.landscapeBudget) < 10
const hoursMatch = Math.abs(hours.totalHours - expectedResults.totalHours) < 10
const contractMatch = Math.abs(fees.contractPrice - expectedResults.contractPrice) < 1000

console.log('\n✅ Validation Results:')
console.log(`Budget Match: ${budgetMatch ? 'PASS' : 'FAIL'}`)
console.log(`Shell Match: ${shellMatch ? 'PASS' : 'FAIL'}`)
console.log(`Interior Match: ${interiorMatch ? 'PASS' : 'FAIL'}`)
console.log(`Landscape Match: ${landscapeMatch ? 'PASS' : 'FAIL'}`)
console.log(`Hours Match: ${hoursMatch ? 'PASS' : 'FAIL'}`)
console.log(`Contract Match: ${contractMatch ? 'PASS' : 'FAIL'}`)

const overallSuccess = budgetMatch && shellMatch && interiorMatch && landscapeMatch && hoursMatch && contractMatch
console.log(`\n🏆 Overall: ${overallSuccess ? 'SUCCESS - Ready for Phase 2!' : 'NEEDS ADJUSTMENT'}`)

if (!overallSuccess) {
  console.log('\n🔧 Suggested Adjustments:')
  if (!budgetMatch) console.log('- Check cost per square foot multipliers')
  if (!shellMatch) console.log('- Verify budget share distribution (should sum to 100%)')
  if (!hoursMatch) console.log('- Adjust HFA_OFFSET constant (currently 0.08)')
  if (!contractMatch) console.log('- Review fee calculation parameters')
}
