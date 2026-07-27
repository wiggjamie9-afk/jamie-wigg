# Sonny's Cozy Quokka Bedtime Tales — Quick Reference Card

## 🎯 What's Done

✅ **Book 3** — Fully illustrated PDF + EPUB delivered  
✅ **Book 4** — 23 Higgsfield jobs fired, ready for image download  
✅ **Books 5-8** — Stories + 80 prompts prepared  
✅ **Books 9-35** — Complete infrastructure (27 books, 540 prompts)

---

## ⚡ The Three Commands You Need

### 1️⃣ Fire Books 5-8 Jobs (80 images)
```bash
export HIGGSFIELD_API_KEY="your-key"
python fire-books-5-8-jobs.py
# Wait 10-60 min for jobs to complete
```

### 2️⃣ Fire Books 9-35 Jobs (540 images)
```bash
export HIGGSFIELD_API_KEY="your-key"
python fire-books-9-35-jobs.py
# Wait 60-180 min for jobs to complete
```

### 3️⃣ Download & Assemble Everything
```bash
# After all images are ready (create manifest from Higgsfield URLs):
git add art-fetch-manifest.txt
git commit -m "books4-35: fetch all generated art from manifest"
git push origin claude/youtube-tv-research-fla0ts

# Wait for CI to download all images (~5-10 min)
# Then assemble all books at once:
python build_book_v2.py 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35
```

---

## 📊 By The Numbers

| Metric | Value |
|--------|-------|
| Total books | 35 |
| Total illustrations | 666 images |
| Total pages | 1,440 pages (24 per book) |
| Story JSON files | 33 complete |
| Prompts generated | 663 scene-specific |
| Job batches remaining | 2 (Books 5-8, Books 9-35) |
| Estimated cost | ~$666 total (~$20 per book) |
| Estimated time | 5-6 hours (mostly queue wait) |
| Actual work time | ~30 minutes |

---

## 🔗 Key Dashboards

- **Higgsfield Jobs:** https://higgsfield.ai/jobs
- **GitHub Actions (CI):** https://github.com/wiggjamie9-afk/jamie-wigg/actions
- **Higgsfield Balance:** https://higgsfield.ai/account/billing

---

## 📁 Key Files

```
# Configuration
.env                          ← Your Higgsfield credentials

# Job Firing Scripts
fire-books-5-8-jobs.py       ← Fire 80 jobs for Books 5-8
fire-books-9-35-jobs.py      ← Fire 540 jobs for Books 9-35

# Assembly
build_book_v2.py             ← Creates PDF + EPUB files

# Documentation
BOOKS-EXECUTION-GUIDE.md     ← Full step-by-step walkthrough
BOOKS-CURRENT-STATUS.md      ← Complete progress table (3-35)
BOOKS-REDESIGN-WORKFLOW.md   ← Detailed technical workflow

# For Each Book
book{N}/redesign/book{N}-v2-extended.json          ← Story structure
book{N}/redesign/art-v2/prompts.txt                ← 20 image prompts
book{N}/redesign/art-v2/jobmap.tsv                 ← Job ID tracker (after firing)
book{N}/redesign/art-v2/page-*.png                 ← Generated images (after CI)
book{N}/redesign/sunny-and-the-*-v2-illustrated.{pdf,epub}  ← Final output
```

---

## 📋 3-Step Workflow Summary

### Step 1: Setup (2 min)
```bash
# Set your Higgsfield API key
echo "HIGGSFIELD_API_KEY=sk-..." >> .env
```

### Step 2: Fire Jobs (5 min + wait)
```bash
# Books 5-8 (80 images)
python fire-books-5-8-jobs.py              # ~30 sec, then wait ~10-60 min

# Books 9-35 (540 images)
python fire-books-9-35-jobs.py             # ~2 min, then wait ~60-180 min
```

### Step 3: Download & Assemble (10 min + wait)
```bash
# Create manifest from Higgsfield download URLs
# Then push to trigger CI download + commit images

git add art-fetch-manifest.txt
git commit -m "books4-35: fetch all generated art"
git push origin claude/youtube-tv-research-fla0ts    # CI runs ~5-10 min

# Then assemble all books at once
python build_book_v2.py 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35
```

**Done!** All 35 books ready to download as PDF + EPUB.

---

## ⏱️ Timeline

| Time | Action | Wait |
|------|--------|------|
| T+0 | Fire Books 5-8 (80 jobs) | 30 sec |
| T+1 | Monitor at https://higgsfield.ai/jobs | 10-60 min |
| T+70 | Fire Books 9-35 (540 jobs) | 2 min |
| T+72 | Monitor both batches | 60-180 min |
| T+252 | Get download URLs, create manifest | 1 min |
| T+253 | Push to trigger CI image download | 5-10 min |
| T+263 | Assemble all books (`build_book_v2.py`) | 5 min |
| **T+268** | **✅ COMPLETE** | |

**Total:** ~4.5 hours (333 minutes)  
**Actual typing:** ~30 minutes  
**Waiting:** ~300 minutes (mostly Higgsfield queue)

---

## 🚨 Common Checks

### Before firing jobs:
```bash
# Verify API key is set
echo $HIGGSFIELD_API_KEY

# Check Higgsfield balance
# Go to: https://higgsfield.ai/account/billing
# Should have: ~$50+ for the batch
```

### After firing jobs:
```bash
# See job IDs that were created
cat book5/redesign/art-v2/jobmap.tsv
cat book9/redesign/art-v2/jobmap.tsv

# Watch jobs complete at:
# https://higgsfield.ai/jobs
```

### After images download (CI):
```bash
# Verify all images downloaded successfully
for i in {5..8}; do
  count=$(ls book$i/redesign/art-v2/page-*.png 2>/dev/null | wc -l)
  [ "$count" = "20" ] && echo "✓ Book $i: OK" || echo "✗ Book $i: MISSING"
done

for i in {9..35}; do
  count=$(ls book$i/redesign/art-v2/page-*.png 2>/dev/null | wc -l)
  [ "$count" = "20" ] && echo "✓ Book $i: OK" || echo "✗ Book $i: MISSING"
done
```

---

## 💡 Pro Tips

1. **Dry run first:** Test with `--dry-run` before firing real jobs
   ```bash
   python fire-books-9-35-jobs.py --dry-run
   ```

2. **Stagger phases:** Fire Books 5-8 while Book 4 is in progress, then Books 9-35 while 5-8 are rendering

3. **Split manifest:** If CI times out on 540 images, create separate manifests:
   - Batch 1: Books 9-16 (160 images)
   - Batch 2: Books 17-26 (200 images)
   - Batch 3: Books 27-35 (180 images)

4. **Monitor queue:** If Higgsfield queue is slow, you can still do other work while waiting

5. **Commit outputs:** After each phase, commit PDFs/EPUBs so you have a backup in git

---

## 🎯 Success Criteria

✅ **All done when:**
- 35 books exist with both PDF and EPUB versions
- All PDFs are ~16-20 MB with 24 fully illustrated pages each
- All EPUBs are ~26-30 MB with proper formatting
- All books display in order: cover → title → 20 story pages → end → back cover

**Expected output:** 70 files (35 PDFs + 35 EPUBs) ready for distribution

---

## 📞 Support

If something goes wrong, refer to:
- **Full walkthrough:** `BOOKS-EXECUTION-GUIDE.md` (step-by-step)
- **Progress tracking:** `BOOKS-CURRENT-STATUS.md` (complete table)
- **Technical details:** `BOOKS-REDESIGN-WORKFLOW.md` (workflow explanation)

All resources are in the repo root.
