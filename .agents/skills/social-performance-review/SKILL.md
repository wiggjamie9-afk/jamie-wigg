---
name: social-performance-review
description: End-of-month review. Reads the month's calendar + the metrics the user pastes in, writes clients/<slug>/outputs/reviews/<YYYY-MM>.md with what worked, what didn't, and what to change. Updates clients/<slug>/context/brand-style.md → "What's working" section so the next month's calendar inherits the lessons. Run end of month, after metrics are available.
metadata:
  tags: social, review, analytics, feedback-loop
---

# Social Performance Review

Closes the loop. Without this skill, the system makes the same mistakes every month.

## When to use

- "Review <client>'s <month>"
- "Recap last month"
- Orchestrator dispatch from `/social-media-manager` step 4
- End of every month, before planning the next month's calendar

## Inputs

Required:

1. `clients/<slug>/context/content-calendar/<YYYY-MM>.md` — the plan for the month under review.
2. **Metrics** — provided by the user as a paste, CSV, or screenshot. **Never invent numbers.** If metrics are missing, ask:

   ```
   For each post in <month>'s calendar, paste:
   - post # (NN)
   - impressions / views
   - engagement rate (likes + comments + shares / impressions)
   - saves / bookmarks (if applicable)
   - clicks / link taps (if applicable)

   CSV with columns: post,impressions,engagement_rate,saves,clicks
   ```

3. Optional: `clients/<slug>/outputs/reviews/<previous-YYYY-MM>.md` — to track trend deltas.

## Output

### 1. Write `clients/<slug>/outputs/reviews/<YYYY-MM>.md`:

```markdown
# <Brand> — <Month YYYY> Performance Review

## Summary
- Posts shipped: <N>
- Median engagement: <%>
- Top post: #<NN> (<hook>) — <impressions>, <engagement>%
- Worst post: #<NN> (<hook>) — <impressions>, <engagement>%
- Trend vs. last month: <up/down N% on engagement>

## What worked
- <bucket / format / hook pattern> — concrete reason why, with numbers
- ...

## What didn't
- <bucket / format / hook pattern> — concrete reason why, with numbers
- ...

## Per-post table

| # | Hook | Format | Impressions | ER % | Saves | Clicks | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | ... | ... | ... | ... | ... | ... | hit/miss/flat |

## Recommendations for next month
1. <specific change to bucket mix, format mix, hook pattern, or cadence>
2. <specific>
3. <specific>

## Open questions
- <thing the data alone can't answer — for the human>
```

### 2. Update `clients/<slug>/context/brand-style.md` → "What's working" section

Append (don't overwrite) to that section:

```markdown
## What's working
### <YYYY-MM>
- <one-line takeaway 1>
- <one-line takeaway 2>
- <one-line takeaway 3>
```

This is the feedback loop — next month's `/content-calendar` reads it.

## Rules

- **Never invent metrics.** If the user didn't paste a number, write `?` and flag it in "Open questions."
- **"Verdict" thresholds**:
  - `hit`: top 25% of the month on engagement rate.
  - `miss`: bottom 25%.
  - `flat`: middle 50%.
- **Recommendations are specific and actionable.** Bad: "post more video." Good: "shift bucket mix from 60% product proof to 40%, add a 'comparison' post weekly — the two comparison posts this month had 2.3× median ER."
- **Don't recommend the same change two months in a row.** If last month's review said the same thing and nothing changed, escalate it to the user as a blocker, not a recommendation.
- **No vanity metrics.** Followers gained / impressions alone don't go in "What worked." Engagement rate, saves, clicks, and reply quality do.

## Validation

- Per-post table row count == calendar row count for the month.
- Every "What worked / didn't" bullet cites a specific post # or pattern.
- "What's working" was actually appended to `brand-style.md` (read it back to confirm).

## Heartbeat

```
<ISO> · social-performance-review · <slug> <YYYY-MM> · <output-path> · <hits>/<total> hits
```
