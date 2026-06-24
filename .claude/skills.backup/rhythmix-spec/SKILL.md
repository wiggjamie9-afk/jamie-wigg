---
name: rhythmix-spec
description: RHYTHMIX-aware wrapper around /spec-quick. Pre-fills clarifying questions specific to RHYTHMIX video work — duration, aspect, voice, narrative angle, scene structure — then delegates to the generic spec flow. Use for multi-video campaigns, launches, or any RHYTHMIX work that's bigger than a single promo. Triggered by /rhythmix-spec.
metadata:
  tags: rhythmix, video, hyperframes, spec, planning
---

# RHYTHMIX Spec

A thin RHYTHMIX-aware layer on top of `/spec-quick`. The clarifying questions are pre-filled with the dimensions that actually matter for a RHYTHMIX video or campaign.

## When to use

User wants to plan something RHYTHMIX-shaped that's **bigger than one video**:

- A campaign / launch with multiple promos (different lengths, aspects, voices)
- A landing-page section paired with a video
- A series with shared scenes
- Anything that wants the `spec-run` parallel-execution benefit (several videos rendered concurrently)

For a **single video**, the existing `/rhythmix-new` slash command is faster — it goes straight to the rhythmix-author skill without the spec ceremony. Send the user there if they only need one promo.

## Process

### 1. Read the brief

From `$ARGUMENTS` or conversation context. The brief should describe a campaign, launch, or multi-deliverable RHYTHMIX project.

If the user only wants a single video, redirect to `/rhythmix-new` and stop.

### 2. Read the locked-in brand context

In parallel:
- `rhythmix-teaser-60s/DESIGN.md` (brand palette, typography, motion eases)
- `CLAUDE.md` Quick Start section
- `CONTEXT.md` (Promo / Cut / Narration / Hook glossary)
- `downloads.html` (recent shipped variants, for naming continuity)

### 3. Ask RHYTHMIX-specific clarifying questions

Use `AskUserQuestion`. Skip any question the brief already answers.

**Q1 — Deliverables shape.** How many videos / pieces?
- One video + matching landing section
- A series (2-5 videos sharing scenes / voice / theme)
- A launch bundle (cover art + song + 60s promo + landing section — consider `/album-launch` instead if so)
- Other

**Q2 — Video specs.** For the video deliverables, what variants?
- One canonical 60s landscape
- 60s landscape + 30s portrait + 15s square (standard social bundle)
- Custom mix (collect duration × aspect for each)

**Q3 — Voice / tone.**
- bf_emma — British female, warm, modern (default)
- am_adam — American male, confident
- am_michael — American male, conversational
- Mixed — different voice per video

**Q4 — Narrative angle.**
- Overview / four-pillars (proven default)
- Founder story
- Audience-focused (creator / fan / venue)
- Comparison vs. Suno / Udio / LANDR
- CTA-only / urgency
- Custom — user provides

Then hand off the answers as enriched context to `/spec-quick`.

### 4. Delegate to /spec-quick

Invoke `/spec-quick` (or the `spec-quick` skill directly) with the brief plus the clarifying answers as augmented input. Make sure the generated `tasks.md` follows these RHYTHMIX-specific conventions:

#### Task-level conventions

- Every video deliverable is **one top-level task per video** named `Author <slug>-<duration>s`.
- **Per-video sub-tasks** within the spec should be: scaffold → script → TTS → measure duration → author index.html → lint → render. Express these as sub-tasks of the video task only if the user wants per-step control; otherwise wrap them as one task that invokes the `rhythmix-author` skill.
- **TTS tasks share a voice** — if two videos use the same voice, they can reuse one narration file only if their scripts are identical. Otherwise each video needs its own TTS task with its own narration.wav.
- **Render tasks** touch only their own project folder — `rhythmix-<slug>-<duration>s/*` — so multiple renders are safely parallelizable.
- **downloads.html append** is a final serial task that depends on all renders — it modifies a single file.

#### File-glob conventions for parallel safety

| Task type | Allowed file glob |
|---|---|
| Scaffold | `rhythmix-<slug>-<dur>s/` (folder creation only) |
| Script | `rhythmix-<slug>-<dur>s/script.txt` |
| TTS | `rhythmix-<slug>-<dur>s/narration.wav` |
| Author composition | `rhythmix-<slug>-<dur>s/index.html` |
| Render | `rhythmix-<slug>-<dur>s/*.mp4` |
| Downloads update | `downloads.html` (always last; serial) |

This gives `spec-run` a clean dep graph: different videos are fully independent (Wave 0 fans out wide); `downloads.html` is a chokepoint at the end.

### 5. Land on the spec

Same as `/spec-quick`: show the user the path, summary, and next-step commands. Encourage `/spec-run` because the parallelism payoff is real for multi-video work.

## Hard rules

1. **Don't invent new brand identity.** All palette / typography / motion decisions come from `rhythmix-teaser-60s/DESIGN.md`. The spec references it; it never overrides it.
2. **Don't use `<video>` for audio.** Same rule as `rhythmix-author`.
3. **Render outputs are pinned to commit hashes** in `downloads.html` — the final downloads update task must run after a commit, or the link will 404. Note this constraint in the relevant task's acceptance criterion.
4. **Voice is locked at the spec level** unless the user explicitly opts into mixed voices. A voice change mid-campaign needs a new spec.

## What this skill does NOT do

- Does not render videos. That happens during `/spec-run`, which invokes `rhythmix-author` per task.
- Does not replace `/rhythmix-new`. For single videos, use `/rhythmix-new` directly.
- Does not edit `DESIGN.md` or other locked brand files.
