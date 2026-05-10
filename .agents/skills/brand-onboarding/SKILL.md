---
name: brand-onboarding
description: One-shot intake to capture a client's brand identity, voice, audience, goals, and visual constraints into clients/<slug>/context/brand-style.md. Run once per new client (or whenever the brand materially changes). Used by /content-calendar, /caption-writer, and /social-creative-designer as their source of truth. For RHYTHMIX, this skill defers to the existing repo-root brand assets rather than re-inventing.
metadata:
  tags: social, brand, onboarding, intake
---

# Brand Onboarding

Capture everything downstream skills need to produce on-brand work without asking the user again.

## When to use

- "Onboard <client>"
- "Set up the brand for <client>"
- "Update RHYTHMIX brand"
- First time anything in `clients/<slug>/` is touched
- After a rebrand, repositioning, or product pivot

For routine planning/writing/design, do NOT re-run this — read the existing `brand-style.md`.

## Inputs

Ask the user for these in one batch (use AskUserQuestion when more than one is unknown):

1. **Brand name + slug** (e.g., "RHYTHMIX" / `rhythmix`)
2. **One-line product** (what it is, who it's for)
3. **Three competitors / inspirations** with one-line "we're like X but…" framing
4. **Audience** (1–3 specific personas, not demographics)
5. **Voice** (3 adjectives + one anti-adjective — what we are NOT)
6. **Goals** for the next 30 days (1–3 measurable outcomes)
7. **Channels** (which platforms, in priority order)
8. **Visual constraints** — palette hex codes, fonts, logo path, do/don't list, reference URLs

If the brand already has a `DESIGN.md` (RHYTHMIX does at `rhythmix-teaser-60s/DESIGN.md`), read it first and only ask for what's missing.

## RHYTHMIX shortcut

If `<slug>` is `rhythmix`, do NOT ask the user anything. Synthesize from:

- `rhythmix-teaser-60s/DESIGN.md` — palette, typography, motion eases, "What NOT to Do"
- `text.txt`, `text 2.txt`, `text 3.txt` — hero/features/pricing/testimonials/FAQ copy
- `CLAUDE.md` — repo conventions
- `CREATIVE-AI-STACK.md` — what tools to reach for in the creative step

Reference these files in `brand-style.md` rather than copying their contents.

## Output

Write `clients/<slug>/context/brand-style.md` with these sections in this order:

```markdown
# <Brand> — Brand Style

## Product
<one-line>

## Audience
- <persona 1, specific>
- <persona 2, specific>
- <persona 3, specific>

## Voice
- We are: <adj>, <adj>, <adj>
- We are NOT: <anti-adj>
- Sample sentence: "<one short example>"

## Visual identity
- Palette: <hex list, with role labels — primary, accent, canvas, etc.>
- Display font: <family>
- Mono/secondary font: <family>
- Motion: <eases, durations, do/don't>
- Reference files: <relative paths to DESIGN.md, etc.>

## Channels & cadence
| Platform | Posts/week | Format mix |
| --- | --- | --- |
| ... | ... | ... |

## Goals (30-day)
1. <measurable>
2. <measurable>
3. <measurable>

## Anti-patterns
- <thing we never do>
- <thing we never do>

## What's working
<empty on first run; populated by /social-performance-review feedback loop>

## Source files
<bullet list of files this synthesizes from, with relative paths>
```

## Validation

Before finishing, sanity-check:

- Every hex code is 7 chars (`#xxxxxx`) — no shorthand, no `rgb()`.
- "We are NOT" is non-empty (forces a real position).
- "Goals" are measurable (a number, a deadline, or a binary outcome — not "grow brand awareness").
- "Anti-patterns" has at least 2 entries.

If any check fails, fix it before writing — don't ship a half-filled brand file. Downstream skills will produce generic work if this is sloppy.

## Heartbeat

After writing, append to `clients/<slug>/HEARTBEAT.md`:
```
<ISO> · brand-onboarding · <slug> · clients/<slug>/context/brand-style.md · ok
```
