# Build Plan — Tomorrow

## Current State (as of overnight sprint)

### What compiles and tests clean

| Package | Language | Tests | Status |
|---------|----------|-------|--------|
| 9router | TypeScript | — | ✅ compiles |
| aria-core | TypeScript | — | ✅ compiles |
| khepra | TypeScript | — | ✅ compiles |
| openmono | TypeScript | — | ✅ compiles |
| tool-sync | TypeScript | — | ✅ compiles |
| **fractera** | TypeScript/React | 30 pass | ✅ NEW tonight |
| **betterprompts** | Python | 143 pass | ✅ warnings fixed |

### What was built overnight

1. **Fractera** (`packages/fractera/`) — React dashboard (Dashboard, Tools, Audit Log, Providers pages). Uses mock data so it works immediately with `npm run dev`. Proxy configured to `/api` for when we add the backend.
2. **BetterPrompts fixes** — Gradio 6.0 css/theme moved to `launch()`. Google FutureWarning suppressed. 143 tests → 0 warnings.
3. **aria-core/data/tool-registry.json** — Seed registry with 8 real tools across 4 categories (Weather, Finance, News, Testing). Aria can now start without running tool-sync first.

---

## Priority Order for Tomorrow

### 1. Wire Aria → 9Router (2–3 hours) [HIGHEST IMPACT]

Right now Aria (`packages/aria-core/`) discovers tools from the registry and resolves them, but the `executor.ts` makes raw `fetch()` calls to the tool endpoint — it doesn't route through 9Router. This means no LLM reasoning, just raw HTTP.

**What to build:**
- `AriaAgent` constructor accepts a `Router` instance (from `9router`)
- When Aria needs to decide *which* tool to call, it asks the router (LLM call)
- When it calls the tool, it still makes raw HTTP to the tool's endpoint (that's correct — LLM picks the tool, HTTP calls the API)
- Add a simple `AgentLoop` that runs: `think → pick tool → call tool → summarize → repeat`
- Write an integration test with the real tool-registry.json

**Key files:**
- `packages/aria-core/src/agent.ts` — add `loop(prompt: string, maxSteps?: number)` method
- `packages/aria-core/src/tools/executor.ts` — already does HTTP calls, just needs to feed results back
- `packages/9router/src/router.ts` — already has `route(messages)`, just wire it in

### 2. Fractera API backend (1–2 hours)

Fractera currently uses mock data. To make it live:

**What to build:**
- `packages/fractera/server/` — minimal Express server (separate from Fractera Vite client)
- 4 endpoints matching the `api.ts` calls:
  - `GET /api/registry` — reads `aria-core/data/tool-registry.json`
  - `GET /api/audit?limit=N` — reads from KHEPRA's audit log (JSON file or in-memory)
  - `GET /api/providers/status` — pings 9Router's available providers with liveness checks
  - `GET /api/stats` — aggregates the above into `DashboardStats`
- Update `VITE_API_URL` in `.env` to point at the backend
- Replace mock calls in Fractera pages with real `api.*` calls

### 3. tool-sync end-to-end run (30 min)

Run the actual sync to get a full registry:
```bash
cd packages/tool-sync && npm run build && node dist/cli.js sync --skip-validation -o ../aria-core/data/tool-registry.json
```
This needs network access to `public-apis-list.theartofdev.com`. If the sandbox blocks it, run it on your machine. The seed registry has 8 tools; the full sync should produce ~400+.

### 4. BetterPrompts → live with real API keys (30 min)

BetterPrompts is fully built and tested but needs real keys to actually improve prompts.
```bash
cd betterprompts
cp .env.sample .env
# Fill in GEMINI_API_KEY and/or GROQ_API_KEY
source .venv/bin/activate
python -m betterprompts
# Opens at http://127.0.0.1:7860
```
Free keys:
- Gemini: aistudio.google.com/apikey
- Groq: console.groq.com/keys

### 5. OpenMono + Ollama local LLM (optional, offline focus)

If you want completely offline operation:
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:3b  # or phi3, or mistral

# Start OpenMono (wraps Ollama with OpenAI-compatible API)
cd packages/openmono && npm run build && node dist/cli.js start
# Runs at http://127.0.0.1:5000

# Set env var so 9Router uses it as fallback
export OPENMONO_URL=http://127.0.0.1:5000
```

---

## Architecture Map (current)

```
[User / App]
     │
     ▼
[Aria Agent]  ← reads → [tool-registry.json]
     │                        ↑
     │ routes LLM calls      tool-sync (syncs from public-apis)
     ▼
[9Router]
  ├── Claude (primary)
  ├── Gemini (fallback 1)
  ├── Groq (fallback 2)
  └── OpenMono (local fallback, offline)
     │
     ▼
[KHEPRA] ← logs every call → audit.json
     │
     ▼
[Fractera] ← reads all of the above → React dashboard
```

```
[BetterPrompts] — standalone Python/Gradio app
  ├── Gemini (primary)
  └── Groq (fallback)
```

---

## Gaps Still Open

| Gap | Severity | Notes |
|-----|----------|-------|
| No unit tests for 9router, aria-core, khepra, openmono | Medium | Packages compile but aren't runtime-verified |
| Fractera uses mock data | Medium | Backend server not yet built |
| Aria reasoning loop not written | High | `agent.ts` exists but no `loop()` method |
| tool-sync never actually run | Medium | Needs network; seed registry covers basics |
| BetterPrompts uses deprecated google-generativeai | Low | Suppressed; still works; migrate to google-genai later |
| KHEPRA audit trail not wired to Fractera | Medium | Need to define log format and read path |

---

## Quick Wins for First Hour

1. `npm run dev` in `packages/fractera` → see the dashboard UI
2. `python -m betterprompts` → try the prompt improver (needs API keys)
3. Read `packages/aria-core/src/agent.ts` → understand the agent loop we'll wire up
4. Decide: do you want a CLI demo of Aria first, or wire the Fractera backend first?
