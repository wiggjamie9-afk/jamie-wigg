# CC Switch: Unified Config Manager for AI Coding Tools

Cross-platform desktop app (Tauri 2) to manage providers, MCP servers, prompts, and skills across **7 AI coding tools** from one interface: Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes. No more hand-editing JSON/TOML/`.env` per tool.

GitHub: `cc-switch` · Windows / macOS / Linux · `brew install --cask cc-switch`

## Why It's Relevant Here

This repo *is* a Claude Code + MCP + Skills setup (`.mcp.json`, `.claude/settings.json`, 100+ skills, FleetView agents). CC Switch addresses exactly the pain this ecosystem accumulates as it grows:

- **Unified MCP & Skills management** — one panel to manage MCP servers + skills across Claude/Codex/Gemini/OpenCode/Hermes with bidirectional sync. This repo wires up many MCP servers (creative-stack, higgsfield, pollinations, playwright, context7, ruflo…) and 100+ skills; CC Switch is a GUI for that surface.
- **Cross-app prompt sync** — `CLAUDE.md` ↔ `AGENTS.md` ↔ `GEMINI.md` with backfill protection. Relevant since `headroom learn` and several tools here write to these files.
- **Provider switching** — swap LLM backends without editing config by hand; pairs conceptually with the gateways already documented (gpt4free, OpenClaw Zero Token).
- **OpenClaw + Hermes support** — both are already part of this ecosystem (`SETUP-HERMES.md`, OpenClaw skills queue); CC Switch manages their configs too.

## Key Features

| Area | What |
|---|---|
| **Provider management** | 50+ presets (AWS Bedrock, NVIDIA NIM, community relays); one-click import, tray quick-switch, drag-sort, import/export |
| **Proxy & failover** | Local proxy with hot-switching, format conversion, auto-failover, circuit breaker, health monitoring, request rectifier; app-level takeover (proxy Claude/Codex/Gemini independently) |
| **MCP / Prompts / Skills** | Unified MCP panel + Deep Link import; Markdown prompt editor w/ cross-app sync; one-click skill install from GitHub repos or ZIP (symlink or copy) |
| **Usage & cost** | Dashboard for spend/requests/tokens, trend charts, request logs, custom per-model pricing |
| **Sessions / Workspace** | Browse/search/restore conversation history; OpenClaw workspace editor (AGENTS.md, SOUL.md) |
| **System** | Cloud sync (Dropbox/OneDrive/iCloud/WebDAV/NAS), Deep Link (`ccswitch://`), dark/light theme, auto-update, **SQLite atomic writes + auto-backups**, i18n (zh/zh-TW/en/ja) |

## Install

```bash
# macOS (code-signed + notarized)
brew install --cask cc-switch
brew upgrade --cask cc-switch

# Arch Linux
paru -S cc-switch-bin

# Windows: .msi or portable .zip from Releases
# Linux: .deb / .rpm / .AppImage from Releases
```
Requirements: Windows 10+, macOS 12+, Ubuntu 22.04+/Debian 11+/Fedora 34+.

## Quick Start
1. **Add Provider** → pick a preset or custom config
2. **Switch** → main UI "Enable" or tray click (instant). Claude Code applies without restart; other CLIs need a restart.
3. **Back to official** → add an "Official Login" preset, restart the CLI, follow its OAuth flow.
4. **MCP/Prompts/Skills/Sessions** → dedicated panels; first launch can import existing CLI configs as the default provider.

## ⚠️ On the Sponsor / API-Relay Ecosystem — Important Caution

CC Switch itself is a legitimate open-source config manager. **But its README is wrapped in a large wall of sponsored "API relay" services** (PackyCode, AIGoCode, AICodeMirror, DMXAPI, Crazyrouter, CCSub, RunAPI, APIKEY.FUN, etc.) advertising Claude/GPT/Gemini access at "7%–66% of official price."

Treat these the same way as the reverse-engineered `kimi-free-api` already flagged in this knowledge base:

- **Many are reverse-engineered / diluted / shared-account relays.** Prices far below official rates usually mean account pooling, ToS violations, or model degradation. Several explicitly advertise "no reverse engineering" *because that is the known risk in this market.*
- **They require routing your API traffic (and often keys) through a third party** — prompts, code, and credentials transit someone else's gateway. That's a confidentiality and supply-chain risk for any RHYTHMIX/Studio work.
- **Account-suspension and continuity risk** — relays get banned; "zero risk of suspension" claims are marketing, not guarantees.

**Recommendation for this ecosystem:** use CC Switch for the *config management* value (unified MCP/Skills/prompts, atomic-write safety) if desired, but point it at **official channels** — direct Anthropic API, AWS Bedrock (sponsor "ClaudeAPI"/official Bedrock is the only no-degradation path), or the sanctioned free options already installed (OpenClaw Zero Token via browser login, gpt4free for non-sensitive tasks). **Do not route production RHYTHMIX/Studio traffic or real API keys through discount relays.** Of the listed sponsors, only official-API/Bedrock-backed ones (e.g. ClaudeAPI's stated Anthropic+Bedrock channel) avoid the degradation/reverse-engineering risk — and even those should be vetted.

## Fit & Caveats
- **Desktop app, runs on the user's machine** — not something to run in this GPU-less, headless sandbox. It's for the local dev environment where Claude Code/Codex/Gemini actually run.
- **Genuine value** = the unified MCP/Skills/prompt management + atomic-write config safety + cost dashboard, especially as this ecosystem's tool surface keeps growing.
- **Overlap** with `headroom` (which also touches CLAUDE.md/AGENTS.md) — coordinate so both don't fight over prompt files; CC Switch has backfill protection for this.

## References
- **GitHub**: `cc-switch` (Tauri 2 desktop app) · brew cask `cc-switch`
- **Supports**: Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes
- **Related in repo**: `.mcp.json`, `.claude/settings.json`, `SETUP-HERMES.md`, OpenClaw skills; gateways `gpt4free.md` / `openclaw-zero-token.md`; cost layer `headroom.md`

---

**Use Case for Ecosystem:** Legitimate open-source desktop manager for AI-coding-tool configs (providers, MCP, skills, prompts across 7 tools) with atomic-write safety + cost dashboard — useful for the local dev box as this repo's MCP/skill surface grows. ⚠️ Its sponsor wall of discount API-relays carries the same reverse-engineering/diluted-account/credential-routing risks as kimi-free-api: use CC Switch with OFFICIAL channels (Anthropic/Bedrock) or already-sanctioned free options (OpenClaw Zero Token, gpt4free), never route production keys/traffic through discount relays. Desktop-only — not for this sandbox.
