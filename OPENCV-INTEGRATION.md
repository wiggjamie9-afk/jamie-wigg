# OpenCV Integration for 3D Cartoon Pipeline

**Image processing layer:** Blender frames → OpenCV effects → HyperFrames → MP4

---

## Installation

### macOS
```bash
pip install opencv-python opencv-contrib-python
```

### Linux
```bash
pip install opencv-python opencv-contrib-python
sudo apt install libsm6 libxext6 libxrender-dev  # For headless rendering
```

### Windows
```bash
pip install opencv-python opencv-contrib-python
```

### Verify
```bash
python3 -c "import cv2; print(cv2.__version__)"
```

---

## Common Use Cases for 3D Cartoons

### 1. Frame Interpolation (Smooth Motion)

**Problem:** Blender renders at 24fps, but you want 60fps smoothness.  
**Solution:** OpenCV's optical flow to interpolate between frames.

```python
import cv2
import numpy as np

def interpolate_frames(frame1_path, frame2_path, num_intermediate=2):
    """Generate N intermediate frames between two images."""
    img1 = cv2.imread(frame1_path)
    img2 = cv2.imread(frame2_path)
    
    # Compute dense optical flow
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    flow = cv2.calcOpticalFlowFarneback(
        gray1, gray2, None, 0.5, 3, 15, 3, 5, 1.2, 0
    )
    
    # Generate intermediate frames
    results = [img1]
    for i in range(1, num_intermediate + 1):
        alpha = i / (num_intermediate + 1)
        warped = cv2.remap(
            img2,
            (np.arange(img2.shape[1]) - flow[:, :, 0] * alpha).astype(np.float32),
            (np.arange(img2.shape[0]).reshape(-1, 1) - flow[:, :, 1] * alpha).astype(np.float32),
            cv2.INTER_LINEAR
        )
        results.append(warped)
    
    results.append(img2)
    return results

# Usage:
interpolated = interpolate_frames('frame_001.png', 'frame_002.png', num_intermediate=2)
for i, frame in enumerate(interpolated):
    cv2.imwrite(f'interpolated_{i}.png', frame)
```

---

### 2. Morphing / Warping Between Characters

**Problem:** Smooth transition between two different 3D characters.  
**Solution:** Affine transformations + blending.

```python
import cv2

def morph_frames(src_frame, dst_frame, num_steps=10):
    """Smoothly transition from src to dst over N steps."""
    src = cv2.imread(src_frame)
    dst = cv2.imread(dst_frame)
    
    assert src.shape == dst.shape, "Images must be same size"
    
    results = []
    for step in range(num_steps + 1):
        alpha = step / num_steps
        blended = cv2.addWeighted(src, 1 - alpha, dst, alpha, 0)
        results.append(blended)
    
    return results

# Usage: Create 10-frame smooth transition
morphed = morph_frames('character_a.png', 'character_b.png', num_steps=10)
```

---

### 3. Color Grading & Effects

**Problem:** Blender frames look flat; need cinematic color correction.  
**Solution:** OpenCV color space conversions + curves.

```python
import cv2
import numpy as np

def apply_color_grade(image_path, color_temp='warm', saturation=1.2):
    """Apply cinematic color grading to a frame."""
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    
    # Adjust saturation
    img[:, :, 1] *= saturation
    img[:, :, 1] = np.clip(img[:, :, 1], 0, 255)
    
    # Adjust hue for color temp
    if color_temp == 'warm':
        img[:, :, 0] += 10
    elif color_temp == 'cool':
        img[:, :, 0] -= 10
    
    img[:, :, 0] = img[:, :, 0] % 180  # Wrap hue
    img = img.astype(np.uint8)
    
    return cv2.cvtColor(img, cv2.COLOR_HSV2BGR)

# Usage:
graded = apply_color_grade('frame_001.png', color_temp='warm', saturation=1.3)
cv2.imwrite('frame_001_graded.png', graded)
```

---

### 4. Motion Blur / Ghosting Effect

**Problem:** Enhance motion sense in still frames.  
**Solution:** Apply directional blur based on optical flow.

```python
import cv2

def motion_blur(image_path, kernel_size=15, angle=45):
    """Apply motion blur to simulate speed."""
    img = cv2.imread(image_path)
    
    # Create motion blur kernel
    size = kernel_size
    kernel = cv2.getRotationMatrix2D((size/2, size/2), angle, 1.0)
    kernel = cv2.warpAffine(np.ones((size, size)), kernel, (size, size))
    kernel = kernel / kernel.sum()
    
    # Apply
    blurred = cv2.filter2D(img, -1, kernel)
    return blurred

# Usage:
blurred = motion_blur('frame_001.png', kernel_size=20, angle=45)
cv2.imwrite('frame_001_blur.png', blurred)
```

---

### 5. Batch Processing Pipeline

**Use case:** Process 1800 Blender frames (60s @ 30fps) with color grading.

```python
import cv2
import os
from pathlib import Path

def batch_process_frames(input_dir, output_dir, effect='grade'):
    """Apply effect to all PNG frames in a directory."""
    Path(output_dir).mkdir(exist_ok=True)
    
    frames = sorted([f for f in os.listdir(input_dir) if f.endswith('.png')])
    
    for i, frame_name in enumerate(frames):
        input_path = os.path.join(input_dir, frame_name)
        output_path = os.path.join(output_dir, frame_name)
        
        img = cv2.imread(input_path)
        
        if effect == 'grade':
            img = apply_color_grade(input_path, color_temp='warm', saturation=1.2)
        elif effect == 'blur':
            img = motion_blur(input_path, kernel_size=15, angle=45)
        
        cv2.imwrite(output_path, img)
        
        if (i + 1) % 100 == 0:
            print(f"Processed {i + 1}/{len(frames)}")
    
    print(f"✓ Saved {len(frames)} frames to {output_dir}")

# Usage:
batch_process_frames(
    input_dir='./blender-output-frames/',
    output_dir='./processed-frames/',
    effect='grade'
)
```

---

## Full Pipeline Example

### Step 1: Render frames from Blender
```bash
# Blender CLI command (via MCP or headless)
blender -b scene.blend -o //frame_####.png -f 1 -e 1800
# Output: frame_0001.png through frame_1800.png
```

### Step 2: Process with OpenCV
```python
# process_frames.py
import cv2
from pathlib import Path

def process_cartoon_frames(input_dir, output_dir):
    """Apply professional color grading to Blender frames."""
    frames = sorted(Path(input_dir).glob('*.png'))
    Path(output_dir).mkdir(exist_ok=True)
    
    for frame in frames:
        img = cv2.imread(str(frame))
        
        # Color grade: warm + saturated (cinematic look)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(float)
        hsv[:, :, 1] *= 1.3  # +30% saturation
        hsv[:, :, 2] *= 0.95  # Slight darkening (contrast)
        hsv = hsv.astype(np.uint8)
        img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
        
        # Slight sharpening for clarity
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        img = cv2.filter2D(img, -1, kernel * 0.1 + np.eye(3) * 0.9)
        
        cv2.imwrite(str(Path(output_dir) / frame.name), img)
    
    print(f"✓ Processed {len(frames)} frames")

# Run:
process_cartoon_frames('./blender-frames/', './processed-frames/')
```

### Step 3: Import into HyperFrames
```bash
# Copy processed frames to HyperFrames folder
cp processed-frames/*.png rhythmix-3d-scene-60s/frames/

# Render to MP4
cd rhythmix-3d-scene-60s
npx hyperframes render
```

### Step 4: Output MP4
```bash
# Result: rhythmix-3d-scene-60s.mp4 (YouTube-ready)
```

---

## Advanced: Real-time Effects on Canvas

For interactive apps (`apps/3d-cartoon-studio.html`), apply OpenCV effects in Python backend:

```python
# server.py (Flask backend)
import cv2
from flask import Flask, request, send_file
import io

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_frame():
    """Apply OpenCV effect to uploaded frame."""
    file = request.files['frame']
    effect = request.args.get('effect', 'grade')
    
    # Read image
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # Apply effect
    if effect == 'grade':
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(float)
        hsv[:, :, 1] *= 1.3
        hsv = hsv.astype(np.uint8)
        img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    
    # Return
    _, buffer = cv2.imencode('.png', img)
    return send_file(
        io.BytesIO(buffer.tobytes()),
        mimetype='image/png'
    )

if __name__ == '__main__':
    app.run(port=5000)
```

Then in `apps/3d-cartoon-studio.html`:
```javascript
async function applyEffect(frameData, effect) {
  const formData = new FormData();
  formData.append('frame', frameData);
  
  const response = await fetch(`/process?effect=${effect}`, {
    method: 'POST',
    body: formData
  });
  
  return await response.blob();
}
```

---

## OpenCV + Your Ecosystem

| Tool | Purpose | Integration |
|---|---|---|
| **Blender MCP** | Generate 3D frames | Input: PNG sequences |
| **OpenCV** | Post-process frames | Input: Blender PNGs → Output: graded PNGs |
| **HyperFrames** | Compose with music/voice | Input: processed PNGs → Output: MP4 |
| **Three.js** | Interactive preview | Optional: real-time effect preview |

---

## Common Pitfalls

| Issue | Fix |
|---|---|
| "ModuleNotFoundError: cv2" | `pip install opencv-python` (not `pip install cv2`) |
| Slow batch processing | Use NumPy vectorization, parallel processing with `multiprocessing` |
| Memory issues on large sequences | Process frames in chunks, don't load entire sequence into RAM |
| Color banding after grading | Use 16-bit or float processing before converting to 8-bit |
| Frame filename mismatches | Always use zero-padded names: `frame_0001.png`, not `frame_1.png` |

---

## Next Steps

1. **Install OpenCV:** `pip install opencv-python opencv-contrib-python`
2. **Test on a single frame:** `python3 -c "import cv2; img = cv2.imread('test.png'); cv2.imwrite('test_out.png', img)"`
3. **Batch process Blender frames:** Use the pipeline above
4. **Import into HyperFrames** and render to MP4

**You now have:** Blender (3D) + OpenCV (FX) + HyperFrames (composition) + ElevenLabs (voice) = **Pro-grade 3D cartoon pipeline.**

---

## Resources

- **OpenCV docs:** https://docs.opencv.org/4.x/
- **Optical flow guide:** https://docs.opencv.org/4.x/d4/dee/tutorial_optical_flow.html
- **Color space conversions:** https://docs.opencv.org/4.x/df/d9d/tutorial_colorspaces.html
- **Image filtering:** https://docs.opencv.org/4.x/d4/d13/tutorial_filtering.html
