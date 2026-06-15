# 50 Buddy Apps — iOS Capacitor Wrapper

A native iOS shell for 50 AI-powered buddy apps, built with **Capacitor 7** and **TypeScript**. Wrap web-based productivity and wellness tools for App Store distribution.

## What is This?

This is a **Capacitor iOS project** that wraps the Buddy Apps web assets into a native iOS app. It:

- Bundles 50 web-based buddy apps (from `/apps/`) into a single native iOS shell
- Enables offline-first progressive web app (PWA) functionality
- Provides native OS access (Camera for photo analysis, Microphone for voice input)
- Integrates with ElevenLabs text-to-speech for voice features
- Ready to submit to TestFlight and the App Store

## Project Structure

```
capacitor-buddies/
├── package.json              # Dependencies and npm scripts
├── capacitor.config.ts       # Capacitor configuration
├── tsconfig.json             # TypeScript configuration
├── src/
│   ├── index.ts             # Capacitor initialization
│   └── app.ts               # App shell setup
├── www/                      # Web assets (populated by build:web)
├── ios/                      # Xcode iOS project
│   └── App/
│       ├── App.xcodeproj    # Xcode project file
│       ├── App/
│       │   ├── Info.plist   # iOS app configuration
│       │   └── Assets.xcassets/ # Icons, images
│       └── Podfile          # iOS dependencies
├── scripts/
│   └── build-web.mjs        # Script to copy apps/ to www/
├── BUILD.md                 # Development & Xcode guide
├── APP-STORE-SUBMISSION.md  # TestFlight & App Store guide
└── README.md                # This file
```

## Quick Start

### Prerequisites

- **macOS 13+**
- **Node.js 20+** and **pnpm 9+**
- **Xcode 15+** (from Mac App Store)
- **Apple Developer account** ($99/year for App Store submission)

### Setup

```bash
# 1. Clone or download this project
cd capacitor-buddies

# 2. Install dependencies
pnpm install

# 3. Build web assets and sync with Xcode
pnpm build

# 4. Open in Xcode
pnpm open:ios
```

The app is now ready to run in the iOS Simulator or on a physical device.

## Development Workflow

### Run in Simulator

```bash
# After opening Xcode with pnpm open:ios:
# Product → Run (or press Cmd+R)
```

### Run on Physical iPhone

```bash
# Connect your iPhone via USB
# In Xcode: Product → Destination → [Your iPhone]
# Product → Run (Cmd+R)
```

### Update Buddy Apps

```bash
# Add or modify apps in /apps/ folder
# Then rebuild:
pnpm build:web

# And sync:
pnpm sync

# Rebuild in Xcode: Product → Build (Cmd+B)
```

## Available npm Scripts

| Command | What it does |
|---|---|
| `pnpm build:web` | Copy apps/ to www/ (web assets) |
| `pnpm sync` | Sync with Xcode via `cap sync ios` |
| `pnpm build` | Run both build:web and sync |
| `pnpm open:ios` | Open Xcode with the iOS project |
| `pnpm test` | Run unit tests with vitest |

## Capabilities

The app includes permissions for:

- **Camera** — Photo analysis in Buddy Apps
- **Microphone** — Voice input, VoiceOver compatibility
- **Offline Storage** — Service Workers, IndexedDB
- **Web Technologies** — HTML5, CSS3, JavaScript (ES2020+)

## Configuration

### Bundle ID & App Name

Edit `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'au.rhythmix.buddyapps',  // Change if needed
  appName: '50 Buddy Apps',         // Display name on home screen
  webDir: 'www',                    // Web assets folder
  ios: {
    minVersion: '14.0',             // Minimum iOS version
    scheme: '50BuddyApps',          // URL scheme (for deep links)
  },
};
```

## Testing

### Unit Tests

```bash
pnpm test
```

### Manual Testing Checklist

- [ ] App launches without crashing
- [ ] All 50 Buddy Apps load and render
- [ ] Camera feature works (if used)
- [ ] Microphone input works (if used)
- [ ] Offline mode functions (disable network in settings)
- [ ] Portrait and landscape orientations supported
- [ ] App name and icon display correctly on home screen

## Building for App Store

See **BUILD.md** for local development and simulator setup.

See **APP-STORE-SUBMISSION.md** for:
- TestFlight beta distribution
- App Store submission process
- Handling app review feedback

## Next Steps

1. **Read BUILD.md** → Set up Xcode signing and test on device
2. **Test thoroughly** → Run in simulator and on physical iPhone
3. **Read APP-STORE-SUBMISSION.md** → Prepare for TestFlight and App Store
4. **Gather metadata** → Screenshots, descriptions, privacy policy
5. **Submit** → Upload to App Store Connect and wait for review

## iOS-Only Note

This project targets **iOS only** (iPhone/iPad). If you need Android support later:

- Create a separate `capacitor-android/` project
- Use the same `www/` web assets
- Run `cap add android` in a separate directory

The web layer (Buddy Apps) is platform-agnostic and works on both iOS and Android.

## Technology Stack

| Layer | Technology |
|---|---|
| **Native Shell** | Capacitor 7, TypeScript |
| **Web Assets** | HTML5, CSS3, JavaScript (ES2020+) |
| **Build Tool** | Node.js, pnpm |
| **IDE** | Xcode 15+ |
| **iOS Target** | iOS 14.0+ |
| **Distribution** | App Store, TestFlight |

## Useful Links

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Capacitor iOS Guide:** https://capacitorjs.com/docs/ios
- **Apple Developer:** https://developer.apple.com/
- **App Store Connect:** https://appstoreconnect.apple.com

## Troubleshooting

### "No provisioning profile found"
→ See BUILD.md, "Common Issues" section

### "Tester cannot be added to TestFlight"
→ See APP-STORE-SUBMISSION.md, "TestFlight Issues" section

### "App rejected from App Store"
→ See APP-STORE-SUBMISSION.md, "Common Rejection Reasons" section

## Support

For questions:

1. **Capacitor issues:** https://capacitorjs.com/docs (or GitHub)
2. **Apple/Xcode issues:** https://developer.apple.com/help/
3. **Buddy Apps features:** Check the original app source in `/apps/`

---

Built with Capacitor. Ready for production.
