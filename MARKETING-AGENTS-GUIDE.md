# Marketing Agents Integration Guide

**Claude Ecosystem v1.4.0** — 40+ marketing skills + 200+ OpenClaw agents for autonomous marketing operations.

---

## 📊 Marketing Skills Suite (40+ Skills)

**Source:** Corey Haines' Marketing Skills (v2.0)  
**Repository:** https://github.com/coreyhaines31/marketingskills  
**License:** MIT  
**Installed:** ~/.claude/skills/ (auto-symlinked to .claude/skills/)

### Hierarchical Architecture

All 40+ marketing skills depend on **product-marketing** as the foundation:

```
                    product-marketing
                   (foundation context)
                            │
    ┌───────────┬───────────┼───────────┬───────────┬───────────┬───────────┐
    ▼           ▼           ▼           ▼           ▼           ▼           ▼
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌─────────┐ ┌────────┐
│ SEO &   │ │   CRO    │ │ Content  │ │ Paid &     │ │ Growth & │ │ Sales & │ │Strategy│
│ Content │ │          │ │ Copy     │ │Measurement │ │Retention │ │ GTM     │ │        │
└─────────┘ └──────────┘ └──────────┘ └────────────┘ └──────────┘ └─────────┘ └────────┘
```

### Skill Categories (40 Total)

#### Conversion Optimization (5 skills)
- **cro** — Pages and forms optimization
- **signup** — Registration and account creation flows
- **onboarding** — Post-signup activation and time-to-value
- **popups** — Modals, overlays, slide-ins for conversion
- **paywalls** — In-app upgrades, feature gates, monetization

**OpenClaw agents alignment:**
- `conversion-optimizer` — CRO specialist
- `funnel-analyzer` — conversion tracking
- `onboarding-flow` — activation specialist

#### Content & Copy (6 skills)
- **copywriting** — Marketing page copy (homepage, landing pages, sales)
- **copy-editing** — Polish and improve existing copy
- **cold-email** — B2B outreach sequences
- **emails** — Automated email flows and drip campaigns
- **social** — LinkedIn, Twitter/X, Instagram content
- **image** — Visual design and AI image generation

**OpenClaw agents alignment:**
- `copywriter` — direct-response copy
- `email-sequence` — email strategist
- `cold-outreach` — prospecting specialist
- `social-media` — content creator
- `ad-copywriter` — conversion copywriting
- `newsletter` — content curator
- `content-repurposer` — content extraction
- `multimedia-content-pipeline` — full-stack producer

#### SEO & Discovery (7 skills)
- **seo-audit** — Technical and on-page SEO
- **ai-seo** — AI search optimization (AEO, GEO, LLMO)
- **programmatic-seo** — Scaled page generation from templates
- **site-architecture** — Page hierarchy, navigation, URL structure
- **competitors** — Comparison pages, alternative positioning
- **schema** — Structured data markup
- **aso** — App Store and Google Play optimization

**OpenClaw agents alignment:**
- `seo-writer` — SEO content specialist
- `seo-audit` — SEO analyzer
- `youtube-seo` — video SEO
- `geo-agent` — generative engine optimization
- `schema-designer` — structured data architect

#### Paid & Distribution (3 skills)
- **ads** — Google, Meta, LinkedIn ad campaigns
- **ad-creative** — Bulk ad generation and iteration
- **public-relations** — Press, earned media, journalist outreach

**OpenClaw agents alignment:**
- `ad-copywriter` — ad copy specialist
- `influencer-finder` — partnership strategist
- `cold-outreach` — prospecting
- `geo-agent` — paid search specialist

#### Measurement & Testing (2 skills)
- **analytics** — GA4, event tracking, measurement setup
- **ab-testing** — Experiment design and analysis

**OpenClaw agents alignment:**
- `ab-test-analyzer` — experimentation analyst
- `anomaly-detector` — data quality watchdog
- `survey-analyzer` — research data analysis
- `dashboard-builder` — visualization specialist

#### Retention (1 skill)
- **churn-prevention** — Cancel flows, save offers, dunning, payment recovery

**OpenClaw agents alignment:**
- `churn-predictor` — churn modeling
- `churn-prevention` — retention strategist
- `nps-followup` — customer recovery

#### Growth Engineering (3 skills)
- **co-marketing** — Partner identification and joint campaigns
- **free-tools** — Marketing tools, calculators, utilities
- **referrals** — Referral and affiliate programs

**OpenClaw agents alignment:**
- `lead-gen` — lead generation specialist
- `referral-program-builder` → `referrals` skill

#### Strategy & Monetization (4 skills)
- **marketing-ideas** — 140+ SaaS marketing ideas
- **marketing-psychology** — Mental models, behavioral science
- **launch** — Product launches and announcements
- **pricing** — Pricing, packaging, monetization strategies

**OpenClaw agents alignment:**
- `pricing-optimizer` — pricing strategist
- `competitor-pricing` — competitive analysis
- `revenue-analyst` — business intelligence
- `product-strategist` → uses launch skill

#### Sales & RevOps (5 skills)
- **revops** — Lead lifecycle, scoring, routing, pipeline management
- **sales-enablement** — Sales decks, one-pagers, objection docs, demo scripts
- **prospecting** — Lead research and list building
- **directory-submissions** — Submit to startup/SaaS/AI directories
- **customer-research** — Customer interviews, surveys, synthesis

**OpenClaw agents alignment:**
- `revops` — revenue operations
- `sales-assistant` — sales enablement
- `sales-enablement` — collateral builder
- `cold-outreach` → cold-email skill
- `prospecting` → prospecting skill
- `objection-handler` → sales-enablement skill
- `customer-research` → customer-research skill

#### Content Strategy (3 skills)
- **content-strategy** — What to create, topic mapping, editorial calendar
- **product-marketing** — Product context (foundation for all skills)
- **marketing-plan** — Comprehensive marketing strategy document

---

## 🤖 OpenClaw Agents for Marketing (40+ Agents)

These agents power autonomous marketing workflows when combined with marketing skills:

### Immediate Availability (40+ agents)
```
Marketing-specific agents:
├── ad-copywriter (conversion-driven copy)
├── brand-designer (brand strategy, identity)
├── brand-monitor (vigilant monitoring)
├── cold-outreach (prospecting, sequences)
├── competitor-pricing (pricing analysis)
├── competitor-watch (market intelligence)
├── content-repurposer (content extraction)
├── copywriter (sharp conversion copy)
├── email-sequence (email strategist)
├── geo-agent (generative engine optimization)
├── hackernews-agent (HN growth)
├── influencer-finder (partnership strategy)
├── instagram-reels-creator (Reels specialist)
├── lead-gen (lead generation)
├── linkedin-content (LinkedIn growth)
├── multi-account-social (social ops)
├── newsletter (content curator)
├── news-curator (content curation)
├── pricing-optimizer (pricing strategy)
├── product-scrum (agile project management)
├── reddit-scout (Reddit research)
├── seo-writer (SEO content)
├── short-form-video (TikTok/Reels/Shorts)
├── social-media (content creator)
├── telemarketer (cold calling)
├── tiktok-repurposer (content recycling)
├── tiktok-video-creator (TikTok specialist)
├── thumbnail-designer (click-optimized design)
├── ugc-video (user-generated content)
├── video-ad-creator (video advertising)
├── video-scripter (video content strategy)
├── x-twitter-growth (Twitter/X growth)
├── youtube-seo (video SEO)
└── youtube-shorts-creator (Shorts specialist)

Support agents:
├── ab-test-analyzer (experimentation)
├── anomaly-detector (data quality)
├── brand-monitor (monitoring)
├── churn-predictor (retention modeling)
├── churn-prevention (retention strategy)
├── competitor-pricing (pricing intel)
├── dashboard-builder (visualization)
├── lead-qualifier (lead scoring)
├── meeting-scheduler (logistics)
├── nps-followup (recovery)
├── revenue-analyst (BI)
├── survey-analyzer (research)
└── usage-analytics (product analytics)
```

---

## 🔌 Integration Workflow

### Recommended Setup

**1. Start with product-marketing skill:**
```bash
/product-marketing

# Create or update your product context:
# - Product name, tagline, one-liner
# - Problem, solution, value proposition
# - Target audience (persona)
# - Key differentiators vs competitors
# - Current positioning
# - Marketing goals

# This becomes the context for ALL other skills
```

**2. Then use topic-specific skills:**
```bash
# Landing page copy
/copywriting
# → Uses product-marketing context

# Conversion optimization
/cro
# → Uses product-marketing context

# Email campaigns
/emails
# → Uses product-marketing context

# SEO strategy
/seo-audit
# → Uses product-marketing context
```

### Parallel Agent Execution

Use OpenClaw agents in parallel for autonomous marketing:

```bash
/dispatching-parallel-agents

Agents to run:
1. seo-writer (content creation)
2. copywriter (landing page copy)
3. ab-test-analyzer (experiment design)
4. dashboard-builder (analytics setup)
5. social-media (content calendar)

Dependencies:
- All depend on product-marketing context
- seo-writer → copywriter (share audience insights)
- ab-test-analyzer → copywriter (variant generation)
```

### Example: Launch Campaign

**Sequential workflow:**

```
1. /product-marketing
   → Define positioning, audience, key messages

2. /launch
   → Plan 30-day launch timeline

3. Parallel agents:
   ├── copywriter → landing page copy
   ├── social-media → social calendar (14 posts)
   ├── email-sequence → launch sequence (5 emails)
   ├── video-scripter → launch video script
   └── ab-test-analyzer → landing page experiments

4. /cro
   → Optimize based on early conversion data

5. /analytics
   → Track campaign KPIs
```

---

## 📋 Quick Command Reference

### Planning
```bash
/product-marketing    # Set marketing context
/marketing-plan       # Full strategy document
/marketing-ideas      # 140 SaaS ideas for brainstorm
/content-strategy     # What content to create
/launch               # Product launch plan
```

### Content & Copy
```bash
/copywriting          # Write marketing copy
/copy-editing         # Edit & polish existing copy
/cold-email           # B2B outreach sequences
/emails               # Email flows and campaigns
/social               # Social media content
/image                # AI image generation
```

### Optimization
```bash
/cro                  # Conversion rate optimization
/signup               # Registration flows
/onboarding           # Post-signup activation
/popups               # Modal and overlay optimization
/paywalls             # In-app monetization
```

### SEO & Discovery
```bash
/seo-audit            # Diagnose SEO issues
/ai-seo               # AI search optimization
/programmatic-seo     # Scaled page generation
/site-architecture    # Navigation and hierarchy
/competitors          # Competitive positioning
/schema               # Structured data
/aso                  # App store optimization
```

### Testing & Measurement
```bash
/ab-testing           # Experiment design
/analytics            # GA4 and event tracking
```

### Sales & Growth
```bash
/revops               # Lead lifecycle and pipeline
/sales-enablement     # Sales collateral
/pricing              # Pricing strategy
/referrals            # Referral programs
/churn-prevention     # Retention strategies
/co-marketing         # Partnership opportunities
```

---

## 🎯 Common Marketing Workflows

### Build a Landing Page
```
1. /product-marketing (context)
2. /cro (optimization strategy)
3. /copywriting (page copy)
4. /image (hero image)
5. /ab-testing (design variants)
6. Agent: copywriter (iterate copy)
7. Agent: ab-test-analyzer (plan tests)
```

### Create Email Campaign
```
1. /product-marketing (context)
2. /emails (campaign framework)
3. /copywriting (email body copy)
4. Agent: email-sequence (multi-email flow)
5. /ab-testing (subject line tests)
```

### SEO Content Strategy
```
1. /product-marketing (context)
2. /content-strategy (topics)
3. /seo-audit (gap analysis)
4. /programmatic-seo (scaled pages)
5. Agent: seo-writer (content creation)
6. /schema (structured data)
```

### Launch a Feature
```
1. /product-marketing (context)
2. /launch (launch timeline)
3. /copywriting (launch copy)
4. /emails (launch sequence)
5. Agent: video-scripter (launch video)
6. /social (social campaign)
7. /analytics (tracking setup)
8. Agent: ab-test-analyzer (experiment design)
```

---

## 📊 Skill Dependency Map

```
product-marketing (foundation)
  ├─→ copywriting
  ├─→ cold-email
  ├─→ emails
  ├─→ cro
  │   ├─→ ab-testing
  │   └─→ analytics
  ├─→ seo-audit
  │   ├─→ ai-seo
  │   └─→ programmatic-seo
  ├─→ launch
  │   ├─→ copywriting
  │   ├─→ social
  │   ├─→ emails
  │   └─→ analytics
  ├─→ pricing
  │   └─→ competitors
  ├─→ revops
  │   ├─→ sales-enablement
  │   └─→ analytics
  ├─→ content-strategy
  │   ├─→ seo-audit
  │   ├─→ copywriting
  │   └─→ social
  └─→ free-tools
      └─→ analytics
```

---

## 🚀 Advanced Patterns

### Multi-Channel Campaign Orchestration

```bash
Agent: multimedia-content-pipeline

Inputs:
- Product marketing context
- Launch message
- Target audience

Generates in parallel:
├── Blog post + SEO metadata
├── Landing page copy + A/B variants
├── Email sequence (5 emails)
├── Social posts (14 posts across channels)
├── Video script + thumbnails
└── Press release

Then use:
├── /cro → optimize landing page
├── /ab-testing → design experiments
├── /analytics → track everything
└── Agent: ab-test-analyzer → monitor
```

### Autonomous Marketing Team

**Create a multi-agent team that operates independently:**

```bash
Agent 1: seo-writer
  └─ Runs /content-strategy, /seo-audit, /programmatic-seo
     → Generates 10 SEO-optimized pages per week

Agent 2: copywriter (OpenClaw)
  └─ Runs /copywriting, /copy-editing, /cro
     → Optimizes landing pages, email copy

Agent 3: social-media (OpenClaw)
  └─ Runs /social, /content-strategy
     → Posts 2x daily across channels

Agent 4: ab-test-analyzer
  └─ Monitors /ab-testing, /analytics
     → Designs and analyzes experiments

All agents reference /product-marketing context
```

---

## 📈 Success Metrics

Track effectiveness of marketing skills + agents:

| Workflow | Metric | Target | Tool |
|---|---|---|---|
| Content strategy | Posts published per week | 10+ | `/content-strategy` |
| SEO | Organic traffic growth | +40% MoM | `/seo-audit`, `/programmatic-seo` |
| Copywriting | Landing page conversion | +15% | `/cro`, Agent: copywriter |
| Email | Email open rate | 35%+ | `/emails`, Agent: email-sequence |
| Social | Engagement rate | 5%+ | `/social`, Agent: social-media |
| Testing | Experiment completion | 2 per month | `/ab-testing`, Agent: ab-test-analyzer |
| Launch | Campaign reach | 10k+ | `/launch`, multimedia pipeline |
| Retention | Churn reduction | -20% | `/churn-prevention`, Agent: churn-prevention |

---

## 🔗 Resources

**Marketing Skills:**
- GitHub: https://github.com/coreyhaines31/marketingskills
- Installation guide: See skill directory

**OpenClaw Agents:**
- Catalog: 200+ agents available
- Documentation: Built-in `/help` in Claude Code

**Companion Resources:**
- Corey Haines' agency: Conversion Factory
- Newsletter: Swipe Files
- Training: AI Marketing Training
- CMO automation: Magister
- Coding guide: Coding for Marketers

---

## 📝 Version History

- **v1.4.0** — Marketing Skills v2.0 + 40+ OpenClaw agents integrated
- **v1.3.0** — Everything Claude Code framework
- **v1.2.0** — Observability + LunaRoute + Stock Platform
- **v1.1.0** — Claude-Mem + PULSE protocol
- **v1.0.0** — Core ecosystem blueprint

---

**Welcome to autonomous marketing with AI agents. 🚀**

40+ skills + 200+ agents = unlimited marketing possibilities.
