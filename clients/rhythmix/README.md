# RHYTHMIX — Client Workspace

Output of the social-AI-team for the **RHYTHMIX** account. Everything you need to run May 2026's social presence is in this directory.

## Start here on your phone

1. **Open `POSTING-PLAYBOOK.md`** — it's the one file you read each morning. Long-press the caption for that day's post → copy → paste into the platform → attach the asset listed → publish.
2. **After posting, paste the permalink into `outputs/reviews/2026-05-metrics.csv`** (post # column).
3. **Day 7, 14, 30:** fill in impressions, engagement rate, saves, clicks for each post in the same CSV.
4. **End of month:** type `/social-performance-review rhythmix 2026-05` to me — I'll auto-populate `outputs/reviews/2026-05.md` and feed lessons forward into June.

## Directory map

```
clients/rhythmix/
├── README.md                   ← you are here
├── POSTING-PLAYBOOK.md         ← daily copy-paste, asset paths, scheduling notes
├── HEARTBEAT.md                ← audit trail of every skill run on this client
├── context/
│   ├── brand-style.md          ← voice, palette, audience, anti-patterns, goals
│   └── content-calendar/
│       └── 2026-05.md          ← 21 posts, hooks, dates, formats, buckets
└── outputs/
    ├── captions/2026-05/
    │   ├── 01-sam-7200-apple-tv-sync.md
    │   ├── 02-14-features-one-subscription.md
    │   └── ... (21 caption files)
    ├── creatives/2026-05/
    │   ├── brand.css           ← shared brand tokens for all HTML mockups
    │   ├── 02-14-features-one-subscription.html  ← carousel, 5 slides
    │   ├── 05-maya-14800-148-fans.html           ← single image, 1080×1350
    │   ├── 08-nova-never-performed-live.html     ← single image, 1080×1080
    │   ├── 09-suno-udio-landr-rhythmix.html      ← carousel, 5 slides
    │   ├── 13-0-or-149.html                      ← single image, 1080×1350
    │   ├── 16-six-tools-stop-paying.html         ← carousel, 8 slides
    │   ├── 19-2400-average-sync.html             ← single image, 1080×1080
    │   ├── 20-60-spots-149-lifetime.html         ← single image, 1080×1350
    │   └── VIDEO-MANIFEST.md   ← which existing repo MP4 to use for each video post
    └── reviews/
        ├── 2026-05.md          ← review skeleton, auto-fills from CSV
        └── 2026-05-metrics.csv ← paste your numbers here
```

## How the skills compose

```
/social-media-manager           ← orchestrator (call this for "do everything")
  │
  ├─→ /brand-onboarding         ← run once. Output: context/brand-style.md
  │     (RHYTHMIX shortcut: pulls from rhythmix-teaser-60s/DESIGN.md + text*.txt)
  │
  ├─→ /content-calendar         ← run monthly. Reads brand-style.md + last review.
  │                               Output: context/content-calendar/<YYYY-MM>.md
  │
  ├─→ /caption-writer           ← run per post (orchestrator loops). Reads brand
  │                               + calendar row. Output: outputs/captions/.../<NN-slug>.md
  │
  ├─→ /social-creative-designer ← run per post. Reads caption notes-for-designer.
  │                               Output: outputs/creatives/.../<NN-slug>.{html,mp4,png}
  │                               Path A: creative-stack MCP (Replicate + ElevenLabs).
  │                               Path B (current): HTML mockups + reuse existing repo MP4s.
  │
  └─→ /social-performance-review ← run end-of-month after metrics are in.
                                   Output: outputs/reviews/<YYYY-MM>.md
                                   Side effect: appends "What's working" to brand-style.md
```

## Posting decisions (by design)

- **Posting is manual** — captions and assets land on disk; you publish from your phone. To go auto, ask me to "wire posting to my Buffer / Hootsuite / Later." The Zapier MCP is already enabled.
- **No-API creatives in this run** — the entire creative output was produced without a single Replicate or ElevenLabs call. Any time you want richer AI imagery or fresh AI-generated video B-roll, set `REPLICATE_API_TOKEN` and `ELEVENLABS_API_KEY` in `.claude/settings.local.json` and tell me to "regenerate creatives with AI."
- **Existing assets reused first** — the 5-scene canonical RHYTHMIX video series (`rhythmix-s1-overview` through `rhythmix-s5-pricing`) plus standalone teasers cover most video posts as-is. See `outputs/creatives/2026-05/VIDEO-MANIFEST.md` for the per-post mapping.

## Cadence calibration

Brand-style.md targets **21 posts/week** across 5 platforms. This first month runs at **~7 posts/week (21 over 22 days)** to validate which buckets and platforms perform before scaling. After the May review, the June calendar will dial up the platforms and buckets that earned their spend, and dial down the ones that didn't.

## What to do next month

After running the review at end of May:

1. Read `outputs/reviews/2026-05.md` — particularly "What worked" / "What didn't" / "Recommendations."
2. Tell me `/content-calendar rhythmix 2026-06` — the calendar skill reads the May review automatically and biases the June plan toward the patterns that worked.
3. Repeat the loop.

## Other clients

If you want to run the same playbook for another brand (a friend's coffee shop, your side project, a client engagement):

```
/brand-onboarding <slug>        ← e.g., /brand-onboarding mellow-cafe
```

The skill will ask the 8-question intake (it only auto-fills for `rhythmix`), then everything else works the same way — calendar, captions, creatives, review.
