# RHYTHMIX wiki — self-hosted

Wiki.js + Postgres behind Caddy (auto-HTTPS). One `docker compose up -d` away.

## What you need first

- A VPS (e.g. Hetzner CX11 €4/mo, DigitalOcean $4/mo droplet, Hostinger VPS) — Ubuntu 22.04+ with Docker installed.
- A domain you control (e.g. `rhythmix.app`) and the ability to set a DNS A-record.
- SSH access to the VPS.

## Deploy steps

1. **Point DNS at the VPS.** Add an A-record `wiki.your-domain.com` → VPS public IP. Wait for it to propagate (`dig wiki.your-domain.com` should return the VPS IP).

2. **SSH into the VPS** and clone the repo:
   ```bash
   git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
   cd jamie-wigg/infra/wiki
   ```

3. **Configure env:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   Set `DOMAIN`, `ADMIN_EMAIL`, and `POSTGRES_PASSWORD` (generate with `openssl rand -base64 32`).

4. **Open firewall ports** for HTTP/HTTPS (Caddy needs both — port 80 for ACME HTTP challenge, 443 for TLS):
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

5. **Launch:**
   ```bash
   docker compose up -d
   ```
   Caddy will obtain a Let's Encrypt cert automatically on first request (takes ~30s).

6. **Finish setup** in the browser at `https://wiki.your-domain.com`. Wiki.js shows a one-time admin-account wizard; pick a strong password.

7. **Seed initial pages** by pasting the markdown from `infra/wiki/seed-content.md` into a new top-level page titled "RHYTHMIX overview" in the wiki UI.

## Operations

- **Logs:** `docker compose logs -f` (or `docker compose logs -f wiki`)
- **Update Wiki.js:** `docker compose pull && docker compose up -d`
- **Backup the DB:** `docker compose exec db pg_dump -U wiki wiki | gzip > wiki-$(date +%F).sql.gz`
- **Restore:** `gunzip -c wiki-YYYY-MM-DD.sql.gz | docker compose exec -T db psql -U wiki wiki`
- **Tear down (keeps data):** `docker compose down`
- **Tear down + wipe data:** `docker compose down -v` (irreversible)

## Architecture

```
Internet ──443──> Caddy (TLS, Let's Encrypt) ──3000──> Wiki.js ──5432──> Postgres
```

Volumes are Docker-managed (`db-data`, `caddy-data`, `caddy-config`). Survive `docker compose down` but not `down -v`.

## Cost

Single VPS, ~512MB RAM is enough for Wiki.js + Postgres at single-user load. €4–5/month all-in.

## Why this stack

- **Wiki.js v2** — modern UI, Markdown editor, Git sync, asset uploads, decent search.
- **Postgres 16-alpine** — Wiki.js's recommended DB.
- **Caddy 2** — auto-HTTPS, no manual cert renewal, simpler config than nginx.
