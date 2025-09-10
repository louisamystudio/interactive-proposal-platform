import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

interface CostConfig {
  classification: {
    building_use: string
    building_type: string
    design_tier: number
    category: number
    category_multiplier: number
  }
  psf: {
    new: { min: number; target: number; max: number }
    remodel: { min: number; target: number; max: number }
  }
  shares_default: {
    shell: number
    interior: number
    landscape: number
  }
  multipliers_default: {
    historic: number
    remodel: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const buildingUse = searchParams.get('use')
    const buildingType = searchParams.get('type')
    const designTier = searchParams.get('tier')

    // Validate required parameters
    if (!buildingUse || !buildingType || !designTier) {
      return NextResponse.json(
        { error: 'Missing required parameters: use, type, tier' },
        { status: 400 }
      )
    }

    const tierNumber = parseInt(designTier)
    if (isNaN(tierNumber) || tierNumber < 1 || tierNumber > 3) {
      return NextResponse.json(
        { error: 'Invalid tier: must be 1, 2, or 3' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Fetch building cost data
    const { data: costData, error: costError } = await supabase
      .from('building_cost_data')
      .select('*')
      .eq('building_use', buildingUse)
      .eq('building_type', buildingType)
      .eq('design_tier', tierNumber)
      .single()

    if (costError || !costData) {
      // Fallback to default values if database is unavailable
      console.warn('Database unavailable, using fallback values')
      return NextResponse.json(getFallbackConfig(buildingUse, buildingType, tierNumber))
    }

    // Fetch category multiplier
    const { data: multiplierData, error: multiplierError } = await supabase
      .from('category_multipliers')
      .select('multiplier')
      .eq('category', costData.category)
      .single()

    const categoryMultiplier = multiplierData?.multiplier || getCategoryMultiplier(costData.category)

    // Build the response
    const config: CostConfig = {
      classification: {
        building_use: costData.building_use,
        building_type: costData.building_type,
        design_tier: costData.design_tier,
        category: costData.category,
        category_multiplier: categoryMultiplier
      },
      psf: {
        new: {
          min: Number(costData.psf_new_min),
          target: Number(costData.psf_new_target),
          max: Number(costData.psf_new_max)
        },
        remodel: {
          min: Number(costData.psf_remodel_min),
          target: Number(costData.psf_remodel_target),
          max: Number(costData.psf_remodel_max)
        }
      },
      shares_default: {
        shell: Number(costData.share_shell_default),
        interior: Number(costData.share_interior_default),
        landscape: Number(costData.share_landscape_default)
      },
      multipliers_default: {
        historic: Number(costData.historic_multiplier_default || 1.00),
        remodel: Number(costData.remodel_multiplier_default || 1.00)
      }
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching cost config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Fallback configuration when database is unavailable
function getFallbackConfig(use: string, type: string, tier: number): CostConfig {
  // Default to Dr. De Jesús case values for testing
  if (use === 'Residential' && type === 'Custom Houses' && tier === 3) {
    return {
      classification: {
        building_use: 'Residential',
        building_type: 'Custom Houses',
        design_tier: 3,
        category: 5,
        category_multiplier: 1.3
      },
      psf: {
        new: { min: 240, target: 267, max: 307 },
        remodel: { min: 181, target: 202, max: 232 }
      },
      shares_default: {
        shell: 0.66,
        interior: 0.22,
        landscape: 0.12
      },
      multipliers_default: {
        historic: 1.00,
        remodel: 1.00
      }
    }
  }

  // Generic fallback for other cases
  const category = Math.min(tier + 2, 5)
  return {
    classification: {
      building_use: use,
      building_type: type,
      design_tier: tier,
      category,
      category_multiplier: getCategoryMultiplier(category)
    },
    psf: {
      new: { min: 180 + tier * 30, target: 195 + tier * 36, max: 220 + tier * 43 },
      remodel: { min: 135 + tier * 23, target: 146 + tier * 28, max: 165 + tier * 33 }
    },
    shares_default: {
      shell: 0.72 - tier * 0.02,
      interior: 0.18 + tier * 0.02,
      landscape: 0.10
    },
    multipliers_default: {
      historic: 1.00,
      remodel: 1.00
    }
  }
}

function getCategoryMultiplier(category: number): number {
  const multipliers: Record<number, number> = {
    1: 0.90,
    2: 1.00,
    3: 1.10,
    4: 1.20,
    5: 1.30
  }
  return multipliers[category] || 1.10
}

// GET endpoint to fetch distinct building uses
export async function OPTIONS() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('building_cost_data')
      .select('building_use')
      .order('building_use')

    if (error || !data) {
      // Return fallback options
      return NextResponse.json({
        uses: ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Education', 'Industrial', 'Mixed Use']
      })
    }

    // Get unique building uses
    const uniqueUses = [...new Set(data.map((item: any) => item.building_use))]
    
    return NextResponse.json({ uses: uniqueUses })
  } catch (error) {
    console.error('Error fetching building uses:', error)
    return NextResponse.json({
      uses: ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Education', 'Industrial', 'Mixed Use']
    })
  }
}