---
name: auto-edit
description: Detect repeated takes in a spoken-word recording, pick the best one of each group, and emit a rough-cut. Use when the user has a long video/audio with multiple flubbed attempts at the same lines (e.g. raw screencast narration, podcast cold-takes, vlog one-shots) and wants the bad takes culled automatically. Heuristic-first with Claude tiebreak; emits cutlist.json + stitch.sh + a HyperFrames composition scaffold.
---

# auto-edit

CLI lives at `tools/auto-edit/auto_edit.py`. Heuristic-first take detection with
Claude as a tiebreaker.

## When to use this skill

- User has a raw recording (screencast, vlog, podcast) with retakes and wants a
  rough cut.
- User shows a transcript with obvious repeated attempts at the same line.
- User asks to "find the best takes", "drop the flubs", "cut the bad takes",
  "make a rough cut".

Don't reach for this for clean recordings, music tracks, or pure B-roll —
there's nothing to dedupe.

## One-shot pipeline

```bash
# from a video file (uses npx hyperframes transcribe under the hood)
python3 tools/auto-edit/auto_edit.py run path/to/recording.mp4 --out cuts/

# from a Whisper-style transcript JSON
python3 tools/auto-edit/auto_edit.py run transcript.json --out cuts/ \
    --source-video path/to/recording.mp4
```

Output in `cuts/`:

- `cutlist.json` — definitive cut list, selected segments + all candidate
  groups with scores and reasons.
- `stitch.sh` — bash + ffmpeg script. `bash cuts/stitch.sh source.mp4 final.mp4`.
- `composition/index.html` — HyperFrames scaffold with one caption per take
  (no video element wired up — leave that to the user or follow up with the
  hyperframes skill).

## Key flags

- `--no-llm` — pure heuristic; skip the Claude tiebreak step.
- `--drop-bad` — omit groups whose winner is still labeled `bad_take`.
- `--similarity 0.28` — lower if retakes aren't grouping; raise if false
  positives.
- `--tiebreak-margin 0.15` — how close the top two heuristic scores must be
  before Claude is asked to pick.

The Claude tiebreak reads `ANTHROPIC_API_KEY` from the environment. If unset or
unreachable, it silently falls back to the heuristic winner.

## Inspecting intermediate stages

```bash
auto_edit.py detect transcript.json              # see take groups
auto_edit.py rank   transcript.json              # see scores + winners
auto_edit.py compose cutlist.json --out cuts/ --source-video src.mp4
```

## Scoring rubric

Heuristic penalties per segment:

| Signal                                                 | Penalty |
| ------------------------------------------------------ | ------- |
| Contains a mistake-marker phrase ("wait no", "sorry let me", …) | -0.45 |
| Contains a mistake hint word (sorry/wait/dang/again/redo)       | -0.15 |
| Filler ratio (`um`/`uh`/…) above 8%                     | up to -0.35 |
| Trailing `...` / incomplete                              | -0.10 |
| Fewer than 4 tokens                                     | -0.20 |

Labels: `good_take` (>=0.7), `ok_take` (>=0.45), `bad_take` (<0.45).

## Grouping rubric

Two segments group if both:

- Their time gap is <= `--max-gap` (default 45s), and
- `text_similarity` >= `--similarity` (default 0.28), where similarity blends
  unigram + bigram Jaccard on content tokens and floors to 0.5 when they share
  a contiguous content phrase of >= 3 tokens (e.g. "as a video editor").

Look-back within the time window means a typo'd intermediate take ("bideo
editor") doesn't break the chain — later segments can still merge with the
earlier good group.

## When the user pushes back

- "It's grouping unrelated lines" → raise `--similarity` (try 0.35, 0.45).
- "It's keeping a flubbed take as the winner" → check the `reasons` array in
  `cutlist.json`. Either lower the mistake-marker threshold in `MISTAKE_MARKERS`
  or pass the transcript through Claude with `--tiebreak-margin 0.5` to invoke
  the LLM more aggressively.
- "The composition doesn't play any video" → expected — the scaffold only
  carries captions. Add a `<video>` element manually or extend the emitter to
  pre-cut segments with ffmpeg first.

## See also

- `hyperframes-cli` skill — for the `transcribe` step (Whisper)
- `claude-api` skill — for tuning the tiebreak prompt
- `tools/post-render/post-render.sh` — companion tool that adds poster + GIF
  next to a rendered MP4
