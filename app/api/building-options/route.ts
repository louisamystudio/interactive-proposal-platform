import { NextResponse } from 'next/server'
import { query } from '@/lib/db-server'

export async function GET() {
  try {
    // Fetch all unique building uses and types from PostgreSQL database
    const data = await query<{ building_use: string; building_type: string }>(`
      SELECT DISTINCT building_use, building_type 
      FROM building_cost_data 
      ORDER BY building_use, building_type
    `)

    if (!data || data.length === 0) {
      console.warn('No data found in database, using fallback options')
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
    
    data.forEach((row) => {
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