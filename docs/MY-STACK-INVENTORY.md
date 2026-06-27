# My Claude Stack — Inventory & Capability Map

_Snapshot of what's installed in this workspace and whether it covers the five goals:
**sell products · build products · phone apps · web apps · YouTube products.**_

Last built: 2026-06-27 (from the live `.claude/skills/` + `.mcp.json`).

## Totals

| Thing | Count |
|---|---|
| Active skills (`.claude/skills/`) | **2,558** |
| Source skills (`.agents/skills/`) | 825 |
| Bundled library (`.agents/awesome-skills/`) | 1,599 |
| MCP servers (`.mcp.json`) | 7 active (`stepfun`, `creative-stack`, `higgsfield`, `pollinations`, `playwright`, `claude-playwright`, `context7`) + more session-connected (github, Stripe, Figma, Notion, Slack, Zapier, Canva, Gamma, Lovable, …) |
| In-repo projects | `studio/` (Next.js app), 21× `apps/`, 5× `sites/`, `livestock/`, `recovery/`, 2 Capacitor iOS wrappers, `vendor/` |

## Verdict by goal

| Goal | Coverage | Real blocker (not a skill gap) |
|---|---|---|
| 1. Sell / automate | 🟢 Strong | Connected accounts + keys (Stripe, Shopify, ad platforms) |
| 2. Build products | 🟢 Strong | — (runtime/hosting only) |
| 3. Phone apps | 🟡 Good | iOS needs a Mac + Xcode (use Codemagic CI; can't build in sandbox) |
| 4. Web apps | 🟢 Strong | — (this is a native strength) |
| 5. YouTube / video | 🟢 Very strong | API credits (Replicate / ElevenLabs) |

**Short answer: yes — you have more than enough skills to do all five.** What's missing is never the *knowledge* (skills) — it's **connected accounts/API keys**, a **Mac+Xcode for native iOS**, and a **persistent runtime** (this cloud sandbox is ephemeral and egress-limited; real builds run on your machine or CI).

---

## 1. Sell products / automation 🟢

Storefront: `shopify-development`, `shopify-apps`, `shopify-automation`, `apify-ecommerce`, `product-lister`, `review-responder`, `inventory-tracker`, `pricing-optimizer`.
Funnels/CRO: `page-cro`, `popup-cro`, `signup-flow-cro`, `form-cro`, `paywall-upgrade-cro`, `onboarding-cro`, `landing-page-generator`, `growth-engine`.
Outreach/CRM: `cold-email`, `email-sequence`, `sdr-outbound`, `sales-automator`, `hubspot-automation`, `revops`, `klaviyo-automation`, `referral-program`.
Payments: `stripe-integration` / `paypal-integration` (+ **Stripe MCP**, **Zapier MCP** for 9,000-app automation).
Ads/SEO: `paid-ads`, the `seo-*` family (20+), `ai-seo`.

## 2. Build products 🟢

284 dev skills. Backend (`backend-architect`, `fastapi-pro`, `nodejs-backend-patterns`, `rust`, `go`), DB (`postgresql`, `database-architect`, `schema-designer`, `prisma-expert`), API (`api-design-principles`, `api-endpoint-builder`, `graphql`), SaaS (`saas-scaffolder`, `saas-multi-tenant`, `saas-mvp-launcher`).
Process: the spec pipeline (`/spec-quick` → `/spec-analyze` → `/spec-run`), `/tdd`, `architect-review`, `code-reviewer`. Live example: `studio/` (Next.js 15 + Cloudflare Workers).

## 3. Phone apps 🟡

iOS: `ios-developer`, `swift`, `swiftui-expert-skill`, `swiftui-liquid-glass`, `swiftui-ui-patterns`, `apple-hig-expert`.
Android: `android-dev`, `kotlin`, `android-jetpack-compose-expert`.
Cross-platform: `react-native-architecture`, `react-native-skills`, the `expo-*` chain (UI → dev-client → CI/CD → deployment), `flutter-expert`.
Ship: `app-store-optimization`, `app-store-changelog`. You already have **2 Capacitor iOS wrappers** + **Codemagic CI** (`codemagic.yaml`).
⚠️ Native iOS **must build on macOS/Xcode** — not in this sandbox. Use Codemagic or your Mac.

## 4. Web apps 🟢

Frameworks: `nextjs-best-practices`, `react-best-practices`, `sveltekit`, `astro`, `vue`/`angular`, `tailwind-design-system`, `shadcn`.
Quality UI (anti-AI-slop): `frontend-design`, `design-taste-frontend` (taste-skill v2), `refero-design`, `high-end-visual-design`, `minimalist-ui`.
Deploy: `vercel-deployment`, `cloudflare-workers-expert`, `deploy-to-vercel`.
Pipelines: `/site-build` (sitemap→wireframe→styleguide→design), `saas-scaffolder`. Plus a real `apps/svelte-animations/` scaffold + 21 `apps/` + 5 `sites/`.

## 5. YouTube / video products 🟢 (your core strength)

Pipeline: the **HyperFrames** suite (`hyperframes`, `-cli`, `-registry`, `rhythmix-author`) + **Remotion** (`remotion`, `-best-practices`, `-to-hyperframes`) + `website-to-hyperframes`.
YouTube ops: `youtube-automation`, `youtube-full`, `youtube-seo-optimizer`, `youtube-summarizer`, `youtube-notetaker`, `ingest-youtube`, `thumbnail-designer`.
Short-form: `tiktok-automation`, `short-form-video`, `instagram-reels-creator`, `youtube-shorts-creator`.
Assets via MCP: image/video/music/voice through **creative-stack** (Replicate+ElevenLabs), **higgsfield**, **pollinations**, plus TTS (Kokoro, Voicebox) and `wan2.2-video`.
Orchestration: `/dream`, `/album-launch`, `/rhythmix-new`.

---

## The real gaps (do these to actually ship)

1. **Connect accounts / keys** — Replicate + ElevenLabs (`.claude/settings.local.json`), Stripe, Shopify, ad platforms, Higgsfield (`.env`). Skills are ready; they need credentials.
2. **A Mac + Xcode** (or Codemagic) for native iOS builds — unavoidable for App Store.
3. **A persistent runtime** — this cloud sandbox is ephemeral and egress-limited. Run real builds/automation on your own machine, a VPS, or CI (GitHub Actions / Codemagic / Cloudflare).
4. **Pick depth over breadth** — 2,558 skills is huge; for any given job, invoke the 2–3 that fit rather than letting the catalog sprawl.
