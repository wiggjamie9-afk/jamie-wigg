# Codex of Reality — Launch Kit

Everything you need for the lunchtime launch.

## What's in this folder

```
launch/
├── README.md                          ← this file
├── social-copy.md                     ← every platform's copy + hashtags
│
├── thumbnail-1200x630.html            ← OG card · link previews (default)
├── thumbnail-tiktok-1080x1920.html    ← vertical thumbnail · TikTok / Reels cover
├── thumbnail-youtube-1280x720.html    ← horizontal · YouTube video thumbnail
├── frontpage-1920x1080.html           ← alternate front-page banner / paid-ad creative
├── hero-1920x1080.html                ← original landing banner (kept for reference)
│
├── tile-1-coherence-engine.html       ← IG carousel slide 1/4 — the tech
├── tile-2-tesla-codex.html            ← IG carousel slide 2/4 — the lineage
├── tile-3-frequencies.html            ← IG carousel slide 3/4 — the library
├── tile-4-lifetime.html               ← IG carousel slide 4/4 — the offer
│
├── people-1-finger-on-camera.html     ← step-by-step image 1/3 — place finger on camera
├── people-2-breathing.html            ← step-by-step image 2/3 — breathe with the orb
├── people-3-coherence.html            ← step-by-step image 3/3 — coherence achieved
│
├── codex-60s.mp4                      ← rendered video · post directly to TikTok / Reels / Shorts
├── codex-30s.mp4                      ← rendered video · short cut for ads
├── video-60s.html                     ← interactive preview · richer animation
├── video-30s.html                     ← interactive preview · richer animation
│
├── render-mp4.sh                      ← rebuild the MP4s (re-run after voice change)
└── voice/
    ├── generate-audio.sh              ← regenerate voiceover audio (espeak default)
    ├── 60s-1.mp3 … 60s-8.mp3          ← per-line voiceover for 60s
    ├── 30s-1.mp3 … 30s-5.mp3          ← per-line voiceover for 30s
    ├── voiceover-60s.mp3              ← single mixed track (60s)
    └── voiceover-30s.mp3              ← single mixed track (30s)
```

## URL to use everywhere

```
https://rhythmixapp.com.au/codex
```

Once these files are deployed, the launch files themselves live at:
```
https://rhythmixapp.com.au/codex/launch/thumbnail-1200x630.html
https://rhythmixapp.com.au/codex/launch/hero-1920x1080.html
https://rhythmixapp.com.au/codex/launch/tile-1-coherence-engine.html
https://rhythmixapp.com.au/codex/launch/tile-2-tesla-codex.html
https://rhythmixapp.com.au/codex/launch/tile-3-frequencies.html
https://rhythmixapp.com.au/codex/launch/tile-4-lifetime.html
https://rhythmixapp.com.au/codex/launch/video-60s.html
https://rhythmixapp.com.au/codex/launch/video-30s.html
```

## How to turn each file into the asset you'll post

### Images (thumbnail, hero, four tiles)

Each `.html` file renders a single locked-aspect-ratio card.

**Easy path (your phone or laptop):**
1. Open the file in any browser
2. Wait for the fonts to load (~1 second)
3. Take a screenshot of the card area only
4. Crop to the exact card boundary (Files app or Photos crop)

**Cleaner path (laptop, macOS / Linux):**
- Open the file in Chrome → DevTools → toggle device toolbar → set viewport to exact dimensions (1200×630, 1920×1080, or 1080×1080) → screenshot the full viewport (Cmd+Shift+P → "Capture full size screenshot")
- Result: pixel-perfect PNG at the right dimensions

**Cleanest path (if you have it on your laptop):**
```bash
# headless Chromium screenshot:
npx playwright install chromium  # one-time
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('file://' + require('path').resolve('sites/codex-of-reality/launch/thumbnail-1200x630.html'));
  await page.waitForTimeout(800); // fonts
  await page.locator('.card').screenshot({ path: 'thumbnail-1200x630.png' });
  await browser.close();
})();
"
```
Repeat with the right viewport per asset.

### Videos (60s and 30s) — two formats, pick whichever you need

**OPTION A · The rendered MP4s** — `codex-60s.mp4` and `codex-30s.mp4`

These are real MP4 files with the voiceover baked in (1080×1920, H.264 + MP3). Upload them straight to TikTok, Reels, YouTube Shorts. No screen recording needed.

- Open the file on your phone (or Files / Photos), tap the share button → save / upload
- Or download to laptop, drop into TikTok/Meta web upload

Visuals are clean and on-brand (navy + gold + parchment typography on scene-timed text overlays). Voice is `en-gb-x-rp+f3` from espeak — clear and intelligible but synthetic. To upgrade the voice (and re-render), see "Voiceover" below.

**OPTION B · The interactive HTML videos** — `video-60s.html` and `video-30s.html`

Richer experience: animated cymatics, breathing orb, scene crossfades. Both also play the same baked-in voiceover MP3s, so screen recording captures audio cleanly.

- Open the HTML on your iPhone
- Pull up Control Center → tap **Screen Recording**
- Tap **▶ Play 60-second video** (or 30s)
- Stop recording when it ends, trim in Photos

Side switch off silent so the audio plays at full volume during the screen capture.

### Voiceover

The voice files in `voice/` are generated by `voice/generate-audio.sh` using espeak-ng (offline, no API key needed). The default voice is `en-gb-x-rp+f3` — British Received Pronunciation female, the most professional of the espeak options.

**To swap the voice for higher quality**, edit `voice/generate-audio.sh`. Two solid upgrade paths:

- **macOS users**: replace the `espeak-ng …` line with `say -v Samantha -o /tmp/_.aiff "$text"` then convert the AIFF to MP3. Samantha is the same voice the app uses inside the Codex.
- **ElevenLabs users**: call `curl -X POST https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID` with your API key. Costs ~$0.005 per line in audio credits.

After regenerating audio, re-run `./render-mp4.sh` from this folder to rebuild the MP4s. Takes ~10 seconds total.

### Social copy

`social-copy.md` has copy + hashtags + SEO descriptions for every major platform — TikTok, Instagram (Reel + carousel + single), YouTube (Short + long), X/Twitter, Threads, Facebook, LinkedIn, Pinterest, Reddit. Plus a long-form founding-member announcement for email / blog / press release.

Each section is copy-paste ready. Open the file, jump to the platform you need.

## Recommended posting order

If you want to be deliberate about launch sequence:

1. **Update your IG bio + link tree** with `rhythmixapp.com.au/codex`
2. **Post the carousel on Instagram** using the 4 tiles → caption from `social-copy.md` § Instagram Carousel
3. **Post the 30s video on TikTok** + **on Instagram Reels** + **on YouTube Shorts** → captions from `social-copy.md`
4. **Drop the 60s video on YouTube long-form** as a "Watch on YouTube" link from a TikTok comment
5. **Single-tweet announcement on X/Twitter** + start a thread reply
6. **LinkedIn founder-voice post** (the metrics angle — appeals to the dev / founder crowd)
7. **Email blast** using the founding-member announcement copy
8. **Reddit drops** (one subreddit per day, not all at once — looks spammy otherwise)

If you want speed instead of sequence, post the 30s video everywhere at the same time with the platform-specific captions.

## Brand consistency rules

- Always use `rhythmixapp.com.au/codex` — never strip the `/codex/` (or visitors land on the RHYTHMIX page)
- Always quote the price as `AU$30` (matches the in-app and on-site phrasing)
- Always describe it as "**the first biofeedback platform built for the mystic, not the biohacker**" — that's your defensible world-first claim
- Never claim it's the "first HRV app in the world" — that's not true (Welltory predates) and would invite fact-checking
- The Tesla quote is *attributed to* Tesla, not *by* Tesla — always note that. Honest provenance is part of the brand integrity.
- The voice on every video should match the in-app voice (Samantha). It does, automatically — the Web Speech API picks Samantha first on iOS.

## What to update once you're live

- The `wiggjamie9@gmail.com` feedback address in `home.html` and `app.html` — switch to a branded address (e.g. `feedback@rhythmixapp.com.au`) once you set up DNS forwarding
- The Stripe placeholder CTA — when Gumroad is set up, send me the product URL and I'll wire both CTAs
- The "founding tier" copy if you want to add a counter later (e.g. once you have 100 members, surface a "100 founding members in, 400 to go" line)

Sleep well. The Codex is alive.
