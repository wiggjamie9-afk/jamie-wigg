# Browser Use — let an AI drive a real web browser

Plain-English setup. You describe a web task in normal words; an AI opens a
browser, clicks around, and does it. Based on the open-source
[browser-use](https://github.com/browser-use/browser-use) framework.

## What's already done (by Claude)

- ✅ Installed `browser-use` into an isolated environment here (`browser-use/.venv/`)
- ✅ Pointed it at the browser that's already in this machine (Chromium)
- ✅ Wrote a one-line runner (`run.py`) and a wrapper command (`browser-use`)

**The only thing left is an AI key** — the "brain" that decides what to click.
(The browser is free; the AI thinking costs a few cents per task, billed to your
own Anthropic account.)

## One-time setup (≈1 minute)

1. Get a key at **https://console.anthropic.com/** (starts with `sk-ant-`).
2. In Claude Code, say: **"Save my Anthropic key: sk-ant-…"** and I'll store it
   privately (never committed). Or set it yourself:
   ```bash
   export ANTHROPIC_API_KEY=sk-ant-...
   ```

## The one command

```bash
./browser-use/browser-use "<describe the web task>"
```

Examples you can copy and edit:

```bash
./browser-use/browser-use "go to news.ycombinator.com and list the top 3 story titles"
```
```bash
./browser-use/browser-use "go to rhythmixapp.com.au and tell me what the main heading and call-to-action button say"
```
```bash
./browser-use/browser-use "search Google for 'best free video editor 2026' and summarise the top 3 results"
```

The AI prints what it found at the end under `=== RESULT ===`.

## Honest notes

- **It needs the AI key to do anything.** Without it you'll get a clear
  "ANTHROPIC_API_KEY is not set" message.
- **Runs headless here** (no screen in this cloud box) — it still works, you just
  don't watch it live. On a computer with a display you can set
  `BROWSER_USE_HEADLESS=false` to watch.
- **Some sites block bots / need logins.** Public pages work best. For logged-in
  tasks you'd need to supply credentials, which is more involved — ask and I'll help.
- **Cost:** a few cents of Anthropic usage per task, depending on how many pages
  it has to read. Set spend limits in your Anthropic account.

## Knobs (optional)

| Environment variable | Default | What it does |
|---|---|---|
| `ANTHROPIC_API_KEY` | *(required)* | Your AI key |
| `BROWSER_USE_MODEL` | `claude-sonnet-4-6` | Which AI model drives the browser |
| `BROWSER_USE_HEADLESS` | `true` | `false` to watch the browser (needs a display) |
| `BROWSER_USE_CHROMIUM` | `/opt/pw-browsers/chromium` | Path to the Chrome/Chromium binary |

## Files here

| File | What it is |
|---|---|
| `run.py` | The actual runner (reads your task, drives the browser) |
| `browser-use` | One-line wrapper that uses the isolated Python env |
| `.venv/` | Isolated Python environment (not committed to git) |
| `README.md` | This guide |
