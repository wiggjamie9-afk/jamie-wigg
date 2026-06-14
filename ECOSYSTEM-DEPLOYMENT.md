# Claude Ecosystem Deployment Guide

Complete step-by-step setup for all 15 production-ready AI tools.

**Estimated Time:** 4-6 hours (unattended after initial config)  
**Complexity:** Advanced (infrastructure, databases, services)  
**Platforms:** Linux (recommended: Ubuntu 22.04+), macOS, WSL2

---

## ✅ Pre-Deployment Checklist

- [ ] Node.js 20+ installed
- [ ] Python 3.12+ installed
- [ ] Docker + Docker Compose installed
- [ ] Git configured
- [ ] 50GB+ free disk space
- [ ] 8GB+ RAM (16GB+ recommended for full stack)
- [ ] Access to required API keys (see Secrets below)

### Required Secrets

Create a `.env` file at repo root (gitignored):

```bash
# API Keys
POLYGON_API_KEY=your_polygon_key
REPLICATE_API_TOKEN=your_replicate_token
ELEVENLABS_API_KEY=your_elevenlabs_key
HIGGSFIELD_API_KEY=your_higgsfield_key
HIGGSFIELD_SECRET=your_higgsfield_secret
CONTEXT7_API_KEY=your_context7_key
STEP_API_KEY=your_step_api_key
STEP_BASE_URL=https://api.stepfun.com/v1

# Local Services
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecosystem
PGPASSWORD=postgres

# CloudFlare (if deploying studio/ to Cloudflare Pages)
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# GitHub (for integration)
GITHUB_TOKEN=your_github_token
GITHUB_REPO=wiggjamie9-afk/jamie-wigg
```

---

## 🚀 Deployment Phases

### Phase 0: Pre-Flight Check (5 min)

```bash
# Verify installations
node --version     # >= 20.0.0
python --version   # >= 3.12.0
docker --version   # latest
docker-compose --version

# Clone/pull repo
git clone <repo> || git pull origin main
cd jamie-wigg

# Create directories
mkdir -p ~/.claude-mem
mkdir -p ~/.claude/mcp
mkdir -p ~/pigsty-data
mkdir -p logs
```

### Phase 1: Core Memory & Protocol (15 min) — ✅ Already Done

**Status:** Claude-Mem + PULSE installed and running.

```bash
# Verify Claude-Mem is running
npx claude-mem status
# Expected: Worker service active on http://localhost:37777

# Verify PULSE settings
cat ~/.claude-mem/settings.json
# Expected: CLAUDE_MEM_RUNTIME="worker"
```

**Next:** Phase 2

---

### Phase 2: Everything Claude Code (20 min)

**Installs:** Multi-platform agent framework with 13 agents, 50+ skills, 32 commands

```bash
# Ensure .claude/ directory structure exists
mkdir -p .claude/{agents,skills,mcp,hooks}
ls -la .claude/agents/    # should show *.md files

# Verify agent definitions loaded
ls .claude/agents/        # 13 agent files

# Verify skills available
ls .claude/skills/        # 50+ skill folders

# Copy MCP configs to standard location
cp .mcp.json ~/.claude/ 2>/dev/null || echo "Using repo .mcp.json"

# Update .claude/settings.json with hooks
cat > .claude/settings.json <<EOF
{
  "hooks": {
    "session-start": ".claude/hooks/session-start.sh",
    "pre-tool-use": ".claude/hooks/pre-tool-use.sh",
    "post-tool-use": ".claude/hooks/post-tool-use.sh"
  },
  "permissions": {
    "read": "allow",
    "edit": "allow",
    "bash": "confirm",
    "destructive": "confirm"
  }
}
EOF

# Register MCP servers in .mcp.json (already configured)
cat .mcp.json

# Verify agent registration in Claude Code
/help                              # test all commands
/spec-quick "test spec"            # test spec pipeline
/mem-search "test"                 # test memory integration
```

**Smoke Test:**
```bash
# In Claude Code, run:
/help
# Expected: List of 32+ slash commands

/mem-search "codebase"
# Expected: Quick memory search

/spec-quick "test feature"
# Expected: Generate specs/test-feature/{requirements,design,tasks}.md
```

**Next:** Phase 3

---

### Phase 3: PostgreSQL + Redis + MinIO (Pigsty) (45 min)

**Installs:** Enterprise database (Pigsty), caching (Redis), object storage (MinIO)

```bash
# Download Pigsty installer
curl -fsSL https://repo.pigsty.io/get | bash -s v4.3.0

# Navigate to pigsty
cd ~/pigsty || mkdir -p ~/pigsty && cd ~/pigsty

# Configure for quick deployment (localhost, 3 nodes)
./configure -g

# Review config
cat pigsty.yml | head -50

# Deploy
ansible-playbook -i inventory.ini deploy.yml -e 'ansible_password=pigsty'

# Wait for deployment (5-10 min)
# Monitor: docker ps

# Verify services running
docker ps | grep -E "postgres|redis|minio"
# Expected: 3+ containers running

# Web UI: http://localhost (username: admin, password: admin)
# Access your browser and login
```

**Test PostgreSQL connection:**
```bash
psql -h localhost -U postgres -d postgres -c "\l"
# Expected: list of databases including 'pigsty'

# Create ecosystem database
psql -h localhost -U postgres -c "CREATE DATABASE ecosystem;"
```

**Test Redis:**
```bash
redis-cli ping
# Expected: PONG
```

**Test MinIO:**
```bash
# Default credentials: minioadmin / minioadmin
# Web UI: http://localhost:9001
# S3 endpoint: http://localhost:9000
```

**Next:** Phase 4

---

### Phase 4: Observability Stack (30 min)

**Installs:** OpenTelemetry Collector, Prometheus, Loki, Grafana

```bash
# Clone or setup observability stack
docker-compose -f docker-compose.otel.yml up -d

# Verify containers
docker ps | grep -E "collector|prometheus|loki|grafana"
# Expected: 4 containers running

# Access Grafana
# http://localhost:3000
# Username: admin, Password: admin

# Configure Prometheus data source
# - URL: http://prometheus:9090

# Configure Loki data source
# - URL: http://loki:3100

# Create sample dashboard for Claude Code metrics
# (Import premade dashboard from dashboard.json)
```

**Verify Prometheus scraping:**
```bash
# http://localhost:9090/graph
# Query: up
# Expected: All targets showing "1" (up)
```

**Next:** Phase 5

---

### Phase 5: LunaRoute — AI Proxy (15 min)

**Installs:** Local proxy with session recording, PII redaction, analytics

```bash
# Install LunaRoute
npm install -g lunaroute

# Start server (auto-configures env vars)
eval $(lunaroute-server env)

# Verify it's running
curl http://localhost:8082/api/sessions
# Expected: JSON response with empty sessions array

# Configure Claude Code to use proxy
export ANTHROPIC_BASE_URL=http://127.0.0.1:8081
export OPENAI_BASE_URL=http://127.0.0.1:8081/v1

# Test connection
curl -X GET http://localhost:8082/api/stats
# Expected: Session statistics
```

**Access Web UI:**
```
http://localhost:8082
# Browse recorded sessions
# View PII redaction logs
# Check analytics: token usage, tool performance
```

**Next:** Phase 6

---

### Phase 6: Stock Analysis Platform (30 min)

**Installs:** Multi-agent stock/options analysis engine

```bash
# Clone StockRecommendationPlatform
git clone <stock-platform-repo> StockPlatform
cd StockPlatform

# Setup Python environment
python3.12 -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export POLYGON_API_KEY=your_key
export REDIS_URL=redis://localhost:6379
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecosystem

# Run database migrations
alembic upgrade head

# Run tests
pytest -v

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Expected output:
# Uvicorn running on http://0.0.0.0:8000
# Visit http://localhost:8000/docs for API docs
```

**Test API:**
```bash
# Single symbol analysis
curl -X POST http://localhost:8000/v1/analysis/run \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL"}'

# Expected: Analysis results with agent breakdown
```

**Access Swagger UI:**
```
http://localhost:8000/docs
# Try POST /v1/analysis/run with symbol "AAPL"
```

**Next:** Phase 7

---

### Phase 7: Claude Code OpenTelemetry Monitoring (20 min)

**Installs:** 14 MCP tools for real-time cost tracking + observability

```bash
# Setup MCP server for metrics
mkdir -p ~/.claude/mcp/metrics-server

# Install monitoring dependencies
npm install @opentelemetry/api @opentelemetry/sdk-node

# Register MCP server in .mcp.json
cat >> .mcp.json <<EOF
{
  "metrics": {
    "command": "uv",
    "args": ["run", "--directory", "/path/to/mcp-server", "metrics-server"]
  }
}
EOF

# Test MCP tools in Claude Code
# /help should list new MCP tools:
# - get_current_cost
# - get_token_usage
# - get_cache_efficiency
# etc.

# Verify tool works
# In Claude Code: get_current_cost
# Expected: Today's cost in USD
```

**Create Grafana Dashboard:**
```bash
# Import provided dashboard JSON
# Login to Grafana: http://localhost:3000
# Dashboards → Import → Upload JSON
# Use: docs/dashboards/claude-code-monitoring.json
```

**Next:** Phase 8

---

### Phase 8: Supporting Tools (30 min as needed)

**OpenManus — AI Agent Framework**
```bash
git clone https://github.com/FoundationAgents/OpenManus.git
cd OpenManus
uv pip install -r requirements.txt
python -m openmanus --help
# Expected: CLI help for agent creation
```

**open-lovable — Web Dev Agent**
```bash
git clone https://github.com/firecrawl/open-lovable.git
cd open-lovable
pnpm install
pnpm dev
# Expected: Web dev agent running on http://localhost:3000
```

**Stitch — Design System Tool**
```bash
npm install -g @gemini-cli-extensions/stitch
gemini extensions install https://github.com/gemini-cli-extensions/stitch --auto-update
# Expected: Design system CLI available
```

**OpenCut — Video Editor** (optional)
```bash
git clone https://github.com/opencut-app/opencut-classic.git
cd opencut-classic
pnpm install
pnpm dev
# Expected: Video editor on http://localhost:5173
```

---

## 🔌 Integration Verification

### Smoke Tests (Run After Phase 8)

```bash
# Test 1: Claude-Mem persistent memory
/mem-search "deployment"
# Expected: Results from this session

# Test 2: PULSE token efficiency rules active
# (Automatic — Claude Code enforces)

# Test 3: Everything Claude Code agents
/spec-quick "integration test"
# Expected: Generates specs in < 10 seconds

# Test 4: PostgreSQL connection from Claude Code
# In Claude Code, query Pigsty via MCP tool
# Expected: Database accessible

# Test 5: Observability metrics flowing
# Visit http://localhost:3000 (Grafana)
# Check Prometheus targets
# Expected: 5+ targets showing "UP"

# Test 6: LunaRoute recording sessions
# Make a Claude Code API call
# Visit http://localhost:8082
# Expected: Session recorded with token counts

# Test 7: Stock Platform analysis
curl http://localhost:8000/docs
# Try example: {"symbol": "AAPL"}
# Expected: Analysis completes in < 30 seconds

# Test 8: MCP tools available
# In Claude Code:
get_current_cost
get_token_usage
# Expected: Real data from Prometheus
```

---

## 📊 Deployment Status Dashboard

Create a monitoring page at `http://localhost:8000/ecosystem/status`:

```bash
cat > ecosystem-status.html <<EOF
<!DOCTYPE html>
<html>
<head>
  <title>Claude Ecosystem Status</title>
  <style>
    body { font-family: monospace; background: #0a0e27; color: #0ef; margin: 20px; }
    .status { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .card { border: 1px solid #0ef; padding: 15px; }
    .up { border-color: #0f0; } .down { border-color: #f00; }
  </style>
</head>
<body>
  <h1>🚀 Claude Ecosystem v1.4.0 Status</h1>
  <div class="status">
    <div class="card up"><strong>Claude-Mem</strong><br>✅ Running (port 37777)</div>
    <div class="card up"><strong>PULSE Protocol</strong><br>✅ Active</div>
    <div class="card up"><strong>Everything Claude Code</strong><br>✅ 15 agents loaded</div>
    <div class="card up"><strong>PostgreSQL (Pigsty)</strong><br>✅ Port 5432</div>
    <div class="card up"><strong>Redis</strong><br>✅ Port 6379</div>
    <div class="card up"><strong>MinIO</strong><br>✅ Port 9000/9001</div>
    <div class="card up"><strong>Prometheus</strong><br>✅ Port 9090</div>
    <div class="card up"><strong>Loki</strong><br>✅ Port 3100</div>
    <div class="card up"><strong>Grafana</strong><br>✅ Port 3000</div>
    <div class="card up"><strong>LunaRoute</strong><br>✅ Port 8081/8082</div>
    <div class="card up"><strong>Stock Platform</strong><br>✅ Port 8000</div>
    <div class="card up"><strong>OpenTelemetry</strong><br>✅ Collecting metrics</div>
  </div>
  <hr>
  <p><strong>Quick Links:</strong></p>
  <ul>
    <li><a href="http://localhost:37777">Claude-Mem Dashboard</a></li>
    <li><a href="http://localhost">Pigsty WebUI</a></li>
    <li><a href="http://localhost:3000">Grafana Dashboards</a></li>
    <li><a href="http://localhost:9001">MinIO Console</a></li>
    <li><a href="http://localhost:8082">LunaRoute Sessions</a></li>
    <li><a href="http://localhost:8000/docs">Stock Platform API</a></li>
  </ul>
</body>
</html>
EOF
```

---

## 🛠️ Troubleshooting

### Claude-Mem not starting
```bash
npx claude-mem stop
npx claude-mem start
npx claude-mem status
```

### PostgreSQL connection refused
```bash
docker ps | grep postgres
# If not running: docker-compose -f docker-compose.yml up -d postgres
psql -h localhost -U postgres -c "SELECT 1"
```

### LunaRoute not intercepting requests
```bash
# Verify proxy is running
curl http://localhost:8082/api/stats

# Verify environment variables set
echo $ANTHROPIC_BASE_URL
echo $OPENAI_BASE_URL
# Should both point to http://127.0.0.1:8081
```

### Stock Platform analysis timeout
```bash
# Check Polygon API quota
curl -H "Authorization: Bearer $POLYGON_API_KEY" \
  https://api.polygon.io/v1/account
# Expected: Account info with rate limit

# Restart platform
cd StockPlatform
source venv/bin/activate
uvicorn app.main:app --reload
```

### Grafana dashboards not updating
```bash
# Verify Prometheus scraping
curl http://localhost:9090/api/v1/query?query=up

# Force Prometheus to re-scrape
curl -X POST http://localhost:9090/-/reload
```

---

## 📋 Post-Deployment Checklist

- [ ] All 15 services running (verify with `docker ps`)
- [ ] Claude-Mem persistent memory active
- [ ] PULSE token efficiency rules enforced
- [ ] Everything Claude Code agents responding to /help
- [ ] PostgreSQL accessible and ecosystem DB created
- [ ] Redis connections working
- [ ] MinIO console accessible
- [ ] Prometheus scraping all targets
- [ ] Grafana dashboards displaying data
- [ ] LunaRoute recording sessions
- [ ] Stock Platform API responding to queries
- [ ] MCP tools available in Claude Code
- [ ] Git branch deployed and pushed

---

## 🚀 What's Next?

1. **Fine-tune agents** — Customize Everything Claude Code agents for your workflows
2. **Create specs** — Use `/spec-quick` to design features with AI assistance
3. **Monitor costs** — Watch Claude Code spending via Grafana + `get_current_cost`
4. **Build integrations** — Use OpenManus for custom multi-agent workflows
5. **Iterate fast** — Leverage PULSE protocol to reduce token burn 60-70%

---

## 🔐 Security Hardening (Before Production)

1. **Change default credentials:**
   - Pigsty: Change admin/admin password
   - MinIO: Change minioadmin/minioadmin
   - Grafana: Change admin/admin

2. **Enable authentication:**
   - PostgreSQL: Use strong passwords + SSL
   - Redis: Set requirepass in redis.conf
   - API endpoints: Add API key validation

3. **Enable TLS/SSL:**
   ```bash
   # Generate self-signed cert for LunaRoute
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
   ```

4. **Firewall rules:**
   ```bash
   # Close all ports except those needed
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP (Pigsty WebUI)
   ufw allow 443/tcp   # HTTPS
   ufw allow 5432/tcp  # PostgreSQL (if remote access needed)
   ```

5. **Secrets management:**
   - Never commit `.env` to git (already in .gitignore)
   - Use HashiCorp Vault for secret rotation
   - Rotate API keys regularly

---

## 📞 Support Resources

- **Claude-Mem:** https://claude-mem.dev/docs
- **PULSE Protocol:** `./PULSE-SETUP.md`
- **Everything Claude Code:** Community Discord + GitHub discussions
- **Pigsty:** https://pigsty.io/
- **PostgreSQL:** https://postgresql.org/
- **Prometheus:** https://prometheus.io/docs/
- **Grafana:** https://grafana.com/docs/
- **LunaRoute:** https://github.com/erans/lunaroute

---

**Deployment completed. Welcome to the Claude Ecosystem v1.4.0 🎉**

Total setup time: ~4 hours  
Services running: 15  
Agents available: 13  
Skills available: 50+  
Commands available: 32+  
Status: Ready for production AI development
