# Fathom — Focus Sound (v0.1)

A focus timer whose engine is **live-generated adaptive sound** — not stock loops. Built as a
self-contained, installable PWA. Standalone app (not RHYTHMIX-branded), per repo convention it
lives in `apps/`.

## The wedge

Every other focus/ADHD app is a plain timer bolted to a stock playlist. Fathom's differentiator
is the sound itself: three Web Audio soundscapes generated in the browser, each breathing on a slow
LFO so it never loops audibly.

- **Deep** — brown-noise bed, low cutoff, slow swell + warm sub pad. Heads-down work.
- **Flow** — brighter texture with a gentle ~60 bpm amplitude pulse to entrain pace.
- **Tide** — wave-like cutoff sweep, deeper swell. Calm / reset.

Session lengths 25 / 50 / 90 min, radial timer, reactive visualiser, volume. Zero audio files,
zero network calls at runtime — cheap to host, works offline.

## Files

- `index.html` — the whole app (HTML + CSS + Web Audio engine, self-contained)
- `manifest.webmanifest` — installable PWA metadata
- `sw.js` — offline cache (cache-first)
- `icons/icon.svg` — app / home-screen icon

## Run / deploy

Local: `python3 -m http.server 8000 --directory apps/fathom` → open `http://localhost:8000`.
(A service worker needs http/https, not `file://`.)

Deploy: it's static — serve `apps/fathom/` from GitHub Pages or Cloudflare Pages. Add-to-home-screen
gives a full-screen standalone app on iOS/Android.

## Roadmap (post-validation)

- Presets memory + streak/session history (localStorage)
- More textures; per-mode fine controls
- Paywall: free single mode, one-time unlock for all modes + longer sessions (Stripe — live AUD account already connected)

## Status

v0.1 prototype — built to prove the *feel* before investing further. Not yet monetised; not linked
from the live marketing site.
