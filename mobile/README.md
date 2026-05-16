# RHYTHMIX Mobile

Expo + React Native + EAS Build. Hybrid native shell that loads `rhythmixapp.com.au` in a WebView, with native Home / Library / Settings tabs.

- **Bundle ID:** `com.rhythmix.app` (locked once published — change *before* first store submission if needed)
- **Scheme:** `rhythmix` (deep links: `rhythmix://...`)
- **Router:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)
- **Build service:** [EAS Build](https://docs.expo.dev/build/introduction/) — cloud, no Mac required

---

## One-time setup (from your iPhone or any machine)

```bash
cd mobile
npm install
npx expo install --fix     # align deps with current Expo SDK
```

Install the EAS CLI globally (or use `npx`):

```bash
npm install -g eas-cli
eas login                  # uses your Expo account
eas init                   # creates the EAS project, writes projectId into app.json
```

After `eas init`, replace the two placeholders in `app.json`:
- `extra.eas.projectId` → auto-filled by `eas init`
- `owner` → your Expo username

---

## Run locally

```bash
npm run start              # opens Expo Dev Tools
npm run ios                # iOS simulator (needs Xcode — skip on iPhone-only setup)
npm run android            # Android emulator
```

On iPhone-only: install **Expo Go** from the App Store, scan the QR code from `npm run start`. For features that need a custom dev client, use **EAS Build** (below).

---

## Cloud builds (the iPhone-friendly path)

```bash
# Development client — install on device, hot-reload native code
eas build --profile development --platform ios
eas build --profile development --platform android

# Internal preview — share via URL with testers
eas build --profile preview --platform all

# Production — App Store + Play Store binaries
eas build --profile production --platform all
```

Install builds straight to your iPhone via **Expo Orbit** or the build URL.

---

## Submit to the stores

```bash
eas submit --platform ios       # → App Store Connect (TestFlight first)
eas submit --platform android   # → Google Play Console
```

Before first submission, fill in `eas.json` → `submit.production`:
- **iOS:** `appleId` (your Apple ID email), `ascAppId` (App Store Connect numeric ID), `appleTeamId`
- **Android:** download a service-account JSON from Play Console → API access, save it as `mobile/pc-api-service-account.json` (gitignored)

You'll also need:
- **Apple Developer Program** — $99 / yr — https://developer.apple.com/programs/
- **Google Play Console** — $25 one-time — https://play.google.com/console/

---

## Project layout

```
mobile/
  app/                     # Expo Router (file-based routing)
    _layout.tsx            # root stack
    (tabs)/
      _layout.tsx          # bottom tab bar
      index.tsx            # Home — WebView of rhythmixapp.com.au
      library.tsx          # native Library screen (stub)
      settings.tsx         # native Settings screen + legal links
  assets/                  # icon, splash, favicon (copied from repo root)
  app.json                 # Expo config — bundle ID, scheme, plugins
  eas.json                 # EAS Build / Submit profiles
  package.json
  tsconfig.json
```

---

## Why WebView for Home?

Apple's App Review Guideline 4.2 rejects pure-WebView shells ("just a website"). To pass review you need *native* value too — that's what the Library and Settings tabs (and any future native features: push notifications, offline cache, share sheet, audio playback) provide. The WebView reuses your existing site so you don't rebuild the marketing pages.

If you want to go further native, replace `app/(tabs)/index.tsx` with a real React Native screen.
