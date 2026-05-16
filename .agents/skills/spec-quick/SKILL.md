---
name: spec-quick
description: Fast-track spec generation. Scans the workspace, asks 2-4 clarifying questions up front, then auto-generates requirements.md, design.md, and tasks.md in one pass. Use when the user wants to plan a feature without the full step-by-step approval flow. Triggered by /spec-quick.
---

# Spec Quick

A faster path to the same artifacts the slow spec flow produces. Same traceability and correctness, tighter feedback loop.

## When to use

User says one of:
- "spec out X", "plan X", "/spec-quick X"
- "I know what I want — just lay it out"
- "draft a spec for X"

Use the slow flow (`/grill-with-docs` or interactive spec) instead when the user is **exploring unfamiliar territory** or says "help me figure this out". Quick plan assumes the user knows roughly what they want.

## Process

### 1. Read the feature description

Take it from `$ARGUMENTS` (when invoked as a slash command) or from the current conversation context.

If the description is one short sentence with no detail, stop and ask the user to elaborate briefly — quick plan still needs a real prompt to anchor on.

### 2. Scan the workspace

Read these in parallel, only the ones present:

- `CLAUDE.md` — project conventions
- `CONTEXT.md` — domain glossary
- `docs/adr/` — list filenames, read any ADRs touching the same area as the feature
- `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` — stack detection
- Root directory listing — overall project shape

Goal: enough context to ask **stack-specific, project-specific** clarifying questions instead of generic ones. If you see `hyperframes` in dependencies and the feature is a video, ask about scenes and duration, not about React rendering.

### 3. Ask 2-4 clarifying questions via `AskUserQuestion`

Target four dimensions; pick the ones with real uncertainty for this feature:

- **Scope / constraints** — what's in vs. out, hard limits (time, budget, perf)
- **Ambiguity** — words in the prompt that could mean two things ("delete" → soft or hard? "user" → end-user or admin?)
- **Implementation fork** — extend existing module vs. build new; which library; which storage
- **Direction** — the feature's shape (sync vs. async; CLI vs. web UI; per-user vs. global)

For each question, supply your **recommended option first** with `(Recommended)` in the label, plus 1-3 alternatives. Skip questions where context already answers them.

If everything is obvious from context, skip this step entirely and tell the user "context is clear, generating now".

### 4. Derive a slug

Convert the feature name to kebab-case, ≤40 chars. Confirm with the user only if it collides with an existing `specs/<slug>/`.

### 5. Generate three files in one pass

Write all three to `specs/<slug>/`:

#### `requirements.md`

```markdown
# Requirements: <Feature Name>

## Problem
<1-3 sentences: what's broken or missing from the user's POV>

## Goal
<1-2 sentences: what success looks like>

## Functional requirements

- **R1**: <single, testable statement>
- **R2**: ...
- **R3**: ...

## Non-functional requirements

- **N1**: <perf, security, accessibility, etc. — only the ones that matter>

## Out of scope

- <explicit non-goals — at least one>

## Open questions

- <anything still uncertain after the clarifying round; empty if all resolved>
```

Each requirement is a **single sentence** with a stable ID (R1, R2, ...). The IDs are referenced from `tasks.md` and `design.md` — never renumber after generation.

#### `design.md`

```markdown
# Design: <Feature Name>

## Approach
<2-4 sentences: the chosen approach and why, referencing requirement IDs>

## Components

### <ComponentA>
- **Responsibility**: <one sentence>
- **Files**: `<path/glob>`
- **Interface**: <function signature, API endpoint, CLI flag, or schema — whichever is decisive>
- **Satisfies**: R1, R3

### <ComponentB>
...

## Data
<schema changes, data flow, or "no data changes" — be explicit either way>

## Risks
- <risk + mitigation, only if there's a real one>
```

Match the codebase's existing patterns. Use the domain language from `CONTEXT.md`. Cite any relevant ADRs.

#### `tasks.md`

```markdown
# Tasks: <Feature Name>

Tasks have stable IDs (T1, T2, ...), explicit file globs, and explicit `depends`. The `spec-run` skill builds a dependency graph from these.

- [ ] **T1** — <verb-phrase title, e.g. "Add user schema">
  - **files**: `<path/glob>`, `<path/glob>`
  - **depends**: —
  - **satisfies**: R1
  - **acceptance**: <one-line check; e.g. "migration runs cleanly; users table exists">

- [ ] **T2** — <title>
  - **files**: `<path/glob>`
  - **depends**: T1
  - **satisfies**: R2
  - **acceptance**: <check>

...

- [ ] **Tn** — Tests
  - **files**: `tests/<feature>/*`
  - **depends**: <all implementation tasks>
  - **satisfies**: all
  - **acceptance**: tests pass
```

Tasks rules:

- Each task is **one vertical concern** (a single endpoint, a single module, a single migration). Not a full layer.
- `files` should be specific globs the task is allowed to write — `spec-run` uses these to infer file-overlap dependencies.
- `depends` is the **explicit** dependency list. File overlap is detected automatically by `spec-run`; you don't need to repeat it here.
- Tests come last and depend on the code they validate.
- Setup / infra / migration tasks come first.
- Aim for 5-15 tasks for a normal feature. Bigger than that → split into multiple specs.

### 6. Land on the task list

After writing the three files, show the user:

- Path to the new spec folder
- A 1-line summary of each task
- The next-step commands:
  - `/spec-analyze <slug>` — surface ambiguities and contradictions in requirements
  - `/spec-run <slug>` — execute tasks in parallel waves
  - `/to-issues specs/<slug>/tasks.md` — publish tasks to GitHub issues instead

Do NOT start executing the tasks. The user explicitly chose quick plan, not auto-execute.

## Regeneration rules

When the user asks for a change after generation:

- **Change to a task** → regenerate `tasks.md` only.
- **Change to design / architecture** → regenerate `design.md` and `tasks.md`.
- **Change to scope or a requirement** → regenerate all three.

Preserve stable IDs (R1, T1, ...) for anything that survives. Bump IDs forward for new items; never reuse a removed ID.

## What this skill does NOT do

- Does not implement tasks. That's `/spec-run`.
- Does not run requirements analysis. That's `/spec-analyze`.
- Does not publish to GitHub. That's `/to-issues`.
- Does not interview deeply. That's `/grill-with-docs`.
