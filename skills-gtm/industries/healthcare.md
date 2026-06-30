# Reference: Healthcare GTM Prompts

## Purpose
Healthcare buying is bifurcated between clinical stakeholders who care about patient outcomes and operational/administrative buyers who care about cost, throughput, and regulatory compliance. HIPAA is the baseline — failure to address it proactively ends deals immediately. Procurement cycles are long (6–18 months at health systems), involve multiple sign-offs (IT security, legal, CMO, CNO, CFO), and often require a formal RFP or vendor assessment. EHR integration (Epic, Cerner, Oracle Health) is frequently a hard requirement, not a nice-to-have. Not templates — starting points.

## Buyer landscape
- **Typical buyers:** Chief Medical Officer, Chief Nursing Officer, VP of Clinical Informatics, Director of Revenue Cycle, CIO (IT), CFO (for capital or enterprise spend)
- **Common pains:** Clinical documentation burden stealing time from patient care, EHR alert fatigue, revenue cycle leakage from coding errors, staff burnout and turnover, inability to act on population health data at scale
- **Watch-outs:** Never pitch to a clinical buyer with efficiency-first language — frame everything around patient outcomes and clinician experience first. HIPAA BAA must be in place before any PHI is discussed. Health system procurement often requires an approved vendor list — check this early.

---

## Prompt 01 — Clinician Time-to-Patient Cold Email
**Role:** SDR/BDR
**Trigger:** Target health system has published press releases about physician burnout, documentation burden, or EHR inefficiency
**Structure:**
```
Subject: Physicians at [Health System] — documentation time

[Name], [Health System] clinicians spend an average of [X hours] on documentation per shift
— we helped [comparable health system] give back [Y minutes] per encounter without changing
their Epic workflow. Happy to share the case study. 15 minutes worth it?
```
**Example output:** "Subject: Physicians at Ochsner Health — documentation time\n\nDr. Tran, Ochsner clinicians spend an average of 2.5 hours on documentation per shift — we helped Atrium Health give back 40 minutes per encounter without changing their Epic workflow or requiring physicians to learn a new system. Happy to share the case study. 15 minutes worth it?"
**Why it works:** Physician time is the most politically charged resource in any health system. Framing the pitch as time returned to patient care (not efficiency gained for the hospital) aligns with what CMOs actually care about protecting.
**Word count:** 55–75 words
**Avg. score:** 82–90

---

## Prompt 02 — HIPAA Compliance Opener
**Role:** AE / SDR
**Trigger:** None required — use as a standard opener when reaching out to any healthcare prospect
**Structure:**
```
[Name], before anything else — we're a HIPAA-covered entity, maintain a signed BAA with
all healthcare customers, and have completed a HITRUST assessment. Happy to share our
security packet upfront so your compliance team isn't waiting on it later.
What are you working on that brought you to us?
```
**Example output:** "Dr. Adesanya, before anything else — we're a HIPAA-covered entity, maintain a signed BAA with all healthcare customers, and have completed our HITRUST CSF certification. Happy to share our full security packet upfront so your IT security team isn't waiting on it six weeks from now. What are you working on that brought you to the demo today?"
**Why it works:** Healthcare buyers are conditioned to wait for vendor security documentation and often delay demos pending compliance review. Frontloading credentials removes the most common early-stage stall and signals institutional experience.
**Word count:** 60–75 words
**Avg. score:** 83–91

---

## Prompt 03 — EHR Integration Discovery
**Role:** AE
**Trigger:** Prospect has confirmed interest but has not yet discussed integration requirements
**Structure:**
```
Before we go further — what's your EHR environment? Epic, Cerner, something else?
And are you expecting any new tool to work inside the existing workflow, or is your team
open to a parallel application with a separate login?
```
**Example output:** "Before we go further — what's your EHR environment? Epic on hyperspace, Cerner PowerChart, or something else? And is your clinical team expecting any new tool to surface inside the existing Epic workflow, or are they open to a parallel application with a separate login for the right use case?"
**Why it works:** EHR integration requirements are a binary — either a vendor can meet them or they can't. Asking early surfaces a hard blocker before either party invests further, and demonstrates that the AE knows the healthcare landscape well enough to ask.
**Word count:** 45–65 words
**Avg. score:** 81–89

---

## Prompt 04 — Revenue Cycle / Coding Accuracy Email
**Role:** AE / SDR
**Trigger:** Target is a health system with a large employed medical group or a revenue cycle management company
**Structure:**
```
Subject: Coding accuracy at [Health System] — a number worth checking

[Name], the average health system leaves [X%] of revenue on the table from undercoding
and claim denials. We helped [comparable org] recover [$ amount] in the first 90 days
by surfacing missed HCC capture at the point of care. Worth a look?
```
**Example output:** "Subject: Coding accuracy at Banner Health — a number worth checking\n\nMichelle, the average health system leaves 3–5% of net patient revenue on the table from undercoding and claim denials. We helped CommonSpirit recover $4.2M in the first 90 days by surfacing missed HCC capture and risk adjustment gaps directly in the Epic documentation workflow. Worth a look?"
**Why it works:** CFOs and revenue cycle directors operate in dollars, not clinical outcomes. Giving a concrete recovery figure (not a percentage improvement on an abstract baseline) makes the ROI tangible enough to justify a meeting.
**Word count:** 60–80 words
**Avg. score:** 80–88

---

## Prompt 05 — Population Health / VBC Angle
**Role:** AE
**Trigger:** Target health system or ACO is known to operate under value-based care contracts
**Structure:**
```
[Name], with [Health System] carrying [X] lives under value-based contracts, the risk
is increasingly on your balance sheet. Are you able to act on gaps-in-care data at
the patient panel level today, or is that still a manual process?
```
**Example output:** "Dr. Nguyen, with Northwell carrying 180,000 lives under CMS MSSP contracts, the financial risk is increasingly on your balance sheet. Are you able to act on HEDIS gaps-in-care data at the individual panel level today — say, pushing a task directly to the care coordinator — or is that still a weekly spreadsheet export?"
**Why it works:** VBC leaders are responsible for a population, not just individual encounters. Questions that reveal operational gaps in their current workflow (rather than listing product features) position the vendor as an infrastructure partner, not a software vendor.
**Word count:** 55–75 words
**Avg. score:** 82–90

---

## Prompt 06 — Nursing Retention / Staffing Framing
**Role:** AE / SDR
**Trigger:** Target health system has published nurse retention initiatives or posted high volume of nursing job listings
**Structure:**
```
Subject: Nurse retention at [Health System]

[Name], nursing turnover is running at [X%] nationally — and documentation burden is
consistently cited as one of the top three reasons nurses leave. We helped [comparable
health system] reduce charting time by [Y minutes] per shift. Can I share the data?
```
**Example output:** "Subject: Nurse retention at HCA Healthcare\n\nSandra, nursing turnover is running at 22% nationally — and documentation burden is consistently cited as one of the top three reasons nurses cite for leaving bedside care. We helped Ascension reduce charting time by 28 minutes per shift across their med-surg units. Can I share the data with your CNO?"
**Why it works:** CNOs are under board-level pressure on staffing costs. Connecting a software pitch to a retention metric reframes the conversation from IT procurement to workforce strategy — which lives in a different (and often more accessible) budget.
**Word count:** 55–75 words
**Avg. score:** 81–89

---

## Prompt 07 — Multi-Stakeholder Deal Navigation (IT + Clinical)
**Role:** AE
**Trigger:** Deal is active but clinical sponsor and IT are not aligned on prioritization
**Structure:**
```
[Clinical Sponsor Name], it sounds like IT has concerns about [specific technical issue].
Would it help if I set up a 30-minute call with your CISO and our security team specifically
to address [issue]? I'd rather surface that now than have it become a blocker at the
contract stage.
```
**Example output:** "Dr. Kapoor, it sounds like Froedtert's IT team has concerns about the Azure tenant configuration and data residency requirements. Would it help if I set up a 30-minute call with your CISO and our VP of Security specifically to address those integration points? I'd rather surface that now than have it become a blocker when the contract goes to legal review."
**Why it works:** Clinical champions in health systems often lack the authority to override IT security holds. Offering a vendor-to-CISO call takes the burden off the clinical champion and keeps the deal moving without creating internal tension.
**Word count:** 55–70 words
**Avg. score:** 83–91

---

## Prompt 08 — Long-Cycle Check-In (Post-RFP)
**Role:** AE
**Trigger:** RFP response submitted 4–6 weeks ago with no decision update
**Structure:**
```
[Name], I know procurement timelines at health systems have a life of their own.
I'm not looking to rush anything — I just want to make sure there isn't a question
from the evaluation committee that we haven't answered. Is there anything outstanding
on your end that I can help move forward?
```
**Example output:** "Linda, I know procurement timelines at Providence have a life of their own. I'm not looking to rush anything — I just want to make sure there isn't a question from the Pharmacy or Revenue Cycle evaluation committee that we haven't answered. Is there anything outstanding on your end that I can help move forward before the Q1 budget cycle closes?"
**Why it works:** Healthcare procurement committees move slowly and often stall on unanswered questions that never get routed back to the vendor. A low-pressure, service-oriented check-in surfaces hidden blockers without creating the adversarial dynamic that aggressive follow-up creates.
**Word count:** 55–70 words
**Avg. score:** 79–87
