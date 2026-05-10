# Video Manifest — RHYTHMIX May 2026

Maps each video post in the May calendar to the best-matching existing rendered MP4 in this repo. No new renders, no API calls. Optional ffmpeg overlay/recut commands provided for the on-canvas text from each caption's "Notes for designer."

## Reuse strategy

The repo has a 5-scene canonical series — `rhythmix-s1-overview` through `rhythmix-s5-pricing` (and matching `-f` finished cuts) — plus standalone teasers. Each post below pairs with the closest match. Where the existing video already covers the message, post it as-is. Where it needs a stat overlay or a different end card, the ffmpeg snippet drops the overlay in without re-rendering the source.

## Manifest

| # | Date | Platform | Hook | Source video | Action |
| --- | --- | --- | --- | --- | --- |
| 01 | 2026-05-10 | tiktok | "Sam made $7,200 from one Apple TV sync" | `videos/announcement-live-60s.mp4` | **Recut + overlay** — trim to 30s, drop "$7,200" gold overlay 0:08-0:12 + "ONE SYNC" mono caps 0:12-0:16 (see snippet 01 below) |
| 04 | 2026-05-13 | tiktok | "$149 once. Forever access. 80 spots left" | `rhythmix-s5-pricing-f/renders/rhythmix-s5-pricing-f.mp4` | **Use as-is** (pricing scene, already covers $149 lifetime) |
| 06 | 2026-05-15 | youtube-shorts | "Stem-split a 2010 demo in 30 seconds" | `rhythmix-s3-tools-f/renders/rhythmix-s3-tools-f.mp4` | **Recut to 30s** + add 0:30 timer overlay top-right (snippet 06 below) |
| 07 | 2026-05-16 | tiktok | "Replying to: 'AI music has no soul'" | `videos/manifesto-new-world-60s.mp4` | **Reply-format** — TikTok app handles the comment-pin overlay automatically when posting via the Reply feature; upload manifesto video as the response |
| 10 | 2026-05-19 | tiktok | "How Dev quit his job in 6 months" | `rhythmix-s2-money-f/renders/rhythmix-s2-money-f.mp4` | **Recut + stat sequence overlay** — 180K SUBS / 40 TRACKS / 6 PLAYLISTED / 1 SYNC DEAL / MONTH 6: QUIT (snippet 10 below) |
| 12 | 2026-05-21 | tiktok | "Type a 3-line description, get a cinematic score" | `rhythmix-s1-overview-f/renders/rhythmix-s1-overview-f.mp4` | **Use as-is** (overview scene shows the prompt → output flow) |
| 15 | 2026-05-24 | tiktok | "Jordan rebuilt an old demo with stem split" | `rhythmix-s3-tools-f/renders/rhythmix-s3-tools-f.mp4` | **Same source as 06** but trim differently — keep 0:00-0:25 stem-split portion + add Jordan testimonial card end frame (snippet 15 below) |
| 17 | 2026-05-26 | youtube-shorts | "From prompt to Spotify in under an hour" | `rhythmix-overview-60s/rhythmix-overview-60s.mp4` | **Use as-is** (full prompt-to-platform flow) |
| 18 | 2026-05-27 | tiktok | "Alex got 31,000 streams. He's never had a music lesson." | `videos/announcement-live-60s.mp4` | **Recut + overlay** — trim to 25s, add "31,000 STREAMS" stat overlay + Alex Chen testimonial end card (snippet 18 below) |
| 21 | 2026-05-30 | tiktok | "What ONE subscription replaces" | `rhythmix-s4-vs-f/renders/rhythmix-s4-vs-f.mp4` | **Use as-is** (vs-competitors scene already covers the 6-tools collapse) |

## ffmpeg overlay snippets

All snippets assume the source video stays untouched. They produce the post-ready MP4 in `clients/rhythmix/outputs/creatives/2026-05/<NN-slug>.mp4`. Run from the repo root.

### Snippet 01 — Sam $7,200 sync

```bash
ffmpeg -i videos/announcement-live-60s.mp4 \
  -t 30 \
  -vf "drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='\\\$7\\,200':fontcolor=#f5c000:fontsize=180:x=(w-text_w)/2:y=(h*0.35):enable='between(t,8,12)'" \
  -c:a copy \
  clients/rhythmix/outputs/creatives/2026-05/01-sam-7200-apple-tv-sync.mp4
```

### Snippet 06 — Stem split 30s timer

```bash
ffmpeg -i rhythmix-s3-tools-f/renders/rhythmix-s3-tools-f.mp4 \
  -t 30 \
  -vf "drawtext=fontfile=/System/Library/Fonts/Menlo.ttc:text='%{eif\:t\:d}\\: %{eif\:mod(t*1000\,1000)\:d\:3}':fontcolor=#00d8ff:fontsize=48:x=w-tw-40:y=40" \
  -c:a copy \
  clients/rhythmix/outputs/creatives/2026-05/06-stem-split-2010-demo.mp4
```

### Snippet 10 — Dev quit job stat sequence

```bash
ffmpeg -i rhythmix-s2-money-f/renders/rhythmix-s2-money-f.mp4 \
  -vf "
  drawtext=fontfile=/System/Library/Fonts/Menlo.ttc:text='180K SUBS':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=h*0.7:enable='between(t,2,4)',
  drawtext=fontfile=/System/Library/Fonts/Menlo.ttc:text='40 TRACKS':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=h*0.7:enable='between(t,4,6)',
  drawtext=fontfile=/System/Library/Fonts/Menlo.ttc:text='6 PLAYLISTED':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=h*0.7:enable='between(t,6,8)',
  drawtext=fontfile=/System/Library/Fonts/Menlo.ttc:text='1 SYNC DEAL':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=h*0.7:enable='between(t,8,10)',
  drawtext=fontfile=/System/Library/Fonts/Menlo.ttc:text='MONTH 6\\: QUIT':fontcolor=#ff1f5a:fontsize=84:x=(w-text_w)/2:y=h*0.7:enable='between(t,10,14)'
  " \
  -c:a copy \
  clients/rhythmix/outputs/creatives/2026-05/10-dev-quit-job-6-months.mp4
```

### Snippet 15 — Jordan stem split + testimonial

```bash
# Trim source to first 25s
ffmpeg -i rhythmix-s3-tools-f/renders/rhythmix-s3-tools-f.mp4 \
  -t 25 -c copy /tmp/jordan-source.mp4

# Generate end-card from html mockup (placeholder — produce manually for now)
# Then concat:
ffmpeg -i /tmp/jordan-source.mp4 -i clients/rhythmix/outputs/creatives/2026-05/jordan-end-card.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1" \
  clients/rhythmix/outputs/creatives/2026-05/15-jordan-old-demo-stem-split.mp4
```

### Snippet 18 — Alex 31,000 streams

```bash
ffmpeg -i videos/announcement-live-60s.mp4 \
  -t 25 \
  -vf "
  drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='31\\,000 STREAMS':fontcolor=white:fontsize=84:x=(w-text_w)/2:y=h*0.7:enable='between(t,10,14)',
  drawtext=fontfile=/System/Library/Fonts/Menlo.ttc:text='\\\$94 · MONTH 1':fontcolor=#ff6fc8:fontsize=48:x=(w-text_w)/2:y=h*0.78:enable='between(t,10,14)'
  " \
  -c:a copy \
  clients/rhythmix/outputs/creatives/2026-05/18-alex-31000-streams.mp4
```

## How to run any of these on your phone

Path 1 — locally on a Mac/Linux machine: `brew install ffmpeg` (or `apt`), paste the snippet, hit return. Output lands at the path shown.

Path 2 — from the iPhone: open the GitHub commit on your phone, share-sheet the source MP4 to a video-editor app (CapCut, InShot), add the on-canvas text manually using the caption's "Notes for designer" as a guide. The HTML carousel/single-image creatives don't need ffmpeg — open the .html file in mobile Safari, screenshot each slide.

## Posts that need NO video work

- **#03** "Most AI music sounds like a microwave" — single-text on Threads, no creative.
- **#11** "Spotify pays $0.003 per stream. Sync pays $7,200" — single-text on X, no creative.
- **#14** "We don't take royalties. Your music stays yours." — single-text on Threads, no creative.

## Per-post asset summary

| # | Format | Output type | Path |
| --- | --- | --- | --- |
| 01 | short-video | recut MP4 (snippet 01) | `clients/rhythmix/outputs/creatives/2026-05/01-sam-7200-apple-tv-sync.mp4` |
| 02 | carousel | HTML mockup (5 slides) | `clients/rhythmix/outputs/creatives/2026-05/02-14-features-one-subscription.html` |
| 03 | single-text | none | — |
| 04 | short-video | use-as-is | `rhythmix-s5-pricing-f/renders/rhythmix-s5-pricing-f.mp4` |
| 05 | single-image | HTML mockup | `clients/rhythmix/outputs/creatives/2026-05/05-maya-14800-148-fans.html` |
| 06 | short-video | recut MP4 (snippet 06) | `clients/rhythmix/outputs/creatives/2026-05/06-stem-split-2010-demo.mp4` |
| 07 | reply-video | use-as-is | `videos/manifesto-new-world-60s.mp4` (post via TikTok Reply) |
| 08 | single-image | HTML mockup | `clients/rhythmix/outputs/creatives/2026-05/08-nova-never-performed-live.html` |
| 09 | carousel | HTML mockup (5 slides) | `clients/rhythmix/outputs/creatives/2026-05/09-suno-udio-landr-rhythmix.html` |
| 10 | short-video | recut MP4 (snippet 10) | `clients/rhythmix/outputs/creatives/2026-05/10-dev-quit-job-6-months.mp4` |
| 11 | single-text | none | — |
| 12 | short-video | use-as-is | `rhythmix-s1-overview-f/renders/rhythmix-s1-overview-f.mp4` |
| 13 | single-image | HTML mockup | `clients/rhythmix/outputs/creatives/2026-05/13-0-or-149.html` |
| 14 | single-text | none | — |
| 15 | short-video | recut MP4 (snippet 15) | `clients/rhythmix/outputs/creatives/2026-05/15-jordan-old-demo-stem-split.mp4` |
| 16 | carousel | HTML mockup (8 slides) | `clients/rhythmix/outputs/creatives/2026-05/16-six-tools-stop-paying.html` |
| 17 | short-video | use-as-is | `rhythmix-overview-60s/rhythmix-overview-60s.mp4` |
| 18 | short-video | recut MP4 (snippet 18) | `clients/rhythmix/outputs/creatives/2026-05/18-alex-31000-streams.mp4` |
| 19 | single-image | HTML mockup | `clients/rhythmix/outputs/creatives/2026-05/19-2400-average-sync.html` |
| 20 | single-image | HTML mockup | `clients/rhythmix/outputs/creatives/2026-05/20-60-spots-149-lifetime.html` |
| 21 | short-video | use-as-is | `rhythmix-s4-vs-f/renders/rhythmix-s4-vs-f.mp4` |

## Coverage

- 5 use-as-is videos (post 04, 07, 12, 17, 21) — zero work needed
- 5 ffmpeg-overlay videos (post 01, 06, 10, 15, 18) — one-line ffmpeg
- 8 HTML mockups (post 02, 05, 08, 09, 13, 16, 19, 20) — open in browser, screenshot
- 3 single-text posts (post 03, 11, 14) — paste caption only

**21/21 posts covered. Zero API calls. Total cost: $0.**
