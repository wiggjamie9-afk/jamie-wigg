# RHYTHMIX — Auto-Post Procedure (May 2026)

This is the deterministic playbook I follow when you say **"post today"** or **"post 2026-05-NN"** in chat. It maps each date to a sequence of Zapier MCP write actions.

> **Threads routing change (2026-05-10):** Threads-by-Unshape OAuth was blocked at Unshape's paywall, so the 4 Threads-only posts are rerouted as **IG posts with the "Share to Threads" toggle on**. IG cross-posts the same image+caption to Threads automatically — no Zapier-Threads connector needed.

## Base public URL pattern

Every asset I send to Zapier must be a public URL. We use the GitHub raw pattern:

```
BASE = https://raw.githubusercontent.com/wiggjamie9-afk/jamie-wigg/claude/new-session-3MVBI
```

After this branch lands on `main`, swap the branch in the URL.

PNGs are already rendered and committed (see commit `3d137d2`). When IG fires, every `.png` file in `clients/rhythmix/outputs/creatives/2026-05/` is reachable at `BASE/<path>`.

## Auto-postable in May 2026

Of the 21 posts, **11 are auto-postable** via IG + YouTube. Per-platform breakdown:

| Platform | Posts | Status |
| --- | --- | --- |
| Instagram (image / carousel, some auto-share to Threads) | 02, 03†, 05, 08†, 09, 13, 14†, 16, 19†, 20 | ✅ IG OAuth done, PNGs rendered |
| YouTube Shorts | 06, 17 | ✅ YouTube OAuth done |
| X | 11 | manual (no X OAuth — text post anyway) |
| TikTok | 01, 04, 07, 10, 12, 15, 18, 21 | manual (TikTok blocks 3rd-party posting) |

† = posts that were originally Threads-native, now posted via IG with **"Share to Threads" toggle ON**. The IG Reel/Carousel UI has this option in the share screen — Zapier doesn't expose the toggle directly, so I'll prepend a one-line reminder when those posts fire that you should toggle it on at the IG side via the post's Edit-share-options menu (or you can pre-set it as a default in IG settings).

## Per-date procedure

### 2026-05-10 (Mon) — 0 auto

- 01 TikTok manual

### 2026-05-11 (Tue) — 1 auto

- **02** IG carousel (5 slides):
  - **action:** `execute_zapier_write_action(app="Instagram for Business", action="publish_media_v2")`
  - **media:** `[BASE/.../02-14-features-one-subscription-01.png, ..., -05.png]`
  - **caption:** body of `outputs/captions/2026-05/02-14-features-one-subscription.md`

### 2026-05-12 (Wed) — 1 auto (was Threads, now IG → auto-shares to Threads)

- **03** IG single-image (auto-shares to Threads):
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../03-ai-music-microwave.png]`
  - **caption:** body of post 03
  - **note:** before posting, ensure IG → Settings → Privacy → "Share Posts to Threads" is enabled (one-time toggle) so this and posts 08, 14, 19 auto-cross-post.

### 2026-05-13 (Thu) — 0 auto

- 04 TikTok manual

### 2026-05-14 (Fri) — 1 auto

- **05** IG single-image:
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../05-maya-14800-148-fans.png]`
  - **caption:** body of post 05

### 2026-05-15 (Sat) — 1 auto

- **06** YouTube Short:
  - **action:** `execute_zapier_write_action(app="YouTube", action="upload_video")`
  - **title:** `Stem-split a 2010 demo in 30 seconds`
  - **description:** body of post 06
  - **video:** `BASE/rhythmix-s3-tools-f/renders/rhythmix-s3-tools-f.mp4`
  - **privacy_status:** `public`
  - **tags:** `["stemseparation","musicproducer","aimusic","remix","producerlife","Shorts"]`
  - **made_for_kids:** `false`

### 2026-05-16 (Sun) — 0 auto

- 07 TikTok reply manual

### 2026-05-17 (Mon) — 1 auto (was Threads, now IG → auto-shares to Threads)

- **08** IG single-image (auto-shares to Threads):
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../08-nova-never-performed-live.png]`
  - **caption:** body of post 08

### 2026-05-18 (Tue) — 1 auto

- **09** IG carousel (5 slides):
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../09-suno-udio-landr-rhythmix-01.png, ..., -05.png]`
  - **caption:** body of post 09

### 2026-05-19 (Wed) — 0 auto

- 10 TikTok manual

### 2026-05-20 (Thu) — 0 auto (X stays manual)

- 11 X single-text manual (no X OAuth wired)

### 2026-05-21 (Fri) — 0 auto

- 12 TikTok manual

### 2026-05-22 (Sat) — 1 auto

- **13** IG single-image:
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../13-0-or-149.png]`
  - **caption:** body of post 13

### 2026-05-23 (Sun) — 1 auto (was Threads, now IG → auto-shares to Threads)

- **14** IG single-image (auto-shares to Threads):
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../14-we-dont-take-royalties.png]`
  - **caption:** body of post 14

### 2026-05-24 (Mon) — 0 auto

- 15 TikTok manual

### 2026-05-25 (Tue) — 1 auto

- **16** IG carousel (8 slides — within IG's 10-slide limit):
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../16-six-tools-stop-paying-01.png, ..., -08.png]`
  - **caption:** body of post 16

### 2026-05-26 (Wed) — 1 auto

- **17** YouTube Short:
  - **action:** `upload_video`
  - **title:** `From prompt to Spotify in under an hour`
  - **description:** body of post 17
  - **video:** `BASE/rhythmix-overview-60s/rhythmix-overview-60s.mp4`
  - **privacy_status:** `public`
  - **tags:** `["aimusic","musicproducer","spotify","independentartist","musiciansoftiktok","Shorts"]`

### 2026-05-27 (Thu) — 0 auto

- 18 TikTok manual

### 2026-05-28 (Fri) — 1 auto (was Threads, now IG → auto-shares to Threads)

- **19** IG single-image (auto-shares to Threads):
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../19-2400-average-sync.png]`
  - **caption:** body of post 19

### 2026-05-29 (Sat) — 1 auto

- **20** IG single-image:
  - **action:** `publish_media_v2`
  - **media:** `[BASE/.../20-60-spots-149-lifetime.png]`
  - **caption:** body of post 20

### 2026-05-30 (Sun) — 0 auto

- 21 TikTok manual

## Ready-to-fire summary

| Date | Ping | Posts fired |
| --- | --- | --- |
| 2026-05-11 | "post today" | 02 IG carousel |
| 2026-05-12 | "post today" | 03 IG → Threads cross-post |
| 2026-05-14 | "post today" | 05 IG single |
| 2026-05-15 | "post today" | 06 YouTube Short |
| 2026-05-17 | "post today" | 08 IG → Threads cross-post |
| 2026-05-18 | "post today" | 09 IG carousel |
| 2026-05-22 | "post today" | 13 IG single |
| 2026-05-23 | "post today" | 14 IG → Threads cross-post |
| 2026-05-25 | "post today" | 16 IG carousel |
| 2026-05-26 | "post today" | 17 YouTube Short |
| 2026-05-28 | "post today" | 19 IG → Threads cross-post |
| 2026-05-29 | "post today" | 20 IG single |

12 days you say "post today" + 9 days you post a TikTok manually. The X post on 2026-05-20 is single-text — paste the caption from the playbook.

## One-time IG toggle

Before the first auto-post fires, enable IG-to-Threads cross-posting once:

**IG app → Settings & privacy → Privacy → Posts → Sharing to other apps → Threads → ON (always)**

After that, every IG post automatically appears on Threads with the same caption + image. No per-post action needed.

## What I do when you say "post today"

1. Read today's date from system context.
2. Look up that date in this file.
3. For each "auto" post on that date, call the Zapier MCP write action with the exact params listed.
4. After each call returns success, append a row to `HEARTBEAT.md` with the post #, the action, and the response.
5. Report back the post URL(s) for you to verify.

## What I do when you say "post 2026-05-NN"

Same as above but for the date you name, regardless of today.

## What I do when you say "dry-run 2026-05-NN"

Same lookup, but I print the exact Zapier action params I would call without calling them. Useful before the first real fire.

## Failure modes

- **OAuth expired** → Zapier returns 401. I'll surface the auth URL again.
- **IG account is Personal, not Creator** → `publish_media_v2` returns "missing permission." Convert IG to Creator and reconnect.
- **PNG URLs 404** → run `node clients/rhythmix/scripts/render-png.mjs 2026-05` on a desktop, push the PNGs, retry.
- **Thread post fails on emoji/length** → Threads has a 500-char body cap; the captions are sized for it but flag this if it ever bites.
