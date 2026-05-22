# HerdCheck

Phone-camera screening for smallholder dairy and small-ruminant farmers — flags **lameness**, **mastitis**, and **imminent calving** in cattle, buffalo, sheep, and goats.

> Cainthus serves big dairy with overhead cameras and enterprise pricing. ~500M smallholders globally have nothing. HerdCheck is built for **the phone in the farmer's pocket**, **offline-first**, and **in their language**.

## What it does

- **Add animals** by ear tag, name, species, and (optionally) last breeding date.
- **Run three structured checks** per animal:
  - **Lameness** — record a short walking video, score on the **Sprecher 5-point locomotion scale** (the published gold standard).
  - **Mastitis** — photograph the udder, tick visible signs (swelling, asymmetry, redness, heat, pain, yield drop), select milk appearance. App runs Canvas-based image heuristics (left/right symmetry, red-pixel fraction) to corroborate.
  - **Calving predictor** — observed behavioural signs (vulva swelling, mucus, bagging up, restlessness, tail raised, pelvic relaxation, off feed, water bag) combined with **gestation day** based on species-specific gestation length (cow 283d, buffalo 310d, sheep 147d, goat 150d). Following Williamson/Mee calving-sign timing windows.
- **Risk tier per check**: green (low) / amber (watch) / red (urgent) with plain-language reasons and recommended actions.
- **Herd dashboard** ranks animals by tier — the ones that need attention float to the top.
- **Alerts tab** auto-surfaces red/amber tiers, including upcoming calvings even without observations.
- **Export** to CSV (for co-op upload) or JSON (full data), or share an alerts summary via Web Share API / SMS.

## What it is *not*

It is **not a diagnostic CV model**. The image analysis is a coarse colour/symmetry heuristic, never the dominant signal. The structured veterinary scoring is the spine. Cainthus-style overhead computer vision is a separate, much larger problem.

The honest pitch:

> A trained dairy farmer with three years of experience can spot the signs HerdCheck checks for. HerdCheck helps the **30-cow farmer with no training** make the same observations, score them consistently, track them over time, and escalate to a vet or extension worker when the score is high.

A real CV model can drop into `vision.js` later — the interface (`analyseUdder`, `videoThumbnail`) is already there.

## Built for the field

- **Offline-first** via service worker + IndexedDB. Works in low-coverage areas; syncs nothing by default.
- **Mobile-first**, big tap targets (56px min), sunlight-readable colours, dark-mode aware.
- **Multilingual**: English, Hindi, Bengali, Swahili, Portuguese, Spanish — buyer markets in India, Bangladesh, Kenya, Brazil.
- **No login, no account, no telemetry**. All data stays on the phone unless the farmer explicitly exports.
- **PWA**: add to Home Screen, gets a full-screen native-app feel on iOS and Android.

## Buyer paths (per the brief)

| Buyer | How they use it |
|---|---|
| **Dairy co-op** | Bulk-license per farmer-member; ingest the CSV exports into their existing herd-records system. The CSV is co-op-ID stamped. |
| **Ag-extension agency** | Equip field officers; the alerts dashboard tells them which farms to visit this week. |
| **Direct farmer** | Free PWA; subsidised by co-op or NGO. Premium tier later for SMS alerts and vet-on-call. |

## Files

```
livestock/
  index.html              app shell
  app.css                 mobile-first styles, dark-mode aware
  app.js                  controller — navigation, state, handlers
  i18n.js                 6-language string tables + applyI18n()
  db.js                   IndexedDB wrapper (animals, observations, settings)
  vision.js               Canvas image heuristics (symmetry, redness)
  scoring.js              Sprecher / mastitis / calving risk algorithms
  sw.js                   offline cache service worker
  manifest.webmanifest    PWA manifest
  icon.svg / icon-192.png / icon-512.png
```

## Run it

It's a static site — open `livestock/index.html` from any HTTPS host (required for the camera capture API and service worker). Locally:

```bash
cd livestock
python3 -m http.server 8000
# then visit http://localhost:8000/ on a phone on the same network,
# or http://localhost:8000/ in desktop Chrome with device toolbar.
```

Deployed to GitHub Pages, the live URL will be `https://rhythmixapp.com.au/livestock/` once this branch lands.

## Where next

- Real CV model (TFJS or ONNX) for udder segmentation + redness/symmetry — train on smallholder photos, not Holstein overhead shots.
- Gait analysis: extract walking frames from the lameness video and score back-arch automatically.
- Voice-note observations for low-literacy users (Web Audio capture exists, transcript later).
- Co-op back-end: simple endpoint accepting the CSV/JSON, dashboard for extension officers.
- SMS bridge for red-tier alerts when offline → SMS gateway with co-op ID routing.

## Caveats

- Risk tiers are **decision support**, not diagnosis. They do not replace a vet.
- Mastitis: any red tier should mean milk-withholding from human consumption pending vet review.
- Calving: the gestation-day estimate is only as accurate as the breeding date entered.
- Image heuristics will give false positives on dirty udders or poor lighting — they're a corroboration signal, never the primary driver of tier.
