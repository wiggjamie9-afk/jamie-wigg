# Apprise — Setup & Reference

## Overview

**Apprise** sends a notification to **almost every popular service from one API** —
Telegram, Discord, Slack, Email, SMS, ntfy, Gotify, Amazon SNS, Pushover, and
~100 others — using a simple URL per destination. MIT. Ships as a **Python
library**, a **CLI**, and a Docker API server. `github.com/caronc/apprise`.

> ### How this fits the RHYTHMIX repo
> **Directly serves a recurring need here.** Across the toolbox there's a repeated
> "notify me when X finishes" thread — render done, deploy approved, a new Mac
> download bundle ready (the SimpleX/Hermes/Zenii-scheduler idea). Apprise is the
> single dependency that fans one message to whatever channel(s) you use, so a
> HyperFrames render script or a CI step can end with one line instead of
> per-service integrations. Being a **pip library**, it drops straight into the
> pipeline next to MoviePy.

## Install

```bash
pip install apprise            # library + CLI
```

CLI:

```bash
apprise -b "Render finished ✅" \
  "tgram://<bot_token>/<chat_id>" \
  "discord://<webhook_id>/<webhook_token>"
```

Python:

```python
import apprise
ap = apprise.Apprise()
ap.add("tgram://<bot_token>/<chat_id>")
ap.notify(title="RHYTHMIX", body="teaser-coming-soon.mp4 rendered")
```

Optional **API server** (queue notifications over HTTP, keep config server-side):
run the `caronc/apprise` Docker image — see the repo for the compose.

## Notes

- On this repo's Mac, `mac-downloads/Install-Downloads.command` installs the
  library with `pip install --user apprise` (light). The Docker API server is
  optional and not auto-run.
- Alternatives in the same slot (from the self-hosted list): **ntfy**
  (HTTP-push + phone app), **Gotify** (self-hosted push server), **Novu**
  (developer notification infra). Apprise can *target* ntfy/Gotify, so it usually
  sits in front of them.
- Source of truth: `github.com/caronc/apprise`. License: MIT.
