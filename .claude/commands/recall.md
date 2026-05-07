---
description: Search the second brain. Returns relevant memories ranked by strength × recency, and reinforces them on read.
argument-hint: <query — keyword, phrase, or empty for the latest memories>
---

The user wants to recall memories about:

> $ARGUMENTS

## Steps

1. If `$ARGUMENTS` is empty, call `brain_recall` with no query and `limit: 10` to show the most recently used memories.

2. Otherwise, call `brain_recall` with:
   - `query`: $ARGUMENTS, lightly cleaned
   - `limit`: 10
   - `min_strength`: 0.05

3. **If recall returns nothing**, try once more with synonyms / a broader phrasing. If still nothing, say: "Brain has no memory of this." and stop.

4. Format the response as a compact list, one memory per line:
   `[id:N] (kind, strength X.XX) content — tags: a, b, c`

   Sort by effective_strength descending. Show at most 10.

5. After the list, add a 1-sentence read of the cluster — what these memories have in common, or what the user has been thinking about in this area. Skip this if there's only 1 result.

6. Offer a follow-up: "Want me to walk the graph from any of these (`brain_neighbours`)?"

## Rules

- Don't paraphrase memories — show them verbatim with their ids.
- Reading reinforces, so this command intentionally has a side effect.
- If the brain MCP isn't available, say so and stop.
