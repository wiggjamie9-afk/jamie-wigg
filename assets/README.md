# Google Play Store Submission Materials

This directory contains all compliance-ready submission materials for the 28 RHYTHMIX apps on Google Play Store.

## 📁 Directory Structure

```
assets/
├── store-listings.csv                    # Master CSV with all 28 apps (columns: package_name, title, descriptions, category, rating, audience)
├── descriptions/
│   ├── dreams_full.txt                   # Full descriptions (4000 char limit) for each app
│   ├── hum_full.txt
│   ├── live_full.txt
│   ├── ... (28 total)
├── PRIVACY_POLICY_TEMPLATE.txt           # Generic privacy policy template (customise per app)
├── TERMS_OF_SERVICE_TEMPLATE.txt         # Generic ToS template (customise per app)
├── SUPPORT_CONTACT.txt                   # Support email, contact info, FAQ, and escalation procedures
└── README.md                             # This file
```

## 📋 Master Listing CSV

**File:** `store-listings.csv`

Contains all 28 apps with the following columns:
- `package_name` — Unique identifier (e.g., com.rhythmix.dreams)
- `app_title` — Max 50 characters (Play Store limit)
- `short_description` — Max 80 characters for store card preview
- `full_description` — Max 4000 characters (compliance-ready)
- `category` — PRODUCTIVITY, HEALTH_AND_FITNESS, MUSIC_AND_AUDIO, SPORTS, FINANCE, PHOTOGRAPHY
- `content_rating` — UNRATED (default for most), 13+, 18+ if applicable
- `target_audience` — 2–3 sentences describing ideal user

**How to use:**
1. Import CSV into Google Play Console for bulk upload
2. Each row represents one app submission
3. All text is Google Play-compliant and tested for keyword stuffing
4. Short descriptions are under 80 chars (fits on store card)
5. Full descriptions include: Value Prop, Features, Target Audience, Pricing, Privacy, Accessibility, Support

## 📄 Full Description Files

**Location:** `descriptions/[app-slug]_full.txt`

Each file includes (4000-char compliant):

1. **Value Proposition** (200 words)
   - What problem does it solve?
   - Who is it for?

2. **Key Features** (500 words, bullet list)
   - 5–10 main features with brief descriptions

3. **Target Audience** (100 words)
   - Demographic and psychographic profile
   - Use cases and pain points

4. **Pricing** (50 words)
   - One-time, subscription, free tier, optional premium
   - Clear pricing statement

5. **Privacy Statement** (150 words)
   - Data collection (what we do and don't collect)
   - Offline-first architecture
   - No tracking, no telemetry

6. **Accessibility** (100 words)
   - Screen reader support
   - High-contrast modes
   - Customisable text sizes
   - Haptic feedback

7. **Technical Details** (100 words)
   - Compatibility: iOS/Android versions
   - Storage requirements
   - Permissions needed

8. **Installation / Quick Start** (100 words)
   - Step-by-step first-time use

9. **Support** (50 words)
   - Email, website, community links

10. **Disclaimer** (150 words)
    - Medical/legal disclaimers (where applicable)
    - What the app is NOT
    - When to consult professionals

### App Slugs (28 Total)

**Core Apps (10):**
- `dreams` — Sleep ritual with breath pacing and soundscape
- `hum` — Daily humming practice with coherence breath
- `live` — AI music video generator
- `resonate` — Generative music synced to heartbeat
- `roomtone` — Real-time hearing aid EQ tuner
- `resonance` — Frequency healing and cardiac coherence
- `frequency` — Binaural tones and breath pacing
- `codex` — Live HRV coherence and Tesla biofeedback
- `reset` — Recovery tracking for team sport athletes
- `herdcheck` — Dairy farm screening and animal health

**Trending Apps (10):**
- `focus` — Adaptive Pomodoro with body doubling ($4.99/month)
- `drift` — AI sleep debt calculator ($5.99/month)
- `pulse` — Habit tracker with GitHub-style heatmaps ($3.99/month)
- `trim` — Subscription cancellation and renewal tracker ($3.99 once)
- `scan` — Receipt scanner and tax filing helper ($4.99 once)
- `glow` — Skincare routine and ingredient scanner ($3.99 once)
- `macro` — Photo-first nutrition tracker ($4.99 once)
- `lapse` — Private daily photo journal ($2.99 once)
- `hype` — AI morning affirmations ($2.99 once)
- `vault` — Biometric-locked private notes ($4.99 once)

**Untapped Portfolio Apps (8):**
- `axle` — Freelance invoice and project manager
- `docket` — Legal document and contract manager
- `herd` — Livestock herd management system
- `lull` — Ambient sleep soundtrack generator
- `plumb` — Plumbing job estimator and invoice tool
- `rack` — Server and network asset management
- `sole` — Footwear fit and comfort tracker
- `spot` — Site inspection and defect logger
- `stack` — Personal finance net-worth calculator

## 🔒 Privacy Policy Template

**File:** `PRIVACY_POLICY_TEMPLATE.txt`

Generic, compliance-ready template covering:
- Data collection (none, except local storage)
- Third-party integrations (Replicate, Apple Health, Google Fit, etc.)
- GDPR compliance (EU users)
- CCPA compliance (California users)
- Data retention and deletion
- User rights
- Security measures

**How to use:**
1. Copy template for each app
2. Replace `[BRACKETS]` with app-specific details:
   - `[APP_NAME]` → app title
   - `[APP-SPECIFIC DATA]` → what the app tracks (e.g., "daily habit logs")
   - `[OPTIONAL PERMISSION DATA]` → camera, microphone, location (if applicable)
   - `[DATE]` → publish date
   - `[REGION/COUNTRY]` → your jurisdiction
3. Submit one privacy policy per app in Google Play Console

## 📜 Terms of Service Template

**File:** `TERMS_OF_SERVICE_TEMPLATE.txt`

Comprehensive ToS covering:
- License grant (non-exclusive, personal use)
- User responsibilities and prohibited conduct
- Warranty disclaimer (APP AS-IS)
- Limitation of liability
- Refund policy
- Subscription terms (auto-renewal, cancellation)
- Intellectual property rights
- Termination conditions
- Dispute resolution

**How to use:**
1. Copy template for each app
2. Customise placeholders:
   - `[APP_NAME]` → app title
   - `[COUNTRY/STATE]` → jurisdiction
   - `[COMPANY_NAME]` → RHYTHMIX Inc.
   - `[PRICE]` → subscription/purchase amount
   - `[PAYMENT PROVIDER]` → Apple/Google
   - `[FEATURE]` → specific features with third-party integrations
3. Submit one ToS per app (optional but recommended for paid apps)

## ☎️ Support Contact & FAQ

**File:** `SUPPORT_CONTACT.txt`

Includes:
- Primary contact: `support@rhythmixapp.com.au`
- Website: `https://rhythmixapp.com.au`
- Social media: Instagram, Twitter, TikTok, Discord
- Response times by category (3–15 days)
- FAQs for common issues
- Bug reporting template
- Accessibility support procedures
- Security disclosure process
- Responsible disclosure policy

**How to use:**
1. Include support email in app store listing (visible to users)
2. Link to full support page from within app
3. Use FAQ section in app's help screen
4. Follow escalation procedures for serious issues

## 🎯 Google Play Submission Checklist

Before uploading each app:

### Content Compliance
- [ ] App title ≤ 50 characters
- [ ] Short description ≤ 80 characters
- [ ] Full description ≤ 4000 characters
- [ ] No keyword stuffing or deceptive claims
- [ ] No false health/medical claims (unless FDA-cleared)
- [ ] No misleading "free" labels if includes in-app purchases
- [ ] Privacy policy is clear and accurate
- [ ] Terms of Service present for paid/subscription apps

### Privacy & Data
- [ ] Privacy policy discloses all data collection
- [ ] GDPR compliance statement (if targeting EU)
- [ ] CCPA compliance statement (if targeting California)
- [ ] Biometric data handling disclosed
- [ ] Third-party service privacy disclosed
- [ ] No tracking of children under 13 (COPPA)

### Accessibility
- [ ] App supports Android accessibility features (TalkBack, etc.)
- [ ] High-contrast mode or dark mode available
- [ ] Text sizes customisable
- [ ] Descriptions include accessibility features
- [ ] Contact for accessibility issues provided

### Permissions
- [ ] Only requested permissions absolutely necessary
- [ ] Camera/microphone permission justified in description
- [ ] Location permission justified
- [ ] Biometric (fingerprint/face) permission disclosed
- [ ] Rationale for each permission is clear

### Metadata & Graphics
- [ ] App icon: 512×512 PNG (transparent or opaque background)
- [ ] Feature graphic: 1024×500 PNG (landscape banner)
- [ ] Screenshots: 4–8 images, 16:9 or 9:16 aspect ratio, max 8 MB each
- [ ] Promo video: MP4, optional (20–30 sec, shows app in action)
- [ ] All text in screenshots is readable and compliant

### Ratings & Content Classification
- [ ] Content rating: UNRATED (default) or specify 13+/18+ if applicable
- [ ] Target audience selected (e.g., "People seeking better sleep")
- [ ] No ads for gambling, tobacco, alcohol (if targeting minors)
- [ ] No hate speech, violence, or sexual content

### Subscription & In-App Purchase (if applicable)
- [ ] Clear disclosure of subscription terms (price, billing cycle)
- [ ] Auto-renewal consent obtained before purchase
- [ ] Easy cancellation path in app settings
- [ ] Refund policy stated clearly
- [ ] Free trial (if offered) requirements transparent

### Technical
- [ ] Minimum Android version specified (recommend 8.0+)
- [ ] App tested on Android 10, 11, 12, 13, 14 (latest stable)
- [ ] No crashes or force-close on target devices
- [ ] Permissions requested only when feature is used
- [ ] App does not violate Google Play policies

### Store Listing
- [ ] Description matches actual app functionality
- [ ] No false claims about features
- [ ] No "currently unavailable" or incomplete information
- [ ] Release notes provided (for updates)
- [ ] Support email and website included
- [ ] Support response time stated in description (e.g., "7–10 business days")

## 📋 Submission Workflow

### Per App (Repeat 28 times):

1. **Google Play Console Login**
   - https://play.google.com/apps/publish
   - Create new app or update existing listing

2. **Fill App Listing Fields**
   - App name: `[app_title]` from CSV (max 50 chars)
   - Short description: From CSV (max 80 chars)
   - Full description: From `descriptions/[slug]_full.txt`

3. **Add Graphics & Metadata**
   - Upload app icon (512×512)
   - Upload feature graphic (1024×500)
   - Upload 4–8 screenshots (9:16 or 16:9)
   - Optional: upload 20–30 sec promo video

4. **Add Legal Documents**
   - Privacy Policy: Link to customised template
   - Terms of Service: Link to customised template

5. **Audience & Rating**
   - Select category (from CSV)
   - Select content rating (usually UNRATED)
   - Select target audience (from CSV)

6. **Pricing & Distribution**
   - If free: Select countries
   - If paid/subscription: Set price, billing cycle, trial length
   - Configure regional pricing (if needed)

7. **Contact & Support**
   - Support email: `support@rhythmixapp.com.au`
   - Support website: `https://rhythmixapp.com.au`
   - Link to FAQ in app

8. **Review & Submit**
   - Review all content for compliance
   - Submit to Google Play for review (24–48 hours)
   - App published once review passes

## 🔍 Compliance Notes

### Privacy-First Architecture
All 28 apps follow a **privacy-first, offline-first design**:
- Data stays on user's device in IndexedDB (local storage)
- No data transmitted to remote servers (unless explicitly opt-in)
- No tracking, no telemetry, no analytics (except anonymised error logs)
- GDPR & CCPA compliant

### Health & Medical Disclaimers
Apps with health/wellness features include disclaimers:
- Not a medical device
- Not intended to diagnose, treat, cure, or prevent disease
- Consult healthcare provider for medical concerns
- Evidence-based but not FDA-cleared

### Accessibility Commitments
Every app includes:
- Screen reader compatibility (TalkBack, VoiceOver)
- High-contrast or dark mode
- Customisable font sizes
- Haptic feedback options
- Large touch targets
- Support contact for accessibility issues

## ✅ Quality Assurance

Before final submission:
1. **Spell & Grammar Check**
   - Use Grammarly or similar tool
   - Review for typos in all descriptions

2. **Keyword Research**
   - Ensure descriptions are natural (not stuffed)
   - Use keywords in first 1–2 sentences
   - Avoid repeating keywords >3x per description

3. **Claim Verification**
   - Ensure all claims are accurate and substantiated
   - Remove superlatives ("best", "only", "first") unless verifiable
   - Back up health claims with evidence-based research

4. **Cross-Platform Testing**
   - Test app on actual Android devices (not just emulator)
   - Test on minimum and maximum supported API levels
   - Verify all permissions work as intended

5. **Legal Review**
   - Have privacy policy reviewed by legal counsel (if budget allows)
   - Ensure ToS covers all material terms
   - Verify no forbidden claims (medical, gambling, alcohol)

## 📱 App Store Links Format

Once apps are published, they will be available at:
```
https://play.google.com/store/apps/details?id=com.rhythmix.[app-slug]
```

Example:
- Dreams: https://play.google.com/store/apps/details?id=com.rhythmix.dreams
- FOCUS: https://play.google.com/store/apps/details?id=com.rhythmix.focus
- HerdCheck: https://play.google.com/store/apps/details?id=com.rhythmix.herdcheck

## 📞 Support & Escalation

**For submission issues:**
- Email: support@rhythmixapp.com.au
- Include: App name, package ID, issue description, error messages

**For Google Play review rejections:**
- Google Play provides detailed feedback in console
- Address issues and resubmit
- Appeals available for policy interpretation disputes

**For urgent accessibility or privacy concerns:**
- Email: accessibility@rhythmixapp.com.au OR security@rhythmixapp.com.au
- Response time: 24–48 hours

---

**Last Updated:** 2026-06-09
**Version:** 1.0
**Status:** Ready for submission

All materials are compliance-ready for Google Play Store. Customise placeholders for each app and submit according to the workflow above.
