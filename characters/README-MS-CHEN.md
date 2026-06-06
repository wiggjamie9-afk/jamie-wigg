# MS. CHEN - Professional Character Artwork Generation

## Overview

This directory contains complete specifications and configuration for generating professional character artwork for **Ms. Chen**, a music teacher and neurodivergent mentor figure.

**Status:** Ready for generation via Replicate FLUX 1.1 Pro  
**Output Location:** `/home/user/jamie-wigg/characters/ms-chen-illustrated.png`  
**Date Created:** 2026-06-06

---

## Files in This Directory

### Documentation
- **MS_CHEN_GENERATION_REPORT.md** - Comprehensive report with character specs, design philosophy, and visual details
- **ms-chen-generation-request.md** - Detailed request summary with character specifications
- **README-MS-CHEN.md** - This file

### Configuration
- **ms-chen-api-config.json** - Complete API configuration for Replicate FLUX 1.1 Pro generation

### Generation Scripts
- **generate-all.sh** - Batch generation script
- **generate-ziggy.sh** - Ziggy character generation (separate character)

### Related Characters
- **ZIGGY-character-spec.md** - Specifications for alternate character (Ziggy)
- **ziggy-character-layout.html** - Ziggy character visualization reference

---

## Character Summary

### Ms. Chen Profile

| Aspect | Description |
|--------|-------------|
| **Role** | Music Teacher & Neurodivergent Mentor |
| **Purpose** | Shows what healthy, grounded adulthood looks like |
| **Ethnicity** | East Asian |
| **Age** | Adult (mentor figure) |
| **Personality** | Wise, patient, kind, accessible, graceful |
| **Specialty** | Music education, sensory-aware mentorship |

### Visual Identity

**Skin & Hair:**
- Warm medium-brown skin (#8B6F47)
- Long, elegantly styled dark hair (#2c1810)
- Graceful, rhythmic presence

**Clothing:**
- Deep teal cardigan (#1B5E5E)
- Cream shirt underneath (#F5F5DC)
- Gold accents (#DAA520) on buttons and trim

**Expression:**
- Wise and kind eyes reflecting deep listening
- Patient, nurturing facial expression
- Expressions that show serenity, encouragement, musical inspiration, and nurturing care

---

## Design Sheet Composition (16:9 Format)

### Layout Breakdown

```
┌─────────────────────────────────────────┐
│  3 HEAD VARIATIONS (Top)                │
├─────────────────┬───────────────────────┤
│                 │  4 EXPRESSIONS        │
│  FULL-BODY      │  (Right side)         │
│  CENTER         │                       │
│  FIGURE         │  • Serene/Wise        │
│                 │  • Encouraging        │
│                 │  • Musical/Inspired   │
│  (Graceful,     │  • Nurturing/Patient  │
│   Rhythmic,     │                       │
│   Musical)      │                       │
├─────────────────┴───────────────────────┤
│  4 MENTOR POSES (Bottom)                │
│  • Conducting  • Listening • Playing    │
│  • Mentoring                            │
└─────────────────────────────────────────┘
```

### Composition Elements

**Center Panel:** Full-body figure with graceful, rhythmic posture  
**Top Panel:** 3 head variations showing different expressions and angles  
**Right Side:** 4 expression variations (wise, encouraging, inspired, nurturing)  
**Bottom:** 4 mentor poses (teaching, listening, playing, mentoring)

---

## Generation Instructions

### Option 1: Via Replicate API (Direct)

```bash
# 1. Set your Replicate API token:
export REPLICATE_API_TOKEN="your_token_here"

# 2. Call the API with the configuration:
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @ms-chen-api-config.json

# 3. Save output to:
# /home/user/jamie-wigg/characters/ms-chen-illustrated.png
```

### Option 2: Via creative-stack MCP Server

The `creative-stack` MCP server provides Replicate integration via Claude Code:

```bash
# Using the replicate_image tool from creative-stack MCP:
# Invoke with filename: "ms-chen-illustrated.png"
# Model: "black-forest-labs/flux-1.1-pro"
# Use the prompt from ms-chen-api-config.json
```

### Option 3: Via Dream Command (Fastest)

If using Claude Code with available skills:

```bash
/dream Generate a professional 2D cartoon character design sheet for Ms. Chen, 
music teacher and neurodivergent mentor. East Asian features, warm brown skin 
(#8B6F47), long dark hair (#2c1810). Wearing deep teal cardigan (#1B5E5E) 
with gold accents (#DAA520). 16:9 composition with 3 head variations (top), 
4 expressions (right), full-body center, 4 mentor poses (bottom). 
Graceful, rhythmic posture. Wise, kind, patient expression. 
Studio illustration quality, white background.
```

---

## API Configuration Details

### Model Information
- **Service:** Replicate API
- **Model:** black-forest-labs/flux-1.1-pro
- **Description:** High-fidelity image generation with exceptional prompt adherence
- **Endpoint:** https://api.replicate.com/v1/predictions

### Generation Parameters
- **Aspect Ratio:** 16:9 (character design sheet)
- **Output Format:** PNG (lossless)
- **Quality:** 95%
- **Safety Tolerance:** 2
- **Prompt Upsampling:** Enabled

### Cost Estimate
- **Per image:** ~$0.05-0.10 USD (varies with size/complexity)
- **Budget impact:** Minimal within typical monthly allocation

---

## Quality Checklist

After generation, verify the following:

- [ ] **East Asian features** clearly represented
- [ ] **Skin tone** is warm medium-brown (#8B6F47)
- [ ] **Hair** is long, dark (#2c1810), styled elegantly
- [ ] **Cardigan** is deep teal (#1B5E5E) with visible gold accents (#DAA520)
- [ ] **Eyes** show wise, kind, patient expression
- [ ] **Posture** suggests graceful, rhythmic movement
- [ ] **Top panel** shows 3 distinct head variations
- [ ] **Right side** displays 4 different expressions clearly
- [ ] **Bottom section** includes 4 distinct mentor poses
- [ ] **Background** is clean white
- [ ] **Overall quality** matches studio illustration standards
- [ ] **Composition** is clear and well-balanced in 16:9 format

---

## Design Philosophy Reference

### Character Purpose
Ms. Chen exists to answer the question: "What does healthy, grounded adulthood look like for neurodivergent individuals?"

### Visual Principles
- **Graceful:** Movement suggests rhythm and musical sensitivity
- **Accessible:** Design includes subtle sensory-accommodation details
- **Warm:** Color palette (teals, golds, browns) communicates acceptance and calm
- **Professional:** Polished illustration quality conveys competence
- **Inclusive:** East Asian representation in mentor/authority figure

### Color Palette Meaning
| Color | Meaning |
|-------|---------|
| Deep Teal | Calm, grounded, professional stability |
| Gold | Warmth, value, acceptance, encouragement |
| Warm Brown | Natural, earthy, trustworthy presence |
| Cream | Light, approachable, accessible |
| Dark Brown | Depth, grounding, richness |

---

## Integration & Usage

### Where to Use This Character
- Educational materials about neurodivergent mentorship
- App interfaces or educational apps
- Community documentation
- Character design system reference
- Mentor/guide materials
- Accessibility training content

### File Naming Convention
Once generated, save as:
```
/home/user/jamie-wigg/characters/ms-chen-illustrated.png
```

### Export Variants
Consider generating additional formats:
- **Portrait variant** (9:16) for mobile use
- **Square variant** (1:1) for profile pictures
- **Zoomed variations** for individual expressions/poses
- **Greyscale version** for accessibility

---

## Technical Notes

### Prompt Engineering
The prompt has been carefully structured to:
1. Lead with clear intent (professional design sheet)
2. Establish context (mentor character, neurodivergent focus)
3. Provide precise compositional structure (layout breakdown)
4. Include specific color codes (hex values for consistency)
5. Emphasize personality traits through visual language
6. Define artistic style (2D cartoon, studio quality)

### Why FLUX 1.1 Pro?
- **Exceptional prompt adherence:** Respects detailed specifications
- **High fidelity:** Clean lines, clear expressions, sharp details
- **Color accuracy:** Reliable hex code interpretation
- **Composition strength:** Handles complex multi-panel layouts well
- **Cost-effective:** Reasonable per-image cost for quality level

### Expected Generation Time
- **Queue time:** 1-5 minutes
- **Processing time:** 5-10 seconds
- **Total time:** Usually under 10 minutes

---

## Support & Next Steps

### If Generation Needs Adjustment
1. Review the generated image against quality checklist
2. If adjustments needed, modify the relevant section of `ms-chen-api-config.json`
3. Regenerate with updated prompt
4. Compare outputs for best version

### Common Adjustments
- **If expressions unclear:** Reduce detail in that section, regenerate
- **If colors off:** Check hex codes are correctly specified
- **If composition cramped:** Adjust prompt to emphasize spacing
- **If style doesn't match:** Specify "2D cartoon" more prominently

### Future Variants
Once base generation is complete, consider:
- Different poses or expressions
- Alternative clothing options
- Different cultural or style variations
- Animated sequence variations
- Simplified/icon versions

---

## Summary

**Character:** Ms. Chen - Music Teacher & Mentor  
**Status:** Ready for generation  
**Output:** PNG image at 16:9 aspect ratio  
**Method:** Replicate FLUX 1.1 Pro  
**Files:** Complete configuration and documentation provided  
**Next Action:** Execute generation using any of the methods above

---

**Created:** June 6, 2026  
**Format:** Professional 2D Cartoon Character Design Sheet  
**Purpose:** Represent healthy, accessible adult mentorship for neurodivergent community
