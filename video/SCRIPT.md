# "We Rise" — Music Video Script

**Style:** dreamy sunrise — drifting pastel gradients (indigo → violet → coral → cream), a glowing sun that rises through the choruses, soft white/cream serif typography (Playfair Display), gentle parallax, no live action.
**Aspect ratio:** 1920×1080 @ 30 fps
**Estimated runtime:** 3:30 (placeholder — locked once audio file is in place)
**Visual through-line:** night → dawn → full daylight, mirroring "we rise like the sun." Each chorus = sun higher in frame, sky warmer.

---

## Scene 1 — Intro (0:00 – 0:08)

- **Sky:** pure black → slow fade up to deep indigo (#0a1037).
- **Horizon:** a faint band of lighter blue forms two-thirds down the frame.
- **Element:** a single point of light (the future sun) appears at the horizon and pulses softly.
- **Stars:** 30–40 small particles drift slowly upward.
- **Text:** none.
- **Feel:** still, anticipatory.

## Scene 2 — Verse 1 (0:08 – 0:38)

- **Sky:** indigo (#0a1037) → violet (#2a1a5e) over the verse.
- **Sun seed:** the horizon point glows brighter, casting a soft vertical column.
- **Particles:** stars drift faster, a few fireflies cross the frame at different depths (parallax).
- **Lyrics** (lower-third, soft serif, 64 px, white at 90% opacity, fade in 0.4 s, hold, slide up 30 px and fade out as next line starts):

  - 0:08 – 0:15 · "In the heart of the night, we find our way,"
  - 0:15 – 0:23 · "Chasing the glow, where the dreamers play."
  - 0:23 – 0:31 · "Every heartbeat's a pulse, a call to ignite,"
  - 0:31 – 0:38 · "Together we rise, reaching higher in flight."

## Scene 3 — Bridge 1 (0:38 – 0:50)

- **Sky:** violet warms slightly toward magenta on the horizon.
- **Element:** the horizon glow blooms outward in a slow radial pulse (3 pulses over the bridge).
- **Lyrics** (centered, 80 px, scale up gently 0.96 → 1.00, slightly brighter):

  - 0:38 – 0:44 · "Let the lights guide our souls,"
  - 0:44 – 0:50 · "Together we'll break the mold."

## Scene 4 — Chorus 1 (0:50 – 1:20)

- **Sky:** rapid warm shift — violet → magenta → coral (#ff7a59) → peach (#ffb27a).
- **Sun:** lifts off the horizon, climbs to ~⅓ from the bottom of frame; soft glow halo.
- **Beat reactivity:** subtle 1.02× scale pulse on the sun every downbeat (assumed 4-on-the-floor).
- **Lyrics** (centered upper-third, 96 px, warm cream #fff4e5, paired stanzas with two lines visible at once on the last beat):

  - 0:50 – 0:58 · "We rise like the sun, we rise like the tide,"
  - 0:58 – 1:05 · "Hand in hand, we're on this ride."
  - 1:05 – 1:12 · "Love is the anthem, hope leads the way,"
  - 1:12 – 1:20 · "Together forever, we'll dance and we'll sway."

## Scene 5 — Verse 2 (1:20 – 1:50)

- **Sky:** peach softens to cream/lavender (#f4e5ff over a peach base).
- **Sun:** holds at mid-sky.
- **Element:** painterly brush-stroke shapes (5–7) drift slowly across the frame, low opacity, varying scale for depth.
- **Lyrics** (lower-third again, returning to verse style):

  - 1:20 – 1:28 · "With every whisper, together we stand,"
  - 1:28 – 1:35 · "Taking our dreams, painting the land."
  - 1:35 – 1:42 · "No more shadows, we light up the skies,"
  - 1:42 – 1:50 · "With voices united, our hopes will arise."

## Scene 6 — Bridge 2 (1:50 – 2:02)

- **Sky:** holds, but a warm bloom pulses outward from the sun on each beat (stronger than Bridge 1).
- **Lyrics** (centered, 80 px, slight beat-synced opacity pulse):

  - 1:50 – 1:56 · "Feel the rhythm, hear it loud,"
  - 1:56 – 2:02 · "This is our moment, let's make it proud."

## Scene 7 — Chorus 2 + Outro (2:02 – 3:30)

- **Sky:** full sunrise — coral, gold (#ffd479), cream — sky fills with warm light.
- **Sun:** rises to centre frame, then beyond; the whole frame becomes radiant.
- **Element:** light streamers / soft god-rays emanate outward.
- **Lyrics** (centered, 104 px chorus / 88 px outro, building):

  - 2:02 – 2:10 · "We rise like the sun, we rise like the tide,"
  - 2:10 – 2:18 · "Hand in hand, we're on this ride."
  - 2:18 – 2:26 · "Love is the anthem, hope leads the way,"
  - 2:26 – 2:34 · "Together forever, we'll dance and we'll sway."
  - 2:34 – 2:48 · "Hands in the air, we're shining bright," *(extended hold)*
  - 2:48 – 3:05 · "We rise together into the night." *(longest hold, max scale)*
- **Outro (3:05 – 3:30):** lyrics fade out; the sky slowly fades to white; horizon line dissolves; final hold on a glowing white frame for 1.5 s before cut.

---

## Asset / dependency checklist

- [ ] `video/public/song.mp3` — the master audio (user provides; filename can be different — tell me)
- [ ] Confirm visual direction (or redirect)
- [ ] Real lyric timings (replace placeholders above) — needed once audio is in place

## Section colour palette (for `theme.ts`)

| Section   | Sky base    | Accent     | Lyric colour |
| --------- | ----------- | ---------- | ------------ |
| Intro     | `#0a1037`   | `#ffffff`  | —            |
| Verse 1   | `#2a1a5e`   | `#a4b3ff`  | `#ffffffe6`  |
| Bridge 1  | `#3d1f6e`   | `#ff8fb1`  | `#fff4e5`    |
| Chorus 1  | `#ff7a59`   | `#ffd479`  | `#fff4e5`    |
| Verse 2   | `#f4e5ff`   | `#ffb27a`  | `#3a2640`    |
| Bridge 2  | `#ffb27a`   | `#ff7a59`  | `#3a2640`    |
| Chorus 2  | `#ffd479`   | `#ffffff`  | `#3a2640`    |
| Outro     | `#ffffff`   | —          | —            |
