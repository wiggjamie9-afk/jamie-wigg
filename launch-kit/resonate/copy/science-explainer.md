# How RESONATE actually works — the closed loop, in detail

A standalone explainer. Readable as a newsletter, an "About the science" section on the landing page, an in-app lineage card, or a voiceover for the science clip. Roughly 620 words.

---

## The thesis

RESONATE is a *closed-loop* biometric music app. Most "adaptive" audio apps are open-loop — they choose a soundscape based on weather, time of day, or a static schedule. RESONATE is the first consumer app where the music being played is generated, in sub-two-second cycles, in direct response to the autonomic state of the person listening. The control signal is your own breath and heart. The output is full-fidelity music, head-tracked in 3D space, on the AirPods you already own.

Five things had to ship before this app was possible. They all did, between June 2025 and May 2026.

## The five enablers

**Lyria RealTime** (Google). A 48 kHz stereo generative music model that streams in two-second chunks and accepts a real-time control input. The first generative music model with a control input fast enough to feel like a loop. Open-source escape route: Magenta RT (Apache 2.0), so the architecture is not tied to one vendor.

**AirPods Pro 3** (September 2025). In-ear optical heart-rate sensor, dynamic head-tracking, hearing-aid-grade ANC, full Spatial Audio rendering. The biometric input and the spatial output are now in the same earbuds.

**Apple Watch + HealthKit.** Sub-second HRV streaming via `HKWorkoutSession` and `HKAnchoredObjectQuery`. (Polar Verity Sense via the Polar BLE SDK is the higher-fidelity fallback for users who want it; the architecture does not require it.)

**Apple Foundation Models** (iOS 26). A ~3B-parameter on-device LLM, accessible via Swift API. ~30 tok/s on iPhone 15 Pro. Free. No exfiltration. Privacy is no longer a promise — it is the architecture.

**ASAF + Audio Ray Tracing** (visionOS 26 / iOS 26). Generative ambisonic spatial output with room acoustics. The AirPods Pro 3's head-tracking becomes a believable three-dimensional sound stage instead of just stereo with motion.

## The loop

1. **Read.** Heart rate streams from the AirPods Pro 3 optical sensor. HRV streams from the Apple Watch. The current breath rate is estimated from the HRV trace and (optionally) microphone-derived nasal airflow.
2. **Generate.** The current autonomic state is mapped to a Lyria RealTime prompt schedule — denser/sparser, warmer/cooler, more/less harmonic. The model produces the next two seconds of audio.
3. **Render.** The generative stream is layered over a fixed FREQUENCY bed (solfeggio tones, drone pads, breath-paced LFOs from the existing `frequency.html` IP). The composite is spatialised through Apple PHASE + ARKit head tracking. The score circles you in 3D space.
4. **Respond.** As your breath approaches **0.1 Hz** — the resonance frequency identified by Lehrer and colleagues in 1995, where heart, lungs, and the vagus nerve enter cardiac coherence — the music opens. More harmonic. More spatial. More resolved.

Latency from biometric change to audible effect: under two seconds.

## 0.1 Hz cardiac coherence, briefly

At a breathing pace of roughly five and a half seconds in and five and a half seconds out, heart rate variability synchronises with respiration in what is called *respiratory sinus arrhythmia*. The resulting HRV waveform peaks at around 0.1 Hz. This synchronisation is consistently associated with parasympathetic activation, blood pressure baroreflex sensitivity, and a measurable shift in autonomic state. Lehrer's HRV biofeedback protocol — now standard in clinical biofeedback and adopted by HeartMath, Apollo, and others — uses exactly this rhythm. The orb in FREQUENCY's landing page already paces this breath. RESONATE makes the music respond to it.

## The EEG-binaural literature, honestly

We do not over-claim binaural beats. The literature is mixed. There is meaningful evidence that **rhythmic auditory stimulation** affects attention and arousal; the 2025 Lancet meta-analysis on music therapy reports large effect sizes against anxiety; gamma binaural beats are studied for sustained attention; delta entrainment is studied for sleep onset. RESONATE leans on the *observation* — that body-responsive music produces measurable effects — rather than any single mechanistic theory.

## What RESONATE doesn't claim

RESONATE does not treat anxiety. It does not treat ADHD. It does not treat insomnia. It does not stimulate the vagus nerve the way a Class III medical device does. It is a wellness practice designed to *support* attention, relaxation, and nervous-system regulation. The biometric readings are practice indicators, not clinical measurements. If you are experiencing a mental-health crisis or have a cardiac condition, please consult a qualified healthcare provider.

## Why now

Every one of the five enablers above shipped in shippable form within twelve months of this app's first commit. The window was small and it is now open. RESONATE is what fits inside it.

---

*Wellness practice · not a medical device · not for diagnosis*
