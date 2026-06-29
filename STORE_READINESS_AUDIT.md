# App Portfolio — Apple/Google Store Readiness Audit

> Generated audit of every app actually built in code in this repo, assessed for
> Google Play + Apple App Store readiness, with the backend + frontend finishing
> touches each needs. Branch: `claude/hindi-apps-store-audit-bi4oy7`.

## Headline

There are **~130 app files on disk** that collapse into **~75 distinct apps**. The
core finding: **almost nothing is store-ready because almost nothing has a native
wrapper**, and the real backends call APIs directly from the browser with
user-pasted keys (disqualifying for both stores). Exactly **one app — Reset — has
a real, CI-buildable native project.**

### Readiness ladder (closest → furthest)

1. 🟢 **Reset** — real Xcode project + CI, only signing left
2. 🟡 **Codex of Reality, roomtone, HerdCheck** — complete PWAs, need a wrapper
3. 🟡 **STARLIGHTMIX Studio + 10 "Pro" AI apps** — real backends, need key-proxy + PWA infra + wrapper
4. 🟠 **~26 trending apps + ~10 PWA folders** — functional but offline demos, need packaging
5. 🔴 **Untapped 10 + 50 Buddy clones + mock-core apps** — prototypes / spam-risk, need a real build

---

## Tier 1 — Closest to submission

| App | Location | Backend | Native | Remaining work |
|---|---|---|---|---|
| **Reset** | `recovery/` + `recovery-ios/` | None needed (local, offline-first) | ✅ Real Capacitor iOS project (`App.xcodeproj`/`.xcworkspace`), built by `codemagic.yaml` | Flip CI from unsigned-sim-Debug → signed Release IPA; Apple Dev team + provisioning + certs; App Store Connect record; icon set; privacy labels; screenshots. Tidy legacy `armv7`/landscape in `Info.plist`. No Android project yet. |

---

## Tier 2 — Complete PWAs, just need a wrapper

| App | Location | Backend | Gap |
|---|---|---|---|
| **Codex of Reality** | `sites/codex-of-reality/` | External NOAA/HeartMath feeds | Full PWA ✅. Add Capacitor wrapper for Apple; ships as PWA/TWA on Android today. Needs real screenshots. |
| **roomtone** | `apps/roomtone/` | None (Web Audio) | Reference-grade — full icon set + splash + tests. Wrapper-ready. Template for the others. |
| **HerdCheck** | `livestock/` + `capacitor-herdcheck/` | None (on-device), Hindi-complete | Complete PWA ✅, but wrapper is scaffold only — no `ios/`/`android/` project, CI references a missing folder. Run `cap add`, install deps, keystore, fix CI. |
| **dreams, hum, resonate** | `apps/{dreams,hum,resonate}/` | None (Web Audio) | Real PNG icons present; add maskable + privacy policy, then wrap. |

---

## Tier 3 — Real backends, but key-management + packaging block them

**STARLIGHTMIX Studio** (`studio/`) — Next.js 15 AI music-video generator. Real
backend (Cloudflare Workers: Gumroad license validation, Replicate proxy). Strong
web app, but no PWA infra, and `capacitor/` has no `ios/` project (just a package +
tests). Deploy Workers, then `cap add ios` + icons + bundle ID; BYO-Replicate-token
flow risks Apple Guideline 3.1.1.

**The 12 "Pro" AI apps** (each in `apps/` + a landing in `sites/`):

| App | Backend | Verdict |
|---|---|---|
| CodeMentor, StoryStudio, VoiceJournal, BookReader Pro, MathTutor Pro, MeetingMind, SmartGrocery, SpellingBuddy, StudyMate, LanguageLens | ✅ Real Claude API (several add real Tesseract OCR / ElevenLabs / Web Speech) | NEEDS-WRAPPER |
| **NutriAI** | ⚠️ Mixed — meal plans real, "scan meal" faked (`setTimeout` → hardcoded salad) | PROTOTYPE until scan is real |
| **FitCoach Pro** | ⚠️ Mixed — workouts real, "form check" faked | PROTOTYPE until form-check is real |

**Common blocker for all 12 + `apps/readout/`:** they call `api.anthropic.com`
directly with a user-pasted `sk-ant` key (`anthropic-dangerous-direct-browser-access`).
Disqualifying for the stores (exposed keys, no metering). Plus zero PWA infra.
Fix: route keys through a proxy Worker → add manifest/SW/icons → Capacitor-wrap →
privacy policy. **See `store-template/` for the reusable productionization pattern.**

---

## Tier 4 — Functional, but offline web demos (need packaging)

**~26 "trending" single-file apps** in `apps/` — all real, working, 100%
client-side (localStorage), no backend by design:

`mood-journal, meditation-guide, medicine-companion, blood-pressure-buddy,
calorie-counter, weight-tracker, vendor-tracker, expense-tracker, savings-challenge,
loan-calculator, goal-tracker, budget-tracker, math-helper, study-planner,
trivia-quiz, notes, tasklist, reminders, daily-planner, pomodoro-timer,
workout-timer, period-tracker, quick-recipes, voice-notes, habit-streak, lifeaudit,
water-tracker` (+ `english-pocket`).

- Not installable — the `apps/manifest.webmanifest`/`sw.js` belong to the Buddy
  System, not these. No per-app manifest/icons.
- Bug: `water-tracker` loses its count on refresh (should use localStorage).
- Currency hardcoded `₹` (INR) in the finance apps.
- Apple will reject the thinnest (water-tracker, loan-calculator, math-helper,
  pomodoro) under Guideline 4.2 — bundle related micro-tools into fewer richer apps.

**Other PWA folders** — `drift, focus, glow, hype, lapse, macro, pulse, scan, trim,
vault, live`: have the PWA skeleton but missing/fake icons (5 declare PNG paths that
don't exist; 6 use emoji data-URIs). Several "AI" claims are local templating
(drift, hype, macro, pulse), `live`'s render queue is a mock, and **`vault`'s
"encryption" is stubbed** — the real `crypto.subtle`/PBKDF2 path is commented out
(don't market it as secure until enabled).

Finishing touches: generate real maskable icon sets (clone roomtone's approach), add
per-app manifest+SW+privacy, fix water-tracker/vault, then TWA-wrap (Android) /
Capacitor (Apple).

---

## Tier 5 — Prototypes & spam-risk (need a real build, not polish)

**Untapped concepts (10)** in `apps/untapped/` — `axle, docket, herd, lull, plumb,
rack, sole, spot, stack, tympan`. All have faked/scripted "AI" cores (timers
returning canned data — no real ML, camera pipeline, or backend). No PWA, no wrapper.
Several make medical/legal claims (SOLE, SPOT, TYMPAN, DOCKET) that draw heightened
review. (herd & lull are Hindi-complete in the UI; the rest only mention languages in
marketing.) Strongest candidate if pursued: **SPOT** (pet-health triage) — lowest
regulatory bar, single image-classification core.

**Buddy ecosystem (~59 files)** in `apps/`:
- `buddy-1.html … buddy-50.html` are near-identical clones (only ~8 lines differ).
  50 reskins would be auto-rejected under Apple Guideline 4.3 / Play
  repetitive-content.
- Their chat is currently broken — the 50 files omit the
  `anthropic-dangerous-direct-browser-access` header, so the API call fails CORS.
  Health metrics are faked.
- `buddy-system.html` (28-persona carousel) and `buddy-app-template.html` are the
  real, fuller code paths. `avatar-proxy-local.mjs` is a real backend but local-only.
- To ship: consolidate to one app (carousel model), move LLM calls server-side,
  finish PWA, wrap, add crisis disclaimers + privacy.

**Generated (2):** `calm-local.html` (real, wired to local Ollama — works offline) and
`career-coach.html` (real Claude, BYO key). Most-correct lineage but still need packaging.

**HEARTBEAT** (`apps/heartbeat.html`): mock chat (canned replies), Hindi listed but
untranslated, JS bug. Prototype.

**Agent-Builder** (`agent-builder/`): a web SaaS, not a store app — backend is mock
(Supabase documented + migrations written, but never wired; persists to localStorage).

---

## Hindi apps (the original sub-question)

| App | Hindi | Verdict |
|---|---|---|
| **HerdCheck** (`livestock/`) | ✅ Complete locale | NEEDS-WRAPPER (strongest) |
| **LULL** (`apps/untapped/lull.html`) | ✅ Complete (7 langs) | PROTOTYPE (faked classifier) |
| **HERD** (`apps/untapped/herd.html`) | ✅ Complete (5 langs) | PROTOTYPE (mocked AI) |
| **HEARTBEAT** (`apps/heartbeat.html`) | ❌ Listed, untranslated | PROTOTYPE (mock AI) |
| **English Pocket** (`apps/english-pocket.html`) | ⚠️ Thin (20 word pairs) | PROTOTYPE |

---

## Recommended path

1. **Ship Reset first** — only app with a real native project; finish signing/store config.
2. **Wrap the 3 complete PWAs** (Codex, roomtone, HerdCheck) via Capacitor.
3. **Productionize ONE Pro app** end-to-end as a repeatable template (key-proxy + PWA
   infra + wrapper), then replicate. → **`store-template/` (this branch).**
4. **Do NOT submit** the 50 Buddy clones or the 26 micro-apps as-is — rejection risk
   for duplication / minimum-functionality. Consolidate.
</content>
</invoke>
