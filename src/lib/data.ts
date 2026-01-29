export const AppTools = {
  GMAIL: "Gmail", SHEET: "Sheets", DRIVE: "Drive", CAL: "Calendar", SLACK: "Slack",
  DOCS: "Docs", FORMS: "Forms", CRM: "CRM", OPENAI: "OpenAI", ZAPIER: "Zapier",
  STRIPE: "Stripe", MEET: "Meet", SLIDES: "Slides", CHAT: "Google Chat",
  APPS_SCRIPT: "Apps Script"
};

export const AppDepts = {
  SALES: "Sales", MKTG: "Marketing", HR: "HR", OPS: "Operations",
  FIN: "Finance", EXEC: "Executive", TECH: "IT/Eng"
};

export const flowData = [
  // Human in the Loop
  { id: 1, rank: 1, name: "Perfect Proposal Generator", platform: "Google Workspace", category: "hitl", dept: AppDepts.SALES, tools: [AppTools.DRIVE, AppTools.DOCS, AppTools.GMAIL], complexity: "High", timeSaved: "3 hrs/prop", tip: "Use a standardized template in Docs with {{variables}} for cleaner replacement.", steps: ["Upload Transcript to Drive folder.", "Script triggers AI to extract needs and map to Template.", "Review draft Doc, approve, and script converts to PDF & Drafts Email."], trigger: "File Upload", action: "Extract -> Draft", tags: ["sales", "proposals", "ai"] },
  { id: 2, rank: 2, name: "Inbound Lead Router", platform: "Google Workspace", category: "hitl", dept: AppDepts.SALES, tools: [AppTools.FORMS, AppTools.SHEET, AppTools.GMAIL], complexity: "Med", timeSaved: "5 hrs/wk", tip: "Set up different logic paths for <10 employees vs >100 employees.", steps: ["Form submission logs to Sheet.", "Script scores lead based on data enrichment.", "High scores draft personalized email from Founder; Low scores get sequence."], trigger: "Form Submit", action: "Score -> Draft", tags: ["leads", "routing", "crm"] },
  { id: 3, rank: 3, name: "Productized Service Factory", platform: "Google Workspace", category: "hitl", dept: AppDepts.OPS, tools: [AppTools.SLACK, AppTools.DOCS], complexity: "High", timeSaved: "2 hrs/task", tip: "Great for generating SOPs or creative briefs.", steps: ["Send keyword to Slack bot.", "Bot prompts for details then generates structured Doc.", "Human reviews Doc and moves to 'Active' folder to trigger next steps."], trigger: "Chat Msg", action: "Gen Content", tags: ["ops", "content", "slack"] },
  { id: 6, rank: 6, name: "Unfinished Project Sweeper", platform: "Google Workspace", category: "hitl", dept: AppDepts.EXEC, tools: [AppTools.DRIVE, AppTools.SLACK], complexity: "Med", timeSaved: "1 hr/wk", tip: "Keeps your drive from becoming a graveyard.", steps: ["Weekly script scans 'In Progress' folder for old modified dates.", "Sends list to Slack.", "Buttons in Slack: 'Archive', 'Delete', 'Snooze'."], trigger: "Schedule", action: "Scan -> Chat", tags: ["productivity", "cleanup"] },
  { id: 7, rank: 7, name: "Invoice Chaser", platform: "Google Workspace", category: "hitl", dept: AppDepts.FIN, tools: [AppTools.SHEET, AppTools.GMAIL], complexity: "Low", timeSaved: "2 hrs/mo", tip: "Add a 'Kindly' column to adjust tone.", steps: ["Script checks 'Due Date' column in Finance Sheet.", "If date passed & status != Paid, draft email.", "Review drafts in Gmail drafts folder and hit send."], trigger: "Schedule", action: "Check -> Draft", tags: ["finance", "invoices", "email"] },
  { id: 8, rank: 8, name: "Meeting Action Item Enforcer", platform: "Google Workspace", category: "hitl", dept: AppDepts.EXEC, tools: [AppTools.MEET, AppTools.DOCS, AppTools.GMAIL], complexity: "Med", timeSaved: "15 min/mtg", tip: "Force the AI to assign owners using @mentions.", steps: ["Meeting recording finishes.", "Transcript sent to LLM to extract bullet points & owners.", "Draft summary email sent to you for final edit before blasting attendees."], trigger: "Event End", action: "Extract -> Draft", tags: ["meetings", "notes", "ai"] },
  { id: 22, rank: 22, name: "Webinar Follow-up", platform: "Google Workspace", category: "hitl", dept: AppDepts.MKTG, tools: [AppTools.SHEET, AppTools.GMAIL], complexity: "Med", timeSaved: "3 hrs/event", tip: "Segment by 'Stayed until end' vs 'Dropped off'.", steps: ["Export attendee list to Sheet.", "Script segments users based on watch time.", "Drafts tailored emails for each segment for your approval."], trigger: "Event End", action: "Segment -> Draft", tags: ["marketing", "events", "email"] },

  // Triggered
  { id: 5, rank: 5, name: "Client Onboarding Orchestrator", platform: "Google Workspace", category: "triggered", dept: AppDepts.OPS, tools: [AppTools.SHEET, AppTools.DRIVE, AppTools.GMAIL], complexity: "High", timeSaved: "4 hrs/client", tip: "Automate the folder permission sharing too.", steps: ["New row in 'Clients' sheet.", "Script creates Folder hierarchy (Contracts, Assets).", "Copies template files and sends Welcome Email with links."], trigger: "Add Row", action: "Setup Environment", tags: ["onboarding", "clients", "automation"] },
  { id: 10, rank: 10, name: "Social Content Repurposing", platform: "Google Workspace", category: "triggered", dept: AppDepts.MKTG, tools: [AppTools.DOCS, AppTools.SHEET], complexity: "Med", timeSaved: "3 hrs/post", tip: "Map H1s to Tweets and H2s to LinkedIn posts.", steps: ["Mark Doc as 'Final'.", "Script grabs text, sends to LLM.", "Generates 5 Tweets & 1 LinkedIn post, saves to Content Calendar Sheet."], trigger: "Doc Status", action: "Analyze -> Plan", tags: ["marketing", "social", "content"] },
  { id: 11, rank: 11, name: "Resume/CV Customizer", platform: "Google Workspace", category: "triggered", dept: AppDepts.HR, tools: [AppTools.DRIVE, AppTools.DOCS], complexity: "Med", timeSaved: "30 min/app", tip: "Keep a master 'Skills Database' to pull from.", steps: ["Upload Job Desc PDF to folder.", "Script reads PDF keywords.", "Rewrites your Master CV Doc to emphasize matching skills."], trigger: "Upload File", action: "Rewrite Doc", tags: ["hr", "hiring", "productivity"] },
  { id: 14, rank: 14, name: "Receipt Scanner", platform: "Google Workspace", category: "triggered", dept: AppDepts.FIN, tools: [AppTools.DRIVE, AppTools.SHEET], complexity: "Low", timeSaved: "1 hr/mo", tip: "Use the Drive mobile app to scan directly.", steps: ["Upload photo to 'Receipts' folder.", "OCR extracts Date, Amount, Vendor.", "Appends row to Expense Sheet."], trigger: "Upload Photo", action: "OCR -> Log", tags: ["finance", "receipts", "ocr"] },
  { id: 15, rank: 15, name: "Code Snippet Library Builder", platform: "Google Workspace", category: "triggered", dept: AppDepts.TECH, tools: [AppTools.SLACK, AppTools.DOCS], complexity: "Low", timeSaved: "10 min/snip", tip: "Great for onboarding new devs.", steps: ["Star a message with code block in Slack.", "Bot extracts code & comments.", "Appends to 'Engineering Knowledge Base' Doc with link to original thread."], trigger: "Star Msg", action: "Extract -> Save", tags: ["tech", "dev", "notes"] },
  { id: 16, rank: 16, name: "YouTube Video to Blog", platform: "Google Workspace", category: "triggered", dept: AppDepts.MKTG, tools: [AppTools.DRIVE, AppTools.DOCS], complexity: "Med", timeSaved: "4 hrs/vid", tip: "Include screenshots in the blog post manually later.", steps: ["Upload video file to Drive.", "Script sends to Transcription API.", "LLM rewrites transcript into SEO blog format in Docs."], trigger: "Upload File", action: "Transcribe -> Write", tags: ["marketing", "blog", "video"] },
  { id: 19, rank: 19, name: "Contract Variable Checker", platform: "Google Workspace", category: "triggered", dept: AppDepts.FIN, tools: [AppTools.DRIVE, AppTools.SLACK], complexity: "Med", timeSaved: "20 min/doc", tip: "Prevent signing contracts with wrong dates.", steps: ["Upload PDF to 'To Sign' folder.", "Script scans for dates and signatures.", "Slacks you: 'Looks good' or 'Error: Date is 2024'."], trigger: "Upload PDF", action: "Verify -> Alert", tags: ["finance", "legal", "slack"] },

  // NEW 15 FLOWS
  { id: 101, rank: 3, name: "Vendor Onboarding Sync", platform: "Google Workspace", category: "triggered", dept: AppDepts.OPS, tools: [AppTools.FORMS, AppTools.DRIVE, AppTools.DOCS], complexity: "High", timeSaved: "2 hrs/vendor", tip: "Auto-generate the W9 request email.", steps: ["Vendor fills intake Form.", "Script creates Drive folder 'Vendor - [Name]'.", "Generates NDA from template, pre-filling name/address."], trigger: "Form Submit", action: "Create -> Gen NDA", tags: ["ops", "vendors", "onboarding"] },
  { id: 102, rank: 8, name: "Churn Prevention Alert", platform: "Zapier", category: "background", dept: AppDepts.SALES, tools: [AppTools.STRIPE, AppTools.SLACK, AppTools.CRM], complexity: "High", timeSaved: "Revenue Saved", tip: "Speed is key here. Alert must be instant.", steps: ["Stripe webhook 'subscription.deleted'.", "Lookup customer in CRM.", "Post urgent alert to #customer-success Slack channel with phone number."], trigger: "Stripe Event", action: "Alert Team", tags: ["sales", "churn", "slack"] },
  { id: 103, rank: 12, name: "Review Aggregator & Sentiment", platform: "Zapier", category: "background", dept: AppDepts.MKTG, tools: [AppTools.ZAPIER, AppTools.SHEET, AppTools.SLACK], complexity: "Med", timeSaved: "2 hrs/wk", tip: "Filter out 5-star reviews to only see issues, or vice versa.", steps: ["New Review detected (Google/G2).", "Analyze sentiment (Positive/Negative).", "Log to Sheet. If Negative, ping #support; If Positive, ping #wins."], trigger: "New Review", action: "Route -> Log", tags: ["marketing", "reviews", "sentiment"] },
  { id: 104, rank: 15, name: "Meeting Recorder & CRM Logger", platform: "Custom", category: "background", dept: AppDepts.SALES, tools: [AppTools.MEET, AppTools.CRM, AppTools.OPENAI], complexity: "High", timeSaved: "30 min/call", tip: "Map extracted 'Budget' to the Deal Amount field.", steps: ["Zoom/Meet recording ready.", "Transcribe -> Extract: Budget, Decision Maker, Timeline.", "Update specific fields in HubSpot/Salesforce Deal object."], trigger: "Record End", action: "Enrich CRM", tags: ["sales", "meetings", "crm"] },
  { id: 105, rank: 18, name: "Employee Anniversary Bot", platform: "Google Workspace", category: "background", dept: AppDepts.HR, tools: [AppTools.SHEET, AppTools.SLACK, AppTools.GMAIL], complexity: "Low", timeSaved: "1 hr/mo", tip: "Make the message public to boost morale.", steps: ["Daily scan of HR roster Sheet.", "If Today == Hire Date, calculate years.", "Post photo to #general Slack & email gift card code to employee."], trigger: "Daily Scan", action: "Celebrate", tags: ["hr", "culture", "slack"] },
  { id: 106, rank: 20, name: "Contract Expiry Watchdog", platform: "Google Workspace", category: "background", dept: AppDepts.FIN, tools: [AppTools.SHEET, AppTools.GMAIL], complexity: "Low", timeSaved: "$$$ Saved", tip: "Set alerts for 90, 60, and 30 days out.", steps: ["Daily scan of Vendor Contracts Sheet.", "If Expiry Date == Today + 60 days.", "Email Vendor Manager: 'Negotiate renewal or cancel now'."], trigger: "Daily Scan", action: "Alert Owner", tags: ["finance", "legal", "audit"] },
  { id: 107, rank: 24, name: "Slack-to-Task Dispatcher", platform: "API-Based", category: "triggered", dept: AppDepts.TECH, tools: [AppTools.SLACK, AppTools.ZAPIER], complexity: "Low", timeSaved: "5 min/task", tip: "Use emoji reactions as triggers (e.g. 🔴 = Urgent Bug).", steps: ["Save message in Slack (or use emoji).", "Zapier grabs text + link.", "Creates new Task in Asana/Jira/ClickUp in 'Triage' column."], trigger: "Save Msg", action: "Create Task", tags: ["tech", "tasks", "slack"] },
  { id: 108, rank: 28, name: "Automated Weekly Status Report", platform: "Google Workspace", category: "background", dept: AppDepts.EXEC, tools: [AppTools.SHEET, AppTools.GMAIL], complexity: "Med", timeSaved: "1 hr/wk", tip: "Great for agency clients.", steps: ["Friday 5PM trigger.", "Pull all completed items from Project Management Sheet/Tool.", "Format into bulleted HTML email sent to Manager/Client."], trigger: "Schedule", action: "Report", tags: ["exec", "reporting", "email"] },
  { id: 109, rank: 30, name: "Lead Enrichment Pipeline", platform: "Zapier", category: "background", dept: AppDepts.SALES, tools: [AppTools.CRM, AppTools.ZAPIER], complexity: "Med", timeSaved: "10 min/lead", tip: "Don't waste time researching email addresses.", steps: ["New Lead added to CRM.", "Send domain to Clearbit/Hunter API.", "Update Lead record with Company Size, Tech Stack, and Location."], trigger: "New Lead", action: "Enrich Data", tags: ["sales", "leads", "zapier"] },
  { id: 110, rank: 32, name: "Digital Asset Auto-Tagger", platform: "Custom", category: "triggered", dept: AppDepts.MKTG, tools: [AppTools.DRIVE, AppTools.OPENAI], complexity: "High", timeSaved: "Forever", tip: "Makes your drive actually searchable.", steps: ["Image uploaded to 'Assets' folder.", "Send to Vision API.", "Rename file: '2026-Conf-Blue-Booth.jpg' & add description to file metadata."], trigger: "Upload Img", action: "Tag & Rename", tags: ["marketing", "assets", "ai"] },
  { id: 111, rank: 34, name: "Refund Approver Bot", platform: "Zapier", category: "background", dept: AppDepts.FIN, tools: [AppTools.GMAIL, AppTools.STRIPE], complexity: "High", timeSaved: "5 hrs/wk", tip: "Set hard limits (e.g. < $50 only).", steps: ["Email subject 'Refund Request'.", "Parse Order ID. Check criteria (Time < 30 days & Amt < $50).", "If Pass: Trigger Stripe Refund API & Reply. If Fail: Create Ticket."], trigger: "Email", action: "Process/Ticket", tags: ["finance", "refunds", "stripe"] },
  { id: 112, rank: 36, name: "Inventory Low Stock Alert", platform: "Google Workspace", category: "background", dept: AppDepts.OPS, tools: [AppTools.SHEET, AppTools.GMAIL], complexity: "Med", timeSaved: "Inventory Risk", tip: "Include the re-order link in the email.", steps: ["Edit in Inventory Sheet or Periodic Scan.", "If 'Current Stock' < 'Min Threshold'.", "Email Ops Manager + Draft PO in Drafts folder."], trigger: "Data Change", action: "Alert + Draft", tags: ["ops", "inventory", "email"] },
  { id: 113, rank: 38, name: "Candidate Screening Assistant", platform: "Custom", category: "triggered", dept: AppDepts.HR, tools: [AppTools.FORMS, AppTools.OPENAI, AppTools.SHEET], complexity: "Med", timeSaved: "10 min/resume", tip: "Blind screening reduces bias.", steps: ["Application Form Submit with PDF.", "Extract text. Score experience vs Job Description keywords.", "Update 'Status' in Sheet to 'Interview' or 'Reject'."], trigger: "App Submit", action: "Screen", tags: ["hr", "hiring", "ai"] },
  { id: 114, rank: 40, name: "Calendar Conflict Resolver", platform: "Google Workspace", category: "background", dept: AppDepts.EXEC, tools: [AppTools.CAL, AppTools.GMAIL], complexity: "Med", timeSaved: "15 min/conflict", tip: "Polite automations save relationships.", steps: ["New Event added.", "Check for overlap.", "If conflict found, email organizer of the NEW event: 'Conflict detected, please reschedule'."], trigger: "New Event", action: "Resolve", tags: ["exec", "calendar", "productivity"] },
  { id: 115, rank: 42, name: "Podcast Post-Production", platform: "Custom", category: "triggered", dept: AppDepts.MKTG, tools: [AppTools.DRIVE, AppTools.DOCS], complexity: "High", timeSaved: "5 hrs/ep", tip: "Chain this with the Social Content Repurposing flow.", steps: ["Audio file to 'Raw' folder.", "Transcribe.", "Generate Show Notes, Title Options, and Guest Thank You email."], trigger: "Upload Audio", action: "Produce Assets", tags: ["marketing", "content", "podcast"] },

  // Background
  { id: 4, rank: 4, name: "Daily Deep Research Briefing", platform: "Custom", category: "background", dept: AppDepts.EXEC, tools: [AppTools.OPENAI, AppTools.SLACK], complexity: "High", timeSaved: "1 hr/day", tip: "Configure specific sources to avoid hallucination.", steps: ["6 AM trigger.", "Search specific news APIs/Sites.", "Synthesize top 3 stories into Slack Summary."], trigger: "Schedule", action: "Research -> Chat", tags: ["exec", "research", "ai"] },
  { id: 9, rank: 9, name: "Verizon Dispute Logger", platform: "Google Workspace", category: "background", dept: AppDepts.FIN, tools: [AppTools.GMAIL, AppTools.SHEET], complexity: "Med", timeSaved: "30 min/mo", tip: "Works for any recurring painful vendor.", steps: ["Email from 'Verizon'.", "Save PDF attachment to Drive.", "Log Date & Amount in 'Disputes' Sheet."], trigger: "Email", action: "Log", tags: ["finance", "audit", "automation"] },
  { id: 12, rank: 12, name: "Competitor Watch", platform: "Custom", category: "background", dept: AppDepts.MKTG, tools: [AppTools.SHEET, AppTools.OPENAI], complexity: "Low", timeSaved: "2 hrs/wk", tip: "Monitor their pricing page specifically.", steps: ["Weekly trigger.", "Scrape competitor homepages.", "Compare to last week. Log changes (New Header, New Pricing) to Sheet."], trigger: "Schedule", action: "Monitor", tags: ["marketing", "strategy", "ai"] },
  { id: 13, rank: 13, name: "Travel Logistics Packer", platform: "Google Workspace", category: "background", dept: AppDepts.OPS, tools: [AppTools.GMAIL, AppTools.DOCS], complexity: "Low", timeSaved: "20 min/trip", tip: "Have different packing lists for Business vs Personal.", steps: ["Email 'Flight Confirmation'.", "Extract Destination & Dates.", "Create Itinerary Doc & Append Packing List Task."], trigger: "Email", action: "Plan", tags: ["ops", "travel", "automation"] },
  { id: 17, rank: 17, name: "Newsletter Aggregator", platform: "Google Workspace", category: "background", dept: AppDepts.EXEC, tools: [AppTools.GMAIL, AppTools.DOCS], complexity: "Low", timeSaved: "30 min/day", tip: "Read one Doc instead of 50 emails.", steps: ["Email matches label 'Newsletter'.", "Extract body text.", "Append to 'Weekly Reading' Doc."], trigger: "Email", action: "Compile", tags: ["productivity", "exec"] },
  { id: 18, rank: 18, name: "\"Out of Office\" Defender", platform: "Google Workspace", category: "background", dept: AppDepts.HR, tools: [AppTools.CAL, AppTools.GMAIL], complexity: "Med", timeSaved: "10 min/vacation", tip: "Standardize OOO replies across the org.", steps: ["Calendar event 'OOO' starts.", "Set Gmail Auto-reply on.", "Decline new meeting invites automatically."], trigger: "Cal Status", action: "Protect Time", tags: ["hr", "productivity"] },
  { id: 20, rank: 20, name: "Client Sentiment Analyzer", platform: "Custom", category: "background", dept: AppDepts.SALES, tools: [AppTools.GMAIL, AppTools.CRM], complexity: "High", timeSaved: "Risk Mitigation", tip: "Catch an angry client before they churn.", steps: ["Email thread length > 5.", "Analyze tone of latest client reply.", "If 'Angry', tag CRM record 'At Risk'."], trigger: "Email Activity", action: "Analyze", tags: ["sales", "success", "ai"] },
  { id: 25, rank: 25, name: "MBR Prep (Monthly Review)", platform: "Google Workspace", category: "background", dept: AppDepts.EXEC, tools: [AppTools.SHEET, AppTools.SLIDES], complexity: "High", timeSaved: "4 hrs/mo", tip: "Use a linked Slides template.", steps: ["Month End.", "Pull metrics from KPI Sheet.", "Update charts in Slides presentation."], trigger: "Schedule", action: "Report", tags: ["exec", "reporting", "data"] },
  { id: 31, rank: 31, name: "Gift Idea Tracker", platform: "Google Workspace", category: "triggered", dept: AppDepts.HR, tools: [AppTools.SLACK, AppTools.SHEET], complexity: "Low", timeSaved: "Personal", tip: "Never forget a client birthday gift.", steps: ["Message Slack bot 'Gift: John likes scotch'.", "Parse Item/Person.", "Add to Database."], trigger: "Chat", action: "Log", tags: ["hr", "culture"] },
  { id: 30, rank: 30, name: "Subscription Auditor", platform: "Google Workspace", category: "background", dept: AppDepts.FIN, tools: [AppTools.GMAIL, AppTools.SHEET], complexity: "Med", timeSaved: "Budget Saved", tip: "Search for 'Your invoice' or 'Receipt'.", steps: ["Monthly Scan.", "Find emails with 'Renewal'.", "List in Sheet for manual review."], trigger: "Schedule", action: "Audit", tags: ["finance", "saas", "audit"] },
  { id: 41, rank: 41, name: "Daily Journal Prompt", platform: "Google Workspace", category: "background", dept: AppDepts.EXEC, tools: [AppTools.DOCS, AppTools.CAL], complexity: "Low", timeSaved: "Mental Clarity", tip: "Use different prompts for Mon vs Fri.", steps: ["8 PM Daily.", "Create new Doc 'Journal - [Date]'.", "Insert questions."], trigger: "Schedule", action: "Prep", tags: ["productivity", "mental"] },
  { id: 42, rank: 42, name: "Archive Old Projects", platform: "Google Workspace", category: "background", dept: AppDepts.OPS, tools: [AppTools.DRIVE], complexity: "Low", timeSaved: "Space Saved", tip: "Don't delete, just move.", steps: ["File not opened > 1 year.", "Move to 'Cold Storage' folder.", "Remove share permissions."], trigger: "File Age", action: "Archive", tags: ["ops", "drive", "cleanup"] },

  // MAB PLATFORM: 10 AUTONOMOUS AGENTS
  {
    id: 2001, rank: -10, name: "Prospecting Signal Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.SALES,
    tools: [AppTools.OPENAI, AppTools.CRM], complexity: "Expert", timeSaved: "10 hrs/wk",
    tip: "Monitors news and hiring signals to identify high-intent leads automatically.",
    steps: ["Scan intent data/news", "Score leads by ICP", "Draft personalized intro"],
    trigger: "Signal Feed", action: "Identify -> Draft", tags: ["agent", "prospecting", "intent"], isPremium: true, tier: "GPT"
  },
  {
    id: 2002, rank: -9, name: "Deep Dossier Research Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.SALES,
    tools: [AppTools.DRIVE, AppTools.OPENAI], complexity: "Expert", timeSaved: "5 hrs/acct",
    tip: "Builds comprehensive account briefings by scraping tech stacks and financial reports.",
    steps: ["Scrape LinkedIn/Finances", "Map Tech Stack", "Generate SWOT Summary"],
    trigger: "Account Input", action: "Deep Research", tags: ["agent", "research", "intel"], isPremium: true, tier: "GPT"
  },
  {
    id: 2003, rank: -8, name: "Strategic Value Designer", platform: "MAB Platform", category: "Agent", dept: AppDepts.MKTG,
    tools: [AppTools.DOCS, AppTools.SLIDES], complexity: "Expert", timeSaved: "2 hrs/prop",
    tip: "Aligns solutions to specific customer pain points identified in dossiers.",
    steps: ["Ingest Dossier", "Map Features to Pain Points", "Generate Value Prop"],
    trigger: "Research End", action: "Design Strategy", tags: ["agent", "strategy", "creative"], isPremium: true, tier: "GPT"
  },
  {
    id: 2004, rank: -7, name: "Outreach Desk Assistant", platform: "MAB Platform", category: "Agent", dept: AppDepts.SALES,
    tools: [AppTools.GMAIL, AppTools.SLACK], complexity: "High", timeSaved: "15 hrs/wk",
    tip: "Manages multi-channel outreach (Email, SMS, LinkedIn) with human-like variability.",
    steps: ["Select Sequence", "Personalize via AI", "Schedule Send Waves"],
    trigger: "Lead Approved", action: "Multi-Channel Send", tags: ["agent", "outreach", "email"], isPremium: true, tier: "GPT"
  },
  {
    id: 2005, rank: -6, name: "Qualification & BANT Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.SALES,
    tools: [AppTools.GMAIL, AppTools.CRM], complexity: "High", timeSaved: "20 min/lead",
    tip: "Conversational AI that asks Budget, Authority, Need, and Timeline questions.",
    steps: ["Listen for Reply", "Parse Intent", "Log BANT Scores to CRM"],
    trigger: "Incoming Reply", action: "Qualify -> Log", tags: ["agent", "qual", "bant"], isPremium: true, tier: "GPT"
  },
  {
    id: 2006, rank: -5, name: "Autonomous Scheduling Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.EXEC,
    tools: [AppTools.CAL, AppTools.MEET], complexity: "Med", timeSaved: "10 min/appt",
    tip: "No more back-and-forth. Handles rescheduling and timezone logic perfectly.",
    steps: ["Check Availability", "Propose 3 Slots", "Confirm & Add Meet Link"],
    trigger: "Meeting Request", action: "Coordinate -> Save", tags: ["agent", "calendar", "admin"], isPremium: true, tier: "GPT"
  },
  {
    id: 2007, rank: -4, name: "Negotiation Guardrail Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.FIN,
    tools: [AppTools.SHEET, AppTools.OPENAI], complexity: "Expert", timeSaved: "Risk Mitigation",
    tip: "Prevents over-concession by checking every deal against live margin data.",
    steps: ["Ingest Concession Ask", "Check Margin Limits", "Draft Rebuttal with ROI"],
    trigger: "Deal Change", action: "Verify -> Guard", tags: ["agent", "legal", "finance"], isPremium: true, tier: "GPT"
  },
  {
    id: 2008, rank: -3, name: "Proposal Crafter Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.SALES,
    tools: [AppTools.DOCS, AppTools.DRIVE], complexity: "High", timeSaved: "4 hrs/prop",
    tip: "Generates beautiful, compliant enterprise proposals in seconds.",
    steps: ["Ingest Quote Details", "Fill Branding Templates", "Export to PDF & Draft Send"],
    trigger: "Quote Approved", action: "Generate Document", tags: ["agent", "proposals", "ops"], isPremium: true, tier: "GPT"
  },
  {
    id: 2009, rank: -2, name: "Contract Guardian Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.FIN,
    tools: [AppTools.DOCS, AppTools.GMAIL], complexity: "Expert", timeSaved: "Legal Peace",
    tip: "Scans inbound Redlines and flags deviations from Standard Operating Procedures.",
    steps: ["Ingest Redlined PDF", "Compare to Master SOP", "Highlight Conflicts"],
    trigger: "File Upload", action: "Audit -> Alert", tags: ["agent", "legal", "risk"], isPremium: true, tier: "GPT"
  },
  {
    id: 2010, rank: -1, name: "Churn Predictor Agent", platform: "MAB Platform", category: "Agent", dept: AppDepts.OPS,
    tools: [AppTools.CRM, AppTools.STRIPE], complexity: "Expert", timeSaved: "Retention $$$",
    tip: "Uses usage patterns to flag accounts likely to leave 60 days before they do.",
    steps: ["Analyze API Usage", "Detect Drop-off", "Trigger Success Playbook"],
    trigger: "Data Scan", action: "Predict -> Trigger", tags: ["agent", "retention", "ai"], isPremium: true, tier: "GPT"
  },

  // MAB PLATFORM: SALES GEMs
  {
    id: 3001, rank: -20, name: "SAM Quote Builder v2", platform: "MAB Platform", category: "triggered", dept: AppDepts.OPS,
    tools: [AppTools.SHEET, AppTools.APPS_SCRIPT], complexity: "Expert", timeSaved: "GEM Elite",
    tip: "The core quoting engine for enterprise pricing logic.",
    steps: ["Input Requirements", "Apply Pricing Logic", "Generate Quote Output"],
    trigger: "Config Start", action: "Calculate -> Sync", tags: ["gem", "quoting", "finance"], isPremium: true, tier: "GEM"
  },
  {
    id: 3002, rank: -19, name: "Headroom Architecture Builder", platform: "MAB Platform", category: "triggered", dept: AppDepts.TECH,
    tools: [AppTools.DRIVE, AppTools.SHEET], complexity: "Expert", timeSaved: "GEM Elite",
    tip: "Calculates network capacity and headroom for enterprise deployments.",
    steps: ["Ingest Node Data", "Simulate Load", "Generate Capacity Report"],
    trigger: "Design Init", action: "Simulate -> Report", tags: ["gem", "network", "tech"], isPremium: true, tier: "GEM"
  },
  {
    id: 3003, rank: -18, name: "Full Scope Prospect GEM", platform: "MAB Platform", category: "triggered", dept: AppDepts.SALES,
    tools: [AppTools.OPENAI, AppTools.CRM], complexity: "High", timeSaved: "GEM Elite",
    tip: "End-to-end prospecting sequence generator including icebreakers.",
    steps: ["Gather Account Info", "Gen Personalized Blurbs", "Push to Outreach Sequence"],
    trigger: "New Prospect", action: "Generate Flow", tags: ["gem", "prospecting", "outreach"], isPremium: true, tier: "GEM"
  },
  {
    id: 3004, rank: -17, name: "Real-Time Meeting Assistant", platform: "MAB Platform", category: "background", dept: AppDepts.SALES,
    tools: [AppTools.MEET, AppTools.OPENAI], complexity: "Expert", timeSaved: "GEM Elite",
    tip: "Live transcription and suggestion bot that feeds data to Objection Handler.",
    steps: ["Monitor Audio", "Detect Objections", "Surface Rebuttal Cards"],
    trigger: "Active Call", action: "Listen -> Support", tags: ["gem", "meetings", "real-time"], isPremium: true, tier: "GEM"
  }
];
