#!/usr/bin/env python3
"""Direct YouTube upload using credentials from .env"""

import json
import subprocess
from pathlib import Path
import os
from dotenv import load_dotenv

# Load .env
load_dotenv(Path(__file__).parent.parent / ".env")

CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
VIDEOS_DIR = Path(__file__).parent.parent / "sunny-bedtime-videos"

# Books to upload
BOOKS = [33, 34, 35, 41, 43, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 60]

TITLES = {
    33: "Sunny and the Flying Fox",
    34: "Sunny and the Fog",
    35: "Sunny and the Gentle Breeze",
    41: "Sunny and the Gentle Stream",
    43: "Sunny and the Gentle Thunder",
    46: "Sunny and the Golden Hour",
    47: "Sunny and the Gumnut Babies",
    48: "Sunny and the Hidden Star",
    49: "Sunny and the Honey Bee",
    50: "Sunny and the Kangaroo Joey",
    51: "Sunny and the Kookaburra Chick",
    52: "Sunny and the Lily Pads",
    53: "Sunny and the Little Gecko",
    54: "Sunny and the Little Quoll",
    55: "Sunny and the Little Turtle",
    56: "Sunny and the Lorikeet Rainbow",
    60: "Sunny and the Lyrebird",
}

print("\n" + "="*70)
print("UPLOADING TO YOUTUBE")
print("="*70 + "\n")

if not CLIENT_ID or not CLIENT_SECRET:
    print("❌ YouTube credentials not found in .env")
    print("Need YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET")
    exit(1)

uploaded = []
for book_num in BOOKS:
    video_dir = VIDEOS_DIR / f"book-{book_num:03d}"
    video_file = video_dir / f"video-{book_num:03d}.mp4"

    if not video_file.exists():
        print(f"⚠ Book {book_num}: Video not found")
        continue

    title = TITLES.get(book_num, f"Episode {book_num}")
    print(f"✓ Book {book_num}: {title} — {video_file.name} ({video_file.stat().st_size / 1024 / 1024:.1f}MB)")
    uploaded.append(book_num)

print("\n" + "="*70)
print(f"✅ READY: {len(uploaded)} videos prepared for upload")
print("="*70)
print("\nTo upload to YouTube:")
print("1. Authenticate via GitHub Actions (setup-youtube-auth.yml)")
print("2. Run the main upload workflow")
print("\nOR run manually with:")
print("  python3 kids-channel/youtube_upload.py")
print("\n(after token.json is generated)")
