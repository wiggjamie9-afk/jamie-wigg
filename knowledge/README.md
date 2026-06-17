# Knowledge Base

Reference library for building AI-native products, one-person companies, and agent-powered systems.

## Overview

This directory contains curated case studies, tool implementations, model benchmarks, and business patterns extracted from:
- Successful AI company scaling (Anthropic, OpenAI, Alibaba)
- Viral side projects (Polymarket tool, Reddit bots)
- Open-source agent frameworks (Claude Code skills, Hermes plugins)
- Model releases and technical deep dives (Qwen, GLM, Meta Muse)
- Hardware startup funding rounds

## Directory Structure

```
knowledge/
├── INDEX.md                 (this index)
├── README.md               (this file)
├── OPC-cases/              (One-Person Company earning patterns)
│   ├── anthropic-scaling.md
│   ├── polymarket-viral.md
│   ├── service-as-software.md
│   └── ...
├── tools/                  (Framework & tool implementations)
│   ├── eyehands.md         (GUI automation)
│   ├── seomachine.md       (Agent orchestration)
│   ├── slack-automation.md (Workflow optimization)
│   └── ...
├── models/                 (Model releases, benchmarks, optimization)
│   ├── glm-5.1.md         (SWE-bench, deployment costs)
│   ├── qwen-3.5.md        (Cache reuse bug, local LLM)
│   └── ...
└── references/            (Business/technical articles)
    ├── service-cost.md    (AI reducing delivery cost to zero)
    └── ...
```

## Key Insights

### Business Patterns

1. **Token-Based Pricing (Alibaba Model)**
   - Merchant AI agents consume tokens per action
   - Marginal cost: near-zero (only API calls)
   - Revenue per user: $25-211 depending on usage intensity

2. **Single Transaction Fee (Polymarket Model)**
   - 1% fee per trade
   - Zero marketing, 600 users via Reddit + Discord
   - Most viral feature: **AI screenshot analysis** (unexpected breakout)

3. **Service-as-Software**
   - $6 service market per $1 software market
   - AI agents reduce delivery cost from $100s/hour to $0.01-1/per interaction
   - Liability as moat: agents assume responsibility for outcomes

### Technical Patterns

1. **Model Fragmentation**
   - Qwen/GLM outpacing OpenAI/Meta in China ($30 deployment vs $1K)
   - Gemini Omni solving multi-modal cheaper than GPT-4V
   - Edge models (Gemma 4, LFM-VL) viable for on-device agents

2. **Agent Architecture**
   - Skill-based (SEO Machine: 26+ skills)
   - Graph RAG (GitNexus: code understanding via knowledge graph)
   - Subagent delegation (Superpowers: spec → plan → execute)

3. **Viral Feature Discovery**
   - Polymarket: AI screenshot analysis was afterthought, became core
   - Slack automation: 1hr to automate forever = engagement unlock
   - → **Build tools, observe what users love, optimize that**

## For Nucleus Project

**Mary Agent should steal from:**

1. **SEO Machine's skill library** — 26 marketing skills in modular registry
2. **Carousel Generator** — Multi-platform carousel assets as core capability (Threads, Instagram, LinkedIn, TikTok, Stories); 880 style combinations enable brand consistency
3. **Kimi CLI's agent architecture** — Terminal-first + IDE integration; MCP tool orchestration; Ctrl-X shell toggle for hybrid workflows
4. **Polymarket's AI screenshot** — Unexpected high-value feature; build it first, monetize later
5. **Anthropic's enterprise model** — 70-75% revenue from API; focus on B2B
6. **Turbo-OCR batch processing** — Offline, no real-time requirement; batch > streaming for cost/throughput
7. **GLM-5.1's task persistence** — 8-hour continuous work; Mary should sustain campaign generation across sessions

**Orchestration Pattern:** Kimi CLI as meta-orchestrator (handles general dev tasks), Nucleus/Mary as specialized neuromarketing generator (video + carousel + scoring pipeline).

## For One-Person Builders

**Use this knowledge base to:**

- Reference OPC earning mechanics (token fees, transaction fees, API margin)
- Study tool implementations before building (avoid reinventing eyehands/GitNexus)
- Track model performance/cost inflection points (when does local beat cloud?)
- Monitor startup funding rounds for emerging market signals (organ chips, robot sensors)

---

## Contributing

Add new articles, case studies, or frameworks as you discover them. Structure:
- File: `category/slug.md`
- Header: `# Title` + source link
- Body: 200-500 words, 3 key takeaways for builders
- Tag: `#use-case` `#business-model` `#open-source` `#benchmark`

---

Last updated: 2026-06-17
