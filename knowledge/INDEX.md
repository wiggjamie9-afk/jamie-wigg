# Knowledge Base Index

Curated business cases, technical deep dives, and tool references for AI agent development and one-person company operations.

## 🌟 START HERE — NEXUS (master orchestrator)

**`/nexus <anything you want>`** is the single front door to this entire ecosystem.
You don't need to remember which model, tool, or skill does the job — NEXUS reads
your request, routes it to the right capability (or chains several), runs it
end-to-end, verifies, and reports back. It knows the full inventory below.

- **Skill**: `.claude/skills/nexus/SKILL.md`
- **Covers**: create (video/image/audio/carousels/art), research, build/ship
  (sites/apps/specs/code), secure (audit/pentest/detect), optimize (cost/context).
- **Examples**: `/nexus make a 30s promo + matching carousel` ·
  `/nexus research top 3 competitors and draft a positioning doc` ·
  `/nexus spec out offline playback and build it`

Everything below is the inventory NEXUS routes across.

## Categories

### 🎯 OPC/AI Earning Cases (6 articles)

1. **Anthropic's Billion-to-Billion Scaling** — 16-month journey from $1B to $30B ARR; Claude Code single prototype = $2.5B ARR; enterprise API-first model vs OpenAI's user-centric B2C focus
2. **Polymarket Tool Viral Growth** — 600 users in zero-marketing MVP; AI screenshot analysis became most viral feature; 1% transaction fee model
3. **Service-as-Software Pattern** — AI agents reducing service delivery cost to near-zero; $6 service market per $1 software market; single-person operators taking standard service contracts
4. **AI Hardware Window: Sleep Tracking** — Ex-Xiaomi executive: $100M+ funding for AI sleep device; 2-3 year product roadmap; "精力资产管理" (energy asset management) ecosystem
5. **Alibaba AI to B Shift** — Token-based pricing for merchant AI agents; goal: $100B AI+cloud revenue in 5 years; search relevance +20%, recommendation +10%, ad ROI +12%
6. **[Not summarized in detail]** — Additional case study on [topic]

---

### 🛠️ AI Tools & Frameworks (18 articles)

#### Browser/GUI Automation & Agent Extension
- **eyehands** — Local HTTP server giving Claude Code eyes/hands on Windows; OCR + mouse/keyboard control; $19 one-time Pro fee
- **Custom Slack Inbox** — Perplexity Computer automating 150+ daily notifications; "anti-todo" philosophy (1hr/day to automate forever tasks)
- **Finalrun** — AI-powered mobile app testing via visual recognition; no selectors needed

#### Content Generation & Automation
- **KREA** (`krea.md`) — Hosted creative AI: illusion-diffusion Patterns/Logos (embed text/logo into images), real-time sketch→image, image→video. Includes "is it the same tech?" answer (yes — one conditioned-diffusion engine; Real-Time = distilled low-latency model). Approximate via Replicate/FLUX+ControlNet → SkyReels-I2V
- **Reddit Video Maker Bot** — One-command YouTube/TikTok creation from Reddit posts; Python 3.10 + Playwright
- **SEO Machine** — Claude Code workspace with `/research` `/write` `/optimize` commands; 10+ agents + 26 marketing skills; GA4+GSC integration
- **Carousel Generator** (`carousel-generator.md`) — Text-to-carousel skill: 12 slide types, 6 platforms, 880 style combos (5 fonts × 8 surfaces × 11 accents × 2 purposes); PNG + PDF export; live preview toolbar
- **Prefab** — Generative UI framework for Python; 100+ shadcn components; MCP-native
- **KimiK2Manim** (`kimik2manim.md`) — Kimi K2 thinking → Manim math animations; 4-stage pipeline (tree → math → visual → narrative); Kosong integration; E2B sandbox. Pairs with HyperFrames/Nucleus for explainer content
- **Remotion** (`remotion.md`) — Programmatic video in React (already in repo as dormant `video/`; ADR-0001 chose HyperFrames for Promos). ⚠️ special/paid license; niche = data-driven/personalized/batch video ("RHYTHMIX Wrapped")

#### Agent Development Frameworks
- **Superpowers** — Coding agent skill framework; spec → plan → execution; supports Claude Code, Cursor, Codex
- **GitNexus** — Graph RAG agent for code analysis; browser-based knowledge graph; zero-server
- **Kimi CLI** (`kimi-cli.md`) — Terminal-first AI agent + shell (Moonshot AI); Ctrl-X toggle agent ↔ shell; VS Code/ACP/Zsh integration; 100+ MCP tools support
- **MiroFlow** (`miroflow.md`) — SOTA multi-step research agent (MiroMind); #1 FutureX, GAIA 82.4%, xBench-DeepSearch 72.0%; hierarchical sub-agents; MiroThinker runs on single RTX 4090
- **MindSearch** (`mindsearch.md`) — Deep web research agent by InternLM; query decomposition → iterative search → synthesis; built on Lagent v0.5 (lightweight agent framework); multiple search engines (DuckDuckGo/Bing/Brave/Google); local (InternLM2.5-7b) or GPT-4 backends. Micro-agent for Nucleus fact-checking + competitive intelligence
- **Andrej Karpathy Skills** — CLAUDE.md config fixing LLM coding errors; 4 core principles (think first, simplicity, precise edits, goal-driven)

#### Agent Tools & Extensions
- **pi-perplexity** (`pi-perplexity.md`) — Perplexity Search plugin for oh-my-pi agents; reverse-engineered OAuth (desktop JWT extraction + email OTP auth); SSE streaming with incremental event merging; formatted LLM output with sources + age. Lightweight web search tool for Nucleus fact-checking and competitive intelligence

#### Generative & Creative
- **p5.js Generative Art** (`p5js-generative-art.md`) — Structured approach to parameterized, reproducible generative art using p5.js. Nine principles: parameter organization, seeded randomness, lifecycle patterns (static/animated/interactive), class structure, performance optimization, utilities (color, mapping, easing), UI integration, common patterns (trails, noise-driven movement, grids), export. Seeded random standard from Art Blocks. Batch-generate unique frames for RHYTHMIX videos or procedural textures for design systems
- **Framelink MCP for Figma** (`framelink-mcp-figma.md`) — Design-to-code MCP server that bridges Figma files to Cursor/Claude Code. Fetches design metadata (layout, colors, typography, spacing) and translates to concise context for code generation. Installation: add to MCP config with Figma API token. Patterns: component implementation, design system sync, multi-frame layouts. Use for RHYTHMIX design system → component library, Figma frames → HyperFrames compositions, design-code sync
- **Adobe XD Plugin Samples** (`adobe-xd-plugins.md`) — 60+ reference plugins for Adobe XD extensibility. Covers UI (dialogs, panels with React/Vue), scenegraph (shapes, text, layers), file I/O, network requests, commands. Three plugin types: dialogs, panels (v21+), commands. Quickstart: clone to XD plugins folder, reload with CTRL+SHIFT+R. Best practices, minimal examples, integration patterns (XD → HyperFrames export, design token sync, batch layer organization). Reference for extending XD if used in RHYTHMIX design workflow

#### LLM Gateways & Provider Access
- **CC Switch** (`cc-switch.md`) — Desktop config manager (Tauri 2) for 7 AI coding tools (Claude Code/Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes); unified MCP/Skills/prompt sync, provider switching, cost dashboard, atomic SQLite writes. ⚠️ sponsor wall of discount API-relays = same reverse-eng/credential-routing risk as kimi-free-api — use with official channels only. Desktop, not sandbox
- **GPT4Free (g4f)** (`gpt4free.md`) — Multi-provider LLM aggregator; OpenAI-compatible Python/JS client + FastAPI + MCP server; web search + image gen; local inference (Ollama/vLLM). GPLv3
- **OpenClaw Zero Token** (`openclaw-zero-token.md`) — Free gateway to 13 web LLMs (ChatGPT/Claude/Gemini/DeepSeek/Kimi/Qwen/Grok/GLM…) via browser login; tool calling on 11/13; local credential storage. MIT
- **kimi-free-api (fix)** (`kimi-free-api.md`) — ⚠️ Reverse-engineered Kimi API; documented with supply-chain-attack warnings; NOT recommended — prefer official API / OpenClaw Zero Token

#### Data & Analysis
- **Offline AI Data Stack** — Local data lake + zero-ETL + lineage + version control; supports Gemma, Claude, free
- **Turbo-OCR** — C++/CUDA rewrite of PaddleOCR; RTX 5090: 15 FPS → 100+/1000+ FPS; open-source on GitHub

#### Context / Cost Optimization
- **Headroom** (`headroom.md`) — Local, reversible context-compression for LLM agents; wraps Claude Code or runs as proxy (zero code changes); compresses prompts + tool outputs + RAG + history + output tokens; 47–92% savings, accuracy preserved. High-value/low-risk for Nucleus + many-MCP setups. Run on local dev box, not the sandbox

#### Security
- **AgentShield** (`agentshield.md`) — Security scanner for `.claude/` configs; 102 rules / 5 categories (secrets, permissions, hooks, MCP, agents), A–F grade, SARIF + GitHub Action + supply-chain + Opus adversarial analysis. `runtimeConfidence` separates active config from template/doc examples. **First scan of this repo: D (58/100), 0 critical** — see `docs/security/agentshield-findings.md` (most findings are FleetView platform files / false positives; one real item = missing PreToolUse hook)

#### Web Frameworks (reference)
- **Wasabi** (`wasabi-http-framework.md`) — ⚠️ Archived Kotlin/Netty HTTP framework, merged into Ktor. Design reference only (typed interceptor positions, multi-source content negotiation); use Ktor for any JVM service

---

### 🎯 Design Patterns for AI Workflows (2 articles)

- **Scheduled Agent Loops** (`patterns/scheduled-agent-loops.md`) — Five-step pattern (Schedule, Context, Decide, Act, Verify) for turning one-shot prompts into hands-off, repeating outcomes. Covers three implementations: Claude Code scheduled tasks, n8n no-code workflows, cron+agent service. Best practices: define done first, feed right context, add guardrails, human-in-loop for risky steps, start small. Worked example: morning sales loop (identify follow-ups, draft emails, approve, send).
- **Anthropic Agent Skills** (`references/anthropic-agent-skills.md`) — Agent Skills standard (agentskills.io) for dynamic instruction sets that teach Claude specialized tasks. SKILL.md format (YAML frontmatter + markdown). Anthropic's open repository of 100+ skills (creative, development, enterprise, document editing). Integration: Claude Code (plugins), Claude.ai (paid), Claude API. Source-available document skills (DOCX, PDF, PPTX, XLSX) as production reference. How to create custom skills + skill patterns. Related to this repo's `.claude/skills/` (100+ skills installed).

---

### 🤖 New Models & AI Tech (16 articles)

#### Kimi / Moonshot Models
- **Kimi K2** (`kimi-k2.md`) — 1T-param MoE, 32B activated; agentic optimization, native tool calling; 65.8% SWE-bench Verified, 97.4% MATH-500; OpenAI/Anthropic-compatible API. Primary LLM reasoning backbone
- **Kimi-Audio** (`kimi-audio.md`) — Audio foundation model (ASR, audio Q&A, emotion recognition, generation); 13M+ hrs pretraining; 1.28 WER LibriSpeech. Audio understanding + TTS for Nucleus
- **Kimi Agent Internals** (`kimi-agent-internals.md`) — Production Kimi agent architecture (6 agent types, runtime, 38 tools, episodic/semantic/procedural memory, security model). Design reference for Nucleus

#### Long-Context & Multimodal Foundation Models
- **MiniMax-01** (`minimax-01.md`) — MiniMax-Text-01 (456B MoE, **4M-token inference context**, Lightning+Softmax hybrid attention; SOTA Ruler @512K–1M) + MiniMax-VL-01 (vision, OCRBench/DocVQA leader). Two hooks: hosted long-context reasoning for Nucleus, and the **MiniMax MCP server** (video/image/speech/voice-cloning) for the creative stack. ~8-GPU to self-host → use hosted API

#### SkyReels Video Models (Skywork AI)
- **SkyReels V1** (`skyreels-v1.md`) — Human-centric video foundation model (HunyuanVideo fine-tune); 33 expressions, cinematic aesthetics; open-source SOTA VBench 82.43. Short cinematic human clips
- **SkyReels V2** (`skyreels-v2.md`) — Infinite-length film model (AutoRegressive Diffusion Forcing); T2V/I2V/extension/start-end control; VBench 83.9%. Long-form cinematic promos
- **SkyReels V3** (`skyreels-v3.md`) — Unified multimodal in-context model; reference-to-video (1–4 refs), talking avatar (audio→lip-sync ≤200s), shot-switching extension; hosted API on apifree.ai. Avatar-narrated promos
- **Meta Muse Spark** — Opus 4.6 / GPT 5.4 -level performance; 16 integrated tools (search, Instagram search, SVG render, live sports)
- **GLM-5.1** — 58.4% on SWE-bench Pro (beats Opus 4.6); 744B MoE; 200K context; $30 deployment cost vs $1K Claude Opus 4.6
- **Liquid LFM2.5-VL-450M** — 450M parameters; 240ms image processing; 4 FPS video; structured output + multi-language
- **NVIDIA PersonaPlex** — Full-duplex voice conversation; real-time persona control via text prompts; Moshi-based
- **Horus-1.0 (Egypt)** — First open-source Egyptian model; 4B params; beats Qwen 3.5-4B, Gemma 2 9B on benchmarks
- **Transformer on Commodore 64** — 25K params in 64KB RAM; 8-bit quantized; pure assembly implementation

#### Optimization & Research
- **Qwen 3.5 Chat Template Cache Bug** — Empty `<think>` tags breaking prefix cache reuse; simple one-line fix submitted as PR
- **Google AI Edge Gallery** — Offline Gemma 4 on-device; Agent Skills integration; no internet required
- **LiteRT-LM** — Cross-platform edge LLM deployment (Android, iOS, Web, Raspberry Pi); Gemma 4 support
- **Newton Physics Engine** — GPU-accelerated physics simulation for robotics; NVIDIA Warp + OpenUSD; MuJoCo backend

---

### 💰 Funding & Hardware Startup Cases (2 articles)

1. **光学传感器 (Optical Sensors for Robotics)** — Oxford postdoc; $millions in back-to-back funding; light-based force sensors (0.3% crosstalk); humanoid robot supply chain entry
2. **器官芯片 + AI (Organ Chip + AI Drug Development)** — $200M Series A funding; organ chip + AI + automation pipeline; FDA approves non-animal data for IND filing; 88.9% drug sensitivity prediction accuracy

---

## Usage

### For AI Agents
- Reference successful one-person company models in `/OPC-cases/`
- Study tool implementation patterns in `/tools/`
- Benchmark model capabilities in `/models/`

### For Nucleus Project
- **Mary Agent:** Emulate SEO Machine's skill-based architecture + AI agent orchestration pattern; Kimi K2 as alt LLM runtime; Kimi Agent Internals for runtime/memory design
- **Tool Registry:** Port patterns from eyehands, GitNexus for GUI automation + code analysis
- **Memory System:** Learn from Turbo-OCR's "batch offline processing" and Slack automation's context prioritization; consider Kimi's episodic/semantic/procedural split
- **LLM Access:** Layered providers — Kimi K2 (primary) → GPT4Free / OpenClaw Zero Token (free fallback + web search + image gen)
- **Research:** Delegate multi-step research to MiroFlow, feed synthesis into carousel/video generation
- **Business Model:** Reference Polymarket tool's 1% transaction fee + enterprise API model (Anthropic style)

### Video Pipeline (RHYTHMIX)
- **HyperFrames** — default for Promos (ADR-0001): HTML/CSS/GSAP motion graphics
- **SkyReels V1/V2/V3** — generative cinematic footage, infinite-length, talking avatars (GPU-heavy: use apifree.ai/Replicate/rented GPU, not the sandbox)
- **KimiK2Manim** — math/technical explainer animations
- **Remotion** (dormant `video/`) — reserved for data-driven/personalized/batch video; port via `remotion-to-hyperframes`
- **Nucleus/Mary** — orchestration + carousel + scoring across all of the above

### For One-Person Builder
- Monitor OPC/AI earning cases for emerging tool opportunities
- Track model releases for cost/capability inflection points (e.g., GLM-5.1 @ $30 vs $1K)
- Study viral growth mechanics: AI screenshot analysis (Polymarket) → unexpected breakout feature

---

## Last Updated
2026-06-17 — added Kimi suite (K2, Audio, agent internals, CLI, Writer skill, KimiK2Manim), SkyReels V1/V2/V3 video models, LLM gateways (GPT4Free, OpenClaw Zero Token, kimi-free-api), MiroFlow research agent, Carousel system, and Remotion/Wasabi reference docs.

## Source
Curated articles, Reddit posts, GitHub trending, Hacker News, blogging platforms (Simon Willison, Lenny's Newsletter, 36氪, 爱范儿, Trends.vc)
