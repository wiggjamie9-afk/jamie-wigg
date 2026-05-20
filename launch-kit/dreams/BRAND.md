# FREQUENCY DREAMS — brand brief (locked)

FREQUENCY DREAMS is the **night-side** of FREQUENCY. Where FREQUENCY is the wide-open contemplative-tech daylight — deep navy, italic gold, sound-as-medicine lineage — DREAMS goes further into the dark. Indigo. Pewter. Quieter motion. Generous negative space. Slower crossfades. This is a bedtime ritual, not a launch ad.

It sits **under** RHYTHMIX FREQUENCY (same family, same lineage, inherited typography and gold accent), but it has its own night-palette — pushed deeper toward indigo, with pewter where FREQUENCY uses silver-white. The signature word treatment stays: italic Cormorant Garamond in gold (`--gold` from FREQUENCY's `#D4AF37`).

## Palette (DREAMS-specific — inherits FREQUENCY navy/gold; pushed darker)

```css
--noir:        #050816;   /* canvas — deeper than FREQUENCY's #0A0F1F */
--noir-2:      #0A0F1F;   /* cards, gradient anchor — FREQUENCY's primary bg */
--noir-3:      #111729;   /* hairlines, borders */
--indigo:      #1B2042;   /* mid-depth fill */
--indigo-2:    #262C5E;   /* highlight indigo */
--indigo-soft: #4A4F8A;   /* faded indigo for receding elements */
--gold:        #D4AF37;   /* inherited from FREQUENCY — primary accent */
--gold-bright: #F4D06F;   /* highlight gold */
--gold-dim:    rgba(212,175,55,0.55);
--pewter:      #8A8FA6;   /* the night-equivalent of FREQUENCY's silver */
--pewter-soft: #B3B7C9;
--pewter-dim:  #5B607A;
--text:        #E8E6D9;   /* warm cream-pewter body (matches FREQUENCY cream tone) */
--text-2:      #9CA0B8;   /* muted body */
--text-3:      #5B607A;   /* eyebrow / mono */
```

**Signature gradient** (the "veil"):
`linear-gradient(135deg, #D4AF37 0%, #B3B7C9 50%, #D4AF37 100%)`

Use for: italic emphasis, brand mark stroke, key CTAs. Only one veil gradient per composition. (FREQUENCY uses gold solid for italic; DREAMS uses this gold→pewter→gold weave to signal the night version.)

**Background field**: deep noir with two soft radial halos —
- top: `radial-gradient(1400px 700px at 50% -120px, rgba(212,175,55,0.10), transparent 70%)`
- bottom: `radial-gradient(1100px 600px at 50% 110%, rgba(38,44,94,0.30), transparent 70%)`

(The top is a low-saturation gold; the bottom is a deep indigo bloom — the dawn and the dusk of a single night.)

## Typography

Inherits FREQUENCY's stack exactly — Cormorant Garamond + Inter + JetBrains Mono. Self-hosted via `fonts/fonts.css` (which symlinks `files/` from the HUM kit; same 600 KB woff2 set).

- **Display** — `'Cormorant Garamond', Georgia, serif`. Italic at weight 500 is the hero treatment, often for a single emphasized word in gold. Letter-spacing -0.01em on big sizes.
- **Body** — `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`. 300–500 weight. Line-height 1.55.
- **Mono** — `'JetBrains Mono', monospace`. ALL CAPS, letter-spacing 0.20em on small sizes (0.28em on tiny eyebrows). Color `--text-3` for muted, `--gold-dim` for accent.

## Brand mark

A single closed orb traced over a slow crescent — the night-half of the FREQUENCY orb. Gold stroke, pewter shadow.

```html
<svg viewBox="0 0 40 40" aria-hidden="true">
  <defs>
    <linearGradient id="dm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#B3B7C9"/>
    </linearGradient>
  </defs>
  <circle cx="20" cy="20" r="13" fill="none" stroke="url(#dm)" stroke-width="1.2" opacity="0.85"/>
  <path d="M9 20 A11 11 0 0 1 31 20" stroke="#D4AF37" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.9"/>
  <circle cx="20" cy="20" r="2" fill="#F4D06F" opacity="0.95"/>
</svg>
```

Wordmark: `DREAMS` in Cormorant Garamond 600 weight, letter-spacing 0.08em. When paired with the parent label, the full lockup reads:

`FREQUENCY` (cream) · `DREAMS` (italic, gold-veil gradient)

## Tone

Words on-brand: ritual, intention, night, drift, settle, breathe, hush, landscape, recall, threshold, lineage, kept on this device, on-device, nightly.

Words OFF-brand: optimize, hack, supercharge, AI-powered (don't lead with it — the rituals come first; the engine is invisible), transform, journey, unleash, ultimate, revolutionary. No emoji. No medical claims (no "treats insomnia", "cures anxiety", "modulates REM"). Wellness language — "supports", "associated with", "designed for nightly use".

The medical disclaimer is mandatory at the foot of every script and the Gumroad page.

## Motion (for video compositions and CSS animations)

DREAMS moves slower than HUM. Slower than FREQUENCY.

- Breath cycle = **15 seconds** going into sleep (4-7-8: inhale 4s, hold 7s, exhale 8s — totalling 19s; the visual *suggests* it without enforcing exact cadence)
- Cardiac coherence breathing for waking = **11 seconds** (5.5s in / 5.5s out) — matches FREQUENCY's orb cadence
- Crossfade between scenes 0.8–1.0s (longer than HUM's 0.6–0.8s)
- Linear and `ease-in-out` only — no power3.out, no bounce, no elastic
- Type-on or fade-up entrances over 0.8–1.2s, no slide-in from off-screen
- Slow pan on Marble-style dreamscapes (the splat-points drift over 30s+ visible windows; the camera never cuts)

## Dimensions

- Hero landscape (og:image, YouTube thumbnail): **1280×720**
- Square (Instagram feed, LinkedIn): **1080×1080**
- Vertical (TikTok, Reels, Shorts, Stories): **1080×1920**
- All compositions should set `<meta name="viewport" content="width=<WIDTH>, initial-scale=1">` matching their canvas width.

## File and class conventions

- HTML compositions are **self-contained** — inline `<style>`, no external scripts other than the local `fonts/fonts.css` (which itself loads the woff2 files from the symlinked HUM kit, so the whole thing works offline).
- Compositions are deterministic. Drive timing from `?frame=N`. 30s = 900 frames at 30fps. 60s = 1800 frames. 3s = 90 frames. A tiny inline `<script>` at the top of `<head>` reads the frame param and sets CSS variables `--t`, `--s1`..`--s5` (per scene) and `--seg1`..`--seg3` (for the 3-segment 3s clips).
- Add a fixed-size `.frame` wrapper at the exact target dimensions so Playwright can screenshot a known viewport.
- Number assets `01-`, `02-`, ... so they sort in the order they should appear in a launch post.

## Where DREAMS fits in the family

| App | Verb | Mood | Palette | Lineage anchor |
|---|---|---|---|---|
| FREQUENCY | Listen | Wide-open contemplative tech | Deep navy + italic gold | Solfeggio + cardiac coherence |
| HUM | Practice | Bee-breath morning ritual | Noir + violet weave | Bhramari + 2002 Karolinska NO |
| **DREAMS** | **Drift** | **Bedtime ritual + dream recall** | **Deeper noir + gold-pewter veil + indigo bloom** | **4-7-8 + dream lineage + Marble dreamscape** |

DREAMS shares the FREQUENCY engine for soundscape generation, the on-device principle of RESONATE, and a single price point: AU$30 lifetime.
