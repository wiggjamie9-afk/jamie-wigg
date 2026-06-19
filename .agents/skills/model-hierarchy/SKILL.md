# Model Hierarchy: Cost-Optimized Agent Routing

Cost-optimize AI agent operations by routing tasks to appropriate models based on complexity.

**Use this skill when:** 
- Deciding which model to use for a task
- Spawning sub-agents
- Considering cost efficiency
- The current model feels like overkill

**Triggers:** "model routing", "cost optimization", "which model", "too expensive", "spawn agent"

---

## Core Principle

**80% of agent tasks are janitorial.** File reads, status checks, formatting, simple Q&A. These don't need expensive models. Reserve premium models for problems that actually require deep reasoning.

## Model Tiers

### Tier 1: Cheap ($0.10-0.50/M tokens)

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| DeepSeek V3 | $0.14 | $0.28 | General routine work |
| GPT-4o-mini | $0.15 | $0.60 | Quick responses |
| Claude Haiku | $0.25 | $1.25 | Fast tool use |
| Gemini Flash | $0.075 | $0.30 | High volume |
| GLM 5 (Zhipu) | $0.11 | $0.44 | Routine + moderate text; 200K context; **text-only** |
| Kimi K2.5 (Moonshot) | $0.45 | $2.25 | Routine + moderate; 262K context; **multimodal** |

**Text-only models (e.g. GLM 5):** Do not use for any task that requires image input or vision — no photo analysis, screenshots, image-generation tools, or document/chart vision. Route to vision-capable model.

**Vision-capable Tier 1/2 (e.g. Kimi K2.5):** Use for routine or moderate tasks involving images — screenshots, photo analysis, docs, image-generation orchestration.

### Tier 2: Mid ($1-5/M tokens)

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| Claude Sonnet | $3.00 | $15.00 | Balanced performance |
| GPT-4o | $2.50 | $10.00 | Multimodal tasks |
| Gemini Pro | $1.25 | $5.00 | Long context |

### Tier 3: Premium ($10-75/M tokens)

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| Claude Opus | $15.00 | $75.00 | Complex reasoning |
| GPT-4.5 | $75.00 | $150.00 | Frontier tasks |
| o1 | $15.00 | $60.00 | Multi-step reasoning |
| o3-mini | $1.10 | $4.40 | Reasoning on budget |

## Task Classification

### ROUTINE → Tier 1

- File read/write operations
- Status checks and monitoring
- Simple lookups
- Formatting and restructuring
- List operations (filter, sort, transform)
- API calls with known parameters
- URL fetching and basic parsing

### MODERATE → Tier 2

- Code generation (standard patterns)
- Summarization and synthesis
- Draft writing
- Data analysis and transformation
- Tool orchestration
- Code review (non-security)
- Search and research tasks

### COMPLEX → Tier 3

- Novel problem solving
- Architecture and design decisions
- Security-sensitive code review
- Tasks where cheaper model already failed
- Ambiguous requirements needing interpretation
- Long-context reasoning (>50K tokens)
- Creative work requiring originality

## Decision Algorithm

```
function selectModel(task):
    # Vision override
    if task.requiresImageInput or task.requiresVision:
        return VISION_CAPABLE_MODEL  # not text-only
    
    # Escalation override
    if task.previousAttemptFailed:
        return nextTierUp(task.previousModel)
    
    # Explicit complexity signals
    if task.hasSignal("debug", "architect", "design", "security"):
        return TIER_3
    
    if task.hasSignal("write", "code", "summarize", "analyze"):
        return TIER_2
    
    # Default classification
    complexity = classifyTask(task)
    return TIER_MAP[complexity]
```

## Communication Patterns

**Downgrade suggestion:**
> "This looks like routine file work. Want me to spawn a sub-agent on DeepSeek for this? Same result, fraction of the cost."

**Upgrade request:**
> "I'm hitting the limits here. This needs deeper reasoning. Switching up."

**Explaining hierarchy:**
> "I'm running the heavy analysis on Sonnet while sub-agents fetch data on DeepSeek. Keeps costs down without sacrificing quality."

## Cost Impact

Assuming 100K tokens/day usage:

| Strategy | Monthly Cost | Split |
|----------|--------------|-------|
| Pure Opus | ~$225 | Max capability, max spend |
| Pure Sonnet | ~$45 | Good default for most work |
| Pure DeepSeek | ~$8 | Cheap but limited on hard problems |
| **Hierarchy (80/15/5)** | **~$19** | Best of all worlds |

**Result: 10x cost reduction vs pure premium, with equivalent quality on complex tasks.**

## Anti-Patterns

**DON'T:**
- Run heartbeats on Opus
- Use premium models for file I/O
- Keep expensive model when task is clearly routine
- Spawn sub-agents on premium models by default
- Use text-only models (GLM 5, etc.) for image/vision tasks

**DO:**
- Start mid-tier, adjust based on task
- Spawn helpers on cheapest viable model
- Escalate explicitly when stuck
- Track cost per task type to optimize further
