---
name: spec-analyze
description: Deep analysis of a spec's requirements.md. Detects semantic ambiguity (requirements that could mean two different things), logical contradictions, and gaps. Surfaces each finding with a proposed fix via AskUserQuestion. Use after /spec-quick and before /spec-run. Triggered by /spec-analyze.
---

# Spec Analyze

Two-pass review of `specs/<slug>/requirements.md`. Catches the kinds of issues a read-through misses: words that mean different things to different developers, two requirements that can't both hold, and silent gaps.

This is the LLM-best-effort version of what neurosymbolic analysis does in Kiro. Treat the contradiction pass as a strong sanity check, not a mathematical proof.

## When to use

User says:
- "/spec-analyze <slug>", "analyze the requirements", "check the spec"
- after `/spec-quick` and before `/spec-run`
- when something in the spec "feels off but I can't say why"

## Process

### 1. Locate the spec

From `$ARGUMENTS` or context, resolve the slug. Read `specs/<slug>/requirements.md`.

If the file doesn't exist, stop and tell the user to run `/spec-quick` first.

### 2. Pass A: Ambiguity detection

For each requirement R1..Rn:

1. **Generate two plausible interpretations** of what the requirement means at the code level. Be honest — if both interpretations would produce essentially the same code, skip this requirement.

2. **If the interpretations diverge in implementation** (different DB action, different API shape, different user-visible behavior), record an ambiguity finding:

   ```
   R<n>: "<exact text>"
   Interpretation A: <one sentence>
   Interpretation B: <one sentence>
   Why it matters: <one sentence — what code would differ>
   ```

Classic ambiguity triggers — flag every time you see one:
- **"delete" / "remove"** → hard delete vs. soft delete vs. archive
- **"user"** → end-user vs. admin vs. service account
- **"async" / "in the background"** → fire-and-forget vs. queued with retry vs. eventually-consistent
- **"validate"** → reject vs. coerce vs. warn-only
- **"cache"** → in-memory vs. shared vs. CDN; TTL?
- **"notify"** → email vs. in-app vs. webhook; sync vs. async
- **"retry"** → how many times, with what backoff, on which errors
- **bare numbers** ("up to 100 items") → per request, per user, per day?
- **time words** ("recently", "old", "stale", "soon") → quantify

### 3. Pass B: Logical analysis

Two checks against the full requirement set.

#### Consistency (contradictions)

For each pair (Ri, Rj), ask: is there any implementation that satisfies both? If you cannot construct one, record a contradiction:

```
R<i> ⟷ R<j>
R<i> says: <text>
R<j> says: <text>
Conflict: <one sentence — why no implementation satisfies both>
```

Classic contradiction shapes:
- Rate limit X vs. throughput requirement Y where X < Y
- "Synchronous response" + "operation must complete" + "operation takes > timeout"
- "All users see X" + "users in role Y see Z" where X ≠ Z and no precedence is given
- Permission rule allows action + another rule forbids same action

#### Gaps (silent on common cases)

Check whether the requirements address each of these. Flag the ones they don't:

- **Empty / null / zero state** — what happens at first run, no data, deleted everything
- **Error cases** — network failure, validation failure, downstream service down
- **Concurrent access** — two users / sessions doing the same thing simultaneously
- **Authorization** — who can do this; who can't
- **Auditability** — is this logged / reversible / inspectable
- **Limits** — input size, output size, rate, storage, time
- **Deletion / cleanup** — what happens to created data when the feature is disabled or the user leaves
- **Migration** — how existing data / users transition into this feature
- **Observability** — how a developer would debug this feature breaking

Don't flag a gap if the answer is genuinely "doesn't apply" (e.g. no authorization for a CLI flag on a dev tool). Use judgment.

### 4. Surface findings

Present a compact summary first:

```
specs/<slug>/requirements.md
  Ambiguities: <count>
  Contradictions: <count>
  Gaps: <count>
```

Then walk through each finding, ordered by severity (contradictions → ambiguities → gaps).

For each, use `AskUserQuestion` with the two interpretations / two-option resolution as the choices. Include `(Recommended)` on the option that aligns better with conventions in `CLAUDE.md` / `CONTEXT.md` / ADRs, if any.

For gaps, the question is usually:
- "Add a new requirement for X?" — option A: "Yes, here's the proposed wording: ..." — option B: "No, intentionally out of scope"

### 5. Apply fixes

After the user resolves each finding, update `requirements.md`:

- **Ambiguity resolved** → rewrite the requirement text to remove the ambiguity. Keep the ID.
- **Contradiction resolved** → either rewrite one requirement, drop one, or add a precedence rule. Keep IDs of survivors.
- **Gap → add requirement** → append a new requirement with the next available ID. Add a note to `## Out of scope` if explicitly excluded instead.

Re-derive `design.md` and `tasks.md` only if the user explicitly asks — analysis usually shouldn't regenerate downstream artifacts. Note any tasks that may need updating in your final summary.

### 6. Final report

```
Analysis complete.
  Resolved: <n> ambiguities, <n> contradictions, <n> gaps
  Deferred: <list>
  Out-of-scope: <list>

Next step: /spec-run <slug> (or /spec-quick to regenerate downstream artifacts if requirements changed substantially)
```

## What this skill does NOT do

- Does not generate or regenerate the spec from scratch.
- Does not run automated reasoning over the code — it analyzes the prose of `requirements.md`. If you need code-level validation, write tests in the spec-run phase.
- Does not invent requirements. Every flagged gap is offered as a question to the user, not silently added.
