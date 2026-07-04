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

## Scheduled automation — two tiers

**Tier 1: GitHub Actions (mechanical checks — zero Claude tokens, no approvals needed):**

1. **Daily site check** — `.github/workflows/site-check.yml`, cron `17 22 * * *` (~8:17am AEST). HTTP-sweeps the key live pages + homepage sanity; opens/updates a `site-check`-labeled issue on failure. Manual run: Actions → "Daily site check" → Run workflow.
2. **Monthly token audit** — `.github/workflows/token-audit.yml`, cron `23 21 1 * *` (1st, ~7:23am AEST). Guards against config drift: CLAUDE.md ≤12KB, skills ≤140, agents ≤60, valid JSON configs, no broken symlinks, no dangling skills-lock paths. Opens a `token-audit`-labeled issue on drift.

**Tier 2: Claude cloud Routines (judgment/creative work — created with `create_trigger`):**

3. **weekly-promo** — REGISTERED (`trig_0112n9DHdovSbg9FJMZ3LGFN`), cron `0 23 * * 0` UTC (Mon ~9am AEST). Drafts a new promo via `rhythmix-author`, verifies with `render-verify`, pushes to a `claude/weekly-promo-<date>` branch for review. Never publishes.
4. **weekly-metrics-digest** — PENDING (needs Supermetrics connected + one `create_trigger` approval), cron `0 23 * * 4` UTC (Fri ~9am AEST): "Pull last-7-days ad + GA4 performance via Supermetrics MCP vs prior week; digest what moved, best/worst campaign, one recommendation for next week's content. If Supermetrics is unreachable in the scheduled session, say so and stop."

Deeper Claude-driven remediation of site failures or token drift stays on-demand: the `deploy-check` skill and the fix guide in this file.

Keep all automation *reporting* by default — publishing stays human-approved (the repo root is production).
