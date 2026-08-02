# CLAUDE.md

Guidance for Claude Code in this repository. Kept deliberately small — full tool/setup/sub-project
detail lives in `docs/tools-index.md`; **read that (or the linked doc) on demand, never speculatively.**

## Token frugality (repo rule)

- Skill names + descriptions auto-load every session — never re-list or re-derive them.
- Read only the file sections you need; prefer Grep/Glob over opening whole files.
- Fan out mechanical work to **Haiku** subagents (see routing table below).
- Don't re-read files you just wrote/edited; don't re-verify what a tool result already confirmed.

## Quick Start

- **New RHYTHMIX video** → `rhythmix-author` skill or `/rhythmix-new`. Brand + scene structure are already encoded — don't re-derive.
- **Single creative asset** (image/video/music/voice) → `/dream <description>`.
- **Full album/single launch** (cover + track + promo + landing, parallel) → `/album-launch <brief>`.
- **Feature spec** → `/spec-quick` → `/spec-analyze` → `/spec-run` (parallel task waves). RHYTHMIX campaigns: `/rhythmix-spec`.
- **Landing page / microsite** → `/site-build <brief>` (4-stage pipeline → `sites/<slug>/`). RHYTHMIX-branded: `/rhythmix-site` (locks styleguide to `rhythmix-teaser-60s/DESIGN.md`). Single stages: `/site-sitemap` `/site-wireframe` `/site-styleguide` `/site-design`.
- **Repurpose a Promo to portrait/square** → `promo-repurpose`. **Pre-publish gate** → `render-verify`. **Live-site smoke test** → `deploy-check`. Cadence map: `docs/AUTOMATION.md`.
- **Marketing data Q&A** (ad spend, GA4, campaigns) → Supermetrics hosted connector, `SETUP-SUPERMETRICS.md`.
- **Script/story generation** → `stepfun` MCP (`flash_script`, `flash_chat`, `flash_episode_brief`). Episode/pitch-deck work: start with `flash_episode_brief`, feed into `/rhythmix-site` or `/site-build`.
- **Brand identity** → `rhythmix-teaser-60s/DESIGN.md`. **Domain language + decisions** → `CONTEXT.md` + `docs/adr/` (ADR-0001: HyperFrames over Remotion — never "fix" the dormant `video/` setup).
- **Canonical video example** → `rhythmix-overview-60s/` (60s landscape).
- **Everything else** (all MCP server details, SETUP-* docs, sub-project deep dives) → `docs/tools-index.md`.

## Repository Overview

**RHYTHMIX** (AI music platform) marketing assets, promo videos, web apps, and STARLIGHTMIX Studio.
Live site: **rhythmixapp.com.au** — GitHub Pages serves the **repo root** (push to `main` = production deploy).

| Path | What it is |
|---|---|
| `studio/` | STARLIGHTMIX Studio — Next.js 15 static export → Cloudflare Pages. Primary software project. |
| `rhythmix-<name>-<length>/` | HyperFrames Promo/Cut folders (50+). |
| `apps/` | Standalone HTML apps + PWAs (roomtone, genetic-os, untapped portfolio). |
| `livestock/` `recovery/` `recovery-ios/` | HerdCheck PWA · Reset recovery PWA · its Capacitor iOS wrapper. |
| `capacitor/` | Capacitor iOS wrapper for Studio (`studio/out/` → `www/`). |
| `sites/<slug>/` | Site-build pipeline output. Promote to root `.html` when production-ready. |
| `specs/<slug>/` | Spec folders (`requirements.md`/`design.md`/`tasks.md`, stable R#/T# IDs). See `specs/README.md`. |
| `video/` | Dormant Remotion starter — do not use (ADR-0001). |
| `*.html` at root | Live marketing pages (full list in `docs/tools-index.md`). |
| `.agents/skills/` → `.claude/skills/` | Skill sources → symlinks (+ local-only skills). Edit sources, never symlinks. |
| `.claude/agents/` | FleetView sub-agent definitions, pruned to the dev + marketing roster (43). Re-sync from FleetView if more are needed; don't hand-edit individual files. |
| `docs/` | ADRs, agent procedures (`docs/agents/`), automation map, tools index. |
| `infra/` | Wiki.js + Postgres + Caddy compose (detail in tools-index). |

## STARLIGHTMIX Studio (`studio/`)

Next.js 15 (App Router, `output: "export"`), React 19, TS 5.9, Tailwind v4, Vitest. Node 20 + pnpm 9.

```bash
pnpm install && pnpm dev   # http://localhost:3000
pnpm build                 # static export → studio/out/
pnpm lint && pnpm test     # next lint + tsc --noEmit; vitest run
```

Deploys via `.github/workflows/studio-deploy.yml`: non-`main` push touching `studio/**` → preview at
`<branch>.starlightmix-studio.pages.dev`; `main` → manual approval on `production` env → `studio.starlightmix.com`.
Workers (`studio/workers/license`, `studio/workers/replicate-proxy`) deploy separately — see tools-index.
Studio is NOT a hosted generator or content host: user's own Replicate token, localStorage + IndexedDB only.

## HyperFrames Video Pipeline

Promos are HyperFrames HTML compositions (ADR-0001 — never Remotion).

```
rhythmix-<name>-<length>/
├── index.html          # GSAP + CSS composition
├── script.txt          # narration text
├── narration.wav       # TTS audio
├── hyperframes.json    # {"id":"...", "width":1920, "height":1080}
├── meta.json           # {"version":"0.4.42"}
├── package.json        # dev, check, render, publish
├── gsap.min.js
└── rhythmix-<name>.mp4 # rendered output (if present)
```

```bash
npx --yes hyperframes@0.4.42 preview|lint|tts|render|publish   # from the Cut folder
```

| Aspect | Dims | Use | Naming |
|---|---|---|---|
| Landscape 16:9 | 1920×1080 | YouTube, LinkedIn | `rhythmix-<name>-60s` / `-30s` |
| Portrait 9:16 | 1080×1920 | TikTok, Reels, Shorts | suffix `-f` |
| Square 1:1 | 1080×1080 | Instagram feed | suffix `-sq` |

Series: `s1`–`s5` (5-scene: overview/money/tools/vs/pricing), `v1`–`v5` (alternate cuts),
`venue-*` (disco/jazz/rave/rock sub-brand, each with own `DESIGN.md`).

## MCP Servers (`.mcp.json`)

`stepfun` · `creative-stack` (Replicate+ElevenLabs) · `zyloo` (LLM gateway) · `higgsfield` ·
`pollinations` (egress-gated) · `playwright` · `claude-playwright` · `context7` · `openmanus`.
Keys go in `.env` (see `.env.example`); the session-start hook self-installs missing deps.
Full commands/tools/env detail: `docs/tools-index.md`.

**Rule:** use Context7 for any library/API docs or version-specific setup — without being asked.
Use OpenManus for autonomous browser/research tasks.

## Conventions

- **New Promos** → HyperFrames folder at repo root. Never Remotion.
- **New site pages** → `sites/<slug>/` via pipeline, promote to root when ready.
- **New app concepts** → `apps/<name>/`; standalone non-RHYTHMIX apps get their own root dir.
- **Skill edits** → in `.agents/skills/<name>/` (symlink target); local-only skills directly in `.claude/skills/<name>/`. Track in `skills-lock.json`.
- **Lockfiles** → keep `package-lock.json` in sync everywhere (root, `video/`, `.claude/mcp/*`).
- **Content warnings** → only `teaser-coming-soon*.mp4` is safe to publish as-is; `tiktok-reels-shorts.mp4`, `instagram-facebook.mp4`, `youtube.mp4` contain unverified metrics (see `README.md`).
- **GitHub Issues** → tracker + triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`): `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`.

## Subagent Model Routing

Default **Haiku** for mechanical work, **Sonnet** (or omit) for judgment/creative work.

| Haiku (`model: "haiku"`) | Sonnet (default) |
|---|---|
| File reads, grep, dir scans, config edits | Writing code/components |
| Dependency/lockfile checks, formatting, lint fixes | Specs, scripts, copy, design decisions |
| Git ops, artifact uploads, simple searches | Debugging complex issues |

**Never** Haiku for images/screenshots/UI review — it's text-only.
