# SUNNY'S COZY QUOKKA BEDTIME TALES — PROJECT STATUS

**Project Goal:** 17 professional bedtime story video books for YouTube  
**Current Priority:** Book 1 (Sunny and the Flying Fox) - Complete end-to-end pipeline  
**Status:** Pipeline infrastructure ready | Book 1 illustration phase blocked by image generation  

---

## 📊 PROJECT INVENTORY

### WHAT WE HAVE

**Character Design & Reference Graphics:**
- ✅ **5 Sunny Concept Images** (locally generated, no API cost)
  - `concept-1-sitting-moonlit-bush.png` (9.4 KB) — Sunny in evening setting
  - `concept-2-portrait-closeup.png` (15 KB) — **[LOCKED REFERENCE]** Head/shoulders with wildflowers & moonglow
  - `concept-3-curled-asleep.png` (9.0 KB) — Peaceful sleep pose
  - `concept-4-running-joy.png` (17 KB) — Joyful motion
  - `concept-5-watching-stars.png` (9.9 KB) — Contemplative pose
  - Location: `/SUNNY-CONCEPT-ART/`

**Story Scripts:**
- ✅ **150 formatted story scripts** (complete narrative content for 150 books)
  - Format: `BOOK-XXX-[Title].txt` with full bedtime story text
  - Location: `/formatted-books/`
  - Example: `BOOK-001-Sunny-Watches-the-Stars-Come-Out.txt`
  - Content: Professionally written children's bedtime narratives featuring Sunny

**Completed Video Books (Already Produced):**
- ✅ **17 fully rendered video books** with MP4 output
  - Books: 033, 034, 035, 041, 043, 046-056, 060
  - Each contains: Video MP4, page illustrations, narration assembled
  - Location: `/SUNNY-17-FINAL-UPLOAD/`
  - Size: ~800 KB each (compressed H.264 1920×1080)
  - Status: **Ready to upload to YouTube** (awaiting channel setup)

---

## 🎬 WHAT WE'RE BUILDING: BOOK 1

**Book Title:** Sunny and the Flying Fox  
**Format:** 18-page illustrated book → MP4 video (1920×1080, ~8-10 minutes)

### Book Structure

| Component | Pages | Details |
|-----------|-------|---------|
| Cover | 1 | Title page with Sunny illustration |
| Story Pages | 16 | Illustrated narrative (1 illustration per page) |
| Teaser | 1 | Promo for next book (Book 2) |
| **Total** | **18** | ~5 seconds per page = ~90 seconds base video |

### Character Locked

- **Design:** Chubby, round golden-brown quokka (like teddy bear)
- **Face:** Large gentle warm brown eyes, peaceful expression, natural smile
- **Fur:** Realistic detailed texture, warm golden-brown tones
- **Ears:** Small round with cream-colored inner lining
- **Reference:** Concept 2 portrait (close-up head/shoulders)
- **Consistency Rule:** Same character, same proportions, same emotional tone across all 16 pages

---

## 🖼️ GRAPHICS PIPELINE STATUS

### Current Graphics Stack

**What We Built (No Cost):**
- Local PIL/Pillow image generation (`generate-sunny-art-local.py`)
- Watercolor-inspired stylized illustrations
- 5 reference concept images completed ✅
- **Advantage:** No API calls, no rate limits, no credit cards needed

**What We Tried (Blocked):**
- ❌ Pollinations AI — HTTP 402 (free tier killed)
- ❌ Replicate API — Malformed responses (no active credits)
- ❌ Hugging Face Spaces — Egress blocked by sandbox network policy

### Illustration Generation for Book 1 Pages

**Current Blocker:** Need 16 high-quality illustrated story pages matching Concept 2 reference

**Three Options:**

| Option | Method | Cost | Quality | Speed |
|--------|--------|------|---------|-------|
| **A** | Use existing 5 concept images + generated variations | Free | Medium-High | Fast |
| **B** | Commission artist (Fiverr/Upwork) | $50-200 | Professional | 3-7 days |
| **C** | Use public domain / CC images + Sunny overlay | Free | Variable | Medium |

---

## 📹 GITHUB ACTIONS PIPELINE

**Workflow:** `.github/workflows/book1-complete-pipeline.yml`  
**Branch:** `claude/github-sunny-file-search-65awr`  
**Timeout:** 180 minutes (plenty for all 5 steps)  

### 5-Step Pipeline

1. **Generate 16 Illustrated Pages**
   - Input: Story text prompt + Concept 2 locked reference
   - Output: 16 PNG images (1920×1080 each)
   - Status: 🟡 Ready (awaiting image generation solution)

2. **Assemble 18-Page Book**
   - Input: Cover + 16 pages + teaser PNG files
   - Output: Structured image sequence
   - Status: ✅ Ready (`assemble-book1-pages.py`)

3. **Generate Narration** (Rachel voice, ElevenLabs)
   - Input: Story text
   - Output: Warm motherly narration WAV
   - Status: ✅ Ready (script exists, needs ELEVENLABS_API_KEY in GitHub Secrets)

4. **Assemble Video**
   - Input: 18-page images + narration audio
   - Output: MP4 (1920×1080 H.264, ~90 seconds)
   - Status: ✅ Ready (`assemble-book1-video.py`, FFmpeg configured)

5. **Upload to YouTube**
   - Input: MP4 file + title + description
   - Output: Video live on @SunnyBedtimeTales channel
   - Status: ✅ Ready (script exists, needs YouTube API credentials in GitHub Secrets)

---

## 🔐 GITHUB SECRETS NEEDED

To activate the full pipeline, add these to GitHub Actions secrets:

| Secret | Value | Status |
|--------|-------|--------|
| `REPLICATE_API_TOKEN` | Your Replicate account token | ❌ Need to add |
| `ELEVENLABS_API_KEY` | Your ElevenLabs account key | ❌ Need to add |
| `YOUTUBE_ACCESS_TOKEN` | YouTube OAuth token | ❌ Need to add |
| `YOUTUBE_REFRESH_TOKEN` | YouTube OAuth refresh token | ❌ Need to add |
| `YOUTUBE_CLIENT_ID` | YouTube app client ID | ❌ Need to add |
| `YOUTUBE_CLIENT_SECRET` | YouTube app client secret | ❌ Need to add |

---

## 📍 CURRENT PROJECT STATE

### ✅ COMPLETE

- Character design locked (Concept 2)
- 5 reference concept images generated
- 150 story scripts written and formatted
- 17 video books already produced (Books 033, 034, 035, 041, 043, 046-056, 060)
- GitHub Actions workflow infrastructure (5-step pipeline)
- Python scripts for assembly, narration, video encoding, YouTube upload
- Development branch ready (`claude/github-sunny-file-search-65awr`)

### 🟡 IN PROGRESS

- Book 1 illustration generation (blocked on image generation method)
- GitHub Secrets configuration (need your API keys)
- YouTube channel setup (@SunnyBedtimeTales)

### 🔮 NEXT STEPS (After Book 1 Complete)

1. Confirm Book 1 video quality and upload to YouTube
2. Set up YouTube playlist and channel branding
3. Repeat pipeline for Books 2-17 using same locked character
4. Consider monetization and distribution strategy

---

## 💻 TECHNOLOGIES IN USE

**Backend/Automation:**
- Python 3.11 (PIL/Pillow, requests, ffmpeg-python)
- FFmpeg (H.264 video encoding, audio/video multiplexing)
- GitHub Actions (CI/CD, scheduled / on-demand execution)

**AI/Creative APIs:**
- ElevenLabs TTS (warm motherly voice narration)
- Replicate FLUX 1.1 Pro (image-to-image, reference-conditioned)
- OR local PIL generation (watercolor-style illustrations, no API)

**Video Hosting:**
- YouTube Data API (automated upload + metadata)

**Version Control:**
- Git on `claude/github-sunny-file-search-65awr` branch

---

## 📋 FILES IN THIS PROJECT

| File | Purpose |
|------|---------|
| `/generate-book1-from-sunny-reference.py` | Replicate-based 16-page generator (with reference conditioning) |
| `/generate-sunny-art-local.py` | Local PIL watercolor-style generator (5 concept images) |
| `/assemble-book1-pages.py` | Combines 18 PNG files into book structure |
| `/generate-book1-narration.py` | ElevenLabs TTS + audio processing |
| `/assemble-book1-video.py` | FFmpeg MP4 video assembly (images + audio) |
| `/upload-book1-to-youtube.py` | YouTube Data API upload script |
| `/.github/workflows/book1-complete-pipeline.yml` | 5-step GitHub Actions workflow |
| `/formatted-books/*.txt` | 150 story scripts |
| `/SUNNY-CONCEPT-ART/*.png` | 5 reference concept images |
| `/SUNNY-17-FINAL-UPLOAD/` | 17 completed video books (ready for YouTube) |

---

## 🎯 IMMEDIATE PRIORITY

**Question for you:** How would you like to proceed with the 16 story page illustrations for Book 1?

1. **Use what we have** — assemble Book 1 from existing 5 concept images (fast, free, works today)
2. **Generate new illustrations** — I need your Replicate API token to generate 16 custom story pages
3. **Commission artwork** — hire an artist to illustrate 16 specific scenes from the story
4. **Hybrid approach** — use existing concepts + commission specific scenes as needed

Once you choose, we can get Book 1 complete and uploaded to YouTube **today**.

