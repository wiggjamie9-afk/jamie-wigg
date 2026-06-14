# AI Tutorial Video Setup Guide

Complete setup instructions for generating and rendering AI tutorial videos.

## Prerequisites

### Required
- **Node.js 18+** — https://nodejs.org
- **FFmpeg** — https://ffmpeg.org (for video rendering)
- **Git** (included in most systems)

### Optional
- **ImageMagick** (for avatar image processing in advanced workflow)
- **Higgsfield API Key** (for AI avatar generation)

## Installation

### 1. Install FFmpeg

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Linux (Fedora/RedHat):**
```bash
sudo dnf install ffmpeg
```

**Windows:**
- Download from https://ffmpeg.org/download.html
- Add to PATH or use full path when running

**Verify installation:**
```bash
ffmpeg -version
```

### 2. Install ImageMagick (Optional, for advanced workflow)

**macOS:**
```bash
brew install imagemagick
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install imagemagick
```

**Windows:**
- Download from https://imagemagick.org/download/windows/
- Add to PATH

## Configuration

### Basic Setup (No API Required)

The tutorial compositions work out of the box! No configuration needed for preview and rendering.

```bash
# From videos/tutorials/ directory
npm install  # (optional, uses npx internally)
npm run dev:math  # Preview MathTutor Pro
npm run render:math  # Render to MP4
```

### Advanced Setup (Higgsfield DOP for AI Avatars)

To generate AI avatars and animate them with Higgsfield DOP:

1. **Get API credentials:**
   - Visit https://platform.higgsfield.ai
   - Sign up or log in
   - Copy API Key and Secret

2. **Add to .env file:**
   ```bash
   # In /home/user/jamie-wigg/.env
   HIGGSFIELD_API_KEY=your-api-key-here
   HIGGSFIELD_SECRET=your-secret-here
   ```

3. **Test connection:**
   ```bash
   node generate-tutorials.mjs
   ```

## Quick Start

### Preview a Tutorial

```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 preview
# Opens http://localhost:8080 in browser
```

### Render a Single Tutorial

```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 render
# Creates mathtutor-pro.mp4
```

### Render All Tutorials

```bash
bash render-all.sh
# Creates all 3 MP4 files in parallel
```

### Using npm Scripts

```bash
# From videos/tutorials/ directory

# Preview
npm run dev:math
npm run dev:book
npm run dev:lang

# Render single
npm run render:math
npm run render:book
npm run render:lang

# Render all
npm run render:all

# Validate
npm run lint:all
```

## Customization

### Edit Colors

In each `index.html`, find the `:root` CSS block:

```css
:root {
    --primary: #10b981;        /* Change app brand color */
    --primary-bright: #34d399;
    --accent: #06b6d4;
    --bg: #0b1120;             /* Background color */
    --text: #f3f6fb;           /* Text color */
}
```

Update the hex codes to match your brand palette.

### Edit Text Content

In each `index.html`, customize:

```html
<h1 class="title">MathTutor Pro</h1>
<p class="tagline">Solve Math Problems Step-by-Step</p>
<p class="description">Your custom description here</p>

<div class="features">
    <!-- Change feature tags here -->
    <div class="feature">
        <div class="feature-icon">✓</div>
        <div class="feature-text">Your feature here</div>
    </div>
</div>

<button class="cta-button">Start Learning Math</button>
```

### Change Aspect Ratio

**For portrait videos (TikTok, Instagram Reels, YouTube Shorts):**

Edit `index.html` CSS:
```css
body {
    width: 1080px;
    height: 1920px;
}
```

Edit `hyperframes.json`:
```json
{
    "width": 1080,
    "height": 1920
}
```

**For square videos (Instagram, Twitter):**

Edit `index.html` CSS:
```css
body {
    width: 1080px;
    height: 1080px;
}
```

Edit `hyperframes.json`:
```json
{
    "width": 1080,
    "height": 1080
}
```

### Modify Animations

GSAP animations are defined in the `<script>` section:

```javascript
// Floating animation (runs after page load)
gsap.to('.content', {
    y: 20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1
});
```

Adjust:
- `y: 20` — Distance to float
- `duration: 3` — How fast
- `repeat: -1` — Loop infinitely
- `ease: 'sine.inOut'` — Animation curve

## Troubleshooting

### FFmpeg Not Found

```bash
# Check if installed
which ffmpeg

# On macOS with Homebrew
brew install ffmpeg

# On Linux
sudo apt-get install ffmpeg

# On Windows, download and add to PATH
```

### Preview Port Already in Use

```bash
# HyperFrames uses port 8080
# If port is in use, try:
lsof -i :8080
kill -9 <PID>

# Or use different port
npx --yes hyperframes@0.4.42 preview --port 8081
```

### Render Fails Silently

1. **Validate composition:**
   ```bash
   npx --yes hyperframes@0.4.42 lint
   ```

2. **Check FFmpeg:**
   ```bash
   ffmpeg -version
   ```

3. **Verify file structure:**
   ```bash
   ls -la
   # Should have: index.html, package.json, hyperframes.json, meta.json
   ```

4. **Try verbose output:**
   ```bash
   npx --yes hyperframes@0.4.42 render --verbose
   ```

### Higgsfield API Errors

1. **Verify credentials:**
   ```bash
   grep HIGGSFIELD ../.env
   ```

2. **Test API access:**
   ```bash
   curl -H "Authorization: Bearer $HIGGSFIELD_API_KEY" \
        https://api.higgsfield.ai/v1/health
   ```

3. **Check quota:**
   - Log in to https://platform.higgsfield.ai
   - Verify API key has active quota
   - Check rate limits

### Node Memory Issues

If rendering large files fails:

```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npx hyperframes@0.4.42 render
```

## Performance Tips

### Reduce File Size
```bash
# Edit hyperframes.json for lower bitrate
{
    "bitrate": "2M",    // Lower = smaller file
    "fps": 24,          // Lower FPS = smaller file
    "quality": "medium"
}
```

### Faster Rendering
```bash
# Disable optional features
# Remove complex GSAP animations
# Use simpler CSS gradients
# Reduce animation duration
```

### Optimize for Mobile
- Keep duration 5-10 seconds
- Use portrait or square aspect ratio
- Bitrate 1-2 Mbps
- Resolution 1080×1920 or lower

## Export Formats

### MP4 (Default)
- Universal playback
- Smaller file size (with H.264 codec)
- YouTube, TikTok, Instagram, LinkedIn native upload
- Use for web delivery

### WebM (Optional)
```bash
# Manual conversion using FFmpeg
ffmpeg -i tutorial.mp4 -c:v libvpx-vp9 -b:v 1M tutorial.webm
```
- Better compression for web
- Lower browser support
- Use for web servers with fallback

### GIF/Animation (Advanced)
```bash
# Convert to GIF (very large file)
ffmpeg -i tutorial.mp4 tutorial.gif

# Optimized GIF (smaller)
ffmpeg -i tutorial.mp4 -vf scale=640:-1 -f gif tutorial.gif
```

## Deployment

### YouTube
```bash
1. Visit https://youtube.com/upload
2. Select tutorial MP4
3. Add title, description, tags
4. Set thumbnail (auto-generated from first frame)
5. Choose visibility (Public/Unlisted/Private)
6. Publish
```

### Social Media
```bash
TikTok:     Upload portrait MP4 (1080×1920)
Instagram:  Reels = vertical, Feed = square, Stories = portrait
LinkedIn:   Upload MP4 (16:9 or 1:1), add captions
YouTube:    Upload MP4 (16:9), enable captions, add chapter markers
Twitter/X:  Video MP4, max 2GB, max 15 min duration
```

### Web Embedding
```html
<!-- Embed in HTML page -->
<video width="100%" controls poster="thumbnail.jpg">
    <source src="mathtutor-pro.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
```

### Self-Hosted
```bash
# Copy to web server
scp mathtutor-pro.mp4 user@server:/var/www/videos/

# Link from HTML
<video src="https://example.com/videos/mathtutor-pro.mp4" controls></video>
```

## Advanced Workflows

### Multi-Format Export
```bash
# Render, then convert to multiple formats
npm run render:all

# Convert to WebM
ffmpeg -i mathtutor-pro/mathtutor-pro.mp4 \
       -c:v libvpx-vp9 -b:v 1M \
       mathtutor-pro/mathtutor-pro.webm

# Convert to MOV (for Apple devices)
ffmpeg -i mathtutor-pro/mathtutor-pro.mp4 \
       -c:v prores_ks -q:v 3 \
       mathtutor-pro/mathtutor-pro.mov
```

### Batch Processing with Higgsfield DOP
```bash
# Generate avatars + animate with DOP in one go
node generate-tutorials.mjs

# Customizes avatar prompts
# Animates with motion descriptions
# Adds text overlays
# Creates HTML gallery
```

### Integrate with RHYTHMIX Pipeline
```bash
# Copy tutorials to promo folders
cp -r videos/tutorials/mathtutor-pro rhythmix-mathtutor-pro-8s/

# Edit hyperframes.json to match promo duration
# Add to rhythmix-teaser-60s/DESIGN.md for brand consistency
# Render with full RHYTHMIX suite
```

## More Resources

- **HyperFrames Docs**: https://hyperframes.io
- **GSAP Animation**: https://greensock.com/gsap/
- **FFmpeg Guide**: https://ffmpeg.org/documentation.html
- **Higgsfield AI**: https://higgsfield.ai
- **RHYTHMIX Pipeline**: See `CLAUDE.md` in repo root
- **ADR-0001**: See `docs/adr/0001-hyperframes-over-remotion-for-promos.md`

## Support

For issues:
1. Check troubleshooting section above
2. Validate composition: `npm run lint:all`
3. Check repo docs: `docs/adr/`, `CONTEXT.md`
4. Review HyperFrames docs
5. Open GitHub issue if needed

Happy rendering! 🎬✨
