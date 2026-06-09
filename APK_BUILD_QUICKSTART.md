# RHYTHMIX APK Build - Quick Start Guide

Build signed Android APKs for all 28 RHYTHMIX apps in minutes.

## 5-Minute Setup

### 1. Check Prerequisites (1 minute)
```bash
cd /home/user/jamie-wigg
./verify-android-env.sh
```

Expected output: `[✓] All requirements met!`

If Android SDK is missing, follow instructions below.

### 2. Install Android SDK (if needed)
```bash
bash SETUP-ANDROID-SDK.sh
cat ~/.android_sdk_setup_instructions.txt
```

Follow the instructions to download and install Android SDK.

### 3. Verify Setup
```bash
./verify-android-env.sh
# Should show [✓] All requirements met!
```

## Build APKs

### Test Run (no actual builds)
```bash
./build-apks.sh --dry-run
```
Takes <5 seconds, shows what would be built.

### Build All 28 Apps
```bash
./build-apks.sh
```
Takes 1-2 hours (first time), ~45 mins with cached dependencies.

APKs appear in: `/home/user/jamie-wigg/builds/`

### Build One App Only
```bash
./build-apks.sh --only budget-tracker
```
Takes 2-5 minutes. Useful for testing.

## Outputs

### APK Files
Located in `/home/user/jamie-wigg/builds/`:
- `blood-pressure-buddy-release.apk`
- `budget-tracker-release.apk`
- `calorie-counter-release.apk`
- ... (28 total)

Each is ~3-5 MB, fully signed and ready to distribute.

### Build Log
```bash
tail -50 /home/user/jamie-wigg/BUILD_LOG.txt
```

## Install on Device

### Via USB (Development)
```bash
# Connect Android device, enable USB debugging
adb install -r builds/budget-tracker-release.apk

# View logs
adb logcat | grep -i budget

# Uninstall
adb uninstall com.rhythmix.budgettracker
```

### Sideload (Direct Share)
Email or upload the `.apk` file. User installs directly from file manager.

### Google Play Store
1. Create account: https://play.google.com/console/
2. Create app entry
3. Upload signed APK
4. Fill details (description, screenshots, privacy policy)
5. Submit for review

## Options

| Command | Effect |
|---------|--------|
| `./build-apks.sh` | Build all 28 apps with signing |
| `./build-apks.sh --dry-run` | Validate setup without building |
| `./build-apks.sh --only app-name` | Build one app only |
| `./build-apks.sh --skip-signing` | Build without signing (faster for testing) |

## Environment Variables (Advanced)

```bash
# Custom keystore password
export KEYSTORE_PASSWORD="your-password"
export KEY_PASSWORD="your-key-password"
./build-apks.sh

# Custom SDK location
export ANDROID_SDK_ROOT="$HOME/my-android-sdk"
./verify-android-env.sh
```

## Troubleshooting

### Android SDK Not Found
```bash
# Find where it's installed
find $HOME -type d -name "Sdk" 2>/dev/null

# Set it
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"

# Make permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export ANDROID_SDK_ROOT=$HOME/Android/Sdk' >> ~/.bashrc
source ~/.bashrc
```

### Gradle Build Failed
```bash
# Clear gradle cache
rm -rf ~/.gradle/caches/

# Verify Java version (need 11+)
java -version

# Retry
./build-apks.sh --only budget-tracker
```

### Build Takes Too Long
- First build: Downloads gradle, dependencies (~30 mins for all 28)
- Subsequent: Much faster (~2-3 mins per app with cache)
- Disk speed and internet speed affect build time

### APK Not Found
```bash
# Check temp build directory
ls -lh builds/.tmp/budget-tracker/android/app/build/outputs/apk/release/

# View detailed error log
grep -A 5 -i "error" BUILD_LOG.txt
```

## Key Files

| File | Purpose |
|------|---------|
| `/home/user/jamie-wigg/build-apks.sh` | Main build script |
| `/home/user/jamie-wigg/verify-android-env.sh` | Environment checker |
| `/home/user/jamie-wigg/ANDROID_BUILD_SETUP.md` | Detailed documentation |
| `/home/user/jamie-wigg/builds/` | Output directory |
| `/home/user/jamie-wigg/BUILD_LOG.txt` | Build log (created after first build) |
| `/home/user/jamie-wigg/rhythmix.jks` | Release signing keystore (auto-created) |

## Architecture

```
Per-app build process:
  builds/.tmp/<app-name>/
    ├── www/
    │   └── index.html          (copied from apps/*.html)
    ├── capacitor.config.json   (app-specific config)
    ├── package.json            (Capacitor deps)
    ├── android/                (native Android project)
    │   └── app/
    │       └── build/outputs/apk/release/
    │           └── app-release.apk
    └── ...

Signed output:
  builds/
    ├── <app-name>-release.apk  (signed, ready for distribution)
    └── ...
```

## Performance Metrics

- **28 apps total**: 1-2 hours (first build), ~45 minutes (cached)
- **Single app**: 2-5 minutes (first), 1-2 minutes (cached)
- **Dry run**: <5 seconds
- **APK size**: 3-5 MB each
- **Total disk needed**: ~20 GB (SDK + gradle cache + builds)

## Next Steps

1. Run: `./verify-android-env.sh`
2. If Android SDK needed: `bash SETUP-ANDROID-SDK.sh` and follow instructions
3. Run: `./build-apks.sh --dry-run` (test)
4. Run: `./build-apks.sh` (build all)
5. APKs ready in: `builds/`

## Questions?

Detailed docs: `ANDROID_BUILD_SETUP.md`
Build output: `BUILD_LOG.txt`
Signing details: `builds/README.md`
