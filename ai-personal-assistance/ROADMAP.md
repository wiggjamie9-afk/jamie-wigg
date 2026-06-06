# 🗺️ Roadmap: Stage One Launch

Phased approach to build, test, and monetize four AI personal assistants.

---

## Phase 1: Research & Validation (Weeks 1–4)

**Goal:** Decide which domain to ship first based on user demand + revenue potential.

### Week 1: Market Research
- [ ] Competitive teardown (5 apps per domain)
- [ ] Market size estimate (TAM, SAM, SOM)
- [ ] Identify 20 target users per domain (find on Twitter, Reddit, LinkedIn)
- [ ] Document in `research/competitive-analysis.md`

### Week 2–3: User Interviews
- [ ] Interview 5 code/building users (indie devs, students)
- [ ] Interview 5 creative users (content creators, designers)
- [ ] Interview 5 learning users (career changers, skill-stackers)
- [ ] Interview 5 wellness users (journalers, reflective people)
- [ ] Record: pain points, willingness to pay, existing solutions
- [ ] Document in `research/user-interviews.md`

### Week 4: Decision + Validation
- [ ] Analyze findings → pick 1–2 domains to launch first
- [ ] Build quick Figma prototype of chosen domain
- [ ] Show prototype to 10 users in target segment
- [ ] Measure: comprehension, excitement, pricing feedback
- [ ] Document decision in `CHOSEN_DOMAIN.md`

**Output:** Clear decision on which domain(s) to build, pricing validated, target user profile locked.

---

## Phase 2: Specification (Weeks 5–8)

**Goal:** Write detailed spec for chosen domain(s) so building can start.

### Per Domain
- [ ] `specs/requirements.md` — User stories, feature list, constraints
- [ ] `specs/design.md` — Wireframes, user flows, visual direction
- [ ] `specs/tasks.md` — Engineering tasks, dependencies, estimates

**Example structure for code-building:**

```markdown
# Code & Building — Specification

## Requirements (R1–R10)
R1. User can create sandbox with Python 3.12
R2. User can run arbitrary commands
R3. User can read/write files
R4. User can get command output (stdout + stderr)
R5. User can see execution time + resource usage
...

## Design
[Wireframes: Create form → Sandbox → Results]

## Tasks (T1–T20)
T1. Backend: Sandbox creation API (OpenSandbox SDK)
T2. Frontend: Create form component
T3. Frontend: Results display component
T4. Auth: User signup + login (Supabase)
...
```

**Output:** Ready-to-build spec with 15–30 engineering tasks per domain.

---

## Phase 3: MVP Build (Weeks 9–20)

**Goal:** Ship web MVP for chosen domain to public.

### Technology Stack (All domains)
```
Frontend:    Next.js 15, React 19, TypeScript, Tailwind
Backend:     Node.js, Supabase (auth, database, storage)
AI:          Claude API (opensandbox, feedback, insights)
Hosting:     Vercel (web), Cloudflare Workers (API)
Payment:     Stripe (setup only, monetize in Phase 4)
```

### Week 9–12: Core Build
- [ ] **Backend:** User auth (Supabase)
- [ ] **Backend:** Core API (sandbox execution, rendering, etc.)
- [ ] **Backend:** Database schema (users, sessions, usage)
- [ ] **Frontend:** Landing page
- [ ] **Frontend:** Signup/login flow
- [ ] **Frontend:** Main app interface
- [ ] **Testing:** Unit tests for critical paths

### Week 13–16: Polish + Beta
- [ ] **Frontend:** Error handling + empty states
- [ ] **Frontend:** Performance optimization (lazy load, caching)
- [ ] **Backend:** Rate limiting + abuse prevention
- [ ] **Ops:** Error tracking (Sentry)
- [ ] **Beta:** Invite 50 users, collect feedback
- [ ] **Iterate:** Fix top 3 issues from beta

### Week 17–20: Pre-Launch
- [ ] **Landing page:** Marketing copy + screenshots
- [ ] **SEO:** Meta tags, Open Graph
- [ ] **Analytics:** Plausible or PostHog setup
- [ ] **Docs:** Quick-start guide, FAQ
- [ ] **Legal:** Privacy policy + ToS
- [ ] **Monitoring:** Uptime alerts, error logs

**Output:** Public web app with 100+ beta users, ready for Product Hunt + public launch.

---

## Phase 4: Launch & Monetization (Weeks 21–28)

**Goal:** Launch publicly, set up payments, hit breakeven.

### Week 21: Public Launch
- [ ] **Product Hunt:** Launch Monday at 12:01 AM PST
- [ ] **Community:** Indie Hackers, Twitter, Reddit threads
- [ ] **Press:** (Optional) Reach out to tech blogs
- [ ] **Tracking:** Monitor signups, errors, performance
- [ ] **Support:** Reply to feedback within 2 hours (first week)

### Week 22–24: Payments + Tier Setup
- [ ] **Stripe:** Activate for web subscriptions
- [ ] **Pricing:** Lock in tiers (free, pro, enterprise)
- [ ] **Upsell:** Add pro banner in app (when user hits free limit)
- [ ] **Emails:** Welcome sequence + upgrade prompts
- [ ] **Analytics:** Track conversion funnel

### Week 25–28: Mobile Apps
- [ ] **Capacitor:** Wrap web app for iOS/Android
- [ ] **App Store:** iOS TestFlight beta
- [ ] **Play Store:** Android beta release
- [ ] **App Store Optimization:** Keywords, screenshots, description
- [ ] **Launch:** Submit to stores (2-week review)

**Output:** Web + mobile apps live, first paying customers, $1k–$10k MRR (depending on launch success).

---

## Phase 5: Growth & Expansion (Months 6–12)

**Goal:** Scale chosen domain, launch 2nd domain, cross-promote.

### Months 6–8: Optimize + Scale
- [ ] **Retention:** Analyze churn, improve onboarding for <5% weekly churn
- [ ] **Paid acquisition:** Start $1k/month ad spend (if LTV:CAC is 3:1+)
- [ ] **Features:** Ship top 5 user-requested features
- [ ] **Integrations:** (If applicable) Slack, GitHub, Discord bots
- [ ] **Referral:** Implement ref program ($10 credit for each friend)

### Months 9–12: Second Domain
- [ ] **Pick domain:** Best complement (code + creative, or learning + wellness)
- [ ] **Shared auth:** Use same login system (10% conversion boost)
- [ ] **Cross-promo:** "If you like code, try creative" in app
- [ ] **Build:** Fast iteration using learnings from domain 1
- [ ] **Launch:** Product Hunt again, organic growth

**Output:** 2 apps live, 5k–10k paid users combined, $50k–$100k MRR.

---

## Critical Path (What You Can't Skip)

1. **User interviews** (2 weeks) — Don't build blind. Talk to 20 people first.
2. **Clear spec** (2 weeks) — Write it down. It saves 10x on rework.
3. **Web MVP** (12 weeks) — Get to market fast. Iterate in public.
4. **Public launch** (1 week) — Make noise. Product Hunt, Twitter, Reddit.
5. **Monetization** (1 week) — Stripe + tiers. Don't wait for perfection.
6. **Mobile wrap** (2 weeks) — Capacitor is fast. Ship to stores.

---

## Parallel Workstreams

You **don't have to do this alone.** Parallelize:

| Timeline | What | Who | Notes |
|---|---|---|---|
| Weeks 1–4 | Research | You | Can outsource to VA |
| Weeks 5–8 | Spec | You | Copy/modify existing specs |
| Weeks 9–12 | Backend | You (or contractor) | Claude can help code 80% |
| Weeks 9–12 | Design | You (or designer) | Use Figma + AI assistant |
| Weeks 13–16 | Frontend | You (or contractor) | Can parallelize with backend |
| Weeks 17–20 | Marketing | You (or content creator) | Write landing page, record demo |
| Weeks 21–24 | Payments | You | 1 day of work with Stripe |
| Weeks 25–28 | Mobile | You (or outsource) | Capacitor handles 90% |

---

## Success Metrics by Phase

| Phase | Goal | Metric | Target |
|---|---|---|---|
| **Research** | Validate demand | Interviews completed | 20 total |
| **Spec** | Clarity | Spec completeness | 100% (all tasks written) |
| **MVP** | Ship | Beta users | 100+ |
| **Launch** | Reach | Free signups week 1 | 1,000+ |
| **Monetization** | Revenue | Paid users | 50+ |
| **Growth** | Scale | Paid users (month 6) | 500+ |
| **Expansion** | 2nd domain | Conversion from app 1→2 | 30%+ |

---

## Decision Points (Kill/Pivot)

If after each phase, metrics don't hit targets, reassess:

| After | If This Happens | Decision |
|---|---|---|
| **Research** | <50% willingness to pay | Pivot to different domain |
| **Spec** | Can't write 15+ tasks | Scope creep; strip features |
| **Beta** | <10% of beta users return | Redesign core flow |
| **Launch** | <100 signups week 1 | Revisit positioning + marketing |
| **Monetization** | <2% conversion to paid | Reprice, redesign paywall |
| **Growth** | >5% weekly churn | Improve retention before scaling |

---

## Checklist to Start

- [ ] Pick one domain (code or creative recommended)
- [ ] Create folder in `ai-personal-assistance/01-code-building/` (or chosen domain)
- [ ] Copy spec template into `specs/requirements.md`
- [ ] Schedule 5 user interviews this week
- [ ] Document findings in `research/user-interviews.md`
- [ ] Create decision doc when interviews are done
- [ ] Share with someone for feedback before building

**Next:** Start Week 1. Go interview users.
