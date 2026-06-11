---
name: batch-workflow-optimizer
description: Intelligent batch processing, parallelization, and resource optimization for large-scale generation
---

# Batch Workflow Optimizer

Execute 100+ generation tasks efficiently with intelligent queueing, parallelization, and resource management.

## When to use

- Generate 50+ images in one session
- Create variations of 10 base concepts
- Produce multi-format outputs (1080p, 4K, square, portrait)
- Scale from prototype to production
- Minimize generation time and cost

## Core Capabilities

### Smart Batching

```
Input: 50 images to generate
Orchestrator:
├─ Fast tasks first (GPT-Image: 30s each) → 5 parallel
├─ Medium tasks next (FLUX: 60s each) → 3 parallel
├─ Slow tasks last (seedance-v2: 2.5min each) → 2 parallel
└─ Total time: ~8min (vs 2.5hrs sequential)
```

### Parallel Execution

```
Generate image set A + B simultaneously:
├─ Variant A: 5 images (FLUX model)
├─ Variant B: 5 images (Soul model)
└─ Both complete in parallel time of slower variant
```

### Resource Management

Track and optimize:
- Token usage (quota allocation)
- Generation credits/API calls
- Queue position (retry failures quickly)
- Model availability (auto-switch if limit hit)
- Memory usage (batch size optimization)

### Cost Efficiency

```
50 images, 3 models available:
- FLUX: $0.02/image, 60s, 95% success
- GPT-Image-2: $0.01/image, 30s, 92% success  
- Soul: Free, 45s, 88% success

Optimal: Soul (10) + GPT-Image (20) + FLUX (20)
Cost: ~$0.50 | Time: 12min | Success: 91%
```

## Usage Patterns

### Pattern 1: Batch with Fixed Params

```
Ask Claude:
"Use batch-workflow-optimizer to generate 50 product images
Model: FLUX
Prompt template: '[PRODUCT] product photography, studio lighting, white background'
Products: [list of 50]
Parallelization: 5 concurrent
Report: success rate, avg time, cost, quality distribution"

Result:
├─ 48/50 succeed (96%)
├─ Avg generation: 62s
├─ Total cost: $0.96
├─ Quality: 24 scored 8+, 18 scored 7-8, 6 scored 6-7
└─ Files: saved to outputs/batch_001/
```

### Pattern 2: Staged Batch (Image → Video)

```
Ask Claude:
"Stage 1: Generate 10 hero images (FLUX)
Stage 2: Auto-score, keep top 6 (threshold: 7.5+)
Stage 3: Create videos from 6 images (seedance-v2)
Stage 4: Auto-score videos, rank
Report: winner video + runner-ups + all metrics"

Timeline:
├─ Stage 1: 3min (10 in parallel)
├─ Stage 2: 1min (scoring)
├─ Stage 3: 15min (6 videos, 2 parallel)
├─ Stage 4: 2min (scoring)
└─ Total: 21min (vs 1.5hrs manual)
```

### Pattern 3: A/B Batch

```
Ask Claude:
"A/B test colors for RHYTHMIX promos
Variant A: Vibrant neons [hot pink, cyan, yellow]
Variant B: Soft pastels [blush, sage, pearl]
Generate: 8 images each variant
Models: 4x FLUX, 4x Soul (per variant)
Score: brand energy dimension
Recommend: winner + why"

Result:
├─ A: avg score 8.2 (high energy, high saturation)
├─ B: avg score 7.1 (calming, less attention-grabbing)
├─ Winner: A
├─ Insight: Neons match RHYTHMIX energy better
└─ Apply to next 50-image batch
```

### Pattern 4: Multi-Output Batch

```
Ask Claude:
"Generate 10 hero images for STARLIGHTMIX landing page
Output formats:
- 1920×1080 (desktop hero)
- 1080×1920 (mobile hero)
- 1200×630 (social preview)
- 400×400 (thumbnail)
Parallelize: 3 images at a time across all formats
Report: success rate, file sizes, visual inspection"

Result:
├─ 10 images × 4 formats = 40 outputs
├─ Generated in 8min (vs 40min sequential)
├─ All optimized for target platform
└─ Ready to deploy
```

## Batch Configuration

### Concurrency Settings

| Model | Avg Time | Max Parallel | Reason |
|---|---|---|---|
| GPT-Image-2 | 30s | 8 | Fast, low resource |
| Soul | 45s | 5 | Medium resource |
| FLUX | 60s | 3 | High resource |
| seedance-v2 | 2.5min | 2 | Very slow |
| kling-3-0 | 1.5min | 2 | Medium-slow |

### Batch Size Recommendations

- **Small batch**: 5-10 items (testing, prototyping)
- **Medium batch**: 10-30 items (campaigns, variations)
- **Large batch**: 30-100 items (bulk production)
- **Mega batch**: 100+ items (production runs with monitoring)

## Failure Handling in Batches

```
Generate 50 images, 2 fail:

├─ Detect failure (5min into batch)
├─ Immediate retry with same params
├─ If retry fails: mark as "needs manual"
├─ Continue with remaining 48
├─ Report: 48 success, 2 needs manual
└─ User decides: regenerate later or use alternate
```

## Performance Metrics

Track across batches:

```
Batch Performance Dashboard:
├─ Total time: 21min (goal: <30min)
├─ Success rate: 96% (goal: >95%)
├─ Avg quality score: 7.8/10 (goal: >7.5)
├─ Cost per image: $0.019 (goal: <$0.05)
├─ Model breakdown:
│  ├─ FLUX: 92% success, 62s avg
│  ├─ Soul: 88% success, 48s avg
│  └─ GPT-Image: 95% success, 32s avg
└─ Slowest step: seedance-v2 video generation
```

## Optimization Strategies

### 1. Model Selection

```
For 50 images, budget $1.00:
Option A: All FLUX → 50 images (expensive)
Option B: 25 FLUX + 25 Soul → better quality + cost
Option C: 10 FLUX + 20 Soul + 20 GPT → max volume

Choose based on: quality requirement vs budget
```

### 2. Prompt Engineering for Batches

```
Single template with variables:
"[STYLE] product photography of [PRODUCT], [LIGHTING], [BACKGROUND]"

Apply 50 products:
- [STYLE]: "modern minimalist"
- [LIGHTING]: "studio three-point"
- [BACKGROUND]: "white"

Results: Consistency + variation
```

### 3. Sequential Stages for Complex Workflows

```
Image generation → Scoring → Video creation → Effects → Final ranking
      ↓           ↓           ↓              ↓          ↓
   Parallel    Quick        Parallel      Parallel   Parallel
   (10 at 3x)  (1min)      (2-3 at a time) (2 at a time)
```

### 4. Cost vs Quality Trade-off

```
High quality, high cost:
├─ Use FLUX for all
├─ seedance-v2 for video (premium model)
└─ Manual curation of top results

Fast, lower cost:
├─ Use GPT-Image-2 + Soul blend
├─ kling-3-0 for video (faster)
└─ Auto-selection by quality score

Sweet spot (medium batch):
├─ 60% FLUX, 40% Soul for images
├─ seedance-v2 for final video
└─ Auto-filter by quality threshold
```

## Batch Monitoring

During execution, track:

```
Real-time dashboard:
├─ Progress: 28/50 complete (56%), 3 in progress
├─ Time elapsed: 12min, est. 8min remaining
├─ Success rate: 97% (1 retry pending)
├─ Avg quality: 7.6/10 (updating)
├─ Cost so far: $0.38 (est. total: $0.48)
└─ Slowest model: seedance-v2 (2.3min)
```

## Output Organization

Batches auto-organize:

```
outputs/
├─ batch_20250611_rhythmix_images/
│  ├─ images/ (50 files)
│  ├─ scores.json (quality data)
│  ├─ ranking.json (top 10)
│  └─ metadata.json (timestamps, models, prompts)
└─ batch_20250611_videos/
   ├─ videos/ (10 files)
   ├─ scores.json
   └─ metadata.json
```

## Advanced: Custom Batch Profiles

Save and reuse batch configs:

```
profile: "rhythmix_promo_50"
├─ Model: 50% FLUX, 50% Soul
├─ Batch size: 5 concurrent
├─ Quality gate: 7.5+
├─ Video follow-up: yes (top 3 images)
├─ Cost limit: $2.00
└─ Time limit: 30min
```

## Troubleshooting

**"Batches keep timing out at 30min"**
→ Reduce batch size or parallelize less aggressively
→ Split 50 into two 25-image batches

**"Success rate dropped to 88%"**
→ API rate limits hit
→ Queue off-peak hours or use lower-resource models
→ Monitor quota and throttle

**"Quality scores vary wildly between models"**
→ Scoring criteria may be model-specific
→ Adjust weights: FLUX gets different light/artifact weights than Soul

**"Cost ballooned to $5 for 50 images"**
→ Using too many expensive models (FLUX + seedance)
→ Switch to Soul + kling-3-0 blend
→ Pre-score images, only expensive models on top performers
