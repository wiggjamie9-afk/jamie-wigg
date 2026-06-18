# When you get back — status

Worked the whole time. Everything below is committed + pushed to your branch.

## ✅ The whole app ecosystem is now 2026 carousel-style + tested

- **99 apps** pass automated functional tests (render, no JS errors, buttons
  work, offline storage works) — run on every push via CI.
- **Every app is carousel-style** (swipe left/right between screens, no long
  vertical pages):
  - BookReader / MathTutor / FitCoach → were already spring carousels w/ swipe + dots
  - **Owed** (the new flagship) → converted to a swipe carousel
  - All **50 buddy + 45 nutrition apps** → swipe-to-navigate + page dots added

## 💰 Owed — your flagship (the "Payout" re-engineer, 10x)

A privacy-first class-action settlement finder. The wedge vs competitors
(Catch, Bobby, Settlemate — all read your inbox/transactions and/or charge
$14/mo):
- 🔒 **100% on-device** — never reads your inbox, never sees your data
- 💵 **Free core + $29 one-time Lifetime** (vs subscriptions)
- Match → track (pipeline) → deadline alerts (.ics) → on-device claim-prep sheet
- ⚡ "Easy money" no-proof filter · 🛡️ links to official admins · honest guardrails
- Files: `apps/owed.html` (app) + `apps/owed-landing.html` (marketing page)

## 📲 Test it — three ways

1. **Web (iPhone, now):** once this branch is on your live site →
   `rhythmixapp.com.au/apps/owed.html` and `/apps/owed-landing.html`.
   Add to Home Screen = installed. (Tell me to merge to `main` and it goes live.)
2. **Android APKs (built in the cloud, green):** GitHub → Actions →
   "App Factory · Android APK" → latest run → download artifacts:
   - **`owed-apk`** (5.5 MB) — standalone Owed
   - **`app-factory-batch1-apk`** (5.6 MB) — BookReader/MathTutor/FitCoach/Buddy/Nutrition
3. **iOS:** needs your Mac once — `cd app-factory && npm install && npm run build
   && APP_FACTORY_BATCH=owed.batch.json npm run add:ios && npm run open:ios`.

## 🚀 To actually go to market with Owed (needs your accounts)

These are wired as stubs — point them at your accounts and it's live:
1. **Payment ($29 Lifetime):** create a Gumroad/Stripe product, paste the link
   into `goPremium()` in `apps/owed.html` (and the landing CTA). Tell me the
   link and I'll wire it.
2. **Email capture:** connect Formspree/Mailchimp in `apps/owed-landing.html`
   `capture()`. Tell me the endpoint and I'll wire it.
3. **App stores:** needs your Apple Developer + Google Play accounts to publish
   the built IPA/APK. Web PWA needs none of this.

## 🏗️ Infrastructure built (reusable)

- `app-factory/` — Capacitor wrapper; builds any batch or standalone app
  (`APP_FACTORY_BATCH=owed.batch.json`)
- `scripts/app-factory/pwa-inject.mjs` — makes any app an installable PWA
- `scripts/app-factory/add-carousel.mjs` — adds swipe-carousel to screen-based apps
- `test-harness/` — jsdom functional tests (`node test-harness/run.mjs --all`)
- CI: `app-factory-android.yml` (APKs) + `app-tests.yml` (test gate)
- `/nexus` skill — runs the build→polish→package pipeline

## ⏭️ Next
Say **"merge to main"** to push Owed + the carousel ecosystem live on your site,
or give me the Gumroad + email links and I'll make Owed fully sellable.
Tracked in `LOVABLE-BUILD-MANIFEST.md`.
