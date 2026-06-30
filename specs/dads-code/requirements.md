# Dad's Code — Requirements

**Mission:** Help a modern father do the daily work of staying grounded, honest, and well — and let that work quietly compound into the wisdom, voice, and example he leaves his kids.

**The spine:** *Your code — live it, then leave it.* There is one core object — **the Code** — a living set of beliefs and principles a dad authors and refines. Everything attaches to it: a diary entry is *evidence* of living (or failing) a principle; a clarity or health check-in is *maintenance* on the man who holds the code; a marked moment is a principle *made inheritable*. Five domains collapse into one loop:

> **state your code → live it daily → reflect → refine → pass it on.**

**Non-negotiable design law:** Legacy is an **output** of the living tool, never a parallel app and never automatic. Nothing a dad writes leaves his private space without a deliberate, named, confirmable act. The honesty of private work is exactly what makes it worth inheriting — the moment a dad writes *for* an audience, it gets worse. So the product keeps two physically separate stores: a **Private workbench** (his) and a **Legacy channel** (theirs), with only a one-way, dad-authored pivot between them.

---

## Target Market

- **Primary:** Fathers aged ~30–45 with young kids, stretched thin, quietly worried they're drifting from the man they mean to be. They adopt **for themselves** — legacy is too abstract to drive install; it's the deepening hook discovered in use.
- **Secondary (recipients):** His children, across a huge age range (a 12-year-old and a 35-year-old have different needs), who revisit his words — possibly for decades, possibly after he's gone.
- **Tertiary (steward):** A spouse or eldest child who administers access and handoff. This is the failure point of most legacy products and must be designed for, not assumed.
- **Buying occasions:** (a) a dad buys it for himself (self-improvement wedge); (b) it's **gifted** to a dad — Father's Day, new-dad, milestone birthdays.
- **Market:** Australia-first (crisis resources, spelling), built to internationalize.

## Core Problem

Modern fathers are **isolated, under-modelled, and running on empty.** Many men's last real friendship predates kids; their only template for fatherhood is their own father, often flawed; stress surfaces sideways as a short fuse rather than a named feeling; "I'm fine" culture means the honest answer never gets said out loud. Meanwhile, the wisdom, voice, and values a dad would want to pass on are never captured — and when they are, generic notes apps make it feel like data entry, or legacy apps make it feel like writing your own eulogy. No tool helps a dad **tend himself today** in a way that **naturally becomes the inheritance** tomorrow.

## Product Pillars (and v1 scope)

The app spans five domains unified by the Code. v1 ships **one loop done well**; later domains are depth, not the door.

| Pillar | v1 | v2+ |
|---|---|---|
| **The Code** — beliefs → principles → practices | ✅ author + edit + link | richer prompts, father's-pattern map |
| **Daily Check-in** — the wedge loop | ✅ kept/slipped/n-a + grounding question | trend insights |
| **Diary** — journaling, voice-first | ✅ quick log + voice + prompts | search, tags, milestone/letter modes |
| **Clarity & Mental Health** | ✅ weather mood + decompression + crisis resources | standalone practice library |
| **Focus — Breath & Hum** | ✅ daily ~10-min breath-pacer + humming + tone, stress-harm education | wearable HRV, mic pitch-detection, more protocols |
| **Health & Well-being** | ✅ *light* — ≤5 gentle signals + screening nudges | sleep↔mood correlation, deeper trends |
| **Legacy** — pass it on | ⚠️ "★ mark for them" + Private/Shared/Bequeathed states + export | curated vault, per-child threads, sealed handoff ceremony |

> Note: The product-strategy advisor recommended deferring the standalone Health module and the curated Legacy vault entirely to v2 to protect focus. The user explicitly named health, well-being, mental health, and clarity as in-scope, so v1 includes a **deliberately light** health module and the **state machine + export** for legacy, while deferring the heavier vault/ceremony to v2. This tension is flagged for `/spec-analyze`.

---

## R1: The Code — Foundation & Beliefs

The heart of the app. A dad authors his own operating code as a three-layer stack the app models literally as data.

- **R1.1 — The stack.** Support three linked entity types: **Values** (what he believes — durable, abstract, few; ~5–8 max), **Principles** (a value made directional and personal, phrased as a breakable commitment), **Practices** (the repeatable behaviour that proves a principle today). Every Practice must trace up to a Principle and every Principle to a Value.
- **R1.2 — His words only.** The app ships **zero pre-written values, principles, or affirmations.** It provides *structure and questions*, never content. It is a mirror, not a guru.
- **R1.3 — Sharpening.** When a dad enters a vague value ("I want to be present"), the app asks one sharpening question ("Present when — and what does it look like when you fail?") to push him from poster to testable principle to concrete practice.
- **R1.4 — The domains.** Offer (never impose) a warm set of foundational domains a modern dad may take a stance on: presence vs. provision; strength without the poison; money & enough; work vs. family; screens & attention (his own first); saying the true thing; meaning & the bigger thing; his father's pattern (repeat or break); discipline vs. warmth; mortality. Domains are prompts to fill, not categories to complete.
- **R1.5 — No status mechanics.** No leaderboards, no streaks-as-status, no badges, no comparison to other men, no "level up your manhood." The single private metric is **alignment** — did what he did match what he said he'd do — measured against himself only.

## R2: The Daily Check-in — the loop (the wedge)

- **R2.1** A 60-second evening check-in is the primary daily action and the install wedge. For each active practice: one tap — **kept / slipped / didn't apply.** Then closed.
- **R2.2** Include one grounding/clarity question folded into the check-in (see R4) so the loop also tends his head, not just his behaviour.
- **R2.3 — Weekly mirror.** Surface a quiet retrospective pattern read ("you kept presence 4/7; the two slips both clustered after 7pm"). Never a streak-shame, never red, never a failure state. He revises the practice, not his worth.
- **R2.4** A missed check-in never breaks anything, shows no red, and triggers no guilt notification. Consistency is shown additively ("checked in 18 of the last 30 days"), never as a breakable streak.

## R3: Diary & Journaling

- **R3.1 — Modes.** Support: **Quick Daily Log** (default, one-line minimum, <30s), **Guided Reflection** (rotating prompt), **Voice Journal** (talk it out), and — v2 — **Milestone/Letter** and **To-My-Kids** modes. New entries default to Quick Log; never force a mode.
- **R3.2 — One-line minimum.** Saving a single sentence is a complete, successful entry. The compose box reads "30 seconds is enough."
- **R3.3 — Voice-first.** The voice/record button is visually primary, larger than the keyboard option. Voice entries retain **both** the transcript **and** the original audio — the dad's actual voice is itself a legacy artifact.
- **R3.4 — One gentle nudge.** At most one reminder per day, at a user-chosen time (default: evening wind-down). Never a second nag.
- **R3.5 — Resurfacing.** "On this day" surfaces a past entry **only inside the app**, never as a push notification, and is off by default in notifications. Entries or dates flagged **sensitive** are excluded from auto-resurfacing. Never resurface To-My-Kids or bequeathed entries as memories.

## R4: Clarity & Mental Health

- **R4.1 — Practices.** Provide lightweight, evidence-informed clarity practices: a **2-Minute Decompression** (end-of-day), a **"What's actually weighing on me"** raw brain-dump, a weekly **Values Check-In**, a **Reframe a Hard Moment** flow (what happened → what I felt → what was underneath → next time), **Gratitude without the cringe** ("one thing that didn't suck today"), and a **One-Breath Reset** for in-the-moment regulation.
- **R4.2 — Mood capture.** A single-tap daily "inner weather" check (sky/cloud/storm + optional one-word tag: tired/wired/flat/steady/good). **No numeric or clinical scales anywhere in the app** (no 1–10, no PHQ-style questionnaires).
- **R4.3 — Gentle reflection.** Show state history back as soft retrospective narrative ("the last couple weeks have felt heavier"), never a sharp/comparative graph, never with a failure or broken-streak state. The value is self-recognition, never measurement.
- **R4.4 — Clarity → Code pivot.** A moment of clarity lands first as a **private** note. After processing, an optional soft prompt — *"Is there something in this worth passing on one day?"* — lets him author a **distilled, kid-facing** lesson that moves to the Legacy channel. The raw note stays private forever. The app never auto-promotes private material.

## R17: Focus — Breath & Hum (the daily 10-minute reset)

A first-class daily practice: **~10 stress-free minutes** of guided breathing and humming to discharge the load that today's always-on society piles on a dad's nervous system. This is the most actionable answer to "what would help a dad in this day and age" — a concrete, repeatable, sub-treatment ritual he can do anywhere. **Reuses existing repo work** (see `design.md §Focus reuse map`): the Tesla breath protocols in `content/protocols/`, the HUM/RESONATE/FOCUS app engines, and the humming research in `docs/refs/`.

- **R17.1 — The session.** A single primary "Take 10" action runs a paced session (default ~10 min, adjustable 3/5/10): a brief settle → a guided breath protocol with optional humming on the exhale → a short stillness → a calm close. One tap to start; nothing else required.
- **R17.2 — Breath protocols (from the archive).** Ship the three already-authored patterns, selectable, with the coherence breath as the default for stress:
  - **Coherence 5-0-5** — 5s in / 5s out, 6 breaths/min, the HRV "coherence frequency" (default; gentlest, no retention). *(Schumann Lock protocol.)*
  - **3-6-9 Breath** — in 3 / hold 6 / out 9 — the signature "Dad's Code" pattern; deeper vagal discharge via long exhale + retention. *(369 protocol.)*
  - **Box 4-4-4-4** — equal-ratio, with the toroidal visualization option. *(Toroidal protocol.)*
- **R17.3 — Visual pacer.** A breathing orb/ring expands on inhale, holds, contracts on exhale (reuse HUM's `.pacer-ring` scale animation), with phase labels ("Inhale" / "Hold" / "Exhale · hum") and a session-progress ring (reuse FOCUS's stroke-dashoffset ring). Honour `prefers-reduced-motion` with a non-animated count fallback.
- **R17.4 — Humming.** Teach the hum on the exhale (Bhramari-style): a low, easy hum through the nose/closed lips. Optional. Frame it plainly — not mystically.
- **R17.5 — Tone layer (Web Audio, no files).** Optional sine-tone drone generated on-device via Web Audio API (reuse HUM/RESONATE oscillator factory), selectable: 432 Hz, 528 Hz, 7.83 Hz (Schumann). Fades in/out; no shipped audio assets (longevity, R13); works offline; respects a master mute. Headphones suggested for the low/binaural tones.
- **R17.6 — "Learn the harm" (education, brief).** A short, optional, plainly-written card on what **chronic stress in today's society** does to the body — elevated cortisol, suppressed vagal tone, autonomic dysregulation — and how slow breathing + humming counter each in minutes. Source it from `docs/refs/humming-research-origins.md` (e.g. humming raises nasal nitric oxide ~15× — Weitzberg & Lundberg, Karolinska 2002; humming produced the lowest HRV stress index of any measured state, incl. sleep — Trivedi 2023). **Wellness language only** — no disease/treatment claims (keeps it outside TGA/FDA medical-device regulation per `docs/refs/humming-research-newtech.md`).
- **R17.7 — Streak done right.** Track the daily practice with **additive, forgiving** consistency (reuse PULSE heatmap: "10 of the last 14 days"). No breakable streaks, no red, no guilt (consistent with R2.4/R5.3).
- **R17.8 — Integration.** The Focus session is the active practice that R4 Clarity points to (e.g. offered after a "storm" mood day or a "Reframe a Hard Moment"). On completion, the same soft pivot as R4.4 may offer: "want to leave your kids the habit that steadies you?" → an opt-in legacy entry (R6).
- **R17.9 — Safety.** Carry the protocols' existing disclaimer verbatim in spirit: *"a practice, not a treatment."* The 3-6-9 retention pattern shows a caution for cardiovascular/respiratory conditions and pregnancy (suggest a gentler 2-4-6 or the no-hold 5-0-5), and a "don't do this while driving or during exertion" note. Routes to R16 crisis resources if needed.

## R5: Health & Well-being (v1 light)

- **R5.1 — The frame.** Frame all health around **capability and presence** — "being around and able for them," for decades — never aesthetics, body composition, PRs, or "summer shred." No before/after photos.
- **R5.2 — Track at most five gentle signals:** sleep (bed/wake or a 1–5 "how rested"), movement ("moved" / "strength today" toggle), energy (1–5 daily), alcohol (gentle count, awareness not shame), and **screening reminders** (age-based: BP, lipids, glucose/HbA1c; testicular awareness <40; bowel/prostate conversations ~45–50). **Do NOT track** calories, macros, daily weight, or body-fat %.
- **R5.3 — Humane consistency.** Additive language only ("moved 18 of the last 30 days"). No breakable streaks, no guilt notifications, no comparison, no leaderboards. Missed days fade quietly.
- **R5.4 — Integration.** Surface a gentle, non-clinical sleep↔mood reflection (v1 may stub the data, full correlation is v2). Allow an opt-in legacy hook: "health lessons I want you to learn from my mistakes."

## R6: Legacy & Inheritance

- **R6.1 — Two stores.** Private (his self-work) and Legacy (kid-facing) are physically separate object stores with **no automatic flow** between them.
- **R6.2 — The pivot.** Any private entry can be passed on via an explicit **"Pass this on" / "★ mark for them"** action → pick named recipient(s) → choose timing → confirm screen restating recipient + timing in plain words. Passing on **copies** into the Legacy channel; the private original is never altered.
- **R6.3 — Three entry states:** **Private** (default, only he sees it), **Shared now** (released to a named child, visible while he's alive), **Bequeathed** (sealed until a release condition). Every entry carries an unmistakable persistent state badge (lock / paper-plane / hourglass). Shared and bequeathed entries are **revocable until actually delivered.**
- **R6.4 — Recipient-controlled release.** Bequeathed/milestone entries unlock by **recipient or steward action**, not an automated server date-trigger (which is brittle over 20 years and can fire a wedding letter into a divorce). Release conditions are advisory metadata honoured at export, and the app is honest that they are not server-enforced.
- **R6.5 — The legacy keeper.** Enabling bequeathed delivery requires designating a **trusted contact** ("legacy keeper"); the app explains delivery is not automatic and needs a real person plus the handoff artifacts (R9).
- **R6.6 — Present-tense framing.** Never lead with death or "when you're gone." Frame legacy as "things worth passing on," shareable while alive. Name mortality once, honestly, in onboarding, then stop foregrounding it.

## R7: Capture & Onboarding

- **R7.1 — No accounts.** No login, email, or password required to use the app (v1). Open app → one giant primary action ("Add a lesson" / "Start your check-in").
- **R7.2 — Kill the blank page.** Onboarding opens to a stack of warm, specific prompt cards ("What did your own father get right?", "Advice you'd give before a first job"), not an empty editor. Target: **3 entries in the first session, each under ~90 seconds.**
- **R7.3 — Voice by default.** Capture defaults to voice; typing is always optional. Auto-save every keystroke/second so nothing is ever lost.
- **R7.4 — No completion bar.** Show a gentle "vault filling" signal, never a percent-complete bar that implies a finish line a life never reaches.

## R8: Data & Storage Model

- **R8.1** All entries and media persist in **IndexedDB**; `localStorage` holds only small UI/settings state (theme, author name, onboarding-done, last-viewed) — never irreplaceable content.
- **R8.2** Model core entities: `entries`, `categories`, `recipients`, `milestones`, `mediaAssets` (metadata), `mediaBlobs` (binary, **separate store**), and a singleton `meta`. Media (audio/photo) is stored as **native `Blob`s, never base64**, in a store separate from metadata so list views stay fast.
- **R8.3** Many-to-many links (entry↔category, entry↔recipient, entry↔milestone) are FK arrays on `entries` with `multiEntry` IndexedDB indexes for reverse lookup; deletes sweep orphaned IDs in app code.
- **R8.4** Time-release uses a `milestones.trigger` (date / age / event) **resolved at read time** against a recipient's `birthDate`, never a frozen timestamp baked into the entry.
- **R8.5 — Versioning.** Every record carries `schemaVersion`; `meta.schemaVersion` + IndexedDB `onupgradeneeded` runs ordered, idempotent migrations. Never delete fields — deprecate and ignore. Exports carry their own `schemaVersion` and upgrade through the same pipeline on import.

## R9: Durability & Backup (the #1 risk)

- **R9.1** On first write, the app MUST call `navigator.storage.persist()` and surface the granted/denied result. Treat **all browser storage as ephemeral cache**, never the archive.
- **R9.2 — Portable backup.** One-click export to a **single self-contained `.html` file** — all text plus base64-embedded media plus an inline read-only viewer — that opens and renders with **no network, no server, and no original app present.** Also offer a JSON export (`.dadscode`, open format, `schemaVersion` + `sha256` checksum) for re-import.
- **R9.3 — Keepsake book.** A `@media print` stylesheet renders the whole vault as a paginated book (text inline, photos embedded, audio rendered as captioned links/QR) → "Save as PDF" or physical print. Paper is the ultimate 20-year backup.
- **R9.4 — Backup nudges.** Track `lastBackupAt`; show its age on the home screen and a persistent banner until the user has exported at least one full backup. Prompt to back up after every N new entries and periodically. Show a storage meter via `navigator.storage.estimate()` and warn past ~70% of quota.
- **R9.5 — Media hygiene.** Re-encode audio to Opus/`audio/webm` (~1MB/min, feature-detected with `audio/mp4` fallback for iOS Safari) and downscale photos to ~2048px/WebP before write; record detected MIME type with every asset.

## R10: Security & Encryption

- **R10.1 (recommended, default OFF, prominently offered)** — Optional **vault passcode** encrypts sensitive content at rest via WebCrypto **AES-GCM** with a key derived by **PBKDF2 (≥210k, SHA-256) or Argon2id**; the key lives in memory only, never persisted. Store only salt + IV + ciphertext.
- **R10.2 — Encrypted export.** Offer plain and encrypted (passphrase-protected) export modes; encrypted exports are safe to email/cloud-store and ship with a tiny **standalone HTML decrypter** so family can open them years later with no app.
- **R10.3 — Recovery honesty.** Every encryption flow includes a passphrase hint field and states the unrecoverable-loss limitation up front, requiring explicit confirmation. No family must ever be permanently locked out of the legacy.
- **R10.4 — Shared-device hygiene.** When a passcode is set: auto-lock on idle and on tab blur/close; blur previews and hide message text while locked; a visible "Lock now" button. Per-recipient "envelopes" so each child can unlock only their own letters, not everyone's.
- **R10.5 — No security theatre.** No mandatory accounts, no forced password rotation/complexity rules, no "military-grade" badges, no silent unrecoverable encryption.

## R11: Privacy & Data Handling

- **R11.1** Fully offline-first. Private entries **never leave the device** without explicit, per-device opt-in. No analytics or telemetry on entry content. No third-party trackers.
- **R11.2 — On-device only.** Any heaviness/sentiment detection (R16.3) runs entirely on-device; no content is ever transmitted.
- **R11.3 — Author control.** The author can edit/delete any entry, tag recipients per entry, set release conditions, mark third parties present in photos, and perform a true local **"delete everything"** purge.
- **R11.4** Treat free-text as potentially special-category data (health, beliefs, sexuality disclosed without filter) and child data (recipients are often minors); handle with corresponding care in exports and sharing.

## R12: Accessibility (WCAG 2.2 AA baseline)

- **R12.1** Contrast ≥4.5:1; respect OS text scaling to 200% without reflow breakage; body text ≥18px default, line-height ≥1.5.
- **R12.2** Tap targets ≥44×44px; single-column linear flows; one primary action per screen; plain-language labels ("Add a story", not "New entry"); no time-limited interactions.
- **R12.3** Full keyboard reach with visible focus; ARIA landmarks and correct heading order; never color-only signalling; honour `prefers-reduced-motion`.
- **R12.4** Captions/transcripts for all audio (see R13.3).

## R13: Longevity & Open Formats (most important durability question)

- **R13.1** Every entry persists as plain UTF-8 text + semantic HTML — the canonical record is human-readable on its own, with no proprietary or DB-only format.
- **R13.2** Export must open in any browser decades from now with zero infrastructure (R9.2); also offer raw `.txt` and `.json`.
- **R13.3 — Transcripts.** Every audio entry carries an editable transcript (generated on-device or queued at capture); the transcript is the durable primary text, enables search, serves deaf/HoH family, and survives codec rot. Audio uses widely-supported open codecs, never proprietary.
- **R13.4 — i18n hooks now.** Adopt the repo's `i18n.js` pattern from day one (English-only at launch): wrap UI strings in `t()`, store entry content with an explicit `lang` field, set `<html lang>`/`dir` dynamically. Defer translations; reserve the seam.

## R14: Brand, Tone & Visual Design

- **R14.1 — North star: warm-archival.** It must feel like a worn leather journal, not a marble mausoleum — intimate first, built with the gravity of something meant to outlast him. Avoid AI-generic gradients, glassmorphism, neon, dark-mode-neon, and emoji-driven cheer.
- **R14.2 — Two voices.** To Dad (capture): plain-spoken, unsentimental, a little wry — treat him like a man, not a patient. To the child (revisit): quiet, present-tense, never maudlin; let his words carry the weight.
- **R14.3 — Palette:** Warm paper `#F4EDE2` (ground), soft black-brown `#2A2420` (ink), deep oxblood `#7A3B2E` (primary), aged brass `#B8893E` (accent, large sizes only), dusk slate `#5A6B6E` (quiet/grief states), muted sage `#7C8B6B` (alive/active, never neon).
- **R14.4 — Typography:** Fraunces (headings, warm soft serif), Newsreader or Source Serif 4 (body — a serif, "a letter not an app"); Caveat reserved only for the dad's own signature/sign-off, never UI chrome.
- **R14.5 — Signature moments:** entries *settle in* (fade up ~600ms over faint paper grain, like a page turning); every text entry can carry an audio clip with a warm oxblood waveform; a dad can "sign" a vault/entry in script that renders by hand on the child's first open.
- **R14.6 — Anti-patterns (forbidden):** gamification (streaks/badges/progress bars on grief), funeral/RIP iconography (crosses, urns, candles), stock "happy family" photography, emoji, cheery error states ("Oops!"), forced "memorial mode" UI on death (the same warm space simply continues).

## R15: Monetization & Licensing

- **R15.1 — Model.** Primary model is a **one-time / lifetime purchase (~AUD $29–39)** — a subscription on a legacy vault is ethically toxic and breeds "did my data get deleted?" anxiety. Physical keepsake upsell and gifting are margin layers on top.
- **R15.2 — The ethical line (non-negotiable).** A father's **own entered content must NEVER be paywalled, locked, encrypted-behind-purchase, or held hostage** — ever, including after a lapse, refund, or company shutdown. A **free, unencrypted, account-less, fully-offline full export** (his words, audio, entries → readable HTML/PDF + JSON) MUST always exist.
- **R15.3 — Free vs paid line:** *Free forever* = all data entry, daily journaling/check-in, full unencrypted export, local backup/restore. *Paid (lifetime unlock)* = polished legacy **experiences** (guided prompt packs, themed timelines, beautiful in-app legacy-book view, multi-device sync key). Pay for **delight and ceremony, never for retrieval.**
- **R15.4 — Licensing tech.** One-time license is a **local, offline-verifiable entitlement** (no server check required to use paid features) that degrades gracefully to free and never locks existing user content.
- **R15.5 — Gifting.** A redeemable gift-code flow plus a dedication/personalization screen ("from [name]"), decoupled from the buyer's own install. Physical keepsake book (print-on-demand) is v2.

## R16: Safety & Ethics

- **R16.1 — Not a medical device.** Health and mental-health features track and reflect; they never diagnose, score against clinical thresholds, or imply treatment. A standing, plainly-worded disclaimer is present and findable: "This app can't diagnose. When in doubt, see your doctor." Symptom-based escalation prompts point to professionals.
- **R16.2 — Crisis resources, offline.** Bundle a **static, region-selectable crisis-resources page** in the app shell (works with no network), reachable in ≤2 taps from anywhere. Australia defaults: Lifeline 13 11 14, Beyond Blue 1300 22 4636, MensLine 1300 78 99 78, "call 000 in immediate danger."
- **R16.3 — Gentle, on-device detection.** If on-device signals suggest sustained heaviness (e.g. several "storm" days running, or crisis keywords), surface **one** calm, non-alarmist, dismissible support card ("That sounds like a lot to carry alone — here's who's there, any time."). No scoring, no nagging, no pop-up walls, no red banners. Calm is the safety feature.
- **R16.4 — Tone safety.** Validate before reframing ("that sounds heavy — and it makes sense"); never toxic positivity ("Good vibes only"), never countdown/urgency, never memento-mori imagery. The weight comes from content, not chrome.

---

## Success Metrics (north-star, privacy-respecting / local)

- **Activation:** ≥3 entries in first session.
- **Habit:** dad completes the daily check-in or a journal entry on a majority of days in week 1 (measured locally, never transmitted).
- **Depth:** at least one private entry voluntarily "marked for them" within the first month (the self→legacy bridge working).
- **Trust:** at least one full backup exported within first week (durability promise landing).

## Out of Scope (v1)

- Any server, account, cloud sync, or social/sharing-to-internet feature.
- Automated date-triggered legacy delivery (recipient/steward-pull only).
- Physical keepsake book fulfilment, multi-device sync, AI-generated content/affirmations.
- Standalone health-trend dashboards and full sleep↔mood correlation (v2).
- Clinical assessment of any kind.
