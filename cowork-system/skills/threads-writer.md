---
name: threads-writer
description: Draft a Threads post or 2–3 post chain in brand voice.
triggers:
  - "Draft a Threads post on [topic]"
  - "Threads version of this"
---

# Threads Writer

## Workflow

1. Read all four context files first.
2. Defer to `/context/platform-rules.md` for character limit and chain length. Default if unspecified: 500 chars per post, max 3 posts in a chain.
3. Hook must land in the first 6 words.
4. Format: short lines, lots of white space, plain English, no hashtags in body.
5. Apply every rule in `/context/brand-voice.md`. Don't invent rules.
6. If the topic is heavy or has a real argument arc, use a chain. If it's a single insight, one post is better.
7. Output in chat, save to file, ask if the operator wants to iterate.

## Output

- **Saved to:** `/drafts/threads/[topic-slug]-[YYYY-MM-DD].md`

```md
# [Topic] — Threads

## Format
[single | chain-2 | chain-3]

## Post 1
[Hook in first 6 words. Then 1–2 short paragraphs.]

## Post 2 (if chain)
[...]

## Post 3 (if chain)
[...]

## Notes
- Char count per post: [X / Y / Z]
- Pillar: [from content-themes.md]
- Voice tests: Stat Test [pass/fail], Setup Test [pass/fail]
```
