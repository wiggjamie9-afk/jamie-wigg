# When you get back — Batch 1 status

Worked while you were out. Here's exactly where Batch 1 stands and the few
steps left that need your Mac/phone.

## ✅ Done (committed + pushed to your session branch)

**All 5 Batch 1 apps are at App Factory standard and packaging-ready:**

| App | What it is | Web (live on push to main) |
|-----|------------|----------------------------|
| 📖 BookReader Pro | Scan a book → read aloud (OCR + TTS) | `rhythmixapp.com.au/apps/bookreader-pro.html` |
| 🧮 MathTutor Pro | Step-by-step math solver | `rhythmixapp.com.au/apps/mathtutor-pro.html` |
| 💪 FitCoach Pro | Workouts, streaks, charts | `rhythmixapp.com.au/apps/fitcoach-pro.html` |
| 🌿 Wellness Buddy | Mood, affirmations, breathing | `rhythmixapp.com.au/apps/buddy-1.html` |
| 🥗 Nutrition Buddy | Meals, water, macros | `rhythmixapp.com.au/apps/food-buddy-1.html` |

What "App Factory standard" got each app:
- Installable PWA (web manifest + offline service worker + app icon)
- Verified readable contrast (no invisible-text bug) and no broken CSS vars
- Mobile-first, safe-area aware, works fully offline, local-first

**Infrastructure built (reusable for every future batch):**
- `scripts/app-factory/pwa-inject.mjs` — turns any app into an installable PWA
- `app-factory/` — Capacitor wrapper that bundles a batch → iOS + Android
- `.github/workflows/app-factory-android.yml` — builds an **Android APK in the
  cloud** so you don't need Android Studio (see below)
- `/nexus` skill — say "/nexus build a new app in Lovable: …" or
  "/nexus finish my Lovable app …" and it runs the whole pipeline

## 📲 To get the installable apps

### Android (no desktop needed) — ✅ VERIFIED WORKING
The cloud build is green and produced a real **5.6 MB APK** with all 5 apps.
1. On GitHub → **Actions** tab → "App Factory · Android APK" → latest run
   (the green one, "use JDK 21").
2. Download the **`app-factory-batch-apk`** artifact and unzip → `app-debug.apk`.
3. Send it to your phone and install (enable "install unknown apps").
   - Artifact stays available for 30 days; re-run the workflow anytime for a fresh build.

### iOS (needs a Mac with Xcode — Apple requires it)
```bash
cd app-factory
npm install
npm run build        # bundles the 5 apps
npm run add:ios
npm run open:ios     # Xcode opens → Run on simulator/device, or Archive
```
Full checklist: `app-factory/README.md`.

### Web (already done)
All 5 are installable straight from Safari/Chrome — "Add to Home Screen."
No app store needed for the web path.

## ⏭️ Next batch (auto-cadence: 5 apps / 3 days)
Batch 2 window opens **2026-06-21**. The free apps (more buddies + nutrition)
are already built; rolling them into a batch is one edit to
`app-factory/batch.json` + a rebuild. Tell me to "start Batch 2" and I'll do it.

— Tracked in `LOVABLE-BUILD-MANIFEST.md`.
