# App Store Submission Guide — 50 Buddy Apps

This guide covers TestFlight beta testing and submission to the App Store.

## Overview

1. **TestFlight** → Internal + external testing with real users (1–30 days)
2. **App Store Review** → Apple reviews the app (typically 24–48 hours)
3. **Release to App Store** → Available globally on iPhone

You'll need your **Apple Developer account** throughout.

## App Metadata

Before you upload, gather this information:

### Basic Info

| Field | Value |
|---|---|
| App Name | 50 Buddy Apps |
| Subtitle | AI-powered wellness & utility tools |
| Category | Utilities (or select from App Store Connect) |
| Bundle ID | au.rhythmix.buddyapps |
| Version | 1.0.0 |

### Description

A collection of 50 AI-powered buddy apps for wellness, productivity, and personal growth. Each app is a lightweight web-based tool you can access offline.

**Key Features:**
- 50 unique buddy apps (health, finance, creativity, lifestyle)
- Offline-capable progressive web apps
- Voice input with ElevenLabs text-to-speech
- Camera access for photo analysis
- Lightweight, fast, no data storage

### Keywords

wellness, productivity, ai, buddy, tools, health, lifestyle, voice, camera, offline, web app

### Support URL

https://rhythmixapp.com.au/support

(Or create a support page; Apple requires a valid URL)

### Privacy Policy URL

https://rhythmixapp.com.au/privacy

(You must have a privacy policy published before submission)

### Terms of Service URL (Optional)

https://rhythmixapp.com.au/terms

## Screenshots

### Requirements

- **Languages:** English (minimally)
- **Device:** iPhone 6.5" (Pro/Max) or 5.5" (Plus) — Apple provides template sizes
- **Quantity:** 2–10 screenshots per device type

### Recommended Screenshots

Create 4–5 screenshots showing:

1. **Home/Main Screen** — Buddy Apps grid or list
2. **Sample App in Use** — One app showing key feature (e.g., wellness tracker)
3. **Voice/Input Feature** — Microphone or text input in action
4. **Offline Capability** — Note that apps work offline
5. **Settings/Menu** — If applicable

**Tools:**
- Screenshot on iPhone: Press **Side Button + Volume Up**
- Annotate: Use Markup app or Xcode organizer's built-in screenshot markup

### Upload to App Store Connect

1. Go to **App Store Connect** → your app
2. **App Preview & Screenshots**
3. Select device type (e.g., "iPhone 6.5"")
4. Drag and drop screenshots
5. Add a **preview video** (optional, but recommended):
   - 15–30 second MP4 showing app in action
   - Mute or add soft background music
   - App Store will auto-resize

## Pricing & Availability

### Pricing Tier

- **Free** (recommended for initial launch)
- Or select a tier ($0.99–$999.99)

### Availability

- **Territory:** Select all or specific regions
- **Age Rating:** Use App Store's questionnaire:
  - Privacy: Does it collect personal info? (No, for this app)
  - Health: Does it dispense medical advice? (No, unless Buddy Apps do)
  - Content Rating: Age 4+, 12+, 17+ (typically 4+ for wellness tools)

## Rights & Aging

Answer Apple's questionnaire about:
- **Content Rights:** You own or have license to all content ✓
- **Third-Party Content:** Acknowledge any SDKs (Capacitor, web frameworks) ✓
- **Export Compliance:** Not exporting encryption ✓

## Building for Submission

### Step 1: Archive

In Xcode:

```bash
pnpm open:ios
```

Then in Xcode:

1. **Product → Destination → Generic iOS Device** (not a simulator)
2. **Product → Archive**
3. Wait for build to complete
4. Xcode opens **Organizer** window with your archive

### Step 2: Validate

In the Organizer:

1. Click your archive
2. Click **Validate App**
3. Select your **Team**
4. Xcode checks bundle IDs, code signing, entitlements
5. Fix any errors and retry

### Step 3: Distribute to App Store

Still in Organizer:

1. Click your archive
2. Click **Distribute App**
3. Select **App Store Connect**
4. Provide signing details (your Team will auto-fill if configured correctly)
5. Xcode uploads to App Store Connect

**Alternatively, use App Store Connect directly:**
1. Go to **App Store Connect** → your app
2. **TestFlight** → **Build** tab
3. Click **+** to add a build
4. Paste the build number from your archive
5. Apple processes it (5–15 minutes)

## TestFlight (Internal Testing)

### Add Testers

1. **App Store Connect** → your app
2. **TestFlight** tab → **Testers** group
3. Click **+** to add testers (by email)
4. Apple sends them a TestFlight invite link

### How Testers Install

Testers receive an email link. They:

1. Download **TestFlight** app from App Store
2. Click the email link (opens TestFlight)
3. Install your app
4. Test for 30 days (can be renewed)

### Gather Feedback

- Provide a **feedback form link** in-app or via email
- Monitor crashes via **TestFlight** → **Crashes** dashboard
- Review app logs and console output

### Common TestFlight Issues

- **"Tester cannot be added"** → They may already be registered on Apple ID; remove and re-add
- **"Expired beta"** → If 30 days pass, extend or submit to App Store

## App Store Submission

### Final Checklist

Before hitting **Submit for Review**:

- [ ] All metadata is complete (description, keywords, support URL)
- [ ] Screenshots are present (4–5 per device size)
- [ ] Privacy policy URL is public and accessible
- [ ] App version matches `capacitor.config.ts` and increased since last submission
- [ ] No test credentials or debug info in app
- [ ] Camera and Microphone usage descriptions are in `Info.plist`
- [ ] All Buddy Apps load without errors
- [ ] App does not display explicit content without appropriate rating

### Submit

1. **App Store Connect** → your app
2. **App Information** tab → fill all required fields
3. **Pricing & Availability** → select Free tier
4. **App Preview & Screenshots** → verify screenshots present
5. **Version Release** → select **Automatically release** or **Manual release** (wait for your command)
6. Click **Submit for Review**

### Review Status

Apple typically reviews within **24–48 hours**. You'll receive an email:

- **Approved** → App is live on App Store
- **Rejected** → Check Apple's feedback and resubmit
- **Needs Info** → Apple is asking clarifying questions (respond within 5 days)

### Common Rejection Reasons

| Reason | Fix |
|---|---|
| **Crashes on launch** | Test thoroughly on physical device; check console logs |
| **App is primarily a web app** | Clarify Buddy Apps are offline-capable PWAs wrapped in native shell |
| **Missing privacy policy** | Ensure privacy policy URL is public and explains data handling (should be: "No data collection") |
| **Insufficient functionality** | Make sure all 50 Buddy Apps are accessible; app must offer native value (offline, camera, microphone) |
| **Misleading app description** | Ensure description accurately reflects what's included |

### Resubmission

If rejected, Apple provides detailed feedback. Fix issues and resubmit:

1. Increment version (e.g., 1.0.1)
2. Build a new archive
3. Upload to App Store Connect
4. Submit for Review again

## After Approval

### Release to App Store

If you chose **Manual Release**:

1. **App Store Connect** → your app
2. **Version** tab
3. Click **Release This Version**

The app goes live globally within 1–2 hours.

### Monitor Performance

Post-release:

1. **App Store Connect** → **App Analytics**
   - Downloads, crashes, ratings, reviews
2. **Ratings & Reviews** → Respond to user feedback
3. **Crash Logs** → Monitor for unexpected errors

### Prepare Next Release

- Gather user feedback from reviews
- Bug fixes → increment version (1.0.0 → 1.0.1)
- New features → increment minor version (1.0.0 → 1.1.0)
- Major overhaul → increment major version (1.0.0 → 2.0.0)

## Sandbox Testing

For in-app purchases or subscriptions (future):

Apple provides **Sandbox Test Cards** for TestFlight:

- Card Number: `4111111111111111` (Visa)
- Expiry: Any future date
- CVV: Any 3 digits

These charge $0 and are useful for testing payment flows.

## Resources

- **App Store Connect:** https://appstoreconnect.apple.com
- **Apple Developer:** https://developer.apple.com/help/app-store-connect/
- **TestFlight Help:** https://developer.apple.com/testflight/
- **App Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/

## Support

For questions:

1. Check Apple Developer Documentation
2. Post in Apple Developer Forums
3. Contact App Store Support via App Store Connect (Account → Support)

---

Good luck with your submission! The review process is usually smooth if your app follows Apple's guidelines and provides clear value to users.
