# Spatial Audio + Spatial Computing — Mid-2026 State of Play

> Stream 2 of 4 in the "outstanding emerging tech for a new app" research bundle.

## 1. Hardware install base (the realistic addressable market)

**Apple Vision Pro / Vision Pro M5 (Oct 2025 refresh).** ~390k units in 2024, then collapsing — IDC pegs Q4 2025 shipments at ~45k, with a roughly 95% pullback in ad spend. The M5 refresh is the *only* Vision Pro in 2026; Vision Pro 2 and the cheaper "Vision" variant have both slipped to 2027 or beyond. Cumulative global install base in mid-2026 is realistically **600–800k**, of which probably 300–400k are actively used monthly. Niche, premium, but high-ARPU — initial users are not price-sensitive.

**Meta Quest 3 / 3S / (Quest 4 late-2026).** Quest 3 crossed 1M+ in 2024; Quest 3S has been the volume driver since late-2024 ($299) and Amazon alone moved 80k in a single Cyber Monday week. The total Quest 2/3/3S active install base is conservatively **18–22M** mid-2026, with Quest 4 only landing in Q4 as a 2-SKU launch. This is **the only XR platform with mass-market reach.**

**Samsung Galaxy XR ("Project Moohan").** Launched Oct 21 2025 at ~$1,800–2,800. Snapdragon XR2+ Gen 2, 4K micro-OLED, runs Android XR. Early sales modest (low six figures projected for first 12 months). Strategically important — it's the headset Google is funnelling Gemini, YouTube, and Android XR partnerships through — but the *user base* is still tiny in mid-2026.

**Bigscreen Beyond 2.** ~10k units/year. PC VR enthusiast only. Ignore for app distribution; relevant only as a content-quality reference target.

**Xreal / Viture AR glasses.** Xreal crossed **1M lifetime units** by end-2025 (36% global AR display share); Viture is the strong #2. These are display glasses (tethered HDMI/USB-C "personal monitor"), not spatial computers. No serious 6DoF tracking. Audio is stereo with limited head-tracking. Big install base, weak surface for spatial audio creation.

**Meta Ray-Ban Gen 2 + Oakley Meta HSTN / Vanguard.** Ray-Ban Meta sales surpassed **2M units** since 2023; Meta's production capacity is scaling to **10M/year by end-2026**. Oakley HSTN ($399) is the active-lifestyle SKU. These are *the* breakthrough wearable of 2025–26 — speakers + open-ear audio + camera + Meta AI. No display on Gen 2 (the displayed Ray-Ban variant is rumoured for late-26/2027). Massive distribution, audio-first, conversational AI native.

**Net takeaway:** if you want >1M reachable users for an audio-first product *today*, the answer is **AirPods + iPhone + Quest 3S + Ray-Ban Meta**, not Vision Pro.

## 2. Music + audio creation in spatial computing

**Logic Pro for iPad** runs on visionOS via compatibility mode (windowed iPad app) — workable but not native. **Neumann's VIS (Virtual Immersive Studio)** is the most interesting shipping example: free Vision Pro companion that lets you *spatially position Logic Pro tracks in 3D* by hand-gesture, with Neumann's RIME plugin handling 7.1.4 playback. This is the template for "Vision Pro as immersive control surface for a Mac DAW" rather than "DAW running on Vision Pro." Pro audio is taking this seriously.

**GarageBand** — still no native visionOS version (mid-2026). Apple's stance: Logic on iPad is the strategic surface.

**Endel on Vision Pro** — shipping; "Spatial Orbit" is their first immersive Spatial Audio soundscape. Generative + spatialised + visualised. The clearest *consumer* generative-audio app on Vision Pro.

**Tribe XR** — Pioneer/AlphaTheta DJ training in VR; running the first global DMC VR DJ Championship through Q4 2026. Solid niche on Quest. **PatchWorld / PatchXR** — multiplayer modular synth + reactive visuals in VR (Quest + PCVR), Pure Data/Max-inspired. The most genuinely *native* music creation in XR.

**Verdict:** Vision Pro music creation is *mostly empty.* Mac-tethered immersive mixing is the only real category with shipping apps. Quest has the energy — DJ, modular, multiplayer jam. There is no native, generative-first spatial music creation app that's actually good on either platform. This is the gap.

## 3. Spatial audio rendering tech — format war

**Apple ASAF + APAC** (revealed WWDC 2025). 5th-order ambisonics + objects + metadata, 80:1 compression, adapts in real time to listener position *and* virtual environment. visionOS 26's **Audio Ray Tracing** stores acoustic properties of your physical rooms and reuses them for faster room-impulse modelling. Vision Pro–exclusive today; will roll out across iOS/iPadOS/tvOS/macOS as Apple's house format. The visionOS 26 **Spatial Audio Experience API** finally fixes the "all audio from app's first window" anchor bug — multi-window spatial audio now works.

**IAMF / Eclipsa Audio** (Google + Samsung, AOMedia royalty-free). Shipping on **all 2025+ Samsung TVs and soundbars, all 2026 LG TVs**, YouTube uploads now support Eclipsa. Eclipsa 2.0 expanded object tracking and channel count. This is the open-standard counter-Atmos play, gaining real distribution through YouTube and the TV install base.

**Dolby Atmos.** Still dominant in streaming (Apple Music, Tidal). Atmos FlexConnect went production-ready at CES 2026. The legacy library moat is huge.

**Sony 360 Reality Audio.** Effectively losing — Tidal dropped it, mainly survives on Amazon Music HD + Deezer 360RA. Not strategically interesting in 2026.

**Verdict:** if you're targeting AirPods + Vision Pro, author in **ASAF/APAC**. If you're targeting TVs, soundbars, YouTube, Samsung XR — **IAMF/Eclipsa**. Atmos is the universal export. Plan dual-export from day one.

## 4. AirPods Pro 3 / AirPods Max 2

**AirPods Pro 3** (Sept 2025, shipping through 2026): in-ear **optical heart-rate sensor**, dynamic head tracking, *clinical-grade hearing-aid mode* with automatic Conversation Boost, scientifically-validated Hearing Test, live translation, 67% more transparency battery. This is the single most under-exploited audio platform of 2026 — **HR + head pose + ANC + spatial audio in 60M+ ears**. AirPods Max 2 has not refreshed in 2026; speculation only.

**The big unlock:** AirPods Pro 3 turns *any* iPhone into a wearable biometric + head-pose + audio-output rig. You do not need a Vision Pro to do spatial, biometric-reactive audio. This is the single most important hardware fact for the founder.

## 5. Generative spatial scenes + soundscapes

The leader is **research**, not product. Apple's **ImmerseDiffusion** (Oct 2024) is the cleanest end-to-end generative 3D soundscape diffusion model, conditioned on spatial+temporal+environmental tags. **SonicMotion** (Sep 2025) generates **First-Order Ambisonics with moving sources** from text. Diffusion + HOA + scattering delay networks now produce convincing moving 3D soundscapes. Meta's AudioBox (the 2023/24 release) hasn't received a major spatial follow-up — Meta's energy has gone to Movie Gen and image/video.

**Endel** is the only company with a *shipping consumer product* doing real-time generative spatial soundscapes. Nobody else is close. This is wide-open.

## 6. Music + meditation/wellness in XR

**TRIPP** (~$26M raised, 2017): biggest VR meditation brand, subscription model on Quest/Vision Pro/mobile. Retention solid in headset; the mobile cross-sell is the actual business. **Maloka** (Quest) — island-progression gamified meditation. **Healium** — biometric-driven, clinical positioning. **Liminal** — science-backed micro-experiences, ~1.6M user data points. **Headspace XR** — Headspace's young-adult Quest spinoff.

**What's working:** session completion in headset is high, daily streaks via gamification (Maloka). **What's missing:** generative content (every session is hand-authored), audio personalised to *your* biometrics in real time, cross-device continuity (start on AirPods walking, finish in Vision Pro). Retention beyond month 3 on Quest wellness apps remains the unsolved problem — these are weekly/monthly products, not daily.

---

## Indie-team feasibility from an iPhone-first founder

| Surface | Reach 2026 | Indie feasibility (iPhone-only dev) |
|---|---|---|
| Vision Pro native | ~500k MAU | Hard — needs Xcode + Mac; visionOS App Store is not a gold rush |
| Vision Pro companion-to-Mac (like VIS) | Same | Hard — Mac DAW required |
| Quest 3/3S native | ~20M MAU | Medium — Unity/Unreal; can develop on Mac/PC, not iPhone |
| iPhone + AirPods Pro 3 | ~1B+ AirPods, ~250M iPhones | **Easy** — Swift, CoreMotion, HKWorkout, PHASE, Spatial Audio APIs all work iPhone-first |
| Ray-Ban Meta + iPhone | ~10M by end-26 | Medium — Meta's developer access is limited; audio companion via iOS app is fine |
| IAMF/Eclipsa publishing to YouTube | Massive | Easy — author once, distribute via YouTube |

**The single most honest answer:** the founder's iPhone-first constraint pushes them squarely toward **AirPods Pro 3 + iPhone as the primary device, with optional Vision Pro/Quest companion experiences**. That's not a downgrade — it's where the actual users are.

---

## Three concrete app concepts where RHYTHMIX + FREQUENCY assets give an unfair edge

### Concept 1 — **FREQUENCY Spatial** (iPhone + AirPods Pro 3 first, Vision Pro second)
*Real-time HRV-reactive generative spatial soundscape for breathwork/contemplative practice.*
- Reads AirPods Pro 3 heart rate + iPhone gyro head-pose. Generates a personalised ambisonic soundscape that *physically circles you* synced to your breathing — slowing rotation = downshift, biometric feedback loop closes.
- RHYTHMIX FREQUENCY's existing contemplative audio library = pre-trained stem bank. The generative layer is a small diffusion model that re-mixes stems in 3D space.
- Vision Pro version adds visual ambisonic "weather" tied to the same model.
- **Unfair edge:** the founder already owns a contemplative audio catalog and a generative music engine. Nobody at Tripp/Maloka/Endel has both.
- **Monetisation:** $14.99/mo, sticky because the model learns *your* breathing.

### Concept 2 — **RHYTHMIX Live Room** (Vision Pro companion to a Mac/iPad DAW, Neumann-VIS pattern)
*Spatial mixing surface for the RHYTHMIX-generated catalog — drag your AI-generated stems into 3D space, export ASAF + IAMF + Atmos in one pass.*
- Solves a real RHYTHMIX user pain: "I generated 12 stems, now what?" Becomes the upsell from generation → mastering → distribution.
- Targets the existing RHYTHMIX paid base, not Vision Pro buyers in general — every Vision Pro owner who's also a RHYTHMIX user is a guaranteed conversion.
- **Unfair edge:** RHYTHMIX already owns generation + mastering + distribution. Adding spatial authoring closes the loop. No competitor has all four.
- **Monetisation:** add-on tier to RHYTHMIX Pro, $20/mo. Distributes the output via RHYTHMIX's existing rails.

### Concept 3 — **FREQUENCY Walks** (iPhone + AirPods Pro 3 + Ray-Ban Meta optional)
*Generative spatial audio walks — your environment, your pace, your heart rate drive an ambisonic composition that mixes RHYTHMIX music with FREQUENCY contemplative beds, plus optional AI narration via the Ray-Ban Meta speakers when you're outside.*
- Think Endel + Calm Walks, but generated per-user, per-walk, in spatial audio, with a wearable-camera context layer (Ray-Ban Meta sees your park; the soundscape responds).
- AirPods Pro 3 head-tracking pins ambient sounds to physical locations as you walk.
- **Unfair edge:** RHYTHMIX has generative music; FREQUENCY has contemplative sound + breath IP; combined with HR + GPS + (optional) camera context, this is a defensible new category — *generative spatial wellness in motion*.
- **Monetisation:** $9.99/mo consumer; bundles with FREQUENCY.

**Pick to ship first: Concept 1.** Smallest hardware footprint, highest reuse of existing FREQUENCY assets, fastest path to a TestFlight beta from an iPhone-only founder, and the only one that doesn't depend on Vision Pro/Quest user count to work.

---

## Sources

- [Apple Vision Pro shipments plunge to 45K (WebProNews)](https://www.webpronews.com/apple-vision-pro-shipments-plunge-to-45k-amid-high-costs-production-cuts/)
- [Vision Pro still failing to catch on (MacRumors, Jan 2026)](https://www.macrumors.com/2026/01/02/vision-pro-still-failing-to-catch-on/)
- [Quest 3S Cyber Monday sales (Gizmodo)](https://gizmodo.com/amazon-already-sold-80k-meta-quest-3s-units-cyber-monday-record-low-could-wipe-out-final-stock-2000693809)
- [Samsung Galaxy XR / Project Moohan launch (Tom's Guide)](https://www.tomsguide.com/computing/vr-ar/samsung-to-hold-project-moohan-android-xr-headset-event-heres-what-we-know)
- [Ray-Ban Meta 2M+ units, 10M/yr capacity (Parameter)](https://parameter.io/meta-meta-expands-ray-ban-and-oakley-ai-smart-glasses-to-south-korea-as-global-wearable-push-accelerates/)
- [Neumann VIS for Vision Pro (SoundGuys)](https://www.soundguys.com/nuemann-makes-spatial-audio-mixing-easier-with-the-apple-vision-pro-149151/)
- [Endel technology + spatial soundscapes](https://endel.io/technology)
- [PatchXR / PatchWorld](https://patchxr.com/)
- [Apple Spatial Audio Format (ASAF) + APAC (TechRadar)](https://www.techradar.com/audio/apple-quietly-just-unveiled-a-new-spatial-audio-format-that-expands-on-dolby-atmos-and-that-rivals-google-and-samsungs-eclipsa-audio)
- [IAMF spec v1.1.0 (AOMedia)](https://aomediacodec.github.io/iamf/v1.1.0.html)
- [Eclipsa Audio (Samsung Global Newsroom)](https://news.samsung.com/global/eclipsa-audio-ushering-in-a-new-generation-of-3d-sound-with-samsung)
- [AirPods Pro 3 launch (Apple Newsroom, Sep 2025)](https://www.apple.com/newsroom/2025/09/introducing-airpods-pro-3-the-ultimate-audio-experience/)
- [ImmerseDiffusion paper (arXiv)](https://arxiv.org/pdf/2410.14945)
- [SonicMotion (arXiv)](https://arxiv.org/html/2507.07318)
- [visionOS 26.4: Audio Ray Tracing room memory (UploadVR)](https://www.uploadvr.com/visionos-26-4-released-with-vr-foveated-streaming-improved-spatial-audio/)
