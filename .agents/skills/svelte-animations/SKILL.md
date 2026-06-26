---
name: svelte-animations
description: Reusable Svelte 5 animation components (SikandarJODD/animations) installed via the shadcn-svelte CLI — Svelte ports of Aceternity UI, Magic UI, and Luxe UI, built on motion-sv + Tailwind. Use when building a Svelte 5 microsite/landing and you want drop-in animated components (Text Animate, Pixel Image, Dither Shader, Ripple Button, etc.). NOTE: requires a Svelte project — the studio/ app is React/Next and the marketing site is plain HTML, so this needs a new Svelte target before it applies.
---

# Svelte Animations (SikandarJODD/animations)

A library of copy-in Svelte 5 animation components, distributed as a **shadcn-svelte
registry**. Components are Svelte ports of popular React libraries (Aceternity UI, Magic UI,
Luxe UI), built on the **motion-sv** library and **Tailwind CSS**. TypeScript-first, with
light/dark mode included.

- Docs + live registry: https://sv-animations.vercel.app
- Source: https://github.com/SikandarJODD/animations
- Feedback: author on Twitter (see repo)

## ⚠️ Prerequisite: a Svelte project

These are **Svelte 5** components — they do **not** drop into `studio/` (Next.js/React) or the
root marketing HTML. You need a SvelteKit/Svelte 5 + Tailwind project first. If/when you spin
up a Svelte microsite (e.g. a `sites/<slug>` variant or a standalone app), scaffold it and add
Tailwind, then use the CLI below. Until then this skill is reference-only.

```bash
# scaffold (when you actually want a Svelte target)
npx sv create my-svelte-site      # choose SvelteKit + TypeScript + Tailwind
cd my-svelte-site && npm install
```

## Installing components

Components install via the **shadcn-svelte CLI**, pointing at the registry component URL shown
on each component's docs page. General form:

```bash
npx shadcn-svelte@latest add <component-registry-url-from-sv-animations.vercel.app>
```

Always copy the exact `add` URL from the component's page on the docs site — do not guess the
path. The CLI writes the component source into your project (typically `src/lib/components/...`)
so you own and can edit it. `motion-sv` and any peer deps are pulled in as needed.

## Sections / catalog

| Section | What it is |
|---|---|
| Svelte Aceternity UI | Svelte ports of Aceternity UI effects |
| Svelte Magic UI | Svelte ports of Magic UI components |
| Svelte Luxe UI | Svelte ports of Luxe UI components |
| Framer Learning / More Examples | Learning-focused motion examples |

### Recently added components (per release notes)
- **Aceternity UI:** Placeholders and Vanish Input
- **Magic UI:** Colorful Text, Scratch To Reveal, Ripple Button, Interactive Hover Button
- **Headliners:** Dither Shader, Pixel Image, Text Animate

## Templates (from the repo)

- Open source: **Minimalist Developer Portfolio**, **Startup Template**
- Premium: **Startup Template** (discount code in the repo readme)

## How this fits RHYTHMIX

Your production UI work currently lives in React (`studio/`) and hand-written HTML (root site +
`sites/`), so prefer the existing `frontend-design` / taste-skill stack there. Reach for this
skill only when a deliverable is explicitly a **Svelte** site and you want pre-built animated
components instead of authoring motion from scratch. The component *ideas* (vanish input, text
animate, ripple/hover buttons) are also useful design references even when you implement in
React/GSAP.

## Stack

Svelte 5 · motion-sv · Tailwind CSS · shadcn-svelte registry · TypeScript · light/dark.
Credits: Magic UI, Aceternity UI, Luxe UI, Indie UI, Hover.dev.
