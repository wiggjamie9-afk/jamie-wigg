# HERDCHECK — Agent TUI

A terminal coding agent built on [`@openrouter/agent`](https://www.npmjs.com/package/@openrouter/agent),
scaffolded with OpenRouter's [`create-agent-tui`](https://github.com/OpenRouterTeam/skills/tree/main/skills/create-agent-tui)
skill. `@openrouter/agent` runs the inner loop (model calls, tool execution, stop
conditions); this project is the outer shell — terminal UI, config, session
persistence, tools, and the entry point.

## Quick start

```bash
cd agent-tui
npm install
cp .env.example .env       # then paste your key
# OPENROUTER_API_KEY=...    (get one at https://openrouter.ai/settings/keys)
npm start
```

Type a request at the `›` prompt. `exit` quits. The agent can read/write/edit
files, glob, grep, list directories, run shell commands, and use OpenRouter's
server-side web-search and datetime tools.

## What's configured

| Aspect | Choice |
|---|---|
| Model | `~anthropic/claude-sonnet-latest` (latest-alias — auto-updates) |
| Tools | file read/write/edit · glob · grep · list-dir · shell · web-search · datetime |
| Input style | `block` (full-width box, adapts to terminal theme) |
| Tool display | `grouped` (bold action labels + tree-branch output) |
| Loader | `spinner` (braille dots), text "Working" |
| Banner | HERDCHECK ASCII on startup |
| Session | JSONL log per run under `.sessions/` |
| Slash commands | `/model`, `/new`, `/help` |

Override any of these in `agent.config.json`, or via env vars
(`OPENROUTER_API_KEY`, `AGENT_MODEL`, `AGENT_MAX_STEPS`, `AGENT_MAX_COST`).

## Slash commands

- `/model` — search the OpenRouter catalog and switch model live
- `/new` — start a fresh conversation (new session file)
- `/help` — list commands

## Scripts

```bash
npm start       # run the agent (tsx src/cli.ts)
npm run dev      # run with watch/reload
npm run typecheck # tsc --noEmit
```

## Project structure

```
src/
  config.ts        # layered config (defaults → agent.config.json → env → overrides)
  agent.ts         # core runner over @openrouter/agent (streaming + retry)
  cli.ts           # entry point — banner, input loop, loader, renderer, sessions, commands
  tools/           # file-read/write/edit, glob, grep, list-dir, shell, custom + index
  session.ts       # JSONL append-only conversation log
  terminal-bg.ts   # OSC-11 background detection for the adaptive input box
  input.ts         # block input style (styledReadLine)
  renderer.ts      # grouped tool display (TuiRenderer)
  loader.ts        # spinner loader animation
  commands.ts      # slash-command registry + /model, /new, /help
  banner.ts        # HERDCHECK ASCII banner
```

## Add a tool

Copy `src/tools/custom.ts`, give it a real name/schema/implementation, and add it
to the array in `src/tools/index.ts`. Tools follow the `tool()` pattern from
`@openrouter/agent/tool` with a Zod input schema.
