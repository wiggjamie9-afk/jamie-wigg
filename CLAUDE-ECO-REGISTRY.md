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

## 🔧 TOOLS REGISTRY

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

**Built with ❤️ for the Claude Ecosystem**

Version: 1.0.0  
Updated: 2026-06-14  
Status: Production Ready
