---
name: performance-reviewer
description: Review the last 30 days of content performance and update context files so the system gets smarter.
triggers:
  - "Run my monthly performance review"
  - "Performance review for [month]"
---

# Performance Reviewer

## Workflow

1. Ask the operator to upload or paste the last 30 days of analytics — CSVs from each platform, screenshots, or manual numbers. Accept any format.
2. Read current `/context/` files and `/published/` posts so it knows what was tested.
3. Identify:
   - **Top 3 performing posts** and what they had in common (hook style, pillar, format, time, day, length).
   - **Bottom 3 performing posts** and what dragged them.
   - **Hooks** that landed vs flopped.
   - **Topics** that resonated vs missed.
   - **Format patterns** (carousel vs single image vs text-only vs short video).
4. Output a one-page review with clear recommendations.
5. **Ask permission**, then:
   - Update `/context/best-performers.md` with the top examples (creates the file if it doesn't exist).
   - Tweak `/context/content-themes.md` if a pillar is dying or a new one is emerging.
   - Tweak `/context/brand-voice.md` if a hook style is consistently winning or losing.
6. Save the review to `/performance/[YYYY-MM]-review.md`.

## Output format

```md
# [Month YYYY] — Performance Review

## TL;DR
- Top performer: [post] — [why it worked, one line].
- Bottom performer: [post] — [why it tanked, one line].
- Headline change: [one concrete recommendation].

## Top 3 posts
| Rank | Post | Platform | Pillar | Format | Hook style | Key metric |
|------|------|----------|--------|--------|-----------|------------|
| ...

## Bottom 3 posts
| Rank | Post | Platform | Pillar | Format | Hook style | Key metric |
|------|------|----------|--------|--------|-----------|------------|
| ...

## Patterns
- Hooks that won: [...]
- Hooks that lost: [...]
- Pillars that won: [...]
- Pillars that lost: [...]
- Format pattern: [...]
- Time-of-day pattern: [...]

## Recommendations (top 3)
1. [Recommendation, with the specific context file to edit and the diff.]
2. ...
3. ...

## Proposed context-file edits
- `/context/best-performers.md`: append [N] examples.
- `/context/content-themes.md`: [diff].
- `/context/brand-voice.md`: [diff or "no change"].
```

## Stop conditions

- Don't change context files without explicit yes.
- If sample size is too small (fewer than 8 posts), say so and recommend waiting another 2 weeks.
