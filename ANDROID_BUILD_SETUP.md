# RHYTHMIX Multi-App Android APK Build Setup

Complete guide for building release APKs for all 28 RHYTHMIX apps using Capacitor and Android Gradle.

## Overview

This setup uses:
- **Capacitor** (v7.0.0) — cross-platform mobile framework
- **Android SDK** — Android development tools
- **Gradle** — build system (bundled with Capacitor)
- **OpenJDK 21** — Java runtime (already installed)

The build process:
1. Initializes a separate Capacitor project for each app
2. Copies the app's HTML/CSS/JS to the web root
3. Configures app-specific Capacitor settings (package name, display name, etc.)
4. Runs `cap add android` to scaffold the native Android project
5. Builds a release APK with Gradle
6. Signs APKs with a release keystore
7. Outputs signed APKs to `/home/user/jamie-wigg/builds/`

## Prerequisites

### Already Installed (Verified)
- **Java 21** — OpenJDK Runtime Environment ✓
- **Node.js 20+** — JavaScript runtime ✓
- **npm** — Node package manager ✓

### To Install

#### 1. Android SDK (Required)

Option A: Android Studio (recommended for UI development)
```bash
# Download from: https://developer.android.com/studio
# Or on Ubuntu:
sudo apt-get install android-sdk
```

Option B: Command-line tools only
```bash
# Download Android SDK command-line tools from:
# https://developer.android.com/studio#cmdline-tools

# Extract and set environment variables:
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH
```

#### 2. Android Build Tools (Required)

Once SDK is set up, install build tools:
```bash
# List available tools:
$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --list

# Install required components:
$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager \
  "platforms;android-35" \
  "build-tools;35.0.0" \
  "cmdline-tools;latest"
```

#### 3. Verify Environment

```bash
# Check Java
java -version
# Expected: OpenJDK 21.x

# Check Android SDK
echo $ANDROID_SDK_ROOT
# Should return path to your Android SDK

# Check build tools
ls $ANDROID_SDK_ROOT/build-tools/
# Should list one or more versions
```

## Quick Start

### 1. Set Up Environment

```bash
# Add to ~/.bashrc or ~/.zshrc (or your shell profile):
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH

# Load changes
source ~/.bashrc  # or ~/.zshrc
```

### 2. Test Environment

```bash
cd /home/user/jamie-wigg

# Verify Java
java -version

# Verify Node/npm
node --version
npm --version

# Verify Android SDK
echo $ANDROID_SDK_ROOT
ls $ANDROID_SDK_ROOT/platforms/
# Should show: android-35, android-34, etc.
```

### 3. Run the Build Script

```bash
cd /home/user/jamie-wigg

# Dry run (no actual builds, just validation):
./build-apks.sh --dry-run

# Full build (all 28 apps):
./build-apks.sh

# Build specific app only:
./build-apks.sh --only budget-tracker

# Skip signing (faster for testing):
./build-apks.sh --skip-signing
```

## Build Script Details

### Location
```
/home/user/jamie-wigg/build-apks.sh
```

### Output
- **APKs**: `/home/user/jamie-wigg/builds/*.apk`
- **Build log**: `/home/user/jamie-wigg/BUILD_LOG.txt`
- **Temp files**: `/home/user/jamie-wigg/builds/.tmp/` (auto-cleaned after build)

### Apps Built (28 total)

| # | App Name | Package | Output |
|---|----------|---------|--------|
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

### Signing

APKs are automatically signed with a release keystore:
- **Location**: `/home/user/jamie-wigg/rhythmix.jks`
- **Alias**: `rhythmix-release-key`
- **Algorithm**: SHA256withRSA (industry standard)
- **Validity**: 10 years

The keystore is auto-generated on first build if it doesn't exist.

**To set custom keystore password:**
```bash
export KEYSTORE_PASSWORD="your-password"
export KEY_PASSWORD="your-key-password"
./build-apks.sh
```

### Build Options

```bash
# Full build
./build-apks.sh

# Dry run (validate without building)
./build-apks.sh --dry-run

# Skip signing (for testing)
./build-apks.sh --skip-signing

# Build one app only
./build-apks.sh --only budget-tracker

# Combine options
./build-apks.sh --only dreams --skip-signing
```

## Troubleshooting

### "ANDROID_SDK_ROOT not set"

```bash
# Find your Android SDK:
find $HOME -type d -name "Sdk" 2>/dev/null

# Set it permanently:
echo 'export ANDROID_SDK_ROOT=$HOME/Android/Sdk' >> ~/.bashrc
source ~/.bashrc
```

### "build-tools version not found"

```bash
# Check installed versions:
ls $ANDROID_SDK_ROOT/build-tools/

# Install missing version (example: 35.0.0):
sdkmanager "build-tools;35.0.0"
```

### "Gradle build failed"

1. Check Java version: `java -version` (should be 11+)
2. Clear Gradle cache: `rm -rf ~/.gradle/caches/`
3. Check disk space: `df -h`
4. Check build log: `tail -100 BUILD_LOG.txt`

### "APK not found after build"

- Check `builds/.tmp/<app-name>/android/app/build/outputs/apk/release/`
- Look for errors in `BUILD_LOG.txt`
- Ensure all app HTML files exist in `/home/user/jamie-wigg/apps/`

### "Keystore errors"

```bash
# Verify keystore:
keytool -list -v -keystore /home/user/jamie-wigg/rhythmix.jks

# Regenerate (backs up old):
mv /home/user/jamie-wigg/rhythmix.jks /home/user/jamie-wigg/rhythmix.jks.bak
./build-apks.sh
```

## Distribution

### Google Play Store

1. Create a developer account: https://play.google.com/console/
2. Create an app entry
3. Upload the signed APK (`.apk` file from `builds/`)
4. Fill in app details (screenshots, description, privacy policy)
5. Submit for review

### Direct Distribution (Sideloading)

Share the `.apk` file directly:
```bash
# Generate QR code for direct download:
curl "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://example.com/your-app.apk"
```

### Testing on Device

```bash
# Install APK via adb:
adb install -r builds/budget-tracker-release.apk

# Uninstall:
adb uninstall com.rhythmix.budgettracker

# View logs:
adb logcat
```

## Performance Notes

- **First build**: ~5-10 minutes per app (dependency downloads)
- **Subsequent builds**: ~2-3 minutes per app (cached deps)
- **All 28 apps**: 1-2 hours first run, ~45 mins with cache
- **Disk space needed**: ~20GB (SDK + builds + gradle cache)

## Manual Capacitor Setup (Alternative)

If you need to set up a single app manually:

```bash
cd /tmp/my-app-build
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor project
npx cap init com.rhythmix.myapp MyApp --web-dir=www

# Create web directory and add your app
mkdir www
cp /home/user/jamie-wigg/apps/my-app.html www/index.html

# Add Android platform
npx cap add android

# Open in Android Studio
npx cap open android

# Or build from CLI
npx cap build android --release
```

## References

- Capacitor docs: https://capacitorjs.com/docs/getting-started
- Android build docs: https://developer.android.com/build
- Gradle docs: https://gradle.org/
- Android signing: https://developer.android.com/studio/publish/app-signing

## Support

For issues, check:
1. `BUILD_LOG.txt` for detailed errors
2. `builds/.tmp/<app-name>/` for intermediate build artifacts
3. Java/Android/Node versions match requirements above
