import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    })

    // Test direct query
    const { data, error, count } = await supabase
      .from('pr_construction_cost_index_2025')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        status: 'error',
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    // Try to get one row
    const { data: sampleRow, error: sampleError } = await supabase
      .from('pr_construction_cost_index_2025')
      .select('building_use, building_type, category, building_tier')
      .limit(1)
      .single()

    return NextResponse.json({
      status: 'success',
      totalRows: count,
      hasData: count && count > 0,
      sampleRow: sampleRow || null,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
