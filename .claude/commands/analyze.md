---
description: Multi-agent deep analysis. Fans out the topic to 17 specialist sub-brains in parallel, synthesises their reads into one coherent answer, and writes the result back to the brain MCP for next time.
argument-hint: <anything you want analysed — a question, a plan, a claim, a piece of writing, a decision>
---

The user wants a deep multi-agent analysis of:

> $ARGUMENTS

If `$ARGUMENTS` is empty, ask once: "What should I analyse?" and stop.

## Phase 0 — Brain context (sequential, must run first)

Invoke the **brain-historian** sub-agent with the topic. It will query the `brain` MCP server for prior memories, decisions, and contradictions and report back with `[id:N]` references. Hold its output — you'll feed it into Phase 1 and link to it in Phase 3.

If the `brain` MCP tools are not available, skip Phase 0 and proceed without prior context. Do not block.

## Phase 1 — Fan out (parallel)

Spawn ALL of the following sub-agents in **a single message with multiple Agent tool calls** so they run concurrently. Pass each the original topic plus a 1-paragraph excerpt of what the historian found.

1. brain-summarizer
2. brain-critic
3. brain-devils-advocate
4. brain-pattern-finder
5. brain-fact-checker
6. brain-decision-framer
7. brain-planner
8. brain-researcher
9. brain-emotional
10. brain-financial
11. brain-security
12. brain-technical
13. brain-creative
14. brain-systems-thinker
15. brain-strategist
16. brain-simplifier

(16 in parallel after the historian — the brain has 17 sub-brains total.)

Tip: if the topic is *clearly* not technical (e.g., a personal life decision), you may skip `brain-technical` and `brain-security`. Always run at least 10.

## Phase 2 — Synthesis

Once every sub-agent has reported, write a synthesis structured as:

**TL;DR** — 2 sentences. The single sharpest read.

**Where the brains agree** — 2–4 bullets. Convergent points across multiple agents.

**Where they disagree** — 2–4 bullets. Genuine tensions worth surfacing, with which agents took which side.

**The decision / move** — what you'd actually do, citing which sub-agent's reasoning is doing the load-bearing work.

**Open questions** — top 3 the researcher and fact-checker flagged, that you'd resolve before committing.

**Prior brain context** — the relevant `[id:N]` memories the historian surfaced, with one line each on how they bear on the decision.

Keep the synthesis under ~600 words. Quality over coverage.

## Phase 3 — Write back to the brain

After the synthesis is shown to the user, call `brain_remember` with:

- `content`: a concise, self-contained version of the synthesis (≤500 chars). Include the topic so future-you can find it.
- `kind`: `"analysis"`
- `tags`: extract 3–6 relevant tags from the topic (lowercase, no spaces).
- `source`: `"analyze:<short-slug-of-topic>"`.

Then, for any prior memory the historian surfaced as directly relevant (`[id:N]`), call `brain_relate` from the new analysis's id to that memory with `kind: "derived_from"` (if it informed the analysis) or `kind: "supports"` / `"contradicts"` as appropriate.

Tell the user: "Saved as memory id `<N>`, linked to `<M>` prior memories."

If the brain MCP isn't available, skip Phase 3 silently.

## Rules

- Do not fabricate sub-agent output. If an agent fails or returns empty, say so in the synthesis.
- Do not show the user every sub-agent's full output verbatim — synthesise. They can ask for a specific brain's full read by name if they want it.
- If the topic is trivial enough that one brain would suffice, say so and just answer directly — don't theatre-perform a 17-agent analysis on "what's 2+2".
