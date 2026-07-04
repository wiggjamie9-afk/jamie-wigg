---
name: deploy-check
description: Post-deploy smoke test for the live marketing site rhythmixapp.com.au (GitHub Pages serves the repo root on every push to main). Use after merging to main, after editing any root *.html page, or when the user asks "is the site up / did the deploy work". Fetches key pages, checks status + title + obvious breakage, and screenshots the homepage at desktop and mobile widths via Playwright.
metadata:
  tags: rhythmix, deploy, smoke-test, playwright, github-pages
---

## When to use

- After a PR touching root `*.html`, `CNAME`, or `.github/workflows/deploy-pages.yml` merges to `main`
- User asks to verify the live site, or a Pages deploy just ran
- As the tail step of any workflow that promotes a `sites/<slug>/` page to a root `.html`

## Procedure

1. **Confirm the deploy ran** — check the latest `deploy-pages.yml` run on `main` (GitHub MCP `actions_list` / `actions_get`). If it failed, report the failure and stop — no point smoke-testing a stale deploy.
2. **HTTP sweep** — for each key page, `curl -s -o /dev/null -w "%{http_code} %{url_effective}\n"`:
   - `https://rhythmixapp.com.au/` (index)
   - `/studio.html`, `/features.html`, `/downloads.html`, `/members.html`, `/launch.html`
   - `/privacy.html`, `/terms.html`, `/refunds.html`
   - Any page touched by the change that triggered this check.
   Expect 200 on every one. A 404 on a page listed in CLAUDE.md's live-pages list is a hard fail.
3. **Content sanity** — fetch the homepage HTML; verify `<title>` is non-empty, no literal template placeholders (`{{`, `TODO`, `lorem`), and the page references its CSS/assets with paths that exist in the repo.
4. **Visual check (Playwright MCP)** — navigate to the homepage, screenshot at 1440px and 390px widths, and eyeball for broken layout/missing hero. Repeat for any page the triggering change touched.
5. **Link sweep (homepage only)** — extract `href`s from the homepage, HEAD-request same-domain links, report non-200s.

## Reporting

One table: page → status → notes, plus the screenshots. If everything passes, say so plainly. If something fails, lead with the failing page and the likely cause (deleted file, renamed page, CNAME/DNS, workflow failure) — do not push fixes to `main` without confirmation; the repo root IS production.
