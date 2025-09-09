// scripts/verify-ssot-alignment.ts - Final SSOT alignment verification
import { DR_DE_JESUS_PROJECT, CONFIG, MODE } from '../lib/constants'
import { calculateProject } from '../lib/calculations'

function verifyBudgetMathFixed() {
  console.log('🧮 Budget Math Verification (Post-Patch):')
  console.log('=====================================')
  console.log('')

  const { areas, costs, multipliers } = DR_DE_JESUS_PROJECT
  
  // Calculate step by step
  const adjustedRemodelPSF = costs.remodelTargetPSF * multipliers.remodelMultiplier
  const calculatedBudget = areas.existingAreaFt2 * adjustedRemodelPSF
  
  console.log(`📊 Budget Calculation:`)
  console.log(`  ${areas.existingAreaFt2} ft² × $${costs.remodelTargetPSF}/ft² × ${multipliers.remodelMultiplier} multiplier`)
  console.log(`  = ${areas.existingAreaFt2} × ${adjustedRemodelPSF} = $${calculatedBudget.toLocaleString()}`)
  console.log('')
  
  const expectedBudget = CONFIG.VALIDATION.totalBudget
  const isCorrect = Math.abs(calculatedBudget - expectedBudget) < 1
  
  console.log(`  Expected: $${expectedBudget.toLocaleString()}`)
  console.log(`  Status: ${isCorrect ? '✅ FIXED' : '❌ STILL BROKEN'}`)
  console.log('')
  
  return isCorrect
}

function verifyFullCalculation() {
  console.log('⚙️ Full Calculation Chain Verification:')
  console.log('====================================')
  console.log('')
  
  const result = calculateProject(DR_DE_JESUS_PROJECT)
  const targets = CONFIG.VALIDATION
  
  console.log(`📋 Mode: ${MODE}`)
  console.log(`📊 Calculated vs Expected:`)
  console.log('')
  
  const checks: Array<{ name: string; calculated: number; expected: number }> = [
    { name: 'Total Budget', calculated: result.budgets.totalBudget, expected: targets.totalBudget },
    { name: 'Shell Budget', calculated: result.budgets.shellBudget, expected: targets.shellBudget },
    { name: 'Interior Budget', calculated: result.budgets.interiorBudget, expected: targets.interiorBudget },
    { name: 'Landscape Budget', calculated: result.budgets.landscapeBudget, expected: targets.landscapeBudget },
    { name: 'Total Hours', calculated: result.hours.totalHours, expected: targets.totalHours },
    { name: 'Contract Price', calculated: result.fees.contractPrice, expected: targets.contractPrice }
  ]
  
  let allMatch = true
  
  checks.forEach(check => {
    const tolerance = check.name.includes('Budget') ? 1 : (check.name.includes('Hours') ? 2 : 2)
    const matches = Math.abs(check.calculated - check.expected) < tolerance
    allMatch = allMatch && matches
    
    console.log(`  ${matches ? '✅' : '❌'} ${check.name}:`)
    console.log(`      Calculated: ${typeof check.calculated === 'number' ? 
                      (check.name.includes('Hours') ? check.calculated.toFixed(2) : `$${check.calculated.toLocaleString()}`) : 
                      check.calculated}`)
    console.log(`      Expected:   ${typeof check.expected === 'number' ? 
                      (check.name.includes('Hours') ? check.expected.toFixed(2) : `$${check.expected.toLocaleString()}`) : 
                      check.expected}`)
    console.log('')
  })
  
  console.log(`🎯 Overall Alignment: ${allMatch ? '✅ PERFECT' : '⚠️ NEEDS ATTENTION'}`)
  console.log('')
  
  return { allMatch, result, targets }
}

function verifyClientOptionsDecoupled() {
  console.log('🎭 Client Options Verification:')
  console.log('=============================')
  console.log('')
  
  const result = calculateProject(DR_DE_JESUS_PROJECT)
  const clientOptions = result.options
  
  console.log(`💰 Internal Contract Calculation: $${result.fees.contractPrice.toLocaleString()}`)
  console.log('')
  console.log(`🎯 Client-Facing Options (Strategic Pricing):`)
  console.log(`  Option A: $${clientOptions.A.investment.toLocaleString()} - "${clientOptions.A.valuePromise}"`)
  console.log(`  Option B: $${clientOptions.B.investment.toLocaleString()} - "${clientOptions.B.valuePromise}"`)
  console.log(`  Option C: $${clientOptions.C.investment.toLocaleString()} - "${clientOptions.C.valuePromise}"`)
  console.log('')
  
  // Verify decoupling (options should not equal contract price)
  const optionADecoupled = clientOptions.A.investment !== result.fees.contractPrice
  const anchoredHigh = clientOptions.A.investment > clientOptions.B.investment && 
                      clientOptions.B.investment > clientOptions.C.investment
  
  console.log(`  ✅ Options decoupled from contract: ${optionADecoupled ? 'YES' : 'NO'}`)
  console.log(`  ✅ Anchored high (A > B > C): ${anchoredHigh ? 'YES' : 'NO'}`)
  console.log(`  ✅ Option A ~= contract (within range): ${Math.abs(clientOptions.A.investment - result.fees.contractPrice) < 10000 ? 'YES' : 'NO'}`)
  console.log('')
  
  return { optionADecoupled, anchoredHigh }
}

function verifyChrisDoCompliance() {
  console.log('👨‍🏫 Chris Do Compliance Final Check:')
  console.log('==================================')
  console.log('')
  
  const result = calculateProject(DR_DE_JESUS_PROJECT)
  
  // Check that client-safe data contains no internal calculations
  const clientSafeData = {
    projectName: "Casa Vista",
    budgets: result.budgets,
    options: result.options
    // Explicitly exclude: hours, fees (internal only)
  }
  
  const serialized = JSON.stringify(clientSafeData)
  
  // Check for forbidden content
  const hasHourlyRates = serialized.match(/35\.73|46\.10|164|hourly|rate.*hour/i)
  const hasInternalFees = serialized.match(/louisAmyFee|marketFee|markup/i)
  const hasEffortLanguage = serialized.match(/effort|work.*hour|per.*hour/i)
  
  console.log(`  ❌ Contains hourly rates: ${hasHourlyRates ? 'FAIL' : '✅ PASS'}`)
  console.log(`  ❌ Contains internal fees: ${hasInternalFees ? 'FAIL' : '✅ PASS'}`)
  console.log(`  ❌ Contains effort language: ${hasEffortLanguage ? 'FAIL' : '✅ PASS'}`)
  console.log('')
  
  // Check for required value language
  const options = result.options
  const hasValueLanguage = Object.values(options).every(option => 
    option.valuePromise.match(/luxury|alliance|foundation|precision|cohesion|transformation/i)
  )
  
  console.log(`  ✅ Value-focused language: ${hasValueLanguage ? '✅ PASS' : 'FAIL'}`)
  console.log(`  ✅ Option A anchored first: ${options.A.investment > options.B.investment ? '✅ PASS' : 'FAIL'}`)
  console.log('')
  
  const fullCompliance = !hasHourlyRates && !hasInternalFees && !hasEffortLanguage && hasValueLanguage
  console.log(`🎯 Full Chris Do Compliance: ${fullCompliance ? '✅ PERFECT' : '⚠️ NEEDS REVIEW'}`)
  console.log('')
  
  return fullCompliance
}

function main() {
  console.log('🔍 FINAL SSOT ALIGNMENT VERIFICATION')
  console.log('===================================')
  console.log('')
  
  const budgetFixed = verifyBudgetMathFixed()
  const { allMatch } = verifyFullCalculation()
  const { optionADecoupled, anchoredHigh } = verifyClientOptionsDecoupled()
  const chrisDoCompliant = verifyChrisDoCompliance()
  
  console.log('📋 Final Status Summary:')
  console.log('=======================')
  console.log('')
  console.log(`  Budget Math Fixed: ${budgetFixed ? '✅' : '❌'}`)
  console.log(`  Calculations Aligned: ${allMatch ? '✅' : '❌'}`)
  console.log(`  Options Properly Decoupled: ${optionADecoupled ? '✅' : '❌'}`)
  console.log(`  Chris Do Compliant: ${chrisDoCompliant ? '✅' : '❌'}`)
  console.log(`  Premium Anchoring: ${anchoredHigh ? '✅' : '❌'}`)
  console.log('')
  
  const readyForDevelopment = budgetFixed && allMatch && optionADecoupled && chrisDoCompliant && anchoredHigh
  
  if (readyForDevelopment) {
    console.log('🚀 READY FOR 24-HOUR SPRINT!')
    console.log('')
    console.log('Next commands:')
    console.log('  npm test calculations    # Final validation')
    console.log('  npm run dev             # Begin development')
    console.log('  npm run calibration:show # Review active mode')
    console.log('')
    console.log('🎯 AI Agents can begin development immediately.')
  } else {
    console.log('🚨 NEEDS ATTENTION BEFORE DEPLOYMENT')
    console.log('')
    console.log('Review failed checks above and apply necessary fixes.')
  }
  
  return readyForDevelopment
}

if (require.main === module) {
  main()
}

export { verifyBudgetMathFixed, verifyFullCalculation, verifyChrisDoCompliance }
