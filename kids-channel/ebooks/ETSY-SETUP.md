# Etsy Shop Setup for Sunny Ebooks

## Step 1: Create an Etsy Shop (if not already done)

1. Go to [etsy.com](https://etsy.com)
2. Click "Sell on Etsy" (top right)
3. Create shop if you don't have one
4. Fill in shop name: "Sonny's Cozy Quokka Bedtime Tales"
5. Add shop section: "Illustrated Ebooks" or "Children's Books"

## Step 2: Create Etsy API App

1. Go to [Etsy Developer Portal](https://www.etsy.com/developers)
2. Click "Create an App"
3. Fill in the form:
   - **App Name**: "Sonny Ebook Uploader"
   - **App Description**: "Automated ebook upload system for Sonny bedtime stories"
   - **App URL**: `https://rhythmixapp.com.au` (or your domain)
   - **Permission Scopes** (select):
     - `listings_r` (Read listings)
     - `listings_w` (Write/Create listings)
     - `listings_d` (Delete listings)
     - `inventory_r` (Read inventory)
     - `inventory_w` (Write inventory)
     - `shops_r` (Read shop info)

4. Accept the Developer Terms
5. Click "Create App"

## Step 3: Get API Credentials

After creating the app, you'll see:
- **API Key** (copy this)
- **API Secret** (copy this - only shown once!)
- **Shop ID** (found in your Etsy shop settings, or visible in your shop URL)

## Step 4: Add GitHub Secrets

Go to GitHub repo → Settings → Secrets and Variables → Actions

Add these secrets:
- `ETSY_API_KEY` → paste your API Key
- `ETSY_API_SECRET` → paste your API Secret  
- `ETSY_SHOP_ID` → your numeric shop ID

## Step 5: Etsy Shop Settings

1. Go to your Etsy shop → Shop Settings → Info & Appearance
2. Set shop currency to USD
3. Configure shipping (mark as "Digital Download - No Shipping Required")
4. Set up payment methods

## Listing Template

Each ebook listing will auto-populate with:

**Title**: "Sonny's Cozy Quokka Bedtime Tales — {Episode Title}"

**Description**:
```
Sonny's Cozy Quokka Bedtime Tales — Premium Illustrated Ebook

Join Sonny the little quokka on a gentle adventure through the 
Australian bush at bedtime. Perfect for ages 1-5.

📖 Inside this illustrated picture book:
• 12-14 beautiful watercolour scenes
• Full story text (perfect for reading aloud)
• Professional children's book artwork
• Calming, cosy bedtime story
• 10+ minutes of reading time

⭐ This is a digital PDF file (not a physical book)
Download immediately after purchase.

— By Jamie Wigg
```

**Price**: $3.99 USD (or your preference)
**Category**: Digital Downloads → Ebooks
**Format**: PDF (Digital Download)

## Testing

Once set up, the next episode generation will:
1. Create the PDF ebook
2. Auto-upload to Etsy as a new listing
3. Set price to $3.99
4. Configure as digital download
5. Make it ready for sale

## Notes

- Etsy takes 6.5% transaction fee + 3% payment processing
- Listings appear in search within 24-48 hours
- You can manage/update listings from Etsy dashboard anytime
- Prices can be adjusted per-listing in Etsy dashboard
- Link products together in Etsy for cross-promotion

## Troubleshooting

If upload fails:
1. Check API credentials are correct in GitHub Secrets
2. Verify shop is in good standing (no suspended listings)
3. Check file size isn't over Etsy's limit (typically files must be < 20MB)
4. Ensure at least one shop section is created

## Future: Bulk Upload Existing Ebooks

Once set up, we can upload all 149 existing ebooks in a batch:

```bash
python kids-channel/etsy-bulk-upload.py
```

This will create 149 listings from your existing PDF files.
