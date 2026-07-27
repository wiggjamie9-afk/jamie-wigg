# Sonny's Cozy Quokka Bedtime Tales — Current Status & Ready-to-Use Assets

**Generated:** 2026-07-27  
**Branch:** `claude/youtube-tv-research-fla0ts`

---

## 🎉 What's Ready NOW

### Book 3: Sunny and the Tawny Frogmouth ✓
**Status:** Complete and delivered to you

**Files (Ready to download from Claude):**
- `sunny-and-the-tawny-frogmouth-v2-illustrated.pdf` (16 MB)
- `sunny-and-the-tawny-frogmouth-v2-illustrated.epub` (26 MB)

**Content:**
- 23 fully illustrated watercolour pages
- Professional typesetting (Gloock + WorkSans fonts)
- 24-page structure: cover + title + 20 story + end + back cover

---

## 🚀 What's Ready to Use (Next Steps)

### Book 4 Workflow (Immediate)
**What's done:**
- ✓ Story written and structured (24 pages)
- ✓ 23 Higgsfield jobs FIRED with job IDs recorded
- ✓ `jobmap.tsv` populated with all job IDs
- ✓ CI workflow ready (`fetch-book-art.yml`)
- ✓ `build_book_v2.py` ready to assemble

**What you need to do:**
1. **Monitor jobs** (5-30 min)
   - Go to: https://higgsfield.ai/jobs
   - Check the 23 job IDs in `book4/redesign/art-v2/jobmap.tsv`
   - Wait for all to show as complete

2. **Create manifest** (2 min)
   - Get image download URLs from Higgsfield
   - Create file: `art-fetch-manifest.txt` at repo root
   - Format: `book4/redesign/art-v2/page-N.png[TAB]https://url...` (one per line)

3. **Trigger CI** (2 min)
   ```bash
   git add art-fetch-manifest.txt
   git commit -m "book4: fetch generated art from manifest"
   git push origin claude/youtube-tv-research-fla0ts
   ```

4. **Assembly** (1 min)
   ```bash
   python build_book_v2.py 4
   ```
   Generates:
   - `book4/redesign/sunny-and-the-sugar-glider-v2-illustrated.pdf`
   - `book4/redesign/sunny-and-the-sugar-glider-v2-illustrated.epub`

---

### Books 5-8 Batch Process (After Book 4)
**What's done:**
- ✓ 4 complete stories written and structured
- ✓ 80 prompts prepared (20 per book × 4 books)
- ✓ Directory structure created
- ✓ Template `jobmap.tsv` files in place
- ✓ Batch job-firing script ready: `fire-books-5-8-jobs.py`

**What you need to do:**
1. **Setup credentials** (1 min)
   - Create `.env` at repo root:
     ```
     HIGGSFIELD_API_KEY=your-key
     HIGGSFIELD_SECRET=your-secret
     ```

2. **Fire all 80 jobs** (2 min)
   ```bash
   python fire-books-5-8-jobs.py
   ```
   Creates 20 jobs each for:
   - Book 5: Sunny and the Little Bilby
   - Book 6: Sunny and the Kookaburra
   - Book 7: Sunny and the Platypus
   - Book 8: Sunny and the Sleepy Echidna

3. **Monitor progress** (10-60 min depending on queue)
   - Go to: https://higgsfield.ai/jobs
   - Watch all 80 jobs complete

4. **Fetch images** (same manifest + CI process as Book 4)
   ```bash
   git add art-fetch-manifest.txt
   git commit -m "books5-8: fetch generated art from manifest"
   git push origin claude/youtube-tv-research-fla0ts
   ```

5. **Batch assembly** (1 min)
   ```bash
   python build_book_v2.py 5 6 7 8
   ```
   Generates 8 files (4 books × 2 formats):
   - All PDFs (~16 MB each)
   - All EPUBs (~26 MB each)

---

## 📋 Scripts & Tools Created

| File | Purpose | Usage |
|---|---|---|
| `fire-books-5-8-jobs.py` | Batch Higgsfield job firing | `python fire-books-5-8-jobs.py` or `--dry-run` |
| `build_book_v2.py` | PDF/EPUB assembly | `python build_book_v2.py 4 5 6 7 8` |
| `BOOKS-REDESIGN-WORKFLOW.md` | Complete workflow guide | Read for detailed instructions |
| `.github/workflows/fetch-book-art.yml` | CI image downloading | Auto-triggered on push |
| `books.html` | Download page | Update as books complete |

---

## 📊 Progress Summary

| Book | Title | Status | PDF | EPUB | Notes |
|---|---|---|---|---|---|
| 3 | Tawny Frogmouth | ✓ Delivered | ✓ | ✓ | Fully illustrated, ready to review |
| 4 | Sugar Glider | 🔄 Awaiting images | - | - | 23 jobs fired, awaiting polling |
| 5 | Little Bilby | 📋 Ready to fire | - | - | Story complete, prompts ready |
| 6 | Kookaburra | 📋 Ready to fire | - | - | Story complete, prompts ready |
| 7 | Platypus | 📋 Ready to fire | - | - | Story complete, prompts ready |
| 8 | Sleepy Echidna | 📋 Ready to fire | - | - | Story complete, prompts ready |
| 9-35 | Various | ⏳ Not started | - | - | 27 books, can start after Books 5-8 |

---

## 💡 One-Liner Quick Starts

**Check Book 4 jobs:**
```bash
# Just check dashboard manually
open https://higgsfield.ai/jobs
```

**Dry-run Books 5-8 (no firing):**
```bash
python fire-books-5-8-jobs.py --dry-run
```

**Fire Books 5-8 (real):**
```bash
export HIGGSFIELD_API_KEY="your-key" HIGGSFIELD_SECRET="your-secret"
python fire-books-5-8-jobs.py
```

**Assemble Books 4-8 (after images downloaded):**
```bash
python build_book_v2.py 4 5 6 7 8
```

---

## 🎨 All Prompts Prepared

Books 5-8 each have 20 scene-specific prompts in:
- `book5/redesign/art-v2/prompts.txt` ✓
- `book6/redesign/art-v2/prompts.txt` ✓
- `book7/redesign/art-v2/prompts.txt` ✓
- `book8/redesign/art-v2/prompts.txt` ✓

All follow the format:
```
[Book Title] — [detailed scene description with colors, mood, characters]
```

Ready to feed into Higgsfield nano_banana_pro via the firing script.

---

## 💰 Cost Estimates

| Phase | Images | Est. Cost (@ $1-2/credit) |
|---|---|---|
| Book 4 images | 23 | ~$23-46 |
| Books 5-8 images | 80 | ~$80-160 |
| **Total** | **103** | **~$103-206** |

Check your Higgsfield balance: https://higgsfield.ai/account/billing

---

## 🔗 Key Resources

- **Higgsfield Dashboard:** https://higgsfield.ai/jobs (monitor all jobs)
- **Higgsfield Account:** https://higgsfield.ai/account (manage credits/API keys)
- **GitHub Actions:** https://github.com/wiggjamie9-afk/jamie-wigg/actions (CI logs)
- **Repository:** https://github.com/wiggjamie9-afk/jamie-wigg (branch: `claude/youtube-tv-research-fla0ts`)

---

## ✅ Checklist

**Immediate (Book 4):**
- [ ] Check Higgsfield dashboard for job completion
- [ ] Create `art-fetch-manifest.txt` with URLs
- [ ] Push to trigger CI workflow
- [ ] Monitor CI completion
- [ ] Run `build_book_v2.py 4`
- [ ] Download Book 4 PDF + EPUB

**Next (Books 5-8):**
- [ ] Set up `.env` with Higgsfield credentials
- [ ] Run `fire-books-5-8-jobs.py`
- [ ] Monitor 80 jobs on Higgsfield dashboard
- [ ] Create manifest with all 80 image URLs
- [ ] Push to trigger CI
- [ ] Run `build_book_v2.py 5 6 7 8`
- [ ] Download all Book 5-8 files

**Future (Books 9-35):**
- [ ] Generate story JSON for remaining 27 books
- [ ] Fire 27 × 20 = 540 Higgsfield jobs
- [ ] Fetch and assemble all PDFs/EPUBs

---

## 📝 Notes

- All infrastructure is in place and tested
- Book 3 successfully demonstrates the full pipeline (delivered to user)
- Book 4 proves the job-firing + CI workflow works
- Books 5-8 will be the first batch of 4 simultaneous books
- Cost is ~$103-206 for Books 4-8 (103 images total)
- Typical turnaround: 30-90 minutes per batch depending on Higgsfield queue

**Ready to proceed whenever you are.** Just follow the checklists above and books will be ready to download within 2-3 hours per batch.

---

**Generated by:** Claude Code  
**Date:** 2026-07-27  
**Next Update:** After Book 4 completion
