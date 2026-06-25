# ECC × Ecosystem Integration Strategy

How to wire **ECC** (the harness operator system — see
`docs/ecc-harness-overview.md`) into *this* ecosystem: the RHYTHMIX /
STARLIGHTMIX repo, its skills + video pipeline, the connected MCP fleet
(Notion, Slack, Gmail, Calendar, Airtable, Stripe, Cloudflare, Figma, Canva,
Gamma, HyperFrames, Higgsfield, Picsart, Lovable, Webflow, HF, Spotify, …),
and the FleetView subagent roster.

**Core idea:** Don't bolt ECC on as "more tools." Use it as the **control
plane** — the layer that decides *which* skill/agent/MCP runs, enforces quality
and security, and remembers what worked — sitting on top of the three asset
lanes you already have (Content, Software, Ops).

---

## 0. The Map — what you already have vs. what ECC adds

| Layer | You already have | ECC adds |
|---|---|---|
| **Content** | HyperFrames Cuts, `rhythmix-author`, `/dream`, `/album-launch`, creative MCPs | `content-engine`, `article-writing`, `brand-voice`, `crosspost`, virality scoring discipline |
| **Software** | `studio/` (Next.js), Workers, PWAs, `/spec-*`, `/site-build` | `planner`/`architect`/`code-reviewer`/`security-reviewer` agents, TDD + verification skills, rules, hooks |
| **Ops** | Notion/Slack/Gmail/Calendar/Airtable/Stripe MCPs | `chief-of-staff`, `morning-briefing`, autonomous loops, session memory |
| **Governance** | `.claude/settings.json` allowlist, session-start hook | AgentShield, GateGuard, continuous-learning, `ecc status` snapshots |

The two ecosystems **overlap** (you both have skills, agents, MCP configs).
That overlap is the #1 risk — see §5.

---

## 1. The Hard Constraint to Design Around: MCP token bloat

You have **30+ MCP servers** discoverable in this session. ECC's own rule:

> Keep **< 10 MCPs** and **< 80 tools** active per project. Each MCP tool
> description is spent from your 200k context window — an unfiltered fleet can
> shrink your usable window to ~70k.

This is the single most important thing to get right. Strategy:

- **Define per-lane MCP profiles** instead of one global "everything on" setup.
  Concretely, maintain three `.mcp.json` overlays (or use `/mcp` to toggle):

  | Profile | Enable | Rough tool budget |
  |---|---|---|
  | **content** | HyperFrames, Higgsfield, Canva/Gamma, Picsart, Spotify, HF | ~50 |
  | **software** | Cloudflare, Stripe, Figma, GitHub, Context7, Playwright | ~60 |
  | **ops** | Notion, Slack, Gmail, Calendar, Airtable, Stripe (read) | ~55 |

- Use **`/mcp`** for live disables (persists in `~/.claude.json`); reserve
  `ECC_DISABLED_MCPS` for filtering ECC's *bundled* servers during install/sync.
- Treat Context7 as always-on in the software profile (docs lookup), off
  elsewhere.

**Action:** pick the profile that matches the session's lane *before* starting
work, not midway through.

---

## 2. Install ECC — one path, no stacking

Per the overview's biggest pitfall, choose a **single** install path:

1. `/plugin marketplace add https://github.com/affaan-m/ECC`
2. `/plugin install ecc@ecc`
3. Manually copy **only** the rules you need into an ECC-owned namespace:
   - `rules/common` (always)
   - `rules/typescript` (Studio / PWAs)
   - *(skip python/golang/etc. — not your stack)*
4. **Do not** also run `./install.sh --profile full`. That double-installs.

**Data isolation:** this repo is driven from Claude Code, so keep the default
`~/.claude` agent-data home. If you ever drive it from Cursor too, set
`ECC_AGENT_DATA_HOME=~/.cursor/ecc` there so session memory doesn't collide.

**Token defaults** for `~/.claude/settings.json` (you run a lot of parallel,
creative work — this keeps cost sane):

```json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku",
    "ECC_CONTEXT_MONITOR_COST_WARNINGS": "off"
  }
}
```

Escalate to Opus only for architecture/debugging (`/model opus`).

---

## 3. The Phased Rollout (recommended sequence)

Start narrow, prove value, expand. Each phase is independently useful — stop
whenever the payoff plateaus.

### Phase 1 — Governance first (½ day, do this regardless of lane)
The cheapest, highest-leverage win: make the system *safe and self-auditing*
before you point autonomy at it.
- Run **`npx ecc-agentshield scan`** against this repo's `.claude/`, CLAUDE.md,
  `.mcp.json`, hooks, and agent defs. Fix criticals (it exits 2 on critical).
- Confirm **GateGuard** gates destructive shell (`rm`, force checkout) — relevant
  given autonomous loops touch 50+ Cut folders.
- Adopt ECC's `rules/common/security.md` + `git-workflow.md`.
- **Deliverable:** a clean AgentShield report committed under `docs/security/`.

### Phase 2 — Pick your lead lane and wire it

**If Content/RHYTHMIX is the priority:**
- Map ECC content skills onto existing ones — `brand-voice` seeded from
  `rhythmix-teaser-60s/DESIGN.md`; `content-engine` + `crosspost` downstream of
  `/album-launch`.
- Pipeline: `flash_episode_brief` → `/rhythmix-site` or `rhythmix-author` →
  HyperFrames render → Higgsfield/Canva assets → `crosspost` to socials.
- Use Higgsfield's **virality_predictor** as a gate before publishing a Cut.

**If Studio/Software is the priority:**
- Adopt the agent workflow: `/plan` (planner) → `tdd-workflow` →
  `/code-review` → `/security-scan` → `/test-coverage` before merge.
- Wire ECC hooks: auto-format + `tsc` check on edit, secret detection on prompt,
  dev-server-outside-tmux guard. These complement your existing session-start hook.
- Keep `/spec-*` and `/site-build` as the front door; hand spec tasks to ECC
  agents for execution.

**If Ops is the priority:**
- Stand up `morning-briefing` (Calendar + Gmail + Slack + GitHub) and
  `chief-of-staff` (triage + draft replies).
- Mirror project state into Notion/Airtable via the ops MCP profile.

### Phase 3 — Memory + continuous learning (always-on, compounding)
- Enable ECC memory-persistence hooks (session summaries load/save across
  sessions). This is what makes the assistant "remember your ecosystem."
- Turn on **continuous-learning-v2**: after notable sessions, run `/learn-eval`;
  periodically `/evolve` to cluster instincts into reusable skills. Over weeks
  this captures *your* RHYTHMIX conventions automatically.

### Phase 4 — Controlled autonomy (loops + cron)
Default to **semi-autonomous, check-in-before-risky**:
- `/loop-start` for bounded loops (render queue, PR babysitting via
  `subscribe_pr_activity`, morning brief).
- Use ECC's `autonomous-loops` skill patterns (sequential pipeline, PR loop, DAG)
  with explicit budgets and a terminal state.
- Keep AgentShield + GateGuard as the standing guardrails. Reserve "max
  autonomy / overnight" for tasks with a clean rollback (renders, drafts) — never
  for irreversible ops (sending emails, Stripe writes, deploys to prod) without a
  confirm step.

---

## 4. The Operator Loop (how a normal day runs once wired)

```
SessionStart hook → loads memory + ECC context for the active lane
        │
   pick MCP profile (content | software | ops)   ← §1
        │
   /plan or a domain skill (rhythmix-author / spec-run / morning-briefing)
        │
   ECC agents execute (haiku for mechanical, sonnet for judgment, opus for arch)
        │
   quality gate: /code-review or virality_predictor or human review
        │
   AgentShield/GateGuard guard any risky action
        │
   Stop hook → session summary saved → /learn-eval feeds continuous-learning
        │
   ecc status --markdown --write status.md   ← portable handoff / dashboard
```

---

## 5. Avoiding the Overlap Collisions (critical)

ECC and this repo **both** ship skills, agents, and MCP configs. Without care
you get duplicates and conflicting rules. Rules of the road:

- **Namespace ECC rules:** copy into `~/.claude/rules/ecc/`, never loose.
- **Don't double-install:** plugin *or* full installer, never both (§2).
- **Skill name clashes:** this repo's `replicate`, `hyperframes`, `frontend-design`
  are local/synced. If ECC ships a same-named skill, prefer the local one for
  RHYTHMIX-specific behavior; rename or disable the ECC duplicate.
- **MCP duplication:** if ECC bundles an MCP you already run (e.g. Playwright,
  Context7), set `ECC_DISABLED_MCPS` so install/sync skips it.
- **Hooks:** never add a `"hooks"` field to `plugin.json` (duplicate-load error).
  Let v2.1+ auto-load plugin hooks; install the runtime via the installer, not by
  hand-copying `hooks.json` into `settings.json`.
- **Subagents:** FleetView's `.claude/agents/` roster and ECC's `agents/` are
  separate registries — pick the agent whose description matches; don't expect
  them to merge.

---

## 6. First Concrete Steps (this week)

1. **Phase 1 now:** run AgentShield, commit the report, fix criticals.
2. Write the three MCP profile overlays (content/software/ops) and document the
   "pick a profile before you start" habit.
3. Install ECC via the plugin path; copy `rules/common` + `rules/typescript`.
4. Apply the token-optimization `settings.json` block.
5. Wire your lead lane (Phase 2) end-to-end on **one** real task — one Cut, one
   Studio feature, or one morning brief — and measure the time saved.
6. Turn on memory persistence (Phase 3) so the next session starts ahead.

Defer autonomy (Phase 4) until 1–3 are proven. Autonomy multiplies whatever
you've built — make sure what it multiplies is good.

---

## 7. Open Decisions (set these to finalize)

- **Lead lane** — Content, Software, Ops, or full operator-layer unification?
  (Drives which Phase 2 block you execute first.)
- **Autonomy ceiling** — hands-on / semi-autonomous / overnight-max? (Drives
  Phase 4 guardrail strictness.)
- **Where state lives** — `ecc status` markdown in-repo, or mirrored to
  Notion/Airtable for a shared dashboard?

Answer these three and this strategy collapses into a concrete, ordered backlog.
```
