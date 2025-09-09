import { config } from 'dotenv'
import { Client } from 'pg'
import path from 'path'

// Load env from .env.local at repo root
config({ path: path.resolve(process.cwd(), '.env.local') })

async function addNotesColumn() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env.local')
    process.exit(1)
  }

  const client = new Client({ 
    connectionString, 
    ssl: { rejectUnauthorized: false } 
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    const sql = `
      -- Add notes column if it doesn't exist
      ALTER TABLE public.proposals 
      ADD COLUMN IF NOT EXISTS notes TEXT;
      
      -- Force schema cache reload
      SELECT pg_catalog.pg_notify('pgrst', 'reload schema');
    `

    await client.query(sql)
    console.log('✅ Added notes column to proposals table')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

addNotesColumn().catch(console.error)
