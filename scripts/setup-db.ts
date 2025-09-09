import { config } from 'dotenv'
import { Client } from 'pg'
import path from 'path'

// Load env from .env.local at repo root
config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env.local. Please add your Postgres connection string.')
    process.exit(1)
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })

  const sql = `
create table if not exists public.pr_construction_cost_index_2025 (
  id uuid primary key default gen_random_uuid(),
  building_use text not null,
  building_type text not null,
  category integer not null,
  building_tier text not null,

  shell_new_min numeric,
  shell_existing_min numeric,
  shell_new_target numeric,
  shell_existing_target numeric,
  shell_new_max numeric,
  shell_existing_max numeric,

  interior_new_min numeric,
  interior_existing_min numeric,
  interior_new_target numeric,
  interior_existing_target numeric,
  interior_new_max numeric,
  interior_existing_max numeric,

  landscape_new_min numeric,
  landscape_existing_min numeric,
  landscape_new_target numeric,
  landscape_existing_target numeric,
  landscape_new_max numeric,
  landscape_existing_max numeric,

  pool_new_min numeric,
  pool_existing_min numeric,
  pool_new_target numeric,
  pool_existing_target numeric,
  pool_new_max numeric,
  pool_existing_max numeric,

  project_shell_share_pct numeric,
  project_interior_share_pct numeric,
  project_landscape_share_pct numeric,
  architectural_design_share_pct numeric,
  interior_design_share_pct numeric,
  landscape_design_share_pct numeric,
  structural_design_share_pct numeric,
  civil_design_share_pct numeric,
  mechanical_design_share_pct numeric,
  electrical_design_share_pct numeric,
  plumbing_design_share_pct numeric,
  telecommunication_design_share_pct numeric
);

create unique index if not exists pr_construction_cost_index_2025_key
on public.pr_construction_cost_index_2025 (building_use, building_type, category, building_tier);

create table if not exists public.calculation_constants (
  key text primary key,
  value numeric not null
);

insert into public.calculation_constants (key, value) values
 ('HFA_OFFSET', 0.08),
 ('HOURS_BASE_A', 0.21767),
 ('HOURS_BASE_B', 11.21274),
 ('HOURS_EXPONENT', -0.53816),
 ('NEW_CONSTRUCTION_FACTOR', 0.9),
 ('REMODEL_FACTOR', 0.77),
 ('MARKET_FEE_RATE', 0.178025631),
 ('MAX_DISCOUNT', 0.25),
 ('AVG_LABOR_RATE', 35.72987981),
 ('AVG_OVERHEAD_RATE', 39.40706103),
 ('PRICING_MARKUP', 2.0)
on conflict (key) do update set value = excluded.value;

create table if not exists public.category_multipliers (
  category integer primary key check (category between 1 and 5),
  multiplier numeric not null
);

insert into public.category_multipliers (category, multiplier) values
 (1, 0.9), (2, 1.0), (3, 1.1), (4, 1.2), (5, 1.3)
on conflict (category) do update set multiplier = excluded.multiplier;

insert into public.pr_construction_cost_index_2025 (
  building_use, building_type, category, building_tier,
  shell_new_min, shell_existing_min, shell_new_target, shell_existing_target, shell_new_max, shell_existing_max,
  interior_new_min, interior_existing_min, interior_new_target, interior_existing_target, interior_new_max, interior_existing_max,
  landscape_new_min, landscape_existing_min, landscape_new_target, landscape_existing_target, landscape_new_max, landscape_existing_max,
  project_shell_share_pct, project_interior_share_pct, project_landscape_share_pct,
  architectural_design_share_pct, interior_design_share_pct, landscape_design_share_pct,
  structural_design_share_pct, civil_design_share_pct, mechanical_design_share_pct, electrical_design_share_pct, plumbing_design_share_pct, telecommunication_design_share_pct
) values (
  'Residential','Custom Houses',5,'High',
  380,190, 390,195, 400,200,
  380,190, 390,195, 400,200,
  150,75, 160,80, 170,85,
  66,22,12,
  60,0,0,
  8.58,3.3,3.96,2.97,2.31,0.99
)
on conflict (building_use, building_type, category, building_tier) do nothing;
`

  try {
    await client.connect()
    await client.query(sql)
    // Ensure PostgREST reloads its schema cache immediately
    await client.query("select pg_catalog.pg_notify('pgrst', 'reload schema');")
    console.log('✅ Database schema and seed applied.')
  } catch (err) {
    console.error('❌ Failed to apply schema:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()


