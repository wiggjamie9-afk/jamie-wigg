# Downloads — Last 2 Days

> A plain summary of everything added to the `jamie-wigg` repo over the last two days,
> so you can pull it down to your Mac in one place.
>
> **Period covered:** 2026-06-28 → 2026-06-30
> **Pull requests merged:** #112, #113, #114, #115, #116, #117, #118 (+ doc/skill commits)
> **Generated:** 2026-06-30

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

# This summary file:
open DOWNLOADS-LAST-2-DAYS.md
```

Or download just this one file from GitHub:
`https://github.com/wiggjamie9-afk/jamie-wigg/blob/main/DOWNLOADS-LAST-2-DAYS.md` → **Raw** → save.

### Install the new tools

Double-click **`Install-Downloads.command`** in Finder, or run:

```bash
bash Install-Downloads.command
```

It runs **unattended** — installs everything automatically with no prompts:
prerequisites (Homebrew, node, git, Docker check), the **OpenCode CLI**, the
**SimpleX Chat CLI**, the **Impeccable** design toolkit, the **Vercel CLI**, opens
the **Viral Hook Generator** in your browser, and (optionally) brings up the
**Penpot** design platform via Docker Compose. It skips anything already
installed, so it's safe to re-run.

To skip the one heavy step (Penpot's Docker stack) on a given run:

```bash
SKIP_HEAVY=1 bash Install-Downloads.command
```

It also prints where to go for the import-only / hosted items (the VEO3 n8n
workflow, the vendored skills, Palmier Pro).

> First time double-clicking? macOS may block it ("unidentified developer").
> Right-click the file → **Open** → **Open**, or run
> `xattr -d com.apple.quarantine Install-Downloads.command` once.

---

## #112 / #114 — Viral Hook Generator (HookLab)

A free, no-cost web tool that hands people scroll-stopping video hooks (the first
line of a TikTok / Reel / Short). Runs **100% in the browser** — no server, no API
keys, no monthly fees — and doubles as an email-list lead magnet.

| File | Lines | What it is |
|---|---:|---|
| `tools/hook-generator/index.html` | 422 | The whole tool — self-contained HTML/JS. Edit the two CONFIG lines at the top of the `<script>` block to wire your email list. |
| `tools/hook-generator/README.md` | 73 | Setup (2 min), the strategy, deploy notes. Live URL after deploy: `rhythmixapp.com.au/tools/hook-generator/`. |
| `tools/hook-generator/THE-PLAN.md` | 75 | The traffic → list → sell plan behind it. |
| `tools/hook-generator/START-HERE-MAKE-MONEY.md` | 107 | Step-by-step make-money guide for using the tool. |

**On your Mac:** the installer opens `tools/hook-generator/index.html` in your
browser. Nothing to install — just open and use it.

---

## #113 / #115 / #116 / #117 — VEO3 faceless content system (n8n)

An end-to-end n8n workflow: generate a faceless short with VEO3, then post it to
your connected socials in one upload-post call. Shipped alongside a new
`n8n-workflow-generator` skill that turns a workflow breakdown into import-ready,
validated n8n JSON.

| File | Lines | What it is |
|---|---:|---|
| `automation/veo3-faceless-content-system/workflow.json` | 325 | The importable n8n workflow. Final state: one upload-post call to **5 connected platforms** (Instagram dropped — not connected), multipart file upload fixed. |
| `automation/veo3-faceless-content-system/README.md` | 101 | How to import and run it. |
| `.claude/skills/n8n-workflow-generator/SKILL.md` | 91 | The skill itself (`/n8n-workflow-generator`). |
| `.claude/skills/n8n-workflow-generator/gemini-extraction-prompt.md` | 51 | Step-1 extraction prompt. |
| `.claude/skills/n8n-workflow-generator/validate-workflow.mjs` | 110 | JSON validator/checker. |

**On your Mac:** import `automation/veo3-faceless-content-system/workflow.json`
into your n8n instance (nothing to globally install).

---

## #118 — OpenCode CLI (setup & reference)

A terminal AI coding-agent CLI (built-in `build`/`plan` agents + a desktop app) —
an alternative coding agent in the same family as Freebuff / Hermes / Agent TARS.

| File | Lines | What it is |
|---|---:|---|
| `SETUP-OPENCODE.md` | 105 | Install options, the `build`/`plan` agents, desktop app, config. |

**On your Mac:** the installer runs
`brew install anomalyco/tap/opencode` (falls back to the official install
script). Then run `opencode` in any project.

---

## SimpleX Chat — privacy-first messaging (setup & reference)

A messenger with **no user identifiers of any kind** (pairwise per-queue IDs),
double-ratchet + extra NaCl encryption + post-quantum key exchange, Trail of
Bits-audited (AGPLv3). Has a terminal CLI that runs as a local WebSocket server —
useful here for **private bots/automations** (e.g. a render-finished or
new-download-bundle notifier).

| File | Lines | What it is |
|---|---:|---|
| `SETUP-SIMPLEX.md` | — | Overview, the no-identifier model, app + CLI install, connection/QR flow, bot dev, privacy limitations. |

**On your Mac:** the installer runs the official SimpleX CLI install
(`curl … install.sh | bash`). Then run `simplex-chat`. Mobile/desktop apps are
linked in the doc.

---

## Impeccable — design-quality toolkit for AI coding agents (setup & reference)

1 skill + 23 `/impeccable` commands + live browser mode + **44 deterministic
detector rules** for AI-frontend slop (Inter everywhere, purple gradients, nested
cards, bounce easing). Directly relevant to `studio/`, the root site, and the
`sites/<slug>/` pipeline; a parallel skill to the repo's `frontend-design`.

| File | Lines | What it is |
|---|---:|---|
| `SETUP-IMPECCABLE.md` | — | Install (`npx impeccable install`), the 23 commands, the standalone `detect` CLI, `.gitignore` block, how it maps to the brand DESIGN.md. |

**On your Mac:** the installer runs
`npx impeccable install --providers=claude --scope=global`. Then `/impeccable
init` in your AI tool, or `npx impeccable detect .` as a CI-style gate.

---

## Vercel CLI — deploy from the terminal (setup & reference)

`vercel` / `vc` for `vercel deploy` and `vercel dev`. Tangential here — this repo
ships via **GitHub Pages + Cloudflare Pages**, not Vercel — kept for one-off /
experimental deploys.

| File | Lines | What it is |
|---|---:|---|
| `SETUP-VERCEL.md` | — | Standard `npm i -g vercel`, the opt-in native binary, basic usage, and the upstream monorepo contributing notes. |

**On your Mac:** the installer runs `npm i -g vercel` (standard Node.js CLI; the
native `@vercel/vc-native` binary is left opt-in). Then run `vercel`.

---

## Penpot — self-host design platform (Docker Compose)

The official Penpot stack (frontend, backend, exporter, MCP, Postgres 15,
Valkey, mailcatcher), pinned for a reproducible self-host. Maps to the brand
design system and feeds `studio/` + the site-build pipeline.

| File | Lines | What it is |
|---|---:|---|
| `infra/penpot/docker-compose.yaml` | 263 | Official compose, Penpot `2.16` by default (`PENPOT_VERSION` overrides). |
| `infra/penpot/README.md` | 30 | `docker compose -p penpot up -d` → `http://localhost:9001`. |
| `SETUP-PENPOT.md` | 104 | Full reference (design tokens, components/variants, MCP, export). |

**On your Mac:** if Docker Desktop is running, the installer brings the stack up
with `docker compose -p penpot up -d` (this is the heavy step — skip it with
`SKIP_HEAVY=1`). Then open `http://localhost:9001`.

---

## Vendored skills + reference docs

Skill bundles synced into the repo (no install needed — they live in
`.claude/skills/` and are available as slash commands), plus their setup docs.

| File / area | Lines | What it is |
|---|---:|---|
| `.claude/skills/*` (12 new mattpocock skills) | ~1,600 | `ask-matt`, `codebase-design`, `domain-modeling`, `git-guardrails-claude-code`, `grilling`, `implement`, `migrate-to-shoehorn`, `resolving-merge-conflicts`, `scaffold-exercises`, `setup-pre-commit`, `teach`, `writing-great-skills`. |
| `SETUP-MATT-POCOCK-SKILLS.md` | 145 | mattpocock/skills reference + how to re-sync. |
| `SETUP-ANTHROPIC-SKILLS.md` | 130 | anthropics/skills official Agent Skills reference. |
| `skills-lock.json` | +178 | Records the vendored skill hashes. |
| `SETUP-PALMIER-PRO.md` | +15 | Refreshed with new upstream details (still macOS 26 Apple-Silicon only). |

**On your Mac:** nothing to install — these are already in the repo. After
`git pull`, they show up as `/`-commands in Claude Code.

---

## At a glance

- **New files:** ~38 (1 web tool + 3 docs, 1 n8n workflow + README, 3 skill files,
  12 vendored skills, 4 SETUP docs, 1 Penpot compose + README)
- **Modified files:** `CLAUDE.md`, `skills-lock.json`, `SETUP-PALMIER-PRO.md`
- **New lines of content:** ~3,800 across the new asset files
- **Actually "installable" on the Mac:** OpenCode CLI (auto), SimpleX Chat CLI
  (auto), Impeccable design toolkit (auto), Vercel CLI (auto), Penpot stack
  (Docker, optional). Everything else is open-and-use (Hook Generator) or
  import-only (VEO3 n8n workflow) or already-in-repo (skills).
