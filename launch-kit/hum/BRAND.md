# HUM — brand brief (locked)

HUM is the contemplative sister to RHYTHMIX. Where RHYTHMIX is energetic AI-music neon (magenta/cyan/green, fast eases, big numbers), HUM is **slow, contemplative, lineage-aware, body-first**. Think monastery × neuroscience lab × iPhone-native PWA.

## Palette (HUM-specific — do NOT borrow RHYTHMIX neon)

```css
--noir:        #0a0a0e;   /* canvas */
--noir-2:      #13131a;   /* cards */
--noir-3:      #1d1d27;   /* hairlines, borders */
--violet:      #9b6bff;   /* primary accent */
--violet-deep: #6b3fc4;
--violet-soft: #c4a3ff;
--silver:      #d8d8e2;
--silver-bright:#f0f0f8;
--silver-dim:  #8a8a98;
--text:        #ede8f5;   /* body */
--text-2:      #a8a4b5;   /* muted body */
--text-3:      #6a6878;   /* eyebrow / mono */
```

**Signature gradient** (the "weave"):
`linear-gradient(135deg, #9b6bff 0%, #d8d8e2 50%, #9b6bff 100%)`

Use for: title italics, brand mark stroke, key CTAs. Do not overuse — one weave gradient per composition.

**Background field**: deep noir with two soft radial halos —
- top: `radial-gradient(1200px 600px at 50% -100px, rgba(155,107,255,0.12), transparent 70%)`
- bottom: `radial-gradient(900px 500px at 50% 110%, rgba(216,216,226,0.08), transparent 70%)`

## Typography

Load once at the top of any composition:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
```

- **Display** — `'Cormorant Garamond', Georgia, serif`. Italic at weight 500 is the hero treatment, often for a single emphasized word. Letter-spacing -0.01em on big sizes.
- **Body** — `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`. 300–500 weight. Line-height 1.55.
- **Mono** — `'JetBrains Mono', monospace`. ALL CAPS, letter-spacing 0.18em, used for eyebrows and tiny labels. Color `--text-3`.

## Brand mark

Two intertwined waveforms — one violet, one silver — making a "helix" of hum + breath:

```html
<svg viewBox="0 0 40 40" aria-hidden="true">
  <defs>
    <linearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9b6bff"/>
      <stop offset="100%" stop-color="#d8d8e2"/>
    </linearGradient>
  </defs>
  <path d="M6 20 Q13 8 20 20 T34 20" stroke="url(#bm)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M6 20 Q13 32 20 20 T34 20" stroke="#d8d8e2" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.6"/>
</svg>
```

Wordmark: `HUM` in Cormorant Garamond 600 weight, letter-spacing 0.04em.

## Tone

Words on-brand: practice, lineage, vibration, breath, vagal, Bhramari, hum, exhale, nervous system, kept on this device, daily, soft, gentle.

Words OFF-brand: optimize, hack, supercharge, AI-powered, transform, journey, unleash, ultimate, revolutionary. No emoji. No medical claims ("treats anxiety", "cures") — say "supports" or "associated with" instead, and include the wellness-not-medical disclaimer where appropriate.

## Motion (for video compositions and CSS animations)

- Breath cycle = **10 seconds** (0.1 Hz) — expand 4s, hold 1s, contract 4s, hold 1s
- Helix pulse = slow rotation, 18s full revolution
- No bouncy or elastic eases — use `cubic-bezier(0.4, 0.0, 0.2, 1)` or `ease-in-out`
- Crossfade between scenes 0.6–0.8s
- Type-on or fade-up entrances over 0.5–1.0s, no slide-in from off-screen

## Dimensions

- Hero landscape (og:image, YouTube thumbnail): **1280×720**
- Square (Instagram feed, LinkedIn): **1080×1080**
- Vertical (TikTok, Reels, Shorts, Stories): **1080×1920**
- All compositions should set `<meta name="viewport" content="width=<WIDTH>, initial-scale=1">` matching their canvas width.

## File and class conventions

- HTML compositions should be **self-contained** — inline `<style>`, no external scripts other than the Google Fonts link.
- Add a fixed-size `.frame` wrapper at the exact target dimensions so Playwright can screenshot a known viewport.
- Number assets `01-`, `02-`, ... so they sort in the order they should appear in a launch post.
