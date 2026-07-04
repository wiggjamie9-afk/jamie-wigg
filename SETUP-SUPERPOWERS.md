# SETUP-SUPERPOWERS.md — Superpowers dev methodology for coding agents

**Superpowers** (Jesse Vincent / Prime Radiant, MIT) is a complete software-development
methodology delivered as a bundle of composable, auto-triggering **skills** plus the
bootstrap instructions that make an agent actually use them. Instead of jumping
straight to code, the agent brainstorms a spec with you, writes a bite-sized plan,
then runs a subagent-driven TDD loop with two-stage review — largely autonomously.

- Repo: <https://github.com/obra/superpowers>
- Marketplace repo: <https://github.com/obra/superpowers-marketplace>
- License: MIT

## Wired into this repo (Claude Code)

The marketplace + plugin are declared in [`.claude/settings.json`](.claude/settings.json):

```json
"extraKnownMarketplaces": {
  "superpowers-marketplace": {
    "source": { "source": "github", "repo": "obra/superpowers-marketplace" }
  }
},
"enabledPlugins": {
  "superpowers@superpowers-marketplace": true
}
```

When anyone opens this repo in **Claude Code**, the plugin auto-loads — no per-person
`/plugin` typing. Verify with `/plugin` (marketplaces + installed) and `/reload-plugins`.

Alternatively, the plugin is on Anthropic's official marketplace:
`/plugin install superpowers@claude-plugins-official`.

> Note: an agent in a remote/non-interactive sandbox **can't** run `/plugin` itself, and
> the sandbox is ephemeral — the repo config above is the durable, team-wide way to
> share it. If the marketplace repo can't be resolved, Claude Code skips the plugin
> (non-fatal); remove the `enabledPlugins` entry to silence it.

## Install on other harnesses (per-machine, run once each)

Superpowers installs separately per harness — if you use more than one, do each.

| Harness | Command |
|---|---|
| **Claude Code** | `/plugin install superpowers@claude-plugins-official` (or the marketplace above) |
| **Antigravity** | `agy plugin install https://github.com/obra/superpowers` |
| **Codex App** | Plugins sidebar → Coding → Superpowers → `+` |
| **Codex CLI** | `/plugins` → search `superpowers` → Install |
| **Cursor** | `/add-plugin superpowers` (or marketplace search) |
| **Factory Droid** | `droid plugin marketplace add https://github.com/obra/superpowers` → `droid plugin install superpowers@superpowers` |
| **GitHub Copilot CLI** | `copilot plugin marketplace add obra/superpowers-marketplace` → `copilot plugin install superpowers@superpowers-marketplace` |
| **Kimi Code** | `/plugins` → Marketplace → Superpowers (or `/plugins install https://github.com/obra/superpowers`) |
| **OpenCode** | Tell it to fetch+follow `https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md` |
| **Pi** | `pi install git:github.com/obra/superpowers` |

## The workflow (skills auto-trigger)

1. **brainstorming** — refine the idea via Socratic questions, present design in
   readable sections, save a design doc.
2. **using-git-worktrees** — isolated branch/workspace, clean test baseline.
3. **writing-plans** — bite-sized tasks (2–5 min) with exact paths + verification.
4. **subagent-driven-development / executing-plans** — fresh subagent per task,
   two-stage review (spec compliance → code quality).
5. **test-driven-development** — enforced RED → GREEN → REFACTOR; deletes code
   written before its test.
6. **requesting-code-review** — review against the plan, block on critical issues.
7. **finishing-a-development-branch** — verify tests, merge/PR/keep/discard, cleanup.

Other skills: `systematic-debugging`, `verification-before-completion`,
`dispatching-parallel-agents`, `receiving-code-review`, `writing-skills`,
`using-superpowers`.

## Overlap with what's already here

This repo already carries hand-written skills covering much of the same ground
(`/tdd`, `/diagnose`, `/executing-plans`, `/dispatching-parallel-agents`,
`/subagent-driven-development`, `/using-git-worktrees`,
`/finishing-a-development-branch`, `/verification-before-completion`,
`/write-a-skill`). Superpowers is the upstream, self-triggering version of this
family — treat it as the canonical methodology; prefer it when both are present.

## Notes / caveats

- **Telemetry:** brainstorming's optional visual companion loads the Prime Radiant
  logo (with the Superpowers version) from their site — no project/prompt/click data.
  Disable via `SUPERPOWERS_DISABLE_TELEMETRY=1`; it also honors Claude Code's
  `DISABLE_TELEMETRY` / `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`.
- Third-party plugins run with your agent's permissions — treat as third-party code.
  From this sandbox I can't verify the marketplace resolves or is safe; the config is
  as-pasted.
- They're **hiring** a Superpowers community engineer:
  <https://primeradiant.com/jobs/superpowers-community-engineer/>. Commercial support:
  `sales@primeradiant.com`.
