import type { Workflow as DatabaseWorkflow } from './database';

export interface UIWorkflow {
    id: string | number;
    rank: number;
    name: string;
    category: string;
    dept: string;
    tools: string[];
    platform: string;
    price?: number;
    isPremium?: boolean;
    tier?: string;
    tags: string[];
    steps: string[];
    timeSaved: string;
    action: string;
    isUser?: boolean;
    raw?: DatabaseWorkflow;
    complexity?: string;
    tip?: string;
    trigger?: string;
}
