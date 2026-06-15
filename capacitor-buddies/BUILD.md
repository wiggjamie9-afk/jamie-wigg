# Build & Development Guide — Capacitor Buddies iOS

This guide walks you through building, testing, and submitting the 50 Buddy Apps iOS wrapper to the App Store.

## Prerequisites

### Required Software

- **macOS 13+** (Xcode requires it)
- **Node.js 20+** (e.g., via Homebrew: `brew install node@20`)
- **pnpm 9+** (e.g., `npm install -g pnpm@9`)
- **Xcode 15+** (download from Mac App Store or appstore.com)
- **Xcode Command Line Tools** (usually installed with Xcode, but run if needed):
  ```bash
  xcode-select --install
  ```

### Apple Developer Account

You need an **Apple Developer Program membership** ($99/year) to:
- Create provisioning profiles
- Register App IDs
- Submit apps to TestFlight and the App Store

Sign up at https://developer.apple.com/programs/ if you don't have an account.

## Local Setup

### 1. Clone and Install

```bash
# Clone (or download) the capacitor-buddies project
cd capacitor-buddies

# Install dependencies
pnpm install

# Build the web assets and sync with Xcode
pnpm build

# This runs two scripts:
#   - pnpm build:web   → copies apps/ folder into www/
#   - pnpm sync        → cap sync ios (syncs www/ to Xcode project)
```

### 2. Open in Xcode

```bash
pnpm open:ios
```

This launches Xcode with the iOS project open at `ios/App/App.xcodeproj`.

## Xcode Configuration

### Step 1: Set Bundle ID and Signing

1. **Select the "App" target** in Xcode (left sidebar, under "App")
2. Go to **General** tab
3. Under **Bundle Identifier**, change from placeholder to:
   ```
   au.rhythmix.buddyapps
   ```
4. Go to **Signing & Capabilities**
5. **Enable Automatic Signing:**
   - Check "Automatically manage signing"
   - Select your **Team** (your Apple Developer account)
   - Xcode will auto-create a provisioning profile

### Step 2: Configure Capabilities

Still in **Signing & Capabilities**:

1. Click **+ Capability**
2. Add these capabilities:
   - **Camera**
   - **Microphone**

Each appears as a card in the interface. Xcode automatically creates entitlements.

### Step 3: Set Deployment Target

1. Go to **General** tab
2. Under **Minimum Deployments**, set to **iOS 14.0** or later
3. Select **iPhone** under Device Orientations (portrait + landscape as preferred)

## Running in Simulator

### Launch iOS Simulator

1. **Product → Destination** → Select **iPhone 16 Pro** (or any model)
2. **Product → Run** (or press `Cmd+R`)
3. The app builds and launches in the simulator

The simulator renders the Buddy Apps web interface. You can:
- Interact with the app UI
- Test camera/microphone if Buddy Apps use them
- Check console logs in Xcode's Debug Area

### Debugging

- **View logs:** Xcode → Debug Area (bottom panel)
- **Network inspection:** Use Xcode's Network inspector in the Debug navigator
- **Console:** Xcode → Console area (bottom)

## Running on Physical Device

### Prerequisites

- An iPhone with iOS 14.0+
- A USB-C or Lightning cable to connect to your Mac
- Your Apple Developer account **enrolled in the Free Personal Team** (if not paying $99/year)

### Setup

1. **Connect iPhone** to Mac via cable
2. **Trust the Mac** on your iPhone (tap "Trust" if prompted)
3. In Xcode: **Devices and Simulators** (Cmd+Shift+2) → make sure your iPhone is listed
4. **Product → Destination** → Select your iPhone
5. **Product → Run** (Cmd+R)
6. The app builds and installs on your device

### First Run on Device

After the first build:
- Your iPhone may prompt: "Untrusted Developer"
- Go to **Settings → General → VPN & Device Management**
- Tap your developer certificate
- Tap **Trust**

## Testing Checklist

Before submitting to TestFlight or App Store:

- [ ] App launches without crashes in simulator
- [ ] App launches on physical device
- [ ] Web assets (apps) load and render correctly
- [ ] Tap through all Buddy App screens
- [ ] Test any camera features (if applicable)
- [ ] Test any microphone features (if applicable)
- [ ] Portrait and landscape orientations work
- [ ] Verify app version matches `capacitor.config.ts` (`version: "1.0.0"`)
- [ ] Check app name in Xcode matches branding ("50 Buddy Apps")
- [ ] All console logs in Xcode show no critical errors

## Pre-TestFlight Checklist

Before you upload to TestFlight (see APP-STORE-SUBMISSION.md):

1. **Bump version** in `capacitor.config.ts` and `package.json` (e.g., 1.0.0 → 1.1.0)
2. **Run full build:**
   ```bash
   pnpm build
   ```
3. **Archive in Xcode:**
   - Product → Archive
   - Wait for build to complete
   - Xcode opens Organizer window
4. **Validate and upload** to TestFlight via Xcode's built-in "Distribute App" workflow or via App Store Connect

## Common Issues

### "No Provisioning Profiles Found"
- Xcode → Preferences → Accounts → select your Apple ID
- Click **Download Signing Assets**
- Wait a few seconds; try rebuilding

### "Team ID not configured"
- Go to Xcode → Preferences → Accounts
- Select your Apple ID and Team
- In Xcode project, Signing & Capabilities tab, select the correct Team

### "Device Not Trusted"
- On iPhone, go to Settings → General → VPN & Device Management
- Tap the developer certificate and select Trust

### Build Fails with "CocoaPods Errors"
- Open `ios/App/` and run:
  ```bash
  pod update
  ```
- Then retry the build in Xcode

### Simulator Shows Blank White Screen
- Clean build folder: Cmd+Shift+K
- Rebuild: Cmd+B
- Run again: Cmd+R

## Next Steps

- Once you've tested locally, move to **APP-STORE-SUBMISSION.md** for TestFlight and App Store steps.
- Keep `capacitor.config.ts` in version control; bump the version field for each release.

## Support

For Capacitor-specific docs:
- https://capacitorjs.com/docs/ios
- https://capacitorjs.com/docs/getting-started

For Apple-specific help:
- https://developer.apple.com/help/
- https://developer.apple.com/forums/ (peer-to-peer support)
