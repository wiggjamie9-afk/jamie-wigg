# iOS Xcode Configuration Guide for TestFlight & App Store

## Overview

This guide walks through configuring the Reset iOS app (Capacitor-based) for TestFlight and App Store submission.

**Current Configuration:**
- Bundle ID: `au.com.rhythmixapp.reset`
- App Name: Reset
- Deployment Target: iOS 13.0+
- Current Version: 1.0
- Current Build: 1

---

## 1. Update Version and Build Numbers

### 1.1 In Xcode GUI

1. Open `recovery-ios/ios/App/App.xcodeproj` in Xcode
2. Select **App** target
3. Go to **Build Settings** tab
4. Search for "version" to find:
   - **MARKETING_VERSION** (user-facing version: 1.0 → 1.0.1 for bug fix, 1.1 for minor feature)
   - **CURRENT_PROJECT_VERSION** (build number: increment by 1 each submission)

### 1.2 Build Number Scheme

**Versioning Strategy:**
- **Major.Minor.Patch** (e.g., 1.0.0)
  - Major: Large feature releases, UI overhaul
  - Minor: New features, significant improvements
  - Patch: Bug fixes, minor improvements

- **Build Number** (separate integer)
  - 1 = 1.0.0 release
  - 2 = 1.0.0 + bug fix
  - 3 = 1.0.1 release
  - Increments for EVERY TestFlight build

**Example Flow:**
```
Version 1.0, Build 1  → First TestFlight
Version 1.0, Build 2  → Bug fix, re-submit TestFlight
Version 1.0, Build 3  → Final to App Store
Version 1.1, Build 4  → New feature development
```

### 1.3 Command-Line Update (for CI/CD)

```bash
cd recovery-ios/ios/App

# Update MARKETING_VERSION (semantic version)
sed -i '' 's/MARKETING_VERSION = .*/MARKETING_VERSION = 1.0.1;/g' App.xcodeproj/project.pbxproj

# Update CURRENT_PROJECT_VERSION (build number)
sed -i '' 's/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = 2;/g' App.xcodeproj/project.pbxproj

# Verify changes
grep "MARKETING_VERSION\|CURRENT_PROJECT_VERSION" App.xcodeproj/project.pbxproj | head -4
```

### 1.4 Info.plist Configuration

The Info.plist references these via variables:
- `CFBundleShortVersionString` = `$(MARKETING_VERSION)`
- `CFBundleVersion` = `$(CURRENT_PROJECT_VERSION)`

**No manual edits needed** — Xcode uses the build settings.

---

## 2. Create iOS Development Certificate

### 2.1 Automatic (Recommended via Fastlane)

```bash
cd recovery-ios
bundle install
bundle exec fastlane ios create_profiles
```

Fastlane will:
- Create iOS App ID if needed
- Generate Development Certificate
- Create Provisioning Profile
- Store in match repository

### 2.2 Manual via Apple Developer Portal

1. Go to **Apple Developer** → https://developer.apple.com/account/resources/certificates/list
2. Click **+** to create new certificate
3. Select **iOS App Development**
4. Upload CSR (Certificate Signing Request):
   - Open **Keychain Access** on Mac
   - Menu: **Keychain Access** → **Certificate Assistant** → **Request a Certificate from a Certificate Authority**
   - Email: jamie.jack.28@hotmail.com
   - Save to disk
5. Upload CSR to Apple
6. Download `.cer` file
7. Double-click to install in Keychain
8. Export as `.p12` (private key + certificate):
   - Right-click certificate in Keychain
   - **Export "iPhone Developer: ..."**
   - Save as `ios-dev-cert.p12`
   - Set password (store securely)

### 2.3 Store Certificate for CI/CD

```bash
# Encode certificate
base64 -i ios-dev-cert.p12 | pbcopy

# In GitHub Actions Secrets:
# SIGNING_CERTIFICATE_P12_DATA = (paste encoded value)
# SIGNING_CERTIFICATE_PASSWORD = (password from export)
```

---

## 3. Create Provisioning Profiles

### 3.1 Development Profile (for testing)

1. **Apple Developer** → **Identifiers & Profiles** → **Provisioning Profiles**
2. Click **+** → **iOS App Development**
3. Select App ID: `au.com.rhythmixapp.reset`
4. Select Development Certificate(s)
5. Select devices to register:
   - Register your test devices first (Device Management)
   - Add multiple devices for team testing
6. Name: `Reset Development`
7. Download `.mobileprovision` file

### 3.2 App Store / TestFlight Profile

1. Click **+** → **App Store Connect**
2. Select App ID: `au.com.rhythmixapp.reset`
3. Select Distribution Certificate (see section 4)
4. Name: `Reset App Store`
5. Download `.mobileprovision`

### 3.3 Ad Hoc Profile (for beta testing without TestFlight)

1. Click **+** → **Ad Hoc**
2. Select App ID: `au.com.rhythmixapp.reset`
3. Select Distribution Certificate
4. Select specific devices
5. Name: `Reset Ad Hoc`

### 3.4 Register Test Devices

Add devices to development profile:

1. **Apple Developer** → **Devices**
2. Click **+**
3. Enter UDID (found in Xcode or via iTunes):
   ```bash
   # Get UDID from connected device
   system_profiler SPUSBDataType | grep -i udid
   ```
4. Register device
5. Re-create/re-download Development Profile

### 3.5 Automate via Fastlane Match

```bash
cd recovery-ios

# First time: create and store in git
bundle exec fastlane ios create_profiles force:true

# Later: sync profiles
bundle exec fastlane ios sync_signing

# This stores encrypted profiles in private git repo
```

**Setup match git repo:**

```bash
# Create private repo for certificates
# https://github.com/new → rhythmix-match-certs (private)

# Configure in fastlane
bundle exec fastlane match init
# Provide:
# - Git URL: https://github.com/wiggjamie9-afk/rhythmix-match-certs.git
# - Type: appstore
# - Username: jamie.jack.28@hotmail.com
# - Team ID: XXXXXXXXXX (get from Apple Developer)
```

Store MATCH_GIT_URL in GitHub Actions secrets.

---

## 4. Create App Store Distribution Certificate

### 4.1 Via Apple Developer Portal

1. Go to **Certificates, Identifiers & Profiles** → **Certificates**
2. Click **+** → **Apple Distribution**
3. Upload CSR (same as development, or new one):
   ```bash
   # Create new CSR
   # Keychain Access → Certificate Assistant → Request Certificate
   ```
4. Download `.cer` file
5. Double-click to install in Keychain
6. Export as `.p12`:
   - Keychain → right-click → **Export**
   - Save as `ios-dist-cert.p12`
   - Set secure password

### 4.2 Store for CI/CD

```bash
base64 -i ios-dist-cert.p12 | pbcopy

# GitHub Actions Secret:
# SIGNING_CERTIFICATE_P12_DATA = (paste)
# SIGNING_CERTIFICATE_PASSWORD = (password)
```

### 4.3 Verify in Xcode

1. Xcode → **Settings** → **Accounts**
2. Select Apple ID
3. Click **Manage Certificates...**
4. Should see both "iPhone Developer" and "iPhone Distribution"

---

## 5. Xcode Build Settings Configuration

### 5.1 Code Signing Settings

1. Select **App** target
2. Go to **Build Settings** tab
3. Search "Code Sign":

| Setting | Value |
|---------|-------|
| Code Sign Identity | iPhone Developer (dev) / iPhone Distribution (release) |
| Code Sign Style | Automatic *(or Manual if needed)* |
| Development Team | Team ID (e.g., XXXXXXXXXX) |
| Provisioning Profile | Reset Development / Reset App Store |
| Provisioning Profile Specifier | Leave empty (auto-select) |

### 5.2 Set Development Team

1. Select **App** target
2. **General** tab
3. Under **Signing & Capabilities**
4. Team dropdown → Select your team or "Add an Account"
5. Sign in with Apple ID if needed

### 5.3 Signing Certificate Priority

```
Code Sign Style: Automatic
  └─> Uses Development Team + Xcode managed provisioning
      └─> Matches to installed certificates in Keychain
```

```
Code Sign Style: Manual
  └─> Specify exact certificate and provisioning profile
      └─> Less flexible for CI/CD, not recommended
```

### 5.4 Build Phases — Embed Frameworks (if needed)

For Capacitor, native frameworks are auto-embedded. Check:
1. Select **App** target
2. **Build Phases** tab
3. Expand "**Embed Frameworks**" (should be empty unless custom plugins)

---

## 6. Provisioning Profile in Xcode

### 6.1 Manual Assignment

1. **App** target → **Build Settings**
2. Search "Provisioning Profile"
3. For **Debug** config: `Reset Development`
4. For **Release** config: `Reset App Store`

### 6.2 Automatic (Recommended)

Leave "Provisioning Profile Specifier" empty. Xcode will auto-select based on:
- Development Team
- Code Sign Identity
- Bundle ID

---

## 7. Local Build & Test

### 7.1 Build for Development

```bash
cd recovery-ios/ios/App

xcodebuild \
  -scheme App \
  -configuration Debug \
  -sdk iphoneos \
  -derivedDataPath build/DerivedData \
  -allowProvisioningUpdates
```

### 7.2 Build for TestFlight (Archive)

```bash
xcodebuild \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath build/DerivedData \
  -archivePath build/App.xcarchive \
  archive \
  -allowProvisioningUpdates
```

### 7.3 Export IPA

```bash
xcodebuild \
  -exportArchive \
  -archivePath build/App.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/Exports
```

Where `ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>teamID</key>
    <string>XXXXXXXXXX</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>thinning</key>
    <string><none></string>
</dict>
</plist>
```

### 7.4 Test IPA on Device

Using Apple Configurator or TestFlight beta link.

---

## 8. GitHub Actions Secrets Setup

For automated CI/CD, store these in **GitHub** → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Value | Source |
|--------|-------|--------|
| `APPLE_ID` | jamie.jack.28@hotmail.com | Your Apple ID |
| `APPLE_ID_PASSWORD` | App-specific password | App Store Connect → Security |
| `APPLE_APP_SPECIFIC_PASSWORD` | (same or different) | App Store Connect → Security |
| `APPLE_TEAM_ID` | XXXXXXXXXX | Xcode → Build Settings or Apple Developer |
| `SIGNING_CERTIFICATE_P12_DATA` | base64-encoded .p12 | Exported cert (base64) |
| `SIGNING_CERTIFICATE_PASSWORD` | P12 export password | Password from .p12 export |
| `FASTLANE_SESSION` | (optional) | Fastlane session token |
| `MATCH_GIT_URL` | https://...rhythmix-match-certs.git | Private repo for certs |
| `MATCH_PASSPHRASE` | encryption passphrase | Set during `fastlane match init` |
| `SLACK_WEBHOOK_URL` | https://hooks.slack.com/... | Slack channel integration |

### 8.1 Generate App-Specific Password

1. Apple ID account → **Security**
2. **App-Specific Passwords** → Generate
3. Choose "GitHub Actions" (custom)
4. Copy password

### 8.2 Create Fastlane Session Token

```bash
cd recovery-ios
bundle exec fastlane spaceshipauth_login
# Follow prompts, stores in ~/.fastlane/spaceship_xxxxxxx.json
```

---

## 9. Capabilities and Entitlements

### 9.1 Add Required Capabilities

1. **App** target → **Signing & Capabilities**
2. Click **+ Capability**
3. Common for Reset:
   - **HealthKit** (for Apple Health integration)
   - **CloudKit** (for optional cloud sync)
   - **Push Notifications** (for remote updates)
   - **Background Modes** (if needed for background tracking)

### 9.2 HealthKit Entitlement

For Apple Health integration:

1. Add **HealthKit** capability
2. Creates `App.entitlements` with:
```xml
<key>com.apple.developer.healthkit</key>
<true/>
```

3. Info.plist needs privacy descriptions:
```xml
<key>NSHealthShareUsageDescription</key>
<string>Reset needs access to your health data to provide recovery recommendations.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Reset needs to log your recovery data to Apple Health.</string>
```

---

## 10. Pre-Submission Checklist

### 10.1 Xcode Validation

```bash
cd recovery-ios/ios/App

# Validate archive
xcodebuild -validateBuildForPackaging App
```

### 10.2 Manual Checks

- [ ] Version number incremented correctly
- [ ] Build number incremented from last submission
- [ ] Bundle ID matches App Store app entry
- [ ] Development Team set correctly
- [ ] Provisioning profile valid
- [ ] Signing certificates valid (not expired)
- [ ] All info.plist privacy descriptions present
- [ ] App icon in place (1024x1024)
- [ ] Launch screen configured
- [ ] Device orientations set correctly
- [ ] Minimum deployment target: iOS 13.0
- [ ] No hardcoded API keys or secrets
- [ ] All remote URLs use HTTPS
- [ ] No bitcode (deprecated)

### 10.3 Code Quality

```bash
# Run Xcode linter
xcodebuild -scheme App analyze

# Check for warnings
cd recovery-ios
npm run lint
```

---

## 11. Troubleshooting

### Issue: "Code Sign Error: provisioning profile not found"

**Solution:**
1. Ensure profile is downloaded locally:
   ```bash
   open ~/Library/MobileDevice/Provisioning\ Profiles
   ```
2. Re-download from Apple Developer
3. Or use Fastlane:
   ```bash
   cd recovery-ios
   bundle exec fastlane ios sync_signing
   ```

### Issue: "Certificate not found in Keychain"

**Solution:**
1. Double-click `.cer` file to install
2. Export `.p12` from Keychain:
   ```bash
   # Keychain Access → Right-click cert → Export
   ```
3. Re-import:
   ```bash
   security import ios-dev-cert.p12 -k ~/Library/Keychains/login.keychain-db
   ```

### Issue: Build fails with "Automatic Code Signing Error"

**Solution:**
1. Xcode → **Settings** → **Accounts** → Verify Apple ID is signed in
2. Click **Manage Certificates** → Re-download if expired
3. Clear derived data:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/*
   ```
4. Rebuild

### Issue: "Trust server certificate?"

In CI/CD (GitHub Actions), accept cert:
```bash
export FASTLANE_USER=jamie.jack.28@hotmail.com
export FASTLANE_PASSWORD=$APPLE_ID_PASSWORD
export SPACESHIP_SKIP_2FA_UPGRADE=true

bundle exec fastlane ios upload_testflight
```

---

## 12. Next Steps

1. **Complete Privacy Policy & Terms** (already created in repo)
2. **Create App Store Connect Entry** (see APP_STORE_SETUP.md)
3. **Build & Upload to TestFlight** (see CI/CD workflow)
4. **Submit to App Store Review** (1-3 days review time)

---

## References

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Fastlane Docs](https://docs.fastlane.tools/)
- [Xcode Build Settings](https://help.apple.com/xcode/mac/current/#/itcaec37d5b6)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
