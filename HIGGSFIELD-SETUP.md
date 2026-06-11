# Higgsfield Complete Setup Guide

All Higgsfield tools have been installed and configured. This guide covers setup, usage, and troubleshooting.

## Installed Products

### 1. Higgsfield MCP Server (v0.1.0)
**Purpose**: Claude integration for image/video generation
**Status**: ✅ Installed and configured

#### Quick Start
```bash
# Verify installation
python3 test_higgsfield_mcp.py

# Check MCP configuration
cat .mcp.json | grep -A5 higgsfield
```

#### Usage in Claude
```
"Generate an image of [description]"
"Create a video from [image URL]"
"Show me available Soul styles"
```

#### Configuration Files
- `.mcp.json` → MCP server registration
- `.env` → API credentials (lines 9-10)
  ```
  HIGGSFIELD_API_KEY=your-key
  HIGGSFIELD_SECRET=your-secret
  ```

#### Available Tools (9 total)
- `get_soul_styles` — List available image styles
- `generate_image_soul` — Text-to-image generation
- `get_motion_presets` — List video motion presets
- `generate_video_dop` — Image-to-video generation
- `get_job_status` — Check generation status
- `get_character_status` — Character reference status
- `create_character` — Create character reference
- `delete_character` — Remove character reference
- `get_job_results` — Retrieve completed results

#### Endpoints
- Image generation: `https://platform.higgsfield.ai/v1/text2image/soul`
- Video generation: `https://platform.higgsfield.ai/v1/image2video/dop`
- Character refs: `https://platform.higgsfield.ai/v1/custom-references`

---

### 2. Higgsfield CLI (v0.1.0)
**Purpose**: Terminal-based AI image generation
**Status**: ✅ Installed and ready

#### Quick Start
```bash
# Show help
higgsfield --help

# List available models
higgsfield models

# Check credits
higgsfield credits

# Show free generation counts
higgsfield free-gens
```

#### Authentication
```bash
# Login to Higgsfield account
higgsfield login

# Show current user and credits
higgsfield whoami
```

#### Generate Images
```bash
# Basic generation
higgsfield generate "A serene mountain landscape"

# Generate with specific model
higgsfield generate --model soul "Futuristic city"

# Batch generation from file
higgsfield batch prompts.txt

# Generate with reference image
higgsfield use previous-job-id "Modify in this style"
```

#### Image Operations
```bash
# List generation history
higgsfield history

# Check job status
higgsfield status job-id

# Download completed image
higgsfield download display-number

# Open image in browser
higgsfield open display-number

# Upscale image
higgsfield upscale job-id

# Relight image (adjust lighting)
higgsfield relight job-id

# Outpaint (extend beyond borders)
higgsfield outpaint job-id

# Use as reference
higgsfield use job-id "New prompt"

# Mark as favorite
higgsfield favorite job-id

# Re-run with same settings
higgsfield again display-number

# Delete job from history
higgsfield delete display-number

# Watch job with live updates
higgsfield watch job-id
```

#### Available Models
```bash
higgsfield models
```

Common models:
- `soul` — Text-to-image, high quality
- `flux` — Fast generation
- `sana` — High resolution
- Others available (check with `models` command)

#### Workflow Example
```bash
# 1. Generate image
higgsfield generate "Product photo of leather shoes"

# 2. View history to get job ID
higgsfield history

# 3. Upscale result
higgsfield upscale 1

# 4. Relight with different lighting
higgsfield relight 1

# 5. Create variation using as reference
higgsfield use 1 "Same product in white color"

# 6. Open best result
higgsfield open 1
```

#### Configuration
- Credentials stored in: `~/.higgsfield/` (auto-created after login)
- API token managed securely by CLI
- No manual credential files needed

---

## Unified Workflow: MCP Server + CLI

You can use both tools together:

```bash
# 1. Generate via CLI (quick terminal access)
higgsfield generate "Initial concept"

# 2. Use results in Claude via MCP (integration with your project)
# In Claude: "Use the Higgsfield image at [URL] to generate a video"

# 3. Batch processing via CLI
higgsfield batch prompts.txt

# 4. Integration via MCP
# In Claude: "Create videos from each image in batch_results/"
```

---

## Testing & Verification

### Test Suite
```bash
# Run comprehensive test
python3 test_higgsfield_mcp.py

# Expected output: 4/5 passed (5th requires real credentials)
```

### Manual Testing

#### CLI
```bash
# Test authentication
higgsfield whoami

# Test available models
higgsfield models

# Generate test image
higgsfield generate "Test image" --dry-run  # if available
```

#### MCP Server
```bash
# In Python
python3 << 'EOF'
import asyncio
from higgsfield_mcp.client import HiggsfieldClient
import os
from dotenv import load_dotenv

load_dotenv()

async def test():
    client = HiggsfieldClient(
        api_key=os.getenv('HIGGSFIELD_API_KEY'),
        secret=os.getenv('HIGGSFIELD_SECRET')
    )
    
    # Test available styles
    styles = await client.get_soul_styles()
    print(f"✓ Available styles: {len(styles)}")
    
    # Test available motions
    motions = await client.get_soul_motions()
    print(f"✓ Available motions: {len(motions)}")
    
    await client.close()

asyncio.run(test())
EOF
```

---

## Credentials & Security

### .env File (for MCP Server)
```bash
# Location: /home/user/jamie-wigg/.env
HIGGSFIELD_API_KEY=your-key
HIGGSFIELD_SECRET=your-secret
```

**Security Notes:**
- `.env` is gitignored (never committed)
- Keep credentials secure
- Rotate keys periodically
- Use environment variables in CI/CD

### CLI Credentials
```bash
# Auto-managed after login
higgsfield login

# Stored securely in ~/.higgsfield/
# No manual configuration needed
```

---

## API Reference

### MCP Server Endpoints

#### Get Styles
```
Tool: get_soul_styles
Returns: List of available Soul image generation styles
Example: ["portrait", "landscape", "abstract", ...]
```

#### Generate Image
```
Tool: generate_image_soul
Params:
  - prompt: str (required)
  - width_height: str (default: "1696x960")
  - quality: str (default: "1080p")
  - enhance_prompt: bool (default: true)
Returns: { id, type, created_at }
```

#### Check Status
```
Tool: get_job_status
Params:
  - job_id: str (required)
Returns: { id, status, results, retention_expires_at }
```

#### Get Motion Presets
```
Tool: get_motion_presets
Returns: List of video motion styles
```

#### Create Video
```
Tool: generate_video_dop
Params:
  - prompt: str (required)
  - image_url: str (required)
  - model: str (default: "dop-turbo")
  - seed: int (optional)
Returns: { id, type, created_at }
```

#### Character Management
```
Tool: create_character
Params:
  - name: str
  - image_url: str
Returns: { id, name, photo_url }

Tool: get_character_status
Params:
  - character_id: str
Returns: { id, status, ready }

Tool: delete_character
Params:
  - character_id: str
```

---

## Troubleshooting

### CLI Issues

#### "Not authenticated"
```bash
higgsfield login
```

#### "Invalid model"
```bash
# List valid models
higgsfield models
```

#### "Out of credits"
```bash
# Check remaining credits
higgsfield credits

# Check free generation allowance
higgsfield free-gens
```

### MCP Server Issues

#### "403 Host not in allowlist"
- Credentials are invalid or placeholder
- Add real credentials to `.env`
- Verify API key format (UUID)

#### "Connection refused"
- Check network connectivity
- Verify API endpoint: `https://platform.higgsfield.ai`
- Check firewall rules

#### "Module not found"
```bash
pip install higgsfield-mcp
```

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Your Applications               │
├─────────────────────────────────────────┤
│  Claude (MCP) │  Terminal (CLI) │ APIs  │
├─────────────────────────────────────────┤
│  higgsfield-mcp      │    higgsfield-cli │
├─────────────────────────────────────────┤
│     Higgsfield Platform API             │
│  https://platform.higgsfield.ai         │
└─────────────────────────────────────────┘
```

### Data Flow

**MCP Server Path:**
1. Claude asks for image
2. MCP tool receives request
3. Calls Higgsfield API
4. Returns job ID to Claude
5. Claude polls for status
6. Returns result URL

**CLI Path:**
1. User types: `higgsfield generate "prompt"`
2. CLI sends to Higgsfield API
3. Displays job ID
4. Optionally watches progress
5. Downloads/displays result

---

## Best Practices

### Image Generation
1. **Write detailed prompts** — more specific = better results
2. **Use quality parameter** — higher quality for better results
3. **Batch similar images** — use batch mode for efficiency
4. **Save successful seeds** — reuse what works

### Video Generation
1. **High-quality source images** — input quality affects output
2. **Clear motion descriptions** — be specific about desired motion
3. **Test with DOP Turbo first** — faster, then upgrade to Standard
4. **Use character references** — for consistent characters across videos

### Integration (MCP + CLI)
1. **CLI for quick exploration** — test prompts interactively
2. **MCP for automation** — integrate into Claude workflows
3. **Combine approaches** — use CLI for prototyping, MCP for production
4. **Batch + MCP** — generate batch, integrate results

---

## File Structure

```
/home/user/jamie-wigg/
├── .env                          # Credentials (gitignored)
├── .mcp.json                     # MCP server config
├── test_higgsfield_mcp.py        # Test suite
├── HIGGSFIELD-SETUP.md           # This file
├── README.md                     # Project README
└── .gitignore                    # Includes .env
```

---

## Next Steps

1. ✅ **Setup complete** — All tools installed
2. 🔑 **Add credentials** — Update `.env` with real API keys
3. 🧪 **Test integration** — Run `python3 test_higgsfield_mcp.py`
4. 🎨 **Start generating** — Use CLI or Claude
5. 🚀 **Automate** — Build workflows combining both

---

## Quick Reference

| Task | Tool | Command |
|------|------|---------|
| Generate image | CLI | `higgsfield generate "prompt"` |
| Generate via Claude | MCP | Ask Claude to generate image |
| Check credits | CLI | `higgsfield credits` |
| List models | CLI | `higgsfield models` |
| View history | CLI | `higgsfield history` |
| Download image | CLI | `higgsfield download ID` |
| Test MCP | Python | `python3 test_higgsfield_mcp.py` |
| Check status | Both | CLI: `higgsfield status ID` / MCP: via Claude |

---

## Support & Resources

- **API Docs**: https://docs.higgsfield.ai/
- **CLI Help**: `higgsfield --help`
- **MCP Spec**: https://modelcontextprotocol.io/
- **Test Suite**: `python3 test_higgsfield_mcp.py`

---

**Last Updated**: 2026-06-11  
**Tools Installed**: higgsfield-mcp (0.1.0), higgsfield-cli (0.1.0)  
**Status**: ✅ Ready to use
