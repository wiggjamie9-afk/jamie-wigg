# Global CLAUDE.md — Jamie (jamie.jack.28@hotmail.com)

Personal, project-agnostic preferences. Loads in every session. Anything a
specific repo's own `CLAUDE.md` says **overrides** this file for that repo.

## How I like you to work

- Be direct. When you have enough to act, act — don't narrate options you
  won't take or re-ask what I've already answered.
- Match the surrounding code/docs: same style, naming, and comment density.
- Report honestly. If tests fail, say so with the output. If you skipped a
  step, say that. Don't claim "done" for something you didn't verify.
- Confirm before hard-to-reverse or outward-facing actions (deploys, pushes to
  shared branches, deletes, anything published externally). Approval in one
  place isn't standing approval everywhere.

## Token frugality (applies everywhere)

- Read only the file sections you need; prefer Grep/Glob over opening whole
  files. Don't re-read a file you just wrote — the edit tool already confirmed it.
- Don't re-verify what a tool result already told you.
- Skill names + descriptions auto-load each session — never re-list them.
- Fan out mechanical work (reads, greps, config edits, lockfile checks,
  formatting, simple git ops) to **Haiku** subagents. Keep **Sonnet** (or the
  default) for judgment: writing code, specs, copy, debugging, design calls.
  Never use Haiku for images/screenshots/UI review — it's text-only.

## Skills first

If a skill matches the task, invoke it **before** doing the work by hand —
skills encode framework-specific patterns that generic knowledge misses.
Never invent a skill name; only use ones that are actually listed.

## Verify before "done"

For any non-trivial change, exercise the real thing — drive the affected flow,
run the build/tests, don't just eyeball the diff. State plainly what you ran
and what happened.

## Git discipline

- Work on a feature branch, never commit straight to `main`/default unless told.
- Clear, descriptive commit messages. **Never** open a PR unless I ask.
- Beware backticks in `-m "…"` shell strings — they trigger command
  substitution and silently mangle the message. Use single quotes or a heredoc.
- Keep lockfiles in sync wherever a dependency changes.

## HyperFrames video work (my most common domain)

I do a lot of HTML-based video with **HyperFrames** (never Remotion). When
touching any `.html` composition:

1. Invoke the `hyperframes` skill (or `hyperframes-cli`, `gsap`, etc.) first.
2. Every timed element needs `data-start`, `data-duration`, `data-track-index`
   **and** `class="clip"` (the framework uses `clip` for visibility control).
3. Timelines must be paused and registered:
   `window.__timelines["<id>"] = gsap.timeline({ paused: true });`
4. Video muted + a separate `<audio>` element for the track.
5. Sub-compositions via `data-composition-src="compositions/file.html"`.
6. **Deterministic only** — no `Date.now()`, no `Math.random()`, no network fetches.
7. Always run the project's check (`npm run check` / `npx hyperframes lint`)
   after edits and fix every error before calling it finished.

## Creative / content defaults

- Prefer free/local tooling when it does the job (free LLM tiers for cheap
  tasks, Kokoro/Voicebox for TTS) before reaching for paid APIs.
- I can't clone proprietary models or specific commercial voices — build
  *original* styles/presets or clone *my own* voice instead.
