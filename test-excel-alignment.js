// Test Excel-aligned calculations
const { calculateExcelProject } = require('./lib/excel-aligned-calculations')

console.log('🧮 Testing Excel-Aligned Calculation Engine...')
console.log('=========================================')

// Dr. De Jesús project data from Excel
const testData = {
  classification: {
    buildingUse: 'Residential',
    buildingType: 'Custom Houses',
    buildingTier: 'High',
    category: 5,
    designLevel: 3
  },
  areas: {
    newAreaFt2: 0,
    existingAreaFt2: 4407
  },
  costs: {
    newTargetPSF: 390,
    remodelTargetPSF: 195
  },
  multipliers: {
    historicMultiplier: 1.0,
    remodelMultiplier: 0.5  // Excel shows 0.5
  },
  shares: {
    projectShellShare: 0.66,
    projectInteriorShare: 0.22,
    projectLandscapeShare: 0.12
  },
  engineering: {
    structuralDesignShare: 0.0858,
    civilDesignShare: 0.033,
    mechanicalDesignShare: 0.0396,
    electricalDesignShare: 0.0297,
    plumbingDesignShare: 0.0231,
    telecomDesignShare: 0.0099
  }
}

// Run calculations
const results = calculateExcelProject(testData)

// Expected results from Excel
const expected = {
  totalBudget: 859365,
  shellBudget: 567180.9,
  interiorBudget: 189060.3,
  landscapeBudget: 103123.8,
  totalHours: 1184,
  contractPrice: 137743.5
}

// Display results
console.log('\n📊 Budget Results:')
console.log(`Total Budget: $${results.budgets.totalBudget.toLocaleString()} (Expected: $${expected.totalBudget.toLocaleString()})`)
console.log(`  Note: Excel shows multiplier 0.5 but expects budget of $859,365`)
console.log(`  With 0.5: ${4407 * 195 * 0.5} = $429,682.50`)
console.log(`  With 1.0: ${4407 * 195 * 1.0} = $859,365`)
console.log(`Shell Budget: $${results.budgets.shellBudget.toLocaleString()} (Expected: $${expected.shellBudget.toLocaleString()})`)
console.log(`Interior Budget: $${results.budgets.interiorBudget.toLocaleString()} (Expected: $${expected.interiorBudget.toLocaleString()})`)
console.log(`Landscape Budget: $${results.budgets.landscapeBudget.toLocaleString()} (Expected: $${expected.landscapeBudget.toLocaleString()})`)

console.log('\n⏰ Hours Results:')
console.log(`Total Hours: ${results.hours.totalHours} (Expected: ${expected.totalHours})`)
console.log(`Hours Factor: ${results.hours.hoursFactor}`)

console.log('\n💰 Fee Results:')
console.log(`Market Fee: $${results.fees.marketFee.toLocaleString()}`)
console.log(`In-House Market Price: $${results.fees.inHouseMarketPrice.toLocaleString()}`)
console.log(`Contract Price: $${results.fees.contractPrice.toLocaleString()} (Expected: $${expected.contractPrice.toLocaleString()})`)

console.log('\n💡 Client Options:')
console.log(`Option A: $${results.options.A.investment.toLocaleString()}`)
console.log(`Option B: $${results.options.B.investment.toLocaleString()}`)
console.log(`Option C: $${results.options.C.investment.toLocaleString()}`)

// Validation
const budgetMatch = Math.abs(results.budgets.totalBudget - expected.totalBudget) < 100
const hoursMatch = Math.abs(results.hours.totalHours - expected.totalHours) < 10
const contractMatch = Math.abs(results.fees.contractPrice - expected.contractPrice) < 100

console.log('\n✅ Validation Results:')
console.log(`Budget Match: ${budgetMatch ? 'PASS' : 'FAIL'} (${results.budgets.totalBudget} vs ${expected.totalBudget})`)
console.log(`Hours Match: ${hoursMatch ? 'PASS' : 'FAIL'} (${results.hours.totalHours} vs ${expected.totalHours})`)
console.log(`Contract Match: ${contractMatch ? 'PASS' : 'FAIL'} (${results.fees.contractPrice} vs ${expected.contractPrice})`)

const overallSuccess = budgetMatch && hoursMatch && contractMatch
console.log(`\n🏆 Overall: ${overallSuccess ? 'SUCCESS - Excel Alignment Achieved!' : 'NEEDS ADJUSTMENT'}`)
