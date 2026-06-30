# Dad's Code — Build Tasks

> Stable IDs `T1…`. `satisfies:` lists requirement IDs. `files:` globs are authoritative for `/spec-run` parallel-safety. `depends:` lists hard prerequisites. App root: `apps/dads-code/`.

---

## Phase 1 — Shell & Storage

### T1: App shell, manifest, service worker
- [ ] `apps/dads-code/index.html` — single-page shell, hash routing target, ARIA landmarks, `<html lang>` seam
- [ ] `manifest.webmanifest` — standalone, theme/bg colors, maskable icons; `icons/`
- [ ] `sw.js` — cache-first versioned shell (`dadscode-v1`), purge old caches on activate, user content never cached
- [ ] Custom add-to-home-screen via `beforeinstallprompt` + iOS instructions fallback

`satisfies:` R7.1, R13.2
`files:` apps/dads-code/index.html, apps/dads-code/manifest.webmanifest, apps/dads-code/sw.js, apps/dads-code/icons/**

**DoD:** Installs as a PWA; loads fully offline after first visit; passes Lighthouse PWA installable check.

### T2: IndexedDB layer & schema
- [ ] `db.js` — promisified IndexedDB wrapper; stores per design §2 (`entries`, `code`, `checkins`, `categories`, `recipients`, `milestones`, `mediaAssets`, `mediaBlobs`, `meta`)
- [ ] `multiEntry` indexes; orphan-sweep helpers on delete; `onupgradeneeded` ordered idempotent migrations; `schemaVersion` stamping
- [ ] `store.js` — localStorage for settings only (theme, ownerName, onboarding-done, last-viewed, reminder time, region)
- [ ] `navigator.storage.persist()` on first write; expose `estimate()` for the quota meter

`satisfies:` R8.1, R8.2, R8.3, R8.4, R8.5, R9.1
`files:` apps/dads-code/db.js, apps/dads-code/store.js

**DoD:** CRUD round-trips for all stores; native Blobs persist & re-read; a v1→v2 migration stub runs without data loss; `persist()` result surfaced.

### T3: Brand tokens, base UI, i18n seam
- [ ] `app.css` — CSS custom properties for the R14.3 palette; self-hosted Fraunces/Newsreader/Caveat (`fonts/`); 18px+ serif body, 1.5 line-height; focus rings; `prefers-reduced-motion`
- [ ] `ui.js` — DOM render helpers (no virtual DOM); the "settle-in" reveal; oxblood audio-waveform component
- [ ] `i18n.js` — `t()` lookup, English strings, `<html lang>`/`dir` setter (repo convention)

`satisfies:` R12.1, R12.3, R13.4, R14.1, R14.3, R14.4, R14.5
`files:` apps/dads-code/app.css, apps/dads-code/ui.js, apps/dads-code/i18n.js, apps/dads-code/fonts/**

**DoD:** Tokens render warm-archival, not AI-generic; reduced-motion honoured; all visible strings go through `t()`; contrast ≥4.5:1.

---

## Phase 2 — The Loop (the wedge) · depends: T2, T3

### T4: The Code editor (values → principles → practices)
- [ ] `code.js` — three linked layers; add/edit/reorder; every practice traces up to a value
- [ ] Single "sharpening question" when a vague value is entered; optional domain prompt chips (R1.4)
- [ ] **Zero** seeded content; structure & questions only

`satisfies:` R1.1, R1.2, R1.3, R1.4, R1.5
`depends:` T2, T3
`files:` apps/dads-code/code.js

**DoD:** A dad can author a Value→Principle→Practice chain in <2 min; no pre-written content anywhere; no status/streak/badge mechanics present.

### T5: Daily check-in + home + weekly mirror
- [ ] Home screen: today's check-in cards (kept/slipped/didn't-apply, one tap each) + add button + backup-status line
- [ ] One folded grounding question (inner-weather tap, from T8)
- [ ] Weekly "mirror" = additive narrative patterns; **no** red, streaks, or failure state; missed days fade
- [ ] Consistency shown additively ("checked in 18 of last 30 days")

`satisfies:` R2.1, R2.2, R2.3, R2.4
`depends:` T4
`files:` apps/dads-code/app.js

**DoD:** Full check-in completes in ≤60s; a missed day produces no guilt UI; weekly view reads as a mirror, not a scoreboard.

---

## Phase 3 — Capture · depends: T2, T3

### T6: Audio capture, playback, transcripts
- [ ] `audio.js` — `getUserMedia`→`MediaRecorder`, opus/webm with mp4 fallback (feature-detected), chunked recording, stop tracks on finish
- [ ] Store native Blob + MIME in `mediaBlobs`; playback via object URL (revoked after); live record timer
- [ ] Audio re-encode target ~1MB/min; photo downscale ~2048px/WebP on import
- [ ] Transcript hook: generate on-device or queue at capture; editable; stored on `mediaAssets.transcript`

`satisfies:` R3.3, R9.5, R13.3
`depends:` T2
`files:` apps/dads-code/audio.js

**DoD:** Records & plays on Chromium + iOS Safari; mid-record crash loses nothing; every audio entry has an editable transcript.

### T7: Journaling + onboarding prompt cards
- [ ] `diary.js` — Quick Log (default, one-line min, "30s is enough"), Guided Reflection (rotating prompts), Voice Journal; never force a mode
- [ ] Lock icon visible the entire compose session (privacy is the visible default); auto-save every keystroke/second
- [ ] Onboarding: stack of warm "first three" prompt cards, voice button primary, no account/wizard
- [ ] In-app-only "Look back" resurfacing; skip `isSensitive` and bequeathed/To-My-Kids entries; off by default in notifications
- [ ] Single daily nudge at user-chosen time

`satisfies:` R3.1, R3.2, R3.4, R3.5, R7.1, R7.2, R7.3, R7.4
`depends:` T6
`files:` apps/dads-code/diary.js

**DoD:** New dad reaches 3 saved entries in first session; one-line save is a complete entry; no completion bar; resurfacing never pushes a notification.

---

## Phase 4 — Inner Work · depends: T2, T3

### T8: Clarity & mental-health practices
- [ ] `clarity.js` — inner-weather mood (sky/cloud/storm + one-word tag; **no numeric/clinical scales**)
- [ ] Practices: 2-Minute Decompression, "what's weighing on me" brain-dump, weekly Values Check-In, Reframe a Hard Moment, Gratitude-without-cringe, One-Breath Reset
- [ ] Gentle retrospective narrative of state history (no sharp/comparative graphs, no failure state)
- [ ] Clarity→Code soft pivot prompt ("worth passing on one day?") that hands off to T11; never auto-promote

`satisfies:` R4.1, R4.2, R4.3, R4.4
`depends:` T2, T3
`files:` apps/dads-code/clarity.js

**DoD:** Mood capture is single-tap & non-numeric; history reads as narrative; the pivot creates a kid-facing draft without altering the private note.

### T9: Safety — crisis, disclaimers, on-device detection
- [ ] `safety.js` — static region-keyed crisis page in the shell (AU default: Lifeline 13 11 14, Beyond Blue 1300 22 4636, MensLine 1300 78 99 78, 000), reachable ≤2 taps, works offline
- [ ] Standing non-medical disclaimer (plain language, findable)
- [ ] On-device-only heaviness check → **one** calm, dismissible support card; no scoring, no nagging, no red
- [ ] Validate-before-reframe copy throughout; no toxic positivity / countdown / memento-mori

`satisfies:` R16.1, R16.2, R16.3, R16.4
`depends:` T3
`files:` apps/dads-code/safety.js

**DoD:** Crisis resources load with network disabled; detection fires at most one card and never transmits; copy passes a tone review.

### T17: Focus — breath, hum & tone (the daily 10-min reset)
- [ ] `focus.js` — "Take 10" session runner (3/5/10 min): settle → guided protocol → stillness → calm close
- [ ] Three protocols from `content/protocols/tesla-*.md`: Coherence 5-0-5 (default), 3-6-9, Box 4-4-4-4 (with toroidal visualization option)
- [ ] Breath pacer: reuse `apps/hum/index.html` `.pacer-ring` scale animation + phase labels (Inhale/Hold/Exhale·hum); session-progress ring from `apps/focus/index.html`; `prefers-reduced-motion` static-count fallback
- [ ] Web Audio tone engine: reuse HUM `startTone()` + RESONATE 3-osc drone; presets 432/528/7.83 Hz; gain ramp; master mute; **no audio files** (R13)
- [ ] Humming guidance on exhale (Bhramari, plainly framed, optional)
- [ ] "Learn the harm" card: chronic-stress science from `docs/refs/humming-research-origins.md` (NO 15×/Karolinska 2002; lowest stress index/Trivedi 2023; cortisol/vagal/autonomic) — **wellness language only**, no disease claims
- [ ] Additive practice heatmap (reuse `apps/pulse/index.html` grid) — no breakable streak
- [ ] Carry protocol disclaimer ("a practice, not a treatment") + 3-6-9 retention caution (cardiovascular/respiratory/pregnancy → suggest 2-4-6 or 5-0-5) + "not while driving/exertion"; link to T9 crisis resources
- [ ] Completion → optional R4.4-style legacy pivot ("leave your kids the habit that steadies you?")

`satisfies:` R17.1, R17.2, R17.3, R17.4, R17.5, R17.6, R17.7, R17.8, R17.9
`depends:` T2, T3, T9
`files:` apps/dads-code/focus.js, apps/dads-code/app.css

**DoD:** A 10-min coherence session runs with a smooth pacer and an on-device tone (no files); reduced-motion path works; protocols match the archived patterns; "learn the harm" carries citations in wellness language; disclaimer + retention caution present; heatmap has no breakable streak.

---

## Phase 5 — Health (light) · depends: T2, T3

### T10: Gentle health module
- [ ] `health.js` — track at most 5 signals (sleep, movement toggle, energy 1–5, alcohol count, screening reminders); **never** calories/macros/weight/body-fat
- [ ] Age-based screening nudges (BP, lipids, glucose/HbA1c; testicular <40; bowel/prostate ~45–50)
- [ ] Additive consistency only ("moved 18 of last 30 days"); no breakable streaks, guilt, comparison, leaderboards
- [ ] "Be around and able" framing in all copy; no aesthetics/body-composition language; non-clinical sleep↔mood reflection (data may stub in v1)
- [ ] Opt-in legacy hook: "health lessons I want you to learn from my mistakes" → T11

`satisfies:` R5.1, R5.2, R5.3, R5.4
`depends:` T2, T3
`files:` apps/dads-code/health.js

**DoD:** Only the 5 permitted signals exist; no streak can "break"; framing references presence/capability, never abs.

---

## Phase 6 — Legacy · depends: T2, T7

### T11: Legacy state machine + "pass this on" pivot
- [ ] `legacy.js` — entry states Private(default)/Shared/Bequeathed with persistent badges (lock/paper-plane/hourglass)
- [ ] `passOn()` pivot: explicit action → pick named recipient(s) → Share now / Bequeath(date|when-gone) → optional framing note → confirm restating recipient+timing → seal. **Copies**, never mutates the private original; revocable until delivered
- [ ] Recipients CRUD (name, relationship, birthDate); milestone triggers resolved at read time
- [ ] Recipient/steward-pull release (no automated date-trigger); "legacy keeper" trusted-contact designation + explanation
- [ ] "For Them" view: shared/bequeathed entries grouped by recipient; periodic "review what you've set to pass on"

`satisfies:` R6.1, R6.2, R6.3, R6.4, R6.5, R6.6, R11.3, R11.4
`depends:` T2, T7
`files:` apps/dads-code/legacy.js

**DoD:** No code path moves an entry out of Private except the confirmed pivot; private originals are never altered; bequeathed entries are sealed from search/resurfacing; nothing auto-delivers.

---

## Phase 7 — Durability & Security · depends: T2, T6, T11

### T12: Export, self-contained backup, keepsake book
- [ ] `export.js` — single self-contained `dads-code-backup.html` (text + base64 media + inline read-only viewer; opens with no network/server/app)
- [ ] `.dadscode` JSON export (open format, `schemaVersion` + sha256 checksum) + import (upsert-by-id, keep-newer)
- [ ] `@media print` keepsake-book stylesheet (paginated, photos embedded, audio as captioned links/QR)
- [ ] Backup nudges: `lastBackupAt` age on home, persistent banner until first export, prompt every N entries; quota meter via `estimate()`, warn ~70%

`satisfies:` R9.2, R9.3, R9.4, R13.1, R13.2
`depends:` T2, T6, T11
`files:` apps/dads-code/export.js, apps/dads-code/app.css

**DoD:** The backup HTML renders the full vault offline by double-click; JSON round-trips via import; print view produces a clean book PDF; banner clears only after a real export.

### T13: Optional encryption & shared-device hygiene
- [ ] `crypto.js` — optional vault passcode → WebCrypto AES-GCM, PBKDF2(≥210k)/Argon2id key in memory only; salt+IV+ciphertext at rest; default OFF, prominently offered first-run
- [ ] Encrypted export mode + bundled standalone HTML decrypter; passphrase hint + unrecoverable-loss confirmation
- [ ] Auto-lock on idle/blur; blur previews/hide text when locked; "Lock now" button; per-recipient envelopes
- [ ] No mandatory accounts, rotation, complexity rules, or "military-grade" badges

`satisfies:` R10.1, R10.2, R10.3, R10.4, R10.5, R11.1, R11.2
`depends:` T12
`files:` apps/dads-code/crypto.js

**DoD:** With passcode on, content at rest is ciphertext; encrypted export opens via the bundled decrypter; forgetting the passphrase is warned about up front; locking blurs previews.

---

## Phase 8 — Monetization & Polish · depends: T7, T11, T12

### T14: Licensing & gifting
- [ ] `license.js` — local, offline-verifiable lifetime entitlement; degrades gracefully to free; never locks existing content
- [ ] Free-forever line enforced: all data entry, journaling/check-in, **full unencrypted export always free** (R15.2); paid = legacy *experiences* only
- [ ] Gift redemption: redeemable-code flow + dedication/personalization screen ("from [name]"), decoupled from buyer's install

`satisfies:` R15.1, R15.2, R15.3, R15.4, R15.5
`depends:` T12
`files:` apps/dads-code/license.js

**DoD:** Disabling/expiring a license never blocks export or existing entries; gift code unlocks on a fresh install with a dedication; no content is ever paywalled.

### T15: Accessibility & brand QA pass
- [ ] WCAG 2.2 AA audit: contrast, 200% text scaling without reflow break, full keyboard + focus, 44px targets, screen-reader landmarks/headings, captions/transcripts present
- [ ] Brand audit against R14.6 anti-patterns (no gamification, RIP iconography, stock-family photos, emoji, cheery error states, forced memorial mode)
- [ ] Voice-first verification; auto-save robustness; reduced-motion path

`satisfies:` R12.1, R12.2, R12.3, R12.4, R14.2, R14.6
`depends:` T5, T7, T8, T10, T11
`files:` apps/dads-code/**

**DoD:** Axe/Lighthouse a11y ≥95; manual screen-reader pass of capture + revisit; no anti-pattern present.

### T16: End-to-end verification & docs
- [ ] Full flow test: onboard → author Code → daily check-in → journal (text+voice) → clarity → Focus (10-min breath/hum) → health → mark-for-them → export → reopen backup offline
- [ ] Durability test: clear site data → restore from backup HTML/JSON with zero loss
- [ ] `apps/dads-code/README.md` (run/preview, data model, export format, "your words are never locked" promise); register app in root `CLAUDE.md` apps table

`satisfies:` R9.2, R13.1, R15.2 (verification)
`depends:` T1-T15
`files:` apps/dads-code/README.md, CLAUDE.md

**DoD:** A vault survives a full storage wipe via backup; README documents the open export format; the "never held hostage" guarantee is demonstrable.

---

## Dependency summary (for `/spec-run` waves)

```
Wave 1: T1, T2, T3                 (shell, storage, brand — parallel)
Wave 2: T4                         (the Code)         → then T5 (loop)
Wave 3: T6 → T7                    (audio → journaling)   ‖  T8, T9, T10 (inner work, safety, health)
        T9 → T17                   (Focus breath/hum/tone — needs safety/crisis from T9)
Wave 4: T11                        (legacy; needs T7)
Wave 5: T12 → T13                  (export → crypto)
Wave 6: T14                        (license)          ‖  T15 (a11y/brand QA)
Wave 7: T16                        (e2e verification + docs)
```
