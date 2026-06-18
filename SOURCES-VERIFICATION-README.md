# Sources Verification Framework
## Cross-Generational Narrative Appeal Research

**Last Updated:** 2026-06-18  
**Status:** Framework ready; awaiting background agent findings

---

## Overview

This framework ensures all claims in the "Cross-Generational Narrative Appeal" research report are:
1. **Sourced** — from published, verifiable sources
2. **Cited** — with full URLs, publication dates, and access status
3. **Verified** — cross-checked across multiple sources
4. **Contextualized** — with clear limitations and scope notes

---

## Files in This Framework

### 1. `source-verification-checklist.md`
**Purpose:** Defines which sources to target and what data to extract from each.

| Source | Priority | Type | Data Goal |
|---|---|---|---|
| Parrot Analytics | HIGH | Industry analyst | Family content metrics |
| YouTube Trends Lab | HIGH | Primary platform | Narrative performance |
| Statista | MEDIUM | Market research | Multi-generational viewing |
| Google Scholar | MEDIUM | Academic | Narrative psychology |
| Pew Research | MEDIUM | Public research | Generational patterns |
| Forrester | MEDIUM | Industry analyst | Content strategy |
| Gartner | LOW | Market analyst | Market trends |

**Use this file to:**
- Assign tasks to background agents
- Define success criteria (what counts as "verified")
- Track verification status

---

### 2. `agent-search-strategies.md`
**Purpose:** Provides specific search tactics, query strings, and verification protocols.

**Sections:**
- Search strategy for each source (3 approaches per source)
- Data extraction templates (how to record findings)
- Cross-reference verification protocol
- Citation format guidance (APA, Chicago, plain text)
- Quick-reference search strings (copy-paste ready)

**Use this file to:**
- Guide background agents on HOW to search
- Ensure consistent data extraction across agents
- Provide citation templates for final report

---

### 3. `agent-findings-aggregation.md`
**Purpose:** Template for collecting and synthesizing findings from all background agents.

**Structure:**
- Agent 1: Industry Reports (Parrot, YouTube, Statista)
- Agent 2: Public Analytics (Pew, Forrester, Gartner)
- Agent 3: Academic Literature (Google Scholar papers)
- Agent 4: Fact-checking & Synthesis

**Use this file to:**
- Collect Agent 1–3 findings in structured format
- Track progress & completion status
- Cross-verify claims across sources
- Identify contradictions & gaps
- Compile master bibliography

---

### 4. `SOURCES-VERIFICATION-README.md` (this file)
**Purpose:** Overview and navigation guide for the entire framework.

---

## How to Use This Framework

### Phase 1: Deploy Background Agents (YOU ARE HERE)

1. **Distribute the files:**
   - Agent 1 → `source-verification-checklist.md` + `agent-search-strategies.md` (Sections 1–3)
   - Agent 2 → `source-verification-checklist.md` + `agent-search-strategies.md` (Sections 5–6)
   - Agent 3 → `source-verification-checklist.md` + `agent-search-strategies.md` (Section 4)
   - Agent 4 → `agent-findings-aggregation.md` (entire file)

2. **Provide context:**
   - All agents: Read `source-verification-checklist.md` for target sources & success criteria
   - All agents: Reference `agent-search-strategies.md` for search tactics & citation formats
   - Agent 4: Use `agent-findings-aggregation.md` as aggregation template

3. **Set expectations:**
   - Agent 1: "Return quantitative metrics from industry reports (% engagement, retention, etc.)"
   - Agent 2: "Return demographic data & public research (generational breakdowns, viewing patterns)"
   - Agent 3: "Return peer-reviewed papers on narrative engagement & multi-age psychology"
   - Agent 4: "Cross-verify all claims; flag contradictions; compile master bibliography"

---

### Phase 2: Collect & Verify Agent Findings

When agents return findings:

1. **Record findings in `agent-findings-aggregation.md`**
   - Agent 1 → fills Section "AGENT 1 FINDINGS"
   - Agent 2 → fills Section "AGENT 2 FINDINGS"
   - Agent 3 → fills Section "AGENT 3 FINDINGS"
   - Agent 4 → fills Section "AGENT 4 SYNTHESIS" (cross-references all others)

2. **Agent 4 verifies:**
   - Compare claims across sources (do they align?)
   - Document contradictions with possible explanations
   - Assign confidence levels (HIGH / MEDIUM / LOW)
   - Flag gaps (claims that couldn't be verified)

---

### Phase 3: Compile Final Report

Once Agent 4 completes synthesis:

1. **Extract verified claims** from `agent-findings-aggregation.md` → "Ready-to-Report Findings" table
2. **Build master bibliography** in APA format (provided by Agent 4)
3. **Include in final report:**
   - Main findings in narrative section
   - Data points cited with superscript [1][2][3]...
   - Full bibliography at end
   - Limitations section (from gaps & contradictions)

---

## Data Extraction Standards

### For Each Claim, Always Record:

```
Original Claim: [Exact quote from source]
Data Point: [Specific %, metric, or number]
Population: [Who this applies to — YouTube viewers? Families? Age 5–65+?]
Baseline: [What's it compared to?]
Publication Date: [YYYY-MM or YYYY-Q]
Source: [Organization / Journal name]
URL: [Full URL with access status: Public / Paywalled / Institutional]
Confidence: [HIGH / MEDIUM / LOW — see checklist for criteria]
Notes: [Limitations, caveats, or contradictions with other sources]
```

---

## Verification Criteria

**A claim is VERIFIED when:**
- [ ] Published in last 3 years (2023 or later)
- [ ] Includes specific data point (%, number, metric) — not just qualitative claim
- [ ] Source is publicly accessible OR available via institutional access
- [ ] URL is recorded & accessible
- [ ] Publication date is documented
- [ ] Supported by 2+ independent sources (preferred) OR 1 authoritative source (minimum)

**A claim is PARTIALLY VERIFIED when:**
- [ ] Meets above criteria BUT only 1 source found
- [ ] OR data point is qualitative rather than quantitative
- [ ] OR source is paywalled (limits accessibility)

**A claim is UNVERIFIED when:**
- [ ] Could not locate in published sources
- [ ] Only found in marketing materials / blog posts (not research)
- [ ] Published before 2023 (outside 3-year window)
- [ ] Source is inaccessible & no alternative found

---

## Common Pitfalls to Avoid

### Agent 1–3 (During Search)
- ❌ Recording claims WITHOUT specific data points → Mark as "qualitative only"
- ❌ Finding a claim in one place and assuming it's verified → Cross-reference minimum 2 sources
- ❌ Using outdated reports (pre-2023) → Flag if used; note publication date
- ❌ Citing blog posts as primary sources → Trace to original research whenever possible

### Agent 4 (During Synthesis)
- ❌ Ignoring contradictions → Document them, don't hide them
- ❌ Assuming similar claims = same data → Clarify if "42%" and "40%" are measuring same metric
- ❌ Including unverified claims in final report → Mark with [UNVERIFIED] or exclude
- ❌ Forgetting to note confidence levels → Every claim needs a confidence rating

---

## Success Metrics

**You'll know this framework worked when:**

1. ✓ Every claim in the final report has a citation
2. ✓ Every citation has a URL (or "Institutional access required")
3. ✓ Readers can verify claims by visiting URLs
4. ✓ Contradictions are documented (with explanations)
5. ✓ Confidence levels are transparent (HIGH / MEDIUM / LOW)
6. ✓ Limitations are clear (e.g., "US-only data," "lab study, not real-world")
7. ✓ Master bibliography is complete & properly formatted (APA)

---

## Quick Links to Agent Documents

| File | Agent(s) | Purpose |
|---|---|---|
| `source-verification-checklist.md` | All | Define sources & success criteria |
| `agent-search-strategies.md` | All | Search tactics & citation formats |
| `agent-findings-aggregation.md` | Agents 1–4 | Collect & synthesize findings |

---

## Example: From Search to Report

### Agent 1 finds:
> "YouTube Creator Insider reports that family narratives drive 42% higher viewer retention"

### Agent 1 records in aggregation template:
```
Source: YouTube Creator Insider
Claim: Family narratives drive 42% higher viewer retention
Data Point: 42% (higher retention)
Metric: Viewer retention rate (% of viewers completing full video)
Publication Date: March 2025
URL: https://youtube.com/creators/insights/...
Confidence: HIGH
```

### Agent 3 finds supporting academic evidence:
```
Paper: "Narrative Engagement Across Ages"
Authors: Smith & Jones
Journal: Journal of Broadcasting & Electronic Media
Year: 2024
Key Finding: Multi-generational narratives show 35–45% higher engagement in family household contexts
Confidence: HIGH (peer-reviewed, n=500+)
DOI: https://doi.org/10.1234/jbem.2024.001
```

### Agent 4 synthesizes:
> **VERIFIED CLAIM:** Family-focused narratives drive higher viewer retention across age groups (40–42% increase). Supported by YouTube Creator Insider data (2025) and peer-reviewed research (Smith & Jones, 2024). ✓ HIGH CONFIDENCE

### Final Report includes:
> Family-focused narratives drive viewer retention, with YouTube data showing 42% higher completion rates[1], consistent with academic findings of 35–45% engagement increases in multi-generational contexts[2].
>
> [1] YouTube Creator Insider. (2025). [Report Title]. Retrieved from https://...
> [2] Smith & Jones. (2024). Narrative engagement across ages. *Journal of Broadcasting & Electronic Media*, 123(4), pp. XX–XX. https://doi.org/10.1234/jbem.2024.001

---

## Status & Next Steps

**Current Status:** Framework ready, awaiting agent deployment

**Next Steps:**
1. Deploy Agents 1–4 with their respective files & tasks
2. Agents complete searches and fill aggregation template
3. Agent 4 synthesizes findings & flags contradictions
4. Final report integrates verified claims with citations
5. Publish with full bibliography & confidence ratings

---

**Questions?** Refer to:
- **"How do I search for [source]?"** → `agent-search-strategies.md`
- **"What counts as verified?"** → `source-verification-checklist.md`
- **"Where do I record my findings?"** → `agent-findings-aggregation.md`
- **"What's the overall framework?"** → This file (`SOURCES-VERIFICATION-README.md`)

---

**Framework Version:** 1.0  
**Last Updated:** 2026-06-18  
**Maintained by:** User  
**Status:** Ready for deployment
