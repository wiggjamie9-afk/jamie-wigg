# Impeccable — Setup & Reference

## Overview

**Impeccable** is a design-quality toolkit for AI coding agents: **1 skill, 23
commands, a live browser-iteration mode, and 44 deterministic detector rules** for
catching AI-generated frontend "slop." It started from Anthropic's
`frontend-design` skill and extends it with a shared design vocabulary you use
with the agent (`polish`, `audit`, `critique`, `distill`, `animate`, `bolder`,
`quieter`, …) plus a no-LLM CLI/hook that flags the usual tells — Inter
everywhere, purple→blue gradients, cards nested in cards, gray text on colored
backgrounds, bounce easing. Apache-2.0. Full docs: <https://impeccable.style>.

> ### How this fits the RHYTHMIX repo
> **Directly relevant** — this repo already leans on `frontend-design` and has a
> lot of UI surface: `studio/` (Next 15 / React 19 / Tailwind v4), the root
> marketing site, the `sites/<slug>/` site-build pipeline output, `apps/`, and the
> RHYTHMIX brand system in `rhythmix-teaser-60s/DESIGN.md`. Impeccable's
> deterministic detector (`npx impeccable detect`) is a useful CI-style gate over
> generated pages, and its `/impeccable init` writes `PRODUCT.md` / `DESIGN.md`
> design context that the brand work here could lock to the existing DESIGN.md.
>
> **Caveat:** it's a *parallel* design skill to the repo's existing
> `frontend-design`. It installs into the harness (`.claude/skills/impeccable/`)
> and adds a design hook. This doc is the install/reference; it does **not**
> install Impeccable into this repo's `.claude/` — run the installer below on the
> machine where you want it.

## Install (recommended: CLI installer)

From the project root:

```bash
npx impeccable install      # detects ~/.claude, ~/.codex, .cursor, etc.; pick project or global
/impeccable init            # run inside your AI tool: writes PRODUCT.md (+ optional DESIGN.md)
```

Non-interactive flags for scripts:

```bash
npx impeccable install --providers=claude,codex,cursor --scope=project   # or --scope=global
npx impeccable update                                                    # refresh an existing install
```

On Claude Code, Cursor, and Codex the installer also drops a provider-native
**design hook**. **Codex** users must then open `/hooks` and approve the project
hook (Codex tracks trust by hook definition, so hook-changing updates re-prompt).

### Git submodule (vendored, for teams)

```bash
git submodule add https://github.com/pbakaus/impeccable .impeccable
npx impeccable link --source=.impeccable --providers=claude,cursor
git submodule update --remote .impeccable      # to update later, then re-run link
```

`link` wires individual skill folders from `.impeccable/dist/universal/` and
leaves existing real skill directories untouched unless you pass `--force`.

## The commands

All run through the single `/impeccable <command> <target>` skill (type
`/impeccable` alone for the list). Highlights:

| Command | What it does |
|---|---|
| `init` | One-time setup: design context → `PRODUCT.md` / `DESIGN.md`, configure live mode |
| `craft` / `shape` | Full shape-then-build flow / plan UX before code |
| `critique` / `audit` | UX review (hierarchy, clarity) / technical checks (a11y, perf, responsive) |
| `polish` / `distill` | Final design-system pass / strip to essence |
| `bolder` / `quieter` | Amplify a boring design / tone down an overcooked one |
| `animate` / `delight` / `overdrive` | Purposeful motion / moments of joy / extraordinary effects |
| `colorize` / `typeset` / `layout` | Strategic color / font hierarchy / spacing & rhythm |
| `harden` / `onboard` / `clarify` | Edge cases & i18n / first-run & empty states / fix UX copy |
| `adapt` / `optimize` / `document` / `extract` / `live` | Device adapt / perf / generate DESIGN.md / pull tokens / browser variant mode |

Pin a frequent one as a standalone shortcut: `/impeccable pin audit` → `/audit`.

## Standalone detector CLI (no AI harness needed)

```bash
npx impeccable detect src/                  # scan a directory
npx impeccable detect index.html            # scan an HTML file
npx impeccable detect https://example.com   # scan a URL (Puppeteer)
npx impeccable detect --json .              # CI-friendly JSON
npx impeccable detect --no-config src/      # raw scan, ignore project config
```

44 deterministic rules across AI-slop tells (side-tab borders, purple gradients,
bounce easing, dark glows) and general quality (line length, cramped padding,
small touch targets, skipped headings). Per-file waiver via an inline comment:
`<!-- impeccable-disable overused-font: brand doc -->`. Manage ignores with
`npx impeccable ignores add-file|add-value`.

## Keep `.impeccable/` mostly out of git

Impeccable writes ephemeral working files (screenshots, live-mode state, caches)
under `.impeccable/`. Add the project's documented `# impeccable-ignore-start …
# impeccable-ignore-end` block to `.gitignore`. **Keep tracked** (shared
artifacts): `.impeccable/config.json`, `.impeccable/live/config.json`,
`.impeccable/design.json`, `.impeccable/critique/*.md`. Already-committed
ephemeral files: `git rm --cached <path>`.

## Notes

- Supported tools: Cursor, Claude Code, GitHub Copilot, Gemini CLI, Codex CLI,
  OpenCode, Pi, Kiro, Trae, Rovo Dev, Qoder. Reload/restart the harness after install.
- Upstream docs are the source of truth: detector → impeccable.style/docs/detector,
  hooks → impeccable.style/docs/hooks. This is a minimal install/reference snapshot.
- Repo, releases, and CLI: <https://github.com/pbakaus/impeccable> /
  `impeccable` on npm.
