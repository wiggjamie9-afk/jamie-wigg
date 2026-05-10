---
name: linkedin-writer
description: Draft a LinkedIn post in brand voice, optimised for LinkedIn format and audience.
triggers:
  - "Draft a LinkedIn post on [topic]"
  - "Turn this brief into a LinkedIn post"
  - "LinkedIn version of this"
---

# LinkedIn Writer

## Inputs

- **source** (required) — either a research brief from `/research/` or a raw idea / paste.
- **angle** (optional) — if missing, ask exactly one clarifying question to lock the angle.

## Workflow

1. Read all four context files: `/context/brand-voice.md`, `/context/audience-profile.md`, `/context/platform-rules.md`, `/context/content-themes.md`.
2. If a research brief was provided, use it. If not, ask one clarifying question before drafting.
3. Draft using the LinkedIn rules in `/context/platform-rules.md`. Do not invent rules that aren't in those files. If a rule seems missing, flag and ask.
4. Universal craft: lead with the insight (no setup line), end with a question or clear takeaway (no generic CTA), keep it tight.
5. Length: defer to platform-rules.md. If unspecified, aim for 1,200–1,800 characters; go shorter when sharper.
6. Apply both voice tests from brand-voice.md (Stat Test, Setup Test).
7. Output the post in chat. Save the file. Ask if the operator wants to iterate.

## Output

- **Saved to:** `/drafts/linkedin/[topic-slug]-[YYYY-MM-DD].md`
- **File contents:**

```md
# [Topic] — LinkedIn

## Hook
[Line 1 — must pass Stat Test.]

## Body
[Post body, formatted for LinkedIn: short paragraphs, blank lines, no links in body.]

## Hashtags
#tag1 #tag2 #tag3

## Link (drop in first comment after posting)
[URL or "none"]

## Notes
- Character count: [X]
- Voice tests: Stat Test [pass/fail], Setup Test [pass/fail]
- Pillar: [from /context/content-themes.md]
```

## Stop conditions

- Stop and ask before publishing if either voice test fails twice in a row.
- Never schedule from this skill — that's Auto-Scheduler's job.
