# Installation

Already ran the **In one minute** steps? You're set. Below are alternative methods.

Don't want to install anything? Use the [Telegram bot](https://t.me/maigret_osint_bot).

## Reports

- **PDF report**
- **HTML report screenshot**
- **XMind 8 report screenshot**
- **Full console output**

## Windows

Download a standalone EXE from [Releases](https://github.com/soxoj/maigret/releases). Video guide: <https://youtu.be/qIgwTZOmMmM>.

## Cloud Shells

Run Maigret in the browser via cloud shells or Jupyter notebooks:

- Open in Cloud Shell
- Run on Replit
- Open In Colab
- Open In Binder

## Local installation (pip)

```bash
# install from pypi
pip3 install maigret

# usage
maigret username
```

## From source

```bash
# or clone and install manually
git clone https://github.com/soxoj/maigret && cd maigret

# build and install
pip3 install .

# usage
maigret username
```

## Docker

Two image variants are published:

- `soxoj/maigret:latest` — CLI mode (default)
- `soxoj/maigret:web` — auto-launches the web interface

```bash
# official image (CLI)
docker pull soxoj/maigret

# CLI usage
docker run -v /mydir:/app/reports soxoj/maigret:latest username --html

# Web UI (open http://localhost:5000)
docker run -p 5000:5000 soxoj/maigret:web

# Web UI on a custom port
docker run -e PORT=8080 -p 8080:8080 soxoj/maigret:web

# manual build
docker build -t maigret .                  # CLI image (default target)
docker build --target web -t maigret-web . # Web UI image
```

Build errors? See the troubleshooting guide.

# Usage

## Examples

```bash
# make HTML, PDF, and Xmind8 reports
maigret user --html
maigret user --pdf
maigret user --xmind # Output not compatible with xmind 2022+

# machine-readable exports
maigret user --json ndjson   # newline-delimited JSON (also: --json simple)
maigret user --csv
maigret user --txt
maigret user --graph         # interactive D3 graph (HTML)

# search on sites marked with tags photo & dating
maigret user --tags photo,dating

# search on sites marked with tag us
maigret user --tags us

# search for three usernames on all available sites
maigret user1 user2 user3 -a
```

Run `maigret --help` for all options. Docs: CLI options, more examples. Running into 403s or timeouts? See [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md).

## Web interface

Maigret has a built-in web UI with a results graph and downloadable reports.

```bash
maigret --web 5000
```

Open <http://127.0.0.1:5000>, enter a username, and view results.

## Python library

Maigret can be embedded in your own Python projects. The CLI is a thin wrapper around an async function you can call directly — build custom pipelines, feed results into your own tooling, or run it inside a larger OSINT workflow.

See the full library usage guide for a working example, async patterns, and how to filter sites by tag.

## Useful CLI flags

- `--parse URL` — parse a profile page, extract IDs/usernames, and use them to kick off a recursive search.
- `--permute` — generate likely username variants from two or more inputs (e.g. `john doe` → `johndoe`, `j.doe`, …) and search for all of them.
- `--self-check [--auto-disable]` — verify `usernameClaimed` / `usernameUnclaimed` pairs against live sites for maintainers auditing the database.

## Tor / I2P / proxies

Maigret can route checks through a proxy, Tor, or I2P — useful for `.onion` / `.i2p` sites and for bypassing WAFs that block datacenter IPs.

```bash
# any HTTP/SOCKS proxy
maigret user --proxy socks5://127.0.0.1:1080

# Tor (default gateway socks5://127.0.0.1:9050)
maigret user --tor-proxy socks5://127.0.0.1:9050

# I2P (default gateway http://127.0.0.1:4444)
maigret user --i2p-proxy http://127.0.0.1:4444
```

Start your Tor / I2P daemon **before** running the command — Maigret does not manage these gateways.

# Contributing

Add or fix new sites surgically in `data.json` (no `json.load`/`json.dump`), then run `./utils/update_site_data.py` to regenerate `sites.md` and the database metadata, and open a pull request. For more details, see the `CONTRIBUTING` guide and development docs. Release history: `CHANGELOG.md`.

# Commercial Use

The open-source Maigret is MIT-licensed and free for commercial use without restriction — but site checks break over time and need active maintenance.

For serious commercial use — with a daily-updated site database or a username-check API — reach out: maigret@soxoj.com

- **Private site database** — 5,000+ sites, updated daily (separate from the public open-source database)
- **Username check API** — integrate Maigret into your product

# About

## Disclaimer

For educational and lawful purposes only. You are responsible for complying with all applicable laws (GDPR, CCPA, etc.) in your jurisdiction. The authors bear no responsibility for misuse.

## Feedback

- Open an issue
- GitHub Discussions
- Telegram

## SOWEL classification

OSINT techniques used:

- SOTL-2.2. Search For Accounts On Other Platforms
- SOTL-6.1. Check Logins Reuse To Find Another Account
- SOTL-6.2. Check Nicknames Reuse To Find Another Account
