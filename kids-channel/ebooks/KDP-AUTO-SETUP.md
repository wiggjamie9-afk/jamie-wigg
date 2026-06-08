# Amazon KDP Automatic Upload Setup

**Fully automated ebook uploads to Amazon Kindle Direct Publishing.**

## How It Works

1. **Daily Episode Generation**: Each episode generates a PDF ebook
2. **Auto-Queue to KDP**: Ebook is added to KDP upload queue
3. **Batch Upload Job**: Weekly (or on-demand) process uploads queued ebooks
4. **Automated Listing**: KDP creates product listings automatically
5. **Sales Tracking**: Monitor sales in your KDP dashboard

---

## Setup (One-Time, 5 minutes)

### Step 1: Get Your Amazon Credentials

1. Go to: https://kdp.amazon.com
2. Sign in with your Amazon account (create one if needed)
3. Copy your **email address** (the one you use to log in)
4. Note your **password**

⚠️ **Security Note**: These credentials will be stored securely in GitHub Secrets (encrypted).

### Step 2: Add GitHub Secrets

1. Go to: https://github.com/wiggjamie9-afk/jamie-wigg
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add 2 secrets:

```
Name: AMAZON_KDP_EMAIL
Value: [your Amazon email address]
```

```
Name: AMAZON_KDP_PASSWORD
Value: [your Amazon password]
```

**Note**: Use your actual password. GitHub Secrets are encrypted. Change your password later if concerned.

### Step 3: Verify Setup

Once secrets are added, the system is ready:

- ✅ Each episode auto-queues to KDP
- ✅ Weekly batch job uploads queued ebooks
- ✅ Manual uploads available on-demand

---

## How to Use

### Manual Upload (Right Now)

```bash
# From repo root
python3 kids-channel/ebooks/kdp-auto-upload.py
```

**Note**: Requires environment variables set:
```bash
export AMAZON_KDP_EMAIL="your@email.com"
export AMAZON_KDP_PASSWORD="your_password"
```

### Automatic Uploads (Scheduled)

1. **Add GitHub Secrets** (see Setup above)
2. **Done!** System automatically:
   - Queues each episode to KDP when generated
   - Uploads on Sundays at 1 AM UTC (weekly)
   - Can be triggered manually anytime via GitHub Actions

### Manual Trigger (Anytime)

1. Go to: GitHub → Actions → "Amazon KDP Batch Upload"
2. Click **Run workflow**
3. Optional: Set number of episodes to upload
4. Monitor upload progress

---

## Status & Monitoring

### Check Queue Status
```bash
# View queued episodes
cat kids-channel/ebooks/.kdp-upload-queue.json
```

### Check Upload History
1. GitHub → Actions → "Amazon KDP Batch Upload"
2. View recent runs and logs

### Track on KDP
1. Go to: https://kdp.amazon.com/bookshelf
2. See all uploaded ebooks
3. Monitor sales and earnings

---

## Pricing Configuration

All ebooks automatically price at:

```
Price: $4.99 USD
Royalty: 70% (you earn ~$2.49 per sale)
Currency: USD
Territory: All territories
```

Change pricing anytime in KDP dashboard for individual books.

---

## FAQ

**Q: How long does upload take?**
A: ~5-10 minutes per ebook. Full batch (149 books) takes 2-3 hours.

**Q: Can I pause uploads?**
A: Yes. Don't trigger the workflow, and queued items won't be processed.

**Q: Can I upload to multiple territories?**
A: Yes. In KDP dashboard, manage territories per listing.

**Q: What if upload fails?**
A: Failed items stay in queue. Manual retry available.

**Q: Can I bulk-edit prices?**
A: Yes. KDP dashboard allows bulk price changes.

---

## Troubleshooting

### Uploads Not Starting
```
Check:
1. GitHub Secrets are set (AMAZON_KDP_EMAIL, AMAZON_KDP_PASSWORD)
2. No login errors in workflow logs
3. Try manual trigger: GitHub Actions → Run workflow
```

### "Invalid credentials"
```
Verify:
1. Email is correct (check Amazon account)
2. Password is correct (try logging in manually)
3. No special characters in password causing issues
4. Account not locked (try logging in at kdp.amazon.com)
```

### "PDF upload failed"
```
Check:
1. PDF file exists in episode directory
2. PDF file size < 100MB
3. PDF is valid (can open locally)
4. Try manual upload to KDP (test upload)
```

### "Publishing failed"
```
Check:
1. Book title not duplicate
2. ISBN (if provided) not taken
3. No copyright issues (original content)
4. Check KDP notifications for specific error
```

---

## Advanced

### Custom Pricing Strategy

Edit `amazon-kdp-batch.csv` to use different prices per episode:

```csv
Episode #,... Price (USD) ...
1,... 3.99 ...
2,... 4.99 ...
3,... 5.99 ...
```

Then re-run uploader.

### Upload Specific Episodes

Edit `.kdp-upload-queue.json` to remove unwanted episodes before running uploader.

### Monitor Upload Progress

Check logs in GitHub Actions:
```
GitHub → Actions → Amazon KDP Batch Upload → [latest run]
```

---

## Revenue Calculation

**Per-Book Revenue** (at $4.99, 70% royalty):
- Amazon takes: $1.50 (30%)
- You get: $2.49 (70%)

**Full Catalog Potential** (149 books):
```
Conservative (10% sell rate):
149 books × $2.49 × 10% = $37 monthly

Moderate (25% sell rate):
149 books × $2.49 × 25% = $93 monthly

Optimistic (50% sell rate):
149 books × $2.49 × 50% = $186 monthly
```

**Growing Revenue**: As more books sell and get reviews, sales typically increase 2-3x over time.

---

## Support

- **KDP Help**: https://kdp.amazon.com/help
- **Troubleshooting**: Check GitHub Actions logs
- **Upload Queue**: `kids-channel/ebooks/.kdp-upload-queue.json`
- **Batch CSV**: `kids-channel/ebooks/amazon-kdp-batch.csv`

---

## What's Happening Behind the Scenes

1. **Episode Generated** → PDF ebook created with cover
2. **Queue Entry Added** → `.kdp-upload-queue.json` updated
3. **Weekly Job Runs** → Reads queue, processes all pending
4. **Browser Automation** → Logs into KDP, fills forms, uploads
5. **Listing Created** → New ebook appears in KDP catalog
6. **Queue Updated** → Successful uploads marked as "completed"

All fully automated. You just watch the sales come in! 📚💰
