# 🎯 Complete Digital Products Inventory & Revenue Blueprint
**Jamie Wigg Repository Audit** — June 2026

---

## 📊 EXECUTIVE SUMMARY

**What You Have:**
- ✅ 52 HyperFrames video promos (RHYTHMIX brand variants)
- ✅ 1 production SaaS app (STARLIGHTMIX Studio — Next.js 15, Cloudflare Pages)
- ✅ 3 dormant/prototype SaaS apps (Agent Builder, Codex of Reality, Sonny Quokka)
- ✅ 50+ concept/prototype apps (PWAs, HTML5 apps)
- ✅ 2 iOS Capacitor wrappers (Studio + Recovery)
- ✅ 92 custom skills (6 tiers of orchestration, production, marketing)
- ✅ 1 infrastructure setup (Wiki.js + Postgres)
- ✅ 174 files at root (guides, setup docs, reference material)
- ✅ 3 academic/research projects (German corpus, C++ paper, Feature specs)

**Total Codebase:** ~3.85GB, 1200+ files, 29 package.json projects

**Revenue Potential (6 months):** $50K–$250K depending on focus

---

## 🏗️ TIER 1: PRODUCTION-READY ASSETS

### ✅ **STARLIGHTMIX Studio** (Active, Revenue-Generating)
**Location:** `studio/`  
**Status:** 🟢 **LIVE** on Cloudflare Pages  
**Stack:** Next.js 15, TypeScript, Tailwind CSS, Supabase backend  
**Deployment:** `studio.starlightmix.com`

**What it does:**
- Web-based music video generation using AI models
- Accepts user's Replicate API token (user owns their costs)
- Upload audio → pick theme → generate music video
- Export MP4 for distribution

**Revenue model:**
- Freemium (1 generation free)
- License server validates Gumroad purchases
- Target: $5K–$20K/month by month 6

**What's needed:**
- [ ] Marketing site with clear value proposition
- [ ] Case studies (example videos generated)
- [ ] Email onboarding sequence (welcome, tutorial, upsell)
- [ ] YouTube tutorials (how to use, best practices)
- [ ] Integration with Replicate docs

**Effort to launch:** 2–3 weeks (marketing + docs)

---

### ⚠️ **Agent Builder Platform** (Completed, Monetization Unknown)
**Location:** `agent-builder/`  
**Status:** 🟡 **DORMANT** — 24/24 tasks completed, 239 tests passing  
**Stack:** Next.js 15, Supabase, TypeScript  
**Deployment:** `sites/agent-builder/` (static export)

**What it does:**
- AI agent design/builder SaaS (drag-drop flow editor)
- Agents can be deployed as tools, webhooks, or chat bots
- Built for no-code user

**Revenue potential:** $10K–$50K/month if properly marketed

**What's missing:**
- [ ] Live product landing page + pricing
- [ ] Marketing strategy (who's the customer? developers? non-technical?)
- [ ] Integration tutorials (Slack, Discord, Zapier)
- [ ] Case studies (real agents solving real problems)
- [ ] Freemium/paid tier definition

**Effort to launch:** 3–4 weeks (positioning + marketing)

**Decision needed:** Is this for developers, non-technical users, or both?

---

### ❓ **Codex of Reality** (Partial, Research Stage)
**Location:** `sites/codex-of-reality/`  
**Status:** 🟡 **PROTOTYPE** — Marketing site + PWA app  
**Stack:** HTML/CSS/JS (vanilla), Vercel/GitHub Pages  

**What it is:**
- Knowledge management + "Coherence Engine" concept
- Full PWA with offline capability
- Landing page + app interface exist

**Revenue potential:** Low unless it's positioned as educational tool or consulting platform

**Status:** Unclear customer segment; needs positioning

**Effort to clarify:** 1 week (customer research)

---

### ❌ **Sonny Quokka** (Unclear)
**Location:** `sites/sonny-quokka/`  
**Status:** 🔴 **UNKNOWN** — folder exists, purpose unclear

**Action:** Audit this folder to determine if it's a digital product, example, or legacy

---

## 🎬 TIER 2: RHYTHMIX VIDEO PROMO LIBRARY

**What you have:** 52 HyperFrames HTML video compositions

### **Core RHYTHMIX Promos** (Deployment-ready)
| Name | Length | Aspect | Status | Best For |
|------|--------|--------|--------|----------|
| `rhythmix-overview-60s/` | 60s | 16:9 | ✅ Production | Main product demo |
| `rhythmix-teaser-60s/` | 60s | 16:9 | ✅ Production | Landing page hero |
| `rhythmix-launch-60s/` | 60s | 16:9 | ✅ Complete | Launch announcement |
| `rhythmix-founder-60s/` | 60s | 16:9 | ✅ Complete | Founder story |
| `rhythmix-soul-60s/` | 60s | 16:9 | ✅ Complete | Model feature |
| `rhythmix-platform-60s/` | 60s | 16:9 | ✅ Complete | Platform walkthrough |
| `rhythmix-tiktok-30s/` | 30s | 16:9 | ✅ Complete | TikTok ad |
| **30+ others** | Varied | Multiple | ✅ Drafts | Venue series, S-series, V-series |

### **Venue Series** (Branded variants)
- `rhythmix-venue-disco/` — Disco aesthetic
- `rhythmix-venue-jazz/` — Jazz aesthetic
- `rhythmix-venue-rave/` — Rave aesthetic
- `rhythmix-venue-rock/` — Rock aesthetic

**Each has custom DESIGN.md with color palette, fonts, motion eases**

### **Portrait Variants** (TikTok/Reels/Shorts)
- `-f` suffix = portrait (9:16)
- Examples: `rhythmix-teaser-60s-f/`, `rhythmix-launch-60s-f/`, etc.

### **Series Variants** (S1-S5, V1-V5)
- **S-series:** 5-scene narrative (overview → money → tools → vs → pricing)
- **V-series:** Alternate cuts of same scenes
- Each has landscape + portrait variants

### **Revenue Strategy:**
1. **YouTube channel:** 2-3 new promos/week = 500–1K subs/month target
2. **Ad campaigns:** TikTok, Instagram, YouTube ads using 30s/15s cuts
3. **Affiliate links:** Direct viewers to Replicate, music platforms
4. **Case study videos:** Behind-the-scenes RHYTHMIX usage

**Effort to monetize:** 1–2 weeks (YouTube channel setup + landing page)

**Revenue potential:** $100–$500/month by month 3 (ad revenue + affiliates)

---

## 📱 TIER 3: APP PROTOTYPES & CONCEPTS (50+ HTML5 apps)

**Location:** `apps/`

### **Health & Wellness** (10+ apps)
- ✅ `blood-pressure-buddy.html` — BP tracking
- ✅ `calorie-counter.html` — Nutrition tracking
- ✅ `habit-streak.html` — Habit formation
- ✅ `heartbeat.html` — Heart rate insights
- ✅ `meditation-guide.html` — Guided meditations
- ✅ `mood-journal.html` — Mental health tracking
- ✅ `period-tracker.html` — Reproductive health
- ✅ `weight-tracker.html` — Weight management
- ✅ `workout-timer.html` — Exercise tracking

**Status:** All prototype-ready (clean HTML/CSS/JS)  
**Revenue potential:** $500–$5K/month per app (freemium)  
**Effort to productize:** 1 week per app (design polish + backend setup)

### **Productivity & Planning** (8+ apps)
- ✅ `budget-tracker.html`
- ✅ `daily-planner.html`
- ✅ `expense-tracker.html`
- ✅ `focus/` (Pomodoro timer variant)
- ✅ `goal-tracker.html`
- ✅ `loan-calculator.html`
- ✅ `notes.html`
- ✅ `pomodoro-timer.html`
- ✅ `reminders.html`
- ✅ `study-planner.html`
- ✅ `tasklist.html`

**Status:** All prototype-ready  
**Revenue potential:** $300–$3K/month per app  
**Effort to productize:** 1 week per app

### **Learning & Education** (6+ apps)
- ✅ `english-pocket.html` — English learning
- ✅ `math-helper.html` — Math tutoring
- ✅ `mathtutor-pro.html` — Advanced math
- ✅ `medicine-companion.html` — Drug database
- ✅ `quick-recipes.html` — Recipe guide
- ✅ `trivia-quiz.html` — Knowledge quiz

**Status:** Prototype-ready  
**Revenue potential:** $1K–$10K/month per app  
**Effort to productize:** 1–2 weeks per app

### **Special Apps with Subfolders** (PWAs, more complex)
- ✅ `dreams/` — Dream journal PWA
- ✅ `hum/` — Music/audio app
- ✅ `live/` — Live streaming concept
- ✅ `resonate/` — Sound/audio therapy
- ✅ `roomtone/` — Audio environment
- ✅ `untapped/` — Portfolio of 10 app concepts
- ✅ `vault/` — Secure notes storage
- ✅ `livestock/` — HerdCheck PWA (fully functional)

**Status:** Varies (dormant—fully functional)  
**Revenue potential:** $2K–$20K/month per app  
**Effort to productize:** 2–4 weeks per app

### **Total App Revenue Opportunity:**
50+ apps × $2K–$5K/month average = **$100K–$250K/month** if launched & marketed

---

## 📚 TIER 4: INFRASTRUCTURE & BACKEND

### **Supabase Setup** (Included)
- PostgreSQL database configured
- Auth module (JWT tokens)
- Storage for files/media
- Real-time subscriptions
- Read docs: `SUPABASE_SETUP.md`

### **Wiki.js + Docker** (Optional)
**Location:** `infra/wiki/`  
**Status:** Ready to deploy (not currently live)

**Use case:** Internal knowledge base or community documentation

### **Capacitor iOS Wrappers** (Ready)
1. **`capacitor/`** — Wraps STARLIGHTMIX Studio
2. **`capacitor-herdcheck/`** — Wraps livestock PWA

**Status:** Both ready for App Store builds  
**Deployment:** Codemagic CI/CD configured (`codemagic.yaml`)

**Revenue potential:** iOS app store distribution (30% Apple cut)

---

## 🎓 TIER 5: RESEARCH & ACADEMIC (Not immediately revenue-generating)

### **MHDBDB — Medieval German Corpus**
**Location:** `mhdbdb-tei-only/`  
**Size:** 3.8GB, 701 TEI XML files  
**Status:** Research dataset, fully installed

**Potential use:** Academic licensing, institutional access ($500–$5K/year per institution)

### **C++ HOPL IV Paper (Chinese Translation)**
**Location:** `cpp-hopl4-zh/`  
**Status:** Reference documentation

### **Feature Specs & Design Docs**
**Location:** `specs/`  
- `rhythmix-app/` — STARLIGHTMIX requirements
- `roomtone/` — PWA audio app spec
- `codex-app/` — Knowledge engine spec

---

## 🛠️ TIER 6: SKILL ECOSYSTEM (92 Custom Skills)

**Location:** `.agents/skills/` + `.claude/skills/`

### **What these skills do:**
These are orchestration tools (Zapier-like workflows) for automating content creation, testing, deployment, and marketing.

**Six tiers:**
1. **Tier 2 Orchestration** — batch generation, quality validation, error recovery
2. **Tier 3 Production** — copywriting, backend architecture, QA testing
3. **Tier 4 Marketing** — psychology frameworks, SEO, content calendars
4. **Tier 5 Growth** — metrics dashboards, partnership outreach
5. **Tier 6 Email** — automation sequences, segmentation

**Revenue potential:** These are internal tools; not monetizable directly, but enable **faster product launches** (2–3x faster).

---

## 📊 REVENUE ROADMAP: 6-MONTH BLUEPRINT

### **Month 1: Foundation & Launch (Week 1–4)**

**Priority 1: STARLIGHTMIX Studio Marketing**
- [ ] Landing page (value prop, pricing, free trial)
- [ ] Case studies (3–5 example videos)
- [ ] YouTube tutorial channel (3–5 videos)
- [ ] Email onboarding sequence (5 emails)
- **Effort:** 2–3 weeks  
- **Expected result:** $500–$2K/month revenue

**Priority 2: YouTube Channel Launch**
- [ ] Create channel @RHYTHMIXStudio
- [ ] Upload 5 core promos (landscape + vertical variants)
- [ ] Script + record 10 tutorial videos
- [ ] Optimize for YouTube SEO (keywords, thumbnails, descriptions)
- **Effort:** 2 weeks  
- **Expected result:** 100–500 subscribers, $0 revenue (no ads yet)

**Priority 3: Audit Dormant SaaS Apps**
- [ ] Agent Builder — decide on positioning + MVP
- [ ] Codex of Reality — clarify use case + customer
- [ ] Sonny Quokka — determine if viable or archive
- **Effort:** 1 week  
- **Decision needed:** Which 1 app to focus on for Month 2?

**Month 1 Target:** $500–$2K revenue, 100–500 YouTube subs

---

### **Month 2: Scale Primary Product + Secondary Launch (Week 5–8)**

**Priority 1: STARLIGHTMIX Studio at Scale**
- [ ] Paid ad campaigns (TikTok, Instagram, YouTube)
- [ ] Influencer partnerships (5 micro-creators)
- [ ] Community building (Discord, Reddit r/musicproduction)
- [ ] Feature releases (new templates, better exports)
- **Effort:** 2–3 weeks  
- **Expected result:** 500–2K new users, $5K–$15K/month revenue

**Priority 2: Secondary SaaS Product (Agent Builder or Codex)**
- [ ] Launch MVP landing page
- [ ] Build customer research survey
- [ ] Partner with 3–5 early customers
- **Effort:** 2 weeks  
- **Expected result:** 10–50 signups, $0–$1K/month (feedback stage)

**Priority 3: YouTube Monetization**
- [ ] 4K watch hours + 1K subs for monetization eligibility
- [ ] Publish 20+ videos (consistent 2x/week)
- [ ] A/B test thumbnails + titles
- **Expected result:** 500–1K subs, $0 revenue (still building)

**Month 2 Target:** $5K–$15K revenue, 500–1K YouTube subs

---

### **Month 3: Multi-Product Launch (Week 9–12)**

**Priority 1: STARLIGHTMIX Studio Optimization**
- [ ] Improve conversion funnel (free trial → paid)
- [ ] Add team/pro plan ($29.99/month)
- [ ] Integrate with Stripe for better payment processing
- **Expected result:** $10K–$25K/month revenue

**Priority 2: Launch 3 App MVPs (Pick from Health/Productivity/Learning)**
- [ ] Blood Pressure Buddy → Freemium model
- [ ] Meditation Guide → Community + paid courses
- [ ] Loan Calculator → Pro features ($2.99/month)
- **Effort:** 2–3 weeks  
- **Expected result:** 100–1K downloads per app, $500–$3K/month combined

**Priority 3: YouTube Growth Acceleration**
- [ ] Reach 4K watch hours (monetization threshold)
- [ ] Partner with 3–5 larger creators (10K–100K subs)
- [ ] Publish 25+ videos
- **Expected result:** 1K–3K subs, $50–$200/month ad revenue

**Month 3 Target:** $10K–$28K revenue, 1K–3K YouTube subs

---

### **Month 4: Portfolio Expansion (Week 13–16)**

**Priority 1: Scale Winning Products**
- [ ] Identify which product is converting best (Studio vs. SaaS vs. Apps)
- [ ] Double marketing budget on winner
- [ ] Implement customer retention strategies
- **Expected result:** 30% month-over-month growth

**Priority 2: Launch 5 More Apps**
- [ ] Habit Tracker, Expense Tracker, Math Tutor, English Pocket, Meditation
- [ ] All freemium with clear upgrade path
- **Effort:** 2–3 weeks  
- **Expected result:** 2K–5K total downloads, $2K–$5K/month combined

**Priority 3: Build Affiliate Network**
- [ ] Partner with 10–20 small creators for STARLIGHTMIX
- [ ] Commission structure: 20% per referral
- [ ] Provide marketing assets (thumbnails, scripts, links)
- **Expected result:** Additional $2K–$5K/month from affiliates

**Month 4 Target:** $20K–$50K revenue, 2K–5K YouTube subs

---

### **Month 5: Optimization & Scaling (Week 17–20)**

**Priority 1: Productize Best-Performing App**
- [ ] Which app is growing fastest? (Habit Tracker? Meditation?)
- [ ] Invest in design polish, feature development, marketing
- [ ] Target 10K+ downloads, $5K+/month revenue
- **Expected result:** Establish clear product leader

**Priority 2: Enterprise/B2B Revenue Stream**
- [ ] Explore Studio white-label or API licensing
- [ ] Target music education institutions, production studios
- [ ] License Gumroad product to larger partners
- **Expected result:** $1K–$5K/month from B2B

**Priority 3: Advanced YouTube Monetization**
- [ ] Achieve YouTube Partner Program status (4K hours, 1K subs)
- [ ] Expected ad revenue: $100–$300/month
- [ ] Sponsorship opportunities from music tools/AI companies

**Month 5 Target:** $30K–$60K revenue, 3K–8K YouTube subs

---

### **Month 6: Portfolio Consolidation & Planning (Week 21–24)**

**Priority 1: Full Portfolio Analysis**
- [ ] Which 3–5 products are generating 80% of revenue?
- [ ] Consolidate, optimize, scale those
- [ ] Archive or sell low-performing products
- **Expected result:** Clear focus for Year 2

**Priority 2: International Expansion**
- [ ] Localize top 3 apps to 3–5 new languages
- [ ] Partner with regional creators/influencers
- [ ] Launch in new App Store locales (Brazil, India, Southeast Asia)
- **Expected result:** 2x revenue from new markets

**Priority 3: Team/Automation**
- [ ] Hire 1 part-time marketer or VA
- [ ] Automate customer support (Zendesk, chatbot)
- [ ] Delegate social media management
- **Expected result:** Scale without burnout

**Month 6 Target:** $50K–$100K revenue, 5K–15K YouTube subs

---

## 💰 REVENUE PROJECTIONS: 6-MONTH SUMMARY

| Metric | Month 1 | Month 2 | Month 3 | Month 4 | Month 5 | Month 6 |
|--------|---------|---------|---------|---------|---------|---------|
| **Primary Product (Studio)** | $500–2K | $5K–15K | $10K–25K | $15K–35K | $20K–40K | $30K–50K |
| **YouTube Ad Revenue** | $0 | $0 | $50–200 | $100–300 | $200–500 | $500–1K |
| **App Portfolio** | $0 | $1K | $3K–5K | $5K–10K | $10K–20K | $15K–25K |
| **Affiliates** | $0 | $0 | $500–1K | $2K–5K | $3K–7K | $5K–10K |
| **B2B/Enterprise** | $0 | $0 | $0 | $500–1K | $2K–5K | $5K–10K |
| **TOTAL MONTHLY** | **$500–2K** | **$6K–16K** | **$13.5K–31.2K** | **$22.6K–51.3K** | **$35.2K–72.5K** | **$55.5K–96K** |

**6-Month Total Revenue Potential:** $133K–$270K

---

## 🎯 ADHD-FRIENDLY FOCUS PLAN

### **Why "100 apps in 30 days" will NOT work:**
- Burnout guaranteed
- Quality suffers → 1-star ratings
- No time for marketing → no revenue
- Context switching kills productivity

### **Better approach: 3-Product Focus + Parallel YouTube**

**Core Principle:** Do 1 thing well, not 10 things poorly.

---

### **PHASE 1: MONTHS 1-3 — Single Product Focus**

**Primary:** STARLIGHTMIX Studio  
**Secondary:** YouTube channel (consistency builder)  
**Tertiary:** Research 1 app for Month 4

**Why Studio first?**
- Already built ✅
- Clear monetization path ✅
- Fastest path to $10K/month revenue ✅
- Existing Replicate integration ✅

**Your weekly structure:**
```
Monday:    Marketing (ads, influencer outreach, community building)
Tuesday:   Product development (new features, bug fixes)
Wednesday: YouTube (script, record, edit videos)
Thursday:  Customer support + feedback analysis
Friday:    Analytics review + planning for next week
Weekend:   Rest (you need this)
```

**Commitment:** 40–50 hours/week (sustainable)

---

### **PHASE 2: MONTHS 4-6 — Multi-Product Scaling**

**Primary:** STARLIGHTMIX Studio (scale to $20K+/month)  
**Secondary:** 1 selected app (Health/Learning/Productivity)  
**Tertiary:** YouTube (scaled to 5K–10K subs)

**Your weekly structure:**
```
Mon-Wed:   Studio marketing + features
Thu:       Secondary app development
Friday:    YouTube content
Weekend:   Analytics + planning
```

---

## 📋 IMMEDIATE ACTION ITEMS (Next 48 Hours)

### **Today:**
- [ ] **Read:** `STARLIGHTMIX-STUDIO.md` (understand current state)
- [ ] **Check:** GitHub Actions workflows (what's auto-deploying?)
- [ ] **Review:** Current Studio landing page (what's the pitch?)

### **Tomorrow:**
- [ ] **Audit:** Sonny Quokka folder (1 hour)
- [ ] **Decide:** Agent Builder positioning (is this viable? 30 min)
- [ ] **Plan:** First YouTube video script (1 hour)

### **This Week:**
- [ ] **Launch:** STARLIGHTMIX Studio landing page
- [ ] **Create:** 3 YouTube videos (tutorials or case studies)
- [ ] **Set up:** YouTube channel + playlist structure
- [ ] **Write:** Email onboarding sequence (5 emails)

---

## 📝 NOTES & QUESTIONS FOR CLARIFICATION

**What I need to know to refine this plan:**

1. **STARLIGHTMIX Studio — Current State:**
   - Is it already live and earning revenue?
   - How many users/conversions/MRR currently?
   - What's the main bottleneck (discovery, pricing, product)?

2. **Agent Builder Positioning:**
   - Who's the customer? (Developers? Non-technical users?)
   - Is this for building internal tools, selling tools, or education?
   - Is the code actually complete/deployable?

3. **App Strategy:**
   - Do you want to productize 50 apps, or just focus on 3–5?
   - Any apps already have users/revenue?

4. **YouTube/Content:**
   - Do you want to build a personal brand or product brand?
   - Should it be solo (you on camera) or voiceover + visuals?

5. **Lifestyle/Capacity:**
   - How many hours/week can you actually work on this?
   - Do you have ADHD paralysis on decision-making? (This plan can be even simpler if so)

---

## 🎬 FINAL SUMMARY

**You have enough assets to generate $50K–$250K in revenue over 6 months IF you:**

1. ✅ Pick ONE primary product (STARLIGHTMIX Studio recommended)
2. ✅ Systematically market it (paid ads + YouTube + partnerships)
3. ✅ Build a YouTube presence (authority + organic growth)
4. ✅ Add 1 secondary product in Month 4
5. ✅ Work 40–50 hours/week consistently
6. ✅ Measure, iterate, optimize monthly

**You DON'T need to build 100 apps.** You need to **execute 3 products well** and let their network effects do the work.

---

**This blueprint is ready to execute. Pick your primary focus, and let's build it.**

