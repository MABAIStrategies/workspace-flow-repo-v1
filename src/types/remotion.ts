/**
 * Remotion Skills Integration - Type Definitions
 * @description Core type definitions for Remotion agent skills integration
 */

import { z } from 'zod';

// ============================================
// COMPOSITION CONFIGURATION
// ============================================

export const CompositionConfigSchema = z.object({
  width: z.number().min(1).max(7680).describe('Video width in pixels'),
  height: z.number().min(1).max(4320).describe('Video height in pixels'),
  fps: z.number().min(1).max(240).describe('Frames per second'),
  durationInFrames: z.number().min(1).describe('Total duration in frames'),
});

export type CompositionConfig = z.infer<typeof CompositionConfigSchema>;

// ============================================
// RENDER SETTINGS
// ============================================

export const RenderSettingsSchema = z.object({
  codec: z.enum(['h264', 'h265', 'vp8', 'vp9', 'prores', 'gif']).describe('Output codec'),
  imageFormat: z.enum(['jpeg', 'png']).describe('Frame image format'),
  quality: z.number().min(0).max(100).optional().describe('JPEG quality (0-100)'),
  crf: z.number().min(0).max(63).optional().describe('Constant rate factor'),
  pixelFormat: z.enum(['yuv420p', 'yuv422p', 'yuv444p', 'yuva420p']).optional(),
  audioCodec: z.enum(['aac', 'mp3', 'opus', 'pcm']).optional(),
  audioBitrate: z.string().optional().describe('e.g., "128k", "320k"'),
  scale: z.number().min(0.1).max(4).optional().describe('Output scale factor'),
});

export type RenderSettings = z.infer<typeof RenderSettingsSchema>;

// ============================================
// COMPOSITION OUTPUT
// ============================================

export const RemotionCompositionSchema = z.object({
  compositionId: z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/)
    .describe('Unique composition identifier'),
  component: z.string().describe('React component code as string'),
  props: z.record(z.any()).describe('Default props for the composition'),
  config: CompositionConfigSchema,
  assets: z.array(z.string()).describe('Required asset paths'),
  renderSettings: RenderSettingsSchema,
  implementationNotes: z.string().optional().describe('Additional implementation guidance'),
  dependencies: z.array(z.string()).optional().describe('Required npm packages'),
});

export type RemotionComposition = z.infer<typeof RemotionCompositionSchema>;

// ============================================
// SKILL CATEGORIES & ENUMS
// ============================================

export type SkillCategory =
  | 'animation'      // Motion and transitions
  | 'transition'     // Scene transitions
  | 'template'       // Reusable video templates
  | 'effect'         // Visual effects
  | 'utility'        // Helper compositions
  | 'data-driven'    // Dynamic data visualization
  | 'audio-visual';  // Audio-synchronized content

export type RuleCategory =
  | 'composition'    // Composition setup and structure
  | 'animation'      // Animation techniques
  | 'timing'         // Sequence and timing control
  | 'hooks'          // Remotion hooks usage
  | 'async'          // Async operations
  | 'rendering'      // Render configuration
  | 'performance'    // Performance optimization
  | 'audio'          // Audio handling
  | 'assets';        // Asset management

export type RuleEnforcement = 'required' | 'recommended' | 'optional';

// ============================================
// REMOTION RULE DEFINITION
// ============================================

export interface RemotionRule {
  /** Unique rule identifier (1-27) */
  id: number;

  /** Human-readable rule name */
  name: string;

  /** Rule category for grouping */
  category: RuleCategory;

  /** Detailed description of the rule */
  description: string;

  /** Enforcement level */
  enforcement: RuleEnforcement;

  /** Correct implementation example */
  codeExample: string;

  /** Common mistake to avoid (optional) */
  antiPattern?: string;

  /** Related rule IDs */
  relatedRules?: number[];

  /** Tags for searchability */
  tags?: string[];
}

// ============================================
// SKILL DEFINITION
// ============================================

export interface RemotionSkillDefinition {
  /** Unique skill identifier */
  id: string;

  /** Human-readable skill name */
  name: string;

  /** Skill description */
  description: string;

  /** Version string */
  version: string;

  /** Skill category */
  category: SkillCategory;

  /** Searchable tags */
  tags: string[];

  /** Complexity level */
  complexity: 'beginner' | 'intermediate' | 'advanced';

  /** Default composition configuration */
  defaultConfig: CompositionConfig;

  /** Props schema for validation */
  propsSchema: z.ZodObject<any>;

  /** Rule IDs this skill applies */
  applicableRules: number[];

  /** Required npm packages */
  requiredPackages: string[];

  /** Peer dependencies */
  peerDependencies?: string[];

  /** Trigger pattern for skill invocation */
  triggerPattern: string;

  /** Supported output formats */
  outputFormats: ('mp4' | 'webm' | 'gif' | 'png-sequence')[];

  /** Whether this is a premium skill */
  isPremium: boolean;

  /** Price if premium */
  price?: number;

  /** Skill author */
  author: string;

  /** Component template code */
  componentTemplate?: string;
}

// ============================================
// VALIDATION RESULTS
// ============================================

export interface RuleViolation {
  ruleId: number;
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  lineNumber?: number;
  column?: number;
}

export interface ValidationResult {
  isValid: boolean;
  violations: RuleViolation[];
  score: number; // 0-100 compliance score
  checkedRules: number[];
  passedRules: number[];
  failedRules: number[];
}

// ============================================
// GENERATION REQUEST/RESPONSE
// ============================================

export interface GenerationRequest {
  prompt: string;
  config?: Partial<CompositionConfig>;
  style?: string;
  skillId?: string;
  rules?: number[];
  outputFormat?: 'mp4' | 'webm' | 'gif';
}

export interface GenerationResponse {
  success: boolean;
  composition?: RemotionComposition;
  validation?: ValidationResult;
  error?: string;
  generationTime?: number;
  model?: string;
}

// ============================================
// SKILL REGISTRY TYPES
// ============================================

export interface SkillRegistryEntry {
  skill: RemotionSkillDefinition;
  registeredAt: Date;
  usageCount: number;
  lastUsed?: Date;
}

export interface SkillSearchParams {
  category?: SkillCategory;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  maxResults?: number;
}

// ============================================
// PROMPT TEMPLATE TYPES
// ============================================

export interface PromptContext {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  style: string;
  userPrompt: string;
  rules: RemotionRule[];
  skillHints?: string[];
}

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  requiredContext: (keyof PromptContext)[];
  category: SkillCategory;
}

// ============================================
// PRESET CONFIGURATIONS
// ============================================

export const PRESET_CONFIGS = {
  '1080p30': { width: 1920, height: 1080, fps: 30, durationInFrames: 150 },
  '1080p60': { width: 1920, height: 1080, fps: 60, durationInFrames: 300 },
  '720p30': { width: 1280, height: 720, fps: 30, durationInFrames: 150 },
  '4k30': { width: 3840, height: 2160, fps: 30, durationInFrames: 150 },
  'instagram-square': { width: 1080, height: 1080, fps: 30, durationInFrames: 150 },
  'instagram-story': { width: 1080, height: 1920, fps: 30, durationInFrames: 150 },
  'youtube-short': { width: 1080, height: 1920, fps: 30, durationInFrames: 300 },
  'tiktok': { width: 1080, height: 1920, fps: 30, durationInFrames: 450 },
  'twitter-video': { width: 1280, height: 720, fps: 30, durationInFrames: 600 },
  'linkedin-video': { width: 1920, height: 1080, fps: 30, durationInFrames: 300 },
} as const satisfies Record<string, CompositionConfig>;

export type PresetConfigName = keyof typeof PRESET_CONFIGS;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert seconds to frames
 */
export function secondsToFrames(seconds: number, fps: number): number {
  return Math.round(seconds * fps);
}

/**
 * Convert frames to seconds
 */
export function framesToSeconds(frames: number, fps: number): number {
  return frames / fps;
}

/**
 * Get a preset configuration by name
 */
export function getPresetConfig(name: PresetConfigName): CompositionConfig {
  return { ...PRESET_CONFIGS[name] };
}

/**
 * Validate a composition config
 */
export function validateConfig(config: unknown): config is CompositionConfig {
  return CompositionConfigSchema.safeParse(config).success;
}

/**
 * Create a duration-adjusted config
 */
export function withDuration(
  config: CompositionConfig,
  durationSeconds: number
): CompositionConfig {
  return {
    ...config,
    durationInFrames: secondsToFrames(durationSeconds, config.fps),
  };
}
