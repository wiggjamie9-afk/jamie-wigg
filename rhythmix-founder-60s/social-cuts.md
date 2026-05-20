# RHYTHMIX Founder — Social Cutdowns

Source: `rhythmix-founder-60s.mp4` (1920×1080, 60s) + `narration.txt`
Hook line (locked across all cuts): **"Hi. I'm Jamie. I built this."**

---

### TikTok 30s

Strongest third of the founder narration: the direct-to-camera intro, the "one developer / one iPhone / one impossible question" beat, and the price punchline. Pacing front-loads the face + name at 0.0s — founder POV is the scroll-stopper, no logo first.

| # | Time | Voiceover (one line) | On-screen text | Visual note |
|---|------|----------------------|----------------|-------------|
| 1 | 0.0s → 2.5s | "Hi. I'm Jamie. I built this." | HI. I'M JAMIE. I BUILT THIS. | Direct-to-camera close-up, no logo, raw room tone. Type slam on the last three words. |
| 2 | 2.5s → 6.0s | "Producers cost too much. Studios were too far away." | PRODUCERS · STUDIOS · GATEKEEPERS | Three-beat cut: empty studio → expensive desk → locked door. Cool grade. |
| 3 | 6.0s → 9.0s | "The industry was built for someone else. Not for us." | NOT FOR US | Slow push-in back on Jamie's face, warm grade returns. |
| 4 | 9.0s → 12.5s | "So I built RHYTHMIX." | SO I BUILT RHYTHMIX | Wordmark snaps in over a phone screen showing the app. |
| 5 | 12.5s → 16.5s | "One developer. One iPhone. One impossible question." | 1 DEV · 1 iPHONE · 1 QUESTION | Three rapid POV shots — laptop, phone, notebook with the question underlined. |
| 6 | 16.5s → 20.5s | "What if making music only took an idea?" | WHAT IF MUSIC ONLY TOOK AN IDEA? | Prompt typing → waveform blooms out of the cursor. |
| 7 | 20.5s → 24.0s | "Generate. Master. Release. Earn from the first play." | GENERATE · MASTER · RELEASE · EARN | Four-beat montage: text prompt → EQ → Spotify/Apple → counter ticking. |
| 8 | 24.0s → 27.5s | "One hundred and forty-nine dollars. Once. Lifetime." | $149 ONCE · LIFETIME · NO SUBSCRIPTION | Big numerals slam in. Red strike through "$/mo". |
| 9 | 27.5s → 30.0s | "Be first. rhythmix app dot com dot a u." | rhythmixapp.com.au → | URL + QR + arrow pointing at profile bio. End card holds the last beat. |

CTA: URL + QR end card on shot 9.

---

### Instagram Reels 15s

Tightest version. Founder face + name lands inside the first second — no logo, no intro card. The story collapses to: who I am → why I built it → what it costs.

| # | Time | Voiceover (one line) | On-screen text | Visual note |
|---|------|----------------------|----------------|-------------|
| 1 | 0.0s → 2.0s | "Hi. I'm Jamie. I built this." | HI. I'M JAMIE. I BUILT THIS. | Direct-to-camera, no logo. Hard cut, no fade-in. |
| 2 | 2.0s → 5.0s | "One developer. One iPhone. One impossible question." | 1 DEV · 1 iPHONE · 1 QUESTION | Three jump-cuts on the beat. Type slam in sync. |
| 3 | 5.0s → 9.0s | "What if making music only took an idea? Meet RHYTHMIX." | MEET RHYTHMIX | Prompt typing → waveform blooms → wordmark snaps in. |
| 4 | 9.0s → 12.5s | "One hundred forty-nine. Once. Lifetime." | $149 · ONCE · LIFETIME | Numerals slam, "no subscription" stamp drops. |
| 5 | 12.5s → 15.0s | "Be first. rhythmixapp.com.au" | rhythmixapp.com.au + QR | End card with URL, QR, and a tap-now arrow. |

CTA: URL + QR end card on shot 5.

---

### YouTube Shorts (60s) reuse note

Confirmed via `ffprobe`: `rhythmix-founder-60s.mp4` is **1920×1080 (16:9 landscape)**, which is not Shorts-compatible — YouTube Shorts requires 9:16 vertical (1080×1920) and will hard-letterbox or down-rank landscape uploads from algorithmic distribution. To reuse the 60s for Shorts, reframe the composition to 9:16 by re-rendering the HyperFrames source (`index.html`) at 1080×1920 rather than scaling/cropping the existing MP4 — the current frame puts Jamie's face and the wordmark centered for a wide canvas, and a naïve center-crop will lose the side type slabs at "PRODUCERS / STUDIOS / GATEKEEPERS" and "GENERATE / MASTER / RELEASE / EARN" beats. Move each scene's primary text into a vertical safe-zone (centered band between 15% and 85% height), stack the four-action montage as a vertical list, keep Jamie's talking-head shots framed tighter (head-and-shoulders rather than mid-shot) so they read on a phone, and keep the QR/URL end card untouched (already centered). Re-render. Narration audio (`narration.mp3`) is unchanged and re-attaches directly.
