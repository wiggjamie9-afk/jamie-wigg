# Palmier Pro — Setup & Reference

## Overview

[Palmier Pro](https://palmier.io) is an **MCP-controllable video editor** — a
CapCut/Premiere-style timeline editor that exposes an **MCP server**, so an agent
(Claude Code / Claude Desktop / Cursor / Codex) can drive the timeline directly.
The editor, MCP server, and agent chat are **open source (GPLv3)**; only the
generative-AI processing is closed and gated behind login + subscription.

**Site**: https://palmier.io · Updates: [@Palmier_io](https://twitter.com/Palmier_io)
· License: GPLv3, © 2026 Palmier, Inc.

> ### How this fits the RHYTHMIX repo
> **Conceptually a strong fit** — it sits at the intersection of two things this
> repo already does: the video pipeline (HyperFrames render → MP4 Cuts) and
> agent-driven MCP tooling. You could have Claude Code stitch/trim/caption Cuts
> on a real NLE timeline by talking to its MCP server, as an interactive
> alternative to the headless MoviePy/FFmpeg post-processing in
> `SETUP-MOVIEPY.md`.
>
> **Hard constraint:** Palmier Pro runs on **macOS 26 (Tahoe), Apple Silicon
> only**. This repo is explicitly iPhone-driven with **no desktop**
> (`CREATIVE-AI-STACK.md`), so it's **not usable today** — treat this as a
> bookmark for when/if a Mac is in the loop. The free editor + MCP server need no
> login; only the gen-AI features cost money.

## Install (on a Mac)

A helper script downloads the latest `.dmg` and opens it for you. Run it **on a
Mac** (Apple Silicon, macOS 26 Tahoe) — it guards against Linux/Intel and exits
early, so it's a no-op in this repo's cloud sandbox:

```bash
bash scripts/install-palmier-mac.sh
```

It pulls the newest release from GitHub (falling back to a pinned version),
drops `PalmierPro.dmg` in `~/Downloads`, and opens the disk image. Then drag
Palmier Pro into Applications and launch it (first launch: right-click → Open to
clear Gatekeeper). Editing your own footage is free; in-timeline gen-AI needs
login + subscription.

## Connect the MCP server

The app must be **open** — it serves MCP at `http://127.0.0.1:19789/mcp` over
HTTP while running.

**Claude Code**
```bash
claude mcp add --transport http palmier-pro http://127.0.0.1:19789/mcp
```

**Codex**
```bash
codex mcp add palmier-pro --url http://127.0.0.1:19789/mcp
```

**Cursor** — in-app `Help → MCP Instructions → Install in Cursor`, or add to
`~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "palmier-pro": {
      "type": "http",
      "url": "http://127.0.0.1:19789/mcp"
    }
  }
}
```

**Claude Desktop** — one-click via the bundled `.mcpb`: `Help → MCP Instructions
→ Install in Claude Desktop`.

> Not added to this repo's `.mcp.json` — that file is for servers usable from the
> cloud sandbox / the user's actual setup. Palmier's server is local to a running
> Mac app, so wire it into your local Claude Code config (above) on that machine,
> not the repo.

## What's open vs closed

| Part | Status |
|---|---|
| Video editor (no gen-AI) | Open source (GPLv3), free, no login |
| MCP server | Open source, free |
| Agent chat | Open source |
| Generative-AI processing | Closed; requires login + subscription |

## Platform

macOS 26 (Tahoe) on Apple Silicon only. See the project's `FAQ.md` /
`CONTRIBUTING.md` upstream for details and dev setup.

## License

GPLv3. Note: GPLv3 is copyleft — relevant only if you fork/redistribute Palmier
itself; using it as an external editor/MCP server alongside this repo has no
licensing impact here.
