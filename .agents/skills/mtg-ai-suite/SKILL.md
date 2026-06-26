---
name: mtg-ai-suite
description: Reference for the MTG AI Suite (zacharyelston/mtg-ai-suite) — a standalone Magic\: The Gathering toolkit (Next.js 14 frontend + Rust Axum backend) for card DB, rules, game-state, and Scryfall-powered card search. Use only if working on that separate app. NOTE: unrelated to RHYTHMIX and outside this repo's GitHub scope; it's a separate project, not part of jamie-wigg builds.
---

# MTG AI Suite (reference)

A separate, standalone application — **not** part of the RHYTHMIX/jamie-wigg workspace and
outside this session's GitHub scope (`wiggjamie9-afk/jamie-wigg`). Captured here as reference
because it was requested; do not wire it into this repo's builds or deploys.

- Repo: https://github.com/zacharyelston/mtg-ai-suite
- Issues: https://github.com/zacharyelston/mtg-ai-suite/issues

## Architecture

Split frontend/backend, each its own Replit app:

| Part | Stack | Notes |
|---|---|---|
| `frontend/` | Next.js 14, React 18, TailwindCSS, Zustand | runs on port 5000 |
| `crates/mtg-server/` | Rust, Axum, Tower, Tokio | `cargo run --bin mtg-server`, port 5000 |
| `backend/` | Python FastAPI | legacy, not used |

## Run

```bash
# frontend
cd frontend && npm run dev
# backend (Rust)
cd crates/mtg-server && cargo run --bin mtg-server
```

Env: frontend needs `NEXT_PUBLIC_API_BASE_URL` (backend URL, for camera capture). Backend:
`PORT` (default 5000), `RUST_LOG` (default info). CORS is open on the backend.

## Features

Card search (Scryfall API + autocomplete), grid card display, detail modal with pricing,
random card, WebRTC camera capture (CameraCapture / CapturePreview components).

## Tests

Frontend: `npm test` (Jest + React Testing Library). Backend: `pytest` (pytest-asyncio).

## Working on it from here

This is a different repo. To actually develop it you'd clone it and work in its own checkout,
or have it added to this session's scope via `add_repo`. The reusable idea worth borrowing for
RHYTHMIX work is the **Scryfall API integration pattern** (search + autocomplete + card data),
if a card/data feature ever comes up.
