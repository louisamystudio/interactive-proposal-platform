-- Supabase schema for Louis Amy AE Studio Proposal Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Building cost data table
CREATE TABLE IF NOT EXISTS building_cost_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  building_use TEXT NOT NULL,
  building_type TEXT NOT NULL,
  building_tier TEXT NOT NULL,
  new_min_psf DECIMAL NOT NULL,
  new_target_psf DECIMAL NOT NULL,
  new_max_psf DECIMAL NOT NULL,
  remodel_min_psf DECIMAL NOT NULL,
  remodel_target_psf DECIMAL NOT NULL,
  remodel_max_psf DECIMAL NOT NULL,
  shell_share DECIMAL DEFAULT 0.62,
  interior_share DECIMAL DEFAULT 0.24,
  landscape_share DECIMAL DEFAULT 0.14,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category multipliers table
CREATE TABLE IF NOT EXISTS category_multipliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category INTEGER NOT NULL CHECK (category BETWEEN 1 AND 5),
  multiplier DECIMAL NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  client_name TEXT,
  client_email TEXT,
  project_name TEXT,
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  options JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Proposal events table for analytics
CREATE TABLE IF NOT EXISTS proposal_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  client_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_proposals_token ON proposals(token);
CREATE INDEX idx_proposals_client_email ON proposals(client_email);
CREATE INDEX idx_proposal_events_proposal_id ON proposal_events(proposal_id);
CREATE INDEX idx_proposal_events_type ON proposal_events(event_type);

-- Row Level Security (RLS)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_events ENABLE ROW LEVEL SECURITY;

-- Policy: Proposals are readable by token (for client viewing)
CREATE POLICY "Proposals readable by token" ON proposals
  FOR SELECT
  USING (true); -- In production, this should check auth context

-- Policy: Proposals writable only from service role
CREATE POLICY "Proposals writable by service" ON proposals
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Events writable by anyone (for tracking)
CREATE POLICY "Events writable by all" ON proposal_events
  FOR INSERT
  WITH CHECK (true);

-- Policy: Events readable by service role only
CREATE POLICY "Events readable by service" ON proposal_events
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Seed initial data for Puerto Rico construction costs
INSERT INTO building_cost_data (building_use, building_type, building_tier, new_min_psf, new_target_psf, new_max_psf, remodel_min_psf, remodel_target_psf, remodel_max_psf)
VALUES 
  ('Residential', 'Single Family Home', 'Mid', 180, 195, 220, 160, 180, 200),
  ('Residential', 'Single Family Home', 'High', 220, 250, 300, 200, 220, 250),
  ('Residential', 'Luxury Villa', 'High', 300, 350, 450, 250, 300, 350),
  ('Commercial', 'Office Building', 'Mid', 150, 175, 200, 130, 150, 170),
  ('Commercial', 'Retail Space', 'Mid', 140, 160, 185, 120, 140, 160);

-- Seed category multipliers
INSERT INTO category_multipliers (category, multiplier, description)
VALUES 
  (1, 0.8, 'Very Simple'),
  (2, 0.9, 'Simple'),
  (3, 1.0, 'Average'),
  (4, 1.15, 'Complex'),
  (5, 1.3, 'Very Complex');