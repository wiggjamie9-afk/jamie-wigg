# Buddy Apps Freemium Tier — Implementation Reference

## What Was Changed

### Template Updates (`/apps/buddy-app-template.html`)

#### 1. Premium State Functions

```javascript
// Check if user has active premium (line ~527)
function isPremium() {
  const expiryStr = localStorage.getItem('premium_until');
  if (!expiryStr) return false;
  return new Date(expiryStr) > new Date();
}

// Activate premium on Gumroad redirect (line ~533)
function setPremium(email) {
  const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  localStorage.setItem('premium_until', expiryDate);
  if (email) localStorage.setItem('premium_email', email);
  window.history.replaceState({}, document.title, window.location.pathname);
  showToast('🎉 Thanks for upgrading! Premium activated.');
}
```

#### 2. Premium Badge in Navbar

```html
<!-- Home screen navbar (line ~289) -->
<h1 style="display: flex; align-items: center; gap: 8px;">
  <span class="emoji">{{BUDDY_EMOJI}}</span>{{BUDDY_NAME}}
  <span id="premium-badge">PRO</span>  <!-- Shows when isPremium() -->
</h1>
```

CSS for badge (line ~84):
```css
#premium-badge {
  font-size: 11px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  display: none;  /* Toggled by updatePremiumUI() */
}
```

#### 3. Upgrade Banner (Home Screen)

```html
<!-- Line ~311 -->
<div class="card" id="upgrade-banner" style="...">
  <h3>✨ Go Premium</h3>
  <p>Unlimited avatars, premium voices, mood export, and more.</p>
  <div id="upgrade-section">
    <button onclick="window.open('https://gumroad.com/l/buddy-premium-monthly', '_blank')">
      💳 $4.99/month
    </button>
    <button onclick="window.open('https://gumroad.com/l/buddy-premium-yearly', '_blank')">
      💳 $49.99/year (Save 17%)
    </button>
  </div>
  <div id="premium-active" style="display: none; ...">
    <p>✅ Premium Active</p>
  </div>
</div>
```

#### 4. Settings Screen Upgrade

```html
<!-- Line ~476 -->
<div class="card">
  <h3>🚀 Unlock Premium</h3>
  <p>Get unlimited avatars, premium voices, mood export, and more.</p>
  <div id="upgrade-section">
    <button onclick="window.open('https://gumroad.com/l/buddy-premium-monthly', '_blank')">
      💳 $4.99/month
    </button>
    <button onclick="window.open('https://gumroad.com/l/buddy-premium-yearly', '_blank')">
      💳 $49.99/year (Save 17%)
    </button>
  </div>
  <div id="premium-active" style="display: none; ...">
    <p>✅ Premium Active</p>
  </div>
</div>
```

#### 5. Avatar Generation (Gated)

```javascript
// Line ~800
async function generateAvatarStill() {
  if (!isPremium()) {
    alert('Avatar generation is a premium feature. Upgrade to unlock.');
    return;
  }
  // ... actual generation logic
}
```

#### 6. Voice Synthesis (Gated)

```javascript
// Line ~673
function speakText(text) {
  if (state.elevenLabsKey) {
    speakWithElevenLabs(text);
  } else {
    speakWithWebSpeech(text);
  }
}

// Line ~682
async function speakWithElevenLabs(text) {
  if (!isPremium()) {
    speakWithWebSpeech(text);  // Fallback for free users
    return;
  }
  // ... ElevenLabs API call
}
```

#### 7. Mood Export (Gated)

```javascript
// Line ~871
function exportMoodData(format) {
  if (!isPremium()) {
    alert('Export is a premium feature. Upgrade to unlock.');
    return;
  }
  // ... JSON/CSV generation and download
}
```

```html
<!-- Health tab export section (line ~375) -->
<div class="card">
  <h3>📊 Export Mood Tracking</h3>
  <p id="export-info">Upgrade to premium to export your mood tracking data.</p>
  <button onclick="exportMoodData('json')" id="export-json" style="display: none;">
    📥 Download as JSON
  </button>
  <button onclick="exportMoodData('csv')" id="export-csv" style="display: none;">
    📊 Download as CSV
  </button>
</div>
```

#### 8. Premium UI Update Function

```javascript
// Line ~908
function updatePremiumUI() {
  // Show/hide premium badge
  document.getElementById('premium-badge').style.display = isPremium() ? 'inline-block' : 'none';

  // Toggle upgrade banner visibility
  const upgradeSection = document.getElementById('upgrade-section');
  const premiumActive = document.getElementById('premium-active');
  if (upgradeSection && premiumActive) {
    if (isPremium()) {
      upgradeSection.style.display = 'none';
      premiumActive.style.display = 'block';
    } else {
      upgradeSection.style.display = 'block';
      premiumActive.style.display = 'none';
    }
  }

  // Toggle export buttons
  updateExportUI();
}

function updateExportUI() {
  const jsonBtn = document.getElementById('export-json');
  const csvBtn = document.getElementById('export-csv');
  const info = document.getElementById('export-info');
  if (jsonBtn && csvBtn && info) {
    if (isPremium()) {
      jsonBtn.style.display = 'block';
      csvBtn.style.display = 'block';
      info.textContent = '📊 Export your mood tracking data as JSON or CSV.';
    } else {
      jsonBtn.style.display = 'none';
      csvBtn.style.display = 'none';
      info.textContent = 'Upgrade to premium to export your mood tracking data.';
    }
  }
}
```

#### 9. Gumroad Redirect Handler

```javascript
// Line ~966 in init()
const params = new URLSearchParams(window.location.search);
if (params.get('premium') === 'true') {
  setPremium(params.get('email'));
}
```

This checks for `?premium=true&email=...` on page load and activates premium.

#### 10. Init Function

```javascript
// Line ~958
function init() {
  loadState();
  loadSettings();
  showGreeting();
  showAffirmation();
  renderChat();
  renderNotes();

  // Handle Gumroad redirect
  const params = new URLSearchParams(window.location.search);
  if (params.get('premium') === 'true') {
    setPremium(params.get('email'));
  }

  // Update premium UI
  updatePremiumUI();
}

window.addEventListener('load', init);
```

---

## How It Works: Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User opens buddy-1.html (free tier)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ init() runs on page load       │
        │ - updatePremiumUI()           │
        │ - Check Gumroad redirect      │
        └──────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   No premium param           ?premium=true found
        │                             │
        ▼                             ▼
┌──────────────────┐        ┌──────────────────┐
│ isPremium()      │        │ setPremium()     │
│ returns false    │        │ - Set expiry     │
│ (no localStorage)│        │ - Save email     │
└────────┬─────────┘        │ - Show toast     │
         │                  │ - Clear URL      │
         │                  └────────┬─────────┘
         │                           │
         ▼                           ▼
   Free UI State             Premium UI State
   - Premium badge hidden    - Premium badge visible
   - "Go Premium" shown      - "✅ Premium Active" shown
   - Avatar button unlocked  - Avatar button locked
   - Export buttons hidden   - Export buttons visible
   - Web Speech voice only   - ElevenLabs voice available
```

---

## localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `premium_until` | ISO date string | Expiry date for premium subscription |
| `premium_email` | Email string | User's email from Gumroad |
| `buddy-{ID}` | JSON object | User's buddy-specific data (chat, health, notes, avatars) |

### Example localStorage After Premium Purchase

```javascript
{
  "premium_until": "2027-06-15T14:30:00.000Z",
  "premium_email": "user@example.com",
  "buddy-1": {
    "name": "Zephyr",
    "chat": [...],
    "healthData": [...],
    "notes": [...],
    "mood": 7,
    "avatarUrl": "https://...",
    "avatarVideoUrl": "https://..."
  }
}
```

---

## Gumroad Integration

### Payment Flow

1. User clicks **"$4.99/month"** or **"$49.99/year"** button
2. Opens: `https://gumroad.com/l/buddy-premium-monthly` (or yearly) in new tab
3. Gumroad checkout page
4. User enters email + payment info
5. Gumroad processes payment
6. On success, Gumroad redirects to (example):
   ```
   https://rhythmixapp.com.au/apps/buddy-1.html?premium=true&email=user@example.com
   ```
7. Buddy app detects `?premium=true`, calls `setPremium(email)`
8. localStorage updated with 1-year expiry
9. `updatePremiumUI()` re-runs → premium badge appears
10. User can now use avatar, export, premium voice

### Gumroad Product Setup (One-Time)

1. Log in to `https://gumroad.com/dashboard`
2. Click **"+ New Product"**
3. **Product Name:** `50 Buddy Apps — Premium Tier`
4. **Pricing:**
   - Monthly: $4.99 (recurring subscription)
   - Yearly: $49.99 (recurring subscription)
   - Consider one-time license: $99 lifetime
5. **License Keys:** Not needed (we use redirect URL)
6. **After Purchase Redirect:** `https://rhythmixapp.com.au/apps/buddy-1.html?premium=true`
   - Gumroad will append `&email={email}` automatically
7. Copy the short links from the product page:
   - Monthly: `https://gumroad.com/l/buddy-premium-monthly`
   - Yearly: `https://gumroad.com/l/buddy-premium-yearly`
8. These are already hardcoded in all 50 buddy apps

---

## Verification Checklist

After deploying, verify:

- [ ] All 50 buddy files (`buddy-1.html` through `buddy-50.html`) exist in `/apps/`
- [ ] Each file contains `isPremium()` function
- [ ] Each file contains Gumroad links (search for `gumroad.com/l/buddy-premium`)
- [ ] Each file has `<span id="premium-badge">PRO</span>`
- [ ] Each file has avatar generation gate: `if (!isPremium())`
- [ ] Each file has export buttons hidden by default: `id="export-json"`, `id="export-csv"`
- [ ] Each file has `updatePremiumUI()` function
- [ ] Each file calls `updatePremiumUI()` in `init()`
- [ ] No `{{PLACEHOLDER}}` tokens remain (all buddy config replaced)

---

## Code Statistics

| Metric | Value |
|--------|-------|
| Files Updated | 50 buddy apps |
| New Functions | `isPremium()`, `setPremium()`, `updatePremiumUI()`, `updateExportUI()` |
| New UI Elements | Premium badge, upgrade banners (2x), export buttons (2x) |
| Gated Features | 3 (avatar, voice, export) |
| Lines of Code Added | ~150 (premium logic + UI updates) |
| Placeholders Replaced | 5 per file × 50 = 250 total |

---

## Troubleshooting

### Premium Badge Not Showing

1. Check DevTools → Application → localStorage
2. Verify `premium_until` key exists and has valid ISO date
3. Call `isPremium()` in DevTools console → should return `true` if date is in future
4. Check `updatePremiumUI()` is being called on init

### Gumroad Redirect Not Working

1. Verify Gumroad product is created and public
2. Check redirect URL is correctly configured in Gumroad dashboard
3. Inspect browser console for errors when opening payment link
4. Test with Stripe test card: `4242 4242 4242 4242`
5. Verify `?premium=true` param is present in redirect URL

### Export Buttons Not Appearing

1. Ensure user is premium: check localStorage `premium_until`
2. Call `updateExportUI()` manually in console to trigger UI update
3. Check that export buttons have `id="export-json"` and `id="export-csv"`
4. Verify `isPremium()` returns `true`

### Avatar Generation Still Locked

1. Confirm `isPremium()` returns `true` in console
2. Verify proxy URL is set in Settings (not needed for gate, but for actual generation)
3. Check that `generateAvatarStill()` is not being called before premium check

---

## Security Notes

- **No Backend Secrets:** All premium logic is client-side
- **localStorage is Not Secure:** Premium state can be edited by user in DevTools
  - This is acceptable for a freemium model (user can "cheat" but can't affect others)
  - For real security, add server-side verification with JWT tokens (future)
- **Email in localStorage:** User's email is not encrypted
  - It's only used for reference; no sensitive operations tied to it
  - Consider hashing in future if privacy is concern

---

Generated: 2026-06-15
