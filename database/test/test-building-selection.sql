-- Test queries for building selection flow
-- Run these to verify database integration is working

-- 1. Get all unique building uses
SELECT DISTINCT building_use 
FROM construction_cost_index 
ORDER BY building_use;

-- 2. Get building types for Residential
SELECT DISTINCT building_type 
FROM construction_cost_index 
WHERE building_use = 'Residential'
ORDER BY building_type;

-- 3. Get tiers for Residential + Custom Houses
SELECT DISTINCT building_tier 
FROM construction_cost_index 
WHERE building_use = 'Residential' 
  AND building_type = 'Custom Houses'
ORDER BY building_tier;

-- 4. Get categories for Residential + Custom Houses
SELECT DISTINCT category 
FROM construction_cost_index 
WHERE building_use = 'Residential' 
  AND building_type = 'Custom Houses'
ORDER BY category;

-- 5. Get complete cost data for specific selection
SELECT 
    building_use,
    building_type,
    category,
    building_tier,
    -- Shell costs
    shell_new_min,
    shell_new_target,
    shell_new_max,
    shell_remodel_min,
    shell_remodel_target,
    shell_remodel_max,
    -- Project shares
    project_shell_share,
    project_interior_share,
    project_landscape_share,
    -- Design shares
    architectural_design_share,
    structural_design_share,
    civil_design_share,
    mechanical_design_share,
    electrical_design_share,
    plumbing_design_share,
    telecommunication_design_share
FROM construction_cost_index 
WHERE building_use = 'Residential' 
  AND building_type = 'Custom Houses'
  AND category = 5
  AND building_tier = 'High';

-- 6. Test calculation function with Dr. De Jesús project
SELECT * FROM calculate_project_budget(
    'Residential',      -- building_use
    'Custom Houses',    -- building_type
    5,                  -- category
    'High',            -- tier
    0,                 -- new_area_ft2
    4407,              -- existing_area_ft2
    267,               -- new_psf (from DB target)
    202,               -- remodel_psf (from DB target)
    1.0,               -- historic_multiplier
    1.0                -- remodel_multiplier (using 1.0 for $859k budget)
);

-- 7. Verify calculation constants
SELECT key, value, description 
FROM calculation_constants 
ORDER BY category, key;

-- 8. Check category multipliers
SELECT * FROM category_multipliers ORDER BY category;

-- 9. Verify project shares sum to 100%
SELECT 
    building_use,
    building_type,
    building_tier,
    category,
    project_shell_share,
    project_interior_share,
    project_landscape_share,
    (project_shell_share + project_interior_share + project_landscape_share) as total_share
FROM construction_cost_index
WHERE (project_shell_share + project_interior_share + project_landscape_share) != 100
LIMIT 10;
