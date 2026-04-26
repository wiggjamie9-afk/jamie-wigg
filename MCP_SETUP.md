# MCP Setup — connecting Claude Code to images, designs, and memory

This repo ships with a `.mcp.json` that wires four Model Context Protocol (MCP) servers into Claude Code. Once they're set up, Claude Code can:

- 🖼  **Generate real images** (Nano Banana / Gemini)
- 🎨  **Read your Figma designs** and build them into apps
- 🧠  **Remember things across sessions** (memory MCP)
- 📂  **Read/write a shared assets folder** outside this repo

This is the workflow shown in the Instagram posts you shared — except this version is honest about exactly what each step costs and requires.

---

## Prerequisites

You'll do this **once** on your local machine (not in the web Claude Code session — those don't yet support custom MCPs):

| Tool | Why | Install |
|---|---|---|
| **Claude Code (CLI)** | The thing that loads `.mcp.json` | `npm install -g @anthropic-ai/claude-code` |
| **Node.js 20+** | Runs the JS-based MCPs | https://nodejs.org |
| **uv** (Python tool) | Runs the Nano Banana MCP | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |

---

## Step 1 — Get the API keys

| Key | Where to get it | Cost |
|---|---|---|
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey | Free tier: generous; paid pennies per image |
| `FIGMA_API_KEY` | Figma → Settings → Account → Personal access tokens | Free |

Do **not** paste these into `.mcp.json` directly — they'd end up on GitHub. Use environment variables instead.

### Add the keys to your shell profile

Open `~/.zshrc` (Mac) or `~/.bashrc` (Linux) and add:

```sh
export GEMINI_API_KEY="paste-your-gemini-key-here"
export FIGMA_API_KEY="paste-your-figma-token-here"
```

Then reload: `source ~/.zshrc`

---

## Step 2 — Create the shared assets folder

The `filesystem` MCP is configured to read/write `~/Documents/wigg-pictures-assets`. Create it once:

```sh
mkdir -p ~/Documents/wigg-pictures-assets
```

(Or edit the path in `.mcp.json` to wherever you want.)

---

## Step 3 — Run Claude Code in this repo

```sh
cd path/to/jamie-wigg
claude
```

The first time, Claude Code will ask you to **approve** each MCP server. Say yes to the ones you want active.

Verify they loaded:

```
/mcp
```

You should see `nanobanana`, `figma`, `memory`, `filesystem` listed as connected.

---

## Step 4 — Use them

### Generate images
> "Generate a 16:9 cinematic still of an emperor penguin colony at golden hour, in the style of our DESIGN_SYSTEM.md. Save it to the assets folder."

Claude will call the Nano Banana MCP, save the PNG, and tell you the path.

### Build from a Figma design
> "Read my Figma file [paste link]. Build the landing page using our design tokens in tokens.css."

Claude will pull frame data via the Figma MCP and write the React/HTML.

### Persist context between sessions
> "Remember that {{BRAND_NAME}} is Wigg Pictures, our primary color is #C9A14A, and our flagship film is *March of the Penguins*."

Next session, just say "what do you remember about the brand?" — it'll be there.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `nanobanana` won't start | Ensure `uv` is on `PATH` (`uvx --version`). Make sure `GEMINI_API_KEY` is exported in the shell you ran `claude` from. |
| `figma` returns 401 | The personal token expired or was scoped wrong. Generate a new one with **file content read** scope. |
| `/mcp` shows server as "failed" | Run `claude --debug` and check the stderr for the offending server. |
| Web Claude Code ignores `.mcp.json` | Expected — custom MCPs only run on the local CLI today. Use `claude` from your terminal. |

---

## What this does NOT do

Being honest, since the Instagram tutorials gloss over this:

- ❌ **It does not generate video.** No reliable MCP server exists for Sora/Veo/Runway yet. Use those tools directly.
- ❌ **It does not make Claude Code free.** The CLI itself is free; Anthropic charges for token usage on your account. The Nano Banana MCP routes images through *Google's* paid API (via your key, not Anthropic's).
- ❌ **It does not auto-install.** You must run the steps above once. After that it's automatic.

---

## File map

| File | Purpose |
|---|---|
| `.mcp.json` | Project-scoped MCP server config (loaded by Claude Code in this repo) |
| `MCP_SETUP.md` | This guide |
| `DESIGN_SYSTEM.md` | The brand spec — referenced when generating images so they match the brand |
| `tokens.css` / `tokens.json` | Design tokens — given to the Figma MCP workflow |
