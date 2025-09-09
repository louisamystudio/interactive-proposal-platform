// scripts/import-construction-cost-index.ts
// Import References/PR_Construction_Cost_Index_2025_filled (1).csv into Supabase table
// Table: pr_construction_cost_index_2025

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

type Row = Record<string, string | number | null>

function toSnakeCase(header: string): string {
  return header
    .replace(/ftA�|ft²|ft\^2/gi, 'ft2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
}

function normalizeNumber(v: string): number | null {
  if (v == null) return null
  const s = String(v).trim().replace(/[, ]/g, '')
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function loadCsv(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const records: string[][] = parse(raw, { skip_empty_lines: false })
  if (records.length === 0) throw new Error('CSV is empty')
  const headers = records[0].map((h) => toSnakeCase(h))
  const rows: Row[] = []
  for (let i = 1; i < records.length; i++) {
    const row: Row = {}
    const rec = records[i]
    if (!rec || rec.length === 0) continue
    let empty = true
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c] || `col_${c}`
      const val = rec[c]
      if (val && String(val).trim() !== '') empty = false
      // Attempt numeric parsing where appropriate
      const num = normalizeNumber(val)
      row[key] = num === null ? (val?.trim() ? val.trim() : null) : num
    }
    if (!empty) rows.push(row)
  }
  return { headers, rows }
}

async function main() {
  const args = process.argv.slice(2)
  const commit = args.includes('--commit')
  const fileArgIndex = args.findIndex((a) => a === '--file')
  const filePath = fileArgIndex >= 0 ? args[fileArgIndex + 1] : path.join(process.cwd(), 'References', 'PR_Construction_Cost_Index_2025_filled (1).csv')

  const exists = fs.existsSync(filePath)
  if (!exists) throw new Error(`CSV not found: ${filePath}`)

  const { headers, rows } = loadCsv(filePath)
  console.log(`Found ${rows.length} data rows. Headers: ${headers.length}`)

  // Filter down to required columns for our table schema.
  // The CSV contains duplicate share columns (percent vs absolute). Keep both where possible.
  const mappedRows = rows.map((r) => {
    // Minimal required identity for upsert key
    const building_use = (r['building_use'] ?? '') as string
    const building_type = (r['building_type'] ?? '') as string
    const building_tier = (r['building_tier'] ?? '') as string
    const category = Number(r['category'] ?? 0) || 0

    // Skip rows missing identity
    if (!building_use || !building_type || !building_tier || !category) return null

    const pick = (k: string) => (r[k] as number) ?? null

    return {
      building_use,
      building_type,
      category,
      building_tier,

      shell_new_min: pick('shell_new_construction_min_ft2_all_in'),
      shell_existing_min: pick('shell_existing_to_remodel_min_ft2_all_in'),
      shell_new_target: pick('shell_new_construction_target_ft2_all_in'),
      shell_existing_target: pick('shell_existing_to_remodel_target_ft2_all_in'),
      shell_new_max: pick('shell_new_construction_max_ft2_all_in'),
      shell_existing_max: pick('shell_existing_to_remodel_max_ft2_all_in'),

      interior_new_min: pick('interior_new_construction_min_ft2_all_in'),
      interior_existing_min: pick('interior_existing_to_remodel_min_ft2_all_in'),
      interior_new_target: pick('interior_new_construction_target_ft2_all_in'),
      interior_existing_target: pick('interior_existing_to_remodel_target_ft2_all_in'),
      interior_new_max: pick('interior_new_construction_max_ft2_all_in'),
      interior_existing_max: pick('interior_existing_to_remodel_max_ft2_all_in'),

      landscape_new_min: pick('outdoor_landscape_new_construction_min_ft2_all_in'),
      landscape_existing_min: pick('outdoor_landscape_existing_to_remodel_min_ft2_all_in'),
      landscape_new_target: pick('outdoor_landscape_new_construction_target_ft2_all_in'),
      landscape_existing_target: pick('outdoor_landscape_existing_to_remodel_target_ft2_all_in'),
      landscape_new_max: pick('outdoor_landscape_new_construction_max_ft2_all_in'),
      landscape_existing_max: pick('outdoor_landscape_existing_to_remodel_max_ft2_all_in'),

      pool_new_min: pick('swimming_pool_new_construction_min_ft2_all_in'),
      pool_existing_min: pick('swimming_pool_existing_to_remodel_min_ft2_all_in'),
      pool_new_target: pick('swimming_pool_new_construction_target_ft2_all_in'),
      pool_existing_target: pick('swimming_pool_existing_to_remodel_target_ft2_all_in'),
      pool_new_max: pick('swimming_pool_new_construction_max_ft2_all_in'),
      pool_existing_max: pick('swimming_pool_existing_to_remodel_max_ft2_all_in'),

      project_shell_share_pct: pick('project_shell_share_'),
      project_interior_share_pct: pick('project_interior_share_'),
      project_landscape_share_pct: pick('project_landscape_share_'),
      architectural_design_share_pct: pick('architectural_design_share_'),
      interior_design_share_pct: pick('interior_design_share_'),
      landscape_design_share_pct: pick('landscape_design_share_'),
      structural_design_share_pct: pick('structural_design_share_'),
      civil_design_share_pct: pick('civil_design_share_'),
      mechanical_design_share_pct: pick('mechanical_design_share_'),
      electrical_design_share_pct: pick('electrical_design_share_'),
      plumbing_design_share_pct: pick('plumbing_design_share_'),
      telecommunication_design_share_pct: pick('telecommunication_design_'),

      project_shell_share: pick('project_shell_share'),
      project_interior_share: pick('project_interior_share'),
      project_landscape_share: pick('project_landscape_share'),
      architectural_design_share: pick('architectural_design_share'),
      interior_design_share: pick('interior_design_share'),
      landscape_design_share: pick('landscape_design_share'),
      structural_design_share: pick('structural_design_share'),
      civil_design_share: pick('civil_design_share'),
      mechanical_design_share: pick('mechanical_design_share'),
      electrical_design_share: pick('electrical_design_share'),
      plumbing_design_share: pick('plumbing_design_share'),
      telecommunication_design: pick('telecommunication_design'),
    }
  }).filter(Boolean) as Row[]

  console.log(`Prepared ${mappedRows.length} rows for upsert`)

  if (!commit) {
    console.log('Dry-run complete. Use --commit to write to Supabase.')
    return
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !anon) {
    throw new Error('Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY')
  }
  const supabase = createClient(url, anon)

  const chunk = 500
  let inserted = 0
  for (let i = 0; i < mappedRows.length; i += chunk) {
    const slice = mappedRows.slice(i, i + chunk)
    const { error, count } = await supabase
      .from('pr_construction_cost_index_2025')
      .upsert(slice, {
        onConflict: 'building_use,building_type,category,building_tier',
        ignoreDuplicates: false,
        count: 'estimated',
      })
    if (error) throw error
    inserted += count || slice.length
    console.log(`Upserted ${inserted}/${mappedRows.length}`)
  }

  // Verify row count matches CSV distinct identity keys
  const identities = new Set(
    mappedRows.map(
      (r) => `${r.building_use}|${r.building_type}|${r.category}|${r.building_tier}`
    )
  )
  console.log(`Unique identity rows in CSV: ${identities.size}`)

  const { data: verifyData, error: verifyError } = await supabase
    .from('pr_construction_cost_index_2025')
    .select('building_use,building_type,category,building_tier', { count: 'exact', head: false })
    .eq('building_use', mappedRows[0].building_use as string)

  if (verifyError) throw verifyError
  console.log(`Verification sample fetch returned ${verifyData?.length ?? 0} rows`) // sample check
  console.log('Import complete. Spot-check counts in Supabase UI for final confirmation.')
}

main().catch((e) => {
  console.error('Import failed:', e)
  process.exit(1)
})

