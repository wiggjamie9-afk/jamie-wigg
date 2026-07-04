# SETUP — video-use (edit videos with Claude Code)

Drop raw footage in a folder, chat with the agent, get `final.mp4` back. Cuts filler
words + dead space, auto color-grades, adds audio fades, burns subtitles, generates
overlay animations, self-evaluates each cut. Open source (`browser-use/video-use`).

## Install (per machine — needs a real desktop/server with full ffmpeg)

```bash
# 1. Clone + register as a skill
git clone https://github.com/browser-use/video-use ~/Developer/video-use
ln -sfn ~/Developer/video-use ~/.claude/skills/video-use      # Claude Code
# ln -sfn ~/Developer/video-use ~/.codex/skills/video-use     # Codex

# 2. Deps
cd ~/Developer/video-use
uv sync                          # or: pip install -e .
brew install ffmpeg              # REQUIRED (full build)
brew install yt-dlp              # optional, for online sources

# 3. ElevenLabs key (word-level transcription via Scribe)
cp .env.example .env
$EDITOR .env                     # ELEVENLABS_API_KEY=...
```

Then: `cd /path/to/videos && claude`, and say *"edit these into a launch video."*

## ⚠️ Not usable inside this cloud sandbox

- No Homebrew here, and the only ffmpeg available is Playwright's bundled build
  (**VP8/webm + PNG only, no H.264/mp4**) — video-use's rendering needs full ffmpeg.
- The sandbox is ephemeral; skills registered here don't reach your machine.
- **Run this on your own Mac/Linux box**, not from the remote session.

## How it works (why it's cheap)

The LLM never watches frames — it reads a ~12 KB packed transcript (ElevenLabs Scribe
word timestamps + diarization) and pulls an on-demand `timeline_view` PNG only at
decision points. Pipeline: transcribe → pack → reason → EDL → render → self-eval
(re-render up to 3× on issues). Fits alongside this repo's HyperFrames pipeline as a
raw-footage editor.
