# ECHO Character Design - FLUX Pro Generation Brief

**Status:** Ready for Professional FLUX 1.1 Pro Image Generation  
**Model:** black-forest-labs/flux-1.1-pro  
**Aspect Ratio:** 16:9 (Landscape 1920×1080 minimum)  
**Quality Target:** World-class professional 2D cartoon illustration  

---

## Generation Instructions

### Setup
```bash
# Set up Replicate API credentials
export REPLICATE_API_TOKEN="your-token-here"

# Navigate to project root
cd /home/user/jamie-wigg

# Use replicate skill or direct API call to generate
```

### FLUX Pro Prompt (Optimized)

```
Professional 2D cartoon character design sheet for ECHO - antagonist embodying sensory chaos and ADHD overwhelm.

CANVAS: 16:9 landscape (1920×1080 minimum). Pure white background, studio quality. Organized design sheet layout.

LAYOUT STRUCTURE (in order from top):
1. TOP ROW: Three head variations, each ~280×240px:
   - Left: Sharp profile view (90° left profile), angular features, sharp eyes looking forward, spiky profile silhouette
   - Center: Three-quarter view emphasizing intense sharp eyes, 45° angle, expressive, intense pupils
   - Right: Front-facing full view, both eyes visible intense narrow pupils, open chaotic expression, full spiky crown effect

2. CENTER (40% of canvas height): MAIN FULL-BODY CHARACTER PORTRAIT
   - Positioned in center of design sheet
   - Large central figure: ~600×400px
   - Dark energetic antagonist with angular dynamic posture suggesting constant restless motion
   - Head: Sharp intense eyes with narrow pupils expressing distraction and sensory overwhelm
   - Clothing: Dark colors (charcoal #1a1a2e, midnight blue #16213e, deep purple #2c0b4e) with electric accent colors (bright cyan #00d8ff, neon magenta #ff1f5a) creating chaotic energy patterns
   - Silhouette: Jagged, spiky, angular edges suggesting chaos and electric charge
   - Hair/head: Spiky or sharp-edged suggesting constant electric restlessness
   - Aura: Subtle electric glow or motion lines surrounding figure
   - Full body from head to feet with extended arms or dynamic posture

3. MIDDLE ROW: Four distinct emotional expression head shots, each ~200×180px:
   - Position 1 (Chaotic/Wild): Eyes wide open with intensity radiating, mouth open in extreme expression, explosive energy lines bursting outward, electric cyan and magenta accents
   - Position 2 (Mocking/Taunting): Confident smirk or sneer, narrow eyes looking dismissive, arrogant head tilt, controlled intense confidence, cooler tones with magenta accents
   - Position 3 (Overwhelming/Intense): Sensory overload state with distorted features, strong electric field aura, distortion waves around head, intense magenta and cyan with purple overlay, overstimulated appearance
   - Position 4 (Defeated/Retreating): Withdrawn diminished expression, smaller posture, minimal energy aura, fading electric effect, darker tones reduced accent colors

4. BOTTOM ROW: Four distinct action poses, each ~200×160px:
   - Position 1 (Creating Chaos): Arms spread wide open expansive gesture, fragments and particles scattering in all directions around character, outward explosion of chaos, multiple direction motion lines
   - Position 2 (Swooping Attack): Dynamic diving or swooping forward at 45° angle, trailing motion effects behind character, aggressive speed lines, forward momentum
   - Position 3 (Scattering/Dispersing): Character or energy fragmenting and dispersing outward, multiple pieces moving away from center, radiating outward motion, electric cyan and magenta particles
   - Position 4 (Imploding/Contracting): Body contracting inward, spiraling/converging motion lines toward center, energy being pulled inward, compressed electric accents, opposite of explosion effect

CHARACTER VISUAL LANGUAGE:
- Clean bold cartoon lines, professional 2D illustration style
- Dynamic motion lines throughout suggesting constant chaos and energy
- Electric aura/glow effects in active states and intense expressions
- Particle effects and fragmentation visualizing sensory overload
- Distortion and wave effects representing overwhelm
- Sharp angles throughout design
- Spiky silhouette conveying restlessness

COLOR PALETTE (Critical - maintain throughout):
- Primary dark colors: Charcoal #1a1a2e (60%), Midnight Blue #16213e (10%)
- Secondary dark: Deep Purple #2c0b4e (10%)
- Electric accents: Bright Cyan #00d8ff (15%), Neon Magenta #ff1f5a (15%)
- Secondary accents: Violet #9d4edd (5%)
- Background: Pure White #ffffff
- Distribution: 60-70% dark fill, 30-40% electric accent colors
- Electric colors should POP against dark background
- High saturation on cyan and magenta, muted on dark colors

VISUAL EFFECTS:
- Motion lines: Dynamic, aggressive, pointing multiple directions, varying lengths
- Aura effects: Electric field glow around character in action/intense states
- Particle effects: Scattered fragments, dispersing energy in action poses
- Distortion: Subtle wave distortion in overwhelming expression
- Trails: Motion trails in swooping and dispersing poses
- Shadows: Optional subtle soft shadows on character (not background)

ILLUSTRATION STYLE:
- Professional quality 2D cartoon (like high-end animated character sheets)
- Contemporary digital illustration aesthetic
- Bold character design with dynamic motion
- Electric/energy effect visualization (like electricity or sensory chaos effects)
- Sophisticated use of color theory
- Professional studio lighting and presentation
- Sharp crisp lines and edges (no blur)
- Consistent line weight throughout

WHAT TO EMPHASIZE:
✓ Angular, dynamic, sharp postures throughout all poses
✓ Intense sharp eyes in every variation
✓ Electric cyan and magenta colors prominently visible
✓ Motion lines and energy effects suggesting chaos
✓ All 11 distinct character states clearly different and recognizable
✓ Professional studio-quality appearance
✓ Clear contrast between character and white background
✓ Dynamic motion language throughout

WHAT TO AVOID:
✗ Generic AI aesthetics or defaults
✗ Soft, rounded, appealing design (keep antagonistic)
✗ Overly complex or cluttered composition
✗ Bright cheerful colors (stay with dark + electric accents)
✗ Stiff, static, uninteresting poses
✗ Symmetrical balanced composition (keep dynamic, slightly off-balance)
✗ Text, labels, or watermarks anywhere on image
✗ Realistic photographic style (stay 2D cartoon)
✗ Cartoonish/cute aesthetics (keep dark and intense)
✗ Monochrome or muted colors (use full palette)

OUTPUT SPECIFICATIONS:
- Format: PNG (recommended) or high-quality JPEG
- Resolution: 1920×1080px minimum (accept higher if available)
- Color Profile: sRGB
- Canvas: Exactly 16:9 aspect ratio, white background
- Quality: Maximum detail and sharpness
- File: Professional publication-ready

This is a professional character design sheet brief for a world-class 2D cartoon character. Generate with maximum attention to detail, color accuracy, pose variation, and professional illustration quality.
```

---

## Generation Parameters

### FLUX Pro API Call Structure

```json
{
  "model": "black-forest-labs/flux-1.1-pro",
  "prompt": "[Full prompt above]",
  "aspect_ratio": "16:9",
  "output_format": "png",
  "quality": "premium",
  "safety_tolerance": 2,
  "seed": null
}
```

### Alternative: Using Replicate CLI

```bash
# Using replicate CLI tool
replicate predict \
  black-forest-labs/flux-1.1-pro \
  --input aspect_ratio="16:9" \
  --input prompt="[Full prompt above]" \
  --input quality="premium" \
  --output-file echo-design-sheet-16x9.png
```

### Expected Generation Time
- **Standard:** 10-30 seconds
- **Max Quality:** Up to 60 seconds
- **Total API Cost:** ~$0.03-$0.05 per generation at FLUX Pro rates

---

## Quality Assurance Checklist

After generation, verify:

### Composition & Layout
- [ ] 16:9 aspect ratio perfect
- [ ] White background clean and pure
- [ ] All 11 character elements present and clearly visible
- [ ] Professional spacing and alignment
- [ ] Center figure is largest and most detailed

### Character Consistency
- [ ] Same character across all variations
- [ ] Body proportions consistent
- [ ] Angular, sharp design consistent throughout
- [ ] Facial structure consistent (sharp, intense)
- [ ] Same costume/clothing elements present

### Visual Elements
- [ ] Motion lines visible and dynamic
- [ ] Electric cyan clearly visible and vibrant
- [ ] Neon magenta clearly visible and vibrant
- [ ] Dark colors (charcoal/midnight/purple) well-balanced
- [ ] Auras and effects visible in intense expressions
- [ ] Particle effects in action poses

### Head Variations (Top Row)
- [ ] Profile view: true 90° profile, spiky silhouette
- [ ] 3/4 view: emphasizes eyes, three-dimensional
- [ ] Front view: both eyes visible, intense, open expression

### Emotional Expressions (Middle Row)
- [ ] Chaotic/wild: explosive, radiating energy
- [ ] Mocking: confident, dismissive
- [ ] Overwhelming: sensory overload, distorted
- [ ] Defeated: withdrawn, fading energy

### Action Poses (Bottom Row)
- [ ] Creating chaos: arms spread, particles radiating
- [ ] Swooping: dynamic forward motion, trails
- [ ] Scattering: fragments dispersing outward
- [ ] Imploding: energy contracting inward

### Professional Quality
- [ ] Sharp, crisp lines (no blur or artifacts)
- [ ] Consistent line weights
- [ ] No text or watermarks
- [ ] Professional studio lighting
- [ ] Ready for print at 300 DPI
- [ ] Suitable for character animation reference

---

## If Generation Needs Refinement

### Common Adjustments

**If colors are off:**
- Regenerate with explicit hex codes in prompt
- Add "must use exact colors: #1a1a2e, #00d8ff, #ff1f5a"
- Specify "electric bright cyan" and "neon bright magenta"

**If poses are too similar:**
- Emphasize "each pose must be distinctly different"
- Add "dramatic variation between poses"
- Specify exact pose descriptions in generation prompt

**If design is too soft/cute:**
- Add "dark antagonist, never cute or appealing"
- Specify "sharp angular lines, not rounded"
- Emphasize "intense and chaotic, not friendly"

**If composition is unclear:**
- Request "clear studio layout with white space between sections"
- Specify "professional design sheet format"
- Add "clearly organized, professional presentation"

**If details are missing:**
- Regenerate with "include all 11 character variations"
- Specify "high detail, sharp crisp lines"
- Request "professional quality suitable for animation reference"

---

## Storage & Organization

### File Management
```bash
# Create organized directory structure
mkdir -p echo-character-design/{full-sheet,components,reference,exports}

# Download to main location
echo-character-design/
├── ECHO-character-design-sheet-16x9.png          # Full design sheet (primary)
├── ECHO-design-sheet-layout.md                   # Layout specifications
├── ECHO-CHARACTER-DESIGN.md                      # Design specifications
├── ECHO-FLUX-PRO-GENERATION.md                   # This file
│
├── components/                                   # Individual extracted components
│   ├── echo-full-body-reference.png
│   ├── echo-head-variations.png
│   ├── echo-expressions.png
│   └── echo-action-poses.png
│
├── reference/                                    # Design system references
│   ├── color-palette-swatches.png
│   ├── line-weight-reference.png
│   └── motion-effects-reference.png
│
└── exports/                                      # Export formats for different uses
    ├── echo-web-optimized.png                    # Smaller for web
    ├── echo-print-300dpi.png                     # Print quality
    └── echo-animation-frames/                    # Extracted animation frames
```

---

## Next Steps After Generation

1. **Quality Review:** Compare against this specification
2. **Component Extraction:** Extract individual sections as needed
3. **Color Verification:** Confirm color hex codes match palette
4. **Animation Reference:** Use as basis for character animation
5. **Integration:** Incorporate into Codex of Reality project
6. **Documentation:** Update design system with ECHO specifications
7. **Asset Management:** Organize in version control

---

## Integration with Codex Project

Once generated and verified, ECHO character design integrates into:

- **`sites/codex-of-reality/`** - Design system assets
- **Character Animations** - Reference for motion sequences
- **Marketing Materials** - Featured in promotional content
- **In-App Visuals** - Game elements, antagonist encounters
- **Documentation** - Design system reference library

---

## Additional Resources

### Related Design Files
- `rhythmix-teaser-60s/DESIGN.md` - Brand color palette reference
- `sites/codex-of-reality/styleguide.md` - Design system conventions
- `docs/adr/0001-hyperframes-over-remotion-for-promos.md` - Visual language standards

### Reference Documentation
- `ECHO-CHARACTER-DESIGN.md` - Complete character specifications
- `ECHO-DESIGN-SHEET-LAYOUT.md` - Detailed positioning guide
- `CONTEXT.md` - Project context and terminology

---

## Generation Checklist

### Pre-Generation
- [ ] REPLICATE_API_TOKEN set and valid
- [ ] .env file configured with credentials
- [ ] Creative-stack MCP server verified
- [ ] Target output directory exists
- [ ] Prompt reviewed and finalized

### Generation
- [ ] Use FLUX 1.1 Pro model
- [ ] Set aspect_ratio to "16:9"
- [ ] Use "premium" quality setting
- [ ] Allow 30-60 seconds for completion
- [ ] Monitor generation status

### Post-Generation
- [ ] Verify output file saved successfully
- [ ] Check image dimensions (1920×1080 minimum)
- [ ] Review all 11 character elements visible
- [ ] Confirm colors match specification
- [ ] Validate white background
- [ ] Test scaling and export formats

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API fails | Verify REPLICATE_API_TOKEN valid and active |
| Wrong aspect | Confirm aspect_ratio: "16:9" in parameters |
| Colors off | Regenerate with hex codes: #1a1a2e, #00d8ff, #ff1f5a |
| Missing elements | Request all 11 variations in prompt |
| Low quality | Use "premium" quality setting |
| Takes too long | FLUX Pro standard time is 10-30 seconds |
| File corrupt | Regenerate, save as PNG not JPEG |

---

## Success Criteria

The generated image is successful when:

✓ All 11 character states clearly visible and distinct  
✓ Professional 2D cartoon illustration quality  
✓ Dark antagonist aesthetic (never cute or appealing)  
✓ Electric cyan and magenta colors prominent and vibrant  
✓ Motion lines and effects suggesting chaos throughout  
✓ Clean bold outlines, sharp crisp details  
✓ 16:9 aspect ratio, white background  
✓ Suitable for animation reference and marketing use  
✓ Professional studio quality publication-ready  

---

**Status:** Ready for generation  
**Updated:** 2026-06-07  
**Version:** 1.0  

**Next Action:** Execute FLUX Pro generation with this brief and prompt.

