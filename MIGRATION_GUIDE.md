# Database Migration Guide

## Overview
This guide explains how to update your Supabase database to support the new platform, pricing, and tags features.

## Option 1: Fresh Install (New Database)
If you're setting up a fresh database, simply run the complete setup script:

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `supabase_setup.sql`
4. Click **Run** to execute

## Option 2: Migrate Existing Database
If you already have a workflows table with data, use the migration script:

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `migration_add_platform_pricing.sql`
4. Click **Run** to execute
5. Verify the changes by checking the output

## What Changed?

### New Fields Added to `workflows` Table:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `platform` | text | 'Google Workspace' | Platform where the workflow runs |
| `price` | decimal(10,2) | 0.00 | Price in USD (0 = free) |
| `is_premium` | boolean | false | Premium/paid workflow flag |
| `tags` | text[] | [] | Array of category tags |

### New RLS Policy:
- **"Users can view public workflows"** - Allows anyone to view workflows marked as `is_public = true`, enabling the marketplace functionality

## Verification
After running the migration, verify it worked:

\`\`\`sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'workflows'
  AND column_name IN ('platform', 'price', 'is_premium', 'tags')
ORDER BY ordinal_position;
\`\`\`

You should see all four new columns listed.

## Next Steps
After the migration is complete:
1. ✅ Update Studio View to include platform selection and pricing inputs
2. ✅ Update Repository View to display platform badges and price tags
3. ✅ Add filtering by platform and price range
4. ✅ Test the new fields with sample data
