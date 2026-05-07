---
description: Inspect the second brain — stats, recent episodes, top tags. Optional subcommand for decay/prune/export.
argument-hint: [stats | recent | decay [days] | prune [threshold] | export]
---

The user wants to inspect / maintain the brain.

Argument: `$ARGUMENTS` (may be empty).

Parse the first whitespace-separated token as the subcommand. Default subcommand: `stats`.

## Subcommands

### `stats` (default)

1. Call `brain_stats`.
2. Render as:
   ```
   Brain — N memories · M edges · half-life: H days

   By kind:
     fact         42
     decision     11
     analysis      7
     ...

   Top tags:
     pricing (12) · rhythmix (9) · landing-page (5) · ...
   ```

### `recent`

1. Call `brain_episodes` with `limit: 10`.
2. List each episode/analysis on one line: `[id:N] (kind, dd-mm) one-line summary of content`.

### `decay [days]`

1. Parse the second token as a number; if absent, omit it (keeps current half-life).
2. Call `brain_decay` with `half_life_days` (or no arg).
3. Report: `Decay applied · touched X memories · half-life now H days`.

### `prune [threshold]`

1. Parse second token as a float; default `0.05`.
2. Call `brain_prune` with `threshold`.
3. Report: `Pruned X weak memories (strength < T)`.

### `export`

1. Call `brain_export`.
2. Tell the user how many memories and edges were exported and offer to write the JSON to `brain-export-<timestamp>.json` in the repo root if they confirm. Do NOT write the file unless they say yes.

## Rules

- If the brain MCP is not available, say so and stop.
- Don't run `prune` without explicit `prune` subcommand — never destructive by default.
- All output stays under 30 lines.
