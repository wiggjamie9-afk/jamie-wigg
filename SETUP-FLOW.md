# Flow — Setup & Reference

## Overview

**Flow** is a developer-workflow CLI (command **`f`**, also `flow` / `lin`) by
nikiv.dev — a single tool that wraps the common local dev loop (workspace/toolchain
setup, test, deploy, task listing) and is meant to be used together with AI.
Site: `myflow.sh`; repo: `github.com/nikivdev/flow`.

> ### How this fits the RHYTHMIX repo
> **Tangential — a general dev-workflow CLI, not a pipeline tool.** It's a
> personal/utility command runner (`f setup` / `f test` / `f deploy` / `f tasks
> list`); nothing in the RHYTHMIX video pipeline or the marketing site depends on
> it. Kept as a reference + optional install alongside the other CLIs in the Mac
> bundle. The paste is light on a precise feature description — run `f --help` and
> read the repo's `docs/` for the real command surface.

## Install

```bash
curl -fsSL https://myflow.sh/install.sh | sh     # installs to ~/.flow/bin/f
~/.flow/bin/f --version
~/.flow/bin/f doctor                             # environment check
```

If `f` isn't found by name right away, open a new shell (`exec zsh -l` on zsh).

- The installer **verifies SHA-256 checksums** when a release ships
  `checksums.txt`; legacy releases without it warn and continue. Bypass with
  `FLOW_INSTALL_INSECURE=1` (not recommended).
- Platforms: macOS (arm64, x86_64), Linux glibc (arm64, x86_64).

## Upgrade

```bash
f upgrade            # latest stable
f upgrade --canary   # latest canary
f upgrade --stable   # back to stable
```

Forks/private repos: set `FLOW_UPGRADE_REPO=owner/repo` and a
`FLOW_GITHUB_TOKEN` (or `GITHUB_TOKEN`/`GH_TOKEN`) to avoid API rate limits.
`FLOW_UPGRADE_INSECURE=1` forces past checksum verification on very old tags (not
recommended).

## Build from source

```bash
git clone https://github.com/nikivdev/flow.git && cd flow
./scripts/vendor/vendor-repo.sh hydrate          # materializes lib/vendor/* from the pinned vendor.lock.toml
FLOW_PROFILE=release ./scripts/deploy.sh          # optimized build → installs f/flow/lin into ~/bin
~/bin/f --version
```

The pinned vendor snapshot lives at the public
`github.com/nikivdev/flow-vendor` (referenced by `vendor.lock.toml`); `hydrate`
reuses `.vendor/flow-vendor` if present, else clones the pinned commit.

## Everyday loop

```bash
f setup        # check workspace + toolchain
f test         # run the test suite
f deploy       # build + install the local CLI into your path
f tasks list   # inspect tasks
f --help       # full command surface
```

## Notes

- On this repo's Mac, `mac-downloads/Install-Downloads.command` runs the official
  `curl -fsSL https://myflow.sh/install.sh | sh` (skips if `f` or
  `~/.flow/bin/f` is already present). Open a new shell afterward if `f` isn't on
  PATH yet.
- Source of truth: `myflow.sh` + `github.com/nikivdev/flow`. This is a minimal
  install/reference snapshot.
