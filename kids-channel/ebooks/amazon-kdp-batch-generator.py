#!/usr/bin/env python3
"""
Amazon KDP Batch Metadata Generator
Generates pre-filled metadata for all 149 Sonny episodes ready to paste into KDP.
"""

import json
import csv
from pathlib import Path

QUEUE_FILE = Path(__file__).parent.parent / "queue.txt"
EPISODES_DIR = Path(__file__).parent.parent / "episodes"

def extract_title_from_filename(filename: str) -> str:
    """Convert 'sunny-and-the-moonlit-meadow.json' → 'Sunny and the Moonlit Meadow'"""
    base = filename.replace("kids-channel/scripts/", "").replace(".json", "")
    # Handle special case ep01
    if base.startswith("ep01-"):
        base = base.replace("ep01-", "")
    words = base.split("-")
    return " ".join(word.capitalize() for word in words)

def generate_kdp_title(episode_num: int, story_title: str) -> str:
    """Generate Amazon KDP title"""
    return f"Sonny's Cozy Quokka Bedtime Tales: {story_title}"

def generate_kdp_description(story_title: str) -> str:
    """Generate Amazon KDP description"""
    return f"""Sonny's Cozy Quokka Bedtime Tales: {story_title}

Settle in for a gentle bedtime adventure with Sonny, a sweet little quokka exploring the Australian bush at night.

🌙 What's inside:
• 12-14 beautifully illustrated watercolour scenes
• Complete narration text (800+ words)
• Perfect for reading aloud to toddlers
• Professional children's book artwork
• Calming, cosy atmosphere
• Bedtime-appropriate pacing

This illustrated Kindle book is the companion to the popular YouTube video series "Sonny's Cozy Quokka Bedtime Tales."

📖 Perfect for:
• Bedtime reading routine
• Quiet time activities
• Building reading habits (ages 1-5)
• Parents seeking calm, gentle stories

Safe for toddlers. No scary moments, no conflict—just cosy adventure and sleepy quokka cuddles.

Watch the video series on YouTube: https://youtube.com/@sonnysquokka
Read all Sonny books on Amazon: https://amazon.com/s?k=Sonny+Cozy+Quokka"""

def generate_kdp_keywords() -> list:
    """Generate keywords for all episodes (same keywords work for all)"""
    return [
        "children's picture book",
        "bedtime stories",
        "toddler books",
        "australian animals",
        "quokka",
        "calm stories",
    ]

def main():
    print("=" * 80)
    print("📚 AMAZON KDP BATCH METADATA GENERATOR")
    print("=" * 80)

    if not QUEUE_FILE.exists():
        print(f"❌ Queue file not found: {QUEUE_FILE}")
        return

    with open(QUEUE_FILE) as f:
        queue_lines = [line.strip() for line in f if line.strip()]

    print(f"✅ Found {len(queue_lines)} episodes in queue\n")

    # Create CSV for batch import
    csv_file = Path(__file__).parent / "amazon-kdp-batch.csv"

    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        # Header
        writer.writerow([
            "Episode #",
            "Queue File",
            "Story Title",
            "KDP Title",
            "Subtitle",
            "Categories (Primary)",
            "Categories (Secondary)",
            "Keywords",
            "Price (USD)",
            "Royalty %",
            "Status",
        ])

        # Data rows
        for i, script_path in enumerate(queue_lines, 1):
            story_title = extract_title_from_filename(script_path)
            kdp_title = generate_kdp_title(i, story_title)

            writer.writerow([
                i,
                script_path,
                story_title,
                kdp_title,
                "A Calm Bedtime Story for Toddlers",
                "Children's eBooks > Bedtime & Dreams",
                "Children's eBooks > Animals > Mammals",
                "; ".join(generate_kdp_keywords()),
                "4.99",
                "70%",
                "Not uploaded",
            ])

    print(f"✅ CSV generated: {csv_file}")
    print(f"   {len(queue_lines)} episodes ready\n")

    # Create individual description files
    desc_dir = Path(__file__).parent / "kdp-descriptions"
    desc_dir.mkdir(exist_ok=True)

    for i, script_path in enumerate(queue_lines, 1):
        story_title = extract_title_from_filename(script_path)
        description = generate_kdp_description(story_title)

        safe_title = story_title.replace(" ", "-").lower()[:40]
        desc_file = desc_dir / f"ep{i:03d}-{safe_title}-description.txt"

        with open(desc_file, "w", encoding="utf-8") as f:
            f.write(description)

    print(f"✅ Descriptions generated: {desc_dir}")
    print(f"   {len(queue_lines)} description files ready\n")

    # Create upload guide
    guide_file = Path(__file__).parent / "AMAZON-KDP-BATCH-UPLOAD.md"
    guide_content = f"""# Amazon KDP Batch Upload Guide

**Total episodes to upload:** {len(queue_lines)}

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
- Metadata files: `{Path(__file__).parent}/amazon-kdp-batch.csv`
- Descriptions: `{Path(__file__).parent}/kdp-descriptions/`

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
"""

    with open(guide_file, "w") as f:
        f.write(guide_content)

    print(f"✅ Upload guide generated: {guide_file}\n")

    # Print summary
    print("=" * 80)
    print("📋 FILES READY FOR AMAZON KDP")
    print("=" * 80)
    print(f"""
✅ Batch CSV:              {csv_file}
   • {len(queue_lines)} episodes with titles, keywords, pricing
   • Copy/paste ready for KDP

✅ Description folder:     {desc_dir}/
   • {len(queue_lines)} individual description files
   • Copy one description per episode

✅ Upload guide:           {guide_file}
   • Step-by-step instructions
   • 5 min per episode
   • Timeline to upload all 149 books

TOTAL UPLOAD TIME: ~10 hours (spread over 4 weeks, 5 min/book)
ESTIMATED REVENUE: $500-2000/month within 2 months

Next step: Read {guide_file} and start uploading! 🚀
""")

if __name__ == "__main__":
    main()
