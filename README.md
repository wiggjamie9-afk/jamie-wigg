# Code-driven video pipeline

A Claude Code-orchestrated pipeline for making short videos. Inspired by the
[r/ClaudeAI experimental short film](https://www.reddit.com/r/ClaudeAI/) thread
where folks combine Claude Code with ElevenLabs, Magic Hour, and friends.

This repo swaps Pygame for [Remotion](https://www.remotion.dev/) (React-based
code-driven video) — same orchestration spirit, nicer rendering primitives.

## How it works

```
prompt
  └─ Claude (generate_campaign.py) ─────► campaigns/active.json
                                              │
                                              ▼
                          ElevenLabs (generate_voice.py) ─► public/voiceover/scene-N.mp3
                                              │
                                              ▼
                                Remotion (npm run dev / render) ─► out/*.mp4
```

A **campaign** is a JSON file describing scenes — title cards, bulleted lists,
images, an outro — each with a duration and optional voiceover line.
`video/src/Composition.tsx` reads it and lays the scenes out on a timeline.

## Quick start

```bash
# 1. install
cd video && npm install
cd ..
python -m venv .venv && source .venv/bin/activate
pip install -r pipeline/requirements.txt

# 2. set keys
cp .env.example .env  # fill in ANTHROPIC_API_KEY, ELEVENLABS_API_KEY
source .env

# 3. preview the example campaign in the Remotion studio
cd video && npm run dev

# 4. or run the full pipeline
./pipeline/build.sh "How transformers learn in-context" 30
```

## Editing campaigns by hand

Drop a JSON at `video/campaigns/active.json` (or edit `example.json`).
Schema lives in `video/src/types.ts`. Scene types:

- `title` — big animated title + subtitle
- `bullets` — heading with staggered bullet reveals
- `image` — full-bleed image, optional Ken Burns, optional caption
- `outro` — closing card

Every scene takes `durationInSeconds` and an optional `voiceover` string.
If a matching `public/voiceover/scene-{i}.mp3` exists at render time, it
plays over that scene.

## Asking Claude Code to make a video

Just tell me what you want. Examples:

- "Make me a 30-second explainer about CRDTs"
- "Cut a 90-second pitch for a fictional startup that sells silence"
- "Render the example and show me the MP4"

I'll write the campaign, generate voiceover (if keys are set), and render.

## Layered AI services (optional)

The article that inspired this lists Magic Hour for lip sync, Hedra for
talking heads, Google Veo for video sequences. Each is a `requests.post` away
— add a new scene type (e.g. `talkingHead`) and a render path that swaps in
the generated MP4 via Remotion's `<Video />` component.
