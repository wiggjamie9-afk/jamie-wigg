# Freebuff2API Video

A 60-second promotional video for Freebuff2API built with HyperFrames and powered by AI script generation.

## Overview

```
freebuff2api-video/
├── index.html           # GSAP + CSS animation composition
├── script.txt           # Video narration (60s)
├── hyperframes.json     # Video metadata (1920x1080 @ 30fps)
├── generate-script.js   # Script generator (uses Freebuff2API)
├── package.json         # Project metadata
└── README.md            # This file
```

## Setup

### Prerequisites

- Node.js 16+
- Freebuff2API running at `http://localhost:8080`
- ffmpeg (for rendering MP4)

### Installation

```bash
npm install
# or if using yarn
yarn install
```

## Usage

### 1. Generate Script (Optional)

Auto-generate a new script using Freebuff2API:

```bash
npm run generate-script
# or with custom brief
node generate-script.js "Your custom video brief here"
```

This uses Freebuff2API to generate a 60-second script based on your input.

### 2. Preview in Browser

```bash
npm run dev
```

Opens the composition in your browser at http://localhost:3000/

### 3. Validate Composition

```bash
npm run check
```

Validates the HTML and metadata.

### 4. Render to MP4

```bash
npm run render
```

Renders the video to `freebuff2api-video.mp4`

**Requirements:**
- ffmpeg must be installed
- HyperFrames CLI
- Enough disk space for video output

### 5. Publish (Optional)

```bash
npm run publish
```

Publishes to the HyperFrames registry.

## Video Timeline

| Time | Scene | Content |
|---|---|---|
| 0-5s | Hook | Logo & brand intro |
| 5-20s | Problem | Pain points of expensive AI |
| 20-45s | Solution | Key features & benefits |
| 45-60s | CTA | Call to action |

## Customization

### Edit Script

Modify `script.txt` to change the narration:

```
[HOOK] Your opening line here
[PROBLEM] Problem description
[SOLUTION] How it's solved
[CTA] Call to action
```

Special markers:
- `[PAUSE]` - Dramatic pause
- `[EMPHASIS]` - Highlight important words

### Edit Visuals

Modify `index.html` to change:
- Colors (gradients in `.scene-*` classes)
- Text content (in scene divs)
- Icons (emoji or SVG)
- Animations (GSAP timeline)
- Timing (scene durations)

### Edit Timeline

The GSAP timeline in `index.html` controls the video flow:

```javascript
timeline
  .to('.scene-hook', { opacity: 1 }, 0)     // Start at 0s
  .to('.scene-hook', { opacity: 0 }, 5)     // Fade out at 5s
  .to('.scene-problem', { opacity: 1 }, 5)  // Start problem at 5s
  // ... etc
```

Each scene duration should match the narration timing.

## Rendering Tips

### Quality Settings

For high-quality output, HyperFrames uses:
- Resolution: 1920×1080
- Frame rate: 30 FPS
- Duration: 60 seconds
- Codec: H.264 (MP4)

### Faster Rendering

For testing, render at lower resolution:

```bash
npx hyperframes@0.4.42 render --scale 0.5
```

### Output Formats

HyperFrames supports:
- MP4 (default)
- WebM
- GIF

## Workflow

### One-Shot Workflow

```bash
# 1. Generate script from Freebuff2API
npm run generate-script "Your brief"

# 2. Preview
npm run dev

# 3. Render
npm run render

# 4. Output: freebuff2api-video.mp4 ✓
```

### Batch Production

```bash
# Generate 3 videos with different briefs
node generate-script.js "Brief 1" && npm run render
node generate-script.js "Brief 2" && npm run render
node generate-script.js "Brief 3" && npm run render
```

## Freebuff2API Integration

This project uses Freebuff2API's `/v1/chat/completions` endpoint to generate scripts:

```javascript
// From generate-script.js
const response = await fetch('http://localhost:8080/v1/chat/completions', {
  method: 'POST',
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  })
});
```

**Requirements:**
- Freebuff2API running
- Valid AUTH_TOKENS in config.json
- Network access to localhost:8080

## Troubleshooting

### "Cannot connect to API"

```bash
# Check if Freebuff2API is running
curl http://localhost:8080/health

# If not, start it
cd ../freebuff2api
make dev
```

### "ffmpeg not found"

```bash
# Install ffmpeg
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
choco install ffmpeg
```

### Video renders too slowly

- Render at lower resolution: `--scale 0.5`
- Reduce frame rate: `--fps 24`
- Close other applications

## Examples

### 3-Scene Version

Replace timeline with:
```javascript
timeline
  .to('.scene-hook', { opacity: 1 }, 0)
  .to('.scene-hook', { opacity: 0 }, 20)
  .to('.scene-solution', { opacity: 1 }, 20)
  .to('.scene-solution', { opacity: 0 }, 40)
  .to('.scene-cta', { opacity: 1 }, 40)
```

### Social Media Variants

Create variants by changing aspect ratio in `hyperframes.json`:

```json
{
  "width": 1080,
  "height": 1920    // Portrait for TikTok/Reels
}
```

## Performance

- **Browser preview:** Real-time (GSAP)
- **MP4 rendering:** ~2-5 minutes for 60s video (depends on system)
- **File size:** ~5-10MB for 1920×1080 @ 30fps

## License

Same as parent project.
