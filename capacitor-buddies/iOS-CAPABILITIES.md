# iOS Capabilities & Entitlements — 50 Buddy Apps

This document describes the iOS capabilities needed for the app and how to configure them in Xcode.

## Capabilities Overview

The 50 Buddy Apps wrapper requires these native iOS capabilities:

| Capability | Purpose | Privacy Key |
|---|---|---|
| **Camera** | Photo capture for Buddy Apps that analyze images | NSCameraUsageDescription |
| **Microphone** | Voice input, voice commands, audio recording | NSMicrophoneUsageDescription |
| **Network** | Web asset loading, API calls | (default) |
| **Offline Storage** | Service Workers, IndexedDB, Local Storage | (default) |

## Configuration in Xcode

### Enable Capabilities

1. **Open Xcode project:** `pnpm open:ios`
2. **Select the "App" target** (left sidebar)
3. Go to **Signing & Capabilities** tab
4. Click **+ Capability** button (top-left)
5. Search and add:
   - **Camera**
   - **Microphone**

Each capability appears as a card. Xcode automatically creates entitlements in `entitlements.plist`.

### Privacy Usage Descriptions

Apple requires human-readable descriptions of why your app uses each capability. These appear in the system permission dialog when users first grant access.

Edit `ios/App/App/Info.plist` or configure in Xcode:

**Go to: Signing & Capabilities → App → Info tab**

Add these keys:

| Key | Type | Value |
|---|---|---|
| NSCameraUsageDescription | String | "Camera access enables photo analysis and image recognition in Buddy Apps. Your photos are never uploaded." |
| NSMicrophoneUsageDescription | String | "Microphone access enables voice input and audio recording in Buddy Apps. Audio is processed locally on your device." |

### Example Info.plist (XML)

```xml
<plist version="1.0">
<dict>
  ...
  <key>NSCameraUsageDescription</key>
  <string>Camera access enables photo analysis and image recognition in Buddy Apps. Your photos are never uploaded.</string>
  
  <key>NSMicrophoneUsageDescription</key>
  <string>Microphone access enables voice input and audio recording in Buddy Apps. Audio is processed locally on your device.</string>
  
  <key>NSBonjourServices</key>
  <array/>
  ...
</dict>
</plist>
```

## App Transport Security (ATS)

By default, iOS 9+ requires HTTPS for all network traffic (App Transport Security).

### Configuration

In `capacitor.config.ts`:

```typescript
ios: {
  minVersion: '14.0',
  scheme: '50BuddyApps',
  // ATS is enabled by default for HTTPS
}
```

### If You Need HTTP (Development Only)

Add to `Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  <!-- NOT recommended for production -->
</dict>
```

**⚠️ Do NOT ship to App Store with arbitrary HTTPS disabled** — Apple will reject it.

## Bluetooth (Future)

If Buddy Apps need Bluetooth (e.g., health tracking devices), add:

```xml
<key>NSBluetoothPeripheralUsageDescription</key>
<string>Bluetooth access enables connection to health tracking devices.</string>

<key>NSBluetoothAlwaysAndWhenInUseUsageDescription</key>
<string>Bluetooth access enables continuous health monitoring.</string>
```

Then in Xcode: + Capability → Background Modes → Bluetooth Central & Peripheral.

## Location (Future)

If Buddy Apps need location:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access enables location-based features in Buddy Apps.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Location access enables background location tracking.</string>
```

Then in Xcode: + Capability → Location Services.

## Entitlements File

Xcode automatically creates `ios/App/App/App.entitlements` with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.developer.camera</key>
  <true/>
  
  <key>com.apple.developer.microphone</key>
  <true/>
  
  <!-- Add more capabilities as needed -->
</dict>
</plist>
```

**Do not hand-edit this file.** Use Xcode's UI to manage capabilities.

## Permissions at Runtime

### iOS 14+ Behavior

On iOS 14+, users are prompted to grant permission the **first time** an app requests camera or microphone access:

```
"50 Buddy Apps" would like to access your camera.
[Don't Allow] [Allow]
```

Once granted, the permission is cached. Users can revoke it in:

**Settings → 50 Buddy Apps → Camera/Microphone**

### Checking Permissions in Code

Use Capacitor plugins to check and request permissions:

```typescript
import { Camera } from '@capacitor/camera';

// Check permission
const permission = await Camera.checkPermissions();
console.log('Camera:', permission.camera); // 'granted', 'denied', 'prompt'

// Request permission (triggers system dialog)
const result = await Camera.requestPermissions();
console.log('Camera:', result.camera);
```

## Privacy Considerations

### What Users See

Before shipping to App Store, Apple reviews:

1. **Privacy labels** in App Store listing
2. **Privacy manifest** describing data collection
3. **App privacy policy** (you must publish one)

### Privacy Manifest (iOS 17+)

Apple requires a privacy manifest listing SDKs and their data collection. For the Buddy Apps wrapper:

Create `ios/App/PrivacyInfo.xcprivacy`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyTracking</key>
  <false/>
  
  <key>NSPrivacyTrackingDomains</key>
  <array/>
  
  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <!-- If any SDK accesses user data, list it here -->
    <!-- Capacitor itself does not collect data -->
  </array>
</dict>
</plist>
```

### App Privacy Policy

You MUST publish a privacy policy. Create it at:

**https://rhythmixapp.com.au/privacy**

It should state:

- What data is collected (none, if it's truly offline)
- How data is used
- How users can contact you
- Links to any third-party SDKs (ElevenLabs, Replicate, etc.)

## Testing Permissions

### In Simulator

1. **Open simulator settings:** Cmd+Shift+H → Settings app
2. **Settings → Privacy → Camera** → Toggle on/off
3. **Settings → Privacy → Microphone** → Toggle on/off
4. Run the app and test requests

### On Physical Device

1. **Settings → 50 Buddy Apps → Camera** → Toggle on/off
2. **Settings → 50 Buddy Apps → Microphone** → Toggle on/off
3. Run the app and observe system permission dialogs

## Checklist Before App Store

- [ ] Camera capability enabled in Xcode
- [ ] Microphone capability enabled in Xcode
- [ ] NSCameraUsageDescription in Info.plist
- [ ] NSMicrophoneUsageDescription in Info.plist
- [ ] Privacy policy published and URL in App Store Connect
- [ ] Privacy manifest created (iOS 17+)
- [ ] All usage descriptions are clear and user-friendly
- [ ] App Transport Security configured (HTTPS for production)
- [ ] No debug/test permissions left in Info.plist

## Resources

- **Capacitor Permissions:** https://capacitorjs.com/docs/plugins/camera
- **Apple Entitlements:** https://developer.apple.com/documentation/bundleresources/entitlements
- **Privacy Manifest:** https://developer.apple.com/documentation/bundleresources/privacy_manifest_files
- **App Transport Security:** https://developer.apple.com/documentation/security/preventing_insecure_network_connections

---

Keep capabilities minimal and necessary. Unused capabilities slow review and raise privacy concerns with Apple reviewers.
