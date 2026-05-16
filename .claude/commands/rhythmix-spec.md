---
description: RHYTHMIX-aware wrapper around /spec-quick. Pre-fills clarifying questions specific to RHYTHMIX video work (duration, aspect, voice, angle). Use for campaigns / multi-video work — for a single video, use /rhythmix-new instead.
argument-hint: <campaign or multi-video brief>
---

Invoke the `rhythmix-spec` skill for the following RHYTHMIX brief:

> $ARGUMENTS

**Routing check first.** If the brief describes a **single video**, redirect to `/rhythmix-new` and stop — that command goes straight to the rhythmix-author skill without spec ceremony.

If the brief describes a **multi-video campaign, launch, series, or video+landing-section pairing**, continue.

**Step 1**: Read the locked-in RHYTHMIX context — `rhythmix-teaser-60s/DESIGN.md`, `CLAUDE.md`, `CONTEXT.md`, recent entries in `downloads.html`.

**Step 2**: Ask the four RHYTHMIX-specific clarifying questions (deliverable shape, video specs, voice, narrative angle) via `AskUserQuestion`. Skip any the brief already answers.

**Step 3**: Hand off to the `spec-quick` skill with the brief + clarifying answers. Generated `tasks.md` must follow the RHYTHMIX file-glob conventions documented in the skill so parallel renders don't collide:

- one task per video, allowed glob `rhythmix-<slug>-<dur>s/*`
- final serial task: `downloads.html` update, after all renders

**Step 4**: Land on the spec with summary + next-step commands. Recommend `/spec-run` — the parallelism payoff is real for multi-video work.
