# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start (For Claude)

- **ANY graphics work** (video, landing page, social post, poster, thumbnail, ad creative) → read `BRAND-KIT.md` first. It is the single source of truth for palette, typography, layout grammar, motion, and the "outstanding vs generic" test. The `frontend-design`, `canvas-design`, `theme-factory`, `hyperframes`, and `algorithmic-art` skills all anchor here.
- **Make a new RHYTHMIX video** → invoke the `rhythmix-author` skill or run `/rhythmix-new`. The skill enforces an RTCO brief intake, a pre-script critique, and a pre-publish review checklist. Don't re-derive the brand from scratch.
- **Generate a single creative asset (image / video / music / voice)** → run `/dream <description>` — auto-routes to the right modality.
- **Orchestrate a full album/single launch (cover + track + promo + landing section in parallel)** → run `/album-launch <brief>`.
- **Reference for video pipeline** → `rhythmix-overview-60s/` is the canonical 60s landscape example.
- **Video motion spec** → `rhythmix-teaser-60s/DESIGN.md` (motion eases, scene timing — narrower than the brand kit).
- **Cloud-AI tools the user actually uses** → `CREATIVE-AI-STACK.md` (iPhone-driven; user has no desktop).
- **Replicate + ElevenLabs MCP server (image/video/music/voice tools)** → `.claude/mcp/creative-stack/`. Run `npm install` in that folder once and add the `mcpServers` block from its README to wire it up. Requires API tokens.
- **Permission allowlist + session-start health check** → `.claude/settings.json` and `.claude/hooks/session-start.sh`.

## Graphics quality bar

When producing any visual asset, run the **outstanding-vs-generic test** in `BRAND-KIT.md §5` before showing it to the user. If three or more rows fall on the "generic" side, redo rather than ship.

Generic-looking AI output is the default failure mode. The defenses are:
1. A concrete brand kit (✓ `BRAND-KIT.md`)
2. Restricted palette + type stack (no Roboto, no `#3b82f6`)
3. Radial glow on dark canvas instead of linear gradients
4. One highlight color per composition, not three
5. Numbers as the hero, not decoration

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

Skills are consumed by the Claude Code harness via `.claude/skills/`. Most are symlinks pointing into `.agents/skills/`, which is the editable copy. `skills-lock.json` records the upstream `heygen-com/hyperframes` commit hash for each — do **not** hand-edit synced skills; update via the upstream source and re-record the hash.

Available skills:
- `hyperframes`, `hyperframes-cli`, `hyperframes-registry` — HyperFrames HTML video composition workflow.
- `remotion`, `remotion-to-hyperframes` — Remotion authoring + Remotion→HyperFrames porting.
- `website-to-hyperframes` — capture a website into a HyperFrames video.
- `gsap` — GSAP animation reference for HyperFrames compositions.

If the user asks for HTML-based video, captions/subtitles, audio-reactive visuals, scene transitions, TTS, or website→video flows, reach for the HyperFrames skills rather than Remotion.

## RHYTHMIX Landing Page Drafts

`text.txt`, `text 2.txt`, `text 3.txt` are standalone HTML/CSS sections for a RHYTHMIX (AI music) marketing site — hero/stats, features, pricing tiers (including a $149 lifetime deal), creator testimonials, competitor positioning vs Suno/Udio/LANDR, and FAQ. They are not wired into the Remotion build. Treat them as design source for landing pages or as input to `website-to-hyperframes`.

## Graphify Output

`graphify-out/` contains a generated knowledge-graph snapshot of the repo (29 nodes, 23 edges across 5 communities — Remotion setup, RHYTHMIX pages, AI music competitors, pricing, ESLint config). Useful as a navigation aid; regenerated by the graphify tool — don't edit by hand.

## Conventions

- Don't reduce the dependency lockfile churn — keep `video/package-lock.json` in sync with `package.json`.
- Don't commit `node_modules/`, `.remotion/`, or `graphify-out/cache/` (already covered by `.gitignore` / `.graphifyignore`).
- Skill edits go in `.agents/skills/<name>/` (the symlink target), never in the `.claude/skills/` symlink path.
