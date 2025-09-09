import { NextRequest, NextResponse } from 'next/server'
import { projectService } from '@/lib/supabase'

// POST /api/projects - Save a project with overrides (NOT database defaults)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, projectData, clientData, overrides, databaseDefaults } = body

    // Validate required fields
    if (!name || !projectData) {
      return NextResponse.json(
        { error: 'Project name and data are required' },
        { status: 400 }
      )
    }

    // Save project to projects table (separate from cost index)
    const project = await projectService.save({
      name,
      project_data: {
        projectData,
        clientData,
        overrides,
        databaseDefaults, // Include defaults for reference
        savedAt: new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: project.id,
        name: project.name,
        created: project.created_at
      }
    })
  } catch (error) {
    console.error('Error saving project:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save project' 
      },
      { status: 500 }
    )
  }
}

// GET /api/projects - List all saved projects
export async function GET() {
  try {
    const projects = await projectService.list()

    return NextResponse.json({
      success: true,
      data: projects.map(p => ({
        id: p.id,
        name: p.name,
        created_at: p.created_at,
        updated_at: p.updated_at,
        hasClientData: !!(p.project_data as any)?.clientData,
        hasOverrides: !!(p.project_data as any)?.overrides
      }))
    })
  } catch (error) {
    console.error('Error listing projects:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list projects' 
      },
      { status: 500 }
    )
  }
}
