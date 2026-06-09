# Supervision — Computer Vision Integration for RHYTHMIX Ecosystem

**Installed:** `supervision==0.28.0` in MoneyPrinterTurbo environment  
**Dependencies:** opencv-python, scipy, matplotlib  
**Python:** >= 3.9

---

## What is Supervision?

Supervision is a lightweight, model-agnostic framework for computer vision workflows:
- **Detection anchoring** — convert YOLO, Transformers, MMDetection → `sv.Detections`
- **Annotators** — draw bounding boxes, masks, labels, tracking trails on video frames
- **Dataset tools** — load/merge/split COCO, YOLO, Pascal VOC datasets
- **Filtering & composition** — combine detections, filter by confidence, track objects across frames

**Why it matters:** Enables intelligent content selection, quality gates, and CV-powered features across the ecosystem.

---

## Integration Points

### 1. **MoneyPrinterTurbo — Intelligent Material Selection**

When sourcing video clips from Pexels/Pixabay:

```python
# Script says "A dog playing on the beach"
SCRIPT_OBJECTS = ["dog", "beach", "water"]

# Score candidate clips by object relevance
from ultralytics import YOLO
import supervision as sv

model = YOLO("yolov8n.pt")  # Lightweight detection

def score_clip(video_path: str, required_objects: list) -> float:
    """Higher score = better match for script."""
    cap = cv2.VideoCapture(video_path)
    object_matches = {obj: 0 for obj in required_objects}
    frame_count = 0
    
    while frame_count < 30:  # Sample first 30 frames
        ret, frame = cap.read()
        if not ret:
            break
        
        results = model(frame)
        detections = sv.Detections.from_ultralytics(results[0])
        
        # Check which required objects appear
        for obj in required_objects:
            if any(obj in name for name in detections.class_name):
                object_matches[obj] += 1
        
        frame_count += 1
    
    cap.release()
    
    # Score: fraction of frames with required objects
    return sum(object_matches.values()) / (frame_count * len(required_objects))

# Select best clip
candidate_clips = ["beach_1.mp4", "beach_2.mp4", "park_dogs.mp4"]
best_clip = max(candidate_clips, key=lambda c: score_clip(c, SCRIPT_OBJECTS))
```

**Result:** Automatically pick materials that match the script narrative.

---

### 2. **MoneyPrinterTurbo — Post-Render Quality Gate**

After rendering, detect issues before publishing:

```python
import cv2
import supervision as sv
from ultralytics import YOLO

def quality_check_video(video_path: str, min_confidence: float = 0.5) -> dict:
    """Check rendered video for common issues."""
    model = YOLO("yolov8n.pt")
    cap = cv2.VideoCapture(video_path)
    
    issues = []
    frame_count = 0
    low_quality_frames = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        results = model(frame)
        detections = sv.Detections.from_ultralytics(results[0])
        
        # Quality checks
        if detections.confidence.mean() < min_confidence:
            low_quality_frames += 1
        
        frame_count += 1
    
    cap.release()
    
    if low_quality_frames > frame_count * 0.2:  # >20% low quality
        issues.append(f"Low confidence detections in {low_quality_frames}/{frame_count} frames")
    
    return {
        "status": "PASS" if not issues else "REVIEW",
        "issues": issues,
        "frames_analyzed": frame_count,
    }

# Gate: only publish if quality_check passes
result = quality_check_video("output.mp4")
if result["status"] == "PASS":
    publish_video("output.mp4")
else:
    print(f"Quality check failed: {result['issues']}")
```

---

### 3. **HerdCheck — Livestock Detection & Classification**

For the livestock screening PWA, use Supervision to:
- Detect cattle, sheep, goats in phone camera frames
- Classify health indicators (lameness, mastitis signs)
- Annotate frames for farmer review

```python
# In HerdCheck app (React PWA + Python backend via FastAPI)
import supervision as sv
import cv2

# Custom livestock detection model (trained on RHYTHMIX dataset)
LIVESTOCK_MODEL = load_model("livestock_detector.pt")

async def analyze_livestock_frame(frame_bytes: bytes) -> dict:
    """Detect and score livestock health from phone camera."""
    frame = cv2.imdecode(np.frombuffer(frame_bytes, np.uint8), cv2.IMREAD_COLOR)
    
    # Run detection
    results = LIVESTOCK_MODEL.predict(frame)
    detections = sv.Detections.from_ultralytics(results[0])
    
    # Filter for health indicators
    lameness_detections = detections[
        detections.class_name.isin(["limp_gait", "favoring_leg", "reluctant_movement"])
    ]
    
    # Annotate for UI
    box_annotator = sv.BoxAnnotator(color=sv.Color.red() if len(lameness_detections) > 0 else sv.Color.green())
    label_annotator = sv.LabelAnnotator()
    
    annotated_frame = box_annotator.annotate(scene=frame.copy(), detections=detections)
    annotated_frame = label_annotator.annotate(scene=annotated_frame, detections=detections)
    
    return {
        "health_score": 1.0 - (len(lameness_detections) / len(detections) if len(detections) > 0 else 0),
        "detections": {
            "total": len(detections),
            "health_issues": len(lameness_detections),
        },
        "annotated_frame_base64": base64_encode(annotated_frame),
    }
```

**Result:** Farmers get real-time health scores with visual annotations (no training required).

---

### 4. **Design System + Video QA**

For design review — does the rendered video match RHYTHMIX brand?

```python
# Check that rendered promo uses RHYTHMIX colors
import supervision as sv
import cv2
import numpy as np

RHYTHMIX_COLORS = {
    "magenta": (255, 31, 90),      # #ff1f5a
    "cyan": (0, 216, 255),         # #00d8ff
    "green": (0, 232, 135),        # #00e887
}

def color_detection_in_video(video_path: str) -> dict:
    """Check if rendered video uses RHYTHMIX brand colors."""
    cap = cv2.VideoCapture(video_path)
    color_frames = {color: 0 for color in RHYTHMIX_COLORS}
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Convert BGR to RGB for comparison
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Count pixels in RHYTHMIX color range
        for color_name, color_bgr in RHYTHMIX_COLORS.items():
            # Tolerance: ±30 per channel
            mask = cv2.inRange(
                frame_rgb,
                tuple(c - 30 for c in color_bgr),
                tuple(c + 30 for c in color_bgr)
            )
            if cv2.countNonZero(mask) > frame.size * 0.01:  # >1% of frame
                color_frames[color_name] += 1
        
        frame_count += 1
    
    cap.release()
    
    return {
        "frames_analyzed": frame_count,
        "brand_color_usage": {
            color: count / frame_count for color, count in color_frames.items()
        },
    }
```

---

## How to Use

### Option A: Direct in MoneyPrinterTurbo

The environment is already configured:

```bash
cd MoneyPrinterTurbo

# Test Supervision is installed
uv run python -c "import supervision; print(supervision.__version__)"
# Output: 0.28.0

# Use in a script
uv run python your_script.py
```

### Option B: Via Claude Code Agent

When planning video workflows:

```
/ecc:plan "Generate a video with intelligent material selection using object detection"
→ Planner suggests using Supervision for frame analysis
→ Implement using provided integration patterns above
```

---

## Architecture Overview

```
Topic (from ECC)
    ↓
Script + Scene Descriptions (from Claude + ECC)
    ↓
[Supervision] Score candidate clips from Pexels/Pixabay
    ↓
Select best-matching clips (high object relevance)
    ↓
Compose video with subtitles + music
    ↓
[Supervision] Post-render quality gate
    ↓
✅ PASS → Publish
❌ FAIL → Flag for review
```

---

## Integration with Other Tools

| Tool | How Supervision Helps |
|---|---|
| **MoneyPrinterTurbo** | Intelligent material selection + quality gates |
| **HerdCheck** | Livestock detection + health scoring |
| **RHYTHMIX videos** | Design system QA (brand color verification) |
| **ECC agents** | Computer vision tasks delegated to CV-aware agents |

---

## Models You Can Use

- **YOLOv8n** (nano) — fast, lightweight, good for real-time
- **YOLOv8s** (small) — balanced accuracy/speed
- **CLIP** (via Transformers) — zero-shot classification
- **SAM** (Segment Anything) — segmentation
- **Custom models** — any detection/segmentation output → `sv.Detections`

```bash
# Download a model
uv run python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

---

## Next Steps

1. **Test material selection** — integrate into MoneyPrinterTurbo's clip-sourcing loop
2. **Train livestock model** — fine-tune YOLOv8 on lameness/mastitis dataset for HerdCheck
3. **Brand QA automation** — hook color detection into post-render checks
4. **Dataset utilities** — use Supervision to prepare training data for custom models

---

**Supervision is now part of the ecosystem. Ready to power intelligent CV workflows across MoneyPrinterTurbo, HerdCheck, and beyond.**
