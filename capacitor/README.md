# RHYTHMIX Studio — Capacitor wrapper (iPhone distribution)

Thin native shell around the `studio/` Next.js static export. The same
HTML/CSS/JS that runs at `studio.rhythmixapp.com.au` runs inside a
WKWebView on iOS, distributed via Apple TestFlight → App Store, built
in the cloud by Ionic Appflow so you never need a Mac.

## Why Capacitor over Expo

- The web app is already production-ready as a static export — no UI
  rewrite needed. Capacitor wraps it as-is.
- Appflow's iOS cloud build means no local Xcode required.
- Native escape hatches (camera, share sheet, push, in-app purchase)
  are available later via `@capacitor/*` plugins if needed.

## One-time setup

1. **Sign up for Apple Developer Program** ($99/year) at
   <https://developer.apple.com/programs/enroll/>. Required for any
   iOS distribution.

2. **Sign up for Ionic Appflow** at <https://ionic.io/appflow>. The
   free plan supports unlimited cloud builds for personal projects.

3. **Create an Appflow app** in their dashboard. Connect it to this
   GitHub repo. Note the app ID it generates (an 8-char slug like
   `abc12345`).

4. **Replace `REPLACE_WITH_APPFLOW_APP_ID`** in 3 files in this
   directory:
   ```bash
   grep -rl REPLACE_WITH_APPFLOW_APP_ID capacitor/
   #   capacitor/ionic.config.json
   #   capacitor/appflow.config.json
   #   capacitor/README.md       (this file)
   ```
   Replace with your real Appflow app ID, e.g. `abc12345`.

5. **Upload your iOS signing certificates** to Appflow:
   - In Appflow dashboard → your app → Build → Certificates → Add.
   - Upload your Apple Developer `.p12` (distribution cert + private
     key) and `.mobileprovision` (provisioning profile for
     `com.rhythmix.studio` ad-hoc or App Store distribution).
   - Apple's docs on generating these:
     <https://developer.apple.com/help/account/create-certificates/>.

## Build + install on iPhone

After the one-time setup above:

```bash
git add capacitor/ && git commit -m "wire up Appflow" && git push
```

Appflow auto-detects the push, runs the build (downloads pnpm,
builds studio/, copies to capacitor/www/, runs `cap sync ios`,
compiles + signs the IPA), and emails you an install link. Tap the
link from your iPhone's Safari → install profile → app appears on
home screen. ~5 minutes per build.

## Local dev (optional, requires Mac + Xcode)

If you have a Mac with Xcode + CocoaPods installed:

```bash
cd capacitor
pnpm install
pnpm add:ios            # one-time: generates the ios/ project tree
pnpm build              # builds studio/, syncs to www/, runs cap sync
pnpm open:ios           # opens the project in Xcode for run/debug
```

For faster iteration during dev, uncomment the `server.url` line in
`capacitor.config.ts` to point at the live Cloudflare Pages deploy.
The app then loads the live web app over the network on launch
instead of using the bundled `www/`. Comment it back out before
shipping a release build to the App Store.

## What's bundled vs what's fetched

| Path | Bundled in IPA | Notes |
|---|---|---|
| `www/` (copy of `studio/out/`) | yes | All HTML/CSS/JS, ~1.3 MB |
| Replicate API | fetched | via the proxy Worker at `replicate-proxy.studio.rhythmixapp.com.au` |
| License validation | fetched | via `license.studio.rhythmixapp.com.au` |
| ffmpeg.wasm core (~30 MB) | fetched lazily | from the @ffmpeg/ffmpeg CDN; iOS caches it after first run |
| User audio uploads | local IndexedDB | never leaves the device |
| Rendered MP4s | local IndexedDB | never leaves the device |

## Apple-specific gotchas

1. **WKWebView and IndexedDB**: works, but iOS Safari clears
   IndexedDB after ~7 days of app inactivity. The render history
   library may evict itself unexpectedly. Surface this in T6's
   storage notice if you haven't already.

2. **`crypto.subtle` on iOS Safari**: WebCrypto requires the page
   be served over HTTPS or be a local file URL. Capacitor's
   `capacitor://` scheme satisfies this; you're fine. Just don't
   set `server.url` to an `http://` URL for dev.

3. **App Store review**: Apple's reviewer will need a test license
   key + a sample audio file to evaluate the app. Provide both in
   the App Review notes when you submit, or have a "demo mode"
   flag that bypasses the license check for reviewer IPs.

4. **In-App Purchase rule**: if you eventually sell the license
   inside the app (vs. via the existing Gumroad link), Apple
   requires you use StoreKit. Keep the current "buy on Gumroad,
   paste key into Settings" flow for now — Apple permits this as
   long as the app doesn't link out to Gumroad from inside.

## Status

- [ ] Sign up for Apple Developer + Appflow
- [ ] Replace `REPLACE_WITH_APPFLOW_APP_ID` in `ionic.config.json`,
      `appflow.config.json`, and this README
- [ ] Upload signing certs to Appflow
- [ ] First push triggers first build
- [ ] Install link arrives, tap to install
- [ ] (later) Native plugins for share sheet / push notifications
