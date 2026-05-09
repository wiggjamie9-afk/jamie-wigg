---
description: Refresh competitor pricing/feature data in src/data/comparison.ts by checking Suno, Udio, LANDR, and ACE-Step UI's current public sources. Updates the comparison table and "Last updated" date.
argument-hint: [--dry-run] (optional — shows changes without writing)
---

The user wants to refresh the comparison data that powers `/compare` and the `/vs-*` pages. The current data lives at `site/src/data/comparison.ts` and the "Last updated" line lives in `site/src/pages/compare.astro`.

## Step 1 — Read current state

Read `site/src/data/comparison.ts` and capture every row's current values so you can diff at the end.

## Step 2 — Fetch current public data

Use `WebFetch` (or `WebSearch` as fallback) for each of these sources. Be polite — one fetch per source. Pull only the publicly listed pricing pages:

| Competitor | Primary source | What to extract |
|---|---|---|
| **Suno** | https://suno.com/pricing | Free / Pro / Premier prices, monthly credit caps, royalty terms (which plans grant 100% commercial rights) |
| **Udio** | https://www.udio.com/pricing | Standard / Pro prices, monthly generation caps, royalty terms |
| **LANDR** | https://www.landr.com/pricing/ | Studio Pro / Studio MAX or whichever plans cover mastering+distribution; check if generation has been added |
| **ACE-Step UI** | https://github.com/ace-step/ACE-Step (or the ACE-Step UI repo README) | Required GPU VRAM, supported features, whether distribution / mastering has been added (still no, almost certainly) |

For each fetch, extract just the facts that map to existing rows in `comparison.ts`. **Do not** reformat unrelated rows.

## Step 3 — Compute the diff

For each row in `rows`, compare current value to fetched value. Only mark a row as needing an update if the fetched data clearly contradicts what's there. If a source is ambiguous or the page changed structure, **leave the row alone and flag it for the user**.

Common changes to expect:
- Suno / Udio bumping monthly prices (check both monthly and annual)
- LANDR adding generation (would change "AI music generation" from `✗` to `✓`)
- ACE-Step UI bumping minimum VRAM, or adding a hosted version

## Step 4 — Show the diff before writing

Print a compact diff to the user, e.g.:

```
Suno    Price            $10–30/mo  →  $12–36/mo
Udio    Royalty share    Pro plan only  →  All paid plans   (NEW)
LANDR   AI music gen     ✗  →  (still ✗, no change)
```

If `$ARGUMENTS` contains `--dry-run`, stop here and don't write anything.

## Step 5 — Apply the changes

If the user is happy (or no `--dry-run`), edit:
1. `site/src/data/comparison.ts` — only the rows that genuinely changed.
2. `site/src/pages/compare.astro` — update the `Last updated <Month Year>` line near the bottom of the table section to today's month/year.

## Step 6 — Verify the build

Run `cd site && npm run build` to make sure nothing broke. The `/vs-*` pages all consume the same data file so a single change propagates everywhere.

## Step 7 — Commit (do not push)

Commit with a clear message like `chore: refresh comparison data — Suno +$2, Udio royalty terms updated`. **Do not push** unless the user asks; let them review first.

## Safety

- **Never** invent values. If a source page won't load or its structure has changed, say so and skip that competitor.
- **Never** edit copy in the per-competitor pages (`vs-suno.astro` etc.) — they reference the table data via the shared component and shouldn't need touching. The exception: stat-card numbers in the hero (e.g. "vs Suno Pro $30/mo") which are hardcoded — flag those for manual review if Suno's price changed.
- **Always** include the source URL in the diff output so the user can verify.
