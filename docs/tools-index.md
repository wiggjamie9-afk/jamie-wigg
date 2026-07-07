# Tools & Reference Index

Catalog of every tool, MCP server, setup doc, skill family, and sub-project in this workspace.
Moved out of `CLAUDE.md` to keep per-session context small — **read this file on demand** when you
need details about a specific tool; do not load it speculatively.

## MCP servers — full detail

- **stepfun** (Step 3.7 Flash, script & story generation) → `.claude/mcp/stepfun/server.mjs`. Needs `STEP_API_KEY`, `STEP_BASE_URL` in `.env`. Tools: `flash_script` (RHYTHMIX-aware narration/pitch-deck copy; formats: narration/dialogue/shot-list/pitch-deck), `flash_chat` (long-context story dev, multimodal via `user_images`), `flash_episode_brief` (episode brief → logline + act structure + promo copy). Use reasoning='high' for multi-act briefs, 'low' for quick shot-lists. **For animated TV series / pitch-deck work, start with `flash_episode_brief`, then feed its output into `/rhythmix-site` or `/site-build`.**
- **zyloo** (OpenAI-compatible LLM gateway fronting Claude + other models) → `.claude/mcp/zyloo/server.mjs`. Needs `ZYLOO_API_KEY` (`sk-zy-…`) in `.env`; `ZYLOO_BASE_URL` (default `https://api.zyloo.io/v1`) and `ZYLOO_MODEL` (default `zyloo/claude-haiku-4-5-20251001`) optional. Tools: `zyloo_complete`, `zyloo_chat` (vision via `user_images`), `zyloo_list_models`. See `.claude/mcp/zyloo/README.md`.
- **creative-stack** (Replicate + ElevenLabs: image/video/music/TTS) → `.claude/mcp/creative-stack/`. Copy `.claude/settings.local.json.example` → `.claude/settings.local.json` with `REPLICATE_API_TOKEN` + `ELEVENLABS_API_KEY`. The `replicate` skill picks the right model (FLUX 1.1 Pro / HunyuanVideo / MusicGen defaults).
- **higgsfield** (Soul text-to-image, DOP image-to-video, talking-head) → local binary `higgsfield-mcp` via `pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp`; needs `HIGGSFIELD_API_KEY`/`HIGGSFIELD_SECRET` in `.env`. **In cloud sessions prefer the hosted Higgsfield MCP connector instead** (far more tools, no install). Pair with HyperFrames via the `higgsfield-to-hyperframes` skill.
- **pollinations** (free tier: FLUX, Sana, Nova Reel, Suno v5, Qwen3-TTS) → `npx -y @pollinations/model-context-protocol`, no key. ⚠️ Sandbox egress blocks `*.pollinations.ai` — tools register, runtime is gated.
- **playwright** / **claude-playwright** (browser automation) → `npx -y @playwright/mcp@latest` and `node node_modules/claude-playwright/dist/mcp/server.cjs` (root devDependency; session-start hook installs it). Default `BASE_URL` `http://localhost:8000`.
- **context7** (live library docs) → HTTP `https://mcp.context7.com/mcp`, `CONTEXT7_API_KEY` in `.env`.
- **openmanus** (LLM-driven browser agent: navigate/click/fill/extract/screenshot/search) → `python -m app.mcp.server` from `/tmp/OpenManus`. Install: `bash scripts/setup-openmanus.sh`. Guides: `SETUP-OPENMANUS.md`, `OPENMANUS-MCP-INTEGRATION.md`; configs in `config/openmanus-*.toml`.
- **Supermetrics** (marketing data: Google Ads, Meta, TikTok, GA4, Shopify, 200+ sources) → hosted claude.ai connector, not in `.mcp.json`. See `SETUP-SUPERMETRICS.md`.

## Root reference / setup docs

- `CONTEXT.md` — domain language (Promo, Cut, Narration, Hook)
- `CREATIVE-AI-STACK.md` — iPhone-oriented creative AI toolchain (user has no desktop)
- `KOKORO-SETUP.md` — Kokoro TTS for HyperFrames narration (30+ voices, blending; `uv tool install kokoro-tts`; used by `npx --yes hyperframes@0.4.42 tts`)
- `VOICEBOX-SETUP.md` — local voice cloning (on-device Mac, profile `Jamie`, endpoint `http://127.0.0.1:17493`)
- `SETUP-SUPERMETRICS.md` — Supermetrics hosted MCP (marketing analytics)
- `SETUP-MOVIEPY.md` — MoviePy v2 post-processing for HyperFrames renders (stitch, captions, aspect, GIFs)
- `SETUP-AGENT-TARS.md` — Agent TARS / UI-TARS vision-language GUI agent (click-stream automation; not a pipeline fit)
- `SETUP-HERMES.md` — Hermes Agent CLI with Telegram/Discord gateways (drive renders from phone/cron)
- `SETUP-OPENMANUS.md` / `OPENMANUS-MCP-INTEGRATION.md` — OpenManus browser-agent framework
- `SETUP-SD-WEBUI.md` — Stable Diffusion WebUI (GPU machine only; repo is cloud-first)
- `SETUP-MINIMAX-01.md` — MiniMax-01 foundation models (use hosted API; self-host needs a GPU cluster)
- `SETUP-DEEP-PLAYGROUND.md` — TensorFlow Deep Playground (teaching/demo, optionally vendor to `apps/playground/`)
- `SETUP-FREEBUFF.md` / `SETUP-OPENCODE.md` — alternative terminal coding-agent CLIs (not pipeline tools)
- `SETUP-RUIXEN-UI.md` — Ruixen UI shadcn-compatible components (fits `studio/`, re-skin via tokens)
- `SETUP-PENPOT.md` — Penpot self-hostable design platform (maps to `rhythmix-teaser-60s/DESIGN.md`)
- `SETUP-MATT-POCOCK-SKILLS.md` — `mattpocock/skills` upstream for `/grill-me`, `/tdd`, `/diagnose`, `/to-prd`, `/triage`, etc. Diff before re-syncing; update `skills-lock.json`
- `SETUP-ANTHROPIC-SKILLS.md` — `anthropics/skills` upstream for vendored `docx`/`pdf`/`pptx`/`xlsx`, `skill-creator`, `mcp-builder`, `canvas-design`, `brand-guidelines`, `algorithmic-art`, `webapp-testing`. Prefer the `.agents/skills/` sync over marketplace install
- `SETUP-PALMIER-PRO.md` — Palmier Pro MCP video editor (macOS 26 Apple-Silicon only; unusable on no-desktop setup)
- `MORNING.md` / `MORNING-VOICES.md` — Codex of Reality morning brief
- `AWESOME-AI-HARDWARE.md`, `SCRIPT.md`, `VIDEOS.md` — misc references

## Skill families (details beyond the harness-loaded descriptions)

Skill descriptions auto-load every session — don't re-list them. Structure notes only:

- **Synced skills** — source in `.agents/skills/<name>/`, symlinked into `.claude/skills/<name>`. Edit upstream, re-record hash in `skills-lock.json`. Never edit the symlink side.
- **Local-only skills** — live directly in `.claude/skills/<name>/` (e.g. `rhythmix-author`, `promo-repurpose`, `render-verify`, `deploy-check`, spec/site pipeline skills).
- **Command wrappers** — `.claude/commands/*.md` are thin arg-hint wrappers that invoke same-named skills. Intentional, not duplicates.
- **Hugging Face skills** — `hf-cli`, `huggingface-best`, `huggingface-papers`, `huggingface-datasets` synced from `huggingface/skills`.
- **OpenClaw CLI skills** — install via `bash scripts/openclaw-install.sh` on unrestricted-egress machine (ClawHub blocked in sandbox). Queue: `ai-video-editor-motion-graphics`, `self-improving-agent`, `voice-wake-say`, `voice-ai-voices`, `azure-ai-voicelive-py`, `app-builder`, `deploy-agent`.
- **Knowledge base** — `llm-wiki` skill operates `kb/` (persistent LLM-maintained wiki over immutable `kb/raw/` sources; ingest/query/lint). Schema and conventions: `kb/CLAUDE.md`. Wiki is git-tracked markdown, Obsidian-friendly.
- **Zapier workflows** — `zapier-workflows` skill; dormant until the Zapier MCP is connected.
- **n8n** — `/n8n-workflow-generator` converts workflow breakdowns into import-ready JSON under `automation/<slug>/`; worked examples: `automation/veo3-faceless-content-system/`, `automation/kling-social-pipeline/`.

## Sub-projects (full detail)

### STARLIGHTMIX Studio (`studio/`)
Mobile-first wrapper around the Studio Node CLI: buyers paste their own Replicate token, upload a track, pick a theme, get an AI music video. Not a hosted generator (user's own token pays Replicate) and not a content host (localStorage + IndexedDB only).
Cloudflare Workers in `studio/workers/`: `license/` (license validation at `license.studio.starlightmix.com/api/license`, KV `LICENSE_CACHE`, `wrangler secret put GUMROAD_PRODUCT_ID`) and `replicate-proxy/` (optional CORS proxy). Deploy each with `wrangler deploy` from its directory.
Deploy secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; GitHub Environment `production` with required reviewers.

### Marketing site pages (root `*.html`, live at rhythmixapp.com.au)
`index` (landing), `studio`, `features`, `rhythmix`, `resonance` (RESONANCE PWA), `frequency`, `downloads`, `download`, `dreams-app`, `hum-app`, `hum`, `live-app`, `resonate-app`, `launch`, `launch-section`, `ltx-studio`, `members`, `install`, `rhythmix-preview`, `thumbnail`, `founder`, `privacy`, `terms`, `refunds`, `thank-you`. CNAME: `rhythmixapp.com.au`.

### Apps (`apps/`)
`dreams.html`, `hum.html`, `live.html`, `resonate.html` (concept pages); `roomtone/` (full PWA); `genetic-os/` (browser desktop-environment PWA); `untapped/` (10 concepts: TYMPAN, HERD, AXLE, DOCKET, LULL, PLUMB, RACK, SOLE, SPOT, STACK — each with prototype, landing, brief).

### HerdCheck (`livestock/`)
Offline-first PWA screening for smallholder farmers. Checks: lameness (Sprecher 5-point), mastitis (Canvas heuristics + visual signs), calving predictor (gestation day + behaviour). Key files: `index.html`, `app.js`, `app.css`, `db.js`, `i18n.js`, `scoring.js`, `vision.js`, `sw.js`, `manifest.webmanifest`. Gestation: cattle 283d, buffalo 310d, sheep 147d, goat 150d.

### Reset (`recovery/`) + `recovery-ios/`
iOS-style recovery-tracking PWA for team sport, served at `/recovery/`. `recovery-ios/` is its Capacitor wrapper, built by Codemagic (`codemagic.yaml`: unsigned debug on `mac_mini_m2`, artifacts emailed to wiggjamie9@gmail.com).

### Codex of Reality (`sites/codex-of-reality/`)
Full site + PWA from the site-build pipeline: `home.html` (9-section landing with Coherence Engine demo), `app.html`, `launch/` assets, `sw.js`, `PRIVACY.md`, `TERMS.md`, sitemap/styleguide/wireframes. Quickstart: `MORNING.md`.

### Capacitor for Studio (`capacitor/`)
Wraps `studio/out/` via `www/`. Commands from `capacitor/`: `pnpm build:web`, `pnpm sync:web`, `pnpm build`, `pnpm open:ios`.

### Infra (`infra/`)
`infra/wiki/`: Wiki.js + Postgres behind Caddy via Docker Compose (`cd infra/wiki && docker compose up -d` on a VPS with a domain A-record; Caddy config in `infra/Caddyfile`).

### Dev container (`.devcontainer/`)
`mcr.microsoft.com/devcontainers/javascript-node:20`; `post-create.sh` installs `ffmpeg` + `aubio-tools` and preps the Studio CLI demo (`bash rhythmix-studio/demo.sh`).

### Remotion (`video/`) — dormant
Remotion 4 + React 19 starter, `MyComposition` returns `null`. Do not add Promos (ADR-0001). `npm i && npm run dev` from `video/` for Studio preview.
