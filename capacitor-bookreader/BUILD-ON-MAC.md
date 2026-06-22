# Build BookReader Pro on your M3 Mac

This is the **one** machine that can do everything. iOS *and* Android both build here.
Follow top to bottom. First build ~1–2 hrs (installing tools). Rebuilds: ~10 min.

---

## 0. One-time: install the tools (do this once, ever)

Open the **Terminal** app on your Mac, paste each line, press Return.

```bash
# Homebrew (the Mac installer-of-installers) — skip if you have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node (runs Capacitor) + CocoaPods (iOS needs it) + Java (Android needs it)
brew install node cocoapods openjdk
```

Then install the two big apps from the **Mac App Store** / web:
- **Xcode** — Mac App Store, search "Xcode", Get. (Big download, be patient.) → builds iOS
- **Android Studio** — https://developer.android.com/studio → builds Android

Open each once and let it finish its first-run setup (Xcode will ask to install
components — say yes; Android Studio will download the SDK — let it).

---

## 1. Get this project onto the Mac

```bash
git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
cd jamie-wigg
git checkout claude/model-cleanup-scripts-wcvdcb
cd capacitor-bookreader
npm install
```

---

## 1.5. Vendor CDN dependencies (offline + App Store compliance)

```bash
bash vendor-deps.sh
```

This downloads tesseract.js (OCR engine) and OpenDyslexic font (accessibility) locally, so BookReader Pro works fully offline and passes App Store review without external dependencies.

---

## 2. Build the ANDROID app (Google Play) — easiest, do this first

```bash
npx cap sync android
npx cap open android      # opens Android Studio
```

In Android Studio:
1. Wait for it to finish "Gradle sync" (bottom bar).
2. Menu: **Build → Generate Signed App Bundle / APK → Android App Bundle**.
3. Create a new keystore when asked (it's your signing key — **save the file and
   passwords somewhere safe, you reuse it for every future update**).
4. Pick **release**, Finish.
5. Your `.aab` lands in `android/app/release/`. **That's the file you upload to
   Google Play Console.**

---

## 3. Build the iOS app (App Store)

```bash
npx cap add ios           # adds the iOS project (only needed once)
npx cap sync ios
npx cap open ios          # opens Xcode
```

In Xcode:
1. Left panel → click **App** at the top.
2. **Signing & Capabilities** tab → check **Automatically manage signing** →
   pick your **Team** (your Apple Developer account; $99/yr at developer.apple.com).
3. Top bar: change the device target to **Any iOS Device (arm64)**.
4. Menu: **Product → Archive**. When it finishes, the Organizer opens.
5. **Distribute App → App Store Connect → Upload.** That sends it to Apple.

---

## 4. Submit

- **Google Play:** play.google.com/console → create app → upload the `.aab` →
  fill listing (icon, screenshots, description) → submit for review (~1–3 days).
- **Apple:** appstoreconnect.apple.com → My Apps → + → fill listing → pick the
  build you uploaded → submit for review (~1–3 days).

---

## Known follow-up before public launch (not a blocker for a TestFlight/internal build)

BookReader Pro currently loads two things from the internet at runtime
(`tesseract.js` for OCR, the OpenDyslexic font). For a polished store build you
want these **bundled locally** so the app works fully offline and sails through
Apple review (Guideline 2.5.2). Ask Gary to "vendor the CDN deps in BookReader
Pro" and it'll swap the `<script>`/`@font-face` URLs for local copies in `www/`.
