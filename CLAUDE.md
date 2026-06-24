# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository. **Last updated: 2026-06-24**

## Repository Overview

This is a **multi-product ecosystem** combining:

1. **BUDDY BUILDER** — AI companion app generator. Create fully-functional buddy apps with a single prompt. Primary focus area with rapid evolution.
2. **STARLIGHTMIX STUDIO** — AI music video generator with zero-cost LLM captions (free tier aggregation: Groq, Gemini, Mistral, +13 more).
3. **RHYTHMIX** — 50+ promo videos (HyperFrames compositions) for STARLIGHTMIX product.
4. **Standalone Apps** — HerdCheck (livestock screening PWA), Reset (recovery app), Codex (learning PWA), plus 50+ buddy app variants.
5. **Marketing Infrastructure** — Email sequences, templates, monetization layer, analytics.
6. **Mobile Wrappers** — Capacitor iOS/Android builds for multiple apps.

The repo hosts:
- **98 directories** across products
- **104+ markdown docs** (specs, guides, research)
- **Multiple monorepos** with independent package.json/lock files
- **GitHub Pages deployment** (repo root → `rhythmixapp.com.au`)
- **Cloudflare Pages** for Studio (`studio.starlightmix.com`)

---

## 🚀 Quick Start (For Claude)

### Buddy Builder (Primary Focus)

- **Generate a buddy app** → Run `/dream create a <description> buddy app` or use `agent-builder/` directory
- **Create spec** → `/spec-quick <description>` → `specs/<slug>/{requirements,design,tasks}.md`
- **Execute spec** → `/spec-run <slug>` spawns parallel `Agent` calls per task
- **Publish buddy app** → App lands in `apps/buddy-<name>/index.html` with full Tailwind + shadcn/ui styling
- **Connect to Claude API** → Buddies use Anthropic SDK with Messages API; see `agent-builder/AUTH-SETUP.md`
- **Deploy buddy** → Buddy apps are standalone HTML/JS. Deploy via Vercel, Netlify, or Capacitor wrapper.

### STARLIGHTMIX Studio

- **Build Studio locally** → `cd studio && pnpm install && pnpm dev` (Next.js 15, static export)
- **Deploy to Cloudflare** → Studio CI/CD via `.github/workflows/studio-deploy.yml`
- **Cost model** → User brings Replicate token; metadata is free (aggregated LLM tier fallback)
- **Storage** → No server-side audio storage. Everything in `localStorage` + IndexedDB.

### RHYTHMIX Videos

- **Reference** → `rhythmix-overview-60s/` is the canonical 60s HyperFrames example
- **Create new promo** → `rhythmix-author` skill or `/rhythmix-new [duration] [aspect]`
- **Brand reference** → `rhythmix-teaser-60s/DESIGN.md` (palette, type, motion, easing)
- **Script generation** → Step3.7 Flash MCP (`.claude/mcp/stepfun/server.mjs`) or `flash_episode_brief` for TV series

### General Creative Assets

- **Single asset (image/video/music/voice)** → `/dream <description>` auto-routes to right tool
- **Album/single launch** → `/album-launch <brief>` orchestrates cover + track + promo + landing page in parallel
- **Landing page/site** → `/site-build <brief>` (sitemap → wireframe → styleguide → design)
- **RHYTHMIX-branded site** → `/rhythmix-site <brief>` (locks styleguide to brand template)

---

## Directory Structure

### Core Products

| Path | Purpose | Status |
|---|---|---|
| **`agent-builder/`** | Buddy Builder platform. Next.js 15 + TypeScript + Tailwind v4 + Vitest. Generates ~50 buddy app variants. | 🔥 **Active development** |
| **`studio/`** | STARLIGHTMIX Studio. Next.js 15, static export → Cloudflare Pages. Free-tier LLM aggregation for captions. | ✅ Production |
| **`livestock/`** | HerdCheck — offline PWA for livestock health screening (lameness, mastitis, calving prediction). Full service worker. | ✅ Stable |
| **`recovery/`** | Reset — recovery app prototype for team sport. iOS-style, full PWA. | ✅ Stable |
| **`capacitor/`** | Capacitor iOS/Android wrapper for STARLIGHTMIX Studio. Wraps `studio/out/`. | ⚙️ Maintained |
| **`capacitor-buddies/`** | Capacitor wrapper for buddy apps (multi-app iOS/Android). | ⚙️ Maintained |
| **`capacitor-herdcheck/`** | Capacitor wrapper for HerdCheck (livestock screening PWA). | ⚙️ Maintained |

### Content & Marketing

| Path | Purpose |
|---|---|
| **`rhythmix-*-<length>/`** | 50+ HyperFrames video compositions. `rhythmix-overview-60s/` is the canonical reference. Aspect ratios: 16:9 (landscape), 9:16 (portrait `-f` suffix), 1:1 (square). |
| **`apps/`** | Standalone app concept pages: `dreams.html`, `hum.html`, `live.html`, `resonate.html`, `roomtone/`, `untapped/` (10-app portfolio). |
| **`sites/<slug>/`** | Site-build pipeline output. Self-contained HTML files with inline CSS + token variables. |
| **`email-sequences/`** | Email campaign sequences (automation workflows). |
| **`email-templates/`** | Reusable email templates for transactional + marketing sends. |
| **`landing/`** | Landing page assets and boilerplate. |
| **`monetization/`** | Stripe integration, license validation, receipt generation. |
| **`kids-channel/`** | Bedtime stories and kids-focused content assets. |
| **`design/`**, **`assets/`**, **`avatars/`** | Design tokens, image assets, character avatars for apps. |

### Infrastructure & Configuration

| Path | Purpose |
|---|---|
| **`.claude/`** | Claude Code settings, skills (local + symlinks), agents (FleetView), hooks. |
| **`.agents/skills/`** | Source-of-truth skill bundles (synced from upstream or hand-edited). |
| **`.mcp.json`** | MCP server registrations (Replicate, ElevenLabs, Higgsfield, Playwright, Context7, etc.). |
| **`.github/workflows/`** | CI/CD: GitHub Pages deploy, Studio Cloudflare deploy, Codemagic iOS builds. |
| **`config/`** | OpenManus TOML configs, deployment configs, environment templates. |
| **`docs/adr/`** | Architecture Decision Records. **ADR-0001:** HyperFrames over Remotion for Promos. |
| **`docs/agents/`** | Agent operating docs: issue tracker, triage labels, domain language. |
| **`docs/security/`** | Security notes, audit guidance. |
| **`infra/`** | Self-hosted infrastructure: Wiki.js + Postgres + Caddy via Docker Compose. |
| **`scripts/`** | Repo-level utilities: APK builds, render thumbnails, manifesto generation, license tools. |
| **`lib/`** | Shared JavaScript/TypeScript utilities (scoring, vision, i18n, etc.). |

### Reference Documentation

| File | What it is |
|---|---|
| **`CONTEXT.md`** | Domain language (Promo, Cut, Narration, Hook, Buddy, etc.) + key metaphors. Read before proposing changes to messaging. |
| **`CREATIVE-AI-STACK.md`** | iPhone-driven creative AI toolchain. Free and freemium tools user actually uses. |
| **`BUDDY-SYSTEM-INTEGRATION.md`** | Buddy system architecture: long-term memory, anonymous telemetry, Claude API integration. |
| **`BUDDY-FREEMIUM-QUICK-START.md`** | Quick start for Buddy freemium tier (limited API calls, localStorage persistence). |
| **`EXECUTION_MASTER_GUIDE.md`** | High-level execution and sequencing guide across all projects. |
| **`COMPLETE_SETUP_GUIDE.md`** | Full setup including all optional dependencies (Kokoro, Voicebox, OpenManus, etc.). |
| **`KOKORO-SETUP.md`** | Kokoro TTS (lightweight multi-language TTS for HyperFrames narration). |
| **`VOICEBOX-SETUP.md`** | Voicebox local voice cloning (on-device Mac, zero API cost). |
| **`SETUP-OPENMANUS.md`** | OpenManus agent framework (autonomous browser automation). |
| **`MORNING.md`** | Codex of Reality morning brief quickstart. |
| **`AWESOME-AI-HARDWARE.md`** | AI hardware reference (GPUs, TPUs, edge devices). |
| **`SCRIPT.md`**, **`VIDEOS.md`** | Script and video asset references. |

---

## Product Details

### 🤖 Buddy Builder (agent-builder/)

**What it is:** AI companion app generator. Write a one-sentence prompt → get a full working buddy app with UI, Claude API integration, long-term memory, and optional offline Ollama backend.

**Stack:**
- Next.js 15 (App Router)
- React 19.2.3, TypeScript 5.9
- Tailwind v4 + shadcn/ui
- Vitest for tests
- Cloudflare Workers (license validation)

**Key files:**
- `app/` — Next.js app directory (routes, API, layouts)
- `components/` — React components (inputs, outputs, chat, settings)
- `lib/` — Utilities (Claude SDK, auth, storage, memory)
- `templates/` — Buddy app code templates (React/HTML/CSS)
- `migrations/` — Database schema migrations

**Commands (from `agent-builder/`):**
```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm build            # Next.js static export → out/
pnpm lint             # ESLint + TypeScript check
pnpm test             # Vitest
```

**Deployment:**
- Preview: any non-main branch → `https://<branch>.starlightmix-studio.pages.dev`
- Production: `main` branch with manual approval on `production` GitHub Environment

**Generated buddy apps:**
- Live at `apps/buddy-<name>/index.html`
- Standalone HTML/JS files with inline Tailwind + shadcn/ui
- Copy to Capacitor wrapper for iOS/Android

**Claude API Integration:**
- Users paste their own API key in settings
- Buddies use Anthropic SDK with `useChat` or `useCompletion` hooks
- Long-term memory persisted in localStorage (encrypted with user's password)
- Optional: Ollama backend for private local inference

### 🎵 STARLIGHTMIX Studio (studio/)

**What it is:** Web wrapper for STARLIGHTMIX Studio CLI. Users upload a track, pick a theme → get an AI music video with free captions.

**Cost model:**
- Caption + metadata generation: **$0** (free tier aggregation)
- Video generation: user's Replicate token (~$0.05-0.50 per video)
- UI shows: "You saved $0.02!"

**Tech Stack:**
- Next.js 15 with static export (`output: "export"`)
- React 19, TypeScript, Tailwind v4
- Vitest tests
- No server-side audio storage
- Cloudflare Workers for license validation (`studio/workers/license/`)

**Commands (from `studio/`):**
```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm build            # → out/ (static HTML/JS)
pnpm test             # Vitest
```

**Free LLM tier aggregation:**
- Primary: Groq LPU inference (free tier)
- Fallback chain: Gemini, Mistral, Grok-2, Pplx, +8 more
- Graceful degradation: if all free tiers exhausted, request Claude API call (costs $0.01-0.05)

**Deployment:**
- Cloudflare Pages at `studio.starlightmix.com`
- CI/CD: `.github/workflows/studio-deploy.yml`
- Auto preview on PR; production requires manual approval

### 🎬 RHYTHMIX Promo Videos

**Canon:** `rhythmix-overview-60s/` — 60s landscape HyperFrames composition. Copy structure for new promos.

**File structure (per cut):**
```
rhythmix-<name>-<length>/
├── index.html           # GSAP + CSS composition
├── script.txt           # Spoken narration text
├── narration.wav        # TTS audio (Kokoro or ElevenLabs)
├── hyperframes.json     # {"id":"...", "width":1920, "height":1080}
├── meta.json            # {"version":"0.4.42"}
├── package.json         # Scripts: dev, check, render, publish
├── gsap.min.js          # GSAP library bundle
├── DESIGN.md            # Optional: cut-specific design notes
├── renders/             # Optional: named render outputs
└── rhythmix-<name>.mp4  # Rendered output (if present)
```

**HyperFrames commands (from cut folder):**
```bash
npx --yes hyperframes@0.4.42 preview   # Browser preview
npx --yes hyperframes@0.4.42 lint      # Validate composition
npx --yes hyperframes@0.4.42 tts       # Generate narration.wav (needs Kokoro)
npx --yes hyperframes@0.4.42 render    # Render to MP4 (needs ffmpeg)
npx --yes hyperframes@0.4.42 publish   # Push to registry
```

**Cut naming conventions:**
- `rhythmix-<name>-60s` — Standard 60s landscape promo
- `rhythmix-<name>-30s` — 30s landscape cut
- `rhythmix-<name>-f` — Portrait variant (TikTok/Reels, 9:16)
- `rhythmix-s1-` through `rhythmix-s5-` — 5-scene series (landscape)
- `rhythmix-s1-*-f` through `rhythmix-s5-*-f` — Portrait variants
- `rhythmix-venue-*` — Venue sub-brand cuts (each has own `DESIGN.md`)

**Aspect ratios:**
- **16:9** (1920×1080) — YouTube, LinkedIn
- **9:16** (1080×1920) — TikTok, Reels, Shorts
- **1:1** (1080×1080) — Instagram feed

**Brand reference:**
- Design system: `rhythmix-teaser-60s/DESIGN.md`
- Palette, typography, motion eases locked in brand doc
- All new styleguides → inherit brand system

---

## 🛠 Tools, MCP Servers & Skills

### MCP Servers (`.mcp.json`)

| Key | Command | Purpose |
|---|---|---|
| **creative-stack** | `node .claude/mcp/creative-stack/server.mjs` | Replicate + ElevenLabs (image, video, music, TTS). Enable in settings.json |
| **higgsfield** | `pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp` | Soul (text→image), DOP (image→video), talking-head, character refs. Env: `HIGGSFIELD_API_KEY`, `HIGGSFIELD_SECRET` |
| **pollinations** | `npx -y @pollinations/model-context-protocol` | Free tier: FLUX, Sana, Nova Reel, Suno v5, Qwen3-TTS. No key required. (⚠️ Sandbox egress-gated) |
| **playwright** | `npx -y @playwright/mcp@latest` | Base browser automation. DEFAULT_BASE_URL: `http://localhost:8000` |
| **claude-playwright** | `node node_modules/claude-playwright/dist/mcp/server.cjs` | Advanced Playwright (session, profile, test mgmt). Run `npm install` first |
| **context7** | HTTP `https://mcp.context7.com/mcp` | Real-time library/API documentation. **Always prefer Context7 for setup, version-specific code, API calls** — without user asking. Free key: `CONTEXT7_API_KEY` in `.env` |
| **openmanus** | `python -m app.mcp.server` (from `/tmp/OpenManus`) | LLM-driven browser agent. Tools: navigate, click, fill, extract, screenshot, search. Setup: `OPENMANUS-MCP-INTEGRATION.md` |
| **stepfun** | `.claude/mcp/stepfun/server.mjs` | Step3.7 Flash API (script + story generation). Tools: `flash_script`, `flash_chat`, `flash_episode_brief`. Env: `STEP_API_KEY`, `STEP_BASE_URL` |

### Claude Code Skills

**Video/Creative Pipeline:**
- `/rhythmix-new [duration] [aspect] [angle]` — End-to-end promo (script → TTS → HyperFrames → render)
- `/rhythmix-author` — Script → composition → render workflow
- `/dream <description>` — One-shot asset (routes to image/video/music/voice/site tool)
- `/album-launch <brief>` — Fan-out 4 agents: cover + track + promo + landing page
- `rhythmix-site`, `site-build`, `/site-sitemap`, `/site-wireframe`, `/site-styleguide`, `/site-design` — Landing page pipeline

**Spec & Planning:**
- `/spec-quick <description>` — Generate `specs/<slug>/{requirements,design,tasks}.md`
- `/spec-analyze <slug>` — Surface ambiguities, rewrite requirements
- `/spec-run <slug>` — Execute tasks in parallel Agent waves
- `/spec-to-repo` — Scaffold repo from spec
- `/rhythmix-spec <brief>` — RHYTHMIX campaign spec wrapper

**Engineering:**
- `/code-review`, `/simplify` — Code quality & refactoring
- `/verify` — Manual testing (run app, test changes)
- `/frontend-design` — Production UI (avoids generic AI aesthetics)
- `/apple-hig-expert` — Apple HIG guidance (iOS/macOS)
- `/docker-development` — Docker-based dev workflow
- `/using-git-worktrees` — git worktree workflow for parallel branches
- `/finishing-a-development-branch` — Pre-merge checklist
- `/tdd` — Red-green-refactor cycle
- `/diagnose` — Disciplined bug/perf regression loop

**Product & SaaS:**
- `/product-analytics`, `/product-discovery`, `/seo-audit`, `/slo-architect`
- `/experiment-designer`, `/feature-flags-architect`, `/landing-page-generator`
- `/llm-cost-optimizer`, `/prompt-governance`

**Hugging Face:**
- `hf-cli`, `huggingface-best`, `huggingface-papers`, `huggingface-datasets` (synced from upstream; tracked in `skills-lock.json`)

---

## Development Workflows

### Adding a New Buddy App

1. **Create spec** → `/spec-quick "Create a meditation buddy app for sleep"`
2. **Review & refine** → `/spec-analyze <slug>` to surface contradictions
3. **Execute** → `/spec-run <slug>` spawns parallel Agent per task
4. **Generate** → Run `/dream <description> buddy app` or manually edit `agent-builder/templates/`
5. **Deploy** → Output → `apps/buddy-<name>/index.html`
6. **Wrap (optional)** → Copy to `capacitor-buddies/` for iOS/Android

### Adding a New RHYTHMIX Promo

1. **Write script** → Step3.7 Flash (`flash_script` tool) or manual script in `script.txt`
2. **Generate TTS** → `npx --yes hyperframes@0.4.42 tts` (needs Kokoro)
3. **Compose** → Copy `rhythmix-overview-60s/` structure, edit `index.html` (GSAP + CSS)
4. **Preview** → `npx --yes hyperframes@0.4.42 preview`
5. **Render** → `npx --yes hyperframes@0.4.42 render` (needs ffmpeg)
6. **Publish** → Commit to repo; GitHub Actions auto-deploys

### Building a Landing Page

1. **Define structure** → `/site-sitemap <brief>` → `sites/<slug>/sitemap.md`
2. **Wireframe pages** → `/site-wireframe <slug>` → `sites/<slug>/wireframes/`
3. **Design tokens** → `/site-styleguide <slug>` → `sites/<slug>/styleguide.md`
4. **Render pages** → `/site-design <slug>` → `sites/<slug>/*.html`
5. **Review** → `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>`
6. **Promote** → Rename to root `.html` when ready for production

### Email Campaign Workflow

1. **Create template** → Write `.html` in `email-templates/`
2. **Test** → Check responsive rendering (mobile + desktop)
3. **Sequence** → Link sequences in `email-sequences/campaign-<name>.json`
4. **Schedule** → Use existing automation (Zapier or webhook-based)
5. **Monitor** → Analytics tracked in `analytics/` directory

---

## GitHub Workflow

### Deployment Branches

**Primary branches:**
- `main` — Production. Push here for immediate GitHub Pages deploy (`rhythmixapp.com.au`).
- `claude/claude-md-docs-dh1411` — Feature branch (as specified in session context).

**Pull Requests:**
- Do NOT create PR unless explicitly asked by user
- When created: CI runs (lint, tests, build checks)
- Studio/Agent-Builder require `production` GitHub Environment approval for main deploy

### CI/CD Workflows

| Workflow | Trigger | Result |
|---|---|---|
| **deploy-pages.yml** | Push to `main` or `workflow_dispatch` | Deploy repo root to GitHub Pages (`rhythmixapp.com.au`) |
| **studio-deploy.yml** | Push touching `studio/**` | Auto preview on PR; production on main with approval |
| **codemagic.yaml** | Manual or Codemagic dashboard | Unsigned debug iOS build (`recovery-ios/`), emailed to `wiggjamie9@gmail.com` |

---

## Configuration & Setup

### Environment Variables

Create `.env` from `.env.example`:

```bash
# API Keys
REPLICATE_API_TOKEN=...              # For Replicate image/video/music
ELEVENLABS_API_KEY=...               # For ElevenLabs TTS
HIGGSFIELD_API_KEY=...               # For Higgsfield Soul (text→image)
HIGGSFIELD_SECRET=...                # Higgsfield API secret
STEP_API_KEY=...                     # Step3.7 Flash API
STEP_BASE_URL=https://api.stepfun... # Flash API endpoint
CONTEXT7_API_KEY=...                 # Context7 docs MCP

# Optional (for local Kokoro TTS)
KOKORO_ENDPOINT=http://127.0.0.1:8880

# Optional (for local Voicebox)
VOICEBOX_ENDPOINT=http://127.0.0.1:17493

# Buddy freemium tier
BUDDY_MAX_API_CALLS_PER_DAY=50
```

### Claude Code Settings

**`.claude/settings.json`:**
- Permission allowlist (Bash, MCP tools)
- Session-start hooks (health checks)
- MCP server configuration

**`.claude/settings.local.json`:**
- Local API keys (Replicate, ElevenLabs, etc.)
- Model overrides
- Performance tuning

**`.claude/hooks/session-start.sh`:**
- Auto-checks for missing dependencies (ffmpeg, Kokoro, etc.)

---

## Conventions & Best Practices

### Code Style

- **JavaScript/TypeScript** — Prettier + ESLint (auto-format on save)
- **React** — Function components + hooks (no class components)
- **Database** — Migrations in `migrations/` with timestamps
- **Tests** — Vitest, run via `pnpm test` or `npm test`
- **Comments** — Minimal; only WHY (not WHAT). No multi-paragraph docstrings.

### File Organization

- **New features** → Create in isolated directory/branch
- **Shared utilities** → `lib/` (JavaScript) or `components/` (React)
- **Styles** → Tailwind utility classes (no CSS files, except global)
- **Tests** → Co-located with code or in `__tests__/` directory

### Git Conventions

- **Commit messages** — Clear, imperative mood. Reference task IDs if applicable.
- **Branches** — Feature branches → `feature/<name>`, bug fixes → `fix/<name>`, docs → `docs/<name>`
- **Push** → `git push -u origin <branch>` on first push; retry up to 4 times with exponential backoff on failure
- **Do NOT** — Force-push to main, skip hooks, disable signing

### Documentation

- **Design decisions** → `docs/adr/` (Architecture Decision Records)
- **Domain language** → Keep `CONTEXT.md` up-to-date
- **Setup instructions** → Reference `.env.example` + setup guides
- **Change logs** → Reference in PRs, not in code comments

### Buddy App Generation

When generating buddy apps:
1. **Use Claude API**, not mock data
2. **Long-term memory** — Store in encrypted localStorage, JSON format
3. **Graceful degradation** — Work offline or with fallback LLMs
4. **Styling** — Tailwind v4 + shadcn/ui (never write raw CSS)
5. **Testing** — Basic happy-path test in `__tests__/` folder

### Video Asset Guidelines

- **RHYTHMIX promos** — Lock brand to `rhythmix-teaser-60s/DESIGN.md`
- **Safe to publish** — Only `teaser-coming-soon*.mp4` (no metrics, testimonials, or pricing)
- **Aspect ratios** — Match use case (16:9 YouTube, 9:16 TikTok, 1:1 Instagram)
- **Narration** — Use Kokoro TTS (multi-language, voice blending) or ElevenLabs (studio-grade)

---

## Troubleshooting & Common Tasks

### "HyperFrames composition won't render"

1. Check `hyperframes.json` has correct width/height
2. Verify `gsap.min.js` is present (copy from another Cut folder if missing)
3. Run `npx --yes hyperframes@0.4.42 lint` to validate
4. Ensure ffmpeg is installed: `ffmpeg -version`

### "Studio build fails"

1. `cd studio && pnpm install` (ensure deps up-to-date)
2. Check for TypeScript errors: `pnpm lint`
3. Verify Node 20+: `node --version`
4. Clear cache: `rm -rf .next out`

### "Buddy app won't connect to Claude API"

1. Verify `REPLICATE_API_TOKEN` in `.env` (for Replicate) or `ANTHROPIC_API_KEY` for Claude direct
2. Check network: `curl https://api.anthropic.com/status`
3. Review browser console for CORS errors
4. Test with `/dream` first to verify credentials

### "Missing HyperFrames or Kokoro"

1. HyperFrames: `npx --yes hyperframes@0.4.42 --version`
2. Kokoro: `pip install kokoro-tts` then `kokoro-tts --version`
3. ffmpeg: `brew install ffmpeg` (macOS) or `apt-get install ffmpeg` (Linux)

### "Permission denied on git operations"

1. Verify SSH key is added to GitHub: `ssh -T git@github.com`
2. If using HTTPS: `git config --global credential.helper osxkeychain` (macOS)
3. For CLI: ensure PAT token has `repo` scope

---

## Model Defaults & Routing

When spawning subagents via the `Agent` tool:

| Task Type | Use Model | Notes |
|---|---|---|
| File reads, grep, config edits | Haiku | Low-context mechanical tasks |
| Video scripts, copy, design | Sonnet or Opus | Creativity & judgment required |
| Bug debugging, complex logic | Sonnet | Deep reasoning needed |
| Screenshots, UI review | Sonnet+ | Vision-required tasks (Haiku is text-only) |
| Parallel mechanical tasks | Haiku | Keep token cost low in fan-out |

**Default:** Omit `model` parameter to use session default (typically Sonnet). Always omit for tasks needing vision.

---

## Reference Documentation at Root

All of these are read by Claude when planning work:

- `CONTEXT.md` — Domain language & key metaphors
- `BUDDY-SYSTEM-INTEGRATION.md` — Buddy memory, telemetry, API integration
- `EXECUTION_MASTER_GUIDE.md` — Sequencing across all products
- `COMPLETE_SETUP_GUIDE.md` — Full optional dependency setup
- `CREATIVE-AI-STACK.md` — iPhone-driven toolchain reference
- `KOKORO-SETUP.md` — Lightweight TTS for HyperFrames
- `VOICEBOX-SETUP.md` — Local voice cloning
- `SETUP-OPENMANUS.md` — Browser automation agent
- `AWESOME-AI-HARDWARE.md` — Hardware reference
- `SCRIPT.md`, `VIDEOS.md` — Asset references
- `README.md` — Primary product overview (STARLIGHTMIX + RHYTHMIX)

---

## Key Contact

**User Email:** jamie.jack.28@hotmail.com

**Current Working Branch:** `claude/claude-md-docs-dh1411`

---

## Last Updated

**2026-06-24** — Comprehensive restructure to reflect Buddy Builder focus, STARLIGHTMIX Studio production, email/monetization infrastructure, and 98-directory ecosystem.
