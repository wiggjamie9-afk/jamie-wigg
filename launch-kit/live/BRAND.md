# RHYTHMIX LIVE — brand brief (locked)

RHYTHMIX LIVE is the beat-synced music-video co-pilot in the RHYTHMIX portfolio. Where HUM is contemplative violet/silver, LIVE is RHYTHMIX-neon — confident, kinetic, builder-minded. Inherits the main RHYTHMIX palette from `rhythmix-teaser-60s/DESIGN.md`. Motion is the brand. Numbers are heroes.

## Palette (inherits RHYTHMIX main — do NOT borrow HUM violet/silver or FREQUENCY navy/gold)

```css
--canvas:    #08050d;   /* near-black with violet bias */
--card:      #1a1325;   /* card surface */
--magenta:   #ff1f5a;   /* CTA, emphasis, primary */
--purple:    #7c3aed;   /* secondary */
--cyan:      #00d8ff;   /* accent, kinetic */
--green:     #00e887;   /* signal, "go" */
--gold:      #f5c000;   /* highlights, money, merch */
--pink:      #ff6fc8;   /* accent counts */
--white:     #ffffff;   /* display text */
--muted:     #a0a0b0;   /* muted body */
--mono-dim:  #6a6878;   /* tiny mono labels */
```

**Signature gradient** (the "spectrum"):
`linear-gradient(90deg, #ff1f5a 0%, #7c3aed 35%, #00d8ff 70%, #00e887 100%)`

Use for: waveform stroke, headline accent words, signature CTAs. One spectrum gradient per composition, max two.

**Background field**: deep canvas with two soft radial halos —
- top: `radial-gradient(1400px 700px at 50% -120px, rgba(124,58,237,0.22), transparent 70%)`
- bottom: `radial-gradient(1100px 600px at 50% 110%, rgba(255,31,90,0.14), transparent 70%)`

## Typography

Load once at the top of any composition:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
```

Or use the local file: `<link rel="stylesheet" href="../fonts/fonts.css">`.

- **Display** — `'Space Grotesk', system-ui, sans-serif`. Weights 500–700. Big numerals at 700. Letter-spacing -0.02em on display sizes 100px+.
- **Body** — Space Grotesk 400 / 500. Line-height 1.4.
- **Mono** — `'JetBrains Mono', monospace`. ALL CAPS, letter-spacing 0.18em, used for eyebrows, taglines, frame counters, microcopy. Color `--mono-dim` when subdued, `--cyan` when active.

There is NO serif in RHYTHMIX LIVE. Don't introduce one.

## Brand mark

A waveform that resolves into "LIVE" — three vertical bars rising and falling on a horizontal axis:

```html
<svg viewBox="0 0 60 40" aria-hidden="true">
  <defs>
    <linearGradient id="lm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff1f5a"/>
      <stop offset="35%" stop-color="#7c3aed"/>
      <stop offset="70%" stop-color="#00d8ff"/>
      <stop offset="100%" stop-color="#00e887"/>
    </linearGradient>
  </defs>
  <rect x="4"  y="14" width="6" height="12" rx="1" fill="url(#lm)"/>
  <rect x="14" y="6"  width="6" height="28" rx="1" fill="url(#lm)"/>
  <rect x="24" y="10" width="6" height="20" rx="1" fill="url(#lm)"/>
  <rect x="34" y="2"  width="6" height="36" rx="1" fill="url(#lm)"/>
  <rect x="44" y="12" width="6" height="16" rx="1" fill="url(#lm)"/>
</svg>
```

Wordmark: `RHYTHMIX LIVE` in Space Grotesk 700, letter-spacing 0.02em. Or just `LIVE.` set huge.

## Tone

Words ON-brand: beat-synced, indie artist, release, cut, drop, ship, render, the moment, locked, every beat, three formats, one pass, now what, Suno, Kling, Fourthwall, merch, vinyl, hoodie, lyric print, voice clone, persistent, catalogue, deliverable.

Words OFF-brand: contemplative, gentle, slow, lineage, breath, vagal, practice, journey, transform, unleash, supercharge, AI-powered (it's just the noun "AI" if needed), revolutionary. No emoji. No fluff. No medical or wellness language.

The voice matches `rhythmix-overview-60s/script.txt`: short declarative sentences. "Four pillars. Generate. Master. Distribute. Earn." Energy without exaggeration. Numbers stand alone.

## Motion (for video compositions and CSS animations)

- Fast in: 0.4–0.7s entrances, `cubic-bezier(0.16, 1, 0.3, 1)` (power3.out-equivalent)
- Decisive holds — no fades unless crossfading scenes
- Stagger 60–120ms across grid items
- Scene crossfade: 0.5s at scene boundaries
- Waveform drawing: 0.6–1.2s `cubic-bezier(0.16, 1, 0.3, 1)` for stroke-dashoffset reveals
- Cut-markers: drop in vertically with 80ms stagger, 200ms each
- Beat pulses: scale 1.0 → 1.08 → 1.0, 200ms each beat
- NO bounce. NO elastic. NO slow ease-in-out for the kinetic moments — use `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and `cubic-bezier(0.4, 0, 1, 1)` (ease-in) for exits

## Pricing claims (locked — these are the only numbers that go on visuals/copy)

- **Free** — 1 video / month, watermark
- **Pro** — $19 / month — unlimited, no watermark, Fourthwall integration
- **Studio** — $49 / month — Voice Cloning, priority render queue

Three-format output (every render):
- 60-second vertical 1080×1920 (TikTok / Reels / Shorts)
- 15-second square 1080×1080 (IG / FB feed)
- 4-minute landscape 1920×1080 (YouTube)

Stack credibility (mention sparingly, only where it earns the line):
- Kling 2.6 (audio-conditioned video — Dec 2025)
- Suno API (audio + persistent voice clone)
- HyperFrames (composition layer)

## Dimensions

- Hero landscape (og:image, YouTube thumbnail): **1280×720**
- Square (Instagram feed, FB feed): **1080×1080**
- Vertical (TikTok, Reels, Shorts, Stories, video poster): **1080×1920**
- All compositions set `<meta name="viewport" content="width=<WIDTH>, initial-scale=1">` matching canvas width.

## File and class conventions

- HTML compositions are **self-contained** — inline `<style>`, no external scripts other than the Google Fonts link.
- A fixed-size `.frame` wrapper at the exact target dimensions for deterministic screenshotting.
- Number assets `01-`, `02-`, ... so they sort in launch order.
- Deterministic timing only — `?frame=N` URL param drives CSS variables `--s1..--sN`. No `Date.now()`, no `Math.random()`.
- 30s = 900 frames @ 30fps. 60s = 1800 frames. 3s = 90 frames.
