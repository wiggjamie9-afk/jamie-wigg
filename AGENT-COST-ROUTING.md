# Agent Cost Routing Guide

**Based on model-hierarchy skill:** Route 80% routine tasks to Tier 1 (Haiku/DeepSeek/Gemini Flash), 15% moderate to Tier 2 (Sonnet/GPT-4o), 5% complex to Tier 3 (Opus).

This document classifies all agent tasks across your branch by complexity and recommends cost-optimized model routing.

---

## Model Tiers (Quick Reference)

### Tier 1: Cheap ($0.10–0.50/M tokens)
- **Claude Haiku:** $0.25/$1.25 (input/output)
- **DeepSeek V3:** $0.14/$0.28
- **Gemini Flash:** $0.075/$0.30
- **Best for:** File reads, status checks, data retrieval, simple formatting, parsing

### Tier 2: Balanced ($1–5/M tokens)
- **Claude Sonnet:** $3.00/$15.00
- **GPT-4o:** $2.50/$10.00
- **Gemini Pro:** $1.25/$5.00
- **Best for:** Code generation, summarization, multi-step reasoning, synthesis, writing

### Tier 3: Premium ($10–75/M tokens)
- **Claude Opus:** $15.00/$75.00
- **GPT-4.5:** $75.00/$150.00
- **o1:** $15.00/$60.00
- **Best for:** Novel problem solving, architecture decisions, security code review, multi-step debugging

---

## Task Classification Matrix

### ROUTINE TASKS → Tier 1 (Haiku/Flash)

| Task | Current | Recommended | Reasoning | Est. Cost |
|------|---------|-------------|-----------|-----------|
| **HerdCheck: Fetch veterinary reference library** | Not impl. | Tier 1 | Pure data retrieval, no reasoning | $0.02 |
| **HerdCheck: Format scoring results JSON** | Not impl. | Tier 1 | Deterministic output formatting | $0.01 |
| **Studio: List available music tracks** | Not impl. | Tier 1 | File system scan, simple output | $0.01 |
| **Studio: Validate theme input** | Not impl. | Tier 1 | Regex + constraint check | $0.005 |
| **Reset: Fetch athlete's historical HRV data** | Not impl. | Tier 1 | Database query, return as-is | $0.02 |
| **TRENDING.md: Parse ProductHunt RSS** | Not impl. | Tier 1 | XML/JSON parsing, no synthesis | $0.05 |
| **Marketing: List all app launch-kit templates** | Not impl. | Tier 1 | File listing + metadata | $0.01 |
| **Codex: Fetch Schumann frequency reference** | Not impl. | Tier 1 | Static data lookup | $0.005 |

**Monthly Routine Tasks:** ~1,000 calls @ avg $0.02 = **~$20/month**

---

### MODERATE TASKS → Tier 2 (Sonnet/GPT-4o)

| Task | Current | Recommended | Reasoning | Est. Cost |
|------|---------|-------------|-----------|-----------|
| **HerdCheck: Analyze udder photo + scoring checklist** | Not impl. | Tier 2 | Multi-input synthesis (image + structured data) | $0.15 |
| **Studio: Generate 3 theme variants from track** | Not impl. | Tier 2 | Creative synthesis, conditional logic | $0.20 |
| **Reset: Synthesize 3-day recovery plan from metrics** | Not impl. | Tier 2 | Personalization + domain knowledge | $0.18 |
| **Codex: Generate coherence guidance from HRV** | Not impl. | Tier 2 | Numerology + biofeedback synthesis | $0.15 |
| **Marketing: Auto-draft 5-post Twitter thread** | Not impl. | Tier 2 | Copy writing + brand consistency | $0.12 |
| **sunny-bedtime-videos: Suggest scene sequence from story** | Not impl. | Tier 2 | Narrative reasoning, conditional branching | $0.20 |

**Monthly Moderate Tasks:** ~500 calls @ avg $0.17 = **~$85/month**

---

### COMPLEX TASKS → Tier 3 (Opus)

| Task | Current | Recommended | Reasoning | Est. Cost | Escalation Trigger |
|------|---------|-------------|-----------|-----------|-------------------|
| **HerdCheck: Multi-herd disease outbreak pattern matching** | Not impl. | Tier 3 | Cross-herd reasoning, veterinary inference | $0.80 | 3+ animals flagged in same week |
| **Studio: Auto-script 30s promo from track + brand brief** | Not impl. | Tier 3 | Multi-modal orchestration (audio + brand + narrative) | $0.50 | User requests "write full script" |
| **RHYTHMIX: Compose quarterly strategy brief from trend data** | Not impl. | Tier 3 | Business synthesis, forward-looking analysis | $0.60 | Quarterly review cycle |
| **Codex: Personalized biohacking protocol from full health history** | Not impl. | Tier 3 | Holistic synthesis, novel domain | $0.70 | User feedback: "plan didn't work" |

**Monthly Complex Tasks:** ~20 calls @ avg $0.65 = **~$13/month**

---

## Cost Routing Rules (Decision Tree)

```
Does this task require image/vision input?
  YES → Use vision-capable model (Kimi K2.5 for Tier 1; Claude/Gemini/GPT-4o for Tier 2+)
  NO → Continue

Is it a single-step operation (read, list, parse, format)?
  YES → Tier 1 (Haiku)
  NO → Continue

Does it involve generating creative output (code, copy, design)?
  YES → Tier 2 (Sonnet)
  NO → Continue

Is it multi-step reasoning or novel problem-solving?
  YES → Tier 2 (start), escalate to Tier 3 if cheaper model fails
  NO → Continue

Is it a business/strategic decision or security-sensitive?
  YES → Tier 3 (Opus)
  NO → Tier 2 (default for moderate tasks)
```

---

## Per-App Task Routing

### HerdCheck (Livestock Screening PWA)

| Agent Task | Classification | Model | Cost | Frequency |
|---|---|---|---|---|
| Fetch vet reference library | Routine | Tier 1 (Haiku) | $0.02 | 1×/week |
| Format scoring JSON | Routine | Tier 1 (Haiku) | $0.01 | per check |
| Analyze udder photo + checklist | Moderate | Tier 2 (Sonnet) | $0.15 | per check |
| Visual diagnosis synthesis | Moderate | Tier 2 (Sonnet) | $0.18 | per check |
| Escalate low-confidence cases | Complex | Tier 3 (Opus) | $0.50 | ~5% of checks |
| Multi-herd outbreak analysis | Complex | Tier 3 (Opus) | $0.80 | monthly/on-demand |

**Projected monthly cost (500 daily checks):**
- Tier 1: (500 reads + 500 formats) @ $0.015 avg = **$15**
- Tier 2: (500 moderate) @ $0.16 avg = **$80**
- Tier 3: (25 escalations) @ $0.65 avg = **$16**
- **Total HerdCheck: ~$111/month**

---

### STARLIGHTMIX Studio (Music Video Platform)

| Agent Task | Classification | Model | Cost | Frequency |
|---|---|---|---|---|
| List available themes | Routine | Tier 1 (Haiku) | $0.01 | per session |
| Validate user input | Routine | Tier 1 (Haiku) | $0.005 | per input |
| Generate 3 theme variants | Moderate | Tier 2 (Sonnet) | $0.20 | per track upload |
| Auto-script promo (full) | Complex | Tier 3 (Opus) | $0.50 | on-demand |
| Orchestrate multi-video cut | Complex | Tier 3 (Opus) | $0.40 | per project |

**Projected monthly cost (200 tracks uploaded, ~50 full scripts):**
- Tier 1: (200 reads + 200 validates) @ $0.01 avg = **$4**
- Tier 2: (200 theme variants) @ $0.20 = **$40**
- Tier 3: (50 scripts + 20 orchestrations) @ $0.45 avg = **$32**
- **Total Studio: ~$76/month**

---

### Reset (Recovery App for Sport)

| Agent Task | Classification | Model | Cost | Frequency |
|---|---|---|---|---|
| Fetch athlete HRV history | Routine | Tier 1 (Haiku) | $0.02 | per session |
| Synthesize recovery plan | Moderate | Tier 2 (Sonnet) | $0.18 | per day |
| Escalate poor adherence | Moderate | Tier 2 (Sonnet) | $0.20 | 10% of plans |

**Projected monthly cost (1K daily athletes, 70% daily plan requests):**
- Tier 1: (1K reads) @ $0.02 = **$20**
- Tier 2: (700 plans + 70 escalations) @ $0.19 avg = **$146**
- **Total Reset: ~$166/month**

---

### Codex of Reality (Wellness PWA)

| Agent Task | Classification | Model | Cost | Frequency |
|---|---|---|---|---|
| Fetch coherence baselines | Routine | Tier 1 (Haiku) | $0.02 | per session |
| Generate HRV-to-guidance | Moderate | Tier 2 (Sonnet) | $0.15 | per reading |
| Personalized biohack protocol | Complex | Tier 3 (Opus) | $0.70 | monthly/on-demand |

**Projected monthly cost (500 daily users, 80% daily readings):**
- Tier 1: (500 reads) @ $0.02 = **$10**
- Tier 2: (400 daily readings × 30) @ $0.15 = **$1,800** ← Watch this
- Tier 3: (100 protocols) @ $0.70 = **$70**
- **Total Codex: ~$1,880/month** ⚠️ **OPTIMIZE**

---

## Cost Optimization Strategies

### 1. Batch Similar Tasks (Tier 1)

**Example:** Instead of calling Tier 1 agent per athlete (1K calls):
```
Batch 100 athletes → 1 agent call → returns array of 100 results
Cost: $0.02 × 1 = $0.02 vs. $0.02 × 1K = $20
Savings: 99%
```

### 2. Cache Routine Results (Tier 1)

**Example:** Reference libraries (vet guidance, recovery templates) rarely change:
```
Cache for 24h → 1 Tier 1 call/day instead of per-session
Cost: $0.02 × 1 = $0.02/day vs. $0.02 × 100 sessions = $2/day
Savings: 99%
```

### 3. Escalate Only on Failure (Tier 2 → Tier 3)

**Example:** Recovery plans - start on Tier 2, only escalate if user feedback is negative:
```
Default: 700 × Tier 2 @ $0.18 = $126
Escalations (10%): 70 × Tier 3 @ $0.50 = $35
Total: $161/month vs. all Tier 3: $350/month
Savings: 54%
```

### 4. Spawn Sub-Agents on Tier 1 (Parallel Batch Processing)

**Example:** Marketing launch kits - generate 20 apps in parallel:
```
Sequential (Tier 2): 20 × $0.12 = $2.40
Parallel (spawn 20 Tier 1 agents): 20 × $0.01 = $0.20
Cost reduction: 92%
```

---

## Branch-Wide Cost Projection

**Assuming 100% adoption (all agents live):**

| System | Monthly Cost | Tier Mix |
|--------|-------------|----------|
| HerdCheck | ~$111 | 80% T1, 10% T2, 10% T3 |
| Studio | ~$76 | 50% T1, 50% T2 |
| Reset | ~$166 | 10% T1, 90% T2 |
| Codex | ~$1,880 ⚠️ | 10% T1, 80% T2, 10% T3 |
| Marketing | ~$20 | 100% T1 |
| RHYTHMIX (Ops) | ~$50 | 80% T1, 20% T2 |
| **TOTAL** | **~$2,303/month** | — |

**With optimization strategies (batching, caching, escalation gates):**
- Codex optimized: ~$200 (90% reduction via batching + caching)
- Reset optimized: ~$100 (40% reduction via escalation gates)
- **OPTIMIZED TOTAL: ~$580/month**

---

## Recommendation

1. **Ship Tier 1 agents first** (routine tasks) — zero risk, validated architecture
2. **Ship Tier 2 agents second** (moderate tasks) — watch cost, implement batching
3. **Ship Tier 3 agents last** (complex tasks) — only escalate on failure
4. **Monitor monthly:** Track cost per app, per task type. Adjust thresholds if spending creeps up.
5. **Codex specifically:** Implement caching + batching from day 1 (it's the cost outlier)

---

## Integration with /model-hierarchy Skill

When spawning agents, reference the routing decision tree:

```
from model_hierarchy import select_model

complexity = classify_task(user_request)
model = select_model(complexity)  # Returns Tier 1/2/3 model

if previous_attempt_failed and complexity == MODERATE:
    model = escalate(model)  # Tier 2 → Tier 3
```

This is already available in `.agents/skills/model-hierarchy/SKILL.md`. Use it.
