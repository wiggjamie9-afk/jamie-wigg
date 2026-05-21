# RESONATE — Launch-Day Operations Checklist

> **T+0 = Monday 2026-06-08** (RHYTHMIX umbrella launch week).
> Audience: warm FREQUENCY list converting to founding-100 at **AU$30 lifetime**.
> Hosting: `rhythmixapp.com.au/resonate` · Checkout: Gumroad · Forms: Formspree · Analytics: Plausible.
> All times **AWST (Perth, UTC+8)** unless noted. Owners: **J** = Jamie (founder), **VA** = virtual assistant, **DEV** = on-call dev.
> Pairs with `launch-kit/distribution/launch-week-calendar.md` (umbrella) and `launch-kit/resonate/email-sequence.md` (5-email arc).

---

### T-30 days (2026-05-09)

- [ ] Provision `rhythmixapp.com.au/resonate` subdomain + SSL cert on host — DEV — done?
- [ ] Stand up staging URL `staging.rhythmixapp.com.au/resonate` for QA — DEV — done?
- [ ] Create Gumroad product "RESONATE — Founding 100" at AU$30, 100-unit cap, lifetime licence — J — done?
- [ ] Open Plausible (or Fathom) site for `rhythmixapp.com.au`, install snippet on staging — DEV — done?
- [ ] Draft press release v1 in `launch-kit/resonate/press-release.md` — J — done?
- [ ] Begin populating `launch-kit/distribution/influencer-list.md` — replace 5 of 30 placeholders with real verified handles — VA — done?
- [ ] Open ConvertKit (or Beehiiv) sequence shell — 5 emails imported as drafts, send times not yet set — J — done?
- [ ] Create Linear project "RESONATE — Launch Ops" with workflows: Bug, Refund, Support, Press — DEV — done?
- [ ] Book 30-day Uptime Robot / BetterStack monitor for landing + Gumroad redirect — DEV — done?

---

### T-14 days (2026-05-25)

- [ ] Deploy `resonate.html` to production behind a `noindex` meta + basic-auth gate — DEV — done?
- [ ] Wire Formspree endpoint for waitlist + contact form; smoke-test 3 submissions from incognito — DEV — done?
- [ ] Confirm Gumroad webhook posts purchase events to Zapier → ConvertKit "founding-member" tag — DEV — done?
- [ ] Finalise the first 5 influencers from `influencer-list.md` (TikTok wave); write 5 custom-DM drafts — J — done?
- [ ] Draft 3 podcast pitch emails (one per host, custom angle) for shows in Category 4 — J — done?
- [ ] Schedule Email 1 (T-7 Tease) in ConvertKit for 2026-06-01 07:30 AEST — J — done?
- [ ] Schedule Email 2 (T-3 Science) in ConvertKit for 2026-06-05 07:30 AEST — J — done?
- [ ] Schedule social posts (LI/X) for T-7 → T-3 via Buffer or native scheduler — VA — done?
- [ ] Write SEO blog "The science of 0.1 Hz coherence" — publish slot reserved T-5 — J — done?
- [ ] Spin up `support@rhythmixapp.com.au` shared inbox; route to Linear via Zapier — DEV — done?
- [ ] Pre-write 8 canned support replies (refund, install, AirPods compat, Watch compat, no Watch fallback, account, receipt, "is it really lifetime") — VA — done?

---

### T-7 days (2026-06-01, Monday)

- [ ] Remove basic-auth + `noindex` from `rhythmixapp.com.au/resonate`; verify it 200s globally (test from Sydney, London, NYC via uptime monitor) — DEV — done?
- [ ] Send Email 1 (Tease) at 07:30 AEST — J — done?
- [ ] Post LI Post 1 (Founder origin) at 08:00 AWST per umbrella calendar — J — done?
- [ ] Send embargoed press release to 25-journo list, embargo lifts 2026-06-08 06:00 AWST — J — done?
- [ ] DM first 5 influencers (TikTok wave) with free founding-100 code — J — done?
- [ ] Confirm 3 podcast interviews booked for T+1 → T+7 window — J — done?
- [ ] Verify Formspree returns the right confirmation page + auto-reply email — DEV — done?
- [ ] Buy one test Gumroad purchase from a personal card, confirm receipt + ConvertKit tag fires — J — done?
- [ ] Publish SEO blog "Science of 0.1 Hz coherence" with internal link to `/resonate` — J — done?
- [ ] Set Plausible goal: `purchase_complete` (Gumroad return URL) + `waitlist_signup` — DEV — done?
- [ ] Brief VA on launch-day support shift roster (see T+0 section) — J — done?

---

### T-3 days (2026-06-05, Friday)

- [ ] Send Email 2 (Science) at 07:30 AEST — J — done?
- [ ] Post LI Post 3 (Master pillar) at 08:00 AWST — J — done?
- [ ] A/B test setup: split Email 3 subject lines A vs B 50/50 in ConvertKit, 90-min decision window — J — done?
- [ ] Final QA pass on Gumroad: test purchase, refund, re-purchase flow end-to-end — DEV — done?
- [ ] Stress-test landing page: WebPageTest from 3 regions, p75 LCP < 2.0s — DEV — done?
- [ ] Schedule Email 3 (Launch) for 2026-06-08 07:30 AEST as a draft (NOT live-scheduled until T-1 freeze) — J — done?
- [ ] Confirm press list received PR; chase 5 non-openers personally — J — done?
- [ ] Lock T+0 social copy in Buffer; share preview link to VA for sanity check — VA — done?

---

### T-1 day (2026-06-07, Sunday)

- [ ] **DEPLOY FREEZE** on `rhythmixapp.com.au` from 12:00 AWST — DEV — done?
- [ ] Final Gumroad smoke-test: 1 real purchase, 1 refund, confirm both — J — done?
- [ ] Live-schedule Email 3 in ConvertKit for Mon 07:30 AEST (warm list first, before public) — J — done?
- [ ] Post LI Post 4 ("Tomorrow.") at 19:00 AWST — J — done?
- [ ] Press follow-up: chase any non-responding journos with a 1-line nudge — J — done?
- [ ] Confirm support inbox empty; VA on standby for 06:00–14:00 AWST T+0 shift — VA — done?
- [ ] Verify Uptime Robot alerts route to Jamie's phone + DEV's phone — DEV — done?
- [ ] Pre-write the T+0 09:00 "we're live" personal post for IG/Threads (no scheduler) — J — done?
- [ ] Charge phone, laptop, backup hotspot; confirm Perth wifi + 5G failover — J — done?

---

### T+0 — LAUNCH DAY (2026-06-08, Monday) — schedule in AWST

- [ ] **06:00 AWST** — Sanity check: landing 200s, Gumroad checkout live, Formspree responding — DEV — done?
- [ ] **07:30 AWST** — Email 3 (Launch) fires to warm list; monitor opens in ConvertKit for 30 min — J — done?
- [ ] **08:00 AWST** — LI Post 5 + big launch X tweet go live per umbrella calendar — J — done?
- [ ] **08:30 AWST** — Launch X thread (15 tweets) drops 30 min after big tweet — J — done?
- [ ] **09:00 AWST** — Personal IG/Threads post from Jamie's main account (manual, no scheduler) — J — done?
- [ ] **10:00 AWST** — **CRITICAL CHECK:** first 10 founding-100 sales? If < 5, trigger rollback (umbrella calendar §Rollback) — J — done?
- [ ] **12:00 AWST** — TikTok landing-page walkthrough goes live; founding count auto-updates on page — VA — done?
- [ ] **14:00 AWST** — Mid-day refund-window reminder: refunds open for 30 days, document any requests in Linear — VA — done?
- [ ] **16:01 AWST** — ProductHunt main launch (00:01 PST); reply to every PH comment within 5 min for first 2h — J — done?
- [ ] **20:00 AWST** — Show HN submission (`hackernews-show.md`); reply to every HN comment for first 6h — J — done?
- [ ] **22:00 AWST** — Hourly sales check; if founding-100 sold out, swap landing CTA to "waitlist for v2 price" — DEV — done?
- [ ] **23:30 AWST** — End-of-day stat snapshot to Linear: sales, refunds, traffic, top referrer — J — done?

---

### T+1 day (2026-06-09, Tuesday)

- [ ] **08:00 AWST** — Post-mortem stand-up: J + VA + DEV review T+0 numbers, top 3 issues — J — done?
- [ ] Record podcast #1 (booked T-14) — J — done?
- [ ] LI Post 6 (Day-1 numbers + thank-you screenshots) at 09:00 AWST — J — done?
- [ ] Reply to every Show HN comment from overnight US traffic; aim for ≤ 2h response time — J — done?
- [ ] Process any refund requests within 4h SLA; log root cause in Linear — VA — done?
- [ ] Send personal thank-you DM to the first 25 founding-100 buyers — J — done?
- [ ] Trigger NPS micro-survey to first 25 buyers (3 questions, in-app or email) — J — done?
- [ ] Hot-fix any P1 bugs found during T+0; deploy window reopens 10:00 AWST — DEV — done?

---

### T+2 days (2026-06-10, Wednesday)

- [ ] Send Email 4 (Modes / proof) at 07:30 AEST — J — done?
- [ ] LI Post 7 (Distribute pillar) per umbrella calendar — J — done?
- [ ] Reach out to next 5 influencers from the list (wave 2) with first-48h sales as proof — J — done?
- [ ] Publish a public sales-counter widget on `/resonate` ("XX/100 founding spots left") — DEV — done?

---

### T+5 days (2026-06-13, Saturday)

- [ ] Send Email 5 (Last call) at 09:00 AEST — founding-100 closes midnight AEST — J — done?
- [ ] Switch landing CTA to a countdown timer (midnight AEST) — DEV — done?
- [ ] Final push DM to wave-2 influencers who haven't posted yet — VA — done?

---

### T+7 days (2026-06-15, Monday — week-2 Monday, one day past umbrella T+7 Sun)

> *Umbrella calendar sets RHYTHMIX wrap at Sun T+7 2026-06-14. RESONATE-specific T+7 falls Mon 2026-06-15.*

- [ ] Founding-100 retro: total sold / refund rate / NPS / top complaint — J — done?
- [ ] Raise floor price on Gumroad to v2 standard price; archive AU$30 SKU — J — done?
- [ ] Publish "First 100 buyers — what we learned" post on LI + X — J — done?
- [ ] Re-ping press list with launch-week numbers (refer to umbrella T+4 Press follow-up) — J — done?
- [ ] Record podcast #2 — J — done?
- [ ] Move all open Linear support tickets older than 7 days to triage review — VA — done?

---

### T+14 days (2026-06-22, Monday)

- [ ] **Refund window closes 2026-07-08** — log the cohort refund rate; if > 8%, root-cause in Linear — VA — done?
- [ ] Send "D+14 customer-success" email to all founding-100: usage stats, next-month content drop preview, ask for testimonial — J — done?
- [ ] NPS round 2 to founding-100 (after they've had 2 weeks of use) — J — done?
- [ ] Record podcast #3 — J — done?
- [ ] Publish first founding-member testimonial as LI + X post — J — done?
- [ ] Cohort analysis: which acquisition channel produced highest-NPS buyers? — J — done?

---

### T+30 days (2026-07-08, Wednesday)

- [ ] **Refund window officially closes** at end of day — generate the final refund-rate report — VA — done?
- [ ] Ship the first promised monthly content drop (new mode or bed) to founding-100 — J — done?
- [ ] Publish "30 days in: RESONATE by the numbers" public post — J — done?
- [ ] Archive launch Linear project; spin up "RESONATE v1.1" project — J — done?
- [ ] Decommission launch-only infrastructure (countdown widget, sold-out CTA logic) — DEV — done?
- [ ] Compile launch retro doc in `launch-kit/resonate/POST-LAUNCH-RETRO.md` — J — done?
- [ ] Brief the wave-3 (YouTube) outreach with 30-day proof numbers — J — done?

---

## Cross-cutting watchlist (every day T-1 → T+7)

- Uptime Robot alert on `/resonate` 5xx for > 60s → page DEV.
- Gumroad daily reconciliation: sales count vs ConvertKit "founding-member" tag count must match within ±1.
- Support inbox: 4h SLA T+0–T+1, 24h SLA after.
- Refund requests: never argue; refund within 1 business day; log root cause.
