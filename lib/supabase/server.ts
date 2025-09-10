import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured - using fallback mode')
    return null
  }

  // Use service role key if available for server-side operations
  const key = supabaseServiceKey || supabaseAnonKey
  
  return createSupabaseClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}