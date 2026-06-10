#!/usr/bin/env python3
"""
Step 4: Upload Book 1 video to YouTube
Uses YouTube Data API with OAuth credentials
"""

import os
import sys
import json
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

VIDEO_FILE = Path("/home/user/jamie-wigg/BOOK-1-VIDEO/BOOK-1-Sunny-and-the-Flying-Fox.mp4")
TOKEN_FILE = Path("/home/user/jamie-wigg/kids-channel/token.json")

# Video metadata
VIDEO_TITLE = "Sunny and the Flying Fox - Bedtime Story"
VIDEO_DESCRIPTION = """Join Little Sunny the quokka as she watches flying foxes glide silently through the twilight on their velvet wings. A gentle, calming bedtime story for toddlers.

🌙 Perfect for:
• Bedtime routines
• Toddlers & preschoolers
• Nature lovers
• Calming stories

📚 More Sunny Stories coming soon!

Subscribe for new episodes every week: https://www.youtube.com/@SunnyBedtimeTales

#BedtimeStory #KidsStories #ToddlerStories #SleepStory #SunnyQuokka"""

VIDEO_TAGS = [
    "bedtime story",
    "toddler",
    "kids cartoon",
    "quokka",
    "Australian animals",
    "gentle stories",
    "sleep story",
    "nature for kids",
    "calm cartoon",
    "toddler bedtime video",
    "Sunny's Cozy Quokka Bedtime Tales"
]

CATEGORY_ID = "22"  # Shorts/Stories

def get_youtube_service():
    """Get authenticated YouTube API service"""
    creds = None

    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    else:
        raise FileNotFoundError(f"Token file not found: {TOKEN_FILE}")

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())

    service = build("youtube", "v3", credentials=creds)
    return service

def upload_video(youtube_service, video_file: Path) -> str:
    """Upload video to YouTube with metadata"""
    if not video_file.exists():
        raise FileNotFoundError(f"Video file not found: {video_file}")

    print("=" * 70)
    print("Uploading to YouTube")
    print("=" * 70)
    print()
    print(f"Video: {video_file.name}")
    print(f"Size: {video_file.stat().st_size / 1024 / 1024:.1f}MB")
    print(f"Title: {VIDEO_TITLE}")
    print(f"Tags: {len(VIDEO_TAGS)} tags")
    print()

    body = {
        "snippet": {
            "title": VIDEO_TITLE,
            "description": VIDEO_DESCRIPTION,
            "tags": VIDEO_TAGS,
            "categoryId": CATEGORY_ID,
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": {
            "privacyStatus": "public",
            "embeddable": True,
            "publicStatsViewable": True,
        },
        "processingDetails": {
            "processingProgress": {
                "partsProcessed": 0,
                "partsTotal": 0,
                "timeLeftMs": 0
            }
        }
    }

    print("Creating upload request with metadata...")
    print(f"  Title: {body['snippet']['title']}")
    print(f"  Description length: {len(body['snippet']['description'])} chars")
    print(f"  Tags: {body['snippet']['tags']}")
    print()

    media = MediaFileUpload(str(video_file), chunksize=-1, resumable=True, mimetype="video/mp4")

    request = youtube_service.videos().insert(
        part="snippet,status,processingDetails",
        body=body,
        media_body=media
    )

    print("Uploading (this may take several minutes)...")
    response = None
    while response is None:
        try:
            status, response = request.next_chunk()
            if status:
                percent = int(status.progress() * 100)
                print(f"  {percent}%")
        except HttpError as e:
            print(f"✗ Upload error: {e}")
            return None

    if response:
        print("\n✓ Upload complete!")
        video_id = response.get("id")
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        print(f"✓ Video ID: {video_id}")
        print(f"✓ URL: {video_url}")

        # Verify metadata was saved
        print("\nVerifying metadata...")
        try:
            verify = youtube_service.videos().list(
                part="snippet",
                id=video_id
            ).execute()
            if verify["items"]:
                saved = verify["items"][0]["snippet"]
                print(f"✓ Title saved: {saved.get('title')}")
                print(f"✓ Tags saved: {saved.get('tags', [])}")
                print(f"✓ Description saved: {len(saved.get('description', ''))} chars")
        except:
            print("(Could not verify metadata)")

        return video_id
    else:
        print("✗ No response from YouTube")
        return None

def main():
    if not VIDEO_FILE.exists():
        print(f"✗ ERROR: Video not found: {VIDEO_FILE}")
        print("  Run: assemble-book1-video.py first")
        return 1

    try:
        youtube = get_youtube_service()
        print("✓ Authenticated with YouTube")
    except Exception as e:
        print(f"✗ Authentication failed: {e}")
        print("\nFix:")
        print("1. Go to: https://console.cloud.google.com")
        print("2. Create OAuth 2.0 credentials (Desktop app)")
        print("3. Download client_secret.json")
        print("4. Run: python kids-channel/youtube_auth.py")
        print("5. Paste token.json into GitHub Secrets")
        return 1

    try:
        video_id = upload_video(youtube, VIDEO_FILE)
        if video_id:
            print(f"\n{'=' * 70}")
            print("NEXT STEPS:")
            print("=" * 70)
            print(f"1. Video uploaded: https://www.youtube.com/watch?v={video_id}")
            print(f"2. Wait 1-2 minutes for processing")
            print(f"3. Go to studio.youtube.com to:")
            print(f"   - Add thumbnail")
            print(f"   - Enable monetization (AdSense, Memberships)")
            print(f"   - Add to playlist 'Sunny Bedtime Tales'")
            print(f"4. Share to TikTok, Instagram, etc.")
            return 0
        else:
            return 1
    except Exception as e:
        print(f"✗ Upload failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
