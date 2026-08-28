---
name: instagram-writer
description: Draft an Instagram caption — carousel or feed-post format — paired optionally with a Visual Generator carousel.
triggers:
  - "Draft an Instagram caption for this carousel"
  - "IG version of this"
  - "Instagram feed post on [topic]"
---

# Instagram Writer

## Inputs

- **format** (required) — `carousel` or `feed`. If unspecified, ask.
- **source** — research brief, post draft from another platform, or raw idea.
- **manychat_keyword** (required for carousel) — the keyword that triggers the DM auto-reply.

## Workflow

1. Read all four context files first.
2. Confirm format if not provided.
3. Draft per platform-rules.md.

### Carousel caption
- Hook in 8 words or fewer (Instagram truncates around 125 chars on mobile).
- 2–4 short paragraphs after the hook.
- End with the ManyChat trigger: `Comment [KEYWORD] and I'll DM you the [resource].`
- Length: 800–1,500 characters.

### Feed post caption
- Same hook rule (8-word truncate-safe opener).
- Tighter overall. 400–800 characters.

4. Hashtag rules: defer to platform-rules.md. Default if unspecified: 8–15 hashtags, mix of broad / niche / tool-specific, end of caption.
5. Apply every voice rule from brand-voice.md.
6. Save file. Output in chat. Ask if the operator wants to iterate.

## Output

- **Saved to:** `/drafts/instagram/[topic-slug]-[YYYY-MM-DD].md`

```md
# [Topic] — Instagram [carousel|feed]

## Hook (line 1, < 8 words)
[Hook]

## Body
[Caption body — 2–4 short paragraphs.]

## CTA
Comment [KEYWORD] and I'll DM you the [resource].

## Hashtags
#tag1 #tag2 ... #tag10

## Notes
- Char count: [X]
- Pillar: [from content-themes.md]
- Voice tests: Stat Test [pass/fail], Setup Test [pass/fail]
- ManyChat keyword: [KEYWORD]
- Paired carousel: [link to /drafts/carousel-briefs/... or "feed-only"]
```
