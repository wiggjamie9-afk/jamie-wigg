# Automated E-book Upload Setup

Use this guide to enable automatic uploads to Gumroad and Etsy.

---

## 🚀 What the automation does

```
Run: python kids-channel/ebooks/auto-upload.py

This script will:
1. ✅ Find the latest generated episode
2. ✅ Generate descriptions for each platform
3. ✅ Upload to Gumroad (if API configured)
4. ✅ Prepare Etsy listing (if API configured)
5. ✅ Update sales tracking CSV
6. ✅ Generate YouTube description links
```

**Result: From 30 minutes per episode → ~5 minutes**

---

## ⚙️ One-time setup (30 minutes)

### Step 1: Get Gumroad API key

1. Go to **gumroad.com** → Log in
2. Click your profile picture → **Settings**
3. Scroll down → **Developer API**
4. Copy your **API token**
5. Add to `.env`:
   ```
   GUMROAD_API_KEY=your-api-token-here
   ```

### Step 2: Get Etsy API credentials

1. Go to **etsy.com** → Log in
2. Click your profile picture → **Shop Manager**
3. Left sidebar → **Developer**
4. Create a new app:
   - Name: "Sonny E-book Auto-upload"
   - Click **Create**
5. Copy your **OAuth token** (or **API Key**)
6. Find your **Shop ID**:
   - Go to Shop Settings → Shop Info
   - Look for "Shop ID" or "User ID"
7. Add to `.env`:
   ```
   ETSY_API_KEY=your-oauth-token-here
   ETSY_SHOP_ID=your-shop-id-here
   ```

### Step 3: Update .env file

Edit `/home/user/jamie-wigg/.env`:

```
# E-book auto-upload APIs
GUMROAD_API_KEY=your-gumroad-api-token
ETSY_API_KEY=your-etsy-oauth-token
ETSY_SHOP_ID=your-etsy-shop-id-number
```

**Save and close.**

---

## 🏃 Per-episode workflow

### Option 1: Manual run (recommended initially)

```bash
cd kids-channel/ebooks
python auto-upload.py
```

**Output:**
- Finds latest episode
- Uploads to Gumroad ✅
- Prepares Etsy listing
- Updates sales CSV ✅
- Shows YouTube description links

Copy the YouTube links → paste in video description. Done.

### Option 2: Automatic (after each episode generates)

Add to GitHub Actions workflow: `Little Sunny — New Episode`

In `.github/workflows/little-sunny-episode.yml`, add:

```yaml
- name: Auto-upload e-book
  run: |
    cd kids-channel/ebooks
    python auto-upload.py
  env:
    GUMROAD_API_KEY: ${{ secrets.GUMROAD_API_KEY }}
    ETSY_API_KEY: ${{ secrets.ETSY_API_KEY }}
    ETSY_SHOP_ID: ${{ secrets.ETSY_SHOP_ID }}
```

Then add secrets to GitHub:
- Settings → Secrets and variables → Actions
- Add: `GUMROAD_API_KEY`, `ETSY_API_KEY`, `ETSY_SHOP_ID`

**Result:** Episode auto-uploads to Gumroad + Etsy within seconds of video generation. 🚀

---

## 📊 What still requires manual steps

### Amazon KDP
- ❌ No public API available
- ✅ Script shows instructions
- 👉 Still manual: 15 min per episode (but worth it — largest audience)

### Etsy file uploads
- ❌ API available but file uploads complex
- ✅ Script generates listing data
- 👉 Still manual: 5–10 min per episode

### YouTube description
- ❌ Could automate but risky
- ✅ Script generates links
- 👉 Still manual: 1 min per episode (copy-paste links)

---

## 🎯 Expected results

**Before automation:**
- Per episode: 30 minutes
- Per month: 45 hours

**After automation:**
- Per episode: ~5 minutes (Gumroad auto, Etsy + Amazon + YouTube manual)
- Per month: ~7.5 hours
- **Saved: 37.5 hours per month** ⚡

---

## 🐛 Troubleshooting

### "GUMROAD_API_KEY not set"

Make sure:
1. You added it to `.env` (not `.env.example`)
2. You saved the file
3. You're running from the correct directory

```bash
# Verify it's set:
grep GUMROAD_API_KEY /home/user/jamie-wigg/.env
```

### "API request failed"

1. Check your API keys are correct (copy-paste them again)
2. Make sure you have API access enabled in the platform settings
3. Check rate limits (you might be uploading too many at once)

### "Episode not found"

The script looks for the most recent episode with both:
- `ebook.pdf` file
- `script.json` file

Make sure the pipeline completed successfully.

---

## 📈 Scaling up

Once you're comfortable with automation:

1. **Run script daily:**
   ```bash
   # Add to crontab (runs daily at 6 PM):
   0 18 * * * cd /home/user/jamie-wigg/kids-channel/ebooks && python auto-upload.py
   ```

2. **Batch process multiple episodes:**
   - Modify script to process last N episodes
   - Upload all at once each week

3. **Add more platforms:**
   - Extend script to support Smashwords, Draft2Digital, etc.

---

## 📝 Script reference

Location: `kids-channel/ebooks/auto-upload.py`

**Main functions:**
- `find_latest_episode()` — Finds most recent generated episode
- `generate_descriptions()` — Creates platform-specific descriptions
- `upload_to_gumroad()` — Uploads PDF and creates product
- `upload_to_etsy()` — Prepares Etsy listing (file upload manual)
- `update_sales_tracking()` — Adds to revenue CSV
- `generate_youtube_description_links()` — Creates link section

**To customize:**
- Edit prices: `PRICE_GUMROAD = 3.99`
- Edit descriptions: `gumroad_desc = "..."`
- Add new platforms: Copy upload function pattern

---

## ✅ Checklist

- [ ] Got Gumroad API key
- [ ] Got Etsy API key + Shop ID
- [ ] Added to `.env` file
- [ ] Ran `python auto-upload.py` successfully
- [ ] Tested with first episode
- [ ] Added to GitHub Actions (optional)
- [ ] Set up crontab (optional)

---

## 🎯 Next steps

1. **Do one manual upload first** (follow QUICK-START.md)
2. **Get API keys** (this guide, steps 1–2)
3. **Update .env file**
4. **Run script** on next episode
5. **Verify** it uploaded correctly to Gumroad
6. **Still do Amazon + Etsy manually** (5–15 min, but worth it)

**Result: 30 min → 5 min per episode** ✅

---

## 💡 Pro tips

- Run script **immediately after episode generates** (while it's fresh)
- Keep YouTube description template handy (copy links in ~1 min)
- Check Gumroad dashboard weekly (verify uploads worked)
- Monitor sales spreadsheet (watch what's selling best)

---

For questions, see `EBOOK-SALES-GUIDE.md` or `QUICK-START.md`.
