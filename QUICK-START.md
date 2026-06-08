# Quick Start — Sunny Ebook Sales Activation

**Get the ebooks selling in 10 minutes.**

## Right Now (This Moment)

1. **Gumroad Setup** (2 minutes)
   ```
   Visit: gumroad.com/settings/advanced
   Copy: "API Key"
   Go to: GitHub → wiggjamie9-afk/jamie-wigg
   → Settings → Secrets and variables → Actions
   → New repository secret
   
   Name: GUMROAD_API_KEY
   Value: [paste your key]
   Save
   ```

2. **Etsy Setup** (8 minutes)
   ```
   Visit: developers.etsy.com
   Click: "Create an App"
   Fill in:
   - App Name: "Sonny Ebook Uploader"
   - Description: "Automated ebook uploader"
   - Permission Scopes: Check ✓ listings_r, listings_w, inventory_r, shops_r
   
   Accept & Create
   
   Copy these 3 values:
   → API Key
   → API Secret (SAVE — ONLY SHOWN ONCE)
   → Shop ID (from your shop settings page)
   ```

3. **Add Etsy Secrets to GitHub** (3 minutes)
   ```
   GitHub → Settings → Secrets and variables → Actions
   
   Secret 1:
   Name: ETSY_API_KEY
   Value: [paste API key]
   
   Secret 2:
   Name: ETSY_API_SECRET
   Value: [paste API secret]
   
   Secret 3:
   Name: ETSY_SHOP_ID
   Value: [paste shop ID]
   
   Save all 3
   ```

## Test It (2 minutes)

```
GitHub → Actions → "Little Sunny — New Episode"
→ Run workflow → Confirm

Watch the logs — you'll see:
✓ [5f] Uploading ebook to Gumroad...
✓ [5g] Uploading ebook to Etsy...

Check your Gumroad & Etsy dashboards for new listings!
```

## Done! 

All future episodes automatically upload to both platforms.

---

## What's Happening Behind the Scenes

Every day at:
- 7:00 AM AEST
- 1:00 PM AEST  
- 7:00 PM AEST

The system:
1. Picks next episode from queue
2. Generates PDF ebook with professional cover
3. Auto-uploads to Gumroad ($3.99)
4. Auto-uploads to Etsy ($3.99)
5. Removes from queue for next time

All 149 episodes will eventually be listed on both platforms.

---

## If Something Goes Wrong

**Gumroad upload failing?**
- Verify API key is correct (check gumroad.com/settings/advanced)
- Check it's in GitHub Secrets correctly
- View workflow log for error details

**Etsy upload failing?**
- Verify all 3 secrets are set (API Key, Secret, Shop ID)
- Check API Secret is correct (it's only shown once in Etsy)
- Ensure Etsy shop is in good standing
- View workflow log for error details

**Need help?**
- Full setup guide: `SUNNY-DEPLOYMENT-STATUS.md`
- Platform-specific: `kids-channel/ebooks/ETSY-SETUP.md`
- General reference: `kids-channel/README-SETUP.md`

---

## Success Checklist

- [ ] Gumroad API key added to GitHub Secrets
- [ ] Etsy API key added to GitHub Secrets
- [ ] Etsy API secret added to GitHub Secrets
- [ ] Etsy Shop ID added to GitHub Secrets
- [ ] Workflow test run completed successfully
- [ ] New listing appears on Gumroad
- [ ] New listing appears on Etsy
- [ ] PDF ebook downloads correctly
- [ ] Sunny character looks good in ebook

**Timeline**: 10 minutes to activation, then automatic forever.
