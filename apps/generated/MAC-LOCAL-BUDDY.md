# Run a Private Buddy Locally on Your Mac

A companion whose **brain runs entirely on your Mac**. No API key, no cloud,
no data leaving your machine. Works offline. This is the more powerful path:
Apple Silicon can run real models, not the tiny ones a phone browser is stuck with.

## What you need (one-time, ~5 minutes)

1. **Install Ollama** (the easiest way to run local models on a Mac):
   - Download from https://ollama.com  → drag to Applications, open it.
   - Or via Homebrew: `brew install ollama`

2. **Pull a model.** Start small, go bigger as you like:
   ```bash
   ollama run llama3.2          # ~2 GB, fast, great on any M-series Mac
   # stronger options once you're happy:
   ollama run qwen2.5:7b        # smarter, needs ~8 GB free RAM
   ollama run llama3.3          # very capable, needs more RAM (M-Pro/Max/Ultra)
   ```
   Leave Ollama running — it serves the model at `http://localhost:11434`.

3. **Open the app.** Double-click `calm-local.html` (or any local-mode app the
   generator made). That's it — type a message and it replies, generated on your Mac.

> Turn off your wifi and it keeps working. Nothing was ever sent anywhere.

## Make your own local buddy

Write a spec and generate it:

```bash
cd apps
cat > my-buddy.json <<'JSON'
{
  "name": "Calm",
  "emoji": "🌙",
  "role": "Private Evening Companion",
  "traits": ["warm", "patient", "grounding"],
  "purpose": "help you wind down and ease anxiety before sleep",
  "color": "#8b5cf6",
  "style": "playful",
  "backend": "ollama",
  "ollamaModel": "llama3.2"
}
JSON

node buddy-generator.js my-buddy.json my-buddy.html
open my-buddy.html
```

Change `ollamaModel` to whatever you pulled (`qwen2.5:7b`, `llama3.3`, etc.).

## Honest notes (no tricks)

- **Tested:** the generated HTML is verified valid and correctly wired to
  Ollama. **Not tested here:** actual model inference — that runs on *your*
  Mac, so you confirm the reply quality. (There's no GPU/Ollama in the build
  sandbox; that's exactly why your Mac is the right place to run it.)
- **CORS:** modern Ollama allows `localhost` browser calls. If a reply errors,
  start Ollama with `OLLAMA_ORIGINS='*' ollama serve` and reload the page.
- **Capability trade:** a local 7B model is warm and capable for companionship
  and reflection, but a cloud frontier model is still sharper on hard reasoning.
  The trade you're buying is **total privacy + offline + zero cost.**
- **Crisis safety is always on**, in every generated app, regardless of backend.

## Why this is the cutting edge

Running a real LLM locally on Apple Silicon (via Ollama / MLX) is genuinely
frontier consumer AI in 2024 — and almost nobody in the companion-app space
ships it. It's the truest version of "a system that can't lie to you," because
there's no server in the loop to lie.
