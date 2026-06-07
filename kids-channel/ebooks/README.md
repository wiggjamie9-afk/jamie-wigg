# Sonny E-Book Automation

Sell Sonny picture books across Gumroad, Amazon KDP, and Etsy—fully automated.

## 🚀 Quick Start (3 minutes)

### 1. Install dependencies
```bash
pip install python-dotenv requests pillow
```

### 2. Add API keys to `.env`
```bash
# Edit /home/user/jamie-wigg/.env

GUMROAD_API_KEY=your-api-token
ETSY_API_KEY=your-oauth-token
ETSY_SHOP_ID=your-shop-id-number
```

Get keys:
- **Gumroad:** gumroad.com → Settings → Developer API
- **Etsy:** etsy.com → Developer → Create App → Copy OAuth token + Shop ID

### 3. Run the script
```bash
python kids-channel/ebooks/auto-upload.py
```

That's it! The script will:
- ✅ Find the latest episode
- ✅ Generate a professional book cover
- ✅ Upload to Gumroad (automated)
- ✅ Prepare Etsy listing (99% automated)
- ✅ Create YouTube description links
- ✅ Update sales tracking

---

## 📚 Detailed Guides

- **[COMPLETE-SETUP-GUIDE.md](COMPLETE-SETUP-GUIDE.md)** — Full automation walkthrough with screenshots
- **[EBOOK-SALES-GUIDE.md](EBOOK-SALES-GUIDE.md)** — Platform-specific details, pricing, revenue projections
- **[EPISODE-UPLOAD-CHECKLIST.md](EPISODE-UPLOAD-CHECKLIST.md)** — Per-episode template
- **[AUTO-UPLOAD-SETUP.md](AUTO-UPLOAD-SETUP.md)** — API configuration reference

---

## 💰 What You Get

| Platform | Automation | Per-Episode Time | Royalty |
|---|---|---|---|
| **Gumroad** | ✅ Full | <1 min | 90% |
| **Etsy** | 95% | ~3 min | 80% |
| **Amazon KDP** | 50% | ~15 min | 70% |

**Monthly revenue** (with 90 episodes):
- Gumroad: ~$1,000
- Etsy: ~$700
- Amazon: ~$500
- **Total: ~$2,200/month**

---

## 🎯 How It Works

```
Episode Generated
    ↓
Run: python auto-upload.py
    ↓
✅ Cover generated
✅ PDF ready
✅ Uploaded to Gumroad (LIVE)
✅ Etsy listing prepped (3 min manual upload)
✅ YouTube links generated
✅ Sales tracking created
    ↓
Manual steps:
  • Upload to Etsy (3 min)
  • Upload to Amazon KDP (15 min)
  • Add links to YouTube (1 min)
    ↓
Earn money 💰
```

---

## 📋 What Each File Does

| File | Purpose |
|---|---|
| `auto-upload.py` | Main automation script (640 lines) |
| `COMPLETE-SETUP-GUIDE.md` | Step-by-step with troubleshooting |
| `EBOOK-SALES-GUIDE.md` | Platform guides + revenue projections |
| `EPISODE-UPLOAD-CHECKLIST.md` | Per-episode template |
| `AUTO-UPLOAD-SETUP.md` | API setup reference |
| `sales-tracking/2026-revenue.csv` | Revenue log |
| `sales-tracking/README.md` | Analytics guide |

---

## 🔄 Workflow

### For each new episode:

1. **Generate episode** (pipeline)
   ```bash
   python kids-channel/pipeline.py
   ```

2. **Run automation**
   ```bash
   python kids-channel/ebooks/auto-upload.py
   ```

3. **Complete manual steps** (20 minutes total)
   - Etsy: Upload PDF (3 min)
   - Amazon KDP: Full upload (15 min)
   - YouTube: Add links (1 min)

4. **Track sales weekly**
   - Update `sales-tracking/2026-revenue.csv` with platform dashboards

---

## 🛠️ Troubleshooting

### "Pillow not found"
```bash
pip install pillow
```

### "No episode found"
Run pipeline first: `python kids-channel/pipeline.py`

### "API key not set"
Check `.env` file in repo root has the keys

### "Upload failed"
Check API key is valid on the platform dashboard

See **[COMPLETE-SETUP-GUIDE.md](COMPLETE-SETUP-GUIDE.md)** for more troubleshooting.

---

## 📞 Support

- **Setup help:** See COMPLETE-SETUP-GUIDE.md
- **Platform guides:** See EBOOK-SALES-GUIDE.md  
- **Per-episode steps:** See EPISODE-UPLOAD-CHECKLIST.md
- **Revenue tracking:** See sales-tracking/README.md

---

## 💡 Pro Tips

1. **Gumroad first** — Always upload to Gumroad first (it's instant)
2. **Batch uploads** — For weeks 2+, you can batch 5+ episodes at once
3. **Pricing** — Current: Gumroad $3.99, Amazon $4.99, Etsy $3.99 (adjust in auto-upload.py)
4. **Sales tracking** — Update weekly for best insights
5. **Share links** — Post Gumroad link on Twitter/TikTok immediately (easiest sales)

---

**Ready to automate?** 

```bash
pip install python-dotenv requests pillow
# Add API keys to .env
python kids-channel/ebooks/auto-upload.py
```

That's it!
