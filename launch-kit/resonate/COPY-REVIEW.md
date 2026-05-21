# RESONATE — Copy Review (resonate.html)

**Scope:** Visible marketing copy only (CSS/JS skipped). Cross-referenced against `email-sequence.md`, `press-release.md`, and `BRAND-VOICE-AUDIT.md`.
**Reviewer mode:** Proofread + tighten. No file modifications — review only.

---

## Severity legend

- **P0 (must fix)** — factual error, broken claim, medical/regulatory risk, weak CTA on a paid landing page.
- **P1 (should fix)** — awkward grammar, weak verb, redundancy, inconsistency with sibling launch assets.
- **P2 (style preference)** — voice tightening, optional polish. Won't lose conversions if left as-is.

---

## Section 1 — Meta + `<title>` (lines 6–19)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 1.1 | P1 | Title is two product layers deep; "Music that breathes with you." gets buried after the brand stack | `RHYTHMIX FREQUENCY · RESONATE — Music that breathes with you.` | `RESONATE — Music that breathes with you · RHYTHMIX FREQUENCY` | Lead with the SEO/social asset, follow with the brand. Apple HIG and SERP best practice. |
| 1.2 | P2 | Twitter description trims poorly | `Music that breathes with you. Closed-loop. Spatial. On-device.` | `Music that breathes with you — closed-loop, spatial, on-device.` | Reads as one promise, not four fragments. |

---

## Section 2 — Hero (lines 282–306)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 2.1 | P1 | "Heart rate in. Breath in." — the second "in" is grammatically wrong (breath rate is the input, not "breath in/out") | `Heart rate in. Breath in.` | `Heart rate in. Breath in. Generative score out.` already exists in the meta description — bring it forward verbatim: `Heart rate in. Breath rhythm in. A generative score out.` | Parallelism; "breath in" reads as the inhale of a breathing exercise, which is a different concept the page introduces later. |
| 2.2 | P2 | Hero subhead has 4 commas + an em-dash + a parenthetical clause | `A real-time generative score out — circling you in spatial audio, opening as you settle into 0.1 Hz cardiac coherence.` | `A real-time generative score out, circling you in spatial audio. It opens as you settle into 0.1 Hz coherence.` | Two short sentences read faster on mobile. Cuts one comma. |
| 2.3 | P0 | **Weak CTA.** "Begin · AU$30" is descriptive, not motivating. Lifetime value isn't signalled at the click. | `Begin · AU$30` | `Get RESONATE · AU$30 lifetime` | "Lifetime" is the entire value prop; absent from the primary CTA. |
| 2.4 | P2 | Secondary CTA "The Closed Loop" reads like an essay title | `The Closed Loop` | `See how it works` | Imperative beats nominalisation on a scroll-anchor CTA. |
| 2.5 | P1 | "Nothing leaves your phone." in hero conflicts with the BRAND-VOICE-AUDIT canonical phrase "kept on this device" (item 9 in audit). | `Nothing leaves your phone.` | `Kept on your phone.` | Brand-voice consistency with DREAMS / HUM / canonical RESONATE BRAND.md. |

---

## Section 3 — The Premise (lines 309–321)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 3.1 | P1 | "zip code" is American English. Page is AU$-priced, Perth-based studio. | `Not your zip code, not your time of day` | `Not your postcode, not your time of day` | Australian audience first; "zip" is jarring in AU/UK copy. |
| 3.2 | P1 | Redundancy — "None of them" repeated 4× | `None of them close the loop. None of them generate music in real time. None of them spatialise it around your head. None of them keep the data on your phone.` | `None of them close the loop. None generate music in real time. None spatialise it around your head. None keep the data on your phone.` | Drops 9 words; the parallel is stronger without the repeated subject. |
| 3.3 | P2 | "The window for that combination opened in 2026. It will not stay open long." — urgency claim has no specific deadline | (no change of meaning needed) | Consider adding a concrete anchor: `The window opened the day AirPods Pro 3 shipped. It will not stay open long.` | Specificity beats vague urgency; the moat section already says this on line 329. |

---

## Section 4 — The Moat / comparison table (lines 324–388)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 4.1 | P1 | H2 reads like an internal pitch deck, not landing copy | `Five columns. One row that's green all the way across.` | `Five capabilities. One app delivers all of them.` | Reader doesn't know columns are green until they scroll. Lead with the claim, not the visual. |
| 4.2 | P2 | "Nobody checks all five" — colloquial "Nobody" | `Every wellness-audio competitor checks one or two of these boxes. Nobody checks all five.` | `Every wellness-audio competitor checks one or two of these boxes. None checks all five.` | Tightens; matches the "None of them" pattern in §3. |
| 4.3 | P1 | Footer claim "No competitor scores more than two of five" is unverifiable — needs to read as a claim, not a fact | `No competitor scores more than two of five. RESONATE scores five.` | `By our scoring: no competitor exceeds two of five. RESONATE delivers all five.` | Hedges the claim; "scores" applied to RESONATE reads circular. |

---

## Section 5 — Closed Loop diagram (lines 391–443)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 5.1 | P1 | "Six steps. The whole circuit closes in under four seconds." — diagram label says `~2 SECONDS per full revolution`. Body says four. **Contradiction.** | `Six steps. The whole circuit closes in under four seconds.` | `Six steps. The whole circuit closes in under two seconds.` (or fix the diagram label if 4s is correct) | Internal inconsistency. The email sequence (Email 4) says `under two seconds`. Press release says `within two seconds`. Site body is the outlier. |
| 5.2 | P2 | "A prompt is composed every two seconds" — passive | `A prompt is composed every two seconds.` | `The phone composes a new prompt every two seconds.` | Active voice; names the actor (matches the on-device promise). |
| 5.3 | P2 | Long single-paragraph block (96 words) on mobile | (split) | Break after "wraps it around your head." into a second paragraph beginning "Your nervous system responds." | Scannability. |

---

## Section 6 — Three Modes (lines 446–507)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 6.1 | P1 | "Beta and gamma-leaning" — needs em-dash or full word; current hyphenation is ambiguous (is it "beta-and-gamma-leaning"?) | `Beta and gamma-leaning.` | `Beta- and gamma-leaning.` | Suspended hyphen rule. Chicago §7.89. |
| 6.2 | P1 | Focus card: "Music tightens as your attention does" — clean but weak verb "does" | `Music tightens as your attention does.` | `Music tightens as your attention tightens.` (or) `The music tightens with your attention.` | Repetition is intentional; "does" hand-waves the parallel. |
| 6.3 | P0 | **Citation needed.** "sustained 14 Hz attention band" and "40 Hz pulse" are specific scientific claims with no source. BRAND-VOICE-AUDIT item 1 flagged this category as wellness-claim risk. | `Target: sustained 14 Hz attention band, low-variability breath, gentle HRV depression.` | Either cite a source inline or soften to: `Target: sustained beta-band attention, low-variability breath, gentle HRV depression — designed to support focus work.` | "14 Hz attention band" reads as clinical; brand guardrail is "designed to support / associated with." |
| 6.4 | P1 | Calm card: "the 0.1 Hz cardiac-coherence breath drives the bassline" — fine, but "the bassline" feels casual next to "harmonic field opens" | `The 0.1 Hz cardiac-coherence breath drives the bassline.` | `The 0.1 Hz cardiac-coherence breath drives the bass bed.` | "Bass bed" is the canonical term used 3× elsewhere in the page (lineage + pricing list). Consistency. |
| 6.5 | P0 | **Citation needed.** "Verdi-tuned drone bed at 432 Hz" and "sub-bass at 174 Hz Foundation, with whisper-low brown noise" make specific frequency claims that imply efficacy. | (as-is) | Add a single line below modes: `Frequencies referenced are part of the contemplative-music tradition, not clinical prescriptions.` | Pre-empts the same medical-claim risk the science section already disclaims. |
| 6.6 | P1 | Rest card: "sub-50 bpm cruising heart rate" — colloquial "cruising" + missing comma | `2 Hz delta entrainment, sub-50 bpm cruising heart rate.` | `2 Hz delta entrainment; resting heart rate below 50 bpm.` | Semicolon separates two distinct targets; "resting" matches the FAQ language ("resting baseline" on line 478). |
| 6.7 | P2 | Three identical CTAs "Hear · 8s sample" — fine, but no a11y label | `Hear · 8s sample` | Add `aria-label="Hear 8-second Focus sample"` (etc.) | A11y polish — your ACCESSIBILITY-AUDIT.md already exists in this folder. |
| 6.8 | P1 | HR slider H3: "Drag the slider. Watch the score respond." — two imperatives, comma splice avoided but reads choppy | `Drag the slider. Watch the score respond.` | `Drag the slider — watch the score respond.` | Em-dash binds cause and effect; more cinematic. |
| 6.9 | P2 | "A sketch of the live behaviour" — UK spelling, fine, but "sketch" undersells. | `A sketch of the live behaviour.` | `A preview of the live behaviour.` | "Sketch" implies provisional; "preview" implies fidelity. |

---

## Section 7 — The Science (lines 510–526)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 7.1 | P0 | H2 `Designed to. Never cures.` — sentence fragment lacks an object and reads awkwardly. The phrase you want is the one in the FAQ. | `Designed to. Never cures.` | `Designed to support. Never claims to cure.` | Fixes both fragments; matches the canonical RESONATE BRAND.md guardrail phrase "designed to support". |
| 7.2 | P0 | **Citation gap.** Six evidence cards are all paraphrased quotes; only two name the journal. None links out. None has year + author for the foundational claims. | Cards as written. | For each card, append `[Author, Year, Journal — link]` or at minimum a footnote-style `*See sources below* ` and add a `<details>` block at the end of the section. | The page itself says "the literature is named, the limits are named" — but the literature is *paraphrased*, not cited. This contradicts the page's own promise. |
| 7.3 | P0 | **Cross-doc inconsistency.** The press release (line 18) and email sequence (Email 2) both say `2025 Lancet meta-analysis`. The site uses `BJPsych Open · 2025 RCT meta-analysis` for the depression claim and never mentions Lancet on this page — but the FAQ on line 727 cites `Lancet 2025 meta-analysis`. So the page contradicts itself. | Site evidence card vs FAQ. | Pick one source for the music-therapy meta-analysis and use it in both the evidence card and the FAQ. If it is BJPsych Open, update the FAQ. If it is the Lancet, update the evidence card. | Internal contradiction between two on-page locations is worse than between a page and a separate doc. |
| 7.4 | P1 | Evidence card 4: "Personalised, EEG-guided binaural stimulation is the next race." — fine quote, but mixing a forward-looking partnership announcement with RCT evidence weakens the section | (card as-is) | Move card 4 to a separate "On the horizon" sub-block, or remove it. The other five cards are all peer-reviewed; this one is a press release. | Mixing evidence tiers reads as "we'll quote anyone who agrees with us." |
| 7.5 | P1 | "standardised mean difference, minus zero point nine seven" — written out like a TTS narration script (because it was lifted from the audio script). On a webpage, this reads weird. | `standardised mean difference, minus zero point nine seven` | `standardised mean difference of −0.97` | Use numerals on screen; written-out numbers belong in voiceover only. |
| 7.6 | P1 | "perioperative binaural-beat audio significantly reduced anxiety, postoperative pain, systolic blood pressure and heart rate" — quotes a clinical outcome but then the next paragraph says "The phrase that does not appear on this page: 'clinically proven.'" — the quote *implies* clinically proven. | (card as-is) | Add framing: `In surgical-recovery contexts, binaural-beat audio has been associated with reductions in...` | Brand guardrail again: "associated with" not "reduces." BRAND-VOICE-AUDIT item 1. |
| 7.7 | P2 | "Anyone telling you otherwise is selling you something they shouldn't." — combative tone, possibly anti-competitive on a public page | `Anyone telling you otherwise is selling you something they shouldn't.` | `Anyone selling it as medicine should not be.` | Same idea, less swaggery. Reduces legal exposure if a competitor screenshots. |

---

## Section 8 — The Hardware (lines 529–562)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 8.1 | P1 | "Sixty million ears already wearing them" — cute, no source. Apple does not break out AirPods Pro 3 unit sales. | `Sixty million ears already wearing them.` | `Tens of millions of pairs already in the wild.` | Removes a specific number you can't defend; keeps the scale-claim. |
| 8.2 | P1 | Apple Watch card: "adequate for waking modes, occasionally laggy by half a second" — admitting "laggy" in a feature card is honest but tonally clashes with the sales section | `adequate for waking modes, occasionally laggy by half a second.` | `adequate for waking modes, with sub-second latency we treat as a redundancy.` | Same honesty, less self-deprecating. "Laggy" undermines premium feel. |
| 8.3 | P2 | Polar card: "AU$90 if you want the tightest loop" — fine, but inconsistent with the FAQ which also says AU$90 | (consistent) | No change. | Verified consistent with FAQ line 736. Good. |
| 8.4 | P1 | iPhone card: "The brain." — single-noun sentence is on-brand, but the next sentences are dense technical | `The brain. Lyria RealTime WebSocket client. Apple Foundation Models for intent. Apple ASAF for spatial render. iOS 26 or later.` | `The brain. It runs the Lyria RealTime client, Apple Foundation Models for intent, and Apple ASAF for spatial render. iOS 26 or later.` | Convert noun stack to a complete sentence; easier to read aloud. |

---

## Section 9 — Privacy (lines 565–599)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 9.1 | P1 | "3-billion parameter LLM that runs on your A-series chip at thirty tokens a second" — specific perf claim, no source | `a 3-billion parameter LLM that runs on your A-series chip at thirty tokens a second` | `a 3-billion-parameter LLM that runs on-device on Apple silicon` | Drops the tokens/sec claim (unverifiable + can change with iOS versions) and tightens hyphenation. |
| 9.2 | P1 | Repetition: "No API key. No exfiltration. No analytics ping." → then later "No analytics ping. No cloud sync. No backend." — same "No analytics ping" twice in two paragraphs | Two paragraphs both saying "No analytics ping." | Drop one. Keep the first instance; rewrite the second as `No cloud sync. No backend. No analytics — never.` | Same point made twice in a 200-word section. |
| 9.3 | P2 | "It's a quiet kind of moat." — meta-commentary about business strategy in a privacy section reads off | `It's a quiet kind of moat. Endel can't add this without rewriting their backend.` | Move the entire "quiet kind of moat" paragraph to the §4 Moat section, or drop it. | Privacy section should sell privacy, not competitor positioning. |

---

## Section 10 — The Lineage (lines 602–613)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 10.1 | P1 | "Sufi dhikr at the 0.1 Hz coherence frequency" — claiming a 14th-century practice operated at "0.1 Hz" is technically projecting a modern measurement backward | `Sufi dhikr at the 0.1 Hz coherence frequency` | `Sufi dhikr at what we now measure as 0.1 Hz coherence` | Honest framing; the Sufis didn't measure in Hertz. |
| 10.2 | P2 | "Twenty-five centuries of practice" — strong, no issue | (keep) | — | — |
| 10.3 | P1 | "The tradition stays. The score adapts." — good close, but earlier in the paragraph "The new thing is the loop itself" already made this point — slight redundancy | (keep both — they're at different volumes) | No change required, but consider trimming "The new thing is..." sentence if tightening for length. | Optional. |

---

## Section 11 — Pricing (lines 616–643)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 11.1 | P0 | **Cross-doc inconsistency.** Press release (line 14) says `AU$30 lifetime`. Email sequence Email 3 says `AU$30. Once. Lifetime.` Site uses `Pay once · Yours forever` + `Lifetime in.` — three different phrasings of the same promise across one launch. | `One price. Lifetime in.` / `Pay once · Yours forever` | Lock one canonical phrase across all three: recommend `AU$30. Once. Lifetime.` (from email sequence Email 3 subject B — already A/B-tested copy). | Brand consistency at the purchase moment matters more than anywhere else on the page. |
| 11.2 | P1 | "the 30-month FREQUENCY plan" — first and only mention of "30-month" on the page. Email sequence and press release both say "twelve months of monthly content drops." **Number mismatch.** | `every update through the 30-month FREQUENCY plan` | `every update through the 12-month FREQUENCY content schedule` (or whichever number is correct) | Pick the real number. Currently three different durations exist across launch assets (12mo in email + press, 30mo on site). |
| 11.3 | P0 | **Weak CTA.** Primary purchase button reads `Begin · Pay Once`. "Begin" doesn't signal purchase; "Pay Once" is awkward as a verb phrase. | `Begin · Pay Once` | `Get RESONATE · AU$30 lifetime` | The user is one click from Gumroad. Be explicit. The price + lifetime should appear on the button, not just the card. |
| 11.4 | P1 | "Founder's commentary on each mode" — singular possessive in a list of plural features | `Founder's commentary on each mode` | `Founder commentary on each mode` | Drop the apostrophe — reads as a noun-adjunct, parallel with the other list items. |
| 11.5 | P2 | "Pricing list" `· ·` bullets are visually crowded with `·` separators inside the items themselves (e.g. "All three modes · Focus · Calm · Rest") | `All three modes · Focus · Calm · Rest` | `All three modes: Focus, Calm, Rest` | Reads cleaner; the bullet itself is already a `·`. |

---

## Section 12 — Day One signup (lines 646–659)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 12.1 | P1 | H2 `Send me Day One.` — imperative *to* the company is unusual on a marketing form | `Send me Day One.` | `Get Day One in your inbox.` | More conventional; "Send me X" works in ads, not on landing forms. |
| 12.2 | P1 | "The remaining six layer in the modes." — "layer in" is a weak verb construct | `Day One walks you through the closed loop in your own ears. The remaining six layer in the modes.` | `Day One walks you through the closed loop in your own ears. The next six introduce the modes.` | "Introduce" is concrete; "layer in" is jargon. |
| 12.3 | P0 | **CTA weakness.** Button just says `Begin`. On a form with one input (email), the button should describe the result. | `Begin` | `Send me Day One` | Tells the user what happens on click. Drops bounce. |
| 12.4 | P1 | "founding-100 invite is yours" — bare noun phrase, missing article | `founding-100 invite is yours` | `your founding-100 invite is waiting` | Reads as a sentence; current reads as a Slack message. |

---

## Section 13 — Your Voice / feedback (lines 662–697)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 13.1 | P1 | H2 `Tell me what worked.` — fine, but "Send Feedback" CTA below is generic | CTA: `Send Feedback` | `Send to Jamie` | Personalises; the page already says "Read by Jamie." Match the CTA. |
| 13.2 | P2 | "Every message is read by Jamie." — passive | `Every message is read by Jamie.` | `Jamie reads every message.` | Active. Names the actor first. |
| 13.3 | P2 | "If the loop closes for you — or doesn't" — fragment that opens the sentence | (keep — on-brand) | No change. | Within voice. |

---

## Section 14 — FAQ (lines 700–769)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 14.1 | P1 | Q1: "AU$30 × volume is enough runway for the monthly content drops I've committed to for the next 12 months" — confirms the **12-month** figure that contradicts the pricing list's "30 months" (see 11.2). | (as-is) | Reconcile with §11.2. | Internal contradiction. |
| 14.2 | P1 | Q2: "Endel adapts to weather, time-of-day, and heart rate from your Watch — but it's rule-based, runs cloud-side, and crossfades between presets." Long, but clear. The dash break is fine. | (keep) | No change. | Within voice. |
| 14.3 | P0 | Q3: **Citation specifics — Lancet 2025 meta-analysis "across 26 RCTs"**. The science section evidence card cites "BJPsych Open · 2025 RCT meta-analysis" with the −0.97 SMD figure. So which journal published the music-therapy meta-analysis the page is leaning on? | `Lancet 2025 meta-analysis on music therapy — large effect sizes against anxiety across 26 RCTs.` | Pick one source. Verify the n=26 RCT figure. Make the science card and the FAQ agree. | Same issue as 7.3. |
| 14.4 | P0 | Q3: "It supports a daily practice associated with parasympathetic activation" — good, on-guardrail. But the *previous* sentence in same answer says "**does NOT claim**: that it treats anxiety, ADHD, depression, or insomnia" — listing those conditions in the disclaimer can paradoxically tie the product to them in the reader's mind. Standard regulatory-risk pattern. | `What RESONATE does NOT claim: that it treats anxiety, ADHD, depression, or insomnia.` | `What RESONATE does NOT claim: that it treats any medical condition.` | Removes the named-condition list. Same disclaimer power, no specific-condition associations. |
| 14.5 | P1 | Q4: "(any modern series with HRV streaming via HealthKit)" — vague. Apple Watch Series 4+ all have HRV. Be specific or drop the parenthetical. | `Apple Watch (any modern series with HRV streaming via HealthKit)` | `Apple Watch Series 4 or newer` | Specific; reduces support questions. |
| 14.6 | P2 | Q5: "the stateless Lyria audio stream. No identifiers attached, no replay possible, no account required." — sentence fragment after the period | (keep — on-brand fragment style) | No change. | Within voice. |
| 14.7 | P1 | Q6: "I'll refund the AU$30 in full" — good, but next sentence "After 14 days, refunds are at my discretion" creates uncertainty for the buyer at decision time. | `After 14 days, refunds are at my discretion — write to me and we'll work it out.` | `After 14 days, write to me — I've never refused a reasonable request.` | Same meaning, more confidence-inspiring. The "discretion" word is the friction. |
| 14.8 | P1 | Q8: "Every founding-member email gets read by me personally" — "gets read" is weak passive | `Every founding-member email gets read by me personally and answered within 48 hours` | `I read every founding-member email personally and answer within 48 hours` | Active voice; matches the §13.2 fix. |

---

## Section 15 — Footer (lines 772–803)

| # | Sev | Issue | Before | After | Reason |
|---|-----|-------|--------|-------|--------|
| 15.1 | P1 | "RHYTHMIX Frequency · Resonate" in footer brand uses Title Case for FREQUENCY where the rest of the page uses ALL CAPS for FREQUENCY | `RHYTHMIX Frequency · Resonate` | `RHYTHMIX FREQUENCY · RESONATE` | Brand-name casing inconsistency. Press release + email + nav header all use ALL CAPS. |
| 15.2 | P2 | Medical block: long, dense paragraph. Hard to scan but content is correct and regulatorily important. | (keep substance) | Consider breaking after "...heart rate variability." into two paragraphs. | Scannability; the content is non-negotiable. |
| 15.3 | P1 | `© 2026 · Crafted on iPhone` — cute but reads as a brag at the footer | `© 2026 · Crafted on iPhone` | `© 2026 RHYTHMIX FREQUENCY · Crafted on iPhone in Perth` | Adds attribution + geography (helps SEO + press release matches "Perth, Western Australia"). |
| 15.4 | P2 | Footer links list uses `→` arrow inline with text — fine for visual, screen reader will read "right arrow" | (keep visual) | Add `aria-hidden="true"` to the arrow glyphs OR use a CSS `::after` pseudo-element. | A11y polish; same note in ACCESSIBILITY-AUDIT.md territory. |

---

## Cross-document consistency check

### vs `email-sequence.md`

| Match? | Item | Site | Email | Action |
|--------|------|------|-------|--------|
| Yes | AU$30 lifetime price | ✓ | ✓ | — |
| **No** | Music-therapy meta-analysis source | "BJPsych Open · 2025" (science card) / "Lancet 2025" (FAQ) | "The Lancet confirmed... last year" (Email 1) / "Lancet meta-analysis" (Email 2) | **Reconcile.** Pick one journal across both docs. |
| **No** | Content schedule duration | "30-month FREQUENCY plan" (pricing) / "12 months" (FAQ Q1) | "twelve months of monthly content drops" (Email 5) | **Pick one number.** |
| Yes | "Closed-loop biometric music" framing | ✓ | ✓ | — |
| **No** | Subject-line consistency: Email 3 subject B is `It's live. AU$30. Once. Forever.` — site H2 in pricing is `One price. Lifetime in.` | Two different lifetime framings | One canonical: `AU$30. Once. Lifetime.` | Lock pricing H2 to match the launch email. |
| Yes | "Three modes. Focus. Calm. Rest." | ✓ (modes H2 line 449) | ✓ (Email 3) | — |

### vs `press-release.md`

| Match? | Item | Site | Press Release | Action |
|--------|------|------|---------------|--------|
| **No** | Headline framing | `Music that breathes with you.` | `Australian indie studio releases first closed-loop biometric music app for AirPods Pro 3` | Two different headlines is **fine and expected** (poetic vs news). No fix needed. |
| Yes | "first... to combine [five elements]" claim | ✓ | ✓ | — |
| **No** | Loop-close timing | "under four seconds" (site §5) | "within two seconds" (PR para 1) | **Fix site to match PR.** Same issue as 5.1. |
| Yes | Otto Loewi 1921 / Lehrer 1995 / 0.1 Hz / 5.5s in 5.5s out | ✓ (FAQ Q3) | ✓ | — |
| **No** | Spatial render technology | Site says `Apple's spatial audio engine` (line 396) and `Apple ASAF` (line 423) | PR says `Apple PHASE with ARKit head-tracking` (line 16) | **Pick one.** Apple ASAF (Apple Spatial Audio Format) and Apple PHASE are different things. This is a technical credibility risk. |
| Yes | "wellness practice instrument, not a medical device" | ✓ (footer + FAQ) | ✓ | — |

### vs `BRAND-VOICE-AUDIT.md`

| Match? | Item | Site | Audit guardrail | Action |
|--------|------|------|-----------------|--------|
| **No (P0)** | Medical-claim phrasing | "music therapy was significantly more effective than controls in reducing depressive symptoms" (science card line 522); "Perioperative binaural-beat audio significantly reduced anxiety" (line 521) | Audit item 1 (HIGH severity): "No medical claims... say 'designed to support', 'associated with'" | **Rewrite both evidence cards with "associated with" framing.** |
| **No** | On-device canonical phrase | Site uses "Nothing leaves your phone." (3×) | Audit item 9: canonical phrase is "kept on this device" | Update hero, privacy, and FAQ to canonical phrase, OR document the divergence as RESONATE-specific. |
| Yes | "designed to support" appears in footer + pricing card | ✓ | ✓ | — |
| **No** | Brand casing: FREQUENCY | Footer says "Frequency" (Title Case); rest of page says "FREQUENCY" (ALL CAPS) | Convention is ALL CAPS | See 15.1. |

---

## Priority ranking — top 12 to fix before launch

In order. Fix top-to-bottom.

1. **(P0, 5.1 + PR-consistency)** Resolve loop-close timing: site says 4 seconds, diagram says 2 seconds, PR says 2 seconds. Pick 2 and update site body.
2. **(P0, 7.3 + 14.3)** Reconcile music-therapy meta-analysis source. Lancet vs BJPsych Open — site contradicts itself between science card and FAQ.
3. **(P0, 11.2 + 14.1)** Reconcile content-schedule duration. Pricing says 30 months, FAQ says 12 months, email + PR say 12 months.
4. **(P0, 14.4)** Remove named-condition list from FAQ Q3 disclaimer ("anxiety, ADHD, depression, insomnia"). Regulatory risk.
5. **(P0, 7.1)** Fix headline `Designed to. Never cures.` — fragments don't parse. Use `Designed to support. Never claims to cure.`
6. **(P0, 7.2)** Add real citations (author, year, journal, link) to all six evidence cards. The page promises "the literature is named" — make good on it.
7. **(P0, 6.3 + 6.5)** Add a single disclaimer below the Modes section covering the Hz claims (14 Hz, 40 Hz, 432 Hz, 174 Hz, 528 Hz, 2 Hz). Same regulatory exposure as the medical claims.
8. **(P0, 2.3 + 11.3 + 12.3)** Rewrite three weak CTAs: Hero "Begin · AU$30" → `Get RESONATE · AU$30 lifetime`; Pricing "Begin · Pay Once" → `Get RESONATE · AU$30 lifetime`; Day One "Begin" → `Send me Day One`.
9. **(P0, 11.1)** Lock the lifetime pricing phrase to one canonical form across site + email + PR. Recommend `AU$30. Once. Lifetime.`
10. **(P1, PR-consistency)** Resolve spatial-audio tech naming: PR says Apple PHASE + ARKit; site says ASAF. Different products.
11. **(P1, BRAND-VOICE-AUDIT item 1)** Rewrite the two evidence cards that use "significantly reduced" / "more effective than" to use "associated with" framing.
12. **(P1, 3.2 + 9.2)** Cut the two clearest redundancies: §3 "None of them" 4× → 3× variations; §9 "No analytics ping" twice → once.

---

## Totals

- **P0 (must fix):** 12
- **P1 (should fix):** 24
- **P2 (style preference):** 11
- **Total issues:** 47
- **Internal site contradictions:** 3 (loop timing, content-schedule duration, journal source)
- **Cross-doc inconsistencies:** 4 (loop timing vs PR, spatial-audio tech vs PR, pricing phrasing vs email, content-schedule vs email + PR)
- **Brand-voice violations (per BRAND-VOICE-AUDIT.md):** 2 medical-claim breaches (lines 521, 522), 3 canonical-phrase drifts ("Nothing leaves your phone" used where "kept on this device" is canonical), 1 brand-casing slip (footer "Frequency" vs "FREQUENCY")
- **Citation-gap claims:** 6 evidence cards + 4 frequency claims in Modes section + 1 perf claim ("thirty tokens a second")

---

*Review only — no edits applied to `resonate.html`.*
