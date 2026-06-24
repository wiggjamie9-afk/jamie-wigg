# RhythmixNew Skill — One-Command RHYTHMIX Promo End-to-End

**Purpose:** Create a complete RHYTHMIX promo from scratch in one command: script → TTS → HyperFrames composition → render → publish downloads page.

**Usage:** `/rhythmix-new [duration] [aspect] [angle]`

## Parameters

| Param | Default | Options | Purpose |
|-------|---------|---------|---------|
| `duration` | 60s | 30s, 60s, 90s | Video length (most common: 60s for YouTube/LinkedIn) |
| `aspect` | landscape | landscape (16:9), portrait (9:16), square (1:1) | Platform format |
| `angle` | auto | hook, feature, story, teaser, behind-scenes | Creative direction |

**Example:** `/rhythmix-new 60s portrait hook` → 60-second portrait-format hook promo

## Workflow

1. **Script** — Generate narration/hook copy (via Claude or `stepfun` Flash MCP if available)
2. **TTS** — Convert script to audio narration (Kokoro or ElevenLabs)
3. **Composition** — Mint HyperFrames folder with GSAP/CSS composition
4. **Render** — Render to MP4 (ffmpeg via HyperFrames CLI)
5. **Publish** — Publish to registry OR copy to `videos/` folder
6. **Landing** — Create/update `downloads.html` download links

## Output Structure

```
rhythmix-<topic>-<duration><aspect-suffix>/
├── index.html           ← GSAP/CSS composition
├── script.txt          ← Narration text
├── narration.wav       ← TTS audio
├── rhythmix-<topic>.mp4 ← Rendered video
├── hyperframes.json    ← Metadata
├── package.json        ← Build scripts
└── DESIGN.md           ← (Optional) Cut-specific design notes

videos/
├── rhythmix-<topic>-<duration><aspect-suffix>.mp4  ← Symlink or copy

downloads.html           ← Updated with new video link
```

## Aspect Suffixes

- `landscape` → no suffix (e.g., `rhythmix-hook-60s`)
- `portrait` → `-f` suffix (e.g., `rhythmix-hook-60s-f`)
- `square` → `-sq` suffix (e.g., `rhythmix-hook-60s-sq`)

## Preconditions

- Kokoro TTS installed (`uv tool install kokoro-tts` or `pip install kokoro-tts`)
- ffmpeg available (for rendering)
- HyperFrames CLI (`npx --yes hyperframes@0.4.42`)
- Brand DESIGN.md locked to `rhythmix-teaser-60s/DESIGN.md`

## Gating

- Ask user to confirm script before TTS
- Show preview before rendering (save bandwidth/time)
- Confirm final video before publishing/adding to downloads page
- **Do NOT auto-commit** — user decision on which branch/PR

## Dependencies

- `rhythmix-author` skill (full pipeline)
- `replicate` or `fal-ai-media` (image generation for frames, if needed)
- HyperFrames CLI
- Kokoro TTS

## Notes

- Most promos: **60s landscape** (YouTube, LinkedIn, marketing sites)
- Social feed: **60s portrait** (`-f` variant)
- Instagram feed / square: **60s square** (`-sq` variant)
- For series of 5 cuts (hook, features, vs, pricing, cta), use `/rhythmix-spec` instead to plan the full series
