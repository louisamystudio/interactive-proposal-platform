import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      service: 'Louis Amy AE Studio - Interactive Proposal Platform',
      environment: process.env.NODE_ENV || 'development',
      features: [
        'Real-time calculations',
        '3D model integration',
        'Chris Do value-based pricing',
        'Mobile-responsive design',
        'Admin calculator interface',
        'Client proposal experience'
      ]
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { status: 'unhealthy', error: 'Internal server error' },
      { status: 500 }
    )
  }
}
