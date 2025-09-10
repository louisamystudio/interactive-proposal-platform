-- Seed category multipliers first
INSERT INTO category_multipliers (category, multiplier, description) VALUES
  (1, 0.90, 'Very Simple - Basic functionality'),
  (2, 1.00, 'Simple - Standard complexity'),
  (3, 1.10, 'Average - Moderate complexity'),
  (4, 1.20, 'Complex - High complexity'),
  (5, 1.30, 'Very Complex - Maximum complexity')
ON CONFLICT (category) DO UPDATE SET
  multiplier = EXCLUDED.multiplier,
  description = EXCLUDED.description;

-- Seed building cost data for Puerto Rico
-- Residential Buildings
INSERT INTO building_cost_data (
  building_use, building_type, design_tier, category,
  psf_new_min, psf_new_target, psf_new_max,
  psf_remodel_min, psf_remodel_target, psf_remodel_max,
  share_shell_default, share_interior_default, share_landscape_default
) VALUES
  -- Residential - Custom Houses (Dr. De Jesús case)
  ('Residential', 'Custom Houses', 1, 3, 180, 195, 220, 135, 146, 165, 0.70, 0.20, 0.10),
  ('Residential', 'Custom Houses', 2, 4, 210, 235, 265, 158, 176, 199, 0.68, 0.21, 0.11),
  ('Residential', 'Custom Houses', 3, 5, 240, 267, 307, 181, 202, 232, 0.66, 0.22, 0.12),
  
  -- Residential - Standard Houses
  ('Residential', 'Standard Houses', 1, 2, 150, 165, 185, 113, 124, 139, 0.70, 0.20, 0.10),
  ('Residential', 'Standard Houses', 2, 3, 175, 195, 220, 131, 146, 165, 0.68, 0.21, 0.11),
  ('Residential', 'Standard Houses', 3, 4, 200, 225, 255, 150, 169, 191, 0.66, 0.22, 0.12),
  
  -- Residential - Apartments
  ('Residential', 'Apartments', 1, 2, 140, 155, 175, 105, 116, 131, 0.72, 0.18, 0.10),
  ('Residential', 'Apartments', 2, 3, 165, 185, 210, 124, 139, 158, 0.70, 0.19, 0.11),
  ('Residential', 'Apartments', 3, 4, 190, 215, 245, 143, 161, 184, 0.68, 0.20, 0.12),
  
  -- Commercial - Office Buildings
  ('Commercial', 'Office Buildings', 1, 3, 160, 175, 195, 120, 131, 146, 0.65, 0.25, 0.10),
  ('Commercial', 'Office Buildings', 2, 4, 185, 205, 230, 139, 154, 173, 0.63, 0.26, 0.11),
  ('Commercial', 'Office Buildings', 3, 5, 210, 235, 265, 158, 176, 199, 0.60, 0.28, 0.12),
  
  -- Commercial - Retail Spaces
  ('Commercial', 'Retail Spaces', 1, 2, 145, 160, 180, 109, 120, 135, 0.68, 0.24, 0.08),
  ('Commercial', 'Retail Spaces', 2, 3, 170, 190, 215, 128, 143, 161, 0.66, 0.25, 0.09),
  ('Commercial', 'Retail Spaces', 3, 4, 195, 220, 250, 146, 165, 188, 0.64, 0.26, 0.10),
  
  -- Hospitality - Hotels
  ('Hospitality', 'Hotels', 1, 3, 200, 220, 245, 150, 165, 184, 0.62, 0.28, 0.10),
  ('Hospitality', 'Hotels', 2, 4, 230, 255, 285, 173, 191, 214, 0.60, 0.29, 0.11),
  ('Hospitality', 'Hotels', 3, 5, 260, 290, 325, 195, 218, 244, 0.58, 0.30, 0.12),
  
  -- Hospitality - Restaurants
  ('Hospitality', 'Restaurants', 1, 3, 180, 200, 225, 135, 150, 169, 0.55, 0.35, 0.10),
  ('Hospitality', 'Restaurants', 2, 4, 210, 235, 265, 158, 176, 199, 0.53, 0.36, 0.11),
  ('Hospitality', 'Restaurants', 3, 5, 240, 270, 305, 180, 203, 229, 0.50, 0.38, 0.12),
  
  -- Healthcare - Medical Offices
  ('Healthcare', 'Medical Offices', 1, 3, 190, 210, 235, 143, 158, 176, 0.64, 0.28, 0.08),
  ('Healthcare', 'Medical Offices', 2, 4, 220, 245, 275, 165, 184, 206, 0.62, 0.29, 0.09),
  ('Healthcare', 'Medical Offices', 3, 5, 250, 280, 315, 188, 210, 236, 0.60, 0.30, 0.10),
  
  -- Healthcare - Hospitals
  ('Healthcare', 'Hospitals', 1, 4, 280, 310, 345, 210, 233, 259, 0.58, 0.34, 0.08),
  ('Healthcare', 'Hospitals', 2, 5, 320, 355, 395, 240, 266, 296, 0.56, 0.35, 0.09),
  ('Healthcare', 'Hospitals', 3, 5, 360, 400, 445, 270, 300, 334, 0.54, 0.36, 0.10),
  
  -- Education - Schools
  ('Education', 'Schools', 1, 3, 170, 190, 215, 128, 143, 161, 0.66, 0.24, 0.10),
  ('Education', 'Schools', 2, 4, 200, 225, 255, 150, 169, 191, 0.64, 0.25, 0.11),
  ('Education', 'Schools', 3, 5, 230, 260, 295, 173, 195, 221, 0.62, 0.26, 0.12),
  
  -- Industrial - Warehouses
  ('Industrial', 'Warehouses', 1, 2, 90, 100, 115, 68, 75, 86, 0.75, 0.15, 0.10),
  ('Industrial', 'Warehouses', 2, 3, 110, 125, 145, 83, 94, 109, 0.73, 0.16, 0.11),
  ('Industrial', 'Warehouses', 3, 4, 130, 150, 175, 98, 113, 131, 0.70, 0.18, 0.12),
  
  -- Mixed Use - Residential/Commercial
  ('Mixed Use', 'Residential/Commercial', 1, 3, 175, 195, 220, 131, 146, 165, 0.66, 0.24, 0.10),
  ('Mixed Use', 'Residential/Commercial', 2, 4, 205, 230, 260, 154, 173, 195, 0.64, 0.25, 0.11),
  ('Mixed Use', 'Residential/Commercial', 3, 5, 235, 265, 300, 176, 199, 225, 0.62, 0.26, 0.12)
ON CONFLICT (building_use, building_type, design_tier) DO UPDATE SET
  category = EXCLUDED.category,
  psf_new_min = EXCLUDED.psf_new_min,
  psf_new_target = EXCLUDED.psf_new_target,
  psf_new_max = EXCLUDED.psf_new_max,
  psf_remodel_min = EXCLUDED.psf_remodel_min,
  psf_remodel_target = EXCLUDED.psf_remodel_target,
  psf_remodel_max = EXCLUDED.psf_remodel_max,
  share_shell_default = EXCLUDED.share_shell_default,
  share_interior_default = EXCLUDED.share_interior_default,
  share_landscape_default = EXCLUDED.share_landscape_default,
  updated_at = NOW();