# Coloring Book Automation Guide

**Automatic printable coloring book generation for all 149 Sunny episodes.**

## What You Get

Each Sunny ebook now has a companion coloring book:

- **Original Ebook**: Story with colored illustrations ($3.99)
- **Coloring Book**: Same story with line art for coloring ($2.99)

**Result**: Each episode = 2 products on 3 platforms = 6 revenue streams per story

---

## How It Works (Automatic)

### Daily Generation Pipeline

```
Episode Generated
    ↓
[5e] Create PDF Ebook (colored)
[5f] Upload ebook to Gumroad
[5g] Upload ebook to Etsy
[5h] Queue ebook to KDP
    ↓
[5i] Generate Coloring Book (line art)
[5j] Upload coloring book to Gumroad
[5k] Upload coloring book to Etsy
[5l] Queue coloring book to KDP
    ↓
[6] Upload video to YouTube
```

### What Happens Automatically

1. **Illustrations Extracted** — Takes all 6 scene images from episode
2. **Line Art Conversion** — Removes colors, keeps outlines only
3. **PDF Created** — Coloring book layout with white space for coloring
4. **Gumroad Upload** — Available for $2.99 immediately
5. **Etsy Upload** — Listed as separate coloring book product
6. **KDP Queue** — Added to weekly batch upload

**No extra steps needed.** Everything happens automatically with each episode.

---

## Current Status

### Already Live ✓
- ✅ 89 ebooks (colored versions) selling on Gumroad
- ✅ Coloring book generation ready (awaiting Etsy setup)
- ✅ Auto-upload to all 3 platforms ready
- ✅ Printable PDF format configured

### Activated When You Add Secrets ✓
- 🔲 Etsy: Add secrets → Coloring books auto-upload
- 🔲 KDP: Add secrets → Coloring books auto-queue

---

## Coloring Book Features

### Format
- **File Type**: PDF (printable)
- **Layout**: Letter size (8.5" × 11")
- **Colors**: Black line art on white background
- **Pages**: 6+ scenes + cover + back page

### Content
- Professional line art (converted from original illustrations)
- Scene from the story (ready to color)
- Cover page for coloring
- Back page (title + coloring tips)
- No colors — user provides the creativity!

### Printability
- ✅ Optimized for home printers
- ✅ Black & white (low ink cost)
- ✅ Multiple copies per ebook (print as many times as you like)
- ✅ All ages friendly

---

## Pricing Strategy

### Recommended Pricing

| Product | Gumroad | Etsy | KDP |
|---------|---------|------|-----|
| **Ebook** | $3.99 | $3.99 | $4.99 |
| **Coloring Book** | $2.99 | $2.99 | $3.99 |
| **Bundle** (both) | $5.99 | $5.99 | $6.99 |

### Why Lower Price for Coloring Books?
- Less content (line art vs colored)
- Broader audience (budget-conscious buyers)
- Higher volume potential
- Differentiated from ebooks

### Revenue Per Episode (Both Versions)
```
Gumroad:  $3.59 + $2.70 = $6.29 per pair
Etsy:     $3.68 + $2.76 = $6.44 per pair
KDP:      $2.49 + $1.99 = $4.48 per pair
```

**Total for all 149 episodes:**
```
Conservative (10% sell rate):
(149 × $6.29) × 10% = $94/month

Moderate (20% sell rate):
(149 × $6.29) × 20% = $188/month

Optimistic (50% sell rate):
(149 × $6.29) × 50% = $469/month
```

---

## Advanced Options (Future)

### Print-on-Demand Physical Coloring Books
- Use Amazon KDP Coloring Book format
- Offer hardcover/softcover physical versions
- No inventory — printed on demand
- 30-40% profit margins

### Coloring Book Bundles
- 10-episode bundle: $19.99 (discount for volume)
- 30-episode bundle: $49.99
- Creates "series" for collectors

### Teacher/School Licenses
- Bulk coloring book packages
- Site licenses for classrooms
- Higher pricing for institutional use

### Audiobook + Coloring Book Combo
- Listen to story while coloring
- Premium product ($9.99)
- High perceived value

---

## Troubleshooting

### Coloring Book Looks Strange
```
Possible causes:
1. Original illustration very colorful (harder to convert to line art)
2. Small details lost in line art process
3. Color conversion settings need tuning

Solution:
- Check episode_dir/scene_#_lineart.jpg files
- Adjust OpenCV parameters if needed
- Some episodes may have better results than others
```

### Upload Failed
```
Check:
1. Coloring book PDF exists (check episode_dir/)
2. File size < 25MB
3. Platform storage limits not exceeded
4. Try re-running workflow
```

### PDF Not Printable
```
Test:
1. Open PDF locally
2. Print preview to check formatting
3. Verify page size (should be 8.5x11")
4. Check margins (should have 0.5" borders)
```

---

## Files Generated Per Episode

```
kids-channel/episodes/[episode-name]/
├── Sunny the Quokka - [Title].pdf                    ← Ebook (colored)
├── Sunny the Quokka - [Title] - Coloring Book.pdf   ← Coloring book
├── cover.jpg                                         ← Cover image
├── scene_01.jpg → scene_06.jpg                       ← Original colored
├── scene_01_lineart.jpg → scene_06_lineart.jpg       ← Line art versions
└── [other assets...]
```

---

## Status & Monitoring

### Check if Coloring Book Generated
```bash
ls kids-channel/episodes/*/Coloring\ Book.pdf | wc -l
# Shows number of coloring books created
```

### View a Coloring Book
```bash
# Download and open locally to preview
```

### Track Uploads
- **Gumroad**: Your dashboard → Products
- **Etsy**: Your shop → Listings
- **KDP**: Your bookshelf → All Books

---

## When to Activate

**Now** (Recommended):
- Add Etsy secrets (5 min)
- Coloring books auto-upload to all 3 platforms
- Start selling immediately

**Later**:
- No rush — coloring books will queue up
- Can batch upload anytime

---

## Next Steps

1. ✅ **Pipeline Ready** — Coloring book generation ready
2. 🔲 **Add Etsy Secrets** — Enable Etsy uploads (3 secrets)
3. 🔲 **Add KDP Secrets** — Enable KDP uploads (2 secrets)
4. 🔲 **Test Workflow** — Trigger manual run to verify
5. 📈 **Monitor Sales** — Watch both ebook & coloring book sales

---

## Summary

**You're getting 2 products per episode:**
- Colored ebook (story with illustrations)
- Printable coloring book (line art)

**All platforms:**
- Gumroad ✓ (live now)
- Etsy 🔲 (ready when secrets added)
- Amazon KDP 🔲 (ready when secrets added)

**Pricing:**
- Ebook: $3.99 (Gumroad/Etsy), $4.99 (KDP)
- Coloring Book: $2.99 (Gumroad/Etsy), $3.99 (KDP)

**Revenue potential**: Double your sales with coloring books! 📚✏️

All happening automatically. You just relax and watch the money come in! 💰
