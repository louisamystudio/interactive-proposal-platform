// Database utilities - using PostgreSQL directly for server-side operations
import { Pool } from 'pg'

// Create a connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Database query helper
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
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
  await pool.end()
}