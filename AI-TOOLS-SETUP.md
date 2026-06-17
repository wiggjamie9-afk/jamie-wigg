# AI Tools — Install Everything

Every tool you pasted now has a ready-to-run installer in this repo. **They all
install on *your Mac* — run each command in your Mac's Terminal** after pulling/
downloading this repo. (They can't be installed from the cloud session; they're
local desktop/CLI tools.)

| # | Tool | What it is | Install (run on your Mac) |
|---|------|------------|----------------------------|
| 1 | **OpenMontage** | Agent-operated video studio (HyperFrames + Remotion) | `bash scripts/setup-openmontage.sh` |
| 2 | **OmniRoute** | Local LLM router, 226 providers, auto-fallback (MIT) | `bash scripts/setup-omniroute.sh` |
| 3 | **9Router** | Local LLM router, 3-tier fallback (MIT; OmniRoute is its fork) | `bash scripts/setup-9router.sh` |
| 4 | **Free Claude Code** | Local proxy: Claude Code/Codex on many providers (MIT) | `bash scripts/setup-free-claude-code.sh` |
| 5 | **AntiGravity AutoAccept** | Antigravity IDE extension, auto-approves agent steps | `bash scripts/setup-antigravity-autoaccept.sh` (guides VSIX install) |

## Read this first — two honest flags

- **#2, #3, #4 overlap.** OmniRoute, 9Router, and Free Claude Code all do the same
  job (route your coding-CLI traffic to free/cheap model providers) and all bind to
  localhost. **Run only one.** OmniRoute is the most capable.
- **#5 auto-approves terminal commands.** That removes the safety check that stops a
  destructive command. If you run it, load its **Safety Presets** immediately
  (Dashboard → 📊 → "Load Recommended Safety Presets").

## The localhost catch (why these don't help your iPhone)

Tools #2–#4 answer only on `localhost` — the machine running them. Your **iPhone and
your live web apps cannot reach `localhost`** on your Mac. To use a router from your
phone you'd deploy it to a public HTTPS URL (Docker / Fly.io / VPS — see each tool's
deploy guide). For an ecosystem that already works on your phone today, use the
**Ultimate Claude hub**: `apps/ultimate-claude.html` → live at
`rhythmixapp.com.au/apps/ultimate-claude.html`.

## What each tool is good for

- **OpenMontage** → make finished videos (RHYTHMIX promos, explainers) from plain
  language. Works with zero API keys. Most aligned with this repo. See `SETUP-OPENMONTAGE.md`.
- **OmniRoute / 9Router / Free Claude Code** → cut your AI coding costs by routing
  Claude Code / Codex / Cursor to free or cheap models. Terminal/desktop use.
- **AntiGravity AutoAccept** → hands-free agent runs inside Google's Antigravity IDE.

Per-tool details live in each `scripts/setup-*.sh` header and in `SETUP-OPENMONTAGE.md`.
