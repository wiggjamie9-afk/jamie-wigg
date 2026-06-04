# SURGE Pilot - Act 1 Keyframe Generation Status

**Project:** SURGE Pilot  
**Act:** 1 (Opening Sequence, 0–3 min)  
**Generated:** 2026-06-04  
**Status:** READY FOR GENERATION (awaiting Replicate API token)

## Keyframes Queued

| Shot | Name | Filename | Purpose |
|---|---|---|---|
| 1 | Classroom Establishing | shot-01-classroom-establishing.png | Establish location, mood (calm before anxiety), cool color temperature |
| 3 | Ziggy at Desk | shot-03-ziggy-desk.png | Character introduction, establish Ziggy's design, anxiety mood |
| 4 | Sensory Montage - Fluorescent Hum | shot-04a-sensory-hum.png | First sensory layer (sound made visual), establish discomfort |
| 15 | Shame Moment - Face Close-up | shot-15-shame-moment.png | Emotional peak (shame), visual distinctness with burgundy, dissociation |

## Generation Parameters

- **Model:** FLUX 1.1 Pro (`black-forest-labs/flux-1.1-pro`)
- **Resolution:** 1920×1080 (16:9 landscape)
- **Format:** PNG
- **Aspect Ratio:** Landscape (for HyperFrames integration)
- **Style Guide:** Flat 2D animation – Craig of the Creek / Infinity Train aesthetic
- **Output Location:** `/home/user/jamie-wigg/production/surge-pilot/assets/keyframes/`

## Setup Required

To generate these images, the following step is needed:

1. **Set up Replicate API token:**
   ```bash
   cp .claude/settings.local.json.example .claude/settings.local.json
   ```

2. **Edit `.claude/settings.local.json`** and replace the placeholder `REPLICATE_API_TOKEN` with your actual token from https://replicate.com/account/api-tokens

3. **Verify the token:**
   ```bash
   REPLICATE_API_TOKEN=r8_... node .claude/mcp/creative-stack/check.mjs
   ```

4. **Run generation:**
   Once configured, invoke the replicate skill or use the MCP server directly to generate each image.

## Prompts (Ready to Use)

### Shot 1: Classroom Establishing
```
Flat 2D animation style illustration of a bright elementary school classroom, morning light streaming from windows, fluorescent ceiling lights, empty desks arranged in rows, one teacher's desk at the front with papers, colorful bulletin boards on walls, teacher figure at front preparing lesson materials. Cool color palette: light gray walls, soft electric blue accents, muted sage green furniture. Simple geometric shapes with bold black outlines, no shading or gradients. Style: Craig of the Creek meets Infinity Train. 1920x1080 landscape.
```

### Shot 3: Ziggy at Desk
```
Flat 2D animation close-up of a 10-year-old boy named Ziggy: round circle head, messy asymmetrical dark hair, bright electric blue eyes (#0052CC) wide and animated, wearing electric blue hoodie, sitting at school desk. One sock up, one sock down. Pencil in hand. Expression shows nervous energy and anxiety. Subtle jittery tremor lines around him. Bold outlines, geometric shapes, simple flat colors. Style: Craig of the Creek. 1920x1080 landscape.
```

### Shot 4: Sensory Montage - Fluorescent Hum
```
Flat 2D animation close-up ceiling view with fluorescent light fixtures. Extremely bright white-blue light. Suggest shimmer and hum with wavy distortion lines and radiating light ripples around fixtures. Minimal detail, geometric shapes, bold outlines. Cool desaturated palette: pale gray, cool white, pale blue. Shimmer feels overwhelming and invasive. 1920x1080 landscape.
```

### Shot 15: Shame Moment - Face Close-up
```
Flat 2D animation extreme close-up of Ziggy's face showing shame and dissociation. Round head, dark asymmetrical hair, eyes downcast with constricted pupils, mouth slightly open (embarrassed), frozen/numb expression. Surrounded by deep burgundy color wash (#5D1E3B) suggesting emotional shutdown. Background very desaturated/grayscale with burgundy overlay. Convey freeze response, dissociation, shame. Heavy bold outlines. 1920x1080 landscape.
```

## Estimated Costs

- **Per image (FLUX 1.1 Pro):** ~$0.04 USD
- **Total for 4 images:** ~$0.16 USD
- **Inference time per image:** ~5–10 minutes

## Next Steps

Once the API token is configured:
1. Regenerate with Replicate via the creative-stack MCP server
2. Review outputs for adherence to flat 2D aesthetic and color palette
3. If needed, regenerate with refined prompts
4. Save to HyperFrames composition as animation reference frames

## Reference Files

- Manifest: `/home/user/jamie-wigg/production/surge-pilot/assets/keyframes/manifest.json`
- SURGE Pilot spec: `/home/user/jamie-wigg/production/surge-pilot/SPEC.md`
- Brand guide: `/home/user/jamie-wigg/CLAUDE.md` (style: flat 2D, cool colors for classroom, warm for fantasy)

