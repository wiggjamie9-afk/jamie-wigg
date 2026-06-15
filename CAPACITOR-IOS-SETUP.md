# Capacitor iOS Setup for 50 Buddy Apps

Complete guide to build, test, and ship the buddy apps on App Store.

## Prerequisites

**What you need:**
- Mac with Xcode 14+ (free from App Store)
- Apple Developer account ($99/year) — register at developer.apple.com
- Node.js 18+ and pnpm (already installed)
- iOS device or simulator for testing

**Time estimate:** 2-3 hours for first build, 30 min for rebuilds

---

## Step 1: Build the Capacitor iOS Project (5 min)

The agent has already created the structure. Just run:

```bash
cd capacitor-buddies
pnpm install
pnpm build
```

This will:
- Copy all 50 buddy apps from `apps/` to `www/`
- Run `npx cap sync` to update the iOS native project

---

## Step 2: Open in Xcode (1 min)

```bash
pnpm open:ios
```

This launches Xcode with the iOS project open.

---

## Step 3: Configure Signing (10 min)

**In Xcode:**

1. Left sidebar → Project "App" → Targets → "App"
2. Tab: "Signing & Capabilities"
3. **Team:** Select your Apple Developer team (or create a free one)
4. **Bundle Identifier:** Should be `au.rhythmix.buddyapps`
5. **Minimum Deployment:** iOS 14.0 (should be set)

**If you don't see your team:**
- Xcode → Settings → Accounts → Add Apple ID → Sign in

---

## Step 4: Add Required Capabilities (5 min)

**Still in Signing & Capabilities:**

1. Click **"+ Capability"** button
2. Add:
   - **Camera** (for PPG heart rate monitoring)
   - **Microphone** (for voice input/ElevenLabs)

**Verify Privacy Strings:**
- In `ios/App/App/Info.plist`, check:
  - `NSCameraUsageDescription`: "For heart rate monitoring via camera"
  - `NSMicrophoneUsageDescription`: "For voice input and AI voice synthesis"

---

## Step 5: Test on Simulator (10 min)

1. Xcode top bar: Select device → iOS Simulator (e.g., "iPhone 15 Pro")
2. Click the **Play** button (or Cmd+R)
3. Simulator launches the app
4. Tap a buddy, test chat (paste Claude API key in Settings)
5. Verify camera/heart rate prompts appear

**Expected behavior:**
- App launches to buddies grid
- Tap buddy → app opens
- Chat works with API key
- Camera permission prompt appears on Health tab
- No crashes

---

## Step 6: Test on Physical Device (15 min, optional but recommended)

1. Plug iPhone into Mac
2. Trust the device (on phone)
3. Xcode: Select your phone from device menu
4. Click Play to build and install
5. On phone: Settings → General → VPN & Device Management → Trust developer certificate
6. Test the app end-to-end

---

## Step 7: Create App Store Listing (30 min, one-time)

Go to **App Store Connect** (`appstoreconnect.apple.com`):

1. **My Apps** → **Create App**
   - Name: `50 Buddy Apps`
   - Bundle ID: `au.rhythmix.buddyapps`
   - SKU: `BUDDYAPPS001` (unique identifier)
   - Platform: iOS
   - User Access: Full Access (for now)

2. **App Information:**
   - Category: Health & Fitness
   - Subtitle: Your AI Companion for Every Journey
   - Version: 1.0.0
   - Privacy Policy URL: https://rhythmixapp.com.au/privacy.html

3. **Pricing & Availability:**
   - Price Tier: Free (in-app purchases via Gumroad)
   - Availability: Worldwide

4. **Build & Version:**
   - Upload the `.ipa` build (see Step 8)

---

## Step 8: Build for App Store Submission (15 min)

**In Xcode:**

1. Top bar: Select device → **Any iOS Device (arm64)**
2. Product → Archive
3. Window → Organizer (opens)
4. Select the latest archive → **Distribute App**
5. Choose **App Store Connect**
6. Follow prompts (automatic signing, etc.)
7. Build uploads to App Store Connect

Alternatively (command line):

```bash
cd capacitor-buddies/ios/App
xcodebuild -scheme App -configuration Release -derivedDataPath build \
  -destination 'generic/platform=iOS' archive
```

---

## Step 9: Submit for Review (5 min)

**In App Store Connect:**

1. Go to your app → **Prepare for Submission**
2. Fill in:
   - Screenshots (see APP-STORE-METADATA.md for suggestions)
   - Description (copy from APP-STORE-METADATA.md)
   - Keywords (see metadata file)
   - Support URL: https://rhythmixapp.com.au/help
   - Privacy Policy URL: https://rhythmixapp.com.au/privacy.html

3. **Release Notes:**
   ```
   v1.0.0 Launch
   
   50 AI Buddy Apps — Your personal companion for every journey.
   Choose from 50 distinct buddies for mental health, relationships, wellness, and career.
   
   Features:
   - Claude AI streaming chat
   - Offline-first (all data on your device)
   - Camera heart rate monitoring
   - Avatar Studio (AI talking-head avatars)
   - Journal & affirmations
   - Crisis detection with emergency resources
   
   Freemium: Chat free, premium unlocks more ($4.99/mo or $49.99/yr)
   ```

4. **Age Rating:**
   - Complete IARC questionnaire (usually 5-10 min)
   - App will be rated for age appropriateness

5. **Click "Submit for Review"**

---

## Step 10: Wait for App Review (24-48 hours)

Apple will review your app for:
- Crashes on launch
- Compliance with App Store guidelines
- Privacy concerns
- Content appropriateness

**Common rejection reasons & fixes:**

| Issue | Fix |
|-------|-----|
| App crashes on launch | Test on iOS 14+. Check logs in Xcode. |
| "Incomplete" (missing required fields) | Fill all fields in App Store Connect. |
| Misleading health claims | Add disclaimer: "Not a medical device." |
| Requires external login | OK if optional. Just document in description. |
| Camera/Microphone without clear consent | Privacy strings already in Info.plist. |

---

## Step 11: Celebrate! 🎉

Once approved:
- App appears on App Store (search "50 Buddy Apps")
- Users can download for free
- Premium conversions ($4.99/mo or $49.99/yr) via Gumroad
- Monitor reviews and crash reports in App Store Connect

---

## Rebuilds & Updates (After v1.0)

To update the app with new buddies, bug fixes, or features:

1. Make changes to `/apps/buddy-*.html` files
2. In `capacitor-buddies/`:
   ```bash
   pnpm build
   ```
3. Open in Xcode → increment version (e.g., 1.0.1)
4. Product → Archive → Distribute
5. Submit in App Store Connect

---

## Troubleshooting

**"Xcode can't find CocoaPods"**
- Run: `sudo gem install cocoapods && pod setup`

**"Signing error: Team not selected"**
- Go back to Step 3. Make sure you've selected a team in Signing & Capabilities.

**"App crashes on launch"**
- Check Xcode console for error logs
- Verify Service Worker (`sw.js`) loads
- Test on simulator and device separately

**"Camera permission crashes the app"**
- PPG code might have an issue. Check Safari console in iOS (USB + Chrome DevTools)
- Fallback to manual heart rate entry should work

**"Can't see my device in Xcode"**
- Trust device on phone (Settings → Trust this computer)
- Unplug and replug
- Restart Xcode

---

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Account | $99 | Annual |
| App Store listing | Free | One-time |
| Gumroad (payment processing) | 10% of sales | Per transaction |
| Server (optional) | Free-$50/mo | Optional |

**Revenue example at 1000 premium subscribers @ $4.99/mo:**
- Gross revenue: $4,990/mo
- Gumroad fee (10%): -$499
- App Store cut (0%): $0
- Net: ~$4,491/mo to you

---

## Next Steps After Launch

1. Monitor App Store reviews (target: 4.5+ stars)
2. Track crash rates in App Store Connect
3. Plan v1.1 features:
   - More buddy personalities
   - Advanced avatar customization
   - Buddy buddy interactions
   - Export data (GDPR)
4. B2B: Pitch corporate wellness bundles (the 12 enterprise buddies)

---

## Reference Files

- `APP-STORE-METADATA.md` — Copy description, keywords, screenshots
- `BUDDY-FREEMIUM-QUICK-START.md` — How users enable premium
- `BUDDY-FREEMIUM-TEST-PLAN.md` — Test payment flow before launch
- `capacitor-buddies/BUILD.md` — (auto-generated, detailed Xcode reference)

