# FREQUENCY DREAMS — Pitch (60s) · Storyboard

**Dimensions:** 1080×1920 vertical · **Total:** 60.0s · **Scenes:** 5
**Background field:** deep noir (`#050816`) with a low gold halo at the top and a deep indigo bloom at the bottom (per `BRAND.md`).
**Aesthetic note:** slower than HUM. Crossfades 0.9–1.0s. Linear and `ease-in-out` only. Generous negative space.

---

## Scene 1 — Hook (0–10s · 10s)

**Visual.** Family lockup (`FREQUENCY` in pewter mono-cap) above a 580px gold-pewter orb (the DREAMS mark — closed circle + gold crescent + scattered splat-points). A slow 30s rotation ring drifts around the orb. Below: title `DREAMS.` in Cormorant Garamond 600/180px, with the sub `Compose your night.` in italic veil-gradient.

**On-screen text.**
- Family: `FREQUENCY`
- Title: `DREAMS.`
- Sub: `Compose your night.`

**Caption (82% down).** `FREQUENCY DREAMS. A ritual for the night.`

**Narration.** Line 1 (01.0 → 08.0).

**Transition out.** Crossfade 0.9s.

---

## Scene 2 — Bedside (10–21s · 11s)

**Visual.** Centred: a stylised iPhone (380×780, rounded 62px), inside which a small mono label `TONIGHT'S INTENTION` sits above a textarea-style box containing the line *"soft rain over a forest, a low gold lamp on the path"* — italic Cormorant. Below the input, a circular gold microphone affordance. Below the phone, italic Cormorant body: `Speak it once. Nothing leaves the device.`

**On-screen text.**
- Step label: `01 · BEDSIDE`
- Phone label: `TONIGHT'S INTENTION`
- Input: `soft rain over a forest, a low gold lamp on the path`
- Body: `Speak it once. Nothing leaves the device.`

**Caption.** `Speak an intention. Nothing leaves the device.`

**Narration.** Line 2 (11.5 → 19.5).

**Transition out.** Crossfade 0.9s.

---

## Scene 3 — Breath (21–34s · 13s)

**Visual.** Centre: the **4-7-8 breath orb** — a 300px gold-edged inner core plus a 520px outer ring. Both scale on a 19-second cycle: 0→21% (4s) inhale 0.78→1.10, 21%→58% (7s) hold at 1.10, 58%→100% (8s) exhale 1.10→0.78. Below the orb, mono label `4 · 7 · 8` in gold. Below the orb wrap, italic body `Four in. Seven held. Eight out.`

**On-screen text.**
- Step label: `02 · BREATH`
- Mono label: `4 · 7 · 8`
- Body: `Four in. Seven held. Eight out.`

**Caption.** `Breathe. Four in. Seven. Eight out.`

**Narration.** Line 3 (22.5 → 32.5). Counts paced with the breath cycle — the narrator inhales-and-says "four", holds-and-says "seven", exhales-and-says "eight".

**Transition out.** Crossfade 1.0s. Orb completes its cycle before the fade.

---

## Scene 4 — Landscape (34–47s · 13s)

**Visual.** Centre: a 900×580 panoramic Marble-style dreamscape — three layered indigo ridges receding into a gold horizon glow; ~25 scattered splat-points across the sky, six brighter near-horizon glows with halos, and a focal warm lamp on the near ridge. The whole panel pans gently left-right on a 30s alternating cycle (`slowPan` keyframe, scale 1.04, ±2% translate) — the "drift" of the camera without ever cutting. Below: italic body `A landscape, drawn from your intention.`

**On-screen text.**
- Step label: `03 · LANDSCAPE`
- Body: `A landscape, drawn from your intention.`

**Caption.** `A landscape to drift through. Until you're asleep.`

**Narration.** Line 4 (35.5 → 45.5).

**Transition out.** Crossfade 1.0s.

---

## Scene 5 — End card (47–60s · 13s)

**Visual.** Centred stack:
1. DREAMS brand mark (180px gold-pewter orb-crescent SVG from `BRAND.md`).
2. Family label `FREQUENCY` in pewter mono-cap.
3. Wordmark `DREAMS` in Cormorant Garamond 600 weight, 160px, cream `#E8E6D9`, letter-spacing 0.04em.
4. Price chip: `AU$30 · LIFETIME` (gold-bright italic numeral on translucent navy).
5. URL line in mono: `rhythmixapp.com.au / dreams`.

**On-screen text.** See above.

**Caption.** `FREQUENCY DREAMS. Thirty Australian dollars, lifetime. rhythmixapp.com.au slash dreams.`

**Narration.** Line 5 (48.5 → 59.0).

**Transition out.** Fade to black over the final 0.4s.

---

## Timing reference (CSS `animation-delay` map)

| Scene | Start (s) | Duration (s) | CSS class |
|------:|----------:|-------------:|-----------|
| 1     | 0         | 10           | `.s1` |
| 2     | 10        | 11           | `.s2` |
| 3     | 21        | 13           | `.s3` |
| 4     | 34        | 13           | `.s4` |
| 5     | 47        | 13           | `.s5` |

Captions use matching `.c1`–`.c5` classes with identical delays and durations. Everything is on one absolute 60-second timeline — no `setTimeout` for visuals (only for the narration via Web Speech, started after the tap-to-play gate).

---

## Medical disclaimer (foot of any rendered cut)

FREQUENCY DREAMS is a wellness practice. It does not diagnose, treat, cure, or prevent any disease. Consult a clinician for sleep disorders.
