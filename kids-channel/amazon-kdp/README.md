# Amazon KDP — Upload Package (Sunny the Quokka, Books 1–35)

Everything you need to publish all 35 books on Amazon Kindle. Each book is a
fixed-layout children's picture book (eBook).

## How to publish one book (repeat for each)
1. Go to https://kdp.amazon.com → Bookshelf → **Create** → **Kindle eBook**.
2. Open that book's sheet in this folder (e.g. `book34-dolphin-KDP.txt`).
3. **Details tab:** copy Title, Subtitle, Series, Author, Description, keywords, categories.
   - Answer the AI-content question truthfully (AI-generated images + AI-assisted text, reviewed by you).
4. **Content tab:** upload the eBook (`bookN/redesign/*.epub`) and the cover
   (`kdp-covers/book0N-kdp-cover.jpg`). Preview all pages.
5. **Pricing tab:** 70% royalty, US$2.99. Optionally enroll in KDP Select.
6. Publish. (First-time only: complete the KDP tax interview + bank details.)

## Series setup (do once)
Create the series **"Sonny's Cozy Quokka Bedtime Tales"** so all 35 link together.

## Files
- `_MASTER-INDEX.csv` — every book, its eBook file, cover file, and price.
- `book01…book35 …-KDP.txt` — one metadata sheet per book (copy-paste ready).
- eBooks live in each `bookN/redesign/*.epub`; covers in `kdp-covers/`.
- Full step-by-step walkthrough: `../AMAZON-KDP-GUIDE.md`.

All 35 eBooks are validated (fixed-layout, author Jamie Wigg, cover flagged,
all pages present) and all covers are 1600×2560 — they meet KDP's requirements.
