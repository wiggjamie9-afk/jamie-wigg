---
name: goose
description: goose (aaif-goose/goose) — an open-source, general-purpose AI agent that runs on your own machine (native desktop app for macOS/Linux/Windows, full CLI, and an API). Built in Rust; works with 15+ LLM providers and your existing Claude/ChatGPT/Gemini subscriptions via ACP; connects to 70+ MCP extensions. Use as an alternative/standalone agent runtime — and as a way off the limited Claude-on-the-web sandbox onto something you control. NOTE: like any local agent it needs a real machine (your computer, a VPS, or a Codespace) — it can't run on an iPhone directly.
---

# goose (open-source local AI agent)

goose is a general-purpose agent (not just code — research, writing, automation, data) that runs
locally. Desktop app + CLI + embeddable API, written in Rust. Part of the Linux Foundation's
Agentic AI Foundation (AAIF). It speaks **MCP** (70+ extensions) and can use **your existing
Claude/ChatGPT/Gemini subscriptions via ACP**, or provider API keys (Anthropic, OpenAI, Google,
Ollama, OpenRouter, Azure, Bedrock…).

- Repo: https://github.com/aaif-goose/goose · Docs: https://block.github.io/goose

## Why it's relevant to you (the "better than sandbox" thread)

goose is an **alternative to Claude Code** that you run yourself. It does **not** magically escape
the "needs a real machine" reality — but paired with a Codespace or VPS it gives you a fully-
controlled, persistent agent environment, and it can reuse the subscriptions and MCP servers you
already have (including the **supermemory** / **mempalace** memory MCPs now in `.mcp.json`).

So: same hosting options as before —
- **GitHub Codespace** (you're configured for it) → install goose CLI there.
- **VPS** + terminal app from your phone → run goose.
- **Local Mac/PC** → desktop app or CLI.
- ❌ Not directly on iPhone (it's a real agent binary).

## Install

```bash
# CLI
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
# then run:
goose
```
Desktop app: download for macOS/Linux/Windows from the releases page. Custom Distributions let you
build a branded goose with preconfigured providers/extensions.

## How it compares to Claude Code

| | Claude Code | goose |
|---|---|---|
| Vendor | Anthropic | Block / Linux Foundation (open source) |
| Models | Claude | 15+ providers, model-agnostic |
| Surfaces | CLI, desktop, web, IDE | desktop app, CLI, API |
| Extensions | Skills + MCP | 70+ MCP extensions |
| Subscriptions | Claude | reuse Claude/ChatGPT/Gemini via ACP |

Not a replacement for everything in this repo (the RHYTHMIX skills/pipelines are Claude-Code-
shaped), but a strong **second agent** — e.g. run goose with a local model (Ollama) for private/
offline tasks, or to drive automation that isn't Claude-specific.

## Honest take

If your goal is "stop the sandbox stopping my builds," the **environment** (Codespace/VPS) is the
fix, not the agent. goose is worth it if you want an **open-source, multi-provider, model-agnostic**
agent you fully control — otherwise Claude Code (in a Codespace) already does most of this. Try
goose with Ollama if **offline/private** matters.

## License

Open source (Apache-2.0). Community: Discord, YouTube, LinkedIn, X.
