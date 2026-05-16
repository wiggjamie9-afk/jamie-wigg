---
description: Deep analysis of a spec's requirements.md. Detects ambiguity, logical contradictions, and gaps. Surfaces each finding with a proposed fix.
argument-hint: <spec-slug>
---

Invoke the `spec-analyze` skill to run a two-pass analysis on:

> specs/$ARGUMENTS/requirements.md

**Pass A — Ambiguity**: for each requirement, generate two plausible interpretations. If they diverge at the code level, flag it.

**Pass B — Logical**: check pairs of requirements for contradictions; check the set for gaps in common-case coverage (empty state, errors, concurrency, authz, observability, deletion, migration, limits).

For each finding, use `AskUserQuestion` with the two-option resolution. Update `requirements.md` in place with resolved language. Note any downstream impact on `design.md` / `tasks.md` but do not regenerate them unless the user explicitly asks.

Suggest `/spec-run $ARGUMENTS` as the next step once analysis is complete.
