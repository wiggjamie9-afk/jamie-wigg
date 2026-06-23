# 🚀 Deploy Jackson's Ecosystem to iPhone 17 — 1 Hour

**Timeline:** 60 minutes from start to installed on iPhone 17

---

## Phase 1: Deploy Backend (10 minutes)

Jackson's Ecosystem needs a server. Easiest: **Replit** (free, instant deploy).

### 1.1 Deploy to Replit

1. Go to **https://replit.com**
2. Click **+ Create**
3. Choose **Import from GitHub**
4. Paste: `https://github.com/wiggjamie9-afk/jamie-wigg`
5. Name: `jackson-ecosystem`
6. Click **Import**
7. In `.replit` file, add your Claude API key:
   ```
   ANTHROPIC_API_KEY = "sk-ant-YOUR_KEY_HERE"
   ```
8. Click **Run**

**Result:** Server running at `https://jackson-ecosystem--{your-username}.replit.dev`

**Test it:** Open in Safari:
```
https://jackson-ecosystem--{your-username}.replit.dev/api/health
```

Should return:
```json
{"status":"ok","service":"Jackson's Ecosystem API"}
```

---

## Phase 2: Build iOS App (20 minutes)

### 2.1 Install Capacitor

```bash
cd capacitor-jackson
npm install
```

### 2.2 Create iOS Project

```bash
npx cap add ios
```

### 2.3 Update `index.html` with Replit URL

Edit `capacitor-jackson/index.html`:

Find line:
```javascript
const API_BASE = 'https://jackson-ecosystem.replit.dev';
```

Replace with your Replit URL:
```javascript
const API_BASE = 'https://jackson-ecosystem--YOUR-USERNAME.replit.dev';
```

### 2.4 Sync to iOS

```bash
npm run build:ios
```

This creates `ios/` folder with Xcode project.

### 2.5 Open in Xcode

```bash
npm run open:ios
```

Xcode opens. You should see:
- Project: `Capacitor Jackson`
- Target: `Capacitor Jackson` (iOS 14+)
- Signing: Auto-managed or your Apple ID

---

## Phase 3: Build & Deploy (20 minutes)

### Option A: Codemagic (Recommended — Automatic)

You already have Codemagic set up for `recovery-ios/`. Reuse it:

1. Go to **https://codemagic.io**
2. Click **Add app**
3. Select `capacitor-jackson`
4. In `codemagic.yaml`, add:

```yaml
workflows:
  jackson-ios:
    name: Jackson iOS Build
    instance_type: mac_mini_m2
    environment:
      xcode: latest
      ios-build-number: $BUILD_NUMBER
    scripts:
      - cd capacitor-jackson
      - npm install
      - npx cap sync ios
      - xcodebuild -workspace ios/App/App.xcworkspace \
          -scheme App \
          -configuration Release \
          -derivedDataPath build \
          -arch arm64
    artifacts:
      - build/Build/Products/Release-iphoneos/App.ipa
    publishing:
      email:
        recipients:
          - jamie.jack.28@hotmail.com
```

5. Trigger build
6. Download `.ipa` file
7. Open on iPhone 17 via email or AirDrop

### Option B: Xcode (Manual — 5 minutes)

1. In Xcode: **Product** → **Archive**
2. Select team (your Apple ID or org)
3. Click **Archive**
4. When done: **Distribute App**
5. Choose **Ad Hoc** (for testing on your iPhone)
6. Click **Export**
7. Download `.ipa` file

### Option C: TestFlight (Easiest on iPhone)

1. In Xcode: **Product** → **Archive**
2. **Distribute App** → **TestFlight**
3. Submit
4. On iPhone 17: Open **TestFlight app**
5. Find "Jackson's Ecosystem"
6. Tap **Install**

---

## Phase 4: Run on iPhone 17 (10 minutes)

### If you chose Codemagic or Xcode (.ipa):

1. Download `.ipa` file on iPhone 17
2. Open Files app → Tap `.ipa`
3. Tap "Open with" → Choose **Xcode** (if available) or
4. Use **Apple Configurator 2** (Mac) to install

### If you chose TestFlight:

1. Open **TestFlight** app on iPhone 17
2. Find "Jackson's Ecosystem"
3. Tap **Install**
4. Done!

### First Launch

1. Tap app icon (Jackson 🎬)
2. Paste your script:
   ```
   "Create an inspiring video about AI transforming music production"
   ```
3. Tap **🚀 Generate**
4. Wait ~3-5 seconds
5. Tap play on narration + music

---

## Quick Reference: URLs & Credentials

| What | Where |
|------|-------|
| Replit server | `https://jackson-ecosystem--{username}.replit.dev` |
| API health check | `{replit-url}/api/health` |
| List outputs | `{replit-url}/api/outputs` |
| Codemagic dashboard | https://codemagic.io |
| TestFlight | Open app on iPhone 17 → TestFlight tab |

---

## Troubleshooting

### "Jackson API unreachable" on iPhone

**Check:**
1. Replit server is running (check Replit dashboard)
2. API URL in `capacitor-jackson/index.html` is correct
3. iPhone 17 has internet connection
4. Try: `{replit-url}/api/health` in Safari on iPhone

### "Audio doesn't play"

**Check:**
1. iPhone 17 isn't on silent (flip silent switch)
2. Volume is up
3. Try playing a YouTube video to confirm audio works

### Build fails in Xcode

**Try:**
1. `cd capacitor-jackson && npm install`
2. `npx cap sync ios`
3. In Xcode: **File** → **Packages** → **Reset Package Caches**
4. Clean build: **Cmd+Shift+K**
5. Rebuild: **Cmd+B**

### "Missing provisioning profile"

1. Xcode: Select your Apple ID in **Preferences**
2. Project settings: Select your team
3. **Signing & Capabilities** → Select team
4. Rebuild

---

## What's Running on iPhone 17

✅ Native iOS app (Capacitor wrapper)
✅ Text input field (optimized for iPhone)
✅ Real-time API calls to Replit backend
✅ Audio playback (narration + music)
✅ Safe area support (notch/Dynamic Island)
✅ Dark mode by default

---

## Next Steps (After Deployment)

### Add More Features:
- 🎤 Microphone input (speech-to-text)
- 📁 Share to Photos/Music
- ⭐ Save favorites
- 🔄 Offline caching

### Link with Other Apps:
- Open outputs in RHYTHMIX Studio
- Send to HyperFrames compositions
- Share to social media

---

## Timeline Summary

| Phase | Time | Task |
|-------|------|------|
| 1 | 10 min | Deploy backend to Replit |
| 2 | 20 min | Build iOS app in Xcode |
| 3 | 20 min | Deploy to TestFlight/Codemagic |
| 4 | 10 min | Install & test on iPhone 17 |
| **Total** | **60 min** | ✅ Done |

---

**Ready to go? Start with Phase 1.**
