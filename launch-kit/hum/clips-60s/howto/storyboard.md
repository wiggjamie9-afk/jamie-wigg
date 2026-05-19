# HUM — How to use HUM (60s) · Storyboard

**Dimensions:** 1080×1920 vertical · **Total:** 60.0s · **Scenes:** 6
**Background field:** deep noir (`#0a0a0e`) with violet top-halo + silver bottom-halo (per BRAND.md)

---

## Scene 1 — Hook (0–6s · 6s)

**Visual.** Centred: the HUM helix mark scaled to 520px. Two intertwined waveforms — violet circle + silver ellipse — counter-rotating (18s / 24s revolutions). Soft violet glow behind. Above the helix, mono eyebrow: `RHYTHMIX presents`. Below, eyebrow: `A 90-SECOND PRACTICE.` Then the title fades up: `Hum, every day.` — Cormorant Garamond 160px, italic "every day" carries the weave gradient.

**On-screen text.**
- Eyebrow top: `RHYTHMIX presents`
- Eyebrow mid: `A 90-SECOND PRACTICE`
- Title: `Hum, every day.`

**Caption (80% down).** `A ninety-second practice. Hum, every day.`

**Narration.** Line 1 (00.5 → 05.5).

**Transition out.** Scene crossfades over 0.6s (the `sceneShow` keyframe handles the 8%-and-92% mark fades).

---

## Scene 2 — OPEN (6–14s · 8s)

**Visual.** Centred: a stylised iPhone frame (380×780, rounded 62px). Inside it, the HUM cover — a circular violet/silver gradient orb with `HUM` in the weave gradient at its centre. Implies "it's already on your phone" without literally showing an install screen.

**On-screen text.**
- Step label: `STEP 01 · OPEN`
- Body: `It lives on your phone. Nothing to install.`

**Caption.** `It lives on your phone. Nothing to install.`

**Narration.** Line 2 (06.5 → 12.5).

**Transition out.** Crossfade 0.6s.

---

## Scene 3 — LISTEN (14–26s · 12s)

**Visual.** A horizontal sine wave (4 wavelengths) draws in over ~6s using SVG `stroke-dashoffset`, stroke painted with the weave gradient. Below: a pill chip `130 Hz reference` in mono. The wave's drawing is the visual demonstration of "tuning fork for the chest."

**On-screen text.**
- Step label: `STEP 02 · LISTEN`
- Chip: `130 Hz reference`
- Body: `Like a tuning fork for the chest.`

**Caption.** `A one-hundred-and-thirty-hertz reference tone. Like a tuning fork for the chest.`

**Narration.** Line 3 (15.0 → 24.0).

**Transition out.** Crossfade 0.6s.

---

## Scene 4 — HUM (26–40s · 14s)

**Visual.** Centre: the **breath ring** — a 560px circle with a 1px silver hairline border, scaling 0.78 → 1.08 → 0.78 over a full 10-second breath cycle (`ease-in-out`). A second hairline ring 20px outside the first follows the same animation. Inside the ring, the italic `Mmmm.` in the weave gradient fades in at the cycle's exhale peak and fades out near the end. Full breath cycle plays once cleanly (10s) plus 4s of pre/post breathing space.

**On-screen text.**
- Step label: `STEP 03 · HUM`
- Body: `Soft exhale. Mouth closed.`
- Inside the ring (pulses): `Mmmm.`

**Caption.** `Soft exhale. Mouth closed. Mmmm.`

**Narration.** Line 4 (27.0 → 38.0). "Mmmm" held for ~3s, sympathetic with the ring at its widest.

**Transition out.** Crossfade 0.6s. Breath ring scales down before fading.

---

## Scene 5 — REPEAT (40–52s · 12s)

**Visual.** Streak counter typography: `1 → 7 → 30` in giant Cormorant Garamond 200px, each number with the weave gradient. They pop in sequentially at +1, +4, +7 s into the scene (using `popIn` keyframe). Below the numbers, a mono caption `DAY · WEEK · MONTH`. Below that, body: `Streak builds. Nothing leaves the device.`

**On-screen text.**
- Step label: `STEP 04 · REPEAT`
- Numbers: `1 → 7 → 30`
- Mono label: `DAY · WEEK · MONTH`
- Body: `Streak builds.` / `Nothing leaves the device.`

**Caption.** `Streak builds. Nothing leaves the device.`

**Narration.** Line 5 (41.0 → 50.0).

**Transition out.** Crossfade 0.6s.

---

## Scene 6 — End card (52–60s · 8s)

**Visual.** Centred stack:
1. HUM helix mark (200px, the small SVG from BRAND.md).
2. Wordmark `HUM` in Cormorant Garamond 600 weight, 140px, weave gradient, letter-spacing 0.04em.
3. Price chip: `AU$30 · LIFETIME` (violet-soft on translucent violet).
4. URL line in mono: `rhythmixapp.com.au/hum`.

**On-screen text.** See above.

**Caption.** `HUM. Thirty Australian dollars, lifetime. rhythmixapp.com.au slash hum.`

**Narration.** Line 6 (53.0 → 59.5).

**Transition out.** Fade to black over the final 0.3s.

---

## Timing reference (CSS `animation-delay` map)

| Scene | Start (s) | Duration (s) | CSS class |
|------:|----------:|-------------:|-----------|
| 1     | 0         | 6            | `.s1` |
| 2     | 6         | 8            | `.s2` |
| 3     | 14        | 12           | `.s3` |
| 4     | 26        | 14           | `.s4` |
| 5     | 40        | 12           | `.s5` |
| 6     | 52        | 8            | `.s6` |

Captions use matching `.c1`–`.c6` classes with identical delays and durations. Everything is on one absolute 60-second timeline — no `setTimeout` for visuals.
