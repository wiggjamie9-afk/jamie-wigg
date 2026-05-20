# RHYTHMIX Anthem — Social Cutdowns

Source: `rhythmix-anthem-60s.mp4` (1920×1080, 60s) + `narration.txt`
Hook line (locked across all cuts): **"No producer. No studio. No instrument."**

---

### TikTok 30s

Strongest third of the narration: the opening manifesto + the "four moves" condensed + the price punchline. Pacing front-loads the hook at 0.0s with no preamble.

| # | Time | Voiceover (one line) | On-screen text | Visual note |
|---|------|----------------------|----------------|-------------|
| 1 | 0.0s → 2.5s | "No producer. No studio. No instrument." | NO PRODUCER / NO STUDIO / NO INSTRUMENT (3-beat type slam) | Hard cut on each word, black frame between. Yellow accent on the last word. |
| 2 | 2.5s → 5.5s | "If you have ideas, that's enough." | IF YOU HAVE IDEAS, THAT'S ENOUGH | Slow push-in on a phone screen, waveform pulsing. Warm grade. |
| 3 | 5.5s → 9.0s | "Meet RHYTHMIX. Where your music begins." | MEET RHYTHMIX | Logo reveal with a single bass-hit; freeze frame for half a second. |
| 4 | 9.0s → 13.5s | "Generate sound from idea." | GENERATE | Text prompt typing → waveform blooms out of the cursor. |
| 5 | 13.5s → 17.5s | "Master the way you hear it." | MASTER | EQ knobs turning, level meters dancing in time with the track. |
| 6 | 17.5s → 21.0s | "Distribute everywhere. Earn from the first play." | DISTRIBUTE · EARN | Quick montage: Spotify / Apple Music / YouTube logos → coins / counter ticking up. |
| 7 | 21.0s → 24.0s | "Built for bedroom artists." | BUILT FOR BEDROOM ARTISTS | Handheld POV: laptop on an unmade bed, headphones, fairy lights. |
| 8 | 24.0s → 27.5s | "One hundred and forty-nine dollars. Once." | $149 ONCE · LIFETIME · NO SUBSCRIPTION | Big numerals slam in. Cross out "$/mo" with a red strike. |
| 9 | 27.5s → 30.0s | "Begin at rhythmix app dot com dot a u." | rhythmixapp.com.au → | URL + QR + arrow pointing at profile bio. End card holds for the last beat. |

CTA: URL + QR end card on shot 9.

---

### Instagram Reels 15s

Tightest version. Hook lands inside the first second — no logo, no intro card.

| # | Time | Voiceover (one line) | On-screen text | Visual note |
|---|------|----------------------|----------------|-------------|
| 1 | 0.0s → 2.0s | "No producer. No studio. No instrument." | NO PRODUCER / NO STUDIO / NO INSTRUMENT | Three jump-cuts on the beat. Type slam, no logo yet. |
| 2 | 2.0s → 5.0s | "If you have ideas, that's enough — meet RHYTHMIX." | MEET RHYTHMIX | Bedroom-producer POV → wordmark snaps in. |
| 3 | 5.0s → 9.0s | "Describe what you hear. Refine. Release." | DESCRIBE → REFINE → RELEASE | Three-panel split: prompt box → waveform → streaming player. |
| 4 | 9.0s → 12.5s | "One hundred forty-nine. Once. Lifetime." | $149 · ONCE · LIFETIME | Numerals slam, "no subscription" stamp drops. |
| 5 | 12.5s → 15.0s | "rhythmixapp.com.au" | rhythmixapp.com.au + QR | End card with URL, QR, and a tap-now arrow. |

CTA: URL + QR end card on shot 5.

---

### YouTube Shorts (60s) reuse note

The existing `rhythmix-anthem-60s.mp4` is rendered at **1920×1080 (16:9 landscape)**, which is not Shorts-compatible — YouTube Shorts requires 9:16 vertical (1080×1920) and will hard-letterbox or reject landscape uploads from algorithmic distribution. To reuse the 60s for Shorts, reframe the composition to 9:16 by re-rendering the HyperFrames source (`index.html`) at 1080×1920 rather than scaling/cropping the existing MP4 — the current frame puts the wordmark and key type centered for a wide canvas, and a naïve center-crop will lose the side type slabs at "GENERATE / MASTER / DISTRIBUTE / EARN" beats. Move each scene's primary text into a vertical safe-zone (centered band between 15% and 85% height), stack the four-moves quadrant as a vertical list, keep the QR/URL end card untouched (already centered), and re-render. Narration audio (`narration.mp3`) is unchanged and re-attaches directly.
