-- Create building_cost_data table for Puerto Rico construction costs
CREATE TABLE IF NOT EXISTS building_cost_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  building_use TEXT NOT NULL,
  building_type TEXT NOT NULL,
  design_tier INTEGER NOT NULL CHECK (design_tier BETWEEN 1 AND 3),
  category INTEGER NOT NULL CHECK (category BETWEEN 1 AND 5),
  
  -- PSF ranges for new construction
  psf_new_min DECIMAL(10,2) NOT NULL,
  psf_new_target DECIMAL(10,2) NOT NULL,
  psf_new_max DECIMAL(10,2) NOT NULL,
  
  -- PSF ranges for remodel
  psf_remodel_min DECIMAL(10,2) NOT NULL,
  psf_remodel_target DECIMAL(10,2) NOT NULL,
  psf_remodel_max DECIMAL(10,2) NOT NULL,
  
  -- Default budget shares (should sum to 1.0)
  share_shell_default DECIMAL(4,3) NOT NULL DEFAULT 0.66,
  share_interior_default DECIMAL(4,3) NOT NULL DEFAULT 0.22,
  share_landscape_default DECIMAL(4,3) NOT NULL DEFAULT 0.12,
  
  -- Additional multipliers
  historic_multiplier_default DECIMAL(4,2) DEFAULT 1.00,
  remodel_multiplier_default DECIMAL(4,2) DEFAULT 1.00,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique combinations
  UNIQUE(building_use, building_type, design_tier)
);

-- Create category_multipliers table
CREATE TABLE IF NOT EXISTS category_multipliers (
  category INTEGER PRIMARY KEY CHECK (category BETWEEN 1 AND 5),
  multiplier DECIMAL(4,2) NOT NULL,
  description TEXT
);

-- Create index for fast lookups
CREATE INDEX idx_building_cost_lookup ON building_cost_data(building_use, building_type, design_tier);

-- Enable Row Level Security (RLS)
ALTER TABLE building_cost_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_multipliers ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for public access
CREATE POLICY "Allow public read access to building_cost_data" 
  ON building_cost_data FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to category_multipliers" 
  ON category_multipliers FOR SELECT 
  USING (true);

-- Add update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_building_cost_data_updated_at 
  BEFORE UPDATE ON building_cost_data 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();