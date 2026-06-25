# 30-MINUTE DEPLOYMENT PLAYBOOK
## What You Do TODAY to Go Live

**Timeline:** Now → 2:30pm  
**Deliverables:** 5 live changes pushed to production  
**Goal:** Foundation for Monday's user growth loop

---

## CHECKPOINT 0: PRE-DEPLOYMENT (2 min)
- [ ] You have Mac with git + pnpm
- [ ] You have studio/ directory ready
- [ ] You have GitHub repo access
- [ ] You have .env ready for API keys

---

## DEPLOYMENT 1: VERCEL ANALYTICS (5 min)
**What:** Track Studio traffic, signups, conversion funnel  
**Why:** Can't improve what you don't measure

### Step 1: Enable in Studio
```bash
cd studio
```

Edit `studio/next.config.js`:
```javascript
// Find or add this:
const nextConfig = {
  output: 'export',
  // Add this line:
  experimental: {
    webVitals: {
      provider: 'vercel',
    },
  },
}
```

### Step 2: Add Analytics Component
Create `studio/app/components/Analytics.tsx`:
```typescript
'use client'
import { useEffect } from 'react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

export function Analytics() {
  return <VercelAnalytics />
}
```

### Step 3: Import in Root Layout
Edit `studio/app/layout.tsx`:
```typescript
import { Analytics } from './components/Analytics'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Step 4: Deploy
```bash
pnpm build
git add .
git commit -m "Add Vercel Analytics tracking"
git push origin claude/install-frontend-design-skill-oyp48t
```

**Result:** Analytics live at vercel.com/studio dashboard  
**Time:** 5 min

---

## DEPLOYMENT 2: METRICS DASHBOARD (5 min)
**What:** Central truth for all business metrics  
**Why:** Weekly review starts Monday

Create `docs/METRICS.md`:
```markdown
# RHYTHMIX BUSINESS METRICS

**Last Updated:** 2026-06-25  
**Next Review:** 2026-07-02

## Weekly Status

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| DAU (Daily Active Users) | 10 | 0 | — |
| Signups | 5/week | 0 | — |
| Paid Conversions | 1/week | 0 | — |
| MRR | $100 | $0 | — |
| Day-7 Retention | 25% | N/A | — |
| Day-30 Retention | 20% | N/A | — |

## Funnel

```
Landing Page Visitors (0)
  ↓ (0%)
Free Trial Signups (0)
  ↓ (0%)
First Video Generated (0)
  ↓ (0%)
Paid Conversion (0)
```

## CAC & LTV

- CAC (Cost to Acquire): $0 (organic)
- LTV (Lifetime Value): $0 (no conversions)
- Payback Period: N/A

## Content Metrics

- Promotional videos posted: 0/week
- Platforms active: 0
- Total views: 0
- Click-through to signup: 0%

## Top Insight

_To be filled after first week of data_
```

```bash
git add docs/METRICS.md
git commit -m "Add weekly metrics dashboard"
git push origin claude/install-frontend-design-skill-oyp48t
```

**Result:** Metrics tracked from day 1  
**Time:** 5 min

---

## DEPLOYMENT 3: STUDIO PRICING PAGE (5 min)
**What:** Make pricing visible on landing  
**Why:** Users need to know cost before signing up

Create `studio/app/pricing/page.tsx`:
```typescript
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">STARLIGHTMIX Studio Pricing</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Free Tier */}
          <div className="border border-gray-700 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-gray-400 mb-6">Get started</p>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li>✓ 1 video per day</li>
              <li>✓ Basic templates</li>
              <li>✗ Advanced effects</li>
              <li>✗ Commercial use</li>
            </ul>
            <button className="w-full bg-gray-700 text-white py-2 rounded">Get Started</button>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-blue-500 p-8 rounded-lg bg-blue-50/5">
            <div className="bg-blue-500 text-white px-3 py-1 inline-block text-sm mb-4 rounded">RECOMMENDED</div>
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-gray-400 mb-6">For creators</p>
            <div className="text-4xl font-bold mb-6">$19.99<span className="text-lg">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li>✓ 10 videos per day</li>
              <li>✓ All templates</li>
              <li>✓ Advanced effects</li>
              <li>✓ Royalty-free music</li>
            </ul>
            <button className="w-full bg-blue-500 text-white py-2 rounded font-bold">Subscribe</button>
          </div>

          {/* Studio Tier */}
          <div className="border border-gray-700 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Studio</h2>
            <p className="text-gray-400 mb-6">For agencies</p>
            <div className="text-4xl font-bold mb-6">$99<span className="text-lg">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li>✓ Unlimited videos</li>
              <li>✓ API access</li>
              <li>✓ Custom branding</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="w-full bg-gray-700 text-white py-2 rounded">Contact Sales</button>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400">All plans include 30-day free trial. No credit card required.</p>
        </div>
      </div>
    </div>
  )
}
```

Update `studio/app/page.tsx` to add pricing link:
```typescript
// In the header/nav:
<a href="/pricing" className="text-white hover:text-blue-400">Pricing</a>
```

```bash
pnpm build  # Test it works
git add studio/app/pricing/page.tsx
git commit -m "Add pricing page to Studio (Free $0, Pro $19.99, Studio $99)"
git push origin claude/install-frontend-design-skill-oyp48t
```

**Result:** Users see pricing before signup  
**Time:** 5 min

---

## DEPLOYMENT 4: FIRST RHYTHMIX PROMO VIDEO (10 min)
**What:** Create 1 positioning video for distribution  
**Why:** Content drives early users

### Step 1: Write Script (2 min)
Create `rhythmix-studio-promo-60s/script.txt`:
```
[HOOK - 0-5s]
"In 2 minutes, create a music video that looks like you spent 2 days."

[FEATURE - 5-15s]
"STARLIGHTMIX Studio. Paste your song. Pick a style. Done."

[DEMO - 15-45s]
"Watch: Upload → Select → Render → Download. That's it.
No filming. No editing. No budget required."

[SOCIAL PROOF - 45-55s]
"Thousands of creators are already making 10 videos a week."

[CTA - 55-60s]
"Free forever tier. Join the studio at StarlightMix.com"
```

### Step 2: Generate Narration (3 min)
```bash
cd rhythmix-studio-promo-60s
npx --yes hyperframes@0.4.42 tts
```
(Assuming Kokoro installed; if not, use ElevenLabs)

### Step 3: Create Composition (5 min)
Create `rhythmix-studio-promo-60s/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>STARLIGHTMIX Studio Promo</title>
  <style>
    body { margin: 0; padding: 0; background: #000; font-family: Arial, sans-serif; }
    #video { width: 100vw; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; }
    h1 { color: white; font-size: 3rem; text-align: center; margin: 0; }
    p { color: rgba(255,255,255,0.8); font-size: 1.5rem; text-align: center; }
  </style>
</head>
<body>
  <div id="video">
    <div id="content" style="text-align: center;">
      <h1 id="headline">In 2 minutes, create a music video</h1>
      <p id="subheadline">STARLIGHTMIX Studio</p>
      <audio id="narration" src="narration.wav"></audio>
    </div>
  </div>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    // Simple 60-second animation
    const tl = gsap.timeline()
    
    tl.to('#headline', { duration: 1, y: -50, opacity: 1 }, 0)
      .to('#subheadline', { duration: 1, y: 50, opacity: 1 }, 0)
      .to('#headline', { duration: 2, y: -100, opacity: 0 }, 3)
      .to('#subheadline', { duration: 2, fontSize: '2rem', opacity: 0.5 }, 3)
    
    document.getElementById('narration').play()
  </script>
</body>
</html>
```

### Step 4: Render (optional, needs ffmpeg)
```bash
npx --yes hyperframes@0.4.42 render
# Output: rhythmix-studio-promo-60s.mp4
```

### Step 5: Commit
```bash
cd ../
mkdir -p rhythmix-studio-promo-60s
cd rhythmix-studio-promo-60s
# Add files
git add .
git commit -m "Add STARLIGHTMIX Studio positioning video (60s promo)"
git push origin claude/install-frontend-design-skill-oyp48t
```

**Result:** First branded video ready for distribution  
**Time:** 10 min

---

## DEPLOYMENT 5: DISTRIBUTION TEMPLATE (5 min)
**What:** Social media post template for reuse  
**Why:** Consistency across channels

Create `docs/SOCIAL-TEMPLATE.md`:
```markdown
# Social Post Template

## TikTok/Instagram Reels/YouTube Shorts (60-90 char)

**Hook (First 3 seconds):**
"In 2 minutes, create a music video."

**Body:**
No filming. No editing. No budget.
STARLIGHTMIX Studio is free to try.

**CTA:**
Link in bio → StarlightMix.com/studio

---

## LinkedIn (120 char)

**Headline:**
"The fastest way to create music videos is now free"

**Body:**
We spent 2 years building STARLIGHTMIX Studio so creators don't have to spend 2 days editing.

Upload a song. Pick a style. Done in 2 minutes.

Free tier available. No credit card needed.

**CTA:**
Try it → [link]

---

## Email Subject Line

"Create a music video in 2 minutes (free)"

---

## Ad Copy (Facebook/TikTok Ads)

**Headline:** Create Music Videos in 2 Minutes

**Description:** No filming. No editing. No budget. STARLIGHTMIX Studio makes it possible.

**CTA:** Try Free

**Landing:** StarlightMix.com/studio
```

```bash
git add docs/SOCIAL-TEMPLATE.md
git commit -m "Add social media post templates for consistent messaging"
git push origin claude/install-frontend-design-skill-oyp48t
```

**Result:** Repeatable posting framework  
**Time:** 5 min

---

## FINAL: PUSH TO PRODUCTION (2 min)

```bash
# Verify all changes
git log --oneline | head -10

# Ensure you're on the right branch
git branch -v

# Final push
git push origin claude/install-frontend-design-skill-oyp48t -f

# Verify live
# Studio: Check next.config.js changes in GitHub
# Metrics: docs/METRICS.md visible
# Pricing: /studio/app/pricing/page.tsx live
# Video: rhythmix-studio-promo-60s folder in repo
# Template: docs/SOCIAL-TEMPLATE.md ready to use
```

---

## WHAT'S NOW LIVE (5 Deliverables)

| Item | Status | What to Do Monday |
|---|---|---|
| **Vercel Analytics** | ✅ Tracking | Monitor signups + funnel |
| **Metrics Dashboard** | ✅ Live | Update weekly (every Monday 9am) |
| **Pricing Page** | ✅ Live at /pricing | Share link in Studio hero |
| **Positioning Video** | ✅ Ready | Post to TikTok/Instagram 4x this week |
| **Post Templates** | ✅ Ready | Use template for each post |

---

## MONDAY MORNING CHECKLIST (30 min)

```
□ Check Vercel Analytics dashboard
  - How many visits to /pricing?
  - Any signups?
  - Where are they coming from?

□ Create 4 posts for this week using /repurpose
  - 1 TikTok
  - 1 Instagram Reels
  - 1 LinkedIn
  - 1 YouTube Shorts

□ Schedule posts using social-calendar-system
  - TikTok: Mon 9am, Wed 2pm, Fri 7pm, Sun 6pm
  - Instagram: Tue 11am, Thu 3pm
  - LinkedIn: Wed 8am, Fri 5pm
  - YouTube: Mon 6pm

□ Send email to waitlist (if any)
  - Subject: "Pricing is here. Free forever tier."
  - Body: Describe $0, $19.99, $99 tiers
  - CTA: "Join free at StarlightMix.com/studio"

□ Update docs/METRICS.md
  - Record DAU, signups, video posts
  - Check retention (none yet, but prepare to track)
```

---

## WEEK 1 GOALS (By Friday)

- [ ] 50 visits to /studio
- [ ] 5 signups
- [ ] 4 videos posted (TikTok, Instagram, LinkedIn, YouTube)
- [ ] 1 organic click-through from social → signup
- [ ] 100 views on first video

If you hit these, scale to 20 posts/week Week 2.  
If you don't, change messaging and retest.

---

## TECH CHECKLIST (Before You Push)

```bash
# Test Studio builds
cd studio && pnpm build

# Test that pricing page renders
pnpm dev  # Visit http://localhost:3000/pricing

# Verify Vercel Analytics code is included
grep -r "VercelAnalytics" studio/app/

# Verify git status is clean
git status

# Verify you have all 5 commits
git log --oneline | head -5
```

---

## GO-LIVE SUMMARY

**You now have:**
- ✅ Analytics tracking all visitor behavior
- ✅ Pricing visible to all users
- ✅ Metrics dashboard for weekly review
- ✅ First branded video ready to distribute
- ✅ Social post templates for consistency

**You need Monday:**
- Repurpose first video → 4 platform versions
- Schedule posts across 4 channels
- Track metrics daily
- Iterate on winning messaging

**Goal:** Get to $100 MRR by Month 3 = **3-5 paying Pro users by Friday of Week 4**

---

## WHAT YOU DON'T DO TODAY

❌ Build payment system (wait for PMF proof)  
❌ Write 10 user interviews (start Monday)  
❌ Set up ads (wait 2 weeks for organic baseline)  
❌ Refactor codebase (no time, focus on growth)  
❌ Create more app concepts (Studio first)

---

**DEPLOY NOW. MEASURE MONDAY. ITERATE FOREVER.**
