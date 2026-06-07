# MS. CHEN Character Design - Generation Instructions

## Quick Start

To generate the MS. CHEN character design sheet, you have two options:

### Option 1: Direct FLUX 1.1 Pro Prompt (Recommended)
Use the prompt in `ms-chen-character-sheet.md` → **GENERATION PROMPT** section directly with:
- **Model**: FLUX 1.1 Pro (black-forest-labs/flux-1.1-pro)
- **Image Dimensions**: 1920×1080 (16:9)
- **Output Format**: PNG

### Option 2: Use Claude Code's Replicate Skill
```bash
# From the repo root, run:
/dream MS. CHEN character design sheet - [copy prompt from GENERATION PROMPT section]
```

(This requires `REPLICATE_API_TOKEN` to be set in `.claude/settings.local.json`)

---

## Step-by-Step Generation (Option 1 - Direct)

### Prerequisites
- Access to FLUX 1.1 Pro via Replicate.com
- Replicate API token (create at https://replicate.com/account/api-tokens)
- Image generation interface (Replicate web UI, RunwayML, or similar)

### Steps

1. **Navigate to Replicate.com** or your preferred image generation interface
2. **Select Model**: `black-forest-labs/flux-1.1-pro`
3. **Set Image Size**: 1920×1080 (16:9 aspect ratio)
4. **Copy Full Prompt**: From the `ms-chen-character-sheet.md` file, **GENERATION PROMPT** section
5. **Paste Prompt**: Into your generation interface's prompt field
6. **Generate**: Submit for generation (typically 30-60 seconds processing)
7. **Download**: Save the PNG output to `character-designs/outputs/ms-chen-character-design-sheet.png`

---

## Prompt Customization Guide

If you need to adjust the generation, here are key parameters:

### To Emphasize Specific Aspects

**For more playful/warm feel**:
- Add: "warm, approachable, inviting expression throughout"
- Modify background: "soft cream background instead of white"

**For more professional/formal feel**:
- Add: "authoritative yet compassionate mentor presence"
- Modify: "structured, deliberate poses showing professional expertise"

**For more musical emphasis**:
- Add: "flowing hair suggesting rhythm and movement, hands positioned expressively like a musician"
- Modify pose descriptions: "conducting gesture showing musical direction"

**For more neurodivergent-specific representation**:
- Add: "showing authentic presence without forced perfection, genuine accessible wisdom"
- Modify: "real human expressions showing both strength and vulnerability"

### Color Variations (if needed)

If the teal/cream/gold palette needs adjustment:
- **Modern variant**: Use teal (#1B5E5E) with soft sage green and warm bronze accents
- **Warm variant**: Use rust-teal (#8B6F47) base with cream and copper accents
- **Cool variant**: Use deeper teal with silver accents instead of gold

### Style Adjustments

**For more cartoon-like feel**:
- Add: "cheerful, friendly cartoon style with rounded edges"
- Modify: "expressive exaggerated features while maintaining professionalism"

**For more realistic illustration**:
- Add: "detailed realistic illustration with soft painterly quality"
- Modify: "studio portrait style with professional lighting and depth"

---

## Output File Structure

```
character-designs/
├── ms-chen-character-sheet.md          # Full specification (this file's source)
├── GENERATION-INSTRUCTIONS.md          # This file
├── outputs/
│   ├── ms-chen-character-design-sheet.png    # Primary output
│   ├── ms-chen-main-figure.png              # Cropped: central full-body figure
│   ├── ms-chen-head-variations.png          # Cropped: left section (3 heads)
│   ├── ms-chen-mentor-poses.png             # Cropped: right section (4 poses)
│   └── ms-chen-expressions.png              # Cropped: bottom section (4 expressions)
├── usage-cases/
│   ├── profile-image.md                     # Using main figure for social/profile
│   ├── marketing-materials.md               # Using character in promotional content
│   ├── educational-content.md               # Using as teaching reference
│   └── animation-reference.md               # Using as basis for animated content
└── design-notes/
    ├── color-palette.md                     # Detailed color specifications
    ├── posture-guide.md                     # Understanding her graceful bearing
    ├── expression-guide.md                  # Reading her expressions
    └── brand-integration.md                 # Integrating with RHYTHMIX brand
```

---

## Quality Checklist

After generation, verify the output meets these criteria:

**Visual Quality**
- [ ] Image is crisp and clear (no blur or artifacts)
- [ ] White background is pure white (#FFFFFF)
- [ ] All color values match specification (check using color picker)
- [ ] Line work is smooth and graceful
- [ ] Proportions look natural and balanced

**Character Accuracy**
- [ ] Skin tone matches warm medium-brown (#8B6F47)
- [ ] Hair is dark brown (#2c1810) and flows gracefully
- [ ] Cardigan is deep teal (#1B5E5E)
- [ ] Shirt is cream colored (#F5F1E8)
- [ ] Gold accents are visible on buttons, trim, jewelry
- [ ] Eyes express wisdom, kindness, and patience
- [ ] Overall bearing is graceful and poised

**Layout Verification**
- [ ] Central figure is prominent (3/4 view, graceful posture)
- [ ] Left section shows 3 head variations clearly
- [ ] Right section shows 4 distinct mentor poses
- [ ] Bottom section shows 4 expression variations
- [ ] All sections are labeled or clearly distinguished
- [ ] Composition is balanced and professional

**Expression Check**
- [ ] Serene/Wise expression: Calm, knowing, patient
- [ ] Encouraging/Supportive: Warm, affirming, bright-eyed
- [ ] Musical/Inspired: Joyful, present, engaged
- [ ] Nurturing/Patient: Tender, understanding, compassionate

**Mentor Poses Check**
- [ ] Teaching/Conducting: Arms raised or gesturing, confident, inspiring
- [ ] Listening Attentively: Leaned forward, hand position suggesting engagement
- [ ] Playing/Moving with Music: Body suggesting rhythm, relaxed, joyful
- [ ] Hand-on-Shoulder: Warm, reassuring, intimate, trusting

---

## Post-Generation Steps

### 1. Sectional Cropping (Optional)
If you want to extract individual sections for different use cases:

```
Using an image editor (Photoshop, GIMP, or online tool):

1. Open ms-chen-character-design-sheet.png
2. Crop central area (approximately 40-60% of width, centered)
   → Save as: ms-chen-main-figure.png

3. Crop left section (approximately 15-25% of width, left side)
   → Save as: ms-chen-head-variations.png

4. Crop right section (approximately 15-25% of width, right side)
   → Save as: ms-chen-mentor-poses.png

5. Crop bottom section (approximately 10-15% of height, bottom)
   → Save as: ms-chen-expressions.png
```

### 2. Color Verification
Use a color picker to verify actual colors match spec:
- Cardigan teal should be very close to #1B5E5E
- Skin should be #8B6F47 or very close
- Gold accents should be #DAA520 or similar warm gold
- Background should be #FFFFFF

### 3. High-Resolution Variants (Optional)
If generating multiple times, try higher resolutions:
- 2560×1440 (2K quality)
- 3840×2160 (4K quality)
These provide better detail for print or large-scale use.

### 4. Accessibility Check
- [ ] Character is recognizable at small sizes (profile picture size)
- [ ] Expressions are clear even when thumbnail-sized
- [ ] Color contrast is sufficient for colorblind viewers
- [ ] No reliance on color alone to distinguish sections

---

## Integration with RHYTHMIX Brand

### Color Harmony with RHYTHMIX Palette
MS. CHEN's palette (teal, cream, gold) complements RHYTHMIX's core colors:
- **RHYTHMIX Brand Colors**: near-black with violet, magenta, cyan, signal green
- **MS. CHEN Colors**: warm teal, cream, gold
- **Integration**: Use MS. CHEN in warm, mentorship-focused content; pair with softer RHYTHMIX brand elements

### Usage Contexts within RHYTHMIX

1. **Educational Content**: Feature MS. CHEN when teaching or explaining
2. **Mentorship Materials**: Use for guides on healthy adulthood, neurodivergence
3. **Character Introduction**: Introduce her in the RHYTHMIX narrative
4. **Social Media**: Profile images, educational carousel posts
5. **Email Signatures**: In mentorship-focused communications
6. **Documentation**: As representative of RHYTHMIX's values and accessibility

---

## Troubleshooting

### If Colors Don't Match
- **Problem**: Generated colors are off from specification
- **Solution**: 
  1. Regenerate with color codes explicitly stated: "specifically use deep teal #1B5E5E, warm brown #8B6F47, gold #DAA520"
  2. Use color grading in post to adjust (color balance in Photoshop/GIMP)
  3. Try alternative prompting: "teal like deep ocean waters, skin like warm earth tones"

### If Proportions Look Off
- **Problem**: Character looks stretched, compressed, or unbalanced
- **Solution**:
  1. Ensure image dimensions are exactly 1920×1080 (16:9)
  2. Regenerate with emphasis: "balanced professional proportions, realistic human anatomy"
  3. Check if layout is properly balanced (central figure prominent, sections clearly visible)

### If Expressions Aren't Distinct Enough
- **Problem**: All four expressions look similar
- **Solution**:
  1. Regenerate with stronger expression directives
  2. Add: "clearly distinct emotional expressions showing range of mentor wisdom"
  3. Use more specific descriptors for each: "radiantly warm", "deeply patient", "joyfully present"

### If Character Doesn't Feel Like a Mentor
- **Problem**: Feels more generic or not specifically mentor-like
- **Solution**:
  1. Add to prompt: "she is a trusted mentor showing genuine wisdom from lived experience"
  2. Emphasize: "postures show active listening, teaching, supporting others"
  3. Include: "expression conveys both strength and accessibility"

---

## Next Steps After Generation

1. **Store the output**: Save to `character-designs/outputs/`
2. **Review against spec**: Use Quality Checklist above
3. **Extract sections**: Crop into individual usage variants if needed
4. **Integration planning**: Decide where MS. CHEN will appear in RHYTHMIX materials
5. **Additional versions**: Generate alternative versions (different expressions, poses) as needed
6. **Archive reference**: Keep the specification for future consistency

---

## Additional Resources

- **Main Specification**: See `ms-chen-character-sheet.md`
- **RHYTHMIX Brand Guidelines**: See `rhythmix-teaser-60s/DESIGN.md`
- **Character Use Cases**: See `character-designs/usage-cases/` (when created)
- **FLUX 1.1 Pro Docs**: https://replicate.com/black-forest-labs/flux-1.1-pro

---

## Questions or Adjustments?

This specification is designed to be adaptable. If you need variations:
- Different emotional tone? Adjust the MOOD section
- Different cultural representation? Modify physical characteristics
- Different context? Update the "What this design conveys" section
- Different color palette? See "Color Variations" section above

The specification is a living document—update it as needs evolve.
