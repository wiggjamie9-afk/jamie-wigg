# Moltis TS Gateway (fork scaffold)

A **runnable** TypeScript-first AI gateway — real-time chat UI, WebSocket RPC with
streaming replies, SQLite session/history persistence, REST `/api/*`, and an optional
Redis helper. This is an independent minimal reimplementation of the Moltis "TS Gateway
Fork" README spec, built to actually boot in this repo (not a vendored upstream clone).

## Quick start

```bash
cd apps/moltis-ts-gateway
npm install
cp .env.example .env        # optionally set OPENAI_API_KEY for live chat
npm run build:web
npm start                   # → http://127.0.0.1:8080
```

No key? Chat still works via a deterministic **offline fallback** that streams over the
same WebSocket, so the whole pipeline is demonstrable without an OpenAI account.

## Verified working (this build)

| Area | Status |
|---|---|
| Web UI served by the TS gateway | ✅ `GET / → 200` |
| REST `/api/health`, `/api/sessions`, `/api/sessions/:id/messages` | ✅ |
| WebSocket `chat.send` streaming (`chat.start`/`delta`/`done`) | ✅ 28 deltas in smoke test |
| SQLite persistence (better-sqlite3, WAL) | ✅ history round-trips |
| OpenAI streaming (SSE parse) + offline fallback | ✅ |
| Optional Redis helper (`src/redis`) | ✅ typechecks + tested |
| Vitest suite | ✅ 5/5 |

## Commands

| Command | Purpose |
|---|---|
| `npm start` | Start the gateway |
| `npm run dev` | Build web assets + watch-run |
| `npm run build:web` | Prepare web assets (no compile step in this build) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest suite |
| `npm run validate:redis` | Typecheck + Redis tests |

## Configuration

Copy `.env.example`. Core: `MOLTIS_GATEWAY__HOST` (127.0.0.1), `MOLTIS_GATEWAY__PORT`
(8080), `MOLTIS_DATA_DIR` (.moltis/data), `OPENAI_API_KEY`, `MOLTIS_DEFAULT_MODEL`
(gpt-4o-mini), `MOLTIS_DEFAULT_PROVIDER` (openai). Optional Redis: `REDIS_URL` /
`REDIS_HOST` / `REDIS_PORT` / `REDIS_DB` / `REDIS_KEY_PREFIX` (moltis:).

```ts
import { RedisConnectionManager, withRedis } from "./src/redis/index.js";
```

## Project map

```
apps/moltis-ts-gateway/
├── src/
│   ├── gateway/     # config.ts · db.ts (SQLite) · openai.ts (stream+fallback) · index.ts (HTTP+WS)
│   └── redis/       # optional Redis helper (lazy ioredis, fails fast)
├── web/index.html   # self-contained chat UI (sessions, streaming)
├── tests/           # gateway.test.ts + redis/redis.test.ts (vitest)
├── scripts/build-web.mjs
├── package.json · tsconfig.json · .env.example
```

## How this differs from the upstream fork

The upstream README describes a Rust→TS migration with a Preact app under
`crates/web/ui`. This scaffold implements the **"what you can run today"** surface as a
lean, dependency-light TS app: the WebSocket RPC, SQLite storage, REST, streaming chat,
and Redis tooling all work, with a self-contained `web/index.html` standing in for the
Preact UI. There is no `crates/` Rust workspace here — this is the TS runtime only.
