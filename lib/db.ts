// Database utilities - using Supabase only

// Database query helper
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  // This function will be implemented using Supabase client in a real application
  console.warn("Database query function called, but pg package is removed. Implement Supabase client logic here.");
  return [];
}

// Single result query helper
export async function querySingle<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

// Test database connection
export async function testConnection() {
  // This function will be implemented using Supabase client in a real application
  console.log("Testing database connection (Supabase)...");
  // In a real scenario, you would check Supabase client connectivity here.
  console.log("Supabase connection test would be performed here.");
  return true;
}