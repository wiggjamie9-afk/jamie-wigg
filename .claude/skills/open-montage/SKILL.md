---
name: open-montage
description: >-
  Assemble photos/clips + music + captions into a real H.264 movie using the
  open-montage pipeline (MoviePy + bundled static ffmpeg, CPU-only). Use when the
  user wants a montage, movie, video edit, slideshow film, or wants to stitch
  media into an mp4. Triggers on "montage", "open montage", "make a movie",
  "stitch these clips", "video from photos", "edit this into a video".
---

# /open-montage — media in, movie out

The editor layer of the **Open Montage** stack (see `OPEN-MONTAGE.md` at repo root).
An LLM director (you / OpenManus) decides shots, order, captions and pacing; this
pipeline cuts the film. CPU-only: MoviePy + pip-bundled static ffmpeg with
**libx264 + AAC** — real `.mp4`, no GPU, no cloud, works in this sandbox.

## First run per session

```bash
pip3 install -r open-montage/requirements.txt   # moviepy, imageio-ffmpeg, pillow, numpy
```

(The sandbox is ephemeral — binaries vanish between sessions; the pipeline itself
lives in git.)

## Two ways to drive it

**Folder mode** — quick, alphabetical order, 3s per still:
```bash
python3 open-montage/montage.py --media ./shots --music bed.mp3 --title "My Film" -o out.mp4
```

**Manifest mode** — you (the director) control everything:
```bash
python3 open-montage/montage.py --manifest montage.json -o out.mp4
```
```json
{
  "title": "OPEN MONTAGE", "subtitle": "optional", "outro": "optional",
  "music": "bed.wav", "size": [1280,720], "fps": 24, "fade": 0.45,
  "shots": [
    {"src": "shot1.png", "caption": "lower-third text", "duration": 3},
    {"src": "clip.mp4",  "caption": "videos keep own length unless duration set"}
  ]
}
```

Mixed stills + video clips are fine. Captions are burned-in lower thirds. Music is
looped/cut to length with fade in/out. Portrait (`[1080,1920]`) and square
(`[1080,1080]`) sizes work for Reels/TikTok.

## Directing well (the LLM's job)

- Ask what story the media tells; order shots for arc, not alphabet.
- Write captions as narration beats (short, present tense), not filenames.
- 2.5–3.5s per still; let real video clips breathe; keep total < 60s unless asked.
- Verify after render: probe with the bundled ffmpeg (`Duration`, h264 + aac
  streams) and send the file to the user with SendUserFile.

## Upstream generators (optional layers)

- **AI scenes** — creative-stack / Higgsfield MCPs (need API keys in
  `.claude/settings.local.json` / `.env`) generate shots → feed paths into the manifest.
- **Narration** — ElevenLabs (creative-stack) or Kokoro TTS → pass the voice track
  as `music`, or mix voice+music externally first.
- **Branded motion graphics** — HyperFrames folders at repo root render standalone
  promos; use open-montage to stitch multiple renders into one film.

Worked example: `open-montage/samples/` (4 shots + bed.wav + montage.json).
