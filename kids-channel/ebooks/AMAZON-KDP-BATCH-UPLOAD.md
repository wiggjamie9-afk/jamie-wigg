# Amazon KDP Batch Upload Guide

**Total episodes to upload:** 149

## Quick Start

1. **Go to:** https://kdp.amazon.com
2. **Sign in** with your Amazon account (or create one)
3. **Click:** Create → Kindle eBook

## For each episode:

### Step 1: Basic Info
- **Language:** English
- **Book title:** (from CSV column D, or copy from description file)
- **Subtitle:** "A Calm Bedtime Story for Toddlers" (same for all)
- **Author:** Jamie Wigg (same for all)
- **Series:** "Sonny's Cozy Quokka Bedtime Tales" (optional but recommended)
- **Edition number:** Episode # (from CSV column A)

### Step 2: Description
- **Copy entire description from:** `kdp-descriptions/ep###-name-description.txt`
- Paste into "Book Description" field

### Step 3: Upload Manuscript
- Go to: `kids-channel/episodes/[episode-slug]/Sunny the Quokka - [title].pdf`
- Upload PDF directly (KDP auto-converts)

### Step 4: ISBN
- Select: **"Use free KDP ISBN"** (automatic, unique per book)

### Step 5: Book Cover
- KDP extracts from PDF automatically
- OR upload custom cover (2500 × 1600px)
- Use `kids-channel/episodes/[episode-slug]/thumbnail.jpg` scaled up

### Step 6: Categories & Keywords
- **Primary category:** Children's eBooks > Bedtime & Dreams
- **Secondary category:** Children's eBooks > Animals > Mammals
- **Keywords:** (from CSV column H, comma-separated)
  ```
  children's picture book, bedtime stories, toddler books, australian animals, quokka, calm stories
  ```

### Step 7: Pricing
- **Price:** $4.99 (70% royalty bracket — best earnings)
- **Territories:** Worldwide rights

### Step 8: Publish
- Click **Save and Preview**
- Review looks good
- Click **Publish to Kindle Store**
- Wait 24-48 hours for approval ✅

---

## Batch Upload Timeline

**Fastest method: 5 minutes per book**

- **Week 1:** Upload episodes 1-30 (2.5 hours)
- **Week 2:** Upload episodes 31-60 (2.5 hours)
- **Week 3:** Upload episodes 61-90 (2.5 hours)
- **Week 4:** Upload episodes 91-149 (3 hours)

**Total time:** ~10 hours spread over 4 weeks = **all 149 books live on Amazon KDP**

---

## Monitoring

After each batch:
1. Check KDP dashboard for approval status
2. Update CSV column J ("Status") to "Approved" or "Pending"
3. Add Amazon links to your spreadsheet
4. (Optional) Share links on Twitter/YouTube descriptions

---

## Print-on-Demand Option (Optional)

After all Kindle versions are live, add paperback:

1. In same KDP project, click **Create Paperback**
2. Upload same PDF (KDP formats for print)
3. Set print price to earn $8-12 profit per copy
4. Publish (5-7 days approval)

---

## Expected Revenue

- **Kindle sales:** $2.50-3.49 per $4.99 book (70% royalty)
- **Print-on-demand:** $8-12 profit per book
- **With 149 episodes + YouTube audience:** $500-2000/month by month 2

---

## Links

- KDP Dashboard: https://kdp.amazon.com
- Your Book List: https://kdp.amazon.com/my-books
- Metadata files: `/home/user/jamie-wigg/kids-channel/ebooks/amazon-kdp-batch.csv`
- Descriptions: `/home/user/jamie-wigg/kids-channel/ebooks/kdp-descriptions/`

---

## Checklist

- [ ] Amazon account created & verified
- [ ] Payment method added
- [ ] Tax info filled in (if required)
- [ ] Read KDP guidelines (5 min)
- [ ] Upload first 5 episodes (test)
- [ ] Approve & review in KDP preview
- [ ] If approved: batch upload remaining 144 episodes
- [ ] Monitor approval status weekly
- [ ] Add links to YouTube descriptions as books go live
- [ ] Track sales in spreadsheet weekly

---

**Ready? Let's go!** 🚀📚
