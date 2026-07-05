# Setting up Obscura (headless browser) for this workspace

[Obscura](https://github.com/h4ckf0r0day/obscura) is an open-source headless browser engine written in Rust, built for web scraping and AI-agent automation. It runs real JavaScript via an embedded V8, speaks the Chrome DevTools Protocol (CDP), and works as a drop-in replacement for headless Chrome with Puppeteer and Playwright. Apache-2.0. Single ~70 MB binary, ~30 MB RSS, no Chrome/Node dependency.

> Honest framing: this repo already has three browser tools — the **playwright** / **claude-playwright** MCP servers and **OpenManus** (`SETUP-OPENMANUS.md`). Obscura doesn't add a new capability; it swaps the engine underneath for a much lighter one. Where it earns its keep here is **cheap parallel fetching** (smoke tests, link checks, scraping at 25+ concurrent pages on small machines) and **agent browsing without a Chrome install**. It is **not** a fit for anything visual — see [§5](#5-what-this-does-not-replace).

(Commands and flags below are taken from the upstream README as of **2026-07-05** — re-check before relying on them.)

---

## 1. Cloud-session reality check (verified 2026-07-05)

Installing Obscura from a Claude Code cloud session for this repo **does not work** — every distribution channel is blocked by the sandbox network policy:

- **GitHub release binaries** — the proxy scopes GitHub to this session's repos; `github.com/h4ckf0r0day/...` returns the "use add_repo" error, and cross-owner `add_repo` is rejected.
- **Docker Hub** — `registry-1.docker.io` manifests resolve, but layer blobs redirect to `production.cloudfront.docker.com`, which the proxy 403s. (No Docker daemon in the container anyway.)
- **Build from source** — needs the GitHub clone; same block.
- Not published on npm, crates.io, or PyPI (the proxy-exempt registries).

So: install it on a real machine (or a session started with `h4ckf0r0day/obscura` as a source), not here. In cloud sessions, keep using the Playwright MCP for browser work.

## 2. Install (on an unrestricted machine)

```bash
# Linux x86_64
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-x86_64-linux.tar.gz
tar xzf obscura-x86_64-linux.tar.gz

# macOS Apple Silicon
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-aarch64-macos.tar.gz
tar xzf obscura-aarch64-macos.tar.gz

# Docker (CDP server on localhost:9222)
docker run -d --name obscura -p 127.0.0.1:9222:9222 h4ckf0r0day/obscura
```

Release archives ship `obscura` + `obscura-worker` — keep them in the same directory (the parallel `scrape` command needs the worker). Linux builds target Ubuntu 22.04 / glibc 2.35+.

> ⚠️ Trust note: unsigned binaries from a pseudonymous author (`h4ckf0r0day`). The project is real and Apache-2.0 with public source, but if that bothers you, build from source (`cargo build --release`, Rust 1.75+, ~5 min for the V8 compile) or run it inside the Docker image (distroless, no shell) rather than on your host.

## 3. Where it could actually help this repo

| Use case | Why Obscura fits |
| --- | --- |
| Text/status smoke tests of rhythmixapp.com.au | `obscura fetch https://rhythmixapp.com.au --dump text` in ~85 ms per page, no Chrome startup — cheap enough to check every root `*.html` page on every deploy |
| Parallel link/page sweeps | `obscura scrape <url…> --concurrency 25 --eval "document.title" --format json` — the whole live-site page list in one command |
| Agent browsing on small boxes | `obscura mcp` exposes navigate/click/fill/evaluate/wait tools over MCP with ~30 MB RSS — same shape as the Playwright MCP tools |
| Puppeteer/Playwright scripts without Chrome | `obscura serve --port 9222`, then `chromium.connectOverCDP({ endpointURL: 'ws://127.0.0.1:9222' })` |

Example — title-check the main live pages:

```bash
obscura scrape \
  https://rhythmixapp.com.au \
  https://rhythmixapp.com.au/dreams.html \
  https://rhythmixapp.com.au/live.html \
  --concurrency 10 --eval "document.title" --format json --quiet
```

## 4. MCP wiring (when installed)

Deliberately **not** added to `.mcp.json` — the binary can't exist in cloud sessions (§1), so a checked-in entry would just error at session start. On a machine where `obscura` is on PATH, add:

```json
"obscura": {
  "command": "obscura",
  "args": ["mcp"]
}
```

Tools exposed: `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_fill`, `browser_type`, `browser_press_key`, `browser_select_option`, `browser_evaluate`, `browser_wait_for`, `browser_network_requests`, `browser_console_messages`, `browser_close`. Optional flags: `--stealth`, `--proxy <url>`, `--user-agent <ua>`.

## 5. What this does NOT replace

- **HyperFrames rendering** — Promos render through the HyperFrames CLI's own browser pipeline. Obscura is a custom engine, not Chromium; do not point renders at it (ADR-0001 territory: don't "fix" the pipeline).
- **`deploy-check` / `render-verify` screenshots** — Obscura has no screenshot capability in its MCP/CLI surface. Anything visual (homepage screenshots at desktop/mobile widths, render verification) stays on Playwright + real Chromium.
- **The playwright / claude-playwright MCP entries in `.mcp.json`** — leave them; they're the default in cloud sessions and the only option for visual checks.
- **OpenManus** — that's an LLM-driven agent loop; Obscura is just the engine. They solve different layers (OpenManus could in principle drive Obscura via CDP, but that's not wired and not needed).

## 6. Stealth mode — use it narrowly

`--stealth` bundles anti-fingerprinting (randomized GPU/canvas/audio fingerprints, `navigator.webdriver = undefined`, masked native functions) and blocks ~3,500 tracker domains. Legitimate uses here: testing our own pages as a "clean" visitor, and cutting tracker noise/weight during scrapes. Don't use it to evade access controls on third-party sites — check target sites' terms, and `--obey-robots` exists on `serve` for a reason.

## 7. Obscura Cloud (watch this space)

Upstream is building a hosted version (managed infra, residential proxies) — relevant for this iPhone-first, no-desktop setup, since §1 rules out cloud-session installs and there's no local machine to run the binary on. The open-source engine stays Apache-2.0 and ungated. Waitlist link is in the upstream README.
