# Palmier Pro — Setup & Reference

## Overview

[Palmier Pro](https://palmier.io) is an **MCP-controllable video editor** — a
**Swift-native** (built from scratch; north star Premiere Pro) timeline editor
that exposes an **MCP server**, so an agent (Claude Code / Claude Desktop /
Cursor / Codex) can drive the timeline directly. You can also use the **in-app
agent** to work on the same project alongside it. The editor, MCP server, and
agent chat are **open source (GPLv3)**; only the generative-AI processing is
closed and gated behind login + subscription.

Built-in **generative AI** can produce videos and images from SOTA models —
**Seedance, Kling, Nano Banana Pro** — directly inside the timeline.

**Site**: https://palmier.io · Repo:
[palmier-io/palmier-pro](https://github.com/palmier-io/palmier-pro) ·
Updates: [@Palmier_io](https://twitter.com/Palmier_io) · Actively released
(v0.4.4 at time of writing; see the repo's Releases) · License: GPLv3,
© 2026 Palmier, Inc.

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
