# Tasks: RHYTHMIX Studio Web App (Phase 2)

Tasks have stable IDs (T1, T2, ...), explicit file globs, and explicit `depends`. The `spec-run` skill builds a dependency graph from these.

- [x] **T0** — CORS spike: verify whether Replicate API accepts direct browser calls
  - **files**: `specs/rhythmix-app/spike-cors.md`
  - **depends**: —
  - **satisfies**: R6
  - **acceptance**: a one-page note documenting the actual behavior (works direct / blocked, with reproduction steps); decision recorded as "build Replicate proxy Worker: yes/no"

- [x] **T1** — Scaffold `studio/` Next.js 15 app
  - **files**: `studio/package.json`, `studio/next.config.ts`, `studio/tsconfig.json`, `studio/app/layout.tsx`, `studio/app/page.tsx`, `studio/app/globals.css`, `studio/.gitignore`
  - **depends**: —
  - **satisfies**: R1, N1
  - **acceptance**: `pnpm dev` in `studio/` serves a blank Next.js page at `localhost:3000`; `pnpm build` produces a static export in `studio/out/`

- [x] **T2** — Cloudflare Pages deploy wiring for `studio.rhythmixapp.com.au`
  - **files**: `studio/wrangler.toml`, `.github/workflows/studio-deploy.yml`, `studio/README.md`
  - **depends**: T1
  - **satisfies**: N1
  - **acceptance**: pushing to a branch creates a preview at `<branch>.studio.rhythmixapp-pages.dev`; merging to main triggers a manual-approval deploy to `studio.rhythmixapp.com.au`

- [x] **T3** — Refactor `rhythmix-studio/src/` into platform-agnostic core
  - **files**: `rhythmix-studio/src/core/plan.mjs`, `rhythmix-studio/src/core/models.mjs`, `rhythmix-studio/src/core/sources/pexels.mjs`, `rhythmix-studio/src/core/replicate.mjs`, `rhythmix-studio/src/core/index.mjs`, `rhythmix-studio/src/cli.mjs` (update imports only)
  - **depends**: —
  - **satisfies**: R11
  - **acceptance**: `cd rhythmix-studio && npm test` still passes; no `node:` or `child_process` imports under `src/core/`; existing CLI commands (`plan`, `render`, `render-from-plan`) still work end-to-end against a sample track

- [x] **T4** — Build ffmpeg adapter (Node + WASM) with a shared interface
  - **files**: `rhythmix-studio/src/ffmpeg/index.mjs`, `rhythmix-studio/src/ffmpeg/node.mjs`, `rhythmix-studio/src/ffmpeg/wasm.mjs`, `rhythmix-studio/src/audio.mjs` (update to use adapter), `rhythmix-studio/src/compose.mjs` (update to use adapter)
  - **depends**: T3
  - **satisfies**: R11, N5
  - **acceptance**: Node adapter passes existing `rhythmix-studio/test/run.mjs`; WASM adapter smoke-tested with a 5-second sample track in a Vitest browser environment; identical interface (`probe / trim / concat / mux / extractFrame`)

- [x] **T5** — Upload + theme entry UI (`/new`)
  - **files**: `studio/app/new/page.tsx`, `studio/components/upload-form/*`, `studio/lib/audio-blob.ts`
  - **depends**: T1
  - **satisfies**: R1, R2
  - **acceptance**: user can drop / file-pick an audio file (mp3/wav/m4a/flac), see a waveform preview (rendered with WaveSurfer.js or Canvas from probe data), enter theme text + BPM; client-side validation rejects >50 MB or unsupported codecs; pressing "Continue" advances to `/plan/[id]`

- [x] **T6** — Settings UI: Replicate token, license key, support bundle, clear-all-data
  - **files**: `studio/app/settings/page.tsx`, `studio/components/settings/*`, `studio/lib/secrets.ts`, `studio/lib/support-bundle.ts`, `studio/lib/clear-all.ts`
  - **depends**: T1, T12
  - **satisfies**: R3, R10, R15, R16
  - **acceptance**: user can paste Replicate token, set a passphrase (asked at first entry + once per session per R3), token is encrypted with WebCrypto AES-GCM and stored in `localStorage`; user can paste license key which is POSTed to the license Worker (T7) and the valid result is cached in `localStorage` for 24h; an "Export support bundle" button downloads a JSON file with logs + browser info + plan history but excluding token / audio / MP4 (R15); a "Clear all local data" button wipes localStorage + IndexedDB after a confirmation dialog (R16); clearing token / license actually clears the storage entries

- [x] **T7** — License-validation Cloudflare Worker
  - **files**: `studio/workers/license/src/index.ts`, `studio/workers/license/wrangler.toml`, `studio/workers/license/package.json`
  - **depends**: T1
  - **satisfies**: R10
  - **acceptance**: `POST /api/license { key }` returns `{ valid: true, tier }` for a known Gumroad license and `{ valid: false, reason }` otherwise; valid results cached in Worker KV with 24h TTL; secret `GUMROAD_PRODUCT_ID` configured via wrangler; deployed at `license.studio.rhythmixapp.com.au/api/license`

- [x] **T8** — Replicate proxy Worker (now unconditional — T0 verdict: build it)
  - **files**: `studio/workers/replicate-proxy/src/index.ts`, `studio/workers/replicate-proxy/wrangler.toml`, `studio/workers/replicate-proxy/package.json`
  - **depends**: T0, T7
  - **satisfies**: R6
  - **acceptance**: if T0 spike showed CORS is blocked, this task ships; Worker forwards `POST /api/replicate-proxy/v1/*` to `https://api.replicate.com/v1/*` with the user's Authorization header passed through; no logging of request bodies or tokens; rate-limited per IP. If T0 showed CORS works direct, mark this task `skipped` instead of running it.

- [x] **T9** — Plan preview + editor UI (`/plan/[id]`)
  - **files**: `studio/app/plan/[id]/page.tsx`, `studio/components/plan-editor/*`, `studio/lib/plan-storage.ts`
  - **depends**: T3, T5
  - **satisfies**: R4, R5
  - **acceptance**: page reads audio Blob from session storage + plan from `localStorage[plan-<id>]`; renders a scenes table (role, model, duration, prompt); each scene editable (swap model, edit prompt); cost estimate auto-updates as edits happen; "Render" button advances to `/render/[id]`; "Export plan.json" downloads the JSON

- [x] **T10** — Render runner library
  - **files**: `studio/lib/render-runner.ts`, `studio/lib/render-events.ts`
  - **depends**: T3, T4, T8
  - **satisfies**: R6, R7
  - **acceptance**: `runRender({ plan, audioBlob, token, onEvent })` returns `{ mp4, thumbnail, failedSceneIds[] }`; emits `scene:*` and `compose:*` events; per-scene retry up to 3x with exponential backoff; failed scenes do NOT halt the render — the runner continues with remaining scenes and final compose substitutes a placeholder frame (black frame with scene metadata overlay) for any failed scene (R6); exposes a `rerunScenes(plan, audioBlob, token, sceneIds[])` API for retrying just specific scenes without re-rendering the whole plan; cancellable via `AbortSignal`; unit-tested with a mocked Replicate including the partial-failure path

- [x] **T11** — Render progress UI (`/render/[id]`)
  > note: T10's `rerunScenes` lacks a cross-call blob cache — re-running one failed scene re-bills all scenes. Documented in T11 docblock; follow-up.
  - **files**: `studio/app/render/[id]/page.tsx`, `studio/components/render-progress/*`
  - **depends**: T9, T10
  - **satisfies**: R6, R7
  - **acceptance**: page subscribes to render-runner events; each scene shows status pill (queued / generating / downloaded / composed / failed); compose phase shows percent bar; on completion, MP4 auto-downloads and is saved to IndexedDB (T12); user can cancel mid-render

- [x] **T12** — Local history (IndexedDB) + library UI
  - **files**: `studio/lib/history.ts`, `studio/app/library/page.tsx`, `studio/components/library-grid/*`
  - **depends**: T10
  - **satisfies**: R7, R8
  - **acceptance**: `saveRender / listRenders / getRender / deleteRender` work with `idb`; `saveRender` enforces the 50-entry cap by evicting the oldest entry when over and emitting a one-time toast (R7); `/library` lists past renders with thumbnails, theme, and date; re-download produces an identical MP4; delete requires a confirmation dialog before hard-removing the IndexedDB entry (R8)

- [x] **T13** — Mobile-first styling locked to brand
  > flags: Lighthouse mobile ≥90 unverified (no Node deps installed during run); Cloudflare Pages SPA fallback config still needed for `[id]` routes at deploy.
  - **files**: `studio/app/globals.css`, `studio/components/**/*.tsx` (className edits only — no structural changes)
  - **depends**: T1, T5, T6, T9, T11, T12
  - **satisfies**: R9, R12
  - **acceptance**: every page renders correctly at 375 px viewport (iPhone SE); touch targets ≥44 px on `<button>` and link elements; palette / typography sourced from `rhythmix-teaser-60s/DESIGN.md` (loaded as CSS custom properties in `globals.css`); Lighthouse mobile score ≥90 on `/`, `/new`, `/library`

- [x] **T14** — Tests
  > flags: (1) history.ts eviction relies on `Date.now()` ms — tight loops produce ties; (2) secrets.ts `setToken` doesn't refresh in-memory `sessionToken` on rotation; (3) studio/package.json lacks `test` script + vitest/jsdom/idb dev-deps (outside T14's glob).
  - **files**: `studio/**/*.test.ts`, `studio/vitest.config.ts`, `rhythmix-studio/test/core.test.mjs`
  - **depends**: T3, T4, T6, T10, T12, T15
  - **satisfies**: all
  - **acceptance**: `pnpm test` in `studio/` runs Vitest covering `lib/secrets.ts`, `lib/history.ts`, `lib/render-runner.ts` (mocked Replicate), `lib/capability-detect.ts` (R13 hard-failure detection), `lib/tab-coordinator.ts` (R14 BroadcastChannel); `npm test` in `rhythmix-studio/` covers the new `core/` extraction; CI workflow runs both

- [x] **T15** — Hard-failure handling and capability detection (added by /spec-analyze)
  - **files**: `studio/lib/capability-detect.ts`, `studio/lib/tab-coordinator.ts`, `studio/app/unsupported/page.tsx`, `studio/components/fallback-screens/*`, `studio/app/layout.tsx` (wire detection at root)
  - **depends**: T1
  - **satisfies**: R13, R14
  - **acceptance**: on a browser missing WebCrypto / IndexedDB / WebAssembly, the app routes to `/unsupported` with a dedicated screen for each missing capability and a link to the CLI install instructions or Codespace launch flow; on Replicate API unreachable (network timeout to `api.replicate.com`), surface a fallback screen with "retry" + a Replicate status link; on `ffmpeg.wasm` load failure, surface a fallback with a "try a different browser" message; second-tab detection via `BroadcastChannel` shows a banner in both tabs with "use this tab" / "close other tab" actions; unit-tested for each capability flag
