# SURGE Pilot — Final Render Guide

**Status**: ✅ PRODUCTION-READY  
**Visual**: 28 SVG keyframes + HyperFrames composition ✓  
**Audio**: Master audio mix (narration.wav) ✓  
**Format**: 1920×1080 @ 30fps, H.264 video + AAC audio  
**Target Runtime**: 12:47 (767 seconds)

---

## Render Instructions

### Local Rendering (Recommended)

The HyperFrames CLI is the official renderer for this project.

```bash
# Install HyperFrames CLI (if not already installed)
npm install -g hyperframes

# From the surge-pilot directory:
cd production/surge-pilot

# Render to MP4 (with audio)
npx hyperframes render \
  --input index.html \
  --output surge-pilot-episode-01.mp4 \
  --audio narration.wav \
  --format h264 \
  --bitrate 8000k

# OR use the wrapper script:
bash render.sh
```

### Rendering via Docker (if local setup is complex)

```bash
docker run --rm \
  -v $(pwd):/workspace \
  hyperframes/cli:latest \
  render --input index.html --output surge-pilot.mp4 --audio narration.wav
```

---

## Troubleshooting

### Issue: "narration.wav not found"
**Solution**: Ensure audio generation completed:
```bash
python3 mix-master-audio.py  # Re-generate master audio
ls -lh narration.wav         # Verify file exists
```

### Issue: "GSAP timeline not running"
**Solution**: Check browser console in HyperFrames preview:
```bash
npx hyperframes preview  # Test composition before rendering
```

### Issue: "Composition too long" (>30min)
**Solution**: Our composition is 12:47, well within limits. If error persists:
```bash
# Check index.html for syntax errors
npx hyperframes lint
```

---

## Output Specification

| Property | Value |
|----------|-------|
| **Format** | MP4 (H.264 video + AAC audio) |
| **Resolution** | 1920×1080 (16:9 landscape) |
| **Frame Rate** | 30 fps |
| **Bitrate** | 8000 kbps (video) + 192 kbps (audio) |
| **Duration** | 12:47 (767 seconds) |
| **File Size (est.)** | ~900 MB |
| **Color Space** | sRGB / Rec.709 |
| **Audio Channels** | Stereo (2.0) |
| **Audio Sample Rate** | 44.1 kHz |

---

## Quality Checklist

Before distributing, verify:

- [ ] Video plays without artifacts or stuttering
- [ ] Audio syncs properly with all scenes
- [ ] Color palette matches brand spec (Electric Blue, Orange, Lavender, Burgundy)
- [ ] Interior monologue text and voice timing match
- [ ] No scene jumps or transitions are jarring
- [ ] Final frame (series teaser) displays clearly for 1+ second
- [ ] File plays on YouTube/Vimeo without re-encoding warnings

---

## After Rendering

1. **Test Playback**: Play the file in multiple players (VLC, web browser, phone)
2. **Audio Check**: Verify no clipping or distortion (target: -3dB headroom)
3. **Distribute**:
   - YouTube: 1920×1080 MP4, H.264, AAC (standard upload)
   - Social media: Re-encode to platform specs (TikTok: 1080×1920, etc.)
   - Archive: Store original 1920×1080 as master

---

## File Locations

```
production/surge-pilot/
├── index.html                    # HyperFrames composition (FINAL)
├── narration.wav                 # Master audio (12:47, 30MB)
├── assets/keyframes/             # 28 SVG animation frames
│   └── shot-01 through shot-28
├── sound-design/                 # Audio layer stems
│   ├── act-1-ambient.wav
│   ├── act-2-sensory.wav
│   ├── act-3-transformation.wav
│   └── epilogue-teaser.wav
├── ziggy-voice/                  # Voice narration tracks
│   ├── line-1-1-wait-what.wav
│   ├── line-1-2-sensory.wav
│   ├── line-3-1-this-is-me.wav
│   └── line-3-2-never-broken.wav
├── render.sh                     # Render script
├── RENDER-GUIDE.md              # This file
└── [OUTPUT]
    └── surge-pilot-episode-01.mp4  # FINAL DELIVERABLE
```

---

## Version History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 0.1 | 2026-06-05 | DRAFT | Visual + audio composition ready |
| 1.0 | TBD | COMPLETE | Final rendered MP4 |

---

## Support

For HyperFrames CLI issues:
- https://github.com/hyperframes/cli/issues
- https://docs.hyperframes.ai/

For SURGE project questions:
- See PRODUCTION-SUMMARY.md
- See sound-design-spec.md
- See voice-script.md
