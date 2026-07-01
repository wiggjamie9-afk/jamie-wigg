# Mac Downloads — Last 4 Days

> Your one-stop folder for pulling the last few days of repo additions onto your
> Mac. This file is the plain-English summary; **`Install-Downloads.command`** in
> this same folder installs everything in one go.
>
> **Period covered:** 2026-06-26 → 2026-06-30 (last 4 days)
> **Generated:** 2026-06-30
>
> This folder (`mac-downloads/`) is the permanent home — check here each time and
> you'll find the latest summary + installer together.

---

## How to get this onto your Mac

Open Terminal on your Mac and run:

```bash
# If you already have the repo cloned:
cd path/to/jamie-wigg
git pull

# If you don't have it yet:
git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
cd jamie-wigg

# This summary:
open mac-downloads/README.md
```

### Install everything (one command)

Double-click **`mac-downloads/Install-Downloads.command`** in Finder, or run:

```bash
bash mac-downloads/Install-Downloads.command
```

It runs **unattended** — installs automatically with no prompts. It skips
anything already installed, so it's safe to re-run. To skip the heavy steps
(SD WebUI, Deep Playground, Penpot, the Awesome LLM Apps clone):

```bash
SKIP_HEAVY=1 bash mac-downloads/Install-Downloads.command
```

> First time double-clicking? macOS may block it ("unidentified developer").
> Right-click the file → **Open** → **Open**, or run
> `xattr -d com.apple.quarantine mac-downloads/Install-Downloads.command` once.

---

## What the installer sets up

### ✅ Auto (light — CLIs + a pip package)

| Tool | Doc | After install |
|---|---|---|
| **MoviePy v2** — Python video post-processing | `SETUP-MOVIEPY.md` | `python3 -c 'import moviepy'` |
| **OpenCode CLI** — terminal AI coding agent | `SETUP-OPENCODE.md` | `opencode` |
| **SimpleX Chat CLI** — privacy-first messaging | `SETUP-SIMPLEX.md` | `simplex-chat` |
| **Impeccable** — design skill + 44-rule detector | `SETUP-IMPECCABLE.md` | `/impeccable init`, `npx impeccable detect .` |
| **Vercel CLI** — deploy / `vercel dev` | `SETUP-VERCEL.md` | `vercel` |
| **Graphify** — map the repo into a queryable knowledge graph | `SETUP-GRAPHIFY.md` | `/graphify .`, `graphify query "…"` |

### 🌐 Opens in your browser (nothing to install)

| Item | Doc |
|---|---|
| **Viral Hook Generator (HookLab)** — free in-browser hook tool / lead magnet | `tools/hook-generator/README.md` |

### 📦 Heavy (skipped with `SKIP_HEAVY=1`)

| Item | Where it lands | Doc |
|---|---|---|
| **Stable Diffusion WebUI** (AUTOMATIC1111) | `~/stable-diffusion-webui` | `SETUP-SD-WEBUI.md` |
| **Deep Playground** (TF neural-net demo) | `~/deep-playground` | `SETUP-DEEP-PLAYGROUND.md` |
| **Penpot** self-host design platform | `infra/penpot/` → `localhost:9001` (needs Docker) | `SETUP-PENPOT.md` |
| **Awesome LLM Apps** cookbook | `~/awesome-llm-apps` (source only; per-template `pip install`) | `SETUP-AWESOME-LLM-APPS.md` |
| **ClawFleet** — OpenClaw fleet dashboard | built at `~/clawfleet/bin/clawfleet` (needs Docker + Go; image ~1.4GB on first `dashboard`) | `SETUP-CLAWFLEET.md` |

### 🔗 Pointers (import-only / hosted / per-project / already-in-repo)

| Item | How to use | Doc |
|---|---|---|
| **PageAgent** in-page copilot | embed `pageagent/pageagent-copilot.js`; open `pageagent.html` | `pageagent/README.md` |
| **VEO3 faceless content** (n8n) | import `automation/veo3-faceless-content-system/workflow.json` | its README |
| **Kling → socials** (n8n) | import `automation/kling-social-pipeline/workflow.json` | its README |
| **Vendored skills** (mattpocock + anthropic) | already in `.claude/skills/` after `git pull` → `/`-commands | `SETUP-MATT-POCOCK-SKILLS.md`, `SETUP-ANTHROPIC-SKILLS.md` |
| **Ruixen UI** | per-project via shadcn CLI | `SETUP-RUIXEN-UI.md` |
| **MiniMax-01** | hosted API / MCP | `SETUP-MINIMAX-01.md` |
| **Palmier Pro** | macOS 26 Apple-Silicon only | `SETUP-PALMIER-PRO.md` |
| **Freebuff CLI** | install per its own README | `SETUP-FREEBUFF.md` |

---

## What landed, by window

### 2026-06-26 → 2026-06-28 (PRs #106, #107)

- **PageAgent** in-page GUI copilot (`pageagent/`, `pageagent.html`) — DOM agent for RHYTHMIX pages.
- **Setup/reference docs:** `SETUP-SD-WEBUI.md`, `SETUP-MOVIEPY.md`, `SETUP-MINIMAX-01.md`, `SETUP-RUIXEN-UI.md`, `SETUP-PALMIER-PRO.md`, `SETUP-DEEP-PLAYGROUND.md`, `SETUP-FREEBUFF.md`.
- **Kling → socials** automation (`automation/kling-social-pipeline/`).
- **CI fix** (#107): green Tests workflow, artifact v3→v4, dangling submodule removed.

### 2026-06-28 → 2026-06-30 (PRs #112–#118 + commits)

- **Viral Hook Generator (HookLab)** — `tools/hook-generator/` (free in-browser tool + make-money guide).
- **VEO3 faceless content system** (n8n) — `automation/veo3-faceless-content-system/` + the `n8n-workflow-generator` skill.
- **OpenCode CLI** — `SETUP-OPENCODE.md`.
- **Penpot** self-host — `infra/penpot/` + `SETUP-PENPOT.md`.
- **12 vendored mattpocock skills** + anthropics/skills tracking; Palmier Pro doc refresh.

### 2026-06-30 (this session)

- **SimpleX Chat** — `SETUP-SIMPLEX.md` (privacy-first messenger + CLI for private bots).
- **Impeccable** — `SETUP-IMPECCABLE.md` (design skill + detector for AI frontends).
- **Vercel CLI** — `SETUP-VERCEL.md` (deploy CLI; tangential — repo ships via Pages/Cloudflare).
- **Awesome LLM Apps** — `SETUP-AWESOME-LLM-APPS.md` (fork-ready LLM app template cookbook).
- **Graphify** — `SETUP-GRAPHIFY.md` (the knowledge-graph tool that produces the repo's `graphify-out/` snapshot).
- **This folder** — moved the Mac download bundle into `mac-downloads/` so it has a permanent home.

---

## At a glance

- **Auto-installable on the Mac (6):** MoviePy, OpenCode, SimpleX, Impeccable, Vercel, Graphify.
- **Open-and-use (1):** Viral Hook Generator.
- **Heavy/optional (5):** SD WebUI, Deep Playground, Penpot, Awesome LLM Apps, ClawFleet.
- **Pointers (8):** PageAgent, VEO3 n8n, Kling n8n, vendored skills, Ruixen UI, MiniMax-01, Palmier Pro, Freebuff.
