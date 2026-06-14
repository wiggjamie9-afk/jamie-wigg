#!/usr/bin/env python3
"""
YouTube Upload Verification Tool for "Sunny's Cozy Quokka Bedtime Tales"
Verifies uploaded videos, playlist status, and metadata completeness.
"""

import os
import sys
import json
import pickle
from pathlib import Path
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load environment variables
load_dotenv()

TOKEN_FILE = '.youtube_token.pickle'
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']

# Color codes
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

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

def get_playlist_videos(youtube_service, playlist_id):
    """Get all videos in the playlist"""
    videos = []
    request = youtube_service.playlistItems().list(
        part='snippet,contentDetails',
        playlistId=playlist_id,
        maxResults=50
    )

    while request:
        response = request.execute()
        for item in response.get('items', []):
            videos.append({
                'position': item['snippet']['position'],
                'title': item['snippet']['title'],
                'video_id': item['contentDetails']['videoId'],
                'published_at': item['snippet']['publishedAt']
            })

        if 'nextPageToken' in response:
            request = youtube_service.playlistItems().list(
                part='snippet,contentDetails',
                playlistId=playlist_id,
                maxResults=50,
                pageToken=response['nextPageToken']
            )
        else:
            break

    return sorted(videos, key=lambda x: x['position'])

def get_video_stats(youtube_service, video_ids):
    """Get statistics for videos"""
    if not video_ids:
        return {}

    stats = {}
    # Process in batches of 50 (API limit)
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i:i+50]
        request = youtube_service.videos().list(
            part='statistics,snippet,status',
            id=','.join(batch)
        )
        response = request.execute()

        for item in response.get('items', []):
            video_id = item['id']
            stats[video_id] = {
                'views': int(item['statistics'].get('viewCount', 0)),
                'likes': int(item['statistics'].get('likeCount', 0)),
                'comments': int(item['statistics'].get('commentCount', 0)),
                'status': item['status']['privacyStatus'],
                'duration': item['snippet'].get('duration', 'N/A')
            }

    return stats

def load_upload_log():
    """Load upload log"""
    if os.path.exists('youtube_upload_log.json'):
        with open('youtube_upload_log.json', 'r') as f:
            return json.load(f)
    return []

def verify_uploads():
    """Verify all uploaded videos"""
    print(f"\n{Colors.OKBLUE}{Colors.BOLD}")
    print("""
    ╔═══════════════════════════════════════════════════════════════════╗
    ║     YouTube Upload Verification - Sunny's Cozy Quokka Tales       ║
    ║                  Check Playlist & Video Status                    ║
    ╚═══════════════════════════════════════════════════════════════════╝
    """)
    print(Colors.ENDC)

    # Load configuration
    channel_id = os.getenv('YOUTUBE_CHANNEL_ID')
    playlist_id = os.getenv('YOUTUBE_PLAYLIST_ID')

    if not channel_id or not playlist_id:
        print_error("Configuration missing - run setup-youtube-channel.py first")
        return 1

    try:
        # Authenticate
        print_info("Authenticating...")
        creds = authenticate_youtube()
        youtube_service = get_youtube_service(creds)
        print_success("Authenticated")

        # Get playlist videos
        print_info("\nFetching playlist contents...")
        videos = get_playlist_videos(youtube_service, playlist_id)
        print_success(f"Found {len(videos)} videos in playlist")

        # Check for gaps
        print_header("Playlist Status")
        print(f"Total videos: {len(videos)}\n")

        expected_count = 17
        if len(videos) < expected_count:
            print_warning(f"Expected {expected_count} videos, found {len(videos)}")

        # Get video IDs and stats
        video_ids = [v['video_id'] for v in videos]
        stats = get_video_stats(youtube_service, video_ids)

        # Get upload log
        upload_log = load_upload_log()
        log_by_video_id = {log.get('video_id'): log for log in upload_log}

        # Display video list
        print(f"{Colors.BOLD}Videos in Playlist:{Colors.ENDC}\n")

        all_correct_order = True
        for i, video in enumerate(videos, 1):
            expected_book = i
            is_correct = str(expected_book) in video['title']

            # Get stats
            vid_stats = stats.get(video['video_id'], {})
            views = vid_stats.get('views', 0)
            status = vid_stats.get('status', 'unknown')

            # Color code
            if is_correct:
                color = Colors.OKGREEN
                icon = '✓'
            else:
                color = Colors.WARNING
                icon = '⚠'
                all_correct_order = False

            # Status indicator
            if status == 'public':
                status_icon = '🔓'
            elif status == 'unlisted':
                status_icon = '🔒'
            else:
                status_icon = '❓'

            print(f"{color}{icon} {i:2d}. {video['title'][:50]}{Colors.ENDC}")
            print(f"    ID: {video['video_id']} | Views: {views:>6,} | {status_icon} {status}")

        # Summary
        print_header("Verification Summary")

        if all_correct_order:
            print_success("All videos in correct order")
        else:
            print_warning("Some videos appear out of order")

        # Check for all 17 books
        book_numbers = set()
        for video in videos:
            for i in range(1, 18):
                if f"Book {i}" in video['title'] or f"Book {i:02d}" in video['title']:
                    book_numbers.add(i)
                    break

        missing_books = set(range(1, 18)) - book_numbers
        if missing_books:
            print_warning(f"Missing books: {sorted(missing_books)}")
        else:
            print_success("All 17 books found in playlist")

        # Statistics
        print(f"\n{Colors.BOLD}Statistics:{Colors.ENDC}")
        total_views = sum(stats.get(vid, {}).get('views', 0) for vid in video_ids)
        total_likes = sum(stats.get(vid, {}).get('likes', 0) for vid in video_ids)
        public_videos = sum(1 for vid in video_ids if stats.get(vid, {}).get('status') == 'public')
        unlisted_videos = sum(1 for vid in video_ids if stats.get(vid, {}).get('status') == 'unlisted')

        print(f"  Total views: {total_views:,}")
        print(f"  Total likes: {total_likes:,}")
        print(f"  Public videos: {public_videos}")
        print(f"  Unlisted videos: {unlisted_videos}")

        # Recommendations
        print(f"\n{Colors.BOLD}Recommendations:{Colors.ENDC}")
        if unlisted_videos > 0 and public_videos == 0:
            print_info("All videos are unlisted - consider publishing when ready")
        if total_views == 0:
            print_info("No views yet - promote on social media")

        # Generate report
        report = {
            'timestamp': __import__('datetime').datetime.now().isoformat(),
            'total_videos': len(videos),
            'expected_videos': expected_count,
            'videos_correct_order': all_correct_order,
            'books_found': sorted(book_numbers),
            'missing_books': sorted(missing_books),
            'total_views': total_views,
            'total_likes': total_likes,
            'public_videos': public_videos,
            'unlisted_videos': unlisted_videos,
            'videos': [
                {
                    'position': v['position'],
                    'title': v['title'],
                    'video_id': v['video_id'],
                    'views': stats.get(v['video_id'], {}).get('views', 0),
                    'status': stats.get(v['video_id'], {}).get('status', 'unknown')
                }
                for v in videos
            ]
        }

        # Save report
        with open('youtube_verification_report.json', 'w') as f:
            json.dump(report, f, indent=2)

        print_success(f"Report saved to youtube_verification_report.json")

        return 0

    except Exception as e:
        print_error(f"Verification failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

def main():
    return verify_uploads()

if __name__ == '__main__':
    sys.exit(main())
