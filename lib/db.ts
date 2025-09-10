import { Pool } from 'pg'

// Create PostgreSQL connection pool using DATABASE_URL
const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString,
  ssl: false, // Replit PostgreSQL doesn't require SSL
  max: 10, // Reduce pool size for better management
  idleTimeoutMillis: 10000, // Reduce idle timeout
  connectionTimeoutMillis: 5000, // Increase connection timeout
  query_timeout: 10000, // Add query timeout
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
    const result = await pool.query('SELECT NOW()')
    console.log('Database connected successfully at:', result.rows[0].now)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}