# Agent patterns — what we have, where it lives

> Source: nocode.joshua TikTok "7 Types of AI agents you can build in Claude".
> Mapping each pattern to **what's already shipped in this repo**, so you can
> point at a file when someone asks "do you have X?".

| # | Pattern | Where it already lives | Status |
|---|---------|------------------------|--------|
| 1 | **Basic Agent + Tools** | This — Claude Code in `/home/user/jamie-wigg`. Bash, Read, Write, Edit, Grep + GitHub MCP. | ✅ |
| 2 | **Sequential Pipeline** | `src/index.ts` — fetch trends → save → draft → save → publish → save. Each step builds on the last. | ✅ |
| 3 | **Parallel Execution + Shared Tools** | `src/trends/aggregate.ts` — `Promise.all([reddit, hn, google, youtube])` runs all four trend fetchers simultaneously, then merges by Jaccard similarity. | ✅ |
| 4 | **Agent + MCP Servers** | Two MCP servers wired in: `claude-mem` (user scope, memory) and `ruflo` / `claude-flow` (project scope, agent orchestration). See `.mcp.json` and `/root/.claude.json`. | ✅ |
| 5 | **Agent + Router** | Hook present: `UserPromptSubmit` in `.claude/settings.json` calls `.claude/helpers/hook-handler.cjs route`. Currently logs "Router not available, using default routing" — scaffolding shipped, not configured. | ⚙️ partial |
| 6 | **Sub-Agent Orchestrator (Dynamic Spawning)** | Ruflo dropped 98 specialized agents in `.claude/agents/` (architecture, backend-dev, security-auditor, ml-developer, etc.). I can spawn any of them via the `Agent` tool when a task fits. | ✅ |
| 7 | **Human in the Loop + Tools** | Default Claude Code behavior — every tool call shows you a prompt unless you launched with `--dangerously-skip-permissions`. The bot also has `--dry-run` mode (`src/index.ts`) which drafts but never posts. | ✅ |

## The honest read

You have a complete kit. The next move is not installing the 8th pattern from
the next TikTok — it's **using what's here.** Two things would actually move
the needle:

### 1. Wire up the router (Pattern 5)

Right now the `UserPromptSubmit` hook fires on every message but the router
isn't configured, so it falls through to default. You can teach it to route
specific prompts to specific ruflo agents (e.g. "design something" →
`system-architect` agent; "review this code" → `reviewer` agent).

If you want, I can read `.claude/helpers/hook-handler.cjs` and configure it
based on the kind of work you actually do most.

### 2. Add a review step to the bot (Pattern 7, deeper)

Current bot has two modes: `dry-run` (preview only) and `live` (post immediately).
A useful middle: `review` mode that drafts → saves to a queue → waits for you
to thumbs-up before posting.

```
npm run dry-run    # current: preview, never posts
npm run review     # NEW: draft + queue, prints "approve with: npm run approve"
npm run approve    # NEW: posts whatever's in the queue (one click of trust)
npm run live       # current: draft + post immediately
```

This is genuinely useful because it bridges the gap between "I haven't seen
the draft" and "I trust the bot blindly". Most of the time you'll want
review mode.

## What you do NOT need

- More TikTok patterns dumped into the repo. You have all 7.
- More MCP servers. Two is already a lot of overhead per session.
- More skills. You have ruflo (98), claude-mem, emil-design-eng, impeccable.
- The `--dangerously-skip-permissions` flag (still). Pattern 7 is on by
  default for a reason.

## When to revisit

The next genuinely useful pattern to add would be **scheduled / cron
execution** — i.e. the bot running on a server every N hours without you
clicking anything. That's not in the 7 above; it's an infrastructure
question (Railway / Render / VPS) and we discussed it earlier. When you're
ready, that's the next concrete step.
