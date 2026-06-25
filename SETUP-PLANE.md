# Plane Setup Guide

## Overview

**Plane** is an open-source project & issue tracking tool (work items, cycles, modules, views,
pages, analytics). Built with **React Router + Django + Node.js**.

**Why it's here:** a candidate self-hosted PM tool for tracking RHYTHMIX work — an alternative
(or complement) to the GitHub Issues workflow this repo already uses (`docs/agents/issue-tracker.md`).

> ⚠️ Plane is a **multi-service server stack** (web + API + Postgres + Redis, via Docker or
> Kubernetes). It needs a **persistent host** — it cannot run in this repo's ephemeral cloud
> sandbox. This doc preserves the setup; deploy it on a VPS (like the `infra/wiki/` Wiki.js stack).

## Getting started — pick a setup

- **Plane Cloud** — free hosted account at [plane.so](https://plane.so). Fastest path, no infra.
- **Self-host** — full control over data and infrastructure.

| Method | Docs |
|---|---|
| Docker | https://developers.plane.so/self-hosting/methods/docker-compose |
| Kubernetes | https://developers.plane.so/self-hosting/methods/kubernetes |

Instance admins configure instance settings via **God mode**.

## Self-host (Docker, typical flow)

```bash
# On a host with Docker + Docker Compose installed:
curl -fsSL https://raw.githubusercontent.com/makeplane/plane/master/setup.sh | sh
# then follow the prompts; bring the stack up with the generated compose file.
```

See the official Docker guide (link above) for the authoritative, version-pinned steps,
env configuration, and upgrade path. Mirror it next to `infra/wiki/` if you self-host here —
Caddy in `infra/Caddyfile` can terminate TLS for it just like Wiki.js.

## Features (summary)

- **Work Items** — rich-text tasks with file uploads, sub-properties, related-issue references.
- **Cycles** — time-boxed sprints with burn-down charts.
- **Modules** — break large projects into manageable units.
- **Views** — saved/shared filters of relevant issues.
- **Pages** — rich-text notes with AI assist; convert notes → action items.
- **Analytics** — real-time insight across Plane data.

## Community & security

- Docs: product + developer documentation at developers.plane.so.
- Community: GitHub Discussions + the Plane forum.
- Security: email `security@plane.so` — do **not** open public issues for vulnerabilities.

## Where it fits in this repo

If adopted, Plane would sit alongside (or replace) GitHub Issues for campaign/feature tracking.
Before migrating, weigh it against the existing `/spec-quick` → `/spec-run` spec flow and the
GitHub-Issues agent procedures in `docs/agents/` — those are already wired into this repo's skills.
