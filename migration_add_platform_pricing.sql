-- Migration Script for Existing Workflows Table
-- Run this in your Supabase SQL Editor if you already have a workflows table
-- If starting fresh, use supabase_setup.sql instead

-- 1. Add new columns to workflows table
ALTER TABLE workflows 
  ADD COLUMN IF NOT EXISTS platform text DEFAULT 'Google Workspace' 
    CHECK (platform IN ('Google Workspace', 'Zapier', 'n8n', 'Make', 'Custom', 'API-Based', 'Multi-Platform')),
  ADD COLUMN IF NOT EXISTS price decimal(10, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags text[];

-- 2. Add comment for documentation
COMMENT ON COLUMN workflows.platform IS 'Platform where this workflow will run';
COMMENT ON COLUMN workflows.price IS 'Price in USD, 0.00 for free workflows';
COMMENT ON COLUMN workflows.is_premium IS 'Flag to indicate premium/paid workflows';
COMMENT ON COLUMN workflows.tags IS 'Array of tags for categorization';

-- 3. Update existing workflows (optional - set default values)
UPDATE workflows 
SET 
  platform = 'Google Workspace',
  price = 0.00,
  is_premium = false,
  tags = ARRAY[]::text[]
WHERE platform IS NULL;

-- 4. Add new RLS policy for public workflows
DROP POLICY IF EXISTS "Users can view public workflows." ON workflows;

CREATE POLICY "Users can view public workflows."
  ON workflows FOR SELECT
  USING (is_public = true);

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'workflows'
  AND column_name IN ('platform', 'price', 'is_premium', 'tags')
ORDER BY ordinal_position;
