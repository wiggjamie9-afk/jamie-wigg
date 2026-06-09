#!/usr/bin/env python3
"""Upload Sunny's Cozy Bedtime Tales to YouTube"""

import json
import sys
from pathlib import Path
from datetime import datetime
import subprocess

# Load token
TOKEN_FILE = Path(__file__).parent / "token.json"
VIDEOS_DIR = Path(__file__).parent.parent / "sunny-bedtime-videos"

if not TOKEN_FILE.exists():
    print("❌ token.json not found. Run youtube_auth.py first.")
    sys.exit(1)

with open(TOKEN_FILE) as f:
    token_data = json.load(f)

access_token = token_data.get("access_token")

# Books to upload (the 17 remade ones)
BOOKS_TO_UPLOAD = [33, 34, 35, 41, 43, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 60]

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

def upload_video(book_num, title, video_path):
    """Upload a video to YouTube"""

    body = {
        "snippet": {
            "title": f"Sunny's Cozy Bedtime Tales - {title}",
            "description": f"Calm bedtime story with peaceful narration. Part of Sunny's Cozy Bedtime Tales - perfect for children's sleep time.\n\nEpisode {book_num}",
            "tags": ["bedtime story", "kids", "sleep", "quokka", "cozy"],
            "categoryId": "22",  # People & Blogs
        },
        "status": {
            "privacyStatus": "public",
            "madeForKids": True,
        }
    }

    cmd = f"""
    curl -X POST \\
      -H "Authorization: Bearer {access_token}" \\
      -H "Content-Type: application/json" \\
      --data '{json.dumps(body)}' \\
      -F "video=@{video_path}" \\
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status"
    """

    print(f"  📤 Uploading Book {book_num}: {title}...", end=" ", flush=True)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.returncode == 0:
        try:
            data = json.loads(result.stdout)
            video_id = data.get("id")
            print(f"✓ (ID: {video_id})")
            return video_id
        except:
            print(f"⚠ Upload may have succeeded (check manually)")
            return None
    else:
        print(f"❌ Failed: {result.stderr[:100]}")
        return None

def main():
    print("\n" + "="*70)
    print("UPLOADING TO YOUTUBE: 17 Bedtime Stories")
    print("="*70 + "\n")

    uploaded = []

    for book_num in BOOKS_TO_UPLOAD:
        title = TITLES.get(book_num, f"Episode {book_num}")
        video_dir = VIDEOS_DIR / f"book-{book_num:03d}"
        video_file = video_dir / f"video-{book_num:03d}.mp4"

        if not video_file.exists():
            print(f"⚠ Book {book_num}: Video not found")
            continue

        video_id = upload_video(book_num, title, video_file)
        if video_id:
            uploaded.append({
                "book": book_num,
                "title": title,
                "video_id": video_id,
                "url": f"https://youtu.be/{video_id}"
            })

    print("\n" + "="*70)
    print(f"✅ UPLOADED {len(uploaded)}/17 VIDEOS")
    print("="*70)

    # Save upload log
    log_file = Path(__file__).parent / "youtube_uploads.json"
    with open(log_file, 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "uploaded_count": len(uploaded),
            "uploads": uploaded
        }, f, indent=2)

    print("\nUpload log saved to: youtube_uploads.json")
    print("\nYour videos:")
    for item in uploaded:
        print(f"  • {item['title']}: {item['url']}")

if __name__ == "__main__":
    main()
