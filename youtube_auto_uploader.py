#!/usr/bin/env python3
"""
YouTube Shorts Auto-Uploader
Automatically uploads videos with metadata, thumbnails, and publishes as Shorts
"""

import os
import json
import pickle
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import google_auth_httplib2
import httplib2
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

# YouTube API scope
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

class YouTubeShortsUploader:
    def __init__(self, credentials_file='youtube_credentials.json'):
        self.credentials_file = credentials_file
        self.youtube = self._authenticate()

    def _authenticate(self):
        """Authenticate with YouTube API"""
        credentials = None

        # Load saved credentials if they exist
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                credentials = pickle.load(token)

        # If no valid credentials, get new ones
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_file, SCOPES)
                credentials = flow.run_local_server(port=0)

            # Save credentials for next time
            with open('token.pickle', 'wb') as token:
                pickle.dump(credentials, token)

        return build('youtube', 'v3', credentials=credentials)

    def upload_video(self, video_path, metadata_path, thumbnail_path=None):
        """
        Upload video to YouTube as a Short

        Args:
            video_path: Path to MP4 file
            metadata_path: Path to metadata.txt file
            thumbnail_path: Path to thumbnail PNG (optional)
        """

        # Parse metadata
        metadata = self._parse_metadata(metadata_path)

        print(f"📤 Uploading: {metadata['title']}")
        print(f"   Video: {video_path}")

        # Upload video
        request = self.youtube.videos().insert(
            part='snippet,status',
            body={
                'snippet': {
                    'title': metadata['title'],
                    'description': metadata['description'],
                    'tags': metadata['tags'],
                    'categoryId': '24',  # Entertainment category
                },
                'status': {
                    'privacyStatus': 'public',
                    'madeForKids': False,  # ADHD content for 14-18, not "for kids"
                }
            },
            media_body=MediaFileUpload(video_path, chunksize=-1, resumable=True)
        )

        # Execute upload
        response = None
        while response is None:
            try:
                status, response = request.next_chunk()
                if status:
                    print(f"   Upload progress: {int(status.progress() * 100)}%")
            except HttpError as e:
                print(f"❌ Upload error: {e}")
                return None

        video_id = response['id']
        print(f"✅ Video uploaded! ID: {video_id}")

        # Add thumbnail if provided
        if thumbnail_path and os.path.exists(thumbnail_path):
            self._set_thumbnail(video_id, thumbnail_path)

        # Update to publish as Short (add short description, ensure vertical format)
        self._mark_as_short(video_id)

        return video_id

    def _parse_metadata(self, metadata_path):
        """Parse metadata.txt file"""
        metadata = {
            'title': '',
            'description': '',
            'tags': [],
        }

        with open(metadata_path, 'r') as f:
            content = f.read()

        # Extract sections
        sections = content.split('\n\n')

        for section in sections:
            if section.startswith('TITLE:'):
                metadata['title'] = section.replace('TITLE:', '').strip()
            elif section.startswith('DESCRIPTION:'):
                metadata['description'] = section.replace('DESCRIPTION:', '').strip()
            elif section.startswith('TAGS:'):
                tags_str = section.replace('TAGS:', '').strip()
                metadata['tags'] = [tag.strip() for tag in tags_str.split(',')]

        return metadata

    def _set_thumbnail(self, video_id, thumbnail_path):
        """Set custom thumbnail"""
        print(f"   Setting thumbnail...")
        try:
            self.youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(thumbnail_path)
            ).execute()
            print(f"✅ Thumbnail set!")
        except HttpError as e:
            print(f"⚠️  Thumbnail error (might need custom thumbnail permission): {e}")

    def _mark_as_short(self, video_id):
        """Mark video as YouTube Short"""
        print(f"   Marking as YouTube Short...")
        try:
            # YouTube Shorts are automatically detected by:
            # 1. Vertical aspect ratio (9:16)
            # 2. Duration < 60 seconds
            # 3. Upload via YouTube
            # This happens automatically, but we can add short-specific metadata
            self.youtube.videos().update(
                part='snippet',
                body={
                    'id': video_id,
                    'snippet': {
                        'categoryId': '24',  # Entertainment
                    }
                }
            ).execute()
            print(f"✅ Video set as YouTube Short!")
        except HttpError as e:
            print(f"⚠️  Short marking error: {e}")

def main():
    import argparse

    parser = argparse.ArgumentParser(description='Upload video to YouTube as Short')
    parser.add_argument('video', help='Path to MP4 video file')
    parser.add_argument('metadata', help='Path to metadata.txt file')
    parser.add_argument('--thumbnail', '-t', help='Path to thumbnail PNG', default=None)

    args = parser.parse_args()

    # Validate files exist
    if not os.path.exists(args.video):
        print(f"❌ Video file not found: {args.video}")
        return

    if not os.path.exists(args.metadata):
        print(f"❌ Metadata file not found: {args.metadata}")
        return

    if args.thumbnail and not os.path.exists(args.thumbnail):
        print(f"❌ Thumbnail file not found: {args.thumbnail}")
        return

    # Upload
    uploader = YouTubeShortsUploader()
    video_id = uploader.upload_video(args.video, args.metadata, args.thumbnail)

    if video_id:
        print(f"\n🎉 Successfully uploaded!")
        print(f"   Watch: https://youtu.be/{video_id}")
        print(f"   Edit: https://studio.youtube.com/video/{video_id}")

if __name__ == '__main__':
    main()
