# jamie-wigg

Landing-page fragments for **RHYTHMIX**, an AI music-creator platform. Content is HTML + inline `<style>` blocks (no build system, no framework).

## Files

- `landing.html` — main landing-page chunk: `<style>` block, nav, hero, marquee, stats section, plus the pricing/lifetime/FAQ/email/footer styles.
- `sections.html` — features grid and testimonials sections (HTML only, no styles — it relies on `landing.html` for CSS variables and class definitions).

Both are **fragments**, not standalone pages. They reference CSS variables (`--red`, `--card`, `--fs`, etc.) and animations (`orbit`, `pulse`, `reveal`) that aren't defined inside these files — the `:root { ... }` block and keyframes live somewhere else (not yet in this repo). To preview, the fragments need to be wrapped in a real `<!DOCTYPE html>` document with the missing token definitions.

## Design system

Full brand system — colors, typography, components, voice, breakpoints — lives in `DESIGN.md`. Read it before generating new sections, copy, or styles. Don't invent new tokens; reuse what's there.

## Prompt library

Two slash commands wrap the prompt files:

- `/brand <name>` — strategic Purple Cow prompts. Names: `symbol`, `slogan`, `surprise`, `salient`, `story`. Run with no argument to list. Source: `prompts/brand-positioning.md`.
- `/copy <name>` — tactical landing-page prompts. Names: `headlines`, `value-prop`, `problem`, `for-you-if`, `positioning`, `not-for-you-if`. Run with no argument to list. Source: `prompts/sales-copy.md`.

Both pre-loaded with RHYTHMIX context (audience, metrics, voice).

## Working style

- Skip preambles. No "great question" or "here's what I'll do." Start with the answer.
- Match existing class naming (`feat-card`, `testi-card`, `price-card`, `pf-item.inc`) when adding markup.
- Don't introduce a build step, framework, or external dependency without asking — this is hand-written HTML/CSS.
