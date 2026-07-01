# Awesome LLM Apps — Setup & Reference

## Overview

**Awesome LLM Apps** (`Shubhamsaboo/awesome-llm-apps`) is a **cookbook of
ready-to-run LLM app templates** — self-contained starter code you fork,
customize, and ship. Every template is original, hand-built, tested end-to-end,
and runs in ~3 commands. Provider-agnostic (Claude, Gemini, GPT, Llama, Qwen, xAI
via a config change). Apache-2.0 — fork it, ship it, sell it.

It spans the modern AI stack across **15 categories**: starter & advanced AI
agents, always-on agents, multi-agent teams, voice AI, generative-UI/agentic
frontends, game-playing agents, **MCP agents**, **RAG** (simple → agentic →
multi-source → knowledge-graph), agent skills, memory, "chat with X", LLM cost
optimization, and fine-tuning recipes.

> ### How this fits the RHYTHMIX repo
> A **reference cookbook to fork from**, not a tool to wire into the pipeline.
> Several categories map onto things this repo already does or wants:
> - **MCP agents** (Browser / GitHub / Notion / Multi-MCP router) — alongside the
>   repo's own MCP servers in `.mcp.json`.
> - **RAG + "chat with X"** — patterns for a future "chat with the RHYTHMIX docs /
>   site" feature.
> - **Always-on / multi-agent / voice** — overlaps with the automation interest
>   (n8n workflows, Hermes/Telegram gateways, the SimpleX bot idea).
>
> Treat it as a parts bin: clone it, lift the *one* template you need into a
> proper home (`automation/<slug>/`, `apps/<name>/`, or a spec under `specs/`),
> and keep its license/attribution. Don't vendor the whole repo into this one.

## Quick start

```bash
git clone https://github.com/Shubhamsaboo/awesome-llm-apps.git
cd awesome-llm-apps/starter_ai_agents/ai_travel_agent
pip install -r requirements.txt
streamlit run travel_agent.py        # set the provider API key the template asks for
```

Each template is **self-contained**: its own `requirements.txt` and run command
(usually `streamlit run …` or `python …`). There is no repo-wide install — you
install per template, only for the one you're running.

## Categories (what's inside)

| Category | Examples |
|---|---|
| 🌱 Starter agents | Travel, Data Analysis, Web Scraping, xAI Finance, Gemini Multimodal |
| 🚀 Advanced agents | Deep Research, VC Due Diligence, Finance, Movie Production, Self-Evolving |
| 🛰️ Always-on agents | Hacker News Briefing (scheduled scout → daily brief) |
| 🤝 Multi-agent teams | Competitor Intel, Legal, Recruitment, Real Estate, Teaching, UI/UX feedback |
| 🗣️ Voice AI | Audio Tour, Customer Support Voice, Insurance Live Team, Voice RAG |
| 🖼️ Generative UI | Dashboard Canvas, MCP App Builder, Shadcn Component Generator |
| 🎮 Game-playing | Pygame 3D, Chess, Tic-Tac-Toe |
| ♾️ MCP agents | Browser, GitHub, Notion, Travel Planner, Multi-MCP Router |
| 📀 RAG | Agentic, Corrective (CRAG), Hybrid Search, Vision, Knowledge-Graph w/ citations |
| 🧩 Agent skills | Self-Improving Agent Skills (+ 19 skills) |
| 💾 Memory | ArXiv-with-memory, stateful chat, shared-memory multi-LLM |
| 💬 Chat with X | GitHub, Gmail, PDF, ArXiv, Substack, YouTube |
| 🎯 Optimization | Toonify (TOON format, −30–60% cost), Headroom context (−50–90%) |
| 🔧 Fine-tuning | Gemma 3, Llama 3.2 |
| 🧑‍🏫 Framework crash courses | Google ADK, OpenAI Agents SDK |

## Notes

- **Provider-agnostic:** most templates switch model providers with a config
  change — point them at Claude (the repo's default) where you can.
- **Per-template setup:** check each template's own README/tutorial; featured ones
  have free walkthroughs on Unwind AI.
- On this repo's Mac, `mac-downloads/Install-Downloads.command` **clones** the cookbook to
  `~/awesome-llm-apps` (source only — no repo-wide deps installed; you `pip
  install -r requirements.txt` inside whichever template you run). It skips the
  clone if it's already there.
- Source of truth: <https://github.com/Shubhamsaboo/awesome-llm-apps>. License:
  Apache-2.0 — preserve attribution if you lift a template.
