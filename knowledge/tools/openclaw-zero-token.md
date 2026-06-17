# OpenClaw Zero Token: Free API Gateway for 13+ Web Models

Browser-based authentication gateway providing free access to ChatGPT, Claude, Gemini, DeepSeek, Qwen, Kimi, Doubao, Grok, GLM, Xiaomi MiMo, and Manus — without API tokens. Log in once via browser, then call any configured model through unified HTTP API, Web UI, or CLI.

GitHub: https://github.com/linuxhsj/openclaw-zero-token  
License: MIT

## What Zero Token Provides

| Feature | Description |
|---|---|
| **Free models** | 13 tested web providers, zero API cost |
| **Authentication** | Browser login → automatic credential capture |
| **Unified gateway** | Single HTTP API for all configured models |
| **Interfaces** | Web UI (Lit 3.x), CLI/TUI, HTTP gateway API |
| **Tool calling** | Web search, exec, read, write, message (11/13 models) |
| **Local storage** | Credentials stored locally, never leaked to external service |
| **Multi-platform** | macOS, Linux, WSL2 (Windows) |

## Supported Providers

| Provider | Status | Models | Tool Calling |
|---|---|---|---|
| **DeepSeek** | ✅ Tested | deepseek-chat, deepseek-reasoner | ✅ All 6 tools |
| **Qwen Intl** | ✅ Tested | Qwen 3.5 Plus/Turbo | ✅ web_search |
| **Qwen China** | ✅ Tested | Qwen 3.5 Plus/Turbo | ✅ web_search |
| **Kimi** | ✅ Tested | Moonshot v1 8K/32K/128K | ✅ All 6 tools |
| **Claude Web** | ✅ Tested | Claude Sonnet 4.6, Opus 4.6, Haiku 4.6 | ✅ web_search |
| **ChatGPT Web** | ✅ Tested | GPT-4, GPT-4 Turbo | ✅ web_search |
| **Gemini Web** | ✅ Tested | Gemini Pro, Gemini Ultra | ✅ web_search |
| **Grok Web** | ✅ Tested | Grok 1, Grok 2 | ✅ web_search |
| **GLM Web** | ✅ Tested | GLM-4 Plus, GLM-4 Think | ✅ Tool calling |
| **GLM Intl** | ✅ Tested | GLM-4 Plus, GLM-4 Think | ✅ Tool calling |
| **Xiaomi MiMo** | ✅ Tested | MiMo 2.0, MiMo 2.5 Pro | ✅ web_search |
| **Doubao** | ✅ Tested | doubao-seed-2.0, doubao-pro | ⚠️ Chat only |
| **Manus API** | ✅ Tested | Manus 1.6, Manus 1.6 Lite | ✅ API key (free quota) |
| **Perplexity** | ✅ Chat | Search engine | ✅ Built-in search |

## Quick Start

**Requirements:**
- Node.js 22.12.0+
- pnpm 9.0.0+
- Chrome browser
- OS: macOS, Linux, or WSL2

**Installation (5 minutes):**

```bash
# 1. Clone and build
git clone https://github.com/linuxhsj/openclaw-zero-token.git
cd openclaw-zero-token
pnpm install
pnpm build
pnpm ui:build

# 2. Start Chrome in debug mode (keep terminal open)
./start-chrome-debug.sh

# 3. Log into each web model in browser tabs
# (DeepSeek, Qwen, Kimi, Claude, ChatGPT, Gemini, Grok, etc.)

# 4. In NEW terminal: run auth wizard
./onboard.sh webauth

# 5. Start the gateway
./server.sh
```

**Open Web UI:** URL printed by `./server.sh` (default: http://localhost:3001)

## How It Works

### Architecture

```
┌──────────────────────────────────────────────┐
│   User Interface                              │
│   (Web UI / CLI / HTTP API)                   │
└────────────────┬─────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  Gateway Core  │
         │  (Port 3001)   │
         └───────┬────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
 DeepSeek    Kimi          Claude
  Web         Web          Web
 API         API          API
```

### Authentication Flow (Example: DeepSeek)

```
1. Start Chrome (debug mode)
   ./start-chrome-debug.sh
   └─ CDP port 18892, user-data-dir

2. User logs in
   Browser → https://chat.deepseek.com
   (password/scan login)

3. Capture credentials
   Playwright CDP intercepts:
   - Authorization bearer token
   - Session cookies
   - User-Agent

4. Store credentials (local)
   auth.json: { cookie, bearer, userAgent }

5. Call web API
   Gateway client reuses stored credentials
   → persistent authenticated session
```

## Usage

### Web UI Chat

```bash
# Switch models
/model deepseek-web/deepseek-chat
/model claude-web/claude-sonnet-4-6
/model kimi-web/moonshot-v1-128k
/model qwen-web/qwen-3.5-turbo
/model grok-web/grok-2

# List available models
/models

# Ask question (tool calling, if supported)
"Search for latest AI research news"
→ Gateway auto-injects web_search tool
→ Model calls tool if needed
```

### HTTP API

```bash
curl http://127.0.0.1:3001/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-web/deepseek-chat",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### CLI/TUI

```bash
node openclaw.mjs tui
```

Interact with models via terminal UI.

## Tool Calling Support

Zero Token injects tool definitions when detecting action keywords:

**Supported tools:**
- `web_search` — DuckDuckGo search
- `web_fetch` — HTTP fetch
- `exec` — Shell execution
- `read` — File read
- `write` — File write
- `message` — Send message

**How it works:**
1. User message contains action keyword ("search for", "read file", "execute", etc.)
2. Gateway injects tool prompt with definitions
3. Model decides to call tool or respond normally
4. Tool results appended to context
5. Model generates final response

**Example:**
```
User: "Search for Python 3.13 release notes"

Gateway detects: "search for" → inject web_search tool
Model: calls web_search("Python 3.13 release notes")
Tool result: fetches results
Model: summarizes findings for user
```

**11/13 Models Support Tool Calling:**
- ✅ DeepSeek (all 6 tools)
- ✅ Kimi (all 6 tools)
- ✅ Claude, ChatGPT, Qwen CN/Intl, Grok, MiMo (web_search)
- ✅ GLM Web & GLM Intl (tool calling)
- ⚠️ Gemini (unstable DOM polling)
- ❌ Doubao (stream parser limitation)

## Configuration

### Example openclaw.json

```json
{
  "auth": {
    "profiles": {
      "deepseek-web:default": {
        "provider": "deepseek-web",
        "mode": "api_key"
      }
    }
  },
  "models": {
    "providers": {
      "deepseek-web": {
        "baseUrl": "https://chat.deepseek.com",
        "api": "deepseek-web",
        "models": [
          {
            "id": "deepseek-chat",
            "name": "DeepSeek Chat",
            "contextWindow": 64000,
            "maxTokens": 4096
          },
          {
            "id": "deepseek-reasoner",
            "name": "DeepSeek Reasoner (R1)",
            "reasoning": true,
            "contextWindow": 64000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "gateway": {
    "port": 3001,
    "auth": {
      "mode": "token",
      "token": "your-gateway-token"
    }
  }
}
```

## Daily Workflow

```bash
# 1. Start Chrome (first time opens browser)
./start-chrome-debug.sh

# 2. Refresh credentials if needed (optional)
./onboard.sh webauth

# 3. Start/manage gateway
./server.sh                # Start
./server.sh restart        # Restart
./server.sh stop           # Stop
./server.sh status         # Check status
```

## Integration with Nucleus

Zero Token complements Nucleus for cost-free inference:

| Component | Purpose |
|---|---|
| **Nucleus** | Orchestration, carousel/video generation |
| **Zero Token** | Free LLM calls (no API cost) |
| **Combination** | Nucleus calls Zero Token gateway for content generation |

**Example integration:**
```python
import asyncio
import httpx

async def nucleus_with_zero_token():
    # Nucleus calls Zero Token gateway
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://127.0.0.1:3001/v1/chat/completions",
            json={
                "model": "deepseek-web/deepseek-chat",
                "messages": [
                    {
                        "role": "user",
                        "content": "Generate carousel slide copy for tech product"
                    }
                ]
            }
        )
        content = response.json()["choices"][0]["message"]["content"]
        
        # Use content in Nucleus carousel generation
        carousel = await nucleus.generate_carousel(content)
        return carousel
```

## Comparison: Zero Token vs Alternatives

| Feature | Zero Token | GPT4Free | API Keys |
|---|---|---|---|
| Cost | Free | Free | Pay per request |
| Auth | Browser login | API key | API key |
| Models | 13 web providers | 15+ providers | Limited |
| Credential storage | Local | Local | External |
| Tool calling | Yes (11/13) | Limited | Yes |
| Setup time | 5 min | 2 min | 1 min |
| Session stability | Good | Variable | Excellent |

## Troubleshooting

**Missing directories or config errors:**

```bash
# Run doctor command
node dist/index.mjs doctor

# If missing openclaw.json or auth-profiles.json:
./onboard.sh webauth
```

**Chrome won't start:**

```bash
# Check Chrome installation
which google-chrome  # Linux
which "Google Chrome"  # macOS

# Manually specify Chrome path in start-chrome-debug.sh
```

**"Cannot find module" errors:**

```bash
# Clean rebuild
rm -rf dist dist-runtime node_modules
pnpm install
pnpm build
pnpm ui:build
./server.sh restart
```

**Credentials not captured:**

```bash
# Re-run auth wizard, ensure manual login completes
./onboard.sh webauth

# Check auth.json created
ls -la .openclaw-zero-state/agents/main/agent/auth.json
```

## Security Notes

**Credentials:**
- Stored locally in `.openclaw-zero-state/` (gitignored)
- Never sent to external services
- Include cookies, bearer tokens, user-agent

**Session lifetime:**
- Web sessions expire over time
- Re-login via `./onboard.sh webauth` as needed

**Rate limiting:**
- Web endpoints have limits (not suited for heavy production)

**Compliance:**
- Follow each platform's Terms of Service
- Use for learning and research only

## Advanced: Adding New Providers

To add a new web model:

1. **Auth module** (`src/zero-token/providers/{platform}-web-auth.ts`):
```typescript
export async function loginPlatformWeb(params: {
  onProgress: (msg: string) => void;
  openUrl: (url: string) => Promise<boolean>;
}): Promise<{ cookie: string; bearer: string; userAgent: string }> {
  // Automate browser login, capture credentials
}
```

2. **API client** (`src/zero-token/providers/{platform}-web-client*.ts`):
```typescript
export class PlatformWebClient {
  constructor(options: { cookie: string; bearer?: string }) {}
  
  async chatCompletions(params: ChatParams): Promise<ReadableStream> {
    // Call platform web API
  }
}
```

3. **Stream handler** (`src/zero-token/streams/{platform}-web-stream.ts`):
```typescript
export function createPlatformWebStreamFn(credentials: string): StreamFn {
  // Handle provider-specific streaming format
}
```

4. Register in `web-stream-factories.ts`

## For One-Person Builders

Zero Token is ideal for:
- **Cost-free AI development** — No API spending for experimentation
- **Multi-model testing** — Switch between 13 models instantly
- **Privacy-first workflows** — Credentials stored locally
- **Agent prototyping** — Test Nucleus/Mary with real models
- **Web search + reasoning** — Leverage tool calling for research tasks

**Cost comparison:**
- GPT-4 API: $0.03/1K input tokens
- Claude API: $0.003/1K input tokens
- Zero Token: $0.00 (free, browser-based)

Savings: $0.03–5.00 per day per casual developer.

## Roadmap

**Current:**
- ✅ 13 web providers tested + working
- 🔧 Improve credential capture robustness
- 📝 Documentation

**Planned:**
- 🔜 Auto-refresh for expired sessions
- 🔜 Proxy mode for sharing gateway
- 🔜 Rate limit monitoring

## Key Links

- **GitHub**: https://github.com/linuxhsj/openclaw-zero-token
- **Base Project**: https://github.com/openclaw/openclaw
- **License**: MIT

---

**Use Case for Ecosystem:** Zero Token provides free HTTP gateway for 13 web LLMs with tool calling support. Use as free alternative to API-based providers (Kimi K2, GPT4Free) for local development and prototyping. Integrate with Nucleus for cost-free carousel/video generation pipelines. Combine with MiroFlow for research → zero-token LLM → Nucleus content generation workflow.
