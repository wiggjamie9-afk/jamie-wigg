# Ruixen UI — Setup & Reference

## Overview

[Ruixen UI](https://ruixen.com) is a **shadcn-compatible component catalog** —
240+ copy-in React components, 59 marketing sections, app-UI blocks, and 31 4K
gradients. You install a component with the shadcn CLI and it lands in your
project as plain JSX with dependencies resolved — yours to edit and ship. MIT;
free catalog is usable in any project, plus a paid Pro tier.

**Site**: https://ruixen.com · **Repo**: https://github.com/ruixenui/ruixen.com
· License: MIT.

> ### How this fits the RHYTHMIX repo
> **Good fit** for the React/Next surfaces here — `studio/` (Next 15 · React 19 ·
> Tailwind v4) and `agent-builder/` (same stack) both match Ruixen's target
> exactly, and it reads **shadcn theme tokens** (`bg-card`, `border-border`,
> `text-foreground`), so it composes with a shadcn setup. Pairs with the
> `frontend-design` and `ui-design-system` skills.
>
> **Not** for the static marketing site (root `*.html`) or HyperFrames Cuts —
> those are hand-written HTML/CSS + GSAP, not React/shadcn.
>
> **Brand caveat:** components ship styled to shadcn defaults. To match RHYTHMIX,
> map the theme tokens to `rhythmix-teaser-60s/DESIGN.md` (canvas `#08050d`,
> magenta `#ff1f5a`, cyan `#00d8ff`, green `#00e887`; Space Grotesk / JetBrains
> Mono) by setting the CSS variables once — then the whole catalog re-skins.

## Install a component

Run from the target project (e.g. `studio/` or `agent-builder/`). Pick the line
matching that project's Tailwind version and primitive layer:

```bash
# Tailwind v4 + Radix  (default)
npx shadcn@latest add "https://ruixen.com/r/<component>"

# Tailwind v3 + Radix
npx shadcn@latest add "https://ruixen.com/r/tw3/<component>"

# Tailwind v4 + Base UI
npx shadcn@latest add "https://ruixen.com/r/baseui/<component>"

# Tailwind v3 + Base UI
npx shadcn@latest add "https://ruixen.com/r/baseui/tw3/<component>"
```

`studio/` and `agent-builder/` are **Tailwind v4 + Radix**, so use the first
form. Example:

```bash
cd studio && npx shadcn@latest add "https://ruixen.com/r/staggered-faq-section"
```

> Requires the project to be a shadcn project (a `components.json` at its root).
> If a target doesn't have one yet, run `npx shadcn@latest init` there first.

## What's in the catalog

- **Sections (59)** — Navbars, Hero, Pricing, FAQs, Featured, Testimonials,
  Clients, Footers.
- **Components (24 categories)** — Buttons, Inputs, Cards, Forms, Accordions,
  Badges, Backgrounds, Text Effects, Loaders, Carousels, Charts, Dialogs,
  Tabs, Steppers, and more.
- **App UI** — Calendars, Date Pickers, Pagination, File Management,
  Notifications, Drawer, Menu, Breadcrumbs.
- **Gradients** — 31 hand-tuned 4K (3840×2160) backgrounds, free for commercial
  use.

## Notable design choices

- **Motion as physics** — interactive primitives use spring configs from
  `motion/react` (the framer-motion successor), not fixed-duration easings.
- **Audio feedback** — a ~3ms Web Audio click on press; opt out per component
  with `sound={false}`.
- **Token-driven** — everything reads shadcn tokens, so one CSS-variable change
  re-skins the set (see brand caveat above).
- **Portable logic** — Radix ↔ Base UI swap only changes the wrapper layer, not
  the component file.

## Tech stack (upstream)

Next.js 15 · React 19 · TypeScript 5 · Tailwind v3 & v4 · Motion · GSAP · Web
Audio · Radix/Base UI · shadcn registry · MDX docs.

## Notes

- Vet each component's added deps before shipping (the CLI pulls them in).
- Pro ($59 once) adds 50+ premium components + 2 templates; not required for the
  free catalog.
- This is a copy-in registry, not a runtime dependency — nothing to add to the
  marketing-site or HyperFrames pipelines.

## License

MIT. Free catalog usable in any project, commercial or otherwise.
