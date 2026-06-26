# Automation Infrastructure Setup (Copy-Paste Ready)

**Goal:** Deploy working automation in < 2 hours. All templates copy-paste into Zapier, Lovable, OpenAI, SendGrid.

---

## Part A: Zapier Workflows (3 Essential)

### Workflow 1: Lead Intake → Classification → Email

**Trigger:** New form submission (Lovable or Typeform)

**Steps:**
1. **Trigger:** Zapier-connected form receives submission
2. **Step 2:** OpenAI → Classify lead (hot/warm/cold based on budget + pain point)
3. **Step 3:** Send email (conditional)
   - If HOT → Your immediate response
   - If WARM → Drip sequence (5 emails over 14 days)
   - If COLD → Archive, re-engage after 30 days
4. **Step 4:** Create CRM contact (HubSpot, Pipedrive, or Airtable)
5. **Step 5:** Post to Slack (notify you of hot leads)

**Setup in Zapier:**
```
1. Click "Create Zap"
2. Trigger: "Webhooks by Zapier" → Catch Hook
3. Copy webhook URL, paste into Lovable form settings
4. Action 1: "OpenAI" → Prompt: "Classify this lead as HOT (budget >$3K), WARM ($1-3K), or COLD (<$1K) based on their pain level and stated budget: [form data]"
5. Action 2: "Gmail" (conditional based on classification)
   - If HOT: Subject "Let's talk [date/time]", Body: "[Lead], ready to discuss your [pain point]. Here's my calendar: [Calendly link]"
   - If WARM: Subject "Quick question about your [industry]", Body: "[Lead], I help [industry] with [pain]. Worth 15 mins?"
   - If COLD: Subject "Keeping this for later", Body: "Thanks for reaching out. Saving your info for next quarter."
6. Action 3: "HubSpot" → Create Contact (first name, email, phone, company, lead classification tag)
7. Action 4: "Slack" → Post message to #leads channel: "[Lead name] - HOT - [Pain point] - [Contact details]"
8. Test with a form submission
9. Turn ON
```

---

### Workflow 2: Proposal Generation → Send → Track

**Trigger:** You create a row in Airtable (or click button in Lovable)

**Steps:**
1. **Trigger:** Airtable new record (fields: Client Name, Industry, Problem, Budget, Email)
2. **Step 2:** OpenAI → Generate 1-page proposal (prompt below)
3. **Step 3:** Gmail → Send proposal + ROI summary
4. **Step 4:** Create Stripe invoice (auto-send link for deposit payment)
5. **Step 5:** Slack → Notify you ("Proposal sent to [Client], waiting for signature")

**Setup:**
```
1. Create Airtable base "Sales Pipeline" with table "Proposals"
   Fields: Client Name (text), Industry (single select), Problem (long text), Budget (currency), Email (email), Status (single select: draft/sent/signed)
   
2. Zapier: Create Zap
   Trigger: Airtable → Record enters view "Ready to Propose"
   
3. Step 2: OpenAI
   Prompt: "Generate a professional 1-page sales proposal. Use this template:
   
   ---
   PROPOSAL TO: [Client Name]
   RE: [Problem] — Automation Solution
   
   SITUATION:
   You mentioned spending [Budget estimate] managing [Problem]. This is costing you ~[Time estimate] hours/month.
   
   SOLUTION:
   I'll build automated workflows that handle [Problem] silently in the background.
   
   SCOPE:
   - [2-3 specific workflows based on their problem]
   - [Tool integrations: Zapier + API + your existing tools]
   - [Reporting dashboard to track time saved]
   
   TIMELINE: [Start date] → [End date] (2-4 weeks depending on complexity)
   
   INVESTMENT:
   Project fee: $[Budget] (scope includes [deliverables])
   Ongoing: $[Retainer]/month (optimization + new workflows)
   
   ROI:
   If this saves you [Time estimate] hours/month at $[hourly rate], that's $[annual value] in recovered time.
   Breaking even in month [X], saving $[annual value] per year thereafter.
   
   NEXT STEPS:
   1. Review this proposal
   2. Schedule a 30-min kickoff call
   3. Sign agreement + pay 50% deposit
   4. We build & test in parallel
   5. Go live + you start saving immediately
   
   Questions? Reply or book time: [Calendly link]
   
   ---
   Fill in the bracketed values based on: Client: [Client Name], Industry: [Industry], Problem: [Problem], Budget: [Budget], their hourly rate: $[estimate], timeline: [date]"
   
4. Step 3: Gmail
   To: [Client Email]
   Subject: "Your custom automation proposal — $[Budget] for [Problem]"
   Body: "[Proposal from Step 2]"
   Attach: Proposal PDF (export Step 2 as PDF via Zapier formatter)
   
5. Step 4: Stripe
   Create invoice for [Budget * 0.5] deposit, send payment link, due in 3 days
   
6. Step 5: Slack
   "#sales" channel: "📋 Proposal sent to [Client Name] — $[Budget] budget — Due [date]"
   
7. Test: Create a test Airtable record
8. Turn ON
```

---

### Workflow 3: Customer Intake → Onboarding Sequence

**Trigger:** Client pays 50% deposit (Stripe webhook)

**Steps:**
1. **Trigger:** Stripe payment received (50% of project fee)
2. **Step 2:** Gmail → Send welcome email + onboarding docs
3. **Step 3:** Zapier → Create Lovable onboarding dashboard (personalized link)
4. **Step 4:** Calendar → Auto-schedule kickoff call (Calendly → Google Calendar)
5. **Step 5:** Airtable → Update client status to "Active Project"
6. **Step 6:** Set reminder (5 days out: "Project check-in")

**Setup:**
```
1. Zapier: Create Zap
   Trigger: Stripe → Successful Payment (amount = [your Tier 2 pricing * 0.5])
   
2. Step 2: Gmail
   To: [Client email]
   Subject: "Welcome! Let's build your automation — here's what's next"
   Body: 
   "Hi [Client],
   
   Payment received — $[amount] ✓
   
   Here's your project timeline:
   
   WEEK 1: Discovery & wireframe
   - Brief kickoff call (tomorrow)
   - I'll map out your workflows
   - You approve scope
   
   WEEK 2-3: Build & test
   - I build in staging (you don't see yet)
   - Daily updates on Slack
   
   WEEK 4: Go live & train
   - We deploy together
   - I walk you through each workflow
   - You're autonomous by week 4
   
   Your onboarding dashboard: [Link to Lovable dashboard with their name]
   
   See you tomorrow at [Calendly time],
   [Your name]"
   
3. Step 3: Lovable (optional but powerful)
   Create private project "Client Dashboard — [Client Name]"
   Show:
   - Project timeline + completion %
   - Workflows being built (descriptions + screenshots)
   - Time saved so far (estimate)
   - Next steps
   - Direct message to you
   
   Zapier: Create Lovable project via webhook, send URL to client
   
4. Step 4: Calendly
   Auto-schedule kickoff (30-min) for tomorrow at [your available time]
   Send to [Client email]
   
5. Step 5: Airtable
   Update "Sales Pipeline" table:
   Client Name: [name]
   Status: "Active Project"
   Start Date: Today
   Expected End Date: [Today + 3 weeks]
   
6. Step 6: Zapier Delay
   Wait 5 days → Gmail reminder to [you]:
   Subject: "[Client Name] check-in — Week 1 complete?"
   
7. Test: Create a test Stripe payment
8. Turn ON
```

---

## Part B: Lovable Intake Form (5-minute setup)

**Project:** Client Intake Form  
**Endpoint:** `[your-domain]/intake` or Lovable's built-in share link

**Form fields (copy into Lovable form builder):**

```
FORM: "Get Your Free Automation Audit"

Section 1: Your Info
- Full Name (text input, required)
- Email (email input, required)
- Phone (tel input, optional)
- Company (text input, required)

Section 2: Your Business
- Industry (dropdown: Coaching, Agency, Freelance, Service-Based, SaaS, Other)
- Team Size (radio: Solo, 2-5, 6-20, 20+)
- Annual Revenue (dropdown: <$50K, $50-100K, $100-250K, $250K+)

Section 3: Your Pain
- What's your #1 time-waster? (text area, placeholder: "e.g., manually qualifying leads, scheduling calls, data entry")
- How many hours/week? (number input, 1-60)
- What's that time worth to you? (text area, placeholder: "e.g., $500-1K/month lost revenue")

Section 4: Your Interest
- What interests you? (checkboxes:
  ☑ Lead qualification automation
  ☑ Email sequence automation
  ☑ Data entry / CRM automation
  ☑ Scheduling / calendar automation
  ☑ Custom AI workflow
  ☑ Just curious / exploring options)

Section 5: Call-to-Action
- CTA Button: "Book My Free Audit" (or "Schedule Call")
- Subtext: "Usually books 2-3 days out. We'll discuss your workflows & give you an estimate."

Form Footer:
- Privacy text: "Your info stays private. No spam, just automation talk."
- Submit button color: Bright (blue or green)
```

**Lovable setup:**
1. Create new project → "Client Intake Form"
2. Add form component (Lovable has a form builder)
3. Drag/drop fields above
4. Style: Keep it clean, professional, mobile-first
5. Webhook: Get your Lovable webhook URL → paste into Zapier Workflow 1
6. Share link or custom domain

---

## Part C: Custom GPT Prompts (Copy-Paste into OpenAI)

### GPT 1: Lead Classifier

**Name:** "Lead Qualification Bot"  
**Instructions:**
```
You are a lead qualification expert for service businesses. Your job is to classify incoming leads based on their pain level, budget, and fit.

When you receive a lead inquiry, analyze these factors:
1. Budget mentioned or inferred ($0, <$1K, $1-3K, $3-5K, >$5K)
2. Pain level (1-10 scale, based on urgency + impact)
3. Timeline (immediate, 30 days, 60+ days)
4. Fit (perfect match, medium fit, no fit)

Output format:
---
**CLASSIFICATION:** HOT / WARM / COLD
**CONFIDENCE:** 85%
**REASON:** [1 sentence explaining why]
**BUDGET:** $[range] inferred
**TIMELINE:** [when they need it]
**RECOMMENDED NEXT STEP:** [what you should do]
---

Lead data to classify:
[Incoming form submission or email]
```

### GPT 2: Email Sequence Writer

**Name:** "Drip Campaign Generator"  
**Instructions:**
```
You are an expert copywriter specializing in high-converting email sequences for service businesses.

Your job: Write 5 emails for a drip campaign that nurtures warm leads (interested but not yet convinced).

Constraints:
- Each email < 150 words
- Subject line < 60 characters
- Tone: Conversational, not salesy
- Goal: Move lead from "curious" → "ready to talk"

Email structure:
1. Day 0: Appreciation + problem reframing
2. Day 3: Social proof (case study or testimonial)
3. Day 7: Objection handling ("but what if I don't have budget?")
4. Day 14: Urgency + limited offer ("first customer discount")
5. Day 21: Final ask + alternative ("ready to talk or prefer to wait?")

Lead context:
- Name: [Lead name]
- Industry: [Industry]
- Problem: [Their main pain point]
- Budget: [Inferred budget]

Write the 5 emails with subject lines.
```

### GPT 3: Proposal Generator

**Name:** "Custom Proposal Writer"  
**Instructions:**
```
You are a proposal specialist who converts prospects into clients.

Your job: Write a 1-page custom proposal that clearly shows ROI.

Structure:
1. Header: "PROPOSAL TO [Client] — [Problem] Solution"
2. Situation: 1 paragraph summarizing their problem + impact
3. Solution: 3-4 bullet points of specific deliverables
4. Timeline: Start date → delivery date (realistic)
5. Investment: Project fee + ongoing retainer
6. ROI: Dollar value of time saved annually
7. Next steps: 3 specific actions for them to take

Tone: Confident, specific, focused on their outcome (not your process).

Data:
- Client name: [name]
- Industry: [industry]
- Problem: [specific problem]
- Workflows to build: [list]
- Project timeline: [weeks]
- Project fee: $[amount]
- Retainer: $[amount]/month
- Hours saved per month: [estimate]
- Their hourly rate: $[estimate]

Write the proposal.
```

---

## Part D: SendGrid Email Sequences (Template)

### Sequence 1: Post-Proposal Nurture (5 emails, 14 days)

**Copy into SendGrid as transactional email templates:**

**Email 1 — Day 0 (Proposal sent)**
```
Subject: Your custom automation proposal — $[Amount] investment

Hi [First name],

Attached is your proposal for [Problem] automation.

Here's what stands out:
- You'll save ~[Hours] hours/month
- That's $[Annual value] in recovered time per year
- Pays for itself in month [X]

One question before you read it: Would you prefer to get started ASAP, or are you still evaluating options?

Either way, no pressure — reply or book a call:
[Calendly link]

Talk soon,
[Your name]
```

**Email 2 — Day 3 (Follow-up)**
```
Subject: Quick question — any thoughts on the proposal?

Hi [First name],

Just checking in. Did you get a chance to review the proposal?

If you have questions or want to discuss before committing, I'm happy to jump on a call (even a quick 15-min one).

Otherwise, would you like to move forward with the project?

[Calendar link]

[Your name]
```

**Email 3 — Day 7 (Objection handling)**
```
Subject: [First name], worried about cost?

Hi [First name],

Most of my clients mention one concern before committing: "Is $[Amount] worth it?"

Here's how I think about it:
- If you spend [Hours]/week on [Problem], that's $[Annual value] cost
- This project costs $[Amount] upfront
- ROI breakeven: Month [X]
- Ongoing savings: $[Annual value] per year, forever

So yes — it's worth it. But only if you actually implement it.

Question: Are you committed to using this automation, or still exploring?

Be honest — either answer is fine.

[Your name]
```

**Email 4 — Day 14 (Urgency + limited offer)**
```
Subject: Last offer — [FirstName], this discount expires tomorrow

Hi [First name],

Quick note: I'm offering 30% off setup to my first 3 clients this quarter.

You're prospect #2.

If you want to move forward, reply or sign here: [Contract/payment link]

If not, no hard feelings — reach out in 6 months when you're ready.

[Your name]
```

**Email 5 — Day 21 (Final ask)**
```
Subject: Moving forward with [First name]?

Hi [First name],

I haven't heard back, so I'm guessing you're not moving forward right now.

That's totally fine — automation isn't urgent when business is running smoothly.

But when it gets busy again (it always does), reach out. I'll be here.

[Your name]
```

---

### Sequence 2: Post-Close Onboarding (6 emails, 30 days)

**Email 1 — Day 0 (Welcome)**
```
Subject: Welcome [First name]! Here's what happens next

Hi [First name],

Payment received ✓ Contract signed ✓

I'm excited to build this for you. Here's the next 4 weeks:

WEEK 1: We kick off Monday [date] at [time]. Bring:
- List of your current tools (apps you use daily)
- Screenshots of the data you're working with
- Examples of the workflows you want automated

I'll map everything out & send you a diagram to approve.

WEEK 2-3: I build in staging (you see daily updates in Slack)

WEEK 4: Go live + training. You're autonomous by week 4.

See you Monday,
[Your name]
```

**Email 2 — Day 3 (Kickoff recap)**
```
Subject: [First name], here's your workflow diagram

Hi [First name],

Quick recap from our kickoff:

You want to automate:
1. [Workflow 1] → Saves [X] hours/week
2. [Workflow 2] → Saves [Y] hours/week
3. [Workflow 3] → Saves [Z] hours/week

Attached: Diagram of how these connect

Questions or changes? Reply ASAP — I start building tomorrow.

[Your name]
```

**Email 3 — Day 7 (Week 1 summary)**
```
Subject: Week 1 complete — here's your progress

Hi [First name],

Week 1 is done. Here's what's built:

✓ Workflow 1 (30% done)
✓ Workflow 2 (20% done)
⏳ Workflow 3 (starting today)

I'll send you a video walkthrough Monday. 

Any blockers? Reply here.

[Your name]
```

**Email 4 — Day 14 (Week 2 update + training preview)**
```
Subject: Almost there — week 2 complete

Hi [First name],

Week 2 is wrapped:

✓ All 3 workflows built & tested
✓ Dashboard live (you can see real data)
⏳ Final tweaks based on your feedback

Next week: I'll walk you through everything in our training session.

Bring questions!

[Your name]
```

**Email 5 — Day 21 (Go-live day)**
```
Subject: LIVE — Your automation is active now

Hi [First name],

We're live! 🎉

Your workflows are running in production as of today. Here's what's happening automatically:

1. [Workflow 1] — Processing [X] items daily
2. [Workflow 2] — Saving [Y] hours/week
3. [Workflow 3] — Connected to [Tool]

Dashboard (real-time stats): [Link]

Questions this week? Slack me.

[Your name]
```

**Email 6 — Day 30 (30-day check-in + upsell retainer)**
```
Subject: Your 30-day results + what's next

Hi [First name],

1 month in. Here's your impact:

Hours saved: ~[X] hours
Revenue impact: ~$[X] value
Automations running: 3
Uptime: [99%+]

Quick question: Would you want me to add [4th workflow] or [optimization]?

I'm here for the next 30 days during your retainer. After that, let's talk about ongoing optimization.

Reply or book time: [Calendar]

[Your name]
```

---

## Part E: Deployment Checklist (48 hours)

- [ ] **Hour 1:** Sign up for Zapier (Pro tier)
- [ ] **Hour 2:** Create Lovable intake form (use template above)
- [ ] **Hour 3:** Set up Zapier Workflow 1 (Lead → Email → CRM)
- [ ] **Hour 4:** Test Workflow 1 with a test form submission
- [ ] **Hour 5:** Create Airtable base "Sales Pipeline"
- [ ] **Hour 6:** Set up Zapier Workflow 2 (Proposal generation)
- [ ] **Hour 7:** Test Workflow 2 with a test Airtable record
- [ ] **Hour 8:** Create 3 Custom GPTs in OpenAI (copy prompts above)

**By end of Day 1:** You have 3 automated workflows running + intake form live

- [ ] **Day 2 — Hour 1:** Create 5 cold email templates (use templates from AI-VENTURES-PLAN.md)
- [ ] **Day 2 — Hour 2:** Send 20 cold messages (LinkedIn, email, Twitter, Reddit, warm referrals)
- [ ] **Day 2 — Hour 3:** Set up SendGrid (free account + add email templates above)
- [ ] **Day 2 — Hour 4:** Create Stripe account + payment link for deposits
- [ ] **Day 2 — Hour 5-6:** Monitor inbound (Slack + email) for responses
- [ ] **Day 2 — Hour 7:** Schedule qualification calls with hot leads

**By end of Day 2:** You have 20+ outbound messages sent, 1-2 inbound leads arriving, automation running in background

---

## What's Happening Behind the Scenes (After Setup)

Every day:
- [ ] Cold leads trickle in via form → Zapier auto-classifies → You get Slack notifications of HOT leads
- [ ] WARM leads receive drip email sequence (fully automated, you don't touch)
- [ ] You focus on: Qualification calls + closing + delivery
- [ ] Every closed deal triggers onboarding automation (email sequence, docs, dashboard, call scheduling)

---

## Monthly Cost

| Tool | Cost | Notes |
|---|---|---|
| Zapier Pro | $30 | 100 tasks/month, auto-escalates if you grow |
| OpenAI API | $20-50 | Pay-per-token, scales with lead volume |
| Lovable | Free-$50 | Free tier fine to start |
| SendGrid | Free-$20 | Free = 100 emails/day; $20/mo = unlimited |
| HubSpot Free CRM | $0 | Perfectly fine for <5 clients at a time |
| Stripe | 2.2% per transaction | Only charged on actual deposits |
| **Total** | **$100-150/mo** | ROI: First deal ($2.5K) pays for 20 months of tools |

---

**Status:** All templates are copy-paste ready. Start with Workflow 1 (lead intake) today. You'll have leads flowing by tomorrow.

No more building. Start outreaching. ⚡
