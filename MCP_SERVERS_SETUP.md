# MCP Servers Setup Guide

## Overview
MCP (Model Context Protocol) servers extend Claude Code with specialized capabilities.

## Servers to Install

### 1. Creative Stack (Replicate + ElevenLabs)
**What it does**: Image/video generation + TTS

```bash
# Already installed in .claude/mcp/creative-stack/
# Just needs API keys in .env:
REPLICATE_API_TOKEN=<get from https://replicate.com/account>
ELEVENLABS_API_KEY=<get from https://elevenlabs.io>
```

### 2. Higgsfield AI (Text→Image, Image→Video)
**What it does**: Soul text-to-image + DOP image-to-video

```bash
pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp

# Add to .env:
HIGGSFIELD_API_KEY=<from higgsfield.ai>
HIGGSFIELD_SECRET=<from higgsfield.ai>
```

### 3. Pollinations (Free Tier)
**What it does**: FLUX image gen, Suno music, Qwen TTS (no API key!)

```bash
npm install -g @pollinations/model-context-protocol
# No setup needed!
```

### 4. Playwright (Browser Automation)
**What it does**: Click, screenshot, fill forms in browser

```bash
npx -y @playwright/mcp@latest
# Already configured, uses localhost:8000
```

### 5. Claude Playwright (Session Management)
**What it does**: Browser profiles, test management on top of Playwright

```bash
npm install  # Already in project
# Installed as devDependency
```

### 6. Context7 (Documentation)
**What it does**: Real-time library API docs (use instead of training knowledge)

```bash
# Just needs API key:
CONTEXT7_API_KEY=<get from https://context7.com>
```

## Installation Checklist

- [ ] Copy `.mcp.json.template` → `.mcp.json`
- [ ] Add API keys to `.env`
- [ ] `npm install` (installs claude-playwright)
- [ ] `pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp` (if using Higgsfield)
- [ ] Verify in Claude Code: View → Extensions → MCPs

## Free vs Paid

| Server | Cost | Auth |
|--------|------|------|
| Creative Stack | Paid | REPLICATE_API_TOKEN + ELEVENLABS_API_KEY |
| Higgsfield | Paid | HIGGSFIELD_API_KEY + HIGGSFIELD_SECRET |
| Pollinations | FREE | None! |
| Playwright | FREE | None |
| Claude Playwright | FREE | None |
| Context7 | FREE | CONTEXT7_API_KEY |

## Usage Examples

### Generate image with FLUX
```
/dream a futuristic city at sunset
```

### Browser automation
```
mcp-browser click "Sign up" && mcp-browser fill "email" "test@example.com"
```

### Get API documentation
Use Context7 MCP when working with libraries instead of guessing from training data

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Server not found" | Check .mcp.json registration |
| Auth fails | Verify .env keys are correct |
| Pollinations blocked | Sandbox network policy (read-only in cloud) |
| Playwright stuck | Ensure BASE_URL=http://localhost:8000 |

---

**Ready to activate on iMac after adding API keys!**
