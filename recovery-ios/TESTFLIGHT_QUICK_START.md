# TestFlight & App Store Quick Start Guide

**Goal:** Get Reset from development to TestFlight and App Store in the fastest way possible.

---

## Phase 1: One-Time Setup (1-2 hours)

### Step 1.1: GitHub Actions Secrets (5 min)

Add these secrets to `.github/settings/secrets/actions`:

```
APPLE_ID = jamie.jack.28@hotmail.com
APPLE_ID_PASSWORD = (App-specific password from Apple ID settings)
APPLE_TEAM_ID = (Get from Xcode: Build Settings or Apple Developer)
SIGNING_CERTIFICATE_P12_DATA = (Base64-encoded .p12 file)
SIGNING_CERTIFICATE_PASSWORD = (Password from .p12 export)
FASTLANE_SESSION = (Optional, get from fastlane spaceshipauth_login)
SLACK_WEBHOOK_URL = (Optional, for notifications)
```

### Step 1.2: Xcode Configuration (30 min)

```bash
# 1. Open Xcode project
open recovery-ios/ios/App/App.xcodeproj

# 2. Select App target → General → Signing & Capabilities
# 3. Select your team (must be Apple Developer program member)
# 4. Fix any "Fix Issue" prompts

# 5. Update version & build (Build Settings tab)
# Search "MARKETING_VERSION" = 1.0
# Search "CURRENT_PROJECT_VERSION" = 1

# 6. Verify provisioning profile downloaded
open ~/Library/MobileDevice/Provisioning\ Profiles
```

### Step 1.3: Fastlane Setup (20 min)

```bash
cd recovery-ios

# Install bundler
gem install bundler

# Install dependencies
bundle install

# Initialize match (stores certs securely)
bundle exec fastlane match init
# When prompted:
# - Git URL: https://github.com/YOUR_ORG/rhythmix-match-certs.git (must exist, private)
# - Type: appstore
# - Username: jamie.jack.28@hotmail.com
# - Team ID: (from Apple Developer)
```

### Step 1.4: Create App on App Store Connect (30 min)

1. Go to https://appstoreconnect.apple.com
2. Click **Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: Reset
   - Bundle ID: au.com.rhythmixapp.reset
   - SKU: reset-au
4. Verify App Store Connect entry created

**Don't upload builds yet** — just ensure entry exists.

---

## Phase 2: First TestFlight Build (20 min, automation)

### Step 2.1: Manual Local Build (Optional, for testing)

```bash
cd recovery-ios/ios/App

# Option A: Archive via xcodebuild
xcodebuild archive \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -archivePath build/App.xcarchive

# Option B: Use Fastlane
cd ../..
bundle exec fastlane ios testflight_complete
# This builds, exports, and uploads all in one
```

### Step 2.2: GitHub Actions Automated Build

1. Push code to a branch (or main):
   ```bash
   git add .github/workflows/ios-testflight.yml
   git commit -m "chore: add iOS TestFlight workflow"
   git push origin feature/testflight-setup
   ```

2. Go to GitHub → **Actions** → **iOS TestFlight Build & Upload**
3. Click **Run workflow**
4. Choose:
   - Build type: **testflight**
   - Increment build: **true**
5. Click **Run workflow**

6. Monitor workflow logs:
   - Should complete in 10-15 minutes
   - IPA uploaded to TestFlight
   - Build pending review in App Store Connect

### Step 2.3: Verify Upload

1. **App Store Connect** → **TestFlight**
2. Under **Internal Testing** → should see new build
3. Once processed (10-15 min), available to download
4. Install on test device via TestFlight app

---

## Phase 3: TestFlight Testing (1-2 weeks)

### Step 3.1: Internal Testing

1. **App Store Connect** → **TestFlight** → **Internal Testing**
2. Add internal testers (yourself, team)
3. Send feedback via in-app TestFlight feedback
4. Monitor crash logs: **Crashes** tab

### Step 3.2: External Testing (Optional)

1. Create external testing group
2. Invite external beta testers
3. Build submitted for review (24-48 hours)
4. Testers get TestFlight link
5. Collect feedback for 1-2 weeks

### Step 3.3: Fix Issues & Resubmit

If crashes or bugs found:

```bash
# 1. Fix code
vim recovery-ios/src/...

# 2. Increment build number
sed -i '' 's/CURRENT_PROJECT_VERSION = 1;/CURRENT_PROJECT_VERSION = 2;/g' recovery-ios/ios/App/App.xcodeproj/project.pbxproj

# 3. Trigger workflow again
git add .
git commit -m "fix: crash in recovery logging"
git push

# 4. GitHub Actions → Run workflow → testflight → true
```

---

## Phase 4: App Store Submission (10 min)

### Step 4.1: Prepare Metadata

**App Store Connect** → **App Store** tab:

1. **Name:** Reset
2. **Subtitle:** Recovery tracking for team sport
3. **Description:** (See APP_STORE_SETUP.md for full text)
4. **Privacy Policy URL:** https://rhythmixapp.com.au/privacy
5. **Support URL:** support@rhythmixapp.com.au
6. **Category:** Health & Fitness

### Step 4.2: Upload Screenshots

1. **Screenshots** section
2. For each device size (6.1-inch, 5.8-inch, 5.5-inch):
   - Upload 5-6 screenshots
   - Showing key features
   - With optional captions

### Step 4.3: Set Pricing & Availability

1. **Pricing and Availability**
2. **Free** (or configure paid/IAP)
3. **Available in:** Select regions (Australia, USA, etc.)

### Step 4.4: Answer Privacy Questions

1. **App Privacy**
2. Answer questionnaire:
   - Collects health data? **Yes** (Apple Health)
   - Analytics? **Yes** (Firebase)
   - Ads? **No**

### Step 4.5: Complete Release Notes

1. **Version 1.0** → **Release Notes:**
   ```
   Initial release of Reset recovery app
   - Apple Health integration
   - Recovery tracking and logging
   - Personalized insights
   ```

### Step 4.6: Submit for Review

1. Click **"Submit for Review"**
2. Confirm all metadata
3. Answer export/compliance questions
4. Submit

**⏱️ Review time: 1-3 days (sometimes 5-7 during holidays)**

### Step 4.7: Monitor & Release

1. **App Store Connect** → **App Store** → Check **Status**
2. Once **Approved**:
   - Option A: Automatic release (publish immediately)
   - Option B: Manual release (choose date/time)

---

## Phase 5: Post-Launch (Ongoing)

### Step 5.1: Monitor Performance

- **Ratings & Reviews** tab → Respond to feedback
- **Crashes** tab → Fix reported issues
- **Analytics** → Monitor usage patterns

### Step 5.2: Plan v1.0.1 Bug Fix Release

If crashes found:
1. Fix bugs
2. Test on TestFlight
3. Increment version to 1.0.1, build to 4
4. Submit to App Store Review
5. Usually approved in 24-48 hours

### Step 5.3: Plan v1.1 Feature Release

After initial success:
1. Gather user feedback
2. Plan new features
3. Follow same TestFlight → App Store cycle
4. Increment to version 1.1, build N

---

## Troubleshooting Quick Fixes

### ❌ "Build rejected: Code Sign Error"

```bash
# Fix: Refresh signing
cd recovery-ios/ios/App
rm -rf ~/Library/Developer/Xcode/DerivedData/*
xcodebuild clean
bundle exec fastlane sync_signing
```

### ❌ "TestFlight upload timeout"

```bash
# Re-run workflow with more time
git push
# GitHub Actions → Run workflow → wait 30 min
```

### ❌ "App Store review rejected: Medical claims"

**Fix:** Add health disclaimer to app UI:
```swift
// In Settings or onboarding
"Reset is not a substitute for professional medical advice. 
Consult healthcare professionals before starting new routines."
```

### ❌ "Privacy Policy link broken"

**Fix:** Create HTML file and host:
```bash
# Create privacy-policy.html
# Host at rhythmixapp.com.au/privacy
# Update URL in App Store Connect
```

---

## GitHub Actions Workflow Reference

**File:** `.github/workflows/ios-testflight.yml`

**Triggers:**
- Manual: **Actions** → **iOS TestFlight** → **Run workflow**
- Options:
  - `build_type`: testflight (beta) or appstore (production)
  - `increment_build`: true/false (auto-increment build number)

**Steps:**
1. Checkout code
2. Install dependencies (Node, Ruby, Fastlane)
3. Get current version/build
4. Increment build (if enabled)
5. Import signing certificate from secrets
6. Download provisioning profiles
7. Build app (`xcodebuild archive`)
8. Export IPA
9. Upload to TestFlight (or App Store)
10. Commit version bump
11. Send Slack notification

**Output:**
- IPA file (app binary)
- TestFlight build uploaded
- Build number committed to repo

---

## Fastlane Commands (Local)

### Build & Upload

```bash
cd recovery-ios

# One-command workflow (build + sign + upload)
bundle exec fastlane ios testflight_complete

# Just build
bundle exec fastlane ios build_testflight

# Just upload existing IPA
bundle exec fastlane ios upload_testflight \
  ipa_path:"build/App.ipa"
```

### Certificate Management

```bash
# Sync/download existing certificates
bundle exec fastlane ios sync_signing

# Create new certificates/profiles (force)
bundle exec fastlane ios create_profiles force:true

# View current setup
bundle exec fastlane ios setup_signing
```

---

## Xcode Build Settings Quick Reference

**Update version/build:**

```bash
cd recovery-ios/ios/App/App.xcodeproj

# Get current values
grep "MARKETING_VERSION\|CURRENT_PROJECT_VERSION" project.pbxproj | head -4

# Update version (semantic)
sed -i '' 's/MARKETING_VERSION = 1.0/MARKETING_VERSION = 1.1/g' project.pbxproj

# Update build (increment by 1)
sed -i '' 's/CURRENT_PROJECT_VERSION = 1/CURRENT_PROJECT_VERSION = 2/g' project.pbxproj
```

**Verify:**

```bash
grep "MARKETING_VERSION\|CURRENT_PROJECT_VERSION" project.pbxproj | head -4
```

---

## App Store Connect URLs

- **Main:** https://appstoreconnect.apple.com
- **Reset App:** https://appstoreconnect.apple.com/apps/AU.COM.RHYTHMIXAPP.RESET
- **TestFlight:** https://appstoreconnect.apple.com/testflight/testers
- **Analytics:** https://appstoreconnect.apple.com/analytics
- **Users:** https://appstoreconnect.apple.com/users

---

## File Locations & Reference

| File | Purpose |
|------|---------|
| `.github/workflows/ios-testflight.yml` | GitHub Actions workflow |
| `recovery-ios/Gemfile` | Ruby dependencies (Fastlane) |
| `recovery-ios/fastlane/Fastfile` | Fastlane lanes |
| `recovery-ios/XCODE_CONFIGURATION.md` | Detailed Xcode setup |
| `recovery-ios/APP_STORE_SETUP.md` | Detailed App Store Connect setup |
| `recovery-ios/APP_STORE_COMPLIANCE_CHECKLIST.md` | Pre-submission checklist |
| `recovery-ios/PRIVACY_POLICY.md` | Legal document |
| `recovery-ios/TERMS_OF_SERVICE.md` | Legal document |
| `recovery-ios/ios/App/App/Info.plist` | App configuration |
| `recovery-ios/ios/App/App.xcodeproj/project.pbxproj` | Xcode project (version/build here) |

---

## Timeline Summary

| Phase | Task | Time |
|-------|------|------|
| 1 | One-time setup (secrets, Xcode, Fastlane, App Store entry) | 1-2 hours |
| 2 | First TestFlight build | 20 min (automated) |
| 3 | TestFlight testing & iteration | 1-2 weeks |
| 4 | App Store submission & review | 1-3 days review |
| 5 | Launch & post-launch monitoring | Ongoing |

**Total time to first App Store approval:** ~2-3 weeks (mostly TestFlight testing)

---

## Checklist Before First Submission

- [ ] GitHub Actions secrets configured
- [ ] Xcode project version/build updated
- [ ] Fastlane setup complete
- [ ] App created on App Store Connect
- [ ] Privacy Policy URL works
- [ ] Screenshots ready (5-6 per device)
- [ ] App description finalized
- [ ] TestFlight build uploaded & tested
- [ ] No crashes in TestFlight
- [ ] Health disclaimer visible in app
- [ ] All legal docs (privacy, terms) completed

---

## Next Steps

1. **Now:** Configure secrets & run first build
2. **After TestFlight:** Plan submission for Week 2
3. **Post-Launch:** Monitor crashes & reviews
4. **Ongoing:** Plan feature releases

---

**Last Updated:** June 26, 2024  
**Status:** Ready to launch
