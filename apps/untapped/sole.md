# SOLE

**30 seconds a day. One foot saved.**

## Pitch
540M diabetics worldwide. ~150k US amputations/year from foot ulcers — 50%+ preventable with early detection. SOLE: daily 30-second foot photo, AI flags pre-ulcerative changes (erythema, edema, temperature differential) BEFORE the skin breaks. Reimbursable under Medicare RPM CPT codes 99453 / 99454 / 99457. Limb-saving software at scale.

## TAM
- **Global diabetics:** 540M (IDF Atlas 2021). Projected 783M by 2045.
- **US diabetics:** ~37M.
- **High-risk subset (neuropathy + previous ulcer history):** ~5M US patients.
- **US amputations from diabetic foot ulcers:** ~150,000/year. Cost per amputation: $40k+ acute, $80k+ first-year total.
- **Medicare RPM market:** $1B+ in 2024, growing 30% YoY. Specifically diabetic monitoring is the fastest-growing segment.

## Who buys
- **Endocrinology clinics** (primary channel — they already see these patients monthly).
- **Podiatry practices.**
- **Medicare Advantage plans** — every avoided amputation saves ~$80k+. The math works at any price point.
- **VA system** — disproportionately high diabetic-amputation population among veterans.
- **Patient direct (cash pay)** — for the 30%+ uninsured/underinsured diabetic population.

## Why now
- **Smartphone macro lenses** (iPhone 13 Pro+ and Android equivalents) image foot skin at sufficient resolution.
- **Small CV models** detect erythema, edema, callus formation at pre-ulcerative stage.
- **Medicare RPM reimbursement** (codes 99453/99454/99457, established 2019, expanded 2020) covers daily monitoring at ~$120-150/patient/month to providers.
- **Diabetic neuropathy** means patients literally cannot feel developing wounds — they need objective monitoring.

## Tech
- **Image preprocessing:** lighting normalization, scale calibration (using a sticker reference or known-size landmark).
- **Stage-0 ulcer classifier:** trained on annotated podiatric dataset, multi-modality (RGB + temperature differential via thermal camera attachment or model inference from color).
- **Baseline tracking:** patient's own foot is the gold-standard control. Detect deviation from their 30-day baseline.
- **EHR integration:** Epic (App Orchard), Athena, eClinicalWorks. Read-only clinical context, write-back monitoring data.
- **HIPAA-compliant infrastructure:** mandatory.

## Regulatory pathway
- **FDA Class II SaMD** (Software as a Medical Device).
- Likely 510(k) clearance with a predicate device (TempStat, Podimetrics) or De Novo if no predicate fits.
- Clinical validation study: prospective cohort, ~500 high-risk diabetic patients, 12-month follow-up, primary endpoint = ulcer detection ≥7 days before standard-of-care detection.
- Pre-submission meeting with FDA in first 60 days.

## Pricing
- **Patient-facing: free** — billed through Medicare RPM codes to provider.
- **Provider revenue share:** SOLE takes 25-30% of the RPM reimbursement; provider keeps the rest.
- **Cash-pay tier:** $39/mo for uninsured patients.
- **Health plan B2B:** $15-25 PMPM (per member per month) for at-risk populations.

## 90-day GTM
- **Days 1-30:** Recruit clinical advisory board — 2 endocrinologists, 1 podiatric surgeon, 1 wound care KOL. File FDA pre-submission. Build MVP with photo capture + classifier + clinician dashboard.
- **Days 31-60:** Pilot with ONE large endocrinology practice — target a high-volume Medicare population (Florida, Arizona, Texas). 50 patients × 3 months. Co-author the case series.
- **Days 61-90:** Submit 510(k) (or De Novo). Publish pilot data at ADA Scientific Sessions or APMA. Begin discussions with 3 Medicare Advantage plans for pilot expansion.

## Moat
- **Clinical evidence:** the company with the best published outcomes wins. Every avoided amputation is a publishable case.
- **Reimbursement code mastery:** RPM billing is finicky; the clinic that knows how to bill cleanly retains the contract.
- **EHR integrations:** Epic App Orchard listing alone is a 6-month process; competitors are blocked from that channel until they replicate.
- **Patient retention via streaks:** behavior-change loop locks patients into daily check-ins → 90%+ adherence vs. 30% for typical RPM tools.

## Disclaimer
SOLE is monitoring + decision support, not diagnosis. Every flagged risk routes to the clinician; SOLE does not advise the patient to stop or start treatment.
