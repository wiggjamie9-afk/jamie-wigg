# Setting up Hermes Agent for this workspace

[Hermes Agent](https://github.com/NousResearch/hermes-agent) is Nous Research's open-source agent CLI — comparable in shape to Claude Code, with built-in skills, persistent memory, MCP integration, and messaging gateways (Telegram / Discord / Slack / WhatsApp / Signal / Email). MIT-licensed.

> Honest framing: this repo already runs on Claude Code with a rich set of project skills (`/rhythmix-new`, `/album-launch`, `/dream`, the HyperFrames family). Hermes is **not** a drop-in replacement for those — its skill format is its own and the RHYTHMIX skills aren't ported. Where Hermes earns its keep here is **messaging access** (drive renders from Telegram on your phone) and **scheduled tasks** (cron-trigger an album launch, post status). See [§3](#3-where-it-could-actually-help-this-repo) for the narrow fit.

For the full feature list and architecture, see the upstream README: <https://github.com/NousResearch/hermes-agent>.

(Install commands and command names verified against the upstream README as of **2026-05-12** — re-check before relying on them.)

---

## 1. Install

```bash
# Linux / macOS / WSL2 / Termux
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Windows native (early beta — WSL2 is more battle-tested)
# In PowerShell:
#   irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex
```

The installer pulls `uv`, Python 3.11, Node.js, ripgrep, ffmpeg, and a portable MinGit on Windows. After it finishes:

```bash
source ~/.bashrc      # or: source ~/.zshrc
hermes                # interactive CLI
```

> ⚠️ The installer pipes a remote shell script straight to `bash`. Read it first if you don't fully trust the source: `curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | less`.

## 2. Configure a provider

```bash
hermes model       # pick provider + model interactively
hermes config set  # set individual values
hermes doctor      # diagnose issues
```

If you already followed `SETUP-9ROUTER.md`, point Hermes at 9Router by configuring an OpenAI-compatible provider with base URL `http://localhost:20128/v1` and your 9Router API key. That way Hermes inherits the same fallback chain and RTK token compression as your Claude Code setup.

## 3. Where it could actually help this repo

| Use case                                                                       | Why Hermes is a good fit                                                              |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Trigger a render from your phone                                                | `hermes gateway` exposes the agent over Telegram/Discord/Signal — message it `/render` |
| Scheduled launches (cron)                                                       | Hermes has built-in cron with platform delivery — e.g. "every Friday 9am post a new RHYTHMIX promo" |
| Email/Signal "what's the status of yesterday's render?" check-ins              | Persistent memory + messaging means you can ask follow-ups without re-explaining context |
| Alternative driver for the `creative-stack` MCP server                          | Hermes natively speaks MCP, so it can call the Replicate + ElevenLabs tools in `.mcp.json` directly |

For *authoring* RHYTHMIX videos, stay in Claude Code — the project skills only exist here. Use Hermes as a remote control / scheduler, not a primary author.

## 4. Migrating from OpenClaw (if applicable)

If you used OpenClaw before, Hermes can import settings, memories, skills, command allowlists, and API keys:

```bash
hermes claw migrate --dry-run    # preview
hermes claw migrate              # interactive full migration
```

This repo doesn't show signs of an OpenClaw setup (no `~/.openclaw` referenced in `.claude/` or `CLAUDE.md`), so skip this section unless you have one personally.

## 5. What this does *not* affect

- `.claude/skills/` and `.agents/skills/` — Hermes uses its own skill format under `~/.hermes/skills/`. The RHYTHMIX/HyperFrames skills here remain Claude-Code-only.
- `.mcp.json` — Hermes can *consume* MCP servers, but it doesn't auto-discover this repo's `creative-stack` server. You'd register it explicitly in Hermes's config.
- `.claude/settings.json` — separate config; Hermes has its own approval/allowlist system.
- Remotion / HyperFrames CLIs — they keep working as before; Hermes can call them as shell commands if you set up a skill for it.

## 6. Security notes

- The Telegram/Discord/Slack gateways accept commands from configured users. Lock down the allowlist (`hermes gateway setup`) before exposing anything that can run shell commands in this workspace.
- The `command approval` system gates risky bash calls — keep it on. Same idea as Claude Code's `permissions.deny`.
- Don't pair Hermes with Termux on a phone you also use for banking — the agent can run arbitrary shell commands in its working directory.

## 7. Troubleshooting

```bash
hermes doctor       # most issues surface here first
hermes update       # latest version
hermes --help       # full command list
```

Full docs: <https://hermes-agent.nousresearch.com/docs>.
