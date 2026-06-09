# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last updated:** 2026-06-09 | Repository reflects 50+ rhythmix promos, 18+ standalone apps, Kids Channel content pipeline, monetization infrastructure, and 100-apps mission.

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
- **Permission allowlist + session-start health check** → `.claude/settings.json` and `.claude/hooks/session-start.sh`.

## Repository Overview

This is a **multi-platform creative infrastructure** workspace housing:

1. **RHYTHMIX Platform** — AI music generation + video marketing assets (50+ HyperFrames promos, STARLIGHTMIX Studio, brand system)
2. **18+ Web/Mobile Apps** — Standalone productivity, wellness, and creative tools (Dreams, Hum, Live, Resonate, HerdCheck, Reset, Roomtone, and 11+ others)
3. **Kids Channel Pipeline** — YouTube content generation system (SUNNY.md framework, episode templating, e-book generation)
4. **Monetization Infrastructure** — Gumroad, Stripe, freemium model, analytics, payout compliance
5. **100 Apps Mission** — Execution guides and strategic planning for a portfolio expansion

The live marketing site deploys to **`rhythmixapp.com.au`** (GitHub Pages, deploying repo root). STARLIGHTMIX Studio is deployed to **Cloudflare Pages** at `studio.starlightmix.com`.

### Top-level layout

#### Core Software Projects
| Path | What it is |
|---|---|
| `studio/` | **STARLIGHTMIX Studio** — Next.js 15 static export → Cloudflare Pages. Users upload music, generate AI music videos with their Replicate token. Primary software deliverable. |
| `apps/` | 18+ standalone HTML/PWA apps (18 subdirs): Dreams, Hum, Live, Resonate, Roomtone, HerdCheck (livestock screening), Reset (recovery tracking), Drift, Focus, Glow, Hype, Lapse, Macro, Pulse, Readout, Scan, Trim, Vault, Zips. Range from simple tools to full offline PWAs. |
| `livestock/` | **HerdCheck** — Livestock screening PWA (lameness, mastitis, calving predictor for smallholders). Full offline PWA with service worker, Canvas vision heuristics, i18n support. Species: cattle, buffalo, sheep, goat. |
| `recovery/` | **Reset** — iOS-style recovery app prototype for team sport. Full PWA with offline tracking. |

#### Video & Creative Assets
| Path | What it is |
|---|---|
| `rhythmix-<name>-<length>/` | HyperFrames video Promo/Cut folders (50+ folders). `rhythmix-overview-60s/` is the canonical example. Organized by: landscape 60s/30s, portrait `-f` variants, S-series (5-scene overview/money/tools/vs/pricing), V-series (alt cuts), venue sub-brands. |
| `rhythmix-teaser-60s/DESIGN.md` | Brand design system (palette, typography, motion eases). Lock all styleguides to this. |
| `rhythmix-studio/` | RHYTHMIX Studio CLI source (Node.js-based music video generation). |
| `rhythmix-promo/` | Standalone promo folder structure (standalone from the main rhythm mix folders). |
| `thumbnails/` | Rendered thumbnail PNGs for video series (stories, frequency). |
| `videos/` | Rendered MP4s linked from `README.md`. |

#### Content Pipelines
| Path | What it is |
|---|---|
| `kids-channel/` | YouTube content generation system. Includes SUNNY.md framework, episode templating, e-book generation (Python pipeline), channel art generation, thumbnails, scripts. Queue-based execution (`queue.txt`). |
| `landing/` | Simplified landing page HTML templates for individual apps (codex, dreams, frequency, herdcheck, hum, live, reset, resonance, resonate, roomtone). Quick app promo pages. |
| `launch-kit/` | Launch kit assets for codex, hum, rhythmix. |

#### Monetization & Operations
| Path | What it is |
|---|---|
| `monetization/` | Complete monetization infrastructure: Gumroad integration, Stripe integration, freemium model, payout compliance, analytics setup, Play Store IAP config. Ready for implementation. |
| `builds/` | Build artifacts and deployment outputs. |

#### Documentation & Infrastructure
| Path | What it is |
|---|---|
| `sites/<slug>/` | Site-build pipeline output (sitemap → wireframe → styleguide → HTML pages). Self-contained HTML with inline styles. |
| `capacitor/` | Capacitor iOS wrapper for STARLIGHTMIX Studio. Wraps `studio/out/` via `www/` sync. |
| `capacitor-herdcheck/` | Capacitor iOS wrapper for HerdCheck app. Separate build pipeline. |
| `recovery-ios/` | Capacitor iOS wrapper for Reset recovery app. Used by Codemagic iOS build. |
| `infra/` | Self-hosted wiki setup: Wiki.js + Postgres + Caddy via Docker Compose. |
| `specs/<slug>/` | Spec-driven feature folders (`requirements.md` + `design.md` + `tasks.md`). Current: `rhythmix-app/`, `roomtone/`, `codex-app/`. |
| `video/` | Dormant Remotion 4 + React 19 starter. Not used for new Promos (see ADR-0001). |
| `docs/` | ADRs (`docs/adr/`), agent operating procedures (`docs/agents/`), security notes (`docs/security/shannon.md`), reference copy (`docs/refs/`). |
| `scripts/` | Repo-level scripts: `openclaw-install.sh`, `render-thumbnails.mjs`, `build-announcement.mjs`, `build-manifesto.mjs`. |
| `.agents/skills/` | Source-of-truth skill bundles (hand-edited / synced from upstreams). |
| `.claude/skills/` | Mostly symlinks into `.agents/skills/` plus local-only skills. |
| `.claude/agents/` | FleetView sub-agent definition files. Do not hand-edit. |
| `graphify-out/` | Generated knowledge-graph snapshot. Do not hand-edit. |
| `content/` | Additional content assets. |
| `assets/` | Creative assets (images, audio, design files). |
| `lib/` | Shared JavaScript libraries and utilities. |
| `tools/` | Development tools and utilities. |
| `examples/` | Code examples and reference implementations. |
| `OpenMontage/` | Video montage / editing tool. |

**Reference docs at root (comprehensive guidance):**

*Domain & Strategy*
- `CONTEXT.md` — domain language (Promo, Cut, Narration, Hook)
- `100_APPS_MISSION.md`, `100_APP_MISSION_LAUNCH_STRATEGY.md` — portfolio expansion strategy
- `EXECUTION_MASTER_GUIDE.md` — parallel execution orchestration for multi-app launches
- `COMPETITIVE_10X_STRATEGY.md`, `COMPETITIVE_TEARDOWN.md` — positioning & competitive analysis

*Execution & Tools*
- `CREATIVE-AI-STACK.md` — iPhone-oriented creative AI toolchain
- `KOKORO-SETUP.md` — Kokoro TTS installation & usage for HyperFrames narration
- `SETUP-AGENT-TARS.md`, `SETUP-HERMES.md` — Agent automation setup
- `VOICEBOX-SETUP.md` — Local voice cloning via Voicebox
- `QUICK-START-API.md` — API reference quick start

*Apps & Monetization*
- `STARLIGHTMIX-STUDIO.md` — Studio web app docs
- `monetization/` — complete freemium/monetization setup (Gumroad, Stripe, freemium model, analytics, payout compliance)
- `20_TRENDING_APPS_COMPLETE.md`, `APPS_PORTFOLIO_SUMMARY.md` — app portfolio reference
- `APK_BUILD_QUICKSTART.md`, `ANDROID_BUILD_SETUP.md` — Android/APK build guides
- `APP_BRAND_POLISH_GUIDE.md` — app styling and UX standards

*Content & Launch*
- `MORNING.md` / `MORNING-VOICES.md` — Codex of Reality morning brief
- `kids-channel/SUNNY.md` — YouTube content generation framework
- `MARKETING_TEMPLATES.md` — social media, email, PR templates
- `GLOBAL_ACCESSIBILITY_ROADMAP.md` — WCAG AA compliance roadmap

*Reference*
- `AWESOME-AI-HARDWARE.md` — AI hardware reference
- `COST-SAVINGS.md` — infrastructure and tooling cost optimizations
- `SCRIPT.md`, `VIDEOS.md` — script and video asset references
- `INDEX.md` — directory index

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

Portfolio of 18+ standalone web apps and PWAs (separate from the main marketing site). Each app is self-contained (HTML/CSS/JS), fully offline-capable, and responsive.

### App Categories

**Wellness & Mindfulness**
- `Dreams/` — sleep & meditation
- `Hum/` — breathing & humming exercises  
- `Resonate/` — frequency healing
- `Lapse/` — meditation timer

**Productivity & Organization**
- `Focus/` — distraction-free focus timer
- `Trim/` — document/text trimmer
- `Scan/` — camera scanner
- `Readout/` — text-to-speech reader
- `Pulse/` — habit tracker
- `Vault/` — encrypted notes
- `Zips/` — file management

**Creative & Performance**
- `Live/` — live performance tools
- `Glow/` — creative lighting controls
- `Drift/` — generative visuals
- `Hype/` — social countdown timer
- `Macro/` — macro photography helper

**Domain-Specific**
- `Roomtone/` — room acoustics & tone control (PWA with service worker, manifest, icons)
- `HerdCheck/` — livestock screening (lameness, mastitis, calving) — in `livestock/` directory

**Portfolio & Reference**
- `Untapped/` — Portfolio of 10 app concepts (TYMPAN, HERD, AXLE, DOCKET, LULL, PLUMB, RACK, SOLE, SPOT, STACK)

### App Development Standards

- **Framework:** Vanilla JS, HTML5, CSS3 (zero dependencies for core functionality)
- **Offline:** Full service worker support, localStorage/IndexedDB persistence
- **Responsive:** Mobile-first, works 375px–1200px
- **Accessibility:** WCAG AA compliance, semantic HTML, ARIA labels
- **Theming:** Dark theme default, high contrast support
- **Deployment:** GitHub Pages or Cloudflare Pages per app

### Build & Launch Guidance

See `EXECUTION_MASTER_GUIDE.md` for orchestrating parallel development, APK builds, and Play Store submissions. See `APK_BUILD_QUICKSTART.md` and `ANDROID_BUILD_SETUP.md` for native Android/APK workflows. See `landing/` for quick app promotion templates.

## Kids Channel Pipeline (`kids-channel/`)

YouTube content generation system for animated educational content, episodes, and e-books. Uses Python-based orchestration pipeline with episode templating and batch processing.

### Structure

```
kids-channel/
├── SUNNY.md              # Framework & episode spec template
├── pipeline.py           # Main Python orchestrator
├── episodes/             # Generated episode content
├── ebooks/               # Generated e-book files
├── thumbnails/           # Episode thumbnail PNGs
├── scripts/              # Production scripts & utilities
├── generate_channel_art.py    # Channel branding generator
├── youtube_auth.py       # YouTube API authentication
├── channel-art.png       # Current channel art
├── queue.txt             # Episode generation queue
└── README or SUNNY.md    # Documentation
```

### Workflow

1. **Episode Brief** → `SUNNY.md` framework (logline, act structure, character briefs)
2. **Script Generation** → Flash MCP `flash_episode_brief` tool (multi-act structure + promo copy)
3. **Batch Processing** → `pipeline.py` orchestrates rendering, thumbnail generation, metadata
4. **YouTube Integration** → `youtube_auth.py` handles channel auth; upload videos + playlists
5. **E-book Generation** → Episode transcripts + artwork → `ebooks/` (PDF/ePub)

### Key Tools

- **Flash (Step 3.7 MCP)** — `flash_episode_brief` for structured episode generation (use `reasoning='high'` for multi-act)
- **Replicate/HyperFrames** — render animated video content
- **ElevenLabs MCP** — narration/voiceover generation
- **Pollinations AI MCP** — FLUX image generation for thumbnails, backgrounds
- **Kokoro TTS** — lightweight narration for accessibility

See `kids-channel/SUNNY.md` for full framework and templating conventions.

## Monetization Infrastructure (`monetization/`)

Complete freemium / subscription infrastructure ready for implementation across the app portfolio.

### Components

| File | Purpose |
|---|---|
| `README.md` | Overview & implementation roadmap |
| `QUICK_START.md` | Get started with monetization setup (5-step checklist) |
| `FREEMIUM_MODEL.md` | Freemium strategy, tier definitions, feature gating |
| `GUMROAD_INTEGRATION.md` | Gumroad API setup for digital products (membership, licenses, VAT handling) |
| `STRIPE_INTEGRATION.md` | Stripe payment processing, subscription webhooks, 3D Secure |
| `PAYOUT_COMPLIANCE.md` | Tax ID verification, 1099 reporting, geo-specific regulations |
| `ANALYTICS_SETUP.md` | Tracking revenue, ARPU, churn, LTV metrics |
| `IMPLEMENTATION_CHECKLIST.md` | Step-by-step deployment checklist |
| `play-store-iap-config.json` | Play Store in-app purchase configuration (ready to import) |

### Key Features

- **Freemium Tiers:** Free (limited), Premium ($4.99–$9.99/mo), Lifetime ($29.99–$79.99)
- **Payment Methods:** Gumroad (affiliates, bundles), Stripe (subscriptions, recurring), Play Store IAP (Android)
- **Compliance:** Geo-tiered pricing, GDPR DPA, PCI DSS, VAT/GST auto-calculation
- **Analytics:** Revenue by app, ARPU, cohort retention, churn prediction

See `monetization/QUICK_START.md` for 5-step implementation. See `EXECUTION_MASTER_GUIDE.md` for parallel monetization setup across app portfolio.

## 100 Apps Mission & Strategic Initiatives

Large-scale portfolio expansion, app development orchestration, and go-to-market strategy.

### Key Documents

| Document | Purpose |
|---|---|
| `100_APPS_MISSION.md` | Vision: build portfolio to 100 apps over 18–24 months |
| `100_APP_MISSION_LAUNCH_STRATEGY.md` | Wave-based rollout strategy, marketing timeline, resource allocation |
| `EXECUTION_MASTER_GUIDE.md` | **Real-time orchestration:** 28 apps in parallel, 4-agent execution, status dashboards |
| `20_TRENDING_APPS_COMPLETE.md` | Top 20 app ideas (validated, prioritized, scoped) |
| `APPS_PORTFOLIO_SUMMARY.md` | Complete portfolio inventory, revenue projections, competitive positioning |
| `COMPETITIVE_10X_STRATEGY.md` | 10x positioning, differentiation vs incumbents, moat-building |

### Execution Model

**Phase 1 (Now):** 28 apps shipped, monetization live, Play Store listings active  
**Phase 2:** App discovery & retention optimization (A/B testing, UX polish, ratings)  
**Phase 3:** 50-100 app expansion (themed series, bundle packs, affiliate network)  
**Phase 4:** Ecosystem (communities, contests, creator tools)

**Parallel Agent Execution:** Per `EXECUTION_MASTER_GUIDE.md`, deploy 4 agents in parallel:
1. Asset Generation (icons, metadata, graphics)
2. APK Builds (Capacitor + Android toolchain)
3. Play Store Listings (descriptions, screenshots, localization)
4. Monetization Setup (Gumroad, Stripe, analytics)

See `MARKETING_TEMPLATES.md` for pre-written social media, email, and PR templates. See `APP_BRAND_POLISH_GUIDE.md` for UI/UX standards.

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

## iOS / Capacitor Wrappers

Three separate Capacitor wrappers for native iOS distribution:

| Directory | Wraps | Build System | Status |
|---|---|---|---|
| `capacitor/` | STARLIGHTMIX Studio (`studio/out/`) | Manual or Appflow | Active |
| `recovery-ios/` | Reset recovery app (`recovery/`) | Codemagic (`codemagic.yaml`) | Active |
| `capacitor-herdcheck/` | HerdCheck livestock app (`livestock/`) | TBD | New |

### STARLIGHTMIX Studio iOS (`capacitor/`)

**Commands** (run from `capacitor/`):

```bash
pnpm install
pnpm build:web    # build studio → studio/out/
pnpm sync:web     # copy studio/out/ to www/ and cap sync
pnpm build        # both above
pnpm open:ios     # open in Xcode
pnpm deploy:ios   # deploy via Appflow (requires Ionic account)
```

### Reset Recovery App iOS (`recovery-ios/`)

Automated builds via Codemagic (`codemagic.yaml`):
- **Trigger:** Manual or scheduled via Codemagic dashboard
- **Device:** Mac mini M2
- **Output:** Unsigned debug APK + IPA, emailed to `wiggjamie9@gmail.com`
- **Source:** `recovery/` app

### HerdCheck iOS (`capacitor-herdcheck/`)

Separate Capacitor wrapper for livestock app. Initial setup — fill in build commands and Xcode signing configuration.

## Android / APK Builds

For Play Store distribution and sideloading, see `APK_BUILD_QUICKSTART.md` and `ANDROID_BUILD_SETUP.md`.

**Standard workflow:**
1. Build web app → static HTML + JS
2. Capacitor → Android project (`android/`)
3. Gradle build → `.apk` or `.aab` (app bundle)
4. Play Store upload (signed release build)

**Multiple APK sources:** Each app in `apps/` can have an APK variant via Capacitor. Use `EXECUTION_MASTER_GUIDE.md` for parallel multi-app APK builds.

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

**Rule:** Always reach for Context7 when you need library/API docs, setup instructions, or version-specific code generation — without the user asking. Not for business logic or debugging.

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

## Development Workflows

### Parallel Execution & Orchestration

For large-scale initiatives (28-app launch, content pipeline, asset generation):

1. **Use `/dispatching-parallel-agents` skill** when you have 2+ independent tasks (e.g., asset generation + APK builds + Play Store listings)
2. **Use `/spec-run <slug>` workflow** to auto-generate and execute parallel task waves from `specs/<slug>/tasks.md`
3. **Use EXECUTION_MASTER_GUIDE.md** as the canonical reference for status, task dependencies, and agent allocation
4. **Check-in discipline:** Update status every 30–60 minutes; flag blockers early to prevent cascading delays

### Git Workflow

- **Branch naming:** `claude/feature-name` or `feature/feature-name` (no force-pushes to main)
- **Commits:** Atomic, descriptive messages. Include ticket/spec ID when applicable (e.g., `R-5: add account settings UI`)
- **PRs:** Link to specs, ADRs, or issues. Auto-draft checklist for: tests, docs, accessibility, Lighthouse score (if applicable)

### Testing & QA

- **Unit tests:** Vitest (Studio), Jest (Node CLI), custom test suites per app
- **E2E:** Playwright for critical flows (checkout, sign-up, monetization)
- **Accessibility:** WCAG AA minimum. Use `GLOBAL_ACCESSIBILITY_ROADMAP.md` as reference.
- **Performance:** Lighthouse ≥90 (green) for main marketing pages, ≥80 for apps. See `specs/rhythmix-app/lighthouse.md` for Studio targets.

### Deployment Gates

| Environment | Trigger | Review | Audience |
|---|---|---|---|
| Preview | Non-main branch | Auto-deploy | Stakeholders on feature branches |
| Staging | Manual workflow dispatch | Optional pre-merge review | Internal testing |
| Production | Main branch or manual approval | Required for marketing pages + paid features | Public users |

## Conventions

### File Structure

- **New Promos** → HyperFrames folder at repo root (`rhythmix-<name>-<length>/`). Do not use Remotion (see ADR-0001).
- **New Apps** → `apps/<name>/` with `index.html`, `app.js`, `app.css`, `sw.js`, `manifest.json`. Ensure offline capability and responsive design.
- **New Site Pages** → `sites/<slug>/` via pipeline, then promote to root `.html` when production-ready.
- **Standalone Projects** → non-app, non-rhythmix software (livestock, recovery) gets its own root directory.

### Code & Asset Management

- **Skill edits** → edit source in `.agents/skills/<name>/` (symlink target), never directly in `.claude/skills/` symlinks. Local-only skills edit directly in `.claude/skills/<name>/`.
- **Lockfiles** → keep `video/package-lock.json` ↔ `video/package.json` in sync. Root `package-lock.json` likewise.
- **Brand assets** → reference `rhythmix-teaser-60s/DESIGN.md` for colors, type, motion eases. All promos lock to this.
- **Gitignore** → `node_modules/`, `.remotion/`, `graphify-out/cache/`, `.claude-playwright/`, `dist/`, `.env` (local secrets) are excluded.

### Documentation

- **Specs:** Include stable requirement IDs (`R1`, `R2`, …) and task IDs (`T1`, `T2`, …) for cross-referencing.
- **ADRs:** Record decisions in `docs/adr/` when they affect architecture or long-term project direction.
- **Content warnings** → `README.md` flags that `tiktok-reels-shorts.mp4`, `instagram-facebook.mp4`, `youtube.mp4` contain unverified metrics/testimonials. Only `teaser-coming-soon*.mp4` is safe to publish as-is.
- **README conventions:** Lead with quick start (CLI commands or setup steps), then architecture, then FAQ. Link to CLAUDE.md for full context.

### Monetization & Compliance

- **Freemium logic:** Check `monetization/FREEMIUM_MODEL.md` for tier definitions before gating features.
- **Payment:** Use Gumroad (affiliates, one-time) or Stripe (subscriptions). See `monetization/` for integration guides.
- **Localization:** Geo-tiered pricing, VAT/GST auto-calculation via Stripe. See `monetization/PAYOUT_COMPLIANCE.md`.
- **Analytics:** Track events to measure revenue, ARPU, churn. See `monetization/ANALYTICS_SETUP.md` for dashboards.

## Common Tasks & Decision Trees

### "I need to build a new app"

1. **Plan:** Create brief in `apps/<name>.md` or use `/spec-quick` to scaffold `specs/<name>/`
2. **Design:** Reference `APP_BRAND_POLISH_GUIDE.md` for UI/UX standards, colors from `rhythmix-teaser-60s/DESIGN.md`
3. **Implement:** `apps/<name>/index.html` (HTML5), `app.css` (Tailwind v4 or vanilla CSS), `app.js` (vanilla JS, zero deps)
4. **Offline & Manifest:** Add `sw.js` (service worker), `manifest.json` (PWA metadata)
5. **Test:** Lighthouse ≥80, WCAG AA, responsive 375–1200px
6. **Build:** Capacitor for iOS/Android if needed; use `ANDROID_BUILD_SETUP.md`
7. **Monetize:** Gate premium features per `monetization/FREEMIUM_MODEL.md`; wire payment via Stripe or Gumroad
8. **Deploy:** GitHub Pages or Cloudflare Pages; add landing page to `landing/`
9. **Market:** Update root `.html` page; add to `apps/` index; social media via `MARKETING_TEMPLATES.md`

### "I need to create a promo video"

1. **Brief:** Write logline, hook, narration copy (20–60 words)
2. **Script:** Use `/rhythmix-author` skill or Flash MCP `flash_script` tool (RHYTHMIX-aware narration)
3. **Composition:** Create `rhythmix-<name>-<length>/index.html` (GSAP + CSS) — reference `rhythmix-overview-60s/` for structure
4. **Narration:** Run `npx hyperframes tts` (Kokoro) in the folder to generate `narration.wav`
5. **Design:** Lock visual style to `rhythmix-teaser-60s/DESIGN.md` (colors, type, motion)
6. **Render:** Run `npx hyperframes render` (requires ffmpeg); output → `rhythmix-<name>.mp4`
7. **Publish:** `npx hyperframes publish` (push to registry); upload to YouTube, TikTok, LinkedIn per aspect ratio

See ADR-0001 for why HyperFrames over Remotion. See `CONTEXT.md` for domain language (Promo, Cut, Hook, Narration).

### "I need to generate video content at scale" (Kids Channel)

1. **Framework:** Consult `kids-channel/SUNNY.md` for episode brief structure
2. **Generate:** Use Flash MCP `flash_episode_brief` (high reasoning for multi-act)
3. **Batch:** Add to `queue.txt`; run `pipeline.py` orchestrator
4. **Render:** HyperFrames or Replicate + ElevenLabs for narration
5. **Thumbnails:** Pollinations FLUX or Higgsfield Soul for art generation
6. **Upload:** `youtube_auth.py` handles channel auth; bulk-upload via YouTube API
7. **Track:** Monitor performance via YouTube Analytics integrated in dashboard

### "I need to add monetization to an app"

1. **Model:** Review `monetization/FREEMIUM_MODEL.md` for tier definitions (Free, Premium, Lifetime)
2. **Gate Features:** Add localStorage/localStorage checks in `app.js` per tier
3. **Stripe:** Set up subscription webhooks (see `monetization/STRIPE_INTEGRATION.md`)
4. **Gumroad:** One-time/lifetime sales (see `monetization/GUMROAD_INTEGRATION.md`)
5. **Play Store IAP:** Import `monetization/play-store-iap-config.json` if Android APK
6. **Analytics:** Wire revenue tracking per `monetization/ANALYTICS_SETUP.md`
7. **Compliance:** Ensure VAT/GST calculation, 1099 tax IDs per `monetization/PAYOUT_COMPLIANCE.md`

### "I need to launch 10+ apps in parallel"

1. **Orchestrate:** Follow `EXECUTION_MASTER_GUIDE.md` (28-app template)
2. **Parallel Agents:** Spawn 4 agents in parallel:
   - Agent 1: Asset generation (icons, metadata, graphics)
   - Agent 2: APK builds (Capacitor + Android toolchain)
   - Agent 3: Play Store listings (descriptions, screenshots, localization)
   - Agent 4: Monetization setup (Gumroad, Stripe, analytics)
3. **Status Tracking:** Update `EXECUTION_MASTER_GUIDE.md` every 30min; flag blockers
4. **Testing:** Batch QA on device; use Playwright for critical flows
5. **Go-Live:** Coordinate Play Store submission waves (Day 1: 5 apps, Day 2: 5 apps, etc.)

### "I need to update the marketing site"

1. **Edit:** Modify root `.html` files directly (index.html, studio.html, features.html, etc.)
2. **Design:** Reference `rhythmix-teaser-60s/DESIGN.md` and `sites/*/styleguide.md` for consistency
3. **Test:** Lighthouse ≥90, WCAG AA, mobile-first responsive
4. **Deploy:** Push to main → auto-deploy via GitHub Pages to `rhythmixapp.com.au`

### "I need to debug an issue across 100 files"

- Use `/diagnose` skill for structured bug investigation
- Use `Explore` agent for codebase navigation (find files by pattern, grep for symbols)
- Use `/improve-codebase-architecture` to refactor or introduce abstractions if needed

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

## Quick Reference

### Essential Commands

```bash
# Studio (STARLIGHTMIX)
cd studio && pnpm install && pnpm dev          # http://localhost:3000
pnpm build && pnpm lint && pnpm test

# HyperFrames Promo (from rhythmix folder)
npx hyperframes preview                        # browser preview
npx hyperframes tts                            # generate narration
npx hyperframes render                         # render to MP4

# Kids Channel Pipeline
cd kids-channel && python pipeline.py          # batch process queue.txt

# iOS Capacitor (STARLIGHTMIX)
cd capacitor && pnpm build:web && pnpm open:ios

# Test Server (sites or static content)
python3 -m http.server 8000 --bind 127.0.0.1 --directory <path>
```

### Repository Health Checks

| Check | How | Target |
|---|---|---|
| Lighthouse | `pnpm lint` (Studio) or online | ≥90 (marketing), ≥80 (apps) |
| Accessibility | Manual WCAG AA audit or axe DevTools | WCAG AA pass |
| Mobile Responsive | Chrome DevTools mobile emulation | 375–1200px fluent |
| Build output | `pnpm build` (Studio) or `hyperframes render` | No errors, <100MB |
| Git status | `git status` before committing | Clean (no untracked critical files) |

### Key Files to Review Before Starting

1. **New to the repo?** Read: `CONTEXT.md` (domain language) + `docs/adr/0001-*.md` (video pipeline decision)
2. **Building an app?** Read: `APP_BRAND_POLISH_GUIDE.md` + `APPS_PORTFOLIO_SUMMARY.md` + `apps/hum/` (example app)
3. **Creating promos?** Read: `rhythmix-overview-60s/index.html` (canonical example) + `rhythmix-teaser-60s/DESIGN.md` (brand)
4. **Launching multi-app?** Read: `EXECUTION_MASTER_GUIDE.md` + `APK_BUILD_QUICKSTART.md`
5. **Adding monetization?** Read: `monetization/QUICK_START.md` + `monetization/FREEMIUM_MODEL.md`

### Current Metrics & Status

| Metric | Value | Notes |
|---|---|---|
| Live Apps | 18+ | All offline-capable, WCAG AA |
| Rhythmix Promos | 50+ | HyperFrames, organized by series + aspect ratio |
| Marketing Site | `rhythmixapp.com.au` | GitHub Pages, auto-deploy on push to main |
| Studio Deploy | `studio.starlightmix.com` | Cloudflare Pages, manual approval for production |
| iOS Wrappers | 3 | Capacitor for Studio, Recovery (Codemagic), HerdCheck (new) |
| Monetization | Ready | Gumroad + Stripe integrated, freemium model defined |
| 100 Apps Mission | Phase 1 | 28 apps in execution (see EXECUTION_MASTER_GUIDE.md) |

### Common Blockers & Solutions

| Blocker | Solution |
|---|---|
| Promo not rendering | Check ffmpeg installed; verify hyperframes.json syntax; inspect gsap.min.js loaded |
| App failing offline test | Ensure `sw.js` service worker registered in `index.html`; check `Cache-Control` headers |
| iOS build fails | Run `pnpm sync:web`; verify `www/` copy of build; check Xcode signing identities |
| Play Store submission rejected | Check `play-store-iap-config.json` format; verify app permissions in `manifest.json`; ensure privacy policy linked |
| GitHub Pages not updating | Clear browser cache; verify CNAME file present; check branch deployment rules |

### Getting Help

1. **For Claude Code / session issues:** `/help` or check `.claude/hooks/session-start.sh` for environment setup
2. **For code bugs:** Use `/diagnose` skill for structured investigation
3. **For architecture questions:** Use `/grill-with-docs` to interview the codebase; updates `CONTEXT.md` + `docs/adr/` as needed
4. **For creative asset feedback:** Use `/dream` for quick generation; escalate to `/album-launch` for full campaigns
5. **For large-scale orchestration:** Reference `EXECUTION_MASTER_GUIDE.md` or spin up parallel agents via `/dispatching-parallel-agents`

### Useful External Resources

- **HyperFrames Docs:** https://hyperframes.ai/ (video composition, rendering, publishing)
- **Capacitor Docs:** https://capacitorjs.com/ (iOS/Android bridging)
- **Stripe Docs:** https://stripe.com/docs/api (payments, subscriptions)
- **Gumroad Creators:** https://gumroad.com/creators (affiliate, membership setup)
- **YouTube API:** https://developers.google.com/youtube/v3 (bulk upload, playlists)
- **Play Store Console:** https://play.google.com/console (APK upload, in-app billing)
- **Anthropic Docs:** https://docs.anthropic.com (Claude API, prompt caching, tool use)

### Contact & User Info

- **User:** Jamie Wigg (`jamie.jack.28@hotmail.com`)
- **Repository:** `wiggjamie9-afk/jamie-wigg` (private, GitHub)
- **Primary Domain:** `rhythmixapp.com.au` (GitHub Pages)
- **Studio:** `studio.starlightmix.com` (Cloudflare Pages)
- **Notification Channel:** Automated email + GitHub push notifications

---

**This document is the source of truth for all Claude Code work in this repository.** Update CLAUDE.md whenever:
- A new major directory or project is added
- Deployment or CI/CD logic changes
- Brand, domain language, or architectural decisions shift
- New tools, MCP servers, or skills become essential to the workflow

Last sync: 2026-06-09 — covers 50+ Rhythmix promos, 18+ apps, Kids Channel pipeline, monetization infrastructure, 100-apps mission orchestration.
