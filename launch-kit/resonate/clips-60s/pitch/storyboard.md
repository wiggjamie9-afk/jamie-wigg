# RESONATE — Pitch (60s) · Storyboard

**Dimensions:** 1080×1920 vertical · **Total:** 60.0s · **Scenes:** 6 × 10s
**Background field:** deep navy (`#0A0F1F`) with gold top-halo + cream bottom-halo (per BRAND.md)

---

## Scene 1 — Hook (0–10s · 10s)

**Visual.** Centred: a 600px orb stage. Three concentric hairline rings. A slow-rotating gold orbit (18s revolution) — three overlapping ellipses suggesting head-tracked spatial cues. Inside the orbit, a glowing gold core with a single horizontal heart-rate trace painted in the bloom gradient. Above the orb, mono eyebrow: `FREQUENCY presents`. Below, title fades up: `Music that breathes with you.` — Cormorant Garamond 140px, italic "breathes with you" in the gold bloom.

**On-screen text.**
- Eyebrow: `FREQUENCY PRESENTS`
- Title: `Music that breathes with you.`

**Caption (80% down).** `Music that breathes with you. From the makers of FREQUENCY.`

**Narration.** Line 1 (00.5 → 08.5).

**Transition out.** Crossfade 0.8s.

---

## Scene 2 — Put it on (10–20s · 10s)

**Visual.** Centre row: two minimalist AirPod Pros (cream + slate gradient, 120×200), then a horizontal gap, then a small Apple Watch silhouette with a tiny gold heart-rate trace painted across the face. Both objects drop-shadow with a warm cream-gold glow. Step label above (`01 · PUT IT ON`). Below, the title: `AirPods in. Watch on.` (104px, "Watch on." italic in bloom). Sub-body: "The biometric rig is already on your body."

**On-screen text.**
- Step label: `01 · PUT IT ON`
- Title: `AirPods in. Watch on.`
- Body: `The biometric rig is already on your body.`

**Caption.** `AirPods Pro 3 measure your heart. Apple Watch streams your breath.`

**Narration.** Line 2 (10.5 → 18.5).

**Transition out.** Crossfade 0.8s.

---

## Scene 3 — The closed loop (20–30s · 10s)

**Visual.** A 780×780 closed-loop diagram: a dashed gold ring forms the orbit; four small cards sit at top / right / bottom / left positions:
- TOP — *01 Read · Heart & breath*
- RIGHT — *02 Generate · Real-time*
- BOTTOM — *03 Render · 3D space*
- LEFT — *04 Respond · You settle*

Cards in `--bg-2` with a thin gold border. The ring conveys "closed loop" without animating arrows. Step label above the diagram (`02 · THE CLOSED LOOP`). Body underneath: "The music answers. Every two seconds."

**On-screen text.**
- Step label: `02 · THE CLOSED LOOP`
- Four nodes (above)
- Body: `The music answers. Every two seconds.`

**Caption.** `A closed loop. Sub-two-second response. Nothing leaves your phone.`

**Narration.** Line 3 (20.5 → 28.5).

**Transition out.** Crossfade 0.8s.

---

## Scene 4 — Coherence (30–40s · 10s)

**Visual.** Centre: a 600px breath ring with a single gold hairline border + a 30px-outside cream hairline. Both scale on a **10-second 0.1 Hz breath cycle** — 0.78 → 1.10 → 0.78 (`ease-in-out`). The ring contains the italic word "Open." in the bloom gradient, fading in at the cycle's peak (about t=2.5s into the scene's loop). Below the ring, an `hz-chip`: `0.1 HZ · 5.5s IN · 5.5s OUT`. Body: "As you settle, *it opens.*"

**On-screen text.**
- Step label: `03 · COHERENCE`
- Inside ring (pulses): `Open.`
- Chip: `0.1 Hz · 5.5s in · 5.5s out`
- Body: `As you settle, it opens.`

**Caption.** `Approach cardiac coherence — and the music opens.`

**Narration.** Line 4 (30.5 → 39.0). "Coherence" lands at the breath ring's peak.

**Transition out.** Crossfade 0.8s.

---

## Scene 5 — Three modes (40–50s · 10s)

**Visual.** Three horizontal cards stacked vertically (780px wide), each with: roman numeral I/II/III in italic-gold-bloom on the left, mode name in Cormorant 48px in the middle, frequency target in mono on the right (`40 Hz · GAMMA` / `0.1 Hz · BREATH` / `2 Hz · DELTA`). Step label above (`04 · THREE MODES`). Body underneath: "Focus. Calm. *Rest.*" — "Rest." italic in bloom.

**On-screen text.**
- Step label: `04 · THREE MODES`
- Three cards (above)
- Body: `Focus. Calm. Rest.`

**Caption.** `Three modes. Focus. Calm. Rest.`

**Narration.** Line 5 (40.5 → 48.0).

**Transition out.** Crossfade 0.8s.

---

## Scene 6 — End card (50–60s · 10s)

**Visual.** Centred stack:
1. RESONATE orb-and-orbit mark (200px, the small SVG from BRAND.md).
2. Wordmark `RESONATE` in Cormorant Garamond italic 500-weight, 160px, painted with the bloom gradient.
3. Price chip: `LIFETIME AU$30` — gold border, gold-bloom on the number.
4. URL line in mono: `rhythmixapp.com.au / resonate`.

**On-screen text.** See above.

**Caption.** `RESONATE. Thirty Australian dollars, lifetime. rhythmixapp.com.au slash resonate.`

**Narration.** Line 6 (50.5 → 59.5).

**Transition out.** Fade to black over the final 0.3s.

---

## Timing reference (CSS `animation-delay` map)

| Scene | Start (s) | Duration (s) | CSS class |
|------:|----------:|-------------:|-----------|
| 1     | 0         | 10           | `.s1` |
| 2     | 10        | 10           | `.s2` |
| 3     | 20        | 10           | `.s3` |
| 4     | 30        | 10           | `.s4` |
| 5     | 40        | 10           | `.s5` |
| 6     | 50        | 10           | `.s6` |

Captions use matching `.c1`–`.c6` classes with identical delays and durations. The breath ring's animation starts at 30s and runs one clean 10-second cycle. Everything is on a single absolute 60-second timeline — no `setTimeout` for visuals (only for narration).

---

## Disclaimer (final 1.5s before fade-to-black)

> Wellness practice · not a medical device · not for diagnosis
