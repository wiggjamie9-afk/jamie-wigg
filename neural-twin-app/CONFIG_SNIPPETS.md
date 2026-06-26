# Configuration Snippets - Copy/Paste Reference

Quick reference for all configuration snippets used in the Neural Twin deployment setup.

---

## 1. build.gradle.kts - Signing Configuration

**File:** `android/app/build.gradle.kts`

**Location:** Add inside `android { }` block, before `buildTypes { }`

```kotlin
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
```

---

## 2. build.gradle.kts - Version Configuration

**File:** `android/app/build.gradle.kts`

**Location:** Inside `defaultConfig { }`

```kotlin
defaultConfig {
    applicationId = "com.neuraltwin.app"
    minSdk = 28
    targetSdk = 34
    versionCode = 1          // Increment by 1 for each release
    versionName = "0.1.0"    // Use SemVer: MAJOR.MINOR.PATCH
    
    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    vectorDrawables {
        useSupportLibrary = true
    }
}
```

---

## 3. proguard-rules.pro - Complete Rules

**File:** `android/app/proguard-rules.pro`

```proguard
# Preserve line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# === Hilt / Dagger ===
-keep class dagger.hilt.** { *; }
-keep @dagger.hilt.android.HiltAndroidApp class * { <init>(); }
-keep @dagger.hilt.android.AndroidEntryPoint class * { <init>(); }
-keepclasseswithmembernames class * {
    @dagger.hilt.* *;
}

# === Retrofit ===
-keep class retrofit2.** { *; }
-keep interface retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions
-keepclasseswithmembers class * {
    @retrofit2.http.<*> <methods>;
}

# === Gson ===
-keep class com.google.gson.** { *; }
-keep interface com.google.gson.** { *; }
-keepattributes Signature
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# === OkHttp ===
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# === Room Database ===
-keep class androidx.room.** { *; }
-keep interface androidx.room.** { *; }
-keepclasseswithmembernames class * {
    @androidx.room.* <methods>;
}
-keepclasseswithmembernames class * {
    @androidx.room.* <fields>;
}

# === Kotlin Coroutines ===
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# === Android Core ===
-keepclasseswithmembernames class * {
    native <methods>;
}

# === Application Classes ===
-keep class com.neuraltwin.app.** { *; }

# === Generic Optimization ===
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# === Verbose Output ===
-verbose
```

---

## 4. signing.properties - Local Development

**File:** `android/signing.properties` (git-ignored, create locally)

```properties
SIGNING_STORE_FILE=keystore.jks
SIGNING_STORE_PASSWORD=your_keystore_password
SIGNING_KEY_ALIAS=neural_twin_key
SIGNING_KEY_PASSWORD=your_key_password
```

**Create with:**
```bash
cat > android/signing.properties << EOF
SIGNING_STORE_FILE=keystore.jks
SIGNING_STORE_PASSWORD=your_keystore_password
SIGNING_KEY_ALIAS=neural_twin_key
SIGNING_KEY_PASSWORD=your_key_password
EOF
```

---

## 5. .gitignore Updates

**File:** `neural-twin-app/.gitignore`

**Add to Android section:**
```
# Android
android/.gradle/
android/.idea/
android/local.properties
android/build/
android/*/build/
android/**/build/
android/*.jks
android/*.keystore
android/signing.properties
android/.DS_Store
android/lint-results.html
android/.cxx/
```

---

## 6. GitHub Actions Workflow (Complete)

**File:** `.github/workflows/android-build.yml`

```yaml
name: Android Build & Release

on:
  push:
    branches:
      - main
    paths:
      - 'neural-twin-app/android/**'
      - '.github/workflows/android-build.yml'
  workflow_dispatch:

env:
  GRADLE_WRAPPER: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 45

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Validate Gradle wrapper
        uses: gradle/wrapper-validation-action@v2

      - name: Decode keystore
        run: |
          mkdir -p ${{ github.workspace }}/neural-twin-app/android/
          if [ ! -z "${{ secrets.KEYSTORE_FILE }}" ]; then
            echo "${{ secrets.KEYSTORE_FILE }}" | base64 --decode > ${{ github.workspace }}/neural-twin-app/android/keystore.jks
          fi

      - name: Create signing.properties
        env:
          SIGNING_STORE_FILE: keystore.jks
          SIGNING_STORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          SIGNING_KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          SIGNING_KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
        run: |
          cat > ${{ github.workspace }}/neural-twin-app/android/signing.properties << EOF
          SIGNING_STORE_FILE=${{ env.SIGNING_STORE_FILE }}
          SIGNING_STORE_PASSWORD=${{ env.SIGNING_STORE_PASSWORD }}
          SIGNING_KEY_ALIAS=${{ env.SIGNING_KEY_ALIAS }}
          SIGNING_KEY_PASSWORD=${{ env.SIGNING_KEY_PASSWORD }}
          EOF

      - name: Build release APK
        run: |
          cd ${{ github.workspace }}/neural-twin-app/android
          ./gradlew assembleRelease --stacktrace

      - name: Build App Bundle (AAB)
        run: |
          cd ${{ github.workspace }}/neural-twin-app/android
          ./gradlew bundleRelease --stacktrace

      - name: Upload APK as artifact
        uses: actions/upload-artifact@v4
        if: success()
        with:
          name: neural-twin-apk
          path: |
            neural-twin-app/android/app/build/outputs/apk/release/*.apk
          retention-days: 30

      - name: Upload App Bundle as artifact
        uses: actions/upload-artifact@v4
        if: success()
        with:
          name: neural-twin-aab
          path: |
            neural-twin-app/android/app/build/outputs/bundle/release/*.aab
          retention-days: 30

      - name: Extract APK version info
        id: version
        run: |
          cd ${{ github.workspace }}/neural-twin-app/android
          VERSION_NAME=$(grep "versionName" app/build.gradle.kts | grep -oP '"\K[^"]+')
          VERSION_CODE=$(grep "versionCode" app/build.gradle.kts | grep -oP '\K[0-9]+')
          echo "version_name=${VERSION_NAME}" >> $GITHUB_OUTPUT
          echo "version_code=${VERSION_CODE}" >> $GITHUB_OUTPUT
          echo "build_timestamp=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" >> $GITHUB_OUTPUT

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        if: success()
        with:
          name: "NeuralTwin v${{ steps.version.outputs.version_name }} (Build ${{ steps.version.outputs.version_code }})"
          tag_name: "v${{ steps.version.outputs.version_name }}"
          files: |
            neural-twin-app/android/app/build/outputs/apk/release/*.apk
            neural-twin-app/android/app/build/outputs/bundle/release/*.aab
          body: |
            ## Release Information
            - **Version:** ${{ steps.version.outputs.version_name }}
            - **Build Code:** ${{ steps.version.outputs.version_code }}
            - **Build Date:** ${{ steps.version.outputs.build_timestamp }}

            ### Artifacts
            - `neural-twin-release.apk` - Direct Android Package
            - `neural-twin-release.aab` - Android App Bundle (for Play Store)

            See [RELEASE_NOTES.md](../../RELEASE_NOTES.md) for changes.
          draft: false
          prerelease: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build Status Summary
        if: always()
        run: |
          echo "### Build Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          if [ "${{ job.status }}" == "success" ]; then
            echo "✅ **Build succeeded**" >> $GITHUB_STEP_SUMMARY
            echo "- APK artifact: neural-twin-apk" >> $GITHUB_STEP_SUMMARY
            echo "- AAB artifact: neural-twin-aab" >> $GITHUB_STEP_SUMMARY
            echo "- Version: ${{ steps.version.outputs.version_name }}" >> $GITHUB_STEP_SUMMARY
          else
            echo "❌ **Build failed**" >> $GITHUB_STEP_SUMMARY
          fi

  lint-and-analyze:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Run lint
        run: |
          cd ${{ github.workspace }}/neural-twin-app/android
          ./gradlew lint --stacktrace || true

      - name: Upload lint results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lint-results
          path: neural-twin-app/android/app/build/reports/lint-results*.html
          retention-days: 30
```

---

## 7. Keystore Generation Command

```bash
# One-time setup
cd neural-twin-app/android

keytool -genkey -v \
  -keystore keystore.jks \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10950 \
  -alias neural_twin_key \
  -storepass your_keystore_password \
  -keypass your_key_password
```

Or interactive:
```bash
keytool -genkey -v -keystore keystore.jks -keyalg RSA -keysize 4096 -validity 10950
```

---

## 8. GitHub Secrets Setup (Bash)

```bash
#!/bin/bash
# setup-github-secrets.sh

REPO_OWNER="your-username"
REPO_NAME="jamie-wigg"

# Read keystore and encode
KEYSTORE_BASE64=$(base64 -i neural-twin-app/android/keystore.jks)

# Prompt for passwords
read -sp "Enter keystore password: " KEYSTORE_PASSWORD
echo
read -sp "Enter key password: " KEY_PASSWORD
echo

# Use GitHub CLI to set secrets
gh secret set KEYSTORE_FILE --body "$KEYSTORE_BASE64" -R $REPO_OWNER/$REPO_NAME
gh secret set KEYSTORE_PASSWORD --body "$KEYSTORE_PASSWORD" -R $REPO_OWNER/$REPO_NAME
gh secret set KEY_ALIAS --body "neural_twin_key" -R $REPO_OWNER/$REPO_NAME
gh secret set KEY_PASSWORD --body "$KEY_PASSWORD" -R $REPO_OWNER/$REPO_NAME

echo "✅ GitHub Secrets configured successfully"
```

---

## 9. Build Commands

```bash
# Build signed release APK
cd neural-twin-app/android
./gradlew assembleRelease

# Build signed App Bundle (AAB) for Play Store
./gradlew bundleRelease

# Clean build
./gradlew clean

# Run lint checks
./gradlew lint

# Check signing certificate
keytool -list -v -keystore android/keystore.jks

# Verify APK signature
keytool -printcert -jarfile app/build/outputs/apk/release/app-release.apk

# View signing report
./gradlew signingReport
```

---

## 10. Local Development Environment Setup

```bash
# 1. Navigate to android directory
cd neural-twin-app/android

# 2. Create keystore (if not already done)
keytool -genkey -v -keystore keystore.jks -keyalg RSA -keysize 4096 -validity 10950

# 3. Create signing.properties
cat > signing.properties << 'EOF'
SIGNING_STORE_FILE=keystore.jks
SIGNING_STORE_PASSWORD=your_keystore_password
SIGNING_KEY_ALIAS=neural_twin_key
SIGNING_KEY_PASSWORD=your_key_password
EOF

# 4. Verify .gitignore includes signing.properties
grep "signing.properties" ../.gitignore

# 5. Test build
./gradlew bundleRelease

# 6. Verify output
ls -lh app/build/outputs/bundle/release/app-release.aab
```

---

## 11. Android Manifest Permissions (Reference)

**File:** `android/app/src/main/AndroidManifest.xml`

Current permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_HEALTH" />
```

These require justification in Play Store listing.

---

## 12. Privacy Policy Template

```markdown
# Privacy Policy for Neural Twin

Last Updated: [DATE]

## Data Collection
- Health Connect data (with explicit user consent)
- Location data (only when features enabled)
- Audio recordings (stored locally)
- Camera usage (stored locally)

## Data Storage
- Primary: Local on-device (Room database)
- Backup: Optional cloud sync (encrypted)
- No third-party sharing

## Your Rights
- Access: View all collected data
- Deletion: Wipe data anytime
- Opt-out: Disable features in settings
- Contact: wiggjamie28@gmail.com

## Security
- End-to-end encryption for backend sync
- TLS 1.3+ for all network communication
- Regular security audits

---

## Contact
For privacy inquiries: wiggjamie28@gmail.com
```

---

## 13. Release Notes Template

```markdown
## Version X.Y.Z (Release Date: YYYY-MM-DD)

### New Features
- Feature 1
- Feature 2

### Enhancements
- Enhancement 1
- Performance improvement

### Bug Fixes
- Fixed issue with X
- Corrected behavior in Y

### Known Issues
- Issue A: workaround available
- Issue B: will be fixed in next release

### Supported Devices
- Minimum SDK: Android 9 (API 28)
- Target SDK: Android 14 (API 34)
```

---

## Quick Reference Table

| Task | Command/File | Duration |
|------|--------------|----------|
| Generate keystore | `keytool -genkey -v -keystore keystore.jks ...` | 2 min |
| Create signing config | `cat > signing.properties << EOF...` | 1 min |
| Setup GitHub secrets | GitHub web UI or `gh secret set` | 5 min |
| Test local build | `./gradlew bundleRelease` | 2-3 min |
| Push to main | `git push origin main` | 1 min |
| GitHub Actions build | Automatic | 5-10 min |
| Download artifacts | GitHub Actions UI | 1 min |
| Upload to Play Console | Manual web UI | 5-10 min |
| Staged rollout | 10% → 50% → 100% | 3-5 days |

---

## Total Setup Time

- **One-time:** ~30 minutes (keystore + GitHub secrets)
- **Per release:** ~15 minutes (version bump + push to main)
- **Play Store:** ~20 minutes (AAB upload + release creation)

**Total first release:** ~65 minutes  
**Subsequent releases:** ~35 minutes

---

See full documentation in:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step workflow
- [KEYSTORE_SETUP.md](./android/KEYSTORE_SETUP.md) - Keystore details
- [PLAY_STORE_REQUIREMENTS.md](./PLAY_STORE_REQUIREMENTS.md) - Play Store checklist
- [RELEASE_NOTES.md](./RELEASE_NOTES.md) - Release template
