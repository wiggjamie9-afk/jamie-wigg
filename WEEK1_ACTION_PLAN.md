# Week 1: Your Action Items (Right Now)

## 🎯 Goal for This Week
Get your Apple Developer account active + set up Capacitor for your first 5 test apps

---

## ✅ Checklist (Do This Today)

### Step 1: Create Apple Developer Account (30 minutes)
- [ ] Open: https://developer.apple.com/programs/enroll/
- [ ] Sign in with your Apple ID (jamie.jack.28@hotmail.com)
- [ ] Click **Enroll**
- [ ] Choose **Individual** (for now)
- [ ] Accept Terms & Conditions
- [ ] Review your info, click **Continue**
- [ ] Add your address and phone number
- [ ] Proceed to payment
- [ ] Pay $99 USD with your credit/debit card
- [ ] Check email for "Complete your enrollment" message from Apple
- [ ] Click the confirmation link in the email
- [ ] Wait for Apple's approval (usually same day, sometimes 24 hours)

✅ **Deliverable**: You receive "Apple Developer account activated" email

---

### Step 2: Install Xcode (If You Haven't Already)
- [ ] Open Mac App Store (or search "Xcode")
- [ ] Click **Get** then **Install**
- [ ] Wait for download + installation (30-45 min on first install)
- [ ] Open Xcode (Applications folder)
- [ ] Accept license: `sudo xcodebuild -license accept` (copy-paste into Terminal)
- [ ] Enter your Mac password when prompted

✅ **Deliverable**: Xcode opens without errors

---

### Step 3: Create Your Project Folder
```bash
# Copy-paste into Terminal:

mkdir -p ~/Projects/48-apps-native
cd ~/Projects/48-apps-native
git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
cd jamie-wigg
```

✅ **Deliverable**: You have `/Users/[yourname]/Projects/48-apps-native/jamie-wigg/` folder

---

### Step 4: Install Capacitor & Node Tools
```bash
# Copy-paste into Terminal:

# Install Capacitor globally (do this once)
npm install -g @capacitor/cli

# Verify it's installed
capacitor --version  # should show version number
```

✅ **Deliverable**: `capacitor --version` returns something like `6.1.0` or higher

---

### Step 5: Create First Project (Water Tracker)
```bash
# Copy-paste into Terminal:

mkdir -p ~/Projects/48-apps-native/water-tracker
cd ~/Projects/48-apps-native/water-tracker

# Initialize npm
npm init -y

# Install Capacitor packages
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Create the Capacitor project
npx cap init "Water Tracker" "com.jamiewigg.watertracker"

# Create web folder and copy your app
mkdir -p www
cp ~/Projects/48-apps-native/jamie-wigg/apps/water-tracker.html www/index.html

# Add iOS + Android support
npx cap add ios
npx cap add android

# Sync the code
npx cap sync
```

✅ **Deliverable**: You now have:
- `~/Projects/48-apps-native/water-tracker/www/index.html` (your app)
- `~/Projects/48-apps-native/water-tracker/ios/` folder
- `~/Projects/48-apps-native/water-tracker/android/` folder

---

## 📝 Notes for This Week

**If the Apple Developer enrollment gets rejected:**
- They might ask for clarification on your company name
- Just reply to their email with more info
- Resubmit (free, no additional charge)
- Usually approved within 24 hours

**If you get stuck at any step:**
1. Try the step again
2. Copy the exact error message
3. Post it in your notes and we'll debug together

**What NOT to do this week:**
- Don't start building iOS yet (wait until we have 5 projects set up)
- Don't submit to App Store (we need assets first)
- Don't pay for anything beyond the $99 Apple dev account

---

## 🎬 Next Steps (After This Week)

Once you complete all 5 checkmarks above:
1. Let me know you've finished Week 1
2. I'll help you set up the remaining 4 test apps (Meditation, Budget Tracker, Habit Streak, Pomodoro)
3. Then we'll move to **Week 2: Icon & Screenshot Creation**

---

## 💬 Questions?

If anything is unclear:
- **What's "npm"?** Node Package Manager — comes with Xcode, you already have it
- **What's "Capacitor"?** Tool that wraps your HTML app → native iOS/Android
- **Can I do this on Windows?** Sort of (Android yes, iOS no — need Mac for iOS builds)
- **What if I don't have all tools?** Just follow the steps, they'll install automatically

---

**Status**: Ready to begin
**Time investment**: ~2-3 hours (mostly waiting for downloads)
**By end of week**: Apple account active + 1 Capacitor project ready

**Let's go! 🚀**
