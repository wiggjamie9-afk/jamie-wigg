# 💰 Monetization & Business Strategy

Stage One approach: Build four AI companions across different life methods, with staggered launches and cross-promotion.

---

## Pricing Model: Freemium + Subscription

All four apps follow this pattern:

| Tier | Price | Features | Target Conversion |
|---|---|---|---|
| **Free** | $0 | Core features, limited usage | 100% (all users start here) |
| **Pro** | $7.99–$9.99/mo | Unlimited + AI insights | 2–5% of free users |
| **Team/Business** | $19.99–$29.99/mo | Collaboration, analytics | 0.1% of free users |

---

## Domain-Specific Pricing

### 1. Code & Building

**Free tier:**
- 5 sandbox runs/day
- Python 3.12 only
- Read-only file access
- Community support

**Pro ($9.99/month):**
- Unlimited runs
- All Docker images
- File read/write + persistence
- Priority support
- Architecture review via Claude

**Business ($29.99/month):**
- Team workspace
- Usage analytics
- Custom Docker images
- Dedicated Slack channel

**Realistic revenue:** $5k–$50k/month (500–5000 paid users)

---

### 2. Creative Assets

**Free tier:**
- 5 renders/month
- FLUX only (faster model)
- Standard resolution (1024×1024)
- Watermark

**Pro ($9.99/month):**
- Unlimited renders
- All models (FLUX, Sana, Nova)
- 4K resolution
- No watermark
- Batch generation

**Studio ($29.99/month):**
- Video generation (HunyuanVideo)
- Background removal
- Batch editing
- API access

**Realistic revenue:** $20k–$100k/month (2000–10000 paid users)

---

### 3. Learning Tools

**Free tier:**
- 1 course
- 5 lessons/week
- Basic feedback
- Ads shown

**Pro ($9.99/month):**
- Unlimited courses
- Unlimited lessons
- AI feedback on practice
- Spaced repetition scheduler
- No ads

**Tutor ($19.99/month):**
- 1-on-1 Claude sessions
- Customized learning paths
- Progress tracking
- Export certificates

**Realistic revenue:** $10k–$50k/month (1000–5000 paid users)

---

### 4. Wellness & Reflection

**Free tier:**
- Unlimited journaling
- Basic prompts
- Community prompts
- No AI insights

**Pro ($7.99/month):**
- AI insight extraction (pattern recognition)
- Mood tracking + correlation
- Weekly digest
- Private journal (encrypted)

**Therapist ($19.99/month):**
- Deeper AI reflection prompts
- Emotion mapping
- Reframe suggestions
- Export for therapy sessions

**Realistic revenue:** $5k–$20k/month (500–2000 paid users)

---

## Revenue Projections (Year 1)

### Scenario 1: Conservative (1 app ships)
```
Users acquired: 5,000
Paid conversion: 3%
Paid users: 150
ARPU (avg monthly): $8.99
Monthly revenue: ~$1,350
Annual revenue: ~$16,200
```

### Scenario 2: Moderate (2 apps ship, cross-promotion)
```
Users acquired: 20,000 combined
Paid conversion: 4% (from cross-promotion)
Paid users: 800
ARPU: $8.99
Monthly revenue: ~$7,200
Annual revenue: ~$86,400
```

### Scenario 3: Optimistic (all 4 apps ship + organic growth)
```
Users acquired: 100,000 combined
Paid conversion: 5% (network effects)
Paid users: 5,000
ARPU: $9.50
Monthly revenue: ~$47,500
Annual revenue: ~$570,000
```

---

## Cost Structure

### Per-App Fixed Costs
- **Infrastructure:** $2,000–$5,000/month (database, compute, CDN)
- **AI API costs:** $1,000–$3,000/month (Claude API, image generation)
- **Payment processing:** 3% + $0.30 per transaction
- **Customer support:** $500–$1,000/month (part-time)

### Total monthly burn: ~$5,000–$10,000 (all 4 apps at scale)

### Breakeven Point
At $7.99 ARPU with 3% payment processing cost:
- Net per user: $7.74
- Need 650 paid users to breakeven on $5k/month infrastructure
- Need 1,300 paid users to cover everything + team

---

## User Acquisition Strategy

### Phase 1: Organic (Weeks 1–12)
- Product Hunt launch ($20k impressions, 10–15% conversion to free)
- Indie Hackers community ($5k–$10k revenue first week)
- Twitter/Reddit (no paid ads)
- Cost: $0 (time + sweat)
- Target: 10,000 free users

### Phase 2: Paid (Months 3–6)
- **Google Ads:** $5/day → $1,500/month CAC budget (~150 new users/day)
- **Reddit Ads:** $2,000/month → B2B targeting
- **App store optimization:** $500/month (ASO tools)
- Cost: ~$3,500/month
- Target: 50,000 free users by month 6

### Phase 3: Scaling (Month 6+)
- Affiliate partnerships (dev blogs, YouTube creators)
- Content marketing (SEO for "AI code sandbox," "book cover generator," etc.)
- Paid CAC capped at 3× LTV (so max $22 CAC for $8.99 ARPU user)

---

## Go-to-Market Timeline

| Phase | Timeline | Goal | Launch |
|---|---|---|---|
| **Research** | Weeks 1–2 | Validate user demand | — |
| **Spec** | Weeks 3–4 | Finalize requirements | — |
| **Build** | Weeks 5–12 | MVP web app | — |
| **Beta** | Weeks 13–16 | 100 beta users | Private link |
| **Public Launch** | Week 17 | Product Hunt + organic | Public web app |
| **Mobile** | Weeks 17–24 | iOS/Android apps | App stores |
| **2nd Domain** | Month 6+ | Launch domain #2 | Cross-promote |

---

## Key Success Factors

1. **Find one domain that breaks through first** — Don't try to launch all 4 at once. Pick code or creative (highest demand), nail it, then expand.

2. **Retention over acquisition** — 1,000 users with 50% weekly retention > 10,000 users with 5% retention.

3. **Network effects** — Once 2+ apps are live, users move between them. Shared login → 30% conversion uplift on app 2+.

4. **Word-of-mouth loop** — If indie dev uses code app, they're likely to use creative app for promo videos. Design for this.

5. **Stay lean on infrastructure** — Use Vercel, Supabase, Cloudflare Workers. Avoid building servers.

---

## Decision Tree: Which Domain to Launch First?

**Code & Building:** Ship first if you want technical credibility + network (indie dev community)  
**Creative Assets:** Ship first if you want fast monetization (high willingness to pay)  
**Learning Tools:** Ship first if you believe in education market (high TAM, but slower growth)  
**Wellness:** Ship first if you're passionate about healing (lowest immediate revenue, highest impact)

**Recommendation:** Launch code or creative simultaneously (they have no audience overlap), then use learnings to inform learning + wellness.

---

## Success Metrics (Track Weekly)

- Free user signups
- Paid conversion rate
- Monthly churn rate
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- LTV:CAC ratio (should be 3:1 or higher)
- Net promoter score (NPS)

---

## Next: Validation

Before building, validate:
1. Survey 20 people in each target segment (code devs, creators, learners, reflectors)
2. Ask: "Would you pay $X/month for this?" (measure intent, not just interest)
3. Build a Figma prototype, show 10 people in segment, measure comprehension
4. Decide domain + pricing based on feedback
