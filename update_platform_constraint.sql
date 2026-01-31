-- Migration to update the platform check constraint
-- Run this in the Supabase SQL Editor to support the new platforms (Microsoft 365, Slack)
ALTER TABLE workflows DROP CONSTRAINT IF EXISTS workflows_platform_check;
ALTER TABLE workflows
ADD CONSTRAINT workflows_platform_check CHECK (
        platform IN (
            'Google Workspace',
            'Microsoft 365',
            'Slack',
            'Zapier',
            'n8n',
            'Make',
            'Custom',
            'API-Based',
            'Multi-Platform'
        )
    );