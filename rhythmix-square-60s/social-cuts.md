# RHYTHMIX — "Square Social" Social Cutdowns

Source: `rhythmix-square-60s.mp4` · 1080×1080 (1:1 square)
Angle: Snappy social-feed pitch — "What if making music didn't take years?"

---

### TikTok 30s — 9 shots

Pick the strongest 30s of the 60: open with the curiosity hook, smash through the four pillars, hit the lifetime price, close with the URL. Reframe to 9:16 — the source is **1:1 square**, so vertical TikTok needs a top/bottom extension (blurred-square fill above + below the centred 1080×1080 frame) or a slight upscale-and-zoom (1080×1080 → 1215×1215, centre-crop to 1080×1920). Prefer the blurred-square fill so on-screen text stays inside the safe square.

| # | Time          | VO                                                     | On-screen text                          | Visual                                                              |
| - | ------------- | ------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------- |
| 1 | [0.0s → 2.5s] | "What if making music didn't take years?"              | WHAT IF…?                               | Hard cut from black. Curiosity-bait type, slow zoom.                |
| 2 | [2.5s → 5.0s] | "No producer. No studio. No instrument."               | NO STUDIO. NO INSTRUMENT.               | Three icons strike through one by one. Punchy.                      |
| 3 | [5.0s → 8.5s] | "Meet RHYTHMIX. A complete studio. In your pocket."    | RHYTHMIX. IN YOUR POCKET.               | Logo lockup → iPhone mockup. App UI flickers to life.               |
| 4 | [8.5s → 13.5s]| "Four pillars. Generate. Master. Distribute. Earn."    | GENERATE · MASTER · DISTRIBUTE · EARN   | Four-tile grid, one tile per beat. Centre-safe.                     |
| 5 | [13.5s → 17.0s]| "Describe the mood, the genre, the feeling."          | DESCRIBE IT.                            | Prompt-box typing animation. Cursor blink.                          |
| 6 | [17.0s → 20.0s]| "Refine in plain language with AI."                   | REFINE WITH AI.                         | Chat bubble exchange. Waveform morphs.                              |
| 7 | [20.0s → 23.0s]| "Release to every major platform in one tap."         | RELEASE EVERYWHERE.                     | Spotify · Apple · YouTube · TikTok logos cascade.                   |
| 8 | [23.0s → 27.5s]| "$149. Once. Lifetime updates."                       | $149 · ONCE · LIFETIME                  | Big price slab. Strike-through on "monthly."                        |
| 9 | [27.5s → 30.0s]| "Begin at rhythmixapp.com.au."                        | rhythmixapp.com.au                      | URL lockup. Logo. End card.                                         |

---

### Instagram Reels 15s — 5 shots

Skip the "no producer / no studio" pre-amble. Open on the product reveal, slam the pillars, drop the price, end on the URL.

| # | Time          | VO                                          | On-screen text             | Visual                                                       |
| - | ------------- | ------------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| 1 | [0.0s → 1.0s] | "Meet RHYTHMIX."                            | MEET RHYTHMIX.             | Hard punch-in on logo. Sub hit on frame 1.                   |
| 2 | [1.0s → 4.0s] | "A complete studio. In your pocket."        | STUDIO. POCKET.            | iPhone mockup, app UI animates in.                           |
| 3 | [4.0s → 8.5s] | "Generate. Master. Distribute. Earn."       | 4 PILLARS                  | Four-tile grid, one tile per word.                           |
| 4 | [8.5s → 12.5s]| "$149. Once. Lifetime updates."             | $149 LIFETIME              | Price slab. Subscription icon crossed out.                   |
| 5 | [12.5s → 15.0s]| "rhythmixapp.com.au."                      | rhythmixapp.com.au         | URL + logo. Hold.                                            |

---

### YouTube Shorts (60s) reuse note

Source confirmed via `ffprobe`: **1080×1080, 1:1 square** (`display_aspect_ratio=1:1`). Shorts requires a vertical 9:16 frame, so the square master cannot be uploaded as-is. Two viable reframes:

1. **Blurred-square fill (preferred):** keep the original 1080×1080 centred on a 1080×1920 canvas, fill top/bottom bars with a heavily-blurred, dimmed copy of the same frame. Preserves every on-screen text element exactly where it was authored. Zero re-composition risk.
2. **Centre-crop + zoom:** upscale 1080×1080 → ~1215×1215 and centre-crop a 1080×1920 vertical slice. Loses ~11% on each horizontal edge — only safe if every logo / price slab / URL was authored inside a 944-pixel-wide centre column. Audit `index.html` text positions before choosing this path.

Keep the original audio bed and VO untouched. Bake captions in (Shorts plays muted by default). No edit to the timeline — only the reframe step.
