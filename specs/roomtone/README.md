# Roomtone — Real-Time Environmental EQ for Hearing Aids

A phone app that listens to the room you're in and re-tunes your hearing aids on the fly.
Restaurants stop being a wall of mush. Cars stop drowning out passengers. Churches stop
ringing. Quiet rooms stop hissing.

## The wedge

Hearing aids ship with 4–6 static "programs" tuned by an audiologist once a year. The
acoustic world has millions of distinct scenes. Users compensate by mashing the program
button or just giving up — the #1 reason ~$5K aids end up in a drawer.

Mimi and Petralex personalize **once** (a hearing test → fixed EQ on phone audio).
Neither continuously classifies the room you're standing in and pushes a fresh curve
to the aids in your ears. That's the gap.

## Who pays

- **B2C:** $7.99/mo or $59/yr direct to the 50M+ aid wearers worldwide. Even a 0.1%
  attach rate is $4M ARR.
- **B2B white-label:** Resound / Phonak / Starkey / Oticon all ship companion apps
  that don't do this. License the engine.
- **Audiologist channel:** clinics give it away as a retention tool — fewer "the aids
  don't work in restaurants" return visits.

## How it actually works

```
┌──────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌────────────┐
│ Phone    │──▶│ Scene classifier │──▶│ Target EQ solver │──▶│ Delivery   │
│ mic      │   │ (on-device CNN)  │   │ (audiogram +     │   │ to aids    │
│ 16 kHz   │   │ 1s windows, 6    │   │  scene preset)   │   │ (see below)│
│ mono     │   │ classes          │   │                  │   │            │
└──────────┘   └──────────────────┘   └──────────────────┘   └────────────┘
                                                                    │
                                              ┌─────────────────────┴───────────────────┐
                                              │                                          │
                                       Mode A: Stream                           Mode B: Program switch
                                       (LE Audio / MFi)                         (BLE control channel)
                                       Phone re-EQs mic audio                   Phone tells aid "switch to
                                       and streams to aids                      preset #3 (Restaurant-Loud)"
                                       <30 ms end-to-end                        Crossfade on the aid side
```

### Scene classes (MVP — 6)

| Class            | Cue                                       | EQ move                              |
|------------------|-------------------------------------------|--------------------------------------|
| Quiet            | <40 dBA, low spectral entropy             | Flat + mild high-freq lift           |
| Restaurant/Babble| 60–75 dBA, ~1 kHz peak, multi-talker       | Aggressive 250 Hz cut, 2 kHz lift    |
| Car              | Low-freq dominance, steady, road rumble    | High-pass 200 Hz, presence lift      |
| Music            | High HPCP, harmonic structure              | Flatter response, wider dynamic range|
| Outdoor / Wind   | Pink-ish with low-freq gusts               | Wind-noise notch, comfort gain limit |
| Reverberant / Church | Long RT60 estimate, sparse onsets      | De-reverb-style mid scoop            |

Classifier: ~500 KB MobileNet-style CNN over 64-band log-mel, ~1s hop, ~50 mW continuous.
Outputs a softmax + confidence; only swap presets when confidence > 0.8 for 2 consecutive
windows (prevents thrashing as a waiter walks past).

### Delivery — the hard part

Direct DSP write into a hearing aid is not exposed by any consumer OEM. Two real paths:

1. **Streaming mode (preferred, modern aids).** LE Audio (Auracast / unicast) or
   MFi Hearing Devices route arbitrary audio to the aids. We process the phone mic
   with the user's audiogram-corrected EQ + the scene EQ, then stream. Aid acts as a
   dumb speaker. Works on iOS 14+ MFi aids and any LE Audio aid (Phonak Lumity,
   ReSound Nexia, Starkey Genesis AI, etc.). Latency budget: 30 ms — tight but doable
   with AAC-LD or LC3.
2. **Program-switching mode (legacy aids).** Most pre-2023 aids expose 4–6 preset
   slots via the OEM SDK or the GN Hearing / Sonova companion-app BLE protocols.
   We pre-load 6 environment-tuned presets and just switch slots. Worse fidelity,
   no per-room nuance, but works on the installed base.

MVP picks **one OEM** (likely ReSound/Jabra — best documented LE Audio + open-ish SDK)
and ships streaming mode there. Mode B is a fast-follow for reach.

## Personalization

- **Audiogram:** in-app pure-tone test (5 min, calibrated headphones or aids in
  streaming mode), or PDF import from the audiologist.
- **Room fingerprints:** user taps "this is my kitchen" / "this is my office" /
  "this is the Wednesday-night bar" — the classifier learns named locations and
  the user can manually nudge the EQ curve, which becomes the new target for that
  fingerprint.
- **Feedback loop:** persistent thumbs up / down in the notification shade. Three
  thumbs-down in a scene → app surfaces a 4-band EQ tweak panel. RLHF on hearing.

## Privacy

Mic always on, audio **never leaves the device**. The classifier is on-device;
only anonymized scene labels + EQ choices sync (opt-in) to improve the model.
This is the table stakes pitch — and the actual moat vs anything cloud-based.

## MVP scope (12 weeks, two engineers)

- [ ] iOS app (Swift, AVAudioEngine, Core ML)
- [ ] 6-class scene classifier trained on AudioSet + ESC-50 + ~10 hrs in-house labelled
- [ ] Audiogram onboarding + PDF importer
- [ ] ReSound LE Audio pairing + streaming
- [ ] Per-scene EQ presets with user override
- [ ] Auto-switching w/ confidence gating
- [ ] One-tap "fingerprint this room" flow

Out of scope for v0: Android, program-switching mode, music personalisation, tinnitus
masking, multi-aid stereo balance, watchOS control.

## Risks & honest pre-mortems

- **Latency.** If end-to-end mic→processed-audio→aid exceeds ~40 ms, the user hears
  their own voice doubled. LC3 codec + buffer-tuning is critical. Prototype this in
  week 1; if it doesn't hit budget, fall back to program-switching mode for v0.
- **OEM API churn.** OEMs guard their SDKs. Plan B: LE Audio Auracast is standard
  and OEM-agnostic — we can broadcast and let any LE Audio aid receive.
- **False scene flips.** A barista yelling "LATTE" should not retune a quiet café.
  Hysteresis (2-window confirmation) + a 5s dwell-time minimum between switches.
- **Regulation.** Self-fitting OTC hearing aid rules (FDA 2022) cover the aids,
  not companion apps that don't *claim* medical benefit. Position as comfort/quality,
  not "hearing restoration." Get a regulatory read by week 8.
- **The wearer demographic.** Median aid wearer is 70+. UI must be huge, high-
  contrast, one-button. Auto-mode does 90% of the work; settings are buried.

## Why now

- LE Audio Auracast hit critical mass in 2024–25 — most aids shipping in 2025 support
  it natively. The "stream arbitrary audio to aids" plumbing finally exists.
- On-device audio classifiers under 1 MB and 100 mW are now routine (YAMNet, PANNs).
- iOS 17 / Android 15 both shipped LE Audio-aware Hearing Devices APIs.
- FDA OTC ruling expanded the addressable market by ~10× — younger, more app-savvy
  wearers entering the category.

## What I'd build next, after v0 lands

1. **Directional zoom.** Use phone mic array (or aid beamformer if exposed) to point
   the EQ at the person across the table.
2. **Telecoil-2.0.** Recognise the room you're in by Wi-Fi BSSID + GPS and pre-load
   that room's fingerprint before you even start talking.
3. **Companion mode.** Hearing partner's phone shares its mic over LE Audio Auracast
   — your aids hear what their phone hears, EQ'd for your loss.

---

*Single-page brief. Full spec via `/spec-quick roomtone` if/when this gets greenlit.*
