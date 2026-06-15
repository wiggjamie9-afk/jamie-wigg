# voicebox-voice-clone

Skill for managing voice cloning workflows with Voicebox (local TTS).

## Triggers

- Cloning a new voice profile from an audio sample
- Re-generating narration in a specific voice
- Managing voice profiles (create, edit, test, export)
- Integrating Voicebox with agent voice output

## What this skill does

- Guides voice sample preparation (10–30s clean audio, no music)
- Handles Voicebox API calls (`http://127.0.0.1:17493`) for profile creation and TTS
- Scripts batch narration re-generation across RHYTHMIX cuts
- Sets up per-agent voice bindings for consistent voice output
- Troubleshoots model downloads and GPU memory issues

## Requires

- Voicebox app running locally (`http://127.0.0.1:17493`)
- Audio sample (WAV, MP3, M4A — 10–30 seconds)
- Voice profile name (e.g. `Jamie` for user's own voice)

## Related docs

- `VOICEBOX-SETUP.md` — Full installation and per-project config
- `.mcp.json` — Voicebox MCP registration
- Voice generation scripts in `sites/codex-of-reality/launch/voice/`
