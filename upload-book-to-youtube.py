#!/usr/bin/env python3
"""
YouTube Book Upload Script for "Sunny's Cozy Quokka Bedtime Tales"
Uploads individual books with metadata, thumbnails, and playlist assignment.
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

# Load environment variables
load_dotenv()

# Configuration
TOKEN_FILE = '.youtube_token.pickle'
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']

# Story titles for all 17 books
STORY_TITLES = {
    1: "Sunny Watches the Stars Come Out",
    2: "Sunny and the Autumn Leaves",
    3: "Sunny Finds the Fireflies",
    4: "Sunny's Forest Friends",
    5: "Sunny and the Gentle Moon",
    6: "Sunny in the Garden",
    7: "Sunny and the Soft Rain",
    8: "Sunny's Cosy Burrow",
    9: "Sunny Listens to the Night",
    10: "Sunny and the Gentle Breeze",
    11: "Sunny's Dream Adventure",
    12: "Sunny Watches the Sunset",
    13: "Sunny and the Wildflowers",
    14: "Sunny Under the Tree",
    15: "Sunny's Quiet Moment",
    16: "Sunny and the Stars Again",
    17: "Sunny's Beautiful Night"
}

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
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*70}")
    print(f"{text.center(70)}")
    print(f"{'='*70}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def progress_bar(current, total, length=30):
    """Display a progress bar"""
    percent = current / total
    filled = int(length * percent)
    bar = '█' * filled + '░' * (length - filled)
    return f"[{bar}] {percent*100:.1f}%"

def authenticate_youtube():
    """Authenticate with YouTube API"""
    creds = None

    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    elif not creds or not creds.valid:
        print_error("Authentication failed - run setup-youtube-channel.py first")
        sys.exit(1)

    return creds

def get_youtube_service(creds):
    """Build YouTube API service"""
    return build('youtube', 'v3', credentials=creds)

def find_video_file(book_number):
    """Find the MP4 video file for a given book"""
    book_num_zero = str(book_number).zfill(3)
    book_num_plain = str(book_number)

    # Priority order of file locations
    possible_locations = [
        f"/home/user/jamie-wigg/BOOK-{book_num_zero}-FINAL/BOOK-{book_num_zero}.mp4",
        f"/home/user/jamie-wigg/BOOK-{book_num_plain}-FINAL/BOOK-{book_num_plain}.mp4",
        f"/home/user/jamie-wigg/BOOK-{book_num_zero}-COMPLETE/BOOK-{book_num_zero}-COMPLETE.mp4",
        f"/home/user/jamie-wigg/BOOK-{book_num_zero}-SUNNY-FINAL.mp4",
    ]

    for location in possible_locations:
        if os.path.exists(location):
            return location

    return None

def find_thumbnail_file(book_number):
    """Find the thumbnail image for a given book"""
    book_num_plain = str(book_number)

    # Check various possible thumbnail locations
    possible_patterns = [
        f"/home/user/jamie-wigg/BOOK-{book_num_plain}-HIGGSFIELD/assets/*.png",
        f"/home/user/jamie-wigg/BOOK-{book_num_plain}-HIGGSFIELD/assets/*.jpg",
        f"/home/user/jamie-wigg/thumbnails/BOOK-{book_num_plain}*.png",
    ]

    import glob
    for pattern in possible_patterns:
        matches = glob.glob(pattern)
        if matches:
            return matches[0]

    return None

def upload_video(youtube_service, video_path, title, description, tags, playlist_id,
                 thumbnail_path=None, privacy_status='unlisted'):
    """Upload video to YouTube"""
    try:
        print_info(f"Uploading video: {Path(video_path).name}")

        # Create request body
        body = {
            'snippet': {
                'title': title,
                'description': description,
                'tags': tags,
                'categoryId': '22'  # Shorts and Entertainment
            },
            'status': {
                'privacyStatus': privacy_status,
                'madeForKids': True  # Mark as made for kids
            }
        }

        # Upload video file
        media = MediaFileUpload(
            video_path,
            mimetype='video/mp4',
            resumable=True,
            chunksize=10 * 1024 * 1024  # 10MB chunks
        )

        request = youtube_service.videos().insert(
            part='snippet,status',
            body=body,
            media_body=media,
            onUploadProgress=on_upload_progress
        )

        response = None
        while response is None:
            try:
                status, response = request.next_chunk()
                if status:
                    percent = int(status.progress() * 100)
                    print(f"\r  {progress_bar(status.progress(), 1.0, 25)}", end='', flush=True)
            except HttpError as e:
                if e.resp.status in [500, 502, 503, 504]:
                    print_warning("Temporary API error, retrying...")
                    time.sleep(5)
                else:
                    raise

        video_id = response['id']
        print()  # New line after progress bar
        print_success(f"Video uploaded: {video_id}")

        # Upload thumbnail if available
        if thumbnail_path and os.path.exists(thumbnail_path):
            try:
                print_info("Uploading custom thumbnail...")
                youtube_service.thumbnails().set(
                    videoId=video_id,
                    media_body=MediaFileUpload(
                        thumbnail_path,
                        mimetype='image/png'
                    )
                ).execute()
                print_success("Thumbnail uploaded")
            except HttpError as e:
                print_warning(f"Could not upload thumbnail: {e}")

        # Add video to playlist
        if playlist_id:
            try:
                print_info(f"Adding to playlist...")
                youtube_service.playlistItems().insert(
                    part='snippet',
                    body={
                        'snippet': {
                            'playlistId': playlist_id,
                            'resourceId': {
                                'kind': 'youtube#video',
                                'videoId': video_id
                            }
                        }
                    }
                ).execute()
                print_success("Added to playlist")
            except HttpError as e:
                print_warning(f"Could not add to playlist: {e}")

        return video_id

    except HttpError as e:
        print_error(f"API Error: {e}")
        raise

def on_upload_progress(status):
    """Callback for upload progress (optional)"""
    pass

def generate_description(book_number, story_title, next_book_number=None):
    """Generate video description with metadata"""
    description = f"""Sunny's Cozy Quokka Bedtime Tales - Book {book_number}: {story_title}

Join little Sunny the quokka on another gentle adventure toward peaceful sleep. This warm, calming bedtime story is designed to help children drift off naturally with soothing narration and beautiful imagery.

Perfect for:
  • Bedtime routines
  • Wind-down time
  • Relaxation and sleep
  • Children ages 3-8
  • Anyone needing gentle, peaceful content

Story Theme: {get_story_theme(book_number)}

All 17 books in the series:
  Book 1: Sunny Watches the Stars Come Out
  Book 2: Sunny and the Autumn Leaves
  Book 3: Sunny Finds the Fireflies
  Book 4: Sunny's Forest Friends
  Book 5: Sunny and the Gentle Moon
  Book 6: Sunny in the Garden
  Book 7: Sunny and the Soft Rain
  Book 8: Sunny's Cosy Burrow
  Book 9: Sunny Listens to the Night
  Book 10: Sunny and the Gentle Breeze
  Book 11: Sunny's Dream Adventure
  Book 12: Sunny Watches the Sunset
  Book 13: Sunny and the Wildflowers
  Book 14: Sunny Under the Tree
  Book 15: Sunny's Quiet Moment
  Book 16: Sunny and the Stars Again
  Book 17: Sunny's Beautiful Night

"""

    if next_book_number and next_book_number <= 17:
        next_title = STORY_TITLES.get(next_book_number, "")
        description += f"\n📖 Next: Book {next_book_number}: {next_title}"

    description += """

---
Sunny's Cozy Quokka Bedtime Tales - Where gentle stories lead to peaceful dreams.

Tags: #bedtime #children #story #sleep #quokka #animated #bedtimestories #kidsbooks #sleepstories
"""

    return description

def get_story_theme(book_number):
    """Get theme description for each book"""
    themes = {
        1: "Golden hour → twilight → starry night",
        2: "Golden leaves falling, preparing for rest",
        3: "Tiny lights appearing in the dusk",
        4: "Meeting gentle animals, finding comfort in companionship",
        5: "Moon rising, light changing, peaceful observation",
        6: "Surrounded by growing things, observing nature's rest",
        7: "Rain falling, cosy shelter, soothing sounds",
        8: "Safe home, warm shelter, personal space",
        9: "Quiet sounds, learning to listen, finding peace in silence",
        10: "Wind as touch, movement without force, comfort",
        11: "Imagination, floating into dreams, peaceful journey",
        12: "Day ending, colours changing, peaceful transition",
        13: "Natural beauty, simplicity, finding joy in small things",
        14: "Protection, shelter, roots of home",
        15: "Stillness, peace, contentment, meditation",
        16: "Returning to familiar beauty, rhythms, trust",
        17: "Full circle, acceptance, peace, completion"
    }
    return themes.get(book_number, "A gentle bedtime story")

def main():
    parser = argparse.ArgumentParser(
        description='Upload Sunny\'s Cozy Quokka Bedtime Tales to YouTube',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 upload-book-to-youtube.py --book 1
  python3 upload-book-to-youtube.py --book 5 --status public
  python3 upload-book-to-youtube.py --book 10 --no-playlist
        """
    )
    parser.add_argument('--book', type=int, required=True, help='Book number (1-17)')
    parser.add_argument('--status', choices=['public', 'unlisted', 'private'], default='unlisted',
                        help='Video privacy status (default: unlisted)')
    parser.add_argument('--no-playlist', action='store_true', help='Do not add to playlist')
    parser.add_argument('--no-thumbnail', action='store_true', help='Do not upload thumbnail')

    args = parser.parse_args()

    # Validate book number
    if args.book < 1 or args.book > 17:
        print_error(f"Invalid book number: {args.book}. Must be between 1 and 17.")
        return 1

    # Load configuration
    channel_id = os.getenv('YOUTUBE_CHANNEL_ID')
    playlist_id = os.getenv('YOUTUBE_PLAYLIST_ID') if not args.no_playlist else None

    if not channel_id:
        print_error("YOUTUBE_CHANNEL_ID not found in .env")
        print_info("Run: python3 setup-youtube-channel.py")
        return 1

    try:
        print(f"\n{Colors.OKBLUE}{Colors.BOLD}")
        print(f"""
        ╔═══════════════════════════════════════════════════════════════════╗
        ║   Sunny's Cozy Quokka Bedtime Tales - YouTube Upload              ║
        ║   Book {args.book} of 17: {STORY_TITLES.get(args.book, "")}
        ╚═══════════════════════════════════════════════════════════════════╝
        """)
        print(Colors.ENDC)

        # Authenticate
        print_info("Authenticating with YouTube API...")
        creds = authenticate_youtube()
        youtube_service = get_youtube_service(creds)
        print_success("Authenticated")

        # Find video file
        print_info("Locating video file...")
        video_path = find_video_file(args.book)
        if not video_path or not os.path.exists(video_path):
            print_error(f"Video file not found for Book {args.book}")
            print_warning("Expected in BOOK-{N}-FINAL/ directory")
            return 1
        print_success(f"Found: {video_path}")

        # Find thumbnail
        thumbnail_path = None
        if not args.no_thumbnail:
            print_info("Looking for thumbnail...")
            thumbnail_path = find_thumbnail_file(args.book)
            if thumbnail_path:
                print_success(f"Found: {thumbnail_path}")
            else:
                print_warning(f"No custom thumbnail found for Book {args.book}")

        # Prepare metadata
        story_title = STORY_TITLES.get(args.book, "")
        title = f"Sunny's Cozy Quokka Bedtime Tales - Book {args.book}: {story_title}"
        description = generate_description(args.book, story_title, args.book + 1)
        tags = ['bedtime', 'children', 'quokka', 'sleep', 'story', 'animated',
                'bedtimestories', 'kidsbooks', 'sleepstories', 'relaxation']

        # Display metadata
        print_header("Upload Details")
        print(f"Title: {title}")
        print(f"\nDescription (first 200 chars):\n{description[:200]}...")
        print(f"\nPrivacy: {args.status.upper()}")
        if playlist_id:
            print(f"Playlist: Enabled")
        print()

        # Confirm upload
        response = input(f"{Colors.WARNING}Ready to upload? (y/n) {Colors.ENDC}")
        if response.lower() != 'y':
            print_info("Upload cancelled")
            return 0

        # Upload
        print_header("Uploading")
        video_id = upload_video(
            youtube_service,
            video_path,
            title,
            description,
            tags,
            playlist_id,
            thumbnail_path if not args.no_thumbnail else None,
            args.status
        )

        # Success
        youtube_url = f"https://www.youtube.com/watch?v={video_id}"
        print_header("Upload Complete!")
        print(f"""
{Colors.OKGREEN}Video Details:{Colors.ENDC}
  Title: {title}
  Video ID: {video_id}
  URL: {youtube_url}
  Status: {args.status.upper()}

{Colors.OKGREEN}Next Steps:{Colors.ENDC}
  1. Visit: {youtube_url}
  2. Review: title, description, thumbnail
  3. Add chapters/segments if needed
  4. Share on social media

{Colors.INFO}Upload Log:{Colors.ENDC}
  Timestamp: {datetime.now().isoformat()}
  File: {video_path}
        """)

        # Save to upload log
        log_file = 'youtube_upload_log.json'
        log_entry = {
            'book_number': args.book,
            'title': title,
            'video_id': video_id,
            'url': youtube_url,
            'status': args.status,
            'timestamp': datetime.now().isoformat(),
            'thumbnail': bool(thumbnail_path),
            'in_playlist': bool(playlist_id)
        }

        log_data = []
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                log_data = json.load(f)

        log_data.append(log_entry)

        with open(log_file, 'w') as f:
            json.dump(log_data, f, indent=2)

        print_success(f"Logged to {log_file}")
        return 0

    except Exception as e:
        print_error(f"Upload failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
