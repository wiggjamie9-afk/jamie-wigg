# jamie-wigg

A Remotion video project. The renderable code lives in `video/`; the rest of the repo is generated artifacts and source text.

## Repo map

- `video/` — Remotion project (React 19, Tailwind v4, TypeScript)
  - `src/index.ts` — Remotion entry, registers `Root`
  - `src/Root.tsx` — composition registry
  - `src/Composition.tsx` — main video composition
  - `remotion.config.ts` — Remotion build config
- `text.txt`, `text 2.txt`, `text 3.txt` — raw script / source copy
- `graphify-out/` — generated graph artifacts (do not hand-edit)
- `.claude/` — agent configuration (skills, hooks, agents, commands)

## How to work in `video/`

- Run the studio: `cd video && npm run dev`
- Lint + typecheck before committing: `cd video && npm run lint`
- Bundle: `cd video && npm run build`
- Node modules live inside `video/node_modules/` — install from inside that dir.

## Conventions

- Compositions go in `video/src/`, one component per file, PascalCase filenames.
- Prefer Remotion's `<Sequence>`, `interpolate`, and `spring` over manual frame math.
- Tailwind v4 is wired via `@remotion/tailwind-v4`; class strings only — no inline styles unless animating.
- TypeScript is strict; do not introduce `any`.

## When editing Remotion code

The `remotion` skill (`.claude/skills/remotion/`) carries the rule pack. Consult it before adding new compositions, captions, audio, or transitions — it has tested patterns for each.

## Out of scope

- Don't edit `graphify-out/` by hand — it's regenerated.
- Don't commit anything inside `video/node_modules/` or `video/.remotion/` (already ignored).
