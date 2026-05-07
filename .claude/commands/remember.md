---
description: Store something in the second brain. Auto-classifies kind and tags from the input.
argument-hint: <the thing to remember — fact, decision, preference, idea, anything>
---

The user wants to remember:

> $ARGUMENTS

If `$ARGUMENTS` is empty, ask: "What should I remember?" and stop.

## Steps

1. **Classify the kind** based on the wording. Pick exactly one:
   - `fact` — a stable piece of information ("RHYTHMIX uses a $149 lifetime tier")
   - `decision` — a choice that's been made ("Decided to lead with the lifetime tier on the landing page")
   - `preference` — a personal taste / rule ("I prefer 60s videos over 30s for promos")
   - `idea` — an unproven thought ("Maybe partner with indie podcasters")
   - `question` — an open question to revisit ("Is Suno's $10 plan unlimited generations?")
   - `insight` — a learning, often distilled from experience
   - `episode` — a thing that happened, with time/place context
   - default to `fact` if genuinely ambiguous

2. **Extract 2–5 tags** — lowercase, no spaces, no punctuation. Pull from real nouns/concepts in the input (e.g. `pricing`, `rhythmix`, `landing-page`).

3. Call `brain_remember` with the content (verbatim from $ARGUMENTS, lightly cleaned), the chosen kind, and the tags. Set `source` to `"remember:<short-slug>"`.

4. Respond in **one line**:
   `Saved [kind] memory id <N> · tags: <tags>`

5. If the input mentions an existing memory by reference ("this contradicts what we decided last week about X"), follow up with a `brain_recall` to find that memory and a `brain_relate` call linking the two — but only if the reference is explicit. Don't fabricate links.

## Rules

- Don't ask follow-up questions unless input is genuinely empty.
- Don't paraphrase the user's claim. Store their words.
- One memory per call. If the input contains multiple distinct facts, split into multiple `brain_remember` calls and report all ids.
