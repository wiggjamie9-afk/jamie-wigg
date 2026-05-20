# RHYTHMIX LIVE — Pipeline (60s) · Narration script

**Target voice**: Adam (ElevenLabs) — confident male US. Stability 0.45, similarity 0.75, style 0.35. Alt: Charlotte for the same energy in female register.
**Tempo**: ~170 wpm.
**Tone**: Builder explainer. Walks the viewer through the actual stack — Suno, Kling, HyperFrames. Numbers do the work. Match `rhythmix-overview-60s/script.txt` energy.

Total word count: ~168 words. Comfortable under 175 wpm across 60s.

---

## Scene 1 — "Now what?" (0:00 – 0:10)

> You made the song. Then what?
>
> You just sat there.
>
> *RHYTHMIX LIVE is the answer.*

**Beats** — 17 words. The "Then what?" is a real question, half a beat of silence after. "You just sat there." is delivered flat. The third line lands with full conviction. The on-screen "Now make the moment." reveals on the second-to-last word.

---

## Scene 2 — The stack (0:10 – 0:20)

> Three pieces.
>
> *Suno* for the audio. Persistent voice clone across an album.
>
> *Kling 2.6* for beat-aware video. The first model that cuts to a waveform. Shipped December.
>
> *HyperFrames* for composition. Three formats. One pass.

**Beats** — 38 words. Each tool name punched. Numbers stay snappy. "Shipped December" is a casual flex — don't oversell it.

---

## Scene 3 — The flow (0:20 – 0:30)

> Here's the flow.
>
> Track in. *Beat-sync.* Three videos out.
>
> Every cut, every transition, lined up with a beat. No manual editing. Locked.

**Beats** — 24 words. The arrow visual on screen syncs to "Track in" / "Beat-sync" / "Three videos out." Beat-sync gets the loudest emphasis.

---

## Scene 4 — The deliverables (0:30 – 0:40)

> Three deliverables.
>
> Sixty-second vertical for TikTok, Reels, Shorts.
>
> Fifteen-second square for Instagram and Facebook feed.
>
> Four-minute landscape for YouTube.
>
> One render. *One pass.*

**Beats** — 31 words. Format / duration / platform in a tight pattern. The two-word ending is hammered. The on-screen format cards illuminate as their durations are spoken.

---

## Scene 5 — Pricing (0:40 – 0:50)

> Three tiers.
>
> Free. One video a month.
>
> *Pro. Nineteen a month.* Unlimited. No watermark. Fourthwall.
>
> *Studio. Forty-nine a month.* Voice cloning. Priority queue.

**Beats** — 28 words. Pro and Studio prices are heroes — stretch them. "Voice cloning" said with deliberate weight; it's the Studio differentiator. Skip "dollars" — just "nineteen a month" sounds right.

---

## Scene 6 — End card (0:50 – 1:00)

> RHYTHMIX LIVE.
>
> Cut to the beat. *Every beat.*
>
> rhythmix app dot com dot au slash live.

**Beats** — 18 words. The tagline lands as a single confident block. URL spoken slow, each segment audible.

---

## Notes for the renderer

- 6 scenes × 10s = 60s total.
- Captions baked into the composition (`.c1`–`.c6`).
- Music bed: optional ~120 BPM minimal instrumental. Duck under VO. Carry through scene 6 and let it cut clean on the URL line.
- Sound design: a quantized click on each cut-marker reveal (scene 3 visual). A soft synth hit on each tier card reveal in scene 5 — three rising notes (Free → Pro → Studio).
- ElevenLabs render: Adam, prefer "Studio" model quality (eleven_turbo_v2_5 or v3 if available). If using Charlotte instead, drop pitch by 0.02.
- Bake the MP3 against the visual timeline at 30fps. Lead-in silence of 0.2s before scene 1.
