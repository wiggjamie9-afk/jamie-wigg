# Requirements: RHYTHMIX Studio Web App (Phase 2)

## Problem

Lifetime buyers ($149) and Gumroad customers were promised a Studio web app launching ~14 days after purchase (per `rhythmix-studio/QUICKSTART.txt`). Today they can only access the engine as a Node CLI that requires installing Node 20, ffmpeg, and either a Replicate token or Pexels key — friction that excludes the iPad / non-technical creators the marketing site (`rhythmix.html`, `text*.txt`) targets. The existing `members.html` page is a sign-in stub but doesn't lead anywhere meaningful.

## Goal

A mobile-first web app at `studio.rhythmixapp.com.au` where a user uploads a track, picks a visual theme, and gets a generated AI music video back — without installing anything. Replicate fees stay on the user's own Replicate account (BYO token); we don't pay for generations and we don't store user audio or rendered video.

## Functional requirements

- **R1**: Accept an audio file upload (mp3 / wav / m4a / flac) up to 50 MB, kept entirely client-side as a Blob (never uploaded to our servers).
- **R2**: Accept a visual theme as free text and an optional BPM (integer 40-220); show inline help describing what each does.
- **R3**: Accept the user's Replicate API token; store it client-side only in `localStorage` (encrypted with WebCrypto using a passphrase the user sets); never transmit to our backend.
- **R4**: Run the plan stage (audio probe → scene split → model routing) entirely in the browser; show the dry-run cost estimate before the user commits to a render.
- **R5**: Let the user edit the plan before rendering — swap the model for any scene, edit any prompt, adjust scene duration; persist edits in `localStorage` keyed by plan ID.
- **R6**: Render with live progress — each scene shows `queued | generating | downloaded | composed` status with a per-scene elapsed counter; on failure, retry that scene up to 3x before halting.
- **R7**: Deliver the final MP4 as a browser download and persist it in IndexedDB as the user's render history.
- **R8**: Maintain a `/library` page listing past renders with thumbnails (generated client-side from the first frame); user can re-download or delete any entry.
- **R9**: Mobile-first responsive design — iPhone Safari is the primary target; all touch targets ≥44 px; layout works at 375 px viewport width.
- **R10**: Gate access by Gumroad license key — `members.html`-style flow that POSTs the key to a Cloudflare Worker (`POST /api/license`) which validates against the Gumroad license API and returns `{ valid: true, tier }`; valid keys persist in `localStorage`.
- **R11**: Reuse the existing `rhythmix-studio/` engine code; refactor (not duplicate) shared modules into a platform-agnostic core that both the existing Node CLI and the new web app consume.
- **R12**: Brand identity inherits from `rhythmix-teaser-60s/DESIGN.md` — palette, typography, motion eases — never re-derived.

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

- Does Replicate's API allow direct browser calls with the user's token, or do we need a thin Cloudflare Worker proxy for CORS? If proxy is needed, the BYO model still holds — Worker just forwards the token. Verify before T9.
- Gumroad license API rate limits — if a user reopens the app frequently, do we validate every session or cache the result for N hours? Default: cache valid result for 24 hours, re-validate on demand.
