# Setting up Agent TARS / UI-TARS for this workspace

[Agent TARS](https://github.com/bytedance/UI-TARS-desktop) is a vision-language-model-driven GUI agent that takes screenshots of your computer and clicks/types to complete natural-language instructions. Two flavors:

- **Agent TARS CLI** — runs in a terminal, drives a browser or the OS
- **UI-TARS Desktop** — a native Mac/Windows app version of the same

Both are powered by the UI-TARS / Seed-1.5-VL/1.6 model family.

> Honest framing: this repo (RHYTHMIX / Remotion / HyperFrames) is a *content authoring* workspace, not a GUI-automation target. Agent TARS is **not** a natural fit for the everyday `/rhythmix-new`, `/album-launch`, or `/dream` flows — those are LLM-driven content pipelines, not click-stream automation. See [§3 below](#3-where-it-could-actually-help-this-repo) for the narrow cases where it *does* pull weight.

For the full feature list, screenshots, and citation info, see the upstream README: <https://github.com/bytedance/UI-TARS-desktop>.

(Provider/model details verified against the upstream README as of **2026-05-12** — re-check before relying on them.)

---

## 1. Install and run

```bash
# Zero-install (recommended for first try)
npx @agent-tars/cli@latest

# Or install globally (requires Node.js >= 22)
npm install -g @agent-tars/cli@latest
```

Pick a provider and pass an API key:

```bash
# Anthropic
agent-tars --provider anthropic --model claude-3-7-sonnet-latest --apiKey "$ANTHROPIC_API_KEY"

# Volcengine (Doubao — ByteDance's own VLM, lowest latency for UI-TARS)
agent-tars --provider volcengine --model doubao-1-5-thinking-vision-pro-250428 --apiKey "$VOLCENGINE_API_KEY"
```

For the desktop app, download the latest installer from the [GitHub releases page](https://github.com/bytedance/UI-TARS-desktop/releases).

## 2. Point it at 9Router (optional)

If you already followed `SETUP-9ROUTER.md`, you can route Agent TARS through 9Router instead of paying provider rates directly:

```bash
agent-tars \
  --provider openai \
  --apiBaseUrl http://localhost:20128/v1 \
  --apiKey "$NINE_ROUTER_KEY" \
  --model kr/claude-sonnet-4.5
```

> Whether Agent TARS's vision flow works well with a non-VLM Kiro/Claude alias depends on the underlying model — UI-TARS-specific models (Doubao VLM, Seed-1.5-VL) give the best click accuracy. Treat the 9Router route as a quota fallback, not a primary.

## 3. Where it could actually help this repo

| Use case                                                                     | Why TARS helps                                                                      |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Visual QA of `rhythmix.html` / `studio.html` / `members.html` across browsers | Tell it "open `rhythmix.html` in Safari, scroll the page, screenshot the pricing section" |
| Driving Remotion Studio (`:3000`) for manual checks                         | "Click the MyComp composition, scrub to frame 30, capture a screenshot"             |
| Feeding the `website-to-hyperframes` skill with fresh captures              | TARS can grab the live page → HyperFrames turns it into video                       |
| Smoke-testing landing-page interactions (CTA clicks, FAQ accordion)          | Faster than scripting Playwright for one-off checks                                  |

For all of these, the existing `webapp-testing` skill (Playwright-based) is usually a better fit because it's scripted and reproducible. Reach for TARS when you want one-shot natural-language exploration instead of a saved test.

## 4. What this does *not* affect

- `.mcp.json` — Agent TARS isn't an MCP server; it runs as a standalone CLI/app.
- `.claude/settings.json` — no permission entries needed. TARS controls your *desktop*, not Claude Code.
- The Remotion / HyperFrames pipelines — they don't talk to TARS at all.

## 5. Security & safety notes

- TARS literally moves your mouse and types — **don't run it on a logged-in machine with sensitive sessions open** (banking, prod consoles, etc.).
- Prefer running it against a dedicated browser profile or a VM/container.
- The desktop app is documented as fully-local processing, but the *VLM* still calls a remote provider unless you self-host. Check your provider's data-retention policy.
- API keys go on the command line in the upstream examples — prefer environment variables (`--apiKey "$VOLCENGINE_API_KEY"`) so they don't end up in shell history.

## 6. Troubleshooting

- **`node: command not found` / version too old** — Agent TARS CLI needs Node.js ≥ 22. Use `nvm` or the devcontainer.
- **Click accuracy is bad** — switch to a UI-TARS-tuned VLM (Doubao 1.5 Thinking Vision Pro, Seed-1.5-VL). Generic Claude/GPT vision is weaker at pixel-level UI coordinates.
- **Hangs after screenshot** — confirm the provider supports vision input on the chosen model; text-only models silently stall on screenshot turns.
