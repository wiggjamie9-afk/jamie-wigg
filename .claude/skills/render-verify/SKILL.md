---
name: render-verify
description: Pre-publish gate for a HyperFrames Cut folder — validates folder anatomy, lints the composition, renders it, and checks the output MP4's duration and dimensions against hyperframes.json and narration.wav. Use before publishing any Promo, before linking an MP4 from downloads pages, and as the final step of promo-repurpose or rhythmix-author. Reports pass/fail per check; never publishes a failing Cut.
metadata:
  tags: rhythmix, video, hyperframes, verification, qa
---

## When to use

- Before `npx hyperframes publish` on any Cut
- Before adding a rendered MP4 to `downloads.html` / `videos/` / `README.md`
- As the final verification step of `promo-repurpose` and `rhythmix-author`

## Checks (run all; report a pass/fail table)

Run from the Cut folder (`rhythmix-<name>-<length>/`):

1. **Anatomy** — required files exist: `index.html`, `hyperframes.json`, `script.txt`, `narration.wav`, `package.json`, `gsap.min.js`. `hyperframes.json` has `id`, `width`, `height`; dims match one of the three canonical aspects (1920x1080, 1080x1920, 1080x1080).
2. **Lint** — `npx --yes hyperframes@0.4.42 lint` exits 0.
3. **Narration sanity** — `ffprobe -v error -show_entries format=duration -of csv=p=0 narration.wav` succeeds; duration is within ±10% of the length implied by the folder name (`-60s` → 54–66s, `-30s` → 27–33s). A silent or zero-byte wav is a hard fail.
4. **Render** — `npx --yes hyperframes@0.4.42 render` exits 0 and produces an MP4 (needs ffmpeg; in the devcontainer it is preinstalled).
5. **Output integrity** — `ffprobe` the MP4: video stream dims equal `hyperframes.json` width/height; duration within ±5% of narration duration; an audio stream is present.

## Reporting

- All pass → state "verified" with the table and the output MP4 path.
- Any fail → do NOT publish or link the MP4. Report the failing check with the raw command output, propose the fix, and stop for confirmation only if the fix would change creative content (script, narration, scene timing). Mechanical fixes (missing file copy, wrong dims in JSON) apply directly, then re-run the full check list.

## Environment notes

- If `ffmpeg`/`ffprobe` are missing, install first (`apt-get install -y ffmpeg` in the sandbox/devcontainer) — do not skip checks 3–5.
- Renders are CPU-heavy: when verifying many Cuts, run renders serially, everything else in parallel.
