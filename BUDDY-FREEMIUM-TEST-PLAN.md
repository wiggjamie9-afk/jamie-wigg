# Buddy Apps Freemium Tier — Test Plan

## Deployment Summary

**Status:** ✅ Complete — All 50 buddy apps regenerated with freemium logic.

- Files: `/home/user/jamie-wigg/apps/buddy-1.html` through `buddy-50.html`
- Template source: `/home/user/jamie-wigg/apps/buddy-app-template.html`
- All 50 apps now share the same unified premium tier (localStorage-based)

---

## Architecture Overview

### Premium State Management

```javascript
// Check if user has active premium
isPremium() // checks localStorage.premium_until > now

// Activate premium (called on Gumroad redirect)
setPremium(email) // sets premium_until to 1 year from now
```

### Gumroad Integration

- **Product Links:**
  - Monthly: `https://gumroad.com/l/buddy-premium-monthly` ($4.99/mo)
  - Yearly: `https://gumroad.com/l/buddy-premium-yearly` ($49.99/yr)
- **Redirect URL:** `https://rhythmixapp.com.au/apps/buddy-1.html?premium=true&email=user@example.com`
- **Note:** All 50 buddy apps use the same Gumroad product links (shared premium tier)

### Premium Features

1. **Avatar Generation** (`generateAvatarStill()`)
   - Gated: `if (!isPremium()) { alert('...'); return; }`
   - Uses Higgsfield Soul API via proxy
   - Free users get error message to upgrade

2. **ElevenLabs Voice** (`speakWithElevenLabs()`)
   - Gated: only called if `isPremium()` and elevenLabsKey exists
   - Falls back to Web Speech API for free users
   - Free users get acceptable TTS via browser Web Speech

3. **Mood Export** (`exportMoodData()`)
   - Gated: `if (!isPremium()) { alert('...'); return; }`
   - Two formats: JSON and CSV
   - Free users see info text: "Upgrade to premium to export..."
   - Premium users see active download buttons

4. **UI Enhancements (Premium Badge)**
   - Golden badge in navbar: `<span id="premium-badge">PRO</span>`
   - Displays `display: inline-block` when `isPremium()` is true
   - Visibility updated in `updatePremiumUI()`

5. **Affirmations** (Future-Ready)
   - Currently rotates through all affirmations for all users
   - Logic in place to limit free tier to rotating subset (easy to toggle)

---

## Test Checklist

### 1. Landing & Initial State (Free User)

- [ ] Open `/apps/buddy-1.html` in fresh private/incognito window
- [ ] Check navbar: **no "PRO" badge** visible
- [ ] Home tab: **"Go Premium" card visible** with two payment buttons
- [ ] Settings tab: **"🚀 Unlock Premium" card visible**
- [ ] Health tab: **Mood export buttons hidden**, info text says "Upgrade to premium..."
- [ ] Settings tab: Avatar Studio **"Generate Face" button clickable**

### 2. Avatar Generation (Locked Feature)

- [ ] Click **"Generate Face"** button in Settings tab
- [ ] Expect popup: **"Avatar generation is a premium feature. Upgrade to unlock."**
- [ ] Premium badge should still be absent

### 3. Voice TTS (Falls Back)

- [ ] In Chat tab, check `<input type="checkbox" id="use-tts">`
- [ ] Set Claude API key in Settings (required for chat)
- [ ] Send a chat message
- [ ] Check "Speak response aloud"
- [ ] Expected: **Web Speech API** response (browser voice, not ElevenLabs)
- [ ] No error; fallback working

### 4. Mood Export (Locked Feature)

- [ ] Add at least one mood entry via Health tab → "Manual Health Input"
- [ ] Click **"Download as JSON"** or **"Download as CSV"**
- [ ] Expect popup: **"Export is a premium feature. Upgrade to unlock."**

### 5. Gumroad Redirect Flow (Test Purchase)

- [ ] Click **"$4.99/month"** button (opens Gumroad in new tab)
- [ ] On Gumroad: use test card `4242 4242 4242 4242` (Stripe sandbox)
- [ ] Complete checkout
- [ ] Gumroad redirects to: `https://rhythmixapp.com.au/apps/buddy-1.html?premium=true&email=test@example.com`
- [ ] **Expect:** Toast notification "🎉 Thanks for upgrading! Premium activated."
- [ ] Check localStorage: `premium_until` should be ~1 year from now
- [ ] Check localStorage: `premium_email` should be `test@example.com`

### 6. Premium Active State

After successful Gumroad redirect:

- [ ] Navbar: **"PRO" badge now visible** (golden)
- [ ] Home tab: **"Go Premium" card hidden**, "✅ Premium Active" message shown
- [ ] Settings tab: **"Unlock Premium" card hidden**, "✅ Premium Active" message shown
- [ ] Health tab: **Export buttons now visible**, info text updated to "📊 Export your mood tracking..."
- [ ] **Refresh page** → premium state **persists** (checks localStorage)

### 7. Avatar Generation (Unlocked)

- [ ] In Settings, click **"Generate Face"**
- [ ] If proxy URL configured: avatar generates (or shows proxy error)
- [ ] If proxy URL not set: error about proxy, but **no auth failure**
- [ ] Premium check passed (feature no longer blocked)

### 8. Voice TTS (Premium)

- [ ] Set ElevenLabs API key in Settings
- [ ] Send chat message with "Speak response aloud" checked
- [ ] Expected: **ElevenLabs voice** response (higher quality)
- [ ] Fallback does NOT trigger (because premium + key both present)

### 9. Mood Export (Unlocked)

- [ ] Click **"Download as JSON"**
- [ ] Browser downloads file: `mood-tracking-2026-06-15.json`
- [ ] File contains: `[{"bpm": <number>, "mood": <1-10>, "timestamp": "..."}]`
- [ ] Click **"Download as CSV"**
- [ ] Browser downloads file: `mood-tracking-2026-06-15.csv`
- [ ] CSV has header: `Timestamp,Heart Rate (bpm),Mood`

### 10. Cross-App Premium State

- [ ] With premium active in `buddy-1.html`, open `buddy-25.html` in new tab
- [ ] Expect: **"PRO" badge visible immediately** (localStorage is per-domain, shared)
- [ ] Expected: All premium features unlocked in `buddy-25.html` as well
- [ ] This proves **unified premium tier** across all 50 apps

### 11. Premium Expiry Simulation

- [ ] Open DevTools → Application → localStorage
- [ ] Find `premium_until` entry
- [ ] Edit value to past date (e.g., `2024-01-01T00:00:00.000Z`)
- [ ] Refresh page
- [ ] Expected: **"PRO" badge disappears**
- [ ] Expected: Premium features re-lock
- [ ] Expected: "Go Premium" card reappears on Home

### 12. Multiple Apps (Spot Check)

Test 3-5 random apps to ensure consistency:

- [ ] `buddy-5.html` — has Gumroad links, isPremium() logic
- [ ] `buddy-30.html` — avatar generation gated, export buttons present
- [ ] `buddy-45.html` — premium badge and UI updates work
- [ ] `buddy-50.html` — full freemium flow operable

Each should have:
- ✅ Two Gumroad payment buttons (same links)
- ✅ Avatar generation gated
- ✅ Export buttons hidden until premium
- ✅ Premium badge toggles correctly

---

## Deployment Instructions

### For Users (Marketing)

1. **Buddy apps are live:** `rhythmixapp.com.au/apps/buddy-1.html` through `buddy-50.html`
2. **Free tier features:**
   - Chat with Claude AI
   - Health monitoring (heart rate, manual input)
   - Mood tracking (local storage)
   - Web Speech voice synthesis
   - All affirmations (rotating)
   - Notes
3. **Premium tier ($4.99/mo or $49.99/yr):**
   - Avatar generation (Higgsfield)
   - ElevenLabs premium voice (higher quality)
   - Mood data export (JSON + CSV)
   - Ad-free (future: remove banners)

### For Development

1. **Gumroad Setup** (one-time):
   - Log in to Gumroad
   - Create product: "50 Buddy Apps — Premium Tier"
   - Set prices: $4.99/mo and $49.99/yr variants
   - Set redirect URL: `https://rhythmixapp.com.au/apps/buddy-{%@}.html?premium=true`
   - Note the product IDs / short links
   - Update the links in all 50 files if needed (currently hardcoded)

2. **Testing:**
   - Use Gumroad sandbox (Stripe test card `4242 4242 4242 4242`)
   - Verify redirect brings `?premium=true&email=` params
   - Test localStorage persistence

3. **Monitoring:**
   - Monitor Gumroad dashboard for sales/refunds
   - Consider adding analytics to track avatar/export feature usage
   - Plan for premium-exclusive features in future updates

---

## Future Enhancements

1. **Affirmations Tier Limit**
   - Free: 7 rotating affirmations
   - Premium: All affirmations + custom

2. **Ad-Free UI**
   - Free: Optional banner ads (not yet implemented)
   - Premium: Clean UI (already implemented)

3. **Priority Support**
   - Add support flag in settings
   - Route premium users to priority queue

4. **Analytics**
   - Track avatar generation requests per user
   - Track export usage
   - Track premium churn

5. **One-Time Purchase Option**
   - Gumroad supports one-time + recurring
   - Consider lifetime license ($99 one-time)

---

## Notes

- **No Backend Required:** All premium logic is client-side (localStorage)
- **PCI Compliance:** Gumroad handles all payment processing
- **Privacy:** Premium email stored in localStorage (user's device, not our servers)
- **Offline Support:** Premium check works offline (if premium_until is in localStorage)
- **Cross-App Sharing:** Premium tier is tied to domain (all 50 buddy apps share it)
- **No Email Verification:** Gumroad email param is for receipts; no verification needed in app

---

## Success Criteria

✅ **Checklist for "Go Live"**

- [ ] All 50 buddy apps regenerated with freemium logic
- [ ] Gumroad product created and payment links embedded
- [ ] Test purchase completed successfully
- [ ] Premium features verified locked/unlocked correctly
- [ ] localStorage premium state persists across page reloads
- [ ] Premium state shared across all 50 buddy apps (per domain)
- [ ] URL param handler clears `?premium=true` from address bar
- [ ] Toast notification shows on successful activation
- [ ] No `{{PLACEHOLDER}}` tokens remain in any file
- [ ] Cross-app premium check verified (open buddy-1 and buddy-25, both show premium badge)

---

## Contact & Support

- **Premium Product:** `https://gumroad.com/l/buddy-premium-monthly` / `https://gumroad.com/l/buddy-premium-yearly`
- **Support Email:** (Gumroad default: creator@gumroad.com)
- **Analytics:** Gumroad dashboard

---

Generated: 2026-06-15
