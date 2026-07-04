# RHYTHMIX Automation Layer

The operating model: **Claude Code is the conductor**; skills are the branch capabilities; the
automation layer decides *when* each one fires. Three cadences:

| Cadence | Meaning | How it runs |
|---|---|---|
| 👆 on-demand | You (or another skill) invoke it | Skill / slash command in any session |
| ⏰ scheduled | Fires on a cron in a cloud session | Claude Code cloud **Routine** (`create_trigger`, min interval hourly) |
| ☁️ event | Fires when something happens | PR-activity subscription, deploy-triggered check-in (`send_later`) |

## Branch map

### CONTENT (video pipeline)
| Capability | Skill | Cadence |
|---|---|---|
| New promo end-to-end (script → TTS → render) | `rhythmix-author` / `/rhythmix-new` | 👆 |
| One-shot asset (image/video/music/voice) | `/dream` | 👆 |
| Full launch fan-out (cover + track + video + landing) | `/album-launch` | 👆 |
| Portrait + square variants of a landscape Cut | `promo-repurpose` | 👆 (chain after rhythmix-author) |
| Pre-publish render gate | `render-verify` | 👆 (auto-invoked by promo-repurpose) |
| Weekly promo draft | Routine → `/rhythmix-new` | ⏰ weekly |

### SITES (web)
| Capability | Skill | Cadence |
|---|---|---|
| Full site pipeline | `/site-build`, `/rhythmix-site` | 👆 |
| Single stage | `/site-sitemap` `/site-wireframe` `/site-styleguide` `/site-design` | 👆 |
| Production smoke test of rhythmixapp.com.au | `deploy-check` | ☁️ after merge to main · ⏰ daily fallback |

### RESEARCH (marketing intel)
| Capability | Tool | Cadence |
|---|---|---|
| Ad/analytics data Q&A (Google Ads, Meta, TikTok, GA4, Shopify…) | **Supermetrics MCP** (see `SETUP-SUPERMETRICS.md`) | 👆 |
| Library/API docs | Context7 MCP | 👆 (always, per CLAUDE.md rule) |
| Competitor / market sweep | `competitor-watch` agent + WebSearch | ⏰ weekly |
| Weekly performance digest | Routine → Supermetrics query → summary | ⏰ weekly |

### ENGINEERING (repo health)
| Capability | Skill | Cadence |
|---|---|---|
| Spec pipeline | `/spec-quick` → `/spec-analyze` → `/spec-run` | 👆 |
| MCP/deps self-heal | `.claude/hooks/session-start.sh` | every session start |
| Verification gates | `verification-before-completion`, `render-verify`, `deploy-check` | 👆 |

## Routines to create (cloud sessions)

Create with `create_trigger` from any cloud session; they run as fresh sessions with a standalone prompt:

1. **weekly-promo** — cron `0 9 * * 1`: "Run /rhythmix-new for this week's angle; run render-verify; leave the Cut folder on a branch for review. Do not publish."
2. **daily-site-check** — cron `0 8 * * *`: "Invoke the deploy-check skill against rhythmixapp.com.au; only report if something fails."
3. **weekly-metrics-digest** — cron `0 9 * * 5` (needs Supermetrics connected): "Pull last-7-days ad + GA4 performance via Supermetrics MCP; write a short digest of what moved and one recommendation."

4. **monthly-token-audit** — cron `0 21 1 * *` (1st of month, ~7am AEST): "Keep per-session token overhead minimal. Check: CLAUDE.md under 10KB (re-slim into docs/tools-index.md if it grew); no bulk-imported skill packs in .claude/skills or .agents/skills; .claude/agents roster stays ~43 dev+marketing agents; .claude/settings.json valid schema with the self-healing SessionStart hook; no broken symlinks, invalid JSON, or dangling skills-lock.json paths. Apply safe mechanical fixes on branch claude/token-audit-<date>, push, summarize. If nothing drifted: '✅ token overhead stable'. Never touch main."

Keep routines *reporting* by default — publishing stays human-approved (the repo root is production).

**Routine status:** `weekly-promo` is registered (trig_0112n9DHdovSbg9FJMZ3LGFN). `daily-site-check`, `weekly-metrics-digest`, and `monthly-token-audit` are specced above but not yet registered — creating them needs an interactive approval tap on the claude-code-remote `create_trigger` call.
