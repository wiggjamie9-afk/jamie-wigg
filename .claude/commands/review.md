---
description: Spawn the code-reviewer subagent on the current diff
allowed-tools: Agent
argument-hint: "[optional focus area]"
---

Delegate review of the current working tree to the `code-reviewer` subagent.

If `$ARGUMENTS` is non-empty, pass it as the focus area; otherwise review the full diff.

Return the subagent's punch list verbatim.
