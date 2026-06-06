# ZIGGY Character Artwork Generation Instructions

## Overview

This document provides step-by-step instructions to generate professional character artwork for ZIGGY using AI image generation tools with production-grade results.

---

## Complete Generation Prompt

Copy and paste the exact prompt below into your AI image generation tool:

```
Professional 2D cartoon character design sheet in the style of Vectteezy and modern animation studios. Ziggy, energetic middle-school ADHD superhero protagonist. Center (largest): Full-body character standing confidently, friendly smile, arms raised with energy. Top row: 3 head variations - front facing, 3/4 left turn, 3/4 right turn. Show spiky dark hair, bright expressive eyes, warm smile. Right side expressions: 4 variations - happy/excited, focused/determined, nervous/anxious, powerful/confident. Animated eyes with shine. Bottom row: 4 action poses - running forward, jumping, thinking/hand on chin, celebrating with fist pump. Character design: Warm peachy skin tone, short dark spiky hair with shine/movement, big bright eyes with highlights. Clothing: VIBRANT ORANGE (#FF8C00) hoodie - primary focus, ELECTRIC BLUE (#00D8FF) trim on cuffs/zipper/pockets, comfortable fit. Posture shows constant barely-contained energy - always in motion, hopeful, brilliant. Color palette: Orange, Electric Blue, Warm skin tones, bright happy colors. Style: Clean bold lines, cel-shading friendly, vibrant colors, professional 2D cartoon illustration. No shadows - bright flat colors like Vectteezy style. White background. High quality studio illustration.
```

---

## Recommended Tools & Settings

### Option 1: Replicate FLUX 1.1 Pro (Recommended)

**Model:** `black-forest-labs/flux-1.1-pro`  
**Endpoint:** https://api.replicate.com/v1/predictions

**Parameters:**
```json
{
  "prompt": "[Use complete prompt above]",
  "aspect_ratio": "16:9",
  "output_format": "png",
  "output_quality": 95,
  "safety_tolerance": 2,
  "prompt_upsampling": true
}
```

**Expected cost:** ~$0.15 USD per generation  
**Quality:** Professional, excellent prompt adherence  
**Speed:** ~30-60 seconds per generation

**Setup:**
1. Visit https://replicate.com
2. Create account and generate API token
3. Use `curl` command below or integrate into your workflow

**curl Command:**
```bash
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2b7c45e6ede1d38b391b00cac5d96cde01b040da4663033322280fc0fcc127c5",
    "input": {
      "prompt": "Professional 2D cartoon character design sheet...",
      "aspect_ratio": "16:9",
      "output_quality": 95
    }
  }'
```

### Option 2: Midjourney

**Command:**
```
/imagine [complete prompt above] --ar 16:9 --q 1 --s 750
```

**Parameters:**
- `--ar 16:9` — aspect ratio
- `--q 1` — quality tier 1 (highest)
- `--s 750` — detail/sharpness balance

**Cost:** ~0.25 credits per generation (if subscribed)  
**Quality:** Excellent, very reliable  
**Platform:** Discord

### Option 3: DALL-E 3 via OpenAI API

**Model:** `dall-e-3`  
**Size:** `1792x1024` (closest to 16:9)

**Python example:**
```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

response = client.images.generate(
    model="dall-e-3",
    prompt="[complete prompt above]",
    size="1792x1024",
    quality="hd",
    n=1
)

print(response.data[0].url)
```

**Cost:** $0.08 per generation  
**Quality:** Good, occasional misses on color specificity  
**Speed:** ~30-60 seconds

### Option 4: Pollinations (Free Tier)

**Endpoint:** https://api.pollinations.ai/v1/images

**cURL Command:**
```bash
curl -X POST https://api.pollinations.ai/v1/images \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flux-pro",
    "prompt": "[complete prompt above]",
    "width": 1920,
    "height": 1080,
    "seed": 42
  }' --output ziggy-illustrated.png
```

**Cost:** Free  
**Quality:** Good  
**Speed:** ~20-40 seconds  
**Limitation:** No authentication required, but rate-limited

---

## Quality Checklist

After generating the artwork, verify these elements are present:

### Character Design ✓
- [ ] Warm peachy skin tone visible
- [ ] Short, dark spiky hair with shine/movement lines
- [ ] Big bright eyes with animated highlights
- [ ] Warm, friendly smile on main character
- [ ] Confident, energetic posture

### Costume ✓
- [ ] Vibrant orange hoodie (#FF8C00) is primary focal point
- [ ] Electric blue (#00D8FF) trim on cuffs/zipper/pockets
- [ ] Comfortable, movement-friendly fit
- [ ] Colors are saturated and vibrant

### Layout ✓
- [ ] Large full-body character center/left
- [ ] 3 head variations (front, 3/4 left, 3/4 right) in top row
- [ ] 4 emotion expressions on right side
- [ ] 4 action poses in bottom row
- [ ] All elements clearly visible and distinct

### Art Style ✓
- [ ] Professional 2D cartoon aesthetic
- [ ] Clean, bold outlines (cel-shading friendly)
- [ ] Flat colors, NO gradients or shadows
- [ ] Bright, vibrant colors
- [ ] Pure white background
- [ ] High quality, studio-grade finish

### Composition ✓
- [ ] Well-balanced grid layout
- [ ] All poses and expressions visible
- [ ] No overlapping elements
- [ ] Consistent character design across variations
- [ ] Professional spacing and proportions

---

## Iteration Tips

If the first generation doesn't match exactly:

### Too photorealistic?
Add to prompt: "emphasize clean cartoon lines, remove realistic shading, maximum stylization"

### Colors not saturated enough?
Add: "increase color saturation by 40%, vibrant bold colors, punchy palette"

### Wrong proportion or layout?
Add: "ensure centered full body character left/center, three heads top, four emotions right, four poses bottom in clear grid"

### Missing energy/movement?
Add: "emphasize dynamic posture, constant motion feeling, action-ready stance, wind-blown hair suggesting speed"

### Background not white?
Add: "pure white background with no texture or gradient"

---

## File Management

### Organized Directory Structure
```
characters/
├── GENERATION-INSTRUCTIONS.md    (this file)
├── ZIGGY-character-spec.md       (detailed spec)
├── ziggy-character-layout.html   (visual reference)
├── ziggy-illustrated.png         (generated artwork - save here)
├── ziggy-variants/               (optional - store iterations)
│   ├── ziggy-v1.png
│   ├── ziggy-v2.png
│   └── ziggy-final.png
└── ziggy-refs/                   (optional - reference images)
    └── vectteezy-reference-*.png
```

### Naming Convention
- **Primary artwork:** `ziggy-illustrated.png`
- **Variants:** `ziggy-v{number}.png` or `ziggy-{descriptor}.png`
- **Exports:** `ziggy-16x9.png`, `ziggy-square.png` (if resizing)

---

## Advanced: Batch Generation & A/B Testing

If you want multiple variations for comparison:

**Variant 1 - Energetic Focus:**
```
Professional 2D cartoon character design sheet, Ziggy ADHD superhero.
Emphasize dynamic poses, barely-contained energy, motion lines, windswept hair.
VIBRANT ORANGE hoodie (#FF8C00), ELECTRIC BLUE trim (#00D8FF).
Cel-shading, flat colors, Vectteezy style, white background.
```

**Variant 2 - Heroic Focus:**
```
Professional 2D cartoon superhero character sheet, Ziggy protagonist.
Emphasize confident heroic posture, powerful expressions, determination.
VIBRANT ORANGE hoodie (#FF8C00), ELECTRIC BLUE accents (#00D8FF).
Professional animation studio style, cel-shading, bold colors, white background.
```

**Variant 3 - Relatable Focus:**
```
Professional 2D cartoon character design sheet, Ziggy middle-school protagonist.
Emphasize friendly approachability, relatable expressions, warm smile, hopeful energy.
VIBRANT ORANGE hoodie (#FF8C00), ELECTRIC BLUE trim (#00D8FF).
Vectteezy illustration style, clean bold lines, bright flat colors, white background.
```

Run all 3, compare results, and pick the strongest version.

---

## Integration with Production Pipeline

### For Animation Studios
- Export at 2x resolution (3840×2160) if tools support it
- Request individual layers if tool provides them (background, character, trim, expressions)
- Use as base for rigging/animation in Blender, After Effects, or Spine

### For Web/Marketing
- Save at 1920×1080 PNG for hero images
- Create 1080×1080 square crop for social media
- Create 1080×1920 portrait crop for mobile/vertical video

### For Design Systems
- Document color hex codes as CSS variables
- Extract specific expression frames for icon library
- Reference proportions for additional character variations

---

## Support & Troubleshooting

**Generation takes too long?**
- Try a faster model (FLUX Schnell, Sana)
- Use lower output quality setting
- Check your API rate limits

**Output doesn't match colors exactly?**
- Add color hex codes earlier in prompt
- Use "ensure exact colors: #FF8C00 orange, #00D8FF blue"
- Try a different model (Midjourney better at color accuracy)

**Layout is wrong?**
- Regenerate with explicit layout description at start of prompt
- Try: "character design sheet with 1 large center, 3 heads top, 4 expressions right, 4 poses bottom"

**Not cartoon enough?**
- Emphasize "cel-shading" and "animation studio style"
- Remove any photorealistic words
- Add "bold outlines, flat colors, no shadows"

---

## Files Reference

| File | Purpose |
|------|---------|
| `GENERATION-INSTRUCTIONS.md` | This guide |
| `ZIGGY-character-spec.md` | Complete character specification |
| `ziggy-character-layout.html` | Visual layout reference (open in browser) |
| `ziggy-illustrated.png` | Primary generated artwork (when ready) |

---

**Character Name:** ZIGGY  
**Role:** Energetic middle-school ADHD superhero protagonist  
**Target Output:** 1920×1080 professional 2D cartoon character design sheet  
**Art Style:** Vectteezy / modern animation studio  
**Ready to generate?** Pick a tool above and follow the setup instructions.
