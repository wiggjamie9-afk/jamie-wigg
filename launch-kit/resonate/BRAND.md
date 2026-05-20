# RESONATE — brand brief (locked)

RESONATE is the closed-loop biometric music app inside the RHYTHMIX FREQUENCY family. Where HUM is the *contemplative sister to RHYTHMIX core* (violet, hush, ninety-second practice), RESONATE is the *flagship under FREQUENCY* — head-tracked spatial music that breathes with you. It inherits FREQUENCY's deep-navy + gold + cream palette and the italic-gold signature word.

> "Music that breathes with you."
> "Your nervous system, scored."

Wellness, not medical. Lineage-aware. Engineering-precise. No fluff.

## Palette (inherit FREQUENCY — do NOT borrow HUM violet)

```css
--bg:           #0A0F1F;   /* canvas — deep navy, almost black */
--bg-2:         #111729;   /* cards, panels */
--bg-3:         #171F33;   /* hairlines, borders */
--gold:         #D4AF37;   /* primary accent */
--gold-bright:  #F4D06F;   /* signature italic glow */
--gold-dim:     rgba(212,175,55,0.55);
--cream:        #F4E4BC;   /* warm text */
--cream-2:      #EDE9DB;   /* body */
--text:         #EDE9DB;
--text-2:       #9CA8B8;   /* muted body */
--text-3:       #5E6577;   /* eyebrow / mono */
--border:       rgba(212,175,55,0.15);
--border-strong:rgba(212,175,55,0.40);
```

**Signature gradient** (the "bloom"):
`linear-gradient(135deg, #D4AF37 0%, #F4D06F 50%, #F4E4BC 100%)`

Use for: the word RESONATE in italic, key emphasis words, the "bloom" arc behind the orb. Never apply to body copy.

**Background field**: deep navy with two halos —
- top: `radial-gradient(1400px 700px at 50% -120px, rgba(212,175,55,0.10), transparent 70%)`
- bottom: `radial-gradient(1000px 600px at 50% 110%, rgba(244,228,188,0.06), transparent 70%)`

## Typography

Load via `fonts/fonts.css` (self-hosted, ships with the kit).

- **Display** — `'Cormorant Garamond', Georgia, serif`. Italic at weight 500 is the hero treatment, almost always for a single emphasized word, painted in the gold bloom gradient. Letter-spacing -0.015em on large sizes.
- **Body** — `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`. 300–500 weight. Line-height 1.55.
- **Mono** — `'JetBrains Mono', monospace`. ALL CAPS, letter-spacing 0.22em, used for eyebrows, step labels, frequency readouts. Color `--text-3` for muted, `--gold` for emphasis.

## Brand mark

A circular orb with a thin head-tracked ring orbiting it — the closed-loop motif: heart at the centre, music orbiting in space.

```html
<svg viewBox="0 0 40 40" aria-hidden="true">
  <defs>
    <linearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#F4E4BC"/>
    </linearGradient>
    <radialGradient id="bc" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#F4D06F" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="20" cy="20" r="6" fill="url(#bc)"/>
  <circle cx="20" cy="20" r="4" fill="#F4D06F"/>
  <ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="url(#bm)" stroke-width="1.2" opacity="0.85"/>
  <ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="url(#bm)" stroke-width="1" opacity="0.6" transform="rotate(60 20 20)"/>
</svg>
```

Wordmark: `RESONATE` in Cormorant Garamond 500 weight italic, letter-spacing 0.04em, painted with the bloom gradient. The "ATE" can also drop into the gold cleanly when the whole wordmark is set in non-italic.

## Tone

Words on-brand: resonance, breath, nervous system, vagus, cardiac coherence, head-tracked, spatial, on-device, kept on this phone, sub-second, lineage, contemplative, AirPods, Apple Watch, closed loop, biometric, designed to.

Words OFF-brand: optimize, hack, supercharge, unleash, ultimate, AI-powered (yes, even though it's generative — call it "real-time generative" or just "generative"), neural, mind-blowing, transform, revolutionary, journey. No emoji. No medical claims ("treats anxiety", "cures insomnia") — say "designed to support", "associated with", or "honour the coherence research" instead.

The italic-gold word is the single most important typographic move on the brand. Use it once per composition, never twice.

## Motion (for video compositions and CSS animations)

- **Breath cycle = 10 seconds** (0.1 Hz cardiac coherence): expand 5s, contract 5s. This is the same heartbeat as FREQUENCY's orb.
- **Spatial orbit = 12 seconds** for a full revolution of the head-tracked spatial cue.
- **No bouncy or elastic eases** — use `cubic-bezier(0.4, 0.0, 0.2, 1)` or `ease-in-out`.
- **Crossfade between scenes** 0.6–0.8s. Captions fade 0.3s. The bloom arc behind the orb pulses gently at 0.1 Hz with the breath.

## Dimensions

- Hero landscape (og:image, YouTube thumbnail): **1280×720**
- Square (Instagram feed, LinkedIn): **1080×1080**
- Vertical (TikTok, Reels, Shorts, Stories, posters): **1080×1920**
- All compositions set `<meta name="viewport" content="width=<WIDTH>, initial-scale=1">` matching the canvas width.

## Disclaimer (foot of every script, foot of the Gumroad page)

> RESONATE is a wellness practice designed to support attention, relaxation, and nervous system regulation. It is not a medical device. It does not diagnose, treat, cure, or prevent any disease — including ADHD, anxiety disorders, depression, or insomnia. If you have a cardiac condition or are experiencing a mental health crisis, consult a qualified healthcare provider. Do not use audio practices while driving or operating machinery.

## File and class conventions

- HTML compositions are **self-contained** — inline `<style>`, no external scripts, only the local `fonts/fonts.css` link.
- Add a fixed-size `.frame` wrapper at the exact target dimensions so Chromium can screenshot a known viewport.
- Number assets `01-`, `02-`, … so they sort in the order they appear in a launch post.
- Compositions are deterministic — drive timing from `?frame=N` URL parameter (0-indexed). 30s = 900 frames at 30 fps. 60s = 1800 frames. 3s = 90 frames.
