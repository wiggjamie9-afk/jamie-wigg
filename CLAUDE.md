# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a multi-purpose workspace, not a single application:

- `video/` — a Remotion 4 video project (React 19 + Tailwind v4). All build/dev/lint commands live here.
- `text.txt`, `text 2.txt`, `text 3.txt` — standalone HTML/CSS marketing landing-page source for the "RHYTHMIX" AI music product (hero/stats, features, pricing, testimonials, FAQ). These are not imported by `video/`; treat them as static design artifacts.
- `.agents/skills/` — vendored HyperFrames skills (gsap, hyperframes, hyperframes-cli, hyperframes-registry, remotion-to-hyperframes, website-to-hyperframes). Pinned by `skills-lock.json` (source: `heygen-com/hyperframes` on GitHub).
- `.claude/skills/` — symlinks into `.agents/skills/` so the same skills are picked up by Claude Code.
- `graphify-out/` — generated knowledge-graph artifacts (HTML/JSON/MD report). Output only; do not hand-edit. `.graphifyignore` controls what graphify scans.

## Commands

All commands run from `video/`:

```bash
cd video
npm i                  # install
npm run dev            # Remotion Studio (preview) on the default port
npm run build          # remotion bundle
npm run lint           # eslint src && tsc  (lint + typecheck)
npx remotion render    # render a video to disk
npx remotion upgrade   # upgrade Remotion + related packages together
```

There is no test runner configured.

## Architecture notes for `video/`

Remotion entrypoint chain (don't break this wiring):

1. `src/index.ts` calls `registerRoot(RemotionRoot)`.
2. `src/Root.tsx` declares one `<Composition id="MyComp" component={MyComposition} durationInFrames={60} fps={30} width={1280} height={720} />`.
3. `src/Composition.tsx` exports `MyComposition` (currently returns `null` — this is the scaffold to build on).
4. `src/index.css` is imported from `Root.tsx`; Tailwind v4 is enabled via `remotion.config.ts` using `@remotion/tailwind-v4`'s `enableTailwind` webpack override.

`remotion.config.ts` also sets `setVideoImageFormat("jpeg")` and `setOverwriteOutput(true)`. Per the file's own note, this config is only honored by the CLI — Node.js render APIs need options passed directly.

`tsconfig.json` excludes `remotion.config.ts` from compilation, has `noUnusedLocals: true`, and only includes `lib: ["es2015"]` despite `target: ES2018` — newer DOM/ES libs come in via `@types/web`.

## Skills

When working on video composition or porting from Remotion to HTML, the locally-vendored skills (`hyperframes`, `remotion-to-hyperframes`, `gsap`, etc.) are the source of truth — prefer them over general knowledge. They are version-pinned in `skills-lock.json`; if a skill needs updating, update the lockfile hash too.
