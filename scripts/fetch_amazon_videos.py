#!/usr/bin/env python3
"""Fetch Amazon product videos for a given ASIN via SerpApi.

Usage:
    SERPAPI_API_KEY=... python scripts/fetch_amazon_videos.py B072MQ5BRX
    SERPAPI_API_KEY=... python scripts/fetch_amazon_videos.py B072MQ5BRX --format csv
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import sys
from urllib.parse import urlencode
from urllib.request import urlopen

ENDPOINT = "https://serpapi.com/search.json"


def fetch_videos(asin: str, api_key: str) -> list[dict]:
    params = {"engine": "amazon_product", "asin": asin, "api_key": api_key}
    with urlopen(f"{ENDPOINT}?{urlencode(params)}") as resp:
        payload = json.load(resp)
    return payload.get("videos", [])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("asin", help="Amazon ASIN (e.g. B072MQ5BRX)")
    parser.add_argument("--format", choices=("json", "csv"), default="json")
    args = parser.parse_args()

    api_key = os.environ.get("SERPAPI_API_KEY")
    if not api_key:
        print("error: SERPAPI_API_KEY env var is required", file=sys.stderr)
        return 2

    videos = fetch_videos(args.asin, api_key)

    if args.format == "json":
        json.dump(videos, sys.stdout, indent=2)
        sys.stdout.write("\n")
    else:
        fields = ["position", "title", "duration", "vendor", "date", "link", "thumbnail"]
        writer = csv.DictWriter(sys.stdout, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(videos)
    return 0


if __name__ == "__main__":
    sys.exit(main())
