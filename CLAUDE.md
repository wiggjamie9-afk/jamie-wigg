# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start (For Claude)

- **Make a new RHYTHMIX video** → invoke the `rhythmix-author` skill or run `/rhythmix-new`. Don't re-derive the brand or scene structure from scratch — the skill already has it.
- **Native iOS/Android app** → `mobile/` (Expo + Expo Router + EAS Build). Hybrid shell: WebView loads `rhythmixapp.com.au`, with native Library / Settings tabs. Bundle ID `com.rhythmix.app`. Build via `eas build` (cloud, no Mac required). See `mobile/README.md`.
- **Generate a single creative asset (image / video / music / voice)** → run `/dream <description>` — auto-routes to the right modality.
- **Orchestrate a full album/single launch (cover + track + promo + landing section in parallel)** → run `/album-launch <brief>`.
- **Reference for video pipeline** → `rhythmix-overview-60s/` is the canonical 60s landscape example.
- **Brand identity** → `rhythmix-teaser-60s/DESIGN.md` (palette, typography, motion eases).
- **Cloud-AI tools the user actually uses** → `CREATIVE-AI-STACK.md` (iPhone-driven; user has no desktop).
- **Replicate + ElevenLabs MCP server (image/video/music/voice tools)** → `.claude/mcp/creative-stack/`. Deps installed; registered in `.mcp.json`. To use, copy `.claude/settings.local.json.example` → `.claude/settings.local.json` and fill in `REPLICATE_API_TOKEN` + `ELEVENLABS_API_KEY`. The `replicate` skill picks the right tool/model for image, video, or music assets in this repo's style.
- **Domain language + decisions** → `CONTEXT.md` (Promo, Cut, Narration, Hook) and `docs/adr/` (current: ADR-0001 HyperFrames over Remotion). Read these before reasoning about the pipeline — they prevent re-inventing terms or "fixing" the dormant Remotion setup in `video/`.
- **Higgsfield AI MCP server (Soul text-to-image, DOP image-to-video, talking-head, character refs)** → registered in `.mcp.json` as `higgsfield`. Install with `pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp`. Put `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET` in `.env` at the repo root (gitignored). To use it *with* HyperFrames in a single flow, invoke the `higgsfield-to-hyperframes` skill — it owns the prompt → poll → download → wire-in pipeline.
- **Pollinations AI MCP server (free anonymous tier — image, text, audio, TTS, music)** → registered in `.mcp.json` as `pollinations`. Installed globally via `npm install -g @pollinations/model-context-protocol`. No API key required for the free anonymous tier. Models include FLUX, Sana, Nova Reel, Seedream5, Suno v5, Qwen3-TTS. ⚠️ The sandbox egress allowlist blocks `*.pollinations.ai` — to actually call the API, add it to the allowlist or run Claude Code in an environment with unrestricted egress. Tools register fine; only runtime is gated.
- **Permission allowlist + session-start health check** → `.claude/settings.json` and `.claude/hooks/session-start.sh`.

## Repository Overview

This is a workspace combining a Remotion video starter, HyperFrames-related skills, and HTML/CSS landing-page drafts for **RHYTHMIX** (an AI music platform). Layout:

- `video/` — Remotion 4 + React 19 + Tailwind v4 video project (currently a starter; `MyComposition` returns `null`).
- `text.txt`, `text 2.txt`, `text 3.txt` — RHYTHMIX landing page HTML/CSS fragments (hero, features, pricing, testimonials, FAQ).
- `.agents/skills/` — Source-of-truth skill bundles (hyperframes, hyperframes-cli, hyperframes-registry, remotion-to-hyperframes, website-to-hyperframes, gsap).
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
