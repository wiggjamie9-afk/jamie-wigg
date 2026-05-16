---
name: spec-run
description: Parallel task execution for a spec. Parses tasks.md, builds a dependency graph from explicit `depends:` plus file-overlap, then runs each wave as concurrent Agent calls. Use when the user wants to implement a spec quickly. Triggered by /spec-run.
---

# Spec Run

Execute a spec's tasks in parallel waves. Each task runs in its own isolated agent context. Tasks that touch the same files are never parallelized. A failure in one task does not block independent tasks in the same wave.

## When to use

User says:
- "/spec-run <feature>", "run the spec", "implement the tasks"
- "execute specs/<slug>"
- "build it"

after a `specs/<slug>/` exists.

For single-task work or anything without a tasks.md, just do it directly — don't invoke this skill.

## Process

### 1. Locate the spec

From `$ARGUMENTS` or recent conversation, resolve the spec slug. Read:

- `specs/<slug>/tasks.md` (required)
- `specs/<slug>/requirements.md` (passed to every task agent as context)
- `specs/<slug>/design.md` (passed to every task agent as context)

If `tasks.md` doesn't exist, stop and tell the user to run `/spec-quick` first.

### 2. Parse the task list

Each task block:

```markdown
- [ ] **T<n>** — <title>
  - **files**: `<glob>`, `<glob>`
  - **depends**: T<a>, T<b>   (or — for none)
  - **satisfies**: R<x>, R<y>
  - **acceptance**: <one-line check>
```

Extract for each task: `id`, `title`, `files[]`, `depends[]`, `acceptance`, `done` (from `[ ]` vs `[x]`). Skip tasks already marked `[x]`.

### 3. Build the dependency graph

Edges come from two sources:

1. **Explicit**: every `T_a` in a task's `depends` list.
2. **Implicit (file overlap)**: for every pair of tasks (T_a, T_b) where T_a precedes T_b in the file AND any glob in T_a.files intersects any glob in T_b.files, add an edge T_a → T_b.

   Intersection check: expand each glob, lowercase, intersect the sets. If either side uses `*`, treat the wildcard as covering the same directory — `src/api/*.ts` and `src/api/users.ts` overlap.

If the graph has a cycle, stop and tell the user which tasks form the cycle. Do not attempt to break it.

### 4. Compute waves

Topological levels:

- **Wave 0**: tasks with no incoming edges.
- **Wave k**: tasks whose dependencies are all in waves 0..k-1.

Tasks within a wave are independent and run concurrently.

### 5. Show the plan, ask to proceed

Print:

```
Spec: <slug>
<N> tasks remaining, organized into <W> waves:

Wave 0 (parallel): T1 Setup DB · T2 Init config
Wave 1 (parallel): T3 API routes · T4 Auth · T5 Validation
Wave 2 (parallel): T6 Error handling · T7 Middleware
Wave 3:            T8 Integration tests

Proceed?
```

Ask the user to confirm before launching. For specs of 3 tasks or fewer, you can skip confirmation.

### 6. Execute one wave at a time

For each wave:

1. **Launch every task in the wave as a parallel `Agent` call.** Issue all the `Agent` tool calls in a **single message** — that's how Claude Code runs them concurrently. Do not loop sequentially. Do not use `run_in_background` unless the user asks — foreground parallel is the right default; you need the results before launching the next wave.

2. For each task agent, the prompt template is:

   ```
   You are implementing one task from a parallel spec run. You will not see the other tasks.

   Spec: <slug>
   Task: T<n> — <title>
   Files you may write: <globs>
   Acceptance: <criterion>
   Satisfies requirements: <ids>

   Read these for context (do not modify):
   - specs/<slug>/requirements.md
   - specs/<slug>/design.md

   Project conventions:
   - CLAUDE.md
   - CONTEXT.md (domain language)

   Do the work. Stay within the allowed file globs. Stop when acceptance is met.
   Report under 200 words: what you did, any unexpected discoveries.
   ```

   Use `subagent_type: general-purpose` for code work, or pick a specialised agent when one obviously fits (e.g. `test-writer` for test tasks).

   Pass `isolation: "worktree"` ONLY if (a) the user opted in to worktree isolation OR (b) two tasks in the same wave share a parent directory and you're worried about transient state. Otherwise the default (shared working tree, but isolated agent context) is fine.

3. **Wait for the wave to finish.** Collect each task's report.

4. **Update `tasks.md`** — flip `[ ]` to `[x]` for each task whose agent reported success. For failures, leave unchecked and append a `> failed: <one-line reason>` line under that task.

5. **Decide whether to continue.**
   - If every task in the wave succeeded → launch the next wave.
   - If any task failed → drop the failed tasks and everything transitively depending on them from the remaining waves. Continue with whatever's still runnable. Tell the user which tasks were skipped and why.
   - If the failure was in setup / infra (Wave 0 typically) and most things depended on it → stop and ask the user.

### 7. Final report

Once no more waves can run:

- `[x]` count vs total
- List of failed tasks with their reasons
- Suggested next step: re-run failed tasks individually, or fix and re-invoke `/spec-run`

## Hard rules

- **Never launch waves sequentially when they could be parallel.** The whole point of this skill is to issue parallel Agent calls in one message. If you find yourself making one Agent call, waiting, then making another, you're using the skill wrong.
- **Never run two tasks in parallel that share a file.** The file-overlap check is what prevents merge conflicts inside a single working tree.
- **Never bypass the dependency graph.** If T3 depends on T1 and T1 failed, T3 does not run.
- **Never assume an agent did its work correctly because it said so.** When all waves finish, ask the user whether to run the project's test / lint / typecheck command before declaring the spec done. Don't auto-commit.

## What this skill does NOT do

- Does not generate the spec. That's `/spec-quick`.
- Does not commit. The user reviews the diff and commits explicitly.
- Does not push or open PRs.
