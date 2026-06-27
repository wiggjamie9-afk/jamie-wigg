# Freebuff — Setup & Reference

## Overview

**Freebuff** is an AI coding agent that runs in your **terminal** — you describe
what you want and it edits your code. Zero-config; start in seconds. It's an
open-source CLI related to **Codebuff**. MIT licensed.

> ### How this fits the RHYTHMIX repo
> Tangential but it belongs to a family this repo already documents: terminal AI
> agents — `SETUP-HERMES.md`, `SETUP-AGENT-TARS.md`, `SETUP-OPENMANUS.md`, plus
> the OpenClaw CLI skills. Freebuff is a **Claude-Code-style coding agent**, i.e.
> an *alternative* to the harness you're already using here, not a content/video
> tool. Useful if you want a lightweight, separate coding agent for a checkout on
> a machine where Claude Code isn't set up. It does **not** replace any of the
> RHYTHMIX pipeline skills.

## Install

```bash
npm install -g freebuff
```

## Usage

```bash
cd ~/my-project
freebuff
```

Run it from the root of the project you want it to work on.

## Project structure (upstream repo)

```
freebuff/
├── cli/    # CLI build & npm release files
└── web/    # Freebuff website
```

## Building from source

Requires [Bun](https://bun.sh). From the upstream repo root:

```bash
bun freebuff/cli/build.ts 1.0.0
```

(The trailing argument is the version to build.)

## Notes

- The upstream **repo-root README is the single source of truth** for what
  Freebuff does, how it works, the FAQ, and how it relates to Codebuff. The
  snippet this doc is based on is deliberately minimal — check that README before
  relying on specifics.
- As with any coding agent, review its diffs before committing, and don't point
  it at this repo's protected branches — keep work on the designated feature
  branch.

## License

MIT.
