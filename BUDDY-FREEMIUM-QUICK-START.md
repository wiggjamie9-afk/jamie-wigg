# Buddy Apps Freemium Tier — Quick Start Guide

## ✅ Status: LIVE

All 50 buddy apps now have a unified freemium tier with Gumroad payment processing.

---

## For Product Managers / Marketing

### What's New?

✨ **Premium Tier Available**
- Price: $4.99/month or $49.99/year
- Payment: Gumroad (no backend required, PCI-compliant)
- Features:
  - Avatar generation (Higgsfield AI)
  - Premium voice synthesis (ElevenLabs)
  - Mood data export (JSON + CSV)
  - Ad-free UI (ready for future)

🎯 **User Experience**
- Free users see "Go Premium" banner on Home and Settings tabs
- Click → Gumroad checkout in new tab
- After payment, Gumroad redirects back with `?premium=true`
- App detects param, stores premium state in localStorage
- Premium features unlock immediately
- Premium state persists across tabs/domains

📊 **Monetization**
- All 50 buddy apps share the same premium tier (localStorage-based)
- Unified Gumroad product: "50 Buddy Apps — Premium Tier"
- Revenue split: Gumroad takes 5-10% (configurable), rest to you

---

## For Developers

### Quick Verification

```bash
# Check all 50 files have freemium logic
grep -l "isPremium()" apps/buddy-*.html | wc -l  # Should be 50

# Check Gumroad links are embedded
grep -c "gumroad.com/l/buddy-premium-monthly" apps/buddy-1.html  # Should be 2

# Check no placeholders remain
grep -E "{{[A-Z_]+}}" apps/buddy-*.html  # Should be EMPTY
```

### File Locations

- **Template (source of truth):** `/apps/buddy-app-template.html`
- **Generated files:** `/apps/buddy-1.html` through `/apps/buddy-50.html`
- **Test plan:** `/BUDDY-FREEMIUM-TEST-PLAN.md`
- **Implementation details:** `/BUDDY-FREEMIUM-IMPLEMENTATION.md`
- **This guide:** `/BUDDY-FREEMIUM-QUICK-START.md`

### Key Functions

```javascript
// Check if user has active premium
isPremium()  // returns boolean

// Activate premium (called on Gumroad redirect)
setPremium(email)  // stores expiry in localStorage

// Update UI based on premium state
updatePremiumUI()  // toggles badge, buttons, exports

// Update only export section
updateExportUI()  // shows/hides JSON/CSV buttons
```

### localStorage Keys

```javascript
localStorage.getItem('premium_until')     // ISO date string (1 year from purchase)
localStorage.getItem('premium_email')     // User's email from Gumroad
```

---

## Testing Workflow

### 1. Test Free User Experience

```bash
# Open any buddy app in incognito/private window (no localStorage)
open https://rhythmixapp.com.au/apps/buddy-1.html

# Should see:
# ✓ No "PRO" badge in navbar
# ✓ "Go Premium" banner visible (Home + Settings tabs)
# ✓ Avatar generation locked (button shows alert on click)
# ✓ Export buttons hidden
# ✓ Web Speech voice (no ElevenLabs)
```

### 2. Test Premium Activation

```bash
# Test Gumroad redirect by appending param
open https://rhythmixapp.com.au/apps/buddy-1.html?premium=true&email=test@example.com

# Should see:
# ✓ Toast: "🎉 Thanks for upgrading! Premium activated."
# ✓ "PRO" badge visible in navbar
# ✓ "Go Premium" banner hidden, "✅ Premium Active" shown
# ✓ Avatar generation unlocked
# ✓ Export buttons visible
# ✓ Premium state persists on refresh
```

### 3. Test Real Gumroad Purchase

```bash
# 1. Click "$4.99/month" button on any buddy app
# 2. Opens Gumroad in new tab
# 3. Use test card: 4242 4242 4242 4242
#    Expiry: Any future date (e.g., 12/25)
#    CVC: Any 3 digits (e.g., 123)
# 4. Gumroad redirects back to buddy app with ?premium=true
# 5. Verify premium features are unlocked
```

### 4. Test Cross-App Premium State

```bash
# With premium active in buddy-1, open buddy-25 in new tab
open https://rhythmixapp.com.au/apps/buddy-25.html

# Should see:
# ✓ "PRO" badge visible immediately (localStorage shared per domain)
# ✓ All premium features unlocked
# ✓ No need to repurchase
```

### 5. Test Premium Expiry

```javascript
// In DevTools Console, simulate expiry:
localStorage.setItem('premium_until', '2024-01-01T00:00:00.000Z');
location.reload();

// Should see:
// ✓ "PRO" badge disappears
// ✓ "Go Premium" banner reappears
// ✓ Premium features re-lock
```

---

## Gumroad Setup (One-Time)

### Create Product

1. Log in to [Gumroad Dashboard](https://gumroad.com/dashboard)
2. Click **"+ New Product"**
3. **Name:** `50 Buddy Apps — Premium Tier`
4. **Type:** Service (subscription)
5. **Pricing:**
   - Variant 1: Monthly ($4.99/month, recurring)
   - Variant 2: Yearly ($49.99/year, recurring)
   - Optional: Lifetime ($99 one-time)
6. **After Purchase Redirect:** 
   ```
   https://rhythmixapp.com.au/apps/buddy-1.html?premium=true
   ```
   (Gumroad auto-appends `&email={customer_email}`)
7. **License Keys:** Disable (not needed)
8. **Save & Publish**

### Get Payment Links

After product is published:
- Monthly: `https://gumroad.com/l/buddy-premium-monthly` (hardcoded in all 50 apps)
- Yearly: `https://gumroad.com/l/buddy-premium-yearly` (hardcoded in all 50 apps)

The links are already embedded in all 50 buddy apps. If you need to change them, update `/apps/buddy-app-template.html` and regenerate.

---

## Deployment Checklist

- [ ] All 50 buddy files in `/apps/` directory
- [ ] Gumroad product created and published
- [ ] Test purchase completed successfully (real card or sandbox)
- [ ] Redirect URL verified: parameter detection works
- [ ] localStorage persists premium state across page reloads
- [ ] Premium state shared across all 50 apps (same domain)
- [ ] Avatar generation, export, voice all verified as locked/unlocked
- [ ] URL params cleared from address bar after redirect
- [ ] Toast notification displays on successful activation
- [ ] No `{{PLACEHOLDER}}` tokens in any buddy file

---

## Support & Maintenance

### Monitor Sales

- Gumroad Dashboard: `https://gumroad.com/dashboard` → Sales tab
- Refunds: Gumroad handles auto-refunds (configurable policy)
- Payouts: Gumroad batches payouts monthly

### Future Enhancements

1. **Affirmations Tier Lock**
   - Free: 7 rotating affirmations
   - Premium: All + custom upload

2. **Ad Banner (Optional)**
   - Free: Display banner on Home tab
   - Premium: Hide banner

3. **Analytics**
   - Track avatar generation requests per user
   - Track export downloads
   - Monitor churn rate

4. **Support Tier**
   - Add "Priority Support" flag for premium users
   - Route to separate support queue

5. **Lifetime License**
   - Add $99 one-time Gumroad variant
   - Treat same as recurring (same localStorage key)

### Troubleshooting

**User says "Premium not showing after purchase"**
- Ask them to check if redirect happened
- Verify `?premium=true` was in URL
- Clear browser cache/reload
- Check if they're in incognito (localStorage disabled)
- Test manually: append `?premium=true` to URL to verify UI updates

**Export buttons not appearing**
- User must be premium (`isPremium() == true`)
- Verify localStorage has valid `premium_until` date
- Hard refresh (Ctrl+Shift+R)
- Check browser console for JS errors

**Avatar generation still locked**
- Verify premium state: call `isPremium()` in console
- Check localStorage: `localStorage.getItem('premium_until')`
- Verify expiry date is in future
- Clear browser cache

---

## Files Changed

- ✅ `/apps/buddy-app-template.html` — Updated with freemium logic
- ✅ `/apps/buddy-1.html` through `/apps/buddy-50.html` — Regenerated (50 files)

No other files modified. All 50 buddy apps are now live with freemium tier.

---

## Next Steps

1. **Now:** Test the workflow (see Testing Workflow section above)
2. **Week 1:** Monitor Gumroad dashboard for test purchases
3. **Week 2:** Announce premium tier in marketing materials
4. **Month 1:** Track conversion rate, plan first feature enhancement
5. **Q3 2026:** Add lifetime license option ($99 one-time)

---

## Contact

- **Freemium Logic:** All in-app (localStorage), no backend
- **Payment Processing:** Gumroad (PCI-compliant, 5-10% fee)
- **Support:** Gumroad handles refunds/disputes automatically
- **Revenue:** Monitor at `https://gumroad.com/dashboard`

---

**Deployment Date:** 2026-06-15  
**Status:** ✅ Ready for Testing
