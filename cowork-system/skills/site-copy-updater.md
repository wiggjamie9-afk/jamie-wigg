---
name: site-copy-updater
description: Regenerate a named section of an existing rhythmixapp.com.au HTML page from a brief, preserving structure and styles.
triggers:
  - "Update the [section] on [page]"
  - "Rewrite the hero on rhythmix.html"
  - "Change pricing copy on launch.html"
  - "Refresh the testimonials on index.html"
---

# Site Copy Updater

Edits an existing HTML page in the repo root (the static `rhythmixapp.com.au` site). Regenerates one named section at a time. Always shows a diff and waits for approval before committing.

## Inputs

- **page** (required) — one of `index.html`, `rhythmix.html`, `launch.html`, `features.html`, `founder.html`, `studio.html`, `download.html`, `downloads.html`, `thank-you.html`. (Skip `privacy.html`, `refunds.html`, `terms.html` — legal copy.)
- **section** (required) — `nav`, `hero`, `stats`, `features`, `steps`, `pricing`, `lifetime-card`, `testimonials`, `faq`, `email-capture`, `final-cta`, `footer`. Or a CSS selector if the section isn't named.
- **brief** (required) — what the new copy needs to say + any specific lines, numbers, names to keep.

## Workflow

1. Read all four context files: `/cowork-system/context/brand-voice.md`, `audience-profile.md`, `platform-rules.md`, `content-themes.md`.
2. Also read `/cowork-system/context/brand-style.md` and `/rhythmix-teaser-60s/DESIGN.md` for visual identity (palette, typography).
3. Read the target page in full. Locate the named section by its `id` or its leading comment / class (e.g. `<section class="section" id="features">`).
4. Read 1–2 sibling sections to confirm the established CSS variables (`--red`, `--purple`, `--card`, `--border`, `--fs`, `--fm`, etc.) and reuse them — never invent new variables.
5. Draft the new section copy. Hard rules:
   - Keep the **outer wrapper** (the `<section>` tag with its `id` and `class`) byte-identical.
   - Keep the **CSS class names** the existing styles depend on. Don't rename classes.
   - Keep the **layout grid** unless the brief explicitly asks to redesign it (use Site Copy Updater for copy, Content Section Publisher for new layouts).
   - Apply every voice rule from `/cowork-system/context/brand-voice.md`. Pass both voice tests (Stat Test, Setup Test).
   - Preserve any inline `style=` colour tags that depend on the brand palette unless the brief changes them.
   - Numbers and named creators: only change them if the brief explicitly provides replacements.
6. Print a unified diff in chat (the section block before vs after). Do NOT write the file yet.
7. Wait for explicit approval. Iterate if asked.
8. On approval: write the change, run `git diff [page]` to confirm scope is bounded to the requested section, then commit with message `Update [section] on [page] — [one-line summary]`.
9. **Do not push** unless the operator says push. The branch is `claude/setup-cowork-system-RtFdS` (or whatever Cowork is currently on); pushing deploys via GitHub Pages once merged to the default branch.

## Output

- Diff printed in chat.
- On approval: commit on the current branch.
- File path: edits the target HTML in repo root.
- A short note saved to `/cowork-system/published/site-edits/[YYYY-MM-DD]-[page]-[section].md` recording the brief, the diff summary, and the commit SHA.

## Stop conditions

- Stop and ask if the section's outer wrapper would change.
- Stop and ask if a CSS class would be renamed or removed.
- Stop and ask if pricing, testimonials, or any quantitative claim would change without an explicit replacement value in the brief — never invent stats.
- Refuse to edit `privacy.html`, `refunds.html`, `terms.html` — those need legal review.
- Refuse to push to remote without explicit `push to origin` instruction.
