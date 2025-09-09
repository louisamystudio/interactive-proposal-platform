import { NextRequest, NextResponse } from 'next/server'
import { proposalService, supabase } from '@/lib/supabase'

// Generate a unique, readable token
function generateToken(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomPart}`.toUpperCase()
}

// POST /api/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectData, clientName, clientEmail, notes } = body

    // Validate project data
    if (!projectData || !clientName) {
      return NextResponse.json(
        { error: 'Project data and client name are required' },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = generateToken()

    // Create proposal in database
    const proposal = await proposalService.create({
      token,
      project_data: projectData,
      client_name: clientName,
      client_email: clientEmail,
      status: 'draft',
      notes
    })

    // Generate proposal URL
    const proposalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/proposal/${token}`

    return NextResponse.json({
      success: true,
      data: {
        id: proposal.id,
        token: proposal.token,
        url: proposalUrl,
        status: proposal.status
      }
    })
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create proposal' 
      },
      { status: 500 }
    )
  }
}

// GET /api/proposals - List all proposals (admin only)
export async function GET() {
  try {
    // TODO: Add authentication check here
    // For now, this is unprotected - implement auth before production

    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })
  } catch (error) {
    console.error('Error listing proposals:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list proposals' 
      },
      { status: 500 }
    )
  }
}
