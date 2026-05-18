# Codex — Requirements

## Vision

The first biofeedback platform built for the mystic, not the biohacker. Real-time HRV coherence + ancient-protocol library + lifetime ownership, delivered browser-first.

No existing product combines: spiritual/manifestation framing + clinical-grade HRV biofeedback + protocol library + browser-native + lifetime pricing. HeartMath is clinical. Welltory is quantified-self. Calm is meditation-only. Wim Hof is breath-only. This is the gap.

## Audience

The Codex of Reality TikTok audience: 183K followers, breakout cluster around nervous-system release, manifestation, alpha state, "ancient + science" framing. iPhone-first. Cold-curious, not category-aware.

## Functional requirements

**R1 — Coherence Engine (browser-native)**  
Real-time HRV via phone camera PPG. User places finger on rear camera + flash. App detects pulse, computes RR intervals over rolling window, scores coherence against a breath pacer at 0.1 Hz (5s inhale / 5s exhale). No hardware required to start.

**R2 — Hardware compatibility (progressive)**  
Optional pair with: HeartMath Inner Balance (via HeartCloud API), Polar H10 / Verity Sense (via Web Bluetooth), Apple Watch + Garmin + Oura + Fitbit (via Capacitor health bridge), Whoop (via Whoop Developer API). Hardware boosts accuracy; never required for entry.

**R3 — Protocol library**  
Categorized library of guided sessions, each pairing audio narration + on-screen breath pacer + live coherence score. Categories mirror the validated TikTok clusters:
- **Release** — nervous-system / trauma / fascia / vagus
- **Manifest** — alpha state / tortoise breath / vibration protocols
- **Reverse** — longevity breathing
- **Recover** — sleep / joints / energy

**R4 — Frequency player**  
Background solfeggio + binaural + branded sound layers. Loops independently of protocols. Uses royalty-free assets (ZENmix, Jaapi catalog) and Web Audio API generation.

**R5 — Daily ritual**  
Streak counter, morning + evening session queues, push notifications written in the brand voice. Designed for 30+ months of daily engagement.

**R6 — Lifetime ownership pricing**  
Single AU$30 one-time payment unlocks lifetime access. Founding-member tier with hard cap; future tiers (AU$97, AU$197) introduced after cap is reached. No subscriptions. No renewals.

**R7 — Staged content unlocks**  
"30 months of new content" delivered as monthly drops that auto-unlock on the user's app for the lifetime of their account. Reuses the Part 1 / Part 2 / End serialization habit the TikTok audience is already conditioned to.

**R8 — Funnel-aware landing page**  
TikTok bio link lands on a page that:
- Demonstrates the Coherence Engine live in the browser within 10 seconds of arrival
- Sells the AU$30 founding offer
- Captures email for users who don't convert
- Loads under 2s on iPhone 5G

**R9 — Cross-platform distribution**  
Ships as PWA on day one (web app + add-to-homescreen). Native iOS + Android wrapped via Capacitor in month 2 for App Store distribution + HealthKit / Health Connect access.

**R10 — Content scale via voice clone**  
Jamie's TikTok narration cloned via ElevenLabs Professional Voice Cloning. New protocols scriptable to narrated session in < 30 minutes. Sustains the 30-month content commitment.

**R11 — Featured "Codex" verticals**  
Cross-cutting collections that pull from multiple categories under a single mythological frame. Each vertical is the brand wrapper; individual protocols inside it carry the clinical mechanism. Launch verticals:

- **The Tesla Codex** — 3-6-9 Breath, Schumann Lock (7.83 Hz auditory anchor + coherence-frequency breath), Toroidal Breath, 369 Manifestation Ritual, Violet Ray Tone. Hero protocol: `tesla-369-breath` (3s in / 6s hold / 9s out, extended-exhale parasympathetic activation).
- **The Hermetic Codex** — *placeholder for later — Emerald Tablet, Kybalion-framed protocols.*
- **The Vedic Codex** — *placeholder for later — Pranayama lineage, Bandha holds.*

All verticals follow the **mythology ↔ mechanism split** codified in `content/protocols/README.md`: brand-facing copy frames the lineage; in-app copy stays clinically neutral. No medical claims in either.

## Non-goals

- Not a medical device. Coherence score is a practice score, not a diagnostic.
- Not subscription. The lifetime promise is the wedge against HeartMath / Welltory / Calm.
- Not a community-first product. Light social later; daily ritual is the core loop.
- Not platform-agnostic at launch. Optimize for iPhone — that's where the audience lives.

## Constraints

- **Solo operator.** Build budget = one person's evenings + weekends. Use skills already in this repo (saas-scaffolder, hyperframes, Supabase MCP, Stripe MCP, Replicate MCP).
- **App store claims.** "Reverses aging," "manifests reality" stay in marketing. App copy stays clinically neutral: "breathwork with HRV biofeedback."
- **Camera PPG accuracy.** Good enough for a coherence practice score. Not good enough to claim clinical HRV. Frame accordingly; offer hardware pairing as the upgrade path.
