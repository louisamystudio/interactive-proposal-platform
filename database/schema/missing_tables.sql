-- Missing database tables for Louis Amy calculation system
-- These tables are referenced in lib/db/construction-costs.ts but were not defined

-- Table for calculation constants used in formulas
create table if not exists public.calculation_constants (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value numeric not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table for category multipliers
create table if not exists public.category_multipliers (
  id uuid primary key default gen_random_uuid(),
  category integer not null unique check (category between 1 and 5),
  multiplier numeric not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_calculation_constants_key on public.calculation_constants(key);
create index if not exists idx_category_multipliers_category on public.category_multipliers(category);

-- Insert default calculation constants (from Excel analysis)
insert into public.calculation_constants (key, value, description) values
  ('HFA_OFFSET', 0.08, 'Hours formula adjustment factor'),
  ('HOURS_BASE_A', 0.21767, 'Hours formula base coefficient A'),
  ('HOURS_BASE_B', 11.21274, 'Hours formula base coefficient B'),
  ('HOURS_EXPONENT', -0.53816, 'Hours formula exponent'),
  ('NEW_CONSTRUCTION_FACTOR', 0.9, 'New construction hours multiplier'),
  ('REMODEL_FACTOR', 0.77, 'Remodel construction hours multiplier'),
  ('MARKET_FEE_RATE', 0.178025631, 'Market fee rate for top-down calculation'),
  ('MAX_DISCOUNT', 0.25, 'Maximum discount allowed on market fee'),
  ('AVG_LABOR_RATE', 35.72987981, 'Average hourly labor rate'),
  ('AVG_OVERHEAD_RATE', 39.40706103, 'Average hourly overhead rate'),
  ('PRICING_MARKUP', 2.0, 'Pricing markup on bottom-up costs')
on conflict (key) do update set
  value = excluded.value,
  description = excluded.description,
  updated_at = timezone('utc'::text, now());

-- Insert category multipliers
insert into public.category_multipliers (category, multiplier, description) values
  (1, 0.9, 'Basic complexity - lowest multiplier'),
  (2, 1.0, 'Standard complexity - baseline'),
  (3, 1.1, 'Moderate complexity - slight increase'),
  (4, 1.2, 'High complexity - significant increase'),
  (5, 1.3, 'Maximum complexity - highest multiplier')
on conflict (category) do update set
  multiplier = excluded.multiplier,
  description = excluded.description,
  updated_at = timezone('utc'::text, now());

-- Enable RLS if needed (optional)
-- alter table public.calculation_constants enable row level security;
-- alter table public.category_multipliers enable row level security;

-- Create trigger for updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply trigger to both tables
drop trigger if exists handle_updated_at_calculation_constants on public.calculation_constants;
create trigger handle_updated_at_calculation_constants
  before update on public.calculation_constants
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at_category_multipliers on public.category_multipliers;
create trigger handle_updated_at_category_multipliers
  before update on public.category_multipliers
  for each row execute procedure public.handle_updated_at();
