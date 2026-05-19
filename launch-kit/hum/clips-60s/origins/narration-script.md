# HUM — Origins of HUM (60s) · Narration Script

**Total runtime:** 60.0 s
**Voice:** Charlotte (ElevenLabs) · fallback: Samantha (iOS) / Karen (macOS)
**Cadence target:** ~155 wpm — slightly brisker than the how-to clip; this one carries more information per second.
**Total word count:** 95 words

---

## Timed lines

| # | Start | End  | Line |
|---|------:|-----:|------|
| 1 | 00.5  | 05.5 | Humming is older than you think. |
| 2 | 06.5  | 17.0 | The Hatha Yoga Pradīpikā calls it *Bhramari* — bee breath. Five thousand years of yogis hummed before science could measure why. |
| 3 | 18.5  | 31.0 | Nineteen twenty-one. Otto Loewi proves the vagus nerve calms the heart. Nobel Prize. Humming is now nervous-system science. |
| 4 | 32.5  | 45.0 | Two thousand and two. Researchers in Stockholm measure nasal nitric oxide during humming — a fifteen-fold rise. The sinuses become a resonance chamber. |
| 5 | 46.5  | 55.0 | Five thousand years of practice. One hundred years of science. One app. |
| 6 | 56.5  | 59.5 | HUM. Thirty Australian dollars, lifetime. rhythmixapp dot com dot au slash hum. |

---

## Pronunciation guide

- **Hatha Yoga Pradīpikā** → *HUT-ha YOH-ga pra-DEEP-ih-kah*. If using ElevenLabs Charlotte and the long Sanskrit name garbles, fall back to the spelling `Hatha Yoga Pradeepika` in the source string (already done in the inline JS for Web Speech).
- **Bhramari** → *BRAH-mah-ree*. The "Bh" is a soft B, not a separate consonant cluster. If TTS mangles it, spell it `Bramari` (already done in the inline JS).
- **Otto Loewi** → *AH-toh LO-vee*. Austrian-German pronunciation. (TTS will usually get this; ElevenLabs Charlotte handles it cleanly.)
- **Stockholm** → standard English *STOCK-home*.

## Delivery notes

- **Line 1**: Hushed, curious. The hook is "older than you think" — give a tiny pause before "older".
- **Line 2**: Reverent on "Bhramari" and "bee breath" — these are the lineage anchors. "Five thousand years" lands as a fact, not a flourish.
- **Line 3**: Brisker. This is the science pivot. "Nobel Prize" is a discrete beat — give it a comma's worth of silence after.
- **Line 4**: Clean and precise. The number "fifteen-fold" is the line — don't let it pass by. Slight emphasis on "Stockholm" because it cements that this is real published work.
- **Line 5**: Three-part rhythm. Each clause is a beat. The italic "practice / science / app" land in escalating weight. The "One app" beat is the punchline — slightly slower.
- **Line 6**: Same delivery as the how-to clip's closer. Steady. Read the URL clearly.

## Sources used (for fact-check)

These lines have to be accurate to survive scrutiny.

- Bhramari / Hatha Yoga Pradīpikā — Chapter 2, verse 68. (See `docs/refs/humming-research-origins.md` §1.1.)
- Otto Loewi — 1921 frog-heart experiment isolating vagus-released "Vagusstoff" (later identified as acetylcholine); Nobel Prize 1936 (shared with Henry Dale). The script says "1921 — Loewi proves the vagus nerve calms the heart … Nobel Prize" which is accurate; the Prize came later but the proof was 1921.
- Weitzberg & Lundberg — *Am J Respir Crit Care Med* 166(2):144–145, 15 July 2002. n=10. 15-fold nasal NO increase during humming exhalation. (See §3.1.)

## ElevenLabs settings (if using Charlotte direct)

- Stability: 0.40
- Similarity: 0.78
- Style: 0.22
- Speaker boost: on
- Format: mp3_44100_128
