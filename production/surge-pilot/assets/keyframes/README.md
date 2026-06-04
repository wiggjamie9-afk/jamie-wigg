# SURGE Pilot - Act 1 Keyframes

Production-ready animation reference frames for the opening sequence (0–3 minutes) of the SURGE pilot animation.

## Overview

This folder contains 4 keyframe images generated via FLUX 1.1 Pro, designed as animation reference material for HyperFrames composition. Each frame:

- Matches the flat 2D animation aesthetic (Craig of the Creek / Infinity Train style)
- Adheres to the cool-to-warm color palette progression (classroom reality → fantasy)
- Serves as a tracing/interpolation base for animation compositing

## Frames

| Shot | Name | File | Purpose |
|---|---|---|---|
| 1 | Classroom Establishing | `shot-01-classroom-establishing.png` | Wide establishing shot of elementary school classroom with cool color palette (light gray, electric blue, sage green). Sets calm-before-anxiety mood. |
| 3 | Ziggy at Desk | `shot-03-ziggy-desk.png` | Close-up of protagonist Ziggy: round head, messy asymmetrical hair, electric blue eyes, blue hoodie, one sock up/down. Shows nervous energy with jittery tremor lines. |
| 4 | Sensory Montage - Fluorescent Hum | `shot-04a-sensory-hum.png` | Extreme close-up of ceiling fluorescent fixtures with shimmer/hum visualization. Cool white-blue light with wavy distortion lines. First sensory overload moment. |
| 15 | Shame Moment - Face Close-up | `shot-15-shame-moment.png` | Extreme close-up of Ziggy's face in shame/dissociation. Eyes downcast, constricted pupils, frozen expression. Deep burgundy color wash suggesting emotional shutdown. |

## Technical Specs

- **Resolution:** 1920×1080 (16:9 landscape)
- **Format:** PNG (lossless)
- **Model:** FLUX 1.1 Pro (`black-forest-labs/flux-1.1-pro`)
- **Style:** Flat 2D animation – no photorealism, no 3D rendering
- **Aspect Ratio:** Landscape (for HyperFrames integration)

## Generation

### Prerequisites

Set up your Replicate API token:

```bash
# Copy the example settings file
cp .claude/settings.local.json.example .claude/settings.local.json

# Edit .claude/settings.local.json and add your token from:
# https://replicate.com/account/api-tokens
```

Verify the token works:

```bash
REPLICATE_API_TOKEN=r8_... node .claude/mcp/creative-stack/check.mjs
```

### Generate Keyframes

Using the generation script:

```bash
cd /home/user/jamie-wigg/production/surge-pilot/assets/keyframes
node generate-keyframes.mjs
```

This will:
1. Create 4 predictions on Replicate
2. Poll each until completion (~5–15 min per frame)
3. Download and save PNG files locally
4. Write a summary to `generation-summary.json`

Expected cost: ~$0.04 × 4 images = $0.16 USD

### Using the Replicate Skill

Alternatively, invoke the `replicate` skill from Claude Code:

```
/replicate generate 4 keyframes for SURGE pilot animation
```

The skill will route to `replicate_image` and handle the downloads.

## Quality Checklist

When reviewing generated images:

- [ ] Flat 2D aesthetic (geometric shapes, bold outlines, no shading)
- [ ] Correct color palette:
  - Shot 1: Light gray, electric blue, sage green (cool)
  - Shot 3: Electric blue (#0052CC) hoodie and eyes on minimal background
  - Shot 4: Pale gray, cool white, pale blue (extremely bright)
  - Shot 15: Deep burgundy (#5D1E3B) wash over desaturated grayscale
- [ ] Character design (Ziggy):
  - Circle head ✓
  - Messy asymmetrical hair ✓
  - Electric blue eyes wide/expressive ✓
  - Blue hoodie ✓
  - One sock up, one down ✓
- [ ] Emotional clarity:
  - Shot 1: Calm, organized classroom ✓
  - Shot 3: Nervous, jittery energy ✓
  - Shot 4: Overwhelming sensory invasion ✓
  - Shot 15: Dissociated, frozen, ashamed ✓

If any frame doesn't meet criteria, regenerate with refined prompt.

## Usage in HyperFrames

To use these keyframes in a HyperFrames composition:

1. Reference them by relative path in `index.html`:

```html
<img src="../../assets/keyframes/shot-01-classroom-establishing.png" alt="" />
```

2. Animate or trace over them using GSAP + CSS transforms:

```javascript
gsap.to(".bg-shot-1", { opacity: 1, duration: 2 });
```

3. Use as reference layers in animation compositing (rasterize on a separate layer, fade out after key poses are locked in).

## Files

- `manifest.json` — Metadata for all 4 keyframes (prompts, purposes, specs)
- `GENERATION-STATUS.md` — Current status and setup instructions
- `generate-keyframes.mjs` — Automated generation script (Node.js)
- `generation-summary.json` — Results from last generation run (if available)
- `shot-*.png` — Generated keyframe images

## References

- SURGE Pilot spec: `/home/user/jamie-wigg/production/surge-pilot/SPEC.md`
- Brand guide: `/home/user/jamie-wigg/rhythmix-teaser-60s/DESIGN.md` (palette, typography, motion)
- HyperFrames docs: https://hyperframes.ai/

## Notes

- These are **reference frames**, not final animation. They will be traced, interpolated, and composited in HyperFrames.
- Character design (Ziggy) is locked. Do not deviate for consistency across all shots.
- Color palette is locked per SURGE spec: cool desaturated for reality, warm for fantasy, burgundy for shame.
- Regenerate individual frames as needed; no need to regenerate all 4 if one is off.

---

Generated: 2026-06-04  
Project: SURGE Pilot (Animation Pilot for Neurodiverse Youth)  
Contact: wiggjamie9@gmail.com
