---
description: Pull Stripe + Meta Ads + Instagram metrics, compare to last week, flag 15%+ moves, return a 5-bullet summary
---

# Weekly business review

Pull this week's numbers, compare to last week, and text me a 5-bullet summary.

## Data sources
- **Stripe** — revenue, MRR, churn (use Stripe API or MCP server)
- **Meta Ads** — ad spend, ROAS, CPL (use Meta Marketing API)
- **Instagram** — followers, top 3 posts by engagement (use IG Graph API)

## Logic
1. Pull each metric for the last 7 days and the prior 7 days.
2. Compute % change. Flag anything that moved **15% or more** (up or down) with an arrow.
3. Identify top performer and biggest concern.
4. Output exactly 5 bullets, SMS-friendly (under 160 chars each ideally).

## Required setup (do once, outside Claude Code)
- API keys: `STRIPE_API_KEY`, `META_ACCESS_TOKEN` + `META_AD_ACCOUNT_ID`, `IG_ACCESS_TOKEN` + `IG_USER_ID`. Store in `.env` (gitignored) or your secrets manager.
- For SMS delivery: Twilio creds (`TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`, your number).
- For 8am Monday automation: a scheduler (cron, GitHub Actions on `schedule:` cron, or a serverless trigger) running `claude -p "/business-review"` and piping output to a `send-sms` script.

## Notes
- Claude Code does not run on a timer by itself. The "every Monday at 8am" part is a scheduler's job.
- Run `/business-review` manually any time to get the same summary on demand.
