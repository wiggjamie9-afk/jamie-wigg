# Lovable Build Manifest — 5-App Batches Every 3 Days

**Current Date:** 2026-06-18  
**Cadence:** 5 apps per batch, 3 days per batch  
**Next batch start:** 2026-06-21

---

## Batch 1 (2026-06-18 → 2026-06-21)

Priority: Reading + Math (premium) + 3 free companions

| # | App | Type | Status | Notes |
|---|-----|------|--------|-------|
| 1 | **bookreader-pro** | Premium/Reading | PWA-ready | OCR + TTS for dyslexic readers. Manifest + SW added, contrast verified. Ready for Capacitor packaging. |
| 2 | **mathtutor-pro** | Premium/Math | PWA-ready | Step-by-step solver. Manifest + SW added, contrast verified. Ready for Capacitor packaging. |
| 3 | **buddy-1** | Companion/Free | PWA-ready | Mood journal, affirmations, breathing. Already PWA; bundled into App Factory. |
| 4 | **food-buddy-1** | Nutrition/Free | PWA-ready | Food/water/macros logging. Already PWA; bundled into App Factory. |
| 5 | **fitcoach-pro** | Premium/Fitness | PWA-ready | Workout logging, streaks, charts. Manifest + SW added, contrast verified. Ready for Capacitor packaging. |

**Batch 1 packaging:** all 5 apps are bundled by `app-factory/` (run
`cd app-factory && npm install && npm run build` on your Mac, then
`npm run add:ios` / `npm run add:android`). Web versions auto-deploy to
`rhythmixapp.com.au/apps/<slug>.html`. Remaining manual step (needs a Mac with
Xcode/Android Studio): generate the native projects and build the IPA/APK.

---

## Batch 2 (2026-06-21 → 2026-06-24)

| # | App | Type | Status | Notes |
|---|-----|------|--------|-------|
| 1 | **buddy-2** | Companion/Free | Pending | — |
| 2 | **buddy-3** | Companion/Free | Pending | — |
| 3 | **buddy-4** | Companion/Free | Pending | — |
| 4 | **food-buddy-2** | Nutrition/Free | Pending | — |
| 5 | **food-buddy-3** | Nutrition/Free | Pending | — |

---

## Batch 3 (2026-06-24 → 2026-06-27)

Will cycle through remaining companions + nutrition apps + CodeMentor, NutriAI, StoryStudio, VoiceJournal.

---

## Lovable Build Process

For each batch, follow this flow:

### 1. Build in Lovable
```
/nexus build a new app in Lovable: [app description + vibe]
```

### 2. Finish to App Factory Standard
```
/nexus finish my Lovable app "[app name]" — [what's missing], then polish 
to 2026 App Factory standard and package for iOS + Android
```

### 3. Outputs
- `.apk` (Android)
- `.ipa` (iOS, unsigned)
- `app.html` (web fallback at `rhythmixapp.com.au/apps/[name]/`)

---

## Status Legend
- **Queued** = Ready to brief and build
- **Building** = In Lovable, being developed
- **Testing** = Built, QA in progress
- **Packaged** = Ready for distribution

