---
name: rhythmix-content-orchestrator
description: Master orchestrator for coordinating 70+ generation skills into coherent RHYTHMIX workflows
---

# RHYTHMIX Content Orchestrator

Intelligent workflow engine that chains image generation, video production, music creation, and effects into production-ready content pipelines.

## When to use

- Creating multi-asset campaigns (cover + track + promo video + landing page)
- Scaling from 1 concept to 10 variations with auto-selection
- Complex promos requiring image → video → effects → analysis → iteration
- A/B testing creative variations at scale
- Recovering from generation failures automatically

## Core Workflows

### Workflow 1: Smart Video Production (Image → Video → Effects)

```
1. Generate hero image (FLUX or Soul)
   └─ quality check: lighting, composition, brand alignment
   
2. If quality ≥ 8/10, proceed to video:
   └─ Choose model: seedance-v2 (premium) vs kling-3-0 (fast)
   └─ Apply motion: "smooth zoom, cinematic reveal"
   └─ Quality check: smoothness, consistency, duration
   
3. If video quality ≥ 8/10, apply effects:
   └─ Add music (elevenlabs or ai-music)
   └─ Add overlays/text (runcomfy-cli)
   └─ Final quality check: sync, timing, brand
   
4. On failure at any step:
   └─ Regenerate with adjusted params
   └─ Try alternate model if available
   └─ Escalate to manual review if 3+ retries fail
```

### Workflow 2: Batch Generation with Auto-Selection

```
1. Generate 10 concept variations from single brief
   └─ Models: FLUX + Soul + Flux-Kontext
   └─ Parallel execution
   
2. Score all 10 automatically:
   └─ Lighting quality (1-10)
   └─ Composition (1-10)
   └─ Brand alignment (1-10)
   └─ Technical clarity (1-10)
   └─ Overall score: avg of above
   
3. Auto-select top 3 (score ≥ 8)
   
4. Produce videos for top 3:
   └─ Parallel generation with seedance-v2
   
5. Final ranking:
   └─ Motion quality, audio sync, impact
   └─ Return: top video + runner-ups + analysis
```

### Workflow 3: A/B Testing Prompts

```
1. User provides: brief + hypothesis (e.g., "serif fonts > sans serif")

2. Generate A variant:
   └─ "Modern serif typeface, elegant, minimal"
   └─ 5 images in parallel
   
3. Generate B variant:
   └─ "Clean sans-serif, bold, high-contrast"
   └─ 5 images in parallel
   
4. Score both sets:
   └─ Apply A/B criteria (brand fit, legibility, impact)
   
5. Report winner + insights:
   └─ "A performs better on brand alignment (+2.3 pts)"
   └─ Recommend applying A's characteristics to next batch
```

### Workflow 4: Smart Error Recovery

```
On any generation failure:

1. Categorize error:
   └─ Timeout → queue for retry (lower priority)
   └─ Invalid params → adjust + retry (high priority)
   └─ API limit → wait + retry
   └─ Quality fail → try alternate model
   
2. If primary model fails:
   └─ seedance-v2 fails → try kling-3-0
   └─ FLUX fails → try gpt-image-2
   └─ Soul fails → try flux-kontext
   
3. Track success rates:
   └─ "seedance-v2: 92% success, 2.3min avg time"
   └─ "kling-3-0: 98% success, 1.1min avg time"
   
4. After 3 failures → escalate:
   └─ Notify user with debug info
   └─ Suggest manual prompt adjustment
   └─ Offer alternate workflow
```

## Usage Examples

### Example 1: Create 10 hero images, pick best, make video

```
Ask Claude:
"Use rhythmix-content-orchestrator to:
1. Generate 10 hero images for 'summer energy' theme
2. Auto-score and pick top 3
3. Create videos for all 3
4. Rank videos by impact
5. Return winning video + metrics"

Claude will:
├─ Generate 10 in parallel (2min)
├─ Score all (1min)
├─ Create 3 videos in parallel (9min)
├─ Final ranking (1min)
└─ Return: top video + analytics + alternative videos
```

### Example 2: A/B test color palettes

```
Ask Claude:
"Use rhythmix-content-orchestrator for A/B testing:
A: Vibrant neons (hot pink, electric blue, cyber yellow)
B: Soft pastels (blush, sage, pearl)
Generate 8 images per variant, score on 'brand energy'
recommendation: which palette wins?"

Claude will:
├─ 8 images × 2 variants (4min)
├─ Score on energy dimension
└─ Return: Winner + 'B has +1.2pts on warmth but A has +2.1pts on energy'
```

### Example 3: Batch with intelligent recovery

```
Ask Claude:
"Generate 50 product hero images for e-commerce
Use rhythmix-content-orchestrator:
- If any generation fails, retry with alternate model
- Auto-detect and reject blurry/low-quality outputs
- Return only images scoring ≥ 7/10
- Report: success rate, avg quality score, failed examples"

Claude will:
├─ 50 generations in smart batches
├─ Auto-retry failures (2× each)
├─ Filter by quality
└─ Return: ~48 images (96% success) + metrics
```

## Integration Points

### With existing skills:
- **Image generation**: FLUX, Soul, Flux-Kontext, GPT-Image-2
- **Video generation**: seedance-v2, kling-3-0, image-to-video
- **Effects**: video-extend, video-inpainting, video-outpainting, lipsync
- **Music**: elevenlabs-music-generation, ai-music
- **Analysis**: caveman (explain results), diagnose (troubleshoot)

### With STARLIGHTMIX Studio:
- Pre-generate hero images for music videos
- Batch-score generated videos for quality gates
- Auto-retry failed generations
- Track generation success metrics

### With HyperFrames:
- Generate base images
- Create video segments
- Compose into final promo
- Validate output quality before publish

## Quality Scoring Criteria

### For images:
- Lighting quality (0-10): brightness, contrast, shadows
- Composition (0-10): rule of thirds, balance, focus
- Brand alignment (0-10): color palette, aesthetic match
- Technical clarity (0-10): sharpness, artifacts, color accuracy
- **Overall = avg of above**

### For videos:
- Motion smoothness (0-10): no jitter, fluid panning
- Consistency (0-10): frame continuity, color consistency
- Audio sync (0-10): music/narration timing
- Duration accuracy (0-10): matches expected length
- Impact (0-10): emotional resonance, cinematography
- **Overall = avg of above**

## Error Recovery Strategy

| Error Type | Immediate Action | Fallback | Max Retries |
|---|---|---|---|
| Timeout | Wait 30s, retry | Try smaller params | 2 |
| Invalid params | Adjust + retry | Use template params | 1 |
| Rate limit | Queue for later | Switch to free tier | 3 |
| Quality fail | Regenerate | Try alternate model | 2 |
| Model unavailable | Try next model | Manual escalation | 1 |

## Performance Metrics Tracked

- **Generation speed**: avg time per image/video by model
- **Success rate**: % completed / total requested
- **Quality distribution**: histogram of scores
- **Cost efficiency**: tokens/credits per successful output
- **Model performance**: ranking by speed, success, quality
- **Failure patterns**: common errors and their frequency

## Best Practices

1. **Start small**: Test workflow on 3 images before scaling to 50
2. **Set quality gates**: Define minimum acceptable score (usually 7/10)
3. **Use parallelization**: Generate multiple variations simultaneously
4. **Monitor costs**: Track token usage and generation credits
5. **Iterate prompts**: Use A/B results to refine next batch
6. **Fallback models**: Always have 2+ model options available
7. **Quality checkpoints**: Validate at each stage before proceeding

## Advanced: Custom Scoring Rules

Define custom scoring for your brand:

```
For RHYTHMIX promos:
- Color saturation: +2pts if matches brand palette
- Motion energy: +1.5pts per FPS of movement
- Audio sync: +2pts if perfectly synced
- Emotional impact: +2pts if evokes excitement/connection
- Technical: -1pt per visible artifact
```

## Troubleshooting

**"Top 3 images all scored 6/10"**
→ Prompt too vague. Use more specific descriptors.
→ Try: "modern, minimal, symmetrical" instead of "cool"

**"Videos keep timing out"**
→ seedance-v2 is slow. Switch to kling-3-0.
→ Or split into shorter durations.

**"Quality scores fluctuate wildly"**
→ Scoring criteria may be too subjective.
→ Define numeric thresholds (e.g., "brightness > 150" not "well-lit")

**"All generated images look similar"**
→ Add more variation to prompt.
→ Use different base models (Soul vs FLUX).
→ Increase guidance/creativity parameters.
