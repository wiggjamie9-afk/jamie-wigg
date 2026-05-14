# auto-edit

Detect repeated takes in a spoken-word recording, pick the best one of each
group, and emit a rough-cut. Inspired by the AutoEdit TikTok demo
(eleven+percent) — heuristics first, Claude only as a tiebreaker.

## What it does

1. **Transcribe** (optional) — wraps `npx hyperframes transcribe`.
2. **Detect** — groups near-duplicate consecutive utterances. Uses unigram +
   bigram Jaccard plus a longest-shared-content-phrase signal, so retakes that
   share a phrase like "as a video editor" group together even if the
   surrounding filler differs.
3. **Rank** — scores each candidate against filler density, mistake markers
   ("wait no", "sorry let me", "one more time"…), incomplete trailing
   ("…", "—"), and minimum length. When the top two heuristic scores are within
   `--tiebreak-margin` (default 0.15), Claude breaks the tie — gated on
   `ANTHROPIC_API_KEY` and skippable with `--no-llm`.
4. **Emit** —
   - `cutlist.json` (definitive, machine-readable)
   - `stitch.sh` (FFmpeg script that produces a rough-cut MP4 from the source)
   - `composition/index.html` + `hyperframes.json` (HyperFrames composition
     scaffold with one caption per selected take — wire in your video element
     manually).

## Usage

```bash
# end-to-end on a video
python3 tools/auto-edit/auto_edit.py run my-recording.mp4 --out cut/

# from an existing transcript (Whisper JSON)
python3 tools/auto-edit/auto_edit.py run transcript.json --out cut/ \
    --source-video my-recording.mp4

# pure heuristic (no API calls)
python3 tools/auto-edit/auto_edit.py run transcript.json --out cut/ --no-llm

# drop groups whose winner is still a bad take
python3 tools/auto-edit/auto_edit.py run transcript.json --out cut/ --drop-bad

# stitch into a finished MP4
bash cut/stitch.sh source.mp4 final.mp4
```

Subcommands also exist individually (`transcribe`, `detect`, `rank`, `compose`)
for inspecting intermediate stages.

## Transcript shape

Whisper-compatible JSON:

```json
{
  "segments": [
    { "start": 0.0, "end": 6.2, "text": "Hey what's up..." },
    { "start": 6.4, "end": 14.8, "text": "So as I was saying..." }
  ]
}
```

`segments` may also be the top-level array. `chunks` is also accepted.

## Cutlist shape

```json
{
  "source": "video.mp4",
  "total_duration": 40.9,
  "selected_segments": [
    { "start": 0.0, "end": 6.2, "text": "..." }
  ],
  "groups": [
    {
      "group_id": 1,
      "selected_index": 2,
      "candidates": [
        { "start": 6.4, "end": 14.8, "text": "...", "score": 0.45,
          "label": "ok_take", "ai_recommended": false,
          "reasons": ["mistake-marker:'wait no'"] },
        { "start": 32.2, "end": 41.0, "text": "...", "score": 1.0,
          "label": "good_take", "ai_recommended": true, "reasons": [] }
      ]
    }
  ]
}
```

## Tuning

| Flag                  | Default | Effect                                                  |
| --------------------- | ------- | ------------------------------------------------------- |
| `--similarity`        | 0.28    | Min blended score to merge a segment into a prior group |
| `--max-gap`           | 45      | Don't merge across silences longer than this (seconds)  |
| `--tiebreak-margin`   | 0.15    | When to invoke Claude tiebreak                          |
| `--model`             | haiku   | Claude model for tiebreak                               |
| `--no-llm`            | off     | Skip Claude entirely                                    |
| `--drop-bad`          | off     | Omit selected segments still labeled `bad_take`         |

## Fixture

`fixtures/sample-transcript.json` — eight segments containing three retakes of
"As a video editor…" plus an outro. Useful for verifying the grouping +
ranking after any tweak.
