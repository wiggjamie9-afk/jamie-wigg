---
name: remotion-videos
version: 1.0.0
description: |
  Create videos programmatically using React and Remotion. Use web technologies
  (CSS, Canvas, SVG, WebGL), leverage programming (variables, functions, APIs,
  math), and React composition for scalable video generation.
compatibility: claude-code opencode cursor
license: Remotion Special License (requires company license in some cases)
---

# Remotion — Programmatic Video Creation with React

Create videos using code: React components, CSS, Canvas, SVG, WebGL, algorithms.

## Why Remotion?

### Leverage Web Technologies
- CSS for styling and animations
- Canvas for pixel-perfect graphics
- SVG for scalable vector graphics
- WebGL for 3D and advanced effects
- HTML5 video and audio

### Leverage Programming
- Variables and functions for reusable logic
- APIs for dynamic data (fetch from databases, APIs)
- Math and algorithms for generative effects
- Loops for repeating patterns
- Conditionals for branching logic

### Leverage React
- Reusable components (Button, Text, Spinner, etc)
- Props for parameterization
- Composition for complex scenes
- State management
- Package ecosystem (all of npm)

## Quick Start

```bash
npx create-video@latest

# Or in existing project:
npm install remotion
```

## Basic Structure

```jsx
// video.tsx
import { Composition } from "remotion";
import { MyScene } from "./MyScene";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyScene}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

// MyScene.tsx
import { useFrame } from "remotion";
import React, { useState } from "react";

export const MyScene: React.FC<{
  frame: number;
}> = ({ frame }) => {
  return (
    <div
      style={{
        flex: 1,
        background: "white",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
        transform: `translateX(${frame * 2}px)`,
      }}
    >
      Frame: {frame}
    </div>
  );
};
```

## Key Concepts

### Composition
Container for a video with duration, resolution, and frame rate.

```jsx
<Composition
  id="MyVideo"
  component={VideoComponent}
  durationInFrames={300}   // 10 seconds at 30fps
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: "My Video"
  }}
/>
```

### Frame-Based Animation
Access current frame number to drive animations.

```jsx
const { frame } = props;

// Linear animation over 30 frames
const progress = frame / 30;

// Easing functions
import { spring } from "remotion";
const scale = spring({ fps: 30, frame, config: { damping: 10 } });
```

### useFrame Hook
Run side effects at each frame.

```jsx
const [opacity, setOpacity] = useState(1);

useFrame(({ frame }) => {
  setOpacity(Math.sin(frame / 30) * 0.5 + 0.5);
});
```

### Video Components

**Text**
```jsx
import { AbsoluteFill, Text } from "remotion";

<AbsoluteFill>
  <Text style={{ fontSize: 48, color: "white" }}>
    Hello World
  </Text>
</AbsoluteFill>
```

**Image**
```jsx
import { Img } from "remotion";

<Img src="image.jpg" width={1920} height={1080} />
```

**Audio**
```jsx
import { Audio } from "remotion";

<Audio src="audio.mp3" startFrom={0} />
```

**Video**
```jsx
import { Video } from "remotion";

<Video src="video.mp4" startFrom={0} />
```

## Animation Patterns

### Easing & Timing
```jsx
import { spring, interpolate, Easing } from "remotion";

// Spring animation
const scale = spring({ fps: 30, frame, config: { damping: 10 } });

// Linear interpolation
const opacity = interpolate(frame, [0, 30], [0, 1]);

// Easing functions
const y = interpolate(frame, [0, 30], [0, 100], {
  easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
});
```

### Sequences
```jsx
import { Sequence } from "remotion";

<Sequence from={0} durationInFrames={30}>
  <Scene1 />
</Sequence>

<Sequence from={30} durationInFrames={30}>
  <Scene2 />
</Sequence>
```

### Conditional Rendering
```jsx
const { frame } = props;

if (frame < 60) {
  return <Intro />;
} else if (frame < 120) {
  return <MainContent />;
} else {
  return <Outro />;
}
```

## Use Cases

### Personalized Videos
Generate unique videos for each user:
- GitHub Unwrapped (year in review)
- Birthday videos
- Achievement certificates
- Personalized testimonials

### Programmatic Content
Generate videos from data:
- Stock market animations
- Weather forecasts
- Analytics dashboards (motion graphics)
- Live data visualization

### Dynamic Templates
Reusable video templates with props:
```jsx
<Composition
  id="YearReview"
  component={YearReviewVideo}
  defaultProps={{
    username: "john",
    reposCreated: 42,
    pullRequests: 128,
    followers: 500,
  }}
/>
```

### Generative Art
Create algorithmic video art:
- Fractals
- Noise-based animations
- Particle systems
- Mathematical visualizations

## Rendering

### Development
```bash
npm start
# Opens Remotion Studio at localhost:3000
```

### Export
```bash
# H.264 video
npx remotion render MyVideo output.mp4

# With options
npx remotion render MyVideo output.mp4 \
  --width 1920 \
  --height 1080 \
  --crf 18 \
  --codec h264
```

### Concurrency
```bash
# Render on multiple cores (faster)
npx remotion render MyVideo output.mp4 --concurrency 4
```

## Integration with Claude Ecosystem

### With HyperFrames
- HyperFrames: HTML/CSS/GSAP compositions (lighter, faster)
- Remotion: React-based, more programmatic

**Choose HyperFrames when:**
- Simple animations, quick render times needed
- CSS/GSAP animations sufficient
- Small team, quick iteration

**Choose Remotion when:**
- Complex logic, data-driven content
- Reusable components needed
- Full React ecosystem required

### With Marketing Automation
```jsx
// Generate personalized promo videos
<Composition
  id="PromoVideo"
  component={PromoTemplate}
  defaultProps={{
    productName: "STARLIGHTMIX",
    cta: "Try Now",
    discount: "30%",
  }}
/>
```

### With Stock Platform
```jsx
// Animate stock data over time
const { stockData } = props;
<Chart data={stockData} frame={frame} />
```

### With Analytics Dashboard
```jsx
// Render metrics as motion graphics
<MetricAnimation value={growth} frame={frame} />
```

## Performance Tips

1. **Memoize components** — Prevent re-renders
   ```jsx
   const MyComponent = React.memo(({ data }) => (...))
   ```

2. **Use Workers** — Offload heavy computation
   ```jsx
   import { useRenderData } from "remotion";
   const data = useRenderData();
   ```

3. **Lazy load media** — Don't load all images at once
   ```jsx
   {frame > 100 && <Img src="heavy-image.jpg" />}
   ```

4. **Optimize images** — Compress before use

5. **Use Canvas for heavy graphics** — More efficient than DOM

## Examples

### Counting Numbers
```jsx
export const Countdown = ({ frame }) => (
  <div style={{ fontSize: 100 }}>
    {Math.ceil(150 - frame)}
  </div>
);
```

### Animated Text
```jsx
export const AnimatedText = ({ frame }) => {
  const scale = spring({ fps: 30, frame, config: { damping: 5 } });
  
  return (
    <div style={{ transform: `scale(${scale})` }}>
      Welcome to Remotion
    </div>
  );
};
```

### Data Visualization
```jsx
export const StockChart = ({ frame, stockHistory }) => {
  const visibleData = stockHistory.slice(0, frame);
  
  return (
    <svg width={1920} height={1080}>
      {visibleData.map((point, i) => (
        <circle
          cx={i * 4}
          cy={1080 - point.price}
          r={3}
          fill="blue"
        />
      ))}
    </svg>
  );
};
```

## Resources

- **Documentation:** https://remotion.dev/docs
- **API Reference:** https://remotion.dev/api
- **Showcase:** https://remotion.dev/showcase
- **Discord:** https://discord.gg/6VzzNDwUwV

## License

Remotion uses a special license requiring company licensing in some cases. Check https://remotion.dev/license before using commercially.

## Integration Examples

### Generate YouTube Thumbnails
```jsx
<Composition
  id="Thumbnail"
  component={ThumbnailTemplate}
  durationInFrames={1}  // Single frame
  fps={1}
  width={1280}
  height={720}
  defaultProps={{ title, subtitle, imageUrl }}
/>
```

### Create Animated Promos
```jsx
<Composition
  id="ProductPromo"
  component={PromoSequence}
  durationInFrames={300}  // 10 seconds
  fps={30}
  width={1920}
  height={1080}
/>
```

### Batch Generate Personalized Videos
```jsx
// Loop through user data, render each video
users.forEach((user) => {
  npx remotion render MyVideo output-${user.id}.mp4 \
    --props '{"username":"${user.name}"}'
});
```
