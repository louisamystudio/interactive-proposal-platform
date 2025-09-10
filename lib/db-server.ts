// Server-side only database utilities using PostgreSQL
import { Pool } from 'pg'

// Only create pool on server side
let pool: Pool | null = null

if (typeof window === 'undefined') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
}

// Database query helper
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (!pool) {
    console.warn('Database not available on client side')
    return []
  }
  
  try {
    const result = await pool.query(text, params)
    return result.rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Single result query helper
export async function querySingle<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

// Test database connection
export async function testConnection() {
  if (!pool) {
    console.warn('Database not available on client side')
    return false
  }
  
  try {
    await pool.query('SELECT 1')
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Close the connection pool (for cleanup)
export async function closeConnection() {
  if (pool) {
    await pool.end()
  }
}