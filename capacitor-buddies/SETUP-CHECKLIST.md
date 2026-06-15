# Setup Checklist — Capacitor iOS Wrapper

Use this checklist to track your progress through the entire setup process from development to App Store submission.

## Phase 1: Local Development Setup

- [ ] **Read this file first** — you are here!
- [ ] **Read README.md** — understand the project structure and build scripts
- [ ] **macOS 12.0+** — verify you have a Mac with Intel or Apple Silicon
- [ ] **Xcode 15.0+** — download from App Store or `xcode-select --install`
- [ ] **Node 20+** — verify with `node --version`
- [ ] **pnpm 9+** — install with `npm install -g pnpm@9` or verify with `pnpm --version`
- [ ] **Apple Developer Account** — create free or join paid ($99/year) account at developer.apple.com

## Phase 2: Initial Build

**Time estimate: 30 minutes**

- [ ] `cd /home/user/jamie-wigg/capacitor-buddies`
- [ ] `pnpm install` — install Node dependencies
- [ ] `pnpm run build:web` — copy all buddy apps to `www/apps/` and `www/index.html`
- [ ] Verify `www/apps/buddies.html` exists with `ls www/apps/ | head -5`
- [ ] `npx capacitor add ios` — generate Xcode project (first time only; may skip if already done)
- [ ] `pnpm run sync` — copy web assets to iOS and install CocoaPods
- [ ] `pnpm run open:ios` — open Xcode workspace

## Phase 3: Xcode Configuration

**Time estimate: 15 minutes | Read: BUILD.md, Step 5**

In Xcode (App target, Signing & Capabilities tab):

- [ ] **Team ID** — select your Apple Developer account from dropdown
- [ ] **Bundle ID** — confirm set to `au.rhythmix.buddyapps` (or update to your team's format)
- [ ] **Deployment Target** — verify iOS 14.0 or higher in Build Settings
- [ ] **Privacy keys in Info.plist:**
  - [ ] `NSCameraUsageDescription` = "For heart rate monitoring and video capture in buddy apps"
  - [ ] `NSMicrophoneUsageDescription` = "For voice input and ElevenLabs text-to-speech features"
  - [ ] `NSLocationWhenInUseUsageDescription` = "For location-based features in buddy apps"
  - [ ] `NSPhotoLibraryUsageDescription` = "To save screenshots and photos from buddy apps"
- [ ] **Code Signing** — Xcode auto-creates development provisioning profile

## Phase 4: Test on Simulator

**Time estimate: 10 minutes | Read: BUILD.md, Step 6**

- [ ] Select **Product → Destination** → pick an iOS simulator (e.g., "iPhone 16 Pro")
- [ ] Press **Cmd+B** to build (watch for build errors)
- [ ] Press **Cmd+R** to run and wait for simulator to launch
- [ ] See the 🤝 **50 Buddy Apps** splash screen
- [ ] Tap **Continue** and verify the buddies grid loads (`apps/buddies.html`)
- [ ] Tap a buddy app and verify it loads
- [ ] Test basic interaction (scroll, tap buttons)
- [ ] Close app with **Cmd+Q** or **Simulator → Device → Home**

## Phase 5: Test on Physical Device (Optional)

**Time estimate: 15 minutes | Read: BUILD.md, Step 7**

- [ ] Connect iPhone via USB cable
- [ ] Trust the device when prompted on iPhone
- [ ] In Xcode, select **Product → Destination** → your iPhone
- [ ] Press **Cmd+B** to build
- [ ] Press **Cmd+R** to run
- [ ] Wait for app to appear on home screen (may take 30 seconds)
- [ ] Tap app icon and verify all buddy apps load and work

## Phase 6: App Store Metadata Setup

**Time estimate: 30 minutes | Read: APP-STORE-SUBMISSION.md**

- [ ] Create **App Store Connect** account at appstoreconnect.apple.com
- [ ] **Create new app** → Name: "50 Buddy Apps", Bundle ID: `au.rhythmix.buddyapps`
- [ ] **App Information tab:**
  - [ ] Category: "Lifestyle" or "Utilities"
  - [ ] Privacy Policy URL: `https://rhythmixapp.com.au/privacy.html`
  - [ ] Website URL: `https://rhythmixapp.com.au/`
  - [ ] Support URL: `https://rhythmixapp.com.au/contact` or your support email
- [ ] **Pricing and Availability:** Set to "Free" or your tier
- [ ] **Age Rating Questionnaire:** Complete IARC form (expect 4+ rating)
- [ ] **App Description & Keywords:**
  - [ ] Subtitle: "AI companion apps for your journey"
  - [ ] Full description: Use the template in APP-STORE-SUBMISSION.md
  - [ ] Keywords: "buddy, ai, companion, wellness, productivity, fitness, learning"

## Phase 7: Screenshots & App Preview

**Time estimate: 45 minutes | Read: APP-STORE-SUBMISSION.md, Screenshots section**

- [ ] Take 5 screenshots (1284×2778px, iPhone 16 Pro Max) showing:
  - [ ] Main landing page / buddies grid
  - [ ] Sample buddy app 1
  - [ ] Sample buddy app 2
  - [ ] Key feature / unique buddy capability
  - [ ] Getting started / onboarding
- [ ] **Tools:** Use Simulator screenshot (Cmd+S) or screen recording
- [ ] Upload screenshots in App Store Connect → **Screenshots** section
- [ ] (Optional) Create 30-60s app preview video and upload

## Phase 8: Build for TestFlight

**Time estimate: 20 minutes | Read: BUILD.md, Step 8**

- [ ] In Xcode, set **Version** (e.g., "1.0.0") and **Build** (e.g., "1")
- [ ] Select a physical iPhone or simulator
- [ ] **Product → Archive** and wait for archive to complete
- [ ] Click **Distribute App** → **TestFlight & App Store** → **Upload**
- [ ] Sign in with Apple ID, select team
- [ ] Wait for build to process (~5–10 minutes)
- [ ] Check **App Store Connect → TestFlight → Builds** — build should appear

## Phase 9: TestFlight Beta Testing (Optional but Recommended)

**Time estimate: 10 minutes | Read: APP-STORE-SUBMISSION.md, TestFlight section**

- [ ] In App Store Connect, go to **TestFlight**
- [ ] Create a **Test Group** (e.g., "Beta Testers")
- [ ] Add email addresses of testers (friends, family, internal team)
- [ ] Testers receive TestFlight invite → install via TestFlight app
- [ ] Monitor feedback and crash reports in App Store Connect
- [ ] Fix bugs, increment build number, re-upload

## Phase 10: App Store Submission

**Time estimate: 15 minutes | Read: APP-STORE-SUBMISSION.md, Submission section**

- [ ] In App Store Connect, go to **[App] → App Store**
- [ ] Click **Create a New Version** (or edit current)
- [ ] Upload screenshots and app preview (if not done earlier)
- [ ] Review all metadata for accuracy
- [ ] Click **Save** then **Submit for Review**
- [ ] Apple reviews in **24–48 hours**
- [ ] Check email for approval or rejection

## Phase 11: Post-Approval & Release

**Time estimate: 5 minutes**

- [ ] Receive Apple approval email
- [ ] In App Store Connect, click **Release** to go live
- [ ] Celebrate! 🎉 Your app is now on the App Store

## Phase 12: Continuous Integration / Automated Builds (Optional)

**Time estimate: 45 minutes | Read: DEPLOYMENT.md**

- [ ] Create **GitHub Secrets** for Apple credentials:
  - [ ] `APPLE_TEAM_ID` — your 10-char team ID
  - [ ] `APPLE_BUNDLE_ID` — `au.rhythmix.buddyapps`
  - [ ] `APPLE_ID` — your developer email
  - [ ] `APPLE_ID_PASSWORD` — app-specific password (NOT main password)
  - [ ] `APPSTORE_CONNECT_API_KEY_BASE64` — base64-encoded API key from App Store Connect
- [ ] Generate app-specific password:
  - [ ] Go to appleid.apple.com → Security → App-Specific Passwords → Generate
  - [ ] Copy and add to GitHub Secrets
- [ ] Create App Store Connect API key:
  - [ ] Go to App Store Connect → Users and Access → Keys → +
  - [ ] Download `.p8` file and base64 encode it
  - [ ] Add to GitHub Secrets as `APPSTORE_CONNECT_API_KEY_BASE64`
- [ ] Push to `main` branch — GitHub Actions automatically builds and uploads to TestFlight
- [ ] Verify build appears in App Store Connect → TestFlight → Builds

## Phase 13: Updates & Maintenance

- [ ] When you update buddy app files in `../apps/`:
  - [ ] Run `pnpm run build:web && pnpm run sync`
  - [ ] Test on simulator/device
  - [ ] `git push main` (triggers CI/CD if set up)
  - [ ] Or manually archive and upload to TestFlight
- [ ] Monitor **App Store Connect analytics** for crashes, ratings, downloads
- [ ] Respond to user reviews and ratings
- [ ] Plan v1.1, v1.2 updates with new features or bug fixes

## Troubleshooting by Phase

| Phase | Issue | Fix |
|-------|-------|-----|
| 2 | `pnpm install` fails | Check Node 20+ installed; try `npm cache clean --force` |
| 3 | Team ID dropdown empty | Add Apple ID in Xcode Preferences → Accounts |
| 4 | Build fails, "Code Signing Error" | Xcode Preferences → Accounts → Click **Manage Certificates** |
| 5 | Simulator shows blank screen | Check `www/apps/buddies.html` exists; try erasing simulator |
| 6 | Can't find App Store Connect | Visit appstoreconnect.apple.com; use same Apple ID |
| 8 | Archive fails "Module Not Found" | Run `cd ios/App && rm -rf Pods && pod install` |
| 10 | Rejection from Apple Review | Check `BUILD.md` privacy key requirements; update Info.plist |
| 12 | GitHub Actions CI/CD not triggering | Check `.github/workflows/ios-build.yml` file exists; verify secrets set |

## Key Files Reference

| File | Why Read | When |
|------|----------|------|
| **README.md** | Project overview and quick start | First, after this checklist |
| **BUILD.md** | Detailed local build steps | Phases 2–5, troubleshooting |
| **APP-STORE-SUBMISSION.md** | Screenshots, metadata, App Store review | Phases 6–10 |
| **DEPLOYMENT.md** | GitHub Actions CI/CD setup | Phase 12 |
| **package.json** | Build scripts and dependencies | Phases 1–2 |
| **capacitor.config.ts** | App config (ID, name, plugins) | Phase 3 |

## Time Estimates

- **Phases 1–5 (Local Dev):** 1–2 hours
- **Phases 6–10 (App Store):** 2–3 hours
- **Phase 11 (Release):** 5 minutes
- **Phase 12 (CI/CD):** 45 minutes
- **Total (first launch):** 4–6 hours

## What's Next

✅ **You're here:** Reading this checklist  
→ **Next:** Read README.md, then start Phase 2 with `pnpm install`

Good luck! 🚀
