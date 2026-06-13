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

## 📝 Captions/Subtitles (Coming Next)

Auto-generate SRT subtitles from video using OpenAI Whisper:

```bash
pip install openai-whisper
whisper video.mp4 --language en --output_format srt
ffmpeg -i video.mp4 -vf subtitles=video.srt output_with_captions.mp4
```

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
