# SURGE Pilot - Act 1 Keyframes — File Index

**Location:** `/home/user/jamie-wigg/production/surge-pilot/assets/keyframes/`  
**Status:** Ready for generation  
**Last Updated:** 2026-06-04

## Quick Start

1. **First Time Setup** (if needed):
   ```bash
   cp .claude/settings.local.json.example .claude/settings.local.json
   # Edit and add REPLICATE_API_TOKEN from https://replicate.com/account/api-tokens
   ```

2. **Generate All 4 Keyframes:**
   ```bash
   node generate-keyframes.mjs
   ```

3. **Check Results:**
   - Open generated PNG files
   - Review against quality checklist in README.md
   - Note any needing regeneration

## File Guide

### Documentation (Read These First)

| File | Purpose | Read When |
|---|---|---|
| **README.md** | Complete usage guide, quality criteria, HyperFrames integration | Getting started with keyframes |
| **PROJECT-SUMMARY.txt** | Full project overview, specifications, troubleshooting | Need context on the entire project |
| **GENERATION-STATUS.md** | Current status, setup instructions | Checking if ready to generate |
| **INDEX.md** | This file — quick reference to all docs | Navigating the folder |

### Configuration & Scripts

| File | Purpose | Run When |
|---|---|---|
| **manifest.json** | Metadata for all 4 keyframes (prompts, specs, purposes) | Reference during generation |
| **generate-keyframes.mjs** | Automated Node.js script for Replicate API | Ready to generate images |

### Output Files (Generated After Running Script)

| File | Purpose | Created When |
|---|---|---|
| **shot-01-classroom-establishing.png** | Keyframe 1 image | After running `node generate-keyframes.mjs` |
| **shot-03-ziggy-desk.png** | Keyframe 3 image | After running script |
| **shot-04a-sensory-hum.png** | Keyframe 4 image | After running script |
| **shot-15-shame-moment.png** | Keyframe 15 image | After running script |
| **generation-summary.json** | Results from last generation run | Automatically after script completes |

## The 4 Keyframes at a Glance

### Shot 1: Classroom Establishing
- **File:** `shot-01-classroom-establishing.png`
- **Purpose:** Wide establishing shot, cool palette (calm-before-anxiety)
- **Style:** Flat 2D, light gray walls, electric blue accents, sage green furniture
- **Duration in final animation:** ~10 seconds

### Shot 3: Ziggy at Desk
- **File:** `shot-03-ziggy-desk.png`
- **Purpose:** Character introduction, establish Ziggy's design with nervous energy
- **Style:** Close-up, electric blue hoodie, jittery tremor lines
- **Character:** Circle head, asymmetrical hair, blue eyes, one sock up/down
- **Duration:** ~8 seconds

### Shot 4: Sensory Montage - Fluorescent Hum
- **File:** `shot-04a-sensory-hum.png`
- **Purpose:** Visualize sensory overload (sound → visual), overwhelming bright light
- **Style:** Extreme close-up of ceiling lights, shimmer/hum with wavy distortion
- **Colors:** Pale gray, cool white, pale blue (extremely bright)
- **Duration:** ~3 seconds

### Shot 15: Shame Moment - Face Close-up
- **File:** `shot-15-shame-moment.png`
- **Purpose:** Emotional peak (shame & dissociation), visual distinctness
- **Style:** Extreme close-up face, eyes downcast, burgundy color wash
- **Colors:** Deep burgundy (#5D1E3B) wash over desaturated grayscale
- **Duration:** ~5 seconds

## Technical Specs

| Parameter | Value |
|---|---|
| **Model** | FLUX 1.1 Pro |
| **Resolution** | 1920×1080 (16:9 landscape) |
| **Format** | PNG (lossless) |
| **Style** | Flat 2D animation (Craig of the Creek / Infinity Train aesthetic) |
| **Cost per image** | ~$0.04 USD |
| **Inference per image** | ~5–10 minutes |
| **Total cost for 4** | ~$0.16 USD |
| **Total runtime** | ~25–40 minutes (sequential polling) |

## Generation Workflow

```
┌─ Check Token Setup
│   └─ Is REPLICATE_API_TOKEN set in .claude/settings.local.json?
│       └─ If no: copy example and add token
│
├─ Run Generation Script
│   └─ node generate-keyframes.mjs
│       └─ Creates 4 Replicate predictions
│       └─ Polls each until completion (5-15 min per frame)
│       └─ Downloads PNG files
│       └─ Writes generation-summary.json
│
└─ Review & Iterate
    ├─ Open each PNG in image viewer
    ├─ Check against quality criteria (README.md)
    └─ Regenerate any failing frames (edit prompt, re-run)
```

## Quality Checklist

Before considering keyframes "done," verify:

- [ ] **Aesthetic:** Flat 2D (no photorealism, no 3D)
- [ ] **Outlines:** Bold black outlines on all shapes
- [ ] **Character (Ziggy):**
  - [ ] Circle head
  - [ ] Messy asymmetrical hair
  - [ ] Electric blue (#0052CC) eyes
  - [ ] Electric blue hoodie (Shots 3, 15)
  - [ ] One sock up, one down (Shot 3)
- [ ] **Color Palette:**
  - [ ] Shot 1: Cool desaturated (gray, light blue, sage green)
  - [ ] Shot 3: Electric blue as primary
  - [ ] Shot 4: Pale cool colors (extremely bright)
  - [ ] Shot 15: Burgundy (#5D1E3B) wash
- [ ] **Emotional Clarity:**
  - [ ] Shot 1: Calm, organized classroom
  - [ ] Shot 3: Nervous, anxious energy
  - [ ] Shot 4: Overwhelming sensory invasion
  - [ ] Shot 15: Dissociated, frozen, ashamed

## Integration into HyperFrames

Once generated and approved, integrate into your Cut:

1. **Copy PNGs to Cut folder:**
   ```bash
   cp shot-*.png /path/to/rhythmix-<name>/assets/
   ```

2. **Reference in index.html:**
   ```html
   <img src="assets/shot-01-classroom-establishing.png" alt="" />
   ```

3. **Animate over with GSAP:**
   ```javascript
   gsap.to(".bg-shot-1", { opacity: 1, duration: 2 });
   ```

4. **Trace/interpolate** — use as reference layers during animation compositing

## Troubleshooting

**Problem:** "REPLICATE_API_TOKEN not set"
- **Solution:** Edit `.claude/settings.local.json` and add your token from https://replicate.com/account/api-tokens

**Problem:** "Prediction polling timeout"
- **Solution:** Check API status at replicate.com/status. Wait 5 min and retry.

**Problem:** Generated image doesn't match brief (wrong colors, too photorealistic)
- **Solution:** Edit prompt in `generate-keyframes.mjs`, run script again, replace PNG

**Problem:** Can't reach Replicate API
- **Solution:** Check internet connection. Replicate image URLs expire after ~1 hour.

## References

### Local Files
- **SURGE Spec:** `/home/user/jamie-wigg/production/surge-pilot/SPEC.md`
- **Brand Guide:** `/home/user/jamie-wigg/rhythmix-teaser-60s/DESIGN.md`
- **HyperFrames Example:** `/home/user/jamie-wigg/rhythmix-overview-60s/`
- **Repo Instructions:** `/home/user/jamie-wigg/CLAUDE.md`

### External Links
- **Replicate API Tokens:** https://replicate.com/account/api-tokens
- **FLUX 1.1 Pro:** https://replicate.com/black-forest-labs/flux-1.1-pro
- **HyperFrames Docs:** https://hyperframes.ai/

## Project Metadata

| Field | Value |
|---|---|
| **Project** | SURGE Pilot (Animation pilot for neurodiverse youth) |
| **Act** | 1 (Opening sequence, 0–3 min) |
| **Created** | 2026-06-04 |
| **Purpose** | Animation reference frames for HyperFrames compositing |
| **Contact** | wiggjamie9@gmail.com |

---

**Ready to generate?** Run: `node generate-keyframes.mjs`

**Need help?** See PROJECT-SUMMARY.txt for full documentation.
