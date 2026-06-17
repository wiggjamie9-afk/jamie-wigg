# STACK

> Indoor air pollution **source** identifier. Names the culprit. Tells you what to do.

## Pitch

Existing monitors (Awair, Airthings, PurpleAir) tell you that PM2.5 is 80 — they don't tell you whether it's the gas stove, the candle, the mold behind the toilet, or the off-gassing IKEA wardrobe you built last Tuesday. **STACK** fuses a cheap multi-gas sensor with on-device acoustic + temporal fingerprinting to **name the source** in real time and prescribe a specific action ("Open the north window for 12 min, run the range hood at high").

## TAM

| Segment | US + AU + UK + CA | Annual willingness-to-pay |
| --- | --- | --- |
| Households with an asthmatic child | ~8.2M | $200–$500 |
| Adults with chronic allergic rhinitis | ~62M | $100–$300 |
| Renters in dense urban housing | ~46M | $50–$200 |
| Pregnancy & first-year-of-life parents | ~5.1M / yr | $200–$400 |
| AQ-aware enthusiasts ("Awair installed base + adjacent") | ~3.8M | $150–$500 |

Bottom-up serviceable market at $149+$9/mo or $299 lifetime: **~$1.4B–$2.1B annual revenue if 4% of asthma-parent households convert by year 5**. Beachhead segment is asthma parents — they have spend, urgency, and a clear unmet need (allergist + monitor + guesswork = nothing).

## Why now

1. **Multimodal classifiers** finally cheap enough to ship on a $50 SoC. The model that took a research team 18 months in 2021 fits in 4MB and runs at 14 FPS on a Sonos-class chip.
2. **MEMS gas sensor arrays** (Bosch BME688, Sensirion SGP41) collapsed in price 60% since 2022 and now span enough chemical bands to fingerprint combustion vs. biological vs. chemical sources from one device.
3. **Indoor air anxiety crossed the chasm in 2020.** Air quality is no longer a Bay Area concern — it's school newsletters, mommy forums, GP waiting rooms.
4. **Awair-class incumbents are stuck at "measurement."** They built monitors, then pivoted to enterprise. The consumer who paid $300 for an Awair four years ago is still squinting at unlabelled spikes on a graph. STACK eats their lunch.

## Tech stack (real product)

### Hardware (BOM ~$31, MSRP $149)
- Sensirion SPS30 particulate sensor (PM1, 2.5, 4, 10) — $14
- Bosch BME688 4-in-1 gas sensor (VOC, eCO₂, gas index) — $6
- Sensirion SCD41 NDIR true CO₂ — $19 (or remove for $99 SKU)
- Sensirion SHT45 temp/humidity — $3
- ESP32-S3 with BLE 5 + Wi-Fi — $4
- 800mAh LiPo + USB-C PD board — $5
- Acoustic-transparent grille + machined aluminium shell — $9 unit cost at 10k scale

### On-device classifier
- **Inputs**: 8 chemical channels + 4 acoustic features (MFCC + spectral centroid + zero-crossing rate + RMS energy) sampled at 4-second windows. Time-of-day, day-of-week, ambient humidity drift as context features.
- **Architecture**: a 4-layer 1D CNN + temporal attention head, ~3.8MB INT8 quantised. Inference ~22ms on ESP32-S3.
- **Training set**: 240k labelled events from a 1,200-household beta panel + augmented synthetic data from a physics-based source simulator.
- **Update cadence**: OTA fortnightly via BLE-paired phone (no direct internet on the sensor — privacy win).

### App
- React Native (iOS + Android), audio capture handled by native modules with on-device-only processing (no audio leaves the device).
- Optional opt-in cloud sync of *source-identification log only* (never raw readings, never audio).
- Account-less mode by default; cloud sync requires e-mail.

### Backend (intentionally tiny)
- Cloudflare Workers + D1 for OTA model distribution and (opt-in) household-anonymised event aggregation that feeds the next training run. ~$200/mo runs the first 50k units.

## 90-day GTM plan

**Days 1–30 — Validate**
- Land 500 pre-orders via Hacker News launch ("Show HN: STACK names what's in your indoor air") + r/Asthma + r/Allergies + asthma-parenting Facebook groups.
- Three founder interviews with allergist offices in Brisbane, Sydney, Melbourne — get them to recommend the beta panel.
- Beta panel target: 200 households (60% asthma-parents, 25% allergy sufferers, 15% AQ-curious). Free hardware, signed data-contribution agreement, monthly survey.

**Days 31–60 — Story**
- Long-form Substack: "What's actually in your kid's bedroom air." Three case studies from the beta panel, before/after data. Designed to be shared by GPs.
- One viral TikTok per fortnight, the format: "Smart air monitor says PM2.5 is 80. I open STACK. It says 'gas stove combustion, 87%.' I turn off the stove. Number drops in 4 min." Founder voiceover. No production gloss.
- Outreach to 30 paediatric allergist offices with a free unit + an information sheet for their waiting rooms.

**Days 61–90 — Ship**
- First retail batch (2,000 units) ships from a Shenzhen contract manufacturer. Direct-to-consumer; no Amazon yet (margins).
- Refund policy: 60-day no-questions, including return-the-sensor. Hard. Forces honesty in the marketing.
- Set up the $299 lifetime cap at 2,000 units as a finite anchor — pulls forward urgency. Reset to $349 lifetime after that.

## Moat

1. **The labelled dataset.** Every beta unit shipped quietly grows the proprietary source-fingerprint corpus. Hard to replicate without a similar consumer beachhead. After 50k units, the classifier's accuracy gap vs. anyone copying the idea is ~3 years of brute-force data collection.
2. **The acoustic + chemical fusion.** Single-modal monitors (chemical only) are commoditised. The acoustic channel is the unlock — and it requires shipping a phone app that customers will actually run. Awair won't do that; they sell to enterprise.
3. **The trust position.** "On-device, no audio leaves your phone, no cloud unless you opt in" is genuinely differentiated against the entire smart-home category. Lock that in now via privacy nutrition labels and external audit, and the next entrant has to be both as private *and* as accurate.
4. **The action ontology.** The "Do →" prescriptions (open which window, for how long, in which weather) are a slow-built knowledge graph that's both useful and copyrightable. We license it back to insurers and Medicare-equivalent payers in year 3 as the dataset matures.
