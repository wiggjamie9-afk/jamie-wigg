# 🚀 LAUNCH NOW — Ship 50 Buddy Apps to Web + iOS + Android (Copy & Paste Commands)

**Everything is built and ready. Follow these exact commands to go live in 4 hours.**

---

## ⏱️ Timeline

- **Web:** 5 minutes (immediate)
- **iOS TestFlight:** 2.5 hours  
- **Android Play Store:** 1 hour
- **Total:** ~4 hours hands-on time

---

## 📱 CHANNEL 1: Web (5 minutes)

### Command 1: Push to Production
```bash
cd /home/user/jamie-wigg
git push origin main
```

**Result:** 
- ✅ Live at `https://rhythmixapp.com.au/apps/buddies.html`
- ✅ GitHub Pages auto-deploys
- ✅ Users see 50 buddy carousel instantly

---

## 🍎 CHANNEL 2: iOS App Store (2.5 hours)

### Setup (Run on Your Mac)

**Command 2.1: Install Capacitor dependencies**
```bash
cd /home/user/jamie-wigg/capacitor-buddies
pnpm install
```
⏱️ Takes ~3 minutes

**Command 2.2: Build web assets**
```bash
pnpm run build:web
```
⏱️ Takes ~1 minute

**Expected output:**
```
✓ Web assets built successfully
✓ /home/user/jamie-wigg/capacitor-buddies/www is ready for Capacitor
```

**Command 2.3: Add iOS platform (one-time only)**
```bash
npx capacitor add ios
```

**When prompted:**
- "App name:" → Press Enter (uses "50 Buddy Apps")
- "Package ID:" → Press Enter (uses "au.rhythmix.buddyapps")

⏱️ Takes ~2 minutes

**Command 2.4: Open Xcode**
```bash
pnpm run open:ios
```

This opens `ios/App/App.xcworkspace` in Xcode.

### Build & Upload to TestFlight (In Xcode)

**Step 2.5: Configure Signing**
1. In Xcode, select `App` target
2. Go to **Signing & Capabilities** tab
3. Under "Team," select your Apple Developer Team
4. If you don't have a team:
   - Xcode → Settings → Accounts
   - Add your Apple ID
   - Create a local signing certificate

**Step 2.6: Build for Archive**
```
In Xcode menu:
Product → Scheme → Select "App"
Product → Build for → Running (or just cmd+B to build)
```

Wait for "Build successful" message.

**Step 2.7: Create Archive**
```
Product → Archive
```

Wait ~2 minutes for archive to complete. Xcode Organizer opens automatically.

**Step 2.8: Upload to TestFlight**
```
In Organizer:
1. Select latest archive from "Archives" list
2. Click "Distribute App"
3. Select "TestFlight & App Store"
4. Next → select "Upload"
5. Next → deselect "Manage Version & Build Numbers" (optional)
6. Next → Review → Upload
```

⏱️ Takes ~5–10 minutes to complete upload

**Expected:** "Upload Successful" message

### Invite Testers (In App Store Connect)

```
https://appstoreconnect.apple.com/

1. My Apps → "50 Buddy Apps"
2. TestFlight tab
3. Testers (left sidebar)
4. Create new Internal Tester group
5. Add yourself + trusted testers
6. Enable "Notify testers of new builds"
```

**Testers receive email** with TestFlight link in ~30 minutes.

**Testers tap link → Install app → Test chat, voice, settings**

### Submit to App Store (After TestFlight Testing)

Once testers confirm everything works:

```
In App Store Connect:

1. My Apps → "50 Buddy Apps"
2. App Information tab
   - Name: "50 Buddy Apps"
   - Subtitle: "Your AI companion network"
   - Description: "Chat with 50 AI buddies. Offline voice synthesis, mood tracking, health insights. Free + optional premium features."
   - Keywords: AI, companion, chatbot, mental health, wellness
   - Privacy Policy URL: https://rhythmixapp.com.au/privacy.html
   - Support URL: support@rhythmixapp.com.au

3. Pricing & Availability
   - Pricing: Free
   - Regions: Worldwide (or select specific)

4. Build
   - Select your latest TestFlight build
   - Click "Add Build"

5. Submit for Review
   - Click "Submit for Review"
   - Answer supplementary questions (select "No" for most)
   - Click "Submit"
```

**App Store review:** 1–5 days typically

---

## 🤖 CHANNEL 3: Google Play Store (1.5 hours)

### Setup (Run on Your Mac)

**Command 3.1: Add Android platform**
```bash
cd /home/user/jamie-wigg/capacitor-buddies
npx capacitor add android
```

⏱️ Takes ~3 minutes

**When prompted:**
- "Continue?" → `y`
- "Package ID:" → Press Enter (uses default)

**Command 3.2: Build Release APK/Bundle**
```bash
cd android
./gradlew bundleRelease
```

⏱️ Takes ~5–10 minutes (first time slower due to gradle setup)

**Expected output:**
```
BUILD SUCCESSFUL in Xs
```

**Command 3.3: Locate your bundle**
```bash
ls -lh app/build/outputs/bundle/release/app-release.aab
```

This is your **App Bundle** ready for Play Store.

### Upload to Google Play (First Time Setup)

**Step 3.4: Create Google Play Developer Account**
```
https://play.google.com/console/signup
- Pay $25 one-time registration fee
- Complete merchant account setup
- Create app "50 Buddy Apps"
```

⏱️ Takes ~15 minutes

**Step 3.5: Upload to Internal Testing Track**
```
In Google Play Console:

1. Select "50 Buddy Apps"
2. Left sidebar → Testing → Internal testing
3. Create release
4. Upload `app-release.aab` (from Command 3.3)
5. Add release notes:
   "Launch! 50 unique AI buddies with offline voice chat."
6. Review app content rating (answer IARC questions)
7. Save release
```

⏱️ Takes ~10 minutes

**Step 3.6: Add Internal Testers**
```
In Play Console:
1. Internal testing → Testers
2. Add your email + trusted testers
3. Copy TestFlight link
4. Share with testers
```

**Testers:** Download from Play Store internal testing link in ~1 hour

### Submit to Production (After Internal Testing)

Once testers confirm everything works:

**Step 3.7: Fill Store Listing**
```
In Play Console:

1. Store listing
   - Title: "50 Buddy Apps"
   - Short description: "50 AI companions with offline voice chat"
   - Full description: [same as iOS]
   - Screenshots: Upload 2–3 screenshots
     - Buddies carousel
     - Chat screen
     - Settings screen
   - Privacy policy: https://rhythmixapp.com.au/privacy.html

2. App category: "Lifestyle" or "Wellness"

3. Content rating
   - Complete IARC rating questionnaire
   - Submit for rating
```

⏱️ Takes ~20 minutes

**Step 3.8: Set Price & Distribution**
```
1. Pricing
   - Free
   - Optional: Enable in-app purchases (for premium features)

2. Regions
   - Select regions where app available
   - (Start with US, UK, AU, CA)
```

**Step 3.9: Submit for Review**
```
1. Review → Publish
2. Select "Production" track
3. Click "Publish"
```

**Google reviews:** 2–4 hours typically

---

## ✅ Complete Checklist

### Before You Start
- [ ] macOS with Xcode 15+ installed
- [ ] Apple Developer account (for iOS)
- [ ] Google Play Developer account (for Android, $25)
- [ ] iPhone for testing (optional but recommended)
- [ ] Android phone for testing (optional but recommended)

### Web Launch
- [ ] `git push origin main` ✅

### iOS TestFlight
- [ ] `pnpm install` in capacitor-buddies/
- [ ] `pnpm run build:web`
- [ ] `npx capacitor add ios`
- [ ] `pnpm run open:ios`
- [ ] Build & Archive in Xcode
- [ ] Upload to TestFlight
- [ ] Invite testers, collect feedback
- [ ] Fill App Store metadata
- [ ] Submit for Review

### Android Play Store
- [ ] `npx capacitor add android`
- [ ] `./gradlew bundleRelease` in android/
- [ ] Create Google Play account ($25)
- [ ] Upload bundle to internal testing
- [ ] Invite testers, collect feedback
- [ ] Fill Play Store listing
- [ ] Submit for Review

### Post-Launch
- [ ] Monitor crash reports (Xcode, Play Console)
- [ ] Respond to early reviews
- [ ] Confirm voice works on users' devices
- [ ] Track download/rating trends

---

## 🎯 Success Looks Like

### Web (Immediate)
```
✅ rhythmixapp.com.au/apps/buddies.html loads
✅ Carousel shows 50 buddy cards
✅ Click buddy → chat loads
✅ Type message → hear voice response
```

### iOS (2–3 hours)
```
✅ TestFlight notification arrives
✅ Tap link → install on iPhone
✅ Open app → see splash screen
✅ Tap continue → buddies carousel loads
✅ Tap buddy → chat works
✅ Send message → hear voice (iPhone speakers)
```

### Android (1–2 hours)
```
✅ Play Store internal testing link ready
✅ Android testers install via Play Store
✅ Open app → buddies load
✅ Chat works identically to iOS
✅ Voice synthesis via Android TTS
```

---

## 🔗 Critical Links (Keep These Handy)

- **GitHub:** `https://github.com/wiggjamie9-afk/jamie-wigg`
- **Branch:** `claude/voicebox-docs-review-y2zwhv`
- **Web (live):** `https://rhythmixapp.com.au/apps/buddies.html`
- **App Store Connect:** `https://appstoreconnect.apple.com/`
- **Google Play Console:** `https://play.google.com/console/`
- **Capacitor Docs:** `https://capacitorjs.com/docs/`

---

## 🚨 If Something Breaks

| Error | Fix |
|-------|-----|
| "pnpm: command not found" | `npm install -g pnpm@9` |
| Xcode won't open workspace | Check `ios/App/App.xcworkspace` exists (not `.xcodeproj`) |
| "Signing error" in Xcode | Xcode → Settings → Accounts → Add Apple ID |
| Build fails "Module not found" | `pnpm install` again, then `pnpm run build:web` |
| Gradle build fails | `cd android && ./gradlew clean` then retry |
| TestFlight build rejected | Check build logs in Xcode Organizer → Archives |
| Play Store upload fails | Verify `.aab` file exists: `ls app/build/outputs/bundle/release/app-release.aab` |

---

## 📊 What Happens Next

### Hours 0–1: Web Live
- ✅ Immediate deployment
- Users can access instantly via browser

### Hours 1–3: iOS TestFlight
- ✅ Testers get invite email
- Feedback comes back in real-time
- You can resubmit builds quickly if needed

### Hours 3–4: Android Play Store Internal Testing
- ✅ Testers access via Play Store
- Same feedback loop as iOS

### Days 1–5: App Store Review
- ✅ Apple reviews (usually 1–3 days)
- If rejected, fix & resubmit (5 min turnaround)

### Days 1–2: Play Store Review
- ✅ Google reviews (usually 2–4 hours)
- Faster than Apple typically

---

## 🎉 You're Done When

✅ Web: `rhythmixapp.com.au/apps/buddies.html` gets traffic
✅ iOS: App appears on App Store (searchable, downloadable)
✅ Android: App appears on Play Store (searchable, downloadable)
✅ Users: Can download from any platform, same experience

---

## 📝 Notes

- **All code changes committed** → ready to push anytime
- **No build secrets exposed** → API keys stay in `.env` (gitignored)
- **Cross-platform identical** → same 50 apps, same code, different delivery
- **Offline-first** → works without internet after first load
- **Voice works immediately** → browser SpeechSynthesis, no setup needed

---

**Everything is ready. Pick a start time and follow the commands. You'll have 50 buddy apps live across web + iOS + Android by the end of the day.**

🚀 Let's ship!
