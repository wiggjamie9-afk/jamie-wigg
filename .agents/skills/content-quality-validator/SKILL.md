---
name: content-quality-validator
description: Automated evaluation and scoring system for generated images, videos, and audio
---

# Content Quality Validator

Systematically evaluate creative outputs against brand, technical, and performance criteria.

## When to use

- Rank 10 generated images to find the best 3
- Determine if a video is production-ready before publishing
- Validate generated audio matches narration timing
- Create objective pass/fail gates for batch workflows
- Track quality metrics over time to improve prompts

## Quality Dimensions

### For Images

**Visual Quality**
- Sharpness (0-10): edge clarity, no blur
- Color accuracy (0-10): hue consistency, no color shifts
- Lighting (0-10): even exposure, good contrast, no blown highlights
- Artifacts (0-10): no pixelation, compression, or generation errors

**Composition**
- Rule of thirds (0-10): balanced framing, focal point placement
- Depth (0-10): foreground/mid/background separation
- Symmetry (0-10): balance, proportion, alignment
- Visual weight (0-10): elements appropriately sized

**Brand Alignment**
- Color palette (0-10): matches brand colors ±15% hue
- Aesthetic (0-10): style matches brief (modern/minimal/energetic/etc)
- Typography fit (0-10): if text present, font and placement appropriate
- Mood (0-10): emotional tone matches intent

**Technical**
- Resolution (0-10): sufficient DPI for use case
- Format (0-10): correct file type and dimensions
- Metadata (0-10): proper exif, copyright, archival info
- File size (0-10): optimized for distribution

### For Videos

**Motion Quality**
- Smoothness (0-10): no jitter, fluid motion curves
- Consistency (0-10): frame-to-frame coherence
- Motion blur (0-10): appropriate, not excessive
- FPS stability (0-10): constant frame rate

**Audio Sync**
- Music timing (0-10): beats align with cuts
- Narration sync (0-10): voice matches video moments
- Silence gaps (0-10): no unexpected dead air
- Volume levels (0-10): consistent, not peaking

**Composition**
- Framing (0-10): subjects well-positioned
- Transitions (0-10): cuts are smooth, purposeful
- Pacing (0-10): timing appropriate for content
- Visual flow (0-10): eye movement feels natural

**Brand & Content**
- Color grading (0-10): matches brand and mood
- Effects quality (0-10): overlays/text readable and on-brand
- Message clarity (0-10): intent obvious from viewing
- Emotional impact (0-10): evokes intended response

**Technical**
- Resolution (0-10): matches target platform (1080p/4K/etc)
- Codec (0-10): correct format (H.264/VP9/ProRes/etc)
- Duration (0-10): accurate to brief
- Bitrate (0-10): optimized, no visible compression

### For Audio

**Technical**
- Sample rate (0-10): 44.1kHz or higher
- Bit depth (0-10): 16-bit or higher
- Normalization (0-10): levels optimized, no clipping
- Noise floor (0-10): clean, no hum/hiss

**Voice Quality** (if narration)
- Clarity (0-10): pronunciation clear, no mumbling
- Pacing (0-10): speed appropriate, not rushed
- Emotion (0-10): matches mood (energetic/calm/authoritative)
- Consistency (0-10): tone steady, no pitch jumps

**Music Quality**
- Genre fit (0-10): matches brief
- Energy level (0-10): appropriate for video pacing
- Instrumentation (0-10): cohesive, not jarring
- Mixing (0-10): balanced frequencies, no muddiness

## Usage

### Quick Score (5 min)

```
Ask Claude:
"Use content-quality-validator to score this image:
[image description or file]
Show overall score and top 2 issues."

Returns: Single score 0-10 + brief feedback
```

### Detailed Score (15 min)

```
Ask Claude:
"Use content-quality-validator for detailed evaluation:
Image: [description]
Criteria: brand alignment, technical quality, composition
Show all dimensions with scores and specific feedback."

Returns: Detailed scorecard + improvement suggestions
```

### Batch Ranking (30 min for 10 items)

```
Ask Claude:
"Use content-quality-validator to rank these 10 images:
1. [description] 2. [description] ... 10. [description]
Score each on: lighting (40%), composition (30%), brand (30%)
Return ranked list with scores and top 3 analysis."

Returns: Ranked list, top 3 detailed feedback, overall distribution
```

### Pass/Fail Gate

```
Ask Claude:
"Use content-quality-validator to filter these 20 videos:
Minimum acceptable score: 7.5/10
Criteria: motion quality (50%), audio sync (30%), message (20%)
Return: passing videos, failing videos with reason, metrics."

Returns: 14 passing, 6 failing with specific issues
```

## Scoring Formula

### Overall Score

```
Overall = (Quality×0.35) + (Composition×0.35) + (Brand×0.20) + (Technical×0.10)

Where:
- Quality: sharpness, color, lighting, artifacts (average)
- Composition: balance, depth, visual flow (average)
- Brand: palette, aesthetic, mood (average)
- Technical: resolution, format, metadata (average)
```

### Custom Weighting

For specific campaigns, adjust weights:

```
RHYTHMIX Promos:
- Motion quality: 50% (most important)
- Audio sync: 25%
- Brand alignment: 15%
- Technical: 10%

STARLIGHTMIX Hero Images:
- Color accuracy: 35%
- Lighting: 30%
- Composition: 20%
- Artifacts: 15%
```

## Pass/Fail Thresholds

| Threshold | Use Case |
|---|---|
| 9.0+ | Premium marketing, hero images |
| 8.0-8.9 | Social media, promos, standard content |
| 7.0-7.9 | Internal review, draft approval |
| 6.0-6.9 | Needs rework, consider regenerating |
| <6.0 | Reject, regenerate with adjusted prompt |

## Feedback Suggestions

Each dimension includes actionable feedback:

```
Lighting: 6/10
Issue: Shadows too deep, right side underexposed
Fix: Increase fill light 2 stops, or use brighter ambient
Prompt adjustment: "even lighting, bright ambient fill"
```

```
Motion: 5/10
Issue: Jitter visible in pan, frame rate unstable
Fix: Use seedance-v2 instead of kling (smoother)
Prompt adjustment: "smooth, cinematic, fluid motion"
```

## Tracking Improvements

Over time, compare scores:

```
Image batch trends:
- Week 1: avg 6.8 (prompts too vague)
- Week 2: avg 7.4 (added specific style words)
- Week 3: avg 8.1 (refined model selection + A/B testing)
```

## Integration with Orchestrator

Validator auto-triggers in orchestrator:

```
Generate → Score → Rank → Keep if ≥7.5 → Proceed to video
                                ↓
                        Regenerate if <7.5
```

## Common Scoring Patterns

**All scores 8+**: Content is ready for production
→ Proceed to next stage (video, effects, etc)

**Composition low, others high**: Reframe or recompose
→ Regenerate with position/crop adjustments

**Brand alignment low**: Prompt doesn't match brand
→ Add specific brand descriptor to prompt

**Technical low but creative high**: File needs optimization
→ Export with higher quality settings

**Motion jittery**: Model choice issue
→ Switch from kling-3-0 to seedance-v2

## Advanced: Custom Evaluators

Define brand-specific evaluation:

```
RHYTHMIX brand evaluation:
- Color saturation: ±15% of brand palette
- Motion energy: Must have obvious movement (not static)
- Contrast ratio: Min 4.5:1 for text
- "Vibe match": Does it feel like RHYTHMIX? (subjective, 0-10)
```

## Troubleshooting

**"Scores seem arbitrary"**
→ Standardize your scoring rubric
→ Use numeric thresholds, not subjective terms
→ Example: "brightness > 140" not "bright enough"

**"Same image scored differently each time"**
→ Criteria may be too vague
→ Define what "good lighting" means for your use case
→ Create reference images showing 10/10 vs 6/10

**"Batch scores are all 7-7.5"**
→ Distribution suggests clustering
→ Widen quality acceptance band or improve prompts
→ Check if criteria weights are balanced

**"Passing videos still feel off"**
→ Your scoring criteria may not match your subjective taste
→ Add custom dimension (e.g., "vibe" or "impact")
→ Use 10-20 reference videos to calibrate scorer
