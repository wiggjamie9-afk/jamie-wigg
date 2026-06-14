# Claude Eco Environment — Tool Registry

Complete integration registry for state-of-the-art AI tools and frameworks. Install, configure, and orchestrate everything you need to build any AI product.

## Installation Quick Start

```bash
# Clone this repo
git clone <repo>
cd jamie-wigg

# Install core services
npm install
pnpm install

# Install individual tools (see tool-specific sections below)
```

---

## 🔧 TOOLS REGISTRY (23 Total)

### 1. Claude-Mem — Persistent Memory Across Sessions
**Status:** ✅ Installed  
**Location:** `~/.claude-mem/`  
**Purpose:** Cross-session persistent memory for Claude Code

```bash
npx claude-mem install
npx claude-mem start
```

**Dashboard:** http://localhost:37777

---

### 2. PULSE — Token Efficiency Protocol v1.0
**Status:** ✅ Documented  
**Location:** `./PULSE-SETUP.md`  
**Purpose:** 60-70% token reduction while maintaining output quality

**Key rules:**
- No re-reading files
- Smart grep before cat
- Code compaction patterns (all languages)
- 10 Commandments for efficiency
- Context window budget: 60% work target

---

### 3. OpenCut — Free/Open Video Editor
**Status:** 📦 Available  
**Repo:** https://github.com/opencut-app/opencut-classic  
**Purpose:** Web/desktop/mobile video editing for creators

```bash
git clone https://github.com/opencut-app/opencut-classic.git
cd opencut-classic
pnpm install
pnpm dev
```

**Status:** Classic version stable; rewrite in progress  
**MCP Support:** Planned

---

### 4. Bolt.new — AI-Powered Full-Stack Web Dev
**Status:** 📦 Available  
**URL:** https://bolt.new  
**Purpose:** Build production-grade full-stack apps in browser

**Features:**
- Install npm packages, run backends
- Deploy to production from chat
- Node.js servers, third-party API integration
- Powered by StackBlitz WebContainers

**Setup:**
- No local setup required
- Free tier + paid subscriptions
- Use with Claude for AI-powered development

---

### 5. Avogadro — Molecular Editor
**Status:** 📦 Available  
**Repo:** https://github.com/OpenChemistry/avogadro2  
**Purpose:** Cross-platform molecular modeling and chemistry simulation

```bash
# Install (macOS example)
brew install avogadro2

# Or build from source
git clone https://github.com/OpenChemistry/avogadro2.git
cd avogadro2
cmake -B build
cmake --build build
```

**Use case:** Scientific modeling, bioinformatics, materials science

---

### 6. OpenManus — AI Agent Framework
**Status:** 📦 Available  
**Repo:** https://github.com/FoundationAgents/OpenManus  
**Purpose:** Open-source framework for building general AI agents

```bash
# Install with uv (recommended)
curl -LsSf https://astral.sh/uv/install.sh | sh
git clone https://github.com/FoundationAgents/OpenManus.git
cd OpenManus
uv venv --python 3.12
source .venv/bin/activate
uv pip install -r requirements.txt

# Configure
cp config/config.example.toml config/config.toml
# Edit with your API keys

# Run
python main.py
```

**Models supported:**
- Local: Llama-3.1, Mixtral
- Hosted: GPT-4o-mini, Claude 3.5, Gemini

**MCP Support:** Via `python run_mcp.py`

---

### 7. Emergent — Neural Network Simulation Framework
**Status:** 📦 Available  
**Repo:** https://github.com/emer/emergent  
**Language:** Go  
**Purpose:** Biologically-detailed spiking networks + deep learning

```bash
# Prerequisites
go install golang.org/x/tools/cmd/stringer@latest

# Clone & build
git clone https://github.com/emer/emergent.git
cd emergent
go build ./...

# Run example
cd examples/ra25
go run .
```

**Modules:**
- `axon` — Spiking networks (GPU-accelerated via Vulkan)
- `leabra` — Learning algorithms
- `eTorch` — PyTorch integration

**Key advantage:** Go = no Python speed bottleneck; GPU via gosl shader language

---

### 8. Stitch — UI/UX Design + Code Generation
**Status:** 📦 Available  
**URL:** https://www.stitchdesign.ai  
**Purpose:** AI-powered UI/UX design and code generation

**Gemini CLI Extension:**
```bash
gemini extensions install https://github.com/gemini-cli-extensions/stitch --auto-update

# Configure API key
export API_KEY="your-stitch-api-key"
sed "s/YOUR_API_KEY/$API_KEY/g" ~/.gemini/extensions/Stitch/gemini-extension-apikey.json > ~/.gemini/extensions/Stitch/gemini-extension.json

# Use
gemini
/stitch Design a mobile app for <your-idea>
```

**Features:**
- Generate screens from text prompts
- Download HTML/CSS/images
- Multi-model support (Gemini 3 Pro/Flash)
- Free MCP integration

---

### 9. Global FinTech Platform
**Status:** 📦 Reference Architecture  
**Purpose:** Revolut-like fintech: banking, payments, airtime/data, crypto custody

**Stack:**
- **Ledger:** Apache Fineract 1.x (canonical fiat ledger)
- **Switch:** j8583 (ISO-8583) + jPOS adapter
- **Crypto:** bitcoinj (BTC), web3j (EVM)
- **IAM:** Keycloak (OIDC/OAuth2)
- **Secrets:** HashiCorp Vault
- **Compliance:** Python FastAPI (AML/Travel Rule)
- **Data:** PostgreSQL (OLTP), ClickHouse (analytics)
- **Backend:** NestJS
- **Mobile:** Flutter
- **Web:** Next.js
- **Orchestration:** Kubernetes + Rancher + ArgoCD
- **Ledger Performance:** TigerBeetle (1M+ TPS, <1ms latency)

**Setup:** See `docs/TIGERBEETLE_QUICKSTART.md` in that project

---

### 10. open-lovable — Web Development Agent
**Status:** 📦 Available  
**Repo:** https://github.com/firecrawl/open-lovable  
**Purpose:** Build web dev agents using Firecrawl + Claude/Gemini/OpenAI

```bash
git clone https://github.com/firecrawl/open-lovable.git
cd open-lovable
pnpm install

# .env.local setup
FIRECRAWL_API_KEY=your_key
ANTHROPIC_API_KEY=your_key  # or GEMINI_API_KEY, OPENAI_API_KEY
SANDBOX_PROVIDER=vercel     # or 'e2b'
VERCEL_OIDC_TOKEN=auto      # or manual Vercel credentials

pnpm dev
# Open http://localhost:3000
```

**Features:**
- Web scraping via Firecrawl
- AI agent for full-stack dev
- Live preview & deploy
- Multi-LLM support

---

## 🔌 Integration Points

### MCP Servers (Model Context Protocol)
Connect these tools to Claude Code via MCP:

| Tool | MCP Server | Status |
|---|---|---|
| Claude-Mem | Built-in | ✅ Active |
| OpenManus | `python run_mcp.py` | 📦 Available |
| Stitch | Gemini extension | ✅ Active |
| open-lovable | Firecrawl MCP | 📦 Available |
| Emergent | Custom (Go) | 📋 Planned |
| Global FinTech | Kafka/event backbone | 📋 Planned |

---

## 📋 Setup Checklist

### Phase 1: Core (Session 1)
- [ ] Clone this repo
- [ ] Install Claude-Mem
- [ ] Read CLAUDE-MEM-SETUP.md
- [ ] Read PULSE-SETUP.md
- [ ] Review CLAUDE.md

### Phase 2: Development Tools (This Week)
- [ ] Install OpenManus
- [ ] Install open-lovable
- [ ] Setup Stitch + Gemini CLI
- [ ] Create Firecrawl API key

### Phase 3: Scientific/Finance Tools (As Needed)
- [ ] Install Avogadro (if doing science/materials work)
- [ ] Install Emergent (if building neural network models)
- [ ] Review Global FinTech architecture (if building fintech)

### Phase 4: Creative Tools (As Needed)
- [ ] Setup OpenCut for video editing
- [ ] Setup Bolt.new for web prototyping

---

## 🚀 Common Workflows

### Build a Web App (Fast)
1. Use Bolt.new or open-lovable
2. Describe your idea in Claude Code
3. Deploy to production via chat

### Build an AI Agent
1. Use OpenManus framework
2. Configure LLM (Claude, Gemini, GPT-4o)
3. Connect to MCP servers for tool access
4. Deploy as standalone or MCP wrapper

### Video Content Creation
1. Use Claude-Mem to reference past scripts/ideas
2. Generate script with Claude
3. Use OpenCut to edit video
4. Deploy to platform

### Scientific Modeling
1. Use Emergent for neural networks (Go + GPU)
2. Use Avogadro for molecular visualization
3. Integrate results into Global FinTech risk models (if fintech)

### Fintech Platform
1. Deploy Global FinTech architecture
2. Connect OpenManus agents for KYC/compliance automation
3. Use open-lovable for admin dashboard UI
4. Wire Stitch for customer-facing design

---

## 📚 Documentation

| Doc | Purpose |
|---|---|
| `CLAUDE-MEM-SETUP.md` | Persistent memory across sessions |
| `PULSE-SETUP.md` | Token efficiency & code compaction |
| `CLAUDE.md` | Project-specific conventions |
| `docs/REVIEW_GAP_ANALYSIS_2026-02-17.md` | Deployment gap analysis |
| `docs/AIDD_GUARDRAILS.md` | AI-driven development guardrails |

---

## 🔒 Security & Compliance

- **Secrets:** Use HashiCorp Vault or `.env.local` (gitignored)
- **API Keys:** Never commit to git; use environment variables
- **PCI-DSS:** Global FinTech platform includes PCI-DSS compliance framework
- **KYC/AML:** Built into fintech stack; integrate OpenManus for automation
- **Privacy:** Use GDPR guardrails (docs/AIDD_GUARDRAILS.md)

---

## 📈 Performance Targets

| Metric | Target | Tool |
|---|---|---|
| Memory boot tokens | <1000 | Claude-Mem |
| Token read-to-output ratio | <2.0 | PULSE |
| Transaction throughput | 1M+ TPS | TigerBeetle (Global FinTech) |
| Transaction latency | <1ms P50 | TigerBeetle |
| Molecular simulation speed | GPU-accelerated | Emergent (Vulkan) |
| Web dev iteration speed | <5s | Bolt.new |

---

## 🎯 Next Steps

1. **This session:** Review Claude-Mem + PULSE docs
2. **Tomorrow:** Install OpenManus + open-lovable
3. **This week:** Build first Claude Eco app (web dev or agent)
4. **This month:** Integrate fintech or scientific tools as needed

---

## 📞 Support & Links

| Tool | Docs | Community |
|---|---|---|
| Claude-Mem | https://claude-mem.dev/docs | Discord |
| PULSE | This repo | — |
| OpenCut | https://opencut.app | Discord |
| Bolt.new | https://bolt.new | GitHub Issues |
| Avogadro | https://avogadro.cc | Forum |
| OpenManus | https://github.com/FoundationAgents/OpenManus | Discord |
| Emergent | https://github.com/emer/emergent | GitHub Issues |
| Stitch | https://stitchdesign.ai | Email: hello@stackblitz.com |
| Global FinTech | Reference docs in project | — |
| open-lovable | https://github.com/firecrawl/open-lovable | GitHub Issues |

---

### 11. Pigsty — Enterprise PostgreSQL Infrastructure
**Status:** 📦 Available  
**Repo:** https://github.com/vonng/pigsty  
**Purpose:** Enterprise-grade PostgreSQL with HA, PITR, observability, 510 extensions

```bash
curl -fsSL https://repo.pigsty.io/get | bash -s v4.3.0
cd ~/pigsty
./configure -g     # generate config and passwords
./deploy.yml       # deploy on current node
```

**Features:**
- Self-healing HA clusters (Patroni + ETCD)
- PITR (Point-In-Time Recovery)
- Redis, MinIO, DuckDB as bonus modules
- 510 PostgreSQL extensions
- Victoria + Grafana monitoring
- Multi-kernel support (Citus, Babelfish, IvorySQL, etc.)

**WebUI:** http://admin_ip:80  
**Postgres:** admin_ip:5432

**Integration:** Primary data layer for Global FinTech, stock platform, and any data-heavy service.

---

### 12. Claude Code OpenTelemetry Monitoring
**Status:** 📦 Available  
**Repo:** https://github.com/your-org/claude-code-otel-monitoring  
**Purpose:** Complete observability stack for Claude Code usage + cost tracking

**Stack:**
- **OpenTelemetry Collector** — ingest metrics + logs
- **Prometheus** — metrics storage + PromQL queries
- **Loki** — log aggregation + LogQL queries
- **Grafana** — dashboards + alerts + visualization

**Features:**
- Real-time cost burn rate ($/hour)
- Token usage breakdown (input, output, cache creation, cache read)
- Cache hit rate % and efficiency
- Tool execution performance (latency, success/failure)
- User prompt logging (optional, privacy-aware)
- 14 MCP tools for querying metrics directly from Claude Code

**Setup:**
```bash
git clone https://github.com/your-org/claude-code-otel-monitoring.git
cd claude-code-otel-monitoring
docker-compose up -d

# Register MCP server
claude mcp add --transport stdio metrics -s user -- uv run --directory /path/to/mcp-server metrics-server

# Access dashboards
# Grafana: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9090
# Loki: http://localhost:3100
```

**MCP Tools (14 available):**
1. `get_current_cost` — Today's total USD cost
2. `get_token_usage` — Token breakdown by type
3. `get_cache_efficiency` — Cache hit rate %
4. `get_available_metrics` — Reference all Prometheus + Loki metrics
5. `get_recent_prompts` — Last N user prompts
6. `get_tool_results` — Recent tool execution logs
7. `query_prometheus` — Execute arbitrary PromQL
8. `query_loki` — Execute arbitrary LogQL
9. `list_dashboard_panels` — All Grafana panels (103 total)
10. `find_panel_by_name` — Search panels by keyword
11. `get_panel_query` — Extract panel's PromQL/LogQL
12. `explain_panel_query` — Break down panel query logic
13. `explain_promql_query` — Explain PromQL structure
14. `explain_logql_query` — Explain LogQL structure

**Pre-built Dashboards:**
- Claude Code Monitoring (costs, tokens, cache, performance)
- Tool Analysis (execution times, success rates, errors)
- Cost Forecast (daily/monthly projections)
- Cache Efficiency (hit rates, read patterns)

**Integration:** Monitor all Claude Eco services + API costs in real-time.

---

### 13. LunaRoute — AI Coding Assistant Proxy & Analytics
**Status:** 📦 Available  
**Repo:** https://github.com/erans/lunaroute  
**Purpose:** Local proxy with complete visibility into LLM interactions

**Features:**
- Dual passthrough (OpenAI + Anthropic simultaneously)
- Sub-millisecond overhead (0.1-0.2ms)
- Session recording (SQLite + JSONL)
- PII detection & redaction (emails, SSN, credit cards, phone)
- Web UI for session browsing
- 24 Prometheus metrics
- Token usage breakdown
- Tool performance analytics

**One-command setup:**
```bash
eval $(lunaroute-server env)
# Automatically configures:
# - ANTHROPIC_BASE_URL=http://127.0.0.1:8081
# - OPENAI_BASE_URL=http://127.0.0.1:8081/v1
# - Web UI at http://localhost:8082
```

**Features:**
- 100% API fidelity (zero-copy proxy)
- Automatic auth from env vars or client headers
- Session statistics on shutdown
- Grafana-compatible metrics
- Works with Claude Code, OpenAI Codex, OpenCode

**Integration:** Monitor all AI interactions across the ecosystem in real-time.

---

### 14. StockRecommendationPlatform — Multi-Agent Analysis
**Status:** 📋 Spec  
**Purpose:** Research-grade stock/options analysis via multi-agent framework

**Stack:**
- **Framework:** FastAPI + Uvicorn
- **Agents:** MarketData, Fundamentals, Technicals, Financials, Options, Risk, SentimentML
- **Data:** Polygon (primary) + yfinance (dev) → Redis
- **Persistence:** PostgreSQL (analysis runs, artifacts)
- **Frontend:** Next.js + TanStack Table for metrics
- **Orchestration:** asyncio supervisor + optional Temporal/LangGraph
- **Observability:** OpenTelemetry + Prometheus/Grafana

**Key features:**
- Single symbol and S&P 500 batch analysis
- Options metrics table (credit quality, liquidity, theta edge, gamma risk)
- Decision aids (research recommendations, not personalized advice)
- Agent-level failure handling (partial degradation, not abort)
- Data freshness timestamps (Polygon/Redis)

**Setup:**
```bash
git clone <repo>
cd StockRecommendationPlatform
pip install -r requirements.txt
export POLYGON_API_KEY=your_key
export REDIS_URL=redis://localhost:6379
export DATABASE_URL=postgresql://user:pass@localhost/stock_analysis
python -m pytest                    # run tests
uvicorn app.main:app --reload      # dev server
```

**API:**
- `POST /v1/analysis/run` — single symbol analysis
- `POST /v1/analysis/batch` — S&P 500 batch job
- `GET /v1/analysis/batch/{job_id}` — job status

**Phases:**
1. Polygon + Redis ingest + MVP agents
2. Postgres persistence + supervisor hardening
3. FinancialsAgent + batch universe
4. Options metrics UI + watchlists
5. Auth + alerts + screener

**Master plan:** See [`docs/MASTER_PLAN.md`](./docs/MASTER_PLAN.md) for full scope, architecture, testing, and SDLC.

---

### 15. Everything Claude Code — Multi-Platform Agent Framework
**Status:** ✅ Integrated  
**Scope:** 13 agents, 50+ skills, 32 commands, 8 hooks, 29 rules  
**Purpose:** Battle-tested AI agent orchestration framework with cross-platform support
**Maturity:** Production (10+ months evolution, Anthropic hackathon winner)

**Platforms Supported:**
- Claude Code (web/CLI/desktop/IDE extensions)
- Cursor IDE (native integration)
- Codex CLI (command-line interface)
- OpenCode (alternative framework)

**Core Components:**

**13 Agents (Task Delegation):**
1. `claude` — catch-all general-purpose agent
2. `claude-code-guide` — Claude Code/Claude API usage questions
3. `Explore` — fast read-only code search agent
4. `general-purpose` — complex research & multi-step tasks
5. `Plan` — software architect for implementation strategies
6. `code-reviewer` — independent code review & analysis
7. `security-reviewer` — security & privacy audits
8. `ab-test-analyzer` — A/B test analysis & optimization
9. `seo-writer` — SEO-optimized content generation
10. `social-media` — social media content + scheduling
11. `frontend-design` — production-grade UI design
12. `backend-architect` — backend architecture planning
13. `cloud-ops` — cloud infrastructure & DevOps

**91+ Skills (Specialized Workflows):**

*Marketing (40 Skills):*
- **Conversion Optimization:** cro, signup, onboarding, popups, paywalls
- **Content & Copy:** copywriting, copy-editing, cold-email, emails, social, image
- **SEO & Discovery:** seo-audit, ai-seo, programmatic-seo, site-architecture, competitors, schema, aso
- **Paid & Distribution:** ads, ad-creative, public-relations
- **Measurement & Testing:** analytics, ab-testing
- **Retention:** churn-prevention
- **Growth Engineering:** co-marketing, free-tools, referrals
- **Strategy & Monetization:** marketing-ideas, marketing-psychology, launch, pricing
- **Sales & RevOps:** revops, sales-enablement, prospecting, directory-submissions, customer-research
- **Content Strategy:** content-strategy, product-marketing, marketing-plan

*Video & Creative:*
- `hyperframes`, `hyperframes-cli`, `hyperframes-registry` — HyperFrames HTML video
- `remotion`, `remotion-to-hyperframes` — Remotion authoring + porting
- `website-to-hyperframes` — capture websites into video
- `higgsfield-to-hyperframes` — Higgsfield AI → HyperFrames
- `replicate` — multi-model image/video/music generation
- `gsap` — GSAP animation library reference

*Site Building:*
- `/site-build` — four-stage pipeline orchestrator
- `/site-sitemap`, `/site-wireframe`, `/site-styleguide`, `/site-design` — individual stages
- `/rhythmix-site` — RHYTHMIX-aware wrapper (locked brand system)

*Specification & Planning:*
- `/spec-quick`, `/spec-analyze`, `/spec-run` — full spec lifecycle
- `/spec-to-repo` — scaffold repo from spec
- `/rhythmix-spec` — RHYTHMIX campaign specs
- `/to-prd`, `/to-issues`, `/triage` — artifact generation

*Engineering Workflows:*
- `/grill-with-docs` — plan interview + ADR documentation
- `/diagnose` — disciplined bug/perf-regression loop
- `/tdd` — red-green-refactor cycle
- `/improve-codebase-architecture` — refactor & navigation
- `/prototype`, `/grill-me`, `/handoff`, `/caveman` — productivity sprints
- `/write-a-skill` — custom skill scaffolding
- `/claude-api` — Claude API + prompt caching
- `/docker-development` — Docker-based workflows
- `/using-git-worktrees` — parallel feature branches
- `/finishing-a-development-branch` — pre-merge checklist
- `/verification-before-completion` — test verification
- `/dispatching-parallel-agents` — fan-out orchestration
- `/subagent-driven-development` — multi-agent task coordination

*Product & SaaS:*
- `/product-analytics`, `/product-discovery`, `/product-strategist`
- `/saas-metrics-coach`, `/saas-scaffolder`
- `/seo-audit`, `/slo-architect`
- `/experiment-designer`, `/feature-flags-architect`
- `/observability-designer`, `/runbook-generator`
- `/landing`, `/landing-page-generator`
- `/ui-design-system` — design system authoring
- `/revenue-operations`, `/financial-analyst`
- `/competitive-teardown`, `/customer-success-manager`
- `/env-secrets-manager` — env & secrets management
- `/prompt-governance`, `/llm-cost-optimizer`
- `/dependency-auditor`, `/data-quality-auditor`
- `/gdpr-audit-prep` — compliance preparation

*Creative Assets:*
- `/dream` — one-shot asset generation (image/video/music/voice/site)
- `/album-launch` — parallel cover art + track + promo + landing

*Integration & Editing Skills:*
- `huggingface-best`, `huggingface-papers`, `huggingface-datasets` — HuggingFace ecosystem
- `zapier-workflows` — Zapier automation integration
- `humanizer` — Remove AI writing patterns (33 pattern detection)
- OpenClaw CLI skills (when egress unrestricted)

**32 Commands (Slash Commands):**
- `/help` — usage help
- `/fast` — toggle fast mode (Opus with faster output)
- `/spec-*` (6 commands) — specification workflow
- `/site-*` (5 commands) — site-building pipeline
- `/rhythmix-*` (3 commands) — RHYTHMIX-specific workflows
- `/dream` — asset generation
- `/album-launch` — parallel launch orchestration
- `/mem-search`, `/mem-get-observation` — Claude-Mem integration
- `/learn-codebase` — memory front-load (5 min)
- Production/SaaS commands (10+) — analytics, design, operations

**8 Hook Event Types (Automation):**
1. `SessionStart` — memory injection + health check
2. `UserPromptSubmit` — logging + validation
3. `PostToolUse` — result capture + artifacts
4. `ToolUseAfterResponse` — async processing
5. `PreToolUse` — permission gates + validation
6. `PostResponse` — analytics logging
7. `Stop` — session end capture
8. `SessionEnd` — full session summary

**29 Rules (Enforcement):**
- Token efficiency (PULSE integration)
- Code quality gates (tests, linting, edge cases)
- Security rules (no destructive ops without confirmation)
- Naming conventions (domain language from CONTEXT.md)
- Architecture enforcement (ADR compliance)
- Performance benchmarks
- Data privacy (PII handling)
- API contract validation

**MCP Server Configurations:**
```json
{
  "creative-stack": "node .claude/mcp/creative-stack/server.mjs",
  "higgsfield": "higgsfield-mcp",
  "pollinations": "npx -y @pollinations/model-context-protocol",
  "playwright": "npx -y @playwright/mcp@latest",
  "claude-playwright": "node node_modules/claude-playwright/dist/mcp/server.cjs",
  "context7": "https://mcp.context7.com/mcp",
  "github": "mcp-github-server",
  "supabase": "mcp-supabase-server",
  "vercel": "mcp-vercel-server",
  "railway": "mcp-railway-server"
}
```

**Integration with Claude Eco:**
- **Observability:** Everything Claude Code operations monitored via Claude Code OpenTelemetry Monitoring (tool #12)
- **Analytics:** LunaRoute (tool #13) captures all multi-agent interactions for cost & performance tracking
- **Persistence:** PostgreSQL via Pigsty (tool #7) stores skill artifacts, specs, ADRs, execution history
- **Token Optimization:** PULSE protocol (tool #2) baked into agent frameworks
- **Memory:** Claude-Mem (tool #1) retains cross-session context for all agents
- **Data Sources:** Context7 MCP + Hugging Face skills for up-to-date library docs & datasets

**Setup:**
```bash
# Clone or pull latest repo with framework
git clone <repo> || git pull origin main

# Copy framework into .claude/ directory
cp -r docs/agents/ .claude/agents/
cp -r docs/skills/ .claude/skills/
cp -r .claude/mcp/ configs/

# Register MCP servers (in .mcp.json)
# + set CONTEXT7_API_KEY in .env

# Enable hooks in .claude/settings.json
{
  "hooks": {
    "session-start": ".claude/hooks/session-start.sh",
    "pre-tool-use": ".claude/hooks/pre-tool-use.sh",
    "post-tool-use": ".claude/hooks/post-tool-use.sh"
  }
}

# Verify installation
/help                          # all commands
/mem-search "recent work"      # memory integration
/spec-quick "your task"        # test spec pipeline
```

**Multi-Language Support:**
- TypeScript/JavaScript (50+ skills)
- Python (Django/FastAPI patterns)
- Go (microservices)
- C++ (systems programming)
- Java (Spring Boot)
- Rust (systems/CLI)

**Cost Optimization Defaults:**
- Model selection: Sonnet (general), Haiku (simple tasks)
- Thinking budget: 10k tokens (complex reasoning)
- Context compression: 50% threshold auto-compact
- MCP routing: local-first, cloud fallback
- Parallel agents: Haiku for reads, Sonnet for writes

**Documentation:**
- Comprehensive guides (shorthand + longform)
- 30+ code examples across 6 languages
- GitHub marketplace integration
- Community contributions tracker
- Contributing guidelines
- Extensive FAQ

**Current Ecosystem Integration Status:**
```
Everything Claude Code v1.0.0
├── 13 agents ✅
├── 50+ skills ✅
├── 32 commands ✅
├── 8 hooks ✅
├── 29 rules ✅
├── 10+ MCP servers ✅
├── Multi-platform support (4 platforms) ✅
└── Production-ready maturity ✅
```

---

### 16. System Design Primer — Interview & Architecture Reference
**Status:** ✅ Integrated  
**Source:** Donne Martin (CC BY 4.0)  
**Repository:** https://github.com/donnemartin/system-design-primer  
**Purpose:** Comprehensive guide for designing large-scale systems and interview preparation

**Coverage:**
- 4-step system design interview approach
- Core concepts: scalability, latency, availability, CAP theorem
- Database patterns: replication, sharding, federation, denormalization
- Caching strategies: cache-aside, write-through, write-behind, refresh-ahead
- Communication: TCP, UDP, HTTP, RPC, REST
- Real-world architectures: Twitter, Facebook, Instagram, Netflix, Uber, WhatsApp

**Key Patterns:**
- Horizontal vs vertical scaling
- Load balancing (Layer 4 vs Layer 7)
- Master-slave vs master-master replication
- SQL vs NoSQL trade-offs
- Microservices and service discovery

**Integration Points:**
- **System Design Interview Skill** — `/system-design-interview` for prep
- **Applied to Stock Platform** — Real-time analysis, high throughput
- **Applied to Marketing Platform** — Event streaming, analytics
- **Applied to Observability** — OpenTelemetry, Prometheus, Grafana patterns
- **Applied to LunaRoute** — Session recording, analytics

**Usage:**
```bash
/system-design-interview

# Or reference directly:
SYSTEM-DESIGN-PRIMER.md
```

**Topics Referenced:**
1. CAP theorem → Database choices (Pigsty, Redis)
2. Load balancing → Reverse proxy, API gateway
3. Caching strategies → Redis configuration
4. Replication patterns → PostgreSQL master-slave
5. Sharding → Stock Platform data distribution
6. Asynchronism → Message queues, task workers
7. Microservices → Everything Claude Code agents
8. Monitoring → OpenTelemetry collector patterns

---

### 17. Remotion — React-Based Programmatic Video Creation
**Status:** ✅ Integrated  
**Repo:** https://github.com/remotion-dev/remotion  
**NPM:** `remotion` (v4+)  
**Purpose:** Create videos using React components, CSS, Canvas, SVG, WebGL, and algorithms
**License:** Proprietary (requires commercial license in some cases)

**Why Remotion:**
- **React composition** — Reusable components, props, state management
- **Web technologies** — CSS animations, Canvas, SVG, WebGL for pixel-perfect graphics
- **Programming leverage** — Variables, functions, APIs, math for generative effects
- **Scalability** — Generate thousands of unique videos from data

**Key Concepts:**

*Composition* — Container for video with duration, resolution, frame rate:
```jsx
<Composition
  id="MyVideo"
  component={VideoComponent}
  durationInFrames={300}   // 10 seconds at 30fps
  fps={30}
  width={1920}
  height={1080}
/>
```

*Frame-based Animation* — Drive animations via frame number:
```jsx
const { frame } = props;
const progress = frame / 30;  // linear 30-frame animation
const scale = spring({ fps: 30, frame, config: { damping: 10 } });
```

*Components* — Built-in: Text, Image, Audio, Video, Sequence, AbsoluteFill

*Animation Patterns*:
- Spring animations: `spring({ fps, frame, config })`
- Linear interpolation: `interpolate(frame, [0, 30], [0, 1])`
- Easing functions: Bezier curves, spring dynamics
- Conditional rendering: Show/hide scenes by frame range

**Use Cases:**
- Personalized videos (GitHub Unwrapped, birthday videos, certificates)
- Programmatic content (stock animations, weather forecasts, analytics dashboards)
- Dynamic templates (reusable video templates with props)
- Generative art (fractals, noise-based animations, particle systems)

**Development:**
```bash
npx create-video@latest
npm start            # Remotion Studio at localhost:3000
npm run build        # Static export for deployment
```

**Export:**
```bash
npx remotion render MyVideo output.mp4 \
  --width 1920 \
  --height 1080 \
  --crf 18 \
  --codec h264 \
  --concurrency 4
```

**Performance Tips:**
- Memoize components to prevent re-renders
- Use Workers for heavy computation
- Lazy load media (don't load all assets at once)
- Optimize images before use
- Use Canvas for heavy graphics (more efficient than DOM)

**Comparison with HyperFrames (RHYTHMIX pipeline):**
- **Choose Remotion for:** Complex logic, data-driven content, full React ecosystem needed
- **Choose HyperFrames for:** Simple animations, quick render times, CSS/GSAP sufficient

**Integration Points:**
- **RHYTHMIX Video Pipeline** — Can coexist with HyperFrames; use for data-heavy promos
- **Stock Platform** — Animate analysis results, generate custom investor reports
- **Everything Claude Code** — `/dream` skill routes to Remotion for complex videos
- **Marketing Platform** — Batch generate personalized promo videos for users

**Skill Usage:**
```bash
/remotion-videos
# → Comprehensive Remotion documentation and examples
# → Covers all core patterns, components, performance tips
```

---

### 18. Impeccable — AI-Driven Frontend Design Skill
**Status:** ✅ Integrated  
**Repo:** https://github.com/pbakaus/impeccable  
**NPM:** `impeccable`  
**Purpose:** Eliminate generic AI design tells; build production-grade, distinct interfaces with 23 commands and 41 deterministic anti-pattern rules
**License:** Apache 2.0

**Why Impeccable:**

Every LLM trained on same SaaS templates produces identical design tells:
- Inter font everywhere
- Purple-to-blue gradients
- Nested card layouts
- Gray text on colors
- Bounce easing

**Impeccable fixes this with:**
1. **One setup** — `/impeccable init` writes PRODUCT.md + DESIGN.md context
2. **23 commands** — Shared vocabulary: `audit`, `polish`, `critique`, `distill`, `animate`, `bolder`, `quieter`, `craft`, and more
3. **41 detector rules** — No LLM calls, no API key; catches AI slop instantly
4. **Live iteration** — Browser-based variant testing

**Installation:**

```bash
# Project root
npx impeccable skills install
```

Auto-detects harness (Claude Code, Cursor, Codex, OpenCode, etc.), installs to right location, and sets up optional design hook (auto-runs detector on UI file edits).

**Quick Start:**

```bash
/impeccable init              # One-time setup
/impeccable craft             # Full shape-then-build
/impeccable audit             # Find issues (41 rules)
/impeccable polish            # Final pass
/impeccable live              # Browser iteration
```

**23 Commands:**

| Command | Purpose |
|---|---|
| `init` | Setup context, write PRODUCT.md + DESIGN.md |
| `craft` | Full shape-then-build flow |
| `shape` | Plan UX/UI before code |
| `document` | Extract DESIGN.md from existing code |
| `extract` | Pull components + tokens into system |
| `critique` | UX design review (hierarchy, clarity, resonance) |
| `audit` | Technical QA (a11y, performance, responsive) |
| `polish` | Final pass, design system alignment |
| `harden` | Error handling, i18n, edge cases |
| `onboard` | First-run flows, empty states |
| `bolder` | Amplify boring designs |
| `quieter` | Tone down overly bold designs |
| `distill` | Strip to essence |
| `animate` | Add purposeful motion |
| `colorize` | Introduce strategic color |
| `typeset` | Fix fonts, hierarchy, sizing |
| `layout` | Fix layout, spacing, rhythm |
| `delight` | Add joy and personality |
| `overdrive` | Technically extraordinary effects (3D, WebGL) |
| `clarify` | Improve UX copy |
| `adapt` | Adapt for different devices |
| `optimize` | Performance improvements |
| `live` | Visual variant iteration in browser |

**41 Detector Rules:**

Catches without LLM:
- AI slop (purple gradients, bounce easing, nested cards, icon tiles)
- Accessibility (gray on color, missing alt text, contrast)
- Quality (line length, padding, touch targets, skipped headings)
- CSS/structure (hardcoded colors, missing viewports, z-index chaos)

**Files Generated:**

- `PRODUCT.md` — Product context (name, audience, brand lane, voice, anti-references)
- `DESIGN.md` — Design system (colors, type, components, spacing)
- `.impeccable/config.json` — Shared team rules
- `.impeccable/config.local.json` — Machine-local settings (gitignored)

**Platform Support:**

Claude Code, Cursor (Nightly), OpenCode, Pi, Gemini CLI, Codex, VS Code Copilot, GitHub Copilot, Trae, Rovo Dev, Qoder, Kiro

**Design Hook (Automatic Quality Gates):**

On Claude Code, Cursor, Codex: auto-runs 41 detector rules on every UI file edit. No API key needed. Surfaces findings to agent flow instantly.

**Integration with Claude Ecosystem:**

- **Everything Claude Code** — Complements `frontend-design` skill; `/dream` auto-routes UI generation
- **Site-build pipeline** — `/site-design` stage calls `/impeccable craft` for component iteration
- **Pigsty** — Store design system versions, log audit runs
- **LunaRoute** — Monitor design tool performance
- **Observability** — Metrics: audit runtime, issues found, hook performance

**CLI (No Harness):**

```bash
npx impeccable detect src/              # Scan directory
npx impeccable detect index.html        # Scan file
npx impeccable detect https://example.com  # Scan URL
npx impeccable detect --fast --json .   # Regex-only, JSON
```

---

### 19. Plan Enforcer — Explicit Execution Without Deviation
**Status:** ✅ Integrated  
**Version:** 1.0.0  
**Purpose:** Lock plans, execute step-by-step, prevent mid-execution deviations and scope creep
**License:** MIT

**Core feature:** Zero deviation execution
- `/plan-enforcer lock <plan>` — Lock spec as execution contract
- `/plan-enforcer step` — Get next task only
- `/plan-enforcer verify <task-id>` — Verify task complete against success criteria
- `/plan-enforcer status` — Track progress, deviations, time remaining
- `/plan-enforcer defer <description>` — Defer off-plan work as follow-up task
- `/plan-enforcer complete` — Sign off: all tasks done, ready to merge

**Prevents:**
- Mid-execution scope creep ("let me just add this")
- Forgotten steps (task list is contract)
- Forgotten context (success criteria are explicit)
- Merge conflicts from direction changes (locked plan enforces direction)

**Integration:**
- Works with `/spec-writer` output (structured specs)
- Works with `/spec-run` (tracks parallel agent work)
- Works with Plan Mode (`Shift+Tab` in Claude Code)

**Example:**
```bash
/spec-quick "OAuth integration" → specs/oauth/tasks.md
/plan-enforcer lock specs/oauth/tasks.md
/plan-enforcer step   # T1: Create OAuth schema
# ... work on T1 ...
/plan-enforcer verify T1  # ✓ Complete
/plan-enforcer step   # T2: Implement endpoints
# Temptation: "Let me refactor user model" (not on plan)
/plan-enforcer defer "Refactor user model"  # Deferred as follow-up
/plan-enforcer step   # Continue with T2
```

---

### 20. Spec Writer — Structure & Clarity for Better Plans
**Status:** ✅ Integrated  
**Version:** 1.0.0  
**Purpose:** Write specs that prevent ambiguity, scope creep, rework. Structured generation with clarity scoring.
**License:** MIT

**Core features:**
- `/spec-writer init <description>` — Wizard: answer clarifying questions, generate structured spec
- `/spec-writer ambiguity` — Find vague language, suggest fixes
- `/spec-writer clarity` — Score clarity 0-100, suggest improvements
- `/spec-writer dependencies` — Map task dependencies, find critical path
- `/spec-writer cross-check <project>` — Verify against project conventions
- `/spec-writer estimate` — Total effort + per-task breakdown

**Output:** Structured spec with:
- **Requirements:** Functional, non-functional, constraints
- **Design:** Happy path, error paths, schema changes, API design
- **Tasks:** T1-Tn with effort, dependencies, success criteria (testable, not subjective)

**Prevents:**
- Vague specs ("works well", "simple", "fast")
- Scope ambiguity ("build checkout" — does it include shipping? discounts? refunds?)
- Rework ("we should have discussed this")
- Realistic estimates (no surprises)

**Clarity scoring:**
- <60: Many ambiguities
- 60-80: Some ambiguities (improve)
- 80+: Clear enough to build
- Target: 85+

**Example:**
```bash
/spec-writer init "checkout with payments"
# Answers:
# - Payment processors? (Stripe)
# - Currencies? (USD + EUR)
# - Shipping? (Physical goods)
# - Success metric? (<2sec load, >99.5% success rate)

# Generates: specs/checkout/{requirements,design,tasks}.md

/spec-writer clarity
# Clarity: 87/100 ✓

/spec-writer dependencies
# Critical path: T1 → T2 → T4 → T5 → T7 (13h)
# Parallel: T3, T6 (5h)
# Total: 15h

/plan-enforcer lock specs/checkout/tasks.md
# Ready to execute
```

---

### 21. Scope Reviewer — Catch Creep Before Merge
**Status:** ✅ Integrated  
**Version:** 1.0.0  
**Purpose:** Detect scope creep, flag off-plan changes, prevent mid-PR deviations
**License:** MIT

**Core features:**
- `/scope-reviewer baseline <spec>` — Lock spec as baseline for reviews
- `/scope-reviewer review` — Check current changes: on-plan or creep?
- `/scope-reviewer defend <justification>` — Justify off-plan changes (must be convincing)
- `/scope-reviewer status` — Creep impact, changes by type, risk level
- `/scope-reviewer final-check` — Pre-merge: all criteria met?
- `/scope-reviewer deferred-list` — Off-plan work + effort (for follow-up PR)

**Creep categories:**
- **Optimization (premature)** — "Let me cache this" (not on spec)
- **Refactoring (unplanned)** — "User model needs cleanup" (not on spec)
- **"While we're at it"** — Extra features (Apple Pay, when only Stripe was spec'd)
- **Discovery (legitimate)** — "Postgres version incompatible" (blocker, not creep)

**Risk assessment:**
- **Low:** Docs, comments, non-critical code
- **Medium:** Business logic, isolated changes
- **High:** Auth, payment, core paths
- **Critical:** Architectural changes

**Prevents:**
- Scope creep ("let me just add...")
- Premature optimization
- Unplanned refactoring
- Project overruns
- Mid-PR direction changes

**Example:**
```bash
/scope-reviewer baseline specs/checkout/tasks.md
# All future changes reviewed against this

# You write code for T1 (schema)
# But also refactor user_model (off-plan)

/scope-reviewer review
# ⚠️ OFF-PLAN: User model refactor (45 LOC, Medium risk)
# 
# Options:
# 1. Defer: Add as follow-up task
# 2. Descope: Remove, focus on T1
# 3. Defend: "Critical for OAuth email validation"

/scope-reviewer defend "User model email validation critical for OAuth"
# ✓ JUSTIFIED (now documented)

/scope-reviewer final-check
# ✓ Original plan: 7h
# ✓ Actual with justified change: 7.5h
# ✓ Creep: +7% (acceptable, <30%)
# Ready to merge
```

---

### 22. Local LLM Suite — Ollama Integration
**Status:** ✅ Integrated  
**Version:** 1.0.0  
**Purpose:** Run local LLM inference (Llama2, Mistral, Qwen2, Neural-Chat). API fallback, cost optimization, privacy-first, offline development.
**License:** MIT + Model Licenses

**Four models included:**

| Model | Size | Speed | Best For | VRAM |
|---|---|---|---|---|
| **Llama2** | 7B/13B/70B | Fast | General purpose, balanced | 6GB |
| **Mistral** | 7B | Very fast | Speed-critical tasks | 5GB |
| **Qwen2** | 7B/14B | Fast | Quality, multilingual, math/coding | 6GB |
| **Neural-Chat** | 7B | Fast | Dialogue, conversation | 5GB |

**Installation:**
```bash
# Install Ollama
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
# Windows: Download from https://ollama.ai/download

# Pull models
ollama pull llama2 mistral qwen2 neural-chat

# Start server
ollama serve
# Server: http://localhost:11434
```

**Use Cases:**
1. **API Fallback** — Claude down? Use local Llama2 (free, instant)
2. **Cost Optimization** — High-volume inference locally ($0 vs $0.01-0.03/1K tokens)
3. **Privacy** — Keep data local, no external API calls
4. **Multi-Model Comparison** — Test same task on all four models
5. **Offline Development** — Build features without internet

**Integration with my-api:**
```python
# Hybrid client: Claude with Ollama fallback
class HybridLLMClient:
    def generate(prompt: str) -> dict:
        try:
            return query_claude(prompt)  # Primary
        except:
            return query_ollama("llama2", prompt)  # Fallback
```

**Performance:**
- Mistral: 12-14 tokens/sec
- Llama2: 8-10 tokens/sec
- Qwen2: 7-9 tokens/sec
- Memory: 5-6GB per model

**Integration with Ecosystem:**
- **my-api:** Add as fallback in FastAPI endpoints
- **Stock Platform:** Use local Qwen2 for analysis fallback
- **Scope Reviewer:** Use local models for independent code review
- **Development:** Fast iteration without API latency

---

### 23. Kickbacks — Monetize IDE Thinking Time
**Status:** ✅ Integrated  
**Version:** 1.0.0  
**Purpose:** Turn Claude Code / Codex thinking spinner into sponsored ad slots. Passive income via English-ascending auction, up to 50% revenue share.
**License:** Proprietary (source-available)

**Ad Surfaces:**
- Spinner overlay (Claude Code VS Code panel)
- Thinking-shimmer (Codex VS Code panel)
- Status-bar line (Claude Code terminal CLI)
- Spinner verb (Claude Code terminal CLI)

**How It Works:**
1. Install from VS Code Marketplace
2. Sign in with Google
3. Earnings start immediately
4. Check status bar: `Kickbacks ($X.XX today · $Y.YY)`

**Revenue Model:**
- Advertisers buy blocks (1,000 impressions per block)
- English-ascending auction determines placement
- Clicks worth 50× impressions
- Up to 50% of revenue credited per impression + click

**Earnings Potential:**
- Conservative: $0.05-0.25/day ($1.50-7.50/month)
- Power users: $0.80-1.20/day ($24-36/month)
- At scale (100 users): $150-750/month collective

**For Advertisers:**
- Visit kickbacks.ai
- Set bid per 1,000 impressions
- Upload one-line ad creative
- Set budget
- Go live to most technical audience on earth

**Safety:**
- No personal data collected
- Token sealed in OS keychain
- Telemetry is idempotent (no double-counting)
- Code is public + auditable (read-only mirror)
- Server-controlled killswitch available
- Payouts guaranteed via Stripe

**Integration with Ecosystem:**
- Custom extensions (Plan Enforcer, Spec Writer, etc.) can monetize thinking time
- Thinking events = impressions = revenue
- Scale with user adoption
- 100+ thinking moments/day for power users

---

## 🔌 Complete Integration Map

### Data Layer (Pigsty)
```
Pigsty (PostgreSQL + Redis + MinIO)
├── StockRecommendationPlatform (analysis runs, metrics)
├── Global FinTech (ledger, user data, transactions)
└── All other services (unified data backbone)
```

### Application Layer
```
FastAPI / Next.js Apps
├── StockRecommendationPlatform (analysis API + UI)
├── Global FinTech Admin Dashboard (via open-lovable)
├── OpenManus Agents (custom workflows)
└── Stitch Design System (UI components)
```

### Observability
```
OpenTelemetry → Prometheus/Grafana (Pigsty built-in + custom)
├── API latency & throughput
├── Agent execution times + failures
├── Polygon ingest rates + errors
├── Database query performance
└── Infrastructure health (CPU, memory, disk)
```

### Orchestration & Automation
```
OpenManus + LangGraph
├── MarketData → Analysis → Recommendations
├── Risk scoring workflows
├── Batch analysis jobs
├── Scheduled data syncs
└── Alert triggers
```

---

## 📊 Ecosystem Maturity Matrix

| Component | Install | Config | Test | Deploy | Monitor | Notes |
|---|---|---|---|---|---|---|
| Claude-Mem | ✅ | ✅ | ✅ | ✅ | ✅ | Persistent memory active |
| PULSE | ✅ | ✅ | ✅ | ✅ | ✅ | Token efficiency rules |
| Everything Claude Code | ✅ | ✅ | ✅ | ✅ | ✅ | 13 agents, 50+ skills, 32 commands, production-ready |
| Claude Code OTel | 📦 | 📋 | 📋 | 📋 | 📋 | 14 MCP tools, 103 dashboard panels |
| LunaRoute | 📦 | 📋 | 📋 | 📋 | 📋 | AI proxy, session recording, PII redaction |
| Pigsty | 📦 | 📋 | 📋 | 📋 | 📋 | ~30 min setup |
| StockPlatform | 📋 | 📋 | 📋 | 📋 | 📋 | Spec complete, build in progress |
| OpenManus | 📦 | 📋 | 📋 | 📋 | 📋 | AI agent framework ready |
| open-lovable | 📦 | 📋 | 📋 | 📋 | 📋 | Web dev agent ready |
| Stitch | 📦 | 📋 | 📋 | 📋 | 📋 | Design tool ready |
| Emergent | 📦 | 📋 | 📋 | 📋 | 📋 | Neural networks (if needed) |
| Avogadro | 📦 | 📋 | 📋 | 📋 | 📋 | Molecular modeling (if needed) |
| OpenCut | 📦 | 📋 | 📋 | 📋 | 📋 | Video editing (if needed) |
| Bolt.new | ☁️ | ✅ | ✅ | ✅ | ✅ | Cloud-hosted, no local setup |
| Global FinTech | 📋 | 📋 | 📋 | 📋 | 📋 | Reference architecture |
| Remotion | ✅ | ✅ | ✅ | ✅ | ✅ | React video framework, integrated |
| Impeccable | ✅ | ✅ | ✅ | ✅ | ✅ | AI design skill, 41 detector rules, integrated |
| Plan Enforcer | ✅ | ✅ | ✅ | ✅ | ✅ | Lock plans, execute step-by-step, prevent deviations |
| Spec Writer | ✅ | ✅ | ✅ | ✅ | ✅ | Structured specs, clarity scoring, dependency mapping |
| Scope Reviewer | ✅ | ✅ | ✅ | ✅ | ✅ | Detect creep, flag off-plan changes, deferred task tracking |
| Local LLM Suite | ✅ | ✅ | ✅ | ✅ | ✅ | Ollama: Llama2, Mistral, Qwen2, Neural-Chat local inference |
| Kickbacks | ✅ | ✅ | ✅ | ✅ | ✅ | Monetize thinking spinner: ads, auction, 50% revenue share |

**Legend:** ✅ = active | 📋 = planned/spec | 📦 = available | ☁️ = cloud-hosted

---

## 🚀 Quick Start (Install Everything)

### Prerequisites
```bash
node >= 20
python >= 3.12
docker + docker-compose
git
```

### Phase 1: Core (1 hour)
```bash
# Already installed
# Claude-Mem ✅
# PULSE ✅

# Setup Pigsty (enterprise database)
curl -fsSL https://repo.pigsty.io/get | bash -s v4.3.0
cd ~/pigsty && ./configure -g && ./deploy.yml
# WebUI: http://localhost (admin/admin)
# Postgres: localhost:5432

# Clone stock platform
git clone <stock-platform-repo>
cd StockRecommendationPlatform
pip install -r requirements.txt
export POLYGON_API_KEY=your_key
pytest
```

### Phase 2: AI Agents (30 min)
```bash
# OpenManus (build AI agents)
git clone https://github.com/FoundationAgents/OpenManus.git
cd OpenManus && uv pip install -r requirements.txt

# Stitch (design system)
gemini extensions install https://github.com/gemini-cli-extensions/stitch --auto-update

# open-lovable (web dev agent)
git clone https://github.com/firecrawl/open-lovable.git
cd open-lovable && pnpm install
```

### Phase 3: Creative Tools (as needed)
```bash
# OpenCut (video editor)
git clone https://github.com/opencut-app/opencut-classic.git

# Emergent (neural networks)
git clone https://github.com/emer/emergent.git

# Avogadro (molecular modeling)
brew install avogadro2  # or linux equivalent
```

---

## 📋 Implementation Roadmap

| Week | Deliverable |
|---|---|
| **Now** | Pigsty deployed; StockPlatform Polygon ingest wired |
| **+1** | Redis caching + agent framework online |
| **+2** | Postgres persistence + supervisor hardening |
| **+3** | Options metrics UI + first batch job |
| **+4** | OpenManus integration + custom workflows |
| **+5** | Observability dashboard (OTel + Grafana) |
| **+6** | Auth + rate limits + production hardening |
| **+8** | Watchlists, alerts, screener |

---

**Built with ❤️ for the Claude Ecosystem**

Version: 1.11.0  
Updated: 2026-06-14  
Status: Complete 23-Tool Ecosystem + System Design Reference + Video & Design Frameworks + Planning & Execution Discipline + Local LLM Inference + Monetization Layer + 92+ Skills + 200+ Agents — Production-Ready

### Changelog
- **v1.11.0** — Kickbacks (IDE thinking spinner monetization with auction-based ads)
- **v1.10.0** — Local LLM Suite (Ollama: Llama2, Mistral, Qwen2, Neural-Chat)
- **v1.9.0** — Plan Enforcer, Spec Writer, Scope Reviewer (execution discipline skills)
- **v1.8.0** — Impeccable (AI design skill with 41 detector rules) integration
- **v1.7.0** — Remotion (React-based programmatic video creation) integration
- **v1.6.0** — System Design Primer (Donne Martin) + interview prep skill integration
- **v1.5.0** — Marketing Skills v2.0 (40 skills) + 200+ OpenClaw agents for autonomous marketing
- **v1.4.0** — Everything Claude Code integration (13 agents, 50+ skills, 32 commands)
- **v1.3.0** — Added OpenTelemetry Monitoring + LunaRoute + StockPlatform (14 tools)
- **v1.2.0** — Expanded to Pigsty + Stitch + open-lovable + Emergent + Avogadro + OpenCut
- **v1.1.0** — Core registry: Claude-Mem, PULSE, OpenManus, Global FinTech, Bolt.new
- **v1.0.0** — Initial ecosystem blueprint
