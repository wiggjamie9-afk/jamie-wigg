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

## 🔧 TOOLS REGISTRY (14 Total)

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

Version: 1.1.0  
Updated: 2026-06-14  
Status: Production-Ready Blueprint
