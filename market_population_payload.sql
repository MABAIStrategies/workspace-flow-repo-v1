-- Researcher Agent Payload: 15 High-Value Real-World Workflows (V3 - STABLE SYNTAX)
-- Copy and paste this into the Supabase SQL Editor.
INSERT INTO workflows (
        name,
        department,
        category,
        platform,
        price,
        is_premium,
        tags,
        is_public,
        user_id,
        description
    )
SELECT data.name,
    data.department,
    data.category,
    data.platform,
    data.price,
    data.is_premium,
    data.tags,
    true as is_public,
    (
        SELECT id
        FROM profiles
        LIMIT 1
    ) as user_id,
    -- Auto-links to your first user
    data.description
FROM (
        VALUES (
                'AI-Powered Lead Enrichment',
                'Sales',
                'triggered',
                'Zapier',
                49.00,
                true,
                ARRAY ['sales', 'leads', 'ai', 'zapier'],
                '{"desc": "Automatically enriches new leads with Clearbit data and routes them based on company size.", "meta": {"dept": "Sales", "color": "from-blue-900", "height": 30, "tools": ["CRM", "Clearbit", "Slack"], "level": "triggered"}, "steps": ["New lead in CRM", "Zapier fetches Clearbit data", "Post to specific Slack channel", "Update CRM record"]}'
            ),
            (
                'Churn Prevention Watchdog',
                'Sales',
                'background',
                'Make',
                99.00,
                true,
                ARRAY ['sales', 'churn', 'finance'],
                '{"desc": "Monitors Stripe for failed payments and alerts Account Managers before the customer churns.", "meta": {"dept": "Sales", "color": "from-indigo-900", "height": 32, "tools": ["Stripe", "Slack", "CRM"], "level": "background"}, "steps": ["Monitor Stripe Events", "Verify customer health in CRM", "Alert Success Team", "Schedule follow-up task"]}'
            ),
            (
                'Automated Project SOP Generator',
                'Operations',
                'hitl',
                'Google Workspace',
                0.00,
                false,
                ARRAY ['ops', 'sop', 'ai', 'docs'],
                '{"desc": "Converts brief Slack descriptions into formatted SOP documents in Google Docs for review.", "meta": {"dept": "Operations", "color": "from-emerald-900", "height": 28, "tools": ["Slack", "Docs", "OpenAI"], "level": "hitl"}, "steps": ["Slack command /sop", "AI drafts structure", "Human reviews in Docs", "Final approval move to Archive"]}'
            ),
            (
                'Invoice Audit & Dispute Bot',
                'Finance',
                'background',
                'Google Workspace',
                75.00,
                true,
                ARRAY ['finance', 'audit', 'billing'],
                '{"desc": "Scans Gmail for vendor invoices, checks against budget Sheets, and flags disputes.", "meta": {"dept": "Finance", "color": "from-slate-900", "height": 29, "tools": ["Gmail", "Sheets", "Drive"], "level": "background"}, "steps": ["Scan Gmail for keywords", "Extract data from PDF", "Cross-ref with Budget Sheet", "Email dispute if mismatch"]}'
            ),
            (
                'Multi-Platform Social Sync',
                'Marketing',
                'triggered',
                'Multi-Platform',
                120.00,
                true,
                ARRAY ['marketing', 'social', 'sync'],
                '{"desc": "Orchestrates content distribution across LinkedIn, Twitter, and Facebook from a single Sheet source.", "meta": {"dept": "Marketing", "color": "from-purple-900", "height": 31, "tools": ["Sheets", "Zapier", "Make"], "level": "triggered"}, "steps": ["Update Post Status in Sheet", "Trigger API calls to platforms", "Log performance stats back to Sheet"]}'
            ),
            (
                'Executive Briefing Summarizer',
                'Executive',
                'background',
                'Custom',
                150.00,
                true,
                ARRAY ['exec', 'ai', 'research'],
                '{"desc": "Synthesizes daily industry news into a concise 1-page summary delivered via Slack and Email.", "meta": {"dept": "Executive", "color": "from-blue-800", "height": 30, "tools": ["Perplexity API", "Slack", "GMAIL"], "level": "background"}, "steps": ["Query News APIs", "AI Extract/Summarize", "Format HTML Email", "Ping Executive Slack"]}'
            ),
            (
                'Smart CV Screener',
                'HR',
                'triggered',
                'Custom',
                85.00,
                true,
                ARRAY ['hr', 'hiring', 'ai'],
                '{"desc": "Automatically scores applicant resumes against job descriptions and ranks them in a dashboard.", "meta": {"dept": "HR", "color": "from-emerald-800", "height": 27, "tools": ["Drive", "OpenAI", "React"], "level": "triggered"}, "steps": ["File Upload to Drive", "OCR/Text Extraction", "Score vs Job Desc", "Update Rank in DB"]}'
            ),
            (
                'Global Meeting Scheduler',
                'Executive',
                'hitl',
                'Google Workspace',
                0.00,
                false,
                ARRAY ['exec', 'productivity', 'calendar'],
                '{"desc": "Handles complex multi-timezone scheduling by comparing attendee calendars and proposing slots.", "meta": {"dept": "Executive", "color": "from-indigo-800", "height": 26, "tools": ["Calendar", "Sheets", "Gmail"], "level": "hitl"}, "steps": ["Identify attendees", "Check free/busy slots", "Draft Gmail with 3 options", "Confirm and send invites"]}'
            ),
            (
                'E-commerce Fulfillment Sync',
                'Operations',
                'background',
                'n8n',
                200.00,
                true,
                ARRAY ['ops', 'ecommerce', 'logistics'],
                '{"desc": "Synchronizes Shopify orders with physical inventory databases and shipping providers.", "meta": {"dept": "Operations", "color": "from-orange-900", "height": 32, "tools": ["n8n", "Shopify", "SQL"], "level": "background"}, "steps": ["New Webhook Order", "Deduct Inventory in DB", "Fetch Shipping Label", "Email Customer Tracking"]}'
            ),
            (
                'Automatic Cloud Cost Auditor',
                'IT/Eng',
                'background',
                'API-Based',
                300.00,
                true,
                ARRAY ['it', 'audit', 'cloud'],
                '{"desc": "Monitors AWS/Azure spend daily and shuts down unused dev environments during off-hours.", "meta": {"dept": "IT/Eng", "color": "from-blue-600", "height": 31, "tools": ["AWS API", "Lambda", "Slack"], "level": "background"}, "steps": ["Fetch Cloud Spend", "Identify Idle Resources", "Execute Shutdown Script", "Post Savings Report to Slack"]}'
            ),
            (
                'Content Repurposing Factory',
                'Marketing',
                'hitl',
                'Multi-Platform',
                45.00,
                true,
                ARRAY ['marketing', 'content', 'video'],
                '{"desc": "Takes a long-form video URL and extracts 10 short-form clips for TikTok/Reels via AI.", "meta": {"dept": "Marketing", "color": "from-red-900", "height": 29, "tools": ["Drive", "OpenAI Vision", "TikTok API"], "level": "hitl"}, "steps": ["Upload Long Video", "AI identifies highlights", "Human reviews/trims", "Auto-schedule across platforms"]}'
            ),
            (
                'Employee Pulse Sentiment',
                'HR',
                'background',
                'Zapier',
                0.00,
                false,
                ARRAY ['hr', 'culture', 'slack'],
                '{"desc": "Anonymously tracks team sentiment via weekly Slack pulses and visualizes trends for HR.", "meta": {"dept": "HR", "color": "from-pink-900", "height": 25, "tools": ["Slack", "Google Forms", "Data Studio"], "level": "background"}, "steps": ["Weekly Slack Survey", "Collect Anon Responses", "Log to DB", "Generate Monthly Sentiment Report"]}'
            ),
            (
                'Automated Vendor Onboarding',
                'Operations',
                'triggered',
                'Google Workspace',
                0.00,
                false,
                ARRAY ['ops', 'vendors', 'docs'],
                '{"desc": "Orchestrates the NDA, W9, and Banking setup for new vendors in a unified Drive folder.", "meta": {"dept": "Operations", "color": "from-teal-900", "height": 28, "tools": ["Forms", "Docs", "Drive"], "level": "triggered"}, "steps": ["Intake Form Submit", "Gen NDA from Template", "Request W9 via Email", "Notify Finance for Approval"]}'
            ),
            (
                'CRM Data Sanitizer',
                'Sales',
                'background',
                'Make',
                65.00,
                true,
                ARRAY ['sales', 'data', 'crm'],
                '{"desc": "Daily scan of CRM records to fix formatting, find duplicates, and fill missing LinkedIn URLs.", "meta": {"dept": "Sales", "color": "from-cyan-900", "height": 30, "tools": ["HubSpot", "Make", "Clearbit"], "level": "background"}, "steps": ["Fetch modified records", "Standardize phone/addrs", "De-duplicate logic", "Update CRM Record"]}'
            ),
            (
                'Meeting Action Item Tracker',
                'Executive',
                'triggered',
                'API-Based',
                0.00,
                false,
                ARRAY ['exec', 'meetings', 'asana'],
                '{"desc": "Extracts actionable tasks from meeting transcripts and populates Asana/Jira projects.", "meta": {"dept": "Executive", "color": "from-zinc-900", "height": 27, "tools": ["Meet", "OpenAI", "Asana"], "level": "triggered"}, "steps": ["Post-Meeting Recording", "AI Task Extraction", "Create Tasks in Project Tool", "Email Summary to Attendees"]}'
            )
    ) AS data(
        name,
        department,
        category,
        platform,
        price,
        is_premium,
        tags,
        description
    )
WHERE (
        SELECT id
        FROM profiles
        LIMIT 1
    ) IS NOT NULL;
-- Shield against null user_id