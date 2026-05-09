---
description: Deploy the RHYTHMIX site (site/) live. Default path is GitHub Pages via Actions — no token needed. Falls back to other hosts if configured.
argument-hint: [host: gh-pages | cloudflare | vercel] (optional, defaults to gh-pages)
---

The user wants to deploy the Astro site in `site/` to a public URL. Default to **GitHub Pages via Actions** — it requires no API token, only a one-time toggle in repo settings.

## Argument routing

Parse `$ARGUMENTS`:
- Empty, `gh-pages`, `github`, `pages` → GitHub Pages flow (below)
- `cloudflare`, `cf`, `pages` (CF Pages) → Cloudflare Pages flow (requires `CLOUDFLARE_API_TOKEN` env var)
- `vercel` → Vercel flow (requires `VERCEL_TOKEN`)
- Anything else → ask the user which host

## GitHub Pages flow (default)

**Step 1 — Check prerequisites.**
- Confirm we're on the `claude/new-session-VQuXK` branch (or whatever the active dev branch is — check `git branch --show-current`).
- Run `cd site && npm run build` to verify the site builds clean. If it errors, fix before continuing.

**Step 2 — Configure Astro for the GitHub Pages URL.**
- The Pages URL will be `https://<owner>.github.io/jamie-wigg/`. Detect `<owner>` from `git remote get-url origin`.
- Edit `site/astro.config.mjs` to add `site: 'https://<owner>.github.io'` and `base: '/jamie-wigg'`.
- Audit internal `<a href="/...">` links across `site/src/` and convert to `<a href={`${import.meta.env.BASE_URL}...`}>` so they respect the base path. Files most likely to need it: `Nav.astro`, `Footer.astro`, all `pages/*.astro` that link to siblings, `compare.astro` and the `/vs-*` pages.
- If a custom domain is configured (look for `site/public/CNAME`), set `base: '/'` instead and skip the link rewrite.

**Step 3 — Add the deploy workflow** at `.github/workflows/deploy-site.yml`:

```yaml
name: Deploy Astro site to Pages
on:
  push:
    branches: [claude/new-session-VQuXK, main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: site } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: site/package-lock.json }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: site/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Step 4 — Verify the build still passes** with `cd site && npm run build`.

**Step 5 — Commit and push** with a clear message (`chore: wire GitHub Pages deploy via Actions`). Push to the current branch.

**Step 6 — Report back** with:
- The deploy workflow URL: `https://github.com/<owner>/jamie-wigg/actions`
- The Pages URL once enabled: `https://<owner>.github.io/jamie-wigg/`
- The **one manual step** the user must take: GitHub repo → Settings → Pages → Source = "GitHub Actions". After that, every push to the dev branch auto-deploys.
- Offer to wire a custom domain (e.g. `rhythmixapp.com.au`) as a follow-up.

## Cloudflare Pages flow

Only run if `CLOUDFLARE_API_TOKEN` is set. Verify with `npx wrangler whoami`.
- `cd site && npm run build`
- `CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN npx wrangler pages deploy ./dist --project-name=rhythmix --commit-dirty=true`
- Report the `*.pages.dev` URL.

If the token is missing, tell the user to create one at https://dash.cloudflare.com/profile/api-tokens with the "Edit Cloudflare Workers" template, then re-run with `/deploy cloudflare` after exporting it.

## Vercel flow

Only run if `VERCEL_TOKEN` is set.
- `cd site && npx vercel --prod --token=$VERCEL_TOKEN --yes`
- Report the `*.vercel.app` URL.

## Safety

- **Never** force-push or delete branches.
- **Never** commit secrets.
- If the build fails, stop and surface the error — don't deploy a broken bundle.
- Confirm with the user before pointing a custom domain at the deployment.
