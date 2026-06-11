# 🍎 iOS SETUP QUICK GUIDE
## Get Your Apple Developer Certificate & Build Apps (In 1 Day)

**Timeline:** 4–6 hours from certificate purchase to first build  
**Cost:** $99/year for Apple Developer program membership

---

## STEP 1: Purchase & Enroll (30 minutes)

### 1.1 Go to Apple Developer

```
https://developer.apple.com/programs/
```

### 1.2 Sign In (or Create Apple ID)

You need a valid Apple ID. If you don't have one:
- Go to: https://appleid.apple.com/
- Create account (email + password)
- Save credentials

### 1.3 Enroll in Developer Program

- Click "Enroll"
- Select individual or company
- Pay $99/year (they charge immediately)
- Verify email
- Done ✓

**After enrollment:** You get access to Xcode, App Store Connect, and signing certificates.

---

## STEP 2: Install Xcode (1–2 hours)

Xcode is Apple's IDE for iOS development. It's LARGE (~12GB).

### 2.1 Download from App Store

```
Open App Store app
Search: "Xcode"
Click: Get → Install
```

Or from command line:
```bash
xcode-select --install
```

**Wait 30–60 min for download + installation.**

### 2.2 Launch Xcode

```bash
open /Applications/Xcode.app
```

Accept license agreement when prompted.

### 2.3 Verify Installation

```bash
xcode-select -p
# Should show: /Applications/Xcode.app/Contents/Developer
```

---

## STEP 3: Create Your Signing Certificate (30 minutes)

This is what signs your apps so Apple knows they're from you.

### 3.1 Open Xcode Preferences

```
Xcode → Settings → Accounts
```

### 3.2 Add Your Apple ID

- Click "+" (bottom left of window)
- Select "Apple ID"
- Enter your Apple ID email + password
- Click "Sign In"

### 3.3 Verify Your Account

Your account should now show under "Accounts" with:
- Apple ID
- Team ID (looks like: ABCD123EFG)

**Copy your Team ID somewhere safe.** You'll need it later.

---

## STEP 4: Generate Signing Certificate (15 minutes)

Each app needs to be "signed" with a certificate that proves it's from you.

### 4.1 Access Apple Developer Portal

```
https://developer.apple.com/account/
```

### 4.2 Go to Certificates, IDs & Profiles

```
Certificates, IDs & Profiles → Certificates
```

### 4.3 Create Certificate

1. Click "+" button
2. Select "iOS App Development"
3. Click "Continue"
4. Upload a "Certificate Signing Request" (CSR)
   - **Don't have one?** Xcode creates this automatically
   - Go to Xcode → Settings → Accounts → [Your Team] → "Create Certificate"
5. Download certificate
6. Double-click to install in Keychain

**In Keychain app, verify it shows:**
- "Apple Development: [Your Name]"

---

## STEP 5: Create App IDs & Provisioning Profiles (15 minutes each app)

Each app needs a unique identifier on Apple's servers.

### 5.1 Create App ID

For each app you'll submit:

```
Apple Developer Portal
→ Certificates, IDs & Profiles
→ Identifiers
→ Click "+"
→ Select "App IDs"
→ Choose "App"
```

**Bundle ID Format:**
```
com.rhythmix.[appname]
```

Examples:
```
com.rhythmix.english
com.rhythmix.mathhelper
com.rhythmix.budgettracker
```

### 5.2 Enable Services (optional)

- Push Notifications (not needed for basic apps)
- Sign in with Apple (not needed)
- Leave defaults, click "Continue"

### 5.3 Create Provisioning Profile

```
Certificates, IDs & Profiles
→ Provisioning Profiles
→ Click "+"
→ Select "iOS App Development"
→ Select App ID you just created
→ Select your certificate
→ Select all devices (or specific device for testing)
→ Download profile
→ Double-click to install
```

**IMPORTANT:** Repeat 5.1–5.3 for EACH app (28 times)

Or use **Xcode auto-signing** (easier):
- Xcode will create these automatically when you build

---

## STEP 6: Configure Xcode for Your First App

### 6.1 Open App in Xcode

```bash
cd apps/english
npx cap add ios
npx cap open ios
```

This opens your app in Xcode.

### 6.2 Configure Signing

In Xcode, left sidebar:
1. Click project name (English)
2. Click "Signing & Capabilities" tab
3. Under "Signing":
   - Team: Select your team (should appear automatically)
   - Bundle ID: `com.rhythmix.english`

**Xcode will automatically create provisioning profiles.**

### 6.3 Select Build Target

```
Top of Xcode:
Select: [App Name] → Generic iOS Device
```

(Or your specific iPhone model if you have one connected)

---

## STEP 7: Build Your First App (5 minutes)

### 7.1 Build

```
Product → Build
```

Or keyboard: `⌘B`

**Wait 2–5 minutes.** You should see:
```
Build complete!
```

### 7.2 Fix Any Errors

Most common errors:
- "No signing certificate found" → Go back to Step 5, ensure certificate is installed
- "Bundle identifier invalid" → Check it follows `com.rhythmix.appname` format
- "Team not selected" → Go to Signing & Capabilities, select your team

### 7.3 Archive for App Store

```
Product → Archive
```

This creates a package ready for App Store submission.

---

## STEP 8: Prepare for App Store Submission (30 minutes per app)

### 8.1 Create App Store Record

```
https://appstoreconnect.apple.com/
```

- Click "Apps" (top left)
- Click "+" → "New App"
- Fill in:
  - **Bundle ID:** `com.rhythmix.english` (must match Xcode)
  - **Primary Language:** English
  - **App Name:** English Pocket
  - **SKU:** (unique code, e.g., "APP001")
  - **Full Access:** Select "Full Access"

### 8.2 Fill in App Information

Under "App Information":
- **App Name:** English Pocket
- **Subtitle:** Learn English Fast (optional)
- **Category:** Education
- **Privacy Policy URL:** https://rhythmixapp.com.au/privacy.html
- **Support URL:** https://rhythmixapp.com.au
- **App Privacy:** Fill out questionnaire
  - Does it collect user data? Most likely NO
  - Does it collect location? NO
  - Advertising? NO (unless you add ads later)

### 8.3 Create App Listing

Under "App Preview and Screenshots":
- Add 5–8 screenshots (required)
- Add preview video (optional)

### 8.4 Set Pricing

Under "Pricing and Availability":
- **Pricing:** Select tier
  - Tier 1: $0.99/month (recommended)
  - Tier 2: $1.99/month
  - Tier 3: $2.99/month
- **Availability:** Select "Worldwide"

### 8.5 Set Release Date

Under "Release":
- **Automatic Release:** Check this
- OR **Manual Release:** Choose a specific date

---

## STEP 9: Submit to App Store (5 minutes per app)

### 9.1 Upload Build

Back in Xcode:
```
Window → Organizer
```

Select your archive → "Distribute App"

### 9.2 Choose Distribution Method

```
Select: "App Store Connect"
```

### 9.3 Choose Signing Certificate

```
Automatically manage signing: YES (easiest)
```

### 9.4 Review & Upload

- Check metadata is correct
- Click "Upload"
- Wait 5–10 minutes for upload to complete

### 9.5 Submit for Review

Back in App Store Connect:
```
App → Version → Submit for Review
```

**DONE!** ✓

Apple will review your app in 24–48 hours.

---

## ⏱️ TIMELINE TO YOUR FIRST APP ON APP STORE

| Step | Time | Task |
|------|------|------|
| 1 | 30 min | Buy developer certificate |
| 2 | 1–2 hours | Install Xcode |
| 3 | 30 min | Create signing certificate |
| 4 | 15 min | Create App ID + provisioning |
| 5 | 5 min | Configure Xcode |
| 6 | 5 min | Build app |
| 7 | 30 min | Set up App Store listing |
| 8 | 5 min | Submit to review |
| **Total** | **~3–4 hours** | **App submitted!** |

Then wait 24–48 hours for review.

---

## 🚀 FOR ALL 28 APPS (Faster Way)

Instead of doing steps 1–9 for each app individually:

### Option A: Batch with Scripts

```bash
# I can create a script to automate this
# For now, do top 5 apps manually (Tier 1)
# Then we automate the rest
```

### Option B: Use Xcode Auto-Signing

Xcode can automatically handle signing certificates for all apps.

```bash
# For each app:
cd apps/[appname]
npx cap add ios
npx cap open ios
# Set Bundle ID: com.rhythmix.[appname]
# Build + Archive
# Submit
```

Repeat for app #2–#28 (takes ~5 min per app once you get the rhythm)

---

## ✅ CHECKLIST: Verify Everything Works

### Before Building:

- [ ] Apple Developer account created and paid ($99)
- [ ] Xcode installed and launched
- [ ] Signing certificate created and installed in Keychain
- [ ] App ID created in Apple Developer Portal
- [ ] Provisioning profile downloaded and installed

### Before Submitting:

- [ ] Xcode project has correct bundle ID
- [ ] Xcode shows your team in "Signing & Capabilities"
- [ ] App builds without errors (`⌘B`)
- [ ] Archive created successfully
- [ ] App Store Connect listing filled out
- [ ] Screenshots uploaded (5–8 minimum)
- [ ] Privacy policy URL filled in
- [ ] Category selected

### Before Review:

- [ ] App version number set (start with 1.0)
- [ ] Build number set
- [ ] All required metadata filled in
- [ ] Release notes entered
- [ ] Ready for submission checkbox enabled

---

## 🆘 COMMON ERRORS & FIXES

### "No Signing Certificate Found"
```
Fix: Xcode → Settings → Accounts → [Your Team] → Create Certificate
Then in Project → Signing, ensure it shows your certificate
```

### "Bundle ID Invalid"
```
Check format: com.rhythmix.appname (lowercase, no spaces)
Register in Apple Developer Portal if not auto-created
```

### "App Identifier Not Registered"
```
You need to create the App ID in Apple Developer Portal first
OR enable Xcode auto-signing (easier)
```

### "Build Failed"
```
1. Check: product → scheme → [AppName] is selected
2. Check: Generic iOS Device is selected (not Simulator)
3. Clean: ⇧⌘K, then try again
4. Last resort: rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

---

## 📝 NOTES

- **First app:** Takes 3–4 hours (all setup)
- **Subsequent apps:** ~30 min each (reuse certificates)
- **App Store review:** 24–48 hours (usually faster)
- **Rejections:** Rare if you follow guidelines
  - Don't promise features you don't have
  - Include privacy policy
  - Don't include ads without permission
  - Don't crash on launch

- **Updates:** After first approval, future updates go faster (1–3 hours to review)

---

## 🎯 YOUR WEEK 1 GOAL

**Day 1–2:** Buy certificate, install Xcode, create signing certificates  
**Day 3:** Build + submit first 5 Tier 1 apps (English, Math, BP, Meditation, Budget)  
**Day 4–7:** Monitor review progress, start creating Tier 2 listings

**By end of week:** 5 apps in review, should see approvals by week 2

---

**Now go get that Apple Developer certificate. 🍎**

