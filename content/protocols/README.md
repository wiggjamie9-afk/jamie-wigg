# content/protocols/

Source files for every protocol in the Codex library. One markdown file per protocol. The protocol player (`app/protocols/[slug]/page.tsx`, see `specs/codex-app/tasks.md` T7) reads these at build time.

## File naming

`<vertical>-<slug>.md` — e.g. `tesla-369-breath.md`, `release-trauma-shake.md`, `manifest-tortoise-breath.md`.

Verticals match the four library categories from `specs/codex-app/requirements.md` R3, plus featured "codex" verticals (Tesla, Hermetic, Vedic) that cross-cut categories.

## Frontmatter

```yaml
---
slug: tesla-369-breath
title: The 3-6-9 Breath
vertical: tesla
category: manifest        # release | manifest | reverse | recover
duration_seconds: 360     # total guided session length
breath_pattern:
  inhale_s: 3
  hold_s: 6
  exhale_s: 9
  cycles: 12
audio:
  narration: narration/tesla-369-breath.mp3
  frequency_layer: tones/432hz.mp3       # optional background tone
  background: ambient/codex-low.mp3      # optional pad
unlock_at_day: 0          # 0 = unlocked on purchase; >0 = monthly drip per R7
hardware_optional:
  - polar
  - heartmath
  - apple_watch
created: 2026-05-18
---
```

## Body sections

```markdown
## Mythology
Brand-facing copy. The Tesla quote, the lineage hook, the mystery.
Lives in marketing surfaces and the protocol intro card.

## Mechanism
Clinically neutral copy. What the breath pattern / attention pattern
actually does in the body. Lives inside the app, in the "About this
session" expandable. Never claims to heal a specific condition.

## Script
The exact narration script, segmented by timestamp. Spoken by Jamie's
ElevenLabs voice clone (see T8). Use natural pauses, breath cues, and
mark transitions like:

  [00:00] Opening — set the scene
  [00:30] First cycle — explain the count
  [01:00] Settle in — drop guidance, hold the count
  [04:30] Closing — bring attention back

## Practice notes
For users who want to go deeper. What to watch for. Common mistakes.
Renders below the player when the session ends.

## Sources
Citations for the *real* claims only. Mythology citations are fine to
omit (and often impossible — that's why it's mythology).
```

## Authoring rules

- **Mythology and mechanism are separate sections.** Never mix. Reviewers (app store + ad platform) will scan for medical claims; this separation is your audit trail.
- **No medical claims anywhere in the file.** "Activates parasympathetic dominance" is fine. "Cures anxiety" is not. If you're unsure, write the sentence and ask: would HeartMath ship this exact phrasing? If no, rewrite.
- **The script is the deliverable.** ElevenLabs Professional Voice Clone (T8) turns it into narration. Mark breath counts in the script — the in-app pacer locks to those counts.
- **Stable slugs.** Once a protocol ships, the slug is permanent. URLs, analytics, and `sessions.protocol_id` references depend on it.
