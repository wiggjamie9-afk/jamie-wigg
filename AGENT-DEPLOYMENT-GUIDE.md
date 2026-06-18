# Background Agent Deployment Guide
## Cross-Generational Narrative Appeal Research

**Prepared:** 2026-06-18  
**Status:** Ready to deploy background agents  
**Framework Version:** 1.0  

---

## What Has Been Prepared

A complete **sources verification framework** for validating claims in the cross-generational narrative appeal research report. The framework ensures all claims are:
- **Published** in verifiable sources (2023+)
- **Quantified** with specific data points (%, metrics)
- **Cited** with full URLs and publication dates
- **Cross-verified** across multiple sources
- **Transparent** about limitations and confidence levels

---

## The Four Documents

### Document 1: `source-verification-checklist.md`
**Purpose:** Define target sources and success criteria  
**For:** All agents (reference document)

Contains:
- 7 target sources (Parrot Analytics, YouTube, Statista, Google Scholar, Pew, Forrester, Gartner)
- What data to extract from each
- Verification rules (must be 2023+, quantified, citable)
- Data extraction template
- Status tracking table

**How agents use it:** 
- Agents 1–3 refer to it while searching
- Know exactly what counts as "verified"
- Track progress in status table

---

### Document 2: `agent-search-strategies.md`
**Purpose:** Provide search tactics and verification protocols  
**For:** All agents (implementation guide)

Contains:
- 7 specific search strategies (one per source)
- 3 approaches per source (direct site, press releases, third-party citations)
- Copy-paste ready search strings
- Data extraction templates
- Cross-reference verification protocol
- Citation format guidance (APA, Chicago, plain text)
- Complete worked example

**How agents use it:**
- Follow the search strategy for each source
- Use the copy-paste search strings
- Extract data using the provided templates
- Format citations correctly for final report

---

### Document 3: `agent-findings-aggregation.md`
**Purpose:** Collect, organize, and synthesize all findings  
**For:** All agents (output template)

Contains:
- Agent 1 findings section (Industry reports)
- Agent 2 findings section (Public analytics)
- Agent 3 findings section (Academic papers)
- Agent 4 synthesis section (Fact-checking & cross-reference)
- Claim verification matrix
- Data consolidation table
- Contradiction resolution table
- Master bibliography template

**How agents use it:**
- Agents 1–3: Fill their respective finding sections
- Agent 4: Aggregates Agents 1–3 output and adds synthesis
- All: Use table templates to ensure consistent format

---

### Document 4: `SOURCES-VERIFICATION-README.md`
**Purpose:** Overview and navigation guide  
**For:** All agents (orientation)

Contains:
- Framework overview
- How to use the other 3 documents
- Phase 1 (deploy), Phase 2 (collect), Phase 3 (report) flowchart
- Common pitfalls to avoid
- Success metrics
- Quick links to all documents

**How agents use it:**
- Start here to understand the full framework
- Reference it to know which document to use when
- Check success metrics to know when they're done

---

## Agent Assignments

### Agent 1: Industry Reports & Market Research
**Task:** Find quantitative data on family content performance from industry analysts

| Source | Search Goal | Priority |
|---|---|---|
| Parrot Analytics | Family content engagement metrics | HIGH |
| YouTube Creator Insights | Narrative vs. non-narrative retention | HIGH |
| Statista | Multi-generational viewing patterns | MEDIUM |

**Deliverables:**
- Table of extracted data points (% engagement, retention, etc.)
- Full URLs for each source
- Publication dates
- Citation in APA format

**Reference docs:**
- `source-verification-checklist.md` (Sections 1–3)
- `agent-search-strategies.md` (Sections 1–3)

**Output location:**
- Fill "AGENT 1 FINDINGS" in `agent-findings-aggregation.md`

**Success criteria:**
- [ ] 3+ industry reports located
- [ ] Each has a specific quantified claim (% or metric)
- [ ] All sources cited with URLs
- [ ] Publication dates within 3-year window (2023+)
- [ ] Ready for Agent 4 to cross-reference

---

### Agent 2: Public Analytics & Research Centers
**Task:** Find demographic and generational data on multi-age media consumption

| Source | Search Goal | Priority |
|---|---|---|
| Pew Research Center | Multi-generational household viewing | MEDIUM |
| Forrester Research | Content strategy for multi-age audiences | MEDIUM |
| Gartner | Market trends in family media | LOW |

**Deliverables:**
- Demographic breakdowns by age group / generation
- Shared viewing statistics (% of families, watch time, etc.)
- Generational comparisons
- Full citations with URLs

**Reference docs:**
- `source-verification-checklist.md` (Sections 5–7)
- `agent-search-strategies.md` (Sections 5–6)

**Output location:**
- Fill "AGENT 2 FINDINGS" in `agent-findings-aggregation.md`

**Success criteria:**
- [ ] 2+ public research centers located
- [ ] Demographic data extracted (generational breakdowns)
- [ ] All sources cited with URLs
- [ ] Paywalled sources noted ("Institutional access required" if applicable)
- [ ] Ready for Agent 4 to cross-reference

---

### Agent 3: Academic Literature
**Task:** Find peer-reviewed research on narrative engagement & multi-age psychology

| Source | Search Goal | Priority |
|---|---|---|
| Google Scholar | Narrative engagement & multi-age appeal | MEDIUM |
| Journal database | Peer-reviewed papers on storytelling & retention | MEDIUM |
| Academic repositories | Research on cross-generational media consumption | MEDIUM |

**Deliverables:**
- List of peer-reviewed papers (3+ minimum)
- Key findings from each paper
- Authors, journals, publication dates, DOIs
- Citations in APA format
- Study type (lab, real-world, meta-analysis) noted

**Reference docs:**
- `source-verification-checklist.md` (Section 4)
- `agent-search-strategies.md` (Section 4)

**Output location:**
- Fill "AGENT 3 FINDINGS" in `agent-findings-aggregation.md`

**Success criteria:**
- [ ] 3+ peer-reviewed papers located
- [ ] All published 2020 or later (within 6-year window)
- [ ] Key findings extracted from abstracts/full texts
- [ ] DOIs or permanent URLs recorded
- [ ] Study type & sample size noted (if available)
- [ ] Ready for Agent 4 to cross-reference

---

### Agent 4: Fact-Checking & Synthesis
**Task:** Cross-verify all claims and compile final bibliography

**Input:** Findings from Agents 1–3 (populated in `agent-findings-aggregation.md`)

**Process:**
1. Compare claims across sources
   - Do they measure the same thing?
   - Do the numbers align (or differ systematically)?
   - Document contradictions with explanations

2. Verify consistency
   - Flag if Agent 1's 42% retention matches Agent 3's 35–45% range
   - Note if sources are measuring different populations (US vs. global, etc.)

3. Assign confidence levels
   - HIGH: 3+ sources agree, clear definition, recent publication
   - MEDIUM: 1–2 sources, some ambiguity, or older research
   - LOW: Single source, unclear definition, or pre-2020 publication

4. Document gaps
   - Claims that couldn't be verified
   - Sources that were paywalled (could not verify)
   - Research needed to fill gaps

5. Compile master bibliography
   - Sort by topic
   - Format consistently (APA)
   - Include access status (Public / Paywalled / Institutional)

**Deliverables:**
- Claim verification matrix (comparing Agents 1–3 claims)
- Consolidated data points table
- Contradiction resolution document
- Master bibliography (APA format)
- Confidence ratings for each claim
- Gap analysis

**Reference docs:**
- `agent-findings-aggregation.md` (entire file, especially Section 4)
- `agent-search-strategies.md` (Section 8 for verification protocol)

**Output location:**
- Fill "AGENT 4 SYNTHESIS" and all subsections in `agent-findings-aggregation.md`
- Populate "FINAL SYNTHESIS" section

**Success criteria:**
- [ ] All contradictions documented (even if unresolved)
- [ ] Confidence levels assigned (HIGH / MEDIUM / LOW)
- [ ] Master bibliography complete & APA formatted
- [ ] Gaps clearly noted (unavailable sources, unverified claims)
- [ ] Ready for final report writing

---

## How to Deploy

### Step 1: Distribute documents to agents

**To Agent 1:**
```
Here are your search targets:
- source-verification-checklist.md (Sections 1–3: Parrot, YouTube, Statista)
- agent-search-strategies.md (Sections 1–3: search tactics for each)
- agent-findings-aggregation.md (output template — fill "AGENT 1 FINDINGS")

Task: Locate quantitative data on family content engagement from Parrot Analytics, 
YouTube Creator Insights, and Statista. Extract %, retention metrics, publication dates.
```

**To Agent 2:**
```
Here are your search targets:
- source-verification-checklist.md (Sections 5–7: Pew, Forrester, Gartner)
- agent-search-strategies.md (Sections 5–6: search tactics for each)
- agent-findings-aggregation.md (output template — fill "AGENT 2 FINDINGS")

Task: Locate demographic & generational data on family viewing from Pew Research, 
Forrester, and Gartner. Extract household %, age-group breakdowns, publication dates.
```

**To Agent 3:**
```
Here are your search targets:
- source-verification-checklist.md (Section 4: Google Scholar, academic papers)
- agent-search-strategies.md (Section 4: search tactics & verification)
- agent-findings-aggregation.md (output template — fill "AGENT 3 FINDINGS")

Task: Locate 3+ peer-reviewed papers on narrative engagement, multi-age audience appeal, 
and family media consumption. Extract key findings, DOIs, publication dates (2020+).
```

**To Agent 4:**
```
You are the synthesizer. Once Agents 1–3 return findings:
- agent-findings-aggregation.md (aggregate all findings, fill "AGENT 4 SYNTHESIS")
- agent-search-strategies.md (Section 8: verification & cross-reference protocol)
- source-verification-checklist.md (understand success criteria)

Task: Cross-verify all claims from Agents 1–3. Flag contradictions, assign confidence 
levels (HIGH/MEDIUM/LOW), compile master bibliography (APA format), document gaps.
```

### Step 2: Agents search & report

Each agent:
1. Reads `source-verification-checklist.md` to understand success criteria
2. Uses `agent-search-strategies.md` to find specific sources & extract data
3. Fills their section in `agent-findings-aggregation.md`
4. Uses data extraction templates to ensure consistent format
5. Reports findings with confidence levels

### Step 3: Agent 4 aggregates & verifies

Once Agents 1–3 report:
1. Agent 4 reads all findings in `agent-findings-aggregation.md`
2. Cross-references claims across agents
3. Builds claim verification matrix
4. Assigns confidence levels
5. Compiles master bibliography
6. Flags contradictions & gaps

### Step 4: Ready for final report

Once Agent 4 completes synthesis:
1. Copy verified claims from "Ready-to-Report Findings" table
2. Use citations from master bibliography
3. Write final report with inline citations [1][2][3]...
4. Include limitations section (from Agent 4's gap analysis)
5. Append full bibliography (from Agent 4's master list)

---

## Key Principles

**For all agents:**

1. **Only count sources you can verify**
   - Must have a URL (or note "Institutional access required")
   - Must be publicly accessible OR available through verified institutional access
   - Must be 2023 or later (3-year recency window)

2. **Require specific data points**
   - "42% higher retention" ✓ (good)
   - "many families watch together" ✗ (too vague)
   - "35–45% engagement increase" ✓ (good, shows range)

3. **Document everything**
   - Original claim (word-for-word)
   - Data point (the specific %, metric, or number)
   - Population (who this applies to)
   - Publication date
   - Full URL
   - Confidence level

4. **Flag contradictions, don't hide them**
   - If Source A says 42% and Source B says 40%, both are valid
   - Note the difference; explain why (different populations? measurement methods?)
   - Agent 4 will synthesize into a range or explanation

---

## Document Locations

All documents are in the repo root:
- `/home/user/jamie-wigg/source-verification-checklist.md`
- `/home/user/jamie-wigg/agent-search-strategies.md`
- `/home/user/jamie-wigg/agent-findings-aggregation.md`
- `/home/user/jamie-wigg/SOURCES-VERIFICATION-README.md`
- `/home/user/jamie-wigg/AGENT-DEPLOYMENT-GUIDE.md` (this file)

---

## Timeline & Expectations

**Agent 1–3:** Each should take 1–2 hours depending on source availability
- Locate sources
- Extract key claims & data points
- Format findings in template
- Report back with results

**Agent 4:** Should take 1–2 hours once Agents 1–3 complete
- Cross-verify all findings
- Build claim matrix
- Assign confidence levels
- Compile bibliography

**Total framework time:** 3–4 hours from deployment to final synthesis

---

## Success Checklist

When all agents report back, you'll know it worked if:

- [ ] **Agent 1** locates 3+ industry reports with quantified claims
- [ ] **Agent 2** finds 2+ public research sources with demographic breakdowns
- [ ] **Agent 3** identifies 3+ peer-reviewed papers (2020+) on narrative engagement
- [ ] **Agent 4** cross-references all claims and assigns confidence levels
- [ ] **Master bibliography** is complete in APA format
- [ ] **Every claim** in final report has a citation & URL
- [ ] **Contradictions** are documented with explanations
- [ ] **Gaps** are noted (if any sources couldn't be accessed)

---

## Next Steps

1. **Deploy the framework:** Assign Agents 1–4 to their respective tasks using guidance above
2. **Monitor progress:** Check `agent-findings-aggregation.md` as agents report
3. **Agent 4 synthesizes:** Once Agents 1–3 complete, Agent 4 cross-verifies
4. **Final report writing:** Use verified findings + bibliography from Agent 4
5. **Publish with citations:** All claims traced to sources with full URLs

---

**Framework Status:** ✓ Ready to deploy  
**Prepared by:** Claude (2026-06-18)  
**Last Updated:** 2026-06-18  

Questions? Refer to `SOURCES-VERIFICATION-README.md` for overview or `agent-search-strategies.md` for specific tactics.
