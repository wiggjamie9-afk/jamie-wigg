---
name: campaign-landing-page
description: Generate a complete standalone landing page for a specific campaign or funnel, using the existing RHYTHMIX visual language and ManyChat capture loop.
triggers:
  - "Generate a landing page for [campaign]"
  - "Build a /[slug].html landing page targeting [audience]"
  - "Create a campaign page for [keyword]"
---

# Campaign Landing Page Generator

Builds a fresh standalone HTML page (e.g. `/launch-suno-comparison.html`, `/sync-creators.html`, `/founding-presale.html`) targeting one campaign / one funnel / one ManyChat keyword. Uses `text.txt`, `text 2.txt`, `text 3.txt`, and `launch-section.html` as section templates.

## Inputs (required unless noted optional)

- **campaign_name** — short label, e.g. `Suno Comparison`, `Sync Creators`, `Founding Presale`.
- **slug** — URL slug for the file, e.g. `suno-comparison` → `/suno-comparison.html`. ASCII, hyphenated, no extension.
- **audience_segment** — which slice from `/cowork-system/context/audience-profile.md` this page targets. (e.g. `producers earning < $500/mo`, `sync-curious creators`.)
- **headline** — the page H1 (1 line, must pass Stat Test).
- **subhead** — 1–2 line subhead under the H1.
- **primary_cta** — what they do (e.g. `Comment SUNO on my Instagram for the side-by-side`, `Join the waitlist`, `Buy lifetime $149`).
- **manychat_keyword** — the IG comment trigger that maps to this campaign.
- **sections** — ordered list, choose from: `hero`, `stats`, `comparison`, `features`, `case-studies`, `pricing`, `lifetime-card`, `testimonials`, `faq`, `email-capture`, `final-cta`, `footer`. Default sequence: `hero → stats → comparison → case-studies → pricing → faq → final-cta → footer`.
- **og_image** (optional) — path to OG image; default `/thumbnails/rhythmix-thumbnail-16-9.png`.

## Workflow

1. Read all four context files + `/cowork-system/context/brand-style.md` + `/rhythmix-teaser-60s/DESIGN.md`.
2. Read `text.txt`, `text 2.txt`, `text 3.txt`, `launch-section.html`, `index.html` head/nav/footer to harvest:
   - Established CSS variables (`--red`, `--purple`, `--cyan`, `--green`, `--gold`, `--card`, `--border`, `--text`, `--soft`, `--muted`, `--fs`, `--fm`, `--fb`).
   - Nav block (with active-link state).
   - Footer block (matching the rest of the site).
   - Existing section markup for any section the operator chose.
3. Confirm the spec with the operator before writing:
   - Sections in order
   - Headline + subhead
   - Primary CTA + ManyChat keyword
   - Any specific case studies / numbers / comparisons to include
   Do not invent creators or numbers. Ask if missing.
4. Compose the page:
   - `<!doctype html>` with full head: title `RHYTHMIX — [campaign_name]`, meta description (under 160 chars, must pass Stat Test), canonical URL `https://rhythmixapp.com.au/[slug].html`, OG + Twitter card meta, favicon link.
   - Inline `<style>` block: pull only the variables and classes the chosen sections need. Do not duplicate styles from other pages — keep the page lean.
   - Body: nav (matching site) → sections in order → footer.
   - All CTAs route to either `https://instagram.com/p/[POST]?comment=[KEYWORD]` style copy or to a real form ID — confirm with operator if a real form is wired.
5. Validate before writing:
   - All `id`s referenced by anchor links exist in the page.
   - All CSS classes used are defined in the inline `<style>` block.
   - No `Math.random()` / `Date.now()` / network fetches in any inline `<script>`.
   - File size under 200KB.
6. Print a 5-line summary in chat: title, sections, CTA, ManyChat keyword, estimated word count.
7. Wait for approval.
8. On approval:
   - Write the file to `/[slug].html` in repo root (matching the existing site convention).
   - Append `<url><loc>https://rhythmixapp.com.au/[slug].html</loc><lastmod>[today]</lastmod></url>` to `sitemap.xml` if it's a public-indexed campaign.
   - Commit with message `Add /[slug].html — [campaign_name] landing page`.
9. Save campaign metadata to `/cowork-system/published/campaigns/[slug].md`:

```md
# [campaign_name]
Slug: /[slug].html
Audience: [segment]
Headline: [...]
Primary CTA: [...]
ManyChat keyword: [KEYWORD]
Sections: [list]
Live URL: https://rhythmixapp.com.au/[slug].html
Commit: [SHA]
Published: [YYYY-MM-DD]
```

## Stop conditions

- Stop and ask if `manychat_keyword` collides with an existing keyword in `/cowork-system/published/campaigns/`.
- Stop and ask if the chosen `slug` collides with an existing file in repo root.
- Stop and ask if `case-studies` or `testimonials` were chosen but no creators/numbers are in the brief — refuse to invent them.
- Stop and ask if pricing differs from `index.html` / `rhythmix.html` — keep the price story consistent across the site or it'll undermine the main page.
- Refuse to push to origin without explicit instruction.

## Handover

After commit, the page is live as soon as the branch is merged to the GitHub Pages default branch. Tell the operator that explicitly so they don't expect rhythmixapp.com.au to update from a feature-branch push alone.
