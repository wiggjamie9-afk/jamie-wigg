# RHYTHMIX LIVE — Pitch (60s) · Narration script

**Target voice**: Adam (ElevenLabs) — confident male US. Stability 0.45, similarity 0.75, style 0.35.
**Tempo**: ~175 wpm.
**Tone**: Builder confidence. Match `rhythmix-overview-60s/script.txt` — short, declarative, decisive. No bounce.

Total word count: ~170 words. Stays under 175 wpm across 60s.

---

## Scene 1 — Hook (0:00 – 0:10)

> A new release from RHYTHMIX.
>
> Made the song. *Now make the moment.*

**Beats** — 14 words. Hard pause between sentences. Italics for emphasis on "Now make the moment."

---

## Scene 2 — Drop the track (0:10 – 0:20)

> Step one. Drop the track.
>
> Suno, Udio, or any MP3. *Glass Bones.* Three twenty-four. One twenty-four BPM. Ready.

**Beats** — 25 words. List items punched. "Glass Bones" said as the title. Speed-talk the numbers.

---

## Scene 3 — Beat-lock (0:20 – 0:30)

> Step two. Beat-lock.
>
> Kling two point six reads the waveform. Every cut. Every transition. *Locked* to a beat.

**Beats** — 23 words. The three "every" lines are punched in sequence. "Locked" hits hard.

---

## Scene 4 — Three formats (0:30 – 0:40)

> Step three. Three formats. One pass.
>
> Nine sixteen for TikTok. One one for Instagram. Sixteen nine for YouTube.
>
> One render. *Done.*

**Beats** — 27 words. The three format ratios said as numbers, not "nine to sixteen." Stagger 0.3s between platforms.

---

## Scene 5 — Fourthwall merch (0:40 – 0:50)

> Step four. Drop the merch.
>
> Vinyl. Hoodie. Lyric print. *Fourthwall* tied to every release. One click after publish.

**Beats** — 26 words. The merch list is staccato — one item per beat. "Fourthwall" emphasized. Closing line landed flat-confident.

---

## Scene 6 — End card (0:50 – 1:00)

> RHYTHMIX LIVE.
>
> *Nineteen dollars a month.* Pro tier. Unlimited. No watermark.
>
> rhythmix app dot com dot au slash live.

**Beats** — 25 words. "Nineteen dollars a month" is the hero number — stretch it slightly. URL spoken slowly, every segment audible.

---

## Notes for the renderer

- 6 scenes × 10s = 60s total.
- Captions are baked into the composition (`.caption.c1`–`.c6`). Web Speech fallback runs automatically on tap; replace with ElevenLabs MP3 mixed against the visual timeline for the production render.
- Music bed: optional ~120 BPM instrumental, ducked under VO. Use a beat hit at each scene boundary (0:00, 0:10, 0:20, 0:30, 0:40, 0:50). The cut markers in scene 3 land on the 124 BPM grid of the demo waveform — sync the music bed to the same tempo if possible.
- Sound design: subtle digital cut/whoosh on each scene transition. Beat-lock scene benefits from a quantized snare or click on each visual cut marker.
- No music sting at the end — let the spoken price land in clear space.
