# SUNNY'S BEDTIME TALES — GRAPHICS & TECHNOLOGY STACK

## 🎨 WHAT GRAPHICS WE'RE USING

### Tier 1: Master Character Reference (LOCKED)

```
┌─────────────────────────────────────────────────┐
│  Concept 2: Portrait Closeup (LOCKED REFERENCE) │
│  ┌───────────────────────────────────────────┐  │
│  │ Head/shoulders closeup of Sunny           │  │
│  │ Wildflowers softly blurred around her     │  │
│  │ Warm moonglow rim light on fur            │  │
│  │ Size: 15 KB PNG                           │  │
│  │ Resolution: 1024×768 (will upscale)      │  │
│  └───────────────────────────────────────────┘  │
│                                                   │
│  CHARACTER SPECS FROM THIS REFERENCE:           │
│  ✓ Chubby, round quokka (teddy bear shape)    │
│  ✓ Golden-brown fur (realistic texture)       │
│  ✓ Large gentle warm brown eyes               │
│  ✓ Small cream-lined ears                     │
│  ✓ Natural peaceful smile                     │
│  ✓ Expression: Calm, content, bedtime-ready  │
│                                                   │
│  USE: Visual guide for ALL 16 story pages     │
│  CONSISTENCY: Every illustration uses this     │
│  CHARACTER DESIGN as the locked reference     │
└─────────────────────────────────────────────────┘
```

### Tier 2: Support Reference Images (5 Concept Variations)

```
Concept 1          Concept 3          Concept 4          Concept 5
Sitting Moon-      Curled             Running Joy        Watching
light Bush         Asleep                                Stars
[9.4 KB]          [9.0 KB]           [17 KB]            [9.9 KB]
  │                  │                  │                  │
Evening setting     Sleep pose       Motion/energy      Contemplative
  │                  │                  │                  │
Perfect for:     Perfect for:       Perfect for:      Perfect for:
- Daytime        - Sleep scenes     - Adventure       - Dreamy/
  exploration    - Bedtime vibes      chapters         peaceful
- Introductions  - Calm moments     - Excitement      - Stargazing
```

**Purpose:** Visual inspiration + pose reference for story page illustrations

---

## 🖼️ BOOK 1 ILLUSTRATION PIPELINE

```
┌──────────────────────────────────────────────────────────┐
│ BOOK 1: SUNNY AND THE FLYING FOX                        │
│ 16 Story Page Illustrations Needed                       │
└──────────────────────────────────────────────────────────┘
                          │
                          ↓
┌──────────────────────────────────────────────────────────┐
│ CHOOSE YOUR GENERATION METHOD:                           │
│                                                           │
│ OPTION A: Use Existing 5 Concepts + Variations          │
│ ├─ Cost: FREE ($0)                                      │
│ ├─ Time: <1 hour                                        │
│ ├─ Method: Mix/match existing 5 images                  │
│ └─ Quality: Medium (proven to work)                     │
│                                                           │
│ OPTION B: Generate with Replicate API                   │
│ ├─ Cost: $0.40-1.00 per image (~16 = $6-16)           │
│ ├─ Time: 5-10 minutes                                   │
│ ├─ Method: Use Concept 2 as reference, prompt           │
│ ├─ Quality: High (AI-generated, custom scenes)          │
│ └─ Requires: Your Replicate API token + credits        │
│                                                           │
│ OPTION C: Commission Artist (Fiverr/Upwork)             │
│ ├─ Cost: $50-200 total (3-5 per illustration)          │
│ ├─ Time: 3-7 days                                       │
│ ├─ Method: Hire professional illustrator                │
│ ├─ Quality: Very High (human artist)                    │
│ └─ Requires: Budget + project brief                    │
│                                                           │
│ OPTION D: Free AI Services (Pollin, HF Spaces)         │
│ ├─ Cost: FREE ($0)                                      │
│ ├─ Time: Variable (slow or blocked)                     │
│ ├─ Method: Use fallback API generators                  │
│ ├─ Quality: Variable (free tier limitations)            │
│ └─ Status: Blocked by sandbox network policy           │
│                                                           │
└──────────────────────────────────────────────────────────┘
                          │
                          ↓ YOUR CHOICE
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
    OPTION A          OPTION B          OPTION C
    (Quickest)     (Best Quality)     (Highest)
                                         Quality
```

---

## 📦 TECHNOLOGY STACK (What You Have Access To)

### ✅ INSTALLED & READY

**Local Generation:**
- ✅ Python 3.11 with PIL/Pillow
- ✅ Generate watercolor-style illustrations (no API needed)
- ✅ Scripts: `generate-sunny-art-local.py`

**Audio Processing:**
- ✅ FFmpeg (H.264 video encoding, audio/video multiplexing)
- ✅ Script: `generate-book1-narration.py`

**Git & GitHub:**
- ✅ Git version control
- ✅ GitHub Actions CI/CD (180-min timeout)
- ✅ Branch: `claude/github-sunny-file-search-65awr`

**Video Assembly:**
- ✅ FFmpeg-python bindings
- ✅ Script: `assemble-book1-video.py`

---

### 🔌 AVAILABLE (Needs API Token)

**ElevenLabs TTS:**
- Voice: Rachel (Warm, motherly, professional)
- Cost: ~$0.03 per 1000 characters
- Status: ✅ Script ready (`generate-book1-narration.py`)
- Needed: `ELEVENLABS_API_KEY` in GitHub Secrets

**Replicate (Image Generation):**
- Model: FLUX 1.1 Pro (highest quality)
- Capability: Image-to-image with reference conditioning
- Cost: ~$0.40 per image (use your own credits)
- Status: ✅ Script ready (`generate-book1-from-sunny-reference.py`)
- Needed: `REPLICATE_API_TOKEN` in GitHub Secrets

**YouTube Data API:**
- Upload videos, set metadata, create playlists
- Cost: Free (YouTube account required)
- Status: ✅ Script ready (`upload-book1-to-youtube.py`)
- Needed: YouTube OAuth tokens in GitHub Secrets

---

### ❌ TRIED & BLOCKED

| Service | Why It Failed | Status |
|---------|---------------|--------|
| Pollinations AI | HTTP 402 Payment Required | ❌ Free tier disabled |
| Craiyon/DALL-E Mini | Connection timeout | ❌ Sandbox blocked |
| Hugging Face Spaces | Egress policy blocked | ❌ No outbound HTTPS to HF |

---

## 💾 FILE SYSTEM ORGANIZATION

```
jamie-wigg/
├── 📂 SUNNY-CONCEPT-ART/              ← 5 reference images live here
│   ├── concept-1-sitting-moonlit-bush.png
│   ├── concept-2-portrait-closeup.png    [LOCKED]
│   ├── concept-3-curled-asleep.png
│   ├── concept-4-running-joy.png
│   └── concept-5-watching-stars.png
│
├── 📂 formatted-books/                ← 150 story scripts
│   ├── BOOK-001-Sunny-Watches-the-Stars-Come-Out.txt
│   ├── BOOK-002-Sunny-and-the-Autumn-Leaves.txt
│   └── ... (148 more)
│
├── 📂 SUNNY-17-FINAL-UPLOAD/          ← 17 completed books (ready for YouTube)
│   ├── book-033/
│   ├── book-034/
│   └── ... (15 more)
│
├── 📂 .github/workflows/
│   └── book1-complete-pipeline.yml    ← GitHub Actions: 5-step pipeline
│
├── 📄 generate-book1-from-sunny-reference.py
├── 📄 generate-sunny-art-local.py
├── 📄 assemble-book1-pages.py
├── 📄 generate-book1-narration.py
├── 📄 assemble-book1-video.py
├── 📄 upload-book1-to-youtube.py
│
└── 📄 PROJECT-STATUS-SUNNY-BOOKS.md       ← This project overview
    📄 YOUTUBE-CHANNEL-SETUP.md             ← Channel config guide
    📄 GRAPHICS-AND-TECH-STACK.md           ← This file
```

---

## 🔄 END-TO-END WORKFLOW

```
STEP 1: Choose Illustration Method
    ↓
    ├─→ OPTION A: Use existing 5 concepts
    │   └─→ Mix/match variations for 16 pages
    │
    ├─→ OPTION B: Use Replicate API
    │   ├─ Generate 16 custom images
    │   ├─ Input: Story text + Concept 2 reference
    │   └─ Output: 16 PNG (1920×1080)
    │
    └─→ OPTION C: Commission artist
        └─ Pay $50-200 for professional illustrations
    
    ↓ (All paths lead to: 16 story illustrations)
    
STEP 2: Assemble Book Structure
    ├─ Cover page (Sunny illustration + title)
    ├─ Story pages 1-16 (one illustration per page)
    └─ Teaser page (next book preview)
    
    ↓
    
STEP 3: Generate Narration (ElevenLabs Rachel)
    ├─ Input: Story text from script
    ├─ Output: WAV audio file (~8-10 minutes)
    └─ Cost: ~$0.03 per script
    
    ↓
    
STEP 4: Assemble MP4 Video
    ├─ Combine: 18 PNG images + narration audio
    ├─ Format: H.264, 1920×1080, 30 fps
    ├─ Duration: ~90 seconds (varies by pacing)
    └─ Output: BOOK-001-UPLOAD.mp4
    
    ↓
    
STEP 5: Upload to YouTube
    ├─ Video file: BOOK-001-UPLOAD.mp4
    ├─ Metadata: Title, description, tags, thumbnail
    ├─ Settings: Made for Kids, visibility, playlist
    └─ Output: Live video at @SunnyBedtimeTales

✅ BOOK 1 COMPLETE & LIVE
```

---

## 🎯 CURRENT STATE SUMMARY

| Component | Status | Details |
|-----------|--------|---------|
| **Character Design** | ✅ LOCKED | Concept 2 reference (portrait closeup) |
| **Reference Images** | ✅ READY | 5 concept images generated locally |
| **Story Scripts** | ✅ READY | 150 books (Book 1 script available) |
| **Illustration Pipeline** | 🟡 BLOCKED | Needs: Choose generation method (A, B, or C) |
| **Book Assembly** | ✅ READY | Script: `assemble-book1-pages.py` |
| **Narration** | ✅ READY | Script: `generate-book1-narration.py` (needs ElevenLabs key) |
| **Video Encoding** | ✅ READY | Script: `assemble-book1-video.py` (FFmpeg configured) |
| **YouTube Upload** | ✅ READY | Script: `upload-book1-to-youtube.py` (needs OAuth tokens) |
| **GitHub Actions** | ✅ READY | Workflow configured (ready to trigger) |

---

## 🚀 QUICKEST PATH TO BOOK 1 COMPLETE

**If you choose OPTION A (Use Existing Concepts):**

1. Copy 5 concept images → repeat/arrange for 16 pages (1 hour)
2. Assemble book structure with cover + teaser (30 min)
3. Generate narration with ElevenLabs (needs API key: add to Secrets)
4. Assemble video with FFmpeg (automated: 5 min)
5. Upload to YouTube (automated: 5 min)

**Total: 2-3 hours | Cost: FREE**

**If you choose OPTION B (Generate with Replicate):**

1. Add `REPLICATE_API_TOKEN` to GitHub Secrets
2. Trigger workflow (automated: 10-15 min for all 16 generations)
3. Assemble, narrate, encode, upload (automated: 30 min)

**Total: 45 min | Cost: $6-16**

**If you choose OPTION C (Commission Artist):**

1. Create project brief + mood board
2. Post on Fiverr/Upwork (24-48 hours to get quotes)
3. Hire artist + wait 3-7 days
4. Receive 16 illustrations
5. Upload + complete pipeline

**Total: 3-7 days | Cost: $50-200**

---

## 💡 MY RECOMMENDATION

**For TODAY's launch:** Go with **OPTION A** (free, fastest, proven to work)
- Use the 5 concept images we already generated
- Mix and arrange them across the 16 story pages
- Book 1 live on YouTube by tonight
- Proves the full pipeline works end-to-end

**Then:** Evaluate quality, get user feedback, decide if you want:
- Better illustrations (OPTION B or C for future books)
- Or stick with our watercolor style (cost-effective, distinctive)

This keeps momentum and gets your YouTube channel live TODAY.

