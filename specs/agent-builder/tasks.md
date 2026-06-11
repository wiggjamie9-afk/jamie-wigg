# Tasks: AI Agent Builder Platform

## Execution guide
Run `/spec-run agent-builder` to execute all tasks in dependency-sorted waves. Each task runs in an isolated `Agent` context with full file access to the globs listed.

---

## Setup & Infrastructure

- [x] **T1** — Initialize Next.js 15 app with TypeScript, Tailwind v4, React 19
  - **files**: `agent-builder/`, `agent-builder/package.json`, `agent-builder/tsconfig.json`, `agent-builder/tailwind.config.ts`, `agent-builder/next.config.ts`
  - **depends**: —
  - **satisfies**: N1
  - **acceptance**: `npm run dev` starts on localhost:3000; TypeScript compiler passes; Tailwind builds

- [x] **T2** — Set up authentication & user schema (Supabase or similar)
  - **files**: `agent-builder/lib/auth.ts`, `agent-builder/lib/db.ts`, `agent-builder/migrations/001_users.sql`
  - **depends**: T1
  - **satisfies**: R9
  - **acceptance**: User signup/login works; users can be queried from DB; protected routes redirect unauthenticated users

- [x] **T3** — Create project management schema (agents, configs, analytics)
  - **files**: `agent-builder/migrations/002_projects.sql`, `agent-builder/migrations/003_analytics.sql`, `agent-builder/lib/schema.ts`
  - **depends**: T2
  - **satisfies**: R9, R10, N4
  - **acceptance**: Projects table has id, user_id, config, tier; analytics table logs events; queries execute in <100ms

---

## Agent Templates & Prompts

- [x] **T4** — Create 6 agent type templates with prompts
  - **files**: `agent-builder/templates/{code-review,document-processing,research,security-audit,data-analysis,customer-support}.json`, `agent-builder/lib/agent-templates.ts`
  - **depends**: —
  - **satisfies**: R1, R4
  - **acceptance**: All 6 templates exist; each has environment defaults, session config, system prompt, examples, success criteria; templates can be loaded in memory

- [x] **T5** — Build agent configuration validator & serializer
  - **files**: `agent-builder/lib/agent-config.ts`, `agent-builder/lib/schemas.ts`
  - **depends**: T4
  - **satisfies**: R2
  - **acceptance**: Valid configs pass validation; invalid configs are rejected with clear errors; configs can be serialized to/from JSON

---

## Web App UI & Pages

- [x] **T6** — Build dashboard page (project list, create new, delete)
  - **files**: `agent-builder/app/dashboard/page.tsx`, `agent-builder/components/ProjectList.tsx`, `agent-builder/components/CreateProjectButton.tsx`
  - **depends**: T2, T4
  - **satisfies**: R9
  - **acceptance**: Dashboard displays user's agents; "Create New" button works; agents can be deleted; page is mobile-responsive

- [x] **T7** — Build 5-step agent builder workflow
  - **files**: `agent-builder/app/builder/page.tsx`, `agent-builder/components/BuilderSteps.tsx`, `agent-builder/components/StepOne*.tsx` (Create through Fine-tune)
  - **depends**: T4, T5, T6
  - **satisfies**: R3
  - **acceptance**: All 5 steps render; user can proceed through workflow; form data persists across steps; preview of agent config updates in real-time

- [x] **T8** — Build agent type selector UI
  - **files**: `agent-builder/components/AgentTypeSelector.tsx`, `agent-builder/components/TypeCard.tsx`
  - **depends**: T4
  - **satisfies**: R1, R2
  - **acceptance**: 6 agent type cards display; each card shows name, description, use case; clicking a card pre-fills the builder with that template

- [x] **T9** — Build settings & account page (auth, billing, API keys)
  - **files**: `agent-builder/app/settings/page.tsx`, `agent-builder/components/BillingCard.tsx`, `agent-builder/components/APIKeysCard.tsx`
  - **depends**: T2
  - **satisfies**: R9
  - **acceptance**: Users can view tier, see billing info, generate/revoke API keys; page is mobile-responsive

- [x] **T10** — Build copy-paste prompts display & export
  - **files**: `agent-builder/app/builder/prompts/page.tsx`, `agent-builder/components/PromptViewer.tsx`, `agent-builder/lib/prompt-export.ts`
  - **depends**: T4
  - **satisfies**: R4
  - **acceptance**: Prompts display with syntax highlighting; copy-to-clipboard button works; export-to-file works (markdown, text)

---

## Landing Page

- [x] **T11** — Create landing page (home section, hero, agent showcase, CTA)
  - **files**: `sites/agent-builder/index.html`, `sites/agent-builder/styles.css`
  - **depends**: —
  - **satisfies**: R6, N2
  - **acceptance**: Loads in <3s on 3G; hero section explains core concepts; 6 agent types displayed with icons/descriptions; sign-up CTA visible

- [x] **T12** — Create pricing page (3 tiers, comparison table, FAQs)
  - **files**: `sites/agent-builder/pricing.html`, `sites/agent-builder/pricing-styles.css`
  - **depends**: —
  - **satisfies**: R5, R6
  - **acceptance**: All 3 tiers ($500, $1500, $500) displayed with feature comparison; CTA buttons link to sign-up; mobile layout stacks tiers

- [x] **T13** — Create agent showcase page (all 6 types with use cases & prompts)
  - **files**: `sites/agent-builder/agents.html`, `sites/agent-builder/agents-styles.css`
  - **depends**: T4
  - **satisfies**: R1, R6
  - **acceptance**: Each agent type has its own card; description, use cases, sample prompts visible; code examples display with syntax highlighting

- [x] **T14** — Create API documentation page (endpoints, auth, examples)
  - **files**: `sites/agent-builder/docs.html`, `sites/agent-builder/docs-styles.css`, `launch-kit/agent-builder/api-spec.md`
  - **depends**: T5
  - **satisfies**: R8
  - **acceptance**: All API endpoints documented (GET /agents, POST /agents, GET /agents/:id, DELETE /agents/:id, GET /analytics); auth explained; curl/JS examples provided

---

## Promo Video

- [x] **T15** — Create 60s HyperFrames promo composition (script, narration, visuals)
  - **files**: `rhythmix-agent-builder-60s/index.html`, `rhythmix-agent-builder-60s/script.txt`, `rhythmix-agent-builder-60s/hyperframes.json`, `rhythmix-agent-builder-60s/gsap.min.js`
  - **depends**: —
  - **satisfies**: R7, N3
  - **acceptance**: HTML composition renders; script is narrative of 5-step workflow; hyperframes.json is valid; composition can be previewed in browser

- [x] **T16** — Generate narration for promo video (TTS via Kokoro)
  - **files**: `rhythmix-agent-builder-60s/narration.wav`, `rhythmix-agent-builder-60s/script.txt`
  - **depends**: T15
  - **satisfies**: R7
  - **acceptance**: narration.wav exists; audio is ~60s long; speech is clear and professional; matches script from T15

- [x] **T17** — Render promo video to MP4 (HyperFrames → ffmpeg)
  - **files**: `rhythmix-agent-builder-60s/renders/rhythmix-agent-builder-60s.mp4`
  - **depends**: T15, T16
  - **satisfies**: R7, N3
  - **acceptance**: MP4 renders successfully; duration ~60s; resolution 1920×1080; file <50MB; no glitches in animation

---

## Marketing & Launch Assets

- [x] **T18** — Create copy-paste social media posts & email sequences
  - **files**: `launch-kit/agent-builder/social-posts.md`, `launch-kit/agent-builder/email-sequences.md`
  - **depends**: T11, T12
  - **satisfies**: R6
  - **acceptance**: 10+ social posts (LinkedIn, Twitter, etc.); 3 email sequences (awareness, consideration, conversion); all copy is brand-aligned

- [x] **T19** — Create blog outlines & comparison sheets
  - **files**: `launch-kit/agent-builder/blog-outlines.md`, `launch-kit/agent-builder/pricing-comparison.md`
  - **depends**: T12
  - **satisfies**: R6
  - **acceptance**: 3 blog post outlines; 2 comparison sheets (vs. competitors, vs. building manually); outlines include headlines, structure, CTAs

- [x] **T20** — Create deployment & quickstart guides
  - **files**: `launch-kit/agent-builder/deployment-guide.md`, `launch-kit/agent-builder/quickstart.md`
  - **depends**: T14
  - **satisfies**: R8
  - **acceptance**: Guides cover local setup, cloud deployment (AWS/Vercel), environment variables, API calls; quickstart is <10min to first agent

---

## Testing & Launch Readiness

- [x] **T21** — Write unit tests for agent config validation
  - **files**: `agent-builder/__tests__/agent-config.test.ts`, `agent-builder/__tests__/schemas.test.ts`
  - **depends**: T5
  - **satisfies**: R2
  - **acceptance**: Tests cover valid configs, invalid configs, edge cases; test suite passes

- [x] **T22** — Write integration tests for dashboard & builder workflow
  - **files**: `agent-builder/__tests__/integration/dashboard.test.ts`, `agent-builder/__tests__/integration/builder.test.ts`
  - **depends**: T6, T7
  - **satisfies**: R3, R9
  - **acceptance**: Tests cover user login, project creation, builder workflow end-to-end; all tests pass

- [x] **T23** — Lighthouse audit & mobile responsiveness check
  - **files**: `agent-builder/lighthouse-report.md`, `agent-builder/accessibility-report.md`
  - **depends**: T6, T7, T9, T11, T12, T13
  - **satisfies**: N2, N5
  - **acceptance**: Lighthouse score >85 on all pages; mobile layout verified on iPhone SE, iPad, desktop; no accessibility warnings

- [x] **T24** — Build & deploy to Cloudflare Pages (app + landing page)
  - **files**: `agent-builder/wrangler.toml`, `.github/workflows/deploy-agent-builder.yml`
  - **depends**: T1, T6, T7, T9, T11, T12, T13, T14
  - **satisfies**: All
  - **acceptance**: App deploys to agent-builder.starlightmix.com; landing page lives at /agent-builder/; both are live and functional; DNS resolves correctly

---

## All tasks depend on (implicit)

All tasks are ready to run as soon as `spec-run` is invoked. No implicit global dependencies beyond what's listed above.

**Total task count**: 24 tasks
**Estimated execution time**: 8-12 hours (parallel waves)
**Team size**: 1-2 engineers (or run via parallel agents)
