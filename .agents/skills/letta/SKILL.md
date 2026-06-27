---
name: letta
description: Letta (formerly MemGPT) — build stateful AI agents with advanced, persistent memory that learn and self-improve over time. Two products - Letta Code (a local terminal agent CLI with built-in memory/continual-learning skills) and the Letta API/SDK (Python + TypeScript) to embed stateful, memory-backed agents into your own apps. Use when you want long-term agent memory, self-improving assistants, or to add a memory layer to a RHYTHMIX app. NOTE: needs a Letta Cloud API key OR a self-hosted Letta server; agents persist there, not in this ephemeral sandbox.
---

# Letta (stateful agents + advanced memory)

Letta is an open-source framework for agents with **persistent, editable memory** that improves
over time. Its model is "memory as an OS": the agent manages **memory blocks** (e.g. `human`,
`persona`) plus archival memory, deciding what to keep, edit, and recall — so it remembers
across sessions instead of starting fresh. Model-agnostic (recommends Opus 4.5 / GPT-5.2).

- Site: https://letta.com · Docs/API: https://docs.letta.com · Repo: github.com/letta-ai/letta

## Two ways to use it

| Product | What it is | Install |
|---|---|---|
| **Letta Code** | A local terminal agent (like Claude Code) with built-in advanced-memory + continual-learning skills/subagents | `npm install -g @letta-ai/letta-code` → run `letta` (Node 18+) |
| **Letta API / SDK** | Embed stateful agents into your apps | TS: `npm i @letta-ai/letta-client` · Py: `pip install letta-client` |

## Where agents/memory actually live

Agents are stateful **server-side** — you need either:
- **Letta Cloud** (`LETTA_API_KEY`), or
- a **self-hosted Letta server** (open source; run locally/VPS via Docker or `pip install letta` → `letta server`).

⚠️ This cloud sandbox is ephemeral — a Letta server or any local agent state here vanishes on
reclaim. Run Letta on **your machine, a VPS, or Letta Cloud** for durable memory.

## SDK quickstart (stateful agent)

```python
from letta_client import Letta
import os
client = Letta(api_key=os.getenv("LETTA_API_KEY"))   # or base_url=<self-hosted server>

agent = client.agents.create(
    model="anthropic/claude-opus-4-5",   # model-agnostic
    memory_blocks=[
        {"label": "human",   "value": "Name: Jamie. Builds RHYTHMIX (AI music platform)."},
        {"label": "persona", "value": "I am Jamie's build assistant; I remember our decisions."},
    ],
    tools=["web_search", "fetch_webpage"],
)
resp = client.agents.messages.create(agent_id=agent.id, input="What do you know about me?")
for m in resp.messages: print(m)
```
The agent keeps and updates those memory blocks across every future message — no re-explaining.

## How it fits the "stop re-asking" goal

This is the **auto-managed** end of the memory spectrum (vs. Memos = manual Markdown capture):
- **Letta / Mem0 / Zep** — agent extracts, edits, and recalls memory automatically.
- **Memos / Basic Memory** — you own plain notes the agent reads.
- **Letta's edge** = self-editing memory blocks + continual learning, so the agent genuinely
  *improves* its picture of you over time.

Concrete RHYTHMIX uses: a memory-backed assistant inside STARLIGHTMIX Studio (via the SDK), or
running **Letta Code** locally as a self-improving build agent alongside Claude Code.

## License / next steps

Open source. To adopt: (1) self-host a Letta server or get a Letta Cloud key, (2) `pip/npm`
install the client, (3) create an agent with your standing context as memory blocks. Ask if you
want a starter SDK example scaffolded into the repo or the Letta Code CLI tried locally.
