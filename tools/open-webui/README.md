# Open WebUI (self-hosted)

Personal ChatGPT-style interface. 126k+ GitHub stars, 270M+ Docker pulls, MIT license. Wraps OpenAI / Anthropic / Ollama / any OpenAI-compatible API behind a clean web UI with bundled RAG, voice input/output, and multi-user role-based access.

## When to bother

You're iPhone-only today. This config is parked here so the moment you have **any** of the following, you're one command from a personal ChatGPT mirror:

- A Mac mini at home (~$600 one-time)
- A small VPS — Hetzner CAX11 / DigitalOcean / Fly.io (~$5/mo)
- A cloud GPU instance (only if you want to run Ollama for local open-weight models)

## Install

```bash
cd tools/open-webui
cp .env.example .env       # then edit with your real API keys
docker compose up -d
open http://localhost:3000 # or your-server-ip:3000
```

First user to register becomes admin (controlled by `DEFAULT_USER_ROLE=admin` + `ENABLE_SIGNUP=true` for the first run — flip `ENABLE_SIGNUP=false` after).

## What it gives you over chatgpt.com

- **Connects to multiple model providers in one UI** — switch between Claude, GPT-4, Llama locally, etc.
- **RAG over your own documents** — upload your RHYTHMIX brand docs / contracts / notes, ask questions across them.
- **Voice input/output** — talk to it from your phone via the web UI.
- **Multi-user** — give the team access without sharing keys.
- **Conversations stored locally** — nothing leaves your server.

## What it doesn't replace

- Claude Code (this CLI). Open WebUI is a chat interface, not an agentic coding tool.
- The MCP servers wired into this repo (Webflow, Vercel, Cloudflare, Stripe, etc.). Those run inside Claude Code's tool-use loop, not Open WebUI's chat.

## Updating

```bash
docker compose pull && docker compose up -d
```
