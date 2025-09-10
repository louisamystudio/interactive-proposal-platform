-- Create building_cost_data table for database-driven Project Overview
-- This table stores all cost configuration data for building use/type/tier combinations

CREATE TABLE IF NOT EXISTS public.building_cost_data (
  id SERIAL PRIMARY KEY,
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
  
  -- Default shares (Shell/Interior/Landscape)
  share_shell_default DECIMAL(5,2) NOT NULL DEFAULT 0.70,
  share_interior_default DECIMAL(5,2) NOT NULL DEFAULT 0.22,
  share_landscape_default DECIMAL(5,2) NOT NULL DEFAULT 0.08,
  
  -- Default multipliers
  historic_multiplier_default DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  remodel_multiplier_default DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint for classification combination
  CONSTRAINT unique_building_classification UNIQUE (building_use, building_type, design_tier)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_building_cost_data_classification 
ON public.building_cost_data (building_use, building_type, design_tier);

-- Create index for filtering by use
CREATE INDEX IF NOT EXISTS idx_building_cost_data_use 
ON public.building_cost_data (building_use);

-- Category multipliers table (if not exists)
CREATE TABLE IF NOT EXISTS public.category_multipliers (
  category INTEGER PRIMARY KEY CHECK (category BETWEEN 1 AND 5),
  multiplier DECIMAL(5,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default category multipliers if not exist
INSERT INTO public.category_multipliers (category, multiplier, description) VALUES
  (1, 0.9, 'Category 1 - 10% below market'),
  (2, 1.0, 'Category 2 - Market rate'),
  (3, 1.1, 'Category 3 - 10% above market'),
  (4, 1.2, 'Category 4 - 20% above market'),
  (5, 1.3, 'Category 5 - 30% above market')
ON CONFLICT (category) DO NOTHING;