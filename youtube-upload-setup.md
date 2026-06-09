# YouTube Upload Automation for Sunny's Cozy Bedtime Tales

## Setup Instructions

### Step 1: Get YouTube API Credentials
1. Go to https://console.cloud.google.com/
2. Create a new project: "Sunny's Bedtime Tales"
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials (Desktop app)
5. Download JSON credentials file

### Step 2: Set Up in Repository
```bash
# Save credentials to
/home/user/jamie-wigg/.youtube-credentials.json

# Set environment variable
export YOUTUBE_CLIENT_ID="your-client-id"
export YOUTUBE_CLIENT_SECRET="your-client-secret"
```

### Step 3: Channel Information
- Channel ID: [Will be populated when authenticated]
- Playlist: "Sunny's Cozy Bedtime Tales"
- Visibility: Public (or Private - your choice)

## Automated Upload Script

The `auto-youtube-upload.py` script will:

1. **Find all generated videos** in `/sunny-bedtime-videos/`
2. **Upload to YouTube** with metadata:
   - Title: "Sunny's Cozy Bedtime Tales - Episode [NUM]"
   - Description: Story summary
   - Thumbnail: Book cover image
   - Tags: bedtime, story, kids, animated
   - Playlist: Auto-add to series playlist

3. **Track uploaded videos** (no duplicates)
4. **Generate upload report** with YouTube links

## Usage

```bash
# Upload all videos to YouTube
python3 auto-youtube-upload.py

# Or upload specific book range
python3 auto-youtube-upload.py --start 33 --end 60

# Check upload status
python3 auto-youtube-upload.py --status
```

## Video Metadata Template

Each upload includes:
- **Title**: Sunny's Cozy Bedtime Tales - [Story Name]
- **Description**: Professional bedtime story for kids, calming narration
- **Tags**: bedtime story, kids, animated, quokka, sleep
- **Thumbnail**: Auto-generated from cover page
- **Captions**: Auto-generated from narration (if TTS available)

## Safety Features

✓ Duplicate detection (won't re-upload)
✓ Upload logging (tracks what went up)
✓ Error recovery (retries on network failure)
✓ Rate limiting (YouTube API safe)

---

Ready to upload! Once you provide YouTube credentials, videos will publish automatically.
