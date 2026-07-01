# Scrapling — Setup & Reference

## Overview

**Scrapling** is an adaptive Python web-scraping framework that scales from a
single request to a full concurrent crawl. Its parser **learns from website
changes and relocates your elements** when pages update; its fetchers **bypass
anti-bot systems** (e.g. Cloudflare Turnstile) out of the box; its spider
framework does concurrent, multi-session crawls with pause/resume and proxy
rotation. By Karim Shoair (`github.com/D4Vinci/Scrapling`). **BSD-3-Clause**.
Python 3.10+.

Highlights:
- **Fetchers** — `Fetcher` (fast HTTP with browser TLS-fingerprint impersonation,
  HTTP/3), `StealthyFetcher` (stealth + Cloudflare Turnstile/Interstitial bypass),
  `DynamicFetcher` (full Playwright Chromium/Chrome automation). Session classes
  (`FetcherSession`, `StealthySession`, `DynamicSession`) + `ProxyRotator`.
- **Adaptive parsing** — `auto_save=True` then `adaptive=True` re-finds elements
  after a redesign via similarity algorithms; CSS / XPath / text / regex /
  `find_similar()`; BeautifulSoup-style `find_all`; auto selector generation.
- **Spiders** — Scrapy-like (`start_urls`, async `parse`, `Request`/`Response`),
  concurrency + per-domain throttling, multi-session routing by `sid`, checkpoint
  **pause/resume** (`crawldir=`, Ctrl+C), streaming mode, robots.txt compliance,
  dev cache mode, JSON/JSONL export.
- **MCP server for AI** — a built-in MCP server that extracts targeted content
  *before* handing it to Claude/Cursor, cutting token usage.
- **CLI** — `scrapling shell` (IPython), and `scrapling extract get|fetch|stealthy-fetch <url> out.{md,txt,html}`.

> ### How this fits the RHYTHMIX repo
> **Useful for the research/automation side.** This repo already leans on browser
> automation and content research (OpenManus, the Playwright MCPs, the n8n
> content pipelines, "RHYTHMIX content research and market intelligence"). Scrapling
> is a faster, anti-bot-resistant way to pull that source data, and its **MCP
> server** ($token-saving extraction) could register alongside the repo's other
> `.mcp.json` servers. Tangential to the HyperFrames video pipeline itself.
> **Use responsibly** — respect target sites' ToS and robots.txt (the library
> ships a `robots_txt_obey` flag and states it's for educational/research use).

## Install

```bash
pip install scrapling                 # parser engine ONLY (no fetchers/CLI)
```

> **Gotcha:** the bare install has **no fetchers/spiders** — importing
> `scrapling.fetchers` / `scrapling.spiders` then raises `ModuleNotFoundError`.
> For anything beyond parsing HTML you already have, install an extra **and** the
> browsers:

```bash
pip install "scrapling[fetchers]"     # fetchers + sessions
pip install "scrapling[ai]"           # + MCP server
pip install "scrapling[shell]"        # + interactive shell & extract CLI
pip install "scrapling[all]"          # everything

scrapling install                     # download browsers + system/fingerprint deps
scrapling install --force             # force reinstall
```

**Docker** (all extras + browsers): `docker pull pyd4vinci/scrapling` or
`ghcr.io/d4vinci/scrapling:latest`.

## Quick use

```python
from scrapling.fetchers import Fetcher, StealthyFetcher

# adaptive parse — survives redesigns
StealthyFetcher.adaptive = True
p = StealthyFetcher.fetch('https://example.com', headless=True, network_idle=True)
products = p.css('.product', auto_save=True)     # save location now
products = p.css('.product', adaptive=True)       # re-find after the site changes

# plain HTTP with TLS impersonation
page = Fetcher.get('https://quotes.toscrape.com/')
quotes = page.css('.quote .text::text').getall()
```

```python
# a full spider with pause/resume
from scrapling.spiders import Spider, Response

class QuotesSpider(Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 10
    async def parse(self, response: Response):
        for q in response.css('.quote'):
            yield {"text": q.css('.text::text').get(), "author": q.css('.author::text').get()}
        nxt = response.css('.next a')
        if nxt: yield response.follow(nxt[0].attrib['href'])

result = QuotesSpider(crawldir="./crawl_data").start()   # Ctrl+C to pause; rerun to resume
result.items.to_json("quotes.json")
```

```bash
# no-code extraction from the terminal
scrapling extract get 'https://example.com' content.md
scrapling extract stealthy-fetch 'https://nopecha.com/demo/cloudflare' out.html \
  --css-selector '#padded_content a' --solve-cloudflare
```

## Notes

- On this repo's Mac, `mac-downloads/Install-Downloads.command` runs
  `pip install --user "scrapling[all]"` (light) and then `scrapling install` to
  download browsers (**heavy** — skipped under `SKIP_HEAVY=1`, where it just
  prints the command to run later).
- To use the MCP server with Claude Code, install `scrapling[ai]` and wire it into
  `.mcp.json` per the upstream docs (not auto-added here).
- Source of truth: `github.com/D4Vinci/Scrapling` + the full docs. Benchmarks,
  the MCP server, and the shell have more depth than this snapshot covers.
