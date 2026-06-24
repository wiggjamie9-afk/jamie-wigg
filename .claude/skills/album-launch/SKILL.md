# Album Launch Skill — Orchestrate Parallel Album/Single Assets

**Purpose:** Orchestrate cover art, music track, 60s video promo, and landing page section in parallel waves.

**Usage:** `/album-launch <album/single brief>`

## Workflow

The skill fans out **4 independent parallel Agents** to produce:

1. **Cover Art** — Album/single artwork (1:1 image, 3000×3000px recommended)
   - Uses `/dream <brief> image` or FLUX directly
   - Output: `album-covers/<slug>.png`

2. **Music Track** — Full-length audio for the release
   - Uses `replicate_music` (MusicGen) or directs to external tool (Suno/Udio)
   - Output: `music/<slug>.wav` or `.mp3`

3. **60s Video Promo** — Branded RHYTHMIX-style video
   - Uses `rhythmix-author` skill (full HyperFrames pipeline: script → TTS → composition → render)
   - Output: `rhythmix-<slug>-60s/rhythmix-<slug>-60s.mp4`

4. **Landing Page Section** — HTML section for product pages, sites, email campaigns
   - Uses `landing-page-generator` or manual HTML/CSS
   - Output: `sites/album-<slug>/landing-section.html`

## Execution

```
Launch Agent("Cover Art")
Launch Agent("Music Track")
Launch Agent("Video Promo")
Launch Agent("Landing Section")
Wait for all 4 to complete
Consolidate outputs → report file paths and preview URLs
```

## Confirmation

- Confirm album/single brief with user (title, artist, mood, target)
- Show all 4 outputs once parallel wave completes
- Ask user to approve before committing/publishing

## Dependencies

- `replicate` skill
- `rhythmix-author` skill
- `landing-page-generator` skill
- `dream` skill (fallback for cover art)
- MCP servers: Replicate, ElevenLabs, Higgsfield

## Output Structure

```
album-covers/<slug>.png              ← Cover art
music/<slug>.wav                     ← Track audio
rhythmix-<slug>-60s/                 ← Full promo folder
  rhythmix-<slug>-60s.mp4           ← Rendered video
sites/album-<slug>/                  ← Landing page
  landing-section.html              ← HTML fragment
```
