# 3D Cartoon Pipeline

**End-to-end workflow: Claude → Blender → HyperFrames → MP4**

Your complete ecosystem for making 3D and 2D cartoons, without leaving the repo.

---

## Architecture

```
1. Concept (text prompt)
           ↓
2. Blender MCP (Claude generates 3D scene)
           ↓
3. Blender (renders frames or exports)
           ↓
4. Three.js (optional: interactive preview or real-time animation)
           ↓
5. HyperFrames (composite with music, voiceover, effects)
           ↓
6. FFmpeg (final MP4 output)
```

---

## Setup (One time)

### 1. Install uv (required for Blender MCP)

**macOS:**
```bash
brew install uv
```

**Windows (PowerShell):**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

After install, verify: `which uvx` (macOS/Linux) or `where uvx` (Windows)

### 2. Install Blender 3.0+

- **macOS:** `brew install blender`
- **Windows/Linux:** Download from [blender.org](https://www.blender.org/download/)

### 3. Install Blender Addon

1. Download `addon.py` from [blender-mcp repo](https://github.com/siddharth-2074/blender-mcp)
2. Open Blender → **Edit > Preferences > Add-ons > Install...**
3. Select `addon.py` and enable it
4. In the 3D viewport sidebar (press **N**), find **BlenderMCP** tab
5. Click **Connect to Claude** (keeps it listening on port 9876)

---

## Workflow Examples

### Example 1: Generate a 3D Character

**In Claude Code:**

```
Tell me:
1. Create a 3D cartoon character named "Zephyr" (humanoid, whimsical, pointy ears)
2. Add a glowing blue material
3. Add studio lighting (key + fill + rim)
4. Point the camera at an isometric angle
5. Render 60 frames and save to /tmp/zephyr-frames/
```

Claude uses **Blender MCP** to:
- Create the character mesh (or import from Hyper3D)
- Apply materials
- Set up lighting
- Render the sequence

**Output:** 60 PNG frames in `/tmp/zephyr-frames/`

---

### Example 2: Import a Sketchfab Model + Animate

```
Using Blender MCP:
1. Download the "Forest Dragon" model from Sketchfab
2. Add an armature (skeleton)
3. Create a simple walk animation (2 second loop)
4. Bake to frames at 24fps
5. Save as zephyr-walk-60.png sequence
```

Claude chains the Blender MCP commands to automate the whole pipeline.

---

### Example 3: Three.js Preview (Optional)

For **interactive preview** (before rendering):

```javascript
// apps/3d-cartoon-preview.html
import * as THREE from 'three';

// Load the Blender scene data (exported as glTF)
const loader = new THREE.GLTFLoader();
loader.load('/assets/zephyr.glb', (gltf) => {
  scene.add(gltf.scene);
  // Animate, interact, preview in real-time
});
```

---

## Pipeline: Blender → HyperFrames

Once you have frames from Blender (60 PNGs at 24fps):

### Step 1: Create a HyperFrames composition

```
rhythmix-zephyr-60s/
├── index.html          (GSAP animation)
├── frames/             (Blender output: zephyr-001.png ... zephyr-060.png)
├── script.txt          ("Introducing Zephyr...")
└── narration.wav       (ElevenLabs TTS)
```

### Step 2: In index.html, composite the frames

```html
<img id="frame" src="frames/zephyr-001.png" />

<script>
const frameCount = 60;
let currentFrame = 0;

gsap.timeline({ repeat: -1 })
  .to({}, {
    duration: 2.5,
    frame: frameCount,
    onUpdate: function() {
      const n = String(Math.floor(this.targets()[0].frame)).padStart(3, '0');
      document.getElementById('frame').src = `frames/zephyr-${n}.png`;
    }
  });
</script>
```

### Step 3: Render to MP4

```bash
cd rhythmix-zephyr-60s
npx hyperframes@latest render
# Output: rhythmix-zephyr-60s.mp4
```

---

## Tools in Your Ecosystem

| Step | Tool | Already have? | Setup |
|---|---|---|---|
| **Concept** | Claude | ✅ | N/A |
| **3D generation** | Blender MCP | ✅ (added to `.mcp.json`) | Install Blender addon |
| **3D import/Hyper3D** | Hyper3D Rodin (via MCP) | ✅ | Optional: add API key |
| **3D preview** | Three.js | ✅ (`npm install three`) | `apps/3d-preview.html` |
| **Frame composition** | HyperFrames (52 templates) | ✅ | Use existing |
| **Voiceover** | ElevenLabs / Kokoro TTS | ✅ | Use existing |
| **Final render** | FFmpeg | ✅ | Included in HyperFrames |

---

## Advanced: End-to-End Script

To automate the entire pipeline, create a Node.js script:

```javascript
// scripts/cartoon-pipeline.js
import { spawnSync } from 'child_process';
import fs from 'fs';

async function pipeline(characterName, description) {
  console.log(`🎬 Generating 3D cartoon: ${characterName}`);
  
  // 1. Ask Claude to generate in Blender (via MCP)
  // Claude returns: frames written to /tmp/${characterName}-frames/
  
  // 2. Copy frames to HyperFrames folder
  spawnSync('cp', [
    `-r`,
    `/tmp/${characterName}-frames/`,
    `./rhythmix-${characterName}-60s/frames/`
  ]);
  
  // 3. Generate voiceover (Kokoro TTS)
  spawnSync('npx', ['hyperframes', 'tts'], {
    cwd: `./rhythmix-${characterName}-60s/`
  });
  
  // 4. Render to MP4
  spawnSync('npx', ['hyperframes', 'render'], {
    cwd: `./rhythmix-${characterName}-60s/`
  });
  
  console.log(`✅ Output: ./rhythmix-${characterName}-60s.mp4`);
}

pipeline('zephyr', 'A whimsical cartoon character with pointy ears and blue glow');
```

Run: `node scripts/cartoon-pipeline.js`

---

## Next Steps

1. **Install Blender addon** (one-time setup)
2. **Test Blender MCP connection** in Claude Code:
   ```
   "Ask Claude to create a simple red cube in Blender"
   ```
3. **Generate your first 3D character** using Hyper3D or Blender
4. **Render frames** to a sequence
5. **Composite into HyperFrames** (reuse your existing templates)
6. **Export MP4** and share to YouTube

---

## Troubleshooting

| Issue | Fix |
|---|---|
| "uvx not found" | Run `which uvx` and use the full path in `.mcp.json` → command |
| Blender addon won't connect | Make sure Blender is running AND the addon is enabled in Preferences |
| Timeout errors | Break requests into smaller steps; simplify the Blender scene |
| Frame import fails | Ensure PNG filenames are zero-padded: `zephyr-001.png`, not `zephyr-1.png` |

---

## Capabilities You Now Have

✅ **3D cartoon generation** (text → Blender → frames)  
✅ **Character animation** (rigging, keyframes, rendering)  
✅ **Material & lighting control** (shaders, HDRIs, studio setup)  
✅ **Asset download** (Sketchfab, Poly Haven, Hunyuan3D)  
✅ **Frame sequence output** (ready for video composition)  
✅ **HyperFrames integration** (music, voiceover, effects)  
✅ **One-click MP4 export** (YouTube-ready)

---

**You now have:** Blender (3D) + Three.js (interactive preview) + HyperFrames (composition) + ElevenLabs (voice) + Replicate (image generation) = **a complete 3D cartoon studio.**

No downloads needed. Everything plugs into Claude Code.
