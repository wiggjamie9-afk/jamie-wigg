# START HERE — 50 Buddy Apps iOS Wrapper

Welcome! You have a complete, production-ready Capacitor iOS project.

## What Is This?

A native iOS app that bundles **50 web-based buddy apps** into a single App Store-distributable package. Built with **Capacitor 7**, **TypeScript**, and **pnpm**.

## Location

```
/home/user/jamie-wigg/capacitor-buddies/
```

## What's Included

✓ Complete Capacitor iOS project structure  
✓ Camera & Microphone capabilities configured  
✓ TypeScript source files  
✓ Build scripts to bundle Buddy Apps  
✓ **7 comprehensive documentation files**  
✓ Ready for TestFlight & App Store  

## The 7 Documentation Files (Read in This Order)

### 1. SETUP-INSTRUCTIONS.md (START HERE)
Complete setup guide. Covers:
- What you have
- Prerequisites (Xcode, Node, Apple account)
- 5-minute quick start
- What to do next

**Time to read:** 10 minutes

### 2. QUICKSTART.md
Get running in 5 minutes:
- Install dependencies
- Build and open Xcode
- Run in simulator
- Common commands

**Time to read:** 5 minutes

### 3. BUILD.md
Xcode configuration and local development:
- Signing & provisioning profiles
- Running in simulator
- Running on physical iPhone
- Testing checklist
- Troubleshooting

**Time to read:** 15 minutes

### 4. DEVELOPMENT.md
Day-to-day development:
- Project organization
- Updating Buddy Apps
- Debugging & logs
- Git workflow
- Performance tips
- Comprehensive troubleshooting

**Time to read:** 20 minutes

### 5. APP-STORE-SUBMISSION.md
TestFlight and App Store:
- App metadata (name, description, keywords)
- Screenshots & video specs
- Privacy policy setup
- TestFlight submission
- App Store review process
- Common rejections

**Time to read:** 20 minutes

### 6. iOS-CAPABILITIES.md
Permissions and features:
- Camera capability
- Microphone capability
- Privacy usage descriptions
- App Transport Security
- Runtime permissions
- Privacy manifest

**Time to read:** 15 minutes

### 7. README.md
Project overview:
- What this wrapper does
- Project structure
- Technology stack

**Time to read:** 10 minutes

## Quick Navigation

**I just want to run it locally:**
1. Read SETUP-INSTRUCTIONS.md
2. Read QUICKSTART.md
3. Run the 5 commands in QUICKSTART.md
4. Done!

**I want to test on my iPhone:**
1. Follow above steps
2. Read BUILD.md, "Physical Device" section
3. Connect iPhone and follow instructions

**I'm ready to submit to App Store:**
1. Follow "run locally" steps above
2. Read APP-STORE-SUBMISSION.md entirely
3. Read iOS-CAPABILITIES.md for privacy setup
4. Follow submission steps

**I need help with [X]:**
- Xcode issues → BUILD.md
- Running the app → QUICKSTART.md or DEVELOPMENT.md
- Submitting to App Store → APP-STORE-SUBMISSION.md
- Permissions/Camera/Microphone → iOS-CAPABILITIES.md
- Project structure → README.md

## The 5-Minute Quick Start

```bash
cd /home/user/jamie-wigg/capacitor-buddies
pnpm install         # Install dependencies
pnpm build          # Copy apps to www/ and sync
pnpm open:ios       # Open Xcode
# In Xcode: Cmd+R to run in simulator
```

That's it! The app launches.

## What You Need

- **Mac** with Xcode 15+
- **Node.js 20+** and **pnpm 9+**
- **Apple Developer Account** (free to start, $99/year for App Store)

## Core Files (What Was Created)

Configuration:
- `package.json` — Dependencies & npm scripts
- `capacitor.config.ts` — Capacitor & iOS configuration
- `tsconfig.json` — TypeScript configuration
- `vitest.config.ts` — Test configuration

Source Code:
- `src/index.ts` — Capacitor initialization
- `src/app.ts` — App shell & capabilities

Web Assets:
- `www/index.html` — Landing page
- `www/` — Buddy Apps folder (populated by build:web)

Build Scripts:
- `scripts/build-web.mjs` — Copy /apps/ to www/

## Key Commands

```bash
pnpm install       # Install dependencies (1 time)
pnpm build:web     # Copy apps/ to www/
pnpm sync          # Sync www/ to Xcode
pnpm build         # Both above (recommended)
pnpm open:ios      # Open Xcode
pnpm test          # Run unit tests
```

## Success Checklist

After running the 5 quick-start commands, you should see:

✓ No error messages from pnpm install  
✓ pnpm build completes without errors  
✓ Xcode opens  
✓ App builds in Xcode (Cmd+B)  
✓ App launches in simulator (Cmd+R)  
✓ Landing page displays with "🤝 50 Buddy Apps"  

If any step fails, check DEVELOPMENT.md "Troubleshooting" section.

## Next Actions (In Order)

1. **Read SETUP-INSTRUCTIONS.md** (this tells you everything)
2. **Run the 5-minute quick start** from QUICKSTART.md
3. **Read BUILD.md** for Xcode configuration
4. **Read DEVELOPMENT.md** for day-to-day workflow
5. **Read APP-STORE-SUBMISSION.md** when ready to publish
6. **Read iOS-CAPABILITIES.md** for permissions setup

## Important Notes

⚠️ **iOS-Only (For Now)**
This targets iOS only. Android can be added later with a separate project using the same web assets.

⚠️ **Test on Real Device**
Always test on a physical iPhone before submitting to App Store. Simulator behavior may differ.

⚠️ **App Store Review Takes Time**
Expect 24-48 hours for Apple's review. Common rejections: missing privacy policy, crashes, misleading description.

⚠️ **You Need Apple Developer**
Free for local development. $99/year to submit to App Store.

## Getting Help

**Setup issues:** SETUP-INSTRUCTIONS.md or QUICKSTART.md  
**Xcode issues:** BUILD.md  
**Running issues:** DEVELOPMENT.md, Troubleshooting  
**App Store issues:** APP-STORE-SUBMISSION.md  
**Permissions issues:** iOS-CAPABILITIES.md  

## What's Next?

Read **SETUP-INSTRUCTIONS.md** right now. It walks you through everything.

Then run the 5 commands from **QUICKSTART.md**.

You'll have the app running in the simulator within 10 minutes.

---

**Status:** Complete & ready to ship.

**Created:** 2026-06-15  
**Capacitor:** 7.x  
**Node:** 20+  
**pnpm:** 9+  
**Xcode:** 15+  
**iOS Target:** 14.0+  

Good luck!
