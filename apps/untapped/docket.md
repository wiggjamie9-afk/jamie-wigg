# DOCKET

**Your court date isn't waiting for a lawyer. Neither should you.**

## Pitch
80% of US tenants in eviction court are unrepresented. Same in family, small claims, and consumer debt. DOCKET scans court papers, extracts every deadline, drafts jurisdiction-correct responses with citations, and walks the user through filing. Not LegalZoom forms — actual litigation support.

## TAM
- **~30M US pro-se litigants/year** across eviction (3.6M filings), divorce/custody (~2M), small claims (~10M), debt collection (~7M), traffic/quasi-criminal (~rest).
- Eviction alone: defendants default in ~50% of cases because they don't answer in time. Default-judgment market is a clear measurable outcome.
- B2B: 132 state-funded legal aid orgs; 30+ state court self-help centers; 3 states with regulated non-lawyer practice (UT, AZ, MN).

## Why now
- LLMs can read AND draft jurisdiction-specific documents — needs RAG over state codes + local rules of court, not training-knowledge alone.
- Courts are openly looking to reduce default-judgment volume (clogs dockets, looks bad in disparity audits).
- Post-2020 e-filing in most states removes the courthouse-trip barrier.

## Tech stack
- RAG corpus per jurisdiction: state code + rules of civil procedure + local court rules + standing orders.
- Document parser: vision + text models read scanned/photographed court papers.
- Drafting layer: templated response skeletons + LLM fill-in with citation verification.
- Human-in-loop: attorney-of-record reviews every draft for $5-15 cost, or partner with legal aid for free tier.
- E-file integration: most states use Tyler Tech / Odyssey — open API in some, scraped in others.

## Regulatory strategy
The hard problem. Unauthorized practice of law (UPL) varies by state. Approaches:
1. **Partner-with-attorney model:** Every output reviewed by a licensed attorney before "filed." Charge for the software; the attorney bills the case at a minimal fee.
2. **Legal aid B2B:** Sell to legal aid orgs as a force-multiplier; they retain attorney supervision.
3. **Regulatory sandboxes:** UT and AZ allow regulated non-attorney legal services; start there for direct-to-consumer.
4. **Pure information mode:** Drop "drafting" and only "explain"; legally safe but less valuable.

## 90-day GTM
- **Days 1-30:** Pick ONE jurisdiction (e.g. Alameda County, CA — large unlawful-detainer volume + active legal aid). Build the eviction-defense flow end-to-end. Get 3 letters of support from local legal aid.
- **Days 31-60:** Pilot with East Bay Community Law Center or similar; 50 cases. Measure default-rate reduction.
- **Days 61-90:** Publish the pilot results. Press: ProPublica, The Marshall Project love this story. Apply to UT/AZ regulatory sandbox.

## Moat
- Jurisdiction-depth: 50 states × 3+ case types = 150+ legal corpora to maintain. Network effect: more cases → better drafts.
- Court partnerships: a court that whitelists your tool effectively kills competitors in that jurisdiction.
- Outcome data: every case won/lost teaches the system. Hard to copy.

## Disclaimer
This is decision support, not legal advice. Marketing copy reinforces this on every page. The unit economics depend on staying clearly on the right side of UPL.
