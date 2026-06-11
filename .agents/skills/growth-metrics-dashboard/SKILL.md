---
name: growth-metrics-dashboard
description: Analytics framework and KPI tracking for RHYTHMIX platform growth
---

# Growth Metrics Dashboard

Track what matters: user growth, engagement, revenue, and churn. Know exactly what's working.

## When to use

- Setting up analytics for YouTube channel
- Tracking user growth metrics
- Monitoring content performance
- Measuring marketing campaign ROI
- Identifying churn/retention issues
- Making data-driven decisions

## RHYTHMIX Key Metrics

### User Growth Metrics

```
Daily Active Users (DAU)
├─ Goal: Week 1: 10, Week 4: 50, Month 3: 500
├─ Trend: Should grow 20-30% weekly in early phase
└─ Alert: If DAU flat for 2 weeks, investigate

Monthly Active Users (MAU)
├─ Goal: Week 1: 20, Month 1: 100, Month 3: 1000
├─ Formula: Cumulative unique users
└─ Benchmark: MAU/DAU ratio should be 3-5x

New User Growth
├─ Weekly new users
├─ Goal: +30% week-over-week in Month 1
├─ Month 3 goal: 100+ new users/day
└─ Plateau indicates need for marketing boost
```

### Engagement Metrics

```
Generations Per User (GPU)
├─ Formula: Total generations / total users
├─ Goal: Week 1: 3, Month 1: 10, Month 3: 25
├─ Higher GPU = product fit
└─ Alert: If GPU declining, prompts deteriorating

Session Duration
├─ Goal: 10-15 minutes average
├─ Good: Users spending time exploring
├─ Bad: <5 minutes = friction in UX
└─ Tool: Track via analytics

Feature Usage
├─ Which models do users prefer? (FLUX vs Soul vs Kling)
├─ Which templates are popular?
├─ Which export formats used most?
└─ Use to prioritize development

Return Rate (Day 7, Day 30)
├─ Day 7: % of users returning after signup
├─ Goal: 40%+ (users return within week)
├─ Day 30: % returning after month
├─ Goal: 60%+ (core users staying)
```

### Conversion Metrics

```
Signup to Trial
├─ Goal: 50%+ of visitors try free tier
├─ Formula: Trial signups / visitors
└─ Low conversion = landing page issue

Trial to Paid
├─ Goal: 5-10% of trial users convert to paid
├─ Formula: Paid users / trial users
├─ Track by: cohort date, traffic source
└─ Alert: If <3%, pricing or positioning issue

MRR (Monthly Recurring Revenue)
├─ Formula: Paid users × $9.99/mo
├─ Week 1 goal: $0, Month 3: $500+, Month 6: $5K+
└─ Track by plan tier

LTV (Lifetime Value)
├─ Formula: (Paid users × average subscription length) × $9.99
├─ Goal: >$100 per user
└─ If <$50: churn issue
```

### Content & Marketing Metrics

```
YouTube Metrics
├─ Subscribers: Week 1: 0, Month 1: 500, Month 3: 5K
├─ Monthly views: Week 1: 0, Month 1: 10K, Month 3: 100K
├─ Watch time (hours): Week 1: 0, Month 1: 500, Month 3: 5K
├─ Avg view duration: Goal: >60% of video
└─ CTR: Goal: >4%

Blog Metrics
├─ Monthly visitors: Month 1: 100, Month 3: 1K
├─ Avg time on page: Goal: >2min
├─ Conversion (email signup): Goal: 5-10%
└─ Bounce rate: Goal: <50%

Email Metrics
├─ Subscriber count: Month 1: 100, Month 3: 1K
├─ Open rate: Goal: 25-35%
├─ Click rate: Goal: 5-10%
├─ Unsubscribe: Goal: <0.5%
└─ Conversion (paid signup): Goal: 1-3%

Social Metrics
├─ Followers: Month 1: 100, Month 3: 1K
├─ Engagement rate: Goal: 3-5%
├─ Reach per post: Goal: 10x followers
└─ Traffic to site: Track via UTM parameters
```

### Churn & Retention

```
Churn Rate
├─ Monthly: Goal: <5% (95% retention)
├─ Formula: (Users lost / Users start) × 100
├─ Alert: If >10%, major issue
└─ Track by: cohort date, plan tier

Reasons for Churn
├─ Survey users who cancel
├─ Common reasons: found alternative, didn't use, too expensive
├─ Top reason gets product fix priority
└─ Track monthly

Payback Period
├─ Formula: CAC / (Monthly revenue per user)
├─ Goal: <3 months
├─ If >6 months: unsustainable acquisition
└─ Alert: if increasing
```

## Dashboard Setup

### Weekly Dashboard (Monday morning)

```
Last 7 days:
- New users: 45 (↑ 15% vs last week)
- Active users: 120 (↑ 8%)
- Generations: 1,200 (↑ 12%)
- Engagement: 10.0 gen/user (↑ from 9.2)

YouTube:
- New subscribers: 312 (↑ good)
- Views: 8,500 (↑ 20%)
- Watch hours: 850 (↑ 18%)

Top issue: [if any metric down, investigate]
Action items: [what to do based on metrics]
```

### Monthly Dashboard (1st of month)

```
GROWTH
DAU: 450 (goal: 300 ✓)
MAU: 1,250 (goal: 1000 ✓)
New users: 850 (goal: 800 ✓)

ENGAGEMENT
GPU: 15.3 (goal: 15 ✓)
Session duration: 12.4min (goal: 10-15 ✓)
Day 7 return: 42% (goal: 40% ✓)
Day 30 return: 58% (goal: 60% ✗)

CONVERSION
Trial users: 320 (signup rate: 45%)
Paid users: 18 (trial-to-paid: 5.6%)
MRR: $179 (goal: $150 ✓)
LTV: $850 (good)

CONTENT
YouTube subscribers: 2,340 (goal: 2K ✓)
YouTube views/mo: 35,000 (goal: 30K ✓)
Blog visitors: 850 (goal: 1K ✗)
Email list: 450 (goal: 500 ✗)

CHURN
Monthly churn: 3.2% (goal: <5% ✓)
Top reason: "didn't use enough" (product issue)

ACTION ITEMS
1. Improve onboarding (reduce "didn't use" churn)
2. Blog SEO audit (boost monthly visitors)
3. Email growth campaign (more subscribers)
```

## Cohort Analysis

Track users by signup cohort to see patterns:

```
Cohort: Week 1 (50 users)
├─ Week 2: 40 active (80% retention)
├─ Week 4: 28 active (56% retention)
├─ Month 2: 18 active (36% retention)
└─ Month 3: 12 active (24% retention)

Cohort: Week 5 (120 users, after marketing boost)
├─ Week 6: 110 active (92% retention) ← better onboarding
├─ Week 8: 85 active (71% retention)
├─ Month 2: 65 active (54% retention)
└─ Month 3: 48 active (40% retention)

Insight: Later cohort retains better
Action: What changed in Week 5? (onboarding email? better tour?)
```

## Attribution & Channel Analysis

Track where users come from:

```
Traffic Source (for first 100 users):
├─ YouTube: 35 users (35%)
│  ├─ LTV: $120 (high quality)
│  └─ Retention: 45% day 7
├─ Organic search: 25 users (25%)
│  ├─ LTV: $95 (moderate)
│  └─ Retention: 38% day 7
├─ Social media: 20 users (20%)
│  ├─ LTV: $60 (lower quality)
│  └─ Retention: 28% day 7
├─ Email: 15 users (15%)
│  ├─ LTV: $180 (highest)
│  └─ Retention: 55% day 7
└─ Direct: 5 users (5%)

Insight: Email + YouTube best ROI
Action: Double down on these channels
```

## Growth Levers & Experiments

Track impact of changes:

```
Experiment 1: Improved onboarding email
├─ Baseline: 35% day 7 retention
├─ With new email: 42% day 7 retention
├─ Lift: +7 percentage points
├─ Impact: 10 more users retained/month
└─ Decision: Keep new email

Experiment 2: Free tier limit reduction
├─ Baseline: 15 gen/month
├─ New: 10 gen/month
├─ Result: Churn increased from 3% to 5%
└─ Decision: Revert to 15 gen

Experiment 3: Pro tier price increase
├─ Baseline: $9.99/mo, 15% trial-to-paid
├─ New: $14.99/mo, 12% trial-to-paid
├─ Revenue impact: +18% (fewer users, higher price)
└─ Decision: Keep higher price
```

## Alerts & Thresholds

Set up automated alerts:

```
If DAU drops >20% week-over-week:
→ Alert: "Growth stalling"
→ Action: Investigate and boost marketing

If churn rises above 5%:
→ Alert: "High churn"
→ Action: Survey users, fix retention issue

If trial-to-paid drops below 3%:
→ Alert: "Conversion declining"
→ Action: Improve pricing page

If blog traffic drops >15%:
→ Alert: "SEO decline"
→ Action: Check rankings, refresh content
```

## Tools to Use

```
Analytics platform:
- Mixpanel (recommended for RHYTHMIX)
- Amplitude (alternative)
- Google Analytics (web only, but free)

Database:
- Supabase (included with backend)

Visualization:
- Google Sheets (simple, free)
- Metabase (self-hosted, free)
- Tableau (expensive but powerful)
```

## Monthly Review Process

```
1. Run dashboard report (15 min)
2. Analyze top metrics (30 min)
3. Identify issues & opportunities (30 min)
4. Plan experiments for next month (30 min)
5. Share with team (15 min)
```

## Year 1 Targets

```
Month 1:
- DAU: 50, MAU: 100
- Trial-to-paid: 5%
- MRR: $50

Month 3:
- DAU: 300, MAU: 800
- Trial-to-paid: 8%
- MRR: $400

Month 6:
- DAU: 500, MAU: 1500
- Trial-to-paid: 10%
- MRR: $2000

Month 12:
- DAU: 1000, MAU: 3000
- Trial-to-paid: 12%
- MRR: $5000
```

This data-driven approach turns gut feelings into facts. You'll know exactly what's working.
