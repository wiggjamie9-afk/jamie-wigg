# Setting up Agent TARS / UI-TARS for this workspace

The `TARS*` umbrella (ByteDance) ships **two distinct projects**, not two flavors of one:

- **Agent TARS** — a *general* multimodal AI agent stack that brings GUI Agent + Vision into your terminal, computer, browser, and product. Ships a **CLI** and **Web UI**; its kernel is built on MCP and it can **mount MCP servers** to reach real-world tools.
- **UI-TARS Desktop** — a native Mac/Windows desktop app providing a GUI agent driven by the UI-TARS model, with local *and* remote computer/browser operators.

Both lean on the UI-TARS / Seed-1.5-VL/1.6 vision-language model family.

> Honest framing: this repo (RHYTHMIX / Remotion / HyperFrames) is a *content authoring* workspace, not a GUI-automation target. Agent TARS is **not** a natural fit for the everyday `/rhythmix-new`, `/album-launch`, or `/dream` flows — those are LLM-driven content pipelines, not click-stream automation. See [§3 below](#3-where-it-could-actually-help-this-repo) for the narrow cases where it *does* pull weight.

For the full feature list, screenshots, and citation info, see the upstream README: <https://github.com/bytedance/UI-TARS-desktop>.

(Provider/model details verified against the upstream README as of **2026-06-28** — re-check before relying on them.)

### What's new upstream

- **Agent TARS CLI v0.3.0** (2025-11-05) — streaming output for multi-step tools (shell commands, multi-file structured display), runtime settings with timing stats for tool calls + deep thinking, an **Event Stream Viewer** for tracing/debugging the data flow, and an **AIO agent Sandbox** as an isolated all-in-one tool-execution environment.
- **UI-TARS Desktop v0.2.0** (2025-06-12) — free **Remote Computer Operator** and **Remote Browser Operator** (zero-config, click-to-control).

### Core features (Agent TARS)

- 🖱️ **One-click CLI** — runs headful (Web UI) or headless (server).
- 🌐 **Hybrid Browser Agent** — control a browser via GUI Agent, DOM, or a hybrid strategy.
- 🔄 **Event Stream** — a protocol-driven event stream powers context engineering and the Agent UI.
- 🧰 **MCP Integration** — built on MCP; mount external MCP servers to connect to real tools.

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

## 4. Relationship to this repo's MCP setup

- `.mcp.json` here registers MCP servers for **Claude Code** to consume. Agent TARS doesn't get added to it — it runs as a standalone CLI/app, not as a server Claude Code mounts.
- The reverse *is* possible: Agent TARS is itself an MCP **host** (its kernel is built on MCP and it can mount MCP servers). So this repo's servers — `creative-stack`, `nvidia` (MiniMax-M3), `stepfun`, `higgsfield` — could in principle be mounted *into* an Agent TARS session via its own config. Nothing in this repo wires that up today; it's an option, not a dependency.
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
