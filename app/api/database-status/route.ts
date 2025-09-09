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

    return NextResponse.json({
      status: 'connected',
      database: {
        buildingUses: {
          count: buildingUses.length,
          sample: buildingUses.slice(0, 3)
        },
        buildingTypes: {
          count: buildingTypes.length,
          sample: buildingTypes.slice(0, 3)
        },
        costData: costData ? {
          found: true,
          ranges: {
            shell: costData.costRanges.shell,
            interior: costData.costRanges.interior
          },
          shares: costData.projectShares
        } : { found: false },
        calculationConstants: {
          count: Object.keys(constants).length,
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
      error: error instanceof Error ? error.message : 'Unknown error',
      database: null,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
