---
name: email-marketing-automation
description: Email sequences and automation for user onboarding, retention, and conversion
---

# Email Marketing Automation

Build automated email sequences that convert free users to paid, retain customers, and drive product adoption.

## When to use

- Sending welcome sequence to new signups
- Converting trial users to paid
- Re-engaging inactive users
- Winning back churned users
- Building email community
- Driving feature adoption

## Email Sequences

### Sequence 1: Welcome Flow (Day 0-7)

**Goal:** Get new users to first success moment (create 1 beat)

```
Email 1: Welcome (Day 0, sent on signup)
├─ Subject: "Welcome to RHYTHMIX—create your first beat free"
├─ Body: 
│  - Brief brand story
│  - 3-step tutorial (login → choose vibe → generate)
│  - Link: "Create your first beat"
│  - No hard sell, just enable success
└─ CTA: "Start creating →"

Email 2: Tutorial (Day 1)
├─ Subject: "Here's how [Creator] made their first song"
├─ Body: Case study of creator's first beat
├─ Include: Before/after, time taken, vibe description
└─ CTA: "See your own first beat"

Email 3: Tips (Day 3)
├─ Subject: "3 tips to make your beats sound professional"
├─ Body: 
│  - Tip 1: Add effects (reverb, eq)
│  - Tip 2: Layer sounds
│  - Tip 3: Use reference tracks
└─ CTA: "Try these tips"

Email 4: Community (Day 5)
├─ Subject: "See what other creators made this week"
├─ Body: Showcase 3 user-generated beats
├─ Include: Creator names, vibe, how long it took
└─ CTA: "Share your beat"

Email 5: Upgrade prompt (Day 7)
├─ Subject: "[Name], you've created 5 beats—here's what's next"
├─ Body:
│  - Celebrate their 5 beats
│  - Show limitations (10 gens/month on free)
│  - Pro features they're missing (unlimited, priority processing)
│  - ROI: "Creators on Pro make $X more"
└─ CTA: "Upgrade to Pro—$9.99/mo"

Sequence analytics:
├─ Open rates: 40-50%
├─ Click rates: 8-12%
├─ Conversions (by email):
│  ├─ Email 1: 2% (enable first action)
│  ├─ Email 2: 3% (show proof)
│  ├─ Email 3: 4% (educate)
│  ├─ Email 4: 5% (build community)
│  └─ Email 5: 8% (convert)
```

### Sequence 2: Upgrade Flow (Day 7-30 if not converted)

**Goal:** Convert remaining free users to paid

```
Email 1: Fear of missing out (Day 7)
├─ Subject: "You're about to hit your generation limit"
├─ Body: They have 3 gens left this month
├─ Urgency: "Upgrade before running out"
└─ CTA: "Stay unlimited →"

Email 2: Social proof (Day 10)
├─ Subject: "Why 5,000 creators choose Pro"
├─ Body: 
│  - 5,000 users on Pro
│  - Top features they use
│  - "Most creators save $500/month by using RHYTHMIX vs competitors"
└─ CTA: "Join them"

Email 3: Limited time (Day 15)
├─ Subject: "48 hours: $99 lifetime access"
├─ Body:
│  - Special offer: One-time payment, lifetime access
│  - Savings: $500+ in annual payments
│  - Scarcity: "Ends in 48 hours"
└─ CTA: "Lock in lifetime access"

Email 4: Educational (Day 20)
├─ Subject: "Pro creators do this differently"
├─ Body: Tutorial on Pro-exclusive feature (priority rendering, API access)
├─ Show: Time saved, quality improved
└─ CTA: "See Pro features"

Email 5: Last chance (Day 28)
├─ Subject: "Your lifetime offer expires tomorrow"
├─ Body: Final push with deadline
├─ Include: Testimonial from long-time Pro user
└─ CTA: "Claim lifetime access"
```

### Sequence 3: Retention (Monthly for Pro users)

**Goal:** Keep paying customers engaged and prevent churn

```
Email 1: Value reminder (Week 1)
├─ Subject: "[Name], you've created 47 beats this month"
├─ Body: 
│  - Celebrate their productivity
│  - Compare to free users (10 gens/month)
│  - Show savings if they were on free tier
│  - "You've saved hours vs. competing tools"
└─ CTA: "Keep creating"

Email 2: Feature highlight (Week 2)
├─ Subject: "Try this Pro-only feature: Priority rendering"
├─ Body: Tutorial on underused Pro feature
├─ Include: Time savings, quality improvements
└─ CTA: "Use this feature now"

Email 3: Community (Week 3)
├─ Subject: "Top Pro creators this month"
├─ Body: Showcase top Pro users and their beats
├─ Include: Names, number of gens, best beat
└─ CTA: "See their work"

Email 4: New feature (Week 4)
├─ Subject: "We launched: [New feature]. You have early access"
├─ Body: Announce new capability
├─ Show: How it helps their workflow
└─ CTA: "Try it now"
```

### Sequence 4: Win-Back (For churned/inactive users)

**Goal:** Re-engage users who stopped generating beats

```
Email 1: "We miss you" (Day 0 after 7 days inactivity)
├─ Subject: "[Name], we miss your beats 🎵"
├─ Body: 
│  - "It's been a week since your last beat"
│  - Personalized: "You were great at lo-fi beats"
│  - Reminder of their wins
│  - No pushy sell
└─ CTA: "Make a beat"

Email 2: What's new (Day 3)
├─ Subject: "Here's what's new since you left"
├─ Body: 
│  - New models (Kling 3.1, improved effects)
│  - New features (API access, batch generation)
│  - Creator stories while they were gone
└─ CTA: "Explore what's new"

Email 3: Feedback request (Day 7)
├─ Subject: "Quick question: Why did you stop?"
├─ Body: 
│  - Ask why they stopped (too expensive, didn't fit workflow, etc.)
│  - Provide solutions
│  - Special offer: "Come back for $4.99/mo this month"
└─ CTA: "Tell us + Get 50% off"

Email 4: Social proof (Day 14)
├─ Subject: "You created amazing beats. See what's next"
├─ Body: 
│  - Show their best beat (data-driven)
│  - "10K people heard your beat" (if applicable)
│  - "Creators like you make $X/month on music sales"
└─ CTA: "Start creating again"
```

## Email Automation Setup

### Segmentation

Segment users for targeted messaging:

```
Segments:
├─ New (0-7 days): Welcome sequence
├─ Active free (1-4 weeks, not converted): Upgrade sequence
├─ Converted Pro: Retention sequence
├─ Inactive (7+ days no login): Win-back sequence
├─ Trial expiring: Last chance sequence
└─ Churned (canceled Pro): Win-back sequence

Each segment = different message
Higher relevance = higher open/click rates
```

### Frequency Capping

Don't overwhelm users:

```
Rule 1: Max 1 marketing email per day
Rule 2: Min 2 days between promotional emails
Rule 3: If user clicks CTA, skip next email in sequence
Rule 4: If user converts, move to retention sequence

Example:
└─ Day 0: Welcome (transactional, not capped)
   Day 1: Tutorial (marketing)
   Day 2: [gap]
   Day 3: Tips (marketing)
   Day 4: [gap]
   Day 5: Community (marketing)
```

### Unsubscribe Management

Make it easy to manage preferences:

```
Email footer:
├─ "Unsubscribe from all" (remove from all lists)
├─ "Unsubscribe from marketing" (keep transactional)
├─ "Manage preferences" (choose which emails you want)
└─ Preference center (users control frequency)

Legal:
├─ CAN-SPAM compliance (unsubscribe link required)
├─ GDPR compliance (easy opt-out)
└─ Privacy statement (link in footer)
```

## Email Metrics & Optimization

### Key Metrics

```
Open Rate (emails opened / emails sent)
├─ Benchmark: 20-30% (music/creator space)
├─ Improves by: Better subject lines, time of day, sender name
└─ Goal: 25%+

Click Rate (links clicked / emails opened)
├─ Benchmark: 3-5%
├─ Improves by: Clear CTA, relevant content, social proof
└─ Goal: 5%+

Conversion Rate (signups/purchases / emails sent)
├─ Benchmark: 1-3% (for paid conversions)
├─ Improves by: Urgency, social proof, limited-time offers
└─ Goal: 2%+

Unsubscribe Rate (unsubscribes / emails sent)
├─ Benchmark: <0.5%
├─ Improves by: Quality content, right frequency
└─ Alert: If >1%, too many emails
```

### A/B Testing Priority

Test in order of impact:

1. **Subject lines** (25% impact on opens)
   ```
   A: "You're about to hit your limit"
   B: "3 generations left this month"
   → Test on 50% of segment
   → Winner gets full send
   ```

2. **Sender name** (10% impact)
   ```
   A: "RHYTHMIX Team"
   B: "Sarah from RHYTHMIX"
   → Personal name wins
   ```

3. **Send time** (15% impact)
   ```
   A: Monday 9 AM
   B: Tuesday 6 PM
   C: Wednesday 12 PM
   → Test with small segment
   → Optimal time varies by audience
   ```

4. **CTA button text** (8% impact)
   ```
   A: "Learn more"
   B: "Create your first beat"
   → Specific CTA wins
   ```

5. **Content length** (5% impact)
   ```
   A: Long-form (5 paragraphs)
   B: Short-form (2 paragraphs)
   → Test audience preference
   ```

## Tools & Implementation

### Email Service Providers

```
Mailchimp (free tier available):
├─ Good for: Starting out, simple automation
├─ Cost: Free up to 500 contacts
└─ Automation: Basic (yes)

ConvertKit (recommended for creators):
├─ Good for: Creator-focused, beautiful emails
├─ Cost: $25-80/month
└─ Automation: Advanced (yes)

Brevo (formerly Sendinblue):
├─ Good for: Scale, API access
├─ Cost: Free up to 300 emails/day
└─ Automation: Advanced (yes)

For RHYTHMIX: Start with Mailchimp free, upgrade to ConvertKit when >500 subscribers
```

### Automation Workflows

```
On signup:
1. Add user to "New" segment
2. Send Email 1 (Welcome) immediately
3. Schedule Email 2 (Day 1)
4. Schedule Email 3 (Day 3)
5. Tag: "welcome_sequence_sent"

On first beat generated:
1. Move to "Active" segment
2. Skip to next email in sequence
3. Trigger celebration email

On 7 days no login:
1. Move to "Inactive" segment
2. Start win-back sequence
3. Reduce send frequency

On Pro purchase:
1. Remove from upgrade sequences
2. Add to retention list
3. Send onboarding email
```

## Email Content Best Practices

### Subject Line Formula

```
[Emotional Trigger] + [Specific Benefit]

Examples:
✅ "You're about to run out of beats—and we can help"
✅ "[Name], see what your friends created"
✅ "One-time offer: Lifetime access for $99"
✅ "48 hours: The deal you can't refuse"

Avoid:
❌ "Newsletter #47"
❌ "Exciting announcement!!"
❌ "Click here"
```

### Body Copy Best Practices

```
Format:
1. Headline (benefit-focused)
2. 1-2 sentence hook (problem or curiosity)
3. Body (max 3-4 paragraphs)
4. Social proof (if applicable)
5. Clear CTA
6. Footer (unsubscribe, company info)

Length:
├─ Welcome: 150-200 words
├─ Educational: 100-150 words
├─ Promotional: 80-120 words
└─ Transactional: 50-100 words

Tone:
├─ Personal (use "you", speak directly)
├─ Conversational (not sales-y)
├─ RHYTHMIX voice (energetic, authentic)
└─ No fluff
```

### CTA Best Practices

```
Button text (specific > generic):
❌ "Click here"
✅ "Create your first beat"

❌ "Learn more"
✅ "See Pro features"

❌ "Sign up"
✅ "Start creating free"

Placement:
├─ Top: Quick preview (if high urgency)
├─ Middle: After main content
├─ Bottom: Final push + secondary CTA

Color:
├─ Contrast with email background (important!)
├─ Color psychology: Green (go), Red (urgency), Blue (trust)
```

## Campaign Calendar

### Month 1: Foundation

```
Week 1: Welcome sequence (new users only)
Week 2: Upgrade sequence (active free users)
Week 3: Retention sequence (Pro users)
Week 4: Win-back sequence (inactive users)
```

### Month 2-3: Optimization

```
Week 1: A/B test subject lines
Week 2: A/B test send times
Week 3: A/B test CTA buttons
Week 4: Analyze results, optimize
```

### Month 4+: Scale

```
Ongoing:
├─ Run 4 core sequences (welcome, upgrade, retention, win-back)
├─ A/B test 1 element per month
├─ Add seasonal campaigns (holidays, events)
└─ Monthly revenue = % conversions × list size × value
```

## Expected ROI

```
Month 1 (200 users):
├─ Email list: 80 signups (40% conversion from website)
├─ Conversions from email: 4 (5% of list)
├─ Revenue: 4 × $9.99 = $40 + any upgrades
└─ Cost: $0 (free tier)

Month 3 (1000 users):
├─ Email list: 400 signups
├─ Conversions from email: 32 (8% after optimization)
├─ Revenue: 32 × $9.99 = $320/month
└─ Cost: $0 (still free tier if using Mailchimp)

Month 6 (3000 users):
├─ Email list: 1200 signups
├─ Conversions from email: 120 (10% optimized)
├─ Revenue: 120 × $9.99 = $1,200/month
├─ Retention revenue: 45 × $9.99 = $450/month
├─ Total: $1,650/month
└─ Cost: $50-80 (ConvertKit)

ROI: $1,650 / $80 = 20x return
```

Email automation is underrated for founder-operated startups. Once set up, it generates revenue 24/7 with minimal maintenance.
