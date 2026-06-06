# SURGE Pilot — 10-Episode Pipeline Documentation

## Overview

This pipeline adapts the kids-channel production system for **SURGE Pilot**, a 10-episode sci-fi mystery series for 6-12 year-olds, featuring Ziggy the AI robot, Echo the wise mentor, and Byte the comic relief sidekick.

### Series Details
- **Show**: SURGE Pilot
- **Episodes**: 10 × 10-minute (600s) landscape HD videos
- **Platform**: YouTube (made-for-kids, Animation category)
- **Target Audience**: 6-12 year-olds, family-friendly
- **Visual Style**: Neon sci-fi digital illustration with glowing effects
- **Tone**: Uplifting sci-fi mystery with themes of teamwork, compassion, and discovery

## Quick Start

### Generate a Single Episode (Dry Run)

```bash
cd kids-channel
python3 pipeline.py --series SURGE --episode 1 --dry-run
```

This will:
1. ✅ Generate a script via Claude using episode config
2. ✅ Create character dialogue & narration via ElevenLabs
3. ✅ Generate scene images (Higgsfield → FLUX → Pollinations → gradient fallback)
4. ✅ Animate scenes (image-to-video)
5. ✅ Generate background music
6. ✅ Assemble final video
7. ✅ Create YouTube thumbnail
8. ❌ Skip YouTube upload (dry-run)

Output lands in: `kids-channel/episodes/surge_e01/`

### Generate All Episodes Sequentially

```bash
for ep in {1..10}; do
  python3 kids-channel/pipeline.py --series SURGE --episode $ep --dry-run
done
```

### Generate an Episode with YouTube Upload

Requires:
- `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` in `.env`
- `token.json` from `youtube_auth.py` (see below)

```bash
python3 kids-channel/pipeline.py --series SURGE --episode 1
```

## Configuration Files

### 1. `SURGE_SERIES_CONFIG.py`

Master configuration file for the entire 10-episode series.

**Sections:**

- **`SURGE_CONFIG`**: Series metadata
  - Duration: 600 seconds (10 min) per episode
  - Resolution: 1920×1080 (16:9 landscape)
  - Framerate: 24 fps
  - YouTube category: Animation (ID 31)
  - Made-for-kids: True

- **`CHARACTERS`**: Character definitions (Ziggy, Echo, Byte, Void)
  - Appearance & personality descriptions
  - Color palettes (neon-based)
  - Voice characteristics
  - ElevenLabs voice IDs (assigned per character)

- **`VISUAL_STYLE`**: Art direction
  - Neon sci-fi digital illustration
  - Color scheme (cyan, magenta, yellow, navy)
  - Animation approach (cel-shaded, glowing effects)
  - Safety guidelines (bright, colorful, age-appropriate)

- **`VOICE_CONFIG`**: ElevenLabs voice setup
  - Narration voice ID
  - Character voice IDs (Ziggy, Echo, Byte, Void)
  - Voice settings (stability, similarity_boost, style, speaker_boost)
  - Character-specific effects (pitch shift, reverb, beeps, distortion)

- **`RENDER_CONFIG`**: Video/audio encoding parameters
  - Video codec: libx264, preset: medium, CRF: 24 (high quality)
  - Audio: AAC, 128k bitrate, 48kHz sample rate
  - Audio mix levels (narration 1.0, music 0.25, SFX 0.50, ambient 0.15)
  - Target bitrate: 8 Mbps (smooth YouTube streaming)

- **`YOUTUBE_CONFIG`**: Upload & metadata
  - Title template: `"SURGE — Ep {num}: {title} | AI Robot Adventure for Kids"`
  - Description template with episode number, credits, hashtags
  - 12 YouTube tags (SURGE, animation, sci-fi, kids, robot, adventure, etc.)
  - Thumbnail config (1280×720, cyan/magenta neons on dark blue)

- **`SURGE_EPISODES`**: 10-episode outline
  - Each episode has: title, description, characters, plot arc, learning theme, visual notes, script hints
  - Tracks mystery reveal level (5%→100%) and character development across the series

**Key Functions:**
```python
get_episode_config(episode_number)  # Get config for Ep 1-10
get_character(char_name)             # Get character by name (ziggy, echo, byte, void)
list_episodes()                      # List all episodes with summaries
validate_episode_number(ep_num)      # Check if 1-10
get_series_progress(episode_number)  # Series progress metrics
```

### 2. `SURGE_EPISODE_TEMPLATE.py`

Orchestration class that implements the full render pipeline.

**Class: `SurgeEpisodeRenderer`**

Handles all stages of episode production:

#### Inputs
```python
SurgeEpisodeRenderer(
    episode_number: int,          # 1-10
    dry_run: bool = False,        # Skip upload?
    skip_video: bool = False,     # Skip Higgsfield?
    script_file: Optional[Path] = None  # Pre-written script?
)
```

#### Methods

**Script Generation**
```python
def load_or_generate_script(self) -> Dict
def generate_script_via_claude(self) -> Dict
```
- Uses Claude Haiku to generate episode script
- Script is built from episode config (title, description, plot arc, learning theme, visual notes)
- Returns JSON with: title, description, tags, narration, scenes
- Each scene has: id, duration, image_prompt, dialogue

**Character & Voice Setup**
```python
def assign_character_voices(self) -> Dict[str, str]
```
- Maps character names to ElevenLabs voice IDs
- Saves character assignment JSON to episode dir

**Audio Generation**
```python
def generate_dialogue_audio(self, script: Dict) -> Path
```
- Generates narration (intro/outro) via ElevenLabs
- Generates character dialogue for each scene
- Concatenates all clips into combined dialogue MP3

**Scene Images**
```python
def generate_scene_images(self, script: Dict) -> List[Path]
```
Priority order:
1. Higgsfield Soul (text-to-image) — best quality
2. FLUX via OpenMontage/fal.ai — if FAL_KEY set
3. Stock photos (Pexels/Pixabay) — free APIs
4. Pollinations FLUX (free, may rate-limit)
5. Gradient fallback (always works)

**Scene Animation**
```python
def animate_scenes(self, image_paths: List[Path], script: Dict) -> List[Path]
```
Priority order:
1. Higgsfield DOP (image-to-video) — cinematic motion
2. Image-to-video hold (simple static image → video)

**Background Music**
```python
def generate_background_music(self, total_duration_secs: int) -> Path
```
Priority order:
1. Pixabay (royalty-free lullaby/ambient music)
2. ffmpeg sine tones (4-layer ambient synth fallback)

**Video Assembly**
```python
def assemble_final_video(self, video_paths: List[Path], dialogue: Path, music: Path) -> Path
```
- Concatenates scene videos (ffmpeg concat demuxer)
- Mixes narration + music + video into final MP4
- Fallback strategies if audio mixing fails

**Metadata & Thumbnail**
```python
def generate_thumbnail(self, script: Dict) -> Path
```
- Creates 1280×720 JPEG with:
  - Dark blue-black background with gradient
  - Episode number & title in neon cyan/magenta
  - "SURGE PILOT" branding
  - Neon border accent

**YouTube Upload**
```python
def upload_to_youtube(self, video_path: Path, script: Dict) -> Optional[str]
```
- Refreshes OAuth access token
- Uploads video with:
  - Episode title + number
  - YouTube description (auto-formatted with credits, tags, links)
  - Category: Animation
  - Made-for-kids: True
- Sets custom thumbnail after upload

**Full Render Orchestration**
```python
def render(self) -> Path
```
Complete pipeline:
1. [1/9] Script generation
2. [2/9] Dialogue audio
3. [3/9] Scene images
4. [4/9] Scene animation
5. [5/9] Background music
6. [6/9] Video assembly
7. [7/9] Thumbnail generation
8. [8/9] YouTube upload
9. [9/9] Finalization

Returns path to final MP4.

## Environment Setup

### Required Environment Variables

```bash
# In .env at repo root:

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Audio (at least one required)
ELEVENLABS_API_KEY=sk_...        # For character dialogue
PIPER_VOICE_DIR=/tmp/piper-voices # Local TTS fallback

# Image Generation (optional, priority-based)
HIGGSFIELD_API_KEY=...           # Best quality, text→image
HIGGSFIELD_SECRET=...
FAL_KEY=...                       # FLUX via fal.ai
PEXELS_API_KEY=...               # Stock photos (free)
PIXABAY_API_KEY=...              # Stock photos (free)

# YouTube (only for upload, not needed for --dry-run)
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
```

### Setting Up YouTube Credentials

1. **First time setup — generate OAuth tokens:**
   ```bash
   cd kids-channel
   python3 youtube_auth.py
   ```
   This opens OAuth Playground, you authenticate, and saves `token.json`

2. **token.json** (created by youtube_auth.py):
   ```json
   {
     "access_token": "...",
     "refresh_token": "...",
     "client_id": "...",
     "client_secret": "...",
     "token_uri": "https://oauth2.googleapis.com/token"
   }
   ```

3. **GitHub Secrets** (for CI/CD):
   ```
   YOUTUBE_CLIENT_ID
   YOUTUBE_CLIENT_SECRET
   YOUTUBE_ACCESS_TOKEN    (from token.json)
   YOUTUBE_REFRESH_TOKEN   (from token.json)
   ```

## Output Structure

Each episode generates:

```
kids-channel/episodes/surge_e01/
├── script.json                      # Generated/loaded episode script
├── character_assignments.json       # Character→voice mapping
├── dialogue/
│   ├── 00_intro.mp3                # Intro narration
│   ├── 01_00_ziggy.mp3             # Scene 1, dialogue line 0
│   ├── 01_01_echo.mp3              # Scene 1, dialogue line 1
│   └── ...
├── dialogue_combined.mp3           # All dialogue concatenated
├── scenes/
│   ├── scene_01.jpg                # Scene 1 image
│   ├── scene_01.mp4                # Scene 1 animated video
│   ├── scene_02.jpg
│   ├── scene_02.mp4
│   └── ...
├── music.mp3                       # Background music
├── raw.mp4                         # Concatenated scene videos
├── final.mp4                       # Final video (audio + video mixed)
├── thumbnail.jpg                   # YouTube thumbnail (1280×720)
├── concat.txt                      # ffmpeg concat demuxer list
└── concat_audio.txt                # ffmpeg audio concat list
```

## Episode Descriptions & Arc

### Episode 1: "The Awakening"
- **Plot**: Ziggy wakes up with no memory, meets Echo, discovers The Glitch threat
- **Arc**: Exposition / Act 1 — world-building, character intro, inciting incident
- **Mystery Reveal**: 5% — Glitch first introduced as threat
- **Learning Theme**: Trust, curiosity, new beginnings

### Episode 2: "The First Fragment"
- **Plot**: Discover shattered data, learn Glitch can communicate
- **Arc**: Rising action — first challenge, gathering clues
- **Mystery Reveal**: 15% — Void can communicate; unknown if friend or foe
- **Learning Theme**: Teamwork, trust your senses, seek understanding

### Episode 3: "The Cipher"
- **Plot**: Solve ancient cipher, discover Void is trapped, not destructive
- **Arc**: Rising action — puzzle-solving, moral complexity emerges
- **Mystery Reveal**: 35% — Void in pain, not malevolent (yet)
- **Learning Theme**: Empathy, collaboration, compassion

### Episode 4: "The Rescue Protocol"
- **Plot**: Ziggy enters Void's corrupted mindscape to save it
- **Arc**: Climax of Act 2 — protagonist's biggest challenge
- **Mystery Reveal**: 60% — Void's nature and suffering revealed
- **Learning Theme**: Bravery, compassion, sacrifice

### Episode 5: "Reconciliation"
- **Plot**: Ziggy & Echo offer Void a choice to join them; emotional connection
- **Arc**: Act 3A climax — emotional resolution
- **Mystery Reveal**: 85% — Void's backstory revealed; sentience confirmed
- **Learning Theme**: Family, redemption, compassion, healing

### Episode 6: "Integration"
- **Plot**: Healing Void's code, rebuilding trust, finding strength in diversity
- **Arc**: Act 3C — integration, healing, finding new normal
- **Mystery Reveal**: 90% — mostly resolved; new questions about realm emerge
- **Learning Theme**: Acceptance, healing takes time, diversity is strength

### Episode 7: "Echoes of the Past"
- **Plot**: Echo's memories awaken; she & Void discover they're separated halves
- **Arc**: Rising mystery — larger world revealed
- **Mystery Reveal**: 60% (shifted) — Echo's origins & realm's history
- **Learning Theme**: Identity, belonging, connection to history

### Episode 8: "The Threshold"
- **Plot**: Ancient dormant AI emerges; group must decide: investigate or seal away?
- **Arc**: Climactic mystery — stakes become cosmic
- **Mystery Reveal**: 70% — new force revealed; questions deepen
- **Learning Theme**: Wisdom vs. curiosity, knowing limits, unity in fear

### Episode 9: "The Choice"
- **Plot**: Group chooses to bridge the gap; cosmic confrontation with sacrifice
- **Arc**: Final conflict — greatest test
- **Mystery Reveal**: 95% — ancient presence partially revealed
- **Learning Theme**: Sacrifice, standing together, choosing hope

### Episode 10: "New Beginnings"
- **Plot**: Ancient guardian understood; alliance formed; purpose discovered
- **Arc**: Resolution / epilogue — new beginning established
- **Mystery Reveal**: 100% — all mysteries resolved; hints at Season 2
- **Learning Theme**: Unity, acceptance, purpose, hope, transcendence

## Character Guide

### Ziggy — Protagonist
- **Appearance**: Sleek cubic AI robot, neon-blue LED eyes, metallic silver-blue body, 4 feet tall
- **Personality**: Curious, brave, optimistic, learns quickly, loyal
- **Voice**: Bright, youthful, slightly robotic but warm
- **Colors**: Cyan (#00FFFF) → indigo (#3366FF)

### Echo — Mentor
- **Appearance**: Ethereal aurora of light, flowing purple/pink/silver, holographic form, ageless
- **Personality**: Wise, patient, mysterious, protective, speaks in metaphors
- **Voice**: Gentle, ethereal, melodic undertones, slightly echoing
- **Colors**: Magenta (#FF00FF) → lavender (#FFB0FF)

### Byte — Comic Relief
- **Appearance**: Cube-shaped robot with wheels, yellow with red accent stripes, LCD screen face
- **Personality**: Playful, clumsy but lovable, tech-savvy, loyal sidekick
- **Voice**: Higher-pitched, playful, beeping/booping mixed with speech
- **Colors**: Yellow (#FFFF00), orange (#FF6600)

### Void / The Glitch — Antagonist (evolving)
- **Appearance**: Digital glitches, pixelated distortions, black/neon-red artifacts (later: partial AI form)
- **Personality**: Mysterious, dangerous initially, revealed to be lonely and fragmented
- **Voice**: Distorted, otherworldly, echoing digital noise
- **Colors**: Black (#000000), red (#FF0000), magenta (#FF00FF)

## Rendering Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Codec | libx264 | VP9 considered but x264 is faster |
| Preset | medium | Balance quality/speed; ~2-4 hours per episode |
| CRF | 24 | High quality, visually lossless |
| Resolution | 1920×1080 | 16:9 landscape HD |
| Framerate | 24 fps | Cinematic, standard for animation |
| Audio Codec | AAC | YouTube-standard |
| Audio Bitrate | 128 kbps | Good quality for dialogue |
| Sample Rate | 48 kHz | Professional audio standard |
| Narration Volume | 1.0 | Full volume |
| Music Volume | 0.25 | Subtle background |
| SFX Volume | 0.50 | Balanced effects |
| Ambient Volume | 0.15 | Minimal ambience |
| Target Bitrate | 8 Mbps | Smooth YouTube streaming |
| Max File Size | 600 MB | ~10 min episode |

## Troubleshooting

### Script generation fails: "Out of credits"
**Fix**: Top up Anthropic credits at [console.anthropic.com](https://console.anthropic.com) → Billing

### No dialogue audio generated
**Solution**: Check ELEVENLABS_API_KEY. If not set, TTS is skipped (pipeline continues).

### Scene images all show gradients
**Fallback chain**:
1. Check HIGGSFIELD_API_KEY + HIGGSFIELD_SECRET
2. Check FAL_KEY for FLUX
3. Check PEXELS_API_KEY or PIXABAY_API_KEY
4. Gradients always work (no API needed)

### Video assembly fails: "ffmpeg concat failed"
**Debug**:
```bash
cat episodes/surge_e01/concat.txt
# Check each file exists:
ls -lh episodes/surge_e01/scenes/scene_*.mp4
```

### YouTube upload fails: "invalid_client"
**Fix**:
1. Confirm Google Cloud Console OAuth client exists and IDs match
2. Re-run `python3 youtube_auth.py` to refresh tokens
3. Update GitHub Secrets with new tokens

## Tips & Tricks

### 1. Script-Only Generation
Generate script without rendering:
```bash
python3 -c "
from SURGE_EPISODE_TEMPLATE import SurgeEpisodeRenderer
r = SurgeEpisodeRenderer(episode_number=1, dry_run=True)
script = r.load_or_generate_script()
import json
print(json.dumps(script, indent=2))
"
```

### 2. Pre-Write a Script
Generate first, then pass back:
```bash
python3 pipeline.py --series SURGE --episode 1 --dry-run
# Edit episodes/surge_e01/script.json
python3 pipeline.py --series SURGE --episode 1 --script-file episodes/surge_e01/script.json --dry-run
```

### 3. Skip Image Generation (test audio/video assembly)
```bash
python3 pipeline.py --series SURGE --episode 1 --skip-video --dry-run
# Uses gradient placeholders for scenes
```

### 4. Batch Render All Episodes (CI/CD)
```bash
for ep in {1..10}; do
  echo "Rendering Episode $ep..."
  python3 kids-channel/pipeline.py --series SURGE --episode $ep
done
```

### 5. Monitor Render Progress
Since rendering takes 2-4 hours:
```bash
watch -n 10 'du -sh kids-channel/episodes/surge_e*'
# Or in another terminal:
tail -f render.log  # If you pipe stdout to log
```

### 6. Playlist Management
After uploading all 10 episodes:
1. Go to YouTube Studio
2. Create a new playlist: "SURGE Pilot — Complete Series"
3. Add all 10 episodes in order
4. Pin to channel

## Performance Notes

**Single Episode Render Time**:
- Script generation: ~30s
- Dialogue generation (ElevenLabs): ~2-3 min (API calls in parallel)
- Image generation: ~2-5 min (Higgsfield) or ~1 min (FLUX) or instant (fallback)
- Image animation: ~5-10 min (Higgsfield DOP) or instant (hold)
- Music generation: ~1 min
- Video assembly: ~5-10 min (ffmpeg encoding at medium preset)
- **Total: 15-30 minutes for --dry-run, up to 2-4 hours for full render**

**Bottlenecks**:
1. Image generation (Higgsfield slowest)
2. Video encoding (libx264 at medium preset)
3. YouTube upload (depends on file size & network)

**Optimization Tips**:
- Use `--skip-video` to skip Higgsfield if debugging
- Use gradient fallback for testing (no API calls)
- Consider lowering CRF to 28 for faster encoding (slight quality loss)
- Use `preset=fast` for quicker testing (lower quality)

## References

- ElevenLabs API: https://elevenlabs.io/docs
- Higgsfield Soul: https://higgsfield.ai/
- Pollinations: https://pollinations.ai/
- ffmpeg: https://ffmpeg.org/documentation.html
- YouTube API: https://developers.google.com/youtube/v3/
- SURGE Series Config: `SURGE_SERIES_CONFIG.py`
- SURGE Episode Template: `SURGE_EPISODE_TEMPLATE.py`
- Main Pipeline: `pipeline.py`

---

**Version**: 0.1.0  
**Last Updated**: 2025  
**Series**: SURGE Pilot (10 episodes)  
**Status**: Production-ready
