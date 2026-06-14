# GENERATE-ALL-17-BOOKS.sh Quick Start

## TL;DR

```bash
cd /home/user/jamie-wigg

# Test the pipeline (no files generated)
bash GENERATE-ALL-17-BOOKS.sh --dry-run

# Generate all 17 books (~1 hour with 4-way parallelization)
bash GENERATE-ALL-17-BOOKS.sh

# Generate only Book 5
bash GENERATE-ALL-17-BOOKS.sh --book 5

# Generate Batch 2 (Books 5-8) in parallel
bash GENERATE-ALL-17-BOOKS.sh --batch 2

# Skip YouTube uploads, just generate videos
bash GENERATE-ALL-17-BOOKS.sh --no-upload

# Show detailed progress
bash GENERATE-ALL-17-BOOKS.sh --verbose
```

---

## Prerequisites (30 seconds)

```bash
# 1. Install Python packages
pip install requests google-auth-oauthlib google-api-python-client elevenlabs

# 2. Set up .env with API credentials
cat > /home/user/jamie-wigg/.env << 'EOF'
HIGGSFIELD_API_KEY=your-key-here
HIGGSFIELD_SECRET=your-secret-here
ELEVENLABS_API_KEY=your-key-here
EOF

# 3. Make sure YouTube token exists
ls /home/user/jamie-wigg/kids-channel/token.json

# 4. Create book metadata (templates with placeholders)
bash /home/user/jamie-wigg/setup-book-metadata.sh

# 5. Fill in the templates with actual content
# Edit: BOOK-2-COMPLETE/PLAN.md, script.txt
# Edit: BOOK-3-COMPLETE/PLAN.md, script.txt
# ... (for books 2-17)
```

---

## What It Does

### 1 Book
- 3 min: Higgsfield images (character ref + 16 pages)
- 5 min: ElevenLabs narration
- 7 min: FFmpeg video assembly
- 2 min: YouTube upload
- **Total: 17 min/book**

### All 17 Books
- **Sequential:** 4+ hours
- **Parallel (4 books at a time):** ~1 hour
- **With uploads:** Add 2 min per book

### Structure
```
BATCH 1 (Books 2-4) → 15 min [run in parallel]
                ↓
BATCH 2 (Books 5-8) → 15 min [run in parallel]
                ↓
BATCH 3 (Books 9-12) → 15 min [run in parallel]
                ↓
BATCH 4 (Books 13-17) → 15 min [run in parallel]
```

Total: ~60 minutes for 16 books + Book 1 setup

---

## Workflow

### Step 1: Validate Setup (30 sec)

```bash
bash GENERATE-ALL-17-BOOKS.sh --dry-run --verbose
```

Checks:
- ✅ Python 3 installed
- ✅ Required packages (requests, google-auth, elevenlabs)
- ✅ API credentials (.env file)
- ✅ Script files exist
- ✅ Output directories writable

### Step 2: Generate Metadata (2 min)

```bash
bash setup-book-metadata.sh
```

Creates:
- `BOOK-2-COMPLETE/metadata.json` (YouTube title/description)
- `BOOK-2-COMPLETE/PLAN.md` (scene descriptions for Higgsfield)
- `BOOK-2-COMPLETE/script.txt` (narration script)
- ... (same for BOOK-3 through BOOK-17)

Then edit these files with your actual content.

### Step 3: Test Single Book

```bash
bash GENERATE-ALL-17-BOOKS.sh --book 2 --verbose
```

Monitor progress:
```bash
tail -f GENERATION-LOG-*.txt
```

### Step 4: Test Batch

```bash
bash GENERATE-ALL-17-BOOKS.sh --batch 1
```

Generates Books 2, 3, 4 in parallel (~15 min)

### Step 5: Run Full Pipeline

```bash
bash GENERATE-ALL-17-BOOKS.sh
```

Generates all 17 books (~60 min)

---

## Output

### Log File
```bash
GENERATION-LOG-2026-06-14-120000.txt
```

Shows:
- Prerequisites check ✅
- Each book's progress (images, narration, video, upload)
- Failures and retries
- Total time and summary

### Videos
```bash
videos/BOOK-1-final.mp4
videos/BOOK-2-final.mp4
... 
videos/BOOK-17-final.mp4
```

### Book Folders
```bash
BOOK-1-COMPLETE/
  ├── images/              (Higgsfield-generated images)
  ├── narration.wav        (ElevenLabs TTS audio)
  ├── PLAN.md              (scene descriptions)
  ├── script.txt           (narration script)
  └── metadata.json        (YouTube title/description)

BOOK-2-COMPLETE/
  └── ... (same structure)

... BOOK-17-COMPLETE/
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Python 3 not found` | `brew install python3` or `apt install python3` |
| `ModuleNotFoundError: requests` | `pip install requests google-auth-oauthlib google-api-python-client elevenlabs` |
| `HIGGSFIELD_API_KEY not found` | Create `.env` file with `HIGGSFIELD_API_KEY=...` |
| `token.json not found` | Run YouTube OAuth flow to generate token |
| Book fails mid-pipeline | Check log: `tail -50 GENERATION-LOG-*.txt` |
| Want to retry failed books | Re-run: `bash GENERATE-ALL-17-BOOKS.sh --book N` |
| Want to skip uploads | `bash GENERATE-ALL-17-BOOKS.sh --no-upload` |
| Want detailed debug info | `bash GENERATE-ALL-17-BOOKS.sh --verbose` |

---

## Advanced Usage

### Resume From Last Failure
```bash
bash GENERATE-ALL-17-BOOKS.sh --resume
```

### Skip Book 1 Setup
```bash
bash GENERATE-ALL-17-BOOKS.sh --skip-book1
```

### Run Only Books 5-8
```bash
bash GENERATE-ALL-17-BOOKS.sh --batch 2
```

### Parallel with Local Processing
```bash
# Terminal 1: Run orchestrator
bash GENERATE-ALL-17-BOOKS.sh --verbose

# Terminal 2: Watch real-time progress
watch -n 5 'ls -la videos/'
```

### Upload Videos Separately
```bash
# Generate videos but skip uploads
bash GENERATE-ALL-17-BOOKS.sh --no-upload

# Later, upload specific books
bash GENERATE-ALL-17-BOOKS.sh --book 5 --upload-only
```

---

## Timeline Reference

| Scenario | Time |
|----------|------|
| Validation + estimation | 30 sec |
| 1 book (all 4 steps) | 17 min |
| 4 books in parallel | 18-20 min |
| 16 books (4 batches) | ~60 min |
| 17 books (with Book 1) | ~75 min |
| 17 books without uploads | ~35 min |

---

## Example Session

```bash
# 1. Test the pipeline (5 min)
$ bash GENERATE-ALL-17-BOOKS.sh --dry-run
[2026-06-14 12:00:00] ✅ Checking prerequisites...
[2026-06-14 12:00:15] ✅ All checks passed
[2026-06-14 12:00:16] ℹ️  Would generate: Books 1-17
[2026-06-14 12:00:17] ℹ️  Estimated time: 1h 5m

# 2. Create metadata (2 min)
$ bash setup-book-metadata.sh
✅ Created: BOOK-2-COMPLETE/metadata.json
✅ Created: BOOK-2-COMPLETE/PLAN.md
✅ Created: BOOK-2-COMPLETE/script.txt
... (for books 2-17)

# 3. Edit metadata (15 min)
$ vim BOOK-2-COMPLETE/PLAN.md
$ vim BOOK-2-COMPLETE/script.txt
$ vim BOOK-3-COMPLETE/PLAN.md
... (edit all books)

# 4. Test single book (20 min)
$ bash GENERATE-ALL-17-BOOKS.sh --book 2 --verbose
[2026-06-14 12:20:00] ℹ️  Book 2: Generating images...
[2026-06-14 12:23:15] ✅ Book 2: Images complete
[2026-06-14 12:23:16] ℹ️  Book 2: Generating narration...
[2026-06-14 12:28:30] ✅ Book 2: Narration complete
[2026-06-14 12:28:31] ℹ️  Book 2: Assembling video...
[2026-06-14 12:35:45] ✅ Book 2: Video complete
[2026-06-14 12:35:46] ℹ️  Book 2: Uploading to YouTube...
[2026-06-14 12:37:50] ✅ Book 2: Upload complete

# 5. Run full pipeline (60 min)
$ bash GENERATE-ALL-17-BOOKS.sh
[2026-06-14 13:00:00] ℹ️  Starting pipeline...
[2026-06-14 13:00:30] ✅ Book 1 complete
[2026-06-14 13:15:30] ✅ Batch 1 (Books 2-4) complete
[2026-06-14 13:30:30] ✅ Batch 2 (Books 5-8) complete
[2026-06-14 13:45:30] ✅ Batch 3 (Books 9-12) complete
[2026-06-14 14:00:30] ✅ Batch 4 (Books 13-17) complete
[2026-06-14 14:01:00] ✅ ALL 17 BOOKS COMPLETE!

# 6. Check results
$ ls -lh videos/
BOOK-1-final.mp4
BOOK-2-final.mp4
... 
BOOK-17-final.mp4

$ grep "YouTube" GENERATION-LOG-*.txt
[Book 1] https://youtube.com/watch?v=...
[Book 2] https://youtube.com/watch?v=...
... (17 URLs)
```

---

## Files Provided

| File | Purpose |
|------|---------|
| `GENERATE-ALL-17-BOOKS.sh` | Master orchestrator (19 KB) |
| `setup-book-metadata.sh` | Create metadata templates |
| `ORCHESTRATION-IMPLEMENTATION-GUIDE.md` | Detailed setup + adaptation guide |
| `QUICK-START-BOOKS.md` | This file |

---

## Next Steps

1. **Validate** → `bash GENERATE-ALL-17-BOOKS.sh --dry-run`
2. **Set up metadata** → `bash setup-book-metadata.sh`
3. **Edit metadata** → Fill in PLAN.md and script.txt files
4. **Test one book** → `bash GENERATE-ALL-17-BOOKS.sh --book 2`
5. **Test one batch** → `bash GENERATE-ALL-17-BOOKS.sh --batch 1`
6. **Run full pipeline** → `bash GENERATE-ALL-17-BOOKS.sh`

Go forth and generate! 🎉
