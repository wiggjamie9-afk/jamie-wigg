# Dream Skill — One-Shot Creative Asset Generator

**Purpose:** Route a single creative description to the right modality (image, video, music, voice, promo, web design) and generate it.

**Usage:** `/dream <natural language description of what you want>`

## Classification Logic

| Signal | Modality | Tool |
|--------|----------|------|
| "video", "clip", "trailer", "promo", "movie" (short) | Single video clip | `replicate_video` MCP (HunyuanVideo) |
| "rhythmix" + video, OR 30/60/90s promo | Branded RHYTHMIX video | `rhythmix-author` skill |
| "image", "picture", "art", "poster", "cover", "illustration" | Still image | `replicate_image` MCP (FLUX 1.1 Pro) |
| "music", "track", "song", "beat", "loop", "instrumental" | Music | `replicate_music` MCP (MusicGen) |
| "voice", "voiceover", "narration", "speak", "say" | Speech audio | `elevenlabs_tts` MCP |
| "website", "landing page", "section", "component" | Web/code | Author HTML/CSS with `rhythmix-teaser-60s/DESIGN.md` brand |
| "story", "script", "lyrics", "copy", "tagline" | Writing | Generate text directly; offer TTS/video follow-up |

## Workflow

1. **Classify** the request into best-match modality. Ask ONE clarifying question if ambiguous.
2. **Verify preconditions:**
   - MCP tools installed? (Check `.claude/mcp/creative-stack/README.md` if missing)
   - ENV vars set? (REPLICATE_API_TOKEN, ELEVENLABS_API_KEY, etc.)
3. **Execute** the chosen tool with sensible defaults (e.g., 16:9 for videos, 1:1 for covers, 9:16 for social)
4. **Report back** with file path, one-sentence description, and suggested follow-up
5. **Do NOT auto-commit** — wait for user approval

## Dependencies

- `replicate` skill (image/video/music selection)
- `rhythmix-author` skill (RHYTHMIX-specific promos)
- MCP servers: Replicate, ElevenLabs (via `creative-stack`)

## Notes

- For Suno/Udio music: offer to write a better prompt; Replicate MusicGen has limitations
- For web design: check `rhythmix-teaser-60s/DESIGN.md` for brand palette/typography
