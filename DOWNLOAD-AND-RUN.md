# ☀️ Morning Checklist: Download & Run Cartoon Pipeline

**You're waking up. Here's what to do to generate 3D cartoons.**

---

## Step 1: Pull Latest Branch (1 minute)

```bash
# On your Mac, pull the latest code
cd ~/jamie-wigg
git fetch origin claude/vibecode-fartrun-readme-h6ubxk
git checkout claude/vibecode-fartrun-readme-h6ubxk
git pull origin claude/vibecode-fartrun-readme-h6ubxk
```

Or use the **sync script**:
```bash
./sync-from-claude.command    # Double-click on Mac
```

---

## Step 2: Install Prerequisites (5-10 minutes)

### Blender 3.0+
```bash
# If not installed
brew install blender

# If installed, just verify addon is enabled
# Open Blender → Edit > Preferences > Add-ons
# Search for "Blender MCP" → check box to enable
```

### Python Packages
```bash
pip install opencv-python opencv-contrib-python
```

### Verify Setup
```bash
blender --version
python3 -c "import cv2; print(cv2.__version__)"
npm list hyperframes
```

---

## Step 3: Run the Pipeline (1-2 hours)

### Option A: Double-Click (Easiest)
```
Finder → jamie-wigg folder → run-cartoon-pipeline.command (double-click)
```

**This will:**
1. Check all tools are installed
2. Generate 3D models for Hero, Villain, Sidekick
3. Render frames from Blender
4. Process with OpenCV
5. Compose in HyperFrames
6. Export to MP4

### Option B: Terminal
```bash
cd ~/jamie-wigg
python3 scripts/cartoon-pipeline.py --all
```

### Option C: Single Character (for testing)
```bash
python3 scripts/cartoon-pipeline.py --character hero
# Just generates the Hero (30-50 min)
```

---

## Step 4: Download Output (5 minutes)

After the pipeline finishes, you'll have:

```
rhythmix-3d-scene-60s.mp4    ← This is your cartoon (1.2 GB, YouTube-ready)
/tmp/cartoon-hero-*/          ← Raw files (safe to delete after)
/tmp/cartoon-villain-*/
/tmp/cartoon-sidekick-*/
```

**Download the MP4:**
```bash
# Copy to Desktop
cp rhythmix-3d-scene-60s.mp4 ~/Desktop/

# Or use git to sync it back to your cloud session
# and download from there
```

---

## Step 5: Share (2 minutes)

- ✅ Upload to YouTube
- ✅ Share on TikTok (export shorter clips)
- ✅ Post on Instagram Reels
- ✅ Share to Discord/Twitter

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "blender: command not found" | Run `brew install blender` |
| OpenCV import error | Run `pip install opencv-python opencv-contrib-python` |
| Pipeline hangs at "Blender generation" | Make sure Blender addon is installed and enabled (Edit > Preferences > Add-ons) |
| "No frames rendered" | Check ~/tmp/ has 5+ GB free space |
| "MP4 export failed" | Reinstall HyperFrames: `npm install hyperframes` |

---

## Timeline

```
9:00 AM  → Pull code + install (10 min) ⏱️
9:10 AM  → Run pipeline (90 min) ⏱️
10:40 AM → Download + share (5 min) ⏱️
10:45 AM → Done! ✅
```

---

## What You Get

**3 fully animated cartoons:**
- Hero (brave warrior, blue glow)
- Villain (dark menace, purple spikes)
- Sidekick (cheerful companion, yellow energy)

**Each has:**
- 6 seconds of animation (180 frames @ 30fps)
- Dynamic camera motion
- Professional color grading
- Ready-to-upload to YouTube/TikTok

---

## Next Steps (Optional)

### Add Music & Voiceover
```bash
# Generate voiceover (ElevenLabs)
pip install elevenlabs
python3 -c "
from elevenlabs import generate, play
audio = generate(text='Meet the Hero...', voice='Rachel')
play(audio)
"

# Generate music (Replicate MusicGen)
pip install replicate
replicate predict jremsen/musicgen:4f90d5f0e19e926ca4a6f8aa1bc4e9a3f5b4a7e2 \
  --prompt 'epic orchestral hero theme'
```

### Create a Series
Edit `scripts/characters.json` to add more characters:
```json
{
  "robot": {
    "description": "Sleek chrome robot with green eyes",
    "voiceover": "Meet the Robot..."
  }
}
```

Then run: `python3 scripts/cartoon-pipeline.py --character robot`

---

## File Locations

| What | Where |
|---|---|
| Pipeline script | `scripts/cartoon-pipeline.py` |
| Character config | `scripts/characters.json` |
| Mac launcher | `run-cartoon-pipeline.command` |
| Documentation | `CARTOON-PIPELINE-README.md` |
| 3D composition | `rhythmix-3d-scene-60s/` |
| Final MP4 | `rhythmix-3d-scene-60s.mp4` |

---

**Good luck! Enjoy your 3D cartoon studio!** 🎬✨

Any questions? Check `CARTOON-PIPELINE-README.md` for detailed docs.
