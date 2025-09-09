import { config } from 'dotenv'
import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse'

// Load env from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

interface CSVRow {
  'Building Use': string
  'Building Type': string
  'Category': string
  'Building Tier': string
  'shell New Construction Min $/ft² All-in': string
  'shell Existing to Remodel Min $/ft² All-in': string
  'shell New Construction Target $/ft² All-in': string
  'shell Existing to Remodel Target $/ft² All-in': string
  'shell New Construction Max $/ft² All-in': string
  'shell Existing to Remodel Max $/ft² All-in': string
  'Interior New Construction Min $/ft² All-in': string
  'Interior Existing to Remodel Min $/ft² All-in': string
  'Interior New Construction Target $/ft² All-in': string
  'Interior Existing to Remodel Target $/ft² All-in': string
  'Interior New Construction Max $/ft² All-in': string
  'Interior Existing to Remodel Max $/ft² All-in': string
  'Outdoor & Landscape New Construction Min $/ft² All-in': string
  'Outdoor & Landscape Existing to Remodel Min $/ft² All-in': string
  'Outdoor & Landscape New Construction Target $/ft² All-in': string
  'Outdoor & Landscape Existing to Remodel Target $/ft² All-in': string
  'Outdoor & Landscape New Construction Max $/ft² All-in': string
  'Outdoor & Landscape Existing to Remodel Max $/ft² All-in': string
  'Swimming Pool New Construction Min $/ft² All-in': string
  'Swimming Pool Existing to Remodel Min $/ft² All-in': string
  'Swimming Pool New Construction Target $/ft² All-in': string
  'Swimming Pool Existing to Remodel Target $/ft² All-in': string
  'Swimming Pool New Construction Max $/ft² All-in': string
  'Swimming Pool Existing to Remodel Max $/ft² All-in': string
  'Project Shell Share (%)': string
  'Project Interior Share (%)': string
  'Project Landscape Share (%)': string
  'Architectural Design Share (%)': string
  'Interior Design Share (%)': string
  'Landscape Design Share (%)': string
  'Structural Design Share (%)': string
  'Civil Design Share (%)': string
  'Mechanical Design Share (%)': string
  'Electrical Design Share (%)': string
  'Plumbing Design Share (%)': string
  'Telecommunication Design (%)': string
  'Project Shell Share': string
  'Project Interior Share': string
  'Project Landscape Share': string
  'Architectural Design Share': string
  'Interior Design Share': string
  'Landscape Design Share': string
  'Structural Design Share': string
  'Civil Design Share': string
  'Mechanical Design Share': string
  'Electrical Design Share': string
  'Plumbing Design Share': string
  'Telecomunication Design': string
  'Telecommunication Design': string
}

async function importCSVToSupabase() {
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

    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'References', 'PR_Construction_Cost_Index_2025_filled (1).csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    // Parse CSV
    const records: CSVRow[] = await new Promise((resolve, reject) => {
      parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        skip_records_with_empty_values: false,
        trim: true,
        relax_quotes: true,
        relax_column_count: true
      }, (err, records) => {
        if (err) reject(err)
        else resolve(records)
      })
    })

    console.log(`📊 Found ${records.length} records in CSV`)

    // Clear existing data
    await client.query('TRUNCATE TABLE pr_construction_cost_index_2025 CASCADE')
    console.log('🧹 Cleared existing data')

    // Insert data in batches
    const batchSize = 10
    let insertedCount = 0

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const values: any[] = []
      const placeholders: string[] = []

      batch.forEach((row, batchIndex) => {
        const offset = batchIndex * 40
        
        // Helper function to convert empty string or null to NULL
        const toNumericOrNull = (val: string) => {
          if (!val || val === '' || val === 'null' || val === 'undefined') return null
          const num = parseFloat(val)
          return isNaN(num) ? null : num
        }

        values.push(
          row['Building Use'],
          row['Building Type'],
          parseInt(row['Category']) || 0,
          row['Building Tier'],
          
          // Shell costs
          toNumericOrNull(row['shell New Construction Min $/ft² All-in']),
          toNumericOrNull(row['shell Existing to Remodel Min $/ft² All-in']),
          toNumericOrNull(row['shell New Construction Target $/ft² All-in']),
          toNumericOrNull(row['shell Existing to Remodel Target $/ft² All-in']),
          toNumericOrNull(row['shell New Construction Max $/ft² All-in']),
          toNumericOrNull(row['shell Existing to Remodel Max $/ft² All-in']),
          
          // Interior costs
          toNumericOrNull(row['Interior New Construction Min $/ft² All-in']),
          toNumericOrNull(row['Interior Existing to Remodel Min $/ft² All-in']),
          toNumericOrNull(row['Interior New Construction Target $/ft² All-in']),
          toNumericOrNull(row['Interior Existing to Remodel Target $/ft² All-in']),
          toNumericOrNull(row['Interior New Construction Max $/ft² All-in']),
          toNumericOrNull(row['Interior Existing to Remodel Max $/ft² All-in']),
          
          // Landscape costs
          toNumericOrNull(row['Outdoor & Landscape New Construction Min $/ft² All-in']),
          toNumericOrNull(row['Outdoor & Landscape Existing to Remodel Min $/ft² All-in']),
          toNumericOrNull(row['Outdoor & Landscape New Construction Target $/ft² All-in']),
          toNumericOrNull(row['Outdoor & Landscape Existing to Remodel Target $/ft² All-in']),
          toNumericOrNull(row['Outdoor & Landscape New Construction Max $/ft² All-in']),
          toNumericOrNull(row['Outdoor & Landscape Existing to Remodel Max $/ft² All-in']),
          
          // Pool costs
          toNumericOrNull(row['Swimming Pool New Construction Min $/ft² All-in']),
          toNumericOrNull(row['Swimming Pool Existing to Remodel Min $/ft² All-in']),
          toNumericOrNull(row['Swimming Pool New Construction Target $/ft² All-in']),
          toNumericOrNull(row['Swimming Pool Existing to Remodel Target $/ft² All-in']),
          toNumericOrNull(row['Swimming Pool New Construction Max $/ft² All-in']),
          toNumericOrNull(row['Swimming Pool Existing to Remodel Max $/ft² All-in']),
          
          // Project shares (using non-percentage columns)
          toNumericOrNull(row['Project Shell Share']),
          toNumericOrNull(row['Project Interior Share']),
          toNumericOrNull(row['Project Landscape Share']),
          
          // Design shares (using non-percentage columns)
          toNumericOrNull(row['Architectural Design Share']),
          toNumericOrNull(row['Interior Design Share']),
          toNumericOrNull(row['Landscape Design Share']),
          toNumericOrNull(row['Structural Design Share']),
          toNumericOrNull(row['Civil Design Share']),
          toNumericOrNull(row['Mechanical Design Share']),
          toNumericOrNull(row['Electrical Design Share']),
          toNumericOrNull(row['Plumbing Design Share']),
          // Use the last column "Telecommunication Design" which has the correct 0.3, 0.4, 0.5 values
          toNumericOrNull(row['Telecommunication Design'])
        )

        const params = Array.from({ length: 40 }, (_, j) => `$${offset + j + 1}`).join(', ')
        placeholders.push(`(${params})`)
      })

      const query = `
        INSERT INTO pr_construction_cost_index_2025 (
          building_use, building_type, category, building_tier,
          shell_new_min, shell_existing_min, shell_new_target, shell_existing_target, shell_new_max, shell_existing_max,
          interior_new_min, interior_existing_min, interior_new_target, interior_existing_target, interior_new_max, interior_existing_max,
          landscape_new_min, landscape_existing_min, landscape_new_target, landscape_existing_target, landscape_new_max, landscape_existing_max,
          pool_new_min, pool_existing_min, pool_new_target, pool_existing_target, pool_new_max, pool_existing_max,
          project_shell_share_pct, project_interior_share_pct, project_landscape_share_pct,
          architectural_design_share_pct, interior_design_share_pct, landscape_design_share_pct,
          structural_design_share_pct, civil_design_share_pct, mechanical_design_share_pct,
          electrical_design_share_pct, plumbing_design_share_pct, telecommunication_design_share_pct
        ) VALUES ${placeholders.join(', ')}
      `

      await client.query(query, values)
      insertedCount += batch.length
      console.log(`✅ Inserted ${insertedCount}/${records.length} records`)
    }

    // Verify the import
    const result = await client.query('SELECT COUNT(*) FROM pr_construction_cost_index_2025')
    console.log(`\n🎉 Import complete! Total records in database: ${result.rows[0].count}`)

    // Show a sample record
    const sample = await client.query(`
      SELECT building_use, building_type, category, building_tier, 
             shell_new_target, interior_new_target, landscape_new_target,
             telecommunication_design_share_pct
      FROM pr_construction_cost_index_2025 
      WHERE building_use = 'Residential' AND building_type = 'Custom Houses' AND building_tier = 'Low'
      LIMIT 1
    `)
    console.log('\n📋 Sample record:', sample.rows[0])

    // Notify PostgREST to reload schema cache
    await client.query("SELECT pg_catalog.pg_notify('pgrst', 'reload schema');")
    console.log('✅ Schema cache reloaded')

  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the import
importCSVToSupabase()
