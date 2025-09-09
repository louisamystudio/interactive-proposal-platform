import { NextRequest, NextResponse } from 'next/server'
import { proposalService, supabase } from '@/lib/supabase'
import crypto from 'crypto'

// Generate a unique, readable token
function generateToken(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomPart}`.toUpperCase()
}

// Generate secure token for high-security proposals
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

// Filter out sensitive data for client view
function createClientSafeData(projectData: any, results: any) {
  return {
    projectInfo: {
      buildingUse: projectData.buildingUse,
      buildingType: projectData.buildingType,
      buildingTier: projectData.buildingTier,
      totalArea: (projectData.areas?.newAreaFt2 || 0) + (projectData.areas?.existingAreaFt2 || 0),
      category: projectData.category,
      designLevel: projectData.designLevel
    },
    // Client-safe options (no hours, rates, or internal calculations)
    options: results?.options || {
      A: { investment: 187099, description: 'The pinnacle of bespoke luxury', includes: [] },
      B: { investment: 126636, description: 'Seamless alliance', includes: [] },
      C: { investment: 87898, description: 'Robust foundation', includes: [] }
    },
    // Budget distribution for visualization (no internal costs)
    distribution: {
      scanToBIM: 5344,
      buildingShell: results?.budgets?.shellBudget || 567181,
      interior: results?.budgets?.interiorBudget || 189060,
      landscape: results?.budgets?.landscapeBudget || 103124
    },
    totalBudget: results?.budgets?.totalBudget || 859365,
    contractPrice: results?.fees?.contractPrice || 137744,
    marketPrice: results?.fees?.marketFee || 187099,
    savings: (results?.fees?.marketFee || 187099) - (results?.fees?.contractPrice || 137744)
  }
}

// POST /api/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectData, clientName, clientEmail, notes, results } = body

    // Validate project data
    if (!projectData || !clientName) {
      return NextResponse.json(
        { error: 'Project data and client name are required' },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = generateToken()
    
    // Create client-safe data (filters out hours, rates, internal calculations)
    const clientSafeData = createClientSafeData(projectData, results)

    // Create proposal in database
    const proposal = await proposalService.create({
      token,
      project_data: projectData,
      client_name: clientName,
      client_email: clientEmail,
      full_results: results, // Store complete calculations (admin only)
      client_safe_data: clientSafeData, // Pre-filtered data for client view
      status: 'active',
      notes
    })

    // Generate proposal URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${request.headers.get('host')}`
    const proposalUrl = `${baseUrl}/proposal/${token}`

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
