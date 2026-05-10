---
name: caption-writer
description: Write a single ready-to-post caption (hook + body + CTA + hashtags) for one row of the content calendar. Reads brand-style.md + the calendar row, writes to clients/<slug>/outputs/captions/<YYYY-MM>/<NN-slug>.md. Invoked once per post by /social-media-manager. For batch writing, the orchestrator loops this skill across calendar rows in order.
metadata:
  tags: social, captions, writing
---

# Caption Writer

One post in, one caption out. No batching inside this skill — the orchestrator loops.

## When to use

- "Write the caption for post <NN> of <YYYY-MM>"
- Orchestrator dispatch from `/social-media-manager` step 3a

## Inputs

Required:

1. `clients/<slug>/context/brand-style.md` — voice, anti-patterns, audience.
2. `clients/<slug>/context/content-calendar/<YYYY-MM>.md` — find the row matching `<NN>`.

If either is missing, stop and surface a clear error — don't fake it.

## Output

Write `clients/<slug>/outputs/captions/<YYYY-MM>/<NN>-<kebab-slug-from-hook>.md`:

```markdown
---
post: <NN>
date: YYYY-MM-DD
platform: <platform>
format: <format>
hook: "<exact hook from calendar>"
bucket: <bucket>
---

## Caption

<HOOK — one line, exactly the hook from the calendar, verbatim>

<BODY — 2-5 short lines, line breaks for rhythm. Plain words. No corporate adjectives. Show, don't tell.>

<CTA — one line, action-oriented, specific. Never "link in bio" alone — pair with a reason.>

## Hashtags
#tag1 #tag2 #tag3 #tag4 #tag5

## Alt text
<one sentence describing the visual for accessibility>

## Notes for designer
<1-2 bullets — what the creative needs to convey, any must-include element, any must-avoid>
```

## Rules

- **Hook is the calendar's hook, verbatim.** Don't rewrite it. If you think the hook is weak, surface that to the user — don't silently change it.
- **Voice = brand-style.md.** Read the "Voice" + "Sample sentence" sections every run. If the brand says "we are NOT corporate," don't write "we're excited to announce."
- **Length by platform**:
  - tiktok / instagram-reels: 80-150 chars on-screen friendly, plus body (max 220 chars total).
  - instagram-feed / carousel: 200-600 chars body OK.
  - twitter/x: 280 chars hard cap, no hashtags in body (move them to a follow-up if needed).
  - linkedin: 600-1200 chars, 3-5 short paragraphs.
  - threads: 280 chars, lean conversational.
- **Hashtags**: 3-5 niche > 30 generic. Pull from the brand's audience vocabulary, not trending lists.
- **No emoji unless** the brand-style file explicitly allows them.
- **CTA is concrete**: "comment 'BETA' for the link" beats "check it out."

## Validation

Before writing, confirm:

- The hook in the file matches the calendar row exactly.
- Hashtag count is in the 3-5 range.
- Caption respects platform character limits.
- Voice anti-adjective from `brand-style.md` does not appear.

## Heartbeat

```
<ISO> · caption-writer · <slug> <YYYY-MM> <NN> · <output-path> · ok
```
