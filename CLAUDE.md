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
- **Higgsfield AI MCP server (Soul text-to-image, DOP image-to-video, talking-head, character refs)** → registered in `.mcp.json` as `higgsfield`. Install with `pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp`. Put `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET` in `.env` at the repo root (gitignored). To use it *with* HyperFrames in a single flow, invoke the `higgsfield-to-hyperframes` skill — it owns the prompt → poll → download → wire-in pipeline.
- **Pollinations AI MCP server (free anonymous tier — image, text, audio, TTS, music)** → registered in `.mcp.json` as `pollinations`. Installed globally via `npm install -g @pollinations/model-context-protocol`. No API key required for the free anonymous tier. Models include FLUX, Sana, Nova Reel, Seedream5, Suno v5, Qwen3-TTS. ⚠️ The sandbox egress allowlist blocks `*.pollinations.ai` — to actually call the API, add it to the allowlist or run Claude Code in an environment with unrestricted egress. Tools register fine; only runtime is gated.
- **Browser automation (two MCP servers)** → registered in `.mcp.json` as `playwright` (the base `@playwright/mcp@latest`, no install — runs via `npx -y`) and `claude-playwright` (the smartlabsAT extension that adds session/profile/test management on top of Playwright). The `claude-playwright` server is installed as a devDependency at the repo root — run `npm install` once, then it launches via `node node_modules/claude-playwright/dist/mcp/server.cjs`. Default `BASE_URL` is `http://localhost:8000` (override in `.mcp.json` or via `npx claude-playwright mcp init --base-url <url>`). CLI extras: `npx claude-playwright session save <name>` to capture an authenticated browser session, `... profile create <name> --device mobile` for device emulation, `... test save --name <name>` to record a reusable interaction sequence. Project-local state (sessions, cache, profiles, logs) lives in `.claude-playwright/` (gitignored).
- **Frontend design skill** → `frontend-design` is available as a Claude Code skill (no install needed, no `/plugin install` required in this harness). Invoke it via the Skill tool — or just ask Claude to "build a web component / landing page / dashboard with high design quality" and it'll trigger automatically. Use for distinctive production-grade UI that avoids generic AI aesthetics.
- **Context7 docs MCP** → registered in `.mcp.json` as `context7`, pointing at the HTTP endpoint `https://mcp.context7.com/mcp`. Exposes `resolve-library-id` (library name → Context7 ID) and `query-docs` (Context7 ID + query → current docs). Free anonymous tier works rate-limited; for a free API key put `CONTEXT7_API_KEY` in `.env` (gitignored — see `.env.example`). **Rule:** Always use Context7 when you need library/API documentation, code generation, setup, or configuration steps — without the user having to ask. Prefer Context7 over web search and over training knowledge since training may not reflect recent versions. Not for refactoring, debugging business logic, or general programming questions. If you know the library ID, pass it inline: `use library /vercel/next.js` (skips the resolve step).
- **Hugging Face skills (starter set)** → 4 skills synced from `huggingface/skills` into `.agents/skills/` and symlinked from `.claude/skills/`: `hf-cli` (Hub operations via the `hf` CLI — search models/datasets/spaces, manage repos, run Jobs), `huggingface-best` (find top model for a task using leaderboards/benchmarks), `huggingface-papers` (read HF paper pages + papers API), `huggingface-datasets` (Dataset Viewer API — query/filter/paginate datasets without Python). Tracked in `skills-lock.json` against upstream `huggingface/skills`. To add more from that repo, copy from `skills/<name>/` and append a lock entry. Heavy ML training skills (`huggingface-llm-trainer`, `huggingface-vision-trainer`, `train-sentence-transformers`, `huggingface-trackio`, `huggingface-zerogpu`) were intentionally left out — pull on demand if you actually start training.
- **Zapier workflows skill** → `zapier-workflows` synced from `alexboudreaux/claude-zapier-skill` into `.agents/skills/` and symlinked from `.claude/skills/`. Gives Claude persistent memory for both webhook-triggered multi-step Zaps and Zapier MCP tool preferences (which Zap to fire for which intent, which MCP action covers which app, etc.). To wire up the actual Zapier MCP server, go to https://mcp.zapier.com/mcp/servers, create a new MCP server for Claude Code, enable the tools you want, then add the connection command Zapier gives you to `.mcp.json` (or to your global MCP config). Without the Zapier MCP attached, the skill is dormant — it just knows *what* to do and can't actually do it.
- **OpenClaw CLI skills** → installed via `openclaw skills install <slug>` from ClawHub into OpenClaw's own managed skills directory (typically `~/.openclaw/...` or per-agent workspace), **not** into this repo's `.claude/skills/`. So these don't get committed here. The repo tracks which slugs it expects in `scripts/openclaw-install.sh`; replay the whole queue with `bash scripts/openclaw-install.sh` (or `bash scripts/openclaw-install.sh --global` to install into the shared managed directory) on a machine with unrestricted egress — ClawHub is blocked from the cloud sandbox by the egress allowlist. Current queue: `ai-video-editor-motion-graphics`, `self-improving-agent`, `voice-wake-say`, `voice-ai-voices`. Add new slugs by editing the `SKILLS` array. Discover slugs with `npx -y openclaw skills search <query>` and inspect with `npx -y openclaw skills info <slug>`.
- **Permission allowlist + session-start health check** → `.claude/settings.json` and `.claude/hooks/session-start.sh`.

## Repository Overview

This is a workspace combining a Remotion video starter, HyperFrames-related skills, and HTML/CSS landing-page drafts for **RHYTHMIX** (an AI music platform). Layout:

- `video/` — Remotion 4 + React 19 + Tailwind v4 video project (currently a starter; `MyComposition` returns `null`).
- `text.txt`, `text 2.txt`, `text 3.txt` — RHYTHMIX landing page HTML/CSS fragments (hero, features, pricing, testimonials, FAQ).
- `.agents/skills/` — Source-of-truth skill bundles (hyperframes, hyperframes-cli, hyperframes-registry, remotion-to-hyperframes, website-to-hyperframes, gsap, replicate, higgsfield-to-hyperframes, spec-quick, spec-run, spec-analyze, site-sitemap, site-wireframe, site-styleguide, site-design).
- `specs/` — Spec-driven feature folders. Each `specs/<slug>/` holds `requirements.md` + `design.md` + `tasks.md`. Generated by `/spec-quick`, executed by `/spec-run`. See `specs/README.md`.
- `sites/` — Site-build pipeline output. Each `sites/<slug>/` holds `sitemap.md` + `wireframes/*.md` + `styleguide.md` + per-page `*.html`. Generated by the four-stage site build (`/site-sitemap` → `/site-wireframe` → `/site-styleguide` → `/site-design`) or the `/site-build` orchestrator. See `sites/README.md`.
- `.claude/skills/` — Mostly symlinks into `.agents/skills/` plus a local `remotion` skill.
- `skills-lock.json` — Tracks upstream commit hashes for skills sourced from `heygen-com/hyperframes`.
- `graphify-out/` — Generated knowledge-graph artifacts (`graph.html`, `graph.json`, `GRAPH_REPORT.md`). Regenerated output, not hand-edited.
- `.graphifyignore` — Excludes `node_modules/`, `.git/`, `video/node_modules/`, `video/.remotion/`, and `graphify-out/` itself.

## Remotion Video Project (`video/`)

### Stack
- Remotion `4.0.454` with `@remotion/cli`, `@remotion/tailwind-v4`
- React `19.2.3`, TypeScript `5.9.3`
- Tailwind v4 enabled via `Config.overrideWebpackConfig(enableTailwind)` in `remotion.config.ts`

### Commands (run from `video/`)
```bash
npm i                    # install
npm run dev              # remotion studio (preview)
npm run build            # remotion bundle
npm run lint             # eslint src && tsc
npx remotion render      # render video
npx remotion upgrade     # upgrade remotion
```

### Entry points
- `video/src/index.ts` — calls `registerRoot(RemotionRoot)`.
- `video/src/Root.tsx` — registers a single `Composition` with id `MyComp`, 60 frames @ 30 fps, 1280×720.
- `video/src/Composition.tsx` — `MyComposition` returns `null` (placeholder).
- `video/src/index.css` — Tailwind entry.
- `video/remotion.config.ts` — sets jpeg image format, overwrite output, enables Tailwind via webpack override.

When extending: add new `<Composition>` registrations in `Root.tsx` and implement components in `src/`. Use Remotion hooks (`useCurrentFrame`, `interpolate`, `spring`, `Sequence`, `AbsoluteFill`) directly — see the `remotion` skill in `.claude/skills/remotion/`.

## Skills

Skills live in two shapes in this repo:

- **Synced / hand-written** — source in `.agents/skills/<name>/`, symlinked into `.claude/skills/<name>`. `skills-lock.json` records upstream commit hashes for the synced ones from `heygen-com/hyperframes`. Don't hand-edit synced skills; update via upstream and re-record the hash.
- **Installed via the `skills` CLI** — copied directly into `.claude/skills/<name>/` by `npx skills add ...`. Tracked in `skills-lock.json` with `source` = the GitHub slug. Currently the 14 `mattpocock/skills` engineering + productivity skills.

Pipeline skills:
- `hyperframes`, `hyperframes-cli`, `hyperframes-registry` — HyperFrames HTML video composition workflow.
- `remotion`, `remotion-to-hyperframes` — Remotion authoring + Remotion→HyperFrames porting.
- `website-to-hyperframes` — capture a website into a HyperFrames video.
- `higgsfield-to-hyperframes` — Higgsfield MCP → HyperFrames composition bridge. Owns prompt → poll → download → wire-in. Reach for it when a HyperFrames scene needs photorealistic stills or short AI-animated clips.
- `replicate` — Replicate MCP tool/model picker for image / video / music assets. Reach for it when a Cut needs an `<img>`, `<video>`, or `<audio>` slot filled (defaults: FLUX 1.1 Pro / HunyuanVideo / MusicGen).
- `gsap` — GSAP animation reference for HyperFrames compositions.

Engineering skills (Matt Pocock bundle — invoked as slash commands):
- `/grill-with-docs` — interview a plan; updates `CONTEXT.md` + `docs/adr/` inline.
- `/diagnose` — disciplined bug/perf-regression loop.
- `/tdd` — red-green-refactor for a feature or fix.
- `/to-prd`, `/to-issues`, `/triage` — chat → PRD → issues → triage workflow on GitHub.
- `/spec-quick`, `/spec-analyze`, `/spec-run` — spec-driven flow: generate `specs/<slug>/{requirements,design,tasks}.md` in one pass, analyze for ambiguity/contradictions, then execute tasks in parallel waves of isolated `Agent` calls. `/rhythmix-spec` is the RHYTHMIX-aware wrapper for multi-video campaigns.
- `/site-build` — four-stage site build pipeline (sitemap → wireframe → styleguide → design) with parallel per-page fan-out in stages 2 + 4. `/site-sitemap`, `/site-wireframe`, `/site-styleguide`, `/site-design` run individual stages. `/rhythmix-site` is the RHYTHMIX-aware wrapper that locks the styleguide to `rhythmix-teaser-60s/DESIGN.md`.
- `/improve-codebase-architecture`, `/zoom-out` — refactor/navigation aids.
- `/prototype`, `/grill-me`, `/handoff`, `/caveman`, `/write-a-skill` — productivity.

If the user asks for HTML-based video, captions/subtitles, audio-reactive visuals, scene transitions, TTS, or website→video flows, reach for the HyperFrames skills rather than Remotion.

## RHYTHMIX Landing Page Drafts

`text.txt`, `text 2.txt`, `text 3.txt` are standalone HTML/CSS sections for a RHYTHMIX (AI music) marketing site — hero/stats, features, pricing tiers (including a $149 lifetime deal), creator testimonials, competitor positioning vs Suno/Udio/LANDR, and FAQ. They are not wired into the Remotion build. Treat them as design source for landing pages or as input to `website-to-hyperframes`.

## Graphify Output

`graphify-out/` contains a generated knowledge-graph snapshot of the repo (29 nodes, 23 edges across 5 communities — Remotion setup, RHYTHMIX pages, AI music competitors, pricing, ESLint config). Useful as a navigation aid; regenerated by the graphify tool — don't edit by hand.

## Conventions

- Don't reduce the dependency lockfile churn — keep `video/package-lock.json` in sync with `package.json`.
- Don't commit `node_modules/`, `.remotion/`, or `graphify-out/cache/` (already covered by `.gitignore` / `.graphifyignore`).
- Skill edits go in `.agents/skills/<name>/` (the symlink target), never in the `.claude/skills/` symlink path.

## Agent skills

### Issue tracker

GitHub Issues on `wiggjamie9-afk/jamie-wigg` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
