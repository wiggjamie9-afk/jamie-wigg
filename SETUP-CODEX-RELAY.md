# Setting up Codex Relay for this workspace

[Codex Relay](https://github.com/codex-relay/codex-relay) is a local relay server that lets you follow and steer [OpenAI Codex CLI](https://github.com/openai/codex) sessions from your phone. You run the relay in your workspace; the mobile app connects over your own network. Nothing leaves your machine.

> Honest framing: this repo is built around **Claude Code**, and the RHYTHMIX skills (`/rhythmix-new`, `/album-launch`, `/dream`, etc.) only run there. Codex Relay is for the **Codex CLI** (OpenAI's agentic coding tool) — a separate binary, separate sessions. Where Codex Relay earns its keep here is **iPhone access**: start a Codex session on your computer, then monitor or steer it from your phone while you're away from the desk. Given the iPhone-first creative workflow in `CREATIVE-AI-STACK.md`, this is the narrow fit.

Codex Relay is an independent project. It is not affiliated with, endorsed by, or sponsored by OpenAI.

---

## 1. Requirements

- Node.js 22.14 or newer
- [Codex CLI](https://github.com/openai/codex) installed and signed in (`codex` in PATH)
- Codex Relay mobile app on your iPhone
- Phone and computer on the same Wi-Fi, or both on [Tailscale](https://tailscale.com)

## 2. Start the relay

Run from the workspace root (this directory):

```bash
npx codex-relay@latest
```

The relay prints a QR code, a `Mobile:` URL, and a `codex-relay://pair...` deep link. Leave this terminal running.

To keep it running after you close the terminal:

```bash
npx codex-relay@latest --bg
```

Runtime files (logs, process state, pairing data) land in `.codex-relay/` — already in `.gitignore`.

## 3. Pair the mobile app

1. Open the Codex Relay app on your iPhone.
2. Scan the QR code printed by the relay, or paste the full `codex-relay://pair...` link.
3. The app shows a four-word approval code.
4. Back on your computer, approve it:

```bash
npx codex-relay@latest approve XXXX-XXXX
```

Your phone can now view and send prompts to any Codex session running in this workspace.

## 4. Network setup

The phone must be able to reach the `Mobile:` URL printed by the relay.

| Scenario | What to do |
|---|---|
| Same Wi-Fi | Usually works out of the box |
| Different networks (e.g. phone on LTE) | Use Tailscale — connect both devices, then set `CODEX_RELAY_PUBLIC_URL` to the Tailscale IP |
| Corporate / hotel Wi-Fi with client isolation | Use Tailscale or an ngrok/Cloudflare tunnel |

If the printed URL isn't reachable, set the environment variable before starting:

```bash
CODEX_RELAY_PUBLIC_URL=http://<tailscale-ip>:8787 npx codex-relay@latest
```

## 5. Where it fits in this repo

| Use case | Why Codex Relay helps |
|---|---|
| Monitor a long Codex session from your phone | Watch output stream in real time without sitting at the computer |
| Respond to Codex input requests on the go | Approve shell commands, continue threads, unblock a stalled agent |
| Review git diffs and workspace state from iPhone | Built-in preview surface shows files, terminal, local web output |
| Steer a session while the studio renders | Send follow-up prompts while `npx hyperframes@0.4.42 render` runs in another pane |

For *authoring* RHYTHMIX promos and running `/album-launch`, stay in Claude Code — the project skills only live here. Use Codex Relay as a remote monitor / steering wheel for Codex CLI sessions, not a replacement.

## 6. Useful commands

| Command | What it does |
|---|---|
| `npx codex-relay@latest` | Start the relay and print the pairing QR |
| `npx codex-relay@latest --bg` | Start in background mode |
| `npx codex-relay@latest qr` | Print the pairing QR for an already-running relay |
| `npx codex-relay@latest approve XXXX-XXXX` | Approve a pending mobile pairing |
| `npx codex-relay@latest clear` | Unpair all mobile devices |

## 7. Configuration

The relay listens on `0.0.0.0:8787` by default.

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default `8787`) |
| `HOST` | Listen host (default `0.0.0.0`) |
| `CODEX_RELAY_PUBLIC_URL` | URL embedded in the pairing QR — use a Tailscale or tunnel URL when needed |
| `CODEX_RELAY_WORKSPACE_PATH` | Workspace path Codex should use (defaults to `$PWD`) |
| `CODEX_RELAY_AUTH_DB_PATH` | Path for the pairing/session database |
| `CODEX_BIN` | Codex CLI executable path |
| `CODEX_HOME` | Codex home directory for reading local session metadata |

Add these to `.env` at the repo root (already gitignored via `.env.example`).

## 8. What this does *not* affect

- `.claude/skills/` — Claude Code skills are unrelated to Codex CLI sessions.
- `.mcp.json` — Codex Relay does not consume MCP servers; MCP is a Claude Code concern.
- `rhythmix-*/` compositions — HyperFrames render jobs run independently; Codex Relay just lets you watch Codex CLI work alongside them.
- `studio/` Next.js build — no interaction; Codex Relay is workspace-level, not app-level.

## 9. Security notes

- The relay binds to `0.0.0.0` by default, so it is reachable by anything on your LAN. Only run it on networks you trust, or restrict `HOST` to a Tailscale interface.
- Pairing requires physical approval on the computer — a phone can't self-approve.
- The mobile app can send prompts and approve Codex actions. Only pair devices you control.
- Pairing data lives under `.codex-relay/` in the workspace. `npx codex-relay@latest clear` removes all paired devices if a device is lost.

## 10. Troubleshooting

**`qr` says no server found**
Start the relay first: `npx codex-relay@latest`

**Mobile app can't connect**
Work through the checklist:
1. Phone and computer on the same Wi-Fi or Tailscale?
2. Can the phone open the exact `Mobile:` URL printed by the relay in a browser?
3. Does your firewall allow inbound traffic on port 8787?
4. Did you set `CODEX_RELAY_PUBLIC_URL` to a reachable address if the default URL isn't working?

**Another process is using the local pairing database**
Use the existing server instance: `npx codex-relay@latest qr`

Full upstream docs and issue tracker: <https://github.com/codex-relay/codex-relay>.
