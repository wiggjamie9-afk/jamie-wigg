# Content Automation Tools

Tools for YouTube, TikTok, Instagram, and social media content creation.

## 🎬 Thumbnail Generator

Automatically generate YouTube-style thumbnails with text, colors, and branding.

### Usage

**Single thumbnail:**
```bash
python3 thumbnail_generator.py --title "My Video Title" --subtitle "Subtitle Here"
```

**With custom colors:**
```bash
python3 thumbnail_generator.py \
  --title "Event Platform Launch" \
  --subtitle "Coming Soon" \
  --bg-color "#1a1a2e" \
  --accent-color "#0891b2" \
  --output my_thumbnail.png
```

**Batch generation:**
```python
from thumbnail_generator import batch_generate_thumbnails

titles = [
    "Event Platform Overview",
    "How to Create Events",
    "Real-time Sync Demo",
    "iOS App Tour",
]

batch_generate_thumbnails(titles, output_dir="./thumbnails")
```

### Output

- Format: PNG
- Size: 1280×720 (YouTube standard)
- Colors: Event Platform theme (cyan + purple)
- Ready for upload to YouTube, TikTok, Instagram

---

## 📝 Captions/Subtitles (Auto-Generate)

Auto-generate SRT/VTT subtitles from video using OpenAI Whisper.

### Usage

**Generate captions (SRT format):**
```bash
python3 caption_generator.py video.mp4
# Output: video.srt
```

**Custom language/model:**
```bash
python3 caption_generator.py video.mp4 --language en --model base
# Models: tiny, base, small, medium, large
# Languages: en, zh, ja, fr, es, etc.
```

**Translate to English:**
```bash
python3 caption_generator.py video.mp4 --translate
```

**Use VAD filter (reduces repetition, slightly slower):**
```bash
python3 caption_generator.py video.mp4 --vad
# Recommended for long videos (>10 min) with silence
```

**Burn subtitles into video:**
```bash
python3 caption_generator.py video.mp4 --burn output_with_captions.mp4
# Requires FFmpeg
```

**All options:**
```bash
python3 caption_generator.py video.mp4 \
  --language en \
  --model base \
  --format srt \
  --translate \
  --vad \
  --burn output.mp4
```

### Output Formats

- `srt` — SubRip (YouTube, VLC, most players)
- `vtt` — WebVTT (HTML5 video, better for web)
- `json` — JSON (for processing)
- `txt` — Plain text (transcription only)

### Models

| Model | Speed | Quality | VRAM |
|-------|-------|---------|------|
| `tiny` | Fast ⚡ | Lower | 1GB |
| `base` | Good | Good | 1GB |
| `small` | Slower | Better | 2GB |
| `medium` | Slow | Best | 5GB |
| `large` | Very Slow | Excellent | 10GB |

**Recommendation:** Use `base` or `small` for most content.

---

## 📝 Script Generation

Generate video scripts, social captions, and event descriptions from prompts.

### Usage

**60-second narration script:**
```bash
python3 script_generator.py --prompt "Event Platform Launch" --type narration
```

**Social media captions (3 variations):**
```bash
python3 script_generator.py --prompt "Tech conference in Austin" --type social
```

**Event description (200 words):**
```bash
python3 script_generator.py --prompt "Music festival announcement" --type event-description
```

**Viral video hooks (15 sec each):**
```bash
python3 script_generator.py --prompt "New product reveal" --type video-hook
```

**Product pitch script (30 sec):**
```bash
python3 script_generator.py --prompt "AI music platform" --type product-pitch
```

**Save to file:**
```bash
python3 script_generator.py --prompt "Event Name" --type narration --output event_narration.txt
```

**Use different AI provider:**
```bash
python3 script_generator.py --prompt "Event Name" --provider claude
python3 script_generator.py --prompt "Event Name" --provider replicate
```

### Providers

| Provider | Quality | Speed | Cost |
|----------|---------|-------|------|
| **OpenAI GPT-4o mini** | Excellent | Fast | Per-token |
| **Anthropic Claude 3.5** | Excellent | Fast | Per-token |
| **Replicate Mixtral** | Very Good | Medium | Per-request |

---

## 🖼️ Image Generation (Multi-Provider)

Generate images from text using Leonardo AI, Replicate, Craiyon, or Higgsfield.

### Usage

**Basic (Replicate FLUX):**
```bash
python3 image_generator.py --title "Sunset over mountain landscape"
# Output: generated_replicate.png
```

**With Leonardo AI:**
```bash
python3 image_generator.py --title "Event poster design" --generator leonardo
```

**With Craiyon (DALL-E mini, offline-friendly):**
```bash
python3 image_generator.py --title "Album artwork" --generator craiyon
```

**With Higgsfield (text-to-image + video generation):**
```bash
python3 image_generator.py --title "Character design sketch" --generator higgsfield
```

**Custom output path:**
```bash
python3 image_generator.py --title "Thumbnail design" --generator replicate --output my_image.png
```

**Replicate model variants:**
```bash
python3 image_generator.py --title "Portrait" --generator replicate --model flux-dev
# Models: flux (pro), flux-dev, sana, hyper
```

### Supported Providers

| Provider | Speed | Quality | Cost | API Key Env Var |
|----------|-------|---------|------|---|
| **Replicate** | Fast | Excellent (FLUX 1.1 Pro) | Per-image | `REPLICATE_API_TOKEN` |
| **Leonardo AI** | Fast | Very Good | Per-image | `LEONARDO_API_KEY` |
| **Craiyon** | Medium | Good | Free tier available | None (free) |
| **Higgsfield** | Fast | Excellent | Per-image | `HIGGSFIELD_API_KEY` |

### Environment Setup

**Get API keys (or free tiers):**

```bash
# Script generation (pick one or all)
export OPENAI_API_KEY="your-token"              # https://platform.openai.com/
export ANTHROPIC_API_KEY="your-key"             # https://console.anthropic.com/
export REPLICATE_API_TOKEN="your-token"         # https://replicate.com/

# Image generation
export LEONARDO_API_KEY="your-key"               # https://leonardo.ai/
export HIGGSFIELD_API_KEY="your-key"             # https://higgsfield.ai/
# Replicate token (above) also works for images
# Craiyon is free (no API key needed)
```

**Save to ~/.bash_profile or ~/.zshrc for persistence:**

```bash
cat >> ~/.zshrc << 'EOF'
# Content Automation Tools API Keys
export OPENAI_API_KEY="your-openai-token"
export ANTHROPIC_API_KEY="your-anthropic-key"
export REPLICATE_API_TOKEN="your-replicate-token"
export LEONARDO_API_KEY="your-leonardo-key"
export HIGGSFIELD_API_KEY="your-higgsfield-key"
EOF

source ~/.zshrc
```

**Or create a `.env` file in content-automation/ (gitignored):**

```bash
# .env (never commit this)
OPENAI_API_KEY=your-token
ANTHROPIC_API_KEY=your-key
REPLICATE_API_TOKEN=your-token
LEONARDO_API_KEY=your-key
HIGGSFIELD_API_KEY=your-key
```

Then load it before running scripts:

```bash
source .env
python3 script_generator.py --prompt "Event Name"
```

**Free tiers available:**
- **Replicate** — free tier with credits
- **Craiyon** — fully free (no API key)
- **OpenAI** — $5 free trial credits
- **Claude** — free tier available

---

## 🤖 Social Media Scheduler (Coming Next)

Schedule posts to YouTube, TikTok, Instagram, Twitter, etc.

---

## Installation

```bash
# Quick: install everything
pip install -r requirements.txt

# Or install individually by feature:

# Thumbnails
pip install Pillow

# Captions from video
pip install openai-whisper faster-whisper

# Script generation
pip install openai anthropic replicate

# Image generation
pip install requests replicate craiyon griptape

# Video processing
pip install ffmpeg-python
```

**For macOS (via Homebrew):**
```bash
brew install ffmpeg                    # Video processing
pip install -r requirements.txt        # Python packages
```

---

## File Structure

```
content-automation/
├── thumbnail_generator.py    # YouTube-optimized thumbnails (1280×720)
├── caption_generator.py       # Auto-captions from video (Whisper)
├── image_generator.py         # Text-to-image (Leonardo, Replicate, Craiyon, Higgsfield)
├── script_generator.py        # Script generation (OpenAI, Claude, Replicate)
├── social_scheduler.py        # Multi-platform scheduling (Coming)
├── requirements.txt           # Python dependencies
├── .env                       # API keys (gitignored)
└── README.md
```

---

## 🎬 Complete Content Creation Workflow

Create a full video package (script, thumbnail, captions) in one flow:

```bash
# 1. Generate script
python3 script_generator.py --prompt "Event Platform Launch" --type narration --output script.txt

# 2. Generate thumbnail
python3 thumbnail_generator.py --title "Event Platform Launch" --output thumbnail.png

# 3. Generate scene image
python3 image_generator.py --title "Event Platform Launch" --generator replicate --output scene.png

# 4. Generate captions from your video
python3 caption_generator.py my_video.mp4 --output captions.srt

# 5. Burn captions into video
python3 caption_generator.py my_video.mp4 --burn my_video_captioned.mp4
```

**Result:** `script.txt`, `thumbnail.png`, `scene.png`, `captions.srt`, `my_video_captioned.mp4` — ready for YouTube/TikTok/Instagram.

---

**Next:** Hook these tools into your event platform for one-click content generation.
