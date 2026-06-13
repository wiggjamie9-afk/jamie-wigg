# EventAI Academy — n8n Social Media & Content Workflows

Extends the base 7 workflows with automated social media content generation and distribution.

## Workflow 8: Weekly Social Media Content Pipeline

**Trigger**: Every Monday at 8 AM

**Purpose**: Generate and schedule social media posts about the current week's modules

**Nodes**:

```
Cron: Every Monday 8 AM
  ↓
Supabase: Get current week + modules
  ↓
Function: Extract module titles and descriptions
  ↓
Parallel branches:
  ├─ LinkedIn: Post professional angle
  ├─ Twitter: Post punchy thread
  ├─ Discord: Announce in #announcements
  ├─ Email: Send digest
  └─ YouTube: Update playlist
```

**LinkedIn Post Template** (Professional angle):

```
Building toward revenue? Week [X] of EventAI Academy.

This week: [Module 1], [Module 2], [Module 3]

50+ students are shipping real platforms. The curriculum moves fast—each module builds on the last. No fluff, just practical skills.

What's your biggest blocker building a SaaS? Drop it below.

[Button: Join the Academy]
```

**Twitter Thread Template** (Punchy, staggered):

```
Tweet 1:
Week [X] of building your event platform 🚀

What we're covering:
• [Module 1]
• [Module 2]
• [Module 3]

All in one week. Students shipping live this month.

Tweet 2:
The curriculum is battle-tested. Every student builds a real platform.

Not tutorials. Not theory. Real code, real users, real revenue.

Tweet 3:
30-day money-back guarantee. No BS. If it's not worth it by day 30, we refund you.

[Button: Start Building]
```

---

## Workflow 9: Student Win Amplification

**Trigger**: When student marks checkpoint as complete

**Purpose**: Automatically create and post celebration content

**Nodes**:

```
Supabase Trigger: Checkpoint marked complete
  ↓
Function: Extract student name, platform, week
  ↓
Parallel:
  ├─ Discord: Post celebration in #wins
  ├─ Email: Send congratulations + video
  ├─ Twitter: Post student win (if opted in)
  ├─ Image Gen: Create share graphic
  └─ Video: Generate win celebration video
```

**Discord Post**:

```
🎉 Checkpoint Done!

@[name] just completed Week [X]!

Platform: [platform_name]
Status: [status]

One step closer to launch. Keep going! 🚀
```

**Share Graphic** (Generated via image API):

```
Template specs:
- 1200×630px (Twitter/LinkedIn)
- Background: RHYTHMIX gradient (blue to purple)
- Text: "[Name] completed Week [X]"
- Subtext: "EventAI Academy • Building [platform]"
- Bottom: "buildtheeventai.com"
- Color accent: #9333EA (purple)
```

**Video Generation** (Using HyperFrames template):

```
Generate from: ACADEMY_MODULE_VIDEO_TEMPLATES.md → Win Celebration
- Student name (from Supabase)
- Platform name (from Supabase)
- Render to MP4
- Upload unlisted to YouTube
- Return video URL
```

---

## Workflow 10: Monthly Content Report

**Trigger**: Last Friday of month at 3 PM

**Purpose**: Create month-in-review content showing progress

**Nodes**:

```
Cron: Last Friday, 3 PM
  ↓
Supabase: Aggregate month data
  - New enrollments
  - Platforms launched
  - First customers
  - Revenue
  ↓
Image Gen: Create infographic
  ↓
Parallel:
  ├─ Email: Send internal monthly report
  ├─ Twitter: Post month stats (public)
  ├─ Discord: Post public summary
  └─ YouTube: Update "Academy Progress" playlist description
```

**Monthly Stats Post** (Twitter thread):

```
Tweet 1:
Month [X] recap: EventAI Academy 📊

[X] students enrolled
[Y] platforms launched
[Z] earning $1K+ MRR

The velocity keeps increasing. Here's why:

Tweet 2:
The curriculum is tight. No filler modules. Each week builds directly to revenue.

Week 1-4: Foundation (live website)
Week 5-8: Intelligence (AI features)
Week 9-10: Mobile (users on the go)
Week 11-12: Revenue (first paying customers)

Tweet 3:
Most common first platform niche?

Event management for weddings.
Niche events (conferences, marathons).
Community event discovery.

The demand is there. The founders are executing.

Tweet 4:
You don't need a unique idea. You need execution.

[Button: Start Building]
```

**Internal Report Email**:

```
Subject: Academy Month [X] Report 📈

Hi Jamie,

Here's how this month went:

Enrollments: [X] (+[%] vs last month)
Revenue: $[X] (target: $[X])
Platforms launched: [X]
Paying customers: [X]
Churn: [X]%

Top student wins:
1. [Name] - [Platform] - $[MRR]/mo
2. [Name] - [Platform] - $[MRR]/mo
3. [Name] - [Platform] - $[MRR]/mo

Content performance:
- Most watched module: [X] ([Y]% completion)
- Least watched: [X] ([Y]% completion)
- Checkpoint submission rate: [X]%

Next month focus:
- Improve [module] clarity
- Add [feature] to dashboard
- Reach [target] enrollments
```

---

## Workflow 11: Discord Engagement Automation

**Trigger**: 
- Every 24 hours (health check)
- On new message (engagement boost)

**Purpose**: Keep Discord active and supportive

**Nodes**:

```
Cron: Every 24 hours
  ↓
Discord: Check for inactive threads
  ↓
Conditional:
  - If #module-X has no replies in 24h
    → Discord: Post motivational message
  - If new student in #introductions
    → Discord: Send welcome bot response + link to Module 1
  - If someone says "stuck" or "error"
    → Discord: Post FAQ link + support resources
```

**Motivational Prompt** (if channel quiet):

```
Hey everyone! 👋

Working through [Module X] this week? Drop any questions here.

Remember:
• No dumb questions
• Real builders are stuck too
• We're all shipping something

Let's go! 🚀
```

**Auto-Welcome** (on new member):

```
@[name] Welcome to EventAI Academy! 🎉

Quick start:
1. Introduce yourself in #introductions
2. Check #resources for guides and templates
3. Start Module 1: [link]
4. Ask questions in #module-1-to-5

You're not alone. 200+ people have done this. You can too.

Let's build! 🚀
```

**Help Response** (when keywords detected):

```
Stuck on something? Here's help:

📌 FAQ: [link]
💬 Ask in this channel
🎥 Watch Module X again: [link]
📚 Code templates: [link]
🤝 Find an accountability partner: [link]

You've got this! 💪
```

---

## Workflow 12: Email Weekly Digest

**Trigger**: Every Sunday at 2 PM

**Purpose**: Summarize the week and preview next week

**Nodes**:

```
Cron: Every Sunday 2 PM
  ↓
Supabase: Get weekly data
  - Modules for next week
  - Student stats
  - Top Discord topics
  - Live call time
  ↓
Function: Format email template
  ↓
Gmail: Send to all students
```

**Email Template**:

```
Subject: Week [X] Recap + What's Coming 📬

Hi [name],

You crushed Week [X-1]! Here's what's next:

THIS WEEK RECAP
Modules covered: [3-4 module titles]
Students launched: [X]
Most helpful resource: [YouTube link]

NEXT WEEK (Week [X])
We're diving into: [module focus]

Modules:
• [Module title] - [30 min video]
• [Module title] - [25 min video]
• [Module title] - [20 min video]

Checkpoint due: Friday 11:59 PM ET

LIVE CALLS
• Tuesday 11 AM ET: Office hours (1 hour)
• Friday 5 PM ET: Casual hangout (30 min)

STUDENT WINS
Great work this week:
• [Name] deployed to iOS
• [Name] got first customer
• [Name] hit 500 users

RESOURCES
- Module templates: [link]
- Discord community: [link]
- Office hours Zoom: [link]

See you Tuesday!
— Jamie

P.S. Remember: Progress > perfection. Ship something this week. 🚀
```

---

## Workflow 13: New Module Release Pipeline

**Trigger**: Manual (or on set schedule, e.g., every Monday 8 AM)

**Purpose**: Release new module and amplify across all channels

**Nodes**:

```
Manual trigger OR Cron: Monday 8 AM
  ↓
Input: Module number, title, video URL, GitHub repo
  ↓
Parallel (all at once):
  ├─ Supabase: Update academy_modules table
  ├─ Discord: Post in #announcements + module-specific channel
  ├─ Email: Send to students in that cohort
  ├─ Twitter: Thread announcement
  ├─ YouTube: Update playlist + add to channel section
  ├─ Dashboard: Update "Available Modules"
  └─ Slack: Notify admin
```

**Discord Announcement**:

```
📚 **NEW MODULE: [Title]**

Now live! [Video duration]

Watch here: [YouTube link]
Code templates: [GitHub link]
Discussion: [Thread in #module-X-to-Y]

This week we're learning [brief description]

Questions? Drop them in #module-X-to-Y!

🎯 Checkpoint due Friday
```

**Email Announcement**:

```
Subject: ✨ Module [X] is Live! [Title]

Hi [name],

Module [X] just dropped. Here's what you're learning:

[Module title]
[1-2 sentence description]

📺 Watch (30 min): [YouTube link]
💻 Code templates: [GitHub link]
📝 Checkpoint due: Friday

What to expect:
• [Learning outcome 1]
• [Learning outcome 2]
• [Learning outcome 3]

This module is the foundation for everything next week. Watch it early so you can ask questions in Discord.

See you Tuesday in office hours!
— Jamie
```

**Twitter Announcement** (Thread):

```
Tweet 1:
NEW MODULE: [Title]

Now live on EventAI Academy 🎬

[1-2 sentence teaser]

Module [X] is live for all students

Tweet 2:
What you'll learn:
• [Outcome 1]
• [Outcome 2]
• [Outcome 3]

Total video: 30 min
Code templates: [GitHub link]
Discussion: our Discord community

Tweet 3:
This is the module that makes everything click.

Past students said this was the turning point from "trying to build" to "building shipping products."

Watch it this week. Don't fall behind. 🚀

[Button: Enroll]
```

---

## Setup Instructions

1. **Create n8n workflows**:
   - Log into http://localhost:5678 (or your n8n instance)
   - Create new workflow for each above
   - Add nodes according to specs

2. **Connect services**:
   - **Supabase**: API key from dashboard
   - **Discord**: Bot token + webhook URLs
   - **Gmail**: OAuth2 with API enabled
   - **Twitter**: API keys (v2 API)
   - **YouTube**: API key
   - **Image generation** (optional): Replicate, Pollinations, or custom API

3. **Test each workflow**:
   - Send test data
   - Check output in Slack/Discord
   - Verify email sends
   - Monitor logs for errors

4. **Schedule to run**:
   - Cron-based workflows activate automatically on schedule
   - Manual workflows require button click or webhook trigger
   - Set up monitoring/alerting via Slack if needed

---

## Cost Estimate

| Workflow | Cost/Month |
|---|---|
| Social posting (Workflows 8-13) | $0 (n8n free tier) |
| Email sending (Gmail API) | $0 (Gmail free tier) |
| Discord/Twitter API | $0 (free tier) |
| Optional: Image generation | $5-20 (Replicate) |
| **Total** | **$0-20/month** |

---

## Metrics to Track

- **Engagement**: Discord messages/week, Twitter impressions, email open rate
- **Conversion**: Clicks from email → enrollment, Twitter → enrollment
- **Content**: Module completion rate, video watch time, checkpoint submission
- **Wins**: Platforms launched, revenue milestones, student testimonials

Update monthly report (Workflow 10) with these to refine messaging and timing.
