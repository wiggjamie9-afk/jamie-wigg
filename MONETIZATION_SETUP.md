# Monetization Setup Guide

Complete guide to setting up payment processing, affiliate links, and revenue tracking for the Agent Builder course.

---

## Part 1: Choose Your Payment Processor

Three main options for selling digital courses:

### Option A: Gumroad (Recommended for Beginners)

**Best for:** Simple one-time purchases, digital delivery, creator-friendly

**Setup time:** 10 minutes

**How it works:**
1. Sign up: https://gumroad.com
2. Create product: "Agent Builder Course - Starter ($99)"
3. Upload delivery files (PDFs, links to videos, code repo)
4. Get shareable link: `gumroad.com/l/agent-builder-starter`
5. Share on landing page, YouTube, email

**Features:**
- ✓ Customers get unique link to download course materials
- ✓ Email capture built-in (you get student emails)
- ✓ License keys optional (DRM)
- ✓ Affiliate program: customers can share with 30% commission
- ✓ Instant payouts to Stripe
- ✓ Tax handling for US/EU

**Pricing:**
- Takes 10% + payment processing fees
- You get: ~$90 per $99 sale

**Setup:**
```
1. Connect Stripe account (free)
2. Create three products:
   - Starter: $99
   - Professional: $199
   - Enterprise: $499
3. Add course link in description:
   "Upon purchase, you'll get a link to access all 24 videos, 
    code repo, Discord, and support email."
4. Paste Gumroad link in landing page CTA button
5. Add affiliate link in description for commission
```

**Link placement:**
- Landing page: `agent-builder-course.html` → button onclick links to Gumroad
- YouTube description: Link to Gumroad (drives discoverability)
- Email sequences: Gumroad link in every CTA

---

### Option B: Stripe + Custom Site (For Control)

**Best for:** Full branding, custom UX, higher volume

**Setup time:** 1-2 hours

**How it works:**
1. Create Stripe account
2. Build custom checkout page (HTML form + Stripe.js)
3. Host on Vercel/Cloudflare
4. Webhook delivers course access after payment

**Pricing:**
- Stripe takes 2.9% + $0.30 per transaction
- You get: ~$96 per $99 sale

**Basic implementation:**

```html
<!-- Simplified checkout page -->
<form id="payment-form">
  <input type="email" id="email" required />
  <input type="hidden" id="priceId" value="price_starter" />
  <button id="checkout-button">Pay $99</button>
</form>

<script src="https://js.stripe.com/v3/"></script>
<script>
const stripe = Stripe('pk_live_YOUR_KEY');

document.getElementById('checkout-button').addEventListener('click', async (e) => {
  e.preventDefault();
  
  const response = await fetch('/api/checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: 'price_starter',
      email: document.getElementById('email').value,
    }),
  });

  const session = await response.json();
  window.location.href = session.url; // Redirect to Stripe Checkout
});
</script>
```

**Backend (Node.js):**

```javascript
// api/checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://agent-builder-course.com/thank-you?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://agent-builder-course.com/agent-builder-course.html',
      customer_email: body.email,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

**Webhook to deliver course:**

```javascript
// api/webhook.js (Stripe event handler)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendCourseAccessEmail = require('./email');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const body = event.body;

  let webookEvent;
  try {
    webookEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return { statusCode: 400, body: 'Webhook signature verification failed.' };
  }

  if (webookEvent.type === 'checkout.session.completed') {
    const session = webookEvent.data.object;
    
    // Send email with course access
    await sendCourseAccessEmail({
      email: session.customer_email,
      courseTier: getCoursetier(session.line_items[0].price.id),
      courseLink: 'https://course.agent-builder.com',
    });
  }

  return { statusCode: 200, body: 'Webhook processed' };
};
```

**Pros:** Full control, lower fees, custom experience
**Cons:** More setup, need to handle email delivery, webhook management

---

### Option C: LemonSqueezy (Rising Star)

**Best for:** Creator-friendly alternative with great affiliate program

**Setup time:** 15 minutes

**Features:**
- ✓ Apple Pay, Google Pay, all cards
- ✓ Automatic VAT/tax handling
- ✓ License key delivery
- ✓ Affiliate program (up to 50% commission)
- ✓ Instant USD payouts
- ✓ Email receipts + customer portal

**Pricing:** Takes 5% + fees (better than Gumroad)

**Setup:** Similar to Gumroad (create product, get link, share)

---

## Part 2: My Recommendation

**Start with Gumroad.** Here's why:
1. 10 minutes to set up
2. No coding required
3. Email capture (crucial for future courses)
4. Affiliate links drive word-of-mouth sales
5. You can migrate to Stripe later if volume justifies

**Setup steps:**

1. **Create Gumroad account**
   - https://gumroad.com/signup
   - Verify email

2. **Add bank account**
   - Settings → Payouts
   - Connect Stripe (or PayPal)

3. **Create products**
   ```
   Product 1: Agent Builder Starter
   Price: $99
   Description: "24 videos, full source code, GitHub access, email support"
   Deliverables: Paste links to:
     - Course landing page
     - GitHub repo
     - Discord invite
     - Email support address
   ```

   Repeat for Pro ($199) and Enterprise ($499)

4. **Enable membership (optional)**
   - If you want recurring $19/mo for updates
   - Set as "membership" in product settings

5. **Get shareable links**
   - Copy from each product page
   - Format: gumroad.com/l/[product-name]

6. **Add to landing page**
   - Edit `agent-builder-course.html`
   - Change button onclick to:
     ```html
     window.location.href = 'https://gumroad.com/l/agent-builder-starter';
     ```

7. **Add to YouTube description**
   ```
   📚 Enroll: https://gumroad.com/l/agent-builder-starter
   
   Early pricing: $99 (increases to $149 after 30 days)
   30-day money-back guarantee
   ```

8. **Enable affiliates**
   - Products → Affiliate settings
   - Set commission: 30%
   - Students can get unique link to earn commissions

---

## Part 3: Email Delivery Automation

**Goal:** When student purchases on Gumroad, they get welcome email with course access.

**Option 1: Gumroad Built-in**
- Gumroad emails your delivery link automatically
- No setup needed
- Works fine for most cases

**Option 2: Zapier Automation (Recommended)**

Connect Gumroad → Mailchimp/ConvertKit:

1. Create Zapier account: zapier.com
2. Create Zap: Gumroad → Email provider
   - Trigger: "Gumroad new purchase"
   - Action: "Send email from Mailchimp"
   - Template:
     ```
     Subject: Welcome to Agent Builder! 🚀
     
     Hi [Customer Name],
     
     Your purchase is confirmed!
     
     Access your course here: [course-dashboard-link]
     
     Next steps:
     1. Watch intro video: [youtube-link]
     2. Clone repo: git clone [github-link]
     3. Join Discord: [discord-invite]
     
     Questions? Reply to this email.
     
     Happy building,
     Jamie
     ```

3. Map fields:
   - Gumroad email → Mailchimp email
   - Gumroad product → Mailchimp tag (starter/pro/enterprise)
   - Gumroad timestamp → Mailchimp signup date

4. Test with purchase of your own product

---

## Part 4: Revenue Tracking

**Create a simple tracking sheet:**

| Date | Product | Price | Platform | Net | Cumulative |
|---|---|---|---|---|---|
| 2026-06-11 | Starter | $99 | Gumroad | $89 | $89 |
| 2026-06-12 | Pro | $199 | Gumroad | $179 | $268 |
| 2026-06-13 | Starter | $99 | Gumroad | $89 | $357 |

**Key metrics:**

- **Daily active sales:** Conversions per day (track after each video drop)
- **Conversion rate:** (Sales / Email signups) × 100
  - Goal: 5-10% conversion
- **Average order value:** Total revenue / Total orders
  - Stretch goal: $150+ (upsell to Pro)
- **Refund rate:** Monitor closely (should be <5%)

**Set targets:**

- **Week 1-2:** 5-10 sales (awareness phase)
- **Week 3-4:** 15-25 sales (momentum phase)
- **Month 2:** 30-50 sales/month
- **Month 3+:** 50+ sales/month (sustainable)

**If you hit $1K revenue:** Celebrate 🎉 and reinvest in marketing (ads, more content)

---

## Part 5: Affiliate & Referral Program

**Make it easy for students to share.**

### Setup on Gumroad

1. Product settings → Affiliates
2. Set commission: 30%
3. Share affiliate landing page:
   - Students get unique link: gumroad.com/l/[product]?affiliate=[name]
   - They earn 30% of each sale

### Spreadsheet tracking

```
Student | Link | Sales | Commission
--------|------|-------|------------
John    | gumroad.com/l/starter?affiliate=john | 2 | $59.70
Sarah   | gumroad.com/l/starter?affiliate=sarah | 5 | $149.25
```

### Incentive structure (optional)

After first 5 affiliate sales:
- Email student: "You've earned $150! Keep going."
- After 10 sales: "You've earned $300! Want to co-promote?"
- After 20 sales: "You're a top affiliate. Let's partner more deeply."

**This creates a community of ambassadors earning passive income while you scale.**

---

## Part 6: Ad Testing (Optional)

Once you have the funnel working, test paid ads.

### Google Ads (Search)

**Cost:** $5-15/day to start
**Target keywords:** "AI agent builder", "SaaS course", "Next.js tutorial"
**Landing page:** agent-builder-course.html
**Goal:** <$20 cost per acquisition

**Sample ad:**
```
Headline: Build a SaaS AI Agent Platform
Description: Learn Next.js 15, React 19, Supabase in 4 weeks. 
             24 videos, production code, lifetime access.
Landing page: agent-builder-course.html
```

### Twitter/X Ads

**Cost:** $5-10/day
**Target:** Developers, indie hackers, startup founders
**Tweet format:**
```
Building a SaaS platform for AI agents.

24 video lessons, production-ready code, full GitHub repo.

Next.js 15, React 19, Supabase, deployed to Cloudflare.

Enroll for $99 (increases to $149 next week):
[Gumroad link]
```

### YouTube Ads

**Cost:** $10-20/day
**Format:** 6-second bumper or 15-second skippable
**Message:** Show 30-sec clip of app demo + "Enroll for $99"

**Start small:** $5/day for 1 week, measure conversion rate. Scale if <$25 CAC.

---

## Part 7: Pricing Strategy Over Time

**Initial pricing (Month 1):**
- Starter: $99
- Pro: $199
- Enterprise: $499

**After 100 sales (Month 2):**
- Increase by $50
- Starter: $149
- Pro: $249
- Enterprise: $549

**After 500 sales (Month 3-4):**
- Increase by $50 again
- Starter: $199
- Pro: $299
- Enterprise: $599

**Rationale:** 
- Early pricing rewards early adopters
- As demand grows, price naturally increases
- Tiers stay 3:1 ratio (value increase)
- Always grandfather existing students into old pricing

---

## Part 8: Sustainability Model

**Revenue breakdown for $5K/month course:**

| Source | % | Amount |
|---|---|---|
| Direct sales (Gumroad) | 70% | $3,500 |
| Affiliate sales (30% commission) | 20% | $1,000 |
| Sponsorships / ads | 10% | $500 |

**Expense breakdown:**

| Item | Cost | Notes |
|---|---|---|
| Email provider (ConvertKit) | $25/mo | Up to 5K subscribers |
| Discord bot (optional) | $10/mo | Community management |
| Course platform (Kajabi/Teachable) | Free | Using custom site |
| Video hosting | Free | YouTube |
| Hosting (Cloudflare) | Free | Static site |

**Net profit:** $5,000 - $35 = $4,965/month

---

## Timeline & Milestones

**Week 1 (Launch week):**
- [ ] Gumroad account created
- [ ] 3 products added (Starter/Pro/Enterprise)
- [ ] Landing page live
- [ ] YouTube videos published
- [ ] Email sequences active
- **Goal:** 5-10 sales

**Week 2-3:**
- [ ] Response to comments
- [ ] Early feedback incorporated
- [ ] Affiliate program launched
- **Goal:** 10-15 additional sales

**Week 4:**
- [ ] Price increase to $149/$249/$599
- [ ] Analyze metrics (CTR, conversion rate, CAC)
- [ ] Testimonials collected
- **Goal:** 15-20 sales at new price

**Month 2:**
- [ ] Bonus module recorded
- [ ] Ad testing started ($5/day budget)
- [ ] Student wins highlighted
- **Goal:** 30-50 sales

**Month 3+:**
- [ ] 2-3 additional courses planned
- [ ] Membership option launched ($19/mo)
- [ ] Affiliate network grown to 20+ promoters
- **Goal:** 50+ sales/month sustainable

---

## Resources

**Payment processing:**
- Gumroad: gumroad.com
- Stripe: stripe.com
- LemonSqueezy: lemonsqueezy.com

**Email automation:**
- ConvertKit: convertkit.com (recommend for creators)
- Mailchimp: mailchimp.com (free tier)
- Substack: substack.com (simplest)

**Affiliate management:**
- Gumroad built-in
- Impact: impact.com (more advanced)
- Refersion: refersion.com (ecommerce-focused)

**Analytics:**
- Google Sheets (simple tracking)
- Metabase (self-hosted dashboard)
- Mixpanel (advanced events)

**Community:**
- Discord (free)
- Circle: circle.so (paid community platform)

Start with Gumroad + ConvertKit + Google Sheets. Minimal overhead, maximum focus on content.

