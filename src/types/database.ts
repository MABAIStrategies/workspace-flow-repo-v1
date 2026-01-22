// Database Types for Workspace Flow Agent

export type Platform = 
  | 'Google Workspace'
  | 'Zapier'
  | 'n8n'
  | 'Make'
  | 'Custom'
  | 'API-Based'
  | 'Multi-Platform';

export type Department = 
  | 'Sales'
  | 'Marketing'
  | 'HR'
  | 'Finance'
  | 'Operations'
  | 'Executive'
  | 'IT/Eng';

export type Category = 
  | 'hitl'      // Human-in-the-loop
  | 'triggered' // Event-triggered
  | 'background'; // Background automation

export interface Workflow {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  department: Department | null;
  category: Category | null;
  trigger_event: string | null;
  action_chain: string | null;
  tools: string[] | null;
  
  // Platform & Monetization
  platform: Platform;
  price: number; // Decimal in USD
  is_premium: boolean;
  tags: string[] | null;
  
  // Visual Properties
  color_theme: string | null;
  spine_height: number;
  
  // Publishing
  is_public: boolean;
  created_at: string; // ISO timestamp
}

export interface Profile {
  id: string; // UUID
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null; // ISO timestamp
}

// Form types for creating/updating workflows
export interface WorkflowFormData {
  name: string;
  description?: string;
  department?: Department;
  category?: Category;
  trigger_event?: string;
  action_chain?: string;
  tools?: string[];
  platform?: Platform;
  price?: number;
  is_premium?: boolean;
  tags?: string[];
  color_theme?: string;
  spine_height?: number;
  is_public?: boolean;
}
