# Sunny's Cozy Quokka Bedtime Tales — Full Setup Guide

## Overview

Complete automation system for generating and selling 149 illustrated ebook bedtime stories featuring Sonny the Quokka. All 149 episodes are produced with professional covers, beautiful illustrations, and automated uploads to Gumroad and Etsy.

## Quick Status

- ✅ 149 episode scripts generated (50 days of content)
- ✅ Professional cover templates created (2 alternating designs)
- ✅ Batch ebook generation script ready
- ✅ PDF ebooks with professional covers as first pages
- ✅ Gumroad API integration (ready to activate)
- ✅ Etsy API integration (ready to activate)
- ✅ Amazon KDP metadata generated (149 listings)
- ✅ GitHub Actions workflow automated (daily scheduled)

## Files & Directories

```
kids-channel/
├── pipeline.py                      Main generation pipeline
├── batch-generate-all.py           Batch ebook generation
├── queue.txt                       149 episode queue
├── scripts/                        Story scripts (149 JSON files)
├── episodes/                       Generated episode files
│   └── [episode-name]/
│       ├── Sunny the Quokka - [Title].pdf    ← Ebook
│       ├── final.mp4               YouTube video
│       ├── cover.jpg               Professional cover
│       └── [scene assets...]
├── ebooks/
│   ├── GUMROAD-SETUP.md           (Referenced in workflow)
│   ├── ETSY-SETUP.md              Step-by-step Etsy config
│   ├── EBOOK-SALES-GUIDE.md       Sales strategies
│   ├── amazon-kdp-batch.csv       149 listings for KDP
│   └── kdp-descriptions/          Individual descriptions

.github/workflows/
└── little-sunny-episode.yml        Daily generation & upload
```

## Setup Checklist

### Phase 1: Local Testing (Optional)

```bash
cd kids-channel

# Test single episode generation
python3 pipeline.py --script-file scripts/sunny-and-the-still-pond.json --dry-run

# Batch generate all 149 ebooks (local)
python3 batch-generate-all.py
```

### Phase 2: Gumroad Setup

See `kids-channel/ebooks/` for Gumroad setup guide. Steps:
1. Get Gumroad API key from account settings
2. Add `GUMROAD_API_KEY` to GitHub Secrets
3. Next episode auto-uploads on generation

**Status**: Pipeline supports Gumroad, ready when secret is added

### Phase 3: Etsy Setup

See `ETSY-SETUP.md` (in this directory). Steps:
1. Create Etsy app in Developer Portal
2. Get API Key, Secret, and Shop ID
3. Add these 3 secrets to GitHub:
   - `ETSY_API_KEY`
   - `ETSY_API_SECRET`
   - `ETSY_SHOP_ID`
4. Next episode auto-uploads on generation

**Status**: Pipeline supports Etsy, ready when secrets are added

### Phase 4: Amazon KDP Setup

```bash
# Review auto-generated KDP metadata
cat kids-channel/ebooks/amazon-kdp-batch.csv
ls kids-channel/ebooks/kdp-descriptions/

# Upload to KDP manually (no automation yet)
# 1. Go to kdp.amazon.com
# 2. Bulk upload: Use the CSV + description files
# 3. Upload PDF covers + interior files
```

## Episode Generation Pipeline

Runs on schedule (see workflow):
- **7:00 AM AEST** - Daily episode
- **1:00 PM AEST** - Daily episode
- **7:00 PM AEST** - Daily episode

Or trigger manually:
```bash
# Via GitHub Actions web interface
# Repository → Actions → "Little Sunny — New Episode" → Run workflow
```

Each run:
1. ✅ Generates narration (ElevenLabs)
2. ✅ Creates 6 illustrated scenes (Replicate/FAL)
3. ✅ Assembles video with music
4. ✅ Generates PDF ebook with professional cover
5. 🔲 Uploads to YouTube (when authorized)
6. 🔲 Uploads to Gumroad (when secret set)
7. 🔲 Uploads to Etsy (when secrets set)

## Character Consistency

**Sunny the Quokka** appears identically across all 149 ebooks:
- **Fur**: Golden-brown, warm tone
- **Eyes**: Large, warm brown, gentle expression
- **Body**: Small, rounded, cute proportions
- **Ears**: Small rounded, pink inner
- **Mood**: Always peaceful, curious, calm

Controlled via:
- `VISUAL_STYLE` constant in pipeline.py (lines ~1288)
- Episode seed for consistent generation
- Professional cover templates (alternating 2 designs)

## Text Layout (Ebooks)

Each ebook page:
- **Illustrations**: Top section (watercolour style)
- **Text**: Bottom section (cream parchment background)
- **Typography**: Brown text (#654321), max 3 lines per page
- **Line Height**: 70px (spreads text out, not cramped)
- **Flow**: Narrative prose matching watercolour mood

## Pricing

### Recommended
- **Gumroad**: $3.99 USD per ebook
- **Etsy**: $3.99 USD per ebook
- **Amazon KDP**: $2.99-4.99 depending on format

### Revenue Split (approx)
| Channel | Fee | Your Take |
|---------|-----|-----------|
| Gumroad | 10% | $3.59 |
| Etsy | 6.5% + 3% | $3.68 |
| Amazon KDP | 30-50% | $1.50-2.00 |

## Troubleshooting

### Batch Generation Failed
```bash
# Check for specific episode errors
tail -100 batch-generation.log
# Look for episode number + error type
# Most likely: missing script file (should be in kids-channel/scripts/)
```

### Gumroad Upload Failed
- Verify `GUMROAD_API_KEY` secret is set correctly
- Check GitHub Secrets → Actions → `GUMROAD_API_KEY`
- Visit gumroad.com/settings/advanced for API key

### Etsy Upload Failed
- Verify all 3 Etsy secrets are set:
  - `ETSY_API_KEY`
  - `ETSY_API_SECRET`
  - `ETSY_SHOP_ID`
- Visit developers.etsy.com to verify app credentials

### Episode Looks Different
- Character consistency is controlled by `VISUAL_STYLE` in pipeline.py
- If generation looks different, check seed value in pipeline
- Current: seed = episode number (line ~1505)

## Next Steps

1. **Activate Gumroad**: Add API key to GitHub Secrets
2. **Activate Etsy**: Add shop credentials to GitHub Secrets
3. **Monitor First Upload**: Trigger manual workflow run, watch results
4. **Test Sales**: Verify listings appear correctly on both platforms
5. **Set Up KDP**: Manual upload of CSV + files to Amazon KDP
6. **Track Metrics**: Monitor sales across all 3 channels

## Key Files to Reference

| File | Purpose |
|------|---------|
| `pipeline.py` | Core generation engine |
| `batch-generate-all.py` | Batch ebook creator |
| `queue.txt` | Episode queue (149 items) |
| `.github/workflows/little-sunny-episode.yml` | Scheduled automation |
| `ebooks/GUMROAD-SETUP.md` | Gumroad configuration |
| `ebooks/ETSY-SETUP.md` | Etsy configuration |
| `ebooks/amazon-kdp-batch.csv` | KDP metadata |

## Questions?

- **GitHub**: wiggjamie9-afk/jamie-wigg (check Issues)
- **Pipeline Issues**: Check workflow logs in Actions tab
- **Platform Help**: Gumroad.com support, Etsy.com support, KDP.amazon.com support

---

**Last Updated**: June 8, 2026
**Episodes Ready**: 149
**Platforms Configured**: GitHub Actions (YouTube/Gumroad/Etsy support)
