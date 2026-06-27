---
name: insomnia
description: Insomnia — open-source cross-platform API client (REST, GraphQL, WebSockets, SSE, gRPC) plus the Inso CLI for linting/testing API specs in CI. Use when designing/debugging/testing the Studio API workers (license, replicate-proxy, avatar-proxy) or any OpenAPI spec, or when you want CI lint/test of API collections. NOTE: the desktop app is a GUI (Mac/Win/Linux) and can't run in this headless sandbox; the Inso CLI is the part usable from a repo/CI.
---

# Insomnia (API client) + Inso CLI

Insomnia is an Apache-2.0 desktop API client for REST, GraphQL, WebSockets, SSE, gRPC and any
HTTP protocol: debug, design (native OpenAPI editor + visual preview), test (test suites +
collection runner), and mock APIs. `inso` is its companion CLI for CI.

- Site/download: https://insomnia.rest · Docs: https://docs.insomnia.rest

## What's usable where

| Piece | Where | In this repo? |
|---|---|---|
| Desktop app (GUI) | Mac / Windows / Linux | ❌ headless sandbox can't run it — install on your own machine |
| **Inso CLI** (`insomnia-inso`) | terminal / CI | ✅ this is the relevant part — lint & test API specs/collections |

## Storage options (pick per project)

- **Local Vault** — 100% local, nothing in the cloud (use for sensitive specs).
- **Git Sync** — store collections/specs in any Git repo, no cloud (premium).
- **Cloud Sync** — cloud collaboration, optional E2EE.
- **Private Environments** — env config always local, never cloud, regardless of the above.
- Scratch Pad works with **no account**; most features need a free account.

## Inso CLI — CI linting/testing

```bash
npm i -g insomnia-inso          # or npx insomnia-inso
inso lint spec <identifier|file>      # lint an OpenAPI spec
inso run test  <collection>           # run a test suite
inso export spec <identifier>         # export the OpenAPI spec
```

Point it at a `.insomnia` export or a spec file. Typical CI gate: `inso lint spec ./openapi.yaml`.

## How this fits RHYTHMIX

Good fit for the **Studio API workers** — `studio/workers/{license,replicate-proxy,avatar-proxy}/`
each expose HTTP endpoints worth a collection + test suite, and the `specs/` folders could carry
OpenAPI specs that `inso lint` gates in CI (alongside `studio-deploy.yml`).

To actually wire this in (not done automatically — it adds a toolchain dep):
1. Author an OpenAPI spec for a worker (e.g. the license endpoint at `license.studio.starlightmix.com/api/license`).
2. Add `inso lint spec` (and optionally `inso run test`) as a CI step.
3. Store the collection via **Local Vault** or **Git Sync** to keep API data out of the cloud.

Ask if you want me to scaffold an OpenAPI spec + Inso CI step for a specific worker.
