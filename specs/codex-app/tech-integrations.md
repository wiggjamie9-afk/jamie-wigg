# Codex — Technology Integration Roadmap

Companion to `design.md` §Hardware integration order. This file catalogs the cutting-edge tech the Codex can integrate with — wave frequencies, biofield sensors, environmental data feeds — sorted by defensibility and ship-readiness.

References: `requirements.md` R2, R4, R11.

## Tier 1 — real APIs / real hardware / ship-ready

### 1.1 Live Schumann Resonance feed

**Source:** HeartMath Global Coherence Monitoring System (GCMS) — a worldwide network of magnetometers (California, Alberta, New Zealand, Saudi Arabia, Lithuania, South Africa) publishing real-time Schumann resonance power data from 0.32–36 Hz.

**Use in app:** display the current Schumann resonance reading on the home screen. Pair with the Schumann Lock protocol (`tesla-schumann-lock.md`) where the user breathes at 0.1 Hz coherence frequency while a binaural tone at the *measured* current Earth frequency plays underneath.

**Marketing line:** "The Earth is pulsing at 7.86 Hz right now. Tune to it."

**Status:** charts publicly available at `heartmath.org/gci/gcms/live-data/`. Direct JSON endpoint unconfirmed — either email HeartMath for partner access (their HeartCloud API is documented as open) or scrape the chart endpoint server-side and re-publish through Supabase Edge Function. Daily-resolution data is sufficient; minute-resolution is overkill.

**Effort:** ~1 week (server-side fetcher + UI tile + binaural tone generator).

### 1.2 NOAA Geomagnetic Kp index

**Source:** NOAA Space Weather Prediction Center — `services.swpc.noaa.gov/products/noaa-planetary-k-index.json` and related endpoints. Free, no key, updates every minute.

**Use in app:** daily protocol recommendation engine. Kp 0–2 = quiet (any protocol), Kp 3–4 = active (Schumann Lock / Grounding), Kp 5+ = storm (deep Recover protocols, sleep ritual). Display the Kp dial on the home screen.

**Marketing line:** "Today the Earth is restless. The Codex recommends Grounding."

**Status:** ready to ship — fetch on app open, cache for 1 hour.

**Effort:** ~2 days.

### 1.3 Muse EEG headband (heart-brain dual coherence)

**Source:** `muse-js` / `web-muse` open-source libraries. Connects via Web Bluetooth directly from browser. Muse S Athena (2025) adds fNIRS (cerebral blood flow) — the first consumer headband with combined EEG + fNIRS.

**Use in app:** premium "Tesla Lock" mode. Display three coherence scores in real time:
- **Heart coherence** — from HRV (camera PPG, Polar, HeartMath, Apple Watch)
- **Brain coherence** — from EEG alpha/theta ratio + frontal asymmetry
- **Earth coherence** — from live Schumann reading vs user's breath cadence

When all three lock above threshold, the orb pulses gold. This is the visual goal-state of the app.

**Marketing line:** "The first consumer biofeedback platform to display heart, brain, and Earth coherence simultaneously."

**Status:** muse-js is the proven path. The "all three coherent" lock event is novel and shippable.

**Effort:** ~2 weeks for the EEG layer.

### 1.4 Pulsetto + Nurosym vagal nerve stimulators

**Source:** Pulsetto has Bluetooth + companion app (required for operation). Nurosym is standalone, no app. Both are Bluetooth-class consumer devices.

**Use in app:** the Codex doesn't replace these — it *stacks* with them. Protocols can be authored as "Pulsetto + Breath" combinations: "Start your Pulsetto 5 Hz program. Open this Codex protocol. Run for 10 minutes side-by-side."

**Marketing line:** "Stacks with your Pulsetto. Stack the nervous-system effect."

**Status:** Pulsetto's BLE protocol is not publicly documented. Initial integration is "sequential stacking" via instructions; deeper integration (read Pulsetto session events) requires reverse engineering or partnership.

**Effort:** ~1 week for the sequential-stack flow. Months for full BLE pairing if pursued.

### 1.5 Consumer PEMF mats (BEMER, HigherDOSE, Pulse PEMF, DIY)

**Source:** wave of Bluetooth-enabled PEMF devices shipping in 2026. Smartphone-controlled, frequency-programmable. Real FDA Class II clearance for bone healing; "wellness" claims for the rest.

**Use in app:** PEMF intensity + breath cadence + HRV in a single screen. The Codex becomes the orchestration layer for a PEMF session.

**Marketing line:** "Pair your PEMF mat with the Codex. Stack the field with the breath."

**Status:** BLE protocols vary per manufacturer. Start with "sequential stacking" (timed UI prompts); negotiate partnership integrations with one launch partner (HigherDOSE is the most Codex-aligned audience).

**Effort:** ~1 week for sequential-stack flow per device. Partnership work is sales, not engineering.

## Tier 2 — real science, content-only (no SDK required)

### 2.1 Photobiomodulation (660 nm / 850 nm) stacking

**Mechanism:** red light at 660 nm absorbed by cytochrome c oxidase in mitochondria → accelerated electron transport → ATP increase. 850 nm penetrates 3–5 cm into tissue. Well-supported in peer-reviewed photobiomodulation literature.

**Use in app:** prescribe red-light stacking inside protocols. "Morning: 5 min of 660 nm to face + chest, then run the Schumann Lock." Optional affiliate links to compliant red-light devices (Mito Red, Joovv, HigherDOSE).

**Status:** content only. No integration needed.

### 2.2 Personal resonance frequency discovery

**Mechanism:** every adult's HRV-coherence peak sits between 4.5 and 7 breaths per minute, varying by lung volume, vagal tone, and posture. A sweep through pacer rates with concurrent HRV measurement finds the personal peak.

**Use in app:** a 5-minute onboarding protocol — "The Tesla Resonance Discovery" — that sweeps the pacer from 4.0 to 7.0 breaths/min, measures coherence at each rate, returns the user's personal resonant frequency. From then on, all protocols can optionally lock to that user's frequency.

**Tesla angle:** *"every body has a resonant frequency. find it."* This is the most defensibly-Tesla feature in the app — it applies his actual resonance principle to physiology.

**Status:** pure software. Build on top of the Coherence Engine.

**Effort:** ~3 days.

### 2.3 Cymatics visualization (Chladni patterns)

**Mechanism:** sound waves create standing-wave node patterns on plates / in water / in particle fields. Beautiful, real physics. Different frequencies → different patterns.

**Use in app:** every tone in the Frequency Player renders as a live Chladni pattern in WebGL. 432 Hz, 528 Hz, 7.83 Hz each have distinct visuals. Background visual during all protocols.

**Marketing line:** "See the sound you're tuning to."

**Reference implementations:** CymaVis, CymaticsVisualizer (open-source), Cymatica.

**Status:** WebGL/canvas implementation. Open-source starting points exist.

**Effort:** ~1 week to fork an open-source Chladni simulator and brand-style it.

## Tier 3 — brand frame, no medical claims, mythology-strong

### 3.1 Vibroacoustic mode (Tesla's "earthquake machine")

Phone speaker at ~40 Hz, user holds device to sternum or lower abdomen. Sub-bass body vibration is a real practice (vibroacoustic therapy: Skille, Wigram, et al. — used clinically for relaxation and pain modulation).

**Tesla angle:** Tesla's mechanical oscillator (the famous apocryphal "shook the building" story).

**Status:** Web Audio API can synthesize the tone trivially. UX care needed — instruct phone position and warn about ear placement.

### 3.2 Codex Sync (Tesla's wireless transmission, as community ritual)

Scheduled global moments when all Codex members run the same protocol simultaneously. The app shows a live counter of active worldwide sessions. Coherence at scale.

**Tesla angle:** wireless transmission of power = wireless transmission of state.

**Status:** Supabase realtime channel + scheduled push notifications. Ships in month 3+ once user base exists.

### 3.3 The 3-6-9 cycle ladder

Every Codex protocol auto-generates 3-cycle, 6-cycle, and 9-cycle variants. Same content, different commitment levels, numerically Tesla-keyed.

**Status:** content generation rule. Author once, expose three variants.

## The flagship combination

If we lead with one feature in marketing, it's this:

> **The Tesla Lock**
>
> Pair your phone, your headband, and the Earth.
> 1. Camera-PPG (or Polar / HeartMath / Apple Watch) reads your heart.
> 2. Muse EEG reads your brain.
> 3. HeartMath GCMS reads the Earth.
> 4. The Codex pacer guides your breath to your personal resonant frequency.
> 5. When heart coherence + brain coherence + Earth resonance all align — the Lock activates.

Nobody else does this. Welltory has no EEG. HeartMath has no EEG and no consumer app polish. Muse has no HRV and no Earth data. The Calm-Headspace tier has no biofeedback at all. **The Tesla Lock is genuinely uncharted commercial territory and we can ship it.**

## Build-order recommendation

1. **Week 1:** ship the landing page (done — `sites/codex-of-reality/home.html`)
2. **Week 2:** ship the app shell + first 10 protocols (T4–T9)
3. **Month 2:** add NOAA Kp tile + protocol recommender (low effort, high content-marketing value)
4. **Month 2:** add Personal Resonance Discovery (low effort, perfect Tesla story)
5. **Month 3:** add Cymatics visualization layer (mid effort, huge social-media multiplier)
6. **Month 3:** add Schumann live feed + Schumann Lock protocol
7. **Month 4:** add Muse Web Bluetooth pairing + Tesla Lock mode (flagship launch)
8. **Month 5+:** Pulsetto / PEMF / red-light stacking partnerships
