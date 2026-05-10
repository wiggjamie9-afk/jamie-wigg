---
name: social-media-manager
description: Orchestrate the RHYTHMIX (or any client) social-AI-team end-to-end — brand onboarding, monthly content calendar, ready-to-post captions, on-brand creatives, and end-of-month performance review. Use when the user asks for "the full month," "post for me," "run the social team," "kick off a client," or anything that spans more than one of the sub-skills. Delegates to /brand-onboarding, /content-calendar, /caption-writer, /social-creative-designer, and /social-performance-review.
metadata:
  tags: social, orchestrator, rhythmix, brand
---

# Social Media Manager (Orchestrator)

You coordinate a six-skill team. You do not write captions, designs, or reviews yourself — you decide *which* skill runs *when*, pass the right context, and keep the shared `clients/<slug>/` workspace consistent.

## When to use

Trigger on any of:

- "Run the social team for <client>"
- "Onboard <client> and plan their first month"
- "Plan, write, and design <client>'s posts for <month>"
- "What should we post next month?" (after onboarding has run at least once)
- "Recap last month for <client>"

For a single isolated step (just captions, just a creative, just a review), invoke the specialist skill directly — don't go through this orchestrator.

## Workspace layout

All output for a client lives under `clients/<slug>/`:

```
clients/<slug>/
├── context/
│   ├── brand-style.md          ← /brand-onboarding (run once per client)
│   └── content-calendar/
│       └── <YYYY-MM>.md        ← /content-calendar (run monthly)
├── outputs/
│   ├── captions/<YYYY-MM>/<NN-slug>.md         ← /caption-writer
│   ├── creatives/<YYYY-MM>/<NN-slug>.{png,mp4} ← /social-creative-designer
│   └── reviews/<YYYY-MM>.md                    ← /social-performance-review
└── HEARTBEAT.md                ← this file, updated after every run
```

`<slug>` is kebab-case from the client name. `<NN>` is a zero-padded post index (01, 02, …). For RHYTHMIX itself, `<slug>` is `rhythmix` — the existing repo-root content (`rhythmix-teaser-60s/DESIGN.md`, `text*.txt`) is the canonical brand source; `clients/rhythmix/context/brand-style.md` should reference it rather than duplicate.

## Order of operations

Run skills in this fixed sequence — each consumes the previous step's output:

1. **`/brand-onboarding <slug>`** — once per client, or when brand changes. Produces `context/brand-style.md`.
2. **`/content-calendar <slug> <YYYY-MM>`** — once per month. Reads `brand-style.md`. Produces `context/content-calendar/<YYYY-MM>.md` (a list of N posts with: index, hook, theme, format, target date, target platform).
3. **For each post in the calendar, in order**:
   - **`/caption-writer <slug> <YYYY-MM> <NN>`** — reads the calendar row + brand. Produces `outputs/captions/<YYYY-MM>/<NN-slug>.md`.
   - **`/social-creative-designer <slug> <YYYY-MM> <NN>`** — reads the caption + brand. Produces `outputs/creatives/<YYYY-MM>/<NN-slug>.{png,mp4}`.
4. **`/social-performance-review <slug> <YYYY-MM>`** — at the end of the month, after metrics are pasted in. Produces `outputs/reviews/<YYYY-MM>.md`. Feeds back into next month's calendar via the brand file's "What's working" section.

Never skip ahead. If `brand-style.md` is missing, run onboarding first. If the calendar is missing, plan before writing captions. If a caption is missing, don't design its creative.

## Heartbeat

After every sub-skill run, append one line to `clients/<slug>/HEARTBEAT.md`:

```
<ISO-timestamp> · <skill> · <args> · <output-path> · <status>
```

This is the audit trail — borrowed from the Paperclip pattern. If the user asks "what's the state of <client>?", read this file first, not the directory tree.

## Multi-client

When more than one `clients/<slug>/` exists, default to the most recently touched one (latest `HEARTBEAT.md` mtime) unless the user names a client explicitly.

## What this skill does NOT do

- Doesn't post anywhere — captions and creatives land in `outputs/`. Posting is manual or via a separate Zapier/MCP step.
- Doesn't invent metrics. Performance review needs the user to paste numbers in.
- Doesn't generate the actual creative pixels — `/social-creative-designer` does, via the creative-stack MCP (Replicate + ElevenLabs) or HyperFrames.
