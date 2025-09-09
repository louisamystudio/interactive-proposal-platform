import { NextRequest, NextResponse } from 'next/server'
import { calculateProject, calculateProjectWithDatabase } from '@/lib/calculations'
import { CalcInput } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const projectData: CalcInput = await request.json()

    // Validate required fields
    if (!projectData.classification || !projectData.areas || !projectData.costs) {
      return NextResponse.json(
        { error: 'Missing required project data' },
        { status: 400 }
      )
    }

    // Calculate project results using database-aware calculations with fallback
    let results
    try {
      results = await calculateProjectWithDatabase(projectData)
      console.log('✅ Used database-aware calculations')
    } catch (error) {
      console.warn('⚠️ Database calculations failed, using fallback:', error)
      results = calculateProject(projectData)
    }

    // Return calculation results
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Calculation failed' 
      },
      { status: 500 }
    )
  }
}

// Health check for the calculate endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    endpoint: '/api/calculate',
    method: 'POST',
    description: 'Submit project data to receive database-aware calculations with fallback',
    database_integration: 'enabled',
    fallback_mode: 'available',
    example: {
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
        remodelMultiplier: 1.0
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
  })
}
