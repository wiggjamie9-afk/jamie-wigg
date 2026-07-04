---
name: promo-repurpose
description: Generate the portrait (-f, 1080x1920) and square (1080x1080) variants of an existing landscape RHYTHMIX Cut folder. Use when the user asks to "make the vertical version", "repurpose for TikTok/Reels/Shorts", "make the square cut", or after rhythmix-author finishes a landscape Promo and platform variants are needed. Mechanical re-layout only — narration, script, and scene order are reused verbatim from the source Cut.
metadata:
  tags: rhythmix, video, hyperframes, repurpose, aspect-ratio
---

## When to use

- "make the portrait / vertical / TikTok version of rhythmix-<name>-60s"
- "repurpose this promo for Reels/Shorts"
- "make the square cut for Instagram feed"
- As the follow-up step after `/rhythmix-new` or `rhythmix-author` produces a landscape Cut.

Do NOT use for new scripts, new narration, or re-themed cuts — that is `rhythmix-author`.

## Inputs

1. **Source Cut folder** — an existing `rhythmix-<name>-<length>/` at repo root with `index.html`, `hyperframes.json`, `narration.wav`, `script.txt`.
2. **Target aspect(s)** — portrait, square, or both. Default: both.

## Procedure

1. **Read the source composition.** `index.html` (GSAP + CSS), `hyperframes.json` (dims), `meta.json`.
2. **Create the sibling folder** using repo naming conventions (see CLAUDE.md):
   - Portrait → `rhythmix-<name>-<length>-f/` with `hyperframes.json` set to `1080x1920`
   - Square → `rhythmix-<name>-<length>-sq/` with `1080x1080`
3. **Copy verbatim:** `narration.wav`, `script.txt`, `gsap.min.js`, `meta.json`, `package.json` (fix the `name` field and any width/height flags in scripts).
4. **Re-layout `index.html`** — do not just letterbox:
   - Stack side-by-side layouts vertically for portrait; center single-column for square.
   - Scale type up for portrait (mobile viewing distance): headline sizes roughly 1.3–1.5x the landscape px values relative to viewport width.
   - Keep timings, scene order, and GSAP eases identical — narration sync must not drift.
   - Respect the brand system in `rhythmix-teaser-60s/DESIGN.md` (palette, type, motion eases).
5. **Validate:** `npx --yes hyperframes@0.4.42 lint` from the new folder. Fix until clean.
6. **Verify before declaring done** — invoke the `render-verify` skill on the new folder (renders and checks duration/dims against `hyperframes.json`).

## Batch mode

If asked to repurpose "all" or a series (e.g. every `rhythmix-s*` cut), fan out one subagent per source folder (`dispatching-parallel-agents` pattern), each following steps 1–5, then run `render-verify` serially (renders are CPU-heavy).
