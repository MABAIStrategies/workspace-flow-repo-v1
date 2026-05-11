/**
 * Remotion Rules Data Structure
 * @description Complete 27 Remotion rules for agent skills integration
 * @version 1.0.0
 */

import { RemotionRule, RuleCategory, RuleEnforcement } from '../types/remotion';

/**
 * Complete Remotion Rules Collection
 * All 27 rules organized by category with enforcement levels
 */
export const REMOTION_RULES: RemotionRule[] = [
  // ============================================
  // HOOKS RULES (1-2)
  // ============================================
  {
    id: 1,
    name: 'Use useCurrentFrame for Animation State',
    category: 'hooks',
    description:
      'Always use the useCurrentFrame() hook to get the current frame number. This is the foundation of all Remotion animations and ensures frame-perfect synchronization. Never use useState or useEffect for animation timing.',
    enforcement: 'required',
    codeExample: `import { useCurrentFrame } from 'remotion';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  // Use frame for all animation calculations
  const opacity = Math.min(1, frame / 30);
  const rotation = frame * 2;

  return (
    <div style={{
      opacity,
      transform: \`rotate(\${rotation}deg)\`
    }}>
      Frame: {frame}
    </div>
  );
};`,
    antiPattern: `// ❌ WRONG: Using useState for animation
const [opacity, setOpacity] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setOpacity(prev => Math.min(1, prev + 0.1));
  }, 100);
  return () => clearInterval(interval);
}, []);`,
    tags: ['hooks', 'animation', 'core', 'frame'],
    relatedRules: [2, 3],
  },

  {
    id: 2,
    name: 'Use useVideoConfig for Dimensions',
    category: 'hooks',
    description:
      'Always use useVideoConfig() to access video dimensions (width, height), fps, and durationInFrames. Never hardcode these values as they may change based on composition settings or when rendering at different resolutions.',
    enforcement: 'required',
    codeExample: `import { useVideoConfig } from 'remotion';

const MyComponent: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();

  // Use relative positioning based on dimensions
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate time-based values using fps
  const totalSeconds = durationInFrames / fps;

  return (
    <div style={{
      position: 'absolute',
      left: centerX - 100,
      top: centerY - 50,
      width: 200,
      height: 100,
    }}>
      Video: {width}x{height} @ {fps}fps ({totalSeconds}s)
    </div>
  );
};`,
    antiPattern: `// ❌ WRONG: Hardcoded dimensions
const width = 1920;  // Don't hardcode!
const height = 1080; // Don't hardcode!
const fps = 30;      // Don't hardcode!`,
    tags: ['hooks', 'dimensions', 'configuration', 'core'],
    relatedRules: [1, 8],
  },

  // ============================================
  // ANIMATION RULES (3-4, 26)
  // ============================================
  {
    id: 3,
    name: 'Use interpolate for Smooth Animations',
    category: 'animation',
    description:
      'Use the interpolate() function to map frame numbers to animated values. This provides smooth, predictable animations with configurable input/output ranges and easing. Always specify extrapolation behavior to prevent unexpected values.',
    enforcement: 'required',
    codeExample: `import { useCurrentFrame, interpolate } from 'remotion';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  // Basic interpolation with clamping
  const opacity = interpolate(
    frame,
    [0, 30],           // input range (frames)
    [0, 1],            // output range (values)
    { extrapolateRight: 'clamp' }
  );

  // Multi-keyframe animation
  const scale = interpolate(
    frame,
    [0, 15, 30, 45],   // keyframes
    [0.5, 1.2, 1, 1],  // scale values (overshoot effect)
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Position animation
  const translateX = interpolate(frame, [0, 60], [-100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      opacity,
      transform: \`scale(\${scale}) translateX(\${translateX}px)\`
    }}>
      Animated Content
    </div>
  );
};`,
    antiPattern: `// ❌ WRONG: Manual linear calculation without bounds
const opacity = frame / 30; // Can exceed 1, no easing possible
const position = frame * 2; // No bounds, can go negative or huge`,
    tags: ['animation', 'interpolation', 'core', 'easing'],
    relatedRules: [1, 4, 26],
  },

  {
    id: 4,
    name: 'Use spring for Physics-Based Animation',
    category: 'animation',
    description:
      'Use the spring() function for natural, physics-based animations. Springs automatically handle easing and can create realistic overshooting effects. Configure damping, stiffness, and mass for different animation feels.',
    enforcement: 'recommended',
    codeExample: `import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Basic spring animation
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,      // Higher = less bouncy
      stiffness: 100,   // Higher = faster
      mass: 0.5,        // Higher = more inertia
    },
  });

  // Delayed spring (starts at frame 20)
  const slideIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // Bouncy spring
  const bounce = spring({
    frame,
    fps,
    config: { damping: 4, stiffness: 150, mass: 0.3 },
  });

  return (
    <div style={{
      transform: \`scale(\${scale}) translateX(\${(1 - slideIn) * -200}px)\`
    }}>
      <div style={{ transform: \`translateY(\${(1 - bounce) * 50}px)\` }}>
        Spring Animation
      </div>
    </div>
  );
};`,
    tags: ['animation', 'spring', 'physics', 'easing'],
    relatedRules: [1, 3, 26],
  },

  // ============================================
  // COMPOSITION RULES (5, 7, 14, 25)
  // ============================================
  {
    id: 5,
    name: 'Register Compositions in Root',
    category: 'composition',
    description:
      'All compositions must be registered in the Root component using the <Composition> component. This defines the entry points for rendering and the Player component. Each composition needs a unique ID.',
    enforcement: 'required',
    codeExample: `import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';
import { Intro } from './Intro';
import { Outro } from './Outro';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main video composition */}
      <Composition
        id="MainVideo"
        component={MyVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Welcome',
          backgroundColor: '#000000',
        }}
      />

      {/* Shorter intro composition */}
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Different aspect ratio */}
      <Composition
        id="VerticalVideo"
        component={MyVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};`,
    tags: ['composition', 'setup', 'root', 'core'],
    relatedRules: [14, 25, 27],
  },

  {
    id: 7,
    name: 'Use AbsoluteFill for Layering',
    category: 'composition',
    description:
      'Use <AbsoluteFill> to create full-size layers that stack on top of each other. This is essential for compositing multiple visual elements like backgrounds, content, and overlays.',
    enforcement: 'recommended',
    codeExample: `import { AbsoluteFill } from 'remotion';

const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background layer */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <BackgroundGradient />
      </AbsoluteFill>

      {/* Main content layer */}
      <AbsoluteFill style={{ zIndex: 1 }}>
        <MainContent />
      </AbsoluteFill>

      {/* Particle effects layer */}
      <AbsoluteFill style={{ zIndex: 2, pointerEvents: 'none' }}>
        <ParticleOverlay />
      </AbsoluteFill>

      {/* UI overlay layer */}
      <AbsoluteFill style={{
        zIndex: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 40,
      }}>
        <CallToAction />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};`,
    tags: ['composition', 'layout', 'layers', 'positioning'],
    relatedRules: [6, 8],
  },

  // ============================================
  // TIMING RULES (6, 8, 9, 10)
  // ============================================
  {
    id: 6,
    name: 'Use Sequence for Timeline Composition',
    category: 'timing',
    description:
      'Use <Sequence> components to compose multiple elements on a timeline. Each Sequence resets the frame counter to 0 for its children, making it easy to create reusable animated components.',
    enforcement: 'required',
    codeExample: `import { Sequence, useCurrentFrame } from 'remotion';

const Scene: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame(); // Starts at 0 within this Sequence
  return <div>Scene {label} - Local Frame: {frame}</div>;
};

const MyVideo: React.FC = () => {
  return (
    <div>
      {/* Intro: frames 0-29 */}
      <Sequence from={0} durationInFrames={30}>
        <Scene label="Intro" />
      </Sequence>

      {/* Main content: frames 30-89 */}
      <Sequence from={30} durationInFrames={60}>
        <Scene label="Main" />
      </Sequence>

      {/* Overlapping sequence for transitions */}
      <Sequence from={80} durationInFrames={40}>
        <Scene label="Transition" />
      </Sequence>

      {/* Outro: frames 90-119 */}
      <Sequence from={90} durationInFrames={30}>
        <Scene label="Outro" />
      </Sequence>
    </div>
  );
};`,
    tags: ['timing', 'sequence', 'timeline', 'core'],
    relatedRules: [7, 8, 9, 10],
  },

  {
    id: 8,
    name: 'Handle Frame Timing with from and durationInFrames',
    category: 'timing',
    description:
      'Always specify explicit timing using from (start frame) and durationInFrames props on Sequences. Use fps from useVideoConfig to convert between seconds and frames for clarity.',
    enforcement: 'required',
    codeExample: `import { Sequence, useVideoConfig } from 'remotion';

const MyVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Helper for seconds to frames conversion
  const sec = (s: number) => Math.round(s * fps);

  // Define timeline in seconds for clarity
  const timeline = {
    intro: { start: 0, duration: sec(2) },           // 0-2s
    reveal: { start: sec(1.5), duration: sec(1) },   // 1.5-2.5s (overlaps)
    main: { start: sec(2), duration: sec(5) },       // 2-7s
    outro: { start: sec(6.5), duration: sec(1.5) },  // 6.5-8s (overlaps)
  };

  return (
    <>
      <Sequence
        from={timeline.intro.start}
        durationInFrames={timeline.intro.duration}
        name="Intro"  // Named sequences show in Remotion Studio
      >
        <IntroScene />
      </Sequence>

      <Sequence
        from={timeline.reveal.start}
        durationInFrames={timeline.reveal.duration}
        name="Reveal"
      >
        <RevealAnimation />
      </Sequence>

      <Sequence
        from={timeline.main.start}
        durationInFrames={timeline.main.duration}
        name="Main Content"
      >
        <MainContent />
      </Sequence>

      <Sequence
        from={timeline.outro.start}
        durationInFrames={timeline.outro.duration}
        name="Outro"
      >
        <OutroScene />
      </Sequence>
    </>
  );
};`,
    tags: ['timing', 'frames', 'sequence', 'configuration'],
    relatedRules: [2, 6, 9],
  },

  {
    id: 9,
    name: 'Use Series for Sequential Animations',
    category: 'timing',
    description:
      'Use <Series> when you need sequential, non-overlapping sequences. Series automatically calculates start frames based on previous durations, reducing manual timing calculations.',
    enforcement: 'recommended',
    codeExample: `import { Series } from 'remotion';

const MyVideo: React.FC = () => {
  return (
    <Series>
      {/* Each sequence starts immediately after the previous one ends */}
      <Series.Sequence durationInFrames={30}>
        <TitleCard text="Chapter 1" />
      </Series.Sequence>

      <Series.Sequence durationInFrames={90}>
        <Chapter1Content />
      </Series.Sequence>

      <Series.Sequence durationInFrames={30}>
        <TitleCard text="Chapter 2" />
      </Series.Sequence>

      <Series.Sequence durationInFrames={120}>
        <Chapter2Content />
      </Series.Sequence>

      <Series.Sequence durationInFrames={45}>
        <Credits />
      </Series.Sequence>
    </Series>
  );
};

// With offsets for gaps or overlaps
const WithOffsets: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={30}>
        <Scene1 />
      </Series.Sequence>

      {/* 10 frame gap before next scene */}
      <Series.Sequence durationInFrames={60} offset={10}>
        <Scene2 />
      </Series.Sequence>

      {/* Overlap with previous scene by 5 frames */}
      <Series.Sequence durationInFrames={30} offset={-5}>
        <Scene3 />
      </Series.Sequence>
    </Series>
  );
};`,
    tags: ['timing', 'series', 'sequence', 'automation'],
    relatedRules: [6, 8, 10],
  },

  {
    id: 10,
    name: 'Use Loop for Repeating Animations',
    category: 'timing',
    description:
      'Use <Loop> to repeat a sequence of frames multiple times. Useful for looping backgrounds, loading indicators, breathing animations, or any cyclic motion.',
    enforcement: 'optional',
    codeExample: `import { Loop, useCurrentFrame, interpolate } from 'remotion';

// A pulsing animation that loops
const PulsingDot: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 15, 30], [1, 1.3, 1]);
  const opacity = interpolate(frame, [0, 15, 30], [0.5, 1, 0.5]);

  return (
    <div style={{
      width: 50,
      height: 50,
      borderRadius: '50%',
      backgroundColor: '#4361ee',
      transform: \`scale(\${scale})\`,
      opacity,
    }} />
  );
};

const MyVideo: React.FC = () => {
  return (
    <>
      {/* Loop 4 times, each iteration is 30 frames */}
      <Loop durationInFrames={30} times={4}>
        <PulsingDot />
      </Loop>

      {/* Infinite loop (for the duration of the composition) */}
      <Loop durationInFrames={60}>
        <RotatingLogo />
      </Loop>

      {/* Background loop behind other content */}
      <AbsoluteFill style={{ zIndex: -1 }}>
        <Loop durationInFrames={120}>
          <AnimatedGradient />
        </Loop>
      </AbsoluteFill>
    </>
  );
};`,
    tags: ['timing', 'loop', 'repeat', 'cycle'],
    relatedRules: [6, 9],
  },

  // ============================================
  // ASYNC RULES (11, 13)
  // ============================================
  {
    id: 11,
    name: 'Use delayRender for Async Operations',
    category: 'async',
    description:
      'When fetching data or loading assets asynchronously, use delayRender() to pause rendering until ready. Call continueRender() when done. Always handle errors to prevent hanging renders.',
    enforcement: 'required',
    codeExample: `import { useEffect, useState } from 'react';
import { delayRender, continueRender } from 'remotion';

interface ApiData {
  title: string;
  items: string[];
}

const DataDrivenVideo: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [data, setData] = useState<ApiData | null>(null);
  const [handle] = useState(() => delayRender('Loading API data'));

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);

        const json = await response.json();

        if (isMounted) {
          setData(json);
          continueRender(handle);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
        // IMPORTANT: Always call continueRender, even on error
        // Otherwise the render will hang forever
        if (isMounted) {
          continueRender(handle);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiUrl, handle]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <ul>
        {data.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};`,
    antiPattern: `// ❌ WRONG: Async without delayRender
const BadComponent: React.FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // This is WRONG - render might complete before data arrives
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);

  return <div>{data?.title}</div>; // Might be null during render!
};`,
    tags: ['async', 'data', 'fetch', 'loading', 'core'],
    relatedRules: [13, 14, 24],
  },

  {
    id: 13,
    name: 'Use getInputProps for Dynamic Data',
    category: 'async',
    description:
      'Use getInputProps() to receive data passed during rendering via CLI or API. This allows generating videos dynamically based on external data without hardcoding.',
    enforcement: 'recommended',
    codeExample: `import { getInputProps, Composition } from 'remotion';

// Define your props interface
interface VideoProps {
  title: string;
  subtitle?: string;
  items: Array<{ id: string; label: string; value: number }>;
  theme: 'light' | 'dark';
  logoUrl?: string;
}

// Component using input props
const DynamicVideo: React.FC<VideoProps> = (props) => {
  // Props come from defaultProps or getInputProps
  const { title, subtitle, items, theme, logoUrl } = props;

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    }}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {logoUrl && <img src={logoUrl} alt="Logo" />}
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.label}: {item.value}</li>
        ))}
      </ul>
    </div>
  );
};

// In Root.tsx - with type-safe default props
export const Root: React.FC = () => {
  return (
    <Composition
      id="DynamicVideo"
      component={DynamicVideo}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={150}
      defaultProps={{
        title: 'Default Title',
        items: [{ id: '1', label: 'Example', value: 100 }],
        theme: 'dark',
      }}
    />
  );
};

// Render with custom props:
// npx remotion render DynamicVideo --props='{"title":"Custom","theme":"light"}'`,
    tags: ['async', 'props', 'dynamic', 'cli'],
    relatedRules: [11, 14, 27],
  },

  // ============================================
  // COMPOSITION METADATA (14)
  // ============================================
  {
    id: 14,
    name: 'Calculate Metadata with calculateMetadata',
    category: 'composition',
    description:
      'Use calculateMetadata to dynamically compute composition properties like duration based on input props. This allows video length to adapt to content automatically.',
    enforcement: 'recommended',
    codeExample: `import { Composition } from 'remotion';

interface SlideShowProps {
  slides: Array<{ imageUrl: string; title: string; duration?: number }>;
  transitionDuration: number;
}

const calculateSlideShowMetadata = async ({
  props
}: {
  props: SlideShowProps
}) => {
  // Calculate total duration based on slides
  const totalFrames = props.slides.reduce((acc, slide) => {
    const slideDuration = slide.duration || 3; // Default 3 seconds
    return acc + (slideDuration * 30); // Assuming 30fps
  }, 0);

  // Add transition frames
  const transitionFrames = (props.slides.length - 1) * props.transitionDuration;

  return {
    durationInFrames: totalFrames + transitionFrames,
    props: {
      ...props,
      // Can also modify/enrich props
      totalSlides: props.slides.length,
    },
  };
};

// Async data fetching in calculateMetadata
const calculateWithFetch = async ({ props }: { props: { playlistId: string } }) => {
  const response = await fetch(\`/api/playlist/\${props.playlistId}\`);
  const playlist = await response.json();

  return {
    durationInFrames: playlist.tracks.length * 150, // 5 sec per track
    props: {
      ...props,
      tracks: playlist.tracks,
      totalDuration: playlist.totalDuration,
    },
  };
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="SlideShow"
        component={SlideShow}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300} // Default, will be overridden
        calculateMetadata={calculateSlideShowMetadata}
        defaultProps={{
          slides: [{ imageUrl: '/default.jpg', title: 'Default' }],
          transitionDuration: 15,
        }}
      />
    </>
  );
};`,
    tags: ['composition', 'metadata', 'dynamic', 'duration'],
    relatedRules: [5, 11, 13],
  },

  // ============================================
  // ASSETS RULES (12, 15, 18)
  // ============================================
  {
    id: 12,
    name: 'Preload Assets with staticFile',
    category: 'assets',
    description:
      'Use staticFile() to reference assets in the public folder. This ensures proper path resolution during both development and rendering, and works correctly in all environments.',
    enforcement: 'required',
    codeExample: `import { staticFile, Img, Audio, Video } from 'remotion';

const AssetDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Images from public folder */}
      <Img
        src={staticFile('images/logo.png')}
        style={{ width: 200 }}
      />

      {/* Background music */}
      <Audio
        src={staticFile('audio/background-music.mp3')}
        volume={0.5}
      />

      {/* Video overlay */}
      <Video
        src={staticFile('videos/intro-clip.mp4')}
        style={{ width: '100%' }}
      />

      {/* JSON data file */}
      {/* For data files, fetch with staticFile path */}
    </AbsoluteFill>
  );
};

// Folder structure:
// public/
//   images/
//     logo.png
//   audio/
//     background-music.mp3
//   videos/
//     intro-clip.mp4`,
    antiPattern: `// ❌ WRONG: Relative or absolute paths without staticFile
<Img src="/images/logo.png" />           // Won't work in all contexts
<Img src="./images/logo.png" />          // Relative paths break
<Img src="public/images/logo.png" />     // Don't include 'public'`,
    tags: ['assets', 'files', 'images', 'static', 'core'],
    relatedRules: [15, 18],
  },

  {
    id: 15,
    name: 'Handle Fonts with Google Fonts or loadFont',
    category: 'assets',
    description:
      'Load custom fonts using @remotion/google-fonts or manual font loading with delayRender. Ensure fonts are fully loaded before rendering to avoid missing text.',
    enforcement: 'recommended',
    codeExample: `// Option 1: Google Fonts (recommended)
import { loadFont } from '@remotion/google-fonts/Roboto';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: roboto } = loadFont();
const { fontFamily: inter } = loadInter();

const GoogleFontsDemo: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontFamily: roboto }}>Roboto Heading</h1>
      <p style={{ fontFamily: inter }}>Inter paragraph text</p>
    </div>
  );
};

// Option 2: Manual font loading for custom fonts
import { useState, useEffect } from 'react';
import { delayRender, continueRender, staticFile } from 'remotion';

const CustomFontDemo: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading custom font'));
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const font = new FontFace(
      'MyCustomFont',
      \`url(\${staticFile('fonts/MyCustomFont.woff2')}) format('woff2')\`
    );

    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
        continueRender(handle);
      })
      .catch((error) => {
        console.error('Font loading failed:', error);
        continueRender(handle);
      });
  }, [handle]);

  return (
    <div style={{
      fontFamily: fontLoaded ? 'MyCustomFont, sans-serif' : 'sans-serif'
    }}>
      Custom Font Text
    </div>
  );
};`,
    tags: ['assets', 'fonts', 'typography', 'loading'],
    relatedRules: [11, 12],
  },

  {
    id: 18,
    name: 'Use Img Component for Images',
    category: 'assets',
    description:
      'Use the <Img> component from Remotion instead of native <img>. It automatically handles delayRender for image loading, ensuring images are ready before rendering.',
    enforcement: 'required',
    codeExample: `import { Img, staticFile } from 'remotion';

const ImageDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Local image from public folder */}
      <Img
        src={staticFile('images/hero.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Remote image */}
      <Img
        src="https://example.com/image.jpg"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 200,
          height: 200,
          borderRadius: 10,
        }}
        onError={(e) => {
          console.error('Image failed to load:', e);
        }}
      />

      {/* With placeholder dimensions for layout */}
      <Img
        src={staticFile('images/product.png')}
        width={400}
        height={300}
        style={{
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};`,
    antiPattern: `// ❌ WRONG: Using native img tag
<img src="/images/hero.png" />  // No automatic loading handling
<img src={staticFile('images/hero.png')} />  // Still wrong - use Img`,
    tags: ['assets', 'images', 'media', 'core'],
    relatedRules: [12, 16],
  },

  // ============================================
  // AUDIO RULES (17, 19)
  // ============================================
  {
    id: 17,
    name: 'Control Audio with Volume and startFrom',
    category: 'audio',
    description:
      'Use volume (can be a frame-based function), startFrom, and endAt props to precisely control audio playback. Volume can be animated using the current frame for fade effects.',
    enforcement: 'recommended',
    codeExample: `import { Audio, useCurrentFrame, interpolate, staticFile, Sequence } from 'remotion';

const AudioDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Animated volume: fade in, sustain, fade out
  const musicVolume = interpolate(
    frame,
    [0, 30, 120, 150],  // frames
    [0, 0.7, 0.7, 0],   // volume (0-1)
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      {/* Background music with fade */}
      <Audio
        src={staticFile('audio/background.mp3')}
        volume={musicVolume}
      />

      {/* Sound effect starting at specific point in audio file */}
      <Sequence from={30} durationInFrames={60}>
        <Audio
          src={staticFile('audio/whoosh.mp3')}
          volume={0.8}
          startFrom={15}  // Skip first 15 frames of audio
          endAt={45}      // Stop at frame 45 of the audio
        />
      </Sequence>

      {/* Looping ambient sound */}
      <Audio
        src={staticFile('audio/ambient.mp3')}
        volume={0.3}
        loop
      />

      {/* Volume as callback function */}
      <Audio
        src={staticFile('audio/narration.mp3')}
        volume={(f) => {
          // Custom volume curve based on frame
          if (f < 10) return f / 10;
          if (f > 140) return (150 - f) / 10;
          return 1;
        }}
      />
    </>
  );
};`,
    tags: ['audio', 'volume', 'timing', 'media'],
    relatedRules: [6, 19],
  },

  {
    id: 19,
    name: 'Use getAudioDurationInSeconds for Audio Sync',
    category: 'audio',
    description:
      'Use getAudioDurationInSeconds() from @remotion/media-utils to get audio file duration. This enables synchronizing video length with audio automatically.',
    enforcement: 'recommended',
    codeExample: `import { Composition, staticFile } from 'remotion';
import { getAudioDurationInSeconds } from '@remotion/media-utils';

// Calculate composition duration from audio
const calculateMusicVideoMetadata = async () => {
  const audioDuration = await getAudioDurationInSeconds(
    staticFile('audio/song.mp3')
  );

  const fps = 30;
  const durationInFrames = Math.ceil(audioDuration * fps);

  // Add 2 seconds of padding at end
  const paddedDuration = durationInFrames + (2 * fps);

  return {
    durationInFrames: paddedDuration,
    props: {
      audioDuration,
    },
  };
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="MusicVideo"
      component={MusicVideo}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300} // Default, will be overridden
      calculateMetadata={calculateMusicVideoMetadata}
    />
  );
};

// Also useful: getAudioData for waveform visualization
import { getAudioData } from '@remotion/media-utils';

const getWaveformData = async () => {
  const audioData = await getAudioData(staticFile('audio/song.mp3'));
  // audioData.channelWaveforms contains amplitude data
  return audioData;
};`,
    tags: ['audio', 'duration', 'sync', 'media-utils'],
    relatedRules: [14, 17],
  },

  // ============================================
  // PERFORMANCE RULES (16, 20, 22, 23)
  // ============================================
  {
    id: 16,
    name: 'Use OffthreadVideo for Performance',
    category: 'performance',
    description:
      'Use <OffthreadVideo> instead of <Video> for better rendering performance. It processes video frames off the main thread, reducing render time significantly for video-heavy compositions.',
    enforcement: 'recommended',
    codeExample: `import { OffthreadVideo, staticFile, useCurrentFrame, interpolate } from 'remotion';

const VideoBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Animate video opacity
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <OffthreadVideo
      src={staticFile('videos/background.mp4')}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
      }}
      // Optional: mute the video
      muted
      // Optional: set playback rate
      playbackRate={1}
      // Optional: start from specific time
      startFrom={0}
    />
  );
};

// Multiple videos benefit most from OffthreadVideo
const MultiVideoComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile('videos/main.mp4')}
        style={{ position: 'absolute', inset: 0 }}
      />
      <OffthreadVideo
        src={staticFile('videos/overlay.webm')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 300,
        }}
      />
    </AbsoluteFill>
  );
};`,
    tags: ['performance', 'video', 'rendering', 'optimization'],
    relatedRules: [18, 20],
  },

  {
    id: 20,
    name: 'Handle Video Seeking with playbackRate',
    category: 'performance',
    description:
      'Use playbackRate to control video speed for slow-motion or time-lapse effects. Combine with frame calculations for precise timing control.',
    enforcement: 'optional',
    codeExample: `import { Video, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';

// Slow motion video (half speed)
const SlowMotion: React.FC = () => {
  return (
    <OffthreadVideo
      src={staticFile('videos/action.mp4')}
      playbackRate={0.5}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

// Time lapse (4x speed)
const TimeLapse: React.FC = () => {
  return (
    <OffthreadVideo
      src={staticFile('videos/sunset.mp4')}
      playbackRate={4}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

// Dynamic playback rate based on frame
const DynamicSpeed: React.FC = () => {
  const frame = useCurrentFrame();

  // Start slow, speed up, then slow down
  let playbackRate = 1;
  if (frame < 30) {
    playbackRate = 0.25; // Very slow at start
  } else if (frame < 60) {
    playbackRate = 1; // Normal speed
  } else if (frame < 90) {
    playbackRate = 2; // Fast
  } else {
    playbackRate = 0.5; // Slow down at end
  }

  return (
    <OffthreadVideo
      src={staticFile('videos/sports.mp4')}
      playbackRate={playbackRate}
      style={{ width: '100%' }}
    />
  );
};

// Reverse video effect (negative not supported, use frame seeking)
// For reverse, you'd need to prepare a reversed video file`,
    tags: ['performance', 'video', 'speed', 'playback'],
    relatedRules: [16],
  },

  {
    id: 22,
    name: 'Use Memoization for Complex Calculations',
    category: 'performance',
    description:
      'Use useMemo and useCallback to memoize expensive calculations. Remember that components render for every frame, so unmemoized calculations run 30-60+ times per second.',
    enforcement: 'recommended',
    codeExample: `import { useMemo, useCallback } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  dataPoints: number[];
  color: string;
}

const ChartAnimation: React.FC<Props> = ({ dataPoints, color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ✅ Memoize expensive path calculation - only recalculates when dataPoints change
  const pathData = useMemo(() => {
    const points: string[] = [];
    const xStep = width / (dataPoints.length - 1);
    const maxValue = Math.max(...dataPoints);

    dataPoints.forEach((value, index) => {
      const x = index * xStep;
      const y = height - (value / maxValue) * height * 0.8;
      points.push(\`\${index === 0 ? 'M' : 'L'} \${x} \${y}\`);
    });

    return points.join(' ');
  }, [dataPoints, width, height]);

  // ✅ Memoize callback
  const formatValue = useCallback((value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }, []);

  // Frame-based calculations are fine - they SHOULD run every frame
  const progress = Math.min(1, frame / 60);
  const visibleLength = progress * 100;

  return (
    <svg width={width} height={height}>
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={100}
        strokeDashoffset={100 - visibleLength}
      />
    </svg>
  );
};`,
    antiPattern: `// ❌ WRONG: Expensive calculation on every frame
const BadChart: React.FC<{ dataPoints: number[] }> = ({ dataPoints }) => {
  const frame = useCurrentFrame();

  // This runs 30-60 times per second!
  const pathData = dataPoints.map((v, i) => {
    // Complex calculation here
    return \`\${i === 0 ? 'M' : 'L'} \${i * 10} \${v}\`;
  }).join(' ');

  return <path d={pathData} />;
};`,
    tags: ['performance', 'memoization', 'optimization', 'react'],
    relatedRules: [1, 23],
  },

  {
    id: 23,
    name: 'Avoid Side Effects in Render',
    category: 'performance',
    description:
      'Components render multiple times during seeking and rendering. Avoid side effects like API calls, analytics, or mutations in the render path. Use refs to track if effects have already run.',
    enforcement: 'required',
    codeExample: `import { useEffect, useRef, useState } from 'react';
import { delayRender, continueRender } from 'remotion';

// ✅ CORRECT: Side effects properly isolated
const SafeComponent: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());
  const hasFetched = useRef(false);

  useEffect(() => {
    // Guard against multiple fetches
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch(apiUrl)
      .then(r => r.json())
      .then(d => {
        setData(d);
        continueRender(handle);
      })
      .catch(() => {
        continueRender(handle);
      });
  }, [apiUrl, handle]);

  return data ? <DataDisplay data={data} /> : null;
};

// ✅ CORRECT: Analytics only in development/preview
const AnalyticsSafeComponent: React.FC = () => {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once and only in browser (not during render)
    if (hasTracked.current) return;
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'production') return; // Skip during render

    hasTracked.current = true;
    // analytics.track('video_viewed');
  }, []);

  return <div>Content</div>;
};`,
    antiPattern: `// ❌ WRONG: Side effect runs on EVERY frame render
const DangerousComponent: React.FC = () => {
  // This runs 30-60+ times per second during render!
  fetch('/api/track', { method: 'POST' }); // DON'T DO THIS
  console.log('Rendered'); // Spams console
  localStorage.setItem('count', Date.now().toString()); // Constant writes

  return <div>Content</div>;
};`,
    tags: ['performance', 'side-effects', 'safety', 'core'],
    relatedRules: [11, 22],
  },

  // ============================================
  // RENDERING RULES (21, 24)
  // ============================================
  {
    id: 21,
    name: 'Configure Render Settings Properly',
    category: 'rendering',
    description:
      'Set appropriate codec, quality, CRF, and pixel format for your output requirements. Different platforms and use cases need different settings.',
    enforcement: 'required',
    codeExample: `// remotion.config.ts
import { Config } from '@remotion/cli/config';

// High quality for final delivery
Config.setCodec('h264');
Config.setImageFormat('jpeg');
Config.setPixelFormat('yuv420p');
Config.setCrf(18); // Lower = higher quality (18-23 is good range)

// For transparency (use ProRes or VP9 with alpha)
// Config.setCodec('prores');
// Config.setProResProfile('4444'); // Supports alpha

// CLI rendering examples:
//
// Standard MP4:
// npx remotion render MyComposition out.mp4 --codec=h264 --crf=20
//
// High quality:
// npx remotion render MyComposition out.mp4 --codec=h264 --crf=15 --pixel-format=yuv420p
//
// WebM for web:
// npx remotion render MyComposition out.webm --codec=vp9 --crf=30
//
// GIF:
// npx remotion render MyComposition out.gif --codec=gif
//
// PNG sequence:
// npx remotion render MyComposition frames/ --image-format=png --sequence
//
// With audio:
// npx remotion render MyComposition out.mp4 --codec=h264 --audio-codec=aac --audio-bitrate=320k

// Programmatic rendering
import { renderMedia } from '@remotion/renderer';

await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: 'out.mp4',
  crf: 18,
  pixelFormat: 'yuv420p',
  audioCodec: 'aac',
  audioBitrate: '320k',
});`,
    tags: ['rendering', 'codec', 'quality', 'output', 'core'],
    relatedRules: [24, 25],
  },

  {
    id: 24,
    name: 'Use cancelRender for Error Handling',
    category: 'rendering',
    description:
      'Use cancelRender() to abort rendering with an error message when unrecoverable errors occur. This provides clear feedback instead of a hanging or broken render.',
    enforcement: 'recommended',
    codeExample: `import { cancelRender, delayRender, continueRender } from 'remotion';
import { useState, useEffect } from 'react';

interface RequiredData {
  title: string;
  videoUrl: string;
  duration: number;
}

const CriticalDataVideo: React.FC<{ dataId: string }> = ({ dataId }) => {
  const [data, setData] = useState<RequiredData | null>(null);
  const [handle] = useState(() => delayRender('Fetching critical data'));

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(\`/api/data/\${dataId}\`);

        if (!response.ok) {
          // Cancel render with descriptive error
          cancelRender(\`API returned \${response.status}: \${response.statusText}\`);
          return;
        }

        const json = await response.json();

        // Validate required fields
        if (!json.title) {
          cancelRender('Missing required field: title');
          return;
        }

        if (!json.videoUrl) {
          cancelRender('Missing required field: videoUrl');
          return;
        }

        if (json.duration <= 0) {
          cancelRender(\`Invalid duration: \${json.duration}\`);
          return;
        }

        setData(json);
        continueRender(handle);

      } catch (error) {
        // Network error or JSON parse error
        cancelRender(\`Failed to load data: \${error.message}\`);
      }
    }

    loadData();
  }, [dataId, handle]);

  if (!data) return null;

  return (
    <div>
      <h1>{data.title}</h1>
      <video src={data.videoUrl} />
    </div>
  );
};`,
    tags: ['rendering', 'errors', 'validation', 'safety'],
    relatedRules: [11, 21],
  },

  // ============================================
  // STILLS (25)
  // ============================================
  {
    id: 25,
    name: 'Use Still for Thumbnail Generation',
    category: 'composition',
    description:
      'Register <Still> compositions for generating thumbnails or single-frame exports. Stills are useful for social media previews, poster frames, and static assets.',
    enforcement: 'optional',
    codeExample: `import { Composition, Still } from 'remotion';

export const Root: React.FC = () => {
  return (
    <>
      {/* Main video composition */}
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Thumbnail for the video */}
      <Still
        id="VideoThumbnail"
        component={Thumbnail}
        width={1920}
        height={1080}
      />

      {/* YouTube thumbnail (different aspect ratio) */}
      <Still
        id="YouTubeThumbnail"
        component={YouTubeThumbnail}
        width={1280}
        height={720}
      />

      {/* Social media preview card */}
      <Still
        id="SocialPreview"
        component={SocialCard}
        width={1200}
        height={630}
      />

      {/* Instagram square format */}
      <Still
        id="InstagramThumbnail"
        component={InstagramThumbnail}
        width={1080}
        height={1080}
      />
    </>
  );
};

// Render stills via CLI:
// npx remotion still VideoThumbnail thumbnail.png
// npx remotion still SocialPreview --props='{"title":"My Video"}' social.png
// npx remotion still YouTubeThumbnail --scale=0.5 yt-thumb-small.png`,
    tags: ['composition', 'thumbnail', 'still', 'export'],
    relatedRules: [5, 21],
  },

  // ============================================
  // ADVANCED ANIMATION (26)
  // ============================================
  {
    id: 26,
    name: 'Use Easing Functions for Custom Curves',
    category: 'animation',
    description:
      'Import and use easing functions from remotion for custom animation curves. Easing makes animations feel more natural than linear interpolation.',
    enforcement: 'recommended',
    codeExample: `import { useCurrentFrame, interpolate, Easing } from 'remotion';

const EasingDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Ease out - starts fast, slows down (good for entrances)
  const slideIn = interpolate(frame, [0, 30], [200, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  // Ease in - starts slow, speeds up (good for exits)
  const slideOut = interpolate(frame, [60, 90], [0, -200], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
  });

  // Ease in-out - smooth start and end (good for continuous motion)
  const moveAcross = interpolate(frame, [0, 60], [0, 500], {
    easing: Easing.inOut(Easing.quad),
  });

  // Bounce - bounces at the end
  const bounceIn = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.bounce,
    extrapolateRight: 'clamp',
  });

  // Elastic - overshoots and oscillates
  const elastic = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.elastic(2), // 2 = number of oscillations
    extrapolateRight: 'clamp',
  });

  // Back - overshoots then settles
  const backEase = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.out(Easing.back(1.7)), // 1.7 = overshoot amount
    extrapolateRight: 'clamp',
  });

  // Bezier - custom curve
  const customBezier = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // CSS ease equivalent
  });

  return (
    <div>
      <div style={{ transform: \`translateX(\${slideIn}px)\` }}>Slide In</div>
      <div style={{ transform: \`translateX(\${slideOut}px)\` }}>Slide Out</div>
      <div style={{ transform: \`translateX(\${moveAcross}px)\` }}>Move</div>
      <div style={{ transform: \`scale(\${bounceIn})\` }}>Bounce</div>
      <div style={{ transform: \`scale(\${elastic})\` }}>Elastic</div>
      <div style={{ transform: \`scale(\${backEase})\` }}>Back</div>
    </div>
  );
};`,
    tags: ['animation', 'easing', 'curves', 'motion'],
    relatedRules: [3, 4],
  },

  // ============================================
  // PROPS VALIDATION (27)
  // ============================================
  {
    id: 27,
    name: 'Validate Props with Zod Schema',
    category: 'composition',
    description:
      'Use Zod schemas to validate composition props. This catches errors early, provides type safety, and enables Remotion Studio to generate input forms.',
    enforcement: 'recommended',
    codeExample: `import { z } from 'zod';
import { Composition } from 'remotion';

// Define comprehensive prop schema
const VideoPropsSchema = z.object({
  // Required string with constraints
  title: z.string().min(1).max(100),

  // Optional string
  subtitle: z.string().optional(),

  // Enum for limited choices
  theme: z.enum(['light', 'dark', 'brand']).default('dark'),

  // Color with regex validation
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#4361ee'),

  // Number with range
  fontSize: z.number().min(12).max(200).default(48),

  // Boolean with default
  showLogo: z.boolean().default(true),

  // Array of objects
  items: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.number().min(0),
    color: z.string().optional(),
  })).min(1).max(20),

  // Nested object
  animation: z.object({
    duration: z.number().min(0.1).max(5).default(1),
    easing: z.enum(['linear', 'ease', 'spring']).default('ease'),
    stagger: z.number().min(0).max(1).default(0.1),
  }).default({}),

  // URL validation
  logoUrl: z.string().url().optional(),

  // Date string
  date: z.string().datetime().optional(),
});

// Infer TypeScript type from schema
type VideoProps = z.infer<typeof VideoPropsSchema>;

// Component with typed props
const DataVideo: React.FC<VideoProps> = ({
  title,
  subtitle,
  theme,
  accentColor,
  fontSize,
  showLogo,
  items,
  animation,
  logoUrl,
}) => {
  const isDark = theme === 'dark' || theme === 'brand';

  return (
    <AbsoluteFill style={{
      backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
    }}>
      <h1 style={{ fontSize, color: accentColor }}>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {showLogo && logoUrl && <img src={logoUrl} alt="Logo" />}
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ color: item.color || accentColor }}>
            {item.label}: {item.value}
          </li>
        ))}
      </ul>
    </AbsoluteFill>
  );
};

// Register with schema for validation and Studio UI
export const Root: React.FC = () => {
  return (
    <Composition
      id="DataVideo"
      component={DataVideo}
      schema={VideoPropsSchema}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={150}
      defaultProps={{
        title: 'My Video',
        theme: 'dark',
        accentColor: '#4361ee',
        fontSize: 48,
        showLogo: true,
        items: [
          { id: '1', label: 'Revenue', value: 50000 },
          { id: '2', label: 'Users', value: 1200 },
        ],
        animation: {
          duration: 1,
          easing: 'ease',
          stagger: 0.1,
        },
      }}
    />
  );
};`,
    tags: ['composition', 'validation', 'props', 'zod', 'types'],
    relatedRules: [5, 13, 14],
  },
];

// ============================================
// HELPER EXPORTS
// ============================================

/**
 * Rules organized by category
 */
export const RULES_BY_CATEGORY = REMOTION_RULES.reduce(
  (acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  },
  {} as Record<RuleCategory, RemotionRule[]>
);

/**
 * Required rules that must be followed
 */
export const REQUIRED_RULES = REMOTION_RULES.filter(
  (r) => r.enforcement === 'required'
);

/**
 * Recommended rules for best practices
 */
export const RECOMMENDED_RULES = REMOTION_RULES.filter(
  (r) => r.enforcement === 'recommended'
);

/**
 * Optional rules for specific use cases
 */
export const OPTIONAL_RULES = REMOTION_RULES.filter(
  (r) => r.enforcement === 'optional'
);

/**
 * Get a rule by ID
 */
export function getRule(id: number): RemotionRule | undefined {
  return REMOTION_RULES.find((r) => r.id === id);
}

/**
 * Get rules by IDs
 */
export function getRules(ids: number[]): RemotionRule[] {
  return ids.map((id) => getRule(id)).filter(Boolean) as RemotionRule[];
}

/**
 * Get rules by category
 */
export function getRulesByCategory(category: RuleCategory): RemotionRule[] {
  return RULES_BY_CATEGORY[category] || [];
}

/**
 * Get rules by enforcement level
 */
export function getRulesByEnforcement(
  enforcement: RuleEnforcement
): RemotionRule[] {
  return REMOTION_RULES.filter((r) => r.enforcement === enforcement);
}

/**
 * Search rules by text
 */
export function searchRules(query: string): RemotionRule[] {
  const lowerQuery = query.toLowerCase();
  return REMOTION_RULES.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Format rules for AI prompt injection
 */
export function formatRulesForPrompt(options?: {
  categories?: RuleCategory[];
  enforcement?: RuleEnforcement[];
  ids?: number[];
  maxRules?: number;
}): string {
  let rules = [...REMOTION_RULES];

  if (options?.ids) {
    rules = rules.filter((r) => options.ids!.includes(r.id));
  }

  if (options?.categories) {
    rules = rules.filter((r) => options.categories!.includes(r.category));
  }

  if (options?.enforcement) {
    rules = rules.filter((r) => options.enforcement!.includes(r.enforcement));
  }

  if (options?.maxRules) {
    rules = rules.slice(0, options.maxRules);
  }

  return rules
    .map(
      (rule) => `
## Rule ${rule.id}: ${rule.name}
**Category:** ${rule.category} | **Enforcement:** ${rule.enforcement}

${rule.description}

\`\`\`typescript
${rule.codeExample}
\`\`\`
${rule.antiPattern ? `\n### Anti-Pattern (Avoid)\n\`\`\`typescript\n${rule.antiPattern}\n\`\`\`` : ''}
`
    )
    .join('\n---\n');
}

/**
 * Get rule summary for quick reference
 */
export function getRuleSummary(): string {
  const categories = Object.keys(RULES_BY_CATEGORY) as RuleCategory[];

  return categories
    .map((cat) => {
      const catRules = RULES_BY_CATEGORY[cat];
      const ruleList = catRules
        .map((r) => `  ${r.id}. ${r.name} [${r.enforcement}]`)
        .join('\n');
      return `### ${cat.toUpperCase()}\n${ruleList}`;
    })
    .join('\n\n');
}
