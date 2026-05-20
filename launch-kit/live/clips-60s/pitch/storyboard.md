# RHYTHMIX LIVE — Pitch (60s) · Storyboard

Vertical 1080×1920 · 30fps · 1800 frames total · 6 scenes × 10s each.

## Scene 1 — Hook (0:00 – 0:10)

**Frames**: 0 – 299
**Visual**: Centered hero wordmark `LIVE.` in spectrum gradient at 280px. Above it the cyan eyebrow "RHYTHMIX PRESENTS" in mono caps. Below it the sub: "Made the song. *Now make the moment.*" — magenta italic on "Now make the moment."
**Animation**: Fade-up the eyebrow first (0.5s), then the wordmark scales 0.94→1.0 over 0.6s, then the sub fades up. After 1s of stillness, the dot after LIVE pulses magenta on the beat (2 small pulses).
**Caption**: "A new release from RHYTHMIX."
**Audio**: One soft kick on frame 0. Voiceover lands at ~frame 30.

## Scene 2 — Drop the track (0:10 – 0:20)

**Frames**: 300 – 599
**Visual**: A track card slides up — magenta-bordered, holding "SUNO v5 · MP3" label, title `"Glass Bones"`, then an animated waveform line draws across (stroke-dashoffset reveal, 1.4s `cubic-bezier(0.16,1,0.3,1)`), then metadata stripe "3:24 · 124 BPM · READY".
**Animation**: Card fades + translates up (0.5s). Wave draws (1.4s). Metadata fades in at the end with green "READY" punched bright.
**Caption**: "Drop the track. **Suno, Udio,** or any MP3."
**Audio**: Whoosh as card enters. Faint waveform "drip" as the line draws.

## Scene 3 — Beat-lock (0:20 – 0:30)

**Frames**: 600 – 899
**Visual**: A larger waveform-bars visualization in the center (60 vertical bars, spectrum gradient). 5 white vertical cut-markers drop in over the first 0.4s of the scene (80ms stagger). Each cut marker has a "CUT" label on top in cyan mono. A magenta dot sits on the centerline at each cut. Below: a pill chip "BEAT-LOCK · ACTIVE" with a pulsing green dot.
**Animation**: Bars appear, then the cut markers translate-down + fade-in staggered, then the green dot starts pulsing on the beat (124 BPM).
**Caption**: "Every cut **locked** to the waveform."
**Audio**: Each cut marker drops with a quantized click. Beat-lock chip flares once with the dot.

## Scene 4 — Three formats (0:30 – 0:40)

**Frames**: 900 – 1199
**Visual**: Three phone frames side by side, ordered tallest-to-widest: 9:16 (magenta-glowed), 1:1 (cyan-glowed), 16:9 (green-glowed). Each phone has a mini waveform inside its screen in its accent color. Below each, the ratio number (9:16, 1:1, 16:9) and label (60s · TIKTOK, 15s · IG FEED, 4 min · YOUTUBE).
**Animation**: Phones fade in left-to-right with 120ms stagger. Each waveform draws inside its screen with 0.6s delay between them. The body line "One render. One pass." fades in last.
**Caption**: "Nine sixteen. One one. Sixteen nine. **Done.**"
**Audio**: Three soft clicks as the phones land.

## Scene 5 — Fourthwall merch (0:40 – 0:50)

**Frames**: 1200 – 1499
**Visual**: Three gold-bordered merch cards in a row: Vinyl ($32), Hoodie ($58), Lyric print ($24). Each shows a simple monoline icon in gold + name + price + tiny mono label. Below: a body line "Fourthwall tied to every release. One click after publish."
**Animation**: Cards rise from below with 100ms stagger (0.5s each). Prices count up briefly (e.g. $32 from 0). The body line fades in last.
**Caption**: "Then drop **the merch.** One click."
**Audio**: A coin-style ding on the price reveal (not gaudy — a tasteful one-frame ping).

## Scene 6 — End card (0:50 – 1:00)

**Frames**: 1500 – 1799
**Visual**: `LIVE.` wordmark large (240px) at top. Below: a magenta-rim price chip "PRO · $19/mo". Below that: the URL in white mono caps.
**Animation**: Wordmark scales 0.95→1.0 with 0.7s `cubic-bezier(0.16,1,0.3,1)`. Price chip pops in (scale + fade) 0.3s later. URL fades in last. The whole card holds still for the final 6 seconds.
**Caption**: "RHYTHMIX LIVE. **$19/mo.**"
**Audio**: Final synth hit on the wordmark land. Silence under the URL — let it sit.

## Crossfade strategy

- Each scene fades out 0.4s before the next fades in (overlap window 0.6s total). Scene-internal animations all complete by the 8.5-second mark of each scene to give 1.5s of stable hold.
- No motion blur. The kinetic energy comes from element entrance staggers and the beat-locked cut visuals, not from camera-style transitions.

## Total motion budget (per scene, in seconds)

| Scene | Build | Hold | Exit | Total |
|---|---|---|---|---|
| 1 Hook | 1.2 | 8.0 | 0.8 | 10.0 |
| 2 Track in | 2.0 | 7.2 | 0.8 | 10.0 |
| 3 Beat-lock | 1.5 | 7.7 | 0.8 | 10.0 |
| 4 Three formats | 1.6 | 7.6 | 0.8 | 10.0 |
| 5 Merch | 1.4 | 7.8 | 0.8 | 10.0 |
| 6 End card | 1.5 | 7.7 | 0.8 | 10.0 |
