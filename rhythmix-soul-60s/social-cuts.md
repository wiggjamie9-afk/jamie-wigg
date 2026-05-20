# RHYTHMIX Soul — Social Cutdowns

**Source:** `rhythmix-soul-60s.mp4` — **1920x1080 (16:9 landscape)**
**Hook:** "A spark. A pulse. A heartbeat." (front-loaded in the first 2s on every cut)
**Tone:** Soft, slow, intimate. Soul angle — *your spark is already there*. No hard sell, no urgency, no price spam in cutdowns. Pacing is deliberately slower than the launch/anthem cuts; let lines breathe.

---

### TikTok 30s — 9 shots

Aspect: needs vertical reframe — see *Production notes — Aspect handling* below. Cuts hold longer than the teaser/anthem variants (3–4s average vs 1.8s) to match the soul angle. Captions soft-faded, not punched. Optimized for sound-off (every line has on-screen text), but this one rewards sound-on.

| #   | Time          | VO                                                                              | On-screen text                                | Visual                                                                                  |
| --- | ------------- | ------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | 0.0s → 3.0s   | "A spark. A pulse. A heartbeat."                                                | **a spark. a pulse. a heartbeat.** (lowercase, slow fade in per word) | Black frame. Single warm point of light, breathing softly. No cuts. |
| 2   | 3.0s → 6.5s   | "That feeling when a song finds you."                                           | "when a song finds you"                       | Slow push-in on a face lit by warm light — eyes closed, listening.                      |
| 3   | 6.5s → 9.5s   | "And somehow knows what you couldn't say."                                      | "what you couldn't say"                       | Hands resting on a notebook. Pen down. Still.                                           |
| 4   | 9.5s → 12.5s  | "Meet RHYTHMIX. Where your spark becomes music."                                | **RHYTHMIX** (soft logo reveal, no flicker)   | Warm waveform blooms beneath the logo. Hold.                                            |
| 5   | 12.5s → 17.0s | "Describe what you hear. Refine until it's yours. Release to the world."        | "describe → refine → release"                 | Three soft UI flashes — prompt typing, waveform shaping, share button. No hard cuts; crossfades. |
| 6   | 17.0s → 21.0s | "For bedroom artists. First-time songwriters. Solo creators."                   | "for anyone with a story still inside them"   | Slow montage: kid at desk with headphones, person humming in their car, voice memo on a phone. |
| 7   | 21.0s → 25.0s | "Your spark is already there."                                                  | **your spark is already there**               | Return to the warm point of light from shot 1, now brighter. Hold.                      |
| 8   | 25.0s → 28.0s | "You just have to let it out."                                                  | "let it out"                                  | The light expands into a soft waveform that fills the frame.                            |
| 9   | 28.0s → 30.0s | "rhythmixapp.com.au"                                                            | **rhythmixapp.com.au**                        | URL over logo. Slow fade to black. Loop-friendly tail.                                  |

**Caption suggestion:** "your spark is already there. 🤍 #songwriter #bedroomartist #musicAI #aimusic #firstsong"

---

### Instagram Reels 15s — 5 shots

Aspect: needs vertical reframe. Compressed to the emotional spine — open on the hook, land on the promise, exit on the URL. No feature list. Reels rewards completion + replay, so end on a soft logo loop.

| #   | Time          | VO                                                          | On-screen text                  | Visual                                                            |
| --- | ------------- | ----------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| 1   | 0.0s → 3.0s   | "A spark. A pulse. A heartbeat."                            | **a spark. a pulse. a heartbeat.** | Black, warm light breathing. Single take.                         |
| 2   | 3.0s → 6.0s   | "When a song finds you, and knows what you couldn't say."   | "what you couldn't say"         | Face in warm light, eyes closed.                                  |
| 3   | 6.0s → 9.5s   | "RHYTHMIX. Where your spark becomes music."                 | **RHYTHMIX**                    | Logo reveal over warm waveform.                                   |
| 4   | 9.5s → 12.5s  | "Your spark is already there."                              | **your spark is already there** | Warm light expanding into waveform.                               |
| 5   | 12.5s → 15.0s | "rhythmixapp.com.au"                                        | **rhythmixapp.com.au**          | URL + logo, slow fade. Loop-friendly black tail.                  |

**Caption suggestion:** "your spark is already there. 🤍 #songwriter #musicAI #indieartist"

---

### YouTube Shorts (60s) — reuse note

⚠️ **Aspect mismatch.** Verified via `ffprobe`: `rhythmix-soul-60s.mp4` is **1920x1080 (16:9 landscape)**, NOT 9:16 like the teaser. Shorts technically accepts landscape, but the algorithm heavily favours 9:16 and will pillarbox or letterbox landscape content — kills reach.

**Three options:**

1. **Re-render the master as 9:16.** The HyperFrames composition in this folder (`index.html`, `meta.json`) is the source of truth. Update the canvas/render config to 1080x1920 and re-render. This is the cleanest path — preserves the slow-paced emotional pacing without crop guesswork.
2. **Reframe in post (acceptable for v1).** Center-crop the 1920x1080 to 1080x1920 — works for shots 1, 2, 4, 7, 8 (single subject, central composition). Shots 5 (three-up UI flash) and 6 (montage) need attention; stack the three UI flashes vertically instead of side-by-side, and tighten the montage to one figure per beat.
3. **Skip Shorts entirely for this cut.** The soul variant is intentionally slow and intimate — it may perform better as a 60s landscape YouTube pre-roll or in-feed Instagram (not Reels) than as a Short. Reserve Shorts for the teaser and anthem cuts where the punchier pacing matches the format.

**If posting to Shorts (after vertical reframe):**

- **Hook front-loaded** — "A spark. A pulse. A heartbeat." lands at 0.0s. Good.
- **Pin a comment** with the URL after upload (Shorts strips clickable links from descriptions on mobile).
- **Description copy:** "Your spark is already there. RHYTHMIX — an AI music platform for bedroom artists, first-time songwriters, and solo creators. rhythmixapp.com.au #Shorts #AIMusic #Songwriter #BedroomArtist"
- **No edit required** for duration — already 60s. The aspect is the only blocker.
- **Title card overlay:** consider pinning "your spark is already there" in the first 2 seconds as a sticky text element (YouTube's algorithm reads on-screen text).

---

## Production notes (all cuts)

- **Pacing is the brand.** This is the soul variant — every cut should feel ~30% slower than the teaser/anthem versions. Resist the TikTok-default urge to jump-cut every 1.5s. Hold shots. Let the VO breathe. The hook is emotional, not a barrier-removal pitch.
- **Aspect handling — landscape source.** The master is 1920x1080. For TikTok and Reels (9:16 native), either re-render the HyperFrames composition at 1080x1920 (preferred) or center-crop in post. Center-crop works for the single-subject shots; the UI-flash and montage shots need re-staging.
- **Audio ducking** — narration always above bed music by 8 dB minimum (vs 6 dB on teaser/anthem). The soul tone breaks if music crowds the VO.
- **Burned-in captions** — soft-faded, lowercase, never punched or stroked. Use the brand's warm/cyan palette from `DESIGN.md`, not pure white.
- **Safe zones** — keep all text inside the central 80% vertical band; TikTok UI eats the bottom 15% and top 10%.
- **Logo lockup timing** — RHYTHMIX logo holds for at least 2s on every cut (vs 1.5s on teaser/anthem) for brand recall and to match the slower pacing.
- **No price in cutdowns** — the $149 lifetime price is in the 60s master VO ("One hundred and forty-nine dollars. Lifetime.") but stripped from 15s/30s cuts to keep the emotional tone. Save price for retargeting cuts.
- **End frame** — every cut ends on a soft fade to black with a 0.5s loop-friendly tail. No abrupt cuts; the soul tone dies on hard exits.
