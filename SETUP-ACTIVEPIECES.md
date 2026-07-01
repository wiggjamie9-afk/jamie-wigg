# Activepieces — Setup & Reference

## Overview

**Activepieces** is a **no-code business-automation** platform — a self-hostable
Zapier / Tray alternative. You build flows ("send a Slack message for each new
Trello card") from triggers + pieces (connectors), visually. MIT-licensed,
distributed as Docker. `github.com/activepieces/activepieces`.

> ### How this fits the RHYTHMIX repo
> **An alternative to the n8n automation this repo already uses.** The repo drives
> content workflows through n8n (`automation/veo3-faceless-content-system/`,
> `automation/kling-social-pipeline/`, the `/n8n-workflow-generator` skill).
> Activepieces is the **MIT, no-code** option in the same slot — lighter to stand
> up, friendlier UI. Not a replacement for the existing n8n work; a parallel tool
> if you want a second automation surface. **Server app → documented here, not in
> the Mac installer.**

## Install (self-hosted, Docker)

```bash
# quickest single-container start (check the repo for the current compose + env)
docker run -d -p 8080:80 --name activepieces \
  -e AP_FRONTEND_URL="http://localhost:8080" \
  activepieces/activepieces:latest
# then open http://localhost:8080
```

For anything beyond a trial, use the project's **docker-compose** (Postgres +
Redis + the app) from the repo — it documents the required `AP_*` env vars
(encryption key, JWT secret, DB/Redis URLs).

## Alternatives in the same slot (from the self-hosted list)

If Activepieces isn't the right fit, these cover adjacent needs:

| Tool | License | Niche |
|---|---|---|
| **Kestra** | Apache-2.0 | Event-driven, code-first workflows / data pipelines (ETL/ELT) |
| **Huginn** | MIT | Agents that monitor sources and act on your behalf |
| **StackStorm** | Apache-2.0 | "IFTTT for Ops" — event-driven auto-remediation, 6000+ actions, ChatOps |
| **Automatisch** | AGPL-3.0 | Closest Zapier clone (AGPL, so note the license) |
| **changedetection.io** | Apache-2.0 | Watch web pages for changes → trigger notifications |
| **Healthchecks** | BSD-3-Clause | Cron/dead-man's-switch pings + late-run alerts (good for render/deploy monitoring) |

## Notes

- Needs **Docker Desktop** on a Mac. It's a persistent service (DB + queue), so
  treat it like infra (à la `infra/penpot/`), not a throwaway CLI.
- Source of truth: `github.com/activepieces/activepieces` + `activepieces.com`.
  License: MIT.
