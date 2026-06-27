---
name: supermemory
description: Supermemory — the memory & context layer for AI; #1 on LongMemEval, LoCoMo, and ConvoMem. Gives any MCP client (incl. Claude Code) persistent memory that auto-extracts facts, builds user profiles, resolves contradictions, and auto-forgets. Use via the hosted MCP (already wired into .mcp.json), the SDK (npm/pip), framework wrappers, or self-hosted local binary. NOTE: the hosted MCP stores your data in Supermemory's cloud — use `supermemory local` for a fully private/offline store.
---

# Supermemory (memory + context layer)

State-of-the-art AI memory: **#1 on LongMemEval (81.6%), LoCoMo, and ConvoMem**. Auto-extracts
facts from conversations, maintains user profiles (stable facts + recent activity, ~50ms), runs
hybrid **RAG + memory** in one query, handles temporal updates/contradictions, and auto-forgets
expired info. Connectors (Drive, Gmail, Notion, OneDrive, GitHub) + multimodal extractors
(PDF/image OCR/video transcription/code).

- Site/docs: https://supermemory.ai/docs · App: https://app.supermemory.ai

## ✅ Already wired into this repo

The **hosted MCP** is added to `.mcp.json`:
```json
"supermemory": { "url": "https://mcp.supermemory.ai/mcp" }
```
On first use in Claude Code it does an **OAuth browser sign-in** (won't complete in this headless
sandbox — it activates when you run Claude Code on your own machine). Tools it gives Claude:

| Tool | What it does |
|---|---|
| `memory` | Save/forget info — Claude calls it automatically when you share something worth keeping |
| `recall` | Search memories by query → relevant memories + your profile summary |
| `context` | Injects your full profile at conversation start (type `/context` in Claude Code) |

Memory is scoped by **project / container tags** (separate work vs personal, per client/repo).

### Auth options
- **OAuth** (default, what's wired) — sign in on first connect.
- **API key** — instead set a header (don't commit the key):
  `"headers": { "Authorization": "Bearer ${SUPERMEMORY_API_KEY}" }`.

## ⚠️ Privacy: hosted vs local

The wired hosted MCP **stores your memories in Supermemory's cloud**. For a fully private store,
run it yourself — same API, just change `baseURL`:

```bash
curl -fsSL https://supermemory.ai/install | bash    # or: npx supermemory local
supermemory-server                                  # → http://localhost:6767 (prints an API key)
```
Bring any model (OpenAI/Anthropic/Gemini/Groq) or go **fully offline with Ollama**. Data lives in
`./.supermemory`. To point the MCP/SDK at local, use `baseURL: "http://localhost:6767"`.

## Build with it (SDK)

```bash
npm install supermemory   # or: pip install supermemory
```
```ts
const client = new Supermemory();
await client.add({ content: "User prefers functional TypeScript", containerTag: "user_123" });
const { profile, searchResults } = await client.profile({ containerTag: "user_123", q: "style?" });
// profile.static → long-term facts · profile.dynamic → recent context
```
Framework wrappers: Vercel AI SDK, LangChain/LangGraph, OpenAI Agents SDK, Mastra, Agno, n8n.

## Plugins & alternatives

Official plugins exist for Claude Code (`supermemoryai/claude-supermemory`), OpenCode, OpenClaw,
Hermes. Benchmark harness: `npx skills add supermemoryai/memorybench`.

Where it sits vs the others you've looked at: Supermemory = **auto-extracted memory + RAG +
connectors, easiest hosted MCP install** (this is why it's wired). Memos/Basic Memory = manual
Markdown you own. Letta = agent-managed memory blocks. Mem0/Zep = other auto layers. For
**fully-local, no-cloud** memory, see the `mempalace` skill.

## RHYTHMIX fit

This is the lowest-effort way to give Claude Code persistent memory of your projects, decisions,
and preferences so you stop re-explaining. For sensitive work, run `supermemory local` instead of
the hosted endpoint. MIT-friendly tooling; hosted service per their ToS.
