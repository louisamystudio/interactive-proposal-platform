import { NextRequest, NextResponse } from 'next/server'
import { proposalService } from '@/lib/supabase'

interface ProposalParams {
  params: {
    token: string
  }
}

// GET /api/proposals/[token] - Get proposal by token
export async function GET(request: NextRequest, { params }: ProposalParams) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get proposal from database
    const proposal = await proposalService.getByToken(token)

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Log the view (but don't mark as viewed yet - that happens when they actually view it)
    // This is just for the API access
    
    return NextResponse.json({
      success: true,
      data: proposal
    })
  } catch (error) {
    console.error('Error retrieving proposal:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve proposal' 
      },
      { status: 500 }
    )
  }
}

// PATCH /api/proposals/[token] - Update proposal (mark as viewed, select option, etc.)
export async function PATCH(request: NextRequest, { params }: ProposalParams) {
  try {
    const { token } = params
    const updates = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get existing proposal
    const proposal = await proposalService.getByToken(token)

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Update proposal
    const updatedProposal = await proposalService.update(proposal.id, updates)

    // If marking as viewed for first time, log it
    if (updates.viewed_at && !proposal.viewed_at) {
      await proposalService.logView(proposal.id, {
        user_agent: request.headers.get('user-agent') || undefined,
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedProposal
    })
  } catch (error) {
    console.error('Error updating proposal:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update proposal' 
      },
      { status: 500 }
    )
  }
}
