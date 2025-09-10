import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      // Return fallback options
      return NextResponse.json({
        options: [
          { use: 'Residential', types: ['Custom Houses', 'Standard Houses', 'Apartments'] },
          { use: 'Commercial', types: ['Office Buildings', 'Retail Spaces'] },
          { use: 'Hospitality', types: ['Hotels', 'Restaurants'] },
          { use: 'Healthcare', types: ['Medical Offices', 'Hospitals'] },
          { use: 'Education', types: ['Schools'] },
          { use: 'Industrial', types: ['Warehouses'] },
          { use: 'Mixed Use', types: ['Residential/Commercial'] }
        ]
      })
    }

    // Fetch all unique building uses and types from database
    const { data, error } = await supabase
      .from('building_cost_data')
      .select('building_use, building_type')
      .order('building_use')
      .order('building_type')

    if (error || !data) {
      console.warn('Could not fetch building options from database:', error)
      // Return fallback options
      return NextResponse.json({
        options: [
          { use: 'Residential', types: ['Custom Houses', 'Standard Houses', 'Apartments'] },
          { use: 'Commercial', types: ['Office Buildings', 'Retail Spaces'] },
          { use: 'Hospitality', types: ['Hotels', 'Restaurants'] },
          { use: 'Healthcare', types: ['Medical Offices', 'Hospitals'] },
          { use: 'Education', types: ['Schools'] },
          { use: 'Industrial', types: ['Warehouses'] },
          { use: 'Mixed Use', types: ['Residential/Commercial'] }
        ]
      })
    }

    // Group by building use
    const optionsMap = new Map<string, Set<string>>()
    
    data.forEach((row: any) => {
      if (!optionsMap.has(row.building_use)) {
        optionsMap.set(row.building_use, new Set())
      }
      optionsMap.get(row.building_use)?.add(row.building_type)
    })

    // Convert to array format
    const options = Array.from(optionsMap.entries()).map(([use, typesSet]) => ({
      use,
      types: Array.from(typesSet).sort()
    }))

    return NextResponse.json({ options })
  } catch (error) {
    console.error('Error fetching building options:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}