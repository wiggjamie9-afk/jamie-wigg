# Design: RHYTHMIX Studio Web App (Phase 2)

## Approach

Build the web app at `studio/` as a Next.js 15 static export deployed to Cloudflare Pages at `studio.rhythmixapp.com.au` (N1). Refactor `rhythmix-studio/src/` to extract a platform-agnostic engine core that both the existing CLI and the new web app consume (R11). The web app runs ffmpeg in the browser via `@ffmpeg/ffmpeg` for audio probing and final composition (N5); all Replicate calls go direct from the browser using the user's own token (BYO model from R3). Exactly one server-side component exists: a Cloudflare Worker that validates Gumroad license keys (R10, N2). No user audio, plans, or rendered video ever touches our infrastructure — everything stays client-side in Blob / IndexedDB / localStorage.

## Components

### Web app (`studio/`)
- **Responsibility**: All user-facing UI — upload, settings, plan editor, render progress, library.
- **Files**: `studio/app/**`, `studio/components/**`, `studio/lib/**`, `studio/public/**`
- **Stack**: Next.js 15 (App Router, static export), TypeScript, Tailwind v4 (matches `video/`), shadcn/ui for primitive components, `@ffmpeg/ffmpeg` for in-browser ffmpeg, `idb` for IndexedDB.
- **Routes**:
  - `/` — landing (CTA: enter license key or paste Replicate token to start)
  - `/new` — upload audio, enter theme + BPM
  - `/plan/[id]` — plan preview + scene editor
  - `/render/[id]` — render progress + download
  - `/library` — past renders, thumbnails, re-download
  - `/settings` — Replicate token, license key, ffmpeg preferences
- **Satisfies**: R1, R2, R3, R5, R6, R7, R8, R9, R12

### Engine core (`rhythmix-studio/src/core/`)
- **Responsibility**: Platform-agnostic logic — scene planning, model registry, source routing, prompt recipes. No Node-specific imports (no `child_process`, no `fs` from the core; file I/O goes through the ffmpeg adapter).
- **Files**: `rhythmix-studio/src/core/{plan,models,sources/pexels}.mjs` (refactored from existing `rhythmix-studio/src/{plan,models,sources/*}.mjs`)
- **Interface**: `buildPlan({ audioDuration, theme, bpm, aspect, structure }) → Plan`, `pickModel(role, opts) → ModelId`, `priceEstimate(plan) → USD`
- **Satisfies**: R11

### Ffmpeg adapter (`rhythmix-studio/src/ffmpeg/`)
- **Responsibility**: Abstract over Node's `spawn('ffmpeg' / 'ffprobe', ...)` vs browser `@ffmpeg/ffmpeg`. Same interface; runtime picks the right implementation.
- **Files**: `rhythmix-studio/src/ffmpeg/{index,node,wasm}.mjs`
- **Interface**:
  - `probe(file) → { duration, sampleRate, channels, codec }`
  - `trim(input, startSec, endSec, output) → void`
  - `concat(inputs[], output) → void`
  - `mux(videoFile, audioFile, output) → void`
  - `extractFrame(videoFile, timeSec, output) → void` (for thumbnails — R8)
- **Adapter selection**: `index.mjs` exports the Node adapter when `typeof process !== 'undefined'`, browser adapter otherwise. CLI imports `./node.mjs` directly; web app imports `./wasm.mjs` directly. The `index.mjs` smart-selector is for shared code paths.
- **Satisfies**: R11

### Replicate runner (`rhythmix-studio/src/core/replicate.mjs`)
- **Responsibility**: HTTP calls to Replicate's API. Pure `fetch`, no Node-only deps.
- **Files**: `rhythmix-studio/src/core/replicate.mjs` (refactored from existing `rhythmix-studio/src/replicate.mjs`)
- **Interface**: `runPrediction({ model, input, token, onProgress }) → { outputUrl }` with retry/backoff baked in (3 retries on transient errors).
- **CORS handling**: First try direct browser call. If Replicate refuses (CORS preflight fails), fall back to `POST /api/replicate-proxy` on the Cloudflare Worker, which forwards the token transparently. The user's token never persists server-side — Worker is stateless.
- **Satisfies**: R6 (retry), R11 (shared)

### Render runner (`studio/lib/render-runner.ts`)
- **Responsibility**: Orchestrate the full render — for each scene in the plan, kick off a Replicate prediction (up to N concurrent), download each result Blob, then ffmpeg.wasm trim + concat + mux. Emit progress events through an `EventEmitter`-style interface that the React UI subscribes to.
- **Files**: `studio/lib/render-runner.ts`, `studio/lib/render-events.ts`
- **Interface**:
  ```ts
  function runRender(opts: {
    plan: Plan
    audioBlob: Blob
    token: string
    concurrency?: number  // default 2
    onEvent: (event: RenderEvent) => void
  }): Promise<{ mp4: Blob; thumbnail: Blob }>

  type RenderEvent =
    | { type: 'scene:queued'; sceneId: string }
    | { type: 'scene:generating'; sceneId: string }
    | { type: 'scene:downloaded'; sceneId: string; bytes: number }
    | { type: 'scene:failed'; sceneId: string; attempt: number; error: string }
    | { type: 'compose:start' }
    | { type: 'compose:progress'; percent: number }
    | { type: 'compose:done' }
  ```
- **Satisfies**: R6, R7

### License gate Worker (`studio/workers/license/`)
- **Responsibility**: Validate Gumroad license keys; optionally cache valid results in Worker KV for 24h to avoid hitting Gumroad's rate limit. Stateless beyond that cache.
- **Files**: `studio/workers/license/src/index.ts`, `studio/workers/license/wrangler.toml`
- **Interface**:
  - `POST /api/license { key: string } → { valid: true, tier: "lifetime" | "monthly" } | { valid: false, reason: string }`
- **Auth**: Validates against `https://api.gumroad.com/v2/licenses/verify` using a Gumroad product ID stored in Worker secret `GUMROAD_PRODUCT_ID`.
- **Satisfies**: R10, N2

### Replicate proxy Worker (`studio/workers/replicate-proxy/`)
- **Responsibility**: Optional thin pass-through for Replicate calls if browser CORS blocks direct access. Forwards the request body + the user's token verbatim; never persists.
- **Files**: `studio/workers/replicate-proxy/src/index.ts`, `studio/workers/replicate-proxy/wrangler.toml`
- **Interface**: `POST /api/replicate-proxy/v1/* → forwarded to https://api.replicate.com/v1/*` with the Authorization header passed through.
- **Status**: Conditional component — built only if direct browser calls turn out to fail CORS (verify in T0).
- **Satisfies**: R6 (CORS fallback)

### Local history (`studio/lib/history.ts`)
- **Responsibility**: Persist render metadata + MP4 Blob + thumbnail Blob in IndexedDB. Provide list / get / delete operations.
- **Files**: `studio/lib/history.ts`
- **Interface**:
  ```ts
  function saveRender(meta: RenderMeta, mp4: Blob, thumbnail: Blob): Promise<string>  // returns id
  function listRenders(): Promise<RenderMeta[]>
  function getRender(id: string): Promise<{ meta: RenderMeta; mp4: Blob; thumbnail: Blob }>
  function deleteRender(id: string): Promise<void>
  ```
- **Satisfies**: R8

### Secrets store (`studio/lib/secrets.ts`)
- **Responsibility**: Hold the Replicate token in localStorage encrypted with WebCrypto AES-GCM keyed off a user passphrase. Passphrase is asked for once per session.
- **Files**: `studio/lib/secrets.ts`
- **Interface**:
  - `setToken(token: string, passphrase: string): Promise<void>`
  - `getToken(passphrase: string): Promise<string | null>`
  - `clearToken(): void`
- **Satisfies**: R3

## Data

No schema changes to any database — there is no database. Everything lives client-side:

| Storage | What's in it |
|---|---|
| `localStorage` | Encrypted Replicate token, license-key + cached valid-tier, user prefs (default aspect, default concurrency) |
| `IndexedDB` (`rhythmix-studio` DB, `renders` store) | Past renders: `{ id, meta, mp4: Blob, thumbnail: Blob, createdAt }` |
| In-memory React state | Current plan, audio Blob, render progress events |
| Worker KV (`LICENSE_CACHE`) | `{ key → { valid, tier, expiresAt } }` with 24h TTL |

Data flow on a render:

```
audio File ──▶ Blob in browser memory
                │
                ▼
         ffmpeg.wasm probe ──▶ { duration, sampleRate }
                │
                ▼ + theme, bpm, aspect
         buildPlan (core/plan.mjs) ──▶ Plan { scenes: [...] }
                │
                ▼ saved to localStorage[plan-<id>]
         user edits in /plan/[id]
                │
                ▼
         render-runner ──▶ parallel Replicate calls (browser → Replicate, or → /api/replicate-proxy → Replicate)
                │
                ▼
         per-scene MP4 Blobs (in-memory)
                │
                ▼ ffmpeg.wasm trim + concat + mux audio
         final MP4 Blob
                │
                ▼ ffmpeg.wasm extractFrame for thumbnail
                │
                ▼
         downloaded by browser + saved to IndexedDB
```

## Risks

- **ffmpeg.wasm performance on iPhone Safari** — a 60s compose with 12-18 scene cuts could be slow on older devices. *Mitigation*: show estimated time during compose; offer a "render via Codespace" link that opens the existing CLI flow as a fallback (already documented in `rhythmix-studio/README.md`).
- **Replicate CORS** — direct browser calls may fail preflight. *Mitigation*: design includes the Replicate proxy Worker as an optional component; built only if CORS testing in T0 confirms it's needed.
- **Gumroad license API rate limits** — frequent re-validation could hit limits. *Mitigation*: 24h Worker KV cache for valid keys; client also caches in localStorage with same TTL.
- **Token leak via XSS** — encrypted-at-rest in localStorage mitigates persistence; React rendering avoids `dangerouslySetInnerHTML` everywhere; CSP header set to `script-src 'self'` only.
- **Engine refactor breaking the existing CLI** — `rhythmix-studio/test/run.mjs` is the safety net. T3 must keep that test green before moving on.

## Stack additions

- `next@^15`, `react@^19`, `typescript`, `tailwindcss@^4` (already in `video/`)
- `@ffmpeg/ffmpeg`, `@ffmpeg/util` for browser ffmpeg
- `idb` for IndexedDB helpers
- shadcn/ui primitives (button, dialog, progress, toast)
- `wrangler` for Worker deploy

No changes to the existing `rhythmix-studio/package.json` dependency list — the engine refactor is internal and source-only.
