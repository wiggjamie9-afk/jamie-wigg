# Jackson's Ecosystem + HyperFrames Integration Guide

**Complete Video Pipeline: Text → Voice + Music → Video**

This guide shows how to use Jackson's Ecosystem to generate professional narration and background music, then sync them with HyperFrames visuals to create broadcast-quality videos.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Jackson's Ecosystem                                         │
├─────────────────────────────────────────────────────────────┤
│ Input: "Script text"                                        │
│   ↓                                                         │
│ [1. Claude Enhancement] ← Optional: Polish for narration    │
│   ↓                                                         │
│ [2. Text-to-Voice] → voice-{ts}.wav (Kokoro/ElevenLabs)    │
│   ↓                                                         │
│ [3. Text-to-Music] → music-{ts}.wav (MusicGen)             │
│   ↓                                                         │
│ Output: Narration + Background Music                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ HyperFrames Composition                                     │
├─────────────────────────────────────────────────────────────┤
│ Input: voice-{ts}.wav + music-{ts}.wav                     │
│   ↓                                                         │
│ [1. Load Audio Assets]                                     │
│ [2. Sync Visuals to Audio Duration]                        │
│ [3. GSAP Animations timed to narration beats]              │
│ [4. Video Rendering] → output.mp4                          │
│   ↓                                                         │
│ Output: Fully synced video with narration + music          │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    Deploy / Share
```

---

## Step 1: Generate Audio with Jackson

### 1.1 Command Line

```bash
cd ecosystem
node jackson.js "Your video script here" --voice ElevenLabs --music musicgen-large --enhance
```

**Outputs:**
- `ecosystem/outputs/voice-1719136200123.wav` — Narration
- `ecosystem/outputs/music-1719136200123.wav` — Background music
- `ecosystem/outputs/manifest-1719136200123.json` — Metadata

### 1.2 Example: RHYTHMIX Promo

```bash
node jackson.js \
  "RHYTHMIX: Create AI music videos in seconds. Your Replicate token powers infinite creativity. No subscriptions. Just you, your ideas, and unlimited renders." \
  --voice ElevenLabs \
  --music musicgen-large \
  --enhance
```

**Enhanced text (output):**
```
RHYTHMIX unlocks your creative power. Create stunning AI-generated music videos in seconds, powered entirely by your Replicate API. No monthly subscriptions. No limits. Just pure creative freedom, your unique vision, and unlimited rendering capacity waiting for you.
```

### 1.3 Get Manifes Data

```bash
# Read the manifest to get file paths
cat ecosystem/outputs/manifest-1719136200123.json
```

Output:
```json
{
  "text": "Enhanced script...",
  "voice": "outputs/voice-1719136200123.wav",
  "music": {
    "prediction_id": "abc123...",
    "output_path": "outputs/music-1719136200123.wav"
  },
  "timestamp": "2026-06-23T14:30:00Z"
}
```

---

## Step 2: Create HyperFrames Composition

### 2.1 Folder Setup

```bash
# Create a new promo folder
mkdir -p rhythmix-jackson-60s
cd rhythmix-jackson-60s
```

### 2.2 Copy Jackson Outputs

```bash
# Copy voice and music to your composition folder
cp ../ecosystem/outputs/voice-*.wav .
cp ../ecosystem/outputs/music-*.wav .

# Or create symlinks (auto-update when Jackson regenerates)
ln -s ../ecosystem/outputs/voice-*.wav ./narration.wav
ln -s ../ecosystem/outputs/music-*.wav ./music.wav
```

### 2.3 Create `index.html` (HyperFrames Composition)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jackson's Ecosystem + HyperFrames</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      width: 1920px;
      height: 1080px;
      background: linear-gradient(135deg, #0F172A, #1E293B);
      font-family: 'Inter', sans-serif;
      overflow: hidden;
    }

    #canvas {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .hero {
      text-align: center;
      opacity: 0;
    }

    h1 {
      font-size: 80px;
      color: white;
      font-weight: 700;
      margin-bottom: 20px;
      text-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }

    .tagline {
      font-size: 40px;
      color: #FF6B9D;
      font-weight: 600;
      text-shadow: 0 5px 20px rgba(0,0,0,0.3);
    }

    .beats {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 60px;
      opacity: 0;
    }

    .beat {
      width: 40px;
      height: 40px;
      background: #6366F1;
      border-radius: 50%;
      opacity: 0.3;
    }

    .beat.active {
      background: #FF6B9D;
      opacity: 1;
      transform: scale(1.2);
    }

    /* Audio elements (hidden) */
    audio { display: none; }
  </style>
</head>
<body>
  <div id="canvas">
    <div class="hero">
      <h1>RHYTHMIX</h1>
      <p class="tagline">Create AI Music Videos Instantly</p>
    </div>
    <div class="beats">
      <div class="beat"></div>
      <div class="beat"></div>
      <div class="beat"></div>
      <div class="beat"></div>
    </div>
  </div>

  <!-- Jackson's Audio Assets -->
  <audio id="narration" src="./narration.wav"></audio>
  <audio id="music" src="./music.wav"></audio>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    const narration = document.getElementById('narration');
    const music = document.getElementById('music');
    const hero = document.querySelector('.hero');
    const beats = document.querySelectorAll('.beat');

    // Wait for audio to load, then start animation
    narration.addEventListener('loadedmetadata', () => {
      const duration = narration.duration;

      // Timeline: Sync all animations to narration duration
      const tl = gsap.timeline();

      // Intro: Fade in hero at start
      tl.to(hero, {
        opacity: 1,
        duration: 1,
        delay: 0.5
      }, 0);

      // Mid-video: Bounce beats at 50% through narration
      tl.to(beats, {
        opacity: 1,
        duration: 1
      }, duration * 0.3);

      tl.to(beats, {
        rotation: 360,
        repeat: -1,
        duration: 2
      }, duration * 0.5);

      // Outro: Fade out at end
      tl.to(hero, {
        opacity: 0.5,
        duration: 1
      }, duration - 1.5);

      // Start playback
      narration.play();
      music.play();
    });

    // Load audio (triggers loadedmetadata)
    narration.load();
    music.load();
  </script>
</body>
</html>
```

### 2.4 Create `hyperframes.json`

```json
{
  "id": "rhythmix-jackson-60s",
  "width": 1920,
  "height": 1080
}
```

### 2.5 Create `meta.json`

```json
{
  "version": "0.4.42"
}
```

### 2.6 Create `package.json`

```json
{
  "name": "rhythmix-jackson-60s",
  "scripts": {
    "dev": "npx --yes hyperframes@0.4.42 preview",
    "check": "npx --yes hyperframes@0.4.42 lint",
    "render": "npx --yes hyperframes@0.4.42 render",
    "publish": "npx --yes hyperframes@0.4.42 publish"
  }
}
```

---

## Step 3: Preview & Render

### 3.1 Preview in Browser

```bash
cd rhythmix-jackson-60s
npm run dev

# Opens http://localhost:8764 with live preview
# Shows your composition synced with Jackson's audio
```

### 3.2 Render to MP4

```bash
npm run render

# Creates: rhythmix-jackson-60s.mp4 (1920×1080)
```

### 3.3 Verify Output

```bash
# Play the rendered video
ffplay rhythmix-jackson-60s.mp4

# Or on macOS:
open rhythmix-jackson-60s.mp4
```

---

## Advanced: Audio Analysis for Beat Sync

For professional sync, analyze the narration and music to detect beats/pauses:

### Option 1: Use Replicate's Audio Analysis

```javascript
// In index.html, add beat detection
const detectBeats = async (audioPath) => {
  // Call Replicate audio-to-beat API
  // Returns: [0.5s, 1.2s, 2.1s, 3.8s, ...]
  // These are beat times to sync animations
};

const beats = await detectBeats('./narration.wav');

// Sync GSAP to beats
beats.forEach(beatTime => {
  tl.to(element, { scale: 1.2, duration: 0.2 }, beatTime);
});
```

### Option 2: Manual Beat Markers

Add timing comments to Jackson's enhanced text:

```bash
node jackson.js \
  "Say this slowly [BEAT_1] then pause [BEAT_2] now energize [BEAT_3]" \
  --enhance
```

Then parse in HyperFrames:

```javascript
const beatMarkers = [1.5, 3.2, 5.8]; // Seconds

beatMarkers.forEach(time => {
  tl.to(element, { scale: 1.2 }, time);
});
```

---

## Template: Full Video Pipeline Script

Save this as `batch-render.sh`:

```bash
#!/bin/bash
# Generates audio + video for a RHYTHMIX promo

SCRIPT="Your video script here"
OUTPUT_NAME="rhythmix-demo-60s"

echo "🎬 Jackson's Ecosystem + HyperFrames Pipeline"

# Step 1: Generate audio
echo "📢 Generating narration + music..."
cd ecosystem
node jackson.js "$SCRIPT" --voice ElevenLabs --music musicgen-large --enhance

# Get manifest
MANIFEST=$(ls -t outputs/manifest-*.json | head -1)
VOICE_FILE=$(jq -r '.voice' $MANIFEST)
MUSIC_FILE=$(jq -r '.music.output_path' $MANIFEST)

echo "✅ Audio generated:"
echo "   Voice: $VOICE_FILE"
echo "   Music: $MUSIC_FILE"

# Step 2: Create/Update HyperFrames composition
echo "🎨 Creating HyperFrames composition..."
cd ..
mkdir -p $OUTPUT_NAME
cp $VOICE_FILE $OUTPUT_NAME/narration.wav
cp $MUSIC_FILE $OUTPUT_NAME/music.wav

# Copy index.html, hyperframes.json, package.json from template
# (Or paste from above)

# Step 3: Render to MP4
echo "🎬 Rendering video..."
cd $OUTPUT_NAME
npm run render

# Step 4: Verify
echo "✅ Complete!"
echo "📁 Output: $OUTPUT_NAME/$OUTPUT_NAME.mp4"
ls -lh $OUTPUT_NAME.mp4
```

Run it:

```bash
chmod +x batch-render.sh
./batch-render.sh
```

---

## Integration with RHYTHMIX Studio

### Option A: Manual (Full Control)

```bash
# 1. Generate with Jackson
node ecosystem/jackson.js "Your script"

# 2. Create HyperFrames composition (as above)

# 3. Render
cd rhythmix-jackson-60s
npm run render

# 4. Upload to rhythmixapp.com.au
open https://rhythmixapp.com.au/studio
```

### Option B: Automated (One Skill)

Create `.claude/skills/jackson-hyperframes-render/SKILL.md`:

```markdown
# Jackson → HyperFrames → MP4

Generate video end-to-end in one command.

Usage:
/jackson-hyperframes-render "Your script" --aspect 16:9 --duration 60

Outputs:
- rhythmix-jackson-{timestamp}.mp4 (ready to upload)
```

Then invoke with:

```
/jackson-hyperframes-render "Create an inspiring video about AI transforming music"
```

---

## Troubleshooting

### Audio Doesn't Play in Browser Preview

```html
<!-- Ensure audio elements have crossOrigin -->
<audio id="narration" src="./narration.wav" crossorigin="anonymous"></audio>
```

### Video renders but audio is silent

**Check file paths:**
```bash
# Verify files exist
ls -lh rhythmix-jackson-60s/*.wav

# Verify they're valid WAV files
file rhythmix-jackson-60s/*.wav
```

**Re-export from Jackson:**
```bash
node ecosystem/jackson.js "Script" --voice ElevenLabs
```

### Sync is off (video doesn't match audio)

**Check duration:**
```javascript
// In index.html console
console.log('Narration duration:', narration.duration);
console.log('Music duration:', music.duration);
console.log('Animation should take:', narration.duration + 's');
```

**Adjust timeline:**
```javascript
// If narration is 30s, make animations run 30s
const tl = gsap.timeline({ duration: narration.duration });
```

### Output MP4 has no audio

HyperFrames renders video frames only. To add audio to MP4:

```bash
# Use ffmpeg to merge audio + video
ffmpeg -i rhythmix-jackson-60s.mp4 -i narration.wav -c:v copy -c:a aac \
  -map 0:v:0 -map 1:a:0 rhythmix-jackson-60s-final.mp4
```

---

## Performance Optimization

### Large Video (4K)

```json
// hyperframes.json
{
  "id": "rhythmix-jackson-4k",
  "width": 3840,
  "height": 2160,
  "fps": 24
}
```

### Fast Render

```json
{
  "id": "rhythmix-jackson-preview",
  "width": 1280,
  "height": 720,
  "fps": 30
}
```

---

## What's Next?

1. **Deploy to rhythmixapp.com.au:**
   - Upload MP4 to GitHub Pages
   - Add to downloads page
   - Integrate into STARLIGHTMIX Studio

2. **Mobile variant:**
   - Switch to portrait 9:16 (TikTok/Reels)
   - Adjust HyperFrames composition for mobile

3. **Series:**
   - Generate 5 variations with different scripts
   - Create batch rendering pipeline
   - Deploy all at once

4. **Live streaming:**
   - Export HyperFrames as streaming input
   - Use OBS to broadcast live compositions

---

**Jackson's Ecosystem + HyperFrames = Broadcast-Quality Videos, Zero Friction**
