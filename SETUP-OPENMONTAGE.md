# OpenMontage Setup

[OpenMontage](https://github.com/calesthio/OpenMontage) is an open-source, agent-operated
video production studio (12 pipelines, 52 tools, 500+ agent skills). Your AI coding
assistant **is** the orchestrator — you describe a video in plain language and it researches,
scripts, generates assets, edits, and renders a finished piece.

**Why it fits this repo:** OpenMontage renders with **HyperFrames** and **Remotion** — the
same engines this repo already uses for RHYTHMIX promos (see `CLAUDE.md` → HyperFrames
pipeline, and `video/` for Remotion). License: AGPLv3.

## Install (one command, on your Mac)

```bash
bash scripts/setup-openmontage.sh
```

This clones OpenMontage to `~/OpenMontage` (override with `OPENMONTAGE_DIR=...`) and runs its
setup. It is cloned **next to** this repo, not inside it, because it carries its own git
history and AGPLv3 license.

**Prerequisites:** Python 3.10+, Node 18+, FFmpeg, git. The script checks for these and tells
you what's missing.

## Works with zero API keys

Out of the box: Piper TTS narration, free stock/archival footage (Archive.org, NASA,
Wikimedia, plus free-key Pexels/Unsplash/Pixabay), and Remotion + HyperFrames rendering.
Add provider keys later in `~/OpenMontage/.env` for more capability (FLUX images, Veo/Kling
video, Suno music, ElevenLabs, etc.) — every key is optional.

## Make a video

Open `~/OpenMontage` in your AI coding assistant and ask, e.g.:

- `"Make a 45-second animated explainer about why the sky is blue"` (zero keys)
- `"Make a 90-second documentary montage about a city at 4am. Use real footage only, no narration."` (zero keys, real footage)
- `"Create a cinematic 30-second RHYTHMIX teaser"` — point it at `rhythmix-teaser-60s/DESIGN.md` for brand palette/typography.

Render the built-in zero-key demos with: `cd ~/OpenMontage && make demo`

See OpenMontage's own `AGENT_GUIDE.md`, `PROJECT_CONTEXT.md`, and `docs/PROVIDERS.md` for the
full agent contract and provider/pricing reference.
