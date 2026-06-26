# ManimGL Integration — Complete Video Pipeline

**Status:** ✅ ManimGL installed and ready  
**Installed Version:** 1.7.2 (June 2024)  
**Python:** 3.11.15  
**LaTeX:** ✅ (texlive + extras)  
**FFmpeg:** ✅ v6.1.1  

---

## What You Now Have

### 1. **ManimGL** (Mathematical Animation Engine)
- 3Blue1Brown's animation framework
- For creating complexity theory explainer videos
- Renders mathematical objects, equations, and animations
- Outputs MP4 videos ready for distribution

### 2. **Example Scripts**
- **sandpile_animation.py** — 6 complete scenes:
  - `SandpileIntro` — Title sequence
  - `SandpileGrid` — 2D cellular automaton visualization
  - `ToppleAnimation` — Cell cascades
  - `AvalancheMagnitude` — Power-law distribution graph
  - `FractalPattern` — Self-similar fractal display
  - `CriticalExponent` — Comparison of power laws

### 3. **Render Script**
- **render_complexity_videos.sh** — Automated rendering pipeline
- Supports quality levels: -ql (480p), -qm (720p), -qh (1080p), -qk (4K)
- Batch rendering support

### 4. **Documentation**
- **MANIMGL-SETUP.md** — Complete installation & troubleshooting guide
- **This file** — Integration with your video ecosystem

---

## Quick Start (Local Machine)

### Render a Single Scene

```bash
# Low quality (fast, for testing)
manimgl sandpile_animation.py SandpileIntro -ql --write_to_movie

# High quality (production)
manimgl sandpile_animation.py SandpileIntro -qh --write_to_movie
```

### Output
```
media/videos/sandpile_animation/
├── 480p15/
│   └── SandpileIntro.mp4  ← Your rendered video
├── 720p30/
│   └── SandpileIntro.mp4
└── 1080p60/
    └── SandpileIntro.mp4
```

### Batch Render All Scenes

```bash
bash render_complexity_videos.sh qm      # Medium quality
# Renders: intro, grid, topple, avalanche, fractal, exponent
```

---

## Video Pipeline: ManimGL → STARLIGHTMIX

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CREATE                                                   │
│    ManimGL Script (sandpile_animation.py)                  │
│    + Mathematical equations                                │
│    + Animated transitions                                  │
│    + Fractal patterns                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│ 2. RENDER                                                   │
│    manimgl script.py SceneName -qh --write_to_movie       │
│    Output: 1080p MP4 (ready for YouTube)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│ 3. EXTRACT CLIPS                                            │
│    FFmpeg: 15s, 30s, 45s cuts for social media            │
│    ffmpeg -i input.mp4 -ss 5 -t 15 output_15s.mp4         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│ 4. REPURPOSE (Higgsfield / Cloud Tools)                    │
│    Use /repurpose skill:                                   │
│    - 16:9 landscape (YouTube)                             │
│    - 9:16 vertical (TikTok/Reels)                         │
│    - 1:1 square (Instagram feed)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│ 5. SOCIAL DISTRIBUTION                                      │
│    /social-media-content-engine:                           │
│    - Schedule posts across 4+ platforms                    │
│    - Auto-generate captions & hashtags                     │
│    - Track performance metrics                             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│ 6. MONETIZE                                                 │
│    - YouTube (Ad revenue, memberships)                     │
│    - STARLIGHTMIX Studio (embed in courses)               │
│    - Patreon (exclusive content)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Your Complete Video Toolkit

| Tool | Purpose | Status |
|---|---|---|
| **ManimGL** | Mathematical animations | ✅ Installed |
| **Higgsfield** | Image/video generation, upscaling | ✅ Available (cloud) |
| **HyperFrames** | RHYTHMIX promo compositions | ✅ Available (cloud) |
| **Pollinations** | Free text-to-video (Nova Reel) | ✅ Available (cloud) |
| **FFmpeg** | Video cutting, format conversion | ✅ Installed |
| **Replicate** | FLUX images, music generation | ✅ Available (cloud) |
| **Figma** | Export timelines as MP4 | ✅ Available (cloud) |
| **Canva** | Design social posts & thumbnails | ✅ Available (cloud) |
| **ElevenLabs** | Voice narration | ✅ Available (cloud) |

---

## Complexity Theory Content Calendar

### Month 1: Foundations (6 videos)

**Week 1: Sandpile Model**
- `SandpileIntro` (3 min) — What is self-organized criticality?
- `SandpileGrid` (2 min) — The 2D cellular automaton
- `ToppleAnimation` (2 min) — How cells cascade

**Week 2: Power Laws & Criticality**
- `AvalancheMagnitude` (3 min) — Heavy-tailed distributions
- `CriticalExponent` (2 min) — Understanding exponents
- `FractalPattern` (3 min) — Fractals in nature

### Month 2: Advanced Topics (6+ videos)

- Game of Life criticality
- Earthquakes & seismic cascades  
- Forest fires model
- Brain criticality
- Stock market avalanches

---

## Command Examples

### Render Quality Comparison
```bash
# Test (fast, low quality)
manimgl sandpile_animation.py SandpileIntro -ql --write_to_movie
# Time: ~2-5 min | Output: 480p

# Medium quality
manimgl sandpile_animation.py SandpileIntro -qm --write_to_movie
# Time: ~10-20 min | Output: 720p

# Production quality
manimgl sandpile_animation.py SandpileIntro -qh --write_to_movie
# Time: ~30-60 min | Output: 1080p
```

### Create 15-Second Clip for TikTok
```bash
# Render the full video
manimgl sandpile_animation.py SandpileIntro -qh --write_to_movie

# Extract 15s clip starting at 5 seconds
ffmpeg -i media/videos/sandpile_animation/1080p60/SandpileIntro.mp4 \
  -ss 5 -t 15 -vf "scale=1080:1920" sandpile_15s_vertical.mp4
```

### Render Multiple Scenes (Batch)
```bash
bash render_complexity_videos.sh qh        # All scenes, HD quality
bash render_complexity_videos.sh ql intro  # Just intro scene, low quality
```

---

## File Organization

```
~/jamie-wigg/
├── MANIMGL-SETUP.md                 ← Installation guide
├── MANIMGL-INTEGRATION.md           ← This file
├── sandpile_animation.py            ← Example scenes
├── render_complexity_videos.sh       ← Batch render script
│
├── media/
│   └── videos/
│       ├── sandpile_animation/
│       │   ├── 480p15/              ← Low quality (testing)
│       │   ├── 720p30/              ← Medium quality
│       │   └── 1080p60/             ← Production quality
│       └── ...
│
├── docs/
│   └── METRICS.md                   ← Track video performance
│
└── social/                          ← Social media clips
    ├── sandpile_intro_15s.mp4       ← TikTok/Reels variant
    ├── sandpile_intro_30s.mp4       ← YouTube Shorts variant
    └── sandpile_intro_square.mp4    ← Instagram feed
```

---

## Integration with Existing Ecosystem

### 1. Create Narration
```python
# Use Higgsfield generate_audio for TTS
# Or Pollinations respondAudio for free tier
from higgsfield import generate_audio

narration = generate_audio(
    model="text2speech_v2_elevenlabs",
    prompt="Self-organized criticality explains why...",
    voice_id="alloy"
)
```

### 2. Add Background Music
```bash
# Use Suno v5 (Pollinations) for royalty-free music
# Or Replicate for MusicGen models
```

### 3. Create Thumbnail
```bash
# Use Higgsfield generate_image for 1280x720 thumbnail
# Or Pollinations FLUX for free tier
```

### 4. Build Landing Page
```bash
# Run /site-build to create full promo site
# Embed ManimGL video + lesson notes
```

### 5. Schedule Social Posts
```bash
# Use /social-media-content-engine
# Auto-posts to TikTok, Instagram, YouTube Shorts
# Tracks engagement metrics
```

---

## Performance Metrics to Track

Update `docs/METRICS.md` weekly:

```markdown
## Video Content Performance

| Video | Views | Engagement | Platform | Date |
|---|---|---|---|---|
| SandpileIntro | 1.2k | 8% CTR | YouTube | 2026-06-26 |
| AvalancheMagnitude | 850 | 12% CTR | TikTok | 2026-06-26 |
| FractalPattern | 650 | 15% CTR | Instagram | 2026-06-26 |
```

---

## Next Steps

### Immediate (This Week)
1. ✅ **ManimGL installed** — already done
2. **[ ] Run first render:**
   ```bash
   cd ~/jamie-wigg
   manimgl sandpile_animation.py SandpileIntro -ql --write_to_movie
   ```
3. **[ ] Review output** in `media/videos/`
4. **[ ] Extract 15s clip** for TikTok

### Short-term (Weeks 2-4)
1. **Create 6 videos** (one per scene in sandpile_animation.py)
2. **Generate variants** (15s, 30s, 45s, 1:1) using /repurpose
3. **Schedule social posts** using /social-media-content-engine
4. **Track metrics** in docs/METRICS.md

### Long-term (Months 2-3)
1. **Extend to 20+ videos** covering all complexity topics
2. **Create interactive course** on STARLIGHTMIX Studio
3. **Launch YouTube channel** with weekly uploads
4. **Monetize** via ads, memberships, sponsored content

---

## Troubleshooting

### "Cannot connect to display"
**Solution:** This is expected in headless environments. Use `--write_to_movie` flag to render to file without display.

### Video renders but no sound
**Solution:** ManimGL doesn't handle audio. Generate audio separately (ElevenLabs/Pollinations), then combine with FFmpeg:
```bash
ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac output.mp4
```

### LaTeX errors
**Solution:** Ensure all LaTeX packages are installed:
```bash
sudo apt install texlive texlive-latex-extra texlive-fonts-extra
```

### Slow rendering
**Solution:** Use `-ql` for testing, only render to `-qh`/`-qk` for final output.

---

## Resources

- **ManimGL Docs:** https://docs.manim.community/
- **3Blue1Brown Examples:** https://github.com/3b1b/videos
- **Community:** https://www.manim.community/
- **Math Visualization:** https://en.wikipedia.org/wiki/Self-organized_criticality

---

## Summary

You now have a **complete scientific video creation pipeline** for complexity theory education:

✅ **ManimGL** for mathematical animations  
✅ **Cloud tools** for AI-generated assets  
✅ **Social distribution** infrastructure  
✅ **Analytics** to track performance  

**You can create professional complexity theory videos today.**

Ready to render your first video? 👇

```bash
cd ~/jamie-wigg
manimgl sandpile_animation.py SandpileIntro -ql --write_to_movie
```
