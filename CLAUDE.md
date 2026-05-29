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
- **Permission allowlist + session-start health check** → `.claude/settings.json` and `.claude/hooks/session-start.sh`.

## Repository Overview

This workspace hosts **RHYTHMIX** (AI music platform) marketing assets, promo videos, web apps, and the STARLIGHTMIX Studio web application. The live site is at **`rhythmixapp.com.au`** (GitHub Pages, deploying the repo root).

### Top-level layout

| Path | What it is |
|---|---|
| `studio/` | **STARLIGHTMIX Studio** web app — Next.js 15 static export → Cloudflare Pages. Primary software project. |
| `rhythmix-<name>-<length>/` | HyperFrames video Promo/Cut folders (60+ folders). `rhythmix-overview-60s/` is the canonical example. |
| `rhythmix-teaser-60s/DESIGN.md` | Brand design system (palette, type, motion). Lock all styleguides to this. |
| `apps/` | Small standalone HTML apps: `dreams.html`, `hum.html`, `live.html`, `resonate.html`, plus `roomtone/` (PWA) and `untapped/` (portfolio of 10 app concepts with landing pages). |
| `sites/<slug>/` | Site-build pipeline output (sitemap → wireframe → styleguide → HTML pages). |
| `specs/<slug>/` | Spec-driven feature folders (`requirements.md` + `design.md` + `tasks.md`). Current specs: `rhythmix-app/`, `roomtone/`, `codex-app/`. |
| `launch-kit/` | Launch kit assets for `codex/`, `hum/`, `rhythmix/`, `protocols/`. |
| `video/` | Dormant Remotion 4 + React 19 starter. `MyComposition` returns `null`. Not used for Promos (see ADR-0001). |
| `text.txt`, `text 2.txt`, `text 3.txt` | Legacy RHYTHMIX landing-page HTML/CSS fragments (pre-pipeline). Reference only. |
| `*.html` at root | Live marketing site pages served at `rhythmixapp.com.au`: `index.html`, `studio.html`, `features.html`, `rhythmix.html`, `resonance.html`, `downloads.html`, `frequency.html`, etc. |
| `videos/` | Rendered MP4s linked from `README.md`. |
| `.agents/skills/` | Source-of-truth skill bundles (hand-edited / synced from upstreams). |
| `.claude/skills/` | Mostly symlinks into `.agents/skills/` plus local-only skills (`rhythmix-author`, `rhythmix-site`, `rhythmix-spec`, `remotion`, `algorithmic-art`, `brand-guidelines`, `canvas-design`, `claude-api`, etc.). |
| `docs/` | ADRs (`docs/adr/`), agent docs (`docs/agents/`), security notes (`docs/security/shannon.md`), reference copy (`docs/refs/`). |
| `scripts/` | Repo-level scripts: `openclaw-install.sh`, `render-thumbnails.mjs`, `build-announcement.mjs`, `build-manifesto.mjs`. |
| `graphify-out/` | Generated knowledge-graph snapshot. Do not hand-edit. |
| `content/` | Additional content assets. |

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

The repo root IS the site. GitHub Pages serves it directly via `.github/workflows/deploy-pages.yml` (push to `main` → deploy). Key pages:

- `index.html` — main landing page
- `studio.html` — Studio product page
- `features.html`, `rhythmix.html` — feature/product overview
- `resonance.html` — RESONANCE frequency healing PWA (latest addition as of May 2026)
- `frequency.html` — Frequency app
- `downloads.html` — video download page (linked from `README.md`)
- `dreams-app.html`, `hum.html`, `live-app.html`, `resonate-app.html` — individual app pages
- `founder.html`, `privacy.html`, `terms.html`, `refunds.html`, `thank-you.html` — supporting pages

CNAME: `rhythmixapp.com.au`.

## Apps (`apps/`)

Standalone web apps (separate from the main marketing site):

- `apps/dreams.html`, `apps/hum.html`, `apps/live.html`, `apps/resonate.html` — individual app concept pages
- `apps/roomtone/` — Roomtone PWA (full service worker, manifest, icons)
- `apps/untapped/` — Portfolio of 10 app concepts: TYMPAN, HERD, AXLE, DOCKET, LULL, PLUMB, RACK, SOLE, SPOT, STACK. Each has a `*.html` prototype, `*-landing.html`, and `*.md` brief.

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
└── rhythmix-<name>.mp4 # rendered output
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

## Remotion Video Project (`video/`) — Dormant

Remotion 4 + React 19 + Tailwind v4 starter. `MyComposition` returns `null`. Kept as an experiment. Do not add new Promos here — see ADR-0001.

```bash
# Run from video/
npm i && npm run dev   # Remotion Studio preview
```

## Skills

Skills live in two shapes:

- **Synced / hand-written** — source in `.agents/skills/<name>/`, symlinked into `.claude/skills/<name>`. Do not hand-edit synced skills; update upstream and re-record the hash in `skills-lock.json`.
- **Local-only** — live directly in `.claude/skills/<name>/` with no counterpart in `.agents/skills/`. These include `rhythmix-author`, `rhythmix-site`, `rhythmix-spec`, `remotion`, `algorithmic-art`, `brand-guidelines`, `canvas-design`, `caveman`, `claude-api`, `diagnose`, `doc-coauthoring`, `docx`, `frontend-design`, `grill-me`, `grill-with-docs`, `handoff`, `improve-codebase-architecture`, `internal-comms`, `mcp-builder`, `pdf`, `pptx`, `prototype`, `skill-creator`, `slack-gif-creator`, `tdd`, `theme-factory`, `to-issues`, `to-prd`, `triage`, `web-artifacts-builder`, `webapp-testing`, `write-a-skill`, `xlsx`, `zoom-out`.

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
- `/rhythmix-spec <brief>` — RHYTHMIX campaign spec wrapper.
- `/to-prd`, `/to-issues`, `/triage` — chat → PRD → GitHub issues.

### Engineering skills (Matt Pocock bundle)

- `/grill-with-docs` — interview a plan; updates `CONTEXT.md` + `docs/adr/`.
- `/diagnose` — disciplined bug/perf-regression loop.
- `/tdd` — red-green-refactor cycle.
- `/improve-codebase-architecture`, `/zoom-out` — refactor/navigation.
- `/prototype`, `/grill-me`, `/handoff`, `/caveman`, `/write-a-skill` — productivity.
- `/claude-api` — build/debug Claude API / Anthropic SDK apps with prompt caching.
- `/frontend-design` — production-grade UI, avoids generic AI aesthetics.

### Creative / launch slash commands

- `/dream <description>` — one-shot asset (image, video, music, voice, site) routed to the right tool.
- `/album-launch <brief>` — fan-out four parallel agents: cover art, music track, 60s video, landing section.
- `/rhythmix-new [duration] [aspect] [angle]` — end-to-end promo: script → TTS → HyperFrames → render → downloads page.

### Hugging Face skills

`hf-cli`, `huggingface-best`, `huggingface-papers`, `huggingface-datasets` — synced from `huggingface/skills` into `.agents/skills/`. Tracked in `skills-lock.json`.

### OpenClaw CLI skills

Installed via `bash scripts/openclaw-install.sh` on a machine with unrestricted egress (ClawHub blocked from cloud sandbox). Queue: `ai-video-editor-motion-graphics`, `self-improving-agent`, `voice-wake-say`, `voice-ai-voices`, `azure-ai-voicelive-py`, `app-builder`, `deploy-agent`.

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

Site-build pipeline output (sitemap → wireframes → styleguide → HTML pages per page). Self-contained HTML files with inline styles and `--token` CSS vars. Preview with `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>`. Current sites: `rhythmix/`, `hum/`, `codex/`. See `sites/README.md`.

## Docs

- `docs/adr/0001-hyperframes-over-remotion-for-promos.md` — ADR-0001. Read before reasoning about the video pipeline.
- `docs/agents/domain.md`, `issue-tracker.md`, `triage-labels.md` — agent operating procedures for GitHub Issues.
- `docs/security/shannon.md` — Shannon AI pentester (Keygraph) reference. Relevant for auditing the Studio Workers or license endpoint, **not** for static marketing pages.
- `docs/refs/` — Reference copy and voiceover scripts: `frequency-30s-science-voiceover.md`, `frequency-30s-story-voiceover.md`, `frequency-60s-voiceover.md`, `rhythmix-frequency-brief.md`, `frequency-launch-copy.md`, `humming-research-*.md`, `instagram-prompts.md`, `claude-code-cheatsheet.md`, `free-claude-code.md`.

## Conventions

- **New Promos** → HyperFrames folder at repo root (`rhythmix-<name>-<length>/`). Do not use Remotion.
- **New site pages** → `sites/<slug>/` via pipeline, then promote to root `.html` files when ready for production.
- **New app concepts** → `apps/<name>/` or `apps/<name>.html`.
- **Skill edits** → edit in `.agents/skills/<name>/` (the symlink target), never directly in `.claude/skills/` symlinks.
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
