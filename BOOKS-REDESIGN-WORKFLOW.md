# Sonny's Cozy Quokka Bedtime Tales — Book Redesign Workflow

**Status:** Books 3-4 in progress, Books 5-8 infrastructure ready, Books 9-35 not yet started.

## Current Progress

### ✓ Book 3: Sunny and the Tawny Frogmouth
- **Status:** Complete and delivered
- **Files:** 
  - PDF: `book3/redesign/sunny-and-the-tawny-frogmouth-v2-illustrated.pdf` (16 MB)
  - EPUB: `book3/redesign/sunny-and-the-tawny-frogmouth-v2-illustrated.epub` (26 MB)
- **What's included:**
  - 23 fully illustrated pages (watercolour, Higgsfield nano_banana_pro)
  - Cover art + title page + 20 story pages + "The End" page + back cover
  - Typeset with Gloock (titles) and WorkSans (body)

### 🔄 Book 4: Sunny and the Sugar Glider
- **Status:** Art jobs fired, awaiting image downloads
- **Art jobs:** 23 job IDs recorded in `book4/redesign/art-v2/jobmap.tsv`
- **Next steps:**
  1. Check Higgsfield dashboard for job completion: https://higgsfield.ai/jobs
  2. Once complete, create `art-fetch-manifest.txt` with image URLs (see Section 2)
  3. Push manifest to trigger GitHub CI download
  4. Run `python build_book_v2.py 4` to assemble PDF/EPUB

### 📋 Books 5-8: Ready for Art Generation
- **Status:** Stories written, prompts prepared, infrastructure ready
- Book 5: Sunny and the Little Bilby
- Book 6: Sunny and the Kookaburra
- Book 7: Sunny and the Platypus
- Book 8: Sunny and the Sleepy Echidna

**What's prepared:**
- `book{5-8}/redesign/book{5-8}-v2-extended.json` — 24-page story structure
- `book{5-8}/redesign/art-v2/prompts.txt` — 20 prompts per book (pages 3-22)
- `book{5-8}/redesign/art-v2/jobmap.tsv` — empty template, ready to fill

---

## Workflow: Book 4 (Immediate Next Step)

### 1. Check Job Status
Go to https://higgsfield.ai/jobs and check the 23 job IDs in `book4/redesign/art-v2/jobmap.tsv`.

Typical timeline: 5-30 minutes per job depending on queue.

### 2. Download Images
Once jobs complete, you'll have image URLs from Higgsfield (or via their download endpoint).

Create `art-fetch-manifest.txt` in the repo root:
```
book4/redesign/art-v2/page-3.png	https://cdn.higgsfield.ai/job-<id1>/image.png
book4/redesign/art-v2/page-4.png	https://cdn.higgsfield.ai/job-<id2>/image.png
...
book4/redesign/art-v2/page-22.png	https://cdn.higgsfield.ai/job-<id23>/image.png
```

Format: `<target-path><TAB><url>`

### 3. Trigger CI Workflow
Push `art-fetch-manifest.txt` to the `claude/youtube-tv-research-fla0ts` branch:
```bash
git add art-fetch-manifest.txt
git commit -m "book4: fetch generated art from manifest"
git push origin claude/youtube-tv-research-fla0ts
```

The `.github/workflows/fetch-book-art.yml` workflow will:
1. Download all images via `curl`
2. Save to `book{N}/redesign/art-v2/page-*.png`
3. Commit to the branch automatically

**Monitor:** Watch https://github.com/wiggjamie9-afk/jamie-wigg/actions

### 4. Assemble PDF and EPUB
Once CI completes (2-5 minutes):
```bash
python build_book_v2.py 4
```

This generates:
- `book4/redesign/sunny-and-the-sugar-glider-v2-illustrated.pdf` (~16 MB)
- `book4/redesign/sunny-and-the-sugar-glider-v2-illustrated.epub` (~26 MB)

### 5. Deliver to User
Files will be ready to download via Claude.

---

## Workflow: Books 5-8 (Batch Generation)

### Step 1: Set Up Higgsfield Credentials
Create `.env` in repo root (gitignored):
```
HIGGSFIELD_API_KEY=your-api-key-here
HIGGSFIELD_SECRET=your-secret-here
```

Get credentials from https://higgsfield.ai/account/api-keys.

### Step 2: Fire All 80 Jobs
```bash
python fire-books-5-8-jobs.py
```

This script:
- Reads prompts from `book{5-8}/redesign/art-v2/prompts.txt`
- Fires 20 jobs per book via Higgsfield API
- Records job IDs in `book{5-8}/redesign/art-v2/jobmap.tsv`
- Estimates ~80 credits on Higgsfield (check your balance)

**Test run (no firing):**
```bash
python fire-books-5-8-jobs.py --dry-run
```

### Step 3: Monitor Job Progress
Go to https://higgsfield.ai/jobs and wait. Typical timeline: 10-60 minutes depending on queue.

### Step 4: Create Manifest and Fetch
Once all 80 jobs complete:

1. Get image URLs from Higgsfield (download endpoint or copy from job UI)
2. Create `art-fetch-manifest.txt` with all 80 URLs:
   ```
   book5/redesign/art-v2/page-3.png	https://...
   book5/redesign/art-v2/page-4.png	https://...
   ...
   book8/redesign/art-v2/page-22.png	https://...
   ```
3. Push to trigger CI:
   ```bash
   git add art-fetch-manifest.txt
   git commit -m "books5-8: fetch generated art from manifest"
   git push origin claude/youtube-tv-research-fla0ts
   ```

### Step 5: Assemble All Books
Once CI completes:
```bash
python build_book_v2.py 5 6 7 8
```

Generates 8 files total (~64 MB):
- `book5/redesign/sunny-and-the-little-bilby-v2-illustrated.{pdf,epub}`
- `book6/redesign/sunny-and-the-kookaburra-v2-illustrated.{pdf,epub}`
- `book7/redesign/sunny-and-the-platypus-v2-illustrated.{pdf,epub}`
- `book8/redesign/sunny-and-the-sleepy-echidna-v2-illustrated.{pdf,epub}`

### Step 6: Deliver Books
All books will be packaged and delivered to user.

---

## Key Files Reference

| File | Purpose |
|---|---|
| `fire-books-5-8-jobs.py` | Batch job firing script (requires Higgsfield API key) |
| `build_book_v2.py` | PDF/EPUB assembler (reads JSON + images, generates output) |
| `book{N}/redesign/book{N}-v2-extended.json` | 24-page story structure with narrative text |
| `book{N}/redesign/art-v2/prompts.txt` | 20 scene prompts for Higgsfield (one per line) |
| `book{N}/redesign/art-v2/jobmap.tsv` | Maps page numbers to Higgsfield job IDs |
| `.github/workflows/fetch-book-art.yml` | CI workflow: reads manifest, downloads images, commits |
| `art-fetch-manifest.txt` | Index file: target paths + download URLs (one per line) |

---

## Style Lock

All images use:
- **Model:** `nano_banana_pro` (Higgsfield)
- **Master reference:** `1c0efac7-41bf-44cb-b4d9-5dac7e6a326e` (Sunny quokka)
- **Style:** Watercolour illustration, soft colours, Australian animals, cosy nighttime scenes
- **Resolution:** 2048×3072 (2:3 portrait)
- **Prompt format:** `[Book Title] — [scene description]`

Example:
```
Sunny and the Little Bilby — Sunny the little quokka sits in the soft blue evening on a patch of warm honey-gold sand, surrounded by low desert scrub and a few tall gum trees. The sky is deep plum-navy, the first stars just waking, and a gentle golden glow washes over her round fuzzy cheeks.
```

---

## Estimated Costs

- **Book 4:** 23 images × ~1 credit = ~23 credits
- **Books 5-8:** 80 images × ~1 credit = ~80 credits
- **Total:** ~103 credits (check Higgsfield pricing; typically $1-2/credit)

---

## Troubleshooting

### Jobs not visible in Higgsfield dashboard
- Wait 30-60 seconds after firing; dashboard updates slowly
- Check terminal output for job IDs to confirm they were created

### CI workflow fails to fetch images
- Check `art-fetch-manifest.txt` format: must be `<path><TAB><url>` (tab-delimited, not spaces)
- Verify URLs are accessible (not expired, correct format)
- Check GitHub Actions logs: https://github.com/wiggjamie9-afk/jamie-wigg/actions

### PDF/EPUB assembly fails
- Verify all images are present: `ls book{N}/redesign/art-v2/page-*.png | wc -l` should show 20
- Check font files exist: `ls fonts/Gloock-Regular.ttf fonts/WorkSans-*.ttf`
- Run with verbose output: `python build_book_v2.py 4 -v`

### Higgsfield API auth errors
- Confirm `.env` has correct API key and secret
- Check credits balance: https://higgsfield.ai/account/billing
- Test with `--dry-run` first to validate setup

---

## Git Branch

All work lives on `claude/youtube-tv-research-fla0ts`:
```bash
git checkout claude/youtube-tv-research-fla0ts
git pull origin claude/youtube-tv-research-fla0ts
```

---

## Downloads Page

Preview page: `books.html` (at repo root)

Shows Book 3 available for download, Books 4-5 "Coming Soon".

Update with new books as they're completed:
```javascript
// In books.html <script>
const books = [
  { number: 3, title: "...", status: "available", pdf: {...}, epub: {...} },
  { number: 4, title: "...", status: "available", pdf: {...}, epub: {...} },
  ...
]
```

---

**Last Updated:** 2026-07-27  
**Current Phase:** Book 4 awaiting image downloads → Book 5-8 ready to fire  
**Next:** Follow Book 4 workflow steps above, then Books 5-8
