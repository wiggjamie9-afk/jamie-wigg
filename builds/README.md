# RHYTHMIX APK Builds

This directory contains signed APK bundles for all 28 RHYTHMIX apps built with Capacitor and Android Gradle.

## Location
```
/home/user/jamie-wigg/builds/
```

## Files

### Released APKs
Once built, signed APK files will appear here:
```
- blood-pressure-buddy-release.apk
- budget-tracker-release.apk
- calorie-counter-release.apk
- daily-planner-release.apk
- dreams-release.apk
- english-pocket-release.apk
- expense-tracker-release.apk
- goal-tracker-release.apk
- habit-streak-release.apk
- heartbeat-release.apk
- hum-release.apk
- lifeaudit-release.apk
- live-release.apk
- loan-calculator-release.apk
- math-helper-release.apk
- medicine-companion-release.apk
- meditation-guide-release.apk
- mood-journal-release.apk
- notes-release.apk
- period-tracker-release.apk
- pomodoro-timer-release.apk
- quick-recipes-release.apk
- reminders-release.apk
- resonate-release.apk
- savings-challenge-release.apk
- study-planner-release.apk
- water-tracker-release.apk
```

### Build Artifacts
```
.tmp/                    # Temporary build directories (auto-created/cleaned)
  ├── app-name-1/
  ├── app-name-2/
  └── ...
```

## Build Process

### Quick Start
```bash
cd /home/user/jamie-wigg

# Verify environment is set up
./verify-android-env.sh

# Dry run (no actual builds)
./build-apks.sh --dry-run

# Build all 28 apps
./build-apks.sh

# Build specific app only
./build-apks.sh --only budget-tracker
```

### What the Build Script Does

For each app:
1. Creates an isolated Capacitor project in `.tmp/<app-name>/`
2. Copies the app HTML to the web root
3. Generates `capacitor.config.json` with app-specific package name
4. Installs npm dependencies (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`)
5. Adds Android platform: `npx cap add android`
6. Syncs web assets: `npx cap sync`
7. Builds release APK: `npx cap build android --release`
8. Signs APK with the release keystore (`rhythmix.jks`)
9. Copies signed APK to `/builds/`

### Build Configuration

**Keystore Details:**
- Path: `/home/user/jamie-wigg/rhythmix.jks`
- Alias: `rhythmix-release-key`
- Algorithm: SHA256withRSA
- Validity: 10 years
- Auto-generated on first build if not present

**Package Names:**
Each app gets a unique package name under `com.rhythmix.*`:
- `com.rhythmix.budgettracker`
- `com.rhythmix.bloodpressure`
- `com.rhythmix.caloriecounter`
- etc.

## Installation

### On Android Device via USB

```bash
# Install APK
adb install -r builds/budget-tracker-release.apk

# Uninstall
adb uninstall com.rhythmix.budgettracker

# Check install status
adb shell pm list packages | grep rhythmix
```

### Direct Download (Sideload)

Share the `.apk` file directly:
1. Email, cloud drive, or web server
2. User downloads on Android device
3. Opens file manager → APK file → Install

### Google Play Store

1. Create Google Play Console account
2. Create app entry
3. Upload signed APK
4. Fill app details (name, description, screenshots, privacy policy)
5. Submit for review

## Verification

### Check APK Signature

```bash
# Verify APK is properly signed
jarsigner -verify -verbose builds/budget-tracker-release.apk

# Show certificate details
keytool -printcert -jarfile builds/budget-tracker-release.apk
```

### List APK Contents

```bash
# List files in APK
unzip -l builds/budget-tracker-release.apk | head -30

# Extract specific file
unzip builds/budget-tracker-release.apk "assets/www/index.html"
```

### Test APK Installation

```bash
# Install and test
adb install -r builds/budget-tracker-release.apk
adb shell am start -n com.rhythmix.budgettracker/.MainActivity

# View logs
adb logcat | grep "budget"

# Uninstall
adb uninstall com.rhythmix.budgettracker
```

## Build Log

Detailed build output is saved to:
```
/home/user/jamie-wigg/BUILD_LOG.txt
```

View last 50 lines:
```bash
tail -50 /home/user/jamie-wigg/BUILD_LOG.txt
```

## Troubleshooting

### APK Not Found After Build

```bash
# Check temp build directory
ls -lh builds/.tmp/budget-tracker/android/app/build/outputs/apk/release/

# Check build log for errors
grep -i "error\|failed" BUILD_LOG.txt
```

### Signing Failed

```bash
# Verify keystore exists
ls -lh /home/user/jamie-wigg/rhythmix.jks

# Verify keystore contents
keytool -list -v -keystore /home/user/jamie-wigg/rhythmix.jks

# Regenerate keystore (backs up old)
mv /home/user/jamie-wigg/rhythmix.jks /home/user/jamie-wigg/rhythmix.jks.bak
./build-apks.sh --skip-signing  # Build without signing first
```

### Gradle Build Failed

```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches/

# Check Java version (need 11+)
java -version

# Check Android SDK
echo $ANDROID_SDK_ROOT
ls $ANDROID_SDK_ROOT/build-tools/

# Retry build with verbose output
./build-apks.sh --only budget-tracker
```

### Out of Disk Space

```bash
# Check available space
df -h

# Clean up temp files
rm -rf builds/.tmp/

# Clean up Gradle cache
rm -rf ~/.gradle/caches/
```

## Performance

| Task | Time | Notes |
|------|------|-------|
| Full build (all 28 apps) | 1-2 hours (first), 45 mins (cached) | Depends on network, disk speed |
| Single app | 2-5 minutes (first), 1-2 minutes (cached) | Dry run: <5 seconds |
| APK size | 3-5 MB each | Includes web assets + Capacitor runtime |
| Total storage | ~20 GB | SDK + gradle cache + build artifacts |

## Distribution Checklist

Before releasing to users:

- [ ] Verify APK signature: `jarsigner -verify builds/*.apk`
- [ ] Test on device: `adb install builds/*.apk`
- [ ] Test app functionality (all features work offline)
- [ ] Check permissions (Location, Camera, Microphone if used)
- [ ] Verify privacy policy and terms of service
- [ ] Create app store listing (name, description, screenshots)
- [ ] Upload to Google Play Console or equivalent
- [ ] Generate QR codes for direct download
- [ ] Create installation guide for users

## Resources

- Capacitor docs: https://capacitorjs.com/
- Android build: https://developer.android.com/build
- Play Store setup: https://developer.android.com/distribute
- APK signing: https://developer.android.com/studio/publish/app-signing
- jarsigner: https://docs.oracle.com/javase/8/docs/technotes/tools/windows/jarsigner.html

## Support

Check the main build documentation:
```bash
cat /home/user/jamie-wigg/ANDROID_BUILD_SETUP.md
```

Environment verification:
```bash
/home/user/jamie-wigg/verify-android-env.sh
```
