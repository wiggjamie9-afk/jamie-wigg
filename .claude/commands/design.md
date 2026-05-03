---
description: Scaffold a DESIGN.md so the hyperframes Visual Identity Gate stops asking 3 questions every time
argument-hint: [style-name]   # optional, e.g. /design Swiss Pulse
---

The `hyperframes` skill refuses to write composition HTML without a visual identity source. Without a `DESIGN.md`, every composition triggers a 3-question detour. Fix this once.

Process:

1. Check if a `DESIGN.md` already exists at the repo root or in `video/`. If yes, ask me whether to overwrite or extend it.
2. If `$ARGUMENTS` names a style (e.g. "Swiss Pulse", "dark and techy"), read `.agents/skills/hyperframes/visual-styles.md` and pull the matching preset. If it's not a known preset, treat the argument as free-text mood guidance.
3. If no argument, ask me FOUR questions and wait for answers — do not invent values:
   - Mood? (explosive / cinematic / fluid / technical / chaotic / warm)
   - Light or dark canvas?
   - Brand colors? (hex values, or "none — propose")
   - Type families? (specific fonts, or "none — propose")
4. Write a minimal `DESIGN.md` at the repo root with these sections:
   - `## Style Prompt` — one paragraph capturing mood + canvas + identity in plain words.
   - `## Colors` — 3-5 hex values with named roles (e.g. `--bg`, `--fg`, `--accent`, `--muted`).
   - `## Typography` — 1-2 font families with role assignments (display vs body).
   - `## Motion` — 1-2 lines of motion intent (snappy/easeOutExpo, slow/easeInOut, etc.).
   - `## What NOT to Do` — 3-5 anti-patterns specific to this identity (e.g. "no rounded corners", "no gradients", "no Roboto").
5. Commit the file in a separate commit titled `Add DESIGN.md for hyperframes visual identity` only if I confirm.

Do NOT write composition HTML in this command — DESIGN.md only.
