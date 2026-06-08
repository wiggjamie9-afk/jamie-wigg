# SYSTEM STATUS REPORT

**Timestamp:** 2026-06-08 21:59:47 UTC  
**System Uptime:** 5 minutes  
**Environment:** Cloud sandbox (remote execution)  
**Repository:** /home/user/jamie-wigg  

---

## SERVICE STATUS SUMMARY

| Service | Port | Status | Details |
|---------|------|--------|---------|
| **Freebuff2API** | :8080 | ❌ DOWN | Binary ready; service not running |
| **HyperFrames Preview** | :3002 | ❌ DOWN | Video preview not running |
| **Chatbot/RAG** | :8000 | ❌ DOWN | Not running |
| **CodeGraph** | N/A | ✅ UP | Index up to date (344 files, 3,654 nodes) |
| **RUN-ALL-ENGINES.sh** | N/A | ⏸️ STALE | Script exists but not currently running |

---

## SERVICE DETAILS

### 1. Freebuff2API (:8080)

**Status:** DOWN (not running)

**Configuration:**
- Binary: `/home/user/jamie-wigg/freebuff2api/freebuff2api` (executable, 9.4 MB)
- Config: `/home/user/jamie-wigg/freebuff2api/config.json`
- Listen address: `:8080`
- Upstream: `https://codebuff.com`
- Rotation interval: 6h
- Request timeout: 15m

**Port Check:** CLOSED (nc timeout)

**To Restart:**
```bash
cd /home/user/jamie-wigg/freebuff2api
./freebuff2api -config config.json
```

---

### 2. HyperFrames Preview (:3002)

**Status:** DOWN (not running)

**Configuration:**
- Location: `/home/user/jamie-wigg/freebuff2api-video/`
- Package.json script: `npx --yes hyperframes@0.4.42 preview`
- Composition: `index.html` (8.1 KB)
- Hyperframes version: 0.4.42

**Port Check:** CLOSED

**To Restart:**
```bash
cd /home/user/jamie-wigg/freebuff2api-video
npm run dev
```

---

### 3. Chatbot/RAG (:8000)

**Status:** DOWN (not running)

**Files Present:**
- `/home/user/jamie-wigg/freebuff2api/chatbot.html` (9.6 KB)
- `/home/user/jamie-wigg/freebuff2api/chatbot-rag.html` (13.8 KB)

**Port Check:** CLOSED

**Notes:** No Node.js dependencies detected in freebuff2api for HTTP server. Check if chatbot runs on different port or requires separate service.

---

### 4. CodeGraph

**Status:** ✅ UP & HEALTHY

**Index Statistics:**
- Files: 344
- Nodes: 3,654
- Edges: 6,398
- Database Size: 9.00 MB
- Backend: node:sqlite (full WAL)
- Journal: wal
- **Status:** [OK] Index is up to date

**Top Node Kinds:**
- function (1,103)
- import (942)
- method (439)
- file (326)
- variable (307)
- constant (288)

**Language Distribution:**
- Python: 129 files
- JavaScript: 88 files
- TypeScript/TSX: 98 files
- YAML: 18 files
- Other: 11 files

---

### 5. RUN-ALL-ENGINES.sh

**Status:** ⏸️ STALE (script exists but not running)

**Location:** `/home/user/jamie-wigg/RUN-ALL-ENGINES.sh`

**Script Contents:** Starts 5 services:
1. Freebuff2API (:8080)
2. HyperFrames Preview (:3002)
3. nodeppt (presentations)
4. Anime.js (animations)
5. Three.js (3D rendering)

**Last Modified:** 2026-06-08 11:49:00 UTC

**Running Processes Related to RUN-ALL-ENGINES:** None found

---

## SYSTEM RESOURCES

**Load Average:** 0.58, 0.68, 0.36 (1m, 5m, 15m)

**Running Background Services:**
- MCP Servers (active):
  - `stepfun` — Step3.7 Flash (node .claude/mcp/stepfun/server.mjs)
  - `creative-stack` — Replicate + ElevenLabs (node .claude/mcp/creative-stack/server.mjs)
  - `playwright` — Browser automation (npx @playwright/mcp@latest)
  - `claude-playwright` — Session management (node node_modules/claude-playwright/dist/mcp/server.cjs)

- Installation Tasks (in progress):
  - `npm install` (pid 7578) — root dependencies
  - `pip install tensorflow pytorch jax...` (pid 3205) — Python ML stack

---

## DEPENDENCY STATUS

**Root Dependencies:** ✅ Installed (`node_modules/` exists)

**freebuff2api-video Dependencies:** ✅ package.json configured (HyperFrames via npx)

**9router Dependencies:** ✅ Installed (`node_modules/` exists)

**Configuration Files:**
- ✅ `.env` exists
- ✅ `freebuff2api/config.json` exists
- ✅ All required binaries present and executable

---

## PORT AVAILABILITY

| Port | Status | Service |
|------|--------|---------|
| 8080 | CLOSED | Freebuff2API |
| 3002 | CLOSED | HyperFrames |
| 8000 | CLOSED | Chatbot/RAG |
| 8001 | CLOSED | (unassigned) |
| 8002 | CLOSED | (unassigned) |

**Current Listening Ports:**
- 2024, 2025 (process_a)
- 127.0.0.1:33073, 127.0.0.1:46803 (environment-manager)

---

## STARTUP PLAN

### Option 1: Restart Individual Services

```bash
# Terminal 1: Freebuff2API
cd /home/user/jamie-wigg/freebuff2api
./freebuff2api -config config.json

# Terminal 2: HyperFrames Video
cd /home/user/jamie-wigg/freebuff2api-video
npm run dev

# Terminal 3: 9Router (if needed)
cd /home/user/jamie-wigg/9router
npm run dev
```

### Option 2: Run RUN-ALL-ENGINES.sh

```bash
cd /home/user/jamie-wigg
bash RUN-ALL-ENGINES.sh
```

Or use the more comprehensive START-ALL.sh:

```bash
cd /home/user/jamie-wigg
bash START-ALL.sh
```

---

## SYSTEM VERIFICATION

All prerequisites verified with `VERIFY-SETUP.sh`:

```
✓ freebuff2api binary built and ready
✓ Root dependencies installed
✓ freebuff2api-video configured (uses HyperFrames via npx)
✓ 9router dependencies installed
✓ .env configuration file exists
✓ freebuff2api config.json exists
```

---

## NEXT STEPS

**Recommended Actions:**
1. **Start Freebuff2API** — Required for core API service
2. **Start HyperFrames Preview** — Required for video composition preview
3. **Monitor ports** — Verify services bind successfully
4. **Check for errors** — Watch stdout/stderr for any startup issues

**To monitor after starting:**
```bash
# In new terminal
watch -n 2 'netstat -tlnp 2>/dev/null | grep -E "8080|3002|8000"'
# or
watch -n 2 'ss -tlnp 2>/dev/null | grep -E "8080|3002|8000"'
```

---

## NOTES

- The repository contains 344 files across multiple languages (Python, JS, TS, YAML)
- CodeGraph is actively indexing and has full WAL (Write-Ahead Logging) enabled
- Cloud sandbox environment is operating normally (5-minute uptime)
- MCP servers for creative tools are active but primary service ports are idle
- No persistent services running from RUN-ALL-ENGINES.sh — requires manual start

**Status Generated:** 2026-06-08 21:59:47 UTC
