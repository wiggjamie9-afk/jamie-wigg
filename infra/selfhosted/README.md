# RHYTHMIX self-hosted platform

A curated slice of [Awesome-Selfhosted](https://awesome-selfhosted.net/) as **one
deployable stack**: a [Caddy](https://caddyserver.com/) reverse proxy (automatic
HTTPS via Let's Encrypt) in front of 21 apps, with one shared Postgres for the
three apps that need a database. One `docker compose up -d` and you have a
personal cloud.

> **Why a curated set and not "all 1000+"?** The Awesome-Selfhosted list is a
> *catalogue*, not a stack. Most entries are alternatives to one another (a dozen
> RSS readers, a dozen pastebins), many conflict for the same ports, and several
> need their own VPS/domain. This stack picks one strong, popular, actively
> maintained option per category, wired together so they coexist. Adding or
> swapping apps is a few lines — see [Add more apps](#add-more-apps).

## What's included

| Category | App | URL (`<sub>.${DOMAIN}`) |
|---|---|---|
| Personal dashboard | [Homepage](https://gethomepage.dev/) | `home.` |
| Password manager | [Vaultwarden](https://github.com/dani-garcia/vaultwarden) | `vault.` |
| Notes | [Memos](https://www.usememos.com/) | `notes.` |
| Bookmarks | [Linkding](https://github.com/sissbruecker/linkding) | `links.` |
| Feed reader (RSS) | [Miniflux](https://miniflux.app/) · *Postgres* | `rss.` |
| Git forge | [Gitea](https://about.gitea.com/) · *Postgres* | `git.` |
| Media streaming | [Jellyfin](https://jellyfin.org/) | `media.` |
| Private metasearch | [SearXNG](https://docs.searxng.org/) | `search.` |
| PDF / document tools | [Stirling-PDF](https://www.stirlingpdf.com/) | `pdf.` |
| Uptime monitoring | [Uptime Kuma](https://github.com/louislam/uptime-kuma) | `status.` |
| URL shortener | [Chhoto URL](https://github.com/SinTan1729/chhoto-url) | `s.` |
| Pastebin | [PrivateBin](https://privatebin.info/) | `paste.` |
| Recipes | [Mealie](https://mealie.io/) | `recipes.` |
| Read-it-later | [Readeck](https://readeck.org/) | `read.` |
| AI chat | [Open WebUI](https://openwebui.com/) + [Ollama](https://ollama.com/) | `ai.` |
| File sync | [Syncthing](https://syncthing.net/) | `sync.` |
| Web file manager | [Filebrowser](https://filebrowser.org/) | `files.` |
| Developer tools | [IT-Tools](https://it-tools.tech/) | `tools.` |
| Container logs | [Dozzle](https://dozzle.dev/) | `logs.` |
| Automation | [n8n](https://n8n.io/) | `flows.` |
| Web analytics | [Umami](https://umami.is/) · *Postgres* | `analytics.` |

## What you need first

- **A VPS** with Docker + Docker Compose. For the full stack (incl. Jellyfin
  transcoding and a local Ollama model) aim for **≥4 GB RAM and ~40 GB disk**.
  A €4–6/mo Hetzner/DigitalOcean box runs it comfortably if you skip Ollama.
- **A domain you control**, with a **wildcard DNS A-record**:
  `*.example.com → <VPS public IP>` (plus `example.com` itself). The wildcard is
  what lets every `home.`, `vault.`, `git.` … subdomain resolve without adding
  21 records by hand.
- Ports **80** and **443** open on the VPS firewall (Caddy needs 80 for the
  ACME HTTP challenge and 443 for TLS). Optionally **2222** (Gitea SSH) and
  **22000** (Syncthing).

## Deploy

```bash
# 1. SSH into the VPS and clone the repo
git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
cd jamie-wigg/infra/selfhosted

# 2. Generate .env with random secrets, then set DOMAIN + ADMIN_EMAIL
make secrets
nano .env            # set DOMAIN=yourdomain.com and ADMIN_EMAIL=you@…

# 3. Sanity-check the compose file
make validate        # -> "compose OK"

# 4. Open firewall ports
sudo ufw allow 80,443,2222,22000/tcp && sudo ufw allow 22000/udp

# 5. Bring it all up (pulls images, starts everything)
make up
```

`make secrets` fills every blank password/token in `.env` with
`openssl rand` output and replaces the SearXNG `secret_key` placeholder, so the
only things you edit by hand are `DOMAIN` and `ADMIN_EMAIL`.

Within a minute or two Caddy will have issued certificates and your dashboard is
live at **`https://home.<your-domain>`**, linking to every app.

> Prefer to do it manually? `cp .env.example .env`, fill in the secrets
> yourself (`openssl rand -base64 32` for passwords, `openssl rand -hex 32` for
> the SearXNG key), then `docker compose up -d`.

## First-login notes

| App | First login |
|---|---|
| Vaultwarden | Sign up at `vault.…` (set `VAULTWARDEN_SIGNUPS=false` in `.env` and `docker compose up -d` after). Admin panel at `/admin` uses `VAULTWARDEN_ADMIN_TOKEN`. |
| Linkding / Miniflux | Superuser is created from `.env` (`*_USER` / `*_PASSWORD`). |
| Gitea | First account you register becomes the site admin. |
| Jellyfin | Walk through the setup wizard; point a library at `/media`. |
| Mealie / Filebrowser | Default creds `changeme@example.com`/`MyPassword` (Mealie) and `admin`/`admin` (Filebrowser) — **change immediately**. |
| Open WebUI | First account registered is the admin. Pull a model: `docker compose exec ollama ollama pull llama3.2`. |

## Operate

```bash
make ps        # what's running
make logs      # tail everything (or: docker compose logs -f <service>)
make pull      # update images…
make up        # …and recreate changed containers
make down      # stop (volumes/data are preserved)
```

Data lives in named Docker volumes (`docker volume ls | grep selfhosted`).
Back them up with your tool of choice; the Postgres volume covers Miniflux,
Gitea and Umami.

## Security notes

- **`logs.` (Dozzle)** exposes container logs and **`tools.`/`search.`** are
  unauthenticated by default. If your instance is public, put them behind
  Caddy [basic-auth](https://caddyserver.com/docs/caddyfile/directives/basic_auth)
  or an SSO proxy (e.g. [Authelia](https://www.authelia.com/)).
- Dozzle and Homepage mount the Docker socket **read-only** for stats/logs.
- Keep `VAULTWARDEN_SIGNUPS=true` only long enough to create your account.
- Everything is HTTPS-only with HSTS; Caddy redirects 80→443 automatically.

## Add more apps

The Awesome-Selfhosted catalogue has hundreds more. To add one:

1. Add a service block to `docker-compose.yml` (give it a named volume, put it
   on the `web` network; add the `db` network + a database in
   `postgres/init/00-databases.sql` if it needs Postgres).
2. Add a `sub.{$DOMAIN} { import common; reverse_proxy <service>:<port> }`
   block to the `Caddyfile`.
3. Add a tile to `homepage/services.yaml`.
4. `docker compose up -d`.

## Resource-saving toggles

The two heavyweights are **Ollama** (model downloads, RAM) and **Jellyfin**
(transcoding). On a small VPS, comment out the `ollama` + `open-webui` services
(and their `ai.` Caddy block) and/or `jellyfin` to run lean.
