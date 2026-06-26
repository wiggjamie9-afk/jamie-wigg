# Neural Twin Android Deployment - Complete Setup Guide

This README provides an overview of all deployment files and the end-to-end process for preparing Neural Twin for Google Play Store release.

## 📋 Files Overview

### Configuration Files (Modified/Created)

| File | Purpose | Status |
|------|---------|--------|
| `android/app/build.gradle.kts` | Build config with signing & minification | ✅ Modified |
| `android/app/proguard-rules.pro` | Code optimization rules | ✅ Enhanced |
| `android/signing.properties.example` | Template for local signing config | ✅ Created |
| `android/.gitignore` | Ensures keystore & passwords not committed | ✅ Updated |

### Documentation Files (Created)

| File | Purpose | Length |
|------|---------|--------|
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment workflow | 450+ lines |
| `PLAY_STORE_REQUIREMENTS.md` | Complete Play Store submission checklist | 500+ lines |
| `RELEASE_NOTES.md` | Release changelog template & instructions | 300+ lines |
| `android/KEYSTORE_SETUP.md` | Keystore creation & security guide | 400+ lines |
| `DEPLOYMENT_README.md` | This file - overview & navigation |

### CI/CD (Created)

| File | Purpose |
|------|---------|
| `.github/workflows/android-build.yml` | GitHub Actions workflow for automatic builds |

---

## 🚀 Quick Start (5 Minutes)

### 1. Generate Keystore (One-time)
```bash
cd neural-twin-app/android

keytool -genkey -v \
  -keystore keystore.jks \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10950 \
  -alias neural_twin_key
```

Save the SHA-256 fingerprint shown in output.

### 2. Create Local Signing Config
```bash
cat > signing.properties << EOF
SIGNING_STORE_FILE=keystore.jks
SIGNING_STORE_PASSWORD=your_keystore_password
SIGNING_KEY_ALIAS=neural_twin_key
SIGNING_KEY_PASSWORD=your_key_password
EOF
```

### 3. Configure GitHub Secrets
1. Go to repo **Settings → Secrets and variables → Actions**
2. Create 4 secrets:
   - `KEYSTORE_FILE` (base64-encoded keystore)
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS` = `neural_twin_key`
   - `KEY_PASSWORD`

See: [KEYSTORE_SETUP.md](./android/KEYSTORE_SETUP.md#3-github-actions-integration)

### 4. Test Local Build
```bash
cd neural-twin-app/android
./gradlew bundleRelease
# Check output: app/build/outputs/bundle/release/app-release.aab
```

### 5. Push to Main
```bash
git add neural-twin-app/android/app/build.gradle.kts
git commit -m "Configure release signing"
git push origin main
# GitHub Actions automatically builds APK/AAB
```

Done! Now you can deploy via Play Console.

---

## 📚 Full Documentation Structure

### For First-Time Setup
1. **Start here:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Phase 1: Pre-Launch Setup
2. **Then read:** [KEYSTORE_SETUP.md](./android/KEYSTORE_SETUP.md) - Keystore generation & security
3. **Reference:** [PLAY_STORE_REQUIREMENTS.md](./PLAY_STORE_REQUIREMENTS.md) - Complete checklist

### For Each Release
1. **Follow:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Phase 2: App Release
2. **Update:** [RELEASE_NOTES.md](./RELEASE_NOTES.md) - Version history
3. **Monitor:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Phase 3: Post-Launch

### For Troubleshooting
1. **Check:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Troubleshooting section
2. **Deep dive:** [KEYSTORE_SETUP.md](./android/KEYSTORE_SETUP.md#9-troubleshooting)
3. **Search:** GitHub Actions logs (`.github/workflows/android-build.yml`)

---

## 🔧 What Was Changed

### Build Configuration
```kotlin
// android/app/build.gradle.kts - Added signing config and minification

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
}
```

### Code Optimization
```proguard
# android/app/proguard-rules.pro - Enhanced rules for:
# - Hilt dependency injection
# - Retrofit networking
# - Gson serialization
# - Room database
# - Kotlin coroutines
# - Custom application classes
```

### CI/CD Automation
```yaml
# .github/workflows/android-build.yml - Triggers:
# - On push to main
# - Builds APK and AAB
# - Creates GitHub releases with artifacts
# - Runs lint checks
# - Logs build summary
```

---

## 🔐 Security Features

### Local Development
- ✅ Keystore file ignored in `.gitignore` (*.jks, *.keystore)
- ✅ `signing.properties` ignored (contains passwords)
- ✅ Template provided: `signing.properties.example`
- ✅ Passwords stored in local password manager only

### GitHub Actions
- ✅ Keystore stored as base64 in GitHub Secrets (encrypted)
- ✅ Passwords stored separately in Secrets
- ✅ Credentials never logged or exposed
- ✅ Sensitive files cleaned up after build
- ✅ Artifacts retained for 30 days only

### Build Security
- ✅ ProGuard enabled to obfuscate code
- ✅ Resource shrinking enabled to remove unused code
- ✅ Debug flag disabled in release build
- ✅ HTTPS-only network configuration
- ✅ All permissions justified and documented

---

## 📦 Build Artifacts

### From GitHub Actions
The workflow produces:
- **APK** (`neural-twin-apk` artifact)
  - For: Beta testing, direct installation
  - File: `app/build/outputs/apk/release/app-release.apk`
  
- **AAB** (`neural-twin-aab` artifact)
  - For: Google Play Store submission (required)
  - File: `app/build/outputs/bundle/release/app-release.aab`

- **Lint Reports** (`lint-results` artifact)
  - For: Code quality analysis

All artifacts available in GitHub Actions run for 30 days.

---

## 📊 Deployment Workflow at a Glance

```
1. LOCAL DEVELOPMENT
   ├─ Create keystore.jks (one-time)
   ├─ Create signing.properties (local, .gitignore'd)
   └─ Test: ./gradlew bundleRelease

2. GITHUB ACTIONS (Automatic on Push to Main)
   ├─ Decode keystore from base64 secret
   ├─ Create signing.properties from env vars
   ├─ Build & sign APK and AAB
   ├─ Run lint checks
   ├─ Upload artifacts (30-day retention)
   └─ Create GitHub Release

3. GOOGLE PLAY CONSOLE (Manual)
   ├─ Download AAB artifact from GitHub
   ├─ Upload to Play Console
   ├─ Add release notes
   ├─ Set staged rollout (10% → 50% → 100%)
   └─ Monitor crash reports

4. POST-LAUNCH
   ├─ Monitor crash rate (target < 1%)
   ├─ Review user ratings & feedback
   ├─ Plan next release
   └─ Push fixes to main (cycle repeats)
```

---

## 🎯 Version Numbering

### Version Code (Internal, Play Store Requirement)
- Increments by 1 with each release
- v0.1.0 = Code 1
- v0.1.1 = Code 2
- v0.2.0 = Code 3
- Never decreases

### Version Name (User-Facing)
- Follows Semantic Versioning (MAJOR.MINOR.PATCH)
- v0.1.0 = Initial development
- v0.2.0 = New features
- v0.1.1 = Bug fixes
- v1.0.0 = Production ready

Update in: `android/app/build.gradle.kts`

---

## 📋 Pre-Release Checklist

Before uploading to Play Store:

```
Code Quality
[ ] ./gradlew lint — no critical issues
[ ] ./gradlew bundleRelease — successful build
[ ] Test APK on physical device + emulator
[ ] No runtime crashes with ProGuard enabled
[ ] Startup time < 5 seconds

Versioning
[ ] Version code incremented
[ ] Version name follows SemVer
[ ] RELEASE_NOTES.md updated

Documentation
[ ] App description proofread
[ ] Release notes written
[ ] Screenshots prepared (4-6 minimum)
[ ] Feature graphic created (1024x500px)
[ ] Privacy policy published
[ ] Support email verified

Configuration
[ ] Keystore signing verified
[ ] GitHub secrets configured
[ ] .gitignore protects sensitive files
[ ] Build config matches Play Store target SDK

Security
[ ] No hardcoded credentials
[ ] Network uses HTTPS only
[ ] All permissions justified
[ ] Dependencies up-to-date

Testing
[ ] Offline functionality works
[ ] Permissions requested correctly
[ ] Database migration tested (if applicable)
[ ] Battery/memory usage acceptable
```

---

## 🔄 Release Cycle (Recommended)

| Phase | Duration | Actions |
|-------|----------|---------|
| Development | Ongoing | Push to feature branches, PR reviews |
| Beta Testing | 1-2 weeks | Internal/Closed testing track on Play Store |
| Staged Rollout | 3-5 days | 10% → 50% → 100% with monitoring |
| Full Release | Ongoing | Monitor crash reports, plan next release |

---

## 🐛 Troubleshooting Quick Links

| Issue | Link |
|-------|------|
| Keystore/signing errors | [KEYSTORE_SETUP.md#9-troubleshooting](./android/KEYSTORE_SETUP.md#9-troubleshooting) |
| Build failures | [DEPLOYMENT_GUIDE.md#troubleshooting](./DEPLOYMENT_GUIDE.md#troubleshooting) |
| Play Store rejection | [PLAY_STORE_REQUIREMENTS.md](./PLAY_STORE_REQUIREMENTS.md) |
| GitHub Actions issues | [GitHub Actions Docs](https://docs.github.com/actions) |

---

## 📞 Support

Questions or issues?

- **Email:** wiggjamie28@gmail.com
- **Documentation:** See individual docs listed above
- **GitHub Issues:** File issue in repo
- **Android Docs:** https://developer.android.com/studio/publish

---

## 🎓 Learning Resources

### Official
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Gradle Build System](https://developer.android.com/build)
- [GitHub Actions Docs](https://docs.github.com/actions)

### ProGuard/R8
- [ProGuard Manual](https://www.guardsquare.com/manual/configuration/overview)
- [Android Code Shrinking](https://developer.android.com/build/shrink-code)

### Security
- [Android Security & Privacy](https://developer.android.com/privacy-and-security)
- [Network Security Config](https://developer.android.com/training/articles/security-config)

---

## ✅ Implementation Status

All components are now in place for Google Play Store deployment:

✅ **Build Configuration**
- Signing configs with environment variables
- Release build type with ProGuard/R8 enabled
- Debug build type for development

✅ **Code Optimization**
- ProGuard rules for all major dependencies
- Framework-critical classes preserved
- Optimization passes configured

✅ **CI/CD Automation**
- GitHub Actions workflow for automatic builds
- APK and AAB artifact generation
- Automated release creation

✅ **Documentation**
- Complete deployment guide
- Play Store requirements checklist
- Keystore setup and security guide
- Release notes template

✅ **Security**
- Keystore credentials in GitHub Secrets
- Local credentials in .gitignore
- Network security hardening
- Permission justification

Ready to deploy? Start with [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) Phase 1!
