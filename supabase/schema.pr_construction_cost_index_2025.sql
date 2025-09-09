-- PR Construction Cost Index 2025
-- Create table to store the full dataset with one row per Building Use/Type/Category/Tier

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
  telecommunication_design_share_pct numeric,

  project_shell_share numeric,
  project_interior_share numeric,
  project_landscape_share numeric,
  architectural_design_share numeric,
  interior_design_share numeric,
  landscape_design_share numeric,
  structural_design_share numeric,
  civil_design_share numeric,
  mechanical_design_share numeric,
  electrical_design_share numeric,
  plumbing_design_share numeric,
  telecommunication_design numeric
);

create unique index if not exists pr_construction_cost_index_2025_key
on public.pr_construction_cost_index_2025 (building_use, building_type, category, building_tier);

-- Optionally enable RLS later and add policies as needed
-- alter table public.pr_construction_cost_index_2025 enable row level security;

