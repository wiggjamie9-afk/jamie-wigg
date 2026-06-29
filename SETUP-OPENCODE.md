# OpenCode — Setup & Reference

## Overview

**OpenCode** is an AI coding agent that runs in your **terminal** — you describe
what you want and it edits your code. It ships two built-in agents you switch
between (`build` for full-access development, `plan` for read-only analysis),
plus a `general` subagent for complex searches and multi-step tasks. There's
also a desktop app (beta) for macOS, Windows, and Linux.

> ### How this fits the RHYTHMIX repo
> Tangential but it belongs to a family this repo already documents: terminal AI
> coding agents — `SETUP-FREEBUFF.md`, `SETUP-HERMES.md`, `SETUP-AGENT-TARS.md`,
> `SETUP-OPENMANUS.md`, plus the OpenClaw CLI skills. OpenCode is a
> **Claude-Code-style coding agent**, i.e. an *alternative* to the harness you're
> already using here, not a content/video tool. Useful as a lightweight separate
> coding agent on a machine where Claude Code isn't set up. It does **not**
> replace any of the RHYTHMIX pipeline skills.

## Install

> **Tip:** Remove any versions older than `0.1.x` before installing.

### Quick install (YOLO)

```bash
curl -fsSL https://opencode.ai/install | bash
```

### Package managers

```bash
npm i -g opencode-ai@latest          # or bun/pnpm/yarn
scoop install opencode               # Windows
choco install opencode               # Windows
brew install anomalyco/tap/opencode  # macOS / Linux (recommended — always up to date)
brew install opencode                # macOS / Linux (official brew formula, updated less)
sudo pacman -S opencode              # Arch Linux (stable)
paru -S opencode-bin                 # Arch Linux (latest, from AUR)
mise use -g opencode                 # any OS
nix run nixpkgs#opencode             # or github:anomalyco/opencode for the latest dev branch
```

### Install directory

The install script picks the target path in this priority order:

1. `$OPENCODE_INSTALL_DIR` — custom installation directory
2. `$XDG_BIN_DIR` — XDG Base Directory Specification path
3. `$HOME/bin` — standard user binary directory (if it exists or can be created)
4. `$HOME/.opencode/bin` — default fallback

```bash
# Examples
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opencode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin       curl -fsSL https://opencode.ai/install | bash
```

## Desktop app (beta)

Download from the [releases page](https://github.com/anomalyco/opencode/releases)
or [opencode.ai/download](https://opencode.ai/download).

| Platform                | Download                              |
|-------------------------|---------------------------------------|
| macOS (Apple Silicon)   | `opencode-desktop-mac-arm64.dmg`      |
| macOS (Intel)           | `opencode-desktop-mac-x64.dmg`        |
| Windows                 | `opencode-desktop-windows-x64.exe`    |
| Linux                   | `.deb`, `.rpm`, or `.AppImage`        |

```bash
brew install --cask opencode-desktop          # macOS (Homebrew)
scoop bucket add extras; scoop install extras/opencode-desktop   # Windows (Scoop)
```

## Agents

OpenCode includes two built-in agents you switch between with the **Tab** key:

- **`build`** — default, full-access agent for development work.
- **`plan`** — read-only agent for analysis and code exploration:
  - denies file edits by default,
  - asks permission before running bash commands,
  - ideal for exploring unfamiliar codebases or planning changes.

A **`general`** subagent is also included for complex searches and multi-step
tasks. It's used internally and can be invoked with `@general` in messages.

## Notes

- The upstream **docs at [opencode.ai/docs](https://opencode.ai/docs) are the
  single source of truth** for configuration, agents, and capabilities. This doc
  is a deliberately minimal install/reference snapshot — check the docs before
  relying on specifics.
- As with any coding agent, review its diffs before committing, and don't point
  it at this repo's protected branches — keep work on the designated feature
  branch.
- **Naming caveat (from the OpenCode team):** projects that use "opencode" in
  their name (e.g. `opencode-dashboard`, `opencode-mobile`) should add a README
  note clarifying they are not built by or affiliated with the OpenCode team.

## Community

- Discord and X.com links are on the [OpenCode site](https://opencode.ai).
- Contributions: read the upstream contributing docs before opening a PR.
