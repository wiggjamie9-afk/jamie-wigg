# rhythmix-studio-promo-40s

40-second 9:16 talking-head promo for **RHYTHMIX Studio** (the CLI engine that
turns a track into an AI music video). Format mirrors the Adam-Stewart / Justyn
TikTok layout: overlay graphic top, talking head bottom, RHYTHMIX brand palette.

## Status

- [x] Composition scaffolded (`index.html`)
- [x] Script written (`script.txt`)
- [x] Higgsfield Soul prompt written (`higgsfield-soul-prompt.txt`)
- [ ] `spokesperson.png` — generate via Higgsfield Soul
- [ ] `narration.wav` — generate via ElevenLabs TTS from `script.txt`
- [ ] `talking-head.mp4` — generate via Higgsfield Speech-to-Video (spokesperson.png + narration.wav)
- [ ] `transcript.json` — `npx hyperframes transcribe narration.wav`
- [ ] Render → `rhythmix-studio-promo-40s.mp4`

## To finish the render

1. **Wire up Higgsfield + ElevenLabs**
   - Add to `/home/user/jamie-wigg/.env`:
     ```
     HIGGSFIELD_API_KEY=...
     HIGGSFIELD_SECRET=...
     ELEVENLABS_API_KEY=...
     ```
   - Restart the agent session so MCPs reconnect.

2. **Generate assets** (use the `higgsfield-to-hyperframes` skill — it owns
   the prompt → poll → download → wire-in pipeline):
   - Higgsfield Soul → `spokesperson.png` (use the prompt in
     `higgsfield-soul-prompt.txt`)
   - ElevenLabs TTS → `narration.wav` (use `script.txt`, pick a consistent
     male voice — e.g. the same voice as `../voiceover-adam.wav`)
   - Higgsfield Speech-to-Video → `talking-head.mp4`
     (spokesperson.png + narration.wav, 9:16, 1080×1920)

3. **Drop them in this directory**, then:
   ```bash
   cd rhythmix-studio-promo-40s
   npx hyperframes transcribe narration.wav   # generates transcript.json
   npm run check                              # lint + validate + inspect
   npm run dev                                # preview in browser
   npm run render                             # render to MP4
   ```

## Composition layout (1080 × 1920, 40s)

```
┌──────────────────────────────────┐  0
│   OVERLAY (672px)                │
│   scene-specific graphic         │
│   + label-mono eyebrow           │
├──────────────────────────────────┤  672
│                                  │
│   TALKING HEAD (1248px)          │
│   Higgsfield Speech-to-Video     │
│                                  │
│            [caption strip]       │  ~1760
│                                  │
└──────────────────────────────────┘  1920
```

Scenes:
- **0–8s** — Hook: "You've got a track" → "$8,000?" strike-through
- **8–22s** — Pipeline: Kling / Hunyuan / Luma Ray / MiniMax 2×2 grid
- **22–30s** — Numbers: `$8–25` / per video / `60 seconds.`
- **30–40s** — CTA: "Try it in your browser" + repo URL

## Re-using the spokesperson

Save the Higgsfield Soul image as a **Character reference** in Higgsfield. Every
future RHYTHMIX promo can then use that same character — builds face
recognition across releases, same way Adam Stewart / Justyn appear in every
one of their videos.

## Variants to spin off

Once this 40s lands, fork to:
- `rhythmix-studio-promo-30s` — TikTok-optimal cut, drop scene 2 chips to one row
- `rhythmix-studio-promo-60s` — add scene 5: a real generated clip from RHYTHMIX Studio output
- `rhythmix-studio-promo-square` — 1080×1080 for IG feed (re-crop, no overlay region)
