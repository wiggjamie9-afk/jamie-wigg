---
description: Run a RHYTHMIX tactical sales-copy prompt from prompts/sales-copy.md
---

Run a tactical RHYTHMIX sales-copy prompt.

**Argument:** `$ARGUMENTS` — name of the prompt to run. Accepts:

- `headlines` — 10 sales-page headlines
- `value-prop` — value proposition built on 3 outcomes
- `problem` — problem section under 200 words
- `for-you-if` — "this is for you if" (5 statements)
- `positioning` — 70–90 word positioning statement
- `not-for-you-if` — "this is not for you if" (4 statements)

**Steps:**

1. If `$ARGUMENTS` is empty, list the six options above and stop — don't pick one yourself.
2. Read `prompts/sales-copy.md` and find the matching numbered section.
3. Read `landing.html` to ground the prompt in the current hero, marquee, and stats copy so output is consistent with what already exists.
4. Read `DESIGN.md` for brand voice rules (no buzzwords, lead with metric, etc.).
5. Execute the prompt verbatim and return the output. Don't summarise the prompt back at me first — just run it.
