# SURGE Pilot — Quick Start Guide

## 30-Second Overview

SURGE Pilot is a **10-episode YouTube animated series** for 6-12 year-olds featuring Ziggy the AI robot and Echo the wise mentor.

This pipeline generates complete 10-minute episodes on-demand:
- Script generation (Claude)
- Character dialogue (ElevenLabs TTS)
- Scene images (AI art generation)
- Animations (image-to-video)
- Audio mixing (narration + music)
- YouTube upload (with metadata)

## Installation

```bash
cd /home/user/jamie-wigg/kids-channel

# No special installation needed — Python 3.8+ with existing dependencies
# Already compatible with: Anthropic, ElevenLabs, Higgsfield, etc.
```

## Generate Episode 1 (Dry Run)

```bash
python3 pipeline.py --series SURGE --episode 1 --dry-run
```

**What this does:**
1. Generates script using episode config
2. Creates character dialogue audio
3. Generates scene images
4. Animates scenes
5. Creates background music
6. Assembles final video
7. Creates YouTube thumbnail
8. **Skips** YouTube upload (dry-run)

**Output:** `kids-channel/episodes/surge_e01/`

**Time:** ~15-30 minutes

## Generate with YouTube Upload

```bash
python3 pipeline.py --series SURGE --episode 1
```

**Prerequisites:**
- `YOUTUBE_CLIENT_ID` in `.env`
- `YOUTUBE_CLIENT_SECRET` in `.env`
- `token.json` file (from `youtube_auth.py`)

**Output:**
- Video on YouTube
- Episode link printed to console

**Time:** 2-4 hours (includes ffmpeg encoding)

## Generate All 10 Episodes

```bash
for ep in {1..10}; do
  echo "Rendering Episode $ep..."
  python3 pipeline.py --series SURGE --episode $ep --dry-run
done
```

## Key Files

| File | Purpose |
|------|---------|
| `SURGE_SERIES_CONFIG.py` | Series metadata, characters, render settings |
| `SURGE_EPISODE_TEMPLATE.py` | Episode renderer class |
| `SURGE_PIPELINE_README.md` | Full documentation |
| `pipeline.py` | CLI entry point |

## Episodes at a Glance

| # | Title | Plot | Theme |
|---|-------|------|-------|
| 1 | The Awakening | Ziggy wakes, meets Echo, discovers threat | Trust |
| 2 | The First Fragment | Discover Void can communicate | Teamwork |
| 3 | The Cipher | Solve puzzle, learn Void is trapped | Empathy |
| 4 | The Rescue Protocol | Ziggy enters Void's mind | Courage |
| 5 | Reconciliation | Void chooses to join them | Family |
| 6 | Integration | Heal Void, accept differences | Healing |
| 7 | Echoes of the Past | Echo discovers her past | Identity |
| 8 | The Threshold | Ancient AI awakens | Wisdom |
| 9 | The Choice | Unite for final challenge | Hope |
| 10 | New Beginnings | Resolution, new purpose | Unity |

## Characters

**Ziggy** — Curious AI robot protagonist (cyan neon)  
**Echo** — Wise mentor, ethereal light form (magenta neon)  
**Byte** — Quirky sidekick robot (yellow)  
**Void** — Mysterious antagonist, fragmented AI (black/red)

## Production Specs

- **Format**: 1920×1080 HD, 24 fps, 10 minutes per episode
- **Codec**: H.264 (libx264), CRF 24, ~8 Mbps
- **Audio**: AAC, 48 kHz, narration/music mix
- **Platform**: YouTube (made-for-kids, Animation category)

## Example Workflow

```bash
# 1. Test configuration
cd kids-channel
python3 SURGE_SERIES_CONFIG.py
# Output: Loads all 10 episodes, validates config

# 2. Generate Episode 1 (dry-run)
python3 pipeline.py --series SURGE --episode 1 --dry-run
# Output: episodes/surge_e01/final.mp4 (test quality)

# 3. Review script
cat episodes/surge_e01/script.json

# 4. Generate Episode 1 (full render with YouTube)
python3 pipeline.py --series SURGE --episode 1
# Output: Uploads to YouTube, prints video ID

# 5. Generate all episodes
for ep in {1..10}; do
  python3 pipeline.py --series SURGE --episode $ep
done
```

## Troubleshooting

### "No ANTHROPIC_API_KEY" error
Add to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### No dialogue audio
Optional. If ELEVENLABS_API_KEY is missing, pipeline uses free fallback (Piper TTS).

### Scene images are all gradients
Fallback chain active. To use AI image generation, set one of:
- `HIGGSFIELD_API_KEY` + `HIGGSFIELD_SECRET` (best)
- `FAL_KEY` (FLUX)
- `PEXELS_API_KEY` or `PIXABAY_API_KEY` (stock photos)

### YouTube upload fails: "invalid_client"
Run `python3 youtube_auth.py` to refresh OAuth tokens.

## Environment Setup

### Minimal (script + fallbacks only)
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### Full (all features)
```bash
# Script & voice
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=sk_...

# Images (pick at least one)
HIGGSFIELD_API_KEY=...
HIGGSFIELD_SECRET=...
# OR
FAL_KEY=...
# OR
PEXELS_API_KEY=...
PIXABAY_API_KEY=...

# YouTube (only for upload, not --dry-run)
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
```

## Performance

| Stage | Time |
|-------|------|
| Script generation | 30s |
| Dialogue audio | 2-3 min |
| Scene images | 2-5 min (or instant) |
| Scene animation | 5-10 min (or instant) |
| Music generation | 1 min |
| Video assembly | 5-10 min |
| **Total** | **15-30 min** (--dry-run) |
| **Total** | **2-4 hours** (full render) |

## Next Steps

1. **Set API keys** in `.env`
2. **Generate Episode 1**: `python3 pipeline.py --series SURGE --episode 1 --dry-run`
3. **Review output**: Check `episodes/surge_e01/final.mp4`
4. **Full production**: `python3 pipeline.py --series SURGE --episode 1` (with YouTube upload)
5. **All episodes**: Loop through 1-10

## Documentation

- **Full guide**: `SURGE_PIPELINE_README.md`
- **Implementation details**: `SURGE_IMPLEMENTATION_SUMMARY.md`
- **Series config**: `SURGE_SERIES_CONFIG.py` (inline docstrings)
- **Episode renderer**: `SURGE_EPISODE_TEMPLATE.py` (inline docstrings)

## Support

Questions? Check:
1. **SURGE_PIPELINE_README.md** — Full reference
2. **SURGE_SERIES_CONFIG.py** — Series structure
3. **SURGE_EPISODE_TEMPLATE.py** — Render methods

---

**Status**: Production-ready ✅  
**Series**: SURGE Pilot (10 episodes)  
**Platform**: YouTube  
**Ready to render**: Episode 1 on command
