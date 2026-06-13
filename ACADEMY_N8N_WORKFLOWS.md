# EventAI Academy — n8n Automation Workflows

All workflows below can be imported into n8n and connected to Lemonsqueezy, Discord, Gmail, Twitter, Slack, etc.

## Workflow 1: Enrollment → Welcome Sequence

**Trigger:** New student purchases from Lemonsqueezy

**Steps:**

1. **Lemonsqueezy** — Webhook: New order completed
2. **Extract** — Get email, name, tier (pro/premium/starter)
3. **Supabase** — Create student record
4. **Gmail** — Send welcome email (template below)
5. **Discord** — Generate invite link and send via email
6. **Slack** — Notify you ("New student: John Smith - Pro tier")

**Nodes to Add:**

```
Trigger: Webhook (Lemonsqueezy)
  ↓
Edit Fields: Extract email, name, tier
  ↓
Supabase: Insert into academy_students
  ↓
Gmail: Send welcome email
  ↓
Discord: Create invite link
  ↓
Gmail: Send Discord link
  ↓
Slack: Notify admin
```

---

## Workflow 2: Weekly Module Release

**Trigger:** Every Monday at 9 AM

**Steps:**

1. **Cron** — Every Monday 9 AM
2. **Supabase** — Fetch current week
3. **Discord** — Post in #announcements (new module available)
4. **Gmail** — Email all students (this week's modules)
5. **Twitter** — Auto-tweet announcement

**Nodes:**

```
Cron: Every Monday 9 AM
  ↓
Supabase: Get current_week
  ↓
Function: Format announcement
  ↓
Discord: Post to #announcements
  ↓
Gmail: Send weekly digest to all students
  ↓
Twitter: Post announcement
```

**Email Template:**

```
Subject: Module [X] is live 🎬

Hi [name],

New module just released! This week you're learning [topic].

Watch here: [video link]
Code: [GitHub repo link]
Discussion: [Discord thread]

This week's checkpoint is due on Friday.

See you in the Discord!
— Jamie
```

---

## Workflow 3: Checkpoint Submission Alert

**Trigger:** Student submits checkpoint form

**Steps:**

1. **Supabase** — New row in checkpoints table
2. **Slack** — Notify you (checkpoint ready for review)
3. **Gmail** — Send student confirmation
4. **Discord** — Post in student's checkpoint channel (celebrate)

**Nodes:**

```
Supabase Trigger: New checkpoint submission
  ↓
Slack: Notify admin
  ↓
Gmail: Confirm receipt
  ↓
Discord: Post celebration
```

**Slack Message:**

```
New checkpoint submission! 📝

Student: @[name]
Week: [week]
Title: [title]
Submission: [link]

Review needed by end of day.
```

---

## Workflow 4: Achievement Unlock Celebration

**Trigger:** Student completes milestone (deployed first time, launched iOS, etc.)

**Steps:**

1. **Supabase** — Check if milestone reached
2. **Discord** — Post in #wins channel
3. **Gmail** — Send celebration email
4. **Twitter** — Optional: tweet student's success (if they opt-in)

**Nodes:**

```
Trigger: Student completes module
  ↓
Function: Check for achievement unlock
  ↓
If achievement unlocked:
  ↓
  Discord: Post to #wins
  ↓
  Gmail: Send celebration email
  ↓
  Twitter: Tweet (optional)
```

**Discord Message:**

```
🎉 @[name] just deployed their platform live!

Platform: [link]
Tier: [tier]
Week: [week]

Congratulations! 🚀
```

---

## Workflow 5: Monthly "State of the Academy" Report

**Trigger:** Last day of month at 5 PM

**Steps:**

1. **Cron** — Last day of month
2. **Supabase** — Aggregate stats
   - Total students: X
   - Launched platforms: Y
   - Paying customers: Z
   - Revenue this month: $A
3. **Email** — Send you stats dashboard
4. **Discord** — Post public summary (motivate students)

**Nodes:**

```
Cron: Last day of month, 5 PM
  ↓
Supabase: Query students, platforms, revenue
  ↓
Function: Calculate metrics
  ↓
Gmail: Send stats to admin
  ↓
Discord: Post public summary
```

---

## Workflow 6: At-Risk Student Intervention

**Trigger:** Daily at 6 PM

**Steps:**

1. **Supabase** — Find students with no progress in 7+ days
2. **Gmail** — Send personalized check-in email
3. If no response in 3 days → escalate to Hermes bot (AI sends message)

**Nodes:**

```
Cron: Every day at 6 PM
  ↓
Supabase: Find students with last_activity > 7 days ago
  ↓
Loop: For each at-risk student
  ↓
  Gmail: Send check-in email
  ↓
Supabase: Flag as "check-in sent"
```

**Email Template:**

```
Subject: We miss you! 👋

Hi [name],

We noticed you haven't logged in since [date]. 

No worries! Here's what might help:

1. Stuck on something? Ask in Discord
2. Want a 1-on-1? Schedule time with me
3. Need a break? Let me know

Email me back or hit me up on Discord.

You got this! 💪
— Jamie
```

---

## Workflow 7: Graduate Success Celebration

**Trigger:** Student completes week 12 (launch)

**Steps:**

1. **Supabase** — Week 12 checkpoint marked complete
2. **Discord** — Post in #launches (with link to platform)
3. **Gmail** — Send congratulations + next steps
4. **Hermes** — AI drafts case study interview request
5. **Twitter** — Auto-retweet/celebrate their launch

**Nodes:**

```
Supabase Trigger: Week 12 completed
  ↓
Discord: Post launch celebration
  ↓
Gmail: Send congrats + case study request
  ↓
Hermes: Draft interview request
  ↓
Twitter: Post congratulations
```

**Discord Post:**

```
🚀 LAUNCH ALERT 🚀

@[name] just shipped [platform name]!

Platform: [link]
First customer: [yes/no]
Revenue: $[amount]

Let's goooooo! 🎉

Go check it out → [link]
```

---

## How to Import These

1. Log into n8n (http://localhost:5678 or deployed instance)
2. Create new workflow
3. Add nodes as described above
4. Connect to your services:
   - Lemonsqueezy (get API key from dashboard)
   - Discord (create webhook, get invite link)
   - Gmail (authorize with API)
   - Supabase (get API key)
   - Slack (create webhook)
   - Twitter (get API keys)
5. Test with sample data
6. Activate workflow

---

## Estimated n8n Cost

- **Free tier:** Runs all 7 workflows indefinitely (no cost)
- **Pro tier:** If you hit limits, $20-50/month
- **Lemonsqueezy API:** Free (part of their product)
- **Gmail API:** Free

**Total monthly n8n cost: $0-50**

---

## Monitoring & Logging

All workflow executions are logged in n8n. Check the "Executions" tab to see:
- ✓ Successful runs
- ✗ Failed runs (and why)
- ⏱ Duration
- 📊 Metrics

Set up Slack alerts for failures so you know immediately if something breaks.
