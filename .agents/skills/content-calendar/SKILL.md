---
name: content-calendar
description: Plan a month of social posts for a client into clients/<slug>/context/content-calendar/<YYYY-MM>.md. Reads brand-style.md and last month's review (if any). Produces a numbered list of posts with hook, theme, format, target date, and target platform — the input for /caption-writer and /social-creative-designer. Run once per month per client.
metadata:
  tags: social, calendar, planning
---

# Content Calendar

Plan a month. Don't write it. Don't design it. Just decide *what gets posted, when, and why*.

## When to use

- "Plan <client>'s content for <month>"
- "What should we post next month?"
- Orchestrator dispatch from `/social-media-manager` step 2

## Inputs

Read in order:

1. `clients/<slug>/context/brand-style.md` — required. If missing, stop and ask the user to run `/brand-onboarding <slug>` first.
2. `clients/<slug>/outputs/reviews/<previous-YYYY-MM>.md` — optional. If present, the "What's working / What's not" sections drive emphasis.
3. `clients/<slug>/context/content-calendar/<previous-YYYY-MM>.md` — optional. Used to avoid repeating hooks/themes within 60 days.

If the user gave you a theme, anchor event, or campaign for the month (launch, sale, holiday), let that override.

## Output

Write `clients/<slug>/context/content-calendar/<YYYY-MM>.md`:

```markdown
# <Brand> — <Month YYYY> Content Calendar

## Theme
<one-sentence editorial through-line for the month>

## Posts

| # | Date | Platform | Format | Hook | Theme | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | YYYY-MM-DD | tiktok | short-video | "<8-word hook>" | <bucket> | <optional> |
| 02 | YYYY-MM-DD | instagram | carousel | "<8-word hook>" | <bucket> | |
| ... | | | | | | |

## Buckets used this month
- <bucket A>: <count>
- <bucket B>: <count>
- ...
```

### Cadence rules

- **Cadence comes from `brand-style.md` → Channels & cadence**. Don't invent a posting schedule.
- **Mix formats** — never more than 3 of the same format in a row.
- **Mix buckets** — at least 3 distinct themes/buckets per month. Common buckets: product proof, founder POV, behind-the-scenes, audience win, comparison/positioning, bold opinion, evergreen tip.
- **Anchor anything time-sensitive first** (launch, sale, holiday) and fill the rest around it.
- **Hooks are 8 words max** and are the literal opening line, not a topic label. "Most AI music sounds like a microwave" beats "Quality positioning post."

### Format vocabulary (use these names exactly)

`short-video`, `long-video`, `carousel`, `single-image`, `single-text`, `live`, `story`, `reply-video`.

## Validation

- Number of posts equals (cadence per week) × (weeks in the month). No more, no less.
- Every row has a date, platform, format, hook, and bucket.
- No hook appears in last month's calendar.
- Theme buckets respect any "Anti-patterns" listed in `brand-style.md`.

## Heartbeat

```
<ISO> · content-calendar · <slug> <YYYY-MM> · clients/<slug>/context/content-calendar/<YYYY-MM>.md · <N posts>
```
