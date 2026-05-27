---
name: slides-skill-author
description: Author a custom deck-builder Skill (SKILL.md file) tailored to the user's deck style — paste-ready for claude.ai's Skills feature (Customize → Skills → Create skill → Write skill instructions) or installable locally as .agents/skills/deck-builder/SKILL.md. Use when the user wants Claude to consistently build presentation decks in their voice, says "make me a deck-builder skill", "set up Claude to make my slides", "I want a skill for presentations", or references the claude.ai Skills feature for slides. NOT for actually generating a single deck — for that, use the pptx skill or just author one inline.
---

# slides-skill-author

Generates a custom **deck-builder SKILL.md** tailored to the user's deck style.
The output is paste-ready for two surfaces:

- **claude.ai Skills** — Customize → Skills → Create skill → Write skill instructions → paste.
- **Local Claude Code** — write to `.agents/skills/deck-builder/SKILL.md` and
  symlink into `.claude/skills/deck-builder` so this repo's Claude sessions
  pick it up automatically.

This skill *authors* a skill. It doesn't generate decks itself.

## Workflow

1. **Interview** — ask the user the four questions below. Don't proceed until
   all four are answered (or the user explicitly says "use defaults"). If they
   want to skip an answer, use the suggested default.
2. **Generate** — fill in the deck-builder SKILL.md template with their answers.
3. **Confirm target** — ask whether to write the file locally (offer
   `.agents/skills/deck-builder/SKILL.md` + symlink) or just print the body so
   they can paste it into claude.ai.
4. **Write or print** — execute step 3's choice.

## Interview questions

Use the `AskUserQuestion` tool. Bundle them into one call.

1. **Deck type** — what kinds of presentations do you build?
   Examples: "educational workshops about marketing automation," "sales pitch
   decks for my SaaS product," "internal training decks for onboarding,"
   "conference talks about design systems."
   _Default if skipped: "general-purpose business decks."_

2. **Audience** — who watches these?
   Examples: "non-technical founders," "enterprise sales teams," "college
   students learning UX," "C-suite executives."
   _Default: "mixed business audience."_

3. **Voice / tone** — how do you want to sound?
   Examples: "casual and direct, like texting a smart friend," "polished but
   not corporate," "academic but accessible," "funny and irreverent."
   If the user has a brand voice doc, ask them to paste the key rules instead.
   _Default: "clear and direct, no corporate jargon."_

4. **Trigger phrases** — words / phrases that should activate the skill.
   Examples: "make a deck", "pitch deck", "slides", "talk", "workshop",
   "presentation", "keynote", "lightning talk".
   _Default: ["deck", "slides", "presentation", "pitch", "keynote"]._

## Output template

Fill `{DECK_TYPE}`, `{AUDIENCE}`, `{VOICE}`, and `{TRIGGER_LIST}` with the
answers. Keep the YAML frontmatter exactly as shown.

```markdown
---
name: deck-builder
description: Build presentation decks in my voice. Fires for {TRIGGER_LIST}, or anything slide-related. Do not fire for documents, memos, emails, or long-form prose.
---

# deck-builder

I build {DECK_TYPE} for {AUDIENCE}. My voice is {VOICE}.

## When you build me a deck

1. **Confirm intent** before writing slides:
   - What's the single takeaway?
   - How many slides max?
   - Any required slides (cover, agenda, CTA, contact)?
   - Delivery surface — keynote, PDF, claude artifact, pptx?
2. **Outline first.** One line per slide. Get my sign-off on the outline
   before writing slide bodies.
3. **Write slides.** Per slide:
   - One headline (≤8 words).
   - At most 5 bullets OR one visual concept — never both crammed.
   - Speaker notes underneath, written the way I'd actually say it out loud.
4. **Match the voice.** {VOICE}. No filler ("In this slide, we will discuss…").
   No corporate hedging. Be specific — numbers, names, dates.

## When you should *not* fire

- The user wants a memo, doc, email, or any long-form text.
- The user wants code or technical implementation.
- The user wants a single image or graphic.

## Defaults

- Slide count: 8–12 unless told otherwise.
- Aspect: 16:9.
- One headline per slide, sentence case.
- No more than 5 bullets per slide.
- Speaker notes: 2–4 sentences, conversational.

## Output format

If a delivery surface isn't specified, write slides as markdown:

```
# Slide 1 — <headline>

- bullet
- bullet

> Speaker notes: ...
```
```

## Writing the file locally

If the user picks "local install":

```bash
mkdir -p .agents/skills/deck-builder
# write SKILL.md to .agents/skills/deck-builder/SKILL.md
ln -s ../../.agents/skills/deck-builder .claude/skills/deck-builder
```

The repo's convention is that source-of-truth lives in `.agents/skills/<name>/`
with a symlink in `.claude/skills/<name>`. Don't write to `.claude/skills/`
directly.

## Notes

- The screenshot that inspired this skill (Chris KE Facebook, "How To Make
  Slides With Claude?") shows a 7-step walkthrough of claude.ai's Skill
  builder. This skill collapses steps 1–5 (which are UI navigation on
  claude.ai) into a single Claude Code interaction that produces the file you'd
  paste in step 6.
- If the user also wants Claude to actually *render* a pptx after generating
  slides, hand off to the `pptx` skill once the markdown is ready.
