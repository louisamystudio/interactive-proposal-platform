import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const startTime = Date.now()
  
  const health = {
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Louis Amy AE Studio - Interactive Proposal Platform',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    responseTime: 0,
    services: {
      api: 'operational',
      database: 'unknown',
      supabase: 'unknown'
    },
    features: [
      'Real-time calculations',
      '3D model integration', 
      'Chris Do value-based pricing',
      'Mobile-responsive design',
      'Admin calculator interface',
      'Client proposal experience'
    ]
  }
  
  // Test Supabase connection if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      // Quick query to test database connection
      const { data, error } = await supabase
        .from('building_uses')
        .select('id')
        .limit(1)
      
      if (!error && data) {
        health.services.database = 'operational'
        health.services.supabase = 'operational'
      } else if (error) {
        health.services.database = 'degraded'
        health.services.supabase = 'degraded'
        health.status = 'degraded'
        console.warn('Database health check warning:', error.message)
      }
    } catch (error) {
      health.services.database = 'unavailable'
      health.services.supabase = 'unavailable'
      health.status = 'unhealthy'
      health.ok = false
      console.error('Database health check error:', error)
    }
  } else {
    health.services.database = 'not_configured'
    health.services.supabase = 'not_configured'
    health.status = 'degraded'
  }
  
  // Calculate response time
  health.responseTime = Date.now() - startTime
  
  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}