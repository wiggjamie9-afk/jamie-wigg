# kimi-free-api (fix fork): Reverse-Engineered Kimi API

OpenAI/Gemini/Claude-compatible proxy that exposes kimi.com's web interface as a standard chat-completions API. Supports streaming, multi-turn, internet search, agent conversations, K2 thinking model, long-document analysis, and image OCR.

Fork: `akashrajpuroh1t/kimi-free-api-fix` (modified from LLM-Red-Team/kimi-free-api).

## ⚠️ Security & Compliance Warnings — READ FIRST

This is documented for **reference and awareness**, not endorsed for production use. Several material risks:

1. **Supply-chain attack history.** The *original* `kimi-free-api` shipped malicious obfuscated code at the end of `src/api/chat.js`. The original author's account was banned. This "fix" fork claims to have removed the malicious code — but **any fork of a compromised project must be independently audited before running.** Do not `docker run` or `npm install` it without reading the full source first, ideally in an isolated/sandboxed environment with no access to other credentials.

2. **Reversed API = unstable + ToS risk.** It drives kimi.com's private web endpoints, not an official API. Accounts can be banned. Endpoints break without notice.

3. **Personal use only.** The project itself states (three times): *"For personal use only, prohibited from providing services to others or commercial use."* Do **not** wire this into RHYTHMIX/Studio production paths or any user-facing service.

4. **Credential handling.** It requires your `refresh_token` (LocalStorage) or `kimi-auth` Cookie (JWT) as a bearer token. These are full session credentials — treat them like passwords; never commit them, never share the deployment.

**Recommended path for anything real:** use the official paid Moonshot API at https://platform.moonshot.cn/ — already documented in `knowledge/models/kimi-k2.md` and used by `knowledge/tools/kimik2manim.md`.

## What It Does

| Capability | Supported |
|---|---|
| High-speed streaming output | ✅ |
| Multi-turn conversations | ✅ (traditional API) |
| Internet search / deep research | ✅ |
| Agent conversations | ✅ |
| K2 thinking model | ✅ |
| Long document analysis | ✅ |
| Image parsing (OCR) | ✅ |
| Multi-token rotation | ✅ |
| Zero-config deployment | ✅ |
| Auto session cleanup | ✅ |

## Two Authentication Modes

### Method 1: Traditional API (full features) — `refresh_token`
- **Where**: kimi.moonshot.cn → F12 → Application → Local Storage → `refresh_token`
- **Format**: JWT (`typ: refresh`)
- If `refresh_token` is an array, join with `.`
- Header: `Authorization: Bearer <refresh_token>`
- **Supports**: basic chat, multi-turn (`conversation_id`), internet search, deep research, file upload, image parsing, agent, exploration, K1/K2 models

### Method 2: Connect RPC API (basic only) — `kimi-auth` Cookie
- **Where**: kimi.moonshot.cn → F12 → Application → Cookies → `kimi-auth` (JWT starting `eyJ`)
- **Format**: JWT (`typ: access`)
- Header: `Authorization: Bearer <JWT>`
- **Supports**: basic chat, streaming, scenario routing (K2/Search/Research)
- **Not supported**: multi-turn, file upload, image parsing, agent

### Automatic Routing
The service detects token type and routes automatically:
- `typ: access` (JWT) → Connect RPC API
- `typ: refresh` → Traditional API

| Feature | Traditional (refresh_token) | Connect RPC (kimi-auth) |
|---|---|---|
| Token location | LocalStorage | Cookie |
| Basic chat | ✅ | ✅ |
| Multi-turn | ✅ | ❌ |
| File upload | ✅ | ❌ |
| Image parsing | ✅ | ❌ |
| Agent | ✅ | ❌ |
| Stability | Stable | Latest API |

## Multi-Account Rotation

Kimi limits ordinary accounts to ~30 rounds of long-text Q&A per 3 hours (short text unlimited). Provide comma-separated tokens; the service picks one per request:

```
Authorization: Bearer TOKEN1,TOKEN2,TOKEN3
```

## Deployment (sandbox only — see warnings above)

**Docker:**
```bash
docker run -it -d --init --name kimi-free-api \
  -p 8000:8000 -e TZ=Asia/Shanghai \
  akashrajpuroh1t/kimi-free-api-fix:latest

docker logs -f kimi-free-api      # logs
docker restart kimi-free-api      # restart
docker stop kimi-free-api         # stop
```

**docker-compose:**
```yaml
version: '3'
services:
  kimi-free-api:
    container_name: kimi-free-api
    image: akashrajpuroh1t/kimi-free-api-fix:latest
    restart: always
    ports:
      - "8000:8000"
    environment:
      - TZ=Asia/Shanghai
```

Port 8000. Default homepage serves access guides + interface docs.

## API Surface

| Endpoint | Compatibility |
|---|---|
| `POST /v1/chat/completions` | OpenAI chat-completions |
| `POST /v1beta/models/:model:generateContent` | Google Gemini |
| `POST /v1/messages` | Anthropic Claude |

Works with OpenAI clients, **gemini-cli**, **claude-code**, dify, etc.

### Chat Completions Example

```http
POST /v1/chat/completions
Authorization: Bearer <refresh_token>
```
```json
{
  "model": "kimi-k2",
  "messages": [{ "role": "user", "content": "Test" }],
  "use_search": true,
  "stream": false
}
```

**Model name conventions** (names are cosmetic — actual model is whatever Chat uses online):
- `kimi` — default
- `kimi-search` — internet search
- `kimi-research` — exploration version
- `kimi-k1` / `kimi-k2` — K1/K2 models
- `kimi-math` — math model
- `kimi-silent` — suppress search-process output
- `search`/`research`/`k1`/`math`/`silent` — freely combinable
- For agents: put the 20-char agent ID (from the browser URL tail) in `model`

**Native multi-turn:** pass the response `id` as the next request's `conversation_id`. First round must pass `none` for `conversation_id` or the second round returns empty.

Response includes an `id` for continuation:
```json
{
  "id": "cnndivilnl96vah411dg",
  "model": "kimi",
  "object": "chat.completion",
  "choices": [{ "index": 0, "message": { "role": "assistant", "content": "..." }, "finish_reason": "stop" }],
  "usage": { "prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2 }
}
```

## Version History

- **v1.0.2 (2025-12-04)** — homepage restyle; Gemini + Claude adapters
- **v1.0.1 (2025-11-28)** — Connect RPC API (TypeScript); auto token-type routing; dual API; `src/lib/connect-rpc/` module
- **v1.0.0-fix (2025-11-25)** — removed original project's malicious code; homepage restyle

## Where This Fits (and Doesn't) in the Ecosystem

The ecosystem already has **safer, sanctioned** ways to reach Kimi:
- `knowledge/models/kimi-k2.md` — official paid Moonshot API (recommended for production)
- `knowledge/tools/openclaw-zero-token.md` — browser-login gateway (free, local credential storage, also unofficial but does not require pasting raw refresh tokens into a third-party Docker image)
- `knowledge/tools/gpt4free.md` — multi-provider aggregator with its own Kimi adapter

**Verdict:** kimi-free-api(-fix) is the **least preferred** of these because of the supply-chain history and the requirement to feed full session credentials into a third-party image. Catalogued here for completeness and so the risk is on record. If free Kimi access is needed for local experimentation, prefer OpenClaw Zero Token; if reliability matters, use the official API.

## References

- **Fix fork image**: `akashrajpuroh1t/kimi-free-api-fix:latest`
- **Upstream (compromised — do not use)**: github.com/LLM-Red-Team/kimi-free-api
- **Official API (recommended)**: https://platform.moonshot.cn/

---

**Use Case for Ecosystem:** Reference only. Demonstrates OpenAI/Gemini/Claude-compatible proxying of a web LLM and dual JWT auth-routing (access vs refresh tokens) — a useful pattern. NOT recommended for deployment given supply-chain history; the official Moonshot API or OpenClaw Zero Token are the sanctioned alternatives already installed in this knowledge base.
