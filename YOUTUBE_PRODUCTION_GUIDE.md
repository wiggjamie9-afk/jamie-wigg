# YouTube Production Guide: Agent Builder Course

Complete guide for recording, editing, and publishing your Agent Builder course videos. Designed for solo production on Mac with professional quality and 1-2 hour per video setup.

---

## Part 1: Recording Setup

### OBS Studio Configuration (macOS)

**Installation:**
```bash
# Via Homebrew
brew install obs

# Or download from https://obsproject.com/download
```

**Profile Setup:**
1. Open OBS → Click "+" under Profiles → Create "AgentBuilder"
2. Scene Collection → Create "AgentBuilder" (+ button)

**Scene Layout for Code Videos:**
- **Scenes to create:**
  - Main Screen (1920×1080, full code editor)
  - Split Code (code left, webcam right for talking)
  - Presentation (slides/diagrams full screen)
  - Intro/Outro (title card)

**Main Screen Scene Setup:**
1. Add Source → Screen Capture → Select your main monitor
2. Crop to code editor (usually right half of screen)
3. Settings: Encoding: H.264, Bitrate: 5000 Kbps, Resolution: 1920×1080, 30fps

**Split Code Scene (for talking-head sections):**
1. Add source: Screen Capture (code editor, position left 0-1280px)
2. Add source: Video Capture Device (your webcam, position right 1280-1920px)
3. Audio: Mic (for talking), System Audio (for code typing clicks if desired)

**Presentation Scene (for slides/diagrams):**
1. Add source: Window Capture → select browser/presentation app
2. Resize to fill 1920×1080
3. Position webcam overlay in bottom right (320×240)

**Intro/Outro Scene:**
- Color source: #0F172A (RHYTHMIX Slate from BRAND)
- Text source: "Building X with Next.js 15" (centered, white, 72pt Inter)
- Smaller text: "Agent Builder Course" (40pt gray)
- Logo: upload `design/RHYTHMIX.svg` as image (top left, 200px)

**Audio Levels:**
- Mic: -18dB to -6dB when speaking (avoid peaking into red)
- System audio: -12dB (for keyboard sounds if included)
- Desktop audio: disabled during code sessions

**Recording Settings:**
- Format: MP4
- Encoder: Hardware (Video Toolbox on Mac M1/M2)
- Audio codec: AAC
- Bitrate: 5000 Kbps (video), 192 Kbps (audio)
- Output directory: `~/Videos/AgentBuilder/`

**Stream settings (optional, for live versions):**
- Service: YouTube (if streaming to a waiting list first)
- Bitrate: 4500 Kbps (leave headroom for network)

---

## Part 2: Pre-Recording Checklist

**Setup (5 min):**
- [ ] Quit Slack, Discord, email, browser notifications
- [ ] Enable Do Not Disturb
- [ ] Mute phone
- [ ] Check mic input levels (no hum, -18dB peak)
- [ ] Test monitor brightness (code clearly visible)
- [ ] Have script/outline in second monitor or printed

**Project setup (5 min):**
- [ ] Open terminal, navigate to project
- [ ] Run `npm run dev` (Next.js dev server starts)
- [ ] Verify localhost:3000 loads (or 3001 if taken)
- [ ] Open browser DevTools in side panel, minimize
- [ ] Open VS Code with project root open
- [ ] Position code editor to fill OBS-captured area

**Recording readiness:**
- [ ] OBS scene correct (Main Screen or Split Code)
- [ ] Audio input showing green levels
- [ ] Test file location confirmed (`~/Videos/AgentBuilder/`)
- [ ] Scene transitions disabled (instant cut)

---

## Part 3: Recording Best Practices

### Pacing and Energy
- **Speak at 140 WPM** (slightly faster than conversational; more engaging)
- **Pause for 1-2 seconds** after key points (gives viewers time to process)
- **Vary tone** (not monotone; up-tick at end of question, lower at conclusions)
- **Energy level:** 7/10 (enthusiastic but not theatrical)

### Code Recording Tips
- **Font size:** 18-20pt in VS Code (readable at 1920×1080)
- **Theme:** One Dark Pro or similar dark theme (good contrast, less eye strain)
- **Hide:** distracting UI (file tree breadcrumbs, minimap). Show only code.
- **Typing pace:** Type naturally (~60 WPM), pause 2-3 sec after pasting code blocks
- **Mouse pointer:** Use cursor highlighting in OBS (highlight color: #F97316 RHYTHMIX Orange)
- **Copy-paste okay:** Paste snippets if > 5 lines; manually type < 5 lines (shows ownership)
- **Error recovery:** If typo, fix it mid-record; don't stop/start (viewers like authenticity)

### Talking Head Tips (Split Code scene)
- **Framing:** Shoulders to frame, eyes 1/3 down screen, good natural lighting
- **Background:** Desk, shelves (nothing corporate/bland). RHYTHMIX blue accent light optional.
- **Dress:** Solid color (not white, not busy patterns). Navy, dark gray, black work well.
- **Eye contact:** Look at camera (not monitor). Imagine viewer 3 feet away.
- **Hands:** Natural gestures OK; avoid tapping desk (mic picks it up)

### Recording Duration Targets
- **Week 1 Hook video:** 4-6 min (intro + live demo + CTA)
- **Tech deep-dive:** 10-15 min (enough for depth, not exhausting)
- **Advanced feature:** 12-18 min (include build-from-scratch)
- **Monetization/AMA:** 8-12 min (Q&A format, split with graphics)

---

## Part 4: Editing Workflow (DaVinci Resolve)

**Installation:**
```bash
brew install davinci-resolve
# Or https://www.blackmagicdesign.com/products/davinci
```

**Basic Workflow:**

1. **Import**
   - File → Import → Select `~/Videos/AgentBuilder/recording.mp4`
   - Drag to timeline

2. **Cut editing** (5-10 min per hour of recorded)
   - Play through, mark awkward pauses with "In" at start, "Out" at end
   - Delete sections: right-click → Delete (ripple)
   - Reduce dead time: 2 sec max between sentences

3. **Color correction** (2-3 min)
   - Clips → Color → Auto Enhance (or manual: Whites +5, Blacks -5, Contrast +3)
   - Adjust code visibility if needed (Gamma +10 if dark)

4. **Audio processing** (3-5 min)
   - Select audio track
   - Fairlight → Compressor (ratio 4:1, threshold -20dB, for even levels)
   - Noise reduction if needed (Vegas Noise Gate, threshold -40dB)
   - Output: -3dB peak (leave headroom for YouTube)

5. **Add intro/outro** (2-3 min)
   - Create intro: Create blank 5-sec clip with color (slate) + title text
   - Create outro: 3-sec slide with CTA ("Subscribe", email, course link)
   - Insert at timeline start and end

6. **Graphics and overlays** (5-10 min per section)
   - Titles: Key points as lower-third text (2-3 sec duration)
   - Zoom: Zoom in on interesting code sections (5-10% scale, 0.5 sec duration)
   - Arrows/highlights: Point to buttons/code with animated arrows
   - Subtitles: Optional (increases retention +20%)

7. **Transitions** (1-2 min)
   - Default: Cut (no transition)
   - Between major sections: Fade (0.3 sec)
   - Scene changes: Dissolve (0.5 sec)
   - Avoid motion effects (distraction from content)

8. **Export**
   - File → Export → YouTube Profile (preset)
   - Resolution: 1920×1080, 30fps
   - Bitrate: 5000-8000 Kbps
   - Audio: 192 Kbps AAC
   - Output: `~/Videos/AgentBuilder/exports/Week1-Day1-Hook.mp4`

---

## Part 5: YouTube Upload Process

### Pre-Upload Checklist
- [ ] Video file: < 256MB (YouTube max for most accts; uncommon but check)
- [ ] Filename: `Week1-Day1-Hook-Agent-Builder.mp4` (descriptive)
- [ ] Thumbnails: 1280×720px PNG, created (see below)
- [ ] Title: < 60 char, includes keyword ("Agent Builder", "SaaS", "Next.js 15")
- [ ] Description: Pasted and formatted (see template below)
- [ ] Tags: 5-10 tags added (see template)

### Thumbnail Creation

Use Figma or Canva. Template specs:
- **Size:** 1280×720px
- **Safe zone:** 60px margin on all sides
- **Font:** Inter Bold (white, 48-60pt for main text)
- **Contrast:** Bright overlays on dark or RHYTHMIX color blocks
- **Face/emotion:** If you appear, show clear expression (surprised, excited, thinking)
- **Elements:** Main title (e.g., "Next.js 15 SaaS"), your face/avatar (200×200), 1 icon (Figma, code brackets, etc.)

**Quick template (Canva):**
1. Create 1280×720 design
2. Background: RHYTHMIX Purple (#9333EA) or solid color
3. Text: "Agent Builder" (white, 72pt, bold, center-left)
4. Subtext: "Week 1" or feature name (40pt, white, 50% opacity)
5. Icon/graphic: Right side (code icons, STARLIGHTMIX logo, etc.)
6. Export as PNG

**Batch thumbnails for series:** Create template once, duplicate 11 times, change text. ~5 min total.

### YouTube Upload & Publishing

**URL:** https://www.youtube.com/studio/content/videos/new

1. **Upload video** (takes 5-10 min depending on file size)
   - Click "Upload videos"
   - Drag file or browse
   - Check processing bar

2. **Details tab**
   - **Title:** `Building a SaaS Agent Builder Platform — Week 1, Day 1 Hook` (60 char)
   - **Description:** (see template below, ~300 words)
   - **Visibility:** Unlisted (until you're ready to publish all Week 1)

3. **Thumbnail**
   - Click "Upload thumbnail"
   - Select PNG file (1280×720)
   - YouTube auto-generates 3; use your custom one

4. **Tags**
   - Add: `Agent Builder`, `Next.js 15`, `SaaS`, `React 19`, `Supabase`
   - Add: `Web Development`, `Full Stack`, `Tutorial`

5. **Playlist**
   - Create playlist: "Agent Builder SaaS Course"
   - Add video to it

6. **Publish**
   - Set premiere date/time (optional; if all videos done, publish immediately)
   - OR Schedule for specific time (e.g., Mon 9am)
   - Click "Schedule" or "Publish"

### YouTube Description Template

```
[Hook/Problem Statement - 2-3 sentences]
In this first video of the Agent Builder course, I show you how to build a full-stack SaaS platform for creating AI agents. We'll build together with Next.js 15, React 19, Supabase, and deploy to production.

[What You'll Learn - Bullet list]
✅ How the 5-step Agent Builder workflow works
✅ Stack overview: Next.js 15, React 19, Tailwind v4, TypeScript
✅ Core concepts: Agent, Environment, Session, Event
✅ Live demo of the dashboard and builder
✅ Why this stack and when to use it

[Course Structure]
This is part of the complete Agent Builder SaaS course:
📧 Email: [your email for course signups]
🎓 Course landing page: [link to course site]
⭐ Star the repo: [GitHub repo link]

[CTA]
🔔 Subscribe and turn on notifications
💬 Comment what you'd build with this
📝 Next video: "Authentication with Supabase Row-Level Security" (coming Wednesday)

[Social Links]
GitHub: [your GitHub]
Twitter/X: [your handle]
Email: [email]
```

---

## Part 6: Weekly Production Schedule

**Monday:**
- Record Week N, Day 1 video (4-6 min)
- Edit while fresh (2-3 hours for first video, ~1 hour after)
- Upload unlisted, write description, create thumbnail
- Review and schedule publish for Tuesday 9 AM

**Wednesday:**
- Record Week N, Day 2 video
- Edit afternoon (1-1.5 hours)
- Upload, schedule for Thursday 9 AM

**Friday:**
- Record Week N, Day 3 video
- Edit (1-1.5 hours)
- Publish immediately or schedule for Saturday 9 AM

**Saturday-Sunday (async):**
- Respond to comments (15-30 min daily)
- Check analytics
- Plan next week's topics based on feedback

---

## Part 7: Equipment & Environment

**Recommended setup (minimal):**
- **Mac M1/M2** (can record 1080p video + dev server simultaneously)
- **Mic:** AirPods Pro (built-in) or USB-C mic (Blue Yeti ~$100)
- **Lighting:** Ring light or 2× desk lamps (avoid harsh shadows)
- **Desk:** Clean, uncluttered (code is the focus, not decor)
- **Monitor:** 27" 1080p external monitor (makes code bigger for OBS crop)

**Optional (higher production):**
- **Wireless mic:** Rode Wireless GO II ($150, less cable noise)
- **Camera:** Logitech C920 ($40-60, better than MacBook built-in webcam)
- **Background:** Pop-up green screen with RHYTHMIX color backdrop (~$30)
- **Teleprompter:** iPad stand + Google Docs (read script without looking down)

**Software stack:**
- **Recording:** OBS Studio (free)
- **Editing:** DaVinci Resolve (free tier, professional-grade)
- **Thumbnails:** Figma (free) or Canva (free)
- **Outline/scripting:** Google Docs or Notion
- **Analytics:** YouTube Studio (built-in)

---

## Part 8: Performance Tracking

**Metrics to monitor (YouTube Studio > Analytics):**

| Metric | Target | Action if below target |
|---|---|---|
| Click-through rate (CTR) | >5% | Improve thumbnail or title |
| Audience retention | >40% avg | Tighten pacing, remove tangents |
| Watch time (hrs/week) | 50+ by week 2 | Add shorts clips to promote |
| Subscribers/video | 5-10 new | Add email signup in description |
| Comments | 3+ | Reply to all, ask questions |
| Shares | 1+ | Make one point explicitly shareable |

**Red flags:**
- CTR <2%: Thumbnail issue. Re-do and re-upload.
- Retention drops at 3 min: Opening too slow. Add hook sooner.
- No comments: Content not engaging. Add questions in video.

---

## Part 9: Troubleshooting

| Issue | Solution |
|---|---|
| OBS freezes on recording | Reduce bitrate to 4000, disable hardware acceleration |
| Audio too quiet | Check mic input levels (-18 to -6dB), boost in DaVinci +6dB |
| Audio too loud | Reduce mic gain, add compressor in OBS filter |
| Video too dark | Increase monitor brightness, add screen overlay light in OBS |
| Text unreadable in video | Font >18pt in editor, zoom to 125% in VS Code |
| Upload slow | Split file into 2 videos if >500MB, upload overnight |
| Thumbnail not saving | Use PNG, <1MB, 1280×720 exactly |

---

## Time Investment Summary

**Per video (45-90 min total):**
- Script/outline: 10-15 min
- Recording: 15-25 min (includes setup + recording + test runs)
- Editing: 20-40 min (scales with complexity)
- Upload + thumbnail: 10-15 min

**Batching (one day per week):**
- Record all 3 videos back-to-back: 1 hour (vs 45 min 3x)
- Edit sequentially while hot: 1.5-2 hours
- Upload in parallel: 30 min
- **Total:** 3-3.5 hours → 3 videos ready to publish

This efficiency scales: first week takes longer (setup), weeks 2-4 drop to 2.5 hours per week.
