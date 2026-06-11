# Higgsfield Supercomputer

**A personal command center for Higgsfield AI generations.** Single-file HTML dashboard + pre-loaded Claude Skills for image/video generation, character training, and product photography.

## What's in this setup

### 1. **dashboard.html**
- Self-contained, zero-dependency dashboard
- Responsive (mobile/tablet/desktop)
- Real-time generation gallery
- Stats tracking
- Modal forms for all generation types
- Works offline after first load

**Open it:**
```bash
open dashboard.html
```

Or direct file path: `file:///home/user/jamie-wigg/dashboard.html`

### 2. **Higgsfield CLI** (installed)
- Terminal-based image generation
- Batch processing from prompt files
- Job management (status, download, upscale, relight)
- Credit tracking

**Quick commands:**
```bash
higgsfield generate "A serene landscape"
higgsfield history
higgsfield credits
higgsfield models
```

### 3. **Higgsfield MCP Server** (installed)
- Claude integration via MCP protocol
- 9 tools available
- Registered in `.mcp.json`

**In Claude:**
```
"Generate an image of..."
"Create a video from this URL"
"Show available Soul styles"
```

### 4. **Four Pre-loaded Skills** (skills-lock.json)
1. **higgsfield-generate** — Full model catalog (Soul, DOP, Kling, Seedance, Marketing Studio)
2. **higgsfield-soul-id** — Character training for face/identity consistency
3. **higgsfield-marketplace-cards** — Listing card generation
4. **higgsfield-product-photoshoot** — Product photography in multiple styles

Auto-discovered from `.agents/skills/` when you use Claude Code in this directory.

---

## Setup (5 minutes)

### 1. Add Credentials to `.env`
```bash
# Edit .env
HIGGSFIELD_API_KEY=your-key-here
HIGGSFIELD_SECRET=your-secret-here
```

Get credentials from: https://platform.higgsfield.ai

### 2. Test Everything
```bash
# Test MCP Server
python3 test_higgsfield_mcp.py

# Test CLI
higgsfield whoami
higgsfield credits

# Open dashboard
open dashboard.html
```

### 3. Generate Something
**Via CLI (quick):**
```bash
higgsfield generate "A red apple on a wooden table"
```

**Via Dashboard:**
1. Open `dashboard.html`
2. Click "✨ Generate Image"
3. Enter prompt, select model
4. Watch gallery populate

**Via Claude:**
```
"Generate an image of a sunset over mountains"
```

---

## Usage Patterns

### Pattern 1: Terminal + Dashboard
```bash
# Quick generation via CLI
higgsfield generate "Product shot"

# View result in dashboard gallery
# (Copy URL from history → paste in dashboard)
```

### Pattern 2: Pure Dashboard
1. Open `dashboard.html`
2. Use all 5 generation tools
3. Gallery auto-populates
4. Export/share results

### Pattern 3: Claude Integration
```
"Create 5 product photos of leather shoes"
(Uses higgsfield-product-photoshoot skill)

"Generate a video of the product walking"
(Uses higgsfield-generate skill)

"Create marketplace listing cards"
(Uses higgsfield-marketplace-cards skill)
```

### Pattern 4: Batch Processing
```bash
# Create prompts.txt
cat > prompts.txt <<EOF
Mountain landscape at sunset
Ocean wave closeup
Forest path in spring
