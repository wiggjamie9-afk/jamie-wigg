# HerdCheck Mobile Setup

Complete guide to building and shipping HerdCheck to iOS App Store and Google Play.

## Prerequisites

### Accounts Required (HITL Tasks)

- **Google Play Developer account** ($25 one-time) — https://play.google.com/console
- **Apple Developer account** ($99/year) — https://developer.apple.com
- **Codemagic account** (free tier available) — https://codemagic.io

### Local Development

- **Node.js 18+** and **npm 8+**
- **For iOS**: Mac with Xcode 14+ and iOS 13.0+ SDK
- **For Android**: Android Studio with SDK 26+ (minSdk configured)

---

## Phase 1: Local Setup (Dev Machine)

### 1. Install Capacitor Dependencies

```bash
cd herdcheck-mobile
npm install
```

This installs Capacitor 7, Camera, Geolocation, and Android/iOS platforms.

### 2. Sync Web Assets

HerdCheck uses the production web build from `livestock/` folder:

```bash
npx cap sync
```

This copies the livestock/ PWA into native projects:
- iOS: `ios/App/App/public/`
- Android: `android/app/src/main/assets/public/`

### 3. Open in IDE

#### iOS (requires Mac)

```bash
npx cap open ios
```

Opens Xcode. Select **App** scheme, then **Product → Build** (or Cmd+B).

#### Android

```bash
npx cap open android
```

Opens Android Studio. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)** (debug).

Test on an Android device or emulator:

```bash
# After building in Android Studio, or:
cd android && ./gradlew installDebug
```

---

## Phase 2: Build Signing (Pre-Release)

### iOS Signing (via Xcode)

1. In Xcode, select **App** → **Signing & Capabilities**
2. Set **Team** to your Apple Developer Team
3. Change **Bundle Identifier** to `com.rhythmixapp.herdcheck` (if not already)
4. For release builds:
   - Create/download a **Distribution Certificate** from Apple Developer portal
   - Create an **App Store Provisioning Profile**
   - In Xcode, set Provisioning Profile to the App Store profile

### Android Signing (Keystore)

Generate a release keystore (one-time):

```bash
keytool -genkey -v -keystore herdcheck-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias herdcheck-key
```

Store this file **securely** (backup to encrypted storage):
- Keystore file: `herdcheck-release.jks`
- Keystore password: `[SAVE THIS]`
- Key alias: `herdcheck-key`
- Key password: `[SAVE THIS]`

Configure in `android/app/build.gradle`:

```gradle
signingConfigs {
  release {
    storeFile file("../herdcheck-release.jks")
    storePassword "[KEYSTORE_PASSWORD]"
    keyAlias "herdcheck-key"
    keyPassword "[KEY_PASSWORD]"
  }
}

buildTypes {
  release {
    signingConfig signingConfigs.release
  }
}
```

---

## Phase 3: App Store Setup

### iOS (App Store)

1. Go to **App Store Connect** (https://appstoreconnect.apple.com)
2. Click **+ Create New App**
3. Fill in:
   - **Name**: HerdCheck
   - **Bundle ID**: com.rhythmixapp.herdcheck
   - **SKU**: herdcheck-v1 (internal identifier)
4. Upload **app icon** (1024×1024 PNG)
5. Add **2-3 screenshots** (1170×2532 pixels for iPhone)
6. Write **description** and **keywords** (see template below)
7. Set **Age Rating** (tap "Rate Your App" and answer health/medical questions)
8. Configure **Pricing & Availability** (free)
9. Click **Save** — app is now in "Prepare for Submission" state

### Android (Google Play)

1. Go to **Google Play Console** (https://play.google.com/console)
2. Click **Create App**
3. Fill in:
   - **Name**: HerdCheck
   - **Default language**: English
4. Under **App signing**, Google Play will generate a signing key (no action needed)
5. Upload **app icon** (512×512 PNG)
6. Add **2-4 screenshots** (1080×1920 pixels)
7. Write **description** and **short description** (see template below)
8. Set **App category**: Medical
9. Fill **Privacy Policy** URL: https://rhythmixapp.com.au/privacy.html
10. Answer **Content Rating** questionnaire (health/medical app)
11. Click **Save** — app is now in "Draft" state

#### App Store Listing Template

**Title**: HerdCheck — Livestock Screening

**Short description** (Android): Phone-camera screening for smallholder farmers. Lameness, mastitis, calving.

**Full description**:

> HerdCheck is a livestock screening app built for smallholder dairy and small-ruminant farmers. Use your phone camera to check for lameness, mastitis, and imminent calving in cattle, buffalo, sheep, and goats.
>
> **Features:**
> - Lameness scoring (Sprecher 5-point scale)
> - Mastitis detection (udder photo analysis)
> - Calving prediction (behavioural signs + gestation day)
> - Herd dashboard (risk tiering: green/amber/red)
> - Alerts for urgent cases
> - Works offline — all data stays on your phone
> - 6 languages: English, Hindi, Bengali, Swahili, Portuguese, Spanish
>
> **Data Privacy:**
> HerdCheck never uploads your data. Everything is stored locally on your phone using standard mobile app encryption. No login required.

**Keywords**: livestock, screening, lameness, mastitis, calving, dairy, farming

---

## Phase 4: Codemagic CI/CD Setup

### Create Codemagic Account

1. Sign up at https://codemagic.io
2. Connect your GitHub repo (`wiggjamie9-afk/jamie-wigg`)
3. Click **Create New App** → select the repo

### Add Build Secrets

In **App Settings → Environment Variables**, add:

**For iOS (TestFlight):**
```
APP_STORE_CONNECT_ISSUER_ID = [your App Store Connect issuer ID]
APP_STORE_CONNECT_KEY_ID = [your App Store Connect key ID]
APP_STORE_CONNECT_PRIVATE_KEY = [base64-encoded private key from App Store Connect]
```

**For Android (Play Console):**
```
ANDROID_KEYSTORE_PATH = herdcheck-release.jks
ANDROID_KEYSTORE_PASSWORD = [your keystore password]
ANDROID_KEYSTORE_ALIAS = herdcheck-key
ANDROID_KEY_PASSWORD = [your key password]
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON = [JSON service account key from Google Play Console]
```

### Enable Workflows

In **App Settings → Workflows**, enable:
- ✅ **ios-testflight** — triggers on tag push (vX.Y.Z)
- ✅ **android-release** — triggers on tag push (vX.Y.Z)
- ✅ **test-pr** — triggers on PR creation

### Test CI/CD Locally

```bash
# Commit and push to your branch
git add herdcheck-mobile/
git commit -m "feat: add Capacitor iOS + Android scaffold with Codemagic CI/CD"
git push -u origin claude/session-01wjfhumnnmaa9p8eyjmhzsfw-006tP

# Create a test tag
git tag v0.0.1
git push origin v0.0.1
```

Watch the build in **Codemagic UI**. Once complete:
- ✅ iOS .ipa uploaded to TestFlight
- ✅ Android .aab uploaded to Play Console Internal Testing

---

## Phase 5: TestFlight & Play Console Internal Testing

### iOS (TestFlight)

1. In **App Store Connect**, go to your app → **TestFlight**
2. Wait for Codemagic build to appear in **Builds** tab (may take 30 min)
3. Click the build → **Invite Testers**
4. Add tester email addresses (≥ 5 recommended)
5. Testers receive email with TestFlight link
6. They install the app and report issues

### Android (Play Console)

1. In **Google Play Console**, go to your app → **Testing → Internal Testing**
2. Add ≥ 5 tester email addresses
3. Testers receive email with install link
4. They install from Play Console and report issues

### Smoke Tests (Before Production Release)

On both iOS and Android testers, verify:

- [ ] App launches without crash
- [ ] Can add an animal (ear tag, name, species)
- [ ] Can run all 3 checks (lameness, mastitis, calving)
- [ ] Photos/videos save and display
- [ ] Offline mode works (disable network, app still functions)
- [ ] Data persists after relaunch
- [ ] Language switching works (EN ↔ local language)
- [ ] Export to CSV works
- [ ] Dark mode renders correctly

---

## Phase 6: Production Release

### iOS (App Store)

1. In **App Store Connect**, click **Prepare for Submission**
2. Review all fields (name, description, keywords, screenshots, rating)
3. Accept **App Store Review Guidelines**
4. Click **Submit for Review**
5. Apple review team (1-2 days) → **Pending Developer Release** or **Ready for Sale**
6. Once approved, click **Release** to go live

### Android (Play Store)

1. In **Google Play Console**, go to **Production** track
2. Click **Create New Release**
3. Select your tested .aab from Internal Testing
4. Add **release notes**: "HerdCheck v0.1.0 - Initial release"
5. Review **content rating** and **privacy policy**
6. Click **Review Release**
7. Once reviewed, click **Rollout** to push 100% → live on Play Store

---

## Maintenance

### Versioning

Update version using git tags:

```bash
# Increment version
git tag v0.1.0
git push origin v0.1.0
```

Codemagic automatically:
1. Builds iOS .ipa + Android .aab
2. Uploads to TestFlight + Play Console Internal
3. (Later) Deploys to production if configured

### Updates to Web App

If you update `livestock/` code:

```bash
cd herdcheck-mobile
npx cap sync
npx cap android  # or npx cap ios
# Re-test in device/simulator
```

Then push a new tag to trigger new builds.

---

## Troubleshooting

### iOS Build Fails in Codemagic

- Check **App Store Connect API key** is valid
- Ensure **Distribution Certificate** is active (not revoked)
- Verify **Team ID** matches Apple Developer enrollment

### Android Build Fails in Codemagic

- Confirm **keystore file** exists and password is correct
- Check **Google Play Service Account** has "Admin" role
- Ensure **Android SDK 26+** is installed in Codemagic environment

### App Crashes on Launch

- Run `npx cap doctor` to verify Capacitor setup
- Check browser console for JavaScript errors (Safari Web Inspector for iOS, Chrome DevTools for Android)
- Ensure `livestock/` assets are properly synced to native projects

### License Validation Not Working

- Confirm `LICENSE_API_URL` points to live STARLIGHTMIX Studio endpoint
- Test license key on https://license.studio.starlightmix.com/api/license manually
- Check browser localStorage for cached validation state

---

## References

- **Capacitor**: https://capacitorjs.com/docs
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **Codemagic**: https://docs.codemagic.io
- **HerdCheck Web**: https://github.com/wiggjamie9-afk/jamie-wigg/tree/main/livestock
- **STARLIGHTMIX Studio License API**: https://license.studio.starlightmix.com

---

**Status**: Ready for Codemagic setup and TestFlight/Play Console testing.
