# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last updated**: June 2026. This document reflects the current state of a multi-project creative platform spanning RHYTHMIX marketing, STARLIGHTMIX Studio, consumer apps, and portfolio projects.

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
| **CORE SOFTWARE PROJECTS** | |
| `studio/` | **STARLIGHTMIX Studio** web app — Next.js 15.1.6 static export → Cloudflare Pages. Primary SaaS: AI music video generator. User pastes Replicate token, uploads track, picks theme, gets MP4. |
| `agent-builder/` | **Agent Builder** — Next.js full-stack app for configuring and testing Claude agents. Auth setup, migrations, components. See `agent-builder/README.md`. |
| **VIDEO ASSETS & MARKETING** | |
| `rhythmix-<name>-<length>/` | HyperFrames video Promo/Cut folders (52 folders). `rhythmix-overview-60s/` is the canonical 60s landscape example. Organized by series: S-series (5-scene landscape), F-series (portrait variants), V-series (alternates), venue-series (brand sub-categories). |
| `rhythmix-teaser-60s/DESIGN.md` | Brand design system (palette, typography, motion eases, color tokens). Lock all site styleguides to this unless creating a sub-brand. |
| **CONSUMER & PORTFOLIO APPS** | |
| `apps/` | Small standalone HTML apps: `dreams.html`, `hum.html`, `live.html`, `resonate.html`, plus `roomtone/` (PWA) and `untapped/` (portfolio of 10 app concepts with landing pages). |
| `livestock/` | **HerdCheck** — livestock screening PWA for smallholder farmers (lameness, mastitis, calving predictor). Offline-first: `index.html`, `app.js`, `scoring.js`, `vision.js`, `i18n.js`, `sw.js`, `manifest.webmanifest`. Species: cattle, buffalo, sheep, goat. |
| `recovery/` | **Reset** — recovery/wellness tracking PWA for team sport athletes (iOS-style UI). Full PWA with offline support. Served at `/recovery/` from repo root. |
| `capacitor-buddies/` | **Buddies** — Capacitor iOS wrapper + web app for a companion/buddy system (emerging project). See `capacitor-buddies/README.md` for status. |
| **DEPLOYMENT WRAPPERS** | |
| `recovery-ios/` | Capacitor iOS wrapper for Reset app. Unsigned debug build via Codemagic (`codemagic.yaml`). |
| `capacitor/` | Capacitor iOS wrapper for STARLIGHTMIX Studio. Syncs `studio/out/` via `www/`. Commands: `pnpm build:web`, `pnpm sync:web`, `pnpm open:ios`. |
| **SITE GENERATION & CONTENT** | |
| `sites/<slug>/` | Site-build pipeline output (sitemap → wireframe → styleguide → HTML pages). Self-contained with inline styles and CSS `--token` vars. Current: `codex-of-reality/` (production PWA), `rhythmix/`, `hum/`, `codex/` (earlier outputs). |
| `specs/<slug>/` | Spec-driven feature folders. Each: `requirements.md` (R1, R2, …), `design.md`, `tasks.md` (T1, T2, …). Current: `rhythmix-app/`, `roomtone/`, `codex-app/`. |
| `launch-kit/` | Launch kit assets for `codex/`, `hum/`, `rhythmix/` (cover art, metadata, promo copy). |
| `email-templates/` | HTML email templates for transactional and campaign messaging. |
| **INFRASTRUCTURE & REFERENCE** | |
| `infra/` | Self-hosted wiki: Wiki.js + Postgres + Caddy via Docker Compose at `infra/wiki/`. Requires VPS with public IP and CNAME. |
| `config/` | Configuration files: `openmanus-*.toml` (browser agent configs), other env-based config. |
| `video/` | **Dormant** — Remotion 4 + React 19 starter. `MyComposition` returns `null`. Do NOT use for new Promos (see ADR-0001); use HyperFrames instead. |
| `thumbnails/` | Rendered thumbnail PNGs for video series. |
| `videos/` | Rendered MP4s (Promo outputs, tutorials). Linked from `README.md`. |
| `content/` | Miscellaneous content assets, reference material. |
| `graphify-out/` | Generated knowledge-graph snapshot. Do not hand-edit. |
| `.agents/skills/` | Source-of-truth skill bundles (upstream-synced or hand-edited). Tracked in `skills-lock.json`. |
| `.claude/skills/` | Skill definitions: symlinks into `.agents/skills/` (synced) + local-only skills (direct). |
| `.claude/agents/` | FleetView sub-agent definition files (managed by platform; do not hand-edit). |
| `.claude/mcp/` | Custom MCP servers: `stepfun/` (Step 3.7 Flash), `creative-stack/` (Replicate + ElevenLabs). |
| `.superpowers/` | Superpowers project workspace (if using). |
| `docs/` | Guides and policy: `adr/` (ADRs), `agents/` (operating procedures), `security/shannon.md` (pentesting ref), `refs/` (copy, scripts). |
| `scripts/` | Repo-level utilities: `openclaw-install.sh`, `render-thumbnails.mjs`, `build-announcement.mjs`, build automation. |
| `*.html` at root | Live marketing site pages served at **`rhythmixapp.com.au`** (GitHub Pages). ~25 pages covering RHYTHMIX, Studio, apps, policies, downloads. |
| `text.txt`, `text 2.txt`, `text 3.txt` | **Legacy** — pre-pipeline RHYTHMIX landing-page HTML/CSS fragments. Reference only. |
| `builds/` | Occasional build artifacts or cached renders. Gitignored. |

**Reference docs at root** (100+ files; key ones listed here):

*Core guidance:*
- `CLAUDE.md` — this file. Updated periodically as projects evolve.
- `CONTEXT.md` — domain language (Promo, Cut, Narration, Hook). Read before designing new video terminology.
- `START-HERE.md` — entry point for recent major projects (e.g., avatar enhancements).

*Setup & Environment:*
- `CREATIVE-AI-STACK.md` — iPhone-oriented creative AI toolchain (user workflow reference).
- `KOKORO-SETUP.md` — Kokoro TTS installation & usage for HyperFrames narration.
- `VOICEBOX-SETUP.md` — Local voice cloning via Voicebox (Mac-only, zero API cost).
- `SYSTEM-SETUP.md` — Development environment setup.
- `SUPABASE-SETUP.md` — Backend database configuration (if using).
- `ANDROID-BUILD-SETUP.md` — Android APK build infrastructure.
- `CAPACITOR-IOS-SETUP.md` — iOS Capacitor build setup.

*Extended Guides:*
- `SETUP-AGENT-TARS.md` — Agent TARS / UI-TARS desktop agent setup (ByteDance).
- `SETUP-HERMES.md` — Hermes Agent CLI setup (Nous Research, Telegram/Discord gateways).
- `OPENMANUS-MCP-INTEGRATION.md` — Browser automation agent configuration.

*Content & Assets:*
- `MORNING.md` / `MORNING-VOICES.md` — Codex of Reality morning brief (voice profiles, copy).
- `SCRIPT.md`, `VIDEOS.md` — video asset references and script library.
- `AWESOME-AI-HARDWARE.md` — AI hardware reference (cameras, lighting, recording gear).

*App & Feature Documentation* (projects in active development; see `START-HERE.md` for status):
- `AVATAR-*` — Avatar integration guides (StoryStudio, VoiceJournal, SmartGrocery).
- `100_APPS_MISSION.md`, `100_APP_BUILD_TEMPLATE.md` — 100 app strategy and scaffolding.
- `BEDTIME_STORIES_*.md` — Bedtime Stories monetization & launch strategy.
- `BUDDY-*.md` — Buddy system (freemium model, integration, testing).
- `APK_BUILD_*.md`, `APP_STORE_METADATA.md` — Android/iOS app distribution.
- `STARLIGHTMIX-STUDIO.md` — Studio product overview and roadmap.
- `YOUTUBE_*.md` — YouTube strategy (content calendar, monetization, Shorts audit).

*Quality & Audits:*
- `TESTING-GUIDE.md`, `USER-GUIDE.md` — QA and user onboarding.
- `SUNNY_*.md` — Project-specific validation (test runs, artwork fixes, next steps).
- `WORLD_CLASS_FEATURES_SPEC.md` — Product completeness checklist.

(Full list of root .md files is 100+; use `ls *.md | sort` to browse or `grep "^# " *.md | head -20` to scan headings.)

## Major Software Projects

### Agent Builder (`agent-builder/`)

A full-stack Next.js app for designing, configuring, and deploying Claude agents with a visual interface.

**Stack:**
- Next.js 15 with App Router
- React 19, TypeScript, Tailwind v4
- Database: PostgreSQL (via Supabase or local)
- Auth: integrated (see `AUTH-SETUP.md`)

**Key features:**
- Agent configuration UI
- Testing/simulation interface
- Deployment management
- Migration system (`migrations/` directory)
- Lighthouse performance audits

**Commands** (run from `agent-builder/`):
```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint
```

See `agent-builder/BRIEF.md` and `agent-builder/README.md` for detailed status and roadmap.

### STARLIGHTMIX Studio Web App (`studio/`)

A mobile-first web app for non-technical music creators. Lifetime buyers:
1. Paste their own Replicate API token
2. Upload a track (stored in IndexedDB, never on our servers)
3. Pick a theme/style
4. Get a generated AI music video (MP4)

**This is the primary revenue product.**

#### Stack

- **Next.js 15.1.6** (App Router), `output: "export"` (static HTML/JS, no server runtime)
- **React 19.2.3**, **TypeScript 5.9.3**, **Tailwind v4**
- **Vitest** + jsdom for testing
- **FFmpeg.js** + **IDB** for client-side video processing
- Build output → `studio/out/` → deployed to Cloudflare Pages

**Version freeze:** Lock Next.js at 15.1.6, React at 19.2.3 until major feature work requires upgrading.

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

## Standalone Projects & Portfolio Apps

The portfolio encompasses multiple emerging and mature apps, each with its own PWA implementation and deployment strategy.

### HerdCheck (`livestock/`)

**Pitch**: Phone-camera screening app for smallholder dairy and small-ruminant farmers. Targets ~500M smallholders globally with minimal or no existing tooling.

**Health checks**:
- **Lameness** — Sprecher 5-point locomotion scale + video analysis
- **Mastitis** — Canvas image heuristics + visual signs (swelling, discoloration)
- **Calving predictor** — gestation day + behavioral indicators

**Tech**:
- Offline-first PWA: `index.html`, `app.js`, `app.css`, `db.js`
- Image analysis: `vision.js` (Canvas heuristics)
- Scoring: `scoring.js` (multi-species gestation/locomotion scoring)
- i18n: `i18n.js` (multi-language support)
- Service worker: `sw.js`, `manifest.webmanifest`

**Species supported**: cattle (283d), buffalo (310d), sheep (147d), goat (150d).

**Status**: Production-ready for pilot deployments.

### Reset — Recovery App (`recovery/`)

**Pitch**: Wellness & recovery tracking for team sport athletes. iOS-style UI, full offline PWA.

**Features**:
- Session logging (training, recovery, nutrition)
- Athlete wellness dashboard
- Team coach view (if implemented)

**Tech**: Full PWA with `index.html`, offline state, localStorage persistence.

**Status**: Prototype → iOS Capacitor wrapper in `recovery-ios/` (Codemagic build pipeline).

**Deployment**: Served at `/recovery/` from repo root (GitHub Pages); iOS via Codemagic.

### Buddies System (`capacitor-buddies/`)

**Pitch**: Companion app for user engagement and onboarding (emerging).

**What it does**:
- Personalized buddy/tutor avatars
- Freemium engagement model
- Progressive disclosure of features

**Tech**: Capacitor iOS wrapper + web app.

**Status**: In active development. See `capacitor-buddies/README.md` and `BUDDY-*.md` files for feature roadmap.

**Related docs**: `BUDDY-FREEMIUM-IMPLEMENTATION.md`, `BUDDY-SYSTEM-INTEGRATION.md`, `BUDDY-SYSTEM-LAUNCH.md`, `BUDDY-FREEMIUM-TEST-PLAN.md`.

### Avatar-Enhanced Consumer Apps (Emerging Portfolio)

Three mobile-first web apps with professional AI tutor avatars (as of June 2026):

| App | Tutor Persona | Theme | Status |
|-----|---|---|---|
| **StoryStudio** | Creative Producer | Pink + Rose | ✅ Avatar ready |
| **VoiceJournal** | Wellness Coach | Lavender + Violet | ✅ Avatar ready |
| **SmartGrocery** | Shopping Assistant | Green + Emerald | ✅ Avatar ready |

**Entry point**: See `START-HERE.md` for quick links. Each app is in `apps/<name>.html` or its own folder. Avatars hosted at `/avatars/index.html` (showcase).

**Related docs**: `AVATAR-ENHANCEMENT-SUMMARY.md`, `AVATAR-INTEGRATION-GUIDE.md`, `AVATAR-QUICK-START.md`, `AVATAR-LAYOUT-GUIDE.txt`.

**Status**: Proof-of-concept complete. Ready for user testing or product iteration.

### Codex of Reality (`sites/codex-of-reality/`)

**Pitch**: AI-powered morning briefing & coherence engine for mindfulness.

**Architecture**:
- **`home.html`** — 9-section landing page with embedded Coherence Engine demo
- **`app.html`** — full Coherence Engine (daily affirmations, journal prompts, guided meditations)
- **`launch/`** — launch video assets and TTS scripts
- **PWA**: `sw.js`, `manifest.webmanifest`, full offline support
- **Compliance**: `PRIVACY.md`, `TERMS.md`, `sitemap.md`, `styleguide.md`, `wireframes/`

**Pipeline**: Built via the site-build pipeline (`sitemap → wireframe → styleguide → HTML`).

**Status**: Production-ready. Production deployment at `sites/codex-of-reality/`; preview via `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/codex-of-reality`.

**Entry point**: `MORNING.md` for full quickstart, feature roadmap, voice profiles.

### Portfolio of 10 App Concepts (`apps/untapped/`)

The `untapped/` portfolio showcases 10 emerging app ideas, each with a prototype + landing page + brief:

| # | App Name | Domain | Status |
|---|---|---|---|
| 1 | TYMPAN | Audio wellness | Concept |
| 2 | HERD | Community | Concept |
| 3 | AXLE | Logistics | Concept |
| 4 | DOCKET | Productivity | Concept |
| 5 | LULL | Sleep/wellness | Concept |
| 6 | PLUMB | Maintenance | Concept |
| 7 | RACK | Organization | Concept |
| 8 | SOLE | Fitness | Concept |
| 9 | SPOT | Parking/wayfinding | Concept |
| 10 | STACK | Knowledge mgmt | Concept |

**Files**: Each has `<name>.html` (prototype), `<name>-landing.html` (marketing page), `<name>.md` (brief).

**See**: `APPS_PORTFOLIO_SUMMARY.md`, `100_APPS_MISSION.md`, `100_APP_BUILD_TEMPLATE.md`.

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

Local and remote MCP servers configured for creative asset generation, browser automation, and documentation lookup. **Enabled servers** are registered in `.mcp.json` at repo root.

| Key | Command | Purpose | Status |
|---|---|---|---|
| `stepfun` | `node .claude/mcp/stepfun/server.mjs` | **Step 3.7 Flash** — script & story generation, pitch-deck copy. Tools: `flash_script` (narration/dialogue/shot-list), `flash_chat` (long-context story dev), `flash_episode_brief` (structured episodes). Needs `.env`: `STEP_API_KEY`, `STEP_BASE_URL`. | ✅ Configured |
| `creative-stack` | `node .claude/mcp/creative-stack/server.mjs` | **Replicate + ElevenLabs** — image, video, music, voice generation. Tools: image (FLUX 1.1 Pro, Sana), video (HunyuanVideo, Nova Reel), music (MusicGen), TTS (ElevenLabs multi-lang). Enabled in `settings.json`. | ✅ Configured |
| `higgsfield` | `higgsfield-mcp` | **Higgsfield Soul** (text-to-image) + **DOP** (image-to-video) + character refs. Needs `.env`: `HIGGSFIELD_API_KEY`, `HIGGSFIELD_SECRET`. | ✅ Configured |
| `pollinations` | `npx -y @pollinations/model-context-protocol` | **Free anonymous tier** — image (FLUX, Sana), video (Nova Reel), text, audio, TTS (Qwen3-TTS), music (Suno v5). No API key. ⚠️ Sandbox egress: `*.pollinations.ai` blocked; tools available, runtime gated. | ✅ Configured |
| `playwright` | `npx -y @playwright/mcp@latest` | **Base Playwright** — browser automation (click, fill, navigate, screenshot, wait-for). Default BASE_URL: `http://localhost:8000`. | ✅ Configured |
| `claude-playwright` | `node node_modules/claude-playwright/dist/mcp/server.cjs` | **Session-aware Playwright** — extended with session/profile/test management. Requires `npm install` at repo root first. | ✅ Configured |
| `context7` | HTTP `https://mcp.context7.com/mcp` | **Library documentation lookup** — Current docs for npm, Python, Rust, Go, cloud SDKs. Free API key: put `CONTEXT7_API_KEY` in `.env`. | ✅ Configured |

### MCP Usage Rules

- **Context7**: Always use for library/API docs, setup instructions, version-specific code gen — *without the user asking*. Not for business logic or debugging; training knowledge is often stale.
- **Creative stack (Replicate + ElevenLabs)**: Use `/dream` skill for one-shot assets; `/rhythmix-author` for end-to-end promos with TTS → HyperFrames → render.
- **Higgsfield**: Text-to-image (Soul) → image-to-video (DOP) + character refs. Pair with `higgsfield-to-hyperframes` skill to wire outputs into HyperFrames compositions.
- **Step 3.7 Flash**: Use `flash_episode_brief` (reasoning='high') for multi-act episode structure, then feed into `/site-build` or `/rhythmix-site` for animated promo sites.
- **Playwright**: Low-level browser control. Prefer `claude-playwright` for structured testing; reach for `openmanus` (browser agent, not listed above but available via cloud MCP) for autonomous web research and multi-step workflows.

### MCP Server Troubleshooting

If a server fails to start:
1. Check `.env` and `.env.example` — ensure all required API keys are set (REPLICATE_API_TOKEN, ELEVENLABS_API_KEY, etc.).
2. Verify `.mcp.json` syntax: `jq . .mcp.json` (must be valid JSON).
3. For custom servers (stepfun, creative-stack), ensure `.claude/mcp/*/server.mjs` exists and dependencies are installed.
4. Check the Claude Code harness logs for server connection errors.

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

## Growing Project Portfolio & Strategies

As of June 2026, this workspace encompasses multiple emerging lines of business and strategic initiatives:

### 100 Apps Initiative

**Goal**: Launch a portfolio of 100+ consumer apps targeting different use cases and user segments.

**Current state**:
- 10 app concepts in `apps/untapped/` (TYMPAN, HERD, AXLE, DOCKET, etc.)
- 3 avatar-enhanced apps in production testing (StoryStudio, VoiceJournal, SmartGrocery)
- HerdCheck (livestock) and Reset (recovery) mature and deployable

**Key docs**:
- `100_APPS_MISSION.md` — strategy and TAM analysis
- `100_APP_BUILD_TEMPLATE.md` — scaffolding and feature templates
- `100_APP_MISSION_LAUNCH_STRATEGY.md` — go-to-market for each cohort

**When building a new app**:
1. Use `100_APP_BUILD_TEMPLATE.md` as scaffolding (copy structure, adapt branding).
2. Create `app/<name>.html` or folder if PWA needed.
3. Add to `apps/` portfolio with `<name>.md` brief.
4. Consider avatar/tutor overlay (see AVATAR docs).
5. Plan for Android APK + iOS distribution (see APK_BUILD_*, CAPACITOR-* docs).

### YouTube Monetization & Content Strategy

**Strategic focus**: Short-form (Shorts, Reels) + long-form tutorials + livestreams across 100 app portfolio.

**Key docs**:
- `YOUTUBE_CONTENT_CALENDAR.md` — production schedule
- `YOUTUBE_MONETIZATION_ROADMAP.md` — revenue model (AdSense, sponsorships, affiliate)
- `YOUTUBE_SHORTS_APPS_AUDIT.md` — viral content analysis
- `YOUTUBE_GOLDMINES_2025.md` — trending niches and opportunity gaps
- `YOUTUBE_PRODUCTION_GUIDE.md` — production workflow and editing

**When creating YouTube content**:
1. Check `YOUTUBE_CONTENT_CALENDAR.md` for scheduled topics.
2. Use HyperFrames promos (`rhythmix-*`) for short-form assets.
3. Script generation: use Step 3.7 Flash (`flash_script`) for narration or pitch-deck copy.
4. Distribution: upload to YouTube Shorts, TikTok, Reels (multi-platform syndication).

### Android/iOS Distribution

**Status**: Infrastructure exists for APK builds and iOS Capacitor wrappers.

**For Android**:
- `ANDROID-BUILD-SETUP.md` — APK toolchain config
- `APK_BUILD_*.md` — step-by-step build & signing guides
- `APK_BUILD_INDEX.md` — manifest of build artifacts and outputs
- `APP_STORE_METADATA.md` — listing copy, images, compliance

**For iOS**:
- `CAPACITOR-IOS-SETUP.md` — Capacitor + Xcode setup
- `recovery-ios/` — example Capacitor wrapper (CMS build via Codemagic)
- `capacitor/` — example wrapper for STARLIGHTMIX Studio
- Deployment: Code signing, provisioning profiles, TestFlight beta distribution

**When building for mobile**:
1. Web app must be responsive PWA (manifest.json, service worker).
2. Create Capacitor wrapper: `pnpm create @capacitor/app` or copy existing template.
3. Configure `capacitor.config.ts`: app name, package, version, plugins.
4. For iOS: `pnpm open:ios` → configure signing in Xcode.
5. For Android: Use `gradle` build tools (see APK_BUILD docs).
6. Test on device: USB debugging (Android) or simulator (iOS).

### Monetization & Freemium Models

**Buddy System** (`capacitor-buddies/`):
- Progressive feature unlock (freemium)
- Tutor avatar engagement
- Docs: `BUDDY-FREEMIUM-IMPLEMENTATION.md`, `BUDDY-SYSTEM-INTEGRATION.md`

**Bedtime Stories** (emerging content franchise):
- Serialized storytelling for kids
- Audio narration (TTS or voice talent)
- Docs: `BEDTIME_STORIES_MONETIZATION.md`, `BEDTIME_STORIES_WEEK1_EXECUTION.md`

## Conventions & Standards

### Naming & File Organization

- **New Promos** → HyperFrames folder at repo root: `rhythmix-<name>-<length>/` (e.g., `rhythmix-teaser-60s/`, `rhythmix-s1-overview-60s/`). Do NOT use Remotion (see ADR-0001).
- **New site pages** → `sites/<slug>/` via pipeline (sitemap → wireframe → styleguide → HTML), then promote to root `.html` when production-ready.
- **New app concepts** → `apps/<name>/` (folder for PWA) or `apps/<name>.html` (single file). Standalone, non-RHYTHMIX apps (livestock, recovery) use their own root directory.
- **Specs** → `specs/<slug>/{requirements.md, design.md, tasks.md}`. Use stable IDs: R1, R2 (requirements); T1, T2 (tasks).
- **Skills** → Edit upstream source in `.agents/skills/<name>/` (symlink target), never direct symlinks in `.claude/skills/`. Local-only skills edit directly in `.claude/skills/<name>/`. Track synced skill versions in `skills-lock.json`.

### Code & Dependencies

- **Lockfiles** → Keep `package-lock.json` (root) and `video/package-lock.json`, `studio/pnpm-lock.yaml` in sync with `package.json` and `pnpm-lock.yaml` respectively.
- **Version freezes**:
  - **studio**: Next.js 15.1.6, React 19.2.3 (stable; major upgrades require feature planning).
  - **video**: Remotion 4 (dormant; do not upgrade).
  - **agent-builder**: Latest Next.js 15 (can adopt patches; major bumps require testing).
- **Gitignore** → `node_modules/`, `.remotion/`, `graphify-out/cache/`, `.claude-playwright/` excluded. Large build artifacts, env files, `.env*` secrets in ``.gitignore.env-template`.

### Content & Publishing

- **Content warnings** → Check `README.md` for flagged videos. Videos with unverified metrics/testimonials (`tiktok-reels-shorts.mp4`, `instagram-facebook.mp4`, `youtube.mp4`) are not safe to publish as-is. Only `teaser-coming-soon*.mp4` is production-ready.
- **Brand system** → All sites, promos, and consumer apps lock design to `rhythmix-teaser-60s/DESIGN.md` unless creating a sub-brand (venue series, app-specific theme). Document theme deviations in local `DESIGN.md`.
- **Asset sourcing** → Use Replicate (FLUX, HunyuanVideo) for generated images/videos; Higgsfield (Soul, DOP) for character refs; ElevenLabs or Kokoro for TTS. Always respect API quotas and costs.

### Deployment & CI/CD

- **GitHub Pages** (repo root .html) → Automatic on push to `main` via `.github/workflows/deploy-pages.yml`. CNAME: `rhythmixapp.com.au`.
- **Cloudflare Pages** (studio) → Preview branches auto-deploy; production requires manual approval on `production` GitHub Environment. Deployer: `.github/workflows/studio-deploy.yml`.
- **Codemagic** (iOS) → Triggered manually or via dashboard. Builds `recovery-ios/`, outputs unsigned debug APK emailed to `wiggjamie9@gmail.com`.
- **Capacitor Sync** → Before iOS/Android builds, run `pnpm sync:web` to copy web app output (e.g., `studio/out/`) into Capacitor `www/` directory.

## Subagent Model Routing & Task Parallelization

This workspace spans multiple independent domains (video, apps, marketing, infrastructure). To keep latency low and context efficient, route subagent tasks by complexity and parallelization strategy.

### Model Selection

When spawning subagents via the `Agent` tool:

| Task | Use Model | Rationale |
|---|---|---|
| File reads, grep, scans, tree navigation | **Haiku** | Fast, cheap, sufficient for pattern-matching |
| Config edits, README / sitemap generation | **Haiku** | Deterministic templating; no ambiguity |
| Dependency / lockfile updates, version checks | **Haiku** | Rule-based (SemVer, compatibility); fast |
| Formatting, lint fixes, comment cleanup | **Haiku** | Mechanical transformations |
| Code writing (components, API, features) | **Sonnet** (default) | Judgment, architecture, edge cases |
| Spec generation, requirements analysis | **Sonnet** | Ambiguity resolution, multi-stakeholder synthesis |
| Video script, copy writing, promo narration | **Sonnet** | Creative voice, tone, persuasion |
| Design decisions, UX/UI justification | **Sonnet** | Aesthetic judgment + accessibility |
| Debugging complex issues, performance tuning | **Sonnet** | Systems thinking, root-cause analysis |
| **Any task involving images, screenshots, UI review** | **Sonnet** (Haiku is text-only) | Vision required; Haiku cannot read images |

### Parallelization Patterns

For large, multi-workstream tasks (e.g., launching 10 apps, generating 50 promos, auditing 5 codebases):

**Single-threaded approach** (if dependencies exist):
```
research → spec → design → code → test → deploy
```

**Fan-out pattern** (independent parallel work, common in this workspace):
```
Agent 1: App 1 (scaffold, build, test)
Agent 2: App 2 (scaffold, build, test)
Agent 3: YouTube content calendar
Agent 4: iOS/Android APK config
Agent 5: UI audit & design system review
```

Each agent is isolated; combine results post-completion. Use `/dispatching-parallel-agents` skill to orchestrate 2–5 independent tasks.

### Context Window Management

This repo is large (100+ .md files, 50+ HyperFrames promos, multiple SaaS apps). When delegating to agents:

- **Specify search scope** — "find HyperFrames promos matching `rhythmix-s*-*-f`" (portrait variants) vs. "scan entire repo for avatar references."
- **Use Explore agent** for broad searches — it reads excerpts efficiently, preventing context bloat.
- **Summarize findings** before handing off to write agents — don't repeat 200-line file contents.
- **Reuse Agent results** in follow-up queries — cite findings by file path, not by re-reading.

## Starting New Work

Given the workspace's size and complexity, use this checklist before diving into a task:

### 1. Understand the Context
- **Is this part of an existing initiative?** Check:
  - `START-HERE.md` — recent major projects (avatar enhancements, etc.)
  - `100_APPS_MISSION.md` — if launching a new app, use the template strategy
  - `YOUTUBE_CONTENT_CALENDAR.md` — if creating video content, check the schedule
  - `CONTEXT.md` — domain language specific to RHYTHMIX, HyperFrames, Promos
- **Read the relevant spec** if one exists: `specs/<slug>/` folder has requirements, design, and task breakdowns.
- **Scan the top-level docs**: Some decisions (brand, video pipeline, deployment) are documented in root `.md` files.

### 2. Scope the Task
- **Is this a one-off or part of a series?** (E.g., one promo vs. a 5-promo campaign?)
- **Does it touch multiple projects?** (E.g., web app + iOS + YouTube content?)
- **Dependencies**: Does it require an existing asset, decision, or approval first?

### 3. Identify Tools & Skills
- **Video/creative**: `/dream`, `/rhythmix-new`, `/rhythmix-author`, `/rhythmix-site`, `/site-build`
- **Planning**: `/spec-quick`, `/spec-analyze`, `/spec-run`
- **Engineering**: `/tdd`, `/diagnose`, `/improve-codebase-architecture`
- **Content**: Step 3.7 Flash (`flash_script`, `flash_episode_brief`), Replicate (image/video), ElevenLabs (TTS)
- **Research**: Explore agent for codebase scan, Context7 for library docs, Playwright for web automation

### 4. Check for Existing Parallels
Before writing new code:
- Does a similar app, component, or feature already exist in the portfolio?
- Is there a template or scaffold? (E.g., `100_APP_BUILD_TEMPLATE.md`, `rhythmix-overview-60s/` for promos)
- Can you adapt instead of building from scratch?

### 5. Plan Parallel Work
If your task can be split:
- Use `/dispatching-parallel-agents` to fan out independent work
- Example: Audit 5 apps in parallel; each agent reviews UX, performance, compliance
- Combine results after parallel phases complete

### 6. Document Decisions
- New terminology? Add to `CONTEXT.md` with ADR-style justification
- New process or convention? Update relevant section in `CLAUDE.md` or create `docs/adr/*.md`
- New project or major refactor? Create `specs/<slug>/` with requirements + design + task breakdown

## Agent Skills (GitHub Issues & Issue Tracker)

The workspace uses GitHub Issues for planning, tracking, and coordination. All work should flow through the issue tracker when possible.

**Workflow**:
- **`needs-triage`** — new issues waiting for categorization
- **`needs-info`** — awaiting details (scope, acceptance criteria, blockers)
- **`ready-for-agent`** — structured, unambiguous; agents can pick up immediately
- **`ready-for-human`** — requires human judgment, design feedback, or approval before agent work
- **`wontfix`** — descoped, rejected, or obsoleted

**Resources**:
- **Issue tracker guide**: `docs/agents/issue-tracker.md`
- **Triage labels**: `docs/agents/triage-labels.md`
- **Domain terminology**: `docs/agents/domain.md` + `CONTEXT.md` + `docs/adr/`

**Repository**: `wiggjamie9-afk/jamie-wigg` on GitHub. Check GitHub Issues before proposing new work; link related issues in PRs.

---

## Quick Reference: Critical Files by Role

### For Video/Creative Work
| Task | Start Here |
|---|---|
| Make a RHYTHMIX promo | `/rhythmix-new` skill or `rhythmix-overview-60s/` (copy + edit) |
| Generate script + TTS | Step 3.7 Flash MCP: `flash_script` |
| Understand brand | `rhythmix-teaser-60s/DESIGN.md` |
| Video pipeline decision | `docs/adr/0001-hyperframes-over-remotion-for-promos.md` |
| YouTube strategy | `YOUTUBE_CONTENT_CALENDAR.md`, `YOUTUBE_MONETIZATION_ROADMAP.md` |

### For Web App Development
| Task | Start Here |
|---|---|
| STARLIGHTMIX Studio | `studio/` + `STARLIGHTMIX-STUDIO.md` |
| Agent Builder | `agent-builder/` + `agent-builder/BRIEF.md` |
| New consumer app | `100_APP_BUILD_TEMPLATE.md`, then `apps/` or new folder |
| Avatar integration | `AVATAR-ENHANCEMENT-SUMMARY.md` |
| Site generation | `/site-build` skill, then `sites/<slug>/` output |

### For Mobile / Distribution
| Task | Start Here |
|---|---|
| iOS build | `capacitor/` folder + `CAPACITOR-IOS-SETUP.md` |
| Android APK | `APK_BUILD_SETUP.md`, `APK_BUILD_QUICKSTART.md` |
| App store metadata | `APP_STORE_METADATA.md` |
| Codemagic iOS config | `codemagic.yaml` + `recovery-ios/` example |

### For Planning & Specs
| Task | Start Here |
|---|---|
| Write a spec | `/spec-quick`, outputs to `specs/<slug>/` |
| Plan a feature | `/spec-run` for parallel task execution |
| Understand requirements | `specs/rhythmix-app/requirements.md` (production spec) |

### For Infrastructure & DevOps
| Task | Start Here |
|---|---|
| GitHub Pages deployment | `.github/workflows/deploy-pages.yml` |
| Cloudflare studio deploy | `.github/workflows/studio-deploy.yml` |
| MCP servers | `.mcp.json` + `.env.example` |
| Dev container | `.devcontainer/post-create.sh` |
| Self-hosted wiki | `infra/wiki/docker-compose.yml` |

---

## Workspace Health Checklist

When starting a session:

- [ ] **.env file exists** — copy `.env.example` → `.env`, fill in `REPLICATE_API_TOKEN`, `ELEVENLABS_API_KEY`, etc.
- [ ] **MCP servers connect** — check `.mcp.json` validity, verify API keys in `.env`
- [ ] **No stale branches** — `git branch -vv | grep '\[.*gone\]'` to find deleted-upstream branches
- [ ] **Node toolchain** — `node -v` (20+), `pnpm -v` (9+), `npm install` at root for claude-playwright
- [ ] **Key scripts pass** — `studio/pnpm lint`, `studio/pnpm test`, basic HyperFrames preview in a promo folder
- [ ] **Docs are current** — skim `CLAUDE.md`, `CONTEXT.md`, relevant `docs/adr/` before proposing architectural changes

---

## Support & Feedback

- **Questions about Claude Code?** → `/help` or refer to [claude.ai/code docs](https://claude.com/claude-code)
- **Found a bug or documentation gap?** → File an issue on GitHub or update `CLAUDE.md` directly
- **Claude Code feedback?** → [github.com/anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues)

---

**This CLAUDE.md is a living document.** As projects evolve, processes change, or new tools are adopted, update it to keep the guidance current. Stale guidance is worse than no guidance.
