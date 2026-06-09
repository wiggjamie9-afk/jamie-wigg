# RHYTHMIX APK Build System - Complete Index

Complete guide to building signed Android APKs for all 28 RHYTHMIX apps.

## Quick Navigation

**First time?** → Read: `APK_BUILD_QUICKSTART.md` (5 minutes)

**Setup issues?** → Run: `./verify-android-env.sh`

**Need Android SDK?** → Run: `bash SETUP-ANDROID-SDK.sh`

**Full documentation?** → Read: `ANDROID_BUILD_SETUP.md`

**Status summary?** → Read: `APK_BUILD_SUMMARY.txt`

## Files in This Setup

### Scripts (Executable)

| File | Purpose | Time |
|------|---------|------|
| `build-apks.sh` | Main APK builder for all 28 apps | 1-2 hrs (first), 45 mins (cached) |
| `verify-android-env.sh` | Verify Java, Node, Android SDK setup | <5 seconds |
| `SETUP-ANDROID-SDK.sh` | Generate Android SDK setup instructions | instant |

### Documentation

| File | Purpose | Read Time |
|------|---------|-----------|
| `APK_BUILD_QUICKSTART.md` | Get started in 5 minutes | 3 minutes |
| `ANDROID_BUILD_SETUP.md` | Complete reference guide (troubleshooting, distributions) | 15 minutes |
| `APK_BUILD_SUMMARY.txt` | Current setup status and next steps | 5 minutes |
| `APK_BUILD_INDEX.md` | This file - complete navigation | 5 minutes |
| `builds/README.md` | Build output details and verification | 10 minutes |

## Typical Workflow

### 1. Environment Setup (10-30 minutes, one-time)

```bash
# Verify current environment
./verify-android-env.sh

# If Android SDK is missing:
bash SETUP-ANDROID-SDK.sh
cat ~/.android_sdk_setup_instructions.txt

# Follow instructions to install Android SDK, then:
export ANDROID_SDK_ROOT=$HOME/Android/Sdk  # (or your path)

# Add to ~/.bashrc or ~/.zshrc for persistence:
echo 'export ANDROID_SDK_ROOT=$HOME/Android/Sdk' >> ~/.bashrc
source ~/.bashrc

# Verify setup complete
./verify-android-env.sh
# Should show: [✓] All requirements met!
```

### 2. Test Build (optional, <5 seconds)

```bash
./build-apks.sh --dry-run
# Shows what would be built without actually building
```

### 3. Build All APKs (1-2 hours, first time)

```bash
./build-apks.sh
# Builds all 28 apps with signing

# Monitor progress:
tail -f BUILD_LOG.txt  # (in another terminal)
```

### 4. Check Results

```bash
# View output APKs
ls -lh builds/*.apk

# Check build log
tail -50 BUILD_LOG.txt

# Verify APK signatures
jarsigner -verify builds/budget-tracker-release.apk
```

### 5. Install on Device

```bash
# Install via USB (development)
adb install -r builds/budget-tracker-release.apk

# Or distribute APKs to users
# - Direct share (email, cloud)
# - Google Play Store
# - Sideload (file manager)
```

## Command Reference

### Build Commands

```bash
# All 28 apps (first time: 1-2 hours, cached: 45 mins)
./build-apks.sh

# Dry run (test without building, <5 seconds)
./build-apks.sh --dry-run

# One app only (faster for testing, 2-5 minutes)
./build-apks.sh --only budget-tracker

# Build without signing (faster for development)
./build-apks.sh --skip-signing

# Combine options
./build-apks.sh --only dreams --skip-signing
```

### Verification Commands

```bash
# Check environment setup
./verify-android-env.sh

# View build log
cat BUILD_LOG.txt
tail -50 BUILD_LOG.txt
tail -f BUILD_LOG.txt  # live monitoring

# Check for errors
grep -i error BUILD_LOG.txt
grep -i failed BUILD_LOG.txt

# List generated APKs
ls -lh builds/*.apk

# Verify APK signature
jarsigner -verify builds/budget-tracker-release.apk

# Show certificate details
keytool -printcert -jarfile builds/budget-tracker-release.apk
```

### Device Testing Commands

```bash
# Install APK
adb install -r builds/budget-tracker-release.apk

# Check installation
adb shell pm list packages | grep rhythmix

# View logs
adb logcat | grep rhythmix

# Uninstall
adb uninstall com.rhythmix.budgettracker

# Start app directly
adb shell am start -n com.rhythmix.budgettracker/.MainActivity
```

## Files Created by Build

### Output Directory: `builds/`

```
builds/
├── README.md                    # Build output documentation
├── *.apk                        # 28 signed APK files
└── .tmp/                        # Temporary build files (auto-cleaned)
    ├── app-name-1/
    │   ├── www/                 # Web assets
    │   ├── capacitor.config.json
    │   ├── package.json
    │   ├── android/             # Native Android project
    │   └── ...
    └── app-name-28/
        └── ...
```

### Generated Files at Root

```
rhythmix.jks                    # Release signing keystore (auto-generated)
BUILD_LOG.txt                   # Detailed build log (created after first build)
```

## 28 Apps Included

| # | App | Package | Output |
|---|-----|---------|--------|
| 1 | Blood Pressure Buddy | `com.rhythmix.bloodpressure` | `blood-pressure-buddy-release.apk` |
| 2 | Budget Tracker | `com.rhythmix.budgettracker` | `budget-tracker-release.apk` |
| 3 | Calorie Counter | `com.rhythmix.caloriecounter` | `calorie-counter-release.apk` |
| 4 | Daily Planner | `com.rhythmix.dailyplanner` | `daily-planner-release.apk` |
| 5 | Dreams | `com.rhythmix.dreams` | `dreams-release.apk` |
| 6 | English Pocket | `com.rhythmix.englishpocket` | `english-pocket-release.apk` |
| 7 | Expense Tracker | `com.rhythmix.expensetracker` | `expense-tracker-release.apk` |
| 8 | Goal Tracker | `com.rhythmix.goaltracker` | `goal-tracker-release.apk` |
| 9 | Habit Streak | `com.rhythmix.habitstreak` | `habit-streak-release.apk` |
| 10 | Heartbeat | `com.rhythmix.heartbeat` | `heartbeat-release.apk` |
| 11 | Hum | `com.rhythmix.hum` | `hum-release.apk` |
| 12 | Life Audit | `com.rhythmix.lifeaudit` | `lifeaudit-release.apk` |
| 13 | Live | `com.rhythmix.live` | `live-release.apk` |
| 14 | Loan Calculator | `com.rhythmix.loancalculator` | `loan-calculator-release.apk` |
| 15 | Math Helper | `com.rhythmix.mathhelper` | `math-helper-release.apk` |
| 16 | Medicine Companion | `com.rhythmix.medicinecompanion` | `medicine-companion-release.apk` |
| 17 | Meditation Guide | `com.rhythmix.meditationguide` | `meditation-guide-release.apk` |
| 18 | Mood Journal | `com.rhythmix.moodjournal` | `mood-journal-release.apk` |
| 19 | Notes | `com.rhythmix.notes` | `notes-release.apk` |
| 20 | Period Tracker | `com.rhythmix.periodtracker` | `period-tracker-release.apk` |
| 21 | Pomodoro Timer | `com.rhythmix.pomodorotimer` | `pomodoro-timer-release.apk` |
| 22 | Quick Recipes | `com.rhythmix.quickrecipes` | `quick-recipes-release.apk` |
| 23 | Reminders | `com.rhythmix.reminders` | `reminders-release.apk` |
| 24 | Resonate | `com.rhythmix.resonate` | `resonate-release.apk` |
| 25 | Savings Challenge | `com.rhythmix.savingschallenge` | `savings-challenge-release.apk` |
| 26 | Study Planner | `com.rhythmix.studyplanner` | `study-planner-release.apk` |
| 27 | Water Tracker | `com.rhythmix.watertracker` | `water-tracker-release.apk` |

(Excluded: index.html, test-suite.html, get-apps.html, thumbnails.html - utility files)

## Architecture

### Build Flow (per app)

```
App HTML file (apps/*.html)
         ↓
  [Capacitor project initialized]
         ↓
  [Web assets copied to www/]
         ↓
  [Android platform added: npx cap add android]
         ↓
  [Web synced: npx cap sync]
         ↓
  [Release APK built: npx cap build android --release]
         ↓
  [APK signed with rhythmix.jks]
         ↓
  Release APK (builds/*.apk)
```

### Environment

```
Java 21 (OpenJDK)
  ↓
Node.js v22 + npm
  ↓
Capacitor 7.0.0 (@capacitor/cli, @capacitor/core, @capacitor/android)
  ↓
Android SDK + Build Tools 35
  ↓
Gradle (bundled with Android)
  ↓
keytool + jarsigner (for signing)
```

## Troubleshooting Guide

### Quick Diagnostic

```bash
# 1. Check everything
./verify-android-env.sh

# 2. View build errors
grep -i error BUILD_LOG.txt

# 3. Check temp build directory
ls -lh builds/.tmp/budget-tracker/android/app/build/outputs/apk/release/

# 4. Clear caches and retry
rm -rf ~/.gradle/caches/
./build-apks.sh --only budget-tracker
```

### Common Issues

| Issue | Fix |
|-------|-----|
| `ANDROID_SDK_ROOT not set` | `export ANDROID_SDK_ROOT=$HOME/Android/Sdk` |
| Build tools not found | `sdkmanager "build-tools;35.0.0"` |
| Gradle build failed | `rm -rf ~/.gradle/caches/ && ./build-apks.sh` |
| APK not found | Check `builds/.tmp/<app>/android/app/build/outputs/apk/release/` |
| Signing failed | Verify keystore: `keytool -list -v -keystore rhythmix.jks` |
| Out of disk | Ensure 15-20 GB free: `df -h` |
| Java version wrong | Need 11+: `java -version` |

Full troubleshooting: See `ANDROID_BUILD_SETUP.md` → "Troubleshooting" section

## Performance Metrics

| Task | Time | Notes |
|------|------|-------|
| Verify environment | <5 sec | Just checks, no downloads |
| Dry run | <5 sec | Validate setup without building |
| First build (all 28) | 1-2 hrs | Downloads dependencies |
| Cached build (all 28) | ~45 mins | Reuses gradle cache |
| Single app (first) | 5-10 mins | Includes deps |
| Single app (cached) | 1-2 mins | Fast iteration |

Factors:
- Network speed (gradle downloads)
- Disk speed (I/O intensive)
- CPU (Gradle compilation)
- RAM (Gradle VM)

## Signing & Distribution

### Release Keystore
- **Path**: `/home/user/jamie-wigg/rhythmix.jks`
- **Alias**: `rhythmix-release-key`
- **Algorithm**: SHA256withRSA
- **Validity**: 10 years
- **Auto-generated**: First build (if not present)

### Verify Signature
```bash
jarsigner -verify -verbose builds/budget-tracker-release.apk
```

### Distribution Options

1. **Google Play Store** (recommended)
   - Create developer account: https://play.google.com/console/
   - Upload signed APK
   - Add description, screenshots, privacy policy
   - Submit for review (3-24 hours)

2. **Direct Sideload** (direct distribution)
   - Email or upload APK file
   - User downloads and opens from file manager
   - Installs directly (allows unknown sources)

3. **Alternative Stores** (Amazon, Samsung Galaxy, F-Droid, etc.)
   - Each has its own submission process
   - All use the same signed APK

4. **Enterprise Distribution** (internal apps)
   - MDM (Mobile Device Management)
   - Corporate app store
   - Internal distribution server

## System Requirements

### Minimum
- Java 11+ (Java 21 confirmed ✓)
- Node.js 20+ (Node 22 confirmed ✓)
- npm (v10.9.7 confirmed ✓)
- Android SDK (needs setup)
- 15-20 GB free disk space (29 GB confirmed ✓)

### Installed & Ready
- OpenJDK 21 ✓
- Node.js v22.22.2 ✓
- npm v10.9.7 ✓
- keytool ✓
- jarsigner ✓
- npx ✓

### Needs Setup
- Android SDK (choose Option 1 or 2 in setup instructions)

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `ANDROID_SDK_ROOT` | `$HOME/Android/Sdk` | Android SDK location |
| `ANDROID_HOME` | `$ANDROID_SDK_ROOT` | Alternative name |
| `PATH` | Include SDK tools | Access `sdkmanager`, `adb`, etc. |
| `KEYSTORE_PASSWORD` | (optional) | Custom keystore password |
| `KEY_PASSWORD` | (optional) | Custom key password |

Default keystore password used if not specified: `rhythmix2024`

## Monorepo Structure

```
/home/user/jamie-wigg/
├── build-apks.sh                    # Main builder (executable)
├── verify-android-env.sh             # Environment checker (executable)
├── SETUP-ANDROID-SDK.sh              # SDK setup helper (executable)
├── ANDROID_BUILD_SETUP.md            # Full documentation
├── APK_BUILD_QUICKSTART.md           # 5-minute guide
├── APK_BUILD_SUMMARY.txt             # Status summary
├── APK_BUILD_INDEX.md                # This file
├── rhythmix.jks                      # Release keystore (auto-created)
├── BUILD_LOG.txt                     # Build log (auto-created)
├── builds/
│   ├── README.md
│   ├── *.apk                         # 28 signed APKs
│   └── .tmp/                         # Temporary build files
├── apps/
│   ├── blood-pressure-buddy.html
│   ├── budget-tracker.html
│   ├── ... (37 HTML files total)
└── ...
```

## Next Steps

1. **First time setup**: Run `./verify-android-env.sh`
2. **Need Android SDK**: Run `bash SETUP-ANDROID-SDK.sh`
3. **Ready to build**: Run `./build-apks.sh`
4. **Questions**: Read `APK_BUILD_QUICKSTART.md` or `ANDROID_BUILD_SETUP.md`
5. **Check results**: See `builds/*.apk` and `BUILD_LOG.txt`

## Support Resources

### Documentation Files
- `APK_BUILD_QUICKSTART.md` - Get started fast
- `ANDROID_BUILD_SETUP.md` - Complete reference
- `builds/README.md` - Build outputs and testing
- `APK_BUILD_SUMMARY.txt` - Current status
- This file: `APK_BUILD_INDEX.md` - Navigation guide

### Diagnostic Tools
- `./verify-android-env.sh` - Check environment
- `bash SETUP-ANDROID-SDK.sh` - SDK setup instructions
- `BUILD_LOG.txt` - Detailed build output
- `grep -i error BUILD_LOG.txt` - Find errors

### References
- Capacitor docs: https://capacitorjs.com/
- Android build: https://developer.android.com/build
- Play Store: https://developer.android.com/distribute
- APK signing: https://developer.android.com/studio/publish/app-signing

## License & Keystore

The release keystore is automatically generated with:
- **Organization**: RHYTHMIX
- **Common Name**: RHYTHMIX Suite
- **Location**: Sydney, NSW, Australia

If you need to sign with a different key or restore a backup:
```bash
# Backup current
mv rhythmix.jks rhythmix.jks.backup

# Restore from backup
cp rhythmix.jks.backup rhythmix.jks

# Or regenerate
rm rhythmix.jks
./build-apks.sh  # Will create new keystore on first build
```

---

**Start here**: `APK_BUILD_QUICKSTART.md`

**Have issues**: `./verify-android-env.sh` then check `ANDROID_BUILD_SETUP.md`

**Ready to build**: `./build-apks.sh`
