# Book 1: Sunny Watches the Stars Come Out
## Complete Workflow Guide

This document walks you through generating a professional YouTube-ready video for Book 1 of "Sunny's Cozy Quokka Bedtime Tales" with premium Higgsfield AI illustrations and warm motherly narration.

---

## What You're Creating

- **18-page illustrated video** (75 seconds total)
- **16 story pages** with professional watercolor-style illustrations
- **Consistent character**: Sunny (locked across all pages)
- **Color progression**: Golden hour → Twilight → Deep night with stars
- **Warm narration**: Motherly voice reading to a child
- **Output**: MP4 ready for YouTube upload

---

## Prerequisites

### 1. Higgsfield AI Setup (for generating illustrations)

You already have:
- ✅ **Higgsfield API Key**: `5f59383f-fd82-4bd1-a4a0-21735bf3b4f5`
- ✅ **Higgsfield Secret**: `3b307586264998fc389df2aa9ed8736225776e1b9df19fb6c8c282725c763648`

These are already in your `.env` file.

**Install Higgsfield MCP locally** (on your machine with network):
```bash
pip install git+https://github.com/geopopos/geo_higgsfield_ai_mcp
```

Or use the Python scripts directly (recommended):
```bash
pip install requests
```

### 2. ElevenLabs Setup (for narration voice)

Get your ElevenLabs API key:
1. Visit: https://elevenlabs.io
2. Sign up (free tier available) or log in
3. Go to **Account → API Key**
4. Copy your API key

Set it in your environment:
```bash
export ELEVENLABS_API_KEY='your-key-here'
```

Or add to `.env`:
```
ELEVENLABS_API_KEY=your-key-here
```

**Install ElevenLabs library:**
```bash
pip install elevenlabs
```

### 3. FFmpeg (for video assembly)

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from: https://ffmpeg.org/download.html

---

## Step-by-Step Workflow

### Step 1: Generate 16 Professional Book Pages (Higgsfield Soul)

This creates all 16 story pages with Sunny locked for consistency.

```bash
python3 generate-book1-higgsfield-images.py
```

**What it does:**
1. Creates a character reference for Sunny (one-time, ~30s)
2. Waits for character to be ready
3. Generates 16 pages using Soul model (professional watercolor style)
4. Polls for completion (~3-5 minutes per batch)
5. Downloads all images to `BOOK-1-HIGGSFIELD-PAGES/`

**Expected output:**
```
BOOK-1-HIGGSFIELD-PAGES/
├── book-1-page-01.png  (Golden hour opening)
├── book-1-page-02.png  (Sky deepening)
├── book-1-page-03.png  (First flying foxes)
... (all 16 pages)
├── jobs.json           (tracking file)
└── characters.json     (character ref status)
```

**Higgsfield credits used:** ~16 credits (one per page at 720p)

**Cost:** ~$2-3 USD

---

### Step 2: Generate Motherly Narration (ElevenLabs TTS)

Creates warm, intimate voice reading the story to a child.

```bash
python3 generate-book1-narration.py
```

**What it does:**
1. Presents voice options (Grace, Emily, Julia)
2. You select which voice sounds most motherly
3. Generates 75 seconds of narration
4. Saves as `book-1-narration.wav`

**Voice recommendations:**
- **Grace**: Most motherly, warm and calm
- **Emily**: Gentle and nurturing
- **Julia**: Warm and intimate

**Expected output:**
```
book-1-narration.wav (75 seconds audio)
```

**ElevenLabs credits used:** ~1 minute = ~1-2 credits

**Cost:** Free on free tier, or ~$0.02 on paid tier

---

### Step 3: Assemble Final Video (FFmpeg)

Combines all 18 pages + narration into a single MP4 video.

```bash
python3 assemble-book1-final-video.py
```

**What it does:**
1. Creates cover page (page 1)
2. Loads all 16 generated story pages
3. Creates teaser page for Book 2 (page 18)
4. Assigns timing to each page (matching narration)
5. Encodes video with H.264 + AAC audio
6. Outputs `book-1-sunny-watches-stars.mp4`

**Expected output:**
```
book-1-sunny-watches-stars.mp4 (75 seconds, ~80-150 MB)
```

**Encoding time:** 2-5 minutes (depending on your CPU)

---

### Step 4: Upload to YouTube (Optional)

Ready to publish? Use the existing upload script:

```bash
python3 upload-book1-to-youtube.py
```

**Required setup (one-time):**
1. Have YouTube Data API enabled (already set up in your .env)
2. Run authorization once: `python3 setup-youtube-oauth.py`
3. This creates `token.json` for automated uploads

**What it does:**
1. Uploads `book-1-sunny-watches-stars.mp4` to your channel
2. Sets title, description, tags, thumbnail
3. Sets to unlisted or public (you configure)
4. Provides shareable link

---

## Timeline

| Step | Task | Time | Credits |
|------|------|------|---------|
| 1 | Generate character ref | 30s | ~0.5 |
| 1 | Generate 16 pages | 3-5 min | ~16 |
| 2 | Generate narration | 1-2 min | ~1-2 |
| 3 | Assemble video | 2-5 min | 0 |
| 4 | Upload to YouTube | <1 min | 0 |
| **TOTAL** | | **~10 min** | **~17-18 credits** |

**Total cost:** ~$2-3 USD

---

## Troubleshooting

### Page images not found
**Problem:** `generate-book1-higgsfield-images.py` completes but pages aren't in the folder.

**Solution:**
1. Check `BOOK-1-HIGGSFIELD-PAGES/jobs.json`
2. Look for entries with `status: "failed"`
3. Re-run the script (it will resume polling and skip completed jobs)

### Narration cuts off or sounds wrong
**Problem:** Audio is too long/short or quality is poor.

**Solution:**
1. Try a different voice: Grace (most motherly), Emily, or Julia
2. Adjust voice settings in `generate-book1-narration.py`:
   - Lower stability (0.3-0.5) for more variety
   - Raise similarity_boost (0.75-1.0) for more consistency

### FFmpeg "file not found" error
**Problem:** Pages aren't being found during assembly.

**Solution:**
1. Make sure `BOOK-1-HIGGSFIELD-PAGES/` exists with page images
2. Run from the same directory as the script: `pwd` should show `/home/user/jamie-wigg`
3. Check file permissions: `ls -la BOOK-1-HIGGSFIELD-PAGES/`

### Video is too small/large
**Problem:** Output MP4 is very large or very small.

**Solution:**
- Adjust CRF in `assemble-book1-final-video.py`
- Lower CRF = higher quality (default 18)
- Higher CRF = smaller file (use 24-28)

---

## Design Reference

### Visual Style
- **Illustrations:** Watercolor-inspired, soft edges, organic blending
- **Character:** Sunny (chubby round quokka, golden-brown fur, gentle eyes)
- **Color progression:**
  - Pages 2-5: Warm golden hour (creams, peaches, soft oranges)
  - Pages 6-11: Twilight (purples, deep blues)
  - Pages 12-17: Deep night (navy, indigo, stars)

### Narration Style
- **Voice:** Warm, motherly, intimate
- **Pacing:** Gentle, allows time for eye to rest on each image
- **Tone:** Safe, peaceful, bedtime-appropriate
- **Audience:** Child (3-8 years old), read by caregiver

### Page Structure
Each page has:
- **Illustration area:** Upper 70%, full bleed image
- **Text area:** Lower 30%, 2 lines of story text
- **Aspect ratio:** 1920×1080 (landscape, YouTube-ready)
- **Margins:** White space around elements

---

## File Reference

### Generated Files
- `BOOK-1-HIGGSFIELD-PAGES/` — Directory with 16 generated pages
  - `book-1-page-01.png` through `book-1-page-16.png`
  - `jobs.json` — Tracking file (polling status)
  - `characters.json` — Character reference status

- `book-1-narration.wav` — Audio track (75 seconds)

- `book-1-sunny-watches-stars.mp4` — Final video (ready for YouTube)

### Source Files (on GitHub)
- `BOOK-1-HIGGSFIELD/assets/higgsfield/PLAN.md` — Complete shot specifications
- `BOOK-1-COMPLETE-18PAGE/` — Mockup pages (for cover/teaser if generation fails)
- `.env` — API credentials (keep secret!)

---

## Repeat for Books 2-17

Once Book 1 is complete, repeat this workflow for each book:

1. **Create a new story text** (2 lines × 16 pages = ~500 words per book)
2. **Update PLAN.md** with new prompts for each page
3. **Run generation scripts** with new book number
4. **Generate narration** for new story
5. **Assemble video**
6. **Upload to YouTube**

**Time per book:** ~15 minutes (most automated)

**Cost per book:** ~$2-3 USD

---

## Next Steps

1. **Generate Book 1 now:**
   ```bash
   python3 generate-book1-higgsfield-images.py  # ~5 min
   python3 generate-book1-narration.py           # ~2 min (interactive - choose voice)
   python3 assemble-book1-final-video.py         # ~5 min
   ```

2. **Test playback:**
   ```bash
   open book-1-sunny-watches-stars.mp4  # macOS
   # or
   xdg-open book-1-sunny-watches-stars.mp4  # Linux
   ```

3. **Upload to YouTube:**
   ```bash
   python3 upload-book1-to-youtube.py
   ```

4. **Plan Book 2:**
   - Write new story (16 pages × 2 lines)
   - Create `BOOK-2-HIGGSFIELD/assets/higgsfield/PLAN.md`
   - Repeat workflow

---

## Support

If you hit any issues:

1. **Check error messages** — they usually tell you what's missing
2. **Re-run the script** — most issues resolve on retry (network, API delays)
3. **Verify API keys** — make sure `.env` has correct credentials
4. **Check file paths** — scripts expect you're in `/home/user/jamie-wigg/`

---

## Questions?

All scripts include detailed comments and print helpful status messages. Run any script with no arguments to see what it does:

```bash
python3 generate-book1-higgsfield-images.py
python3 generate-book1-narration.py
python3 assemble-book1-final-video.py
```

Good luck! 🌙
