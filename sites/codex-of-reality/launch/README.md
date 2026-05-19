# Codex of Reality — Launch Kit

Everything you need for the lunchtime launch.

## What's in this folder

```
launch/
├── README.md                          ← this file
├── thumbnail-1200x630.html            ← OG card · link previews
├── hero-1920x1080.html                ← landing banner · paid ad creative
├── tile-1-coherence-engine.html       ← IG carousel slide 1/4
├── tile-2-tesla-codex.html            ← IG carousel slide 2/4
├── tile-3-frequencies.html            ← IG carousel slide 3/4
├── tile-4-lifetime.html               ← IG carousel slide 4/4
├── video-60s.html                     ← long explainer · YouTube long, Reels max
├── video-30s.html                     ← short explainer · TikTok, Shorts, Reels
└── social-copy.md                     ← every platform's copy + hashtags
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

### Videos (60s and 30s)

Each video file auto-plays a 9:16 vertical composition with cymatics, breath orb, scene transitions, and Samantha narrating the voiceover (same voice as the app).

**To capture as MP4 you can post:**

1. **Open the file on your iPhone** (Safari or Chrome) — full-screen it
2. Pull up Control Center → tap **Screen Recording** (the red dot)
3. Switch back to the video, tap **▶ Play 30-second video** (or 60s)
4. The video plays itself end-to-end with voiceover
5. When it finishes, stop the screen recording from Control Center
6. The recording lands in Photos — trim the start/end to exactly the play duration

**Best practice for clean audio:**
- Take the phone off silent (the side switch)
- Hold the phone landscape if you want to verify the 9:16 frame renders edge-to-edge, otherwise portrait is fine
- For TikTok / Reels / Shorts, the result is already in the right aspect ratio

**Pro tip:** Record once cleanly, then use the same MP4 across TikTok, Reels, YouTube Shorts — they all want the same 9:16 vertical format.

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
