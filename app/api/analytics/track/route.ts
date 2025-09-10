import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, event_data, user_agent, client_ip } = body

    if (!event_type) {
      return NextResponse.json({ error: 'Event type required' }, { status: 400 })
    }

    // Get proposal ID from token if provided
    let proposalId = event_data?.proposalId
    
    if (!proposalId && event_data?.proposalToken) {
      const supabase = createClient()
      const { data: proposal } = await supabase
        .from('proposals')
        .select('id')
        .eq('token', event_data.proposalToken)
        .single()
      
      proposalId = proposal?.id
    }

    if (!proposalId) {
      console.warn('No proposal ID found for event:', event_type)
      // Still track the event but without proposal association
    }

    const supabase = createClient()
    
    if (!supabase) {
      // Fallback mode - just log and return success
      console.log('Analytics event (fallback):', { event_type, event_data })
      return NextResponse.json({ success: true })
    }
    
    const { error } = await supabase
      .from('proposal_events')
      .insert({
        proposal_id: proposalId,
        event_type,
        event_data,
        user_agent: user_agent || request.headers.get('user-agent'),
        client_ip: client_ip || request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip')
      })

    if (error) {
      console.error('Failed to track event:', error)
      // Don't return error to client - analytics should fail silently
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Always return success to prevent client errors
    return NextResponse.json({ success: true })
  }
}