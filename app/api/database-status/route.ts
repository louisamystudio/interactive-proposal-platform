import { NextResponse } from 'next/server'
import { constructionCostService } from '@/lib/db/construction-costs'

export async function GET() {
  try {
    // Test database connection by trying to get building uses
    const buildingUses = await constructionCostService.getBuildingUses()
    const buildingTypes = await constructionCostService.getBuildingTypes('Residential')
    const costData = await constructionCostService.getCostData('Residential', 'Custom Houses', 5, 'High')
    const constants = await constructionCostService.getCalculationConstants()
    const categoryMultiplier = await constructionCostService.getCategoryMultiplier(5)

    // Determine if we're using fallback data vs actual database
    const hasCredentials = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
    
    // If no credentials, we're definitely using fallback
    const usingFallback = !hasCredentials || buildingUses.length === 0 || buildingTypes.length === 0
    
    const actualStatus = hasCredentials ? (usingFallback ? 'database-error-using-fallback' : 'connected') : 'fallback-only'

    return NextResponse.json({
      status: actualStatus,
      mode: usingFallback ? 'comprehensive-fallback' : 'database',
      credentials: hasCredentials ? 'configured' : 'missing',
      database: {
        buildingUses: {
          count: buildingUses.length,
          sample: buildingUses.slice(0, 3),
          source: (hasCredentials && buildingUses.length > 0) ? 'database' : 'csv-fallback'
        },
        buildingTypes: {
          count: buildingTypes.length,
          sample: buildingTypes.slice(0, 3),
          source: (hasCredentials && buildingTypes.length > 0) ? 'database' : 'csv-fallback'
        },
        costData: costData ? {
          found: true,
          source: (hasCredentials && costData.id !== 0) ? 'database' : 'csv-fallback',
          ranges: {
            shell: costData.costRanges.shell,
            interior: costData.costRanges.interior
          },
          shares: costData.projectShares
        } : { found: false },
        calculationConstants: {
          count: Object.keys(constants).length,
          source: 'fallback-constants',
          sample: {
            HFA_OFFSET: constants.HFA_OFFSET,
            MARKET_FEE_RATE: constants.MARKET_FEE_RATE
          }
        },
        categoryMultiplier: categoryMultiplier
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      mode: 'unknown',
      credentials: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      database: null,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
