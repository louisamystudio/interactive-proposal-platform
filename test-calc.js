// Quick test script for calculations (no Jest required)
const { calculateProject, DR_DE_JESUS_PROJECT, EXPECTED_RESULTS } = require('./lib/calculations.ts')

console.log('🧮 Testing Louis Amy Calculation Engine...')
console.log('=========================================')

try {
  const results = calculateProject(DR_DE_JESUS_PROJECT)

  console.log('\n📊 Budget Results:')
  console.log(`Total Budget: $${results.budgets.totalBudget.toLocaleString()} (Expected: $${EXPECTED_RESULTS.totalBudget.toLocaleString()})`)
  console.log(`Shell Budget: $${results.budgets.shellBudget.toLocaleString()} (Expected: $${EXPECTED_RESULTS.shellBudget.toLocaleString()})`)
  console.log(`Interior Budget: $${results.budgets.interiorBudget.toLocaleString()} (Expected: $${EXPECTED_RESULTS.interiorBudget.toLocaleString()})`)
  console.log(`Landscape Budget: $${results.budgets.landscapeBudget.toLocaleString()} (Expected: $${EXPECTED_RESULTS.landscapeBudget.toLocaleString()})`)

  console.log('\n⏰ Hours Results:')
  console.log(`Total Hours: ${results.hours.totalHours} (Expected: ${EXPECTED_RESULTS.totalHours})`)

  console.log('\n💰 Fee Results:')
  console.log(`Contract Price: $${results.fees.contractPrice.toLocaleString()} (Expected: $${EXPECTED_RESULTS.contractPrice.toLocaleString()})`)

  console.log('\n🎯 Three Options:')
  console.log(`Option A: $${results.options.A.investment.toLocaleString()}`)
  console.log(`Option B: $${results.options.B.investment.toLocaleString()}`)
  console.log(`Option C: $${results.options.C.investment.toLocaleString()}`)

  // Validation
  const budgetMatch = Math.abs(results.budgets.totalBudget - EXPECTED_RESULTS.totalBudget) < 100
  const hoursMatch = Math.abs(results.hours.totalHours - EXPECTED_RESULTS.totalHours) < 10
  const contractMatch = Math.abs(results.fees.contractPrice - EXPECTED_RESULTS.contractPrice) < 1000

  console.log('\n✅ Validation Results:')
  console.log(`Budget Match: ${budgetMatch ? 'PASS' : 'FAIL'}`)
  console.log(`Hours Match: ${hoursMatch ? 'PASS' : 'FAIL'}`)
  console.log(`Contract Match: ${contractMatch ? 'PASS' : 'FAIL'}`)

  const overallSuccess = budgetMatch && hoursMatch && contractMatch
  console.log(`\n🏆 Overall: ${overallSuccess ? 'SUCCESS' : 'NEEDS ADJUSTMENT'}`)

} catch (error) {
  console.error('❌ Calculation Error:', error.message)
}
