---
description: Create a new RHYTHMIX promo video end-to-end (script → TTS → composition → render → publish to downloads page).
argument-hint: [duration:30s|60s|90s] [aspect:landscape|portrait|square] [angle:overview|founder|cta|features|free text]
---

You are about to author a new RHYTHMIX promo video using the locked-in brand pipeline.

**Step 1: Invoke the `rhythmix-author` skill** — it has the full playbook, brand identity, and CLI sequence. Do not skip this.

**Step 2: Parse `$ARGUMENTS`** for duration, aspect ratio, and angle. If anything is ambiguous, ask the user ONE consolidated question covering all gaps before doing any work.

**Step 3: Confirm with the user the voice (default: bf_emma) and any messaging twists** before generating TTS — TTS regen is real CPU time.

**Step 4: Execute the end-to-end pipeline** from the skill: scaffold → script → TTS → measure duration → author index.html (5-scene template) → lint → inspect → validate → render to MP4.

**Step 5: After successful render** — append a card to `downloads.html` under "── Latest · Just Rendered ──" using the new commit hash.

**Step 6: Commit and push** ONLY when the user explicitly approves the final output. Show them the file paths and let them decide.

If any step fails, stop and explain — do not skip ahead.
