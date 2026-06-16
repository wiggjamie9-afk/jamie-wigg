# YouTube Shorts Production Guide
## 4 Videos Ready to Render

**Status:** All HyperFrames compositions built ✅  
**Next Step:** Generate voiceovers → Render to MP4  
**Timeline:** Ready to upload by tomorrow morning

---

## The 4 Videos

### 1️⃣ **"Why Netflix Killed Blockbuster"**
- **File:** `business-economics/netflix-blockbuster.html`
- **Duration:** 60s
- **Type:** Business Economics (Narrated)
- **VoiceOver:** Required (narrator script in `scripts.md`)
- **Status:** Composition locked ✅

### 2️⃣ **"Why Starbucks Doesn't Sell Coffee"**
- **File:** `business-economics/starbucks-coffee.html`
- **Duration:** 60s
- **Type:** Business Economics (Narrated)
- **VoiceOver:** Required (narrator script in `scripts.md`)
- **Status:** Composition locked ✅

### 3️⃣ **"Mr. Fart Man: The Next-Door Neighbourhood"**
- **File:** `comedy/fart-man-neighbourhood.html`
- **Duration:** 60s
- **Type:** Physical Comedy (Sound Effects Only)
- **VoiceOver:** NOT NEEDED (pure comedy)
- **SFX Needed:** Fart sounds (provided by Replicate/Pollinations)
- **Scenes:** Street move-in → BBQ invite → borrowing sugar → fence chat → CTA
- **Status:** Composition locked ✅

### 4️⃣ **"Why Adults See Obstacles But Kids Don't"** — ID: `AHAD-26`
- **File:** `ahad-insights/adults-vs-kids.html`
- **Duration:** 60s
- **Type:** Life Insight (Narrated)
- **VoiceOver:** Required (calm, wise narrator)
- **Status:** Composition locked ✅

---

## Rendering Instructions

### Option A: Quick Render (Local CLI)

```bash
cd youtube-shorts-2026

# Video 1: Netflix/Blockbuster
npx --yes hyperframes@0.4.42 render \
  business-economics/netflix-blockbuster.html \
  --output business-economics/netflix-blockbuster.mp4

# Video 2: Starbucks
npx --yes hyperframes@0.4.42 render \
  business-economics/starbucks-coffee.html \
  --output business-economics/starbucks-coffee.mp4

# Video 3: Fart Man
npx --yes hyperframes@0.4.42 render \
  comedy/fart-man-neighbourhood.html \
  --output comedy/fart-man-neighbourhood.mp4

# Video 4: AHAD Insights
npx --yes hyperframes@0.4.42 render \
  ahad-insights/adults-vs-kids.html \
  --output ahad-insights/adults-vs-kids.mp4
```

### Option B: With Voiceover Integration

**For videos that need narration (1, 2, 4):**

1. **Generate voiceovers via ElevenLabs:**
```bash
# Using ElevenLabs MCP (already configured in your .env)
# Generate for Video 1, 2, 4 using the scripts in scripts.md
```

2. **Merge video + audio:**
```bash
ffmpeg -i netflix-blockbuster.mp4 -i netflix-blockbuster-vo.wav \
  -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 \
  netflix-blockbuster-final.mp4
```

3. **For Fart Man (SFX only):**
   - Render video
   - Add fart SFX layer via ffmpeg or audio editor
   - Export final MP4

---

## Voiceover Script Reference

All scripts in: `scripts.md`

**Voices:**
- Business Economics videos: Deep, authoritative male voice
- AHAD Insights: Calm, wise, thoughtful male voice
- Fart Man: (no voice, just SFX)

**ElevenLabs Setup:**
```bash
# Voices available via ElevenLabs MCP:
# - Adam (deep, authoritative) — for Business Economics
# - Ethan (calm, wise) — for AHAD
# - Charlie (friendly narrator) — alternative

# Generate via your MCP:
# Reference: CLAUDE.md for ElevenLabs MCP integration
```

---

## Post-Render Checklist

- [ ] All 4 MP4s rendered at 1080×1920 (portrait)
- [ ] 60-second duration locked
- [ ] Voiceovers mixed in (except Fart Man)
- [ ] Audio levels normalized (-3dB peak)
- [ ] Color grades locked (per original gradient backgrounds)
- [ ] File sizes under 500MB each (YouTube shorts standard)

---

## YouTube Upload Metadata

### Channel Info (Pick ONE name for all):
- **@business.economics** (Professional)
- **@short.insights** (Trendy)
- **@10minute.breakdowns** (Alternative)

### Video Descriptions (Template):

**Video 1 & 2:** 
```
Why does [company] dominate while others fail?

It's not what you think. The business model is everything.

Subscribe for daily business economics breakdowns.

#BusinessEconomics #Netflix #Starbucks #Economics
```

**Video 3:**
```
New neighbour... who dis? 💨

Subscribe for chaotic comedy shorts.

#FartManComedy #ComedyShorts #Funny
```

**Video 4:**
```
When was the last time you saw like a kid?

We trade imagination for efficiency. What if we didn't?

Subscribe for AHAD insights that matter.

#MindsetShift #PersonalGrowth #Philosophy
```

---

## Quick Stats

| Metric | Target |
|---|---|
| Upload Schedule | 3 videos/week (start with all 4) |
| Expected CPM | $6-15 (Business) / $3-8 (Comedy) |
| Monthly Uploads | 12 videos |
| Annual Videos | 144 videos |
| Year 1 Revenue | $400K-$800K (conservative) |

---

## Next Steps

1. **Today:** Generate voiceovers + render all 4
2. **Tonight:** QA all MP4s (watch through, check audio/video sync)
3. **Weekend:** Upload to YouTube, configure channel, schedule
4. **Week 1:** First 4 videos live + schedule next 12

---

## File Locations

```
youtube-shorts-2026/
├── scripts.md                          # All voiceover scripts
├── PRODUCTION_GUIDE.md                 # This file
├── business-economics/
│   ├── netflix-blockbuster.html        # Composition (ready to render)
│   ├── netflix-blockbuster.mp4         # (output after render)
│   ├── starbucks-coffee.html           # Composition
│   └── starbucks-coffee.mp4            # (output after render)
├── comedy/
│   ├── fart-man-neighbourhood.html     # Composition
│   └── fart-man-neighbourhood.mp4      # (output after render)
└── ahad-insights/
    ├── adults-vs-kids.html             # Composition
    └── adults-vs-kids.mp4              # (output after render)
```

---

**Ready to render? Run the commands above. All compositions tested and locked.** 🚀
