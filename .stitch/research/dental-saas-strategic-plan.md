# Dental SaaS — strategic refresh (4-phase plan)

> Builds on `dental-saas-diagnostic.md`. This is a re-launch, not a launch — 18 months in market with 500 customers and 8% monthly churn means the framework runs on a strategic refresh, not greenfield planning.

---

## Phase 1 — Market Analysis

### Target market size & segmentation

| Segment | US count (estimate) | Notes |
|---|---|---|
| Total dental practices | ~155K | ADA: ~200K dentists, avg ~1.3 per practice |
| Solo / 1–2 dentist | ~70% (~110K) | Underserved by enterprise PMS |
| Group practices (3–10) | ~20% (~30K) | Mixed buyers |
| DSOs (multi-location) | ~10% (~15K) | Centralised buying, custom contracts |
| General dentistry | ~80% | The mainstream |
| Specialty (ortho, endo, OMS, perio, pedo) | ~20% | Each ~3–5% of total; ortho largest |

**TAM (US, current pricing):** ~155K × $89 × 12 ≈ **$165M ARR ceiling** at $89/mo. Real SAM is much smaller — cloud-curious + small-practice subset = ~50K. Realistic SOM on a 3-year horizon at current resource level: 5–10K practices ≈ **$5–10M ARR**.

### Competitors & positioning

| Competitor | Owner | Practices (est.) | Stance | Weakness |
|---|---|---|---|---|
| Dentrix | Henry Schein | ~35K | Dominant, on-prem, hardware bundle | Slow cloud pivot; clunky UX; expensive total cost |
| Eaglesoft | Patterson | ~25K | #2, on-prem, similar to Dentrix | Same as above |
| Open Dental | Independent | ~5K | Open source, low cost | Requires technical buyer; non-trivial setup |
| Curve Dental | Curve (PE) | ~5K | Cloud-first, growth-stage | Well-funded; competing for the same niche you'd pick |
| Denticon, Adit, Tab32 | Various | <5K each | Niche / DSO-focused | Small footprints |

**Positioning gap that matches your team's strengths (small, technical, cloud-native):** modern cloud + simple + non-technical-friendly + a single underserved segment. Almost certainly **not** "general practice, all features" — that's where Curve will out-fund you.

### Market timing & trends

- **Cloud migration accelerating.** ~70% of practices still on-prem; cloud share growing ~15–20%/yr. Window is real but closing — 5-year horizon, not 10.
- **Younger dentists buying practices.** Generational handover means more cloud-native buyers entering each year.
- **Patient engagement bundling.** Texting, online booking, recall — increasingly expected in core PMS.
- **AI imaging analytics.** Early; differentiator within 18–24 months.
- **DSO consolidation.** Changes top-end buying motion; if you target DSOs you'll need a sales team you don't have. Avoid.

**Timing verdict:** 18 months in is fine. Don't expand TAM ambitions — narrow them.

---

## Phase 2 — Product Strategy

### Unique value proposition

The team has 8 people (mostly technical) and a 30× larger incumbent. Out-featuring Dentrix is impossible. The only viable UVP is **focus + ease of use for one underserved segment**. Three live candidates:

1. **Solo practitioners** — "the modern Dentrix for one-chair practices, no IT person required"
2. **A specific specialty** (ortho most likely — biggest single specialty, distinct workflow) — "PMS built for orthodontists"
3. **Cloud-native millennial buyers** — segment by buyer profile, not practice type

**How to pick:** look at the current 500 customers. Which segment is over-represented and over-retaining (lower-than-8% churn)? That's your niche — let the data choose, not a workshop.

### Pricing strategy

| Tier | Price | Target |
|---|---|---|
| Solo | $69/mo | 1-chair, no imaging integration. *Only ship if diagnostic shows price is a churn driver — unlikely at $89.* |
| Standard | $89/mo (current) | Default. Keep. |
| Plus | $149/mo | Includes patient engagement (texting/recall) bundled — kills the most common integration churn cause |
| Annual prepay | −16% (2 months free) | Lifts cash + cuts annual churn ~30% (typical SaaS effect) |

### Feature roadmap (post-diagnostic, quarterly)

- **Q1**: Fix #1 churn driver from diagnostic (likely an integration gap or onboarding completion problem). Nothing else ships.
- **Q2**: Build the "moat" feature for the chosen niche — the thing Dentrix structurally cannot match.
- **Q3**: AI assist on one workflow only (imaging summary OR insurance verification OR recall scripting). Don't try to be an AI platform; be useful in one spot.
- **Q4**: API/integration platform. Increases switching cost and unlocks partner-led acquisition.

---

## Phase 3 — Go-to-Market Planning

### Launch sequence (re-launch)

| Days | Phase | Action |
|---|---|---|
| 0–60 | **Stop and fix** | Acquisition pauses. Churn diagnostic + top fix. (See `dental-saas-diagnostic.md`.) |
| 60–90 | **Re-introduce** | Restart acquisition with niche message + new pricing tier |
| 90–180 | **Compound** | Customer referral program + founder-led content engine |
| 180–365 | **Anchor** | One trade group sponsorship (AAO if ortho, AGD if general); first conference presence |

### Marketing channels at $3K/month

| Channel | Monthly | Why |
|---|---|---|
| SEO content (founder writes, contractor edits) | $1,000 | Compounds; matches technical-team strength; lowest long-run CAC |
| Customer referrals (gift cards / account credit) | $500 | Lowest-CAC channel that exists; activates after retention is fixed |
| One trade group sponsorship (annual, divided by 12) | $1,000 | Targeted reach into chosen niche |
| Software review platforms (Capterra, G2) | $500 | Where dentists who *aren't* Googling go; high intent |

No paid search until churn is below 4%. Burning $280 CAC to acquire a customer who churns in 3 months is unit-economically bankrupt.

### Success metrics

- **North Star:** net new MRR / month (must turn positive by day 90)
- **Leading:** monthly logo churn, organic signup share, demo→close rate, NPS
- **Cohort:** retention curves by signup month — watch the new-niche cohort vs. legacy

---

## Phase 4 — Implementation Roadmap

### 90-day milestones

| Day | Milestone |
|---|---|
| 30 | 20 churn interviews complete; top 2 reasons identified |
| 60 | Top fix shipped; churn measurably down (target: 8% → 6%) |
| 75 | New pricing tier live; niche message deployed on site + outbound |
| 90 | First cohort acquired against new niche message; net MRR positive |

### Resource requirements

| Resource | Allocation |
|---|---|
| Founder | 30–50% on customer calls (weeks 1–12) |
| Engineering | 1 IC dedicated to retention for 8 weeks |
| Budget | $3K/mo: shift to retention/research weeks 1–8, then back to acquisition mix |
| Deferred hire | Customer success person ($60–80K) once churn proves controllable — earliest day 120 |

### Risk mitigation

| Risk | Mitigation |
|---|---|
| Dentrix launches winback offers | Monitor competitor pricing weekly; have a 90-day price-lock for at-risk customers ready |
| Diagnostic finds a deep technical fix | Time-box to 6 weeks; if longer, negotiate a partnership instead of building |
| Founder burnout from call load | Cap founder customer calls at 15/week |
| Wrong niche choice | Re-validate at day 90 with retention-by-segment numbers; pivot if a different segment shows lower churn |
| Cash runway tightens | Track gross margin and months-of-runway monthly; pre-position a bridge before runway < 9 months |

---

## Open questions to validate before executing

1. Which segment is over-retaining among the current 500? (Run the cohort analysis week 1.)
2. What's the actual #1 churn reason? (Output of day-30 milestone — do not pre-commit Q2 roadmap until this is known.)
3. Is the founder selling on price, on relationship, or on a specific pain point? (Determines which message scales without them.)
4. What's the cash runway? Plan changes materially if it's <9 months.
