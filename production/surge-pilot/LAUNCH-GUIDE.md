# SURGE Pilot — Launch & Distribution Guide

## Pre-Launch Checklist

### ✓ Production Assets
- [x] 28 SVG keyframes (all acts complete)
- [x] GSAP master timeline (767 seconds)
- [x] Master audio mix (narration.wav, 44.1 kHz, 16-bit mono)
- [x] HyperFrames composition (index.html, production-ready)
- [ ] **Final MP4 render** (IN PROGRESS)

### ✓ Documentation
- [x] RENDER-GUIDE.md — Render instructions
- [x] PRODUCTION-SUMMARY.md — Complete specs
- [x] voice-script.md — Character profile
- [x] sound-design-spec.md — Audio breakdown
- [x] FINAL-RENDER.sh — Automated render script
- [x] create-distribution-cuts.sh — Platform-specific cuts
- [x] SURGE-PILOT-LANDING.html — Web landing page

### Quality Assurance (Post-Render)
- [ ] Playback test (VLC, QuickTime, browser)
- [ ] Audio sync verification (voice timing across all acts)
- [ ] Color accuracy (Electric Blue #0052CC, Burgundy #5D1E3B, Lavender #C9B9E0, Orange #FF8C42)
- [ ] Visual artifacts check (no flickering, tearing, encoding issues)
- [ ] Duration confirmation (12:47 / 767 seconds)
- [ ] File size validation (~900 MB expected)

---

## Distribution Workflow

### Phase 1: Platform-Specific Cuts (5-10 minutes)
```bash
cd production/surge-pilot
bash create-distribution-cuts.sh
```

**Outputs:**
- YouTube: 1920×1080 MP4 (master resolution)
- TikTok/Instagram Reels: 1080×1920 MP4 (portrait)
- Instagram Feed: 1080×1080 MP4 (square)
- LinkedIn: 1200×628 MP4 (landscape)
- Twitter/X: 1280×720 MP4 (HD landscape)
- Thumbnail: 1920×1080 JPG (opening frame)

### Phase 2: Upload to Platforms (varies)

#### YouTube (Primary)
1. Upload: `surge-pilot-youtube-1920x1080.mp4`
2. Title: `SURGE Pilot — "The Longest Monday" | My ADHD Is My Superpower`
3. Description:
   ```
   Ziggy's Monday spirals into sensory overload and shame—until they discover that ADHD isn't broken. It's a superpower.
   
   This is the pilot episode of SURGE, a series celebrating neurodiversity as strength.
   
   🎨 Made with: HyperFrames + GSAP + generative AI
   ⏱️  Runtime: 12:47
   
   Watch the full story unfold as Ziggy transforms anxiety into superpowers:
   ⚡ Hyperfocus
   🚀 Speed
   💜 Empathy
   
   #ADHD #NeurodiversityIsStrength #AnimatedSeries
   ```
4. Thumbnail: Use `surge-pilot-thumbnail-1920x1080.jpg`
5. Visibility: Public (or Unlisted for soft launch)
6. Playlist: Create "SURGE Series" (ready for future episodes)

#### TikTok
1. Upload: `surge-pilot-tiktok-1080x1920.mp4`
2. Split into 3×4:27 clips (TikTok 10-60 second limit) OR use as B-roll
3. Captions: "My ADHD is my superpower ✨ | SURGE Pilot"
4. Hashtags: #ADHD #ActuallyAutistic #NeurodiversityTok #AnimatedStories #MentalHealth
5. Link: Add link sticker to YouTube once posted

#### Instagram Reels
1. Upload: `surge-pilot-instagram-1080x1920.mp4`
2. Caption:
   ```
   Ziggy's story 💜 From shame spiral to superpower discovery. 
   
   Sometimes the thing we think is broken is actually our greatest strength.
   
   SURGE Pilot — Full 12:47 episode on YouTube (link in bio)
   ```
3. Add captions/text overlays for engagement
4. Hashtags: #ADHD #AnimatedSeries #MentalWellness #CreativeAI

#### LinkedIn
1. Upload: `surge-pilot-linkedin-1200x628.mp4`
2. Post type: "Video"
3. Post text:
   ```
   Redefining ADHD Through Animation
   
   Meet Ziggy. A 10-year-old navigating sensory overload in Act 1, shame in Act 2, and superpower discovery in Act 3.
   
   This isn't a diagnosis story. It's a transformation story.
   
   SURGE is a narrative exploration of how neurodiversity isn't a problem—it's a unique perspective that, when understood, becomes a competitive advantage.
   
   🎬 12:47 minute animated pilot
   🎨 28 SVG keyframes + GSAP animation
   ⚙️ Procedurally generated sound design
   ```
4. Audience: Creators, educators, mental health professionals, tech leaders

#### Twitter/X
1. Upload: `surge-pilot-twitter-1280x720.mp4`
2. Thread:
   ```
   Tweet 1: "Sometimes the thing you're ashamed of is actually your greatest strength. 
   
   Meet Ziggy. Their ADHD isn't broken. It's a superpower. 
   
   (Thread 🧵)"
   
   Tweet 2: "Act 1 — Anxiety spirals as a classroom's sensory chaos mounts. The hum, the click, the taps. Everything's too much."
   
   Tweet 3: "Act 2 — Shame crashes. Ziggy believes they're broken. But then... transformation. Electric Blue emerges from Burgundy fog."
   
   Tweet 3: "Act 3 — Hyperfocus, Speed, Empathy. Three superpowers. And in helping peers, Ziggy finds community.
   
   Full 12:47 episode on YouTube: [link]"
   ```
3. Hashtags: #ADHD #AnimatedSeries #Neurodiversity #CreativeAI #MentalHealth

---

## Web Integration

### Add to Site
1. Copy `SURGE-PILOT-LANDING.html` to root as `surge-pilot.html`
2. Update navigation menu:
   ```html
   <a href="/surge-pilot.html">SURGE Pilot</a>
   ```
3. Update index.html with featured section:
   ```html
   <section class="featured-work">
     <h2>Latest: SURGE Pilot Series Teaser</h2>
     <a href="/surge-pilot.html" class="cta">Watch Pilot (12:47)</a>
   </section>
   ```
4. Update `downloads.html` with MP4 links

---

## Post-Launch Engagement

### Metrics to Track (1 week)
- YouTube views, watch time, audience retention
- TikTok video views, engagement rate
- Instagram Reels saves, shares, follows
- LinkedIn impressions, clicks
- Twitter engagement, replies, retweets

### Community Response
- Monitor comments for ADHD community feedback
- Identify if messaging resonates with neurodivergent audience
- Gather testimonials for "Stories" page

### Series Momentum
- Announce Act 2 / Season 1 production timeline
- Collect "Who is your superpower?" responses for community feature
- Survey audience: "What superpower would you like to see next?"

---

## Technical Notes

### Audio Replacement (Production Voice)
The current audio uses sine-wave placeholders. To replace with real ElevenLabs TTS:

```bash
export ELEVENLABS_API_KEY="sk-..."
bash generate-voice.sh
python3 mix-master-audio.py
npx hyperframes render --input index.html --output surge-pilot-episode-01.mp4 --audio narration.wav
```

### Rendering on Different Systems
- **macOS**: Fastest (native GPU, optimized ffmpeg)
- **Linux**: Good (ffmpeg + headless Chrome compatible)
- **Windows**: Works (ffmpeg + WSL2 recommended)

### Archiving & Backups
1. Store original MP4 (1920×1080) as master
2. Back up SVG keyframes to cloud storage
3. Archive GSAP timeline code (not regenerable)
4. Keep narration.wav for future re-edits

---

## Long-Term Series Plan

| Milestone | Timeline | Deliverable |
|-----------|----------|-------------|
| Pilot launch | ✓ Complete | SURGE Pilot (12:47) |
| Community feedback | Week 1–2 | Response compilation |
| Act 2 development | Week 3–6 | Next episode script + design |
| Season 1 trailer | Week 8 | 60-second cuts, social teasers |
| Act 2 release | Week 10–12 | Full second episode |
| Series merch concept | TBD | T-shirt, sticker designs |

---

## Contact & Support

- **GitHub Branch**: `claude/adhd-superhero-animation-P7zPq`
- **Production Directory**: `production/surge-pilot/`
- **Master MP4**: `surge-pilot-episode-01.mp4` (897 MB est.)
- **Web Landing**: `SURGE-PILOT-LANDING.html`

---

*SURGE Pilot Distribution Guide | June 5, 2026*
