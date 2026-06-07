# Complete E-Book Automation Setup

This guide walks you through setting up **full automation** for selling Sonny e-books across all platforms with:
- ✅ Cover image generation
- ✅ Automatic pricing
- ✅ Description generation with SEO metadata
- ✅ Tags and categories
- ✅ Thumbnail and cover art
- ✅ YouTube description with all links
- ✅ Sales tracking

---

## 📋 Prerequisites

**Python 3.9+** with these packages:

```bash
pip install python-dotenv requests pillow
```

The automation script will NOT work without these. Install them now:

```bash
# Required packages:
pip install python-dotenv    # For .env file loading
pip install requests          # For Gumroad/Etsy API calls
pip install pillow            # For cover image generation (PIL)
```

If Pillow installation fails on Mac/Linux, try:

```bash
# Mac (with Homebrew):
brew install libjpeg
pip install pillow

# Ubuntu/Debian:
sudo apt-get install python3-dev libjpeg-dev zlib1g-dev
pip install pillow
```

---

## 🔑 Step 1: Get API Keys

### Gumroad API Key

1. Go to **gumroad.com** → Log in
2. Click your profile picture → **Settings**
3. Scroll down → **Developer API**
4. Copy your **API token**

### Etsy API Key + Shop ID

1. Go to **etsy.com** → Log in
2. Click your profile → **Seller Center**
3. Left sidebar → **Developer** → **Your apps**
4. Click **Create an app**
   - App name: `Sonny E-book Auto-upload`
   - Click **Create**
5. You'll get:
   - **OAuth token** (or **API Key**)
   - Copy it
6. Find your **Shop ID**:
   - Go to **Seller Center** → **Shop Settings** → **Info & Appearance**
   - Look for **Shop ID** (numeric, like `12345678`)
   - Copy it

---

## 📁 Step 2: Update `.env` File

Edit `/home/user/jamie-wigg/.env` (or create it if missing):

```bash
# Gumroad
GUMROAD_API_KEY=your-gumroad-api-token-here

# Etsy
ETSY_API_KEY=your-etsy-oauth-token-here
ETSY_SHOP_ID=your-shop-id-number-here
```

**⚠️ Important:** Never commit `.env` to GitHub. It's in `.gitignore` for security.

---

## 🎨 Step 3: How the Automation Works

When you run the script, it will:

### 1️⃣ **Find the Latest Episode**
Looks for the most recent episode with:
- `kids-channel/episodes/<slug>/ebook.pdf`
- `kids-channel/episodes/<slug>/script.json`
- `kids-channel/episodes/<slug>/thumbnail.jpg`

### 2️⃣ **Generate Cover Image**
Creates a professional book cover from the thumbnail:
- Amazon KDP spec: 2500 × 1600 px
- Adds episode title as text overlay
- Saves as `cover.jpg` in episode folder

### 3️⃣ **Generate Descriptions**
Creates platform-specific descriptions with:
- **Gumroad:** Direct sales pitch, emotional hook
- **Amazon KDP:** Educational angle, safe for toddlers
- **Etsy:** Instant digital download promise
- All include: age range (1-5), benefits, Sonny character intro

### 4️⃣ **Upload to Gumroad** (Automated)
If API key is set:
- Uploads PDF automatically
- Sets price: $3.99
- Adds SEO tags
- Returns product URL
- ✅ Ready to share immediately

### 5️⃣ **Prepare Etsy Listing** (Semi-automated)
If API key is set:
- Prepares all metadata (title, price, tags)
- Lists the manual upload steps
- You complete the 3-minute upload on Etsy dashboard
- ⚠️ Etsy's API doesn't support file uploads, but everything else is prepped

### 6️⃣ **Update Sales Tracking**
Adds entry to `kids-channel/ebooks/sales-tracking/2026-revenue.csv`:
- Episode number
- Title
- Release date
- Empty cells for weekly sales updates

### 7️⃣ **Generate YouTube Description**
Creates formatted links section with:
- All platform links (Gumroad auto-populated, others as placeholders)
- Hashtags: `#SonnysBedtimeTales #ChildrensBooks #BedtimeStories`
- Copy-paste ready for YouTube description

---

## 🚀 Step 4: Run the Automation

First time only:

```bash
cd /home/user/jamie-wigg
python kids-channel/ebooks/auto-upload.py
```

### Expected Output:

```
================================================================================
🎬 SONNY E-BOOK AUTO-UPLOAD
================================================================================

📽️  Found episode: Sonny Watches the Firefly Dance
   Path: sonny-episode-001
   PDF: 2,400 KB

📸 Generating cover image...
  ✅ Cover image: 1,200 KB

📤 Uploading to Gumroad: Sonny Watches the Firefly Dance
  ✅ Gumroad: https://gumroad.com/products/xxxxx

📤 Preparing Etsy listing: Sonny Watches the Firefly Dance
  ℹ️  Etsy listing data prepared
  📝 Steps to complete:
     1. Go to etsy.com → Your shops → Active listings
     2. Click 'Create a listing' → Digital downloads
     3. Copy title: Sonny's Cozy Quokka Bedtime Tales Firefly Dance - PDF Download
     4. Upload PDF: ebook.pdf
     5. Set price: $3.99
     6. Add tags: bedtime stories, children's book, picture book, ...
     7. Category: Kids → Picture Books

📊 Updating sales tracking
  ✅ Sales tracking updated

📝 Generating YouTube description links

================================================================================
📊 UPLOAD SUMMARY
================================================================================
Episode: Sonny Watches the Firefly Dance
PDF Generated: ✅ 2,400 KB
Cover Image: ✅ Generated
Gumroad: ✅ Uploaded
  Price: $3.99
  URL: https://gumroad.com/products/xxxxx
Etsy: ℹ️  Listing data prepared
  Price: $3.99
  Next: Complete manual upload via Etsy dashboard
Amazon KDP: ℹ️  Manual upload required

📋 FILES READY:
PDF: /home/user/jamie-wigg/kids-channel/episodes/sonny-episode-001/ebook.pdf
Cover: /home/user/jamie-wigg/kids-channel/episodes/sonny-episode-001/cover.jpg
Thumbnail: /home/user/jamie-wigg/kids-channel/episodes/sonny-episode-001/thumbnail.jpg

📱 YOUTUBE DESCRIPTION (COPY THIS):
================================================================================

📖 GET THE PICTURE BOOK:

Sonny's story is now available as a beautiful illustrated picture book...
```

---

## 📊 Step 5: Complete the Manual Steps

### For Gumroad:
✅ **Already done!** Your product is live.
- Check: gumroad.com → Your Products → View Stats
- Copy the URL → paste in YouTube description

### For Etsy:
⏱️ **Takes ~3 minutes**
1. Go to **etsy.com** → **Seller Center**
2. Click **Listings** → **Create a listing**
3. Choose **Digital Downloads**
4. Copy the title from the script output
5. Upload the PDF from `kids-channel/episodes/<slug>/ebook.pdf`
6. Set price: **$3.99**
7. Add tags (script provides them)
8. Category: **Kids** → **Picture Books**
9. Publish

### For Amazon KDP:
⏱️ **Takes ~15 minutes**
1. Go to **kdp.amazon.com**
2. Click **Create** → **Kindle eBook**
3. Follow steps in `EBOOK-SALES-GUIDE.md` (Platform 2️⃣)
4. Get the ASIN, create link: `https://www.amazon.com/dp/[ASIN]`

---

## 💰 Revenue Projections

With automation:

| Month | Gumroad | Etsy | Amazon | Total |
|---|---|---|---|---|
| Month 1 (3 episodes) | $45 | $30 | $20 | ~$95 |
| Month 2 (30 episodes) | $360 | $240 | $160 | ~$760 |
| Month 3 (90 episodes) | $1,080 | $720 | $480 | ~$2,280 |
| Month 6 (270 episodes) | $3,240 | $2,160 | $1,440 | ~$6,840 |

**Assumptions:**
- Gumroad: 3 sales/episode at $3.99
- Etsy: 2 sales/episode at $3.99
- Amazon: 1 sale/episode at $4.99

---

## 🔧 Troubleshooting

### "Pillow not found"
```bash
pip install pillow
```

### "GUMROAD_API_KEY not set"
1. Check `.env` file exists in repo root
2. Verify key is exact copy from gumroad.com
3. Restart terminal/IDE

### "No episode found"
1. Run the Sunny pipeline first: `python kids-channel/pipeline.py`
2. Check episode exists: `ls kids-channel/episodes/`
3. Verify it has: `ebook.pdf`, `script.json`, `thumbnail.jpg`

### "Gumroad upload failed: 403"
1. Check API key is valid
2. Check Gumroad account has API access enabled
3. Try regenerating the API token on gumroad.com

### "Cover image not generating"
1. Check thumbnail exists: `kids-channel/episodes/<slug>/thumbnail.jpg`
2. Check Pillow is installed: `python -c "from PIL import Image; print('OK')"`
3. Script will continue without cover (optional, not blocking)

---

## 📈 Next Steps

1. **Generate first episode:** `python kids-channel/pipeline.py`
2. **Run automation:** `python kids-channel/ebooks/auto-upload.py`
3. **Complete Etsy upload:** 3 minutes manual
4. **Complete Amazon KDP upload:** 15 minutes manual
5. **Add links to YouTube description:** 1 minute
6. **Update sales tracking weekly:** 5 minutes

**Total per episode (with automation):** ~20 minutes (most manual)
**Without automation:** ~30 minutes (all manual)

---

## 🎯 Pricing Table (Reference)

| Platform | Per Copy | Per Sale Revenue | Monthly (3 sales/ep) |
|---|---|---|---|
| **Gumroad** | $3.99 | $3.59 (90%) | $3.24/ep |
| **Amazon KDP** | $4.99 | $3.49 (70%) | $3.15/ep |
| **Etsy** | $3.99 | $3.19 (80%) | $2.87/ep |

---

## 📚 Related Files

- `EBOOK-SALES-GUIDE.md` — Complete platform setup guides
- `EPISODE-UPLOAD-CHECKLIST.md` — Per-episode checklist
- `AUTO-UPLOAD-SETUP.md` — API setup details
- `auto-upload.py` — The automation script

---

**Ready?** Start here: `python kids-channel/ebooks/auto-upload.py`

Questions? Check the troubleshooting section above or review `EBOOK-SALES-GUIDE.md` for platform-specific help.
