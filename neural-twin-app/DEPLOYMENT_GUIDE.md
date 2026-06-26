# Neural Twin Android - Google Play Store Deployment Guide

Complete guide for preparing and deploying Neural Twin to the Google Play Store.

---

## Quick Start

### For First-Time Setup (5 minutes)

1. **Generate keystore** (one-time):
   ```bash
   cd neural-twin-app/android
   keytool -genkey -v \
     -keystore keystore.jks \
     -keyalg RSA -keysize 4096 -validity 10950 \
     -alias neural_twin_key
   # Enter passwords when prompted
   ```

2. **Create `signing.properties`** (local development):
   ```bash
   cat > signing.properties << EOF
   SIGNING_STORE_FILE=keystore.jks
   SIGNING_STORE_PASSWORD=your_keystore_password
   SIGNING_KEY_ALIAS=neural_twin_key
   SIGNING_KEY_PASSWORD=your_key_password
   EOF
   ```

3. **Set GitHub Secrets** for CI/CD:
   - `KEYSTORE_FILE` (base64-encoded keystore)
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS`
   - `KEY_PASSWORD`
   
   See: [Keystore Setup Guide](./android/KEYSTORE_SETUP.md)

4. **Push to main**:
   ```bash
   git add neural-twin-app/android/app/build.gradle.kts
   git commit -m "Configure release signing and ProGuard"
   git push origin main
   ```

5. **GitHub Actions builds automatically** → creates release artifacts

---

## Architecture Overview

```
Neural Twin Deployment Pipeline
├── Local Development
│   ├── keytool → generate keystore.jks
│   ├── signing.properties (local, .gitignore'd)
│   └── ./gradlew bundleRelease (debug build)
│
├── GitHub Actions (On Push to Main)
│   ├── Decode KEYSTORE_FILE from base64 secret
│   ├── Create signing.properties from environment variables
│   ├── ./gradlew assembleRelease (build APK)
│   ├── ./gradlew bundleRelease (build AAB)
│   ├── Upload artifacts (30-day retention)
│   └── Create GitHub Release with auto-generated notes
│
└── Google Play Console (Manual Upload)
    ├── Download AAB artifact from GitHub
    ├── Upload to Play Console → Internal/Closed/Production track
    ├── Set staged rollout (10% → 50% → 100%)
    └── Monitor crash reports & ratings
```

---

## Files Modified / Created

### 1. Build Configuration
- **`neural-twin-app/android/app/build.gradle.kts`**
  - Added `signingConfigs { release { ... } }`
  - Enabled minification: `isMinifyEnabled = true`
  - Enabled resource shrinking: `isShrinkResources = true`
  - Added debug build type config

### 2. Code Optimization
- **`neural-twin-app/android/app/proguard-rules.pro`**
  - Enhanced ProGuard rules for Hilt, Retrofit, Gson, Room
  - Added optimization settings
  - Preserved stack traces for debugging

### 3. Signing Credentials (Local)
- **`neural-twin-app/android/signing.properties`** (.gitignore'd)
  - Stores local keystore passwords
  - Never committed to git
  - Template: `signing.properties.example`

### 4. CI/CD Automation
- **`.github/workflows/android-build.yml`** (NEW)
  - Triggers on push to main (or manual dispatch)
  - Builds APK and AAB
  - Creates GitHub releases with artifacts
  - Runs lint checks

### 5. Documentation
- **`neural-twin-app/RELEASE_NOTES.md`** (NEW)
  - Release changelog template
  - Deployment instructions
  - Pre-release checklist
  - Versioning scheme

- **`neural-twin-app/PLAY_STORE_REQUIREMENTS.md`** (NEW)
  - Complete Play Store listing requirements
  - App description, screenshots, feature graphic
  - Content rating guidance
  - Privacy policy template

- **`neural-twin-app/android/KEYSTORE_SETUP.md`** (NEW)
  - Keystore generation
  - Security best practices
  - Backup strategy
  - Troubleshooting

- **`DEPLOYMENT_GUIDE.md`** (THIS FILE)
  - Quick start overview
  - Step-by-step deployment workflow

---

## Step-by-Step Deployment Workflow

### Phase 1: Pre-Launch Setup (Do Once)

#### 1.1: Generate Keystore
```bash
cd neural-twin-app/android

# Generate 4096-bit RSA key, valid for 30 years
keytool -genkey -v \
  -keystore keystore.jks \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10950 \
  -alias neural_twin_key \
  -storepass your_keystore_password \
  -keypass your_key_password
```

**Save the output fingerprint:**
```
Certificate fingerprint (SHA-256): XX:XX:XX:...
```

You'll need this for:
- Firebase App Registration
- Deep linking authentication
- Play Store signing certificate registration

#### 1.2: Create Signing Configuration
```bash
cd neural-twin-app/android

# Create signing.properties (local development)
cat > signing.properties << EOF
SIGNING_STORE_FILE=keystore.jks
SIGNING_STORE_PASSWORD=your_keystore_password
SIGNING_KEY_ALIAS=neural_twin_key
SIGNING_KEY_PASSWORD=your_key_password
EOF

# Verify it's in .gitignore
grep -E "(keystore|signing.properties)" ../.gitignore
# Should output:
# android/*.jks
# android/*.keystore
# android/signing.properties
```

#### 1.3: Configure GitHub Secrets
Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Create these secrets:

**1. KEYSTORE_FILE (Base64-encoded keystore)**
```bash
# On your local machine:
base64 -i android/keystore.jks | pbcopy  # macOS
# or
base64 < android/keystore.jks | xclip -selection clipboard  # Linux

# Then:
# 1. Go to GitHub Repo Settings → Secrets
# 2. Click "New repository secret"
# 3. Name: KEYSTORE_FILE
# 4. Paste the entire base64 string
# 5. Click "Add secret"
```

**2. KEYSTORE_PASSWORD**
- Name: `KEYSTORE_PASSWORD`
- Value: `[your_keystore_password]`

**3. KEY_ALIAS**
- Name: `KEY_ALIAS`
- Value: `neural_twin_key`

**4. KEY_PASSWORD**
- Name: `KEY_PASSWORD`
- Value: `[your_key_password]`

#### 1.4: Create Google Play Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app: "Neural Twin"
3. Fill in app details:
   - **App Title:** Neural Twin
   - **Category:** Health & Fitness
   - **Description:** See [PLAY_STORE_REQUIREMENTS.md](./PLAY_STORE_REQUIREMENTS.md)

---

### Phase 2: App Release (Per Version)

#### 2.1: Update Version Numbers

**File: `neural-twin-app/android/app/build.gradle.kts`**

```kotlin
defaultConfig {
    applicationId = "com.neuraltwin.app"
    minSdk = 28
    targetSdk = 34
    versionCode = 2          // Increment by 1 for each release
    versionName = "0.2.0"    // Use SemVer: MAJOR.MINOR.PATCH
    // ...
}
```

**Versioning scheme:**
- `versionCode`: Always increment (1, 2, 3, ...) for Play Store
- `versionName`: Semantic versioning (0.1.0, 0.2.0, 1.0.0)

#### 2.2: Update Release Notes

**File: `neural-twin-app/RELEASE_NOTES.md`**

Add section at the top:

```markdown
## Version 0.2.0 (Release Date: YYYY-MM-DD)

### New Features
- Feature 1
- Feature 2

### Enhancements
- Performance improvement X

### Bug Fixes
- Fixed issue with Y

### Known Issues
- Issue A: workaround available

### Supported Devices
- Minimum SDK: Android 9 (API 28)
- Target SDK: Android 14 (API 34)
```

#### 2.3: Test Local Build

```bash
cd neural-twin-app/android

# Clean build
./gradlew clean

# Verify signing configuration
./gradlew signingReport

# Build and sign release APK
./gradlew assembleRelease

# Build signed App Bundle (AAB) for Play Store
./gradlew bundleRelease

# Check output files
ls -lh app/build/outputs/apk/release/*.apk
ls -lh app/build/outputs/bundle/release/*.aab
```

#### 2.4: Push to Main Branch

```bash
# Commit version and release notes changes
git add neural-twin-app/android/app/build.gradle.kts
git add neural-twin-app/RELEASE_NOTES.md
git commit -m "Release v0.2.0: [description]"
git push origin main

# GitHub Actions automatically:
# 1. Builds APK and AAB
# 2. Creates GitHub Release
# 3. Uploads artifacts (30-day retention)
```

#### 2.5: Download Artifacts from GitHub

**Option A: From GitHub Web UI**
1. Go to repo → **Actions** tab
2. Click most recent `Android Build & Release` workflow
3. Under **Artifacts**, download:
   - `neural-twin-aab` (App Bundle for Play Store)
   - `neural-twin-apk` (Direct APK for beta testing)

**Option B: Command Line**
```bash
# Requires: GitHub CLI (brew install gh)
gh run list --workflow=android-build.yml --limit 1
gh run download [RUN_ID] -n neural-twin-aab
gh run download [RUN_ID] -n neural-twin-apk
```

#### 2.6: Upload to Google Play Console

1. **Open Google Play Console** → Neural Twin app
2. **Left sidebar** → **Release → Production** (or Internal testing / Closed testing first)
3. **Create release**
4. **Upload App Bundle (AAB)**
   - Click "Browse files"
   - Select downloaded `.aab` file
   - Play Console validates automatically
5. **Add release notes**
   - Copy from [RELEASE_NOTES.md](./neural-twin-app/RELEASE_NOTES.md)
6. **Review**
   - Check version code, version name
   - Verify permissions, target SDK
   - Confirm app icon, description
7. **Staged rollout** (Recommended)
   - Start: 10% of users
   - Monitor 24-48 hours for crashes
   - Increase: 50%
   - Monitor 24-48 hours
   - Full: 100%
8. **Submit for review**
   - Click "Start rollout"
   - Wait for Google's automated review (usually < 1 hour)

---

### Phase 3: Post-Launch Monitoring

#### 3.1: Monitor Crash Reports

Daily for first week, then weekly:

1. **Google Play Console** → **Vitals → Crashes & ANRs**
   - Target: < 1% crash rate
   - If higher: investigate top crashes, push hotfix

2. **Android Studio** → **Logcat** (if testing locally)
   ```bash
   adb logcat | grep "Neural Twin" | grep -i error
   ```

#### 3.2: Review User Ratings

1. **Google Play Console** → **Reviews** tab
2. Respond to 1-2 star reviews within 48 hours
3. File GitHub issues for reported bugs
4. Push fixes to `main` → auto-builds new release

#### 3.3: Update Staged Rollout

After stable period:

1. Go to **Release → Production**
2. Click current release
3. Increase rollout percentage in 25-50% increments
4. Wait 24-48 hours between increases
5. Once stable, click "Complete rollout" for 100%

---

## Configuration Snippets

### build.gradle.kts Signing Config

```kotlin
android {
    // ... namespace, compileSdk, etc.

    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("SIGNING_STORE_FILE") ?: "keystore.jks")
            storePassword = System.getenv("SIGNING_STORE_PASSWORD") ?: ""
            keyAlias = System.getenv("SIGNING_KEY_ALIAS") ?: ""
            keyPassword = System.getenv("SIGNING_KEY_PASSWORD") ?: ""
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            isMinifyEnabled = false
            isShrinkResources = false
            debuggable = true
        }
    }
}
```

### ProGuard/R8 Optimization Rules

```proguard
# Preserve line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep framework-critical classes
-keep class dagger.hilt.** { *; }
-keep class retrofit2.** { *; }
-keep class com.google.gson.** { *; }
-keep class okhttp3.** { *; }
-keep class androidx.room.** { *; }

# Application classes
-keep class com.neuraltwin.app.** { *; }

# Optimization
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
```

### GitHub Actions Workflow

See: [`.github/workflows/android-build.yml`](.github/workflows/android-build.yml)

Key features:
- Triggers on push to `main` or manual dispatch
- Builds APK and AAB
- Creates GitHub Release with artifacts
- Runs lint checks
- Generates build summary

---

## Troubleshooting

### Build Fails with Signing Error

**Error:** `Keystore was tampered with, or password was incorrect`

**Solution:**
```bash
# Verify keystore integrity
keytool -list -keystore android/keystore.jks

# Verify signing.properties has correct password
cat android/signing.properties

# Re-enter password if needed
keytool -keypasswd -keystore android/keystore.jks -alias neural_twin_key
```

### APK Won't Install on Device

**Error:** `app not installed` or signature mismatch

**Solution:**
```bash
# Uninstall previous version
adb uninstall com.neuraltwin.app

# Verify new APK signature
keytool -printcert -jarfile app/build/outputs/apk/release/app-release.apk | grep SHA-256

# Re-install
adb install app/build/outputs/apk/release/app-release.apk
```

### Play Store Rejects AAB

**Error:** `Invalid app bundle` or signature mismatch

**Solution:**
1. Verify AAB was built with correct keystore:
   ```bash
   keytool -printcert -jarfile app/build/outputs/bundle/release/app-release.aab | grep SHA-256
   ```

2. Check Play Console's expected signing certificate:
   - **Settings → App signing** → verify "App Signing Certificate" matches

3. If mismatch:
   - You may need to opt into **App Signing by Google Play** (see KEYSTORE_SETUP.md)

### GitHub Actions Build Hangs

**Symptom:** Workflow takes > 30 minutes or times out

**Solution:**
```bash
# Force cleanup
./gradlew clean

# Verify Java version
java -version  # Should be 17+

# Rebuild with stacktrace
./gradlew assembleRelease --stacktrace
```

---

## Security Checklist

Before every release:

- [ ] Keystore password not in commit messages
- [ ] `signing.properties` not committed
- [ ] GitHub secrets configured correctly
- [ ] No hardcoded credentials in code
- [ ] ProGuard rules preserve security-critical classes
- [ ] Network traffic uses HTTPS only
- [ ] Permissions are justified and documented
- [ ] Third-party libraries are up-to-date (no known CVEs)

---

## Deployment Checklist

Before uploading to Play Store:

- [ ] Version code incremented
- [ ] Version name follows SemVer (MAJOR.MINOR.PATCH)
- [ ] RELEASE_NOTES.md updated
- [ ] Local `./gradlew bundleRelease` succeeds
- [ ] AAB artifact downloaded from GitHub
- [ ] APK tested on physical device
- [ ] All permissions functioning correctly
- [ ] No critical lint issues
- [ ] ProGuard successfully optimizes build
- [ ] App startup time < 5 seconds
- [ ] Battery/memory usage acceptable

---

## Post-Launch Timeline

| When | Action | Who |
|------|--------|-----|
| T+0h | Upload AAB to Play Console | Developer |
| T+1h | Google's automated review | Google |
| T+1h | Internal testing group gets early access | Google |
| T+24h | Increase to 50% rollout if stable | Developer |
| T+48h | Full 100% rollout if no crashes | Developer |
| T+1w | Review crash reports, user ratings | Developer |
| T+2w | Plan next version based on feedback | Product/Dev |

---

## References

- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [ProGuard Manual](https://www.guardsquare.com/manual/configuration/overview)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Android Build Optimization](https://developer.android.com/build/optimize)

---

## Support

Questions? Issues?

- **Email:** wiggjamie28@gmail.com
- **GitHub Issues:** [Neural Twin App Repo](https://github.com/)
- **Documentation:** See README.md in android/ folder
