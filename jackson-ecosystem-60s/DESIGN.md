# Jackson's Ecosystem — Design System

## Overview
60-second landscape (16:9) promotional video introducing Jackson's Ecosystem — a unified video-to-text-to-voice-to-music pipeline.

## Palette

| Role | Color | Usage |
|---|---|---|
| Primary | `#6366f1` | Indigo — brand accent, buttons, glows |
| Secondary | `#8b5cf6` | Violet — gradients, highlights |
| Accent | `#ec4899` | Pink — accent blobs, secondary emphasis |
| Dark BG | `#0f172a` | Deep navy — primary background |
| Dark BG 2 | `#1a1f4a` | Slate indigo — gradient mid-tone |
| Text Primary | `#ffffff` | White — main text |
| Text Secondary | `#a5b4fc` | Indigo-100 — taglines, descriptions |
| Subtle | `#c7d2fe` | Indigo-200 — fine print |

## Typography

| Element | Font | Size | Weight | Letter Spacing |
|---|---|---|---|---|
| Main Title (h1) | System Font Stack | 72px | 800 | -2px |
| Tagline | System Font Stack | 24px | 300 | 0.5px |
| Feature Title | System Font Stack | 18px | 600 | — |
| Feature Description | System Font Stack | 14px | 400 | — |

Font Stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif`

## Motion & Animations

| Element | Animation | Duration | Easing | Start |
|---|---|---|---|---|
| Logo | Slide down | 1s | ease-out | 0.2s |
| Title | Slide up | 1s | ease-out | 0.4s |
| Tagline | Slide up | 1s | ease-out | 0.6s |
| Features Grid | Slide up | 1s | ease-out | 0.8s |
| CTA Button | Slide up | 1s | ease-out | 1s |
| Background Blobs | Float | 6s/8s | ease-in-out | Looping |
| Feature Boxes | Pulse | 3s cycle | — | Staggered |

## Layout

**Grid:** 4 columns of equal width
- Features: Video to Text | Text Enhancement | Professional Narration | Background Music
- Spacing: 40px between columns
- Feature height: min 200px (content-driven)
- Feature box radius: 12px

**Spacing:**
- Logo to Title: 60px
- Title to Tagline: 20px
- Tagline to Features: 60px
- Features to CTA: 60px

## Component Details

### Feature Box
- Background: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(10px)`
- Border: 1px solid `rgba(255, 255, 255, 0.1)`
- Padding: 30px
- Border radius: 12px
- Icon size: 48px
- Hover: Background lightens to `rgba(255, 255, 255, 0.08)`, box-shadow glows, translateY(-8px)

### CTA Button
- Background: Linear gradient `#6366f1` → `#8b5cf6`
- Padding: 16px 40px
- Border radius: 8px
- Font size: 18px
- Font weight: 600
- Box shadow: `0 8px 32px rgba(99, 102, 241, 0.4)`
- Hover: Lifts 2px, shadow expands to `0 12px 48px rgba(99, 102, 241, 0.6)`

### Background Grid
- Opacity: 0.1
- Grid size: 50px × 50px
- Color: `rgba(255, 255, 255, 0.1)`

### Accent Blobs
- Blob 1: 400px diameter, indigo (#6366f1), top-left, blurred 80px
- Blob 2: 400px diameter, pink (#ec4899), bottom-right, blurred 80px
- Opacity: 0.3
- Float animation: ±20px vertical movement

## Script Timing

Narration timecode:
- 0:00 — "Jackson's Ecosystem transforms your creative workflow."
- 0:10 — "One unified command orchestrates video extraction, text enhancement, professional narration, and background music."
- 0:25 — "Powered by Replicate, Claude, and HyperFrames."
- 0:35 — "No external purchases needed. Everything activated."
- 0:45 — "Jackson's Ecosystem. Text to video to voice to music. Instantly."
- 0:55 — "Ready to create? Start now at rhythmixapp.com.au"

## Technical Notes

- 1920×1080 @ 30fps (landscape 16:9)
- GSAP 3.12.2 for advanced animations
- All icons as Unicode emoji (🎬, 📹, ✨, 🎤, 🎵, 🚀)
- Video should be rendered with audio track: Kokoro TTS narration + royalty-free music (Pixabay or MusicGen)

## Rendering Command

```bash
cd jackson-ecosystem-60s
npx --yes hyperframes@0.4.42 render
```

Output: `jackson-ecosystem-60s.mp4` (landscape, 60s, 30fps, with audio track)
