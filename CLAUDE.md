# jamie-wigg

Landing-page fragments for **RHYTHMIX**, an AI music-creator platform. Content is HTML + inline `<style>` blocks (no build system, no framework).

## Files

- `text.txt` — full landing page (CSS + sections: features, testimonials, pricing, marquee, stats).
- `text 2.txt` — near-duplicate of `text.txt`. Verify with `diff` before assuming they're identical.
- `text 3.txt` — section-only HTML (features grid, testimonials).

The `.txt` extensions are misleading — these are HTML. Treat them as such when editing.

## Design system

Full brand system — colors, typography, components, voice, breakpoints — lives in `DESIGN.md`. Read it before generating new sections, copy, or styles. Don't invent new tokens; reuse what's there.

## Copy prompts

Reusable sales-copy prompts (headlines, value prop, problem section, positioning) live in `prompts/sales-copy.md`. Pre-loaded with RHYTHMIX context.

## Working style

- Skip preambles. No "great question" or "here's what I'll do." Start with the answer.
- Match existing class naming (`feat-card`, `testi-card`, `price-card`, `pf-item.inc`) when adding markup.
- Don't introduce a build step, framework, or external dependency without asking — this is hand-written HTML/CSS.
