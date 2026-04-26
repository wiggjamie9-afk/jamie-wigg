# banana-claude (project-scoped install)

This is the [banana-claude](https://github.com/AgriciDaniel/banana-claude) skill (v1.4.1, MIT) installed at the project level so it travels with this repo.

The skill turns Claude into a "Creative Director" that orchestrates Google's Gemini Nano Banana image-generation models.

## What was installed here

| Path | What it is |
|---|---|
| `.claude/skills/banana/SKILL.md` | Skill manifest — Claude reads this to know when to invoke |
| `.claude/skills/banana/references/` | Required prompt-engineering / model docs the skill loads on every call |
| `.claude/skills/banana/scripts/` | Python scripts: generate, edit, batch, cost tracking, MCP setup |
| `.claude/agents/brief-constructor.md` | Companion subagent that builds optimized prompts |

## What you still need to do

The skill won't generate images until two things are set up on **your machine** (not this sandbox):

### 1. Get a free Gemini API key

- Go to https://aistudio.google.com/apikey
- Create a key
- Set it in your shell:
  ```
  export GEMINI_API_KEY='your-key-here'
  ```
  Add to `~/.zshrc` or `~/.bashrc` to persist.

### 2. Set up the MCP server (recommended)

The skill calls Gemini through the `@ycse/nanobanana-mcp` MCP server. To install:

```
git clone --depth=1 https://github.com/AgriciDaniel/banana-claude.git /tmp/banana-claude
cd /tmp/banana-claude
./install.sh --with-mcp $GEMINI_API_KEY
```

This registers the MCP server in your Claude Code config so the skill can call it.

### 3. (Optional) Python fallback

If you don't want MCP, the skill includes Python scripts under `.claude/skills/banana/scripts/` that hit the Gemini API directly. Install dependencies:
```
pip install google-generativeai pillow
```

## How to use (once set up)

Inside Claude Code:
- `/banana setup` — sanity-check the install
- `/banana generate <description>` — text → image
- `/banana edit <path> <instruction>` — edit existing image
- `/banana chat` — multi-turn creative session
- `/banana inspire` — browse the 2,500+ prompt library

Or just say "generate an image of …" and the skill should pick up the trigger.

## Cost notes

- Gemini's image-gen API has a free tier and paid tier. Check current pricing at https://ai.google.dev/pricing.
- The skill includes `cost_tracker.py` to log per-image cost.
- Batch generation (`/banana batch`) can spend money fast — confirm before running.

## Alternative: marketplace install

If you'd rather install it user-wide (not project-scoped), use the official method **inside a Claude Code session** (you type these slash commands; I can't run them):

```
/plugin marketplace add AgriciDaniel/banana-claude
/plugin install banana-claude@banana-claude-marketplace
```
