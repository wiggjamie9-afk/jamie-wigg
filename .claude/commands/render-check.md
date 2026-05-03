---
description: Validate the Remotion project is render-ready (lint + build, no mp4 produced)
argument-hint: (no args)
---

Delegate to the `render-validator` subagent. Goal: prove the project will render cleanly without spending the time/disk to produce an actual mp4.

First, ensure the render runtime is set up: if `/tmp/.remotion-chrome-path` doesn't exist, run `bash .claude/scripts/render-setup.sh` once.

Then use the Task tool with `subagent_type: "render-validator"` and a prompt like:

> Validate the `video/` Remotion subproject. Run `cd video && npm run lint`, then `cd video && npx remotion compositions --browser-executable="$(cat /tmp/.remotion-chrome-path)"`. Confirm `Root.tsx` and `Composition.tsx` are structurally sound and the composition tree compiles. Report a one-line verdict (READY / LINT_FAIL / COMPILE_FAIL / STRUCTURAL_ISSUE) plus details on any failure.

Relay the verdict and any failures to me. Do NOT actually run `npx remotion render` — I'll decide when to render.
