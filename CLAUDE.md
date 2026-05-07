# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start (For Claude)

- **Make a new RHYTHMIX video** → invoke the `rhythmix-author` skill or run `/rhythmix-new`. Don't re-derive the brand or scene structure from scratch — the skill already has it.
- **Generate a single creative asset (image / video / music / voice)** → run `/dream <description>` — auto-routes to the right modality.
- **Orchestrate a full album/single launch (cover + track + promo + landing section in parallel)** → run `/album-launch <brief>`.
- **Deep multi-agent analysis of anything** → run `/analyze <topic>`. Fans out to 17 specialist sub-brains in parallel (critic, devil's-advocate, planner, strategist, financial, security, technical, creative, …) and writes the synthesis back to the brain MCP for next time.
- **Store / search the second brain** → `/remember <fact>`, `/recall <query>`, `/brain` (stats / recent / decay / prune / export).
- **Reference for video pipeline** → `rhythmix-overview-60s/` is the canonical 60s landscape example.
- **Brand identity** → `rhythmix-teaser-60s/DESIGN.md` (palette, typography, motion eases).
- **Cloud-AI tools the user actually uses** → `CREATIVE-AI-STACK.md` (iPhone-driven; user has no desktop).
- **Replicate + ElevenLabs MCP server (image/video/music/voice tools)** → `.claude/mcp/creative-stack/`. Run `npm install` in that folder once and add the `mcpServers` block from its README to wire it up. Requires API tokens.
- **Brain MCP server (persistent memory + organic decay + relationship graph)** → `.claude/mcp/brain/`. SQLite-backed, no API keys. Session-start hook auto-installs deps. DB lives at `.claude/brain.db` (gitignored).
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

Skills are consumed by the Claude Code harness via `.claude/skills/`. Most are symlinks pointing into `.agents/skills/`, which is the editable copy. `skills-lock.json` records the upstream `heygen-com/hyperframes` commit hash for each — do **not** hand-edit synced skills; update via the upstream source and re-record the hash.

Available skills:
- `hyperframes`, `hyperframes-cli`, `hyperframes-registry` — HyperFrames HTML video composition workflow.
- `remotion`, `remotion-to-hyperframes` — Remotion authoring + Remotion→HyperFrames porting.
- `website-to-hyperframes` — capture a website into a HyperFrames video.
- `gsap` — GSAP animation reference for HyperFrames compositions.

If the user asks for HTML-based video, captions/subtitles, audio-reactive visuals, scene transitions, TTS, or website→video flows, reach for the HyperFrames skills rather than Remotion.

## RHYTHMIX Landing Page Drafts

`text.txt`, `text 2.txt`, `text 3.txt` are standalone HTML/CSS sections for a RHYTHMIX (AI music) marketing site — hero/stats, features, pricing tiers (including a $149 lifetime deal), creator testimonials, competitor positioning vs Suno/Udio/LANDR, and FAQ. They are not wired into the Remotion build. Treat them as design source for landing pages or as input to `website-to-hyperframes`.

## Second Brain (`/analyze`, `/remember`, `/recall`, `/brain`)

A persistent SQLite-backed memory plus a fleet of 17 specialist sub-agents that fan out in parallel for deep analysis.

### Architecture

- **MCP server** at `.claude/mcp/brain/` — SQLite (`better-sqlite3`) with FTS5 over content+tags, a typed/weighted relationship graph, and organic time-decay (default half-life 30 days). Tools: `brain_remember`, `brain_recall`, `brain_relate`, `brain_neighbours`, `brain_episodes`, `brain_stats`, `brain_decay`, `brain_prune`, `brain_forget`, `brain_export`. Storage: `.claude/brain.db` (gitignored).
- **Sub-agents** at `.claude/agents/brain-*.md` — each is a focused analyzer with a sharp angle: `critic`, `devils-advocate`, `summarizer`, `pattern-finder`, `fact-checker`, `decision-framer`, `planner`, `researcher`, `emotional`, `financial`, `security`, `technical`, `creative`, `historian` (queries the brain for prior context), `systems-thinker`, `strategist`, `simplifier`. 17 total.
- **Slash commands** at `.claude/commands/`:
  - `/analyze <topic>` — historian first → 16 specialists in parallel → synthesis → memory write-back with relationships.
  - `/remember <fact>` — auto-classifies kind + tags, stores via `brain_remember`.
  - `/recall <query>` — FTS recall, sorted by effective strength (reads reinforce).
  - `/brain [stats|recent|decay|prune|export]` — inspection and maintenance.

### Organic memory model

- Every memory has `strength` (0–2) and `last_accessed`.
- Reads reinforce: `strength = min(2, strength + 0.1)`, `last_accessed = now`, `access_count++`.
- Effective strength = `strength × 0.5^(Δt / half_life_days)`.
- `brain_decay` commits decayed values to disk; `brain_prune` removes the fossils (default threshold 0.05).

### Write-once conventions

- Don't hand-edit `.claude/brain.db` — use the MCP tools.
- Brain `forget` and `prune` are NOT in the auto-allowlist; they prompt every time on purpose.
- The brain MCP is enabled via `.mcp.json` and `.claude/settings.json#enabledMcpjsonServers`. Session-start auto-installs deps.

## Graphify Output

`graphify-out/` contains a generated knowledge-graph snapshot of the repo (29 nodes, 23 edges across 5 communities — Remotion setup, RHYTHMIX pages, AI music competitors, pricing, ESLint config). Useful as a navigation aid; regenerated by the graphify tool — don't edit by hand.

## Conventions

- Don't reduce the dependency lockfile churn — keep `video/package-lock.json` in sync with `package.json`.
- Don't commit `node_modules/`, `.remotion/`, or `graphify-out/cache/` (already covered by `.gitignore` / `.graphifyignore`).
- Skill edits go in `.agents/skills/<name>/` (the symlink target), never in the `.claude/skills/` symlink path.
