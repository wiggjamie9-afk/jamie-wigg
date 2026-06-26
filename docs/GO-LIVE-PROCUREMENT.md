# Go-Live Procurement & Wiring Plan

*The real shopping list to take STARLIGHTMIX Studio from "builds locally" to a
sellable, global, premium product. Every item is load-bearing — it either takes
money, delivers the product, builds trust, or it's not on this list. No vanity
tooling.*

Two products ship in parallel:
- **Studio Lifetime (BYO-token)** — already coded; fastest path to first revenue.
- **Studio Premium (hosted "Blue" front)** — recurring, global; we provide the
  render + AI so the buyer just uploads and gets a video. This is the premium
  front door.

Acquire in tier order. Don't buy Tier 2 before Tier 0 is live.

---

## TIER 0 — Cannot take money or deliver without these (get first)

| # | Product | What it does here | Wires into | Cost (2026) |
|---|---|---|---|---|
| 0.1 | **Cloudflare account + API token** | Hosts the site, Studio, and all Workers; KV for license cache | `studio-deploy.yml`, `workers/*` | Free → $5/mo Workers paid |
| 0.2 | **Gumroad account + $149 "Lifetime" product** | Sells the lifetime license; issues keys the Worker verifies | `workers/license/` (already coded) | 10% per sale, no monthly |
| 0.3 | **Domain control: `starlightmix.com` + `rhythmixapp.com.au`** | Premium front lives at `studio.starlightmix.com`; brand trust | DNS → Cloudflare Pages | ~$15–40/yr each |
| 0.4 | **Replicate account + token (org)** | The actual video render engine | `workers/replicate-proxy/`, client | Pay-per-render (passthrough or absorbed in Premium) |
| 0.5 | **Anthropic API key** (or OpenAI-compatible) | Powers captions/metadata/narration in `llm-router.ts` | `studio/lib/llm-router.ts` (`configureLLM`) | Usage-based; cheap (low-value tasks) |
| 0.6 | **Transactional email — Resend** (or Postmark) | Delivers license keys + receipts; without this, buyers pay and get nothing | License flow / Gumroad webhook → email | Free tier → ~$20/mo |

**Tier 0 done = a stranger can pay $149, get a key by email, and unlock Studio.**
That's the whole MVP business. Everything below scales it.

---

## TIER 1 — Trust, reliability, and not flying blind (get right after launch)

| # | Product | Why it's load-bearing | Wires into |
|---|---|---|---|
| 1.1 | **Stripe account** | Global payments, subscriptions, automated tax (Stripe Tax). Required for the **Premium recurring tier** and selling outside Gumroad's limits. Stripe MCP already connected. | New `workers/billing/` + Premium front |
| 1.2 | **Sentry** | Error monitoring on Studio + Workers. Premium buyers churn on silent failures. | `studio/` client + Worker `try/catch` |
| 1.3 | **PostHog** (or Plausible) | Funnel analytics: social → site → checkout → qualified session (the north-star metric). Self-host or EU cloud for global privacy. | `studio/` events |
| 1.4 | **Auth — Clerk** (or Supabase Auth) | Premium (hosted) needs accounts, not license keys. Gates usage, enables billing portal. | Premium front + billing Worker |
| 1.5 | **Status page — Better Stack / Instatus** | Uptime + public status. Premium SaaS without a status page reads as amateur. | Monitors Workers/Pages |

---

## TIER 2 — Premium polish & global scale (the "Blue" front)

| # | Product | Why | Wires into |
|---|---|---|---|
| 2.1 | **Brand/design system pass** (Figma — connected) | The "Blue premium" identity: one cohesive premium look across landing, app, emails. Locked to a token set. | `studio/app/globals.css`, landing |
| 2.2 | **Cloudflare R2** | Cheap, egress-free object storage if Premium ever caches renders/assets globally | Premium render pipeline |
| 2.3 | **Localization** (the global play) | Studio UI + landing in the launch languages. You already have the audience signals (multi-language). | `studio/` i18n |
| 2.4 | **Customer support — Crisp / Plain** (or keep Slack+Gmail at first) | One inbox for paying customers; don't run premium support out of a personal Gmail forever | Premium front widget |

---

## Decisions (my recommendations — override any)

1. **Payments: Gumroad NOW, Stripe for Premium.** Gumroad is already wired and
   ships the lifetime tier this week. Add Stripe only when the recurring Premium
   tier is real — don't block launch on it.
2. **AI keys: you hold them for Premium, buyer holds them for Lifetime.** The
   `llm-router.ts` I built supports both via `configureLLM()` — Lifetime users
   paste their own; Premium uses your org key server-side (via a Worker, never
   the client bundle).
3. **"Blue premium front" = a hosted Premium tier with its own landing**, not
   just a recolor. Same Studio engine, but we render for them. That's what
   justifies recurring price and a global audience.
4. **Don't build a custom payment UI.** Gumroad overlay + Stripe Checkout/Portal.
   Custom checkout is where solo founders lose months for zero gain.

---

## The Wiring Map (how the money actually flows)

```
LIFETIME ($149, this week):
  Buyer → Gumroad checkout → license key emailed (Resend)
        → Studio: paste key → workers/license verifies (Gumroad API) → unlock
        → Buyer pastes own Replicate + AI key → renders locally

PREMIUM (recurring, the Blue front):
  Buyer → Stripe Checkout → account created (Clerk)
        → Premium app → workers/billing checks subscription
        → render via YOUR Replicate org + AI key (server-side Worker)
        → usage metered; Stripe Portal for self-serve management
```

---

## What I need from you (the buy list, in order)

**To ship Lifetime this week — get these 6:**
1. Cloudflare account + API token (+ account ID)
2. Gumroad account → create the **$149 "Lifetime" product** (variant name must
   contain "lifetime")
3. Replicate account + API token
4. Anthropic API key (or any OpenAI-compatible endpoint + key)
5. Resend account + API key + a verified sending domain
6. Confirm DNS control for `starlightmix.com` (for `studio.starlightmix.com`)

**For the Premium "Blue" front — get these next:**
7. Stripe account (live + test keys)
8. Clerk account (or Supabase project)
9. Sentry account (DSN)
10. PostHog account (project key)

Hand me the keys/answers as you get them (drop them in `.env` / Cloudflare
secrets — never in a commit) and I'll wire each one in as it lands: webhook →
email, the billing Worker, auth gating, the Premium landing, and the Blue brand
pass. I'll do the code; you do the sign-ups and approvals.
```
