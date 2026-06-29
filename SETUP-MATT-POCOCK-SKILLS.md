# Matt Pocock's Engineering Skills — Setup & Reference

## Overview

[`mattpocock/skills`](https://github.com/mattpocock/skills) is a collection of
**agent skills for real engineering** — deliberately small, easy to adapt, and
composable. They work with any model and are based on long-standing software
engineering fundamentals (TDD, deep modules, shared/ubiquitous language, tight
feedback loops, small deliberate steps). The pitch is the opposite of
process-heavy frameworks (GSD, BMAD, Spec-Kit): keep control, keep the skills
hackable, make them your own.

They target four common agent failure modes:

1. **The agent didn't do what I want** → align *before* coding with a grilling
   session (`/grill-me`, `/grill-with-docs`).
2. **The agent is too verbose** → build a *shared language* (domain model) so
   code, names, and conversation derive from the same terms (`/grill-with-docs`).
3. **The code doesn't work** → tighten feedback loops: static types, browser
   access, and a red-green-refactor test loop (`/tdd`, `/diagnosing-bugs`).
4. **We built a ball of mud** → care about design every day; rescue entropy with
   `/improve-codebase-architecture` and design deep modules (`codebase-design`).

> ### How this fits the RHYTHMIX repo
> **This is almost certainly the upstream source of a chunk of this repo's
> engineering skills.** The repo already vendors same-named skills —
> `/grill-me`, `/grill-with-docs`, `/tdd`, `/diagnose`, `/to-prd`, `/to-issues`,
> `/triage`, `/prototype`, `/handoff`, `/improve-codebase-architecture` — listed
> under **Engineering skills** in `CLAUDE.md`. Treat `mattpocock/skills` as the
> **canonical upstream** to diff against and refresh from.
>
> **Refresh discipline:** per `CLAUDE.md`, synced skills live in
> `.agents/skills/<name>/` and are symlinked into `.claude/skills/`. Don't
> hand-edit the symlinks — update the upstream source and re-record the hash in
> `skills-lock.json`. The installer below writes into agent skill dirs directly,
> so on this repo prefer pulling specific skills into `.agents/skills/` and
> wiring the symlink, rather than letting the installer scatter copies.
>
> **Now vendored** (pinned to upstream commit `5d78bd0` in `skills-lock.json`):
> `ask-matt`, `codebase-design`, `domain-modeling`, `implement`,
> `resolving-merge-conflicts`, `grilling`, `teach`, `writing-great-skills`,
> `git-guardrails-claude-code`, `migrate-to-shoehorn`, `scaffold-exercises`,
> `setup-pre-commit` — added as real dirs under `.claude/skills/`. The repo's
> `diagnose` skill is the local rename of upstream `diagnosing-bugs`, so that one
> was intentionally not re-vendored. Re-syncing now means *refreshing* against a
> newer upstream commit.

## Quickstart (30-second setup)

```bash
# Run the skills.sh installer — pick the skills + which coding agents to install on.
# Make sure you select /setup-matt-pocock-skills.
npx skills@latest add mattpocock/skills
```

Then run `/setup-matt-pocock-skills` in your agent. It asks:

- which **issue tracker** to use (GitHub, Linear, or local files),
- which **labels** you apply when triaging tickets (`/triage` uses labels),
- where to **save docs** you create.

Run it once per repo before using the other engineering skills.

> **On this repo:** the issue tracker is **GitHub Issues** on
> `wiggjamie9-afk/jamie-wigg`, triage labels are `needs-triage` / `needs-info` /
> `ready-for-agent` / `ready-for-human` / `wontfix`, and domain docs live at
> `CONTEXT.md` + `docs/adr/` (see `docs/agents/`). The repo is already configured
> for these conventions, so `/setup-matt-pocock-skills` would mostly be
> confirming the existing setup.

## Skill reference

Skills split on one axis — **who can invoke them**. *User-invoked* skills are
reachable only when you type them (e.g. `/grill-me`); they orchestrate.
*Model-invoked* skills can be typed or reached for automatically when the task
fits; they hold the reusable discipline. A user-invoked skill may invoke
model-invoked skills, but never another user-invoked one.

### Engineering

**User-invoked**

- `ask-matt` — router: ask which skill/flow fits your situation.
- `grill-with-docs` — grilling session that also builds the project's domain
  model, sharpening terminology and updating `CONTEXT.md` + ADRs inline.
- `triage` — move issues through a state machine of triage roles.
- `improve-codebase-architecture` — scan for "deepening" opportunities, present
  them as a visual HTML report, then grill through whichever one you pick.
- `setup-matt-pocock-skills` — configure a repo for these skills (run once).
- `to-issues` — break a plan/spec/PRD into independently-grabbable issues via
  vertical slices.
- `to-prd` — turn the current conversation into a PRD and publish it (no
  interview — synthesizes what you've discussed).
- `prototype` — build a throwaway prototype (runnable terminal app for
  state/logic questions, or several toggleable UI variations).

**Model-invoked**

- `diagnosing-bugs` — disciplined loop for hard bugs / perf regressions:
  reproduce → minimise → hypothesise → instrument → fix → regression-test.
- `tdd` — red-green-refactor; build features / fix bugs one vertical slice at a
  time.
- `domain-modeling` — actively build and sharpen the domain model; challenge
  terms against the glossary, stress-test with edge cases, update `CONTEXT.md` +
  ADRs inline.
- `codebase-design` — shared discipline/vocabulary for designing deep modules:
  lots of behaviour behind a small interface, at a clean, testable seam.

### Productivity

**User-invoked**

- `grill-me` — get relentlessly interviewed about a plan/design until every
  branch of the decision tree is resolved.
- `handoff` — compact the current conversation into a handoff doc for another
  agent.
- `teach` — teach a skill/concept over multiple sessions, using the current
  directory as a stateful teaching workspace.
- `writing-great-skills` — reference for writing/editing skills well.

**Model-invoked**

- `grilling` — the reusable interview loop behind `grill-me` and
  `grill-with-docs`.

### Misc (kept around, rarely used)

- `git-guardrails-claude-code` — Claude Code hooks to block dangerous git
  commands (`push`, `reset --hard`, `clean`, …) before they execute.
- `migrate-to-shoehorn` — migrate test files from `as` assertions to
  `@total-typescript/shoehorn`.
- `scaffold-exercises` — create exercise directory structures (sections,
  problems, solutions, explainers).
- `setup-pre-commit` — Husky pre-commit hooks with lint-staged, Prettier, type
  checking, and tests.

## Notes

- The upstream **repo README at
  [github.com/mattpocock/skills](https://github.com/mattpocock/skills) is the
  single source of truth** — check it before relying on specifics; this doc is a
  minimal reference snapshot.
- Because the repo already symlinks several of these skills from
  `.agents/skills/`, **diff before pulling a newer version** so you don't clobber
  local adaptations. Update `skills-lock.json` when you re-sync.
