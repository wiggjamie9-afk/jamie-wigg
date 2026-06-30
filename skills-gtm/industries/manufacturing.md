# Reference: Manufacturing GTM Prompts

## Purpose
Manufacturing GTM splits across two very different audiences: plant-floor operators and engineers who care about uptime, OEE, and throughput, and corporate buyers (CFO, COO, VP of Operations) who care about capex ROI, supply chain risk, and margin. These audiences rarely talk to each other during procurement, so deals often stall between operational enthusiasm and corporate budget approval. Legacy systems (SCADA, MES, ERP) are deeply embedded — pitching as a replacement is a deal-killer; pitching as an integration layer is not. Not templates — starting points.

## Buyer landscape
- **Typical buyers:** VP of Operations, Plant Manager, Director of Manufacturing Engineering, CIO, CFO (for capital investment), Chief Supply Chain Officer
- **Common pains:** Unplanned downtime cutting OEE, quality escapes causing recall risk and rework cost, ERP data that's weeks behind actual production, supply chain disruptions with no early-warning visibility, skilled-trades knowledge walking out the door at retirement
- **Watch-outs:** Plant managers will not pilot anything that risks production availability — safety and uptime trump every ROI argument. Proof of concept on a non-critical line first, then expand. Corporate buyers need to see a clear capex/opex classification and payback period in months, not years.

---

## Prompt 01 — OEE Downtime Cost Cold Email
**Role:** SDR/BDR
**Trigger:** Target manufacturer has publicly reported capacity utilization issues, or operates in a sector with known high downtime costs (automotive, food processing, semiconductors)
**Structure:**
```
Subject: [Company]'s downtime cost — a rough number

[Name], for a manufacturer at [Company]'s scale, every 1% OEE improvement is typically
worth [$ estimate] in recovered throughput per year. We helped [comparable company]
move from [X%] to [Y%] OEE in [timeframe] — without touching their existing MES.
Worth 20 minutes to see how?
```
**Example output:** "Subject: Kennametal's downtime cost — a rough number\n\nGreg, for a manufacturer at Kennametal's scale, every 1% OEE improvement is typically worth $2–4M in recovered throughput per year across a mixed carbide tooling line. We helped Sandvik move from 71% to 79% OEE in 11 months — without touching their existing Siemens MES or retraining the floor team. Worth 20 minutes to see how?"
**Why it works:** OEE is the one metric every manufacturing operations leader tracks. Translating a percentage improvement into a dollar figure anchors the conversation in business impact before the product is even mentioned.
**Word count:** 60–80 words
**Avg. score:** 82–90

---

## Prompt 02 — Legacy System Integration Angle
**Role:** AE / SDR
**Trigger:** Prospect is known to run a specific legacy PLC, SCADA, or ERP (SAP, Oracle, Rockwell)
**Structure:**
```
Subject: [Company] + [Their Legacy System] — no rip-and-replace

[Name], noticed [Company] runs [Legacy System]. We layer on top of [Legacy System] —
no replacement, no migration project. [Comparable company] added [capability] in [timeframe]
while keeping their existing [system] intact. Can I show you how?
```
**Example output:** "Subject: Nucor + SAP ECC — no rip-and-replace\n\nSheila, noticed Nucor runs SAP ECC for production scheduling. We layer on top of SAP ECC — no replacement, no six-month migration. Gerdau added real-time yield variance tracking in 8 weeks while keeping their existing SAP landscape and Rockwell PLCs intact. Can I show you how?"
**Why it works:** "Replace our ERP" is heard as "shut down our plant for six months." Explicitly negating that fear before the prospect can raise it removes the single biggest objection in manufacturing sales before the demo.
**Word count:** 55–70 words
**Avg. score:** 83–91

---

## Prompt 03 — Plant Manager Discovery Opener
**Role:** AE
**Trigger:** First call with a plant-floor operational buyer (Plant Manager, Production Supervisor)
**Structure:**
```
Before I show you anything — tell me about your worst shift last month. Not the numbers,
the actual event. What happened, how long did it take to figure out the root cause,
and what was the cost?
```
**Example output:** "Before I show you anything — tell me about your worst shift last month. Not the OEE numbers, the actual event. What happened on the line, how long did it take your team to pinpoint the root cause, and what was the cost in scrapped material and lost throughput by the time the shift ended?"
**Why it works:** Plant managers distrust vendor demos that start with dashboards. Opening with a war-story question earns immediate credibility and surfaces the exact pain point that will drive urgency — which a dashboard slide never would.
**Word count:** 45–65 words
**Avg. score:** 84–92

---

## Prompt 04 — Supply Chain Risk Framing Email
**Role:** SDR/BDR
**Trigger:** Target manufacturer operates in a sector with known supply chain exposure (electronics, automotive, aerospace)
**Structure:**
```
Subject: [Company]'s Tier 2 supplier visibility

[Name], most [sector] manufacturers we talk to have good visibility into Tier 1 suppliers
but near-zero early warning on Tier 2 disruptions — until they're already a production
stoppage. We give [comparable company] a [X-day] lead on disruption signals.
Is that gap on your radar?
```
**Example output:** "Subject: Aptiv's Tier 2 supplier visibility\n\nMark, most automotive Tier 1 manufacturers we talk to have good visibility into their direct suppliers but near-zero early warning on Tier 2 semiconductor and rare-earth disruptions — until they're already a line-stop. We give Magna a 14-day lead on disruption signals before they hit the production schedule. Is that gap on your radar?"
**Why it works:** Post-COVID supply chain risk is a board-level concern at every manufacturer. Naming the specific Tier 2 blind spot (rather than "supply chain visibility" generically) shows the vendor understands the actual failure mode.
**Word count:** 60–80 words
**Avg. score:** 80–88

---

## Prompt 05 — Quality / Recall Risk Opener
**Role:** AE
**Trigger:** Prospect has had a public quality issue, recall, or operates in a highly regulated manufacturing sector (medical devices, food, automotive)
**Structure:**
```
[Name], quality escapes in [sector] tend to show up in two places: in-process rework cost
and post-shipment recall risk. Which of those is the bigger headache for [Company]
right now — or is it both?
```
**Example output:** "Jason, quality escapes in automotive stamping tend to show up in two places: in-process rework cost at the line and post-shipment warranty claims and recall risk downstream. Which of those is the bigger headache for Martinrea right now — or is it both? The answer changes what I'd want to walk you through."
**Why it works:** Quality conversations in manufacturing are emotionally charged — a recall can define a career. Asking which failure mode costs more invites the buyer to rank their own pain, which reveals where they'll justify spend and who else needs to be in the room.
**Word count:** 55–70 words
**Avg. score:** 82–90

---

## Prompt 06 — Knowledge Capture / Retiring Workforce Angle
**Role:** AE / SDR
**Trigger:** Target manufacturer operates in a skilled-trades-heavy sector or is known to have an aging workforce
**Structure:**
```
Subject: The expertise walking out the door at [Company]

[Name], most manufacturers in [sector] are watching 20–30% of their skilled trades retire
in the next five years. The institutional knowledge those technicians carry — fault
diagnosis, calibration sequences, machine quirks — isn't in any manual.
How is [Company] capturing it before it leaves?
```
**Example output:** "Subject: The expertise walking out the door at Caterpillar\n\nDan, most heavy equipment manufacturers are watching 25–30% of their skilled maintenance technicians retire in the next five years. The institutional knowledge those techs carry — fault diagnosis sequences, PLC quirks, hydraulic calibration shortcuts — isn't in any manual or current ERP. How is Caterpillar capturing it before it walks out the door?"
**Why it works:** Workforce knowledge loss is a deeply personal concern for plant managers who've built their operation around specific people. It creates urgency that isn't driven by a vendor quarter-end — it's driven by demographics.
**Word count:** 60–80 words
**Avg. score:** 81–89

---

## Prompt 07 — Capex vs. Opex Framing for CFO
**Role:** AE
**Trigger:** Deal has stalled because finance is treating the purchase as capital expenditure subject to longer approval
**Structure:**
```
[Name], I want to help you structure this in a way that makes the finance conversation easier.
Most of our customers run [Our Tool] as opex — subscription software, no hardware, no
capitalization required. That typically means it goes through [budget holder] rather than
the capex committee. Does that framing change the approval path for you?
```
**Example output:** "Renata, I want to help you structure this in a way that makes the finance conversation easier. Most of our customers run Tulip as opex — subscription software, no on-premise hardware, no capitalization required under ASC 350. That typically means it goes through the IT/ops budget rather than the full capex committee with a 6-month approval cycle. Does that framing change the approval path for Howmet?"
**Why it works:** Manufacturing CFOs are accustomed to long capex cycles for equipment. Repositioning SaaS as opex is not a pricing conversation — it's a procurement route conversation that can cut months off the approval timeline.
**Word count:** 65–80 words
**Avg. score:** 83–91

---

## Prompt 08 — Pilot Scoping Conversation
**Role:** AE
**Trigger:** Operations buyer is interested but needs to prove value before committing to a full deployment
**Structure:**
```
A pilot makes sense — let's make it count. The most useful pilots we run in manufacturing
start with one constraint: a single line, a defined baseline metric, and a 90-day window.
Which line would give you the most credible result if we moved the needle on [metric]?
```
**Example output:** "A pilot makes sense — let's make it count. The most useful pilots we run in discrete manufacturing start with one constraint: a single assembly line, a defined OEE baseline, and a 90-day window with no changes to production schedules. Which line at the Monterrey plant would give you the most credible result if we moved the needle on unplanned downtime events?"
**Why it works:** Open-ended pilot requests in manufacturing stall because scope is never defined. A structured pilot framing with a single line, a baseline metric, and a time window makes success measurable — and measurable pilots convert to full deployments.
**Word count:** 55–70 words
**Avg. score:** 84–92
