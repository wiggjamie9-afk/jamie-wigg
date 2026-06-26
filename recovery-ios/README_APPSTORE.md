# Reset iOS App — TestFlight & App Store Preparation

**Status:** Complete ✓  
**Date:** June 26, 2024  
**Bundle ID:** au.com.rhythmixapp.reset  

---

## Overview

This directory contains all configuration, scripts, and documentation needed to prepare the Reset iOS app for TestFlight beta testing and App Store submission.

All files have been created and are ready to use. Follow the Quick Start guide below to launch your app.

---

## 📋 Checklist: What's Been Completed

- ✅ GitHub Actions workflow for automated TestFlight uploads (`.github/workflows/ios-testflight.yml`)
- ✅ Fastlane configuration for build automation (`fastlane/Fastfile`)
- ✅ Ruby dependency management (`Gemfile`)
- ✅ Complete Privacy Policy (`PRIVACY_POLICY.md`)
- ✅ Complete Terms of Service (`TERMS_OF_SERVICE.md`)
- ✅ Xcode configuration guide (`XCODE_CONFIGURATION.md`)
- ✅ App Store Setup guide (`APP_STORE_SETUP.md`)
- ✅ App Store compliance checklist (`APP_STORE_COMPLIANCE_CHECKLIST.md`)
- ✅ Quick start guide (`TESTFLIGHT_QUICK_START.md`)

---

## 🚀 Quick Start (5 Steps)

### Step 1: Configure GitHub Secrets (5 min)

Go to **GitHub** → Your repo → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

```
APPLE_ID = jamie.jack.28@hotmail.com
APPLE_ID_PASSWORD = (app-specific password from Apple ID)
APPLE_TEAM_ID = (from Xcode or Apple Developer)
SIGNING_CERTIFICATE_P12_DATA = (base64-encoded .p12)
SIGNING_CERTIFICATE_PASSWORD = (password from .p12)
```

See `TESTFLIGHT_QUICK_START.md` for how to generate each.

### Step 2: Update Xcode Project (10 min)

```bash
# Open in Xcode
open recovery-ios/ios/App/App.xcodeproj

# Set your Apple team in: App target → General → Signing & Capabilities
# Verify version/build in: Build Settings
#   - MARKETING_VERSION = 1.0
#   - CURRENT_PROJECT_VERSION = 1
```

### Step 3: Setup Fastlane (15 min)

```bash
cd recovery-ios
bundle install
bundle exec fastlane match init
# Follow prompts to setup certificate management
```

### Step 4: Create App on App Store Connect (10 min)

1. Go to https://appstoreconnect.apple.com
2. Create new app:
   - Name: Reset
   - Bundle ID: au.com.rhythmixapp.reset
   - SKU: reset-au

### Step 5: Run First Build (Automated)

```bash
# Push workflow file to GitHub
git add .github/workflows/ios-testflight.yml
git commit -m "chore: add iOS TestFlight workflow"
git push

# Trigger workflow
# GitHub → Actions → iOS TestFlight Build & Upload → Run workflow
# Select: testflight, increment_build: true
# Watch build progress in GitHub Actions
```

**That's it!** Your first build will upload to TestFlight automatically.

---

## 📚 Documentation Map

| Document | Purpose | Read If... |
|----------|---------|-----------|
| **TESTFLIGHT_QUICK_START.md** | 5-step launch guide | You want the fastest path to TestFlight |
| **XCODE_CONFIGURATION.md** | Detailed Xcode setup | You need step-by-step Xcode configuration |
| **APP_STORE_SETUP.md** | Detailed App Store setup | Submitting to App Store for the first time |
| **APP_STORE_COMPLIANCE_CHECKLIST.md** | Pre-submission checklist | Before every App Store submission |
| **PRIVACY_POLICY.md** | Legal document | Required for App Store |
| **TERMS_OF_SERVICE.md** | Legal document | Required for app distribution |

---

## 🔄 Workflow Automation

### GitHub Actions Workflow

**File:** `.github/workflows/ios-testflight.yml`

**What it does:**
1. Checks out your code
2. Updates build number (optional)
3. Imports signing certificates from GitHub Secrets
4. Downloads provisioning profiles
5. Builds the app with Xcode
6. Exports IPA file
7. Uploads to TestFlight
8. Commits version bump
9. Sends Slack notification (optional)

**How to trigger:**
```bash
git push origin feature/my-feature
# Go to GitHub Actions → iOS TestFlight Build & Upload → Run workflow
```

**Options:**
- `build_type`: testflight (beta) or appstore (production)
- `increment_build`: true (auto-increment) or false (manual)

### Fastlane Lanes

**File:** `fastlane/Fastfile`

**Available lanes:**
```bash
# One-command: build + upload to TestFlight
bundle exec fastlane ios testflight_complete

# Just build
bundle exec fastlane ios build_testflight

# Just upload existing IPA
bundle exec fastlane ios upload_testflight ipa_path:"path/to/App.ipa"

# Sync certificates
bundle exec fastlane ios sync_signing

# Create new certificates
bundle exec fastlane ios create_profiles
```

---

## 📱 Version Management

### Update Version Number

**For feature release (e.g., 1.0 → 1.1):**

```bash
cd recovery-ios/ios/App/App.xcodeproj
sed -i '' 's/MARKETING_VERSION = 1.0/MARKETING_VERSION = 1.1/g' project.pbxproj
```

### Update Build Number

**For each TestFlight/App Store submission:**

```bash
cd recovery-ios/ios/App/App.xcodeproj
sed -i '' 's/CURRENT_PROJECT_VERSION = 1/CURRENT_PROJECT_VERSION = 2/g' project.pbxproj
```

Or enable automatic increment in GitHub Actions:
```bash
# Actions → Run workflow → increment_build: true
```

---

## 🏥 Health Data Integration

Reset integrates with Apple Health. **Required configuration:**

### In Xcode

1. **App target** → **Signing & Capabilities** → **+ Capability**
2. Add **HealthKit**
3. Automatically adds HealthKit entitlement

### In Info.plist

Add usage descriptions (already in your `Info.plist`):

```xml
<key>NSHealthShareUsageDescription</key>
<string>Reset needs access to your health data to provide recovery recommendations.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Reset needs to log your recovery data to Apple Health.</string>
```

### In App UI

Display disclaimer:
```
"Reset is not a substitute for professional medical advice. 
Consult healthcare professionals before starting new recovery routines."
```

---

## ✅ Pre-Submission Checklist

Before submitting to App Store, verify:

- [ ] App launches without crashes
- [ ] All features working as described
- [ ] Privacy Policy URL accessible
- [ ] Health disclaimer visible
- [ ] Screenshots uploaded (5-6 per device size)
- [ ] No placeholder text
- [ ] Version number incremented
- [ ] Build number incremented
- [ ] Code signing certificate valid
- [ ] Provisioning profiles updated
- [ ] TestFlight testing passed (1-2 weeks)
- [ ] No hardcoded secrets/API keys
- [ ] HTTPS used for all network requests

**Full checklist:** See `APP_STORE_COMPLIANCE_CHECKLIST.md`

---

## 🔐 Secrets & Credentials

### Required GitHub Secrets

| Secret | How to Get |
|--------|-----------|
| APPLE_ID | Your Apple ID email |
| APPLE_ID_PASSWORD | App-specific password (Apple ID → Security) |
| APPLE_TEAM_ID | Xcode Build Settings or Apple Developer account |
| SIGNING_CERTIFICATE_P12_DATA | Export from Keychain as .p12, then base64 encode |
| SIGNING_CERTIFICATE_PASSWORD | Password you set when exporting .p12 |

### Optional Secrets

| Secret | For |
|--------|-----|
| FASTLANE_SESSION | Fastlane authentication (optional) |
| MATCH_GIT_URL | Certificate git repo (recommended) |
| MATCH_PASSPHRASE | Encryption passphrase for match |
| SLACK_WEBHOOK_URL | Build notifications to Slack |

**Never commit secrets to git.** Always use GitHub Secrets or environment variables.

---

## 🐛 Troubleshooting

### Build fails with "Code Sign Error"

```bash
cd recovery-ios
bundle exec fastlane ios sync_signing
xcodebuild clean
```

### "Provisioning profile not found"

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/*
open ~/Library/MobileDevice/Provisioning\ Profiles
# Re-download profiles from Apple Developer
```

### TestFlight upload times out

```bash
# GitHub Actions → Run workflow again (takes 30 min)
git push
```

### App Store review rejected

Read rejection reason carefully and check `APP_STORE_COMPLIANCE_CHECKLIST.md` for the corresponding guideline.

---

## 📞 Support Contacts

**Apple Support:**
- App Store Connect: https://help.apple.com/app-store-connect/
- Developer: https://developer.apple.com/contact/

**Reset Support:**
- Email: support@rhythmixapp.com.au
- Privacy: privacy@rhythmixapp.com.au

---

## 📈 Timeline

| Phase | Duration | Steps |
|-------|----------|-------|
| **Setup** | 1-2 hours | Configure secrets, Xcode, Fastlane, App Store entry |
| **First Build** | 20 min | Run GitHub Actions workflow |
| **TestFlight** | 1-2 weeks | Test on devices, gather feedback, fix bugs |
| **App Store Review** | 1-3 days | Apple reviews submission |
| **Launch** | 1 day | Release on App Store |
| **Post-Launch** | Ongoing | Monitor crashes, respond to reviews |

**Total to first App Store approval:** ~2-3 weeks

---

## 🎯 Next Steps

1. **Read:** `TESTFLIGHT_QUICK_START.md` (10 min)
2. **Configure:** GitHub secrets (5 min)
3. **Build:** First TestFlight build (20 min via GitHub Actions)
4. **Test:** 1-2 weeks on TestFlight
5. **Submit:** App Store submission (10 min)
6. **Wait:** 1-3 days for Apple review
7. **Launch:** Release to App Store

---

## 📄 Files Included

```
recovery-ios/
├── .github/workflows/
│   └── ios-testflight.yml          # GitHub Actions workflow
├── fastlane/
│   ├── Fastfile                    # Fastlane lanes
│   └── Pluginfile                  # Fastlane plugins
├── Gemfile                         # Ruby dependencies
├── PRIVACY_POLICY.md               # Legal: Privacy policy
├── TERMS_OF_SERVICE.md             # Legal: Terms of service
├── XCODE_CONFIGURATION.md          # Detailed Xcode setup
├── APP_STORE_SETUP.md              # Detailed App Store setup
├── APP_STORE_COMPLIANCE_CHECKLIST.md # Pre-submission checklist
├── TESTFLIGHT_QUICK_START.md       # Quick start guide (5 steps)
└── README_APPSTORE.md              # This file
```

---

## 🔗 Useful Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Account](https://developer.apple.com/account)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Fastlane Documentation](https://docs.fastlane.tools/getting-started/ios/setup/)
- [Xcode Build Settings](https://help.apple.com/xcode/mac/current/)

---

## ✨ Key Features

- **Automated:** GitHub Actions builds and uploads automatically
- **Secure:** Certificates stored encrypted in GitHub Secrets
- **Audited:** All submissions tracked in git history
- **Documented:** Complete guides for every step
- **Legal:** Privacy policy and terms of service included
- **Compliant:** App Store review guidelines checklist

---

## 📞 Questions?

Refer to the specific guide:
- **Quick start?** → `TESTFLIGHT_QUICK_START.md`
- **Xcode config?** → `XCODE_CONFIGURATION.md`
- **App Store?** → `APP_STORE_SETUP.md`
- **Compliance?** → `APP_STORE_COMPLIANCE_CHECKLIST.md`
- **Troubleshooting?** → `XCODE_CONFIGURATION.md` (end of file)

---

**Prepared:** June 26, 2024  
**Version:** 1.0  
**Status:** ✅ Ready for TestFlight
