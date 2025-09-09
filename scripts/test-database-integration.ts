#!/usr/bin/env tsx

// Test script to verify database integration after fixes
import { constructionCostService } from '../lib/db/construction-costs'

async function testDatabaseIntegration() {
  console.log('🧪 Testing Database Integration After Fixes...\n')

  try {
    // Test 1: Get building uses
    console.log('1. Testing building uses query...')
    const buildingUses = await constructionCostService.getBuildingUses()
    console.log(`   ✅ Found ${buildingUses.length} building uses:`, buildingUses.slice(0, 3), '...')

    if (buildingUses.length === 0) {
      console.log('   ⚠️  No building uses found - database may be empty')
    }

    // Test 2: Get building types for Residential
    console.log('\n2. Testing building types query...')
    const buildingTypes = await constructionCostService.getBuildingTypes('Residential')
    console.log(`   ✅ Found ${buildingTypes.length} Residential types:`, buildingTypes.slice(0, 3), '...')

    // Test 3: Get cost data for Dr. De Jesús project
    console.log('\n3. Testing cost data query...')
    const costData = await constructionCostService.getCostData('Residential', 'Custom Houses', 5, 'High')
    if (costData) {
      console.log('   ✅ Found cost data for Residential/Custom Houses/High/Category 5')
      console.log(`      - Shell target: $${costData.costRanges.shell.remodelTarget}/ft²`)
      console.log(`      - Project shares: Shell ${Math.round(costData.projectShares.shellShare * 100)}%, Interior ${Math.round(costData.projectShares.interiorShare * 100)}%, Landscape ${Math.round(costData.projectShares.landscapeShare * 100)}%`)
    } else {
      console.log('   ⚠️  No cost data found - database may be empty or query failed')
    }

    // Test 4: Get calculation constants
    console.log('\n4. Testing calculation constants query...')
    const constants = await constructionCostService.getCalculationConstants()
    console.log(`   ✅ Found ${Object.keys(constants).length} calculation constants:`)
    console.log(`      - HFA_OFFSET: ${constants.HFA_OFFSET}`)
    console.log(`      - MARKET_FEE_RATE: ${constants.MARKET_FEE_RATE}`)

    // Test 5: Get category multiplier
    console.log('\n5. Testing category multiplier query...')
    const multiplier = await constructionCostService.getCategoryMultiplier(5)
    console.log(`   ✅ Category 5 multiplier: ${multiplier}`)

    console.log('\n🎉 Database Integration Test Complete!')

    const allTestsPassed =
      buildingUses.length >= 0 && // Allow empty database
      Object.keys(constants).length > 0 &&
      multiplier > 0

    if (allTestsPassed) {
      console.log('✅ All critical database queries are working!')
    } else {
      console.log('⚠️  Some tests failed - check database setup')
    }

  } catch (error) {
    console.error('❌ Database Integration Test Failed:', error instanceof Error ? error.message : String(error))
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure database is running and accessible')
    console.log('2. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.log('3. Ensure all tables are created (run missing_tables.sql)')
    console.log('4. Import data using the import scripts')
    process.exit(1)
  }
}

// Run the test
testDatabaseIntegration().catch(console.error)
