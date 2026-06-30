# Dad's Code — Design

> How it gets built. References requirement IDs from `requirements.md`. Architecture follows ADR-0001-style repo convention: a lightweight, dependency-free vanilla PWA in the mould of `livestock/` (HerdCheck) and `apps/roomtone/`, not a framework app.

## 1. Architectural stance

**Vanilla JS ES modules. No framework, no build step.** (Satisfies R8, R13.) A father's vault must outlive React 19, npm rot, and toolchains. A single `index.html` loading hand-written ES modules runs in any browser indefinitely and matches the repo's HerdCheck/Roomtone convention exactly. Vendor nothing; inline tiny helpers rather than add dependencies. Fraunces/Newsreader/Caveat are loaded as **self-hosted woff2** (no CDN — longevity, offline, R13).

### File structure

```
apps/dads-code/
├── index.html              # app shell, single page, hash routing
├── app.js                  # controller: routing, view orchestration, glue
├── db.js                   # IndexedDB wrapper (entries, media, the stores of R8)
├── store.js                # localStorage for small settings/prefs only
├── code.js                 # the Code: values→principles→practices model + check-in loop
├── diary.js                # journaling modes, prompts, resurfacing
├── clarity.js              # mood "weather", clarity practices, on-device heaviness check
├── focus.js                # breath pacer + humming + Web Audio tone engine (R17)
├── health.js               # ≤5 gentle signals, screening reminders, consistency calc
├── legacy.js               # Private/Shared/Bequeathed state machine, "mark for them" pivot
├── audio.js                # MediaRecorder capture + playback + transcript hook
├── crypto.js               # optional AES-GCM vault passcode + encrypted export (R10)
├── export.js               # self-contained HTML backup, JSON export/import, print book
├── license.js              # local offline-verifiable entitlement + gift redemption (R15)
├── safety.js               # crisis resources, disclaimers, escalation cards (R16)
├── ui.js                   # DOM render helpers (no virtual DOM)
├── i18n.js                 # t() string lookup, repo convention (R13.4)
├── app.css                 # styles + @media print keepsake stylesheet
├── sw.js                   # service worker, cache-first app shell
├── manifest.webmanifest    # installability
├── fonts/                  # self-hosted Fraunces / Newsreader / Caveat woff2
└── icons/                  # PWA + apple-touch + maskable icons
```

No bundler; modules via `<script type="module">`. User content lives only in IndexedDB and is **never** in the SW cache.

## 2. The data model (R8)

IndexedDB database `dadscode`, versioned. Object stores:

```
entries        keyPath: id (uuid)
  id, kind: 'code'|'diary'|'clarity'|'health'|'legacy', type, title, body,
  lang, categoryIds[], recipientIds[], mediaAssetIds[], milestoneId|null,
  state: 'private'|'shared'|'bequeathed',   // legacy state machine (R6.3)
  mood|null, isDraft, isFavorite, isSensitive,
  createdAt, updatedAt, authoredAt, schemaVersion
  indexes: by_kind, by_state, by_category(multiEntry), by_recipient(multiEntry),
           by_milestone, by_updatedAt

code           // the three-layer stack (R1) — values/principles/practices as linked rows
  id, layer:'value'|'principle'|'practice', text, parentId|null, domainTag|null,
  isActive, sortOrder, createdAt, updatedAt
checkins       id, practiceId, date, status:'kept'|'slipped'|'na', note?, createdAt
categories     id, name, slug, icon, colorToken, sortOrder, isSystem, …
recipients     id, name, relationship, birthDate|null, avatarAssetId|null, …
milestones     id, label, trigger:{kind:'date'|'age'|'event', …}, releasedAt|null, …
mediaAssets    id, kind:'audio'|'image', mimeType, byteSize, durationMs|null,
               width|null, height|null, blobKey, transcript|null, posterBlobKey|null, createdAt
mediaBlobs     blobKey, blob (native Blob — separated so metadata queries never load binary)
meta           key:'vault' → { schemaVersion, appVersion, ownerName, createdAt,
                                lastBackupAt, region, persisted:bool, license }
```

Design notes: FK arrays + `multiEntry` indexes for M2M (R8.3); orphan-sweep on delete in app code; `milestones.trigger` resolved at **read time** against `recipients.birthDate` (R8.4); `onupgradeneeded` runs ordered idempotent migrations, never dropping fields (R8.5). **The two-store privacy law (R6.1)** is enforced by `entries.state` + a hard rule in `legacy.js`: there is no code path that flips an entry to `shared`/`bequeathed` except the explicit, confirmed `passOn()` pivot, which **copies** rather than mutates.

## 3. Key flows

### 3a. Onboarding (R7)
Open → one screen, one giant primary button. No account, no wizard, no permissions wall beyond the mic prompt on first record. Present a stack of warm prompt cards (the "first three"); voice button is primary. Auto-save on every keystroke/second. Confirmation reads back in plain words ("Saved. Your family can read this." / "Saved — just for you."). Name mortality once, honestly, then never foreground it.

### 3b. The daily loop (R2 — the wedge)
Home surfaces today's check-in: each active practice as a card with one-tap kept/slipped/didn't-apply, plus one grounding question (the inner-weather tap, R4.2). 60 seconds, then done. A missed day fades; nothing turns red. Weekly, the "mirror" view renders additive patterns ("kept presence 4/7; slips after 7pm") — narrative, never a scoreboard.

### 3c. The Code editor (R1)
Three linked columns/cards: Values → Principles → Practices. Adding a vague value triggers the single sharpening question. Domains (R1.4) appear as optional prompt chips, never required categories. Ships with **zero** seeded content (R1.2).

### 3d. Journaling (R3) & the pivot (R4.4 / R6.2)
Compose defaults to Quick Log with a lock icon visible the entire time he writes — privacy is the visible default. Voice mode records audio + queues transcript (R3.3, R13.3). On any private entry, **"Pass this on"** → pick named recipient(s) → choose *Share now* / *Bequeath (on date / when I'm gone)* → optional framing note → confirm screen restating recipient + timing → seal. The action **copies**; the private original is untouched and revocable-until-delivered (R6.3). Resurfacing is in-app only and skips sensitive/bequeathed entries (R3.5).

### 3e. Durability (R9)
First write → `navigator.storage.persist()`. Home shows "last backed up N days ago" and a persistent banner until the first full export. Export produces the self-contained `dads-code-backup.html` (data in an inline `<script type="application/json">` + embedded read-only viewer) and/or `.dadscode` JSON with checksum. Print view renders the keepsake book.

### 3f. Optional security (R10)
First-run offer: "Add a passcode to protect this vault?" (default off). If on: `crypto.js` derives an AES-GCM key (PBKDF2/Argon2id) held in memory; content blobs encrypted before IndexedDB write; auto-lock on idle/blur; "Lock now" button; encrypted export bundles a standalone HTML decrypter. Passphrase hint + unrecoverable-loss confirmation are mandatory (R10.3).

## 4. Screen map

```
Home (today's check-in + add button + backup status)
├── The Code        (values → principles → practices editor)
├── Today           (daily check-in loop + inner-weather)
├── Journal         (compose · list · "Look back" resurfacing)
├── Clarity         (decompression, brain-dump, reframe, one-breath, crisis link)
├── Focus           (Take 10: breath pacer + hum + tone · protocol picker · "learn the harm" · heatmap)  [R17]
├── Health          (5 gentle signals + screening reminders)            [v1 light]
├── For Them        (Legacy channel: shared/bequeathed entries + recipients) 
├── Backup & Export (self-contained HTML, JSON, print book, encryption)
└── Settings        (passcode, region/crisis, reminder time, i18n, purge, license)
```

The five domains are surfaced under **one spine** (R-spine): the home loop and the Code are the centre; Journal/Clarity/Health feed it; "For Them" is the deliberate output. Not five co-equal tabs.

## 5. Cross-cutting design decisions

- **Audio** (R9.5): `getUserMedia` → `MediaRecorder`, `audio/webm;codecs=opus` with `audio/mp4` fallback (feature-detected for iOS Safari); chunked `ondataavailable` so a crash mid-record loses nothing; stop tracks on finish; store native Blob + MIME; playback via object URL, revoked after use.
- **Service worker** (R13): cache-first, versioned cache name (`dadscode-v1`), purge old caches on `activate`; user content never cached. Custom add-to-home-screen via `beforeinstallprompt` with iOS instructions fallback.
- **Accessibility** (R12): semantic HTML first, ARIA only to fill gaps; visible focus rings in oxblood; `prefers-reduced-motion` disables the settle-in animation; everything keyboard-reachable; min 44px targets; 18px+ serif body.
- **Brand** (R14): tokens as CSS custom properties (`--paper`, `--ink`, `--oxblood`, `--brass`, `--slate`, `--sage`); Fraunces headings, Newsreader body, Caveat only for sign-off; the "settle-in" reveal and oxblood waveform are the signature moments; print stylesheet doubles as the keepsake book.
- **Safety** (R16): `safety.js` ships a static, region-keyed crisis page in the shell; on-device-only heaviness check surfaces a single dismissible calm card; standing non-medical disclaimer.

## 5b. Focus module reuse map (R17) — assemble, don't reinvent

The breath/hum module is built almost entirely by lifting and adapting existing, working repo code into `focus.js` + a Focus view. **Copy the mechanism, restyle to the warm-archival brand (R14)** — drop the neon/mystic styling of the originals.

| Need | Reuse from | What to lift |
|---|---|---|
| Breath protocols (patterns, cycles, scripts, citations, disclaimers) | `content/protocols/tesla-369-breath.md`, `tesla-toroidal-breath.md`, `tesla-schumann-lock.md` | the `breath_pattern` frontmatter (in/hold/out/cycles), guidance scripts, source lists, "practice not treatment" disclaimers |
| Visual breath pacer | `apps/hum/index.html` | `.pacer-ring` CSS scale animation (inhale 1.3× / exhale 0.78×), `startPacer()`/`stopPacer()` interval logic, inhale/exhale/hold phase labels |
| Web Audio tone engine | `apps/hum/index.html` (single sine) + `apps/resonate/index.html` (3-osc drone, detune-by-coherence) | `startTone(freq)`/`stopTone()` oscillator factory with 1s gain ramp; 432/528/7.83 Hz presets; optional drone |
| Session ring + completion burst + ambient noise | `apps/focus/index.html` | stroke-dashoffset progress ring, particle-burst celebration, brown/white/rain noise + binaural-beat factories (optional bg) |
| Practice consistency heatmap | `apps/pulse/index.html` | 12-week grid render, opacity-by-completion, additive streak walkback (no breakable streak) |
| Copy & "learn the harm" science | `docs/refs/humming-research-origins.md`, `humming-research-newtech.md`, `frequency-30s-science-voiceover.md`; `sites/codex-of-reality/launch/people-2-breathing.html` | NO-15× / lowest-stress-index lines, cortisol/vagal/autonomic harm framing, wellness-not-medical guardrail, "5 in · 5 out · 6 breaths/min" copy |

Session shape (R17.1): settle (~30s) → guided protocol (5-0-5 default; 3-6-9 / box optional) with optional exhale hum + optional tone → short stillness → calm close → additive log to the heatmap. All Web-Audio-generated; **no shipped audio files** (R13 longevity). `prefers-reduced-motion` → static count fallback (R12.3). Carries the protocol disclaimers + retention caution (R17.9).

## 6. Build phases (maps to tasks.md)

1. **Shell & storage** — index.html, db.js, store.js, sw.js, manifest, brand tokens, i18n seam.
2. **The loop** — code.js (the Code) + daily check-in + home. *This is the wedge; ship it first and well.*
3. **Capture** — diary.js + audio.js + transcripts + onboarding prompt cards.
4. **Inner work** — clarity.js (weather mood, practices) + focus.js (breath/hum/tone, R17) + safety.js (crisis, disclaimer).
5. **Health light** — health.js (5 signals, screening, additive consistency).
6. **Legacy** — legacy.js state machine + "pass this on" pivot + recipients + "For Them".
7. **Durability & security** — export.js (self-contained HTML, JSON, print book) + crypto.js.
8. **Monetization & polish** — license.js + gift redemption + a11y/brand pass + verification.

## 7. Deferred to v2 (named, not silently dropped)

Milestone/To-My-Kids journaling modes; standalone clarity-practice library; full sleep↔mood correlation and health trend dashboards; curated legacy vault, per-child threads, and the sealed handoff "ceremony"; physical keepsake-book fulfilment (print-on-demand via Lulu/Blurb); multi-device sync key; actual translations. The product-strategy advisor would additionally defer the whole Health module and Legacy vault to protect v1 focus — see the flagged tension in `requirements.md`.
