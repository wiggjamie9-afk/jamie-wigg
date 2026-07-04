# hAI.OpenHumanCoreLAN

🧠 **OpenHuman Core** als Docker-Stack in **Portainer**, lokal im **LAN** erreichbar,
mit **Docker-Healthcheck** und **Watchdog-Sidecar** für Statusüberwachung.

The full, formatted documentation lives in **[`index.html`](index.html)** (a
self-contained GitHub-Pages page with a Mermaid architecture diagram).

## Files

| File | Purpose |
|---|---|
| `docker-stack.yml` | Portainer stack: `openhuman-core` (:7788) + `openhuman-watchdog` sidecar, healthcheck, volume, bridge network |
| `.env.template` | Environment variable template — copy to `.env` |
| `example.env` | Same as the template, for quick start |
| `index.html` | Rendered documentation page (GitHub Pages) |
| `LICENSE` | MIT |

## Quick start

```bash
# 1. Generate a bearer token
openssl rand -hex 32

# 2. Copy env and set OPENHUMAN_CORE_TOKEN
cp .env.template .env && $EDITOR .env

# 3. In Portainer: Stacks → Add Stack → paste docker-stack.yml → set env → Deploy

# 4. Verify
curl http://<SERVER-IP>:7788/health
```

## Notes

- The `index.html` page loads Mermaid and shields.io badges from CDNs (fine for
  GitHub Pages / online viewing). For a fully offline copy, inline those assets.
- The stack pulls `ghcr.io/tinyhumansai/openhuman-core:latest` — verify the image
  name against the upstream project before deploying.

MIT License.
