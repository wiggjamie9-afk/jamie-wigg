# Quick Start — 30 Minutes to Simulator

Get the app running on an iOS simulator in 30 minutes.

## Prerequisites

- macOS 12.0+ (Intel or Apple Silicon M1/M2/M3+)
- Xcode 15.0+ (install from App Store or `xcode-select --install`)
- Node 20+ (check with `node --version`)
- pnpm 9+ (`npm install -g pnpm@9`)

## 5 Commands, 5 Steps

### Step 1: Install Dependencies (3 minutes)

```bash
cd /home/user/jamie-wigg/capacitor-buddies
pnpm install
```

**Wait for:** All dependencies to finish installing.

### Step 2: Build Web Assets (1 minute)

```bash
pnpm run build:web
```

**Expected:** Copies all HTML files from `../apps/` to `www/apps/` and creates `www/index.html`.

**Verify:**

```bash
ls www/apps/buddies.html
# Should output: www/apps/buddies.html
```

### Step 3: Generate iOS Project (2 minutes)

```bash
npx capacitor add ios
```

**This runs once only.** Capacitor generates the Xcode project in `ios/App/`.

**When prompted:**
- App name: Press Enter (uses default "50 Buddy Apps")
- Package ID: Press Enter (uses default "au.rhythmix.buddyapps")

### Step 4: Sync to iOS (3 minutes)

```bash
pnpm run sync
```

**This:**
- Copies web assets to iOS
- Installs CocoaPods dependencies
- Updates Xcode project

**Wait for:** "✔ Sync complete" message.

### Step 5: Open Xcode and Run (15 minutes)

```bash
pnpm run open:ios
```

This opens the Xcode workspace (`ios/App/App.xcworkspace`).

**In Xcode:**

1. **Select a simulator:**
   - Product → Destination → pick "iPhone 16 Pro"

2. **Build:**
   - Press **Cmd+B** and wait for build to complete

3. **Run:**
   - Press **Cmd+R** and wait 10–15 seconds

4. **You should see:**
   - iOS simulator launches
   - App icon 🤝 appears on home screen
   - Tap the app → splash screen appears
   - Tap "Continue" → Buddy Apps grid loads
   - Tap a buddy app → it opens

**Success! ✅**

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `pnpm: command not found` | Install pnpm: `npm install -g pnpm@9` |
| Build fails "Module Not Found" | Run `pnpm install` again |
| Xcode won't open | Verify `ios/App/App.xcworkspace` exists |
| Build fails "Code Signing Error" | In Xcode Preferences → Accounts, sign in with Apple ID |
| Simulator shows blank screen | Check `www/apps/buddies.html` exists with `ls www/apps/` |
| Simulator is slow | Close other apps; try restarting simulator (Device → Erase All Content and Settings) |

---

## Next Steps

✅ **App works on simulator?** Great!

- **Test on physical iPhone:** Follow BUILD.md, Step 7 (connect via USB)
- **Deploy to TestFlight:** Follow BUILD.md, Step 8 (archive and upload)
- **Submit to App Store:** Follow APP-STORE-SUBMISSION.md
- **Automate with CI/CD:** Follow DEPLOYMENT.md

📖 **For detailed docs:**
- Local development: READ `BUILD.md`
- App Store submission: READ `APP-STORE-SUBMISSION.md`
- GitHub Actions automation: READ `DEPLOYMENT.md`
- Full setup checklist: READ `SETUP-CHECKLIST.md`

---

## Command Cheat Sheet

```bash
cd /home/user/jamie-wigg/capacitor-buddies

# Build & test
pnpm run build:web        # Copy apps to www/
pnpm run sync             # Sync to iOS
pnpm run build            # Both above
pnpm run open:ios         # Open Xcode

# One-time setup
npx capacitor add ios     # Generate iOS project (first time only)
```

---

## Time Breakdown

- Step 1 (pnpm install): **3 minutes**
- Step 2 (build:web): **1 minute**
- Step 3 (capacitor add): **2 minutes**
- Step 4 (sync): **3 minutes**
- Step 5 (Xcode build + run): **15–20 minutes**

**Total: ~25–30 minutes**

---

That's it! Your 50 Buddy Apps are now running on iOS. 🎉
