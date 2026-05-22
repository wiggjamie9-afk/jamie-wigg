# SPOT

**Is it a vet visit? Find out in 30 seconds.**

## Pitch
Photo the lump / rash / hot-spot on your dog or cat. AI triages: 🟢 watch 48hrs / 🟡 schedule a vet / 🔴 go now. Connects to a remote vet if urgent. Human teledermatology is unicorn-scale; pet teledermatology is fragmented per-clinic. Massive anxious-pet-parent market with no clean entry point.

## TAM
- **90M US households with pets** (66% of all households).
- **$147B US pet industry** (2024); **~$38B veterinary care** segment.
- **Estimated ~25-30% of vet visits** are "non-urgent but anxious parent" — this is the target slice, ~$10B/year.
- **Telehealth normalization** post-pandemic + post-2020 vet shortage = unmet demand.

## Who buys
- **Anxious pet parents** (millennials with first pet, multi-pet households).
- **Rural pet owners** without a 24h emergency vet within reasonable drive.
- **Insurers:** Trupanion, Lemonade Pet, Healthy Paws — SPOT triage reduces unnecessary ER claims (avg ER claim $400-800).

## Why now
- Multimodal vision models do dermatology triage at near-specialist accuracy for common conditions.
- Vet shortage: AVMA projects 24%+ unmet demand by 2030.
- Insurer push toward preventive / triage tools (lower claims).
- State telemedicine laws relaxed for vet care in most states post-2020 (VCPR still required in many).

## Tech
- **Triage classifier:** image model trained on annotated vet-derm dataset (~50k images, multi-species). Output: top-3 conditions with confidence + escalation level.
- **Vet-on-call:** integration with national tele-vet networks (Vetster, Airvet, BondVet) for licensed handoff.
- **Pet profile:** breed-specific risk factors (e.g. brachycephalic breeds + skin-fold dermatitis).
- **Photo guidance:** real-time camera coach (lighting, distance, focus) — most user photos are unusable for vet review.

## Regulatory strategy
- **VCPR (Veterinarian-Client-Patient Relationship)** required in most states for actual diagnosis/prescription. SPOT is **triage** (decision support) which doesn't require VCPR.
- Partner with established tele-vet networks for the licensed-handoff piece.
- Audit trail for every triage call — defensible if a missed-condition lawsuit comes up.

## Pricing
- **$9/mo unlimited triage** — primary consumer SKU.
- **$19 one-off vet call** when escalated (revenue share with tele-vet partner).
- **Insurer partnerships:** $0 to consumer, paid per-triage by insurer (claim avoidance).

## 90-day GTM
- **Days 1-30:** Build with 5 board-certified veterinary dermatologists as clinical advisors. Get derm KOL (e.g. ACVD member) on advisory board.
- **Days 31-60:** Pilot with ONE insurer (Lemonade Pet most likely — youngest tech stack, eager for innovation). 1000-pet beta. Measure claim avoidance.
- **Days 61-90:** Pet-influencer launch on Instagram / TikTok — #dermdogs and similar tags. Partner with rescue orgs as a free service (foster homes need this).

## Moat
- **Vet-derm training data:** breed × condition × stage = combinatorially expensive to annotate. First-mover here is hard to beat.
- **Insurer integrations:** sticky multi-year contracts.
- **Vet advisory board credibility:** consumers and regulators both demand this.

## Disclaimer
SPOT is triage. Not diagnosis. Marketing copy says this on every page. Emergency conditions (bleeding, anaphylaxis, seizure) get an immediate "🔴 GO NOW — do not wait for triage" override that doesn't run the classifier at all.
