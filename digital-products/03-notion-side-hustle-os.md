# Notion Side-Hustle OS

**A Notion workspace template that runs your side hustle on autopilot — projects, customers, finance, content, ideas, all linked.**

Price: **$29**

Sales blurb:
> Most "Notion templates" are pretty dashboards that fall apart in week 3. This one is built around the actual workflow of running a side business while employed full-time: leads come in → projects get done → invoices go out → customers stay tracked → content keeps shipping. 8 connected databases, no fluff.

3-bullet description:
- 8 linked databases — Leads, Projects, Customers, Invoices, Content, Ideas, Goals, Reviews
- Designed for ~5 hours/week of upkeep, not 5 hours/day
- Markdown source — import to Notion in 60 seconds

---

## How to import to Notion

1. Open Notion → New page → `…` menu → Import → Markdown.
2. Upload this file. Notion will create one page; manually drag sub-sections into a database when you want database functionality.
3. Or: paste each section below into a new database manually using the property schemas.

---

## Database 1: Leads

**Purpose:** Track everyone who showed any interest. Most won't convert. That's fine.

**Properties:**
- `Name` (Title)
- `Source` (Select: TikTok / Twitter / LinkedIn / Cold email / Referral / Other)
- `Pain` (Text — what problem are they trying to solve)
- `Status` (Select: New / Contacted / In Convo / Proposal Sent / Won / Lost / Ghosted)
- `Last Touch` (Date)
- `Next Action` (Text)
- `Estimated Value` (Number, $)
- `Notes` (Text)

**View 1:** Kanban grouped by Status.
**View 2:** Table sorted by Last Touch ascending — surfaces leads going cold.

## Database 2: Projects

**Purpose:** Active work that has a deliverable and a deadline.

**Properties:**
- `Project` (Title)
- `Customer` (Relation → Customers DB)
- `Status` (Select: Not Started / In Progress / Awaiting Feedback / Done / Cancelled)
- `Deadline` (Date)
- `Hours Logged` (Number)
- `Hours Estimated` (Number)
- `Burn` (Formula: `Hours Logged / Hours Estimated`)
- `Deliverable` (Files / URL)
- `Invoice` (Relation → Invoices DB)

**View 1:** Board grouped by Status.
**View 2:** Calendar by Deadline.
**View 3:** Table filtered to Burn > 0.8 (over budget warning).

## Database 3: Customers

**Purpose:** Past + current paying customers. Source of testimonials, repeat sales, and referrals.

**Properties:**
- `Name` (Title)
- `Email` (Email)
- `First Purchase` (Date)
- `Total Spent` (Rollup of Invoices DB → Sum)
- `Last Interaction` (Date)
- `NPS` (Number 0–10)
- `Tags` (Multi-select: Repeat / High-value / Referral source / At-risk)
- `Testimonial` (Text)

**View 1:** Table sorted by Total Spent descending.
**View 2:** Filter where Last Interaction < 90 days ago AND NPS >= 8 — referral-ready list.

## Database 4: Invoices

**Properties:**
- `Invoice #` (Title — autoincrement manually, e.g. INV-001)
- `Customer` (Relation → Customers)
- `Amount` (Number, $)
- `Issued` (Date)
- `Due` (Date)
- `Paid` (Checkbox)
- `Paid On` (Date)
- `Project` (Relation → Projects)

**View 1:** Filter Paid = unchecked, sorted by Due ascending — outstanding invoices.
**View 2:** Filter by month — monthly revenue view.

## Database 5: Content Pipeline

**Purpose:** Every piece of content from idea to published.

**Properties:**
- `Title` (Title)
- `Format` (Select: TikTok / Twitter / LinkedIn / Newsletter / Blog / YouTube / Reel)
- `Status` (Select: Idea / Drafting / Scheduled / Published / Archived)
- `Publish Date` (Date)
- `Hook` (Text)
- `CTA` (Text)
- `URL` (URL — fill in after publishing)
- `Performance` (Select: Bombed / OK / Good / Hit)

**View 1:** Calendar by Publish Date.
**View 2:** Filter by Status = Idea — backlog to draft from.
**View 3:** Filter by Performance = Hit — patterns to copy.

## Database 6: Ideas

**Purpose:** Capture without committing. Most ideas die here. That's the point.

**Properties:**
- `Idea` (Title)
- `Type` (Select: Product / Content / Marketing / Operations / Other)
- `Heat` (Select: Cold / Warm / Hot — how excited am I now)
- `Captured` (Date)
- `Notes` (Text)

**View 1:** Filter Heat = Hot — pull these to Projects when you have capacity.
**View 2:** Filter Captured > 6 months ago AND Heat = Cold — archive in bulk.

## Database 7: Goals (Quarterly)

**Properties:**
- `Goal` (Title)
- `Quarter` (Select: Q1 / Q2 / Q3 / Q4)
- `Year` (Number)
- `Type` (Select: Revenue / Customer / Product / Skill / Personal)
- `Target` (Number or Text)
- `Status` (Select: On Track / At Risk / Off Track / Hit / Missed)
- `Notes` (Text)

**Use:** Set 3–5 per quarter. No more. Review weekly in 5 min.

## Database 8: Weekly Review

**Properties:**
- `Week of` (Date — Monday)
- `Hours Worked` (Number)
- `Revenue Earned` (Number, $)
- `New Leads` (Number)
- `New Customers` (Number)
- `Content Shipped` (Number)
- `Wins` (Text)
- `Lessons` (Text)
- `Next Week Focus` (Text)

**Use:** Friday evening, 15 minutes. Honest entries beat thorough ones.

---

## How the OS works (the actual flow)

```
Idea → Ideas DB
   ↓ (if Heat = Hot)
Lead → Leads DB
   ↓ (if Won)
Project → Projects DB → Invoice → Invoices DB
   ↓ (if Paid)
Customer → Customers DB
   ↓ (every Friday)
Weekly Review → Reflect → Adjust Goals
```

## Setup checklist

- [ ] Create the 8 databases in Notion using the schemas above
- [ ] Set up the relations (Projects ↔ Customers, Projects ↔ Invoices, Invoices ↔ Customers)
- [ ] Add the formula for Burn in Projects
- [ ] Add the rollup for Total Spent in Customers
- [ ] Pin the Weekly Review template to your sidebar
- [ ] First weekly review: this Friday, 15 minutes

## What this OS is NOT

- An accounting system (Quickbooks/Wave still required for taxes)
- A CRM with email tracking (use Mailerlite/ConvertKit)
- A project management tool for teams (this is solo)
