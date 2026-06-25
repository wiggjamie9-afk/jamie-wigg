# RHYTHMIX / STARLIGHTMIX — Complete Business Guide

*An AI-augmented operating manual for the whole ecosystem: products, money,
the tool/agent stack that runs it, go-to-market, metrics, and a 30/60/90 plan.*

This guide assumes the **ECC operator layer** (see
`docs/ecc-harness-overview.md`) and the **integration strategy**
(`docs/ecc-ecosystem-integration-strategy.md`) as the engine. This document is
the **business** the engine drives.

---

## 1. What the Business Is

A **solo-operator, AI-leveraged product studio** shipping across three fronts:

1. **RHYTHMIX** — AI music platform marketing presence (`rhythmixapp.com.au`),
   the brand and content flywheel.
2. **STARLIGHTMIX Studio** — the flagship software product: a mobile-first web
   app where lifetime buyers bring their own Replicate token, upload a track,
   pick a theme, and get an AI music video. No server-side audio, no recurring
   infra cost to you.
3. **Portfolio bets** — standalone PWAs and app concepts that share the same
   pipeline and stack: HerdCheck (livestock screening), Reset (sport recovery),
   Codex of Reality, and the `untapped/` portfolio of 10 concepts.

**The thesis:** one person + a deep AI stack can run a multi-product studio by
treating *content, software, and ops* as three production lines fed by the same
skills, agents, and MCP fleet — with ECC as the control plane that keeps quality
and cost in check.

---

## 2. Revenue Architecture

| Line | Product | Model | Why it works |
|---|---|---|---|
| **Primary** | STARLIGHTMIX Studio | **Lifetime license** (Gumroad → license Worker) | No churn ops; buyer pays their own Replicate fees, so COGS ≈ 0 to you |
| **Secondary** | RHYTHMIX app | Freemium / app-store | Brand flywheel; content drives installs |
| **Tertiary** | Portfolio PWAs | Per-product (HerdCheck = SaaS to smallholders; Reset = team subscriptions) | Cheap to validate; kill or scale |
| **Optional** | Productized services | Build-a-promo / launch-kit as a service | Uses the exact same pipeline you already run |

**Margin profile is the moat:** because Studio pushes inference cost onto the
buyer's own token and hosts nothing (localStorage + IndexedDB), gross margin on
a lifetime sale is near-total. The constraint is **distribution, not unit
economics** — which is exactly what the content engine is for.

### Pricing posture
- **Studio:** anchor a lifetime price (e.g. $49–$99) framed against "no
  subscription, you own it." Validate the GUMROAD_PRODUCT_ID → license Worker
  path end-to-end before any push.
- **Tiering later:** founder/early-bird lifetime, then a higher "pro themes"
  lifetime once the catalog deepens.
- **Never** introduce hosting cost you can't pass through — it breaks the moat.

---

## 3. Product Portfolio — Prioritization

Run a simple **ICE** lens (Impact × Confidence × Ease) and concentrate effort:

| Product | Stage | Next milestone | Verdict |
|---|---|---|---|
| STARLIGHTMIX Studio | Live, deployable | Prove license + payment loop; ship 3 polished themes | **Lead — fund this** |
| RHYTHMIX site/content | Live | Consistent publishing cadence | **Always-on flywheel** |
| HerdCheck | Working PWA | One real pilot user (smallholder) | **Validate, don't polish** |
| Reset | Prototype + iOS wrapper | Decide: ship or shelve | **Decide** |
| Codex of Reality | Full site/PWA | Audience or archive | **Decide** |
| untapped (×10) | Concepts | Pick ≤1 to prototype | **Optionality — keep cheap** |

**Rule:** at most **one** lead software product gets deep weekly engineering;
everything else gets validation-only effort until it earns more. Spreading a
solo operator across 14 surfaces is the failure mode the AI stack tempts you
into — resist it.

---

## 4. The AI Operating System (how the work actually gets done)

Three production lines, each a skill+agent+MCP recipe. ECC routes and gates.

### Line A — Content / Marketing (the flywheel)
**Goal:** a publishable asset every working day at near-zero marginal cost.

Pipeline:
```
idea → flash_episode_brief / brand-voice
     → rhythmix-author OR /album-launch (script→TTS→HyperFrames→render)
     → Higgsfield/Canva/Picsart for stills & thumbnails
     → virality_predictor gate  (kill weak hooks before publishing)
     → crosspost to socials + downloads page on the site
```
MCP profile: **content** (HyperFrames, Higgsfield, Canva/Gamma, Picsart, HF,
Spotify). Subagents: `short-form-video`, `thumbnail-designer`, `seo-writer`,
`x-twitter-growth`.

### Line B — Software / Product
**Goal:** Studio is correct, secure, and shippable; PWAs validated cheaply.

Pipeline:
```
/spec-quick → /spec-analyze → /spec-run         (plan)
/plan → tdd-workflow → implement                 (build)
/code-review → /security-scan → /test-coverage   (gate)
studio-deploy.yml (preview on branch; prod = manual approval)
```
MCP profile: **software** (Cloudflare, Stripe, Figma, GitHub, Context7,
Playwright). Subagents: `planner`, `architect`, `code-reviewer`,
`security-reviewer`, `typescript-reviewer`, `e2e-runner`.

### Line C — Ops / Business
**Goal:** the business runs itself between build sessions.

Pipeline:
```
morning-briefing  (Calendar + Gmail + Slack + GitHub → daily digest)
chief-of-staff    (triage inbox, draft replies — you approve sends)
state mirror      (ecc status → Notion/Airtable dashboard)
revenue check     (Stripe read-only: sales, refunds, MRR-equivalent)
```
MCP profile: **ops** (Notion, Slack, Gmail, Calendar, Airtable, Stripe-read).

**Guardrail across all lines:** AgentShield audits the config surface; GateGuard
blocks destructive shell; any *outbound* action (send email, Stripe write,
prod deploy) requires an explicit confirm — never autonomous.

---

## 5. Go-To-Market — Distribution is the Job

Margin is solved; attention is not. The content engine (Line A) IS the GTM.

- **Cadence beats polish.** One asset/day across TikTok/Reels/Shorts (9:16),
  one YouTube/LinkedIn cut/week (16:9), one IG square. The pipeline already
  produces all three aspect ratios from one Cut.
- **Funnel:** social hook → `rhythmixapp.com.au` → Studio product page →
  lifetime purchase. Instrument each hop.
- **Proof, honestly.** `README.md` already flags that some rendered MP4s contain
  *unverified* metrics/testimonials — only `teaser-coming-soon*.mp4` is safe to
  publish as-is. **Do not publish unverified claims.** Re-cut or replace before
  use. This is a brand-and-legal risk, not a nitpick.
- **SEO/owned:** the site is the durable asset; socials are rented land. Keep
  publishing canonical pages (features, studio, founder, pricing) and let
  `seo-audit` keep them sharp.

---

## 6. Metrics — What to Watch

Keep it to a one-screen dashboard (mirror via `ecc status` → Notion/Airtable):

**North star:** *qualified Studio sessions* (uploaded a track + picked a theme).

| Layer | Metric | Source |
|---|---|---|
| Distribution | views, hook-hold %, CTR to site | socials + virality_predictor |
| Site | unique visitors, product-page → checkout rate | analytics |
| Revenue | lifetime sales, refund rate, net revenue | Stripe / Gumroad |
| Product | qualified sessions, render success rate, theme mix | Studio (client-side events) |
| Cost | your token spend (Claude), render compute | `/cost`, ECC metrics |

Review weekly. If a number isn't driving a decision, stop tracking it.

---

## 7. Operating Cadence

**Daily (≈2–3 focused hrs):**
1. `morning-briefing` → triage (10 min).
2. Pick lane + MCP profile for the session.
3. One content asset (Line A) — non-negotiable, it's the flywheel.
4. One software push on the lead product (Line B).

**Weekly:**
- One 16:9 cut + one written/SEO piece.
- `/security-scan` on anything that touched config/Workers.
- Metrics review → adjust next week's focus.
- `/learn-eval` + occasional `/evolve` so the system captures your conventions.

**Monthly:**
- Portfolio review against §3 ICE table — promote/validate/shelve.
- Pricing + funnel review.
- Refresh the strategy backlog (§7 open decisions in the integration doc).

---

## 8. Risk & Governance

| Risk | Mitigation |
|---|---|
| **Unverified marketing claims** | Publish only verified assets; re-cut flagged MP4s (§5) |
| **Solo-operator spread** | One lead product rule (§3); everything else validation-only |
| **AI cost creep** | sonnet default, haiku subagents, `<10 MCP/<80 tool` profiles, `/cost` |
| **Autonomy blast radius** | AgentShield + GateGuard; confirm-before-outbound; reversible-only overnight |
| **Supply-chain (ECC/MCP)** | Install ECC from verified channels only; AgentShield the config surface |
| **Single point of failure (you)** | Memory persistence + continuous-learning so the system is documented and resumable |
| **Compliance (Studio, PWAs)** | Keep "no server-side audio/data" posture; privacy/terms pages current |

---

## 9. 30 / 60 / 90 Day Plan

**Days 0–30 — Foundation & proof**
- Install ECC (single path), apply token settings, build the 3 MCP profiles.
- AgentShield pass; fix criticals; commit report.
- Prove Studio license + payment loop end-to-end with one test purchase.
- Ship 3 polished Studio themes.
- Stand up the daily content cadence (Line A) — 20+ assets in 30 days.
- Replace/​re-cut any unverified marketing MP4s.

**Days 31–60 — Distribution & memory**
- Turn on memory persistence + continuous-learning; let it capture conventions.
- Instrument the full funnel (social → site → checkout → qualified session).
- First paid acquisition experiment OR first portfolio pilot (HerdCheck user).
- `morning-briefing` + `chief-of-staff` running daily (you approve sends).

**Days 61–90 — Controlled autonomy & scale**
- Semi-autonomous loops for the render queue + PR babysitting.
- Decide Reset / Codex: ship or shelve.
- Introduce Studio pricing tier (pro themes) if early-bird traction is real.
- Monthly portfolio review → concentrate on the 1–2 things that are working.

---

## 10. What I'm Doing (this work session)

Concretely, in this branch (`claude/ecc-harness-overview-*`), I've authored a
three-document operator+business pack and committed it:

1. `docs/ecc-harness-overview.md` — what ECC is and how to install/run it safely.
2. `docs/ecc-ecosystem-integration-strategy.md` — how to wire ECC into your
   actual repo + MCP fleet (profiles, phases, collision-avoidance).
3. `docs/BUSINESS-GUIDE.md` — this file: the business the system runs.

**Boundaries I'm holding** (per your authority, but with judgment): I'm doing
all reversible, in-repo work autonomously — writing docs, structuring strategy,
committing, pushing to your branch. I am **not** doing irreversible/outbound
actions without a check: no emails sent, no Stripe writes, no prod deploys, no
installs on your machine (I can't reach it from here anyway), and no publishing
of the unverified marketing assets. Those are decisions and actions that should
stay yours.

**To turn this into execution**, the three open decisions remain (lead lane,
autonomy ceiling, where state lives — see the strategy doc §7). Tell me those
and I'll convert this guide into an ordered, dated backlog and start working the
top of it.
```
