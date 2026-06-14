#!/usr/bin/env python3
"""
YouTube Channel Setup Script for "Sunny's Cozy Quokka Bedtime Tales"
Authenticates with YouTube Data API and creates/configures the channel and playlist.
"""

import os
import json
import pickle
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv, set_key

# Load environment variables
load_dotenv()

# YouTube API scopes
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
CREDENTIALS_FILE = 'youtube_oauth_credentials.json'
TOKEN_FILE = '.youtube_token.pickle'
ENV_FILE = '.env'

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}")
    print(f"{text.center(60)}")
    print(f"{'='*60}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def authenticate_youtube():
    """Authenticate with YouTube API using OAuth 2.0"""
    print_header("YouTube API Authentication")

    creds = None

    # Load existing token if available
    if os.path.exists(TOKEN_FILE):
        print_info(f"Loading existing credentials from {TOKEN_FILE}...")
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)

    # Refresh token if needed or create new one
    if creds and creds.expired and creds.refresh_token:
        print_info("Refreshing expired credentials...")
        creds.refresh(Request())
    elif not creds or not creds.valid:
        if not os.path.exists(CREDENTIALS_FILE):
            print_error(f"Missing {CREDENTIALS_FILE}")
            print_warning("To set up OAuth credentials:")
            print(f"""
1. Go to: https://console.cloud.google.com/apis/dashboard
2. Create a new project (e.g., "Sunny's Quokka Bedtime Tales")
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials (Desktop application)
5. Download the credentials JSON as '{CREDENTIALS_FILE}'
6. Place it in this directory: {os.path.abspath('.')}/
            """)
            raise FileNotFoundError(f"Please create {CREDENTIALS_FILE} first")

        print_info(f"Creating new OAuth flow from {CREDENTIALS_FILE}...")
        flow = InstalledAppFlow.from_client_secrets_file(
            CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=8080)

        # Save token for future use
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
        print_success("Credentials saved to .youtube_token.pickle")

    return creds

def get_youtube_service(creds):
    """Build YouTube API service"""
    return build('youtube', 'v3', credentials=creds)

def get_or_create_channel(youtube_service, channel_handle=None):
    """Get authenticated user's channel or create one"""
    print_header("Channel Configuration")

    try:
        # Get authenticated user's channel
        request = youtube_service.channels().list(
            part='id,snippet,statistics',
            mine=True
        )
        response = request.execute()

        if response['items']:
            channel = response['items'][0]
            channel_id = channel['id']
            channel_title = channel['snippet']['title']
            subscriber_count = channel['statistics'].get('subscriberCount', '0')
            view_count = channel['statistics'].get('viewCount', '0')

            print_success(f"Found existing channel: {channel_title}")
            print_info(f"Channel ID: {channel_id}")
            print_info(f"Subscribers: {subscriber_count} | Views: {view_count}")

            return channel_id, channel_title, channel
        else:
            print_error("No channel found for authenticated user")
            raise ValueError("Cannot create channel via API - use YouTube Studio")

    except HttpError as e:
        print_error(f"API Error: {e}")
        raise

def create_or_get_playlist(youtube_service, channel_id, playlist_title="Sunny's Cozy Quokka Bedtime Tales"):
    """Create or retrieve the series playlist"""
    print_header("Playlist Configuration")

    try:
        # Search for existing playlist
        request = youtube_service.playlists().list(
            part='id,snippet',
            mine=True,
            maxResults=50
        )
        response = request.execute()

        # Check if playlist already exists
        for item in response.get('items', []):
            if item['snippet']['title'] == playlist_title:
                playlist_id = item['id']
                print_success(f"Found existing playlist: {playlist_title}")
                print_info(f"Playlist ID: {playlist_id}")
                return playlist_id, item

        # Create new playlist if not found
        print_info(f"Creating new playlist: {playlist_title}")
        request = youtube_service.playlists().insert(
            part='snippet,status',
            body={
                'snippet': {
                    'title': playlist_title,
                    'description': 'A collection of 17 bedtime stories featuring Sunny the quokka, designed to help children drift off to peaceful sleep with calming narratives and gentle imagery.',
                    'tags': ['bedtime', 'children', 'stories', 'sleep', 'quokka', 'animated']
                },
                'status': {
                    'privacyStatus': 'public'
                }
            }
        )
        response = request.execute()
        playlist_id = response['id']
        print_success(f"Playlist created successfully!")
        print_info(f"Playlist ID: {playlist_id}")
        return playlist_id, response

    except HttpError as e:
        print_error(f"API Error: {e}")
        raise

def save_configuration(channel_id, playlist_id):
    """Save configuration to .env file"""
    print_header("Saving Configuration")

    env_path = Path(ENV_FILE)

    # Load existing .env if it exists
    load_dotenv()

    # Set the values
    set_key(env_path, 'YOUTUBE_CHANNEL_ID', channel_id)
    set_key(env_path, 'YOUTUBE_PLAYLIST_ID', playlist_id)

    print_success(f"Configuration saved to {ENV_FILE}")
    print_info(f"YOUTUBE_CHANNEL_ID={channel_id}")
    print_info(f"YOUTUBE_PLAYLIST_ID={playlist_id}")

def save_credentials_to_env(youtube_service):
    """Save API credentials to .env (note: OAuth token is handled via pickle)"""
    # The actual credentials are stored in .youtube_token.pickle
    # This function just confirms the setup is complete
    env_path = Path(ENV_FILE)
    set_key(env_path, 'YOUTUBE_API_CONFIGURED', 'true')
    print_success("YouTube API credentials configured")

def main():
    print(f"\n{Colors.OKBLUE}{Colors.BOLD}")
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║     Sunny's Cozy Quokka Bedtime Tales - YouTube Setup    ║
    ║                  Interactive Configuration                ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    print(Colors.ENDC)

    try:
        # Step 1: Authenticate
        print_info("Step 1/4: Authenticating with YouTube API...")
        creds = authenticate_youtube()
        youtube_service = get_youtube_service(creds)
        print_success("YouTube API authenticated")

        # Step 2: Get channel
        print_info("\nStep 2/4: Retrieving channel information...")
        channel_id, channel_title, channel_data = get_or_create_channel(youtube_service)

        # Step 3: Create/get playlist
        print_info("\nStep 3/4: Setting up playlist...")
        playlist_id, playlist_data = create_or_get_playlist(youtube_service, channel_id)

        # Step 4: Save configuration
        print_info("\nStep 4/4: Saving configuration...")
        save_configuration(channel_id, playlist_id)
        save_credentials_to_env(youtube_service)

        # Summary
        print_header("Setup Complete!")
        print(f"""
{Colors.OKGREEN}Channel Details:{Colors.ENDC}
  Title: {channel_title}
  ID: {channel_id}

{Colors.OKGREEN}Playlist Details:{Colors.ENDC}
  Title: Sunny's Cozy Quokka Bedtime Tales
  ID: {playlist_id}

{Colors.OKGREEN}Next Steps:{Colors.ENDC}
  1. Run: python3 upload-book-to-youtube.py --book 1
  2. Or batch upload: python3 batch-upload-all-books.py

{Colors.WARNING}Important:{Colors.ENDC}
  - OAuth token is stored in: {TOKEN_FILE}
  - Configuration is saved in: {ENV_FILE}
  - Keep both files secure and do not commit to git
        """)

    except Exception as e:
        print_error(f"Setup failed: {str(e)}")
        print_warning("Please check the error above and try again")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())
