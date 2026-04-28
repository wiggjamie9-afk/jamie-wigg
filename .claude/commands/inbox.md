---
description: Triage Gmail inbox into URGENT / NEEDS REPLY / FYI / JUNK and draft tone-matched replies
---

# Inbox triage

Scan my Gmail inbox, triage emails into **URGENT / NEEDS REPLY / FYI / JUNK**, auto-label using my existing labels, then draft replies tone-matched to my last 20 sent emails.

## What you need to do
1. Use the Gmail MCP server (or Gmail API via a script) to list unread mail in the primary inbox.
2. For each email, classify into one of the four buckets and apply the corresponding Gmail label.
3. For anything in **NEEDS REPLY**, study my last 20 sent messages to learn voice, then draft a reply in Gmail's drafts folder — do NOT send.
4. Print a summary table: sender, subject, bucket, "draft ready y/n".

## Required setup (do once, outside Claude Code)
- Gmail API OAuth credentials, OR a Gmail MCP server configured in `.claude/settings.json`.
- Existing labels in Gmail named: `URGENT`, `NEEDS REPLY`, `FYI`, `JUNK` (create them if missing).
- To run hourly: a host (cron, GitHub Actions on a schedule, or a server) invoking `claude -p "/inbox"` non-interactively.

## Notes
- This command does the triage on demand. Hourly automation needs a scheduler — Claude Code itself doesn't run on a timer.
- Never auto-send. Drafts only.
