# Remotion: Create Videos Programmatically in React

Framework for making real MP4/WebM videos with React components — every frame is rendered from JSX, so you get web tech (CSS, Canvas, SVG, WebGL), programming (variables, functions, APIs, math, algorithms), and React (reusable components, composition, Fast Refresh, the npm ecosystem) in your video pipeline.

Site: https://remotion.dev · Docs: remotion.dev/docs · API: remotion.dev/api

## ⚠️ Already In This Repo — Read ADR-0001 First

**Remotion is not new here.** This ecosystem already contains:
- `video/` — a Remotion 4 + React 19 + Tailwind v4 project, kept as a starter but **dormant** (`MyComposition` returns `null`; no Promo uses it).
- `docs/adr/0001-hyperframes-over-remotion-for-promos.md` — the decision to author Promos as **HyperFrames** HTML/GSAP compositions, not Remotion.
- Skills: `.claude/skills/remotion` and `.claude/skills/remotion-to-hyperframes`.

**Per ADR-0001, do not assume Remotion is the path forward for new Promos.** New RHYTHMIX promos go in `rhythmix-<name>-<length>/` as HyperFrames compositions. This doc is a reference for the tool itself; it does **not** reverse that decision.

## Why React for Video

| Pillar | What you get |
|---|---|
| Web technologies | All of CSS, Canvas, SVG, WebGL |
| Programming | Variables, functions, APIs, math, algorithms → parametric/data-driven effects |
| React | Reusable components, composition, Fast Refresh, npm package ecosystem |

Notable uses: Fireship's "This video was made with code"; **GitHub Unwrapped** (personalized year-in-review — a strong example of data-driven, per-user video at scale).

## Get Started

```bash
# Requires Node.js
npx create-video@latest
```
Then see remotion.dev/docs (installation page) for full setup. The existing `video/` folder already has this scaffolding.

```bash
# Run the existing (dormant) project — from video/
cd video && npm i && npm run dev   # Remotion Studio preview
```

## ⚖️ License — Important

Remotion has a **special (non-standard) license** and **requires a paid company license in some cases** (e.g. for-profit companies above a team-size threshold). This is a material consideration: read remotion.dev/license before any commercial/production use. HyperFrames (the chosen Promo path) does not carry this licensing constraint — another point in ADR-0001's favour for marketing output.

## When Remotion *Would* Make Sense Here

ADR-0001 benched Remotion for **short marketing promos** (where HTML+CSS+GSAP iterates faster and GSAP timelines map cleanly to a 60s narrative). Remotion's React-per-frame model still shines for cases HyperFrames handles less naturally:

- **Data-driven / personalized video at scale** — e.g. a "RHYTHMIX Wrapped" per-user year-in-review (à la GitHub Unwrapped), generating thousands of variants from data.
- **Programmatic batch rendering** — parametric video where React props drive each render via a render farm / Lambda.
- **Complex component reuse** — when a video shares logic/components with the React app (Studio) codebase.

For these, the `remotion-to-hyperframes` skill exists to port Remotion work into the HyperFrames pipeline if/when a Remotion experiment needs to land as a standard Promo.

## Relationship to the RHYTHMIX Video Stack

| Pipeline | Role |
|---|---|
| **HyperFrames** | Default for Promos (ADR-0001) — HTML/CSS/GSAP |
| **Remotion** (`video/`, dormant) | React-per-frame; reserved for data-driven/personalized/batch video experiments |
| **SkyReels V1/V2/V3** | Generative cinematic footage / avatars |
| **KimiK2Manim** | Math/technical explainer animation |
| **Nucleus/Mary** | Orchestration + carousel + scoring |

## References

- **Site / docs**: https://remotion.dev · remotion.dev/docs · remotion.dev/api
- **License (read before commercial use)**: remotion.dev/license
- **In-repo**: `video/`, `docs/adr/0001-hyperframes-over-remotion-for-promos.md`, skills `remotion` + `remotion-to-hyperframes`
- **Showcase**: remotion.dev/showcase

---

**Use Case for Ecosystem:** Reference doc for an already-present tool. Remotion (React-per-frame video) lives dormant in `video/`; ADR-0001 deliberately chose HyperFrames for Promos and this doc does NOT reverse that. Catalogued for completeness and to record (a) its special/paid license — a real constraint for commercial output — and (b) the legitimate niche where Remotion still wins: data-driven/personalized/batch video (e.g. a "RHYTHMIX Wrapped"). Use the `remotion-to-hyperframes` skill to port any Remotion experiment into the standard pipeline.
