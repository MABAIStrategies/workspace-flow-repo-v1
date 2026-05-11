# Remotion Agent Skills Integration Guide

> **Version:** 1.0.0
> **Target Platform:** Claude Code / Claude Agent SDK
> **Integration Pattern:** Skill Manifesto Architecture

---

## Table of Contents

1. [Overview](#overview)
2. [Complete Skill Manifesto](#complete-skill-manifesto)
3. [Integration Steps](#integration-steps)
4. [Remotion Rules Data Structure](#remotion-rules-data-structure)
5. [Implementation Examples](#implementation-examples)

---

## Overview

This guide provides a comprehensive framework for integrating Remotion video generation capabilities as agent skills within Claude. The integration follows the established skill/workflow abstraction patterns and leverages structured prompt engineering for deterministic video composition outputs.

### Architecture Goals

- **Skill Discovery:** Tag-based taxonomy with composition type filtering
- **Skill Definition:** Typed system with Remotion-specific metadata
- **Skill Execution:** Rule-driven generation with structured JSON output
- **Skill Validation:** Zod schema enforcement for props and compositions

---

## Complete Skill Manifesto

### System Prompt Template

```typescript
const REMOTION_SKILL_MANIFESTO = `
You are an expert Remotion Video Architect specializing in programmatic video generation with React.

## Core Identity
- Name: Remotion Composition Agent
- Version: 4.0+
- Specialization: Declarative video composition using React components
- Output Format: Structured JSON for Remotion compositions

## Capabilities
You can design, generate, and optimize:
1. Video compositions with frame-precise timing
2. Animated React components for video sequences
3. Audio-visual synchronization logic
4. Data-driven video templates
5. Server-side rendering configurations

## Context Parameters
- Target Resolution: \${width}x\${height}
- Frame Rate: \${fps} fps
- Duration: \${durationInFrames} frames (\${durationInFrames / fps} seconds)
- Composition ID: \${compositionId}
- Output Format: \${outputFormat} (mp4|webm|gif)

## Constraints
You MUST follow all 27 Remotion Rules (see REMOTION_RULES constant).
You MUST output valid TypeScript/React code compatible with Remotion 4.x.
You MUST use proper interpolation functions for all animations.
You MUST handle async data with delayRender/continueRender pattern.

## Output Schema
Return a JSON object ONLY (no markdown, no explanation) with this structure:
{
  "compositionId": "string",
  "component": "string (React component code)",
  "props": {},
  "config": {
    "width": number,
    "height": number,
    "fps": number,
    "durationInFrames": number
  },
  "assets": ["array of required asset paths"],
  "renderSettings": {
    "codec": "h264|h265|vp8|vp9",
    "imageFormat": "jpeg|png",
    "quality": number
  },
  "implementationNotes": "string"
}

## User Request
"\${userPrompt}"

Generate the optimal Remotion composition following all rules and best practices.
`;
```

### Skill Registration Interface

```typescript
interface RemotionSkill {
  // Core Identification
  id: string;
  name: string;
  description: string;
  version: string;

  // Taxonomy
  category: 'animation' | 'transition' | 'template' | 'effect' | 'utility';
  tags: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';

  // Remotion Configuration
  defaultConfig: {
    width: number;
    height: number;
    fps: number;
    durationInFrames: number;
  };

  // Props Schema (Zod)
  propsSchema: string;

  // Dependencies
  requiredPackages: string[];
  peerDependencies: string[];

  // Execution
  triggerPattern: string;
  outputFormat: 'mp4' | 'webm' | 'gif' | 'png-sequence';

  // Marketplace
  isPremium: boolean;
  price: number;
  author: string;
}
```

### Skill Invocation Pattern

```typescript
const SKILL_INVOCATION_TEMPLATE = `
<skill-invocation>
  <skill-name>remotion-\${skillCategory}</skill-name>
  <trigger>\${triggerPattern}</trigger>
  <context>
    <resolution>\${width}x\${height}</resolution>
    <duration>\${durationInSeconds}s @ \${fps}fps</duration>
    <style>\${visualStyle}</style>
  </context>
  <rules>REMOTION_RULES[*]</rules>
  <output>structured-composition-json</output>
</skill-invocation>
`;
```

---

## Integration Steps

### Phase 1: Core Infrastructure

#### Step 1.1: Install Dependencies

```bash
# Core Remotion packages
npm install remotion @remotion/cli @remotion/renderer

# Optional enhancements
npm install @remotion/player @remotion/lambda @remotion/gif
npm install @remotion/media-utils @remotion/paths @remotion/noise

# Type safety
npm install zod
```

#### Step 1.2: Create Type Definitions

Create `/src/types/remotion.ts`:

```typescript
import { z } from 'zod';

// Composition Configuration Schema
export const CompositionConfigSchema = z.object({
  width: z.number().min(1).max(7680),
  height: z.number().min(1).max(4320),
  fps: z.number().min(1).max(240),
  durationInFrames: z.number().min(1),
});

export type CompositionConfig = z.infer<typeof CompositionConfigSchema>;

// Render Settings Schema
export const RenderSettingsSchema = z.object({
  codec: z.enum(['h264', 'h265', 'vp8', 'vp9', 'prores']),
  imageFormat: z.enum(['jpeg', 'png']),
  quality: z.number().min(0).max(100).optional(),
  crf: z.number().min(0).max(63).optional(),
  pixelFormat: z.enum(['yuv420p', 'yuv422p', 'yuv444p']).optional(),
});

export type RenderSettings = z.infer<typeof RenderSettingsSchema>;

// Complete Composition Schema
export const RemotionCompositionSchema = z.object({
  compositionId: z.string().regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/),
  component: z.string(),
  props: z.record(z.any()),
  config: CompositionConfigSchema,
  assets: z.array(z.string()),
  renderSettings: RenderSettingsSchema,
  implementationNotes: z.string().optional(),
});

export type RemotionComposition = z.infer<typeof RemotionCompositionSchema>;

// Skill Definition
export interface RemotionSkillDefinition {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  rules: RemotionRule[];
  defaultConfig: CompositionConfig;
  propsSchema: z.ZodObject<any>;
}

export type SkillCategory =
  | 'animation'
  | 'transition'
  | 'template'
  | 'effect'
  | 'utility'
  | 'data-driven'
  | 'audio-visual';

export interface RemotionRule {
  id: number;
  name: string;
  category: RuleCategory;
  description: string;
  enforcement: 'required' | 'recommended' | 'optional';
  codeExample: string;
  antiPattern?: string;
}

export type RuleCategory =
  | 'composition'
  | 'animation'
  | 'timing'
  | 'hooks'
  | 'async'
  | 'rendering'
  | 'performance'
  | 'audio'
  | 'assets';
```

#### Step 1.3: Create Skill Registry

Create `/src/lib/remotion-skills.ts`:

```typescript
import { RemotionSkillDefinition, RemotionRule } from '../types/remotion';
import { REMOTION_RULES } from './remotion-rules';

class RemotionSkillRegistry {
  private skills: Map<string, RemotionSkillDefinition> = new Map();
  private rules: RemotionRule[] = REMOTION_RULES;

  registerSkill(skill: RemotionSkillDefinition): void {
    this.skills.set(skill.id, skill);
  }

  getSkill(id: string): RemotionSkillDefinition | undefined {
    return this.skills.get(id);
  }

  getSkillsByCategory(category: string): RemotionSkillDefinition[] {
    return Array.from(this.skills.values())
      .filter(skill => skill.category === category);
  }

  getRulesByCategory(category: string): RemotionRule[] {
    return this.rules.filter(rule => rule.category === category);
  }

  getRequiredRules(): RemotionRule[] {
    return this.rules.filter(rule => rule.enforcement === 'required');
  }

  validateComposition(code: string): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    for (const rule of this.getRequiredRules()) {
      if (!this.checkRuleCompliance(code, rule)) {
        violations.push(`Rule ${rule.id}: ${rule.name}`);
      }
    }

    return { valid: violations.length === 0, violations };
  }

  private checkRuleCompliance(code: string, rule: RemotionRule): boolean {
    // Rule-specific compliance checking logic
    // Implementation varies per rule
    return true;
  }
}

export const remotionSkillRegistry = new RemotionSkillRegistry();
```

### Phase 2: Rules Engine

#### Step 2.1: Create Rules Data Structure

Create `/src/lib/remotion-rules.ts` (see full implementation in Section 4).

#### Step 2.2: Implement Rule Validator

```typescript
// /src/lib/remotion-validator.ts
import { REMOTION_RULES } from './remotion-rules';

export class RemotionRuleValidator {
  validateCode(code: string): ValidationResult {
    const results: RuleViolation[] = [];

    for (const rule of REMOTION_RULES) {
      const violation = this.checkRule(code, rule);
      if (violation) {
        results.push(violation);
      }
    }

    return {
      isValid: results.filter(r => r.severity === 'error').length === 0,
      violations: results,
      score: this.calculateComplianceScore(results),
    };
  }

  private checkRule(code: string, rule: RemotionRule): RuleViolation | null {
    const checker = RULE_CHECKERS[rule.id];
    if (checker && !checker(code)) {
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.enforcement === 'required' ? 'error' : 'warning',
        message: rule.description,
        suggestion: rule.codeExample,
      };
    }
    return null;
  }

  private calculateComplianceScore(violations: RuleViolation[]): number {
    const totalRules = REMOTION_RULES.length;
    const errors = violations.filter(v => v.severity === 'error').length;
    const warnings = violations.filter(v => v.severity === 'warning').length;
    return Math.max(0, 100 - (errors * 10) - (warnings * 2));
  }
}

interface ValidationResult {
  isValid: boolean;
  violations: RuleViolation[];
  score: number;
}

interface RuleViolation {
  ruleId: number;
  ruleName: string;
  severity: 'error' | 'warning';
  message: string;
  suggestion: string;
}

// Rule checker implementations
const RULE_CHECKERS: Record<number, (code: string) => boolean> = {
  1: (code) => code.includes('useCurrentFrame'),
  2: (code) => code.includes('useVideoConfig'),
  3: (code) => !code.includes('useState') || code.includes('// frame-driven'),
  // ... additional checkers
};
```

### Phase 3: AI Integration

#### Step 3.1: Create Remotion Generation Service

Create `/src/lib/remotion-generator.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RemotionCompositionSchema, RemotionComposition } from '../types/remotion';
import { REMOTION_RULES } from './remotion-rules';
import { RemotionRuleValidator } from './remotion-validator';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const validator = new RemotionRuleValidator();

export async function generateRemotionComposition(
  prompt: string,
  config: {
    width?: number;
    height?: number;
    fps?: number;
    duration?: number;
    style?: string;
  } = {}
): Promise<RemotionComposition> {
  const {
    width = 1920,
    height = 1080,
    fps = 30,
    duration = 5,
    style = 'modern',
  } = config;

  const systemPrompt = buildSystemPrompt(width, height, fps, duration, style);
  const rulesContext = formatRulesForPrompt();

  const fullPrompt = `
${systemPrompt}

## Remotion Rules Reference
${rulesContext}

## User Request
${prompt}
`;

  const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;

      const parsed = JSON.parse(jsonMatch[0]);
      const validated = RemotionCompositionSchema.parse(parsed);

      // Validate against Remotion rules
      const ruleValidation = validator.validateCode(validated.component);
      if (!ruleValidation.isValid) {
        console.warn('Rule violations:', ruleValidation.violations);
      }

      return validated;
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error);
      continue;
    }
  }

  throw new Error('All models failed to generate valid composition');
}

function buildSystemPrompt(
  width: number,
  height: number,
  fps: number,
  duration: number,
  style: string
): string {
  return `
You are an expert Remotion Video Architect specializing in programmatic video generation.

## Output Configuration
- Resolution: ${width}x${height}
- Frame Rate: ${fps} fps
- Duration: ${duration * fps} frames (${duration} seconds)
- Visual Style: ${style}

## Response Format
Return ONLY a valid JSON object matching this schema:
{
  "compositionId": "string (valid identifier)",
  "component": "string (complete React component code)",
  "props": {},
  "config": {
    "width": ${width},
    "height": ${height},
    "fps": ${fps},
    "durationInFrames": ${duration * fps}
  },
  "assets": [],
  "renderSettings": {
    "codec": "h264",
    "imageFormat": "jpeg",
    "quality": 80
  },
  "implementationNotes": "string"
}

## Critical Requirements
1. Component MUST use useCurrentFrame() for animations
2. Component MUST use useVideoConfig() for dimensions
3. ALL animations MUST use interpolate() or spring()
4. NO useState for animation state - use frame-based logic
5. Include proper TypeScript types
`;
}

function formatRulesForPrompt(): string {
  return REMOTION_RULES.map(rule =>
    `### Rule ${rule.id}: ${rule.name}
Category: ${rule.category} | Enforcement: ${rule.enforcement}
${rule.description}

\`\`\`typescript
${rule.codeExample}
\`\`\`
${rule.antiPattern ? `\n❌ Anti-pattern:\n\`\`\`typescript\n${rule.antiPattern}\n\`\`\`` : ''}
`
  ).join('\n---\n');
}
```

### Phase 4: UI Integration

#### Step 4.1: Create Remotion Studio Component

```typescript
// /src/components/RemotionStudio.tsx
import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { generateRemotionComposition } from '../lib/remotion-generator';

export const RemotionStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [composition, setComposition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateRemotionComposition(prompt, config);
      setComposition(result);
    } catch (error) {
      alert('Generation failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="remotion-studio">
      <div className="config-panel">
        <h2>Remotion Composition Generator</h2>

        <div className="config-grid">
          <label>
            Width
            <input
              type="number"
              value={config.width}
              onChange={e => setConfig({...config, width: +e.target.value})}
            />
          </label>
          <label>
            Height
            <input
              type="number"
              value={config.height}
              onChange={e => setConfig({...config, height: +e.target.value})}
            />
          </label>
          <label>
            FPS
            <input
              type="number"
              value={config.fps}
              onChange={e => setConfig({...config, fps: +e.target.value})}
            />
          </label>
          <label>
            Duration (s)
            <input
              type="number"
              value={config.duration}
              onChange={e => setConfig({...config, duration: +e.target.value})}
            />
          </label>
        </div>

        <textarea
          placeholder="Describe your video composition..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Composition'}
        </button>
      </div>

      {composition && (
        <div className="preview-panel">
          <h3>Preview</h3>
          <Player
            component={eval(composition.component)}
            durationInFrames={composition.config.durationInFrames}
            fps={composition.config.fps}
            compositionWidth={composition.config.width}
            compositionHeight={composition.config.height}
            controls
          />
          <pre>{JSON.stringify(composition, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

---

## Remotion Rules Data Structure

### Complete 27 Rules Definition

Create `/src/lib/remotion-rules.ts`:

```typescript
import { RemotionRule } from '../types/remotion';

export const REMOTION_RULES: RemotionRule[] = [
  // ============================================
  // COMPOSITION RULES (1-5)
  // ============================================
  {
    id: 1,
    name: 'Use useCurrentFrame for Animation State',
    category: 'hooks',
    description: 'Always use the useCurrentFrame() hook to get the current frame number. This is the foundation of all Remotion animations and ensures frame-perfect synchronization.',
    enforcement: 'required',
    codeExample: `import { useCurrentFrame } from 'remotion';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ opacity: frame / 30 }}>
      Frame: {frame}
    </div>
  );
};`,
    antiPattern: `// ❌ WRONG: Using useState for animation
const [opacity, setOpacity] = useState(0);
useEffect(() => {
  setOpacity(prev => prev + 0.1);
}, []);`
  },

  {
    id: 2,
    name: 'Use useVideoConfig for Dimensions',
    category: 'hooks',
    description: 'Always use useVideoConfig() to access video dimensions, fps, and duration. Never hardcode these values as they may change based on composition settings.',
    enforcement: 'required',
    codeExample: `import { useVideoConfig } from 'remotion';

const MyComponent: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();

  return (
    <div style={{
      width: width / 2,
      height: height / 2,
      position: 'absolute',
      left: width / 4,
      top: height / 4
    }}>
      Video is {durationInFrames / fps} seconds long
    </div>
  );
};`,
    antiPattern: `// ❌ WRONG: Hardcoded dimensions
const width = 1920; // Don't do this
const height = 1080; // Don't do this`
  },

  {
    id: 3,
    name: 'Use interpolate for Smooth Animations',
    category: 'animation',
    description: 'Use the interpolate() function to map frame numbers to animated values. This provides smooth, predictable animations with configurable easing.',
    enforcement: 'required',
    codeExample: `import { useCurrentFrame, interpolate } from 'remotion';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 30, 60, 90],  // input range (frames)
    [0, 1, 1, 0],     // output range (opacity values)
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const scale = interpolate(frame, [0, 30], [0.5, 1]);

  return (
    <div style={{
      opacity,
      transform: \`scale(\${scale})\`
    }}>
      Animated Content
    </div>
  );
};`,
    antiPattern: `// ❌ WRONG: Linear calculation without interpolate
const opacity = frame / 30; // No easing, no clamping`
  },

  {
    id: 4,
    name: 'Use spring for Physics-Based Animation',
    category: 'animation',
    description: 'Use the spring() function for natural, physics-based animations. Springs automatically handle easing and overshooting for realistic motion.',
    enforcement: 'recommended',
    codeExample: `import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const slideIn = spring({
    frame: frame - 15, // Delay by 15 frames
    fps,
    config: { damping: 12 },
  });

  return (
    <div style={{
      transform: \`scale(\${scale}) translateX(\${(1 - slideIn) * -100}px)\`
    }}>
      Spring Animation
    </div>
  );
};`,
  },

  {
    id: 5,
    name: 'Register Compositions in Root',
    category: 'composition',
    description: 'All compositions must be registered in the Root component using the <Composition> component. This defines the entry points for rendering.',
    enforcement: 'required',
    codeExample: `import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';
import { AnotherVideo } from './AnotherVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Default Title',
        }}
      />
      <Composition
        id="AnotherVideo"
        component={AnotherVideo}
        durationInFrames={300}
        fps={60}
        width={1280}
        height={720}
      />
    </>
  );
};`,
  },

  // ============================================
  // SEQUENCE & TIMING RULES (6-10)
  // ============================================
  {
    id: 6,
    name: 'Use Sequence for Timeline Composition',
    category: 'timing',
    description: 'Use <Sequence> components to compose multiple elements on a timeline. Each Sequence resets the frame counter to 0 for its children.',
    enforcement: 'required',
    codeExample: `import { Sequence } from 'remotion';

const MyVideo: React.FC = () => {
  return (
    <div>
      <Sequence from={0} durationInFrames={30}>
        <IntroScene />
      </Sequence>

      <Sequence from={30} durationInFrames={60}>
        <MainContent />
      </Sequence>

      <Sequence from={90} durationInFrames={30}>
        <OutroScene />
      </Sequence>
    </div>
  );
};`,
  },

  {
    id: 7,
    name: 'Use AbsoluteFill for Layering',
    category: 'composition',
    description: 'Use <AbsoluteFill> to create full-size layers that stack on top of each other. This is essential for compositing multiple visual elements.',
    enforcement: 'recommended',
    codeExample: `import { AbsoluteFill } from 'remotion';

const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>
        <BackgroundLayer />
      </AbsoluteFill>

      <AbsoluteFill>
        <ContentLayer />
      </AbsoluteFill>

      <AbsoluteFill style={{ zIndex: 10 }}>
        <OverlayLayer />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};`,
  },

  {
    id: 8,
    name: 'Handle Frame Timing with from and durationInFrames',
    category: 'timing',
    description: 'Always specify explicit timing using from (start frame) and durationInFrames props. Avoid relying on implicit timing.',
    enforcement: 'required',
    codeExample: `import { Sequence, useVideoConfig } from 'remotion';

const MyVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Convert seconds to frames for clarity
  const introStart = 0;
  const introDuration = 2 * fps; // 2 seconds

  const mainStart = introDuration;
  const mainDuration = 5 * fps; // 5 seconds

  return (
    <>
      <Sequence from={introStart} durationInFrames={introDuration}>
        <Intro />
      </Sequence>

      <Sequence from={mainStart} durationInFrames={mainDuration}>
        <MainContent />
      </Sequence>
    </>
  );
};`,
  },

  {
    id: 9,
    name: 'Use Series for Sequential Animations',
    category: 'timing',
    description: 'Use <Series> when you need sequential, non-overlapping sequences. Series automatically calculates start frames based on previous durations.',
    enforcement: 'recommended',
    codeExample: `import { Series } from 'remotion';

const MyVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={30}>
        <Scene1 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={45}>
        <Scene2 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={30}>
        <Scene3 />
      </Series.Sequence>
    </Series>
  );
};`,
  },

  {
    id: 10,
    name: 'Use Loop for Repeating Animations',
    category: 'timing',
    description: 'Use <Loop> to repeat a sequence of frames multiple times. Useful for looping backgrounds, loading indicators, or cyclic animations.',
    enforcement: 'optional',
    codeExample: `import { Loop } from 'remotion';

const MyVideo: React.FC = () => {
  return (
    <Loop durationInFrames={30} times={4}>
      <PulsingDot />
    </Loop>
  );
};

// The PulsingDot will play 4 times, each loop lasting 30 frames`,
  },

  // ============================================
  // ASYNC & DATA RULES (11-15)
  // ============================================
  {
    id: 11,
    name: 'Use delayRender for Async Operations',
    category: 'async',
    description: 'When fetching data or loading assets asynchronously, use delayRender() to pause rendering until ready, then call continueRender() when done.',
    enforcement: 'required',
    codeExample: `import { useEffect, useState } from 'react';
import { delayRender, continueRender } from 'remotion';

const DataDrivenVideo: React.FC = () => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.example.com/data');
        const json = await response.json();
        setData(json);
        continueRender(handle);
      } catch (error) {
        // Handle error and still continue render
        console.error(error);
        continueRender(handle);
      }
    }
    fetchData();
  }, [handle]);

  if (!data) return null;

  return <div>{data.title}</div>;
};`,
    antiPattern: `// ❌ WRONG: Async without delayRender
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);
// Render might happen before data arrives!`
  },

  {
    id: 12,
    name: 'Preload Assets with staticFile',
    category: 'assets',
    description: 'Use staticFile() to reference assets in the public folder. This ensures proper path resolution during both development and rendering.',
    enforcement: 'required',
    codeExample: `import { staticFile, Img, Audio, Video } from 'remotion';

const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Image from public folder */}
      <Img src={staticFile('images/logo.png')} />

      {/* Audio from public folder */}
      <Audio src={staticFile('audio/background.mp3')} />

      {/* Video from public folder */}
      <Video src={staticFile('videos/intro.mp4')} />
    </AbsoluteFill>
  );
};`,
    antiPattern: `// ❌ WRONG: Relative paths
<Img src="/images/logo.png" />
<Img src="./logo.png" />`
  },

  {
    id: 13,
    name: 'Use getInputProps for Dynamic Data',
    category: 'async',
    description: 'Use getInputProps() to receive data passed during rendering. This allows dynamic video generation based on external data.',
    enforcement: 'recommended',
    codeExample: `import { getInputProps } from 'remotion';

interface VideoProps {
  title: string;
  items: string[];
  backgroundColor: string;
}

const DynamicVideo: React.FC = () => {
  const { title, items, backgroundColor } = getInputProps<VideoProps>();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <h1>{title}</h1>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </AbsoluteFill>
  );
};

// Render with: npx remotion render --props='{"title":"My Video"}'`,
  },

  {
    id: 14,
    name: 'Calculate Metadata with calculateMetadata',
    category: 'composition',
    description: 'Use calculateMetadata to dynamically compute composition properties like duration based on input props.',
    enforcement: 'recommended',
    codeExample: `import { Composition } from 'remotion';

const calculateVideoMetadata = async ({ props }) => {
  // Fetch data to determine duration
  const data = await fetch(\`/api/items/\${props.itemId}\`).then(r => r.json());

  return {
    durationInFrames: data.items.length * 30, // 30 frames per item
    props: {
      ...props,
      items: data.items,
    },
  };
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="DynamicDuration"
      component={ItemsVideo}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300} // Default, will be overridden
      calculateMetadata={calculateVideoMetadata}
      defaultProps={{ itemId: '123' }}
    />
  );
};`,
  },

  {
    id: 15,
    name: 'Handle Fonts with Google Fonts or loadFont',
    category: 'assets',
    description: 'Load custom fonts using @remotion/google-fonts or the loadFont utility. Ensure fonts are loaded before rendering.',
    enforcement: 'recommended',
    codeExample: `import { loadFont } from '@remotion/google-fonts/Roboto';
import { delayRender, continueRender } from 'remotion';
import { useState, useEffect } from 'react';

const { fontFamily } = loadFont();

const TextComponent: React.FC = () => {
  return (
    <div style={{ fontFamily }}>
      This text uses Roboto font
    </div>
  );
};

// Alternative: Manual font loading
const ManualFontLoad: React.FC = () => {
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    const font = new FontFace('CustomFont', 'url(/fonts/custom.woff2)');
    font.load().then(() => {
      document.fonts.add(font);
      continueRender(handle);
    });
  }, [handle]);

  return <div style={{ fontFamily: 'CustomFont' }}>Custom Font</div>;
};`,
  },

  // ============================================
  // MEDIA HANDLING RULES (16-20)
  // ============================================
  {
    id: 16,
    name: 'Use OffthreadVideo for Performance',
    category: 'performance',
    description: 'Use <OffthreadVideo> instead of <Video> for better rendering performance. It processes video frames off the main thread.',
    enforcement: 'recommended',
    codeExample: `import { OffthreadVideo, staticFile } from 'remotion';

const VideoBackground: React.FC = () => {
  return (
    <OffthreadVideo
      src={staticFile('background.mp4')}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
};`,
  },

  {
    id: 17,
    name: 'Control Audio with Volume and startFrom',
    category: 'audio',
    description: 'Use volume (can be a function of frame) and startFrom/endAt props to precisely control audio playback.',
    enforcement: 'recommended',
    codeExample: `import { Audio, interpolate, useCurrentFrame, staticFile } from 'remotion';

const AudioTrack: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over first 30 frames, fade out over last 30 frames
  const volume = interpolate(
    frame,
    [0, 30, 120, 150],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <Audio
      src={staticFile('music.mp3')}
      volume={volume}
      startFrom={60}  // Start from 2 seconds into the audio
      endAt={180}     // End at 6 seconds into the audio
    />
  );
};`,
  },

  {
    id: 18,
    name: 'Use Img Component for Images',
    category: 'assets',
    description: 'Use the <Img> component from Remotion instead of native <img>. It handles loading states properly for rendering.',
    enforcement: 'required',
    codeExample: `import { Img, staticFile, delayRender, continueRender } from 'remotion';
import { useState } from 'react';

const ImageComponent: React.FC = () => {
  // Img automatically handles delayRender
  return (
    <Img
      src={staticFile('hero.png')}
      style={{ width: '100%' }}
      onError={(e) => console.error('Image failed to load')}
    />
  );
};

// For remote images
const RemoteImage: React.FC<{ url: string }> = ({ url }) => {
  return (
    <Img
      src={url}
      style={{ maxWidth: '100%' }}
    />
  );
};`,
  },

  {
    id: 19,
    name: 'Use getAudioDurationInSeconds for Audio Sync',
    category: 'audio',
    description: 'Use getAudioDurationInSeconds() to get audio file duration for synchronizing video length with audio.',
    enforcement: 'recommended',
    codeExample: `import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { Composition } from 'remotion';

export const Root: React.FC = () => {
  return (
    <Composition
      id="MusicVideo"
      component={MusicVideo}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={150}
      calculateMetadata={async () => {
        const duration = await getAudioDurationInSeconds(
          staticFile('audio/song.mp3')
        );
        return {
          durationInFrames: Math.ceil(duration * 30),
        };
      }}
    />
  );
};`,
  },

  {
    id: 20,
    name: 'Handle Video Seeking with playbackRate',
    category: 'performance',
    description: 'Use playbackRate to control video speed. For slow-motion or time-lapse effects, combine with frame manipulation.',
    enforcement: 'optional',
    codeExample: `import { Video, useCurrentFrame, staticFile } from 'remotion';

const SlowMotionVideo: React.FC = () => {
  return (
    <Video
      src={staticFile('action.mp4')}
      playbackRate={0.5}  // Half speed
      style={{ width: '100%' }}
    />
  );
};

const TimeLapseVideo: React.FC = () => {
  return (
    <Video
      src={staticFile('timelapse.mp4')}
      playbackRate={4}  // 4x speed
      style={{ width: '100%' }}
    />
  );
};`,
  },

  // ============================================
  // RENDERING & PERFORMANCE RULES (21-25)
  // ============================================
  {
    id: 21,
    name: 'Configure Render Settings Properly',
    category: 'rendering',
    description: 'Set appropriate codec, quality, and pixel format for your output requirements. Different use cases need different settings.',
    enforcement: 'required',
    codeExample: `// remotion.config.ts
import { Config } from '@remotion/cli/config';

// High quality for final export
Config.setCodec('h264');
Config.setImageFormat('jpeg');
Config.setQuality(90);
Config.setPixelFormat('yuv420p');

// Command line rendering
// npx remotion render src/index.ts MyComposition out.mp4 \\
//   --codec=h264 \\
//   --crf=18 \\
//   --pixel-format=yuv420p

// For transparency (ProRes or VP9)
// Config.setCodec('prores');
// Config.setProResProfile('4444');`,
  },

  {
    id: 22,
    name: 'Use Memoization for Complex Calculations',
    category: 'performance',
    description: 'Use useMemo and useCallback to memoize expensive calculations. Remember that components render for every frame.',
    enforcement: 'recommended',
    codeExample: `import { useMemo, useCallback } from 'react';
import { useCurrentFrame } from 'remotion';

const ComplexAnimation: React.FC<{ points: number }> = ({ points }) => {
  const frame = useCurrentFrame();

  // Memoize expensive path calculation
  const pathData = useMemo(() => {
    const path: string[] = [];
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const x = Math.cos(angle) * 100;
      const y = Math.sin(angle) * 100;
      path.push(\`\${i === 0 ? 'M' : 'L'} \${x} \${y}\`);
    }
    return path.join(' ') + ' Z';
  }, [points]); // Only recalculate when points change

  // Frame-based rotation is fine - it changes every frame anyway
  const rotation = frame * 2;

  return (
    <svg viewBox="-150 -150 300 300">
      <path
        d={pathData}
        fill="none"
        stroke="white"
        transform={\`rotate(\${rotation})\`}
      />
    </svg>
  );
};`,
  },

  {
    id: 23,
    name: 'Avoid Side Effects in Render',
    category: 'performance',
    description: 'Components render multiple times during seeking and rendering. Avoid side effects like API calls in the render path.',
    enforcement: 'required',
    codeExample: `import { useEffect, useState, useRef } from 'react';
import { delayRender, continueRender } from 'remotion';

const SafeComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());
  const hasFetched = useRef(false);

  useEffect(() => {
    // Ensure fetch only happens once
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch('/api/data')
      .then(r => r.json())
      .then(d => {
        setData(d);
        continueRender(handle);
      });
  }, [handle]);

  return data ? <div>{data.title}</div> : null;
};`,
    antiPattern: `// ❌ WRONG: Side effect on every render
const BadComponent: React.FC = () => {
  // This runs on EVERY frame render!
  fetch('/api/track-view', { method: 'POST' });

  return <div>Content</div>;
};`
  },

  {
    id: 24,
    name: 'Use cancelRender for Error Handling',
    category: 'rendering',
    description: 'Use cancelRender() to abort rendering with an error message when unrecoverable errors occur.',
    enforcement: 'recommended',
    codeExample: `import { cancelRender, delayRender, continueRender } from 'remotion';
import { useState, useEffect } from 'react';

const CriticalDataVideo: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch(apiUrl)
      .then(r => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
        return r.json();
      })
      .then(d => {
        if (!d.requiredField) {
          cancelRender('Missing required data field');
          return;
        }
        setData(d);
        continueRender(handle);
      })
      .catch(err => {
        cancelRender(\`Failed to load data: \${err.message}\`);
      });
  }, [apiUrl, handle]);

  if (!data) return null;
  return <div>{data.requiredField}</div>;
};`,
  },

  {
    id: 25,
    name: 'Use Still for Thumbnail Generation',
    category: 'composition',
    description: 'Register <Still> compositions for generating thumbnails or single-frame exports alongside videos.',
    enforcement: 'optional',
    codeExample: `import { Composition, Still } from 'remotion';

export const Root: React.FC = () => {
  return (
    <>
      {/* Video composition */}
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Thumbnail still */}
      <Still
        id="MyVideoThumbnail"
        component={Thumbnail}
        width={1920}
        height={1080}
      />

      {/* Social media preview */}
      <Still
        id="SocialPreview"
        component={SocialCard}
        width={1200}
        height={630}
      />
    </>
  );
};

// Render with: npx remotion still MyVideoThumbnail thumbnail.png`,
  },

  // ============================================
  // ADVANCED PATTERNS (26-27)
  // ============================================
  {
    id: 26,
    name: 'Use Easing Functions for Custom Curves',
    category: 'animation',
    description: 'Import and use easing functions from remotion for custom animation curves beyond linear interpolation.',
    enforcement: 'recommended',
    codeExample: `import { useCurrentFrame, interpolate, Easing } from 'remotion';

const EasedAnimations: React.FC = () => {
  const frame = useCurrentFrame();

  // Ease out cubic - starts fast, slows down
  const slideIn = interpolate(frame, [0, 30], [100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  // Ease in out quad - smooth start and end
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: 'clamp',
  });

  // Bounce effect
  const bounce = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.bounce,
    extrapolateRight: 'clamp',
  });

  // Elastic effect
  const elastic = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.elastic(2),
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ transform: \`translateX(\${slideIn}px)\`, opacity: fadeIn }}>
      Eased Animation
    </div>
  );
};`,
  },

  {
    id: 27,
    name: 'Validate Props with Zod Schema',
    category: 'composition',
    description: 'Use Zod schemas to validate composition props. This catches errors early and provides type safety.',
    enforcement: 'recommended',
    codeExample: `import { z } from 'zod';
import { Composition } from 'remotion';

// Define prop schema
const VideoPropsSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  items: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.number(),
  })).min(1).max(10),
  showWatermark: z.boolean().default(true),
});

type VideoProps = z.infer<typeof VideoPropsSchema>;

const DataVideo: React.FC<VideoProps> = ({
  title,
  subtitle,
  backgroundColor,
  items,
  showWatermark,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {items.map(item => (
        <div key={item.id}>{item.label}: {item.value}</div>
      ))}
      {showWatermark && <Watermark />}
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="DataVideo"
      component={DataVideo}
      schema={VideoPropsSchema}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: 'My Video',
        backgroundColor: '#1a1a2e',
        items: [{ id: '1', label: 'Item', value: 100 }],
        showWatermark: true,
      }}
    />
  );
};`,
  },
];

// Export categorized rules for quick access
export const RULES_BY_CATEGORY = REMOTION_RULES.reduce((acc, rule) => {
  if (!acc[rule.category]) {
    acc[rule.category] = [];
  }
  acc[rule.category].push(rule);
  return acc;
}, {} as Record<string, RemotionRule[]>);

export const REQUIRED_RULES = REMOTION_RULES.filter(r => r.enforcement === 'required');
export const RECOMMENDED_RULES = REMOTION_RULES.filter(r => r.enforcement === 'recommended');
export const OPTIONAL_RULES = REMOTION_RULES.filter(r => r.enforcement === 'optional');

// Rule lookup helper
export function getRule(id: number): RemotionRule | undefined {
  return REMOTION_RULES.find(r => r.id === id);
}

// Format rules for prompt injection
export function formatRulesForPrompt(filter?: {
  categories?: string[];
  enforcement?: ('required' | 'recommended' | 'optional')[];
}): string {
  let rules = REMOTION_RULES;

  if (filter?.categories) {
    rules = rules.filter(r => filter.categories!.includes(r.category));
  }

  if (filter?.enforcement) {
    rules = rules.filter(r => filter.enforcement!.includes(r.enforcement));
  }

  return rules.map(rule => `
## Rule ${rule.id}: ${rule.name}
**Category:** ${rule.category} | **Enforcement:** ${rule.enforcement}

${rule.description}

\`\`\`typescript
${rule.codeExample}
\`\`\`
${rule.antiPattern ? `\n### Anti-Pattern (Avoid)\n\`\`\`typescript\n${rule.antiPattern}\n\`\`\`` : ''}
`).join('\n---\n');
}
```

---

## Implementation Examples

### Example 1: Text Animation Skill

```typescript
// /src/skills/remotion/text-animation.ts
import { RemotionSkillDefinition } from '../../types/remotion';
import { z } from 'zod';

export const textAnimationSkill: RemotionSkillDefinition = {
  id: 'remotion-text-animation',
  name: 'Animated Text Reveal',
  description: 'Creates smooth text reveal animations with customizable timing and effects',
  category: 'animation',
  rules: [1, 2, 3, 4, 6, 26], // Rule IDs this skill uses
  defaultConfig: {
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 90,
  },
  propsSchema: z.object({
    text: z.string().min(1).max(200),
    fontFamily: z.string().default('Arial'),
    fontSize: z.number().min(12).max(500).default(72),
    color: z.string().default('#ffffff'),
    animation: z.enum(['fade', 'slide', 'typewriter', 'bounce']).default('fade'),
  }),
};

// Component implementation
export const TextRevealComponent = `
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

interface Props {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  animation?: 'fade' | 'slide' | 'typewriter' | 'bounce';
}

export const TextReveal: React.FC<Props> = ({
  text,
  fontFamily = 'Arial',
  fontSize = 72,
  color = '#ffffff',
  animation = 'fade',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const getAnimationStyle = () => {
    switch (animation) {
      case 'fade':
        return {
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        };

      case 'slide':
        return {
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
          transform: \`translateY(\${interpolate(frame, [0, 30], [50, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateRight: 'clamp',
          })}px)\`,
        };

      case 'typewriter':
        const charsToShow = Math.floor(interpolate(frame, [0, 60], [0, text.length], {
          extrapolateRight: 'clamp',
        }));
        return {
          clipPath: \`inset(0 \${100 - (charsToShow / text.length) * 100}% 0 0)\`,
        };

      case 'bounce':
        const scale = spring({
          frame,
          fps,
          config: { damping: 8, stiffness: 200 },
        });
        return {
          transform: \`scale(\${scale})\`,
        };

      default:
        return {};
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          color,
          fontWeight: 'bold',
          ...getAnimationStyle(),
        }}
      >
        {text}
      </div>
    </div>
  );
};
`;
```

### Example 2: Data-Driven Chart Skill

```typescript
// /src/skills/remotion/chart-animation.ts
import { RemotionSkillDefinition } from '../../types/remotion';
import { z } from 'zod';

export const chartAnimationSkill: RemotionSkillDefinition = {
  id: 'remotion-chart-animation',
  name: 'Animated Bar Chart',
  description: 'Creates animated bar charts from data with smooth transitions',
  category: 'data-driven',
  rules: [1, 2, 3, 4, 11, 13, 22, 27],
  defaultConfig: {
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
  },
  propsSchema: z.object({
    title: z.string(),
    data: z.array(z.object({
      label: z.string(),
      value: z.number(),
      color: z.string().optional(),
    })),
    backgroundColor: z.string().default('#1a1a2e'),
    barColor: z.string().default('#4361ee'),
    showValues: z.boolean().default(true),
  }),
};
```

### Example 3: Workflow Visualization Skill

```typescript
// Integration with existing Workspace Flow platform
// /src/skills/remotion/workflow-visualizer.ts

import { RemotionSkillDefinition } from '../../types/remotion';
import { Workflow } from '../../types/database';
import { z } from 'zod';

export const workflowVisualizerSkill: RemotionSkillDefinition = {
  id: 'remotion-workflow-visualizer',
  name: 'Workflow Animation',
  description: 'Converts workflow definitions into animated video explanations',
  category: 'template',
  rules: [1, 2, 3, 6, 7, 8, 9, 15, 22],
  defaultConfig: {
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300,
  },
  propsSchema: z.object({
    workflow: z.object({
      name: z.string(),
      description: z.string().nullable(),
      trigger_event: z.string().nullable(),
      action_chain: z.string().nullable(),
      tools: z.array(z.string()),
      department: z.string(),
    }),
    theme: z.enum(['light', 'dark', 'brand']).default('dark'),
    showTools: z.boolean().default(true),
    animationStyle: z.enum(['minimal', 'detailed', 'playful']).default('detailed'),
  }),
};

// Converter function
export function workflowToRemotionProps(workflow: Workflow) {
  const metadata = workflow.description
    ? JSON.parse(workflow.description)
    : { steps: [] };

  return {
    workflow: {
      name: workflow.name,
      description: metadata.desc || null,
      trigger_event: workflow.trigger_event,
      action_chain: workflow.action_chain,
      tools: workflow.tools || [],
      department: workflow.department,
    },
    theme: 'dark' as const,
    showTools: true,
    animationStyle: 'detailed' as const,
  };
}
```

---

## Quick Reference

### Rule Categories Summary

| Category | Rules | Focus Area |
|----------|-------|------------|
| hooks | 1, 2 | Core Remotion hooks (useCurrentFrame, useVideoConfig) |
| animation | 3, 4, 26 | Interpolation, springs, easing functions |
| composition | 5, 7, 14, 25 | Compositions, AbsoluteFill, metadata, stills |
| timing | 6, 8, 9, 10 | Sequences, timing props, Series, Loop |
| async | 11, 13 | delayRender, getInputProps |
| assets | 12, 15, 18 | staticFile, fonts, Img component |
| audio | 17, 19 | Audio control, duration utilities |
| performance | 16, 20, 22, 23 | OffthreadVideo, memoization, side effects |
| rendering | 21, 24 | Render settings, error handling |

### Enforcement Levels

- **Required (10 rules):** 1, 2, 3, 5, 6, 8, 11, 12, 18, 21, 23
- **Recommended (13 rules):** 4, 7, 9, 13, 14, 15, 16, 17, 19, 22, 24, 26, 27
- **Optional (4 rules):** 10, 20, 25

### File Structure

```
/src
  /types
    remotion.ts           # Type definitions
  /lib
    remotion-rules.ts     # All 27 rules
    remotion-skills.ts    # Skill registry
    remotion-validator.ts # Rule validation
    remotion-generator.ts # AI generation
  /skills/remotion
    text-animation.ts     # Example skill
    chart-animation.ts    # Example skill
    workflow-visualizer.ts # Platform integration
  /components
    RemotionStudio.tsx    # UI component
```

---

## Conclusion

This integration guide provides a complete framework for adding Remotion video generation capabilities as agent skills within Claude. The structured rule system ensures consistent, high-quality video compositions while the skill manifesto pattern enables extensible AI-driven generation.

Key benefits:
- **Type Safety:** Full TypeScript support with Zod validation
- **Rule Enforcement:** Automated compliance checking for all 27 rules
- **AI Integration:** Structured prompts for deterministic outputs
- **Platform Integration:** Seamless connection to existing workflow system
- **Extensibility:** Easy to add new skills following established patterns
