# Biometric-Driven Adaptive Media — State of the Stack, May 2026

> Stream 1 of 4 in the "outstanding emerging tech for a new app" research bundle.
> Sister docs: `02-spatial-audio-xr.md`, `03-voice-ai-ambient-capture.md`, `04-generative-frontier.md`.
> Synthesis: `00-strategy.md`.

The crucial shift in the last 12 months: **real-time generative music finally has a sub-second control surface (Lyria RealTime, Magenta RT)**, and **consumer EEG finally has a credible "headphones that already do the job" form factor (MW75 Neuro LT, Naqi)**. The killer app — closed-loop, biosignal-conditioned generative audio for a non-clinical wellness use case — has every ingredient, and nobody has shipped it.

## 1. Consumer EEG / Neural Wearables

| Device | Status | Dev access | Notes |
|---|---|---|---|
| **Neurosity Crown** | Shipping, $1,499 | JS + Python SDK, 256 Hz × 8 ch raw EEG, **native MCP server** | The only consumer device that gives you raw + focus/calm scores + an MCP endpoint out of the box. ([neurosity.co/tech-specs](https://neurosity.co/tech-specs)) |
| **Muse S Athena** | Shipping, ~$475 | Muse SDK (raw EEG); also LSL via BlueMuse | First consumer **EEG + fNIRS** combo. "Deep Sleep Boost" already does closed-loop pink noise timed to slow oscillations — directly relevant prior art. ([choosemuse.com/Athena](https://choosemuse.com/products/muse-s-athena), [Deep Sleep Boost](https://www.luxuriousmagazine.com/muse-athena-deep-sleep-boost/)) |
| **Neurable MW75 Neuro / LT** | Shipping; LT at $499 | App-level focus score; **no public raw SDK** in the search trail | 12-channel fabric EEG inside real Master & Dynamic headphones. ([neurable.com](https://www.neurable.com/products/mw75neurolt)) |
| **Emotiv MN8** | Shipping; 2-ch in-ear EEG | **Cortex API** — raw EEG + focus/stress over WS for paying devs | Cleanest "headphones + EEG + documented API" combo for an indie. ([emotiv.com/MN8](https://www.emotiv.com/products/mn8), [Cortex API](https://emotiv.gitbook.io/cortex-api)) |
| **Naqi Neural Earbuds** | CES 2026 Innovation Award; commercial launch H1 2026 | Cloud platform + API/SDK | Mostly **EMG/jaw/eye micro-gestures, not EEG** — don't expect cortical signal, but a slick hands-free control surface. ([CES 2026](https://www.ces.tech/ces-innovation-awards/2026/naqi-neural-earbuds-with-invisible-user-interface/)) |
| **OpenBCI Galea V2** | Prosumer/research only, ~$28,000 | Full SDK incl. EEG/EMG/EDA/PPG/eye | Out of reach for indie/consumer; useful as a research backbone if you partner with a lab. ([techgolly review](https://techgolly.com/openbci-galea-v2-review-in-2026)) |

**Indie reality:** if you ship today on iPhone, your two viable EEG inputs are **Muse S Athena (rich, head-strap)** and **Emotiv MN8 (in-ear, lower channel count but in a real BT audio device)**. Neurable is the most beautiful hardware but the SDK story is opaque — confirm before building on it.

## 2. HRV / Breath / Coherence on iPhone

- **Apple Watch via HealthKit** is the default, but the constraint everyone forgets: HealthKit HRV (`heartRateVariabilitySDNN`) is **not a live stream**. The only way to get near-real-time beats is to open a `HKWorkoutSession` on the Watch and stream `HKAnchoredObjectQuery` deltas — that's the unlock most third-party HRV/breath coaches use today. ([Apple Developer thread](https://developer.apple.com/forums/thread/756354), [Wareable on watchOS APIs](https://www.wareable.com/apple/why-apples-api-overhaul-means-a-more-personal-and-contextual-watch))
- **Oura Ring 4** has a real-time HR mode (50 Hz PPG) but the **third-party API is cloud-polling, not live BLE** — useful for sleep/readiness context, not for closed-loop. Membership now gates API access. ([Oura API](https://support.ouraring.com/hc/en-us/articles/4415266939155-The-Oura-API), [Live HR](https://support.ouraring.com/hc/en-us/articles/4410651298963-Live-Heart-Rate))
- **WHOOP 5** samples 26 Hz and has webhooks via Spike, but **same problem — cloud-mediated, not realtime BLE**. ([WHOOP API](https://developer.whoop.com/api/))
- **Polar Verity Sense / H10** is the **dark horse winner for indie real-time work**: open Polar BLE SDK on iOS 14+, PP-intervals + raw PPG + ECG over BLE with sub-second latency. ([polar-ble-sdk](https://github.com/polarofficial/polar-ble-sdk)). This is what you build on if RHYTHMIX FREQUENCY's 0.1 Hz coherence loop needs to *react in <1 s*.

## 3. Real-Time Generative Audio That Accepts a Control Signal

This is the category that just unlocked.

- **Lyria RealTime (Google AI Studio, WebSocket)** — generates a continuous 48 kHz stereo stream, **2-second chunks, sub-500 ms control-to-effect latency** (max 2 s), accepts continuous text-prompt steering and parametric density controls live. This is the single most important new primitive in the space. ([ai.google.dev/lyria-realtime](https://ai.google.dev/gemini-api/docs/realtime-music-generation), [DeepMind page](https://deepmind.google/models/lyria/lyria-realtime/))
- **Magenta RT (Google, open weights, Apache 2)** — same architecture, 800M params, runs on your own GPU; "MusicCoCa" embedding lets you steer with text *or* audio embeddings in real time. The open-source escape hatch when you outgrow Lyria's per-stream pricing. ([huggingface.co/google/magenta-realtime](https://huggingface.co/google/magenta-realtime))
- **Suno v5 / v5.5** — best fidelity, "20-second streaming output" but it's *streaming a finished generation*, not a steerable live stream. Real-time sliders exist in Suno Studio (Weirdness, Style Influence, Audio Influence) but only inside their UI. ([cometapi on v5.5](https://www.cometapi.com/suno-v5-5-what-is-new-and-how-to-use-it-via-api--studio/))
- **Udio** — 1–3 min generations, no live stream, granular pre-gen control. Same shape as Suno. ([musicapi.ai/udio](https://musicapi.ai/udio-api))
- **Stable Audio 2.0 / Open 2** — 44.1 kHz stereo, 3-min tracks, **API still "soon"** as of mid-2026. Not a real-time option yet. ([XYZEO](https://xyzeo.com/product/stable-audio-20))
- **ACE-Step** — open weights, 4 min track in 20 s on an A100, supports voice cloning + remix + section replacement; pair it with Magenta RT for hybrid streaming-plus-bake workflows. ([Replicate](https://replicate.com/lucataco/ace-step))
- **Riffusion** — still the best near-real-time spectrogram diffusion option, but quality is well behind Lyria/Magenta.

**Bottom line:** **Lyria RealTime is the only production-grade tool today that closes the loop fast enough for biofeedback** (HRV update → audio change in <1 s end-to-end is achievable). Magenta RT is the open-source fallback for sovereignty or cost reasons.

## 4. Adaptive-Music Incumbents — what's actually shipping

- **Endel** — adapts to circadian, weather, location, **Apple Watch heart rate**. Generative, but generative on a rules engine, not a closed-loop neural model. No peer-reviewed efficacy. ([Endel review](https://earlystagemarketing.com/endel-vs-brainfm/))
- **Brain.fm** — open-loop "rhythmic modulation" presets, but **actually has peer-reviewed evidence** (Morillon & Bhatt 2020 etc.) for focus-related neural change. Still no realtime biosignal input.
- **Apple Music** — added an Ambient widget (Sleep/Wellbeing categories) and is publishing diffusion-based controllable-music research, **but no public adaptive API**. ([Apple Music 2026 update](https://www.headphonesty.com/2026/02/apple-music-dropping-update-vs-spotify/))
- **Gemini / Google** — generative music in consumer apps via Lyria 3 (10 free tracks/day), and Lyria RealTime in the developer API.
- **Calm / Headspace** — AI is mostly content-generation and copilots; **no closed-loop signal-driven audio**.

The **Audicin × IDUN partnership at CES 2026** is the loudest signal that "personalised, EEG-guided binaural" is the next race — but they haven't shipped a consumer product yet. ([Audicin](https://audicin.com/blog/5-things-we-learned-about-binaural-beats-in-2025))

## 5. Closed-Loop Neurofeedback That Actually Works

What the recent literature supports vs. handwaves:

- **EEG-guided binaural beats** — randomised, double-blind, sham-controlled crossover trial published 2025 (MDPI Neurosci) — adaptive frequency drove subjects into low-frequency relaxation bands within 7–9 min. **This is real, and the trial design is good.** ([MDPI 5/4/44](https://www.mdpi.com/2673-9488/5/4/44))
- **Acoustic stimulation phase-locked to slow oscillations** in deep sleep — well-replicated effect on slow-wave amplitude; this is what Muse Athena's Deep Sleep Boost is doing. ([Targeting Sleep Disruption — Divergence Neuro](https://www.divergenceneuro.com/targeting-sleep-disruption-with-remote-neurofeedback-and-biofeedback/))
- **Closed-loop haptic biofeedback for sleep onset** — arxiv 2025 study: increases parasympathetic activity in the short window, but **failed to move sleep-onset latency**. Lesson: haptic alone underperforms; audio-driven entrainment + breath pacing is the stack with most evidence. ([arxiv 2507.02432](https://arxiv.org/html/2507.02432v1))
- **Personalised binaural (facial-analysis-tuned)** — small open-label insomnia pilot, 70% treatment response over 4 weeks. Promising, not definitive.

The reproducible mechanisms with the strongest signal: **slow-wave entrainment in NREM, alpha/SMR uptraining for sleep onset, 0.1 Hz resonance breathing for vagal tone, EEG-adaptive binaural for anxiety.**

---

## The Killer-App Gap

Every demo you can find in 2026 is either (a) generative audio with a static prompt, or (b) biosignal tracking that draws a chart. **Nobody has shipped: a consumer iPhone app where a continuously generated, full-fidelity music stream is steered every 2 seconds by HRV + breath + (optional) EEG — with evidence-backed targets (slow-wave audio in NREM, 0.1 Hz cardiac coherence in waking).** Lyria RealTime + Polar BLE SDK + RHYTHMIX's existing generative chops makes this a 90-day MVP.

## Three App-Idea Seeds at the Intersection

1. **RHYTHMIX RESONATE — closed-loop coherence audio.** Polar Verity Sense (or Watch via workout session) → live HRV → Lyria RealTime WebSocket. Music tempo, harmonic density, and sub-bass LFO are bound to *your* current HRV vs. target coherence (0.1 Hz). Reward signal = "the music gets richer as you breathe into resonance." Differentiator vs. Endel: it actually closes the loop on *your* nervous system, not the weather. Clinical hook: the EEG-guided binaural literature transfers cleanly.

2. **RHYTHMIX DEEP — phase-locked slow-wave music for sleep.** Muse S Athena raw EEG → detect NREM N3 + slow-oscillation up-state → emit ~50 ms generative musical "ping" (pink-noise-shaped sub-bass, RHYTHMIX-styled, not lab pink noise) phase-locked to the up-state. Same mechanism as Athena's Deep Sleep Boost, but with RHYTHMIX-quality musicality and a continuous Lyria-generated bed so it feels like music, not a stimulator. This is the most defensible idea — it has *real* peer-reviewed mechanism behind it.

3. **RHYTHMIX FLOW — adaptive focus stream for ADHD/knowledge workers.** MW75 Neuro or MN8 → focus score → Lyria RealTime steers tempo + harmonic complexity to keep you in your personal flow band (calibrated over the first week). When focus drops, the stream gets sparser + more rhythmic; when you're locked in, it gets denser + more harmonic. Differentiator vs. Brain.fm: actually closed-loop on *your* brain instead of a generic preset. Differentiator vs. Neurable's own app: real generative music, not just a focus dashboard.

The cleanest first ship is #1 — Watch + Polar are widely owned, no EEG hardware barrier, and the 0.1 Hz coherence story is already in RHYTHMIX FREQUENCY's DNA. #2 is the most scientifically defensible and where the brand could credibly say "wellness as medicine." #3 is the biggest market but the most crowded.

---

## Sources

- [Neurosity Crown specs](https://neurosity.co/tech-specs)
- [Muse S Athena product page](https://choosemuse.com/products/muse-s-athena) + [Deep Sleep Boost](https://www.luxuriousmagazine.com/muse-athena-deep-sleep-boost/)
- [Neurable MW75 Neuro LT](https://www.neurable.com/products/mw75neurolt)
- [Emotiv MN8](https://www.emotiv.com/products/mn8) + [Cortex API](https://emotiv.gitbook.io/cortex-api)
- [Naqi Logix — CES 2026](https://www.ces.tech/ces-innovation-awards/2026/naqi-neural-earbuds-with-invisible-user-interface/)
- [OpenBCI Galea V2 review](https://techgolly.com/openbci-galea-v2-review-in-2026)
- [Apple Developer — realtime HR](https://developer.apple.com/forums/thread/756354)
- [Oura API](https://support.ouraring.com/hc/en-us/articles/4415266939155-The-Oura-API)
- [WHOOP Developer](https://developer.whoop.com/api/)
- [Polar BLE SDK](https://github.com/polarofficial/polar-ble-sdk)
- [Lyria RealTime docs](https://ai.google.dev/gemini-api/docs/realtime-music-generation) + [DeepMind page](https://deepmind.google/models/lyria/lyria-realtime/)
- [Magenta RealTime on HF](https://huggingface.co/google/magenta-realtime)
- [Suno v5.5](https://www.cometapi.com/suno-v5-5-what-is-new-and-how-to-use-it-via-api--studio/)
- [Udio API](https://musicapi.ai/udio-api)
- [ACE-Step on Replicate](https://replicate.com/lucataco/ace-step)
- [Endel vs Brain.fm 2026](https://earlystagemarketing.com/endel-vs-brainfm/)
- [Apple Music 2026 ambient widget](https://www.headphonesty.com/2026/02/apple-music-dropping-update-vs-spotify/)
- [EEG-guided binaural RCT (MDPI 2025)](https://www.mdpi.com/2673-9488/5/4/44)
- [Closed-loop haptic biofeedback for sleep (arxiv 2507.02432)](https://arxiv.org/html/2507.02432v1)
- [Audicin × IDUN CES 2026](https://audicin.com/blog/5-things-we-learned-about-binaural-beats-in-2025)
- [Divergence Neuro — sleep neurofeedback](https://www.divergenceneuro.com/targeting-sleep-disruption-with-remote-neurofeedback-and-biofeedback/)
