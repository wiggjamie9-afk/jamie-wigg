# Role-Based LLM Configuration for ECC Agents

**Status:** Ready for implementation  
**Relevant for:** ECC agent routing, cost optimization, multi-provider fallback chains  
**Configuration:** `.env` (see `.env.example`)

---

## Overview

Role-based LLM configuration allows ECC agents to automatically select the right model for each task based on:
- **Task complexity** (draft vs. production vs. reasoning-heavy)
- **Latency requirements** (user-facing vs. background tasks)
- **Cost constraints** (economy vs. premium)
- **Provider availability** (fallback chains for reliability)

Five canonical roles cover all agent workflows:

| Role | Use Case | Agents | Models |
|---|---|---|---|
| **DEFAULT** | High-stakes, production tasks | code-reviewer, security-reviewer, architect | Claude Opus, Sonnet |
| **ECONOMY** | Repetitive, cost-sensitive tasks | file processors, formatters, simple edits | Haiku, Groq Mixtral, Llama |
| **CHAT** | Conversational, lower-latency tasks | user interaction, brainstorming | Sonnet, Haiku |
| **NANO** | Ultra-lightweight, embedded tasks | quick classifications, summaries | Groq, Haiku |
| **DRAFT** | Rapid iteration, first-pass work | outline generation, draft code | Haiku, Groq |

---

## Configuration Format

Each role is an **ordered list of provider:model pairs**, comma-separated:

```bash
# Format: provider1:model1,provider2:model2,provider3:model3,...
DEFAULT_LLMS=anthropic:claude-opus-4-8,anthropic:claude-sonnet-4-6,openrouter:gpt-4

# Fallback behavior:
# 1. Agent requests task for role (e.g., "code review" = DEFAULT)
# 2. System tries DEFAULT_LLMS[0] (Opus) — check if credentials available
# 3. If unavailable, try DEFAULT_LLMS[1] (Sonnet)
# 4. If unavailable, try DEFAULT_LLMS[2] (OpenRouter GPT-4)
# 5. If all unavailable, return error
```

---

## Recommended Configurations

### Scenario A: Multi-Provider (Cost + Quality Balanced)

```bash
# Production: high-quality reasoning
DEFAULT_LLMS=anthropic:claude-opus-4-8,anthropic:claude-sonnet-4-6

# Conversation: fast, conversational
CHAT_LLMS=anthropic:claude-sonnet-4-6,anthropic:claude-haiku-4-5

# Economy: strict cost control
ECONOMY_LLMS=anthropic:claude-haiku-4-5,groq:mixtral-8x7b-32768

# Nano: speed above all
NANO_LLMS=groq:mixtral-8x7b-32768,anthropic:claude-haiku-4-5

# Draft: rapid iteration
DRAFT_LLMS=anthropic:claude-haiku-4-5,groq:mixtral-8x7b-32768
```

**Cost profile:** ~$50–200/month (Haiku-heavy, Groq free tier)

### Scenario B: Claude-Only (Simplicity + Quality)

```bash
DEFAULT_LLMS=anthropic:claude-opus-4-8,anthropic:claude-sonnet-4-6
CHAT_LLMS=anthropic:claude-sonnet-4-6,anthropic:claude-haiku-4-5
ECONOMY_LLMS=anthropic:claude-haiku-4-5
NANO_LLMS=anthropic:claude-haiku-4-5
DRAFT_LLMS=anthropic:claude-haiku-4-5
```

**Cost profile:** Single API key, predictable billing, no provider switching overhead.

### Scenario C: OpenRouter (Widest Model Access)

```bash
DEFAULT_LLMS=openrouter:openai/gpt-4-turbo,openrouter:anthropic/claude-opus
CHAT_LLMS=openrouter:anthropic/claude-sonnet,openrouter:meta-llama/llama-3-8b
ECONOMY_LLMS=openrouter:meta-llama/llama-2-7b,openrouter:mistralai/mistral-7b
NANO_LLMS=openrouter:meta-llama/llama-2-7b
DRAFT_LLMS=openrouter:meta-llama/llama-2-7b
```

**Cost profile:** Aggregate pricing, wide model variety, single unified API key.

---

## ECC Agent Role Mapping

How ECC's 64 agents map to roles:

### DEFAULT (High-Reasoning Tasks)
- **code-reviewer** — code quality, patterns, best practices
- **security-reviewer** — vulnerability analysis, OWASP checks
- **architect** — system design, architectural decisions
- **planner** — feature planning, spec generation
- **build-error-resolver** — complex build/CI failures

Use: `Claude Opus` or `Sonnet` (deep reasoning, 0-shot accuracy)

### CHAT (Conversational, Interactive)
- **user-facing agents** — anything users see in real-time
- **brainstorming agents** — creative ideation, exploration

Use: `Sonnet` or `Haiku` (conversational, fast latency)

### ECONOMY (Repetitive, Mechanical)
- **doc-updater** — file reads, formatting, simple edits
- **refactor-cleaner** — dead code removal, simple refactoring
- **test-writer** — boilerplate test generation
- **changelog** — release note composition from commits

Use: `Haiku` or `Groq Mixtral` (fast, cost-efficient)

### NANO (Quick Classifications)
- **triage** — issue/PR label classification
- **spam-detector** — comment filtering
- **simple summarizer** — quick summaries

Use: `Haiku` or `Groq` (ultra-fast, embedded)

### DRAFT (First-Pass Generation)
- **outline-generator** — quick outlines for specs
- **first-pass-implementer** — rapid prototypes
- **brainstorm-note-taker** — quick notes from discussions

Use: `Haiku` (fast iteration, throw-away quality acceptable)

---

## Implementation in ECC

When agents delegate tasks, they specify the role:

```javascript
// In ECC agent invocation
const agent = new EccAgent({
  type: 'code-reviewer',      // Agent type
  role: 'DEFAULT',             // ← Select LLM role
  task: 'Review PR #2790',
  // System automatically selects from DEFAULT_LLMS based on availability
});

// Or for cost-sensitive batch processing
const summaries = await batchSummarize(documents, {
  role: 'NANO',  // Use ultra-fast models
});
```

System flow:

```
Agent specifies role (DEFAULT, ECONOMY, CHAT, NANO, DRAFT)
        ↓
System loads role list (e.g., DEFAULT_LLMS)
        ↓
Try providers in order:
  1. Check if credentials available (env var set)
  2. Check if provider API is accessible
  3. If both OK → use this model
  4. If not → try next provider in list
        ↓
Execute task with selected model
```

---

## Credential Management

Only include providers you actually use:

```bash
# Minimal: only Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Multi-provider: Claude + Groq + OpenRouter
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk-...
OPENROUTER_API_KEY=sk-or-...
```

**Best practice:** Use `.env.local` (gitignored) for credentials, never commit keys.

```bash
# .gitignore already includes .env, but explicit is better:
echo "
.env
.env.local
.env.*.local
" >> .gitignore
```

---

## Cost Optimization Strategies

### 1. **Tiered Task Routing** (30–50% savings)

Assign roles based on task criticality:

```
High-stakes (security, architecture) → DEFAULT (Opus)
Regular development → CHAT (Sonnet) or ECONOMY (Haiku)
Routine tasks (formatting, summarization) → ECONOMY (Haiku)
Quick classifications → NANO (Groq)
```

### 2. **Fallback Chains** (15–25% savings)

Default to cheaper models, fall back to expensive only if needed:

```bash
ECONOMY_LLMS=groq:mixtral-8x7b-32768,anthropic:claude-haiku-4-5
# Try Groq first (free), fall back to Haiku (paid) if Groq unavailable
```

### 3. **Rate Limiting** (10–15% savings)

Batch requests during off-peak hours:

```bash
# Off-peak processing: use NANO (ultra-cheap)
# Interactive: use CHAT (balance speed + cost)
```

---

## Monitoring & Observability

Track which models are being used:

```bash
# Check active role distributions
grep -r "role:" logs/ | grep -o "role: [A-Z]*" | sort | uniq -c

# Monitor cost by role
jq '.[] | {role, model, cost, timestamp}' logs/agent-invocations.jsonl | \
  group_by(.role) | map({role: .[0].role, total_cost: (map(.cost) | add)})
```

---

## Migration from Env Vars to Role-Based Config

If you have existing env vars (legacy approach):

```bash
# Legacy (single-model-per-provider):
OPENAI_API_KEY=...
CLAUDE_API_KEY=...
DEFAULT_LLM=claude

# New (role-based):
ANTHROPIC_API_KEY=...
OPENROUTER_API_KEY=...
DEFAULT_LLMS=anthropic:claude-opus-4-8,openrouter:gpt-4
```

**Migration path:**
1. Fill in `.env` with new role-based lists (copy from `.env.example`)
2. Test with `ECONOMY_LLMS` on non-critical agents first
3. Roll out to `DEFAULT_LLMS` once stable
4. Remove legacy env vars

---

## Next Steps

1. **Configure `.env`** — Copy defaults from `.env.example`, customize for your providers
2. **Set credentials** — Only for providers you actually use
3. **Test with economy agents** — Verify fallback chains work
4. **Monitor costs** — Track which roles are being invoked
5. **Iterate** — Adjust role assignments based on performance + cost data

---

## Examples

### Quick Test: Verify Config Loads

```bash
# Check that all required credentials are present
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()

roles = ['DEFAULT', 'ECONOMY', 'CHAT', 'NANO', 'DRAFT']
for role in roles:
    models = os.getenv(f'{role}_LLMS', '').split(',')
    print(f'{role}: {[m.strip() for m in models]}')
"
```

### Agent Usage: Specify Role

```python
# In Claude Code / ECC agent
from ecc.agent import Agent

# Production task → use DEFAULT
reviewer = Agent(type='code-reviewer', role='DEFAULT')

# Rapid iteration → use DRAFT
outline = Agent(type='planner', role='DRAFT')

# Cost-sensitive batch → use ECONOMY
docs = [doc1, doc2, doc3, ...]
summaries = batch_task(docs, role='ECONOMY')
```

---

**Role-based LLM configuration is now ready. Configure your `.env` and start routing agents intelligently.**
