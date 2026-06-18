---
name: nexus
description: >-
  Master orchestrator for the entire jamie-wigg / RHYTHMIX ecosystem. The single
  front door — invoke with `/nexus <anything you want>` and it routes your request
  to the right model, tool, skill, or pipeline, chaining several when needed, then
  executes end-to-end. Use NEXUS whenever you want an outcome without having to
  remember which specific tool or skill does the job: creating promos/videos/carousels,
  researching, building sites/apps/specs, generating art, securing/auditing, or
  optimizing cost/context. NEXUS knows the full inventory (7 models, 17+ tools,
  850+ skills, the HyperFrames video pipeline, Nucleus, and ruflo swarm) and picks
  the path for you.
---

# NEXUS — Ecosystem Orchestrator

NEXUS is the one command that fronts the entire ecosystem. The user types
`/nexus <request>` in plain language. You (Claude) interpret the intent, route it
to the right capability or chain of capabilities, run the job, verify the result,
and report back. The user should **never** need to name a specific tool — that's
NEXUS's job.

## Operating Loop (every invocation)

1. **Route** — Classify the request into one or more domains (Create, Research,
   Build/Ship, Secure, Optimize). Map to the specific capabilities in the tables
   below. If genuinely ambiguous, ask ONE clarifying question; otherwise proceed
   with the obvious interpretation and state your assumption.
2. **Plan** — If the job needs more than one capability, lay out the chain
   (e.g. research → script → render → publish). For 2+ independent sub-tasks,
   fan out with parallel `Agent` calls (see `/dispatching-parallel-agents`).
3. **Execute** — Invoke the skills/tools/models. Prefer existing skills and the
   knowledge base over re-deriving anything.
4. **Verify** — Check the output actually satisfies the request
   (`/verification-before-completion`). For code, run lint/type-check/tests.
5. **Report** — Tell the user what was produced, where it lives, and what (if
   anything) needs their approval before an outward step.

## Source of Truth

Before reasoning about any capability, the canonical inventory is:

- **`knowledge/INDEX.md`** — master index of every model, tool, pattern, reference.
- **`knowledge/models/`** — model deep-dives (Kimi, MiniMax, SkyReels).
- **`knowledge/tools/`** — tool references (gateways, research agents, creative, security).
- **`knowledge/patterns/`** — workflow patterns (scheduled agent loops).
- **`CLAUDE.md`** — repo layout, conventions, MCP servers, skill registry.
- **`CONTEXT.md` + `docs/adr/`** — domain language and architectural decisions
  (e.g. ADR-0001: HyperFrames over Remotion for Promos — respect it).

When in doubt about whether a capability exists or how it's wired, **read the
relevant `knowledge/` file first**.

## Capability Map — Intent → Route

### 🎨 CREATE (video, image, audio, carousels, art)

| If the user wants… | Route to |
|---|---|
| A full RHYTHMIX promo (script→TTS→composition→render→downloads) | `rhythmix-author` skill or `/rhythmix-new` |
| A single video composition (HTML/GSAP) | `hyperframes` / `hyperframes-cli` skills |
| Cinematic human/short video | SkyReels V1 (`knowledge/models/skyreels-v1.md`) — hosted/Replicate |
| Long-form / infinite-length video | SkyReels V2 (`skyreels-v2.md`) — hosted |
| Reference-to-video / talking avatar | SkyReels V3 (`skyreels-v3.md`) — apifree.ai |
| Image generation / illusion brand frames | `replicate` skill (FLUX) or KREA (`krea.md`) |
| Math / explainer animation | KimiK2Manim (`kimik2manim.md`) → render |
| Social carousel (multi-slide) | `carousel-generation` skill (`carousel-generator.md`) |
| Generative / algorithmic art | `algorithmic-art` skill + p5.js (`p5js-generative-art.md`) |
| Music / voice / TTS | `creative-stack` MCP, Kokoro, ElevenLabs, MiniMax MCP |
| One-shot "just make me X asset" | `/dream <description>` (auto-routes modality) |
| Full launch (cover+track+video+landing in parallel) | `/album-launch <brief>` |

### 🔎 RESEARCH (web, facts, competitive intel)

| If the user wants… | Route to |
|---|---|
| Deep multi-source cited report | `deep-research` skill |
| Quick web search + synthesis | pi-perplexity (`pi-perplexity.md`) or MindSearch (`mindsearch.md`) |
| Hard multi-step reasoning / hierarchical research | MiroFlow (`miroflow.md`) |
| Current library/API docs | Context7 MCP (always prefer over training knowledge) |
| Competitive teardown | `competitive-teardown` skill |

### 🏗️ BUILD / SHIP (sites, apps, specs, code)

| If the user wants… | Route to |
|---|---|
| A landing page / microsite | `/site-build <brief>` (RHYTHMIX: `/rhythmix-site`) |
| A single site stage | `/site-sitemap`, `/site-wireframe`, `/site-styleguide`, `/site-design` |
| Plan a feature with a spec | `/spec-quick` → `/spec-analyze` → `/spec-run` |
| RHYTHMIX campaign spec | `/rhythmix-spec <brief>` |
| Design → code from Figma | Framelink MCP (`framelink-mcp-figma.md`) |
| Production UI (no generic AI look) | `frontend-design` skill |
| Scaffold a SaaS | `saas-scaffolder` skill |
| **A state-of-the-art iOS / Android app (2026 style)** | **App Factory pipeline** (`patterns/app-factory-2026.md`) — Capacitor hybrid (default) / PWA / native; Liquid Glass (Apple) + Material 3 Expressive (Google); spec→design→build→verify→package→ship |
| Implement a planned spec in parallel | `/spec-run` (waves of isolated Agents) |
| Build/verify the app runs | `run` / `verify` skills |
| Multi-agent swarm execution | ruflo swarm/hive-mind MCP; Kimi K2.6 as runtime |

### 🔒 SECURE (audit, pentest, detect, harden)

| If the user wants… | Route to |
|---|---|
| Audit `.claude/` configs | AgentShield (`agentshield.md`) + `docs/security/agentshield-findings.md` |
| Review a code diff | `code-review` / `security-review` skills |
| Pentest / detection / forensics | the relevant `performing-*` / `detecting-*` / `hunting-*` security skills |
| Secrets / env management | `env-secrets-manager` skill |
| Dependency / supply-chain audit | `dependency-auditor`, `analyzing-sbom-for-supply-chain-vulnerabilities` |

> Security skills are dual-use — only run for the user's own authorized assets
> (Studio workers, license endpoint, this repo). Refuse out-of-scope targeting.

### ⚡ OPTIMIZE (cost, context, config, ops)

| If the user wants… | Route to |
|---|---|
| Cut context / token cost | Headroom (`headroom.md`) — local dev box, not sandbox |
| Manage AI-tool configs across machines | CC Switch (`cc-switch.md`) — official channels only |
| Free/alternate LLM access | GPT4Free (`gpt4free.md`), OpenClaw Zero Token (`openclaw-zero-token.md`) |
| Long-context reasoning (whole repo/KB) | MiniMax-01 4M ctx (`minimax-01.md`) or Claude — hosted |
| Recurring scheduled job | `loop` skill + Scheduled Agent Loops pattern (`scheduled-agent-loops.md`) |
| LLM cost governance | `llm-cost-optimizer`, `prompt-governance` skills |

## Chaining Recipes (multi-capability jobs)

NEXUS shines when one request needs several capabilities. Common chains:

- **"Promo + carousel for the new track"**
  `rhythmix-author` (script→TTS→composition→render) → `carousel-generation` →
  update `downloads.html`.
- **"Research X then turn it into a landing page"**
  `deep-research` / pi-perplexity → distill brief → `/site-build`.
- **"Idea → shipped feature"**
  `/spec-quick` → `/spec-analyze` → `/spec-run` (parallel) → `verify` →
  report (offer PR only if the user asks).
- **"Full launch"**
  `/album-launch` (parallel: cover art + track + 60s video + landing section).
- **"Animated explainer"**
  Step 3.7 Flash `flash_episode_brief` → KimiK2Manim → render → HyperFrames composite.

## Guardrails (always)

- **GPU reality** — This sandbox has no GPU. Route heavyweight models (SkyReels,
  MiniMax self-host, InternLM local) to **hosted API / Replicate / rented GPU**.
  Never attempt local inference of large models here.
- **Outward / irreversible actions** — Publishing, sending, deploying, spending,
  deleting, or anything touching production: **pause and confirm with the user
  first**, then proceed. Approval in one context doesn't carry to the next.
- **Branch discipline** — Develop on the designated feature branch; commit with
  clear messages; push only when the work is complete. Don't open a PR unless
  asked.
- **Respect ADRs** — e.g. new Promos use HyperFrames, not Remotion (ADR-0001).
- **No app-store spam** — refuse to mass-produce near-identical apps; warn on
  reskins. Apple Guideline 4.3 / Google repetitive-content = whole-account ban.
  Cadence: 1 distinct quality app/week to start, 2–3/week ceiling once systematized
  (see `patterns/app-factory-2026.md`). Quality over volume, always.
- **Reverse-engineered / relay tools** — kimi-free-api, CC Switch discount relays:
  flagged as supply-chain risk. Prefer official channels; don't route production
  keys/traffic through them.
- **Honesty** — Report what actually happened. If a step was skipped or failed,
  say so with the evidence. Don't claim done without verifying.

## How To Invoke

```
/nexus <anything you want, in plain language>
```

Examples:
- `/nexus make a 30s promo for the new track and a matching carousel`
- `/nexus research the top 3 competitors and draft a positioning doc`
- `/nexus turn this idea into a landing page`
- `/nexus audit the studio workers for security issues`
- `/nexus spec out a feature for offline playback and build it`
- `/nexus animate the Fourier transform as a 20s explainer`

If the request is unclear, NEXUS asks exactly one clarifying question. Otherwise
it states its plan in one line and executes.

## Guidelines

- Default to **acting**, not surveying. Pick the obvious route and go.
- Prefer **existing skills and the knowledge base** over improvising.
- For 2+ independent sub-tasks, **parallelize** with `Agent` calls (Haiku for
  mechanical work, Sonnet/Opus for judgment — see Subagent Model Routing in
  `CLAUDE.md`).
- Always end by telling the user **what was produced, where it is, and what needs
  their approval** (if anything).
