# TYMPAN — real-time environmental EQ for hearing aids

## Pitch

50M+ hearing-aid wearers worldwide. Most aids are tuned by an audiologist once a year in a sound-treated booth. The world outside that booth — restaurants, car cabins, churches, kitchens — doesn't behave like the booth. TYMPAN uses the phone's mic plus an on-device audio classifier to identify the kind of room you're in and re-shapes the EQ curve sent to paired aids in real time, four-second cadence. Mimi and Petralex re-tune to your audiogram. TYMPAN re-tunes to your *room*.

## TAM

- 50M+ hearing-aid wearers globally; ~15M in the US.
- ~70% of aid wearers report dissatisfaction with their aids in noisy environments — the single biggest driver of drawer abandonment.
- Hearing-aid market: ~$10B/yr globally, growing ~6% CAGR.
- Companion-app + remote-fitting market is growing ~25% YoY as MFi/ASHA/LE Audio matures.
- OTC aid market (Lexie, Eargo, Sony, Jabra Enhance) added roughly 3M new wearers in 2023–24 and is the fastest-growing segment — and the most app-friendly entry point.

## Why now

- **Bluetooth LE Audio + Auracast finalised 2023.** Multi-stream, low-latency, broadcast-capable. The first protocol that lets an external app push deep DSP changes to aids at sub-50ms latency.
- **On-device audio classifiers got small.** Sound-scene classifiers (YAMNet-class) now run in a few MB on a phone with negligible battery cost. Five years ago this required cloud round-trips that broke the latency budget.
- **Aid manufacturers are opening APIs**, slowly and reluctantly, via MFi (Apple), ASHA (Google), and the LE Audio spec. Phonak, Oticon, ReSound, Starkey, Widex, Signia all ship LE-Audio-capable aids in their current flagship lines.
- **OTC aids** (FDA category live since Oct 2022) ship with apps as a default expectation. Wearers under 70 expect their aids to behave like AirPods, not like 1990s medical devices.

## Tech

- **Audio environment classifier** on the phone. Multi-label, 30+ scene classes (restaurant, car cabin, outdoor with wind, quiet domestic, reverb-heavy, music, kitchen, etc.). Trained on a proprietary corpus + public datasets (AudioSet, ESC-50, DCASE). Runs at ~4-second windows, ~30ms inference on modern phones.
- **EQ curve generator**. Per scene class, a target 8-band curve (250Hz–8kHz). Modulated by user audiogram + per-room learned preferences. Smoothed across transitions to avoid pumping.
- **BLE write layer**. Sends the curve to paired aids via MFi (iOS), ASHA (Android), or LE Audio (both). Most modern aids accept programmable EQ over the protocol; older aids fall back to streamed audio with curve baked in.
- **Per-user calibration** that learns from "I like this" / "too quiet" / "too sharp" thumbs in the app. Reinforcement loop on top of the base curve. Per-room memory.
- **Cloud sync** of shared profiles between wearer and audiologist (opt-in). Audiologist-side dashboard shows the rooms the patient has been in, the curves applied, and which ones the patient overrode — a *much* richer signal than the annual booth visit produces.

## Regulatory

In the US, TYMPAN's status depends on the aid it's paired with:

- **OTC aids** (Lexie, Eargo, Sony CRE-C/CRE-E, Jabra Enhance): FDA Class I, accessory-app status. Low regulatory friction. **This is our launch market.**
- **Prescription aids** (Phonak, Oticon, ReSound, Starkey, Widex, Signia): paired aid is Class II, but TYMPAN as an *accessory app* that doesn't itself diagnose or amplify can stay Class I if scoped carefully. We avoid any claims of diagnostic value or substitution for fitting.
- We will not bundle TYMPAN with a prescription aid as a marketed combination — that would pull us into Class II for the combined system.
- EU: lighter touch under MDR if positioned as a "wellness accessory app." UK MHRA: similar.

We will register as a Class I medical device manufacturer in the US in year one regardless, to keep the audiologist channel open.

## 90-day GTM

**Day 0–30: one OTC aid brand partnership.** Pick one — likely Lexie or Jabra Enhance, both of which have public APIs and a willing partner attitude. Build the integration. Co-market on their wearer mailing list.

**Day 30–60: senior-tech reviewer marketing.**
- AARP app reviews are the single largest driver of senior software conversion. We pitch AARP's tech editorial team a hands-on review.
- "Doctor Cliff AuD," Hearing Tracker, and three or four other AuD-influencer YouTube channels drive massive intent traffic among self-directed aid wearers. We seed pre-release units and ask for honest reviews.
- Reddit r/HearingAids (~60k members) and the Hearing Loss Association of America forums.

**Day 60–90: audiologist clinic pilots.** Sign 5–10 progressive clinics on the clinic-pays-$0-for-patient model. Their patients use TYMPAN free, the clinic pays per seat, and the clinic gets the dashboard. This is the wedge into the prescription-aid market — the audiologist becomes the upsell channel, not the gatekeeper.

## Moat

1. **Audio-environment corpus.** Every TYMPAN user contributes (opt-in, anonymised) audio-scene fingerprints back to the classifier. Within a year we have the largest labelled corpus of *real-world wearer environments* on the planet. Mimi and Petralex don't collect this — they're audiogram tools.
2. **Aid-brand partnerships.** Each integration is months of work and signed by name. Five brands deep, this is a multi-year head start against any new entrant.
3. **Clinical-grade audit logs.** Every curve change, timestamped, with the room class that triggered it. This is the artifact that lets audiologists trust the app — and it's the one thing a pure consumer-audio competitor will never bother to build.
4. **Per-wearer learned preferences.** The first 90 days of use produces a per-user model that doesn't transfer to a competitor. Switching cost compounds with every room visited.
