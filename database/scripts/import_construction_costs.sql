-- Import script for PR Construction Cost Index 2025
-- Usage with psql (client-side):
--   psql "$DATABASE_URL" -f database/schema/construction_cost_index.sql
--   \copy pr_construction_cost_index_2025 FROM 'ABSOLUTE_PATH_TO_CSV' WITH (FORMAT csv, HEADER true)
-- NOTE: Because the CSV headers differ from the target column names and include special characters,
-- direct COPY is not reliable unless the staging table matches the CSV headers exactly. Prefer the TypeScript
-- importer which maps headers robustly:
--   npm run db:import:index -- --commit --file "References/PR_Construction_Cost_Index_2025_filled (1).csv"

-- Verification queries
select count(*) as row_count from pr_construction_cost_index_2025;
select building_use, building_type, category, building_tier, shell_existing_target, interior_existing_target
from pr_construction_cost_index_2025
order by building_use, building_type, category, building_tier
limit 10;

