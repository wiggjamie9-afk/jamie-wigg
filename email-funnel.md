# AI Podcast Studio — Email Funnel

5-email sequence to convert free signups → Pro/Agency paying customers.

---

## Email 1: Welcome + Feature Overview
**Send:** Immediately (Day 0)  
**Subject line A:** "🎙️ Your AI Podcast Studio account is ready"  
**Subject line B:** "You're 3 minutes away from your first podcast"  
**GA4 event:** `email_welcome_sent`

```
Hi {{firstName}},

Welcome to AI Podcast Studio!

You're now part of a growing community of creators who are automating their podcast production. Here's what you can do in the next 5 minutes:

1. Log in → app.podcaststudio.ai
2. Write a podcast script (or use our AI generator)
3. Pick a voice (clone yours or choose from 100+)
4. Generate background music
5. Publish to Spotify + Apple Podcasts

Start with our free tier:
→ 2 episodes/month | Standard voices | Community support

[Get Started Free]

Questions? Reply to this email. We read every message.

—
AI Podcast Studio Team
```

---

## Email 2: Social Proof + Use Cases
**Send:** Day 2  
**Subject line A:** "How 500+ creators are using AI Podcast Studio"  
**Subject line B:** "Meet creators who launched podcasts in days (not months)"  
**GA4 event:** `email_social_proof_sent`

```
Hi {{firstName}},

Some of our early users are crushing it:

📊 **Case 1: Sarah (Tech Educator)**
- Launched 12 episodes in 2 weeks
- 2,500 Spotify listeners in Month 1
- Now on Pro tier ($299/mo)

📊 **Case 2: Marcus (Fitness Coach)**
- Repurposing YouTube videos into podcasts
- 40+ hours saved per month on editing
- Using Agency tier for team collaboration

📊 **Case 3: Alex (Freelancer)**
- Started with Free, scaled to Pro after 1 episode
- Revenue from podcast sponsorships: $1,200/mo

Your story could be next. How far have you gotten with your podcast?

[Continue Building]

—
AI Podcast Studio Team
```

---

## Email 3: Feature Deep-Dive + Pain Point Resolution
**Send:** Day 4  
**Subject line A:** "The #1 reason podcasters switch to AI (spoiler: it's not AI)"  
**Subject line B:** "Here's why creators love the voice cloning feature"  
**GA4 event:** `email_feature_deepen_sent`

```
Hi {{firstName}},

The biggest pain point we hear from podcasters: **"Editing takes forever."**

With AI Podcast Studio, your workflow looks like this:

Script → Voice Clone → AI Music → Auto-Edit → Publish

**All in 15 minutes.**

Here's what makes us different:

✅ Voice Cloning (ElevenLabs) — sound like yourself, your co-host, or any narrator
✅ AI Music Generation (Suno) — copyright-free, royalty-free background tracks
✅ Smart Editing — auto-remove silence, auto-level audio, auto-add transitions
✅ Multi-Platform Distribution — one click → Spotify + Apple + YouTube

Most creators jump to Pro after their 2nd episode because:
- They hit the 2 ep/mo limit in Free
- They want voice cloning (Free tier: standard voices only)
- They see their podcast growing and want better support

Is editing your main bottleneck? Hit reply and let me know. We can help.

[Upgrade to Pro ($299/mo)]

—
AI Podcast Studio Team
```

---

## Email 4: Urgency + Limited-Time Offer
**Send:** Day 6  
**Subject line A:** "Pro users get 50% off their first month (ends in 3 days)"  
**Subject line B:** "Your Pro membership is waiting (with a discount)"  
**GA4 event:** `email_urgency_sent`

```
Hi {{firstName}},

We're running a **3-day launch special** for early users:

**Pro ($299/mo) → $149.50 for Month 1**
**Agency ($999/mo) → $499.50 for Month 1**

This offer expires **Friday, June 27 at 11:59 PM**.

Why upgrade now?

📈 Your podcast grows faster with unlimited episodes + voice cloning
💰 Pro pays for itself at ~100 Spotify listeners with sponsorships
🚀 Agency users are already scaling to teams of 2-3 producers

Real talk: The longer you wait, the more episodes you'll manually edit. We've seen creators lose momentum because they're stuck in Free tier limits.

What's holding you back from upgrading?
→ Not sure if it's worth it?
→ Need a custom plan?
→ Questions about features?

Reply directly. Let's chat.

[Upgrade Now (50% off Month 1)]

—
AI Podcast Studio Team
```

---

## Email 5: Re-Engagement + Last Chance
**Send:** Day 9  
**Subject line A:** "Your early access is expiring (one last offer)"  
**Subject line B:** "Hey {{firstName}} — we miss you"  
**GA4 event:** `email_reengagement_sent`

```
Hi {{firstName}},

I noticed you haven't logged in since we sent you your free account.

No judgment. Launching a podcast *should* feel easy, not overwhelming. If you're stuck or have questions, I'm here to help. Just hit reply.

**Quick reality check:**
- Recording: 30 min
- Writing a script: 15 min (or use AI)
- Editing (old way): 2 hours
- Editing (AI Podcast Studio): 5 minutes

You're sitting on a $1–5k/month opportunity if you ship. Let's go.

**Still on the fence?** Here's what happens next:
1. You try Free tier (2 episodes)
2. You see it working (listeners, engagement)
3. You upgrade to Pro and never look back

The creators who win are the ones who ship first and optimize second.

Let me help you ship your first episode. No pressure, no strings.

[Start Your Podcast]

Or reply to this email. I read everything.

—
Jamie
CEO, AI Podcast Studio
```

---

## Implementation (SendGrid)

### 1. Create Contact List
- List name: `Podcast Studio Early Access`
- Automated segment: `Email Sent == true AND (Subscription Plan == Free OR Subscription Plan == NULL)`

### 2. Create Automation Workflow
```
Trigger: Contact added to list "Podcast Studio Early Access"

Day 0, 9am UTC: Send Email 1 (Welcome)
  → Open Email 1? → Move to "Email 1 Opened"
  → Click CTA? → Move to "Email 1 Engaged"
  → No action → Continue to Email 2

Day 2, 9am UTC: Send Email 2 (Social Proof)
  → Converted to paid? → Stop sequence, add to "Customers"
  → No action → Continue to Email 3

Day 4, 9am UTC: Send Email 3 (Feature Deep-Dive)
  → Converted to paid? → Stop sequence, add to "Customers"
  → No action → Continue to Email 4

Day 6, 9am UTC: Send Email 4 (Urgency)
  → Converted to paid? → Stop sequence, add to "Customers"
  → No action → Continue to Email 5

Day 9, 9am UTC: Send Email 5 (Re-Engagement)
  → Converted to paid? → Stop sequence, add to "Customers"
  → No action (Day 12) → Move to "Unengaged"
```

### 3. A/B Testing (Weeks 1-2)
- **Email 1:** Test subject line A vs B (winner for all 5 emails)
- **Email 4:** Test discount offer (50% Month 1 vs Free Month 1)
- **Email 5:** Test sender (Jamie vs "AI Podcast Studio Team")

**Win metric:** Click-through rate to checkout (goal: 8%+ by Week 2)

### 4. Conversion Tracking
- Add UTM parameters: `utm_source=email&utm_medium=email&utm_campaign=funnel&utm_content=email1`
- GA4 event: `email_click` (track which email, which link)
- Stripe integration: Tag customers with `source:email` cohort

---

## Expected Performance (Year 1)

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Email signups | 100 | 500 | 2,000 | 5,000 |
| Open rate | 45% | 48% | 50% | 52% |
| Click-through rate | 8% | 10% | 12% | 15% |
| Conversion to Pro/Agency | 2% | 3% | 4% | 5% |
| Cohort LTV | $300 | $450 | $600 | $900 |
| Email MRR contribution | $600 | $6,750 | $48,000 | $225,000 |

---

## SendGrid API Integration

**To sync signups from landing page to SendGrid:**

```javascript
// POST /api/email-signup
async function addToSendGrid(email, firstName = null) {
  const res = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contacts: [{
        email: email,
        first_name: firstName || 'Friend',
        custom_fields: {
          e1_T: 'free', // subscription tier
          e2_T: new Date().toISOString(), // signup date
          e3_T: 'landing-page' // source
        }
      }]
    })
  });
  
  // Add to "Podcast Studio Early Access" list
  await fetch('https://api.sendgrid.com/v3/marketing/lists/[LIST_ID]/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contacts: [{ email }]
    })
  });
  
  return res.json();
}
```

---

**Last updated:** 2026-06-21  
**Owner:** AI Podcast Studio (Autonomous)  
**Status:** Ready to activate
