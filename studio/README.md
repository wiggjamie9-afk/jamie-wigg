# RHYTHMIX Studio (Web App)

Phase 2 of RHYTHMIX Studio: a mobile-first web wrapper around the
`rhythmix-studio/` Node CLI. Lifetime buyers paste their Replicate token,
upload a track, pick a theme, and get a generated AI music video back —
no installs, no server-side audio storage, generations billed to the user's
own Replicate account.

The full spec lives in [`../specs/rhythmix-app/`](../specs/rhythmix-app/)
(requirements, design, tasks).

## Stack

- Next.js 15 (App Router) — static export via `output: "export"` in
  `next.config.ts`. Build output lands in `studio/out/`.
- React 19, TypeScript 5.9, Tailwind v4.
- Deployed to Cloudflare Pages as project `rhythmix-studio`, served at
  `studio.rhythmixapp.com.au` (production) and `<branch>.rhythmix-studio.pages.dev`
  (per-branch previews).
- Two sibling Cloudflare Workers under `studio/workers/` handle license
  validation and (optionally) Replicate CORS proxying — those each have
  their own `wrangler.toml` and are deployed independently.

## Local development

```sh
cd studio
pnpm install
pnpm dev          # next dev — http://localhost:3000
pnpm build        # static export → studio/out/
pnpm lint         # next lint + tsc --noEmit
```

Node 20 + pnpm 9 are the supported toolchain (matches CI).

## Deployment

Deploys are driven by `.github/workflows/studio-deploy.yml`. There is no
manual `wrangler pages deploy` step from a developer's laptop in the
normal flow.

| Trigger | Result |
|---|---|
| Push to any non-`main` branch (touching `studio/**`) | Auto preview at `https://<branch>.rhythmix-studio.pages.dev` |
| Push to `main` (touching `studio/**`) | Build runs immediately; deploy waits for a manual approval on the `production` GitHub Environment, then publishes to `studio.rhythmixapp.com.au` |
| `workflow_dispatch` from the Actions tab | Same as above, behaves per the branch it's run on |

### One-time GitHub setup

The workflow needs:

1. **Repository secrets** (Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN` — a token with the **Cloudflare Pages: Edit**
     permission scoped to the account that owns the `rhythmix-studio`
     Pages project. Create at
     <https://dash.cloudflare.com/profile/api-tokens>.
   - `CLOUDFLARE_ACCOUNT_ID` — the account ID containing the project.
     Visible in the right-hand sidebar of any zone overview in the
     Cloudflare dashboard.
2. **Environment** (Settings → Environments → New environment):
   - Name it exactly `production`.
   - Under **Deployment protection rules**, enable **Required reviewers**
     and add at least one reviewer (the human who clicks "Approve" on
     production deploys).
   - Optional: restrict the environment to the `main` branch under
     **Deployment branches**.

Without the environment in place the `deploy-production` job will fail
because the gate it references doesn't exist.

### One-time Cloudflare setup

The Pages project itself is created out-of-band (the workflow only
deploys to it, it does not create it). Steps:

1. In the Cloudflare dashboard, **Workers & Pages → Create → Pages →
   Direct Upload**. Name the project `rhythmix-studio` (must match
   `--project-name` in the workflow).
2. Don't connect it to GitHub — the Actions workflow uploads directly
   via wrangler.
3. Once the first preview deploy has succeeded, attach the custom
   domain: **rhythmix-studio → Custom domains → Set up a custom
   domain → `studio.rhythmixapp.com.au`**.

### Custom-domain DNS

The apex `rhythmixapp.com.au` is currently served by GitHub Pages (see
`CNAME` at the repo root) — that does not change. The subdomain
`studio.rhythmixapp.com.au` needs a fresh DNS record pointing at
Cloudflare Pages:

- **If `rhythmixapp.com.au` is on Cloudflare DNS already:** when you
  attach the custom domain in the Pages dashboard, Cloudflare adds the
  `CNAME studio → rhythmix-studio.pages.dev` record automatically and
  provisions the TLS cert. Nothing else to do.
- **If `rhythmixapp.com.au` is on another registrar / DNS host
  (e.g. the registrar managing the apex CNAME to GitHub Pages):** add a
  `CNAME` record manually:
  - **Name:** `studio`
  - **Target:** `rhythmix-studio.pages.dev`
  - **TTL:** auto / 300
  Then in the Pages dashboard click "Verify" against the custom domain
  — TLS provisioning takes a couple of minutes.

Until that CNAME resolves, the production deploy still succeeds, but the
custom-domain URL will 404. The fallback URL
`https://rhythmix-studio.pages.dev` works immediately.

## What this app is NOT

- Not a hosted music generator. Replicate fees are on the user's account
  (BYO token, R3 in the spec).
- Not a content host. No audio, plan, or rendered MP4 is uploaded to our
  infra — everything lives in the browser (`localStorage` + IndexedDB).
- Not the engine. The actual scene-planning + Replicate-runner logic
  lives in `rhythmix-studio/src/core/` and is consumed by both the Node
  CLI and this web app (R11).
