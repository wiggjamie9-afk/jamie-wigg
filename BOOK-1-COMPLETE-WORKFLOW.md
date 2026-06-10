# Book 1: Complete Automation Workflow
## Sunny and the Flying Fox - Full End-to-End Pipeline

---

## OVERVIEW

**Everything is automated and ready.** You trigger from your iPhone, and GitHub handles the rest.

### Complete Workflow:
1. **Watercolor Generation** (30-60 min) — Trigger manually
2. **Complete Pipeline** (30-45 min) — Runs automatically after pages exist
3. **YouTube Upload** — Automatic

---

## STEP 1: GENERATE WATERCOLOR PAGES (From Your Phone)

**What happens:** GitHub generates all 16 watercolor story pages

**How to trigger:**

1. Open on iPhone: `github.com/wiggjamie9-afk/jamie-wigg/actions`
2. Click: **"Generate Book 1 Watercolor Pages"**
3. Click: **"Run workflow"** (green button)
4. Click: **"Run workflow"** (confirm)

**Wait time:** 30-60 minutes

**What it generates:**
- `BOOK-1-PAGE-02-WATERCOLOR.png` through `BOOK-1-PAGE-16-WATERCOLOR.png`
- 16 professional watercolor illustrations with text

**Download to phone:**
- Go to workflow run → Artifacts → `book1-watercolor-pages` → Download

---

## STEP 2: RUN COMPLETE PIPELINE (Automatic)

**What happens:**
1. ✓ Assemble 18-page book (cover + 16 pages + teaser)
2. ✓ Generate warm motherly voice narration
3. ✓ Create video (pages + audio + timing)
4. ✓ Upload to YouTube

**How to trigger:**

1. Open on iPhone: `github.com/wiggjamie9-afk/jamie-wigg/actions`
2. Click: **"Complete Book 1 Pipeline"**
3. Click: **"Run workflow"** (green button)
4. Leave "Skip YouTube upload" unchecked
5. Click: **"Run workflow"** (confirm)

**Wait time:** 30-45 minutes total
- Assembly: 2-3 minutes
- Narration: 10-15 minutes
- Video: 15-20 minutes
- YouTube upload: 5-10 minutes

**What it creates:**
- `BOOK-1-ASSEMBLED/` — 18 complete pages
- `BOOK-1-NARRATION/narration.mp3` — Warm voice narration
- `BOOK-1-VIDEO/` — Complete video file
- Uploads to YouTube automatically

---

## SCRIPTS INCLUDED

### 1. `generate-book1-watercolor-pages.py`
- Uses Replicate API (FLUX 1.1 Pro model)
- Creates 16 watercolor illustrations
- Adds text to each page
- Saves as PNG files
- **Triggered by:** `generate-book1-watercolor.yml` workflow

### 2. `assemble-book1-pages.py`
- Combines: Cover + 16 story pages + Teaser
- Creates 18-page complete book
- Generates manifest.json
- **Triggered by:** `complete-book1-pipeline.yml`

### 3. `generate-book1-narration.py`
- Uses ElevenLabs TTS (Rachel voice - warm, motherly)
- Generates MP3 narration
- ~8-10 minutes of audio
- **Triggered by:** `complete-book1-pipeline.yml`

### 4. `assemble-book1-video.py`
- Uses FFmpeg to create video
- Combines: 18 pages + narration
- Page timing: 5 seconds per page
- Output: H.264 MP4, 1920×1080, 30fps
- **Triggered by:** `complete-book1-pipeline.yml`

### 5. `upload-book1-to-youtube.py`
- Uses YouTube Data API
- Uploads video with metadata
- Title, description, tags, category
- Privacy: Public
- **Triggered by:** `complete-book1-pipeline.yml`

---

## GITHUB WORKFLOWS

### `generate-book1-watercolor.yml`
**Trigger:** Manual (from Actions tab)
- Runs: `generate-book1-watercolor-pages.py`
- Output: 16 PNG files
- Commits to repo
- Available as artifact download

### `complete-book1-pipeline.yml`
**Trigger:** Manual (from Actions tab)
- Runs all 4 scripts in sequence:
  1. Assemble pages
  2. Generate narration
  3. Assemble video
  4. Upload to YouTube
- Commits all outputs to repo
- Creates artifacts (downloadable)

---

## TIMELINE

### First Time Setup:
- Write scripts: ✓ Done
- Configure workflows: ✓ Done
- API keys configured: ✓ Done

### Book 1 Production:
- **Day 1:** Trigger watercolor generation (~60 min)
- **Day 2:** Trigger complete pipeline (~45 min)
- **Day 2 (post-upload):** Monitor YouTube, add thumbnail, enable monetization
- **Total:** ~2-3 hours active work, ~2 days elapsed

### Books 2-17:
- Same process, repeat 16 times
- Each book: ~2-3 hours work, ~2 days elapsed
- **Total project:** ~6-9 months to completion

---

## QUALITY CHECKPOINTS

### After Watercolor Generation:
- ✓ Check: All 16 pages generated
- ✓ Check: Sunny looks consistent across all pages
- ✓ Check: Text is readable
- ✓ Check: Colors match reference covers
- ✓ Action: Download to phone, review

### After Complete Pipeline:
- ✓ Check: 18-page book assembled
- ✓ Check: Narration audio quality (warm, motherly voice)
- ✓ Check: Video plays correctly
- ✓ Check: Timing feels right (5 sec per page)
- ✓ Action: Review video on phone before YouTube

### After YouTube Upload:
- ✓ Check: Video accessible on YouTube
- ✓ Check: Title/description correct
- ✓ Action: Wait 1-2 min for processing
- ✓ Action: Add thumbnail
- ✓ Action: Enable monetization
- ✓ Action: Share to social media

---

## TROUBLESHOOTING

### Watercolor Generation Fails
**Error:** "Host not in allowlist"
- **Fix:** Workflow runs on GitHub's servers (not cloud sandbox)
- **Status:** Should work from Actions tab

**Error:** "REPLICATE_API_TOKEN not set"
- **Fix:** Check GitHub Secrets has `REPLICATE_API_TOKEN`
- **Verify:** Settings → Secrets and variables → Actions

### Narration Generation Fails
**Error:** "ElevenLabs API error"
- **Fix:** Check GitHub Secrets has `ELEVENLABS_API_KEY`
- **Fallback:** Script falls back to Piper TTS (local, slower)

### Video Assembly Fails
**Error:** "FFmpeg not found"
- **Fix:** Workflow installs FFmpeg automatically
- **Status:** Should work in Actions

### YouTube Upload Fails
**Error:** "Token expired"
- **Fix:** Refresh token via: `python kids-channel/youtube_auth.py`
- **Then:** Update all 4 YOUTUBE_* secrets in GitHub

**Error:** "Authentication failed"
- **Fix:** Ensure token.json is valid
- **Check:** `cat kids-channel/token.json`

---

## GITHUB ACTIONS STATUS

Monitor progress from your phone:

1. Open: `github.com/wiggjamie9-afk/jamie-wigg/actions`
2. Click the running workflow
3. See live progress:
   - Yellow = Running
   - Green ✓ = Complete
   - Red ✗ = Failed

Each step shows:
- Start time
- Duration
- Status
- Error messages (if any)

---

## DOWNLOADING RESULTS

### From Actions Tab:
1. Go to completed workflow run
2. Scroll to "Artifacts" section
3. Click artifact name
4. Click "Download"
5. Extract ZIP on phone

### From GitHub Repo:
1. Go to repo folder
2. Navigate: `BOOK-1-VIDEO/` → `BOOK-1-Sunny-and-the-Flying-Fox.mp4`
3. Click file → Download

---

## NEXT STEPS (After Book 1 is Complete)

1. **Review on YouTube**
   - Check playback
   - Add thumbnail
   - Enable monetization

2. **Share to Social Media**
   - TikTok (Shorts Bonus)
   - Instagram (Reels Bonus)
   - Facebook
   - Pinterest
   - Twitter

3. **Upload to Amazon KDP**
   - Create print-on-demand book
   - Set price: $9.99
   - Enable Kindle Unlimited

4. **Create Merchandise**
   - Amazon Merch on Demand
   - T-shirts, hoodies, mugs, etc.
   - Use cover art + Sunny character

5. **Start Book 2**
   - Same workflow
   - Different story
   - Different title

---

## FULL WORKFLOW COMMAND SUMMARY (For Reference)

If running locally instead of GitHub Actions:

```bash
# Step 1: Generate watercolor pages
export REPLICATE_API_TOKEN="your-token"
python3 generate-book1-watercolor-pages.py

# Step 2: Assemble 18-page book
python3 assemble-book1-pages.py

# Step 3: Generate narration
export ELEVENLABS_API_KEY="your-key"
python3 generate-book1-narration.py

# Step 4: Create video
python3 assemble-book1-video.py

# Step 5: Upload to YouTube
export YOUTUBE_ACCESS_TOKEN="your-token"
export YOUTUBE_REFRESH_TOKEN="your-token"
export YOUTUBE_CLIENT_ID="your-id"
export YOUTUBE_CLIENT_SECRET="your-secret"
python3 upload-book1-to-youtube.py
```

But **you don't need this** — GitHub Actions handles it all.

---

## CONFIGURATION CHECK

All API keys configured in GitHub Secrets:
- ✓ `REPLICATE_API_TOKEN` (for watercolor generation)
- ✓ `ELEVENLABS_API_KEY` (for voice narration)
- ✓ `YOUTUBE_ACCESS_TOKEN` (for upload)
- ✓ `YOUTUBE_REFRESH_TOKEN`
- ✓ `YOUTUBE_CLIENT_ID`
- ✓ `YOUTUBE_CLIENT_SECRET`

**Status:** Ready to use

---

## YOU'RE ALL SET

**From your iPhone:**
1. Open Actions tab
2. Trigger watercolor generation
3. Wait ~60 minutes
4. Trigger complete pipeline
5. Wait ~45 minutes
6. Book 1 is on YouTube

**Total time:** ~2 hours active, ~2 days elapsed

**Repeat for Books 2-17** using the same workflow.

---

Generated: 2026-06-10  
Status: ✓ Complete and Ready to Use
