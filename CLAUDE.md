# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start (For Claude)

- **Make a new RHYTHMIX video** → invoke the `rhythmix-author` skill or run `/rhythmix-new`. Don't re-derive the brand or scene structure from scratch — the skill already has it.
- **Generate a single creative asset (image / video / music / voice)** → run `/dream <description>` — auto-routes to the right modality.
- **Orchestrate a full album/single launch (cover + track + promo + landing section in parallel)** → run `/album-launch <brief>`.
- **Plan a feature with a spec** → `/spec-quick <description>` produces `specs/<slug>/{requirements,design,tasks}.md` in one pass. Then `/spec-analyze <slug>` to surface ambiguities/contradictions, and `/spec-run <slug>` to execute tasks in parallel waves (each task in an isolated `Agent` context, sequenced by file overlap + explicit `depends:`). For RHYTHMIX campaigns (multi-video / launch / series), use `/rhythmix-spec <brief>` instead — same flow with pre-filled brand-specific clarifying questions.
- **Build a landing page or microsite** → `/site-build <brief>` runs the four-stage pipeline (sitemap → wireframe → styleguide → design) end-to-end, with parallel fan-out across pages at stages 2 and 4. Output lands in `sites/<slug>/` as self-contained HTML files. For RHYTHMIX-branded work, use `/rhythmix-site <brief>` instead — it locks the styleguide to `rhythmix-teaser-60s/DESIGN.md` and pre-fills the brand-specific clarifying questions. Or run any single stage in isolation: `/site-sitemap`, `/site-wireframe`, `/site-styleguide`, `/site-design`.
- **Reference for video pipeline** → `rhythmix-overview-60s/` is the canonical 60s landscape example.
- **Brand identity** → `rhythmix-teaser-60s/DESIGN.md` (palette, typography, motion eases).
- **Cloud-AI tools the user actually uses** → `CREATIVE-AI-STACK.md` (iPhone-driven; user has no desktop).
- **Step 3.7 Flash MCP server (script & story generation)** → `.claude/mcp/stepfun/server.mjs`, registered in `.mcp.json` as `stepfun`. Put `STEP_API_KEY` and `STEP_BASE_URL` in `.env` (see `.env.example`). Exposes three tools: `flash_script` (RHYTHMIX-aware narration/pitch-deck copy, format options: narration/dialogue/shot-list/pitch-deck), `flash_chat` (long-context story dev, multimodal via `user_images`), `flash_episode_brief` (structured episode brief → logline + act structure + promo copy, ready to feed into `/site-build` or `/rhythmix-author`). Use reasoning='high' for multi-act episode briefs, 'low' for quick shot-list drafts. **For animated TV series / pitch deck work, always start with `flash_episode_brief` to generate the episode structure, then pass its output into `/rhythmix-site` or `/site-build` for the animated promo site.**
- **Replicate + ElevenLabs MCP server (image/video/music/voice tools)** → `.claude/mcp/creative-stack/`. Deps installed; registered in `.mcp.json`. To use, copy `.claude/settings.local.json.example` → `.claude/settings.local.json` and fill in `REPLICATE_API_TOKEN` + `ELEVENLABS_API_KEY`. The `replicate` skill picks the right tool/model for image, video, or music assets in this repo's style.
- **Domain language + decisions** → `CONTEXT.md` (Promo, Cut, Narration, Hook) and `docs/adr/` (current: ADR-0001 HyperFrames over Remotion). Read these before reasoning about the pipeline — they prevent re-inventing terms or "fixing" the dormant Remotion setup in `video/`.
- **Higgsfield AI MCP server (Soul text-to-image, DOP image-to-video, talking-head, character refs)** → registered in `.mcp.json` as `higgsfield`. Install with `pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp`. Put `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET` in `.env` at the repo root (gitignored — see `.env.example`). To use it *with* HyperFrames in a single flow, invoke the `higgsfield-to-hyperframes` skill.
- **Pollinations AI MCP server (free anonymous tier — image, text, audio, TTS, music)** → registered in `.mcp.json` as `pollinations`. Installed globally via `npm install -g @pollinations/model-context-protocol`. No API key required. ⚠️ The sandbox egress allowlist blocks `*.pollinations.ai` — tools register fine; only runtime is gated.
- **Browser automation (two MCP servers)** → `playwright` (`@playwright/mcp@latest`, runs via `npx -y`) and `claude-playwright` (devDependency at repo root — run `npm install`, then launches via `node node_modules/claude-playwright/dist/mcp/server.cjs`). Default `BASE_URL` is `http://localhost:8000`.
- **Frontend design skill** → `frontend-design` is available as a Claude Code skill. Use for production-grade UI that avoids generic AI aesthetics.
- **Context7 docs MCP** → registered in `.mcp.json` as `context7` (`https://mcp.context7.com/mcp`). **Rule:** Always use Context7 when you need library/API documentation, code generation, setup, or configuration steps — without the user having to ask. Free API key: put `CONTEXT7_API_KEY` in `.env`.
- **Hugging Face skills** → `hf-cli`, `huggingface-best`, `huggingface-papers`, `huggingface-datasets` synced from `huggingface/skills`. Tracked in `skills-lock.json`.
- **Zapier workflows skill** → `zapier-workflows` in `.claude/skills/`. Dormant until the Zapier MCP server is connected at `https://mcp.zapier.com/mcp/servers`.
- **OpenClaw CLI skills** → installed via `bash scripts/openclaw-install.sh` on a machine with unrestricted egress (ClawHub blocked from the cloud sandbox). Queue: `ai-video-editor-motion-graphics`, `self-improving-agent`, `voice-wake-say`, `voice-ai-voices`, `azure-ai-voicelive-py`, `app-builder`, `deploy-agent`.
- **Agent TARS / UI-TARS** → vision-language GUI agent (ByteDance). See `SETUP-AGENT-TARS.md`. Best for click-stream automation; not a fit for the LLM-driven content pipeline.
- **Hermes Agent** → Nous Research open-source agent CLI with messaging gateways (Telegram/Discord). See `SETUP-HERMES.md`. Useful for driving renders from phone/cron; RHYTHMIX skills are not ported to it.
- **Voicebox (local TTS)** → runs on-device Mac, clones your voice from a sample, zero API cost. See `VOICEBOX-SETUP.md`. Voice profile name: `Jamie`. Default endpoint: `http://127.0.0.1:17493`.
- **Kokoro TTS (HyperFrames narration)** → lightweight, fast, multi-language text-to-speech. Generates `.wav` narration for RHYTHMIX promos. 30+ voices (English, French, Italian, Japanese, Chinese); voice blending supported. See `KOKORO-SETUP.md`. Install: `uv tool install kokoro-tts` or `pip install kokoro-tts`. Used by: `npx --yes hyperframes@0.4.42 tts`.
- **OpenManus Agent Framework (autonomous browser automation)** → LLM-driven browser agent for web tasks, research, and automation. Installation: `bash scripts/setup-openmanus.sh` or `python scripts/setup-openmanus.py`. Setup guide: `SETUP-OPENMANUS.md`. Configuration examples in `config/openmanus-*.toml` (Claude, OpenAI, Ollama, Azure). MCP integration: `OPENMANUS-MCP-INTEGRATION.md`. Use cases: automated content research, web scraping, multi-step browser workflows. Supports multiple LLM backends (Claude, GPT-4, Ollama local, Azure, Bedrock). Browser automation via `playwright` + `browser-use`, search via Google/Baidu/DuckDuckGo.
- **Permission allowlist + session-start health check** → `.claude/settings.json` and `.claude/hooks/session-start.sh`.

## Repository Overview

This workspace hosts **RHYTHMIX** (AI music platform) marketing assets, promo videos, web apps, and the STARLIGHTMIX Studio web application. The live site is at **`rhythmixapp.com.au`** (GitHub Pages, deploying the repo root).

### Top-level layout

| Path | What it is |
|---|---|
| `studio/` | **STARLIGHTMIX Studio** web app — Next.js 15 static export → Cloudflare Pages. Primary software project. |
| `rhythmix-<name>-<length>/` | HyperFrames video Promo/Cut folders (50+ folders). `rhythmix-overview-60s/` is the canonical example. |
| `rhythmix-teaser-60s/DESIGN.md` | Brand design system (palette, type, motion). Lock all styleguides to this. |
| `apps/` | Small standalone HTML apps: `dreams.html`, `hum.html`, `live.html`, `resonate.html`, plus `roomtone/` (PWA) and `untapped/` (portfolio of 10 app concepts with landing pages). |
| `livestock/` | **HerdCheck** — livestock screening PWA (lameness, mastitis, calving predictor for smallholders). Full offline PWA with service worker, `scoring.js`, `vision.js`, `i18n.js`. |
| `recovery/` | **Reset** — recovery app prototype for team sport (iOS-style, full PWA). |
| `recovery-ios/` | Capacitor iOS wrapper for the Reset recovery app. Used by Codemagic iOS build (`codemagic.yaml`). |
| `capacitor/` | Capacitor iOS wrapper for STARLIGHTMIX Studio. Wraps `studio/out/` via `www/` sync. |
| `sites/<slug>/` | Site-build pipeline output (sitemap → wireframe → styleguide → HTML pages). |
| `infra/` | Self-hosted wiki setup: Wiki.js + Postgres + Caddy via Docker Compose (`infra/wiki/`). |
| `specs/<slug>/` | Spec-driven feature folders (`requirements.md` + `design.md` + `tasks.md`). Current specs: `rhythmix-app/`, `roomtone/`, `codex-app/`. |
| `launch-kit/` | Launch kit assets for `codex/`, `hum/`, `rhythmix/`. |
| `video/` | Dormant Remotion 4 + React 19 starter. `MyComposition` returns `null`. Not used for Promos (see ADR-0001). |
| `text.txt`, `text 2.txt`, `text 3.txt` | Legacy RHYTHMIX landing-page HTML/CSS fragments (pre-pipeline). Reference only. |
| `*.html` at root | Live marketing site pages served at `rhythmixapp.com.au` (see full list below). |
| `thumbnails/` | Rendered thumbnail PNGs for the frequency/story video series. |
| `videos/` | Rendered MP4s linked from `README.md`. |
| `.agents/skills/` | Source-of-truth skill bundles (hand-edited / synced from upstreams). |
| `.claude/skills/` | Mostly symlinks into `.agents/skills/` plus local-only skills. |
| `.claude/agents/` | FleetView sub-agent definition files (one `.md` per agent type). |
| `docs/` | ADRs (`docs/adr/`), agent docs (`docs/agents/`), security notes (`docs/security/shannon.md`), reference copy (`docs/refs/`). |
| `scripts/` | Repo-level scripts: `openclaw-install.sh`, `render-thumbnails.mjs`, `build-announcement.mjs`, `build-manifesto.mjs`. |
| `graphify-out/` | Generated knowledge-graph snapshot. Do not hand-edit. |
| `content/` | Additional content assets. |

**Reference docs at root:**
- `CONTEXT.md` — domain language (Promo, Cut, Narration, Hook)
- `CREATIVE-AI-STACK.md` — iPhone-oriented creative AI toolchain
- `KOKORO-SETUP.md` — Kokoro TTS installation & usage for HyperFrames narration
- `SETUP-AGENT-TARS.md` — Agent TARS / UI-TARS desktop setup
- `SETUP-HERMES.md` — Hermes Agent CLI setup
- `MORNING.md` / `MORNING-VOICES.md` — Codex of Reality morning brief
- `VOICEBOX-SETUP.md` — Local voice cloning via Voicebox
- `AWESOME-AI-HARDWARE.md` — AI hardware reference
- `SCRIPT.md`, `VIDEOS.md` — script and video asset references

## STARLIGHTMIX Studio Web App (`studio/`)

A mobile-first web wrapper around the STARLIGHTMIX Studio Node CLI. Lifetime buyers paste their own Replicate token, upload a track, pick a theme, and get a generated AI music video — no installs, no server-side audio storage.

### Stack

- **Next.js 15** (App Router), `output: "export"` (static HTML/JS bundle, no server runtime)
- **React 19.2.3**, **TypeScript 5.9**, **Tailwind v4**
- **Vitest** for unit tests
- Build output → `studio/out/`
- Deployed to **Cloudflare Pages** (`starlightmix-studio` project) at `studio.starlightmix.com`

### Commands (run from `studio/`)

```bash
pnpm install
pnpm dev          # next dev — http://localhost:3000
pnpm build        # static export → studio/out/
pnpm lint         # next lint + tsc --noEmit
pnpm test         # vitest run
```

Node 20 + pnpm 9 are the supported toolchain.

### Cloudflare Workers (`studio/workers/`)

Two sibling Workers deployed independently of the Pages app:

- `studio/workers/license/` — License validation Worker at `license.studio.starlightmix.com/api/license`. Uses a KV namespace (`LICENSE_CACHE`) and a Gumroad product secret set via `wrangler secret put GUMROAD_PRODUCT_ID`.
- `studio/workers/replicate-proxy/` — Optional CORS proxy to Replicate for the browser client.

Each worker has its own `wrangler.toml`. Deploy with `wrangler deploy` from the worker's directory.

### Studio deployment

Deploys are driven by `.github/workflows/studio-deploy.yml` (Cloudflare wrangler-action):

| Trigger | Result |
|---|---|
| Push to any non-`main` branch touching `studio/**` | Auto preview at `https://<branch>.starlightmix-studio.pages.dev` |
| Push to `main` touching `studio/**` | Build runs; deploy waits for manual approval on the `production` GitHub Environment, then publishes to `studio.starlightmix.com` |

Required GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Required GitHub Environment: `production` with required reviewers.

### What Studio is NOT

- Not a hosted music generator — Replicate fees are on the user's own token.
- Not a content host — no audio, plans, or MP4s uploaded to our infra; everything in `localStorage` + IndexedDB.

## Marketing Site (GitHub Pages — `rhythmixapp.com.au`)

The repo root IS the site. GitHub Pages serves it directly via `.github/workflows/deploy-pages.yml` (push to `main` → deploy). All root `.html` files are live pages:

- `index.html` — main landing page
- `studio.html` — Studio product page
- `features.html`, `rhythmix.html` — feature/product overview
- `resonance.html` — RESONANCE frequency healing PWA
- `frequency.html` — Frequency app
- `downloads.html` — video download page
- `download.html` — single-item download page
- `dreams-app.html`, `hum-app.html`, `hum.html`, `live-app.html`, `resonate-app.html` — individual app pages
- `launch.html`, `launch-section.html` — launch campaign pages
- `ltx-studio.html` — LTX Studio page
- `members.html` — members / community page
- `install.html` — install guide
- `rhythmix-preview.html`, `thumbnail.html` — preview/thumbnail utilities
- `founder.html`, `privacy.html`, `terms.html`, `refunds.html`, `thank-you.html` — supporting pages

CNAME: `rhythmixapp.com.au`.

## Apps (`apps/`)

Standalone web apps (separate from the main marketing site):

- `apps/dreams.html`, `apps/hum.html`, `apps/live.html`, `apps/resonate.html` — individual app concept pages
- `apps/roomtone/` — Roomtone PWA (full service worker, manifest, icons)
- `apps/untapped/` — Portfolio of 10 app concepts: TYMPAN, HERD, AXLE, DOCKET, LULL, PLUMB, RACK, SOLE, SPOT, STACK. Each has a `*.html` prototype, `*-landing.html`, and `*.md` brief.

## Standalone Projects

### HerdCheck (`livestock/`)

Phone-camera screening app for smallholder dairy and small-ruminant farmers. Targets ~500M smallholders globally with no existing tooling. Built as an offline-first PWA.

**Checks**: lameness (Sprecher 5-point locomotion scale), mastitis (Canvas image heuristics + visual signs), calving predictor (gestation day + behavioural signs).

**Key files**: `index.html`, `app.js`, `app.css`, `db.js`, `i18n.js`, `scoring.js`, `vision.js`, `sw.js`, `manifest.webmanifest`.

**Species supported**: cattle (283d), buffalo (310d), sheep (147d), goat (150d).

### Reset — Recovery App (`recovery/`)

iOS-style recovery tracking prototype for team sport. Full PWA with `index.html` and offline capability. Served at `/recovery/` from repo root.

### Codex of Reality (`sites/codex-of-reality/`)

Full site and PWA built via the site-build pipeline. Includes:
- `home.html` — 9-section landing page with embedded Coherence Engine demo
- `app.html` — full app
- `launch/` — launch video assets and voice generation scripts
- `sw.js`, `PRIVACY.md`, `TERMS.md`, `sitemap.md`, `styleguide.md`, `wireframes/`

See `MORNING.md` for a quickstart guide to running it locally.

## HyperFrames Video Pipeline

Promos are authored as HyperFrames HTML compositions (per ADR-0001 — do NOT reach for Remotion for new Promos).

### Anatomy of a Cut folder

```
rhythmix-<name>-<length>/
├── index.html          # GSAP + CSS composition
├── script.txt          # spoken narration text
├── narration.wav       # TTS audio (ElevenLabs)
├── hyperframes.json    # {"id":"...", "width":1920, "height":1080}
├── meta.json           # {"version":"0.4.42"}
├── package.json        # scripts: dev, check, render, publish
├── gsap.min.js         # local GSAP bundle
├── renders/            # optional: named render outputs
├── DESIGN.md           # optional: cut-specific design notes (venue series)
└── rhythmix-<name>.mp4 # rendered output (if present)
```

### HyperFrames commands (run from the Cut folder)

```bash
npx --yes hyperframes@0.4.42 preview   # browser preview
npx --yes hyperframes@0.4.42 lint      # validate composition
npx --yes hyperframes@0.4.42 tts       # generate narration.wav (needs kokoro-onnx)
npx --yes hyperframes@0.4.42 render    # render to MP4 (needs ffmpeg)
npx --yes hyperframes@0.4.42 publish   # push to registry
```

### Aspect ratios

| Cut style | Width × Height | Usage |
|---|---|---|
| Landscape 16:9 | 1920×1080 | YouTube, LinkedIn |
| Portrait 9:16 | 1080×1920 | TikTok, Reels, Shorts |
| Square 1:1 | 1080×1080 | Instagram feed |

`rhythmix-overview-60s/` (landscape) is the canonical reference.

### Cut series conventions

| Series prefix | Description |
|---|---|
| `rhythmix-<name>-60s` | Standard 60s landscape Promo |
| `rhythmix-<name>-30s` | 30s landscape cut |
| `rhythmix-<name>-f` | Suffix `-f` = portrait/vertical (TikTok/Reels) variant of a landscape cut |
| `rhythmix-s1-` through `rhythmix-s5-` | 5-scene series (overview, money, tools, vs, pricing) — landscape |
| `rhythmix-s1-*-f` through `rhythmix-s5-*-f` | Portrait variants of the S-series |
| `rhythmix-v1-` through `rhythmix-v5-` | V-series (alternate cuts of same scenes) |
| `rhythmix-venue-*` | Venue sub-brand cuts (disco, jazz, rave, rock) — each has its own `DESIGN.md` |

## Remotion Video Project (`video/`) — Dormant

Remotion 4 + React 19 + Tailwind v4 starter. `MyComposition` returns `null`. Kept as an experiment. Do not add new Promos here — see ADR-0001.

```bash
# Run from video/
npm i && npm run dev   # Remotion Studio preview
```

## iOS / Capacitor

Two separate Capacitor iOS wrappers exist:

| Directory | Wraps | Used by |
|---|---|---|
| `recovery-ios/` | `recovery/` app | Codemagic iOS build (`codemagic.yaml`) |
| `capacitor/` | `studio/out/` (STARLIGHTMIX Studio) | Manual or Appflow |

**capacitor commands** (run from `capacitor/`):

```bash
pnpm build:web    # build studio → studio/out/
pnpm sync:web     # copy studio/out/ to www/ and cap sync
pnpm build        # both above
pnpm open:ios     # open in Xcode
```

## Self-hosted Infrastructure (`infra/`)

`infra/wiki/` — Wiki.js + Postgres behind Caddy (auto-HTTPS) via Docker Compose.

```bash
# On a VPS with Docker installed:
cd infra/wiki
docker compose up -d
```

Requires: VPS with public IP, domain A-record pointing at it, Caddy config in `infra/Caddyfile`.

## Skills

Skills live in two shapes:

- **Synced / hand-written** — source in `.agents/skills/<name>/`, symlinked into `.claude/skills/<name>`. Do not hand-edit synced skills; update upstream and re-record the hash in `skills-lock.json`.
- **Local-only** — live directly in `.claude/skills/<name>/` with no counterpart in `.agents/skills/`.

### Pipeline skills (video / creative)

- `hyperframes`, `hyperframes-cli`, `hyperframes-registry` — HyperFrames HTML video workflow.
- `remotion`, `remotion-to-hyperframes` — Remotion authoring + porting to HyperFrames.
- `website-to-hyperframes` — capture a website into a HyperFrames video.
- `higgsfield-to-hyperframes` — Higgsfield MCP → HyperFrames: prompt → poll → download → wire-in.
- `replicate` — Replicate MCP model picker (FLUX 1.1 Pro / HunyuanVideo / MusicGen defaults).
- `gsap` — GSAP animation reference for HyperFrames.
- `rhythmix-author` — End-to-end RHYTHMIX promo: script → TTS → composition → render → publish.

### Site-build skills

- `/site-build <brief>` — four-stage pipeline orchestrator.
- `/site-sitemap`, `/site-wireframe`, `/site-styleguide`, `/site-design` — individual stages.
- `/rhythmix-site <brief>` — RHYTHMIX-aware wrapper (locks styleguide to `rhythmix-teaser-60s/DESIGN.md`).

### Spec / planning skills

- `/spec-quick <description>` — generate `specs/<slug>/{requirements,design,tasks}.md`.
- `/spec-analyze <slug>` — surface ambiguities/contradictions; rewrites `requirements.md` in place.
- `/spec-run <slug>` — execute tasks in parallel waves of isolated `Agent` calls.
- `/spec-to-repo` — scaffold a repo from an existing spec.
- `/rhythmix-spec <brief>` — RHYTHMIX campaign spec wrapper.
- `/to-prd`, `/to-issues`, `/triage` — chat → PRD → GitHub issues.

### Engineering skills

- `/grill-with-docs` — interview a plan; updates `CONTEXT.md` + `docs/adr/`.
- `/diagnose` — disciplined bug/perf-regression loop.
- `/tdd` — red-green-refactor cycle.
- `/improve-codebase-architecture`, `/zoom-out` — refactor/navigation.
- `/prototype`, `/grill-me`, `/handoff`, `/caveman`, `/write-a-skill` — productivity.
- `/claude-api` — build/debug Claude API / Anthropic SDK apps with prompt caching.
- `/frontend-design` — production-grade UI, avoids generic AI aesthetics.
- `/apple-hig-expert` — Apple HIG guidance (iOS/macOS/visionOS, Liquid Glass aesthetics).
- `/docker-development` — Docker-based dev workflow.
- `/using-git-worktrees` — git worktree workflow for parallel feature branches.
- `/finishing-a-development-branch` — pre-merge checklist: lint, tests, changelog, PR.
- `/verification-before-completion` — verify changes actually work before reporting done.
- `/dispatching-parallel-agents` — fan-out pattern for 2+ independent tasks.
- `/subagent-driven-development` — orchestrate multi-agent development tasks.
- `/executing-plans` — structured plan-then-execute workflow.

### Product / SaaS skills

- `/product-analytics`, `/product-discovery`, `/product-strategist` — product thinking.
- `/saas-metrics-coach`, `/saas-scaffolder` — SaaS-specific development.
- `/seo-audit`, `/slo-architect` — SEO and reliability engineering.
- `/experiment-designer`, `/feature-flags-architect` — experimentation.
- `/observability-designer`, `/runbook-generator` — ops.
- `/landing`, `/landing-page-generator` — landing page creation.
- `/ui-design-system` — design system authoring.
- `/revenue-operations`, `/financial-analyst` — business analytics.
- `/competitive-teardown`, `/customer-success-manager` — go-to-market.
- `/env-secrets-manager` — environment and secrets management.
- `/prompt-governance`, `/llm-cost-optimizer` — LLM operations.
- `/dependency-auditor`, `/data-quality-auditor` — code/data hygiene.
- `/gdpr-audit-prep` — compliance.

### Creative / launch slash commands

- `/dream <description>` — one-shot asset (image, video, music, voice, site) routed to the right tool.
- `/album-launch <brief>` — fan-out four parallel agents: cover art, music track, 60s video, landing section.
- `/rhythmix-new [duration] [aspect] [angle]` — end-to-end promo: script → TTS → HyperFrames → render → downloads page.

### Hugging Face skills

`hf-cli`, `huggingface-best`, `huggingface-papers`, `huggingface-datasets` — synced from `huggingface/skills` into `.agents/skills/`. Tracked in `skills-lock.json`.

### OpenClaw CLI skills

Installed via `bash scripts/openclaw-install.sh` on a machine with unrestricted egress (ClawHub blocked from cloud sandbox). Queue: `ai-video-editor-motion-graphics`, `self-improving-agent`, `voice-wake-say`, `voice-ai-voices`, `azure-ai-voicelive-py`, `app-builder`, `deploy-agent`.

## FleetView Sub-agents (`.claude/agents/`)

The `.claude/agents/` directory contains sub-agent definition files for FleetView's specialized agent roster (ab-test-analyzer, code-reviewer, seo-writer, social-media, etc.). These are loaded by the Claude Code harness and appear as selectable sub-agent types when spawning `Agent` tool calls. Do not hand-edit these — they are managed by the FleetView platform. When spawning subagents, pick the type whose description matches the task.

## MCP Servers (`.mcp.json`)

| Key | Command | Purpose |
|---|---|---|
| `creative-stack` | `node .claude/mcp/creative-stack/server.mjs` | Replicate + ElevenLabs tools (image, video, music, TTS). Enabled in `settings.json`. |
| `higgsfield` | `higgsfield-mcp` | Higgsfield Soul (text-to-image) + DOP (image-to-video). Needs `.env`: `HIGGSFIELD_API_KEY`, `HIGGSFIELD_SECRET`. |
| `pollinations` | `npx -y @pollinations/model-context-protocol` | Free tier: FLUX, Sana, Nova Reel, Suno v5, Qwen3-TTS. Egress-gated in sandbox. |
| `playwright` | `npx -y @playwright/mcp@latest` | Base Playwright browser automation. |
| `claude-playwright` | `node node_modules/claude-playwright/dist/mcp/server.cjs` | Session/profile/test management on top of Playwright. Run `npm install` first. |
| `context7` | HTTP `https://mcp.context7.com/mcp` | Current library documentation. Prefer over training knowledge. |
| `openmanus` | `python -m app.mcp.server` (from `/tmp/OpenManus`) | LLM-driven browser automation agent. Tools: navigate, click, fill, extract, screenshot, search. Config: `.mcp.json`. Setup: `OPENMANUS-MCP-INTEGRATION.md`. |

**Rule:** Always reach for Context7 when you need library/API docs, setup instructions, or version-specific code generation — without the user asking. Not for business logic or debugging. Use OpenManus for autonomous browser tasks, research automation, and multi-step web workflows — particularly useful for RHYTHMIX content research and market intelligence gathering.

## CI / Deployment

### GitHub Pages (`deploy-pages.yml`)

Triggers on push to `main` or `workflow_dispatch`. Deploys the entire repo root to GitHub Pages → `rhythmixapp.com.au`.

### Studio (`studio-deploy.yml`)

Deploys `studio/out/` (Next.js static export) to Cloudflare Pages `starlightmix-studio`. Preview on any non-main branch; production requires manual approval on the `production` GitHub Environment.

### Codemagic (`codemagic.yaml`)

iOS Capacitor build for `recovery-ios/`. Unsigned debug build on `mac_mini_m2`. Artifacts emailed to `wiggjamie9@gmail.com`. Triggered manually or via Codemagic dashboard.

## Dev Container (`.devcontainer/`)

VS Code / GitHub Codespace container based on `mcr.microsoft.com/devcontainers/javascript-node:20`. Post-create script (`post-create.sh`) installs `ffmpeg` + `aubio-tools` and sets up the RHYTHMIX Studio CLI for a one-command demo (`bash rhythmix-studio/demo.sh`).

## Specs (`specs/`)

Each `specs/<slug>/` contains `requirements.md` (stable IDs `R1`, `R2`, …), `design.md`, `tasks.md` (stable IDs `T1`, `T2`, …).

Current specs:
- `specs/rhythmix-app/` — STARLIGHTMIX Studio web app (has `lighthouse.md`, `spike-cors.md`).
- `specs/roomtone/` — Roomtone PWA.
- `specs/codex-app/` — Codex app concept.

See `specs/README.md` for lifecycle and file conventions.

## Sites (`sites/`)

Site-build pipeline output (sitemap → wireframes → styleguide → HTML pages per page). Self-contained HTML files with inline styles and `--token` CSS vars. Preview with `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>`.

Current sites:
- `sites/codex-of-reality/` — Codex of Reality PWA (home + app + launch assets). Full production site.
- `sites/rhythmix/`, `sites/hum/`, `sites/codex/` — earlier pipeline outputs.

See `sites/README.md`.

## Docs

- `docs/adr/0001-hyperframes-over-remotion-for-promos.md` — ADR-0001. Read before reasoning about the video pipeline.
- `docs/agents/domain.md`, `issue-tracker.md`, `triage-labels.md` — agent operating procedures for GitHub Issues.
- `docs/security/shannon.md` — Shannon AI pentester (Keygraph) reference. Relevant for auditing the Studio Workers or license endpoint, **not** for static marketing pages.
- `docs/refs/` — Reference copy and voiceover scripts.

## Conventions

- **New Promos** → HyperFrames folder at repo root (`rhythmix-<name>-<length>/`). Do not use Remotion.
- **New site pages** → `sites/<slug>/` via pipeline, then promote to root `.html` files when ready for production.
- **New app concepts** → `apps/<name>/` or `apps/<name>.html`. Standalone non-RHYTHMIX apps (livestock, recovery) go in their own root directory.
- **Skill edits** → edit in `.agents/skills/<name>/` (the symlink target), never directly in `.claude/skills/` symlinks. Local-only skills are edited directly in `.claude/skills/<name>/`.
- **Lockfile** → keep `video/package-lock.json` in sync with `video/package.json`. Keep root `package-lock.json` in sync too.
- **Gitignore** → `node_modules/`, `.remotion/`, `graphify-out/cache/`, `.claude-playwright/` are excluded.
- **Content warnings** → `README.md` flags that `tiktok-reels-shorts.mp4`, `instagram-facebook.mp4`, `youtube.mp4` contain unverified metrics/testimonials. Only `teaser-coming-soon*.mp4` is safe to publish as-is.

## Subagent Model Routing

When spawning subagents via the `Agent` tool, default to **Haiku** for simple mechanical tasks and **Sonnet** (or omit for default) for tasks requiring judgment or creativity. This keeps parallel-task costs low.

| Use Haiku (`model: "haiku"`) | Use Sonnet (default) |
|---|---|
| File reads, grep, directory scans | Writing code or components |
| Sitemap / README / config edits | Spec generation and analysis |
| Simple search queries | Video script / copy writing |
| Dependency / lockfile checks | Design decisions |
| Formatting, lint fixes | Debugging complex issues |
| Uploading artifacts, git ops | Any task needing screenshots / vision |

**Never** use Haiku for tasks involving images, screenshots, or UI review — it's text-only.

## Agent Skills (GitHub Issues)

- **Issue tracker** → GitHub Issues on `wiggjamie9-afk/jamie-wigg`. See `docs/agents/issue-tracker.md`.
- **Triage labels** → `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.
- **Domain docs** → `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`. Read before introducing new terms.
