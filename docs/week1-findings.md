# Week-1 Findings — Studio Health Check (T1.5) + License (T1.6)

*Real results from running the toolchain, not assumptions. Surveyed on the
`claude/ecc-harness-overview` branch.*

---

## Summary

| Check | Result | Note |
|---|---|---|
| `pnpm install` | ✅ (after build-script approval) | Sandbox needed `dangerouslyAllowAllBuilds`; not a code issue |
| `pnpm test` | ✅ **60/60 pass** (5 files) | Includes good security tests (token never leaks into events) |
| `pnpm lint` | ⚠️ blocked | `next lint` hits an **interactive ESLint-setup prompt** — no ESLint config exists yet |
| `pnpm build` | ✅ **green (FIXED)** | Was red on `openai` import; decoupled per option A1 — see Finding A |

**Headline:** the core app logic is healthy and well-tested, and **Studio now
builds and static-exports cleanly** (`studio/out/`) after the LLM-router
decouple. Typecheck clean, 60/60 tests green, all routes prerendered. Lint
(Finding B) remains a minor CI nicety; the deploy-blocking issue is resolved.

---

## Finding A — Build failure: server LLM router bundled into the client (RESOLVED ✅)

**Resolution (option A1 — decouple).** Added a dependency-free, browser-first
`studio/lib/llm-router.ts` that talks to any OpenAI-compatible endpoint over
`fetch`, resolves config lazily at call time (explicit arg → `configureLLM()` →
`localStorage` → `process.env` only under Node), and never reads secrets at
import or bundles the `openai` SDK. Repointed `studio/lib/llm-studio.ts` to it
and exported the missing `StudioLLMResponse` type; excluded `*.example.tsx` from
the build. Result: typecheck clean, 60/60 tests green, static export succeeds.
Original analysis preserved below for context.

---


**Chain:**
```
studio/components/video-exporter/video-exporter.tsx
  → studio/lib/llm-studio.ts
    → import { … } from "../../lib/llm-router"      ← reaches OUTSIDE the Studio app
       (repo-root lib/llm-router.ts)
        → import { OpenAI } from "openai"            ← not a Studio dependency
```

`lib/llm-router.ts` is a **Node/server-oriented** module: it imports the `openai`
SDK and reads `process.env.ANTHROPIC_API_KEY` / `FREELLM_*`. The Studio app is a
**static export with no server and a BYO-token model** — so pulling this chain
into the client bundle is wrong on two counts:

1. **Build breaks** — `openai` isn't installed in `studio/`.
2. **Architecture/security smell** — a module that expects server-side env-var
   secrets is being bundled into a shipped client. Even if it built, it shouldn't
   ship as-is.

**Why I did not auto-fix it:** the cheap "make it green" move (add `openai` to
`studio/package.json`) would bundle a server LLM router with secret-env
expectations into the static client — papering over the smell. The correct fix is
a **design call on the flagship**: decouple Studio from the repo-root router.

**Options (pick one):**
- **(A1) Decouple — recommended.** Give Studio its own thin, client-safe LLM
  module that talks to the user's own keys/proxy (consistent with BYO-token).
  Drop the `../../lib/llm-router` import. No server secrets in the bundle.
- **(A2) Make the import server-only.** If this code path is only meant for a
  build-time/Node context, move it behind a server boundary so it never enters
  the client bundle. (Static export has no server runtime, so this likely means
  removing it from the client path entirely.)
- **(A3) Quick-and-dirty.** Add `openai` as a dep to unblock the build. **Not
  recommended** — ships the smell; revisit immediately.

→ **This is the one place I need your steer before touching flagship code.**

## Finding B — No ESLint config (quick)
`pnpm lint` runs `next lint && tsc --noEmit`; `next lint` stops at an interactive
"configure ESLint" prompt because there's no ESLint config. `tsc --noEmit` likely
passes (TS is otherwise healthy). → **Fix:** add a committed Next.js ESLint config
(`Strict`) or split the script so `tsc --noEmit` can run in CI unattended. Low risk.

## Finding C — License preview-CORS origin mismatch (see studio-license-flow.md §Gap 1)
Worker allows `*.studio.rhythmixapp-pages.dev`; CLAUDE.md documents previews at
`<branch>.starlightmix-studio.pages.dev`. Reconcile or preview licensing breaks.

## Finding D — Price is $149 (not a bug, a correction)
The license Worker hard-codes the **$149 lifetime** anchor. Treat that as source
of truth; the business guide's pricing line means "validate $149," not "pick a
new number."

---

## What's green and ready
- **Test suite (60 tests)** — solid, including token-leak guards. Good safety net
  for any fix to Finding A.
- **License Worker** — correct and private; needs config + one test purchase, not
  code (see `studio-license-flow.md`).

## Recommended order
1. **Decide Finding A** (you) → I implement, re-run tests (the 60-test net catches regressions) → build green.
2. I fix Findings B + C (low risk, Agent-owned) in the same pass.
3. Then the license `You`-gates (Gumroad product, secret, KV, deploy, test purchase).
```
