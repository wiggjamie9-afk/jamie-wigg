# App Factory

Packages batches of standalone HTML apps from `apps/` into installable
**PWAs** and native **iOS + Android** apps via Capacitor. One reusable wrapper,
driven by `batch.json`, used for every 5-app batch (see
`../LOVABLE-BUILD-MANIFEST.md` for the schedule).

## What "App Factory standard" means

Every shipped app must be:

- **Offline-first** — works with no network; data in `localStorage`/IndexedDB.
- **Installable** — has a web manifest, service worker, icons, apple meta tags.
- **Mobile-first** — `viewport-fit=cover`, safe-area insets, 44px tap targets.
- **Readable** — dark text on light cards / light text on dark; verified
  contrast, no undefined CSS variables.
- **Local-first AI** — any AI feature is optional and only lights up when the
  user's own key is present. No user data leaves the device.

## Layout

```
app-factory/
├── batch.json            # which apps are in the current batch (+ appId/appName)
├── capacitor.config.ts   # native shell config (mirror appId/appName from batch.json)
├── package.json          # build/sync/open scripts
├── scripts/build-web.mjs # assembles www/ + generates the launcher index.html
└── www/                  # generated bundle (gitignored)
```

## Build (run on your Mac)

```bash
cd app-factory
npm install                 # first time only

# 1. PWA-ify the batch apps (generates manifest + service worker, injects wiring)
node ../scripts/app-factory/pwa-inject.mjs

# 2. Bundle the web app + launcher into www/
npm run build:web

# 3. Preview locally
npm run serve               # http://localhost:8000

# 4. Add native platforms (first time only)
npm run add:ios
npm run add:android

# 5. Sync the web bundle into the native projects
npm run build               # build:web + cap sync
```

### iOS

```bash
npm run open:ios            # opens Xcode
# In Xcode: select a Simulator or device → Product ▸ Run.
# For a shareable build: Product ▸ Archive (unsigned debug is fine for
# sideload/TestFlight; add your Apple Team for signed distribution).
```

Requires: macOS, Xcode, CocoaPods (`sudo gem install cocoapods`).

### Android

```bash
npm run open:android        # opens Android Studio
# Or build an APK directly:
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

Requires: Android Studio + SDK, JDK 17.

## Switching batches

1. Edit `batch.json`: bump `batch`, set `appId`/`appName`, list the 5 apps.
2. Mirror `appId`/`appName` into `capacitor.config.ts`.
3. Ensure each app is in the `REGISTRY` of `../scripts/app-factory/pwa-inject.mjs`.
4. Re-run the build steps above.

## Web deployment

Each app is also live on the marketing site via GitHub Pages
(push to `main`): `https://rhythmixapp.com.au/apps/<slug>.html`. The PWA
manifest + service worker make it installable straight from Safari/Chrome —
no app store required for the web path.

## Current batch

See `batch.json` (Batch 1: BookReader Pro, MathTutor Pro, FitCoach Pro,
Wellness Buddy, Nutrition Buddy).
