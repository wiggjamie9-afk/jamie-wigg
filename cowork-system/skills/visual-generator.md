---
name: visual-generator
description: Generate branded visuals via Blotato — template-based (Option A) or custom Nano Banana (Option B).
triggers:
  - "Generate a visual for this post"
  - "Make a carousel for this idea"
  - "Custom visual for this brief"
  - "Build me a Nano Banana carousel"
---

# Visual Generator

This skill has two modes. Pick at the start of a run.

- **Mode A — template-based.** Faster, polished out of the box, looks like Blotato templates.
- **Mode B — custom Nano Banana.** Slower, looks unmistakably yours, requires `/context/brand-style.md`.

If the operator hasn't specified, ask.

## Prerequisites

- Blotato MCP connected to Cowork.
- For Mode A: at least one Blotato template ID. Run `Use Blotato to list available visual templates and save the IDs to /context/blotato-templates.md` once.
- For Mode B: `/context/brand-style.md` exists with a "brand block" (one paragraph under 400 chars).

---

## Mode A — Template-based

### Workflow

1. Read `/context/brand-voice.md` and `/context/brand-style.md` (if present) for tone.
2. Read the post draft the operator is working with.
3. Recommend 2–3 Blotato templates that fit the content type, with one line on why each. Wait for the operator to pick.
4. Common matches (defer to `/context/blotato-templates.md` for actual IDs):
   - **How-to / step-by-step** → whiteboard infographic
   - **Bold stat / contrarian take** → billboard
   - **Educational with character** → classroom
   - **Tool launch / news** → TV news broadcast
   - **Quote / pull-line** → quote card
   - **Multi-slide tip list** → tutorial carousel
5. Once picked, call Blotato to generate. Poll status until done.
6. Return the image URL and ask if the operator wants to use it or regenerate.

### Output

Print the URL in chat. Save a reference to `/assets/[topic-slug]-[YYYY-MM-DD].md` with template ID + URL.

---

## Mode B — Custom Nano Banana carousel

### Workflow

1. Read `/context/brand-style.md`. Pull out the **brand block** (the under-400-char paragraph at the bottom).
2. Read the post draft or carousel brief. Extract:
   - Slide count (default 7 if unspecified)
   - Slide-by-slide structure (cover, body slides, CTA close)
   - Headlines, subheads, key copy per slide
3. **Confirm the structure with the operator before writing prompts.** Do not guess slide content.
4. For each slide, write a Nano Banana prompt with three parts:
   - The brand block from `brand-style.md` (identical on every slide)
   - The slide-specific block: layout, copy, repeating components
   - A closing element (handle, watermark) from `brand-style.md`
5. Save all slide prompts to `/drafts/carousel-briefs/[slug]-nano-banana-prompts-[YYYY-MM-DD].md`.

### Hard rules for prompt writing

- Every prompt under **900 characters**. Count and trim if needed (Blotato cuts off at 1000; 900 leaves a buffer).
- **Never use `/` as a separator inside subheads.** Rewrite as: `First line reads: X. Second line reads: Y.` (Nano Banana parses `A / B` as repeat-A.)
- **Headlines must be the largest text** on every slide. State this explicitly in the prompt.
- If a slide uses a repeating component (terminal mockup, quote frame, stat slab), describe it explicitly using the spec from `brand-style.md`.

### Generation workflow

6. **Cover dry-test first.** Generate slide 1 alone. Use `blotato_create_visual` with:
   - `templateId: 53cfec04-2500-41cf-8cc1-ba670d2c341a` (slideshow template)
   - `model: nano-banana-pro`
   - `aspectRatio: 4:5` (or whatever brand-style.md specifies)
   - `slidePrompts: [slide 1 prompt only]`
7. Poll `blotato_get_visual_status` until done. Return cover URL. Wait for approval. Iterate until it's right.
8. Once cover approved, generate slides 2..N in a single Blotato call with the full `slidePrompts` array.
9. Poll status. Render is ~30s per slide. Re-poll every 60s while in `generating-script` or `generating-media`.
10. When done, return all image URLs in carousel order.
11. If a single slide has a clear text-render error, regenerate **that slide alone** via single-slide call. Don't rerun the whole batch.

### Output

- Slide URLs printed in chat in order.
- Prompts file saved to `/drafts/carousel-briefs/`.
- Ask: use the set, regenerate a specific slide, or tweak the brand block.
