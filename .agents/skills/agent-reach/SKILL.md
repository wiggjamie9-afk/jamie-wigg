---
name: agent-reach
description: Agent Reach (Panniantong/agent-reach) — a capability layer that installs/selects/health-checks the most reliable backends so an agent can read the web, YouTube, RSS, GitHub, Twitter/X, Reddit, 小红书, B站, LinkedIn, V2EX, 雪球, Exa search, etc. Use as a reference for giving an agent internet-reach on a real machine. NOTE: best installed on the user's own computer (needs browser cookies + open egress); it does NOT belong in this ephemeral, egress-restricted sandbox, and its installer executes a remote doc — see the security notes.
---

# Agent Reach (internet capability layer)

Open-source (MIT) Python tool that, for each platform, keeps an ordered list of
**preferred + fallback backends**, then installs / routes / health-checks them so an agent can
*read* internet content without you wiring each one up. It is a capability layer, not a wrapper —
the actual reading is done by the agent calling the upstream tools (yt-dlp, gh, bili-cli, Jina
Reader, Exa via mcporter, feedparser, …) directly.

- Repo: https://github.com/Panniantong/agent-reach · Author: @Neo_Reidlab

## ⚠️ Read before installing

1. **Install on your own machine, not here.** This sandbox is ephemeral (installs vanish on
   reclaim) and has restricted egress — Agent Reach's whole point is bypassing platform blocks,
   which the sandbox proxy defeats. It needs your **browser cookies** + open network to be useful.
2. **The official install is "let your agent fetch and execute a remote `install.md`."** That
   runs system-package installs, `pip`, MCP config (mcporter), and credential/cookie handling
   from a remote document. Treat that as the trust decision it is. Prefer **`--safe`**
   (lists what it needs, changes nothing) or **`--dry-run`** (preview) first, and read the doc.
3. **Cookie platforms (Twitter, 小红书, Reddit) → use a throwaway account**, never your main —
   scripted API calls can trip platform detection and get accounts limited/banned.

## Install (on your machine)

The maintainer's one-liner (paste to your agent):

> 帮我安装 Agent Reach：https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md

Or the package/CLI directly (Python 3.10+):

```bash
pip install agent-reach
agent-reach install --env=auto            # full auto (personal machine)
agent-reach install --env=auto --safe     # safe: lists needs, no system changes
agent-reach install --env=auto --dry-run  # preview only
agent-reach doctor                         # which backend each channel is using + fixes
agent-reach uninstall [--dry-run|--keep-config]
```

OpenClaw users must first enable exec perms: `openclaw config set tools.profile "coding"`.

## Channels (preferred ▸ fallback)

| Platform | Zero-config | After login/config |
|---|---|---|
| Web | read any page (Jina Reader) | — |
| YouTube | transcripts + search (yt-dlp) | — |
| RSS | any feed (feedparser) | — |
| Search | — | Exa semantic search (MCP, free, no key) |
| GitHub | public read + search (gh) | private repos, issues/PRs |
| Twitter/X | read one tweet | search/timeline/long posts (twitter-cli ▸ OpenCLI) |
| B站 | search + details (bili-cli) | subtitles (OpenCLI) |
| Reddit | — (anon API blocked) | OpenCLI (browser session) ▸ rdt-cli + cookie |
| 小红书 | — | OpenCLI (desktop) ▸ xiaohongshu-mcp ▸ xhs-cli |
| LinkedIn | public pages (Jina) | profiles/companies/jobs (linkedin-mcp) |
| V2EX / 雪球 | posts / quotes | — |

Backends rotate as platforms change (e.g. 2026-06: yt-dlp 412-blocked on B站 → switched to
bili-cli, zero user action). `agent-reach doctor` always reports the live backend.

## Security model

Credentials live only in `~/.agent-reach/config.yaml` (mode 600), never uploaded. `--safe`
avoids system changes; `--dry-run` previews; channels are pluggable (swap a `channels/*.py`
file you don't trust). Cookies = full login power → throwaway accounts only.

## For RHYTHMIX

Useful on *your* machine for content research feeding RHYTHMIX work (read a YouTube/B站 video,
search Reddit/小红书 for sentiment, pull RSS). It complements the OpenManus/browser-automation
tools already referenced in `CLAUDE.md`. Not for the cloud sandbox.
