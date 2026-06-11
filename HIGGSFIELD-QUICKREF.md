# Higgsfield Quick Reference Card

## Install
```bash
# Already installed:
pip list | grep higgsfield
# → higgsfield-cli 0.1.0
# → higgsfield-mcp 0.1.0
```

## Setup Credentials
```bash
# Edit .env
HIGGSFIELD_API_KEY=your-key
HIGGSFIELD_SECRET=your-secret

# Or login via CLI
higgsfield login
```

## Test Setup
```bash
python3 test_higgsfield_mcp.py
# Expected: 4/5 passed
```

---

## CLI Usage

### Quick Commands
```bash
higgsfield generate "A sunset over mountains"
higgsfield history
higgsfield credits
higgsfield models
higgsfield whoami
```

### Advanced
```bash
# Batch generation
higgsfield batch prompts.txt

# Upscale
higgsfield upscale job-id

# Create variation
higgsfield use job-id "New variation"

# Watch progress
higgsfield watch job-id
```

### Download & Share
```bash
higgsfield download 1
higgsfield open 1
higgsfield favorite 1
```

---

## Claude Integration (MCP)

### In Claude
```
"Generate an image of a [description]"
"Show available Soul styles"
"Create a video from this image: [URL]"
"Check the status of job [ID]"
```

### Available Tools
- `get_soul_styles` — List image styles
- `generate_image_soul` — Text → Image
- `generate_video_dop` — Image → Video
- `get_job_status` — Check progress
- `create_character` — Character refs
- `delete_character` — Remove refs

---

## Common Workflows

### Image Generation → Video
```bash
# 1. Generate image (CLI)
higgsfield generate "Product shot"

# 2. Get URL from history
higgsfield history

# 3. Create video (Claude)
"Create a video from [image-url]"
```

### Batch Processing
```bash
# 1. Create prompts.txt
cat > prompts.txt <<EOF
Mountain landscape
Ocean sunset
Forest path
EOF

# 2. Generate batch
higgsfield batch prompts.txt

# 3. Download all results
higgsfield history
# Download each via higgsfield download <ID>
```

### Character Consistency
```bash
# 1. Create character reference
higgsfield generate "Character photo"

# 2. Create character in Claude
"Create character from [image-url]"

# 3. Generate variations
"Generate videos of [character] walking"
"Generate [character] speaking"
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Not authenticated" | `higgsfield login` |
| "No such command" | `higgsfield --help` |
| "Out of credits" | `higgsfield credits` |
| "403 error" | Update `.env` with real credentials |
| MCP not working | `python3 test_higgsfield_mcp.py` |

---

## Files

```
.env                      ← Credentials
.mcp.json                 ← MCP config (already set up)
test_higgsfield_mcp.py    ← Test suite
HIGGSFIELD-SETUP.md       ← Full guide
HIGGSFIELD-QUICKREF.md    ← This file
```

---

## Resources

```bash
# Help
higgsfield --help
higgsfield <command> --help

# More info
cat HIGGSFIELD-SETUP.md
python3 test_higgsfield_mcp.py

# Check config
cat .mcp.json
cat .env
```

---

## Status

✅ CLI installed  
✅ MCP server configured  
✅ Test suite ready  
⏳ Waiting for credentials  

**Setup**: 5 minutes  
**Ready to use**: Now
