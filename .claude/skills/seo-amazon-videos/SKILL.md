---
name: seo-amazon-videos
description: Fetch the videos block from an Amazon product detail page via SerpApi's amazon_product engine. Use during e-commerce audits to surface product videos by ASIN, evaluate video coverage, and feed creator data into competitive analysis. Triggers on "amazon videos", "product videos", "ASIN videos", "serpapi amazon", or any audit that includes Amazon product URLs.
---

# Amazon Product Videos via SerpApi

This skill enriches `seo-ecommerce` audits with the videos block from Amazon
product pages. Use it whenever an audit references an Amazon ASIN or product URL.

## When to invoke

- User provides one or more Amazon ASINs and asks for video coverage / creator analysis
- An `seo-ecommerce` audit detects Amazon product URLs and needs video metadata
- User explicitly says "fetch amazon videos for B0xxxxxxxx"

## Required inputs

| Input              | Source                                                |
|--------------------|-------------------------------------------------------|
| `asin`             | 10-character alphanumeric (extract from URL if given) |
| `SERPAPI_API_KEY`  | Environment variable                                  |

If `SERPAPI_API_KEY` is missing, ask the user for it before proceeding — do
not attempt the request.

## How to fetch

Prefer the standalone CLI script in this repo:

```bash
SERPAPI_API_KEY="$SERPAPI_API_KEY" python scripts/fetch_amazon_videos.py <ASIN>
```

For CSV output suitable for inclusion in audit reports:

```bash
SERPAPI_API_KEY="$SERPAPI_API_KEY" python scripts/fetch_amazon_videos.py <ASIN> --format csv
```

The script issues a single `GET https://serpapi.com/search.json?engine=amazon_product&asin=<ASIN>&api_key=<KEY>`
and prints the `videos` array.

## Output schema

Each video has: `position`, `title`, `link` (HLS m3u8), `thumbnail`,
`duration`, `vendor`, `vendor_thumbnail`, `date`. See `docs/serpapi-amazon-videos.md`.

## What to report

When called from an `seo-ecommerce` audit, surface:

1. **Coverage** — count of videos, total duration, % from the brand vs. third parties
2. **Recency** — newest / oldest video dates; flag if newest > 12 months old
3. **Creator concentration** — top vendors by video count
4. **Gaps** — if 0 videos, recommend uploading; if all > 1 year old, recommend refresh

## See also

- Reference: `docs/serpapi-amazon-videos.md`
- Script: `scripts/fetch_amazon_videos.py`
- In-app page: `opensaas-app/app/src/amazonVideos/AmazonVideosPage.tsx` (route `/amazon-videos`)
