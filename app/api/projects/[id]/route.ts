import { NextRequest, NextResponse } from 'next/server'
import { projectService } from '@/lib/supabase'

interface Params {
  params: { id: string }
}

// GET /api/projects/[id] - Retrieve a saved project by id
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Project id is required' }, { status: 400 })
    }

    const project = await projectService.getById(id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error retrieving project:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve project',
      },
      { status: 500 }
    )
  }
}

