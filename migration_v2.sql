-- Migration V2: Add missing columns for Marketplace & Studio Enhancements
-- Run this in your Supabase SQL Editor

ALTER TABLE workflows 
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'Google Workspace';

ALTER TABLE workflows 
ADD COLUMN IF NOT EXISTS price decimal(10, 2) DEFAULT 0.00;

ALTER TABLE workflows 
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

ALTER TABLE workflows 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Optional: Refresh PostgREST cache if you still see errors
-- NOTIFY pgrst, 'reload schema';
