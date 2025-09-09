import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured - using fallback mode')
}

// Only create client if we have valid environment variables
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Types for our database tables
export interface Proposal {
  id: string
  token: string
  project_data: Record<string, unknown> // This will be our CalcInput type
  full_results?: Record<string, unknown> // Complete calculation results (admin only)
  client_safe_data?: Record<string, unknown> // Pre-filtered data for client view
  client_name?: string
  client_email?: string
  status: 'draft' | 'active' | 'sent' | 'viewed' | 'selected'
  created_at: string
  updated_at: string
  expires_at?: string
  viewed_at?: string
  selected_option?: 'A' | 'B' | 'C'
  notes?: string
}

export interface ProposalView {
  id: string
  proposal_id: string
  viewed_at: string
  ip_address?: string
  user_agent?: string
  duration_seconds?: number
}

export interface Project {
  id: string
  name: string
  project_data: Record<string, unknown> // CalcInput type
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const proposalService = {
  // Create a new proposal
  async create(data: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) {
      // Fallback mode - return mock data
      console.log('Using fallback mode for proposal creation')
      return {
        id: `fallback-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
    
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return proposal
  },

  // Get proposal by token
  async getByToken(token: string) {
    if (!supabase) {
      // Fallback mode - return null
      console.log('Using fallback mode for proposal retrieval')
      return null
    }
    
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('token', token)
      .single()
    
    if (error) throw error
    return data as Proposal
  },

  // Update proposal
  async update(id: string, updates: Partial<Proposal>) {
    if (!supabase) {
      // Fallback mode - return mock data
      console.log('Using fallback mode for proposal update')
      return { id, ...updates, updated_at: new Date().toISOString() }
    }
    
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Log a view
  async logView(proposalId: string, metadata?: Partial<ProposalView>) {
    if (!supabase) {
      // Fallback mode - just log to console
      console.log('Proposal view logged (fallback mode):', proposalId, metadata)
      return
    }
    
    const { error } = await supabase
      .from('proposal_views')
      .insert({
        proposal_id: proposalId,
        ...metadata
      })
    
    if (error) throw error
  }
}

export const projectService = {
  // Save a project
  async save(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) {
      console.log('Using fallback mode for project save')
      return {
        id: `fallback-${Date.now()}`,
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // List all projects
  async list() {
    if (!supabase) {
      console.log('Using fallback mode for project list')
      return []
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Project[]
  },

  // Get project by id
  async getById(id: string) {
    if (!supabase) {
      console.log('Using fallback mode for project getById')
      return null
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Project
  }
}
