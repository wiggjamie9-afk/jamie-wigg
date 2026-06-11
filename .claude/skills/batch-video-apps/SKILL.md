---
name: batch-video-apps
description: Generate videos in batch for the 100 APPS Mission — rapid app deployment targeting underserved markets. Automates video generation for up to 100 app concepts using the open-models pipeline. Supports parallelization across multiple GPU machines and progress tracking. Use for rapid marketing asset creation for smallholder farmers, street vendors, freelancers, and informal economy workers.
metadata:
  tags: batch, 100-apps, video-generation, automation, parallelization, marketing
---

## When to use

User asks for:
- "Generate videos for the 100 APPS mission"
- "Batch create marketing videos for [X app concepts]"
- "Create promo videos for these 20 apps"
- "I need videos for the entire app lineup"

Perfect for:
- Apps targeting street vendors, freelancers, smallholders
- Multi-language content generation (Qwen models for Chinese, etc.)
- Rapid testing of app concepts with marketing validation
- Distributed generation across multiple machines (scale to 100 videos in 12 hours)

## App catalog format

Create a CSV or JSON file with app concepts:

**CSV format** (`apps.csv`):
```
app_name,description,target_user,language,voice
VendorPOS,Mobile point-of-sale for street vendors,Informal retailers,English,am_michael
GigsMaster,Freelancer income and project tracker,Gig workers,English,af_bella
HerdCheck,Livestock health screening with offline support,Smallholder farmers,English,am_michael
MediTrack,Rural clinic patient records (offline PWA),Health workers,English,bf_emma
AquaLogger,Water quality monitoring for small fisheries,Aquaculture workers,English,am_michael
```

**JSON format** (`apps.json`):
```json
{
  "apps": [
    {
      "name": "VendorPOS",
      "description": "Mobile point-of-sale for street vendors",
      "target_user": "Informal retailers",
      "language": "English",
      "voice": "am_michael",
      "scene_count": 5,
      "music_quality": "medium"
    },
    {
      "name": "GigsMaster",
      "description": "Freelancer income and project tracker",
      "target_user": "Gig workers",
      "language": "English",
      "voice": "af_bella",
      "scene_count": 5,
      "music_quality": "small"
    }
  ]
}
```

## Batch generation (synchronous)

```python
from app import CompleteVideoPipeline
import json
import time

# Load app catalog
with open("apps.json") as f:
    config = json.load(f)

pipeline = CompleteVideoPipeline(
    llm_model="mistral",
    music_model="small",
    comfyui_url="http://localhost:8188",
)

results = []
start_time = time.time()

for i, app in enumerate(config["apps"], 1):
    print(f"\n[{i}/{len(config['apps'])}] Generating: {app['name']}")
    
    try:
        output = pipeline.generate_video(
            topic=app["description"],
            scene_count=app.get("scene_count", 5),
            title=app["name"]
        )
        results.append({
            "name": app["name"],
            "status": "success",
            "output": output,
            "timestamp": time.time()
        })
        print(f"✓ {app['name']}: {output}")
    except Exception as e:
        results.append({
            "name": app["name"],
            "status": "failed",
            "error": str(e),
            "timestamp": time.time()
        })
        print(f"✗ {app['name']}: {e}")

# Summary
elapsed = time.time() - start_time
successful = len([r for r in results if r["status"] == "success"])
print(f"\n{'='*60}")
print(f"Batch complete: {successful}/{len(config['apps'])} videos")
print(f"Total time: {elapsed/3600:.1f} hours")
print(f"Avg time per video: {elapsed/len(config['apps']):.0f} seconds")

# Save results
with open("batch_results.json", "w") as f:
    json.dump(results, f, indent=2)
```

## Batch generation with parallelization

For faster generation, distribute across multiple GPU machines:

```python
from app import CompleteVideoPipeline
import json
import concurrent.futures
import time

config = json.load(open("apps.json"))

# Define GPU machines
gpu_machines = [
    "http://gpu1.local:8188",
    "http://gpu2.local:8188",
    "http://gpu3.local:8188",
]

def generate_single_video(app, gpu_url):
    """Generate a single video on a specific GPU machine."""
    pipeline = CompleteVideoPipeline(
        llm_model="mistral",
        music_model="small",
        comfyui_url=gpu_url,
    )
    return pipeline.generate_video(
        topic=app["description"],
        scene_count=app.get("scene_count", 5),
        title=app["name"]
    )

# Generate in parallel (3 videos at a time, one per GPU)
results = []
start_time = time.time()

with concurrent.futures.ThreadPoolExecutor(max_workers=len(gpu_machines)) as executor:
    futures = {}
    
    for i, app in enumerate(config["apps"]):
        gpu_url = gpu_machines[i % len(gpu_machines)]
        future = executor.submit(generate_single_video, app, gpu_url)
        futures[future] = app["name"]
    
    for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
        app_name = futures[future]
        try:
            output = future.result()
            results.append({
                "name": app_name,
                "status": "success",
                "output": output
            })
            print(f"[{i}/{len(config['apps'])}] ✓ {app_name}")
        except Exception as e:
            results.append({
                "name": app_name,
                "status": "failed",
                "error": str(e)
            })
            print(f"[{i}/{len(config['apps'])}] ✗ {app_name}: {e}")

elapsed = time.time() - start_time
print(f"\nParallel batch: {len([r for r in results if r['status'] == 'success'])}/{len(config['apps'])} videos in {elapsed/3600:.1f} hours")
```

## Cost comparison (100 videos)

| Approach | Time | Cost | Setup |
|----------|------|------|-------|
| **Open models (single GPU)** | 12 hours | $0 | 1 hour |
| **Open models (3 GPUs, parallel)** | 4 hours | $0 | 1.5 hours |
| **Replicate API** | 6 hours | $60–$120 | 10 min |
| **Professional production** | 50 days | $50K | weeks |

**Savings with open models:** $0 (vs $60–$120 with paid APIs, $50K+ with professionals).

## Language-specific generation

For multi-language app concepts:

```python
config = {
    "apps": [
        {
            "name": "VendorPOS",
            "description": "移动销售点系统(Mobile point-of-sale system)",
            "language": "Chinese",
            "voice": "qwen2.5"  # use Qwen for Chinese script generation
        },
        {
            "name": "HerdCheck",
            "description": "Suivi sanitaire du bétail (Livestock health tracking)",
            "language": "French",
            "voice": "mistral"  # Mistral multilingual support
        }
    ]
}

# For Chinese apps, use Qwen model:
pipeline_cn = CompleteVideoPipeline(llm_model="qwen2.5")
pipeline_cn.generate_video("移动销售点系统", 5, "VendorPOS-CN")

# For French/other languages, Mistral handles most:
pipeline_en = CompleteVideoPipeline(llm_model="mistral")
pipeline_en.generate_video("Suivi sanitaire du bétail", 5, "HerdCheck-FR")
```

## Output structure

After batch generation:

```
outputs/
├── VendorPOS/
│   ├── script_output.json
│   ├── images/
│   ├── narration.wav
│   ├── background_music.wav
│   └── VendorPOS.mp4
├── GigsMaster/
│   └── GigsMaster.mp4
├── HerdCheck/
│   └── HerdCheck.mp4
└── ... (100 apps)

batch_results.json
├── [{name: VendorPOS, status: success, output: ...}]
├── [{name: GigsMaster, status: success, output: ...}]
└── [{name: HerdCheck, status: failed, error: ...}]
```

## Organizing videos for distribution

After batch generation, organize for different channels:

```bash
# Create download pages per channel
mkdir -p downloads/google-play
mkdir -p downloads/f-droid
mkdir -p downloads/web-pwa
mkdir -p downloads/youtube

# Symlink MP4s for easy serving
cd downloads/google-play
for app in ../../outputs/*/; do
  ln -sf ../../"${app}"/"$(basename "$app")".mp4 .
done

# Create a batch landing page
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>100 APPS Mission — Video Library</title></head>
<body>
  <h1>100 APPS Mission — Promo Videos</h1>
  <div class="grid">
    <!-- Generate dynamically from batch_results.json -->
  </div>
</body>
</html>
EOF
```

## Progress tracking

Monitor batch generation progress:

```python
import json
from datetime import datetime

def track_batch_progress(results_file="batch_results.json"):
    """Print real-time progress summary."""
    try:
        with open(results_file) as f:
            results = json.load(f)
        
        total = len(results)
        successful = len([r for r in results if r["status"] == "success"])
        failed = len([r for r in results if r["status"] == "failed"])
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Progress: {successful}/{total} ✓ · {failed} ✗")
        
        if successful > 0:
            avg_time = sum([
                (r.get("end_time", 0) - r.get("start_time", 0))
                for r in results if r["status"] == "success"
            ]) / successful
            remaining = (total - successful) * avg_time / 3600
            print(f"  Est. time remaining: {remaining:.1f} hours")
    except FileNotFoundError:
        print("No batch results yet.")

# Run periodically:
# /loop 5m "python3 -c 'track_batch_progress()'"
```

## Error recovery

If a batch fails partway through, resume from last successful:

```python
import json

# Load previous results
with open("batch_results.json") as f:
    previous_results = json.load(f)

# Find which apps already succeeded
completed_names = {r["name"] for r in previous_results if r["status"] == "success"}

# Load app catalog and filter
with open("apps.json") as f:
    config = json.load(f)

remaining_apps = [app for app in config["apps"] if app["name"] not in completed_names]

print(f"Resuming: {len(remaining_apps)} apps remaining (out of {len(config['apps'])})")

# Continue batch generation with remaining apps
pipeline = CompleteVideoPipeline()
for app in remaining_apps:
    # ... generate_video() ...
    # Append results to batch_results.json
```

## Integration with 100 APPS Mission

After generating videos:

1. **Create landing pages per app:**
   ```bash
   /site-build "VendorPOS — Mobile POS for street vendors"
   # Generates: sites/vendorpos/index.html + assets
   ```

2. **Link videos to app pages:**
   ```html
   <video width="100%" controls>
     <source src="VendorPOS.mp4" type="video/mp4">
   </video>
   ```

3. **Create download page:**
   ```bash
   /site-build "100 APPS Mission — Download promo videos"
   # Auto-generates grid from outputs/ directory
   ```

4. **Submit to YouTube with bulk metadata:**
   - Use `generate-channel-art.yml` workflow to create thumbnails
   - Batch upload via YouTube API (see `youtube-auth.yml`)

## Performance tuning

**For 100 videos in 12 hours (sequential, single GPU):**
- Use `music_model="small"` for faster audio generation
- Reduce image resolution if needed (480×850 instead of 540×960)
- Pre-download all models before batch starts

**For 100 videos in 4 hours (parallel, 3 GPUs):**
- Distribute apps across 3 machines
- Each GPU handles ~33 videos in parallel
- Aggregate results at end

## Files to reference

- `app/README.md` — pipeline configuration
- `app/TEST_PIPELINE.py` — batch generation test pattern
- `app/FULL_STACK_PIPELINE.md` — performance benchmarks
- `100_APPS_MISSION.md` — app concept library
- `100_APP_BUILD_TEMPLATE.md` — app scaffolding
