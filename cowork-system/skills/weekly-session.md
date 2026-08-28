---
name: weekly-session
description: Run the full weekly content production sequence end to end, from one input to scheduled posts.
triggers:
  - "Run my weekly content session for [topic]"
  - "Weekly session"
---

# Weekly Session

Wraps Research Agent → all four platform writers → Visual Generator → Auto-Scheduler into one approved-at-each-gate flow.

## Workflow

1. **Confirm topic + input source** before starting:
   - Topic
   - Input: transcript file path in `/transcripts/`, paste, URL, or topic line
2. Run **Research Agent**. Present the brief. Wait for approval.
3. Run platform writers **in this order**, pausing for approval after each draft:
   1. **Instagram Writer** (carousel format unless feed is requested)
   2. **LinkedIn Writer**
   3. **Threads Writer**
   4. **TikTok Hook + Script**
4. Run **Visual Generator**:
   - Instagram carousel (Mode A or B per operator choice / brand-style.md presence)
   - LinkedIn carousel (same template family)
   - Confirm template / mode before generating.
5. Once everything is approved, ask for the **schedule**:
   - Date and time per platform
   - Timezone
6. Run **Auto-Scheduler** for each.
7. Print a final summary:
   - What got drafted (file paths)
   - What got scheduled (platform + time + Blotato URL)
   - Anything flagged for review

## Stop conditions

- Stop at every approval gate. Never proceed to the next skill without explicit yes.
- If any voice test fails twice on a draft, surface and ask before forcing a third attempt.
- Never schedule without explicit confirmation of platform, body, visual URL, and time.
