# Bedtime Channel — Plugin & Skill Shopping List (GitHub)

Goal: make the channel *flow* with great **AI art, script writing, storytelling,
and art design**. This is the curated, prioritized list.

**Reality check first:** plugins don't make art beautiful — the **model** (Midjourney
/ FLUX Pro Ultra / Higgsfield Soul) and the **art-direction prompt** do. ~80% of the
quality jump is model + prompt craft; ~20% is tooling. So this list is short on
"install everything" and long on "use what you have + add a few sharp tools."

Legend: ✅ already installed · ⬇️ get from GitHub · 🛠️ I can author it locally

---

## Install mechanics (two systems)

- **Skills** → `npx skills add <github-org/repo>` (e.g. `npx skills add heygen-com/hyperframes`),
  or clone into `.agents/skills/<name>/` and symlink into `.claude/skills/`.
- **Plugins / marketplaces** → in Claude Code: `/plugin marketplace add <github-repo>`
  then `/plugin install <name>@<marketplace>`.
- **MCP servers** → add to `.mcp.json` (you already have 7 wired).

---

## PILLAR 1 — Script writing

| Status | Item | Source | Adds |
|---|---|---|---|
| ✅ | Claude (Anthropic API) | in `pipeline.py` | Core script engine — **just keep credit topped up** so the real path runs, not the template fallback |
| ✅ | StepFun Flash MCP | `.mcp.json` → `stepfun` | `flash_episode_brief` → act structure; `flash_script` → narration drafts |
| ✅ | `brainstorming`, `behuman` | obra/superpowers (already synced) | Idea generation, natural human-voice prose |
| 🛠️ | **`bedtime-script` skill** | local (I author) | Locks your format: 6 scenes, calm cadence, age-1–5 vocabulary, repetition/refrain, no scary beats, no slug-echo bug |
| ⬇️ | obra/**superpowers** (full) | `github.com/obra/superpowers` | Broader writing/thinking skills if you want more than what's synced |

## PILLAR 2 — Storytelling craft

| Status | Item | Source | Adds |
|---|---|---|---|
| ✅ | `storyboard-writer`, `video-scripter`, `book-writer` agents | FleetView (built-in) | Frame-by-frame thinking, narrative arcs |
| 🛠️ | **`storytelling-craft` skill** | local (I author) | Bedtime story structure: gentle arc, sensory imagery, soothing wind-down ending, "sweet dreams" close — encoded so every episode lands the same emotional beat |
| ⬇️ | `anthropics/skills` → `brand-guidelines` | ✅ have it | Keep tone/voice consistent across episodes |

## PILLAR 3 — AI art (the visuals)

| Status | Item | Source | Adds |
|---|---|---|---|
| ✅ | Higgsfield Soul + DOP | `.mcp.json` → `higgsfield` | Best character-consistent watercolour; image→video motion |
| ✅ | Replicate (FLUX 1.1 Pro / Kontext / Dev) | `creative-stack` MCP | Photoreal + character-ref editing (locks Sonny's face) |
| ✅ | `replicate` skill | already synced | Picks the right model per asset |
| ✅ | PicsArt MCP | deferred this session | `enhance`, `remove_bg`, upscaling for thumbnails |
| ⬇️ | **ElevenLabs MCP** (official) | `github.com/elevenlabs/elevenlabs-mcp` | First-party voice control (you currently call the REST API directly — official MCP gives cleaner voice selection/SFX) |
| ⬇️ | **Midjourney** (no MCP — web) | midjourney.com | Highest art ceiling; generate refs there, feed into Kontext for consistency |
| 🛠️ | **`watercolour-artdirection` skill** | local (I author) | The single biggest art-quality lever: a reusable prompt block (paper texture, pigment bleed, palette, lighting, "no 3D/vector/glossy") applied to every scene |

## PILLAR 4 — Art design & layout (books, thumbnails, branding)

| Status | Item | Source | Adds |
|---|---|---|---|
| ✅ | `canvas-design`, `algorithmic-art`, `theme-factory`, `ui-design-system` | `anthropics/skills` (synced) | Design systems, generative backgrounds |
| ✅ | `thumbnail-designer` agent + `render-thumbnails.mjs` | built-in / repo | Click-optimized thumbnails |
| ✅ | PDF picture-book generator | `pipeline.py` → `ebook.pdf` | Already builds a book per episode |
| ✅ | Canva MCP + Gamma MCP | deferred this session | Branded templates, channel art, promo decks |
| ✅ | `pdf`, `docx`, `pptx` skills | `anthropics/skills` (synced) | Polished export formats for the books |
| ⬇️ | **Figma MCP** | `github.com/figma` (official) | If you want hand-tuned thumbnail/banner templates with a real design system |

---

## The actual recommendation (do this, skip the rest)

**You don't need a big GitHub haul.** Ranked by impact-per-effort:

1. 🛠️ **Let me author 3 local skills** — this is the real quality unlock and needs
   no external installs:
   - `watercolour-artdirection` — consistent, beautiful scene art every time
   - `bedtime-script` — fixes the slug-echo bug + locks calm cadence
   - `storytelling-craft` — same soothing emotional arc every episode
2. ⬇️ **ElevenLabs MCP** (`elevenlabs/elevenlabs-mcp`) — cleaner narration control
   than the raw REST calls in `pipeline.py`.
3. ⬇️ **obra/superpowers** (full) — only if you want deeper writing/ideation skills
   beyond the few already synced.
4. ⬇️ **Figma MCP** — only if you want designer-grade thumbnail/banner templates.
5. 💳 **Not a plugin, but #1 priority:** keep `ANTHROPIC_API_KEY` +
   `ELEVENLABS_API_KEY` funded and **refresh the YouTube tokens** — otherwise the
   pipeline silently drops to weak template scripts and can't upload.

> Skip: any further security/forensics skills (you have hundreds already — none
> help a bedtime channel). More plugins ≠ better art. Model + art direction wins.

---

## One-paragraph TL;DR
You already own the expensive creative tooling. From GitHub, add at most **ElevenLabs
MCP**, optionally **obra/superpowers** and **Figma MCP**. The biggest, cheapest
quality jump is **three custom local skills** (watercolour art-direction, bedtime
script, storytelling craft) that I can write into your repo today — plus keeping the
API keys funded so the real Claude script path (not the template) runs.
