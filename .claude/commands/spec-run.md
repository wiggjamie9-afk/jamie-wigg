---
description: Execute a spec's tasks.md in parallel waves. Builds a dependency graph, runs independent tasks concurrently as isolated Agent calls.
argument-hint: <spec-slug>
---

Invoke the `spec-run` skill to execute the tasks for spec:

> $ARGUMENTS

The skill parses `specs/$ARGUMENTS/tasks.md`, builds a dependency graph from explicit `depends:` plus file-overlap, computes waves, and launches each wave as **parallel Agent calls in a single message**. Each task runs in its own isolated agent context.

Critical: when running a wave, issue ALL the `Agent` tool calls for that wave in **one message**, not sequentially. The whole point of this skill is concurrency.

After all waves complete:
- Update `tasks.md` (`[ ]` → `[x]` for successes)
- Show a summary of successes / failures / skipped tasks
- Ask the user whether to run the project's lint / typecheck / test command before declaring done
- Do not auto-commit
