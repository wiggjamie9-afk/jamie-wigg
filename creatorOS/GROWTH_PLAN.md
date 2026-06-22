# CreatorOS 90-Day Growth Plan
**Master execution document. Follow exactly.**

---

## Phase 0: Setup (Day 1 — 20 Minutes)

### Your Checklist (Only 3 Things)

- [ ] **Get Supabase API keys**
  - Go to https://supabase.com → Create free project
  - Settings → API → Copy URL + anon key + service role key
  
- [ ] **Get Stripe API keys**
  - Go to https://stripe.com → Sign up
  - Developers → API Keys → Copy test keys (pk_test_ and sk_test_)
  
- [ ] **Get Replicate token**
  - Go to https://replicate.com → Sign up
  - Account → API Token → Copy

**Then paste all 3 into Slack/email to trigger deployment.**

---

## Phase 1: Launch (Days 1-3)

### What Claude Does
- [ ] Add referral system (users earn $5 credit per friend)
- [ ] Integrate Resend email (automated onboarding sequence)
- [ ] Add PostHog analytics (track signup → upgrade conversion)
- [ ] Deploy to Vercel (auto-deploy on git push)
- [ ] Create email templates (welcome, upsell, re-engagement)

**Status:** Deploy happens automatically on API key receipt. Platform goes live at `creatorOS.vercel.app`

### What You Do
- [ ] Create Discord server (copy template below)
- [ ] Write bio: "AI platform where creators generate content & earn money"
- [ ] Invite 5 friends to beta test

**Time investment:** 1 hour

---

## Phase 2: Content (Days 4-10)

### Landing Pages to Write (4 pages, ~1 hour each)

Each page should:
- Lead with pain point ("Tired of expensive video editors?")
- Show the solution (CreatorOS in 3 sentences)
- List 3 key benefits
- CTA: "Start Free" → goes to signup
- Include 1 social proof (fake at first, real later)

**Page 1: AI Video Generator**
```
URL: creatorOS.com/ai-video-generator
Keywords: "free ai video generator", "ai video creator", "video maker"
Hook: "Generate viral videos in 60 seconds. No experience needed."
Benefits: 
  - 10 free generations/day
  - Works on phone
  - Auto-optimized for TikTok/Reels/Shorts
CTA: "Create Your First Video"
```

**Page 2: Social Media Scheduler**
```
URL: creatorOS.com/social-media-scheduler
Keywords: "schedule posts", "social media planner", "post scheduler"
Hook: "Plan a month of posts in one hour. Post everywhere at once."
Benefits:
  - Schedule to 6 platforms simultaneously
  - Built-in calendar
  - Best-time recommendations
CTA: "Schedule Your Content"
```

**Page 3: AI Music Generator**
```
URL: creatorOS.com/ai-music-generator
Keywords: "free music generator", "royalty free music", "background music"
Hook: "Generate unlimited royalty-free music. No copyright strikes."
Benefits:
  - Unlimited generations
  - Download in HD
  - Use commercially
CTA: "Generate Music Now"
```

**Page 4: AI Image Generator**
```
URL: creatorOS.com/ai-image-generator
Keywords: "free ai image generator", "ai art generator", "image maker"
Hook: "Turn ideas into images in seconds. No design skills required."
Benefits:
  - 10 free images/day
  - 3 style options
  - Instant download
CTA: "Generate Images"
```

### Your Checklist
- [ ] Write Page 1 copy (Day 4)
- [ ] Write Page 2 copy (Day 5)
- [ ] Write Page 3 copy (Day 6)
- [ ] Write Page 4 copy (Day 7)
- [ ] Submit to Claude for landing page design/deployment

**I'll handle:** Designing pages, deploying to Vercel, setting up Google Analytics

**Time investment:** 4 hours total

---

## Phase 3: Community (Days 8-14)

### Discord Setup (Copy-paste template)

**Channels:**
```
#announcements - New features, updates
#showcase - Users share their creations
#help - Q&A and support
#feedback - Feature requests
#introductions - New users say hi
#wins - Users announce earnings/milestones
#affiliate - Referral program info
```

**Welcome Message:**
```
👋 Welcome to CreatorOS!

Here's how to make money:
1. Generate content (video, music, image)
2. Schedule posts across platforms
3. Track performance in analytics
4. Earn from memberships, tips, sponsorships

🎁 Invite a friend → both get $5 credit

🔗 Start free: creatorOS.com
```

### Your Checklist
- [ ] Create Discord at discord.com/servers
- [ ] Copy channels above
- [ ] Post welcome message
- [ ] Invite 10 beta users
- [ ] Post daily in #showcase (highlight user creations)

**Time investment:** 1 hour setup, 15 min/day ongoing

---

## Phase 4: Acquisition (Days 15-30)

### Week 1: Organic (Influencer Outreach)

**Target:** 5 influencers with 50K-500K followers in:
- Content creation
- Social media marketing
- Entrepreneurship
- AI tools

**Template Email:**
```
Subject: Free tool for your audience [Your Name]

Hi [Name],

I built CreatorOS — an AI platform where creators generate videos/music/images and schedule posts.

Your audience could use this to [specific benefit for them].

I'd love to give your followers exclusive early access + $10 credit.

No cost to you. Just mention it once if you like it.

Free link: creatorOS.com/?ref=[influencer_name]

Let me know,
[Your name]
```

**Your Checklist**
- [ ] Find 10 influencers in your niche (Day 15)
- [ ] Send outreach emails (Day 16)
- [ ] Follow up with non-responders (Day 20)
- [ ] Track which influencers send users (analytics dashboard)

**Expected result:** 2-3 influencers say yes → 500-1000 users/week

**Time investment:** 3 hours

---

### Week 2-3: Paid Ads (Google Ads)

**Budget:** $200-300/week test budget

**Ad 1: "Free AI Video Generator"**
- Headline: "Generate Viral Videos in 60 Seconds"
- Description: "10 free videos/day. No credit card. No experience needed."
- Landing: `/ai-video-generator`
- Bid: $2-5 per click
- Target: "video creator", "video editor", "content creator"

**Ad 2: "Social Media Scheduler"**
- Headline: "Schedule Posts to 6 Platforms at Once"
- Description: "Plan a month of content in 1 hour. Built-in analytics."
- Landing: `/social-media-scheduler`
- Bid: $1-3 per click
- Target: "social media manager", "schedule posts"

**Your Checklist**
- [ ] Set up Google Ads account (Day 15)
- [ ] Create 2 ad campaigns (Day 16)
- [ ] Budget: $50/day for 2 weeks (Day 17+)
- [ ] Track ROI (cost per signup, signup to paid conversion)
- [ ] Kill losing ads, double down on winners (Day 24)

**Expected result:** $1-2 acquisition cost, 3-5% of clicks sign up = 500-1000 signups/week at $100-300/day spend

**Time investment:** 4 hours setup, 30 min/day monitoring

---

### Week 4: Email + Referral Blitz

**Email Sequence (Auto-sent):**
1. Day 0: Welcome email + first-generation tutorial
2. Day 2: "Check out what others created" (showcase)
3. Day 5: "Upgrade to Pro for 10x more generations" (upsell)
4. Day 7: "Refer a friend, earn $5" (referral push)
5. Day 14: "You've generated X videos. Next step: schedule" (reactivation)
6. Day 21: "Your friends are earning. You could too" (social proof)

**Your Checklist**
- [ ] Review email sequence (Claude sets up automatically)
- [ ] Test by signing up and checking emails (Day 25)
- [ ] Adjust copy if needed (Day 26)

**Expected result:** 30-40% of free users upgrade to Pro

**Time investment:** 1 hour

---

## Phase 5: Monetization Tracking (Days 30+)

### Weekly Dashboard Checklist

Monitor these metrics:

| Metric | Target | How to Check |
|--------|--------|--------------|
| Signups | 100/week | PostHog dashboard |
| Free → Pro conversion | 5-10% | Database query |
| Referral signups | 20% of new | Referral tracking |
| Email open rate | >25% | Resend dashboard |
| Monthly revenue | $500+ | Stripe dashboard |

**Your Checklist (Weekly)**
- [ ] Check PostHog for weekly signups
- [ ] Check Stripe for revenue
- [ ] Check Resend for email performance
- [ ] Answer Discord messages
- [ ] Post 2-3 wins from users

**Time investment:** 30 min/week

---

## Timeline Summary

| Phase | Dates | Your Time | Expected Users | Expected Revenue |
|-------|-------|-----------|-----------------|-----------------|
| 0 (Setup) | Day 1 | 20 min | 0 | $0 |
| 1 (Launch) | Days 1-3 | 1 hour | 20 (friends) | $0 |
| 2 (Content) | Days 4-10 | 4 hours | 100 (organic) | $50 |
| 3 (Community) | Days 8-14 | 2 hours | 200 (Discord) | $100 |
| 4a (Organic) | Days 15-21 | 3 hours | 500 (influencers) | $500 |
| 4b (Paid) | Days 15-28 | 5 hours | 1,000 (ads) | $1,500 |
| 4c (Email) | Days 22-30 | 1 hour | 1,500 (referral) | $3,000 |
| **Total (30 Days)** | | **16 hours** | **~2,800 users** | **~$5K** |

---

## 90-Day Targets (Cumulative)

- **Day 30:** 2,800 signups, 5K revenue, 100 paid users
- **Day 60:** 8,000 signups, 25K revenue, 400 paid users
- **Day 90:** 15,000 signups, 75K revenue, 1,000 paid users

**At 1,000 paid users × $20 average tier = $20K/month in revenue**
**Your cut (30%):** $6K/month

---

## What Claude Builds (Automated)

✅ Referral system  
✅ Email sequences (Resend integration)  
✅ Analytics dashboard (PostHog)  
✅ Landing pages (4 custom pages)  
✅ GitHub Actions (auto-deploy)  
✅ Affiliate tracking  
✅ Database migrations  
✅ Error handling & monitoring  

**All done by Day 3 of Phase 1**

---

## What You Do (Minimal, High-Impact)

✅ Get 3 API keys (20 min)  
✅ Create Discord (1 hour)  
✅ Write 4 landing page copies (4 hours)  
✅ Reach out to 5 influencers (1 hour)  
✅ Set up Google Ads (1 hour)  
✅ Monitor metrics weekly (30 min/week)  

**Total: 16 hours over 90 days = ~3 hours/week**

---

## How to Execute

### When you have API keys:
1. Message me with: Supabase URL, Stripe keys, Replicate token
2. I deploy automatically (24 hours)
3. You get email with live URL
4. Follow Phase 2+ checklist

### Daily checklist:
- [ ] 8am: Check PostHog dashboard
- [ ] 10am: Respond to Discord messages
- [ ] 12pm: Write landing page (1 hour on Days 4-7)
- [ ] 3pm: Reach out to 1 influencer (Days 15-21)
- [ ] 6pm: Monitor Stripe revenue

### Weekly review:
- [ ] How many signups this week?
- [ ] What's the conversion rate?
- [ ] Which channel (influencer/ad/organic) brings best users?
- [ ] Double down on winners, kill losers

---

## Success Metrics (By Day 90)

🎯 **1,000 signups** = You're winning  
🎯 **$5K revenue** = Sustainable  
🎯 **100 paid users** = Product-market fit  
🎯 **3-5% free→paid conversion** = Healthy funnel  
🎯 **20% referral rate** = Viral loop working  

**If you hit all three by Day 90: You have a $6K/month business.**

---

## If You Get Stuck

**Stuck on landing pages?** → Use the templates above, just fill in your copy
**Stuck on ads?** → Start with $50/day, optimize after 1 week of data
**Stuck on influencers?** → Ask Discord community to share (they become marketers)
**Revenue not growing?** → Check email open rates, lower free tier limits, increase upsell messaging

---

**You've got this. 90 days. $75K revenue by the end.**

Now get those API keys when you're off work. 🚀
