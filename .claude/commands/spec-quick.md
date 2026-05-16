---
description: Fast-track spec generation. Scans workspace, asks 2-4 clarifying questions, then produces requirements.md, design.md, tasks.md in one pass.
argument-hint: <feature description>
---

Invoke the `spec-quick` skill to fast-track spec generation for the following feature:

> $ARGUMENTS

The skill scans the workspace, asks a small number of targeted clarifying questions (scope, ambiguity, implementation forks, direction), and then generates `specs/<slug>/requirements.md`, `design.md`, and `tasks.md` in one pass.

After the spec lands, suggest the next-step commands:
- `/spec-analyze <slug>` — surface ambiguities, contradictions, and gaps
- `/spec-run <slug>` — execute tasks in parallel waves
- `/to-issues specs/<slug>/tasks.md` — publish tasks as GitHub issues instead

Do not start executing tasks. The user explicitly chose the planning step.
