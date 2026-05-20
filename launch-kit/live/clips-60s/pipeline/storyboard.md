# RHYTHMIX LIVE — Pipeline (60s) · Storyboard

Vertical 1080×1920 · 30fps · 1800 frames total · 6 scenes × 10s each.

This cut is the **stack-aware** version of the pitch — heavier on the actual technical pieces (Suno, Kling 2.6, HyperFrames) and the tier pricing. Use for IG carousels, LinkedIn, and the YouTube long-form description page.

## Scene 1 — "Now what?" (0:00 – 0:10)

**Frames**: 0 – 299
**Visual**: Cold open. Eyebrow "RHYTHMIX LIVE" at top. Center: three stacked lines:
- "Made the song." (white, 160px)
- "Now what?" (muted italic, beat of silence)
- After 4.5s: "Now make the moment." reveals in spectrum gradient at 180px
**Animation**: First two lines fade in 0.5s apart. After a deliberate 3.5s hold, the third line drops in with a 0.8s `cubic-bezier(0.16, 1, 0.3, 1)`. No motion afterwards — let the reveal land.
**Caption**: "The 'now what' tool for Suno artists."
**Audio**: Silence under "Then what?" Magenta synth swell on the third line.

## Scene 2 — The stack (0:10 – 0:20)

**Frames**: 300 – 599
**Visual**: Three numbered rows.
- 01 · Suno API · "AUDIO · PERSISTENT VOICE CLONE" (magenta border)
- 02 · Kling 2.6 · "AUDIO-CONDITIONED VIDEO · DEC 2025" (purple border)
- 03 · HyperFrames · "COMPOSITION · 3 FORMATS, 1 PASS" (green border)
**Animation**: Rows fade up with 120ms stagger. Each row's number flashes its accent color on entry. The Kling row gets a small "NEW" badge implied by the "DEC 2025" label.
**Caption**: "Three pieces. **Suno**, **Kling**, **HyperFrames.**"
**Audio**: One quantized tick per row entry.

## Scene 3 — The flow (0:20 – 0:30)

**Frames**: 600 – 899
**Visual**: Vertical flow diagram.
- Node 1 (magenta): waveform icon + "Your track" + "IN"
- ↓
- Node 2 (purple, glow): cut-marker icon + "Beat-sync · cuts locked" + "KLING 2.6"
- ↓
- Node 3 (green): three-format-grid icon + "9:16 · 1:1 · 16:9" + "3 FORMATS"
**Animation**: Nodes appear top-to-bottom with 200ms stagger. Each arrow draws (0.3s) after its predecessor lands. The Kling node has a subtle scale-up pulse on the second beat.
**Caption**: "Track in. **Beat-sync.** Three videos out."
**Audio**: Drop "tick" for each node land. Whoosh as the arrows fill.

## Scene 4 — The deliverables (0:30 – 0:40)

**Frames**: 900 – 1199
**Visual**: Three horizontal format rows.
- 9:16 magenta + "TIKTOK · REELS · SHORTS" + 60s
- 1:1 cyan + "IG FEED · FACEBOOK" + 15s
- 16:9 green + "YOUTUBE" + 4 min
Followed by body line "One drop. **One render.**"
**Animation**: Rows slide in left with 150ms stagger. Each ratio number scales 0.92→1.0. The body line types in last.
**Caption**: "Sixty seconds. Fifteen seconds. Four minutes."
**Audio**: A short ascending three-note motif locked to the row reveals.

## Scene 5 — Pricing tiers (0:40 – 0:50)

**Frames**: 1200 – 1499
**Visual**: Three tier cards stacked vertically.
- Free · $0 · "1 VIDEO/MO · WATERMARK" (subdued white border)
- **Pro · $19/mo · "UNLIMITED · NO MARK · FOURTHWALL"** (magenta-glowed, gradient bg)
- Studio · $49/mo · "VOICE CLONE · PRIORITY QUEUE" (green border)
**Animation**: Free fades in first. Pro pops in slightly larger with a subtle magenta inner-glow (this is the recommended tier). Studio enters last. All within the first 2s of the scene.
**Caption**: "**$19/mo** Pro. **$49/mo** Studio."
**Audio**: Three rising synth notes locked to the tier reveals — Free (low), Pro (mid + accent), Studio (high).

## Scene 6 — End card (0:50 – 1:00)

**Frames**: 1500 – 1799
**Visual**:
- `LIVE.` wordmark at 240px (spectrum gradient + magenta dot)
- Tagline: "Cut to the beat. *Every beat.*"
- URL: "RHYTHMIXAPP.COM.AU / LIVE"
**Animation**: Wordmark scales in (0.7s). Tagline fades up. URL fades in last. Hold for 6s.
**Caption**: "Cut to the beat. **Every beat.**"
**Audio**: Single closing synth hit on the wordmark. Silence under the URL.

## Crossfade strategy

Same as the pitch cut: each scene overlaps the next by 0.6s. All internal animations complete by 8.5s of each scene.

## Differences from `pitch/`

- **Pitch** is the consumer-facing 60s — emotional hook, beat-lock visual demo, end-to-end story.
- **Pipeline** is the explainer 60s — names the stack, shows the flow as a diagram, surfaces the three-tier price grid. Better for prosumer / artist-developer audiences who want the "what's actually under the hood" answer.

Use both. Pitch for TikTok/Reels; Pipeline for LinkedIn, IG carousel slot 3+, and the embedded video on the landing page.
