---
name: tiktok-script
description: Generate a TikTok hook (first 3s) and a 30–45s script body.
triggers:
  - "Write a TikTok script on [topic]"
  - "TikTok version of this"
---

# TikTok Hook + Script

## Workflow

1. Read all four context files.
2. Generate **3 hook options**. Each must be under 12 words and make the viewer need the next sentence. Output them as a numbered list and wait for the operator to pick.
3. After a hook is chosen, write the full script:
   - Hook (chosen)
   - 1-line setup (what we're solving)
   - The demo or insight (main 20–30 seconds — describe what's on screen as much as what's spoken)
   - 1-line payoff
   - 1-line CTA: `comment [keyword] on my Instagram post and I'll DM you the [resource]` (off-platform because TikTok DM is unreliable)
4. Apply every brand-voice.md rule. Spoken English. Short sentences. No jargon. No fluff.
5. Output in chat. Save the file. Ask if the operator wants to iterate.

## Output

- **Saved to:** `/drafts/tiktok/[topic-slug]-[YYYY-MM-DD].md`

```md
# [Topic] — TikTok

## Hook options (operator picks 1)
1. [Hook A]
2. [Hook B]
3. [Hook C]

## Selected hook
[Locked hook]

## Setup (1 line)
[…]

## Demo / insight (20–30s)
[Voiceover lines]

[On-screen action / b-roll cues]

## Payoff (1 line)
[…]

## CTA (1 line)
Comment [KEYWORD] on my Instagram post and I'll DM you the [resource].

## Caption (80–150 chars)
[Caption with hook in first 8 chars + 3–5 hashtags]

## Notes
- Total runtime estimate: [X seconds]
- Pillar: [from content-themes.md]
- Voice tests: Stat Test [pass/fail], Setup Test [pass/fail]
```
