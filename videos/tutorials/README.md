# AI Tutorial Video Generator

Generate engaging tutorial videos for educational apps using HyperFrames + Higgsfield DOP.

## Overview

This directory contains HyperFrames compositions for three AI-powered educational apps:
- **MathTutor Pro** — AI-powered math tutoring with step-by-step guidance
- **BookReader Pro** — Audiobook reading with intelligent word highlighting
- **LanguageLens** — Language mastery with AI pronunciation coaching

Each tutorial is designed as a 1920×1080 landscape video optimized for:
- YouTube, LinkedIn, and other long-form platforms
- Mobile web previews
- Marketing landing pages

## Project Structure

```
tutorials/
├── index.html                      # Master gallery page
├── tutorial-builder.mjs            # Script to generate compositions
├── generate-tutorials.mjs          # Advanced: Higgsfield DOP generator
│
├── mathtutor-pro/                  # MathTutor Pro tutorial
│   ├── index.html                  # HyperFrames composition
│   ├── package.json                # Build config
│   ├── hyperframes.json            # Video metadata
│   ├── meta.json                   # Version info
│   └── mathtutor-pro.mp4           # Rendered output (after render)
│
├── bookreader-pro/                 # BookReader Pro tutorial
│   ├── index.html
│   ├── package.json
│   ├── hyperframes.json
│   ├── meta.json
│   └── bookreader-pro.mp4
│
└── languagelens/                   # LanguageLens tutorial
    ├── index.html
    ├── package.json
    ├── hyperframes.json
    ├── meta.json
    └── languagelens.mp4
```

## Quick Start

### 1. Preview a Composition

```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 preview
```

Opens in browser at http://localhost:8080

### 2. Render to MP4

```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 render
```

Generates `mathtutor-pro.mp4` in the folder (requires FFmpeg)

### 3. Validate Composition

```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 lint
```

Checks for common issues.

### 4. Publish to Registry (Optional)

```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 publish
```

Requires HyperFrames registry auth.

## Integration with Higgsfield DOP

For advanced workflows, use `generate-tutorials.mjs` to:
1. Generate AI avatar images from text prompts
2. Animate avatars with Higgsfield DOP (image-to-video)
3. Composite videos with text overlays
4. Export MP4 and WebM formats

**Prerequisites:**
- `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET` in `.env`
- FFmpeg installed for compositing
- Node.js 18+

**Usage:**
```bash
node generate-tutorials.mjs
```

This will:
- Generate 3 AI avatar images using Soul text-to-image
- Animate each avatar using DOP motion prompts
- Add text overlays and convert to WebM
- Create an HTML gallery page

## Customization

### Edit Composition Content

Each `index.html` is a standard HyperFrames HTML composition. Customize:

- **Colors**: Update CSS variables (`:root { --accent, --bg, etc. }`)
- **Text**: Change h1, h3, p content
- **Animations**: Modify GSAP animations in `<script>` section
- **Layout**: Adjust flexbox/grid styles
- **Icons**: Replace emoji with SVG or images

### Update Tutorial Metadata

Edit `hyperframes.json` in each folder:
```json
{
  "id": "mathtutor-pro",
  "name": "MathTutor Pro",
  "width": 1920,
  "height": 1080,
  "duration": 8,
  "fps": 30,
  "format": "mp4"
}
```

### Change Aspect Ratio

Modify `body { width, height }` in index.html CSS, then update hyperframes.json:

**Portrait (9:16 for TikTok/Reels):**
```css
body { width: 1080px; height: 1920px; }
```

**Square (1:1 for Instagram):**
```css
body { width: 1080px; height: 1080px; }
```

## Files Included

| File | Purpose |
|---|---|
| `tutorial-builder.mjs` | Generates HTML compositions from template |
| `generate-tutorials.mjs` | Advanced: AI avatars + DOP animation + compositing |
| `index.html` (root) | Gallery page linking all tutorials |
| `*/index.html` | HyperFrames composition for each app |
| `*/package.json` | NPM scripts for dev/render/lint/publish |
| `*/hyperframes.json` | Video metadata (size, duration, format) |
| `*/meta.json` | HyperFrames version info |

## Requirements

**For Preview & Dev:**
- Node.js 18+ (for HyperFrames)
- Browser with HTML5 video support
- npm or pnpm

**For Rendering (MP4 Export):**
- FFmpeg (https://ffmpeg.org)
- 2GB+ free disk space for renders

**For Higgsfield DOP Workflow:**
- `HIGGSFIELD_API_KEY` in `.env`
- `HIGGSFIELD_SECRET` in `.env`
- `node-fetch` or modern `fetch` API
- ImageMagick (for avatar image conversion)

**Mac:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install ffmpeg imagemagick
```

**Windows:**
Download from https://ffmpeg.org/download.html

## Rendering Workflow

### Standard Rendering (HyperFrames built-in)

```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 render
# Output: mathtutor-pro.mp4 (H.264, 1920x1080, 24fps)
```

### Advanced: Multi-Format with Text Overlay

```bash
node generate-tutorials.mjs
# Generates:
# - 3 AI avatars (PNG)
# - 3 animated videos (MP4)
# - 3 WebM variants
# - HTML gallery (index.html)
```

### Custom Rendering Options

Edit `hyperframes.json` before rendering:
```json
{
  "fps": 30,           // 24, 30, or 60
  "format": "mp4",     // mp4 or webm
  "bitrate": "5M",     // video bitrate
  "quality": "high"    // low, medium, high
}
```

## Platform Guidelines

### YouTube
- Size: 1920×1080 (16:9)
- Duration: 5-10 seconds (tutorial)
- Codec: H.264 MP4
- Bitrate: 5-8 Mbps video, 128 kbps audio

### TikTok / Instagram Reels / YouTube Shorts
- Size: 1080×1920 (9:16) or 1080×1080 (1:1)
- Duration: 3-60 seconds
- Codec: MP4 H.264 or WebM VP9
- Vertical or square compositions

### LinkedIn
- Size: 1200×627 (16:9) or 1080×1080 (1:1)
- Duration: 3-10 minutes
- Codec: MP4 H.264
- Hosted or native video upload

## Troubleshooting

### Preview not loading
```bash
# Clear browser cache and hard-reload
# Check: http://localhost:8080 (not 3000)
# Verify GSAP CDN is accessible
```

### FFmpeg "not found"
```bash
# Check installation
ffmpeg -version

# If missing, install:
# macOS: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg
# Windows: Download from ffmpeg.org
```

### Render fails silently
```bash
# Check HyperFrames version
npx --yes hyperframes@0.4.42 lint

# Try verbose output
npx --yes hyperframes@0.4.42 render --verbose

# Ensure index.html has <body> with dimensions
```

### Higgsfield API errors
```bash
# Verify credentials in .env
cat ../.env | grep HIGGSFIELD

# Test connection
curl -H "Authorization: Bearer $HIGGSFIELD_API_KEY" \
     https://api.higgsfield.ai/v1/health
```

## Next Steps

1. **Preview**: `cd mathtutor-pro && npx hyperframes@0.4.42 preview`
2. **Customize**: Edit colors, text, animations in `index.html`
3. **Render**: `npx hyperframes@0.4.42 render`
4. **Upload**: Use MP4 for YouTube, WebM for web

## Related Docs

- **HyperFrames**: https://hyperframes.io
- **ADR-0001**: See `docs/adr/0001-hyperframes-over-remotion-for-promos.md` for pipeline rationale
- **RHYTHMIX Pipeline**: See `CLAUDE.md` for full creative workflow
- **Higgsfield AI**: https://higgsfield.ai (Soul text-to-image, DOP image-to-video)

## License & Attribution

Created for RHYTHMIX educational content pipeline (2026).

Part of the RHYTHMIX creative stack — see `CREATIVE-AI-STACK.md` for full toolchain.
