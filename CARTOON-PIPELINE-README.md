# Cartoon Pipeline - Automated 3D Production

**Run once. Get a full animated 3D cartoon with music and voiceover.**

---

## Quick Start

```bash
# Run single character
python3 scripts/cartoon-pipeline.py --character hero

# Run all characters
python3 scripts/cartoon-pipeline.py --all

# List available characters
python3 scripts/cartoon-pipeline.py --list
```

---

## What Happens (5 Steps, ~45 minutes per character)

```
CHARACTER (hero, villain, sidekick)
    ↓
BLENDER MCP
  → Generates 3D model from description
  → Saves .blend file
    ↓
BLENDER CLI
  → Renders 180 PNG frames (6 seconds @ 30fps)
    ↓
OPENCV
  → Color grading (character-specific palette)
  → Sharpening, saturation boost
  → Saves processed frames
    ↓
HYPERFRAMES
  → Copies frames to composition folder
  → Updates voiceover script
    ↓
FFMPEG
  → Renders MP4 (1920×1080, H.264)
  → Outputs rhythmix-3d-scene-60s.mp4
```

---

## Prerequisites

### Install Tools

```bash
# Blender 3.0+ (with addon)
brew install blender                    # macOS
# OR download from https://blender.org

# OpenCV
pip install opencv-python opencv-contrib-python

# HyperFrames (npm)
npm install --save hyperframes

# FFmpeg
brew install ffmpeg                     # macOS
apt install ffmpeg                      # Linux
```

### Setup Blender MCP

1. Download `addon.py` from [blender-mcp](https://github.com/siddharth-2074/blender-mcp)
2. Install in Blender: **Edit > Preferences > Add-ons > Install**
3. Enable "Blender MCP" addon
4. In 3D viewport (press **N**), find **BlenderMCP** tab
5. Click **Connect to Claude** (listens on port 9876)

---

## Customizing Characters

### Add a New Character

Edit `scripts/cartoon-pipeline.py`, add to `CHARACTERS` dict:

```python
'robot': Character(
    name='Robot',
    description='A sleek chrome robot with glowing green eyes',
    blender_script='''
import bpy
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create robot body
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1))
robot = bpy.context.active_object
robot.name = 'Robot'

# Add material
mat = bpy.data.materials.new(name='RobotMaterial')
mat.diffuse_color = (0.2, 1.0, 0.2, 1.0)  # Green
mat.metallic = 0.9
robot.data.materials.append(mat)
''',
    voiceover='Introducing the Robot. Mechanical. Intelligent. Loyal.',
    color_scheme={'r': 0.2, 'g': 1.0, 'b': 0.2}
)
```

### Or Edit `scripts/characters.json`

```json
{
  "robot": {
    "description": "A sleek chrome robot with glowing green eyes",
    "voiceover": "Introducing the Robot. Mechanical. Intelligent. Loyal.",
    "color_scheme": {"r": 0.2, "g": 1.0, "b": 0.2},
    "music_prompt": "futuristic tech theme"
  }
}
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "blender: command not found" | Add Blender to PATH or use full path: `/Applications/Blender.app/Contents/MacOS/blender` |
| "ModuleNotFoundError: cv2" | `pip install opencv-python` |
| "Blender generation failed" | Check Blender addon is running. Look at temp script file for Python errors. |
| "No frames rendered" | Check Blender can write to `/tmp/`. Increase timeout in script. |
| "OpenCV processing slow" | Processing is single-threaded. Use `multiprocessing` for parallel frame processing. |
| "HyperFrames render fails" | Make sure `npx hyperframes@latest` works standalone first. |

---

## Performance

| Step | Time | CPU | Memory |
|---|---|---|---|
| Blender generation | 10-30s | Medium | Low |
| Frame rendering (180 frames) | 10-20 min | High | Medium |
| OpenCV processing | 2-5 min | Medium | Low |
| HyperFrames composition | 5-10 min | Medium | Low |
| MP4 export (FFmpeg) | 5-15 min | High | Low |
| **Total per character** | **~30-50 min** | — | — |

**All three characters:** ~2 hours

---

## Output Files

After running `--all`:

```
/tmp/cartoon-hero-{timestamp}/
  ├── hero.blend                      # Blender source
  ├── frames_raw/                      # Raw renders
  │   ├── frame_0001.png
  │   ├── frame_0002.png
  │   └── ... (180 frames)
  └── frames_processed/                # Post-processed
      ├── frame_0001.png
      ├── frame_0002.png
      └── ... (180 frames)

rhythmix-3d-scene-60s/
  ├── frames/                          # Copied processed frames
  ├── script.txt                       # Updated with voiceover
  └── rhythmix-3d-scene-60s.mp4        # Final output ✅

/tmp/cartoon-villain-{timestamp}/
  └── ... (same structure)

/tmp/cartoon-sidekick-{timestamp}/
  └── ... (same structure)
```

---

## Next: Add Music & Voiceover

After pipeline completes, enhance with:

```bash
# Generate voiceover (ElevenLabs)
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}" \
  -H "xi-api-key: {YOUR_KEY}" \
  -d '{"text":"Meet the Hero..."}' > narration.wav

# Generate music (Replicate MusicGen)
replicate predict music-gen --prompt "epic orchestral hero theme"

# Composite both into HyperFrames composition
# (see rhythmix-3d-scene-60s/index.html)
```

---

## Extending the Pipeline

### Add More Post-processing

Edit `step3_process_with_opencv()`:

```python
# Add motion blur
kernel = cv2.getRotationMatrix2D((7.5, 7.5), 45, 1.0)
kernel = cv2.warpAffine(np.ones((15, 15)), kernel, (15, 15))
img = cv2.filter2D(img, -1, kernel)

# Add film grain
grain = np.random.normal(0, 5, img.shape).astype(np.uint8)
img = cv2.add(img, grain)
```

### Batch Generate Multiple Styles

```bash
# Generate all characters in high quality
for character in hero villain sidekick; do
  python3 scripts/cartoon-pipeline.py --character "$character" &
done
wait
```

### Export to Different Formats

Modify `step5_export_mp4()` to support:
- WebM (for web)
- ProRes (for editing)
- Sequence (return PNGs)

---

## Timeline Example (Your Schedule)

If running at **9 PM, target 5 hours (2 AM completion):**

```
9:00 PM  → Start: python3 scripts/cartoon-pipeline.py --all
9:05 PM  → Blender generation (3 chars) = 30 min
9:35 PM  → Frame rendering (3 chars, 20 min each) = 60 min
10:35 PM → OpenCV processing (3 chars, 5 min each) = 15 min
10:50 PM → HyperFrames composition = 10 min
11:00 PM → FFmpeg export (3 chars, 10 min each) = 30 min
11:30 PM → Done! 2.5 hours ahead of schedule ✅
```

---

## Advanced: GPU Acceleration

Blender CUDA rendering (for RTX GPUs):

```python
# In character's blender_script:
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.device = 'CUDA'
bpy.context.preferences.addons['cycles'].preferences.compute_device_type = 'CUDA'
```

---

## License

This pipeline uses:
- **Blender** (GPL 2.0)
- **OpenCV** (Apache 2.0)
- **HyperFrames** (MIT)
- **FFmpeg** (LGPL 2.1+)

---

**Ready to produce cartoons at scale? Run the pipeline.** 🎬
