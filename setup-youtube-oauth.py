#!/usr/bin/env python3
"""
YouTube OAuth Setup for Sunny's Bedtime Tales Channel
Generates token.json for uploading videos to @SunnyBedtimeTales
"""

import json
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
import os

# YouTube API OAuth scopes
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

# Path to save token
TOKEN_DIR = Path("/home/user/jamie-wigg/kids-channel")
TOKEN_FILE = TOKEN_DIR / "token.json"
TOKEN_DIR.mkdir(parents=True, exist_ok=True)

# Your YouTube OAuth credentials (from .env)
YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")

if not YOUTUBE_CLIENT_ID or not YOUTUBE_CLIENT_SECRET:
    print("❌ Error: Missing YouTube credentials in .env")
    print("   Required:")
    print("   - YOUTUBE_CLIENT_ID")
    print("   - YOUTUBE_CLIENT_SECRET")
    exit(1)

def setup_oauth():
    """Set up YouTube OAuth and save token"""

    print("=" * 70)
    print("🔐 YouTube OAuth Setup for @SunnyBedtimeTales")
    print("=" * 70)
    print()
    print("This script will:")
    print("1. Open a browser for you to authorize video uploads")
    print("2. Save your authorization token to kids-channel/token.json")
    print("3. Enable automated video uploads to your channel")
    print()
    print("📍 Follow the steps in your browser (you may need to log in)")
    print()

    # Create OAuth flow
    client_config = {
        "installed": {
            "client_id": YOUTUBE_CLIENT_ID,
            "client_secret": YOUTUBE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost:8080/"]
        }
    }

    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
    creds = flow.run_local_server(port=8080)

    # Save token
    with open(TOKEN_FILE, 'w') as token:
        json.dump(json.loads(creds.to_json()), token)

    print()
    print("=" * 70)
    print("✅ SUCCESS!")
    print("=" * 70)
    print(f"Token saved to: {TOKEN_FILE}")
    print()
    print("You can now upload videos:")
    print("   python3 upload-book1-to-youtube.py")
    print()

if __name__ == "__main__":
    try:
        setup_oauth()
    except Exception as e:
        print(f"❌ Error during OAuth setup: {e}")
        print()
        print("Alternative: Set up OAuth manually at:")
        print("   https://developers.google.com/youtube/v3/guides/auth/installed-apps")
        exit(1)
