# YouTube Deployment Guide - "Sunny's Cozy Quokka Bedtime Tales"

Complete production deployment checklist for publishing all 17 bedtime stories to YouTube.

---

## Files Overview

| File | Purpose | Status |
|------|---------|--------|
| `setup-youtube-channel.py` | OAuth setup, channel discovery, playlist creation | ✓ Ready |
| `upload-book-to-youtube.py` | Single book upload with metadata & playlist assignment | ✓ Ready |
| `batch-upload-all-books.py` | Sequential upload of all 17 books with rate limiting | ✓ Ready |
| `verify-youtube-uploads.py` | Post-upload verification & statistics | ✓ Ready |
| `YOUTUBE-QUICK-START.md` | Fast 3-step setup guide | ✓ Ready |
| `YOUTUBE-UPLOAD-README.md` | Comprehensive documentation | ✓ Ready |
| `.env.example` | Configuration template | ✓ Ready |

---

## Pre-Deployment Checklist

### Local Environment (20 minutes)
- [ ] Python 3.8+ installed: `python3 --version`
- [ ] Dependencies installed: `pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client python-dotenv`
- [ ] All 17 video files exist in expected directories:
  - [ ] `BOOK-001-FINAL/BOOK-001.mp4` through `BOOK-017-*`
  - [ ] Run: `find . -name "BOOK-*" -name "*.mp4" | wc -l` (should be ≥ 17)

### Google Cloud Setup (15 minutes)
- [ ] Google Cloud Project created: "Sunny's Quokka Bedtime Tales"
- [ ] YouTube Data API v3 enabled
- [ ] OAuth 2.0 credentials downloaded as `youtube_oauth_credentials.json`
- [ ] Credentials file placed in project root

### YouTube Channel (10 minutes)
- [ ] YouTube channel exists and is signed into
- [ ] Channel name finalized: `@SunnyBedtimeTales` (or preference)
- [ ] Channel description updated
- [ ] Channel art and banner uploaded
- [ ] About tab completed with series description

---

## Deployment Timeline

### Day 1: Setup (30 minutes)

```bash
# 1. Run setup script
python3 setup-youtube-channel.py

# Expected output:
# ✓ Found existing channel: [Your Channel Name]
# ✓ Playlist created successfully!
# ✓ Configuration saved to .env
```

Files created:
- `.youtube_token.pickle` (OAuth token - keep secret!)
- `.env` (configuration - keep secret!)

---

### Day 2: Test Single Upload (20 minutes)

```bash
# 1. Upload Book 1 as test (unlisted)
python3 upload-book-to-youtube.py --book 1

# 2. Verify in YouTube Studio
# - Check title: "Sunny's Cozy Quokka Bedtime Tales - Book 1: Sunny Watches the Stars Come Out"
# - Check description: full book list, next book link
# - Check thumbnail: custom or auto-generated
# - Verify in playlist: appears as position 1

# 3. If satisfied, make public
# (done in YouTube Studio manually for now)

# 4. If issues found, delete from YouTube Studio and re-upload with fixes
```

---

### Day 3: Batch Deploy All Books (3-4 hours)

```bash
# 1. Start batch upload (Books 1-17)
python3 batch-upload-all-books.py

# You'll be asked to confirm:
# Books to upload: 1 → 17 (17 total)
# Privacy status: UNLISTED
# Delay between uploads: 60s
# Estimated duration: 16 minutes
# Proceed with batch upload? (y/n) y

# 2. Monitor progress - script will:
#    - Upload each book sequentially
#    - Apply 60-second delay between uploads
#    - Log each upload with video ID
#    - Generate summary report

# 3. Expected duration: ~2.5 hours
#    - ~5-8 min per upload (video size dependent)
#    - 60 seconds between = 76 seconds per book
#    - 17 books × ~8 min = ~2h 10m total

# 4. Check console output for any failures
#    - Automatic retries on temporary errors
#    - Manual intervention only if persistent errors
```

Files created:
- `youtube_upload_log.json` (detailed upload log for each book)
- `youtube_batch_log.json` (batch summary with statistics)

---

### Day 4: Verification & Finalization (30 minutes)

```bash
# 1. Verify all uploads
python3 verify-youtube-uploads.py

# Expected output:
# ✓ Found 17 videos in playlist
# ✓ All videos in correct order
# ✓ All 17 books found in playlist

# 2. Check YouTube Studio
#    - Videos → verify all 17 appear
#    - Playlists → verify order (Book 1→2→...→17)
#    - Check views/engagement on Book 1 (your test)

# 3. Review metadata for all videos
#    - Titles: formatted correctly?
#    - Descriptions: complete with book list?
#    - Thumbnails: custom images present?
#    - Tags: applied correctly?

# 4. Adjust privacy status if desired
#    - Currently: UNLISTED
#    - Options: UNLISTED (safe for final check), PUBLIC (launch)
#    - Change in YouTube Studio: Videos → select video → Details → Visibility
```

Files created/used:
- `youtube_verification_report.json` (detailed verification output)

---

### Day 5: Go Live (30 minutes)

```bash
# 1. Make all videos PUBLIC (in YouTube Studio)
#    - Go to Videos in Studio
#    - Select all 17 videos
#    - Bulk change: Details → Visibility → Public
#    - OR change individually and verify before publishing

# 2. Test playlist
#    - https://www.youtube.com/playlist?list=[YOUR_PLAYLIST_ID]
#    - Verify all 17 books in order
#    - Click through a few to verify playback

# 3. Create channel premiere schedule (optional)
#    - Schedule daily releases at consistent time
#    - Helps build routine for viewers

# 4. Prepare social media posts
#    - Channel link: https://www.youtube.com/@YourChannelHandle
#    - First book: https://www.youtube.com/watch?v=[VIDEO_ID]
#    - Playlist: https://www.youtube.com/playlist?list=[PLAYLIST_ID]

# 5. Cross-post to other platforms
#    - TikTok: 15-30 sec clips from videos
#    - Instagram Reels: Same
#    - Twitter/X: Announcement with channel link
#    - Other: Reddit r/children, parenting forums, etc.
```

---

## Post-Deployment Monitoring

### Week 1 (Daily)
- [ ] Check upload log for any errors
- [ ] Monitor YouTube Analytics for first video
- [ ] Respond to comments (enable moderation)
- [ ] Fix any metadata issues found

### Week 2-4 (Weekly)
- [ ] Check engagement metrics
- [ ] Monitor watch time trends
- [ ] Respond to channel comments
- [ ] Post social media updates
- [ ] Schedule next release if using premieres

### Ongoing (Monthly)
- [ ] Review analytics dashboard
- [ ] Update channel description with milestones
- [ ] Monitor for spam/inappropriate comments
- [ ] Back up upload logs

---

## Troubleshooting During Deployment

### Setup Script Issues

**"No such file: youtube_oauth_credentials.json"**
```
1. Download OAuth JSON from Google Cloud Console
2. Save as youtube_oauth_credentials.json
3. Rerun setup script
```

**"Cannot create channel via API"**
```
Normal behavior - channel must already exist
The API can't create channels, only authenticate to existing ones
```

### Upload Script Issues

**"Video file not found for Book 1"**
```
Check video exists:
  find . -name "*BOOK-001*" -name "*.mp4"
Expected: BOOK-001-FINAL/BOOK-001.mp4
```

**"Rate limit exceeded"**
```
YouTube API quota exhausted
Wait 24 hours for daily quota reset (midnight PST)
Or increase quota in Google Cloud Console
```

**"API Error 403: Forbidden"**
```
- Check OAuth token validity (may need re-authentication)
- Check YouTube Data API is enabled in Cloud Console
- Verify authenticated account has channel access
```

### Batch Upload Interruption

**Script stops mid-batch**
```bash
# Check what uploaded:
tail -50 youtube_upload_log.json

# Find last successful book:
grep '"status": "success"' youtube_upload_log.json | tail -1

# Resume from next book:
python3 batch-upload-all-books.py --start 12 --end 17
```

### YouTube Studio Issues

**Videos not appearing immediately**
- Normal - can take 5-15 minutes for processing
- Check: Videos → Uploads (showing processing status?)

**Thumbnail not visible**
- Custom thumbnails might need manual re-upload in Studio
- Or wait 24 hours for cache refresh

**Playlist appears empty**
- Check playlist ID in `.env` matches YouTube Studio
- Playlists can take time to populate in some UIs
- Refresh page (F5)

---

## Configuration Reference

### File: `.env` (auto-created)
```
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxx
YOUTUBE_PLAYLIST_ID=PLxxxxxxxxxxxxxxxxxxxxxxx
YOUTUBE_API_CONFIGURED=true
```

### File: `youtube_upload_log.json` (auto-created, append-only)
```json
[
  {
    "book_number": 1,
    "title": "Sunny's Cozy Quokka Bedtime Tales - Book 1: ...",
    "video_id": "dQw4w9WgXcQ",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "status": "unlisted",
    "timestamp": "2024-06-14T15:30:45",
    "thumbnail": true,
    "in_playlist": true
  }
]
```

### File: `youtube_batch_log.json` (auto-created after batch)
```json
{
  "batch_id": "20240614_153045",
  "timestamp": "2024-06-14T15:30:45",
  "configuration": {
    "start_book": 1,
    "end_book": 17,
    "privacy_status": "unlisted",
    "delay_between": 60
  },
  "summary": {
    "total": 17,
    "successful": 17,
    "failed": 0,
    "duration_seconds": 8234
  }
}
```

---

## Video Metadata Reference

### Title Format
```
Sunny's Cozy Quokka Bedtime Tales - Book {N}: {Story Title}
```

### Story Titles (All 17)
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

### Tags (Applied to All)
```
bedtime, children, quokka, sleep, story, animated,
bedtimestories, kidsbooks, sleepstories, relaxation
```

### Description Includes
- Story theme
- Full list of all 17 books
- Next book link (if not Book 17)
- "Made for kids" note
- Social media hashtags

---

## Security Checklist

- [ ] `.youtube_token.pickle` is NOT committed to git
- [ ] `youtube_oauth_credentials.json` is NOT committed to git
- [ ] `.env` file is NOT committed to git
- [ ] `.gitignore` includes all credential files:
  ```
  .youtube_token.pickle
  youtube_oauth_credentials.json
  .env
  ```
- [ ] Credentials backed up securely (not in repo!)
- [ ] OAuth token will auto-refresh (no manual action needed)
- [ ] Channel doesn't allow comments until moderated (optional)

---

## Success Metrics

After deployment, track:

| Metric | Tool | Goal |
|--------|------|------|
| Playlist views | YouTube Analytics | >50 combined |
| Watch time | YouTube Analytics | >100 hours cumulative |
| Subscriber growth | YouTube Studio | +10-50 per week |
| Video ranking | YouTube Search | "bedtime stories children" top 100 |
| Social shares | Manual tracking | Shared >10 times |

---

## Rollback Plan

If major issues discovered:

1. **Don't panic** - videos can be unpublished from YouTube Studio
2. **For privacy/metadata issues:**
   - Go to YouTube Studio → Videos
   - Select problematic videos
   - Click Details → Visibility → UNLISTED
   - Edit metadata as needed
   - Republish when ready
3. **For playlist issues:**
   - Go to Playlists
   - Edit order by dragging videos
   - Remove videos if needed (they remain on channel)
4. **For bulk deletion:**
   - Select videos in Studio
   - Delete (sent to trash, can restore for 30 days)

---

## Support Resources

- **Script docs:** `YOUTUBE-UPLOAD-README.md`
- **Quick reference:** `YOUTUBE-QUICK-START.md`
- **YouTube API docs:** https://developers.google.com/youtube
- **OAuth 2.0 guide:** https://developers.google.com/identity/protocols/oauth2
- **Upload troubleshooting:** https://support.google.com/youtube

---

## Maintenance Tasks

### Monthly
- [ ] Review analytics
- [ ] Check for spam comments
- [ ] Update channel pinned comment with series intro
- [ ] Back up upload logs

### Quarterly
- [ ] Review watch duration patterns
- [ ] Test re-uploading one book (practice for updates)
- [ ] Update description with total views/subscribers
- [ ] Promote series on relevant platforms

### Annually
- [ ] Archive all upload logs
- [ ] Generate annual statistics
- [ ] Plan next video series
- [ ] Update story metadata if needed

---

## Sign-Off

- [x] All scripts tested and verified
- [x] Documentation complete
- [x] Error handling implemented
- [x] Rate limiting configured
- [x] Logging enabled
- [x] Verification tools included

**Status: PRODUCTION READY**

**Date:** 2024-06-14  
**Version:** 1.0  
**Tested with:** Python 3.8-3.12 | google-api-python-client 1.12+
