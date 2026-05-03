# jamie-wigg

Sandbox repo for video work + a custom Claude Code skill ecosystem.

## What lives here

- `video/` — Remotion 4 video project (React 19 + Tailwind v4). Standalone npm project; commands run from inside `video/`.
- `.agents/skills/` — Source for 7 custom skills (hyperframes, hyperframes-cli, hyperframes-registry, gsap, remotion, remotion-to-hyperframes, website-to-hyperframes). This is the canonical copy.
- `~/.claude/skills/` — Installed copy of the same skills, tracked by `skills-lock.json` at the repo root. Installed from `heygen-com/hyperframes` on GitHub.
- `.claude/` — Project-level Claude Code config: this file, project skills, hooks, agents, plugin manifest.
- `graphify-out/` — Generated knowledge graph (`graph.html`, `graph.json`, etc). Build artifact — do not edit by hand.
- `text.txt`, `text 2.txt`, `text 3.txt` — Scratch HTML/CSS fragments. Not part of any build.

## Commands

Run from `video/`:
- `npm run dev` — Remotion studio (preview)
- `npm run lint` — `eslint src && tsc` (ALWAYS run after editing `.tsx` in `video/src/`)
- `npm run build` — bundle
- `npx remotion render` — render to mp4

Skill maintenance (run from repo root):
- `skills-lock.json` is the source of truth. If you edit a skill in `.agents/skills/`, the lock hash will drift — that's expected for local edits, but real upstream sync should go through the skill installer.

## Conventions

- Develop on the branch named in the session prompt (e.g. `claude/new-session-XXXXX`). Never push to `main` directly.
- Never commit `node_modules/`, `video/.remotion/`, or anything inside `graphify-out/cache/`.
- Don't touch `text*.txt` unless asked — they're scratch.
- For any video composition work, the `hyperframes` skill auto-loads. It enforces a Visual Identity Gate — don't write composition HTML without a `DESIGN.md` or named style.

## Known gotchas

- `video/` has its own `package.json` and `node_modules/`. Running npm at the repo root won't work.
- The global `~/.claude/stop-hook-git-check.sh` will block session end if anything is uncommitted or unpushed.
- `.graphifyignore` excludes `node_modules/`, `.git/`, `video/node_modules/`, `video/.remotion/`, `graphify-out/`.
