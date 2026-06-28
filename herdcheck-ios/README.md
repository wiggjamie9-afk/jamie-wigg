# HerdCheck — iOS (Capacitor)

Capacitor wrapper that packages the **HerdCheck** PWA (`/livestock/`) as a native
iOS app for TestFlight / the App Store. The web app stays the single source of
truth; this folder only stages it into `www/` and wraps it in an Xcode project.

- **App ID:** `au.com.rhythmixapp.herdcheck`
- **App name:** HerdCheck
- **Web source:** `../livestock/` (copied into `www/` at build time — `www/` is gitignored)

> HerdCheck is also a fully installable PWA. On iPhone you can use it today with
> no App Store build: open it in Safari and **Share → Add to Home Screen**. This
> wrapper is the path to a signed App Store / TestFlight build.

## Prerequisites

A **macOS** machine with Xcode (the Capacitor iOS toolchain and CocoaPods only
run on a Mac). Node 20+ and `npm`.

## First-time setup

```bash
cd herdcheck-ios
npm install
npm run add:ios      # generates the ios/ Xcode project from capacitor.config.ts
npm run sync:web     # copies ../livestock → www/ and runs `npx cap sync ios`
npm run open:ios     # opens ios/App/App.xcworkspace in Xcode
```

In Xcode, set your signing team, then Run on a device/simulator or Archive for
TestFlight.

## After changing the web app

Re-stage and re-sync — no other steps:

```bash
npm run sync:web
```

## CI

`codemagic.yaml` (repo root) has an `ios-capacitor-herdcheck` workflow that runs
`npm ci`, generates the iOS project if absent, syncs `../livestock`, `pod install`s,
and builds an unsigned debug `.app` to prove it compiles (mirrors the Reset
`ios-capacitor` workflow). Artifacts are emailed to the configured recipient.

## Layout

| Path | What it is |
|------|------------|
| `capacitor.config.ts` | App ID / name, `webDir: www`, iOS scheme + background. |
| `package.json` | Capacitor deps + `sync:web` / `add:ios` / `open:ios` scripts. |
| `www/` | Generated copy of `../livestock/` (gitignored). |
| `ios/` | Generated Xcode project (created by `npm run add:ios`). |
