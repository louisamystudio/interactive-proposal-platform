import { config } from 'dotenv'
import { Client } from 'pg'
import path from 'path'

// Load env from .env.local at repo root
config({ path: path.resolve(process.cwd(), '.env.local') })

async function createProposalsTable() {
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
      -- Create proposals table
      CREATE TABLE IF NOT EXISTS public.proposals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(50) UNIQUE NOT NULL,
        business_name VARCHAR(255),
        project_name VARCHAR(255),
        client_name VARCHAR(255),
        client_email VARCHAR(255),
        project_info TEXT,
        project_square_feet NUMERIC,
        project_budget NUMERIC,
        project_hours NUMERIC,
        project_interior_budget NUMERIC,
        project_interior_hours NUMERIC,
        project_shell_budget NUMERIC,
        project_shell_hours NUMERIC,
        project_pool_budget NUMERIC,
        project_pool_hours NUMERIC,
        project_landscape_budget NUMERIC,
        project_landscape_hours NUMERIC,
        design_details JSONB,
        calculation_details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
        status VARCHAR(50) DEFAULT 'draft'
      );

      -- Create index on token for fast lookups
      CREATE INDEX IF NOT EXISTS idx_proposals_token ON proposals(token);

      -- Create index on created_at for ordering
      CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);

      -- Create index on status
      CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

      -- Enable Row Level Security (RLS)
      ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Allow public read with token" ON proposals;
      DROP POLICY IF EXISTS "Allow public insert" ON proposals;
      DROP POLICY IF EXISTS "Allow public update" ON proposals;

      -- Create policy to allow anonymous read access via token
      CREATE POLICY "Allow public read with token" ON proposals
        FOR SELECT
        USING (true);

      -- Create policy to allow insert for creating proposals
      CREATE POLICY "Allow public insert" ON proposals
        FOR INSERT
        WITH CHECK (true);

      -- Create policy to allow update 
      CREATE POLICY "Allow public update" ON proposals
        FOR UPDATE
        USING (true);

      -- Add updated_at trigger
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Drop trigger if exists and recreate
      DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
      CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE
        ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    await client.query(sql)
    console.log('✅ Proposals table created successfully')

    // Notify PostgREST to reload schema cache
    await client.query("SELECT pg_catalog.pg_notify('pgrst', 'reload schema');")
    console.log('✅ Schema cache reloaded')

    // Verify the table was created
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'proposals' 
      ORDER BY ordinal_position
      LIMIT 5
    `)
    console.log('\n📋 Table structure (first 5 columns):', result.rows)

  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the script
createProposalsTable()
