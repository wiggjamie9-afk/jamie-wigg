---
description: Validate the Remotion project is render-ready (lint + build, no mp4 produced)
argument-hint: (no args)
---

Delegate to the `render-validator` subagent. Goal: prove the project will render cleanly without spending the time/disk to produce an actual mp4.

Use the Task tool with `subagent_type: "render-validator"` and a prompt like:

> Validate the `video/` Remotion subproject. Run `cd video && npm run lint`, then `cd video && npm run build`. Confirm `Root.tsx` and `Composition.tsx` are structurally sound. Report a one-line verdict (READY / LINT_FAIL / BUILD_FAIL / STRUCTURAL_ISSUE) plus details on any failure.

Relay the verdict and any failures to me. Do NOT actually run `npx remotion render` — I'll decide when to render.
