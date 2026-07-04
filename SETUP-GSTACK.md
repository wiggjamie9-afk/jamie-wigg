# SETUP-GSTACK.md — Garry Tan's gstack (Claude Code "engineering team" skill pack)

**gstack** turns Claude Code into a virtual engineering team: ~23 role-based slash-command
skills that run a full sprint — *think → plan → build → review → test → ship → reflect* —
plus a real Chromium browser, a security stack, and persistent memory (GBrain). MIT,
free, by Garry Tan (YC). Repo: <https://github.com/garrytan/gstack>.

> **Status in this repo:** documented + registered. **Not auto-wired** — see "The
> team-mode decision" below, which needs a human call because it edits `CLAUDE.md` and can
> gate the repo. Verified from the sandbox: repo clones cleanly, Bun 1.3.11 + Node 22 are
> present, 59 `SKILL.md` files, ~69 MB.

## What it is (the sprint)

| Stage | Representative skills |
|---|---|
| **Think** | `/office-hours` (6 forcing questions), `/plan-ceo-review` |
| **Plan** | `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review`, `/autoplan`, `/spec` |
| **Build** | `/design-shotgun` → `/design-html`, `/design-consultation` |
| **Review** | `/review` (staff eng), `/codex` (2nd-opinion via OpenAI), `/cso` (OWASP+STRIDE) |
| **Test** | `/qa`, `/qa-only`, `/browse`, `/benchmark`, iOS: `/ios-qa` et al. |
| **Ship** | `/ship`, `/land-and-deploy`, `/canary`, `/document-release` |
| **Reflect** | `/retro`, `/learn`, `/investigate` |
| **Safety** | `/careful`, `/freeze`, `/guard`, `/unfreeze` |

Power features: GStack Browser (stealth Chromium + sidebar agent), `/pair-agent`
(cross-vendor agents share one browser), prompt-injection defense (local ML classifier),
Conductor for 10–15 parallel sprints, GBrain persistent memory.

## Install — per machine (the user runs this, not the cloud agent)

gstack is fundamentally a **local developer-machine** tool: it clones into your
`~/.claude`, needs **Bun v1.0+** (+ Node on Windows), and drives a real browser / USB
iPhone. It does **not** meaningfully "install into" an ephemeral cloud session — anything
cloned here vanishes when the container is reclaimed. Run it on your actual machine:

```bash
# Requirements: Claude Code, Git, Bun v1.0+, Node (Windows only)
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack && ./setup
```

Then add a `## gstack` section to your **user** CLAUDE.md listing the skills (the README
has the exact block). Other agents (Codex, OpenCode, Cursor, Factory, Hermes, …):
`./setup --host <name>`. OpenClaw spawns Claude Code sessions via ACP, so gstack skills
work there once Claude Code has gstack; four native OpenClaw skills also install via
ClawHub.

Prefix control: `./setup --no-prefix` gives `/qa`; `./setup --prefix` gives `/gstack-qa`
(useful when running multiple skill packs side-by-side — see "Overlap" below).

## The team-mode decision (needs a human call)

`gstack-team-init` bootstraps the **shared repo** so teammates get gstack automatically.
Two modes — the difference matters:

- **`optional`** — adds a gentle one-time CLAUDE.md suggestion. Non-blocking.
- **`required`** — edits `CLAUDE.md` **and installs a PreToolUse hook that blocks
  AI-assisted work unless gstack is installed.** It also migrates/ignores any vendored copy.

**Recommendation for this repo: do *not* run `required`.** This repo already has a large
CLAUDE.md, its own skill library, and its own browser automation (`playwright` +
`claude-playwright` MCP). gstack's CLAUDE.md block says *"use `/browse` for all web
browsing, never use `mcp__claude-in-chrome__*` tools"* — which is opinionated and would
need reconciling with the existing setup. A repo-gating hook that blocks every session is
hard to reverse and would affect future automated sessions too. If we adopt gstack for the
team, start with **`optional`** and reconcile the browser guidance by hand.

## Overlap with what's already here

gstack duplicates a lot of this repo's methodology surface: `/spec*`, `/site-*`, `/tdd`,
`/diagnose`, `/dispatching-parallel-agents`, `/finishing-a-development-branch`,
`/verification-before-completion`, plus **Superpowers** (already wired). If you run gstack
alongside them, install gstack with `--prefix` (`/gstack-qa`, `/gstack-review`) to avoid
slash-command collisions, and decide which pack owns which stage rather than stacking three
overlapping review pipelines.

## Caveats

- **Ephemeral sandbox:** the per-machine install can't persist here — run it on your own
  machine. The durable, repo-level artifact is team mode (your call, see above).
- **`required` mode gates the repo** via a session hook — treat as a significant change.
- **Browser + security stack** ships a bundled Chromium, CDP escape hatches, and a
  ~22 MB→721 MB prompt-injection classifier. Third-party code running with agent
  permissions — review before enabling on sensitive repos.
- **Telemetry is opt-in / off by default** (skill name, duration, success/fail, version,
  OS only — never code/paths/prompts). `gstack-config set telemetry off` to be sure.
- **GBrain / memory sync** can push gstack state (plans, retros, profile) to a private
  git repo — opt-in with a secret scanner; leave off unless you want cross-machine memory.

## If you want it live here anyway

I can clone gstack into this session and run `./setup` to make the skills available for
*this* session only (they won't survive the container). Say so and I'll do it. For anything
durable, the answer is: install on your machine + decide on team mode.
