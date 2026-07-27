# Higgsfield Art Generation Job Firing Guide
## Books 5-8 — Sonny's Cozy Quokka Bedtime Tales

**Status:** Prepared — awaiting authenticated Higgsfield session or direct API firing

---

## Overview

This guide sets up art generation for **23 images per book × 4 books = 92 total images** across Books 5-8.

| Book | Title | Pages | Output Directory |
|------|-------|-------|------------------|
| 5 | Sunny and the Little Bilby | 3-22 (20 images) | `book5/redesign/art-v2/` |
| 6 | Sunny and the Kookaburra | 3-22 (20 images) | `book6/redesign/art-v2/` |
| 7 | Sunny and the Platypus | 3-22 (20 images) | `book7/redesign/art-v2/` |
| 8 | Sunny and the Sleepy Echidna | 3-22 (20 images) | `book8/redesign/art-v2/` |

**Total: 80 images** (20 pages × 4 books)

---

## Job Firing Parameters

### Model & Settings

- **Model:** `nano_banana_pro` (Higgsfield)
- **Master Reference Image:** `1c0efac7-41bf-44cb-b4d9-5dac7e6a326e` (Sunny the quokka style lock)
- **Style:** Watercolour illustration, soft colours, Australian animals, cosy nighttime scenes
- **Prompt Format:** `[Book Title] — [scene description]`

### Example Prompt

```
Sunny and the Little Bilby — Sunny the little quokka sits in the soft blue evening on a patch of warm honey-gold sand, surrounded by low desert scrub and a few tall gum trees. The sky is deep plum-navy, the first stars just waking, and a gentle golden glow washes over her round fuzzy cheeks.
```

---

## Files Prepared

### Prompt Files (One Per Book)

Each book has a `prompts.txt` with all 20 scene prompts, one per line:

- `book5/redesign/art-v2/prompts.txt` (20 prompts)
- `book6/redesign/art-v2/prompts.txt` (20 prompts)
- `book7/redesign/art-v2/prompts.txt` (20 prompts)
- `book8/redesign/art-v2/prompts.txt` (20 prompts)

### Job Firing Script

**`fire-higgsfield-jobs.py`** — Python script that:

1. Loads each book's JSON
2. Extracts scene descriptions
3. Fires Higgsfield jobs
4. Records job IDs in `jobmap.tsv`

**Usage:**

```bash
# Dry run (test without firing)
python fire-higgsfield-jobs.py --dry-run

# Live firing (requires authenticated Higgsfield session)
python fire-higgsfield-jobs.py
```

---

## How to Fire Jobs

### Option 1: Interactive Claude Code Session (Recommended)

1. Open Claude Code in an **interactive** terminal session
2. Ensure Higgsfield MCP is authenticated:
   ```bash
   # In Claude Code interactive session
   /mcp list    # should show higgsfield enabled
   ```
3. Use Claude to call Higgsfield MCP directly:
   ```
   Fire all Higgsfield jobs for Books 5-8 using the prompts in book{5-8}/redesign/art-v2/prompts.txt
   Model: nano_banana_pro
   Reference image: 1c0efac7-41bf-44cb-b4d9-5dac7e6a326e
   Record job IDs in jobmap.tsv files.
   ```

### Option 2: Direct API Calls

Use `curl` with your `HIGGSFIELD_API_KEY`:

```bash
# Set your API key
export HIGGSFIELD_API_KEY="sk-..."

# Fire a single job
curl -X POST "https://api.higgsfield.ai/v1/jobs/generate" \
  -H "Authorization: Bearer $HIGGSFIELD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nano_banana_pro",
    "prompt": "Sunny and the Little Bilby — [scene text]",
    "reference_image": "1c0efac7-41bf-44cb-b4d9-5dac7e6a326e",
    "style": "watercolour illustration, soft colours, Australian animals, cosy nighttime scenes"
  }'
```

The response contains `job_id` — save this to `jobmap.tsv`.

### Option 3: Higgsfield Web UI

1. Go to https://higgsfield.ai/studio
2. Authenticate with your account
3. For each prompt:
   - Paste prompt text into Higgsfield prompt field
   - Select model: `nano_banana_pro`
   - Add reference image: `1c0efac7-41bf-44cb-b4d9-5dac7e6a326e`
   - Click "Generate"
   - Copy job ID from response
   - Paste into the relevant `jobmap.tsv`

---

## jobmap.tsv Format

Each `art-v2/jobmap.tsv` is **tab-delimited** with columns:

```
page_num	job_id
3	job-1234567890abcdef
4	job-fedcba0987654321
...
22	job-9876543210fedcba
```

**Example:** `book5/redesign/art-v2/jobmap.tsv`

```tsv
page_num	job_id
3	job-123abc
4	job-456def
5	job-789ghi
6	job-012jkl
...
```

---

## Estimated Credit Usage

- **Cost per image:** ~1 credit (Higgsfield nano_banana_pro tier)
- **Total images:** 80
- **Estimated credit cost:** ~80 credits

Check your Higgsfield account for current credit balance and pricing.

---

## Workflow After Job Firing

1. **Fire all jobs** (this guide) → record job IDs in jobmap.tsv files
2. **Monitor jobs** at https://higgsfield.ai/jobs
3. **Download results** as they complete (or bulk-download when all are done)
4. **Organize into** `art-v2/<page_n>.png` or similar structure
5. **Integrate into book production** pipeline

---

## Reference Info

- **CLAUDE.md location:** `/home/user/jamie-wigg/CLAUDE.md`
- **Kids Channel Master Reference:** `/home/user/jamie-wigg/kids-channel/MASTER.md`
- **Book JSON files:** `/home/user/jamie-wigg/book{5-8}/redesign/book{5-8}-v2-extended.json`
- **Higgsfield MCP setup:** See `.env` for `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET`

---

## Next Steps

1. ✅ Directories created: `book{5-8}/redesign/art-v2/`
2. ✅ Prompt files generated: `prompts.txt` in each art-v2 directory
3. ✅ Job firing script prepared: `fire-higgsfield-jobs.py`
4. **TODO:** Execute job firing in an authenticated session
5. **TODO:** Monitor job completion
6. **TODO:** Download and organize generated images

---

**Last updated:** 2026-07-27
**Status:** Ready for job firing
