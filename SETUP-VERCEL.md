# Vercel CLI — Setup & Reference

## Overview

**Vercel CLI** (`vercel` / `vc`) deploys and manages projects on Vercel from the
terminal — `vercel deploy`, `vercel dev` (local emulation of the platform),
`vercel env`, `vercel pull`, etc. Apache-2.0.

> ### How this fits the RHYTHMIX repo
> **Tangential.** This repo deploys via **GitHub Pages** (`rhythmixapp.com.au`,
> `deploy-pages.yml`) and **Cloudflare Pages** (`studio/`, `studio-deploy.yml`) —
> not Vercel. Keep this as a reference for one-off / experimental deploys
> (e.g. previewing a `sites/<slug>/` build or an `apps/` prototype on a Vercel
> URL) without changing the repo's production pipelines. If you ever do adopt it
> for a sub-project, add a `vercel.json` in *that* folder only — don't point it at
> the repo root.

## Install

Standard npm install (unchanged, Node.js-based CLI):

```bash
npm i -g vercel
```

### Native CLI binaries (opt-in)

Native binaries are distributed **separately** and don't affect the `vercel` npm
package. To replace the global `vercel` / `vc` bin links with the native build:

```bash
npm i -g @vercel/vc-native --force          # --force lets npm replace existing vercel/vc links
```

Platform-specific package when you need a specific binary directly:

```bash
npm i -g @vercel/vc-native-darwin-x64 --force   # macOS Intel; pick the package matching your arch
```

Users who don't install `@vercel/vc-native` keep using the regular Node.js CLI
from `npm i -g vercel`.

## Usage

```bash
vercel              # deploy the current directory (interactive first-run links a project)
vercel dev          # run the project locally with platform emulation
vercel deploy --cwd=/path/to/project   # deploy a specific project
vercel --prod       # promote a deployment to production
vercel env pull      # pull project env vars into .env.local
```

Full usage: <https://vercel.com/docs>.

## Contributing to the Vercel CLI itself (reference)

The upstream repo is a **pnpm monorepo** (multiple npm packages). Only relevant
if you're hacking on the CLI, not for using it:

```bash
git clone https://github.com/vercel/vercel
cd vercel
corepack enable
pnpm install && pnpm build && pnpm lint && pnpm test-unit
cd ./packages/cli && pnpm vercel <cli-commands...>   # run local changes
```

- **Use `pnpm`, not `npm`**, for dependency management in that repo.
- Integration tests deploy to a real Vercel account (`VERCEL_TOKEN` +
  `VERCEL_TEAM_ID`) — running the full suite locally isn't recommended; isolate a
  single fixture test instead.
- Some Builders use `@vercel/nft` for tree-shaking; debug missing files with a
  small `nodeFileTrace([...])` script.
- Discuss changes via Vercel Community before opening a PR; follow the Code of
  Conduct. License: Apache-2.0.

## Notes

- Source of truth is the upstream docs (<https://vercel.com/docs>) and repo
  (<https://github.com/vercel/vercel>); this is a minimal install/usage snapshot.
- This repo's Mac installer (`mac-downloads/Install-Downloads.command`) installs the standard
  npm CLI (`npm i -g vercel`); the native binary is left opt-in.
