# GENERATE-ALL-17-BOOKS.sh Implementation Guide

## Overview

`GENERATE-ALL-17-BOOKS.sh` is a production-ready bash orchestrator that coordinates the full 17-book generation pipeline. It manages prerequisites validation, parallelization, error handling, and YouTube uploads.

**Timeline:** 17 books in ~1 hour with 4-way parallelization (vs. 4+ hours sequential)

---

## Quick Start

### 1. Initial Setup

```bash
# Make sure you're in the repo root
cd /home/user/jamie-wigg

# Run with --dry-run first to validate prerequisites
bash GENERATE-ALL-17-BOOKS.sh --dry-run

# Check the log
cat GENERATION-LOG-*.txt
```

### 2. Run Full Pipeline

```bash
# Generate all 17 books (1-17), upload to YouTube
bash GENERATE-ALL-17-BOOKS.sh

# Skip Book 1, generate 2-17 only
bash GENERATE-ALL-17-BOOKS.sh --skip-book1

# Show detailed progress
bash GENERATE-ALL-17-BOOKS.sh --verbose

# Generate videos but don't upload to YouTube
bash GENERATE-ALL-17-BOOKS.sh --no-upload
```

### 3. Single Book / Batch Mode

```bash
# Generate only Book 5
bash GENERATE-ALL-17-BOOKS.sh --book 5

# Generate only Batch 2 (books 5-8) in parallel
bash GENERATE-ALL-17-BOOKS.sh --batch 2

# Generate Batch 3 (books 9-12) without uploads
bash GENERATE-ALL-17-BOOKS.sh --batch 3 --no-upload
```

---

## What the Script Does

### Phase 1: Validation (~30 sec)
- ✅ Checks Python 3 + required packages
- ✅ Validates `.env` file (Higgsfield, ElevenLabs, YouTube credentials)
- ✅ Verifies script files exist
- ✅ Creates output directories

### Phase 2: Estimation & Planning (~5 sec)
- Calculates estimated runtime
- Shows pipeline structure
- Displays book count and parallelization strategy

### Phase 3: Generation (1 hour for 17 books)

**Book 1 Setup (if not skipped):**
```
Book 1
├─ Higgsfield images [3 min] ✓
├─ ElevenLabs narration [5 min] ✓
├─ FFmpeg assembly [7 min] ✓
└─ YouTube upload [2 min] ✓
```

**Batch 1 (Books 2-4) - Parallel:**
```
Book 2  ┐
Book 3  ├─ All run simultaneously [~15 min total]
Book 4  ┘
```

**Batch 2 (Books 5-8) - Parallel:**
```
Book 5  ┐
Book 6  ├─ All run simultaneously [~15 min total]
Book 7  │
Book 8  ┘
```

**Batch 3 (Books 9-12) - Parallel:**
```
Book 9  ┐
Book 10 ├─ All run simultaneously [~15 min total]
Book 11 │
Book 12 ┘
```

**Batch 4 (Books 13-17) - Parallel:**
```
Book 13 ┐
Book 14 ├─ All run simultaneously [~15 min total]
Book 15 │
Book 16 │
Book 17 ┘
```

### Phase 4: Summary Report
- Total time elapsed
- Books completed ✓
- Books failed ✗
- YouTube URLs for each book
- Full log path

---

## Adapting Individual Scripts for the Orchestrator

The orchestrator calls your existing Python scripts with `--book` and `--output` flags. You need to update each script to accept these parameters.

### Step 1: Update `generate-book1-higgsfield-images.py`

**Current signature:**
```python
# Hardcoded for Book 1
OUTPUT_DIR = Path("./BOOK-1-HIGGSFIELD-PAGES")
```

**New signature (with args):**
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--book', type=int, default=1, help='Book number (1-17)')
parser.add_argument('--output', type=str, help='Output directory path')
parser.add_argument('--plan', type=str, help='Path to book PLAN.md file')
args = parser.parse_args()

OUTPUT_DIR = Path(args.output) if args.output else Path(f"./BOOK-{args.book}-HIGGSFIELD-PAGES")
BOOK_NUM = args.book
PLAN_FILE = Path(args.plan) if args.plan else Path(f"./BOOK-{args.book}/PLAN.md")
```

**Then load book-specific prompts from PLAN.md:**
```python
def load_book_plan(plan_path):
    """Load scene descriptions from PLAN.md"""
    if not plan_path.exists():
        log.warn(f"PLAN.md not found: {plan_path}")
        return {}
    
    with open(plan_path, 'r') as f:
        plan_content = f.read()
    
    # Parse PLAN.md for scene descriptions
    # Return dict: {"page_1": "description", "page_2": "description", ...}
    return parse_plan_sections(plan_content)

scenes = load_book_plan(PLAN_FILE)
for page_num in range(1, 17):
    prompt = scenes.get(f"page_{page_num}", "sunny quokka bedtime scene")
    # Generate image with prompt
```

**Example PLAN.md structure for Book 2:**
```markdown
# Book 2: Sunny and the Sleeping Glow Worms

## Page 1
Sunny discovers tiny glowing worms in the trees at dusk.
Watercolor style, purple twilight, magical glow.

## Page 2
The worms create patterns in the darkness.
Ethereal, peaceful, stars appearing above.

## Page 3
...and so on
```

### Step 2: Update `generate-book1-narration.py`

**Current signature:**
```python
STORY_TEXT = """As the warm golden afternoon..."""
```

**New signature:**
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--book', type=int, default=1, help='Book number (1-17)')
parser.add_argument('--output', type=str, help='Output directory path')
parser.add_argument('--script', type=str, help='Path to book script/narration file')
args = parser.parse_args()

OUTPUT_DIR = Path(args.output) if args.output else Path(f"./BOOK-{args.book}-NARRATION")
BOOK_NUM = args.book

# Load book-specific narration
if args.script and Path(args.script).exists():
    with open(args.script, 'r') as f:
        STORY_TEXT = f.read()
else:
    # Try to load from BOOK-N/script.txt or BOOK-N/narration.txt
    script_paths = [
        Path(f"./BOOK-{args.book}/script.txt"),
        Path(f"./BOOK-{args.book}/narration.txt"),
        Path(f"./BOOK-{args.book}-COMPLETE/script.txt"),
    ]
    STORY_TEXT = ""
    for path in script_paths:
        if path.exists():
            with open(path, 'r') as f:
                STORY_TEXT = f.read()
                break
    
    if not STORY_TEXT:
        print(f"ERROR: No script found for Book {args.book}")
        sys.exit(1)
```

### Step 3: Update `assemble-book1-final-video.py`

**Current signature:**
```python
VIDEO_FILE = Path("/home/user/jamie-wigg/BOOK-1-VIDEO/BOOK-1-Sunny-and-the-Flying-Fox.mp4")
NARRATION_FILE = Path("./BOOK-1-HIGGSFIELD/narration.wav")
```

**New signature:**
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--book', type=int, default=1, help='Book number (1-17)')
parser.add_argument('--input', type=str, help='Input directory with images + narration')
parser.add_argument('--output', type=str, help='Output video path')
args = parser.parse_args()

BOOK_NUM = args.book
INPUT_DIR = Path(args.input) if args.input else Path(f"./BOOK-{args.book}-COMPLETE")
OUTPUT_VIDEO = Path(args.output) if args.output else Path(f"./videos/BOOK-{args.book}-final.mp4")

# Look for image sequence and narration in INPUT_DIR
IMAGES_DIR = INPUT_DIR / "images"  # or "pages"
NARRATION_FILE = INPUT_DIR / "narration.wav"

if not NARRATION_FILE.exists():
    # Try alternative paths
    alt_paths = [
        INPUT_DIR / "NARRATION.wav",
        INPUT_DIR / "narration" / "audio.wav",
    ]
    for path in alt_paths:
        if path.exists():
            NARRATION_FILE = path
            break
```

### Step 4: Update `upload-book1-to-youtube.py`

**Current signature:**
```python
VIDEO_FILE = Path("/home/user/jamie-wigg/BOOK-1-VIDEO/BOOK-1-Sunny-and-the-Flying-Fox.mp4")

VIDEO_TITLE = "Sunny and the Flying Fox - Bedtime Story"
VIDEO_DESCRIPTION = """Join Little Sunny..."""
```

**New signature:**
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--book', type=int, default=1, help='Book number (1-17)')
parser.add_argument('--video', type=str, help='Path to video file')
parser.add_argument('--title', type=str, help='Video title')
parser.add_argument('--description', type=str, help='Video description')
args = parser.parse_args()

BOOK_NUM = args.book
VIDEO_FILE = Path(args.video) if args.video else Path(f"./videos/BOOK-{args.book}-final.mp4")

# Load book-specific metadata
def load_book_metadata(book_num):
    """Load title, description, tags from BOOK-N/metadata.json"""
    metadata_path = Path(f"./BOOK-{book_num}-COMPLETE/metadata.json")
    
    if metadata_path.exists():
        with open(metadata_path, 'r') as f:
            return json.load(f)
    
    # Fallback to defaults
    return {
        "title": f"Sunny's Bedtime Tale - Book {book_num}",
        "description": f"Book {book_num} from Sunny's Cozy Bedtime Tales...",
        "tags": ["bedtime story", "toddler", "Sunny Quokka"],
    }

metadata = load_book_metadata(BOOK_NUM)
VIDEO_TITLE = args.title or metadata.get("title", f"Sunny - Book {BOOK_NUM}")
VIDEO_DESCRIPTION = args.description or metadata.get("description", "")
VIDEO_TAGS = metadata.get("tags", [])
```

---

## Directory Structure Expected

After adapting the scripts, your directory structure should be:

```
/home/user/jamie-wigg/
├── GENERATE-ALL-17-BOOKS.sh              # Orchestrator (already created)
├── ORCHESTRATION-IMPLEMENTATION-GUIDE.md # This file
│
├── generate-book1-higgsfield-images.py   # UPDATED with --book --output --plan
├── generate-book1-narration.py           # UPDATED with --book --output --script
├── assemble-book1-final-video.py         # UPDATED with --book --input --output
├── upload-book1-to-youtube.py            # UPDATED with --book --video --title --description
│
├── BOOK-1-COMPLETE/
│   ├── images/                           # Generated Higgsfield images
│   ├── narration.wav                     # TTS audio
│   ├── script.txt                        # Story narration text
│   └── metadata.json                     # Title, description, tags
│
├── BOOK-2-COMPLETE/
│   ├── PLAN.md                           # Book 2 scene descriptions
│   ├── script.txt                        # Book 2 narration script
│   ├── metadata.json                     # Book 2 YouTube metadata
│   ├── images/
│   └── narration.wav
│
├── BOOK-3-COMPLETE/
│   └── ... (same structure)
│
├── ... BOOK-17-COMPLETE/
│
├── videos/                               # Assembly output
│   ├── BOOK-1-final.mp4
│   ├── BOOK-2-final.mp4
│   └── ... BOOK-17-final.mp4
│
├── GENERATION-LOG-2026-06-14-120000.txt # Run log
├── .env                                  # API credentials
└── kids-channel/token.json               # YouTube OAuth token
```

---

## Creating Book Metadata Files

For each book (2-17), create `BOOK-N-COMPLETE/metadata.json`:

```json
{
  "title": "Sunny and the Sleeping Glow Worms - Bedtime Story",
  "description": "Join Little Sunny the quokka as she discovers magical glowing worms in the trees at dusk. A gentle, calming bedtime story for toddlers.\n\n🌙 Perfect for:\n• Bedtime routines\n• Toddlers & preschoolers\n• Nature lovers\n• Calming stories\n\n📚 More Sunny Stories coming soon!\n\nSubscribe for new episodes every week: https://www.youtube.com/@SunnyBedtimeTales",
  "tags": [
    "bedtime story",
    "toddler",
    "kids cartoon",
    "quokka",
    "Australian animals",
    "glow worms",
    "gentle stories",
    "sleep story",
    "nature for kids"
  ]
}
```

---

## Example Run Output

### Dry Run (No Execution)

```
bash GENERATE-ALL-17-BOOKS.sh --dry-run --verbose
```

```
================================================================================
Checking Prerequisites
================================================================================

[2026-06-14 12:00:00] ✅ Python 3: Python 3.11.5
[2026-06-14 12:00:00] ✅ Package: requests
[2026-06-14 12:00:00] ✅ Package: google-auth-oauthlib
[2026-06-14 12:00:00] ✅ Higgsfield API key configured
[2026-06-14 12:00:00] ✅ ElevenLabs API key configured
[2026-06-14 12:00:00] ✅ YouTube credentials found

================================================================================
Generation Plan
================================================================================

[2026-06-14 12:00:01] ℹ️  Mode: Full pipeline (Books 1-17)
[2026-06-14 12:00:01] ℹ️  Books to generate: 17
[2026-06-14 12:00:01] ℹ️  Parallelism: up to 4 books
[2026-06-14 12:00:01] ℹ️  Time per book: 15m 0s
[2026-06-14 12:00:01] ℹ️  Estimated total time: 1h 5m 0s

[2026-06-14 12:00:02] ℹ️  DRY RUN: Would process:
[2026-06-14 12:00:02] ℹ️    Books 1-17 (5 steps total: setup + 4 batches)
[2026-06-14 12:00:02] ℹ️  To run for real, remove --dry-run flag
```

### Full Run (With Parallelization)

```
bash GENERATE-ALL-17-BOOKS.sh 2>&1 | tee my-run.log
```

```
================================================================================
BATCH 1: Books 2 3 4
================================================================================

[2026-06-14 12:05:00] ℹ️  BOOK 2 / 17
[2026-06-14 12:05:00] ℹ️  Book 2: Generating Higgsfield character ref + 16 images (est. 3 min)
[2026-06-14 12:05:00] ℹ️  Book 3: Generating Higgsfield character ref + 16 images (est. 3 min)
[2026-06-14 12:05:00] ℹ️  Book 4: Generating Higgsfield character ref + 16 images (est. 3 min)
[2026-06-14 12:08:15] ✅ Book 2: Higgsfield images complete
[2026-06-14 12:08:15] ✅ Book 3: Higgsfield images complete
[2026-06-14 12:08:15] ✅ Book 4: Higgsfield images complete
[2026-06-14 12:08:16] ℹ️  Book 2: Generating narration (est. 5 min)
[2026-06-14 12:08:16] ℹ️  Book 3: Generating narration (est. 5 min)
[2026-06-14 12:08:16] ℹ️  Book 4: Generating narration (est. 5 min)
[2026-06-14 12:13:45] ✅ Book 2: Narration complete
[2026-06-14 12:13:45] ✅ Book 3: Narration complete
[2026-06-14 12:13:45] ✅ Book 4: Narration complete
[2026-06-14 12:13:46] ℹ️  Book 2: Assembling video with FFmpeg (est. 7 min)
[2026-06-14 12:13:46] ℹ️  Book 3: Assembling video with FFmpeg (est. 7 min)
[2026-06-14 12:13:46] ℹ️  Book 4: Assembling video with FFmpeg (est. 7 min)
[2026-06-14 12:20:50] ✅ Book 2: Video assembly complete (videos/BOOK-2-final.mp4)
[2026-06-14 12:20:50] ✅ Book 3: Video assembly complete (videos/BOOK-3-final.mp4)
[2026-06-14 12:20:50] ✅ Book 4: Video assembly complete (videos/BOOK-4-final.mp4)
[2026-06-14 12:20:51] ℹ️  Book 2: Uploading to YouTube (est. 2 min)
[2026-06-14 12:20:51] ℹ️  Book 3: Uploading to YouTube (est. 2 min)
[2026-06-14 12:20:51] ℹ️  Book 4: Uploading to YouTube (est. 2 min)
[2026-06-14 12:23:00] ✅ Book 2: YouTube upload complete
[2026-06-14 12:23:00] ✅ Book 3: YouTube upload complete
[2026-06-14 12:23:00] ✅ Book 4: YouTube upload complete
[2026-06-14 12:23:01] ✅ Batch 1: Complete in 18m 1s

================================================================================
Generation Summary
================================================================================

[2026-06-14 12:57:30] ℹ️  Total time: 52m 30s
[2026-06-14 12:57:30] ✅ Completed: 17 books
[2026-06-14 12:57:30] ❌ Failed: 0 books
[2026-06-14 12:57:30] ℹ️  Full log saved to: /home/user/jamie-wigg/GENERATION-LOG-2026-06-14-120000.txt

[2026-06-14 12:57:31] ✅ All books generated successfully!
```

---

## Troubleshooting

### Issue: Scripts are still hardcoded for Book 1

**Solution:** Follow Step 1-4 above to add argument parsing to each script.

### Issue: "No module named 'google'" errors

```bash
# Install missing packages
pip install google-auth-oauthlib google-api-python-client elevenlabs requests
```

### Issue: API credentials not found

```bash
# Create .env file with your credentials
cat > /home/user/jamie-wigg/.env << 'EOF'
HIGGSFIELD_API_KEY=your-key-here
HIGGSFIELD_SECRET=your-secret-here
ELEVENLABS_API_KEY=your-key-here
EOF

# Make sure YouTube token exists
ls /home/user/jamie-wigg/kids-channel/token.json
```

### Issue: Some books fail, others continue

This is **expected behavior**. The orchestrator logs failures and continues with remaining books. Check the log:

```bash
# Show failed books
grep "ERROR" GENERATION-LOG-*.txt

# Show summary
tail -50 GENERATION-LOG-*.txt
```

### Issue: Want to retry failed books

```bash
# Re-run the full pipeline (will overwrite)
bash GENERATE-ALL-17-BOOKS.sh

# Or retry a specific batch
bash GENERATE-ALL-17-BOOKS.sh --batch 2 --verbose
```

---

## Performance Tuning

### Run Faster

```bash
# Generate 4 books at a time (default)
bash GENERATE-ALL-17-BOOKS.sh

# Skip time-consuming uploads, do them later
bash GENERATE-ALL-17-BOOKS.sh --no-upload

# Generate only books 2-17 (skip Book 1 setup)
bash GENERATE-ALL-17-BOOKS.sh --skip-book1
```

### Run on Slower Machine

If uploads are timing out, increase the retry wait time in the script:

```bash
# In GENERATE-ALL-17-BOOKS.sh, change:
sleep 5  # Increase to: sleep 10
```

### Monitor Progress in Real-Time

```bash
# Terminal 1: Run orchestrator
bash GENERATE-ALL-17-BOOKS.sh

# Terminal 2: Watch log file
tail -f GENERATION-LOG-*.txt
```

---

## Next Steps

1. **Adapt your Python scripts** to accept `--book`, `--output`, `--input`, `--video` parameters
2. **Create BOOK-N/metadata.json** files for books 2-17
3. **Create BOOK-N/PLAN.md** files with scene descriptions for each book
4. **Test with --dry-run** first: `bash GENERATE-ALL-17-BOOKS.sh --dry-run`
5. **Run a single book** to validate: `bash GENERATE-ALL-17-BOOKS.sh --book 2`
6. **Run a full batch** to test parallelization: `bash GENERATE-ALL-17-BOOKS.sh --batch 1`
7. **Run the full pipeline** when ready: `bash GENERATE-ALL-17-BOOKS.sh`

---

## Files Created

- **GENERATE-ALL-17-BOOKS.sh** (19 KB) — Production-ready orchestrator
- **ORCHESTRATION-IMPLEMENTATION-GUIDE.md** — This guide

Both are ready to use. Adapt your Python scripts as described above and you're done!
