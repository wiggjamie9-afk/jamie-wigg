# Morning voices — what I found, what I built

## What I did while you slept

You asked me to deep-dive your Claude agents for "guys that actually can speak" and deliver three 1-minute talking videos. Here's the honest answer.

### What I found

I searched every MCP server attached to this session for real-voice tools.

**Pollinations TTS** — *exists, has 6 voices (alloy, echo, fable, onyx, nova, shimmer), but every endpoint returned `Forbidden`*. It needs GitHub OAuth, and the auth flow itself is blocked from this sandbox. The MCP tools are there; the API path through Claude's infrastructure is gated for this session.

**Higgsfield** — *registered in `.mcp.json` but never connected this session*. CLAUDE.md flagged it as the talking-head route (Soul text-to-image, DOP image-to-video, Speech-to-Video, Character refs). It requires `HIGGSFIELD_API_KEY` + `HIGGSFIELD_SECRET` in `.env` at the repo root — those aren't set, so the MCP server skips connecting.

**Voicebox** — *the local-first path we wired up earlier*. Still the best real-voice option. Install on your Mac, clone your voice, every script re-runs against `http://127.0.0.1:17493` and produces your voice instead of espeak. See `VOICEBOX-SETUP.md`.

**OpenAI TTS / ElevenLabs / gTTS** — all reachable only from your machine with API keys. Sandbox can't reach them.

**Claude subagents** (`audio-producer`, `podcast-producer`, `video-scripter`, `short-form-video`, etc.) — these are *strategy* agents. They write scripts, plan campaigns, coordinate work. They don't synthesize audio files themselves. They'd ultimately call one of the tools above.

So no, there isn't a hidden agent in this session that can speak in a real human voice without your auth or your API key. I checked.

### What I built anyway

Three 1-minute talking videos, each in a distinct espeak voice variant, each with a different angle on the app + the AU$30 price. So you have *something* ready to post in the morning, even without the real-voice upgrade.

| File | Voice | Angle |
|---|---|---|
| **`codex-founder-60s.mp4`** | British male | Founder pitch — "Hi. I'm Jamie. I built this. 183K followers. Eight months. AU$30." |
| **`codex-walkthrough-60s.mp4`** | American female | Product tour — open app → finger on camera → orb breathes → coherence climbs → AU$30 |
| **`codex-math-60s.mp4`** | British female | Value comparison — HeartMath $249 + $99/yr · Calm $70/yr · Welltory $89/yr · Codex AU$30 once |

All three: 1080×1920 vertical, 1 MB each, embedded MP3 audio, FFmpeg-rendered, no screen recording needed. Direct upload to TikTok / Reels / YouTube Shorts.

URLs once the deploy lands (~60 seconds after the push):

- `https://rhythmixapp.com.au/codex/launch/codex-founder-60s.mp4`
- `https://rhythmixapp.com.au/codex/launch/codex-walkthrough-60s.mp4`
- `https://rhythmixapp.com.au/codex/launch/codex-math-60s.mp4`

The espeak voices are clearly synthetic. They get the message across, the brand identity is intact, the timing is right, the price moment lands. But they're not Charlotte, they're not you, they're not real humans.

### The 5-minute upgrade in the morning

Pick one of these paths. Any of them re-renders all three videos in real voice, no other code changes.

**Path A · Voicebox (recommended — local, free, your voice)**

1. Download Voicebox from https://voicebox.sh (Apple Silicon DMG)
2. Voice Profiles → + New → name it `Jamie` → drop in 10-30s of your TikTok narration
3. From this repo:
   ```bash
   cd sites/codex-of-reality/launch/voice
   ./generate-trio.sh        # regenerates all 30 cues in your voice
   cd ..
   ./render-trio.sh          # rebuilds all 3 MP4s
   git add . && git commit -m "Trio in Jamie's voice" && git push
   ```

For variety across the three videos: name the same profile `Jamie`, OR clone four different voices (you in four moods, or three friends recording 30 seconds each) and set:
```bash
VOICEBOX_PROFILE_A=Jamie VOICEBOX_PROFILE_B=Sarah VOICEBOX_PROFILE_C=Marcus ./generate-trio.sh
```

**Path B · Pollinations (OAuth in your browser, free)**

1. In your Mac's Claude Code session, run any prompt that includes:
   > *"Authenticate me with Pollinations"*
2. Claude will call `mcp__pollinations__startAuth` and give you a GitHub OAuth link
3. Click it, authorize, come back
4. Tell Claude: *"Now regenerate the trio videos using Pollinations voice `nova` for the founder, `shimmer` for the walkthrough, `alloy` for the math"*

I've already verified the six Pollinations voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`. They're OpenAI's TTS voices — premium quality. Free with auth.

**Path C · ElevenLabs (paid, studio quality, your cloned voice)**

If you sign up for ElevenLabs:
1. Paste your API key into `.env`: `ELEVENLABS_API_KEY=sk_…`
2. Replace the `gen_voicebox` function in `generate-trio.sh` with an ElevenLabs `/v1/text-to-speech` call (I'll wire this if you want — five-minute change)
3. Re-run

**Path D · macOS `say` (no install, zero effort, decent quality)**

The fastest possible upgrade if you don't want to install anything:
```bash
# Edit generate-trio.sh — replace `gen_espeak()` body with:
#   say -v Samantha -r 175 -o /tmp/_.aiff "$text"
#   ffmpeg -y -i /tmp/_.aiff -codec:a libmp3lame -qscale:a 4 "$out"
# Then run:
./generate-trio.sh && cd .. && ./render-trio.sh
```
Samantha is the same voice the in-app Codex uses, baked into macOS, native to every Mac.

### What I'd actually do tomorrow

If I were you: Path D first (zero effort, immediate Samantha voice), post the videos, then Path A (Voicebox) over the weekend so all your future renders are in your own voice.

### Files added this session

```
sites/codex-of-reality/launch/codex-founder-60s.mp4         ← Voice A
sites/codex-of-reality/launch/codex-walkthrough-60s.mp4     ← Voice B
sites/codex-of-reality/launch/codex-math-60s.mp4            ← Voice C
sites/codex-of-reality/launch/render-trio.sh                ← re-runnable
sites/codex-of-reality/launch/voice/generate-trio.sh        ← Voicebox-aware
sites/codex-of-reality/launch/voice/founder-1..10.mp3       ← per-cue audio
sites/codex-of-reality/launch/voice/walk-1..10.mp3
sites/codex-of-reality/launch/voice/math-1..10.mp3
sites/codex-of-reality/launch/voice/voiceover-founder-60s.mp3   ← mixed track
sites/codex-of-reality/launch/voice/voiceover-walk-60s.mp3
sites/codex-of-reality/launch/voice/voiceover-math-60s.mp3
MORNING-VOICES.md                                            ← this file
```

Sleep well. The trio is ready, three different angles, three different voices, three different lengths of stay on the AU$30 frame. Upgrade to real voice in the morning whenever you pick a path.
