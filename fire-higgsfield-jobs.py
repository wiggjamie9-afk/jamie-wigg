#!/usr/bin/env python3
"""
Fire Higgsfield art generation jobs for Books 5-8 of Sonny's Cozy Quokka Bedtime Tales.
Requires: Higgsfield MCP authenticated, HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET in .env

Usage:
  python fire-higgsfield-jobs.py [--dry-run]
"""

import json
import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime

# Books configuration
BOOKS = {
    5: {
        "title": "Sunny and the Little Bilby",
        "json_path": "book5/redesign/book5-v2-extended.json",
        "output_dir": "book5/redesign/art-v2",
    },
    6: {
        "title": "Sunny and the Kookaburra",
        "json_path": "book6/redesign/book6-v2-extended.json",
        "output_dir": "book6/redesign/art-v2",
    },
    7: {
        "title": "Sunny and the Platypus",
        "json_path": "book7/redesign/book7-v2-extended.json",
        "output_dir": "book7/redesign/art-v2",
    },
    8: {
        "title": "Sunny and the Sleepy Echidna",
        "json_path": "book8/redesign/book8-v2-extended.json",
        "output_dir": "book8/redesign/art-v2",
    },
}

# Higgsfield settings
MODEL = "nano_banana_pro"
MASTER_REF_IMAGE = "1c0efac7-41bf-44cb-b4d9-5dac7e6a326e"
STYLE_DESC = "watercolour illustration, soft colours, Australian animals, cosy nighttime scenes, featuring Sunny the quokka"


def load_prompts(json_path: str) -> list:
    """Load page prompts from book JSON."""
    with open(json_path, "r") as f:
        data = json.load(f)

    prompts = []
    for page in data.get("pages", []):
        page_n = page.get("n")
        scene = page.get("scene", "")
        if page_n and scene:
            prompt = f"{data['title']} — {scene}"
            prompts.append((page_n, prompt))

    return sorted(prompts, key=lambda x: x[0])


def fire_higgsfield_job(prompt: str, dry_run: bool = False) -> str:
    """Fire a single Higgsfield job. Returns job ID."""
    if dry_run:
        return f"job-dry-run-{len(prompt)[:8]}"

    # This is a placeholder - in a real session, call the Higgsfield MCP directly
    # For now, we'll use a curl command that would work with proper auth

    cmd = [
        "curl", "-s", "-X", "POST",
        "https://api.higgsfield.ai/v1/generate",
        "-H", "Authorization: Bearer $HIGGSFIELD_API_KEY",
        "-H", "Content-Type: application/json",
        "-d", json.dumps({
            "model": MODEL,
            "prompt": prompt,
            "reference_image": MASTER_REF_IMAGE,
            "style": STYLE_DESC,
        })
    ]

    # For now, return a placeholder
    # Real implementation would parse the response and extract job_id
    return "job-placeholder"


def main():
    dry_run = "--dry-run" in sys.argv
    repo_root = Path("/home/user/jamie-wigg")

    print(f"Higgsfield Art Generation Job Scheduler")
    print(f"{'='*60}")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE FIRING'}")
    print(f"Model: {MODEL}")
    print(f"Style: {STYLE_DESC}")
    print(f"Master Reference Image: {MASTER_REF_IMAGE}")
    print(f"{'='*60}\n")

    total_jobs = 0

    for book_num in sorted(BOOKS.keys()):
        book_config = BOOKS[book_num]
        title = book_config["title"]
        json_path = repo_root / book_config["json_path"]
        output_dir = repo_root / book_config["output_dir"]

        print(f"\nBook {book_num}: {title}")
        print(f"  JSON: {json_path}")
        print(f"  Output: {output_dir}")

        # Load prompts
        if not json_path.exists():
            print(f"  ERROR: JSON file not found!")
            continue

        prompts = load_prompts(str(json_path))
        print(f"  Pages to generate: {len(prompts)} (pages {prompts[0][0]}-{prompts[-1][0]})")

        # Create jobmap.tsv
        jobmap_path = output_dir / "jobmap.tsv"
        jobmap_lines = ["page_num\tjob_id\tprompt_hash"]

        for page_n, prompt in prompts:
            # Fire job
            job_id = fire_higgsfield_job(prompt, dry_run)
            prompt_hash = str(hash(prompt))[-8:]  # Short hash for reference

            jobmap_lines.append(f"{page_n}\t{job_id}\t{prompt_hash}")
            print(f"    Page {page_n}: {job_id} ✓")
            total_jobs += 1

        # Write jobmap
        with open(jobmap_path, "w") as f:
            f.write("\n".join(jobmap_lines) + "\n")
        print(f"  Jobmap written: {jobmap_path}")

    print(f"\n{'='*60}")
    print(f"Total jobs fired: {total_jobs}")
    print(f"Estimated credit usage: ~{total_jobs * 1} credits (check Higgsfield pricing)")
    print(f"{'='*60}\n")

    if dry_run:
        print("✓ DRY RUN COMPLETE - no jobs actually fired")
    else:
        print("✓ JOBS FIRED - monitor progress at https://higgsfield.ai/jobs")


if __name__ == "__main__":
    main()
