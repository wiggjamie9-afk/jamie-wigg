# 369 Codex — Canva-Generated MP4 (Different-AI Variant #2)

Canva successfully generated a real animated MP4 for the 369 Codex Story. **The sandbox can't download it (CDN blocked by egress allowlist), but the signed URL works from any browser or phone with regular internet access.**

---

## 📥 Download the MP4

Paste this into Safari on your phone, or click from your computer. The link is a signed S3 URL — no Canva login needed. **It expires ~25 hours after generation (around 2026-05-16 05:20 UTC), so download it soon.**

```
https://export-download.canva.com/LzsfI/DAHJsxLzsfI/-1/0-4908300942598276868.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260514%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260514T041742Z&X-Amz-Expires=90152&X-Amz-Signature=7e96619f49f529c8f2a120f79c81f33770f4ee6302bef5c52ee6a4aef616ccee&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Fri%2C%2015%20May%202026%2005%3A20%3A14%20GMT
```

Format: MP4, vertical 1080p (1080×1920), regular quality.

If the link expires before you grab it, open the design (edit URL below) and click **Share → Download → MP4 → Vertical 1080p**.

---

## 🎨 Edit / refine in Canva

You can keep working on the design in your Canva account — change text, swap colors, tweak animations — then re-export.

- **Edit URL:** https://www.canva.com/d/HOJMPOBFUt4mKLH
- **View URL:** https://www.canva.com/d/ZK3_ldLArx0QcYk
- **Design ID:** `DAHJsxLzsfI`
- **Page count:** 1 (Canva Stories are single-page; the animation runs inside that one page)

---

## What Canva built from my brief

Canva picked the first of 4 candidates it generated. The design type is `your_story` (9:16 vertical Instagram/Facebook Stories format, native 1080×1920). The brief I gave it:

> Vertical Story for "The 369 Codex" — Tesla 3-6-9 manifestation method workbook. Five conceptual beats (hook / Tesla origin / 3·6·9 method / workbook promise / CTA). Indigo + antique gold palette, editorial serif typography, ceremonial-vintage-grimoire aesthetic. No bright/cartoon colors.

Canva translated that into a single-page animated Story with built-in motion (text fly-ins, element reveals). The MP4 export bakes that animation into video frames at 1080×1920.

---

## Three other candidates (in case you want to try them instead)

Each is a different Canva-generated take on the same brief. Open the URL on your phone — you'll see the static preview. If you prefer one of these, I can re-export that one as MP4 in 30 seconds.

| # | View | Candidate ID |
|---|---|---|
| 1 *(chosen)* | https://www.canva.com/d/-ElEkQuFSXanwcm | `dg-63be909e-b18a-4f0f-bc5f-91ea88a6f726` |
| 2 | https://www.canva.com/d/tXHZKosZNvAUkWH | `dg-af6fda9c-b70d-4b86-9d0c-ca21a84058f3` |
| 3 | https://www.canva.com/d/gsp0grC3_Lc9kfm | `dg-c95ea9e3-24d2-41e2-8b52-0c155e5ddd6f` |
| 4 | https://www.canva.com/d/I4U5aVacGb-IeL8 | `dg-d76bf239-eae3-4eb7-9b99-f293c2aa45d3` |

---

## Why I couldn't ship the MP4 file directly

The sandbox egress allowlist blocks `*.canva.com`, `*.canva.ai`, `*.gamma.app`, and `*.pollinations.ai`. The Canva MCP API call works (it routes through Anthropic), but the download URL Canva returns points to their S3 CDN which the sandbox can't reach. ffmpeg, curl, and wget all get the same 403.

**To make this fully automated next time:** ask the Claude Code web environment admin to add `export-download.canva.com`, `design.canva.ai`, and `cdn.gamma.app` to the allowlist. Then I can download exports straight to the repo.

---

## Status of "movie" deliverables so far

| Variant | What | Status |
|---|---|---|
| **A — HyperFrames + Kokoro** | `codex-369-30s/codex-369-30s.mp4` | ✅ Ready in repo, fully baked |
| **B — Gamma AI imagery deck** | `codex-369-30s/GAMMA-AI-DECK.md` → gamma.app URL | ✅ Viewable, no MP4 |
| **C — Canva animated Story** | ⬇️ Signed URL above | ✅ MP4 exists, manual download needed |
