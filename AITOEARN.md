# AiToEarn

One-stop platform for creators to **Monetize · Publish · Engage · Create** content across 10+ global platforms, driven by AI Agents.

AiToEarn helps OPCs (one-person companies), creators, brands, and enterprises build, distribute, and monetise content. It is directly applicable to this repo: every RHYTHMIX **Promo** ([CONTEXT.md](CONTEXT.md)) eventually needs to land on the same channels AiToEarn already speaks to.

- China site: [aitoearn.cn](https://aitoearn.cn)
- International site: [aitoearn.ai](https://aitoearn.ai)

---

## Supported channels

China-domestic:

- 抖音 (Douyin)
- 小红书 (Rednote / Xiaohongshu)
- 快手 (Kuaishou)
- 哔哩哔哩 (Bilibili)
- 视频号 (WeChat Channels)
- 微信公众号 (WeChat Official Accounts)

International:

- TikTok
- YouTube
- Facebook
- Instagram
- Threads
- Twitter (X)
- Pinterest
- LinkedIn

---

## The four Agents

### Monetize — content earnings

Creators can sell content to fulfil merchant promotion tasks. Settlement is result-driven:

| Model | Full name | Means |
|---|---|---|
| **CPS** | Cost Per Sale | paid by transaction value |
| **CPE** | Cost Per Engagement | paid by interaction volume |
| **CPM** | Cost Per Mille | paid by playback volume |

### Publish — distribution Agent

One-click distribution across every supported channel above. Calendar-style scheduling so all platforms share a single publishing plan.

For this repo: a rendered **Cut** (`rhythmix-*-<length>/<promo>.mp4`) + Narration + thumbnail can be pushed to all platforms from one queue, instead of uploading each MP4 manually per channel.

### Engage — interaction Agent

Via the AiToEarn browser extension:

- Automated likes / saves / follows across the platforms above.
- AI-generated replies to each comment using an LLM.
- Comment mining — flags high-conversion signals (e.g. "求链接", "怎么购买", "where can I buy").
- Brand monitoring — surfaces mentions of your brand and lets the Agent jump into trending threads.

### Create — content creation Agent

Refactors content production as an Agent workflow:

- **Video:** routes to Grok, Veo, Seedance, etc., plus translation and editing modules — end-to-end video assembly.
- **Image+text:** calls Nano Banana and other top image models for high-quality image/copy combos.
- **Batch:** dispatches many creation tasks in parallel for matrix accounts or large-scale distribution.

This overlaps with the local stack in [`CREATIVE-AI-STACK.md`](CREATIVE-AI-STACK.md) (Higgsfield, Replicate, Pollinations, ElevenLabs). AiToEarn is the *delivery + monetisation* layer; this repo is still the *authoring* layer.

---

## Five ways to use it

| # | Mode | Audience | Needs deploy? |
|---|---|---|---|
| ① | Open the website directly | All users | No |
| ② | Inside OpenClaw (龙虾) | OpenClaw users | No |
| ③ | Inside Claude / Cursor / any MCP host | AI-tool users | No |
| ④ | Docker one-command deploy | Teams that want self-hosting | Yes (server) |
| ⑤ | Build from source | Developers | Yes (dev env) |

Modes ②③④ all need an API Key first.

---

## Getting an API Key (prerequisite for ② ③ ④)

Three steps:

1. Open `aitoearn.cn` (China users) or `aitoearn.ai` (international users), register and sign in.
2. Click **Settings** in the left-hand menu.
3. Under **API Key**, click **Create** and copy the generated key.

> Region/key matching matters. Use the `aitoearn.cn` key for the China edition and the `aitoearn.ai` key for the international edition — a mismatch returns 401.

---

## ① Use the website directly

The simplest path. Just open a browser, no configuration:

- China users → [aitoearn.cn](https://aitoearn.cn)
- International users → [aitoearn.ai](https://aitoearn.ai)

---

## ② Use inside OpenClaw (龙虾)

Prerequisite: API Key (above).

In a server terminal, install the plugin:

```bash
npx -y @aitoearn/openclaw-plugin-cli
```

On first run it will prompt for the environment (China vs international) and the API Key. Pick the one matching the key you generated — otherwise you get a 401.

Once installed, OpenClaw can receive and execute AiToEarn earning tasks directly.

---

## ③ Use inside Claude / Cursor / any MCP host

Prerequisite: API Key (above). AiToEarn supports any MCP-speaking Agent.

Pick the endpoint that matches your key — mismatching environment and key returns 401:

| Environment | MCP endpoint | SSE endpoint |
|---|---|---|
| China | `https://aitoearn.cn/api/unified/mcp` | `https://aitoearn.cn/api/unified/sse` |
| International | `https://aitoearn.ai/api/unified/mcp` | `https://aitoearn.ai/api/unified/sse` |

### Claude Desktop

Edit `claude_desktop_config.json` and add:

```json
{
  "mcpServers": {
    "aitoearn": {
      "type": "http",
      "url": "https://aitoearn.ai/api/unified/mcp",
      "headers": {
        "x-api-key": "your-API-Key"
      }
    }
  }
}
```

### Claude Code (this repo)

Add the same block to `.mcp.json` alongside the existing `higgsfield`, `pollinations`, and `creative-stack` entries. Pull the key from a gitignored `.env` rather than hard-coding it.

### Cursor and other MCP hosts

Use the host's generic MCP config form. The shape is identical: `type: http`, `url`, and an `x-api-key` header.

> Self-hosting? Replace `aitoearn.ai` with your own address (e.g. `localhost:8080`).

---

## ④ Docker one-command deploy

Prerequisite: Docker installed. For teams that want AiToEarn on their own server. Three commands, no manual database setup:

```bash
git clone https://github.com/yikart/AiToEarn.git
cd AiToEarn
docker compose up -d
```

Open `http://localhost:8080` once the stack is up.

### Configure Relay (strongly recommended)

Publishing requires signing into social platforms (Douyin, Rednote, TikTok, etc.), and their OAuth flows need developer credentials. Configuring Relay lets you borrow the official `aitoearn.ai` (or `aitoearn.cn`) credentials so you don't have to register a developer account on every platform.

In the `aitoearn-server` service block in `docker-compose.yml`, add:

```yaml
RELAY_SERVER_URL: https://aitoearn.ai/api
RELAY_API_KEY: your-API-Key
RELAY_CALLBACK_URL: http://127.0.0.1:8080/api/plat/relay-callback
```

Match `RELAY_SERVER_URL` to the environment your `RELAY_API_KEY` was issued from — China key → `https://aitoearn.cn/api`, international key → `https://aitoearn.ai/api`. Mismatches return 401.

Then restart:

```bash
docker compose restart aitoearn-server
```

Production hardening (AI services, OAuth, storage) is covered in upstream `DOCKER_DEPLOYMENT_CN.md`.

---

## ⑤ Build from source

For developers extending the platform. Two paths:

- Run the backend and frontend manually in dev mode.
- Launch the Electron desktop project.

See the upstream contributing guide in [`yikart/AiToEarn`](https://github.com/yikart/AiToEarn) for the exact commands.

---

## Contributing and contact

- Issues: [`yikart/AiToEarn` GitHub Issues](https://github.com/yikart/AiToEarn/issues) (preferred — keeps everything tracked).
- Telegram: [@harryyyy2025](https://t.me/harryyyy2025)
- WeChat: scan the QR code on the upstream site.

### Adjacent projects worth knowing about

- AtomGit hosting
- MuseTalk — talking-head lipsync
- video_spider
- CosyVoice
- facefusion
- NarratoAI
- MoneyPrinterTurbo

---

## Release timeline

| Date | Change |
|---|---|
| 2026-04-20 | OpenClaw gains AiToEarn earning support — accept and run monetisation tasks inside OpenClaw. |
| 2026-03-26 | **v2.1** — content marketplace launches; OpenClaw integration; MCP protocol support, usable from Claude / Cursor / any MCP host. |
| 2026-02-07 | **v1.8.0** — offline merchant promotion (restaurants, retail, B&Bs, salons, gyms) — turn in-store campaigns into executable online distribution tasks. |
| 2025-12-15 | "All In Agent" — super AI Agents for auto generation, auto publishing, and operating AiToEarn itself. **v1.4.3** |
| 2025-11-28 | In-app auto-update; many new AI features in the authoring view (rewrite shorter/longer, image gen, video gen, tag gen) including Nano Banana Pro. **v1.4.0** |
| 2025-11-12 | First open-source, fully usable release. **v1.3.2** |
| 2025-09-16 | First overseas release — adds Facebook, Instagram, Threads, X, YouTube, TikTok, Pinterest. **v1.0.18** |
| 2025-02-26 | First open-source release — one-click publish to Rednote, Douyin, Kuaishou, WeChat Channels. **v0.1.1** |

---

## How this lands in the RHYTHMIX repo

Mapping the four Agents onto the existing pipeline:

- **Create** → already covered locally by HyperFrames + the `rhythmix-author` / `rhythmix-new` skills + Higgsfield / Replicate / Pollinations / ElevenLabs. Keep authoring here; treat AiToEarn's Create Agent as fallback or for batch matrix accounts.
- **Publish** → today the user manually uploads each Cut to TikTok / YouTube / Instagram. AiToEarn's Publish Agent is the natural place to consolidate that, particularly because it already speaks the China-side channels (Douyin, Rednote, Bilibili, WeChat Channels) that the local stack doesn't.
- **Engage** → no equivalent in this repo. AiToEarn's browser-extension automation handles likes, comment replies, brand monitoring, and conversion-signal mining.
- **Monetize** → also no equivalent in this repo. CPS / CPE / CPM settlement is the actual revenue surface for RHYTHMIX content.

If we wire it up, the most likely entry point is **Mode ③** (MCP inside Claude Code), since `.mcp.json` is already the established pattern. Get the API Key from `aitoearn.ai` (RHYTHMIX is targeting the global market — see `CREATIVE-AI-STACK.md`).

---

## Links

- China site: [aitoearn.cn](https://aitoearn.cn)
- International site: [aitoearn.ai](https://aitoearn.ai)
- OpenClaw plugin: `npx -y @aitoearn/openclaw-plugin-cli`
