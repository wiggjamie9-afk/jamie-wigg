#!/usr/bin/env python3
"""
One-time YouTube authentication.
Run this ONCE to generate token.json, then paste the contents into
GitHub Settings → Secrets → YOUTUBE_TOKEN.

Usage:
  python kids-channel/youtube_auth.py
"""

import json
import time
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Run: pip install requests")
    sys.exit(1)

TOKEN_FILE = Path(__file__).parent / "token.json"

# Load from .env manually (avoid needing dotenv)
env_file = Path(__file__).parent.parent / ".env"
creds = {}
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            creds[k.strip()] = v.strip()

CLIENT_ID = creds.get("YOUTUBE_CLIENT_ID", "")
CLIENT_SECRET = creds.get("YOUTUBE_CLIENT_SECRET", "")
SCOPE = "https://www.googleapis.com/auth/youtube.upload"

if not CLIENT_ID or not CLIENT_SECRET:
    print("ERROR: YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET must be in .env")
    sys.exit(1)


def get_device_code():
    r = requests.post(
        "https://oauth2.googleapis.com/device/code",
        data={"client_id": CLIENT_ID, "scope": SCOPE},
    )
    r.raise_for_status()
    return r.json()


def poll_for_token(device_code, interval):
    while True:
        time.sleep(interval)
        r = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "device_code": device_code,
                "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
            },
        )
        data = r.json()
        if "access_token" in data:
            return data
        error = data.get("error", "")
        if error == "authorization_pending":
            print("  … waiting for you to approve")
        elif error == "slow_down":
            interval += 5
        else:
            print(f"  Error: {data}")
            sys.exit(1)


def write_summary(text):
    import os
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        with open(summary_file, "a") as f:
            f.write(text + "\n")


def main():
    print("Getting device code from Google...")
    dc = get_device_code()

    url = dc['verification_url']
    code = dc['user_code']

    print()
    print("=" * 60)
    print("STEP 1 — Open this URL in Safari on your phone:")
    print(f"  {url}")
    print()
    print("STEP 2 — Enter this code when asked:")
    print(f"  {code}")
    print()
    print("STEP 3 — Come back here after approving.")
    print("=" * 60)
    print()
    print("Waiting for you to approve...")

    # Also write to GitHub Actions step summary so it's visible on the run page
    write_summary(f"## Approve YouTube Access\n")
    write_summary(f"**1. Open this URL on your phone:**\n\n{url}\n")
    write_summary(f"**2. Enter this code:**\n\n```\n{code}\n```\n")
    write_summary(f"*(Then come back and wait — the workflow will finish automatically)*\n")

    token = poll_for_token(dc["device_code"], dc.get("interval", 5))

    # Build a token.json compatible with google-auth
    from datetime import datetime, timezone, timedelta
    expires_in = token.get("expires_in", 3600)
    expiry = (datetime.now(timezone.utc) + timedelta(seconds=expires_in)).isoformat()
    token_data = {
        "access_token": token["access_token"],
        "refresh_token": token.get("refresh_token", ""),
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scopes": [SCOPE],
        "expiry": expiry,
    }

    TOKEN_FILE.write_text(json.dumps(token_data, indent=2))
    print(f"\n✅ Token saved to: {TOKEN_FILE}")
    print()
    print("=" * 60)
    print("NOW: Copy the contents below into GitHub:")
    print("  Settings → Secrets and variables → Actions")
    print("  → New repository secret → Name: YOUTUBE_TOKEN")
    print("=" * 60)
    print()
    print(TOKEN_FILE.read_text())


if __name__ == "__main__":
    main()
