# YouTube Upload Suite for "Sunny's Cozy Quokka Bedtime Tales"

Production-ready Python scripts for uploading the complete 17-book series to YouTube with OAuth 2.0 authentication, metadata management, and batch orchestration.

---

## Overview

Three complementary scripts handle the full lifecycle:

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup-youtube-channel.py` | One-time channel & playlist configuration | Run first, then never again |
| `upload-book-to-youtube.py` | Upload individual books | For single uploads or testing |
| `batch-upload-all-books.py` | Orchestrate sequential uploads (Books 1-17) | For bulk publishing |

---

## Prerequisites

### Python 3.8+
```bash
python3 --version
```

### Install Dependencies
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client python-dotenv
```

### YouTube API Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project: "Sunny's Quokka Bedtime Tales"

2. **Enable YouTube Data API v3**
   - From the dashboard, search for "YouTube Data API v3"
   - Enable it for your project

3. **Create OAuth 2.0 Credentials**
   - Go to **Credentials** → **+ Create Credentials** → **OAuth client ID**
   - Application type: **Desktop application**
   - Download the JSON file and save as `youtube_oauth_credentials.json` in this directory

4. **Set Up .env File**
   ```bash
   cp .env.example .env
   # .env will be populated by setup script with:
   # YOUTUBE_CHANNEL_ID=...
   # YOUTUBE_PLAYLIST_ID=...
   ```

### File Structure
```
/home/user/jamie-wigg/
├── setup-youtube-channel.py
├── upload-book-to-youtube.py
├── batch-upload-all-books.py
├── youtube_oauth_credentials.json       # From Google Cloud (create this)
├── .env                                 # Auto-created by setup script
├── .youtube_token.pickle                # Auto-created on first auth
├── youtube_upload_log.json              # Auto-created during uploads
├── youtube_batch_log.json               # Auto-created during batch uploads
│
├── BOOK-001-FINAL/BOOK-001.mp4
├── BOOK-002-FINAL/BOOK-002.mp4
├── ... (Books 1-17)
├── BOOK-017-HIGGSFIELD/assets/
└── BOOK-SCRIPTS/00-MASTER-STORIES.md   # Story titles reference
```

---

## Quick Start

### 1. One-Time Setup

```bash
python3 setup-youtube-channel.py
```

This script:
- Authenticates with YouTube (opens browser for OAuth)
- Retrieves your channel ID
- Creates the "Sunny's Cozy Quokka Bedtime Tales" playlist
- Saves credentials to `.env` and `.youtube_token.pickle`

**Output:**
```
✓ YouTube API authenticated
✓ Found existing channel: [Your Channel]
✓ Playlist created successfully!
✓ Configuration saved to .env
```

### 2. Upload a Single Book

```bash
python3 upload-book-to-youtube.py --book 1
```

**Options:**
```bash
# Specify privacy status
python3 upload-book-to-youtube.py --book 1 --status public

# Skip playlist assignment
python3 upload-book-to-youtube.py --book 5 --no-playlist

# Skip custom thumbnail
python3 upload-book-to-youtube.py --book 3 --no-thumbnail

# Private video
python3 upload-book-to-youtube.py --book 2 --status private
```

**Output:**
```
Upload Details
Title: Sunny's Cozy Quokka Bedtime Tales - Book 1: Sunny Watches the Stars Come Out
Privacy: UNLISTED
Playlist: Enabled

Ready to upload? (y/n) y

[████████░░░░░░░░░░░░░░░░] 45.2%
✓ Video uploaded: dQw4w9WgXcQ
✓ Thumbnail uploaded
✓ Added to playlist

Upload Complete!
Video ID: dQw4w9WgXcQ
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### 3. Batch Upload All Books

```bash
python3 batch-upload-all-books.py
```

**Options:**
```bash
# Upload subset (Books 5-10)
python3 batch-upload-all-books.py --start 5 --end 10

# Change upload interval (default: 60s)
python3 batch-upload-all-books.py --delay 120

# Make videos public
python3 batch-upload-all-books.py --status public

# Custom range with custom delay
python3 batch-upload-all-books.py --start 1 --end 17 --delay 90 --status unlisted
```

**What it does:**
1. Uploads books sequentially (1→2→3→...→17)
2. Applies rate limiting between uploads (respects YouTube API quotas)
3. Logs each upload with metadata
4. Generates summary report with success/failure stats
5. Saves batch log to `youtube_batch_log.json`

**Output:**
```
Batch Configuration
Books to upload: 1 → 17 (17 total)
Privacy status: UNLISTED
Delay between uploads: 60s
Estimated duration: 16 minutes

Books:
  1. Sunny Watches the Stars Come Out
  2. Sunny and the Autumn Leaves
  ... and 15 more

Proceed with batch upload? (y/n) y

Uploading Book 1/17
✓ Video uploaded: dQw4w9WgXcQ
✓ Added to playlist
✓ Book 1 uploaded in 5m 23s

Rate limiting: waiting 1m 0s before next upload
  Next upload in: 00:42

[... continues for all 17 books ...]

Batch Upload Complete

Statistics:
  Total books: 17
  Successful: 17
  Failed: 0
  Success rate: 100.0%
  Total time: 2h 14m

Results:
  ✓ Book  1: SUCCESS  (5m 23s)
  ✓ Book  2: SUCCESS  (4m 58s)
  ... (all 17 listed)
```

---

## Video Metadata

### Automatically Generated For Each Book

**Title Format:**
```
Sunny's Cozy Quokka Bedtime Tales - Book {N}: {Story Title}
```

**Example:**
```
Sunny's Cozy Quokka Bedtime Tales - Book 1: Sunny Watches the Stars Come Out
```

**Description Includes:**
- Story theme
- Content warnings (made for kids)
- Full list of all 17 books with titles
- Next book link (if not final)
- Social media hashtags

**Tags (Applied to All Videos):**
- `bedtime`, `children`, `quokka`, `sleep`, `story`, `animated`
- `bedtimestories`, `kidsbooks`, `sleepstories`, `relaxation`

**Thumbnail:**
- Auto-detected from `BOOK-{N}-HIGGSFIELD/assets/`
- Falls back to YouTube-generated thumbnail if unavailable

**Playlist:**
- All videos added to "Sunny's Cozy Quokka Bedtime Tales" playlist
- Videos appear in series order (1→2→3→...→17)

---

## All 17 Story Titles

1. Sunny Watches the Stars Come Out
2. Sunny and the Autumn Leaves
3. Sunny Finds the Fireflies
4. Sunny's Forest Friends
5. Sunny and the Gentle Moon
6. Sunny in the Garden
7. Sunny and the Soft Rain
8. Sunny's Cosy Burrow
9. Sunny Listens to the Night
10. Sunny and the Gentle Breeze
11. Sunny's Dream Adventure
12. Sunny Watches the Sunset
13. Sunny and the Wildflowers
14. Sunny Under the Tree
15. Sunny's Quiet Moment
16. Sunny and the Stars Again
17. Sunny's Beautiful Night

---

## API Rate Limiting & Quotas

YouTube API has quota limits:

| Quota Type | Limit | Notes |
|------------|-------|-------|
| Queries per day | 10,000 | Resets daily at midnight PST |
| Queries per second | 10 | Per authenticated user |

**Batch upload is rate-limited:**
- Default: 60 seconds between uploads (1 upload/min)
- Recommended: 60-120 seconds depending on video length
- Use `--delay` flag to adjust

**Cost per upload:**
- Video insert: 1,600 units
- Playlist item insert: 50 units
- Thumbnail upload: 50 units
- **Total per book: ~1,700 units**

For 17 books: ~28,900 units (well within daily quota)

---

## Logging & Tracking

### `youtube_upload_log.json`
Updated after each individual upload:
```json
[
  {
    "book_number": 1,
    "title": "Sunny's Cozy Quokka Bedtime Tales - Book 1: Sunny Watches the Stars Come Out",
    "video_id": "dQw4w9WgXcQ",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "status": "unlisted",
    "timestamp": "2024-06-14T15:30:45.123456",
    "thumbnail": true,
    "in_playlist": true
  },
  ...
]
```

### `youtube_batch_log.json`
Created after batch upload completes:
```json
{
  "batch_id": "20240614_153045",
  "timestamp": "2024-06-14T15:30:45.123456",
  "configuration": {
    "start_book": 1,
    "end_book": 17,
    "privacy_status": "unlisted",
    "delay_between": 60
  },
  "results": [
    {
      "book": 1,
      "status": "success",
      "duration": 323.45,
      "timestamp": "2024-06-14T15:30:45.123456"
    },
    ...
  ],
  "summary": {
    "total": 17,
    "successful": 17,
    "failed": 0,
    "duration_seconds": 1234.56
  }
}
```

---

## Troubleshooting

### OAuth Authentication Failed
```
✗ Error: [Errno 2] No such file or directory: 'youtube_oauth_credentials.json'
```

**Fix:**
1. Download OAuth JSON from Google Cloud Console
2. Save as `youtube_oauth_credentials.json`
3. Run `setup-youtube-channel.py` again

### Video File Not Found
```
✗ Error: Video file not found for Book 1
```

**Expected locations:**
- `BOOK-001-FINAL/BOOK-001.mp4`
- `BOOK-001-COMPLETE/BOOK-001-COMPLETE.mp4`
- `BOOK-001-SUNNY-FINAL.mp4`

**Fix:** Ensure video exists in one of these directories

### Thumbnail Not Found (Warning)
```
⚠ No custom thumbnail found for Book 5
```

This is non-fatal. YouTube will auto-generate one. To fix:
- Place PNG/JPG in `BOOK-5-HIGGSFIELD/assets/`
- Re-run upload (thumbnails can be updated after)

### API Quota Exceeded
```
✗ API Error: The request failed with status code 403
```

**Fix:**
- Wait 24 hours for quota to reset
- Or increase quota in Google Cloud Console
- Or use smaller batch (fewer books per day)

### Rate Limit Errors During Batch
```
⚠ Temporary API error, retrying...
```

Script automatically retries. If persistent:
- Increase `--delay` flag: `python3 batch-upload-all-books.py --delay 120`
- Run smaller batches: `--start 1 --end 5`, then `--start 6 --end 10`, etc.

---

## Advanced Usage

### Resume Interrupted Batch
Check `youtube_batch_log.json` for success status. Re-run with custom range:

```bash
# If books 1-10 succeeded, continue from 11
python3 batch-upload-all-books.py --start 11 --end 17
```

### Re-upload Specific Book
```bash
# This will create a new video (YouTube doesn't allow replacing video files)
python3 upload-book-to-youtube.py --book 5 --status private

# Update metadata in YouTube Studio instead for existing videos
```

### Change Privacy Status Later
Use YouTube Studio to manually change visibility. Scripts can't modify existing videos.

### Organize Videos in YouTube Studio

After uploading, you can:
1. **Reorder within playlist** → YouTube Studio → Playlists → drag to reorder
2. **Add chapters** → In video description, timestamp format: `0:00 Intro`
3. **Create segments** → YouTube Studio → More → Segments
4. **Add end screens** → Link to next book in series

---

## Production Deployment

### Pre-Launch Checklist

- [ ] All 17 videos uploaded to YouTube
- [ ] Playlist order verified (1→2→...→17)
- [ ] Titles and descriptions reviewed
- [ ] Custom thumbnails verified
- [ ] "Made for kids" flag confirmed (enabled by default)
- [ ] Comments/ratings disabled if desired (optional)
- [ ] All videos set to `public` or `unlisted` (final status)
- [ ] Social media links added to descriptions
- [ ] Channel art and banner updated
- [ ] Channel description mentions series

### Social Media Strategy
- Link from channel description to all upload logs
- Create social snippets for each book
- Use hashtags: `#BedtimeStories #Quokka #KidsContent #SleepStories`
- Cross-post to TikTok, Instagram Reels, YouTube Shorts

---

## Support & Maintenance

### Monthly Maintenance
1. Check analytics in YouTube Studio
2. Monitor engagement metrics
3. Update descriptions with links to new videos
4. Archive upload logs to backup

### Version Control
Add to `.gitignore`:
```
.youtube_token.pickle
youtube_oauth_credentials.json
youtube_upload_log.json
youtube_batch_log.json
.env
```

### Updating Scripts
Scripts are self-contained Python files. Update individually or replace entirely.

---

## License & Attribution

These scripts are provided for the "Sunny's Cozy Quokka Bedtime Tales" YouTube channel.

- **Channel:** @SunnyBedtimeTales (or user preference)
- **Creator:** Jamie Wigg
- **Series:** 17 animated bedtime stories
- **Target Audience:** Children ages 3-8

---

## Reference Links

- [YouTube API Documentation](https://developers.google.com/youtube)
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [YouTube Data API Quotas](https://developers.google.com/youtube/v3/getting-started#quota)
- [Video Upload API](https://developers.google.com/youtube/v3/docs/videos/insert)
- [Playlist API](https://developers.google.com/youtube/v3/docs/playlists)

---

## Example Workflow

```bash
# Day 1: Setup
python3 setup-youtube-channel.py
# → Creates playlist, saves config

# Day 2: Test single upload
python3 upload-book-to-youtube.py --book 1 --status unlisted
# → Review on YouTube, verify metadata

# Day 3: Batch upload all books
python3 batch-upload-all-books.py --status unlisted
# → ~2.5 hours for 17 books (60s delay between)

# Day 4: Review & finalize
# → Visit YouTube Studio, check all videos
# → Verify playlist order
# → Change status to 'public' when ready

# Day 5+: Promote
# → Share links on social media
# → Monitor analytics
# → Respond to comments
```

---

**Last Updated:** 2024-06-14  
**Status:** Production-Ready  
**Tested With:** Python 3.8+ | google-api-python-client 1.12+
