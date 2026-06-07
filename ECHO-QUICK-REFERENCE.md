# ECHO Character Design - Quick Reference Card

**Character:** ECHO | **Role:** Antagonist | **Theme:** Sensory Chaos  
**Format:** 16:9 Design Sheet | **Generator:** FLUX 1.1 Pro | **Status:** Ready ✓

---

## Visual Identity (One-Page Summary)

### Core Characteristics
| Aspect | Description |
|--------|-------------|
| **Personality** | Dark, chaotic antagonist representing sensory overwhelm and distraction |
| **Silhouette** | Angular, jagged, spiky—suggesting constant restless motion |
| **Eyes** | Sharp, intense, narrow pupils expressing distraction and overstimulation |
| **Posture** | Dynamic, unstable, never static—always in motion |
| **Vibe** | Threatening, challenging, chaotic—never cute or approachable |

### Color Palette (Quick Reference)

**Dark Foundation (60-70%)**
- Charcoal: `#1a1a2e` (primary)
- Midnight Blue: `#16213e`
- Deep Purple: `#2c0b4e`

**Electric Accents (30-40%)**
- Bright Cyan: `#00d8ff` ← **MUST POP**
- Neon Magenta: `#ff1f5a` ← **MUST POP**
- Violet: `#9d4edd`

**Background**
- Pure White: `#ffffff`

---

## The 11-Section Design Sheet

### Layout (16:9 Landscape)

```
┌─────────────────────────────────────────────────────────────┐
│              1: PROFILE HEAD    2: 3/4 HEAD    3: FRONT HEAD │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                  4: FULL-BODY CENTER FIGURE                 │
│                        (Largest Element)                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  5: CHAOTIC    6: MOCKING    7: OVERWHELMING    8: DEFEATED  │
│     WILD       TAUNTING          INTENSE         RETREATING  │
├─────────────────────────────────────────────────────────────┤
│  9: CREATING   10: SWOOPING   11: SCATTERING   12: IMPLODING │
│      CHAOS      ATTACK        DISPERSING       CONTRACTING   │
└─────────────────────────────────────────────────────────────┘
```

### 11 Character States At-a-Glance

| # | Section | Title | Key Visual |
|---|---------|-------|-----------|
| 1 | Top | Profile Head | Sharp 90° side view, spiky profile |
| 2 | Top | 3/4 View Head | Emphasize intense eyes, 45° angle |
| 3 | Top | Front Head | Both eyes intense, open chaotic |
| 4 | Center | Full-Body | Angular posture, electric aura |
| 5 | Middle | Chaotic/Wild | Eyes wide, energy radiating |
| 6 | Middle | Mocking/Taunt | Confident smirk, dismissive |
| 7 | Middle | Overwhelming | Distorted features, electric field |
| 8 | Middle | Defeated | Withdrawn, fading energy |
| 9 | Bottom | Creating Chaos | Arms spread, particles scatter |
| 10 | Bottom | Swooping | Dynamic dive, trailing motion |
| 11 | Bottom | Scattering | Fragments dispersing outward |
| 12 | Bottom | Imploding | Energy contracting inward |

---

## Visual Effects Language

### Motion Lines
- Dynamic, aggressive, multiple directions
- Varying lengths suggesting intensity
- Used in all action poses and chaotic expressions

### Aura/Glow Effects
- Subtle electric field around character in intense states
- Enhanced in overwhelming and chaotic expressions
- Compressed in imploding pose

### Particle Effects
- Scattered fragments in chaos and scattering poses
- Electric cyan and magenta colors
- Suggesting sensory chaos visualization

### Distortion Effects
- Wave distortion in overwhelming expression
- Melting/fractal appearance
- Representing sensory overload

---

## Design Principles (Remember!)

✓ **DO:**
- Keep DARK and ANTAGONISTIC (never cute)
- Use SHARP ANGLES everywhere
- Make electric colors POP against dark
- Show DYNAMIC restless motion
- Emphasize INTENSITY and CHAOS
- Use BOLD clean lines
- Apply MOTION LANGUAGE consistently

✗ **DON'T:**
- Soft or rounded shapes (keep angular)
- Bright cheerful colors (stay dark + electric)
- Symmetrical balanced composition (keep dynamic)
- Static poses (all dynamic)
- Generic AI aesthetic (professional quality)
- Overly complex details (clarity first)
- Text or watermarks (clean canvas)

---

## Generation Quick Start

### Command (Copy-Paste Ready)

```bash
export REPLICATE_API_TOKEN="your-token-here"

replicate predict black-forest-labs/flux-1.1-pro \
  --input aspect_ratio="16:9" \
  --input prompt="Professional 2D cartoon character design sheet for ECHO - antagonist embodying sensory chaos and ADHD overwhelm. LAYOUT: 16:9 landscape on white background. TOP ROW: 3 head variations (profile, 3/4, front) ~280×240px each. CENTER: Large full-body figure ~600×400px with electric aura. MIDDLE ROW: 4 emotional expressions (chaotic, mocking, overwhelming, defeated) ~200×180px each. BOTTOM ROW: 4 action poses (chaos, swooping, scattering, imploding) ~200×160px each. CHARACTER: Dark energetic antagonist with angular posture, sharp intense eyes, dark colors (charcoal #1a1a2e, midnight blue #16213e, deep purple #2c0b4e) with electric cyan #00d8ff and neon magenta #ff1f5a accents. Spiky jagged hair/silhouette. STYLE: Professional 2D cartoon, bold clean lines, dynamic motion lines, electric effects, studio quality. No text/watermarks. COLOR DISTRIBUTION: 60-70% dark, 30-40% electric accents." \
  --output-file ECHO-character-design-sheet-16x9.png
```

### Parameters
- **Model:** `black-forest-labs/flux-1.1-pro`
- **Aspect Ratio:** `16:9` (critical!)
- **Quality:** Premium (default)
- **Output Format:** PNG
- **Expected Time:** 10-30 seconds
- **Estimated Cost:** ~$0.03-0.05

---

## Quality Checklist (In 30 Seconds)

After generation, verify:

- [ ] **Composition:** 16:9 aspect, white background, all 11 elements visible
- [ ] **Character:** Same character across all variations, consistent proportions
- [ ] **Colors:** Dark + electric cyan + magenta, not muted or soft
- [ ] **Style:** Professional 2D cartoon, bold lines, not generic AI
- [ ] **Details:** Motion lines visible, sharp crisp edges, no blur
- [ ] **Ready?** If all checked → Integration ready!

---

## File Locations

All specification documents at repo root:

```
/home/user/jamie-wigg/
├── ECHO-CHARACTER-DESIGN.md           ← Start here for full specs
├── ECHO-DESIGN-SHEET-LAYOUT.md        ← Precise positioning
├── ECHO-FLUX-PRO-GENERATION.md        ← Generation instructions
├── ECHO-GENERATION-README.md          ← Complete overview
├── ECHO-QUICK-REFERENCE.md            ← This file (quick lookup)
└── ECHO-CHARACTER-DESIGN-SPEC.md      ← Original specification
```

---

## Integration Checklist

After successful generation:

- [ ] Save to `echo-character-design/ECHO-character-design-sheet-16x9.png`
- [ ] Extract components if needed for animation
- [ ] Add color palette to design system
- [ ] Archive as animation reference
- [ ] Update project documentation
- [ ] Distribute to animation/game teams
- [ ] Ready for publication/marketing

---

## Color Swatches (Copy These!)

```
DARK COLORS:
#1a1a2e (Charcoal) - 45-50% usage
#16213e (Midnight Blue) - 10-15% usage
#2c0b4e (Deep Purple) - 5-10% usage

ELECTRIC ACCENTS:
#00d8ff (Bright Cyan) - 15-20% usage ← MUST BE BRIGHT!
#ff1f5a (Neon Magenta) - 15-20% usage ← MUST BE BRIGHT!
#9d4edd (Violet) - 5% usage

BACKGROUND:
#ffffff (Pure White) - Canvas only
```

---

## Common Questions

**Q: Why 11 variations?**
A: 3 heads (angles) + 1 full body + 4 expressions + 4 poses = comprehensive animation reference

**Q: How long does generation take?**
A: Typically 10-30 seconds. Never more than 60 seconds.

**Q: What if colors are wrong?**
A: Regenerate with explicit hex codes. FLUX Pro responds to specific color values.

**Q: Can I use a different model?**
A: No. FLUX 1.1 Pro is specified for world-class quality. Schnell is too fast/lower quality.

**Q: Is the prompt too long?**
A: No. FLUX Pro handles detailed prompts well. More specifics = better results.

**Q: What's the resolution requirement?**
A: Minimum 1920×1080. Higher is better (3840×2160 for high-end use).

**Q: Can I modify the character after generation?**
A: Reference documents explain manual illustration if needed. Generated image is production-ready.

---

## Key Takeaways

1. **Dark Antagonist:** ECHO is threatening, never cute or friendly
2. **Electric Energy:** Cyan and magenta must POP against dark colors
3. **Angular Design:** Sharp lines, jagged silhouette, dynamic postures
4. **11 Variations:** Complete animation and reference coverage
5. **Professional Quality:** Studio-grade illustration, world-class standard
6. **Ready to Generate:** All specifications prepared and optimized

---

## Critical Success Factors

For generation to succeed:

✓ Use FLUX 1.1 Pro (not schnell)  
✓ Set aspect_ratio to "16:9" (exact!)  
✓ Use full prompt from `ECHO-FLUX-PRO-GENERATION.md`  
✓ Verify REPLICATE_API_TOKEN valid  
✓ Allow 30-60 seconds for generation  
✓ Verify white background in output  
✓ Check all 11 elements present  
✓ Confirm electric colors are bright and vibrant  

---

**Status:** ✓ Ready for Generation  
**Date:** 2026-06-07  
**Quality Standard:** Professional 2D Cartoon (World-Class)  

**Next Step:** Copy the prompt from `ECHO-FLUX-PRO-GENERATION.md` and generate!

---

## Document Index

| Document | Purpose | Length |
|----------|---------|--------|
| `ECHO-QUICK-REFERENCE.md` | One-page summary (you are here) | ~500 words |
| `ECHO-CHARACTER-DESIGN.md` | Complete visual specifications | ~350 lines |
| `ECHO-DESIGN-SHEET-LAYOUT.md` | Detailed positioning guide | ~330 lines |
| `ECHO-FLUX-PRO-GENERATION.md` | Generation instructions & QA | ~380 lines |
| `ECHO-GENERATION-README.md` | Full project overview | ~475 lines |

**Total Package:** 1,700+ lines of professional specifications ready for generation.

---

*For detailed specifications, see the full documents. For generation, use the prompt in ECHO-FLUX-PRO-GENERATION.md. Questions? Refer to the complete specification files.*

