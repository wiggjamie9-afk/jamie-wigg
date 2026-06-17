# RACK

**Auto-grading thrift cross-poster.** Dump a pile. Phone photographs the lot. AI grades condition, identifies brands, prices each item against current comp data, routes each to the channel that pays most (Poshmark / Depop / eBay / Vinted / Mercari / Grailed), and one-click cross-posts.

---

## Pitch

Resellers cross-list 50 items in 8 hours by hand. RACK does it in 40 minutes. The bottleneck has never been sourcing inventory — it's been the manual workflow of itemize-photograph-research-price-list-relist. Multimodal vision finally collapses that bottleneck.

**Tagline:** *List 50 items in 10 minutes. Dump the pile. Cash out.*

---

## TAM

- **US secondhand apparel market:** ~$70B in 2024, projected ~$73B 2025, $90B+ by 2027 (thredUP Resale Report).
- **Growth rate:** 11× faster than traditional retail; secondhand expected to be 10% of global apparel by 2030.
- **Active US resellers:** ~2M (Poshmark seller base + Depop + Mercari + eBay second-hand sellers, minus dedupe).
- **Adjacent buyers:**
  - Estate liquidation companies (~14k US firms, $20B+ industry, all manual cataloging today).
  - "Downsizers" / Marie-Kondo-ers — long tail of 30M+ Americans who Konmari'd in 2020-23 and gave the pile to Goodwill because listing was too painful.
- **Wallet share:** A serious reseller spends 25-40 hours/week on workflow. At minimum wage time-cost that's $1,500-3,000/month of invisible labor. $79/mo Pro tier is a no-brainer.
- **Bottom-up sizing:** 2M resellers × 30% conversion to a tool like this × $79/mo blended ARPU = **$570M ARR ceiling** for the core reseller segment alone. Add estate ($199 tier, ~14k firms × 20% adoption × $2,388 ACV = ~$6.7M) and downsizer one-time SKU (~$49 list-my-closet pack) for further upside.

---

## Why now

Three structural shifts in the last 18 months:

1. **Multimodal vision crossed the brand-recognition threshold.** Frontier models (Gemini 2.5, Claude 4.x, GPT-4o vision) reliably identify clothing brands from labels, fabric weave, hardware, stitching — at accuracy that was 40% two years ago and is now 95%+. Condition grading (pilling detection, hem wear, stain detection) likewise.
2. **Channel APIs matured.** Poshmark Open API (2024), Depop Shop API, eBay Trading API, Mercari partner program, Vinted bulk-list — all newly accessible to third-party developers vs. having to scrape and risk bans.
3. **Reseller economy hit a manual-workflow wall.** Pandemic-era boom created millions of new resellers; many have plateaued because adding inventory means adding hours. The market is begging for leverage.

A tool that does this in 2022 would have hallucinated brand IDs and gotten its API access revoked. In 2026 it ships.

---

## Tech stack

- **Vision layer:** Multi-image fine-tuned vision model. Base on a frontier multimodal LLM (Gemini 2.5 Flash for cost or Claude 4.7 for accuracy), fine-tuned on a proprietary 500k-image resale taxonomy (brand, sub-style, era, condition signals). Auto-segmentation of pile photos via SAM 2.
- **Pricing engine:** Real-time comp scraper + channel-API integration. For each detected item, pulls last-30-day sold comps from each supported channel; surfaces median + range + velocity. Routing decision: `channel_with_max(expected_price × predicted_sell_through / time_to_sale)`.
- **Cross-posting:** Direct integrations where available (Poshmark Open API, Depop Shop API, eBay Trading API, Mercari, Grailed Partner, Vinted Bulk). Fallback to browser automation only for unreleased APIs, with human-in-the-loop confirmation flows to stay on the right side of TOS.
- **Auto-delist:** Webhook listener on sales — when item sells on Channel A, immediately delist from B/C/D to prevent double-sale (the single most painful failure mode in manual cross-listing).
- **Front-end:** Mobile-first PWA. Native camera capture for "dump the pile" photos. No app store gatekeeping for v1.
- **Stack:** Next.js + Postgres + Cloudflare R2 for image hosting + a small queue (BullMQ) for cross-posting jobs. Vision inference via API for v1, self-hosted fine-tune at >$2M ARR.

---

## Compliance

The hardest part of this business. Each channel's TOS treats third-party cross-listers differently:

- **Poshmark:** Has an Open API (2024) — partner program available, official path exists. ✅
- **Depop:** Shop API exists. Cross-listing tools are explicitly accommodated. ✅
- **eBay:** Trading API has been open for decades. Cross-listing tools are common. ✅
- **Mercari:** Partner integrations available, formal application required. ✅ (with paperwork)
- **Grailed:** Partner API available for high-volume sellers. ⚠️ Requires negotiation.
- **Vinted:** No public API, terms-of-service prohibit automated listing. ⚠️ Either work to a partnership or build "guided manual" flow where RACK pre-fills and the user taps post.

**Bot detection avoidance is the wrong frame.** Building on scraping invites whack-a-mole bans and a brittle product. The strategy is to be the **official partner** of each channel — they want power sellers, RACK delivers more listing volume to them, partnership creates a moat against scraper-first competitors who will get banned.

**Sales tax:** Channels handle marketplace facilitator tax for buyers. RACK surfaces 1099-K thresholds for sellers (Pro tier).

---

## 90-day GTM

The reseller community is **niche, vocal, and aggregated on TikTok**. They follow each other. They share their #resellerlife wins and complaints. They have favorite influencers.

**Days 0-30 — Build the launch story:**
- Partner with 10 mid-tier #resellercommunity TikTok creators (50k-300k followers each). Give them lifetime Pro accounts in exchange for an honest "I listed 80 items in 30 minutes" video.
- Seed micro-influencers in the estate liquidator niche (smaller pond, deeper wallets).
- Document the time-savings receipts publicly — leaderboards, day-in-the-life threads.

**Days 31-60 — Content + product fit loops:**
- Daily TikTok content: "items I scanned this week → here's where RACK routed them → here's what they sold for." Visceral content, real money on screen.
- Reddit r/Flipping, r/poshmark, r/depop — measured organic seeding, not spammy.
- Free tier for downsizers (15 items/month) as a top-of-funnel; converts a subset to paid as they realize the volume.

**Days 61-90 — Conversion + scale:**
- Paid creator partnerships at scale (10 → 50 creators) — performance-based affiliate model, $20 per Pro sub.
- First estate liquidator deal — needs hand-sold; one logo unlocks the rest.
- Launch on Product Hunt for the tech-adjacent audience (less core but builds the wedge into "reseller tooling" category).

**Why not paid ads first:** Reseller community is high-skepticism, low-trust toward generic SaaS marketing. Earn the wedge through creator credibility, then scale paid.

---

## Moat

Three layers of compounding advantage:

1. **Channel pricing data** — every scan generates a comp signal across all 6 channels. After 6 months at scale, RACK has the highest-fidelity multi-channel pricing dataset for secondhand apparel in existence. That data lets RACK answer questions no individual reseller can: "Levi's 501s W32 L30 are selling 14% faster on Depop than 90 days ago — list now." This dataset gets better with every listing the platform processes.
2. **Cross-listing relationships** — partner agreements with Poshmark, Depop, eBay, Mercari, Grailed are not commodity. They take months of legal + integration work. Once locked, they're moats against new entrants and a wedge for negotiating better rev share.
3. **Brand taxonomy / fine-tuned vision** — every confirmed-correct grading the user accepts is training data. Most resale-vision models are trained on stock photography; RACK's are trained on phone photos of piles on hardwood floors. That domain-specific accuracy gap widens with usage.

A competitor would need to: (a) re-license the comp data (impossible — it's first-party), (b) re-negotiate every channel partnership (12+ months), (c) re-build the fine-tuned vision stack (capital-intensive). All three at once is a multi-year, multi-million-dollar lift.

---

## Status

Live demo: `apps/untapped/rack.html` · Landing page: `apps/untapped/rack-landing.html`
