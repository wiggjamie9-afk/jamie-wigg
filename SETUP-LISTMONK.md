# Listmonk — Setup & Reference

## Overview

**Listmonk** is a high-performance, **self-hosted newsletter and mailing-list
manager** with a modern dashboard (open-source alternative to Mailchimp /
Sendinblue). Single Go binary + Postgres; handles subscribers, lists,
segmentation, templates, campaigns, and analytics. AGPL-3.0.
`github.com/knadh/listmonk`.

> ### How this fits the RHYTHMIX repo
> **Closes the loop on the lead-magnet strategy already in the repo.** The Viral
> Hook Generator (`tools/hook-generator/`) is explicitly built to **collect email
> subscribers** ("turns visitors into subscribers — that list is the real asset").
> Listmonk is the self-hosted place that list lives and gets emailed — point the
> tool's opt-in form at a Listmonk subscription endpoint and you own the whole
> funnel (no Mailchimp fees, no third-party data). Marketing infra, not a pipeline
> tool. **Docker service → documented here, not in the Mac installer.**

## Install (self-hosted, Docker)

```bash
# minimal (check the repo for the current compose + first-run admin setup)
# app + postgres via the official docker-compose:
curl -LO https://github.com/knadh/listmonk/raw/master/docker-compose.yml
docker compose up -d
# then open http://localhost:9000 and complete the admin setup
```

For a real deployment, put it behind a reverse proxy with TLS and configure an
SMTP relay (or one of the self-hosted mail servers) as the sending backend.

## Notes

- Needs **Docker Desktop** on a Mac and a **Postgres** DB (the compose brings one).
  Treat it as infra (à la `infra/penpot/`).
- **Wiring to the Hook Generator:** Listmonk exposes a public subscription form +
  API; swap the tool's placeholder opt-in for a POST to your Listmonk list.
- Alternatives from the self-hosted list: **Keila** (AGPL, simpler newsletter
  tool), **Mautic** (GPL, full marketing automation — heavier).
- Source of truth: `github.com/knadh/listmonk` + `listmonk.app`. License: AGPL-3.0.
