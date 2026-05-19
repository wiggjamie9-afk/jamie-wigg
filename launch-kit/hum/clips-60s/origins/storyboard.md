# HUM — Origins of HUM (60s) · Storyboard

**Dimensions:** 1080×1920 vertical · **Total:** 60.0s · **Scenes:** 6
**Background field:** deep noir (`#0a0a0e`) with violet top-halo + silver bottom-halo (per BRAND.md)

---

## Scene 1 — Hook (0–6s · 6s)

**Visual.** Centred: a violet "vibration" orb — a radial gradient circle (560px) pulsing 0.95 → 1.05 every 2.4s. Two concentric hairline rings ripple outward on the same cadence (the second offset 1.2s) — implying sound emanating from a still point. Below: the display title `Older than you think.` with "than you think" carrying the weave gradient italic.

Above the orb, mono eyebrow: `RHYTHMIX presents`.

**On-screen text.**
- Eyebrow: `RHYTHMIX presents`
- Title: `Older than you think.`

**Caption (80% down).** `Humming is older than you think.`

**Narration.** Line 1 (00.5 → 05.5).

**Transition out.** Crossfade 0.6s. The vibe-orb keeps pulsing as it fades.

---

## Scene 2 — Era 01 · Bhramari (6–18s · 12s)

**Visual.** Centred: a large Sanskrit Om glyph (`ॐ`) in italic Cormorant Garamond, 220px, painted with the weave gradient. Behind it: a 380px hairline circle slowly rotating (32s/rev) — referencing the meditation mandala without literally drawing one. Below the glyph: era year `~500 BCE` in big weave-gradient serif, then `Hatha Yoga Pradīpikā` in italic serif. Body: lineage line.

**On-screen text.**
- Era label: `ERA 01 · BHRAMARI`
- Glyph: `ॐ`
- Year: `~500 BCE`
- Figure: `Hatha Yoga Pradīpikā`
- Body: `The yogis called it Bhramari — bee breath. / Hummed long before science could measure why.`

**Caption.** `The Hatha Yoga Pradipika called it Bhramari — bee breath. Five thousand years before science could measure why.`

**Narration.** Line 2 (06.5 → 17.0).

**Transition out.** Crossfade 0.6s.

---

## Scene 3 — Era 02 · Vagus Nerve / Loewi (18–32s · 14s)

**Visual.** A stylised vagus-nerve diagram in 620×620 SVG: a single S-curve traces from a brain-node (top) down through the chest (a long gentle curve in violet gradient). Around the 22s mark, three small branches fan out into the chest. Two glowing node-dots appear at the top (brain) and bottom (gut) — a soft indication of the head-to-heart-to-gut path. The line is drawn in over 4s using `stroke-dashoffset` so the viewer watches it appear.

Below: era year `1921`, figure name `Otto Loewi · Nobel`, then the body line.

**On-screen text.**
- Era label: `ERA 02 · VAGUS NERVE`
- Year: `1921`
- Figure: `Otto Loewi · Nobel`
- Body: `The vagus nerve calms the heart. / Humming is now nervous-system science.`

**Caption.** `1921. Otto Loewi proves the vagus nerve calms the heart. Nobel Prize. Humming is now nervous-system science.`

**Narration.** Line 3 (18.5 → 31.0).

**Transition out.** Crossfade 0.6s. The diagram fades as a unit.

---

## Scene 4 — Era 03 · Weitzberg & Lundberg (32–46s · 14s)

**Visual.** Centre: a multiplier. `1×` in muted serif (140px) fades in on the left; an arrow `→` fades in middle; then **`15×`** explodes up at the right in weave-gradient serif at 240px (the keyframe is `popBig`, a small scale + translate combined with opacity). Above the multiplier: tiny mono label `Nasal nitric oxide`. Below: era year `2002`, figure line `Weitzberg & Lundberg`, body line.

The pacing — 33s for `1×`, 35s for arrow, 37s for `15×` — gives the viewer a beat to expect a small number before the big one lands.

**On-screen text.**
- Era label: `ERA 03 · STOCKHOLM`
- Mono label: `NASAL NITRIC OXIDE`
- Numbers: `1× → 15×`
- Year: `2002`
- Figure: `Weitzberg & Lundberg`
- Body: `Humming raises nasal nitric oxide fifteen-fold. / The sinuses become a resonance chamber.`

**Caption.** `2002. Stockholm researchers measure nasal nitric oxide during humming — a fifteen-fold rise.`

**Narration.** Line 4 (32.5 → 45.0).

**Transition out.** Crossfade 0.6s.

---

## Scene 5 — Synthesis (46–56s · 10s)

**Visual.** The helix returns — same 520px mark from the how-to clip, two intertwined waveforms counter-rotating. Below it, three lines of Cormorant Garamond 78px:
- `Five thousand years of practice.`
- `One hundred years of science.`
- `One app.`

Each italic noun (practice / science / app) carries the weave gradient. The lines all appear together with the scene fade — no per-line stagger needed; the narration paces them.

**On-screen text.** See above.

**Caption.** `Five thousand years of practice. One hundred years of science. One app.`

**Narration.** Line 5 (46.5 → 55.0).

**Transition out.** Crossfade 0.6s.

---

## Scene 6 — End card (56–60s · 4s)

**Visual.** Same end-card pattern as the how-to clip:
1. HUM helix mark (160px).
2. Wordmark `HUM` in Cormorant Garamond 600, 130px, weave gradient.
3. Price chip: `AU$30 · LIFETIME`.
4. URL: `rhythmixapp.com.au/hum`.

Plus, at the very bottom (anchored to the frame), a tiny mono disclaimer that fades in with the scene:
`HUM SUPPORTS GENERAL WELLNESS. NOT A MEDICAL DEVICE.`

**On-screen text.** See above.

**Caption.** `HUM. AU$30 lifetime. rhythmixapp.com.au slash hum.`

**Narration.** Line 6 (56.5 → 59.5).

**Transition out.** Fade to black over the final 0.3s.

---

## Timing reference (CSS `animation-delay` map)

| Scene | Start (s) | Duration (s) | CSS class |
|------:|----------:|-------------:|-----------|
| 1     | 0         | 6            | `.s1` |
| 2     | 6         | 12           | `.s2` |
| 3     | 18        | 14           | `.s3` |
| 4     | 32        | 14           | `.s4` |
| 5     | 46        | 10           | `.s5` |
| 6     | 56        | 4            | `.s6` |

Captions `.c1`–`.c6` mirror these delays. Sub-element animations inside each scene (vagus line draw at 20s, multiplier numbers at 33/35/37s, etc.) all use absolute `animation-delay` values against the page-load clock, so the composition is frame-deterministic.

## Sources for the historical claims

See `docs/refs/humming-research-origins.md`:
- §1.1 Bhramari / Hatha Yoga Pradīpikā (15th c. CE codification of an older practice).
- §3.2 Otto Loewi 1921 vagus discovery (Nobel 1936).
- §3.1 Weitzberg & Lundberg 2002, *Am J Respir Crit Care Med* 166(2):144–145, n=10, 15-fold nasal NO increase.

The "five thousand years" framing leans on the older nada/Om-chanting tradition (Vedic, c. 1500–1200 BCE) of which Bhramari is the explicitly humming-centred codification — see §1.1's "Honest framing" note for the nuance. Safe to say in marketing context.
