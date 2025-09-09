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
  client_name?: string
  client_email?: string
  status: 'draft' | 'sent' | 'viewed' | 'selected'
  created_at: string
  updated_at: string
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
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Project[]
  },

  // Get project by id
  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Project
  }
}
