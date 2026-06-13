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

## 🤖 Social Media Scheduler (Coming Next)

Schedule posts to YouTube, TikTok, Instagram, Twitter, etc.

---

## Installation

```bash
pip install Pillow  # Thumbnail generator
pip install openai-whisper  # Captions
pip install instagrapi python-twitter  # Scheduler
```

---

## File Structure

```
content-automation/
├── thumbnail_generator.py    # Thumbnail generation
├── caption_generator.py       # Auto-captions (WIP)
├── social_scheduler.py        # Multi-platform scheduling (WIP)
└── README.md
```

---

**Next:** Set up caption auto-generation with Whisper.
