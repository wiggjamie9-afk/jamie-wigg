---
name: resilient-generation-engine
description: Fault-tolerant generation with automatic retries, fallbacks, and error recovery
---

# Resilient Generation Engine

Keep production pipelines running even when individual generation tasks fail. Automatic error recovery with smart retries and intelligent fallbacks.

## When to use

- Generating 50+ items; expect some failures
- Can't manually babysit batch jobs
- Need to recover gracefully without losing progress
- Want to know exactly why failures happened
- Need to scale to 500+ items without interruption

## Core Capabilities

### Automatic Retry Logic

```
Task: Generate hero image with FLUX

Attempt 1: FLUX fails (timeout)
└─ Wait 30s, retry same request

Attempt 2: FLUX fails (rate limit)
└─ Wait 60s, retry

Attempt 3: FLUX fails (API down)
└─ Try fallback: Soul model
└─ Success → log "recovered via fallback"

If all attempts fail:
└─ Queue for manual review
└─ Provide user with debug info
```

### Model Fallback Chain

```
Primary chain (best quality):
└─ FLUX (60s) → if fails, try next

Secondary:
└─ Soul (45s) → if fails, try next

Tertiary (fast fallback):
└─ GPT-Image-2 (30s) → if fails, escalate
```

### Error Categorization

```
Error type determines response:

TIMEOUT (5+ min wait expected)
├─ Action: Queue, retry later
├─ Continue with other tasks
└─ Retry window: 1 hour later

RATE LIMIT (quota exceeded)
├─ Action: Switch to lower-cost model
├─ Or wait 30min
└─ Don't retry immediately

INVALID PARAMS (bad request)
├─ Action: Fix params, retry once
├─ If still fails: escalate
└─ Don't retry 10× with same params

API ERROR (500, 502, etc)
├─ Action: Wait 60s, retry once
├─ If persists: fallback model
└─ Track API reliability

QUALITY FAIL (output too low)
├─ Action: Regenerate with adjusted params
├─ Increase guidance, change prompt
└─ Try alternate model
```

## Usage Examples

### Example 1: Batch with Auto-Recovery

```
Ask Claude:
"Generate 50 product images with resilient-generation-engine:
Model chain: FLUX → Soul → GPT-Image-2
Fallback if quality <7: regenerate with FLUX + higher guidance
Retry limit: 2 per model
Report: success rate, failed items, recovery actions"

Results:
├─ 50 requested, 48 succeed immediately
├─ 2 fail on FLUX (timeout)
├─ 2 retry automatically → success
├─ Final: 50/50 (100%)
├─ Recovery actions: 2 auto-retried, both succeeded
└─ Quality: avg 7.8/10
```

### Example 2: Long-Running Batch

```
Ask Claude:
"Generate 100 images for STARLIGHTMIX product catalog
Use resilient-generation-engine with:
- Concurrency: 3 (avoid rate limits)
- Retry limit: 3 per task
- Fallback: FLUX → Soul → GPT-Image
- Time estimate: 45min
- Report progress every 20 images"

Progress:
├─ 0-20: 20/20 (100%), avg 7.9/10
├─ 20-40: 19/20 (95%), 1 retry needed, avg 7.7/10
├─ 40-60: 20/20 (100%), 1 rate limit triggered, switched models, avg 7.6/10
├─ 60-80: 18/20 (90%), 2 failed, queued for manual, avg 7.5/10
├─ 80-100: 20/20 (100%), avg 7.8/10
│
Final:
├─ Total: 97/100 (97%)
├─ Auto-recovered: 3 items
├─ Needs manual: 2 items
├─ Time elapsed: 42min (3min ahead of estimate)
└─ Cost: $1.45
```

### Example 3: Video Generation with Recovery

```
Ask Claude:
"Generate 10 videos with resilient-generation-engine:
Model chain: seedance-v2 → kling-3-0
Base image: [provided]
Motion: 'smooth zoom, cinematic'
Retry: up to 3x per video
Fallback params: reduce duration if timeout
Report: each video status + recovery actions"

Results:
├─ Video 1: Success first try (2.2min)
├─ Video 2: Timeout on seedance → retry kling (1.8min) ✓
├─ Video 3: Success first try (2.1min)
├─ Video 4: Timeout → reduce duration → success (1.4min) ✓
├─ Video 5-10: All success on first try
│
Final:
├─ 10/10 succeed (100%)
├─ Recoveries: 2 (kling fallback, duration reduce)
├─ Total time: 18.5min (vs 25min without recovery)
└─ Quality: all scored 8+
```

## Error Recovery Strategies

### Strategy 1: Exponential Backoff

```
Retry failures with increasing wait:

Attempt 1: Retry immediately (0s wait)
Attempt 2: Wait 5s, retry
Attempt 3: Wait 15s, retry
Attempt 4: Wait 60s, retry
Attempt 5: Escalate to manual

Benefit: Handles transient errors, avoids hammering API
```

### Strategy 2: Model Degradation

```
Quality > Speed > Cost progression:

If FLUX timeout:
└─ Try Soul (nearly as good, faster)

If Soul timeout:
└─ Try GPT-Image-2 (good quality, very fast)

If GPT-Image fails:
└─ User gets error + options (wait, manual, skip)

Benefit: Keep pipeline moving while preserving quality
```

### Strategy 3: Request Mutation

```
If generation fails, adjust request:

Original: "luxury watch product photography, 4K"
└─ Fails: too many constraints

Retry 1: "luxury watch product photography"
└─ Remove quality hint

Retry 2: "watch product photography, luxury aesthetic"
└─ Simplify

Retry 3: "gold watch"
└─ Minimal viable prompt

Benefit: Often succeeds by removing constraints
```

### Strategy 4: Graceful Degradation

```
User requests 1080p video:
├─ seedance-v2 fails (too high quality)
├─ Try 720p version
├─ If succeeds: upscale to 1080p
├─ If fails: deliver 720p anyway

User gets: Acceptable output instead of nothing
Cost: Slightly lower quality but 100% completion
```

## Error Monitoring

Track failure patterns:

```
Error Frequency Report:
├─ FLUX timeout: 12% of requests
├─ Soul rate limit: 3% of requests
├─ Quality too low: 8% of requests
├─ API 502 errors: 2% of requests
└─ Other: <1%

Recovery Success Rates:
├─ Retry same model: 85% success
├─ Switch to fallback: 92% success
├─ Reduce constraints: 78% success
├─ Increase wait time: 88% success

Best recovery: Model switch (92%)
Action: Use more frequently as primary fallback
```

## Configuration

### For Fast Turnaround (10-20 images)

```
Retry limit: 2
Fallback chain: primary → secondary only
Timeout: 5min per model
Skip manual review, return partial results
```

### For Production Batch (50-100 images)

```
Retry limit: 3
Fallback chain: 3 models deep
Timeout: 10min per model
Queue failures for manual review
Wait for completion unless timeout
```

### For Mega Batch (100+ images)

```
Retry limit: 3
Fallback chain: all available models
Timeout: 15min per model
Concurrency: 2-3 (avoid rate limits)
Report progress every 20 items
Accept 95%+ completion, queue rest
```

## Failure Escalation

```
1 failure → Auto-retry 2×
   ↓
3 failures → Switch model + 1 retry
   ↓
4 failures → Human escalation
            └─ Provide: original params, error log, alternatives
            └─ User decides: try manual, skip, adjust & retry
```

## Integration with Orchestrator

```
Orchestrator calls resilient-generation-engine:

Generate image
   ├─ Success → Score → Proceed to video
   └─ Fail → Resilient-generation-engine handles
            ├─ Retry 3×
            ├─ Try fallback model
            ├─ If still fails → queue
            └─ Log error for analysis
            
Result: Robust pipeline that doesn't break on single failures
```

## Logging & Debugging

Each task generates detailed log:

```
Task ID: gen_2025_06_11_001
Status: SUCCESS_AFTER_RETRY

Attempts:
├─ 1: FLUX → TIMEOUT (exceeded 5min)
├─ 2: FLUX → TIMEOUT (exceeded 5min)
└─ 3: Soul → SUCCESS (2.1min)

Fallback: Switched to Soul after 2 FLUX timeouts
Recovery: Auto-recovery via model switch
Time: 12.3min (vs 5min first try if successful)
Quality: 8/10

Insights:
├─ FLUX unstable today (multiple timeouts)
├─ Soul more reliable (2.1min consistent)
└─ Recommendation: Use Soul as primary for this user
```

## Advanced: Learning Fallbacks

Over time, improve fallback strategy:

```
Week 1: FLUX → Soul → GPT-Image (default chain)
Success rate: 94%

Week 2: Track errors, update chain:
├─ FLUX: 88% success, 2.3 min
├─ Soul: 96% success, 1.8 min
├─ GPT-Image: 92% success, 0.9 min
└─ New optimal: Soul → FLUX → GPT-Image

Week 3: New chain in place
Success rate: 97% (improvement!)
Avg time: 1.5 min (faster!)
```

## Troubleshooting

**"Still getting timeouts despite retries"**
→ Model is overwhelmed
→ Reduce concurrency (3 → 2 parallel)
→ Increase retry wait time (30s → 60s)
→ Switch to faster model (FLUX → Soul)

**"Fallback model produces lower quality"**
→ That's the tradeoff (quality vs reliability)
→ Accept 7/10 instead of 8/10, or wait for primary model
→ Use quality threshold to decide: if <7, escalate

**"Same error repeats on retries"**
→ Retries alone won't fix it
→ Try different model, adjust params, or escalate
→ Log error as systematic issue (not transient)

**"Costs increased due to retries"**
→ Expected: retries use additional credits
→ Optimize: reduce concurrency to avoid rate limits
→ Or: use cheaper fallback models
