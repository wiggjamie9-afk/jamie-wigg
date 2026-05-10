---
name: auto-scheduler
description: Schedule an approved post to one or more platforms via Blotato.
triggers:
  - "Schedule this post for [date and time]"
  - "Schedule the LinkedIn version for tomorrow at 9am"
---

# Auto-Scheduler

## Prerequisites

- Blotato MCP connected.
- The relevant social account is connected and verified inside Blotato (green status).
- An approved draft exists in `/drafts/[platform]/`.

## Workflow

1. **Confirm with the operator** before any Blotato call:
   - Platform(s)
   - Post body / caption (read from the draft file)
   - Visual URL (if applicable — from `/assets/` or carousel build)
   - Exact date and time + timezone
2. **Never schedule without explicit yes.** If the operator's confirmation is ambiguous, ask again.
3. Call the Blotato post creation tool with all required fields.
4. Confirm in chat once scheduled, with a link to the scheduled post.
5. Move the draft from `/drafts/[platform]/` to `/published/[platform]/` once successfully scheduled. Append a metadata block to the file:

```md
## Scheduled
- Platform: [linkedin|instagram|threads|tiktok]
- Scheduled at: [ISO timestamp + tz]
- Blotato post ID / URL: [...]
- Visual URL: [... or "none"]
- ManyChat keyword: [... or "n/a"]
```

## Stop conditions

- Stop and ask if the visual URL is missing for a carousel.
- Stop and warn if the scheduled time is within 30 minutes (gives no buffer for review).
- Stop and warn if posting more than once on the same platform on the same day (LinkedIn especially).
