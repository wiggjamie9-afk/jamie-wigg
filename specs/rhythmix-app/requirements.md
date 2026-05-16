# Requirements: RHYTHMIX Studio Web App (Phase 2)

## Problem

Lifetime buyers ($149) and Gumroad customers were promised a Studio web app launching ~14 days after purchase (per `rhythmix-studio/QUICKSTART.txt`). Today they can only access the engine as a Node CLI that requires installing Node 20, ffmpeg, and either a Replicate token or Pexels key — friction that excludes the iPad / non-technical creators the marketing site (`rhythmix.html`, `text*.txt`) targets. The existing `members.html` page is a sign-in stub but doesn't lead anywhere meaningful.

## Goal

A mobile-first web app at `studio.rhythmixapp.com.au` where a user uploads a track, picks a visual theme, and gets a generated AI music video back — without installing anything. Replicate fees stay on the user's own Replicate account (BYO token); we don't pay for generations and we don't store user audio or rendered video.

## Functional requirements

- **R1**: Accept an audio file upload (mp3 / wav / m4a / flac) up to 50 MB, kept entirely client-side as a Blob (never uploaded to our servers).
- **R2**: Accept a visual theme as free text and an optional BPM (integer 40-220); show inline help describing what each does.
- **R3**: Accept the user's Replicate API token; store it client-side only in `localStorage` (encrypted with WebCrypto AES-GCM using a passphrase the user sets at first token entry and re-enters once per browser session — the derived key lives in browser memory only until tab close). The token is never persisted on our backend. If the optional Replicate proxy Worker is needed as a CORS fallback (per `design.md`), it transits the token statelessly: no logging of request bodies or Authorization headers, no persistence in KV or anywhere else.
- **R4**: Run the plan stage (audio probe → scene split → model routing) entirely in the browser; show the dry-run cost estimate before the user commits to a render.
- **R5**: Let the user edit the plan before rendering — swap the model for any scene, edit any prompt, adjust scene duration. Duration edits are automatically snapped to the nearest beat using the track's BPM; the displayed value is the snapped value (so the user sees what they're actually getting). Persist edits in `localStorage` keyed by plan ID.
- **R6**: Render with live progress — each scene shows `queued | generating | downloaded | composed | failed` status with a per-scene elapsed counter. On failure, retry that scene up to 3x with exponential backoff. If all retries fail, mark the scene as `failed` and continue rendering the remaining scenes — the final compose substitutes a placeholder frame (black frame with scene metadata overlay) for any failed scene, and the UI surfaces a per-scene "re-run" affordance so the user can retry just the failed scenes without re-paying for the rest.
- **R7**: Deliver the final MP4 as a browser download and persist it in IndexedDB as the user's render history, capped at the 50 most-recent entries — when the cap is exceeded, the oldest entry is evicted automatically (with a one-time toast notification on eviction).
- **R8**: Maintain a `/library` page listing past renders with thumbnails (generated client-side from the first frame); user can re-download any entry, or hard-delete any entry via a confirmation dialog (no soft-delete / Trash).
- **R9**: Mobile-first responsive design — iPhone Safari is the primary target; all touch targets ≥44 px; layout works at 375 px viewport width.
- **R10**: Gate access to the app routes (`/new`, `/plan/*`, `/render/*`, `/library`) by Gumroad license key — `members.html`-style flow that POSTs the key to a Cloudflare Worker (`POST /api/license`), which validates against the Gumroad license API and returns `{ valid: true, tier }`; valid keys persist in `localStorage`. The `/` landing page and `/settings` route remain public (the landing page is where the user enters their license to unlock the app routes).
- **R11**: Reuse the existing `rhythmix-studio/` engine code; refactor (not duplicate) shared modules into a platform-agnostic core that both the existing Node CLI and the new web app consume.
- **R12**: Brand identity inherits from `rhythmix-teaser-60s/DESIGN.md` — palette, typography, motion eases — never re-derived.

- **R13**: Detect and surface hard failures with actionable messages — missing WebCrypto support, no IndexedDB, no WebAssembly, Replicate API unreachable, `ffmpeg.wasm` load failure. Each case gets a dedicated empty-state screen pointing to a fallback: CLI install instructions, the Codespace launch flow from `rhythmix-studio/README.md`, or browser-upgrade guidance for the WebCrypto/IndexedDB/WASM cases.

- **R14**: Detect a second tab of Studio open against the same origin via `BroadcastChannel`; show a banner in both tabs ("Studio is open in another tab") with options "use this tab" or "close other tab". Prevents accidental double-renders against the user's Replicate budget.

- **R15**: Provide a settings-page "Export support bundle" button that produces a downloadable JSON file containing recent error logs, browser info (UA, viewport, capability flags), `ffmpeg.wasm` version, and plan history metadata. The bundle explicitly excludes the audio Blob, the Replicate token, and the rendered MP4 Blobs. User attaches it to the Gumroad receipt reply per the support flow in `rhythmix-studio/QUICKSTART.txt`.

- **R16**: Provide a settings-page "Clear all local data" button that wipes `localStorage` (token, license, prefs) and IndexedDB (renders, thumbnails) after a confirmation dialog. Essential before selling, returning, or handing off a device.

## Non-functional requirements

- **N1**: Frontend deployed as Next.js 15 static export to Cloudflare Pages, served at `studio.rhythmixapp.com.au` (subdomain of the existing `rhythmixapp.com.au`).
- **N2**: Exactly one Cloudflare Worker — license validation only. No server-side storage of audio, plans, or rendered video.
- **N3**: Render progress streams via the `EventSource` returned by the runner; UI updates within 200 ms of each scene state change.
- **N4**: A 60-second render must complete within 15 minutes wall-clock on a modern iPhone (≥iPhone 13) with broadband, assuming Replicate is responsive.
- **N5**: Browser ffmpeg work (audio probe + final compose) uses `@ffmpeg/ffmpeg` (ffmpeg.wasm); WASM bundle lazy-loaded only when first needed.
- **N6**: No external analytics, no third-party fonts, no CDN dependencies the user can't audit. All assets self-hosted on Cloudflare Pages.

## Out of scope

- Hosted credits / billing — the user pays Replicate directly; we never touch their card or pay for their generations.
- The other "14 AI features" claimed in the marketing copy (stem separation, distribution, fan investment, VR concerts, NFTs, collab room, voice recognition, song scanning). Those are separate specs.
- Native iOS or Android app. Mobile-first web (PWA-capable) covers the iPhone use case.
- Server-side render history. History lives in IndexedDB only — clearing browser data clears history.
- Auth beyond the license-key gate. No accounts, no profiles, no social.
- Public sharing / hosted permalinks. Users download the MP4 and share themselves.

## Open questions

- Does Replicate's API allow direct browser calls with the user's token, or do we need the thin Cloudflare Worker proxy for CORS? T0 spike resolves this. Either path is now compatible with R3.
- Gumroad license API rate limits — current resolution: cache valid result for 24 hours in Worker KV and in client `localStorage`. Re-validate on demand if the user explicitly clicks "re-check license".
- The R6 failure-mode change ("placeholder frame for failed scenes") may need ffmpeg.wasm filter complexity not yet sized — verify during T10 and adjust if the placeholder logic blocks the wave.
