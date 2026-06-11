---
name: adaptive-prompt-optimizer
description: Iterative prompt refinement and A/B testing to discover what works best
---

# Adaptive Prompt Optimizer

Automatically improve prompts through A/B testing, iteration analysis, and pattern recognition.

## When to use

- You generated 10 images but 6 missed the mark
- Want to know why some prompts work better than others
- Need to test creative hypotheses (colors, styles, compositions)
- Want to scale successful prompts to 100+ variations
- Building reusable prompt templates for campaigns

## Core Workflows

### Workflow 1: Analyze Successes

```
Input: 10 generated images, quality scores (4 high, 6 low)

Claude analyzes successful prompts:
├─ Successful images common elements:
│  ├─ Language: "minimal", "clean", "modern" (avoid: "artistic", "dreamy")
│  ├─ Descriptors: specific nouns beat adjectives
│  ├─ Style: "product photography" > "photo"
│  ├─ Lighting: "studio" > "natural"
│  └─ Background: "white" > unspecified
│
└─ Recommendation:
   "Use: '[OBJECT] product photography, minimal, clean, studio lighting, white background'
   Avoid: vague adjectives, mixed styles, complex scenes"
```

### Workflow 2: A/B Test Hypotheses

```
Hypothesis: "Serif fonts perform better than sans-serif"

Generate Variant A (serif):
└─ "Modern serif typeface, elegant, sophisticated"
   5 images, quality avg: 7.8/10

Generate Variant B (sans-serif):
└─ "Clean sans-serif, bold, contemporary"
   5 images, quality avg: 6.9/10

Result: A wins (+0.9pts)
Insight: For this brand, serif = perceived as more premium
Apply: Use serif language in next batch
```

### Workflow 3: Iterative Refinement

```
Round 1: "beautiful landscape"
└─ Scores: avg 6.2/10 (vague, inconsistent)

Round 2: "mountain landscape, golden hour, dramatic sky"
└─ Scores: avg 7.4/10 (+1.2pts, better specificity)

Round 3: "alpine landscape, 500m elevation, sunset orange sky, foreground trees, depth"
└─ Scores: avg 8.1/10 (+0.7pts, specific details matter)

Learning: More specific = higher quality
Recommendation: Add 3-5 specific visual elements per prompt
```

### Workflow 4: Cross-Variant Testing

```
Test: Color palette impact on perceived energy

Generate 4 variants:
1. Vibrant neons (hot pink, cyan, yellow)
   └─ "Energy" score: 8.5/10
   
2. Warm earth tones (rust, ochre, sage)
   └─ "Energy" score: 6.2/10
   
3. Cool pastels (blush, lavender, mint)
   └─ "Energy" score: 5.8/10
   
4. High contrast B&W
   └─ "Energy" score: 7.9/10

Result: Neons perform best on energy dimension
Broader insight: Color saturation directly impacts perceived energy
Recommendation: For high-energy content, use saturated palettes
```

## Usage Examples

### Example 1: Rescue Failing Batch

```
Ask Claude:
"I generated 30 images but only 12 scored 7+.
Failed images share these themes: [list 5 low-scoring images]
Use adaptive-prompt-optimizer to:
1. Identify why they failed
2. Show what the successful ones have in common
3. Suggest improved prompt for next batch
4. Predict quality improvement"

Returns:
├─ Failure analysis: "Vague adjectives caused inconsistency"
├─ Success pattern: "Specific nouns + studio lighting + minimal style"
├─ Improved prompt: "[OBJECT] studio product photography, minimal, white background, clear shadow"
└─ Predicted improvement: "7+/10: ~80% of next batch (vs current 40%)"
```

### Example 2: Validate Hypothesis

```
Ask Claude:
"Hypothesis: 'Simple backgrounds perform better than complex'
Test with 8 images:
- 4 with simple (white/black/neutral)
- 4 with complex (environment, context, people)
Both same subject, lighting, style
Score on: composition clarity, focus, visual noise
Winner? Why?"

Returns:
├─ Simple avg: 8.1/10
├─ Complex avg: 6.3/10
├─ Winner: Simple (+1.8pts)
├─ Why: Reduces visual noise, stronger focal point
└─ Apply to: All product photography going forward
```

### Example 3: Build Prompt Template

```
Ask Claude:
"From 20 successful RHYTHMIX images (all scored 8+):
Create a master prompt template with variables.
Show: required elements, optional elements, anti-patterns.
Format as template I can reuse with [VARIABLES]"

Returns:
├─ Template structure:
│  └─ "[CONCEPT] [STYLE], [LIGHTING], [MOOD], [TECHNICAL]"
├─ Required elements:
│  └─ Specific noun + studio lighting + style
├─ Optional elements:
│  └─ Color palette, depth, composition guide
├─ Anti-patterns:
│  └─ Avoid: vague adjectives, mixed styles, unclear focus
└─ Examples:
   ├─ "[City skyline] at [sunset], [vibrant neons], [architectural photography], [cinematic]"
   └─ "[Product] [minimal design], [studio three-point lighting], [luxury], [clean]"
```

### Example 4: Scale Success

```
Ask Claude:
"This prompt worked great (avg score 8.3/10):
'[PRODUCT] product photography, studio lighting, minimal white background, luxury'
Generate 50 products using this template.
Adjust only [PRODUCT] variable.
Monitor: Do scores stay 8+, or drop?
Report: Quality distribution + any adjustments needed"

Returns:
├─ 50 images generated
├─ Quality: 42 scored 8+, 6 scored 7-8, 2 scored 6-7
├─ Success rate: 84% (slightly lower than prototype 8.3)
├─ Why drop: Specific products harder to photograph than test object
├─ Adjustments:
│  ├─ For complex products: add "[with context]"
│  ├─ For reflective products: add "[diffuse lighting, no harsh shadows]"
│  └─ Retest with adjustments: expect 8+ scores to rise to 90%
```

## Analysis Frameworks

### The SPEC Framework

Structure successful prompts:

```
S = Subject (specific noun)
P = Photography/art type (what kind of image)
E = Environment/context (where, how lit)
C = Compositional detail (framing, focus, depth)

Example: "[PRODUCT] product photography, studio, white background, minimal, centered focus"
├─ S: [PRODUCT] - specific subject
├─ P: product photography - type of image
├─ E: studio, white background - controlled environment
└─ C: minimal, centered focus - composition guide
```

### The Quality Ladder

Improve prompts incrementally:

```
Level 1 (vague): "nice image"
└─ Score: 4/10

Level 2 (descriptive): "beautiful landscape"
└─ Score: 5.5/10

Level 3 (specific): "mountain landscape, sunset, golden hour"
└─ Score: 7/10

Level 4 (detailed): "alpine landscape, 4000m elevation, golden hour, dramatic orange sky, foreground evergreens, depth of field"
└─ Score: 8.5/10

Level 5 (expert): Level 4 + technical details (Sony A7RIII, 35mm, f/2.8, warm color grade, cinematic)
└─ Score: 9+/10
```

### The Dimension Matrix

Test one variable at a time:

```
Test: Does [STYLE] impact perceived professionalism?

|         | Minimalist | Modern | Luxe | Edgy |
|---------|-----------|--------|------|------|
| Score   | 7.2       | 7.8    | 8.4  | 6.1  |
| Energy  | 5/10      | 6/10   | 7/10 | 9/10 |
| Premium | 7/10      | 7/10   | 9/10 | 3/10 |

Result: Style significantly impacts perception
Winner: "Luxe" style for premium positioning
```

## Pattern Library

Build reusable patterns:

```
PATTERN: Product Hero Images
├─ Base: "[PRODUCT] luxury product photography, studio, white background"
├─ Variations:
│  ├─ Premium: add "cinematic lighting, perfect focus, luxury aesthetic"
│  ├─ Modern: add "minimal, geometric, clean lines"
│  └─ Dramatic: add "dramatic shadows, high contrast, moody"
└─ Success rate: 85-90% score 8+

PATTERN: Landscape Cinematics
├─ Base: "[LOCATION] landscape, [HOUR], dramatic sky"
├─ Enhancements:
│  ├─ Add specific elevation: "alpine, 4000m"
│  ├─ Add foreground: "evergreens in foreground, depth"
│  └─ Add mood: "golden hour, warm tones"
└─ Success rate: 78-85% score 8+

PATTERN: Character Animation
├─ Base: "[CHARACTER] character, [STYLE], [EXPRESSION]"
├─ Details:
│  ├─ Pose: "standing, facing camera"
│  ├─ Lighting: "soft three-point lighting"
│  └─ Background: "neutral, complementary"
└─ Success rate: 70-80% score 8+
```

## Iteration Tracking

Monitor improvement over time:

```
Campaign: "RHYTHMIX Summer Promo"

Week 1 (generic prompts):
└─ Avg score: 6.4/10, success rate: 45%

Week 2 (added specificity):
└─ Avg score: 7.2/10, success rate: 62%

Week 3 (added technical detail):
└─ Avg score: 8.0/10, success rate: 81%

Week 4 (A/B tested styles):
└─ Avg score: 8.3/10, success rate: 88%

Cumulative improvement: +1.9pts, +43 percentage points
Time invested: 4 hours across 4 weeks
ROI: 50+ additional production-ready images
```

## Anti-Patterns (What NOT To Do)

```
❌ "beautiful, artistic, creative"
→ Too vague, every model interprets differently

❌ "looks like [famous photographer]"
→ Models struggle with style imitation

❌ "photo, image, picture"
→ Redundant, doesn't add info

❌ "cinematic, stunning, amazing"
→ Adjectives without specifics

✅ Instead use: "modern minimalist product photography, studio lighting, white background, 50mm lens, sharp focus"
→ Specific, model-agnostic, reproducible
```

## Advanced: Prompt Genetics

Track how prompt elements combine:

```
Successful element combinations:
├─ "studio lighting" + "white background" = 79% score 8+
├─ "minimal" + "centered focus" = 82% score 8+
├─ "luxury" + "sophisticated" = 68% score 8+
├─ "dramatic" + "high contrast" = 71% score 8+
└─ "modern" + "geometric" = 75% score 8+

Unsuccessful combinations:
├─ "minimal" + "dramatic" = 45% score 8+ (contradictory)
├─ "luxury" + "edgy" = 52% score 8+ (conflicting vibes)
└─ "ethereal" + "corporate" = 39% score 8+ (incompatible)

Recommendation: Build prompts from proven combinations
```

## Troubleshooting

**"Scores improved but images look different"**
→ Specificity trades flexibility for consistency
→ That's intentional; decide if consistency matters

**"A/B test winner didn't work in full batch"**
→ Sample size (8 images) too small
→ Scale to 20-30 images before confident in winner

**"Prompt gets worse the more specific I make it"**
→ You've hit the precision ceiling
→ Model struggles with too many constraints
→ Reduce to 5-7 key elements, remove redundancy

**"Different models respond differently to same prompt"**
→ That's expected (FLUX ≠ Soul ≠ GPT-Image)
→ A/B test per model, create model-specific prompts
