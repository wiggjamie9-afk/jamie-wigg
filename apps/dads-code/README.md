# Dad's Code — app (v1 wedge)

*Your code — live it, then leave it.*

A dependency-free, offline-first PWA. No account, no server, no build step. Everything
a dad writes lives only in his browser's IndexedDB on his own device; the real archive
is the export he keeps. Built to the spec in `specs/dads-code/`.

## Run it

It's plain HTML/JS — serve the folder over any static server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory apps/dads-code
# then open http://127.0.0.1:8000
```

(Or open `index.html` directly — the service worker + IndexedDB work best over http.)

## What's in this v1 (the wedge loop)

- **Onboarding** (`R7`) — no account, warm prompt cards, voice-first, "leave your first three."
- **The Code** (`R1`) — author Values → Principles → Practices, *his words only*, with the
  sharpening question and optional domain prompts. Zero seeded content.
- **Daily check-in** (`R2`) — one-tap kept / slipped / n-a per practice + single-tap inner
  weather (`R4.2`). Additive, forgiving consistency; a missed day breaks nothing.
- **Journal** (`R3`) — quick log (one-line minimum) + voice recording (audio stored as a
  native Blob, transcript stubbed). Private by default.
- **Weekly mirror** (`R2.3`) — additive pattern read, never a scoreboard.
- **Backup & export** (`R9`) — self-contained `.html` backup that opens with no app,
  `.dadscode` JSON with sha-256 checksum + restore, and a print keepsake book. Always free.
- **Settings** — name, one gentle reminder time, AU crisis resources, full local purge.
- **Legacy — "Pass this on"** (`R6`) — recipients + the copy-not-mutate pivot: pick child(ren)
  → share now / bequeath (date · age · when-gone) → framing note → review & confirm → seal.
  Revocable until delivered; "For Them" lists shared/bequeathed entries with state badges.
- **Focus — Breath & Hum** (`R17`) — "Take 10": three protocols (Coherence 5·0·5 default,
  3·6·9, Box 4·4·4·4) with a breathing orb pacer, optional exhale humming, Web-Audio tone
  (432 / 528 / 7.83 Hz, no shipped audio), the "learn the harm" wellness card, retention
  cautions, and an additive practice heatmap. Honours `prefers-reduced-motion`.
- Warm-archival design (`R14`), WCAG-minded, `prefers-reduced-motion` respected, offline SW.

## Not yet built (next phases, per `design.md §6`)

- **Clarity practices** (`R4.1` — decompression, brain-dump, reframe), **Health light** (`R5`),
  **vault passcode / encrypted export** (`R10`), **license + gifting** (`R15`).
- Self-hosted Fraunces/Newsreader/Caveat woff2 (currently a system-serif fallback stack),
  and PWA icons under `icons/`.

## Files

`index.html` shell · `app.js` controller/views · `db.js` IndexedDB · `store.js` prefs ·
`code.js` the Code + check-ins · `diary.js` journal · `export.js` backups · `ui.js` helpers ·
`app.css` warm-archival styles + print book · `sw.js` service worker · `manifest.webmanifest`.
