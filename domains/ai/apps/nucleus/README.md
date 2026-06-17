# Nucleus: AI-Powered Neuromarketing Video Generation Platform

**Status:** Foundational architecture in place. Core orchestrator, Mary agent, memory system, and tool registry scaffolded.

## Overview

Nucleus is an AI-native platform for generating, testing, and optimizing neuromarketing video campaigns at scale. Mary is the intelligent agent that orchestrates the entire pipeline.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│ User / Campaign Brief                                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   Mary Agent         │  (Pydantic AI)
        │  (orchestrator)       │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────────────┬──────────────┐
        │                             │              │
        ▼                             ▼              ▼
    ┌────────────┐          ┌─────────────────┐  ┌──────────┐
    │   Tools    │          │  Memory System  │  │ Scoring  │
    │ Registry   │          │ (Cognee)        │  │(NeuroPeer)
    │            │          │                 │  │          │
    │ • Generate │          │ • Episodic      │  │ • Engage │
    │ • Edit     │          │ • Semantic      │  │ • Virality
    │ • Score    │          │ • Procedural    │  │ • Emotion
    │ • Transform│          │                 │  │          │
    └────────────┘          └─────────────────┘  └──────────┘
        │
    ┌───┴─────────────────────────────┐
    │                                 │
    ▼                                 ▼
┌─────────────────────┐         ┌─────────────────────┐
│   MuAPI Skills      │         │   fal.ai (Fallback) │
│ (Primary Provider)  │         │                     │
│                     │         │ • Kling 3.0         │
│ • Cinema Director   │         │ • Sora 2            │
│ • Seedance 2.0      │         │ • Veo 3.1           │
│ • AI Clipping       │         │ • FLUX              │
│ • Logo Creator      │         └─────────────────────┘
│ • 41+ recipes       │
└─────────────────────┘
```

## Components

### Mary Agent (`backend/orchestrator/mary.ts`)

The intelligent orchestrator that:
- Parses brand briefs and campaign concepts
- Coordinates multi-model video generation (MuAPI + fal.ai)
- Manages variant A/B testing
- Learns from campaign performance via procedural memory

**Tool Categories (16+):**
- **Generate:** Text/Image → Video (MuAPI, fal.ai)
- **Edit:** Video → Video (AI Clipping, prompt-based)
- **Score:** Video → Metrics (NeuroPeer)
- **Transform:** Social crops, thumbnails, multi-format
- **Fetch:** Web search, context retrieval

### Memory System (`backend/memory/cognee.ts`)

Three-layer persistent memory using Cognee knowledge graph:

1. **Episodic** — Session history, campaign outcomes
2. **Semantic** — Brand knowledge, scoring patterns, audience insights
3. **Procedural** — Learned system prompt adjustments ("what works for brand X")

**Tech Stack:**
- SQLite (local storage)
- LanceDB (vector search)
- Kuzu (knowledge graph)
- All local, zero cloud, zero vendor lock-in

### Tool Registry (`backend/tools/registry.ts`)

Manages ~20 async tools with handlers for:
- MuAPI generative skills (primary)
- fal.ai fallback providers
- NeuroPeer scoring
- Video editing & transformation

## Setup

### Prerequisites

```bash
# Install Node.js 20+, pnpm 9+
pnpm install
pnpm run setup
```

### Build & Run

```bash
# Development
pnpm run dev

# Type check
pnpm run type-check

# Run Mary agent directly
pnpm run agent:mary

# Run tests
pnpm run test
```

### Environment Variables

Create `.env` at repo root:

```
# MuAPI
MUAPI_KEY=sk_...
MUAPI_BASE_URL=https://api.muapi.com

# fal.ai (fallback)
FAL_KEY=...

# NeuroPeer (scoring)
NEUROPEER_API_KEY=...
NEUROPEER_ENDPOINT=...

# Optional: Hermes Agent
HERMES_MODEL=minimax/MiniMax-M1-80k
HERMES_BASE_URL=https://openrouter.io/api/v1
```

## Alternative Runtimes

### Hermes Agent (Optional Future Migration)

Current architecture uses Pydantic AI. Optional migration to Hermes Agent harness:

1. **Hermes replaces Pydantic AI** as the agent runtime (not a library)
2. **Mary's tools** become a Hermes plugin (no rewrite, mechanical mapping)
3. **Memory system** persists (Cognee + Hermes's 3-layer native memory)
4. **Skill learning** built-in to Hermes
5. **Subagent delegation** for parallel variant generation

**Migration Effort:** 2-3 days. See parent repo MCP evaluation for details.

### Kimi CLI (Complementary Agent)

**Kimi CLI** (Moonshot AI) can orchestrate Nucleus tasks or run independently:

- **Terminal-first development** — Agent mode + shell mode (Ctrl-X toggle)
- **IDE integration** — VS Code extension, Zed/JetBrains via ACP
- **MCP support** — Connect to 100+ tools (Context7 docs, Linear issues, Chrome DevTools)
- **General-purpose** — Code review, debugging, shell automation

**Integration Pattern:**
1. Kimi CLI handles general dev tasks (code analysis, debugging)
2. Delegates specialized video generation to Nucleus/Mary
3. Chains results into broader workflows (social posting, analytics, reporting)

**Use Case:** Multi-agent system where Kimi orchestrates campaigns that require neuromarketing video generation.

## File Structure

```
nucleus/
├── README.md                          (this file)
├── package.json                       (dependencies, scripts)
├── tsconfig.json                      (TypeScript config)
│
├── backend/
│   ├── orchestrator/
│   │   ├── index.ts                   (bootstrap + main loop)
│   │   └── mary.ts                    (Mary agent definition)
│   ├── tools/
│   │   └── registry.ts                (tool definitions + handlers)
│   └── memory/
│       └── cognee.ts                  (episodic + semantic + procedural memory)
│
├── tools/                             (MuAPI skill implementations)
│   ├── cinema-director.ts
│   ├── seedance-2.ts
│   ├── ai-clipping.ts
│   └── ... (other MuAPI recipes)
│
├── config/
│   ├── prompts.ts                     (CIL system prompts, templates)
│   ├── providers.ts                   (MuAPI, fal.ai, NeuroPeer config)
│   └── constants.ts
│
└── frontend/                          (optional: Canvas UI integration)
    ├── components/
    ├── pages/
    └── styles/
```

## Next Steps

1. **Implement Mary agent loop** — Connect Pydantic AI with tool registry
2. **Wire Cognee memory** — Store/retrieve campaign results and learned patterns
3. **Test video generation** — Validate MuAPI + fal.ai integrations
4. **Implement scoring** — NeuroPeer integration for engagement metrics
5. **Build procedural memory** — Mary learns from feedback and improves prompts
6. **(Optional) Hermes migration** — Replace Pydantic AI runtime if scaling to multi-agent

## References

- **MCP Evaluation:** Parent repo `/NUCLEUS-MCP-EVAL.md` (Hermes, Cognee, Higgsfield analysis)
- **MuAPI Skills:** `/MUAPI-SKILLS.md` (41+ workflow recipes)
- **Ecosystem:** Parent repo `ECOSYSTEM.md` (monorepo structure, CLI, shared packages)

---

**Status:** Scaffolded ✅ | Ready for core implementation
