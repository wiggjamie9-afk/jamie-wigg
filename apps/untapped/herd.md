# HERD

> Smallholder livestock computer vision. Walk the pasture with your phone. AI flags lameness, mastitis, early calving, body condition, and poor rumination before the loss compounds.

## Pitch

Cainthus, Connecterra, and DeLaval sell livestock CV to enterprise dairies running 500+ head at $50,000+/year. Roughly **500 million smallholder livestock farmers worldwide** — concentrated in India, Pakistan, Bangladesh, Kenya, Ethiopia, Tanzania, Nigeria, Brazil — have nothing. Their entire diagnostic stack is "did the cow look funny this morning."

HERD ships the same vision capability — gait analysis, udder asymmetry, parturition prediction, body condition scoring, rumination counting — to a $80 Android handset, fully offline. One avoided vet emergency saves a smallholder a week's household income. The product is mobile-first, voice-first, low-literacy-friendly, and localised to the breed and language of its market.

## TAM

| Geography | Households with <20 head | Notes |
|---|---|---|
| India | ~75M dairy households | NDDB census; ~80% own 1–3 cows |
| Ethiopia | ~12M smallholder cattle households | Largest livestock population in Africa |
| Pakistan | ~9M | Punjab + Sindh dairy belt |
| Nigeria | ~5M+ | Fulani pastoralist + sedentary mixed |
| Bangladesh | ~5M | Mostly women-managed |
| Tanzania | ~4M | EADD-supported co-op network |
| Kenya | ~1.8M | KDB + KENFAP networks |
| Brazil | ~1M smallholder cattle | NE region beef + small-scale dairy |
| Other (LATAM, MENA, SEA) | ~30M+ | Aggregate |

**Total addressable: ~150M+ farming households globally with <20 head of livestock.** Annual ag-tech spend per household is currently $5–50 and growing as mobile money + extension digitalisation programmes accelerate. Captured at $1.50/cow/month direct or $0.40/cow B2B through extension agencies, the addressable market is **~$5–10B/year**. The unit economics are unlocked entirely by the smartphone — there is no other tooling that scales here.

## Why now

- **Smartphone penetration crossed 60% in target markets in 2023** (GSMA Mobile Economy Report); the average $80–120 Android handset now ships with a camera + NPU capable of running TFLite vision models on-device.
- **Small CV models can do livestock body-pose estimation locally** — recent work from MIT-IBM, Iowa State, and Cornell shows YOLOv8-pose + lightweight regression heads hit clinical thresholds at < 200MB.
- **Ag-extension digitalisation is being funded** at scale: Gates Foundation, BMGF, World Bank, FAO Digital Agriculture, and bilateral DFIs (FCDO, GIZ, USAID) are actively deploying mobile-first ag tools across the same target markets — HERD slots into existing distribution.
- **Mobile money is solved.** UPI, M-Pesa, bKash, Pix mean per-cow billing actually settles at $1.50/month without a credit card.

## Tech

- **Multi-task vision model.** Single inference produces gait keypoints, udder/limb segmentation masks, body-condition regression, and parturition-posture classification. Trained on ~140K farmer-collected clips labelled by partner veterinary schools.
- **Runs on a $80 Android** via TFLite + GPU delegate. Cold inference < 600ms, sustained 4 fps in walk-by mode.
- **Cow ID** via ear-tag OCR (where tagged) or muzzle-print biometrics (where not — equivalent to fingerprint for cattle, no marking needed).
- **Offline-first.** Full model + last 30 days of herd data on-device. Syncs to co-op cloud over any connection it sees — including 2G SMS fallback for vet referrals.
- **Audio rumination.** A 60-second microphone capture estimates cud-chews per minute — earliest sickness signal we have, often 24h ahead of visual symptoms.

## Cultural localisation

In every target region, **women manage 50%+ of small-scale dairy** but receive a fraction of the extension contact hours men do. The product is built around them:

- Voice-first UX. Every alert is also a 4-second audio clip in the user's language.
- Iconography over text. Severity is colour + shape + icon, never text-only.
- Numerical literacy assumed at primary-school level. No graphs without a sentence equivalent.
- Six languages live at launch: Hindi, Kiswahili, Bengali, Portuguese (BR), English, plus one regional minority script per pilot district. Arabic and Tagalog are next.
- Distribution partnerships with women's self-help-group networks: **SEWA** in Gujarat, **KENFAP** in Kenya, **BRAC** in Bangladesh.

The tone is firm: smallholders are expert livestock operators. They know their animals. HERD is *not* training them — it's giving them tooling at the same fidelity as a $50K enterprise platform.

## 90-day GTM

**Start with one co-op. Not Amul — too big and too political. Pick a state-level dairy union that already wants this.**

1. **Days 0–30.** Sign a co-funded pilot with **Karnataka Milk Federation (KMF)** in India *or* **Kenya Dairy Board** in KE — both have active digital extension programmes and have already RFP'd for adjacent tooling. Co-funder: Gates Foundation Agricultural Development (already deploying digital ag in both countries) or Heifer International.
2. **Days 30–60.** Deploy to one district. Train the local extension agents as the trust bridge — they hand-deliver the app to ~ 500 households, photograph 5 reference cows per household to bootstrap individual identification, and remain the human escalation point.
3. **Days 60–90.** Measure against a matched control: emergency vet calls, mastitis incidence, lactation yield, mortality. Target metrics: 30% drop in emergencies, 4× earlier mastitis catch, 5%+ lactation gain. Publish numbers with the partner — extension agencies sell other extension agencies.

Then replicate. The unit of replication is the **co-op partnership**, not the user acquisition — co-ops already have the trust infrastructure HERD needs.

## Moat

Three compounding moats, all of which take years to replicate:

1. **Training data.** Livestock CV training data is rare and expensive — the enterprise vendors hoard theirs. HERD's data comes from partner co-ops + veterinary schools and is licensed back to the co-op. Within 18 months the dataset is the largest smallholder livestock CV corpus on earth, and growing exponentially with deployment.
2. **Breed-specific models.** A Holstein and a Sahiwal have different gait baselines. A Gir's BCS rubric is not a Brahman's. Each market needs its own model variant — Brahman (BR), Holstein-Friesian (KE/IN crossbred), Sahiwal (PK/IN), Gir (IN/BR), East African Zebu (KE/TZ), Red Sindhi (PK/BD). This is a deep specificity moat that generic CV products cannot ship.
3. **Co-op distribution.** Once a state dairy union has wired HERD into membership benefits, the union is the buyer of record forever. The switching cost is the next vendor's onboarding of every smallholder in the district. Effectively, the moat is the trust infrastructure of the co-operative itself.

---

**Status.** Pre-pilot. Looking for one dairy co-op + one foundation co-funder to start a 90-day measured deployment.
