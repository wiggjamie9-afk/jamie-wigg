# SerpApi: Amazon Product Videos

Fetches the `videos` block from an Amazon product detail page via SerpApi's
`amazon_product` engine.

## Endpoint

```
GET https://serpapi.com/search.json?engine=amazon_product&asin=<ASIN>&api_key=<KEY>
```

## Required parameters

| Parameter | Description                              |
|-----------|------------------------------------------|
| `engine`  | Must be `amazon_product`                 |
| `asin`    | Amazon Standard Identification Number    |
| `api_key` | SerpApi key (`SERPAPI_API_KEY` env var)  |

## Response shape (`videos[]`)

| Field              | Type    | Description                              |
|--------------------|---------|------------------------------------------|
| `position`         | integer | Position in the videos list              |
| `title`            | string  | Video title                              |
| `link`             | string  | Video URL (HLS `.m3u8` stream)           |
| `thumbnail`        | string  | Thumbnail image URL                      |
| `duration`         | string  | Duration, e.g. `"1:26"`                  |
| `vendor`           | string  | Creator / vendor name                    |
| `vendor_thumbnail` | string  | Vendor avatar URL                        |
| `date`             | string  | Upload date, e.g. `"Dec 19, 2024"`       |

## Example (Ruby)

```ruby
require "serpapi"

client = SerpApi::Client.new(
  engine: "amazon_product",
  asin: "B072MQ5BRX",
  api_key: ENV.fetch("SERPAPI_API_KEY")
)

results = client.search
videos = results[:videos]
```

## See also

- Standalone CLI: `scripts/fetch_amazon_videos.py`
- Open SaaS page: `opensaas-app/app/src/amazonVideos/AmazonVideosPage.tsx`
- SEO skill: `.claude/skills/seo-amazon-videos/SKILL.md`
