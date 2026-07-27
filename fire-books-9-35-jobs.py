#!/usr/bin/env python3
"""
Fire Higgsfield art generation jobs for Books 9-35 (540 images total).
Requires HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET in .env or environment.

Usage:
  python fire-books-9-35-jobs.py --dry-run    # test without firing
  python fire-books-9-35-jobs.py              # fire all 540 jobs
"""

import os
import json
import sys
from pathlib import Path
from typing import Optional
import requests
import time

# Configuration
BOOKS = list(range(9, 36))  # Books 9-35 (27 books)
PAGES_PER_BOOK = 20  # pages 3-22
MODEL = "nano_banana_pro"
MASTER_REFERENCE = "1c0efac7-41bf-44cb-b4d9-5dac7e6a326e"
STYLE = "watercolour illustration, soft colours, Australian animals, cosy nighttime scenes"
ASPECT_RATIO = "2:3"  # portrait (2048×3072)

class HighgsfieldJobFirer:
    def __init__(self, api_key: str, base_url: str = "https://api.higgsfield.ai/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })

    def fire_image_job(self, prompt: str, count: int = 1, dry_run: bool = False) -> Optional[dict]:
        """Fire a single image generation job."""
        payload = {
            "model": MODEL,
            "prompt": prompt,
            "aspect_ratio": ASPECT_RATIO,
            "count": count,
            "medias": [
                {
                    "value": MASTER_REFERENCE,
                    "role": "reference_image"
                }
            ]
        }

        if dry_run:
            print(f"  [DRY RUN] Would fire: {prompt[:60]}...")
            return None

        try:
            url = f"{self.base_url}/generate/image"
            response = self.session.post(url, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()

            # Extract job ID from response
            job_id = result.get("job_id") or result.get("id")
            if not job_id and "jobs" in result and len(result["jobs"]) > 0:
                job_id = result["jobs"][0]["id"]

            if job_id:
                print(f"  ✓ Job fired: {job_id} ({prompt[:50]}...)")
                return {"job_id": job_id, "prompt": prompt}
            else:
                print(f"  ✗ No job ID in response: {result}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"  ✗ Error firing job: {e}")
            return None

    def fire_book_jobs(self, book_num: int, dry_run: bool = False) -> dict:
        """Fire all jobs for a single book."""
        book_titles = {
            9: "Ringtail Possum", 10: "Tassie Devil", 11: "Wombat", 12: "Kea", 13: "Cassowary",
            14: "Numbat", 15: "Bandicoot", 16: "Honeyeater", 17: "Lyrebird", 18: "Wallaby",
            19: "Potoroo", 20: "Lorikeet", 21: "Tasmanian Pademelon", 22: "Fantail", 23: "Quail",
            24: "Sugar Possum", 25: "Kookaburra's Cousin", 26: "Bowerbird", 27: "Brushtail Possum",
            28: "Tawny Frogmouth's Friend", 29: "Rainbow Lorikeet", 30: "Emu", 31: "Laughing Kookaburra",
            32: "Bush Stone-Curlew", 33: "Gang-gang Cockatoo", 34: "Feathertail Glider", 35: "Greatest Adventure"
        }

        print(f"\n📖 Book {book_num}: Sunny and the {book_titles.get(book_num, 'Unknown')}")

        prompts_file = Path(f"book{book_num}/redesign/art-v2/prompts.txt")
        jobmap_file = Path(f"book{book_num}/redesign/art-v2/jobmap.tsv")

        if not prompts_file.exists():
            print(f"  ✗ Prompts file not found: {prompts_file}")
            return {}

        # Read prompts
        prompts = []
        with open(prompts_file) as f:
            for line in f:
                line = line.strip()
                if line:
                    prompts.append(line)

        print(f"  Found {len(prompts)} prompts")

        jobs = {}
        for page_offset, prompt in enumerate(prompts, start=3):  # pages 3-22
            result = self.fire_image_job(prompt, dry_run=dry_run)
            if result:
                jobs[page_offset] = result["job_id"]
                time.sleep(0.5)  # Rate limit: 0.5s between requests

        # Write jobmap.tsv
        if jobs and not dry_run:
            print(f"  Writing {len(jobs)} job IDs to {jobmap_file}...")
            with open(jobmap_file, 'w') as f:
                f.write("page_num\tjob_id\n")
                for page, job_id in sorted(jobs.items()):
                    f.write(f"{page}\t{job_id}\n")
            print(f"  ✓ Wrote {jobmap_file}")

        # Front/back cover jobs (pages 2, 24)
        if not dry_run:
            with open(jobmap_file, 'a') as f:
                f.write(f"2\t[awaiting_cover_art]\n")
                f.write(f"24\t[awaiting_cover_art]\n")

        return jobs

def main():
    dry_run = "--dry-run" in sys.argv

    # Load credentials
    api_key = os.getenv("HIGGSFIELD_API_KEY")
    if not api_key:
        print("❌ HIGGSFIELD_API_KEY not set. Set it in .env or export it:")
        print("   export HIGGSFIELD_API_KEY='your-key-here'")
        sys.exit(1)

    print("🎨 Firing Higgsfield jobs for Books 9-35")
    print(f"   Model: {MODEL}")
    print(f"   Reference: {MASTER_REFERENCE}")
    print(f"   Style: {STYLE}")
    print(f"   Aspect: {ASPECT_RATIO}")
    print(f"   Total jobs: {len(BOOKS)} books × {PAGES_PER_BOOK} pages = {len(BOOKS) * PAGES_PER_BOOK} images")

    if dry_run:
        print("\n[DRY RUN MODE - No jobs will be fired]\n")

    firer = HighgsfieldJobFirer(api_key)
    all_jobs = {}

    for book_num in BOOKS:
        jobs = firer.fire_book_jobs(book_num, dry_run=dry_run)
        all_jobs[book_num] = jobs

    # Summary
    total_jobs = sum(len(jobs) for jobs in all_jobs.values())
    print(f"\n✓ Total jobs: {total_jobs}")

    if total_jobs > 0:
        print(f"\n📊 Jobs by book:")
        for book_num in BOOKS:
            job_count = len(all_jobs[book_num])
            if job_count > 0:
                print(f"   Book {book_num}: {job_count} jobs")

    if not dry_run:
        print("\n📋 Next steps:")
        print("   1. Monitor job progress at https://higgsfield.ai/jobs")
        print("   2. Once all 540 images are ready, create art-fetch-manifest.txt with download URLs")
        print("   3. Push art-fetch-manifest.txt to trigger GitHub CI to fetch and commit images")
        print("   4. Run: python build_book_v2.py 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35")
        print("        (to assemble PDFs/EPUBs for all Books 9-35)")

    return 0

if __name__ == "__main__":
    sys.exit(main())
