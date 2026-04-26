# CLAUDE.md

This file is read automatically by Claude Code at the start of every session.
It's the Claude Code equivalent of "Set Global Instructions" in the Cowork tab.

## How to work in this repo

**1. Read first, act second.**
Before making non-trivial changes, read the relevant files. Don't guess at file
contents or APIs. Use Read, Grep, and the Explore agent to ground every claim.

**2. Show a plan before destructive or large changes.**
For anything that touches more than ~3 files, deletes work, changes
infrastructure, or is hard to reverse, write the plan first and ask for
approval. For small, reversible edits, just do them.

**3. Use AskUserQuestion when intent is ambiguous.**
Don't invent answers to product questions. If a request can be interpreted
multiple ways, ask using the AskUserQuestion tool and offer 2-4 concrete
options. Prefer asking once with a good question over guessing wrong twice.

**4. Never delete without explicit approval.**
This includes: removing files, dropping commits, force-pushing, `git reset
--hard`, or removing dependencies. Investigate unfamiliar files before
overwriting — they may be in-progress work.

**5. Default to the user's branch.**
This repo's working branch is `claude/install-claude-mem-CkCkZ`. Commit and
push there unless told otherwise. Never push to `main`.

**6. Honest engineering, not theatre.**
Don't add backup logic, fallbacks, or validation for situations that can't
happen. Don't add comments that just restate the code. Don't claim a feature
works without testing it. If a build or test fails, fix the root cause —
never bypass with `--no-verify` or by deleting the failing test.

## Context files

User context lives in `context/` and should be read at the start of any
substantial task:

- `context/about-me.md` — who the user is, what they're building, what success looks like
- `context/my-voice.md` — tone of voice for any content drafted on the user's behalf
- `context/my-rules.md` — hard rules (do / don't) for this project

If those files are stubs, ask the user to fill them out before drafting
anything in their voice.

## Project structure

```
.
├── src/                bot: trend aggregator + AI drafter + Reddit publisher
├── web/                Pulse: handcrafted Next.js + Tailwind landing page
├── context/            personal context files (read these first)
├── PROJECTS/           project briefs, ideas, work in progress
├── TEMPLATES/          reusable prompts, post templates, design tokens
├── OUTPUTS/            generated artifacts worth keeping (drafts, exports)
└── data/               SQLite logs (gitignored)
```

## Tech in this repo

- **Bot**: TypeScript ES modules, Node 22, `better-sqlite3`, Anthropic SDK.
  Entry: `src/index.ts`. Built with `npm run build`. Run modes: `dry-run`,
  `live`, `loop`, `trends-only`.
- **Site**: Next.js 16 (App Router) + Tailwind 3 + Framer Motion. Entry:
  `web/app/page.tsx`. Build: `cd web && npx next build`. Deploy: Vercel
  (root directory `web`).
- **Branding**: single source of truth at `web/lib/brand.ts`. Rename "Pulse"
  there to update everywhere on the site.

## Common tasks

- **Add a new trend source** → new file in `src/trends/<name>.ts` exporting
  `fetch<Name>Trending()`, then register it in `src/trends/aggregate.ts`.
- **Add a new publishing platform** → new file in `src/post/<name>.ts`
  with the same shape as `src/post/reddit.ts`. Add a switch in `src/index.ts`.
- **Change the site's section order** → reorder imports in
  `web/app/page.tsx`.
- **Change brand copy** → edit `web/lib/brand.ts`.

## What I won't do without asking

- Push to `main`, force-push, or delete branches.
- Post to social media on the user's behalf without seeing the draft.
- Add `--no-verify` or skip pre-commit hooks.
- Pull in heavy dependencies (>5 MB) without flagging them.
- Make sweeping refactors when only one fix was requested.
