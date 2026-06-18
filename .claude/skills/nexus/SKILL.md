---
name: nexus
description: App pipeline orchestrator for the wellness/app ecosystem. Use when the user says "/nexus build a new app in Lovable: <desc>", "/nexus finish my Lovable app <name>", or otherwise asks to build, polish, or package an app to "App Factory standard" for iOS + Android. Handles two phases — BUILD (turn an idea into a copy-paste Lovable brief + a starter HTML app) and FINISH (take an existing/exported app, polish it to 2026 App Factory standard, PWA-ify it, and package it for iOS + Android via the App Factory Capacitor wrapper).
---

# Nexus — App Factory pipeline

Nexus runs the repo's app pipeline in two phases. Detect which phase from the
user's words, then follow that section. Always work on the session branch and
commit + push when done (the container is ephemeral).

Key paths:
- Standalone apps live in `apps/<slug>.html`.
- PWA injector: `scripts/app-factory/pwa-inject.mjs` (registry of apps + metadata).
- Capacitor packager: `app-factory/` (driven by `app-factory/batch.json`).
- Batch schedule + status: `LOVABLE-BUILD-MANIFEST.md`.
- Brand/design tokens: `rhythmix-teaser-60s/DESIGN.md`. Per-category colors:
  food `#4CAF50`, education `#5B7FBE`, health `#C97A9A`, finance `#48A9A6`,
  fitness `#FF9800`, productivity `#B39AC9`.

---

## Phase A — BUILD  ("build a new app in Lovable: <description>")

Goal: turn a one-line idea into (1) a polished, copy-paste Lovable prompt and
(2) a working starter `apps/<slug>.html` so progress exists even before Lovable.

1. **Parse the brief**: extract what it does, who it's for, the vibe. If the
   category is obvious, pick its accent color from the table above; else ask.
2. **Write the Lovable prompt** — append a section to the current batch's brief
   file (e.g. `BATCH-N-LOVABLE-BRIEFS.md`). The prompt MUST include: feature
   list, dark-mode + offline requirement, design vibe (fonts + accent), target
   audience. Keep it inside a fenced ```code block``` for clean copy-paste.
3. **Scaffold a starter app** at `apps/<slug>.html`: single self-contained HTML
   file, Google Stitch aesthetic, the category accent color, core features
   working with `localStorage` (no backend), dark mode, readable dark text on
   light cards (NEVER light-gray text on light bg — that was a real bug).
4. **Register it** for packaging: add a row to the REGISTRY in
   `scripts/app-factory/pwa-inject.mjs` and to `app-factory/batch.json` if it
   belongs in the active batch.
5. **Verify + ship**: run `node scripts/app-factory/pwa-inject.mjs <slug>`,
   confirm manifest/SW generate and the HTML is well-formed, then commit + push.

---

## Phase B — FINISH  ("finish my Lovable app <name> — add <X>, package for iOS+Android")

Goal: take an existing app (a Lovable export the user pastes/links, or an app
already in `apps/`) to **2026 App Factory standard** and package it.

1. **Locate the app**: if it's a Lovable export, save it to `apps/<slug>.html`
   (flatten to a single self-contained file if possible). If it already exists,
   open it.
2. **Add what's missing** (the user's "add <X>"). Match the existing code's
   style, naming, and comment density.
3. **App Factory standard pass**:
   - Dark mode + light mode both readable; verify text/background contrast
     (no light text on light bg, no undefined CSS vars — grep to confirm).
   - Mobile-first, `viewport-fit=cover`, safe-area insets, 44px tap targets.
   - Offline-first via `localStorage`/IndexedDB; no required backend.
   - Any AI feature is optional and lights up only when a key is present.
4. **PWA-ify**: add the app to the REGISTRY in `pwa-inject.mjs` (name, short
   name, description, theme color, bg color, emoji, categories, extraCache for
   any CDN deps), then run `node scripts/app-factory/pwa-inject.mjs <slug>`.
5. **Package for iOS + Android**:
   - Add the app to `app-factory/batch.json`.
   - `cd app-factory && npm install` (first run) then `npm run build` to bundle
     `www/` and `cap sync`.
   - `npm run add:ios` / `npm run add:android` create the native projects.
   - iOS: `npm run open:ios` → build/archive in Xcode (unsigned debug is fine
     for sideload/TestFlight). Android: `npm run open:android` → build APK in
     Android Studio, or `cd android && ./gradlew assembleDebug`.
   - See `app-factory/README.md` for the full build + signing checklist.
6. **Deploy web fallback**: the app is already live at
   `rhythmixapp.com.au/apps/<slug>.html` via GitHub Pages on push to `main`.
7. **Update status** in `LOVABLE-BUILD-MANIFEST.md` (Queued → Packaged) and
   commit + push.

---

## Cadence

The user ships **5 apps per batch, one batch every 3 days**
(see `LOVABLE-BUILD-MANIFEST.md`). When a batch is finished, roll the next 5
apps from the manifest into a new `BATCH-N-LOVABLE-BRIEFS.md` and a fresh
`app-factory/batch.json`, then repeat the phases above.

## Guardrails
- Never invent metrics/testimonials in app copy (see repo content-warning rule).
- Keep everything local-first: no user audio/data uploaded to our infra.
- Commit + push after every milestone — the container is ephemeral.
