# ClawFleet — Setup & Reference

## Overview

**ClawFleet** deploys and manages a **fleet of isolated OpenClaw instances on a
single machine, from a browser dashboard**. It's a Go CLI (cobra) that
orchestrates Docker containers and ships an embedded Web Dashboard (REST +
WebSocket). Open-source on GitHub (`github.com/clawfleet/ClawFleet`).

It's layered:
- **ClawSandbox** (infrastructure) — Docker orchestration, instance state
  persistence, port allocation, container networking, image + snapshot
  management.
- **ClawFleet** (product) — REST API, real-time dashboard, CLI, asset management
  (models / channels / characters), skill management, i18n. Depends on
  ClawSandbox, never the reverse.

Each "claw" instance is a Docker container running an **XFCE4 desktop + TigerVNC +
noVNC** (browser access on port `690N`) plus the **OpenClaw Gateway** (port
`1878N`). Instance data persists at `~/.clawfleet/data/<name>/openclaw/` →
`/home/node/.openclaw` in the container.

> ### How this fits the RHYTHMIX repo
> **Reference only — a separate product, not part of this repo.** It's adjacent
> to the OpenClaw work already noted in this repo's `CLAUDE.md` (the "OpenClaw CLI
> skills" queue installed via `scripts/openclaw-install.sh` / ClawHub). Where this
> repo *uses* individual OpenClaw skills, ClawFleet is a way to **run whole
> OpenClaw instances** (desktop + gateway, in Docker) and manage several at once
> from a dashboard — e.g. standing up a bot that watches a channel and posts
> RHYTHMIX updates. It's a heavier, Docker-based, self-hostable app; tangential to
> the HyperFrames video pipeline. It **is** wired into the Mac installer as a
> heavy/optional step (clones + `make build`; needs Docker + Go, and the first
> `dashboard` pulls a ~1.4 GB image) — skip it with `SKIP_HEAVY=1`.

## Install (from the project)

> The exact one-line installer / GHCR image tags live in the ClawFleet repo's
> README + wiki — treat those as the source of truth. This doc is a reference
> snapshot based on the project's own guidance.

Two supported paths (per the project's principles):

1. **Pull the pre-built image (recommended)** — the `install.sh` / "Pull" flow
   always delivers the **pinned, tested OpenClaw version** (a GHCR image built for
   exactly that version, never `@latest`).
2. **Build from source** (advanced / opt into a different OpenClaw version at your
   own risk):

   ```bash
   go mod tidy
   make build                 # → bin/clawfleet
   ./bin/clawfleet build      # build the Docker image from the embedded Dockerfile
   ./bin/clawfleet dashboard  # open the Web Dashboard
   ```

Prereqs: **Go** (to build the CLI) and **Docker** (to run instances). First image
build is ~1.4 GB and takes several minutes.

## Core CLI commands

```
clawfleet build        # build the container image (embedded Dockerfile)
clawfleet create       # create a new claw instance
clawfleet list         # list instances
clawfleet start|stop|restart|destroy <name>
clawfleet desktop <name>   # open the instance's browser desktop (noVNC)
clawfleet logs <name>
clawfleet dashboard    # start the Web Dashboard
clawfleet config       # config file (~/.clawfleet/config.yaml)
clawfleet version
```

State lives in `~/.clawfleet/state.json`; config in `~/.clawfleet/config.yaml`.

## OpenClaw integration (how it drives instances)

- **Character** — renders fields into `SOUL.md` at `~/.openclaw/SOUL.md`; the
  Gateway hot-reloads on change (no restart). Written via `docker exec`.
- **Skills** — bundled skills ship with OpenClaw; community skills install via
  ClawHub (`npx clawhub … install <slug>`) into `~/.openclaw/skills/`. ClawHub is
  rate-limited (~20 req/min).
- **Providers** (LLM): Anthropic, OpenAI, Google, DeepSeek — **models are shared**
  (multiple instances can use one model config).
- **Channels** (messaging): Telegram, Discord, Slack, Lark — **channels are
  exclusive** (one instance each); **validation ("Test") is required** before
  save; **Lark** uses App ID + App Secret (not a single token).

## Version-pinning model (the point of the product)

ClawFleet shields users from OpenClaw's rapid release cadence: every ClawFleet
release pins a specific, end-to-end-tested `RecommendedOpenClawVersion`
(`internal/version/version.go`), and CI builds the GHCR image with exactly that
version as the `OPENCLAW_VERSION` build-arg. The "Build" flow lets advanced users
opt into a different version at their own risk; "Pull" / `install.sh` always
deliver the pinned one.

## Notes

- **Docs:** the project's primary hub is its wiki
  (`github.com/clawfleet/ClawFleet/wiki`) — Getting-Started, Dashboard-Guide,
  CLI-Reference, FAQ, per-provider and per-channel pages. Use those for exact,
  current commands.
- On this repo's Mac, `mac-downloads/Install-Downloads.command` installs ClawFleet
  as a heavy/optional step: it installs Go (via Homebrew if needed), clones
  `github.com/clawfleet/ClawFleet` to `~/clawfleet`, and runs `go mod tidy && make
  build` to produce `~/clawfleet/bin/clawfleet`. Start it with `cd ~/clawfleet &&
  ./bin/clawfleet dashboard` (that first run pulls the pinned OpenClaw image). The
  step needs Docker running and is skipped by `SKIP_HEAVY=1`.
- **Install-method caveat:** the installer builds the CLI from source (the flow
  documented in the project's own guidance). The project also offers an
  `install.sh` / "Pull" flow that ships the pre-built, pinned GHCR image — check
  the ClawFleet repo README for that exact command; it isn't hardcoded here
  because the URL/tag wasn't in the source paste.
