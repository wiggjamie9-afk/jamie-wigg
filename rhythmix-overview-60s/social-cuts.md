# RHYTHMIX Overview — Social Cutdowns

Source: `rhythmix-overview-60s.mp4` (1920×1080, 60s, 30fps) + `narration.txt`
Hook line (locked across all cuts): **"What if making music didn't take years?"**

---

### TikTok 30s

Front-loads the rhetorical hook, compresses the four pillars to a fast quadrant, and lands on the lifetime price + URL. Voice-driven, no preamble.

| # | Time | Voiceover (one line) | On-screen text | Visual note |
|---|------|----------------------|----------------|-------------|
| 1 | 0.0s → 2.5s | "What if making music didn't take years?" | WHAT IF MAKING MUSIC DIDN'T TAKE YEARS? | Open on black, type slam in on the beat. No logo yet. |
| 2 | 2.5s → 5.0s | "No producer. No studio. No instrument. Just an idea." | NO PRODUCER · NO STUDIO · NO INSTRUMENT | Three hard cuts; final cut holds on "JUST AN IDEA" in yellow. |
| 3 | 5.0s → 8.5s | "Meet RHYTHMIX. A complete studio in your pocket." | MEET RHYTHMIX | Wordmark snap-in with a single bass hit; phone-in-hand b-roll behind. |
| 4 | 8.5s → 13.0s | "Four pillars: Generate. Master. Distribute. Earn." | GENERATE · MASTER · DISTRIBUTE · EARN | 2×2 quadrant builds in on each word; each tile pulses on its beat. |
| 5 | 13.0s → 17.0s | "Idea to track in minutes. Pro-grade master, every time." | IDEA → TRACK → MASTER | Prompt typing → waveform bloom → mastering meters dancing. |
| 6 | 17.0s → 20.5s | "Release everywhere. Earn from the first play." | RELEASE · EARN | Spotify / Apple Music / YouTube logos flicker → counter ticks up. |
| 7 | 20.5s → 24.0s | "Built for bedroom producers and first-time artists." | BUILT FOR YOU | POV: laptop on an unmade bed, headphones, fairy lights. |
| 8 | 24.0s → 27.5s | "One hundred and forty-nine dollars. Once. Lifetime." | $149 ONCE · LIFETIME · NO SUBSCRIPTION | Numerals slam in; red strike crosses out "$/mo". |
| 9 | 27.5s → 30.0s | "Begin at rhythmix app dot com dot a u." | rhythmixapp.com.au + QR → | End card: URL, QR, arrow pointing at the bio. |

CTA: URL + QR end card on shot 9.

---

### Instagram Reels 15s

Tightest version. Hook before the first second. No logo intro card.

| # | Time | Voiceover (one line) | On-screen text | Visual note |
|---|------|----------------------|----------------|-------------|
| 1 | 0.0s → 2.5s | "What if making music didn't take years?" | WHAT IF MAKING MUSIC DIDN'T TAKE YEARS? | Black frame, type slam, no logo. |
| 2 | 2.5s → 5.5s | "No producer. No studio. No instrument — meet RHYTHMIX." | MEET RHYTHMIX | Three jump-cuts on the trio of "no"s → wordmark snaps in. |
| 3 | 5.5s → 9.5s | "Generate. Master. Distribute. Earn." | GENERATE · MASTER · DISTRIBUTE · EARN | 2×2 quadrant builds tile by tile, in rhythm. |
| 4 | 9.5s → 12.5s | "One hundred forty-nine. Once. Lifetime." | $149 · ONCE · LIFETIME | Numerals slam, "no subscription" stamp drops. |
| 5 | 12.5s → 15.0s | "rhythmixapp.com.au" | rhythmixapp.com.au + QR | End card with URL, QR, tap-now arrow. |

CTA: URL + QR end card on shot 5.

---

### YouTube Shorts (60s) reuse note

The existing `rhythmix-overview-60s.mp4` is rendered at **1920×1080 (16:9 landscape)** — this is the canonical landscape reference per CLAUDE.md and is **not Shorts-compatible**. YouTube Shorts requires 9:16 vertical (1080×1920); landscape uploads either hard-letterbox or get suppressed by algorithmic distribution. To reuse the 60s for Shorts, re-render the HyperFrames source (`index.html`) at 1080×1920 rather than scaling/cropping the existing MP4 — the overview composition uses the full landscape width for the four-pillar quadrant ("Generate / Master / Distribute / Earn") and a naïve center-crop will clip the outer tiles. For the vertical re-render: stack the four pillars as a vertical 4-row list instead of a 2×2 quadrant, move every primary text element into a vertical safe-zone (centered band between 15% and 85% height), keep the QR/URL end card untouched (already centered), and re-render. Narration audio (`narration.mp3`, 60s) is aspect-agnostic and re-attaches directly.
