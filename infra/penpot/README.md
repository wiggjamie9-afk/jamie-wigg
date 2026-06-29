# Penpot — self-host (Docker Compose)

Official Penpot stack (frontend, backend, exporter, MCP, Postgres 15, Valkey,
mailcatcher), pinned via `docker-compose.yaml` (Penpot `2.16` by default — set
`PENPOT_VERSION` to override). See `../../SETUP-PENPOT.md` for the full reference.

## Run

```bash
cd infra/penpot
docker compose -p penpot up -d
```

Penpot serves on `http://localhost:9001` by default. Configure flags, email,
storage, and auth per the [self-host guide](https://help.penpot.app/technical-guide/).

> **Note:** the cloud sandbox cannot run this — its egress policy denies Docker
> Hub's image CDN (`production.cloudfront.docker.com` → 403), so image pulls
> fail. Run this on a machine/VPS with unrestricted egress (same constraint as
> the OpenClaw CLI install). The `docker-compose.yaml` here is the official file
> fetched from `penpot/penpot@main` so the install is reproducible offline.

## Update

Re-fetch the upstream compose when bumping versions:

```bash
curl -fsSL -o docker-compose.yaml \
  https://raw.githubusercontent.com/penpot/penpot/main/docker/images/docker-compose.yaml
```
