# Execution Backlog — First 30 Days

*The operator pack made actionable. Ordered, dated tasks with owners,
dependencies, and acceptance criteria. This is the "do" that follows the
overview → strategy → business-guide → inventory.*

---

## Decisions I've Set (override any time)

You delegated the call, so I've resolved the three open decisions with the
defaults the inventory points to. Change a line and the backlog re-flows.

| Decision | Set to | Why |
|---|---|---|
| **Lead lane** | **Studio (software) + always-on content** | Studio is the only near-zero-COGS, no-churn product *and* its license/payment path is already coded — closest to revenue |
| **Autonomy ceiling** | **Semi-autonomous** (loops that check in; confirm before outbound) | Real leverage without irreversible blast radius while the system is young |
| **Where state lives** | **`ecc status` markdown in-repo**, optional Notion mirror later | Portable, versioned, zero new infra |

**Owner key:** `You` = human-only (purchase, approve send, publish, business
call). `Agent` = I can do it autonomously (code, docs, tests, drafts). `You+Agent`
= I prepare, you approve/trigger.

**Standing guardrails (all tasks):** AgentShield + GateGuard on; no outbound
action (email send, Stripe write, prod deploy, publish) without explicit `You`
approval; reversible-only when looped.

---

## Week 1 — Foundation & the Revenue Loop

Goal: the system is safe, and we can prove a dollar can flow through Studio.

| ID | Task | Owner | Dep | Acceptance |
|---|---|---|---|---|
| **T1.1** | Run AgentShield on `.claude/`, CLAUDE.md, `.mcp.json`, hooks, agents; commit report to `docs/security/` | Agent | — | Report committed; criticals listed |
| **T1.2** | Fix AgentShield criticals (secrets, over-broad perms, hook injection) | You+Agent | T1.1 | Re-scan shows 0 critical |
| **T1.3** | Write the 3 MCP profiles (content/software/ops) as documented toggles | Agent | — | `docs/mcp-profiles.md` + per-profile enable lists |
| **T1.4** | Apply token-optimization `settings.json` (sonnet, haiku subagents, autocompact 50) | You | — | Settings live; `/cost` baseline noted |
| **T1.5** | Studio green: `pnpm install && pnpm lint && pnpm test && pnpm build` | Agent | — | All pass; `studio/out/` builds clean |
| **T1.6** | License Worker dry-run: trace Gumroad → `license` Worker → client unlock path; document gaps | Agent | T1.5 | `studio/workers/license/` flow documented; gap list |
| **T1.7** | Stand up one Gumroad product (test mode) + `wrangler secret put GUMROAD_PRODUCT_ID` | You | T1.6 | Test license validates end-to-end |
| **T1.8** | First test purchase → confirm unlock works | You | T1.7 | One test license activates Studio |

**Week-1 done = a verified path from "someone pays" to "Studio unlocks."**

---

## Week 2 — Polish to Sellable + Content Cadence On

Goal: Studio is worth paying for, and the flywheel starts turning daily.

| ID | Task | Owner | Dep | Acceptance |
|---|---|---|---|---|
| **T2.1** | Ship 3 polished, distinct Studio themes (visual QA via screenshots) | You+Agent | T1.5 | 3 themes render correctly on a real track |
| **T2.2** | Studio product/pricing page: lifetime anchor, "you own it, no subscription" | You+Agent | — | `studio.html` updated; price + CTA live (draft) |
| **T2.3** | **Honesty fix:** re-cut or replace the unverified-metric MP4s (tiktok/instagram/youtube) | You+Agent | — | No published asset carries unverified claims |
| **T2.4** | Daily content cadence: 1 asset/day via `rhythmix-author` / `/album-launch` | You+Agent | T1.3 | 7 assets produced wk2; 3 aspect ratios from each cut |
| **T2.5** | `virality_predictor` gate before publishing any cut | Agent | T2.4 | Weak hooks killed pre-publish; scores logged |
| **T2.6** | Instrument funnel: social → site → product page → checkout | You+Agent | T2.2 | Each hop has an event/metric source |

---

## Week 3 — Memory, Learning, and the Buddy Decision

Goal: the system remembers; the biggest idle asset gets a verdict.

| ID | Task | Owner | Dep | Acceptance |
|---|---|---|---|---|
| **T3.1** | Enable ECC memory-persistence hooks (session summaries load/save) | You | T1.4 | New session resumes prior context |
| **T3.2** | Turn on continuous-learning-v2; `/learn-eval` after notable sessions | Agent | T3.1 | Instincts captured; `/instinct-status` populated |
| **T3.3** | **Buddy System triage** — pick ≤1 of ~60 apps to test; formally shelve the rest | You+Agent | — | Decision doc: 1 app chosen + reason; line shelved or scoped |
| **T3.4** | If a Buddy app is chosen: wire its existing Stripe/Gumroad scaffold to a real checkout | You+Agent | T3.3 | One Buddy app has a working paid path (test mode) |
| **T3.5** | `ecc status --markdown --write status.md` as the live dashboard | Agent | T1.4 | `status.md` reflects readiness, sessions, work items |

**Buddy triage rule:** the marketplace + premium pages already have monetization
scaffolding — so the test is *demand*, not build. One app, one real user, one
week. No traction → shelve the line and reclaim the attention.

---

## Week 4 — Controlled Autonomy + Review

Goal: loops do the repetitive work; we measure and re-aim.

| ID | Task | Owner | Dep | Acceptance |
|---|---|---|---|---|
| **T4.1** | `/loop-start` for the content render queue (semi-auto, check-in) | You+Agent | T2.4 | Loop produces drafts; pauses for approve-before-publish |
| **T4.2** | PR babysitting loop via `subscribe_pr_activity` on Studio PRs | Agent | T1.5 | CI failures auto-diagnosed; fixes pushed to branch |
| **T4.3** | Daily `morning-briefing` (Calendar+Gmail+Slack+GitHub) | You+Agent | T1.3 | Digest arrives daily; sends require approval |
| **T4.4** | First metrics review → cut what isn't driving decisions | You | T2.6 | One-screen dashboard; next-month focus chosen |
| **T4.5** | Portfolio ICE review: promote/validate/shelve each surface | You+Agent | — | Updated table in `BUSINESS-GUIDE.md` |
| **T4.6** | Decide Reset / Codex: ship or shelve | You | — | Written verdict per product |

---

## The Critical Path (if you only do one thread)

```
T1.1 → T1.2  (safe)
T1.5 → T1.6 → T1.7 → T1.8   (a dollar can flow)
T2.1 → T2.2                 (worth paying for)
T2.4 → T2.5 → T2.6          (people find it)
T4.4                        (measure, re-aim)
```

Everything else is amplification. This thread is the business.

---

## What "Finished" Means for This Pack

The operator pack (5 docs) is complete and gives you:
1. **Overview** — what ECC is.
2. **Strategy** — how to wire it into your ecosystem.
3. **Business Guide** — the business it runs.
4. **What We Have** — the grounded inventory.
5. **Execution Backlog** — this: the dated, ordered path.

From here, "finished" is no longer a document — it's **T1.8 passing** (first real
unlock) and **a daily content asset shipping**. Those are the two heartbeats.
Tell me to start at the top of Week 1 and I'll execute every `Agent`-owned task
in order, pausing only at the `You` gates.
```
