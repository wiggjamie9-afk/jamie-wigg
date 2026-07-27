# Sonny's Cozy Quokka Bedtime Tales — Complete Execution Guide

**Goal:** Complete all 35 books (3-35) with fully illustrated watercolour PDF/EPUB editions.

**Current State:** Book 3 delivered. Book 4 jobs fired. Books 5-35 infrastructure ready (558 prompts, all directories).

---

## Timeline & Resource Requirements

- **Total time:** 2-4 hours (mostly waiting for Higgsfield queue)
- **Active work:** ~15 minutes (mostly copy-paste commands)
- **Higgsfield cost:** ~$666 total (~$1-2 per 20-image book)
- **Higgsfield balance required:** Minimum ~$50 per phase to stay ahead of queue

---

## Phase 0: Prerequisites (Do This First)

### 1. Verify Higgsfield credentials
```bash
# Set your Higgsfield API key in .env at repo root:
cat > .env << EOF
HIGGSFIELD_API_KEY=sk-...your-key...
HIGGSFIELD_SECRET=...your-secret...
EOF

# Or export them:
export HIGGSFIELD_API_KEY="sk-...your-key..."
```

### 2. Check Higgsfield balance
Go to https://higgsfield.ai/account/billing and verify you have enough credits for the phase.

### 3. Verify git branch
```bash
git branch -v | grep claude/youtube-tv-research-fla0ts
# Should show: claude/youtube-tv-research-fla0ts ... [origin/...]
```

---

## Phase 1: Complete Book 4 (Optional — Already Jobs Fired)

**Status:** 23 Higgsfield jobs fired on 2026-07-27.

### Step 1.1: Monitor Book 4 Jobs
```bash
# Go to https://higgsfield.ai/jobs
# Look for job IDs from book4/redesign/art-v2/jobmap.tsv
# Wait for all 23 to show "Completed" status
```

**Typical wait:** 5-30 minutes (depends on Higgsfield queue).

### Step 1.2: Get Image Download URLs

Once all jobs complete:
1. Go to https://higgsfield.ai/jobs
2. For each completed job (pages 2-24), copy the download URL
3. Create `art-fetch-manifest.txt` in repo root:

```bash
# Format: one line per image
cat > art-fetch-manifest.txt << 'EOF'
book4/redesign/art-v2/page-2.png	https://cdn.higgsfield.ai/job-xxx/image.png
book4/redesign/art-v2/page-3.png	https://cdn.higgsfield.ai/job-yyy/image.png
...
book4/redesign/art-v2/page-24.png	https://cdn.higgsfield.ai/job-zzz/image.png
EOF

# Tab-delimited (use actual tab character, not spaces)
```

### Step 1.3: Trigger CI to Download Images
```bash
git add art-fetch-manifest.txt
git commit -m "book4: fetch generated art from manifest"
git push origin claude/youtube-tv-research-fla0ts
```

**Watch:** https://github.com/wiggjamie9-afk/jamie-wigg/actions (fetch-book-art workflow)

**Typical wait:** 2-5 minutes.

### Step 1.4: Verify Image Download
```bash
# After CI completes, verify images exist:
ls book4/redesign/art-v2/page-*.png | wc -l
# Should show: 23
```

### Step 1.5: Assemble Book 4 PDF + EPUB
```bash
python build_book_v2.py 4
```

**Output:**
- `book4/redesign/sunny-and-the-sugar-glider-v2-illustrated.pdf` (~16 MB)
- `book4/redesign/sunny-and-the-sugar-glider-v2-illustrated.epub` (~26 MB)

### Step 1.6: Commit + Download
```bash
git add book4/redesign/*.pdf book4/redesign/*.epub
git commit -m "book4: add assembled PDF and EPUB"
git push origin claude/youtube-tv-research-fla0ts

# Files now ready to download from Claude
```

---

## Phase 2: Complete Books 5-8 (80 Images)

**Status:** Stories + 80 prompts prepared.

### Step 2.1: Fire All 80 Jobs
```bash
# Make sure credentials are set in .env or exported:
export HIGGSFIELD_API_KEY="sk-...your-key..."

# Fire all jobs:
python fire-books-5-8-jobs.py

# Expected output:
# 📖 Book 5: Sunny and the Little Bilby
#   ✓ Job fired: [job-id-1] (Sunny and the Little Bilby — ...)
#   ✓ Job fired: [job-id-2] ...
# ... (80 jobs total across 4 books)
# ✓ Total jobs: 80
```

**Typical wait:** 30-120 minutes (depends on Higgsfield queue).

### Step 2.2: Monitor Jobs
```bash
# Go to https://higgsfield.ai/jobs
# Look for book5, book6, book7, book8 jobs
# Track progress in the dashboard
```

**Dry run (no firing):**
```bash
python fire-books-5-8-jobs.py --dry-run  # Test without using credits
```

### Step 2.3: Get Image Download URLs

Once all 80 jobs complete:
```bash
# Create art-fetch-manifest.txt with URLs for Books 5-8
# Same format as Phase 1, but now 80 lines (4 books × 20 images each)

cat > art-fetch-manifest.txt << 'EOF'
book5/redesign/art-v2/page-3.png	https://...
book5/redesign/art-v2/page-4.png	https://...
...
book8/redesign/art-v2/page-22.png	https://...
EOF
```

### Step 2.4: Trigger CI to Download All 80 Images
```bash
git add art-fetch-manifest.txt
git commit -m "books5-8: fetch generated art from manifest (80 images)"
git push origin claude/youtube-tv-research-fla0ts
```

**Watch:** https://github.com/wiggjamie9-afk/jamie-wigg/actions

**Typical wait:** 3-5 minutes (CI downloads 80 images in parallel).

### Step 2.5: Verify Images
```bash
# After CI completes:
ls book5/redesign/art-v2/page-*.png | wc -l  # Should show: 20
ls book6/redesign/art-v2/page-*.png | wc -l  # Should show: 20
ls book7/redesign/art-v2/page-*.png | wc -l  # Should show: 20
ls book8/redesign/art-v2/page-*.png | wc -l  # Should show: 20
# Total: 80
```

### Step 2.6: Assemble All 4 Books
```bash
python build_book_v2.py 5 6 7 8
```

**Output (8 files):**
- `book5/redesign/sunny-and-the-little-bilby-v2-illustrated.pdf` (~16 MB)
- `book5/redesign/sunny-and-the-little-bilby-v2-illustrated.epub` (~26 MB)
- (same for books 6, 7, 8)

### Step 2.7: Commit + Download
```bash
git add book{5,6,7,8}/redesign/*.pdf book{5,6,7,8}/redesign/*.epub
git commit -m "books5-8: add assembled PDFs and EPUBs"
git push origin claude/youtube-tv-research-fla0ts

# All 8 files now ready to download from Claude
```

---

## Phase 3: Complete Books 9-35 (540 Images)

**Status:** All 27 books have complete infrastructure (story JSON, 540 prompts, directories).

### Step 3.1: Fire All 540 Jobs

```bash
# Make sure credentials are set:
export HIGGSFIELD_API_KEY="sk-...your-key..."

# Fire all 540 jobs (27 books × 20 images each):
python fire-books-9-35-jobs.py

# Expected output:
# 🎨 Firing Higgsfield jobs for Books 9-35
#    Total jobs: 27 books × 20 pages = 540 images
# 📖 Book 9: Sunny and the Ringtail Possum
#   ✓ Job fired: [job-id] (Sunny and the Ringtail Possum — ...)
#   ... (20 jobs per book)
# 📖 Book 10: Sunny and the Tassie Devil
#   ... (20 more jobs)
# ... (continues through Book 35)
# ✓ Total jobs: 540
```

**Dry run (test first):**
```bash
python fire-books-9-35-jobs.py --dry-run
```

**Typical wait:** 60-180+ minutes (540 jobs is a significant queue load).

### Step 3.2: Monitor Jobs

```bash
# Go to https://higgsfield.ai/jobs
# Look for books 9-35 jobs
# Estimated completion: watch the dashboard
```

**Parallel: Prepare Other Work**

While waiting for jobs:
- Update marketing materials
- Plan distribution strategy
- Design landing pages
- Test delivery workflows

### Step 3.3: Get Image Download URLs

Once all 540 jobs complete:
```bash
# Create art-fetch-manifest.txt with all 540 URLs
# Same format: one line per image
# Books 9-35: 27 books × 20 images = 540 lines

cat > art-fetch-manifest.txt << 'EOF'
book9/redesign/art-v2/page-3.png	https://...
book9/redesign/art-v2/page-4.png	https://...
...
book35/redesign/art-v2/page-22.png	https://...
EOF
```

### Step 3.4: Trigger CI to Download All 540 Images
```bash
git add art-fetch-manifest.txt
git commit -m "books9-35: fetch generated art from manifest (540 images)"
git push origin claude/youtube-tv-research-fla0ts
```

**Watch:** https://github.com/wiggjamie9-afk/jamie-wigg/actions

**Typical wait:** 5-10 minutes (CI downloads 540 images).

**Note:** GitHub Actions may timeout on very large downloads. If so, split into smaller groups:
```bash
# Option A: Fire smaller batches (9-20, 21-28, 29-35)
# Option B: Use the provided split manifest files (TODO)
```

### Step 3.5: Verify All 540 Images
```bash
# After CI completes, verify all images:
for i in {9..35}; do
  count=$(ls book$i/redesign/art-v2/page-*.png 2>/dev/null | wc -l)
  echo "Book $i: $count images"
done

# Each book should show: 20 images
# Total: 27 books × 20 = 540 images
```

### Step 3.6: Assemble All 27 Books

```bash
# This will create 54 files (27 books × 2 formats):
python build_book_v2.py 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35

# Or in groups if your system has memory constraints:
python build_book_v2.py 9 10 11 12 13 14 15  # Books 9-15
python build_book_v2.py 16 17 18 19 20 21 22 23 24 25 26 27 28  # Books 16-28
python build_book_v2.py 29 30 31 32 33 34 35  # Books 29-35
```

**Output (54 files):**
- 27 PDFs (~16 MB each = ~432 MB total)
- 27 EPUBs (~26 MB each = ~702 MB total)

### Step 3.7: Commit + Download
```bash
# Stage all generated PDFs and EPUBs:
git add book{9..35}/redesign/*.pdf book{9..35}/redesign/*.epub

# Create meaningful commit message:
git commit -m "books9-35: add assembled PDFs and EPUBs (all 35 complete)"

# Push to remote:
git push origin claude/youtube-tv-research-fla0ts

# All 54 files now ready to download from Claude
```

---

## Final Verification Checklist

After completing all phases:

```bash
# Verify Book 3 (delivered earlier):
ls book3/redesign/*.pdf book3/redesign/*.epub

# Verify Book 4:
ls book4/redesign/*.pdf book4/redesign/*.epub

# Verify Books 5-8:
for i in {5..8}; do
  echo "Book $i:"; ls book$i/redesign/*.pdf book$i/redesign/*.epub
done

# Verify Books 9-35:
for i in {9..35}; do
  echo "Book $i:"; ls book$i/redesign/*.pdf book$i/redesign/*.epub
done
```

**Expected:** 35 books × 2 formats = 70 files total (35 PDFs + 35 EPUBs).

---

## Troubleshooting

### Problem: Higgsfield jobs not firing
**Solution:**
1. Check API key: `echo $HIGGSFIELD_API_KEY`
2. Check balance: https://higgsfield.ai/account/billing
3. Test with `--dry-run` first: `python fire-books-9-35-jobs.py --dry-run`

### Problem: CI workflow fails to download images
**Solution:**
1. Check manifest format: `cat art-fetch-manifest.txt | head -5`
   - Should be: `book{N}/redesign/art-v2/page-*.png[TAB]https://...` (tab-delimited)
2. Verify URLs are accessible: `curl -I https://...first-url...`
3. Check GitHub Actions logs: https://github.com/wiggjamie9-afk/jamie-wigg/actions

### Problem: PDF/EPUB assembly fails
**Solution:**
1. Check images exist: `ls book{N}/redesign/art-v2/page-*.png | wc -l` (should be 20)
2. Check fonts exist: `ls fonts/Gloock-Regular.ttf fonts/WorkSans-*.ttf`
3. Run with verbose output: `python build_book_v2.py 4 -v`

### Problem: GitHub Actions times out downloading 540 images
**Solution:**
1. Split manifest into smaller groups (e.g., 100 images each)
2. Run multiple push cycles:
   ```bash
   # First batch: books 9-16 (160 images)
   git add art-fetch-manifest-batch-1.txt
   git commit -m "books9-16: fetch art batch 1"
   git push origin claude/youtube-tv-research-fla0ts
   # (wait for CI, then next batch)
   ```

---

## Performance Notes

### Higgsfield Queue Times
- **Small batches (4-8 books, ~100 images):** 10-60 min
- **Large batches (27 books, 540 images):** 60-180+ min
- **Peak hours (7pm-11pm):** May add 50% to wait time
- **Off-peak (midnight-8am):** Fastest queue

### Build System Memory
- `build_book_v2.py` processes one book at a time (~200 MB RAM per book)
- Safe to run all 35 books in one command, or split if needed

### Network & CI
- CI image download: ~100 images/min on good connection
- 540 images = ~5-10 minutes for CI to complete
- GitHub Actions has a 6-hour timeout per job (plenty of headroom)

---

## Summary

| Phase | Books | Images | Time Active | Time Waiting | Total |
|---|---|---|---|---|---|
| **1. Book 4** | 1 | 23 | 5 min | 30 min | 35 min |
| **2. Books 5-8** | 4 | 80 | 7 min | 90 min | 97 min |
| **3. Books 9-35** | 27 | 540 | 10 min | 180 min | 190 min |
| **TOTAL** | **32** | **643** | **22 min** | **300 min** | **322 min** |

**Total Time:** ~5.5 hours (mostly waiting for Higgsfield).  
**Active Work:** ~22 minutes of actual typing/clicking.

---

**Next Step:** When ready, run Phase 2 by executing `python fire-books-5-8-jobs.py` after setting your Higgsfield API key.

**Questions?** Refer to `BOOKS-CURRENT-STATUS.md` for current state, or `BOOKS-REDESIGN-WORKFLOW.md` for detailed workflow explanation.
