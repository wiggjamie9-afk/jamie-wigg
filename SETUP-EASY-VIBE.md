# Setting up Easy-Vibe for this workspace

[Easy-Vibe](https://github.com/datawhalechina/easy-vibe) is **not a tool** — it's an open-source **learning curriculum** from [Datawhale](https://datawhalechina.io) that teaches "vibe coding" (AI-assisted programming) from beginner to advanced. It's distributed as a Next.js-style documentation website plus the underlying course content. CC BY-NC-SA 4.0 licensed.

> Honest framing: this doesn't integrate with the RHYTHMIX / Remotion / HyperFrames pipeline in any way. It's reading material with interactive components. **If you just want to read it, use the hosted site** — no install needed. Clone + run locally only if you want to (a) read offline, (b) translate or contribute content back upstream, or (c) hack on the curriculum UI itself.

For the full table of contents and learning paths, see the upstream README: <https://github.com/datawhalechina/easy-vibe>.

(Steps verified against the upstream README as of **2026-05-12**.)

---

## ⚠️ Port collision

Easy-Vibe's dev server defaults to `http://localhost:3000`. So do:

- **Remotion Studio** (this repo's `video/` — `npm run dev`)
- **SuperSplat** (if you also set that up)

Don't run two of them at the same time. Use `PORT=3200 npm run dev` for Easy-Vibe so it sits next to the others (9Router on `:20128`, SuperSplat on `:3100`, Easy-Vibe on `:3200`).

## 1. Prerequisites

- Node.js **18 or later** (this repo's `video/` is fine, you've got it)

## 2. Clone (in a sibling directory, not inside this repo)

```bash
cd ..
git clone https://github.com/datawhalechina/easy-vibe.git
cd easy-vibe
npm install        # ~hundreds of MB of node_modules
PORT=3200 npm run dev
```

Then open <http://localhost:3200>.

> Don't clone into `/home/user/jamie-wigg/` — it would pull a separate `node_modules` into this repo's tree.

## 3. What this is good for

| Use case                                           | Why Easy-Vibe is the right fit                                       |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| Onboarding a non-coder to AI-assisted development  | Stage 1 is explicitly "if you can speak, you can code"               |
| Reference material for Claude Code / MCP / Skills  | Stage 3 has a dedicated section that aligns with how this repo works |
| Translation / community contribution                | Multiple languages are tracked; you can add or improve translations  |
| Idea/MVP validation frameworks                      | Stage 1 appendix covers Jobs to Be Done, Mom Test, Double Diamond    |

For *learning by reading*, the hosted version is the same content with no install — use that unless you need a local checkout.

## 4. What this does *not* affect

- Anything in this repo. Easy-Vibe is purely external reference material.
- `.mcp.json`, `.claude/settings.json`, Remotion / HyperFrames pipelines, RHYTHMIX skills — all untouched.

## 5. Notes

- The content is **CC BY-NC-SA 4.0** — non-commercial, share-alike. Don't lift sections into commercial RHYTHMIX marketing without attribution and license compliance.
- The repo's primary language is Mandarin Chinese with English / 简体中文 / 繁體中文 / 日本語 / Español / Français / 한국어 / العربية / Tiếng Việt / Deutsch translations available. English coverage is good but not 100% — Stage 2 and 3 were noted as "fully available in English" in the 2026-03-25 update.
