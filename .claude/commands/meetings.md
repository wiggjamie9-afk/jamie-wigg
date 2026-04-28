---
description: Turn a meeting transcript into decisions, action items, a Slack recap, and follow-up emails
argument-hint: [path-to-transcript-or-paste-below]
---

# Meeting memory

When I drop a transcript (path or pasted text) into this command, do the following:

1. **Decisions** — bulleted list of every concrete decision made.
2. **Action items** — table with columns: Owner | Action | Due (if mentioned).
3. **Open questions** — anything raised but not resolved.
4. **Slack recap** — short, casual, ready to paste into a channel.
5. **Follow-up emails** — one draft per external attendee that needs follow-up. Tone-match how I write (study `~/jamie-wigg/text*.txt` or other recent samples in this repo if no other voice reference exists).

## Input
$ARGUMENTS

If `$ARGUMENTS` is empty, ask me to paste the transcript.
If it's a file path, read the file first.

## Output format
Return all five sections in one response, clearly headed. Don't send anything — drafts only.
