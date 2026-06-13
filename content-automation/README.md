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

### Setup

```bash
# Replicate (recommended for quality)
export REPLICATE_API_TOKEN="your-token"
# Get token at https://replicate.com/

# Leonardo AI
export LEONARDO_API_KEY="your-key"
# Get key at https://leonardo.ai/

# Higgsfield
export HIGGSFIELD_API_KEY="your-key"
# Get key at https://higgsfield.ai/

# Craiyon (optional, no API key needed)
pip install craiyon
```

---

## 🤖 Social Media Scheduler (Coming Next)

Schedule posts to YouTube, TikTok, Instagram, Twitter, etc.

---

## Installation

```bash
# Core tools
pip install Pillow              # Thumbnail generator
pip install openai-whisper      # Captions (Whisper)
pip install requests            # HTTP requests (image generation)

# Image generation (choose providers you need)
pip install replicate           # Replicate API (FLUX, Sana, etc.)
pip install craiyon             # Craiyon/DALL-E mini (local-friendly)

# Griptape integration (for Leonardo AI)
pip install griptape            # Griptape framework

# Social scheduler (coming)
pip install instagrapi python-twitter
```

**Quick setup:**
```bash
pip install -r requirements.txt
```

---

## File Structure

```
content-automation/
├── thumbnail_generator.py    # YouTube-optimized thumbnails (1280×720)
├── caption_generator.py       # Auto-captions from video (Whisper)
├── image_generator.py         # Text-to-image (Leonardo, Replicate, Craiyon, Higgsfield)
├── social_scheduler.py        # Multi-platform scheduling (Coming)
├── requirements.txt           # Python dependencies
└── README.md
```

---

**Next:** Set up caption auto-generation with Whisper.
