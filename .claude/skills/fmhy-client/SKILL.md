---
name: fmhy-client
description: FMHY (Free Media HTML Yard) cross-platform client build system. Desktop support (Windows, macOS, Linux) and mobile (iOS, Android) with Electron + Capacitor. Complete build instructions for distribution, APK signing, code signing, and deployment. Includes setup scripts for Android signing, Gradle builds, Xcode configuration, and troubleshooting guides for all platforms.
metadata:
  tags: cross-platform, electron, capacitor, build-system, distribution, ios, android, windows, macos, linux, webview
---

## When to use

User asks for:
- "Build a cross-platform desktop + mobile app"
- "Create Windows/Mac/Linux installers"
- "Build iOS and Android apps"
- "Set up APK signing and distribution"
- "Package Electron app for distribution"
- "Deploy webview wrapper to multiple platforms"

Perfect for:
- Wrapping websites into native apps
- 100 APPS mission desktop/mobile clients
- Rapid distribution across platforms
- Creating offline-capable wrappers
- Content apps with custom branding

## Overview

**FMHY Client** is a multi-platform wrapper that loads a website (FMHY.net) into native containers:

- **Desktop**: Electron (Windows/macOS/Linux)
- **Mobile**: Capacitor (iOS/Android)
- **Backend**: Simple HTML iframe pointing to target URL
- **Build System**: npm scripts + Gradle (Android) + Xcode (iOS)

**Supported Platforms:**
- ✅ Windows (portable + installer)
- ✅ macOS (DMG + ZIP)
- ✅ Linux (AppImage + DEB + RPM)
- ✅ iOS (IPA + sideload)
- ✅ Android (APK debug + signed release)

## Prerequisites by Platform

### Desktop (All Platforms)
```bash
Node.js v20+
npm (included with Node)
Git
```

### Windows
- Windows 10+ (no additional tools needed)

### macOS
- macOS 10.13+ with Xcode 14+
- For signing: Apple Developer ID

### Linux
- Standard build tools (gcc, make, etc.)
- lib32z1 (for some architectures)

### iOS
- macOS with Xcode 14+ (required)
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer account (for device deployment)
- iOS 13+

### Android
- Android Studio or CLI tools
- Java Development Kit (JDK) 17+
- Android SDK API 33+
- For release: keystore + signing configuration

## Quick Start (All Platforms)

### Setup

```bash
# Clone repository
git clone https://github.com/eli32-vlc/FMHY-Clients.git
cd FMHY-Clients

# Install dependencies
npm install

# Run in development
npm start
```

### Build for Your Platform

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# iOS (requires macOS)
npm run cap:sync
npm run cap:open:ios

# Android
npm run cap:sync
npm run cap:open:android
```

## Desktop Builds

### Windows

#### Build Command
```bash
npm run build:win
```

#### Outputs (in `dist/`)
- `FMHY Client Setup x.x.x.exe` — NSIS installer (recommended for distribution)
- `FMHY Client x.x.x.exe` — Portable executable (no installation)

#### First-Time Build
- electron-builder downloads dependencies (~200MB)
- May take 3-5 minutes on first run
- Subsequent builds are faster

#### Distribution
1. Sign the executable with a code signing certificate (optional but recommended)
2. Host the installer on your website
3. Users download and run the .exe installer
4. App installs to `C:\Program Files\`

**Note**: Unsigned executables will show Windows Defender warning (normal for unsigned apps)

### macOS

#### Build Command
```bash
npm run build:mac
```

#### Outputs (in `dist/`)
- `FMHY Client-x.x.x.dmg` — DMG installer (double-click to install)
- `FMHY Client-x.x.x-mac.zip` — ZIP archive (portable)

#### Signing for Distribution
For proper distribution, sign with Apple Developer ID:

1. Obtain Developer ID certificate from Apple
2. Configure in `package.json`:
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (XXXXXXXXXX)"
    }
  }
}
```
3. Rebuild: `npm run build:mac`

#### Distribution
- DMG file: User double-clicks → app installs to Applications
- ZIP file: User extracts → portable app

**Note**: Unsigned apps show security warning on first launch; users must right-click → Open

### Linux

#### Build Command
```bash
npm run build:linux
```

#### Outputs (in `dist/`)
- `FMHY Client-x.x.x.AppImage` — Universal Linux package (works on most distros)
- `fmhy-client_x.x.x_amd64.deb` — Debian/Ubuntu package
- `fmhy-client-x.x.x.x86_64.rpm` — Fedora/RedHat package

#### Distribution by Format

**AppImage** (recommended for simplicity):
```bash
# User: download and run
./FMHY\ Client-x.x.x.AppImage
```
- Works on Ubuntu 16.04+, Fedora 25+, etc.
- No installation required
- Single file, self-contained

**DEB Package** (Debian/Ubuntu):
```bash
# User: install via GUI or command line
sudo apt install ./fmhy-client_x.x.x_amd64.deb
```
- Installs to `/opt/fmhy-client/`
- Adds menu shortcuts
- Can be upgraded via apt

**RPM Package** (Fedora/RedHat):
```bash
# User: install via GUI or command line
sudo dnf install fmhy-client-x.x.x.x86_64.rpm
```
- Installs to `/opt/fmhy-client/`
- Integrates with package manager

## Mobile Builds

### iOS (macOS Only)

#### Prerequisites
```bash
sudo gem install cocoapods
# Xcode 14+ (from App Store)
# Apple Developer account (free for testing)
```

#### Build Steps

1. **Sync Capacitor**:
```bash
npm run cap:sync
```

2. **Install CocoaPods**:
```bash
cd ios/App
pod install
cd ../..
```

3. **Open in Xcode**:
```bash
npm run cap:open:ios
```

4. **Configure Signing** (in Xcode):
   - Select "App" target
   - Go to "Signing & Capabilities" tab
   - Select your development team
   - Xcode auto-manages signing certificates

5. **Build & Run**:
   - Select device or simulator
   - Click Run (▶) or Cmd+R
   - App builds and launches

#### Testing Locally
- Free Apple ID allows testing on personal devices
- Built-in simulator works without physical device
- 7-day limit before re-signing needed

#### Distribution (TestFlight/App Store)

1. **In Xcode**:
   - Select "Any iOS Device"
   - Product → Archive
   - Wait for archive to complete

2. **Export IPA**:
   - Organizer window appears
   - Click "Distribute App"
   - Choose "TestFlight and the App Store"
   - Export IPA file

3. **Upload to TestFlight/App Store**:
   - Use Transporter (free from App Store)
   - Drag IPA into Transporter
   - Submit for review

#### Troubleshooting iOS

| Error | Solution |
|-------|----------|
| CocoaPods version mismatch | Delete `ios/App/Pods` and `Podfile.lock`, re-run `pod install` |
| Signing certificate not found | Ensure Xcode is logged into your Apple ID (Xcode Preferences) |
| Build fails with "Code 65" | Clean (Cmd+Shift+K) and rebuild, check signing settings |
| Device not appearing | Ensure device is unlocked and trust certificate, unplug/replug |

### Android (Windows, macOS, Linux)

#### Prerequisites

```bash
# Java Development Kit 17+
java -version
# Should show JDK 17+

# Android Studio or command-line tools
# Check ANDROID_HOME is set:
echo $ANDROID_HOME  # macOS/Linux
echo %ANDROID_HOME%  # Windows
```

#### Quick Start (Recommended)

```bash
# 1. Sync Capacitor
npm run cap:sync

# 2. Open in Android Studio
npm run cap:open:android

# 3. Wait for Gradle sync (1-3 minutes first time)

# 4. Select device/emulator
# 5. Click Run (▶) or Shift+F10
```

#### Build Scripts (Advanced)

##### Debug APK (Testing)
```bash
./build-android.sh debug
```
**Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

Can be installed on any device via:
```bash
adb install app-debug.apk
```

##### Release APK (Distribution)
```bash
./build-android.sh release
```
**Output**: `android/app/build/outputs/apk/release/app-release.apk`

Requires signing configuration (see below).

#### APK Signing (Required for Release)

##### One-Time Setup

```bash
# Create keystore and signing configuration
./setup-signing.sh
```

This creates:
- `android/app/fmhy-release-key.keystore` — Signing key
- `android/keystore.properties` — Configuration file

**Important**: Backup the keystore file! You need it to update your app in the future.

##### Build Signed Release APK

```bash
./build-android.sh release
```

The app now:
- Signs automatically using your keystore
- Produces a distributable APK
- Can be uploaded to Google Play Store

#### Manual Gradle Commands (Alternative)

```bash
# Build unsigned debug
cd android
./gradlew assembleDebug
cd ..
# Output: android/app/build/outputs/apk/debug/app-debug.apk

# Build unsigned release (requires keystore.properties)
cd android
./gradlew assembleRelease
cd ..
# Output: android/app/build/outputs/apk/release/app-release.apk
```

#### Install APK on Device

```bash
# Enable USB debugging on Android device
# Connect via USB

# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or for release
adb install android/app/build/outputs/apk/release/app-release.apk
```

#### Troubleshooting Android

| Error | Solution |
|-------|----------|
| Gradle sync fails | Set JAVA_HOME to JDK 17+; reinstall Android SDK |
| "Cannot find android" | Run `npm run cap:sync` to create android/ directory |
| White screen on launch | Check internet connection; verify CSP allows target domain |
| Signing failed | Run `./setup-signing.sh`, ensure `keystore.properties` exists |
| App closes on startup | Check logcat: `adb logcat \| grep FMHY` |
| Mixed content error | App uses HTTP scheme in WebView to allow HTTPS content (configured) |

## Customization

### Change Target URL

To point to a different website:

#### Desktop
Edit `desktop/index.html`:
```html
<iframe src="https://your-domain.com" style="..."></iframe>
```

#### Mobile
Edit `mobile/index.html`:
```html
<iframe src="https://your-domain.com" style="..."></iframe>
```

**Update CSP** (Content Security Policy) in both files:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; frame-src https://your-domain.com; ...">
```

#### Apply Changes
```bash
npm run cap:sync  # Update mobile projects
npm start         # Test desktop
```

### Custom App Name

#### Desktop (`package.json`)
```json
{
  "productName": "My Custom App"
}
```

#### iOS (Xcode)
- Select target → General tab
- Change "Display Name"

#### Android (`android/app/src/main/res/values/strings.xml`)
```xml
<string name="app_name">My Custom App</string>
```

### Custom Icon

1. Create 512×512 PNG image
2. Replace `desktop/icon.png` (or `desktop/icon.png.txt`)
3. Run `npm run cap:sync` (updates mobile)
4. Rebuild for all platforms

### Enable Developer Tools (Desktop)

In `desktop/main.js`, uncomment:
```javascript
mainWindow.webContents.openDevTools();
```

Rebuilds with DevTools available (F12).

## Testing Before Distribution

### Desktop
```bash
# Build the app
npm run build:win  # or build:mac or build:linux

# Run the built executable from dist/
# Test:
# - App launches
# - Iframe loads target URL
# - Window resizes smoothly
# - Back/forward navigation works
```

### iOS
```bash
# Run on simulator
# Test:
# - App launches
# - Webview loads target URL
# - Rotation works (portrait/landscape)
# - Safe area respected (notch handled)
```

### Android
```bash
# Install debug APK
adb install app-debug.apk

# On device, test:
# - App launches
# - Webview loads target URL
# - Rotation works
# - Back button functions
# - Navigation works
```

## Distribution Checklist

### Before Building for Release

- [ ] Update version in `package.json`
- [ ] Test on all target platforms
- [ ] Verify target URL is correct
- [ ] App name is correct
- [ ] Icon is custom (not default)
- [ ] No debug code left (console.logs, etc.)

### Windows Distribution

- [ ] `npm run build:win` completes
- [ ] Test installer on clean Windows system
- [ ] Test portable .exe
- [ ] Host on website with checksums
- [ ] (Optional) Code sign with certificate

### macOS Distribution

- [ ] `npm run build:mac` completes
- [ ] Test .dmg on clean macOS system
- [ ] (Recommended) Code sign with Developer ID
- [ ] Notarize app with Apple (for Big Sur+)
- [ ] Host on website

### Linux Distribution

- [ ] `npm run build:linux` completes
- [ ] Test AppImage on Ubuntu, Fedora, etc.
- [ ] Test .deb on Debian/Ubuntu systems
- [ ] Test .rpm on Fedora/RedHat systems
- [ ] Host on website

### iOS Distribution

- [ ] Build succeeds in Xcode
- [ ] Test on simulator and real device
- [ ] Archive and export IPA
- [ ] Upload to TestFlight or App Store
- [ ] Fill in app metadata and screenshots

### Android Distribution

- [ ] Run `./setup-signing.sh`
- [ ] `./build-android.sh release` completes
- [ ] Test release APK on device
- [ ] Backup keystore file
- [ ] Upload to Google Play Store

## 100 APPS Integration

FMHY Client pattern is perfect for the 100 APPS mission:

### Use Cases

1. **Web App Wrapper**: Turn any responsive website into a desktop/mobile app
2. **Offline Content**: Cache HTML + assets locally
3. **Cross-Platform Distribution**: One codebase → Windows/Mac/Linux/iOS/Android
4. **Rapid Deployment**: Update just by changing URL (no rebuild needed)

### For 100 APPS

```
100 APPS Mission App (e.g., VendorTracker)
├─ Web Frontend (React/Vue, responsive)
└─ FMHY Client Wrapper
   ├─ Windows installer (.exe)
   ├─ macOS DMG (.dmg)
   ├─ Linux AppImage (.AppImage)
   ├─ iOS App (TestFlight)
   └─ Android App (Play Store / direct APK)

Result: Single codebase, 5 platforms, 1 month to launch
```

### Offline Capability

Add Service Worker to your frontend:
```javascript
// Cache HTML + assets on first load
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

FMHY Client will:
- Work offline after first load
- Update content when online
- Use minimal bandwidth

## File Reference

| File | Purpose |
|------|---------|
| `package.json` | Build config, version, scripts |
| `desktop/main.js` | Electron main process |
| `desktop/index.html` | Electron HTML content |
| `mobile/index.html` | Mobile webview content |
| `capacitor.config.ts` | Capacitor mobile config |
| `android/app/build.gradle` | Android build config |
| `ios/App/Podfile` | iOS CocoaPods config |
| `build-android.sh` | Android build script |
| `setup-signing.sh` | Android signing setup |

## Summary

**FMHY Client** is a battle-tested pattern for wrapping content into native apps:

✅ **Desktop**: Electron (Windows/Mac/Linux)  
✅ **Mobile**: Capacitor (iOS/Android)  
✅ **Single codebase**: npm scripts build for all platforms  
✅ **Distribution**: Installers, APKs, and App Store ready  
✅ **Customizable**: Change URL, name, icon easily  

**For 100 APPS**: Build web apps, wrap with FMHY Client, distribute to 5 platforms instantly.

