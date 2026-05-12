# Setting up 9Router for this workspace

[9Router](https://9router.com) is a smart router that sits between your CLI tool (Claude Code, Codex, Cursor, OpenClaw…) and the LLM providers. It handles quota fallback, format translation, and ships with [RTK](https://github.com/decolua/rtk) token compression (20–40% input savings on tool-heavy turns).

This doc is the **project-specific** quickstart for using it with the RHYTHMIX / Remotion / HyperFrames work in this repo. The agent-heavy skills here (`/rhythmix-new`, `/album-launch`, `/dream`, `website-to-hyperframes`) burn through subscription quota fast — 9Router gives you a free fallback so you don't stall mid-render.

For the full feature list, video tutorials, and provider catalog, see the upstream README at https://github.com/decolua/9router.

---

## 1. Install and run

```bash
npm install -g 9router
9router
```

Dashboard opens at `http://localhost:20128/dashboard`.

First-login password is `INITIAL_PASSWORD` from `.env`, or `123456` if unset.

> ⚠️ Port `20128` is 9Router's default. Nothing in this repo uses it (Remotion Studio runs on `:3000`, HyperFrames preview on its own port), so no collisions.

## 2. Connect a free provider

Open Dashboard → **Providers** and connect at least one of:

| Provider        | Cost | What you get                              |
| --------------- | ---- | ----------------------------------------- |
| **Kiro AI**     | $0   | Claude Sonnet 4.5 + GLM-5 + MiniMax, no quota |
| **OpenCode Free** | $0 | Auto-fetched models, no auth              |
| **Vertex AI**   | $300 credits | Gemini 3 Pro + DeepSeek + GLM-5 (new GCP accts) |

> The retired free tiers (iFlow, Qwen, Gemini CLI) are no longer usable in 2026. Stick to the three above.

## 3. Point Claude Code at it

In Claude Code settings (or any CLI tool):

- **Endpoint**: `http://localhost:20128/v1`
- **API key**: copy from Dashboard → Settings → API Keys
- **Model**: `kr/claude-sonnet-4.5` (free Kiro Claude) is a good default for this repo

## 4. Recommended combo for this repo

The RHYTHMIX skills run long agent loops (TTS → composition → render → publish). Make a combo in Dashboard → Combos:

```
Combo name: rhythmix-fallback
  1. cc/claude-opus-4-7         (subscription primary)
  2. kr/claude-sonnet-4.5       (free unlimited Claude)
  3. kr/glm-5                   (free fallback)
  4. oc/<auto>                  (OpenCode Free emergency)
```

This keeps `/rhythmix-new` and `/album-launch` running even after a 5h Pro window closes.

## 5. Keep RTK on

RTK is on by default. Leave it on — the tool-heavy turns in this repo (`ls` of `rhythmix-*` dirs, `git diff` over HTML, large composition reads) are exactly the workload it compresses. Toggle is in Dashboard → Endpoint settings.

## 6. What this does *not* affect

- `.mcp.json` — the `creative-stack` MCP server (Replicate + ElevenLabs) is unrelated and keeps working.
- `.claude/settings.json` — permissions and the session-start hook are unchanged.
- Remotion / HyperFrames CLIs — they still call their own renderers locally; only the *LLM* calls route through 9Router.

## 7. Troubleshooting

- **"Language model did not provide messages"** → primary provider's quota is out. Add a combo fallback.
- **OAuth token expired** → Dashboard → Provider → Reconnect (auto-refresh usually handles it).
- **Wrong port** → `PORT=20128 NEXT_PUBLIC_BASE_URL=http://localhost:20128 9router`.
- **Costs higher than expected** → confirm RTK is on, then move primary to `glm/glm-5.1` ($0.6/1M) or a free Kiro model.
