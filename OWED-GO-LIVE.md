# Owed — go live in ~15 minutes

Everything's built and tested. These are the only steps that need *you*
(accounts + one or two pastes). Tell me the links and I'll wire them for you.

## 1. Put it on your website (free, instant)
The app + landing page are ready at `apps/owed.html` and `apps/owed-landing.html`.
They go live on `rhythmixapp.com.au` the moment this branch merges to `main`.
→ **Say "merge Owed to main"** and I'll do it. Then:
- App: `https://rhythmixapp.com.au/apps/owed.html`
- Landing: `https://rhythmixapp.com.au/apps/owed-landing.html`
Users can "Add to Home Screen" — installed app, no store needed.

## 2. Take payment for the $29 Lifetime (Gumroad — easiest)
1. Make a free account at gumroad.com.
2. New product → "Owed Lifetime" → price **$29** (or A$45) → publish.
3. Copy its share link (looks like `https://yourname.gumroad.com/l/owed`).
4. Paste it into `apps/owed.html` at the line:
   `const PAYMENT_URL = '';`  →  `const PAYMENT_URL = 'https://...';`
   (or just send me the link and I'll paste + ship it).
The "Unlock Lifetime — $29" button then opens real checkout.
*(Stripe Payment Links work the same way if you prefer.)*

## 3. Collect emails from the landing page (free)
1. Make a free Formspree form (formspree.io) → copy its endpoint URL.
2. Send it to me; I'll wire `capture()` in `apps/owed-landing.html` to it.
Until then, signups are saved on-device so none are lost.

## 4. Android app (already built)
GitHub → Actions → "App Factory · Android APK" → latest run → download
**`owed-apk`**. Sideload to test now. To list on Google Play you'll need a
Play Developer account ($25 once) — then upload that APK.

## 5. iOS app (needs your Mac once)
`cd app-factory && npm install && APP_FACTORY_BATCH=owed.batch.json npm run build
&& APP_FACTORY_BATCH=owed.batch.json npm run add:ios && npm run open:ios`
Archive in Xcode → TestFlight/App Store (needs Apple Developer account, $99/yr).

## Fastest path to first dollar
Steps **1 + 2** only (web + Gumroad). That's a sellable product on your own
domain today — no app stores, no Mac required. Everything else is upside.

---
*Owed is an information/organisation tool, not a law firm; it doesn't guarantee
payouts and tells users to verify on official sites. Keep that framing in any
ads so the positioning stays honest.*
