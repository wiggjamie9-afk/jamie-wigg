# Reference: Fintech GTM Prompts

## Purpose
Selling into fintech means every conversation circles back to risk, compliance, and regulatory exposure before it reaches business value. The gatekeepers are security and compliance teams — they can kill a deal no matter how enthusiastic the business sponsor is. Procurement cycles are long and checklist-heavy: SOC 2 Type II, PCI DSS, pen test results, and BAAs are table stakes, not differentiators. ROI framing must connect to fraud loss reduction, regulatory fine avoidance, or operational risk — not just efficiency. Not templates — starting points.

## Buyer landscape
- **Typical buyers:** Chief Risk Officer, VP of Compliance, Head of Fraud Prevention, CTO, CPO (product-led fintechs)
- **Common pains:** Fraud losses eating into unit economics, manual compliance workflows creating audit risk, real-time decisioning bottlenecks, regulatory changes (e.g., CFPB, PSD2) requiring fast system updates
- **Watch-outs:** Never skip the security review questionnaire — treat it as a sales asset, not a hurdle. Compliance buyers will not greenlight without a completed SIG or CAIQ. Buying cycles at regulated fintechs often span 6–12 months; at neobanks/crypto-native fintechs, cycles can be 4–8 weeks.

---

## Prompt 01 — Fraud ROI Cold Email
**Role:** SDR/BDR
**Trigger:** Target company is a payments processor, BNPL provider, or digital lender — fraud loss is a known cost line
**Structure:**
```
Subject: [Company]'s fraud loss rate — one number

[Name], [Company] processing [volume/segment] means fraud chargebacks are probably sitting at
[X% industry average]. We help [similar fintech] reduce that to [Y%] without adding friction
to the checkout flow. Happy to share the model. 15 minutes?
```
**Example output:** "Subject: Kredivo's fraud loss rate — one number\n\nRina, Kredivo processing BNPL volume in emerging markets means fraud chargebacks are probably sitting at 1.2–1.8% of GMV — the regional average for your segment. We helped Akulaku reduce that to 0.4% without adding a single extra step to the approval flow. Happy to share the model. 15 minutes?"
**Why it works:** Fraud buyers are measured on basis points of loss, not workflow efficiency. Leading with the specific loss number (and the industry benchmark) proves vertical knowledge and triggers a ROI-first conversation.
**Word count:** 60–80 words
**Avg. score:** 83–91

---

## Prompt 02 — Compliance Cycle Alignment Email
**Role:** SDR/BDR
**Trigger:** Target account is approaching a known regulatory deadline (e.g., CFPB rule, AML update, PCI DSS v4.0 migration)
**Structure:**
```
Subject: [Regulation] deadline — [Company]'s readiness

[Name], [Regulation] compliance deadline is [date]. Most compliance teams we talk to are
6–8 weeks behind where they want to be. We've helped [X fintechs] complete their [specific
control] without rebuilding their core stack. Worth a conversation before the crunch starts?
```
**Example output:** "Subject: PCI DSS v4.0 deadline — Mondu's readiness\n\nKlaus, PCI DSS v4.0 full enforcement lands March 2025. Most compliance teams we talk to are 6–8 weeks behind where they want to be on the customised approach controls. We've helped 14 B2B fintechs complete their scoping and evidence packages without rebuilding their core payment stack. Worth a conversation before the crunch starts?"
**Why it works:** Regulatory deadlines create non-negotiable urgency that the vendor didn't manufacture. Demonstrating you understand the specific control set (not just the regulation name) earns a seat at the table.
**Word count:** 60–80 words
**Avg. score:** 81–89

---

## Prompt 03 — Security Review Fast-Track Offer
**Role:** AE
**Trigger:** Deal is stalled because the security or compliance team has not completed their questionnaire review
**Structure:**
```
[Name], I know the security review is the blocker right now. We've pre-completed SOC 2 Type II,
PCI DSS SAQ, and CAIQ responses — they cover roughly 90% of the questions your team will ask.
Want me to send those directly to [Security Contact] so they're not starting from scratch?
```
**Example output:** "Daniel, I know the security review is the blocker right now. We've pre-completed our SOC 2 Type II report, PCI DSS SAQ-D responses, and CAIQ v3.1 — they cover roughly 90% of the questions Revolut's infosec team will ask. Want me to send those directly to your CISO so they're not starting from scratch?"
**Why it works:** Security reviews stall fintech deals more than any other step. Proactively offering completed questionnaire documentation removes the primary friction point and signals security maturity — which is itself a qualifying signal to compliance buyers.
**Word count:** 55–70 words
**Avg. score:** 84–92

---

## Prompt 04 — Real-Time Decisioning Discovery Opener
**Role:** AE
**Trigger:** Prospect has mentioned latency or throughput constraints in their fraud or credit decisioning pipeline
**Structure:**
```
When you say [decisioning latency] is slowing you down — walk me through what a single
decision event looks like end to end. I want to understand where the latency actually sits
before we talk about what we can do about it.
```
**Example output:** "When you say 800ms is slowing down your BNPL approval flow — walk me through what a single credit decision event looks like end to end. I want to understand whether the latency sits in the feature enrichment layer, the model inference step, or the upstream bureau call before we talk about what we can do about it."
**Why it works:** Fintech engineers and risk leads will immediately trust an AE who knows the stack. Generic "faster decisioning" pitches get brushed off; architectural curiosity earns a technical champion.
**Word count:** 50–70 words
**Avg. score:** 82–90

---

## Prompt 05 — AML / KYC Risk Framing Email
**Role:** AE / SDR
**Trigger:** Target is a crypto exchange, remittance company, or digital bank facing AML scrutiny
**Structure:**
```
Subject: AML alert fatigue at [Company]

[Name], most AML teams we talk to in [segment] are managing [X% false positive rate] —
meaning analysts spend [Y hours/week] reviewing noise instead of real risk. We help [similar
company] cut that ratio to [Z%] without triggering compliance gaps. Can I show you the numbers?
```
**Example output:** "Subject: AML alert fatigue at Rain\n\nFatima, most AML teams we talk to at crypto exchanges in the MENA region are managing 95%+ false positive rates — meaning analysts spend 60–70% of their week reviewing noise instead of real sanctions risk. We helped Bitpanda cut that ratio to under 40% without introducing any gaps in their FATF compliance posture. Can I show you the numbers?"
**Why it works:** AML false positives are a known, quantified pain point. Framing the solution around compliance posture (not just analyst efficiency) ensures the pitch resonates with both the operations buyer and the CCO.
**Word count:** 65–85 words
**Avg. score:** 80–88

---

## Prompt 06 — Regulatory Change Urgency (Reactive)
**Role:** AE
**Trigger:** A regulator has just issued a new rule, guidance, or enforcement action relevant to the prospect's business
**Structure:**
```
[Name], saw [Regulator] published [new rule/guidance] last week. A few [Company type] we work
with are scrambling on the [specific control]. We've already built [control] into our platform —
happy to walk you through how we'd cover that requirement if it's on your radar.
```
**Example output:** "Javier, saw the CFPB published its final BNPL rule last week covering periodic statements and dispute rights. Two open-banking providers we work with are scrambling on the billing dispute workflow. We've already built a compliant dispute management module into our platform — happy to walk you through how we'd cover that requirement if it's on your radar."
**Why it works:** Reactive regulatory outreach proves your team is monitoring the same news feeds as the compliance team. Arriving with a solution framing (not a "we can help" vague pitch) earns a technical meeting.
**Word count:** 60–80 words
**Avg. score:** 82–90

---

## Prompt 07 — Multi-Entity / Cross-Border Complexity Opener
**Role:** AE
**Trigger:** Prospect operates in multiple jurisdictions or is expanding cross-border
**Structure:**
```
Quick question before we get into the demo — how many jurisdictions is [Company] operating in
today, and are you managing separate compliance stacks per entity or trying to run one unified layer?
The answer changes what I'd show you.
```
**Example output:** "Quick question before we get into the demo — how many jurisdictions is Airwallex operating in today, and are you managing separate compliance stacks per entity or trying to run one unified layer? The answer changes whether I'd show you our multi-entity ruleset engine or the single-jurisdiction fast track."
**Why it works:** Multi-jurisdiction fintech complexity is a buying signal, not just a discovery note. Asking this before the demo positions the vendor as an architect, not a feature shower — and differentiates from competitors who demo the same slides to every prospect.
**Word count:** 50–65 words
**Avg. score:** 83–91

---

## Prompt 08 — Renewal / Competitive Lock-In Defense
**Role:** AE / CSM
**Trigger:** Renewal is 90 days out and a competitor has been running a displacement campaign
**Structure:**
```
[Name], renewal is coming up and I want to get ahead of any conversations you've been having
in the market. If you're evaluating [Competitor] — I'd rather understand what's driving that
than lose you without a fair shot. What's the gap you're trying to close?
```
**Example output:** "Simi, renewal is coming up and I want to get ahead of any conversations you've been having in the market. If you're evaluating Sardine — I'd rather understand what's driving that than lose Moniepoint without a fair shot. Is it the model explainability output for your CBN audit trail, or is there a feature gap somewhere else?"
**Why it works:** Fintech buyers evaluating competitors during renewal cycles are usually looking for one specific control or integration — not a wholesale replacement. Naming a plausible specific gap shows product depth and opens a real conversation about retention.
**Word count:** 55–70 words
**Avg. score:** 80–89
