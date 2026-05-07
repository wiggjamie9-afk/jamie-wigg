# Creative Stack MCP Server

An MCP (Model Context Protocol) server that gives Claude Code direct tool access to:

- **Replicate** — image (FLUX 1.1 Pro), video (HunyuanVideo), music (MusicGen), and 10,000+ other models via a generic `replicate_run` tool.
- **ElevenLabs** — text-to-speech and voice listing.

Outputs land on disk so subsequent steps (e.g. importing into a HyperFrames composition or pushing to GitHub) can reference them by path.

## Setup

1. Install dependencies:

   ```bash
   cd .claude/mcp/creative-stack
   npm install
   ```

2. Get API tokens:
   - Replicate → https://replicate.com/account/api-tokens
   - ElevenLabs → https://elevenlabs.io/app/settings/api-keys

3. Wire it up in your Claude config. Edit `.claude/settings.json` (or `~/.claude/settings.json` for all projects) and add:

   ```json
   {
     "mcpServers": {
       "creative-stack": {
         "command": "node",
         "args": [".claude/mcp/creative-stack/server.mjs"],
         "env": {
           "REPLICATE_API_TOKEN": "r8_...",
           "ELEVENLABS_API_KEY": "sk_..."
         }
       }
     }
   }
   ```

   Or set the env vars in your shell profile and omit the `env` block.

4. Restart Claude Code. The tools `replicate_image`, `replicate_video`, `replicate_music`, `replicate_run`, `elevenlabs_tts`, `elevenlabs_voices` will appear.

## Tools

| Tool | What it does |
|---|---|
| `replicate_image` | FLUX 1.1 Pro text-to-image. Saves PNG to `creative-out/`. |
| `replicate_video` | HunyuanVideo text-to-video. Saves MP4 to `creative-out/`. ~5-10s clips. |
| `replicate_music` | MusicGen text-to-music. Saves WAV to `creative-out/`. 1-30s. |
| `replicate_run` | Escape hatch — call any Replicate model with arbitrary input. |
| `elevenlabs_tts` | Generate speech to MP3 with a chosen voice. |
| `elevenlabs_voices` | List voices on your ElevenLabs account. |

## Output directory

Set `CREATIVE_OUT_DIR` (defaults to `./creative-out` relative to the working directory).

## Cost

This server uses pay-per-use APIs. Typical costs as of writing:
- FLUX 1.1 Pro image: ~$0.04
- HunyuanVideo (5-10s clip): ~$0.50–1.50
- MusicGen 8s: ~$0.10
- ElevenLabs Multilingual v2 TTS: ~$0.30 / 1000 characters

You'll see actual usage on each provider's dashboard.

## Limits & gotchas

- HunyuanVideo runs ~5-15 minutes per clip; the tool polls up to 20 minutes.
- `replicate_run` may need a specific version hash when `latest` isn't enough — pass `model: "owner/name:hash"`.
- ElevenLabs free tier has limited monthly characters; check your dashboard.
- Generated content lives in `creative-out/` — rotate or `.gitignore` it.

## Slash commands using this server

- `/dream <description>` — auto-routes a request to the right tool.
- `/album-launch <theme>` — orchestrates cover art + music + video promo + landing section in parallel.

See `.claude/commands/` for the prompts.
