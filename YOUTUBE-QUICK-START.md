# YouTube Upload - Quick Start Guide

Get "Sunny's Cozy Quokka Bedtime Tales" on YouTube in 3 steps.

---

## Step 1: Install Dependencies (5 minutes)

```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client python-dotenv
```

---

## Step 2: Set Up Google Cloud & Get Credentials (10 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: **"Sunny's Quokka Bedtime Tales"**
3. Search for and enable: **YouTube Data API v3**
4. Go to **Credentials** → **+ Create Credentials** → **OAuth client ID**
   - Choose: **Desktop application**
   - Download JSON file
5. Save downloaded file as `youtube_oauth_credentials.json` in this directory

---

## Step 3: Run Setup Script (3 minutes)

```bash
python3 setup-youtube-channel.py
```

This will:
- Open browser for you to log in
- Create the series playlist
- Save credentials to `.env`

**You're done with setup!** ✓

---

## Now Upload Videos

### Option A: Upload One Book (for testing)
```bash
python3 upload-book-to-youtube.py --book 1
```

### Option B: Upload All 17 Books at Once
```bash
python3 batch-upload-all-books.py
```

Duration: ~2.5 hours (automatically rate-limited)

---

## What Gets Uploaded?

| File | Location |
|------|----------|
| Video | `BOOK-001-FINAL/BOOK-001.mp4` through `BOOK-17-*` |
| Thumbnail | `BOOK-N-HIGGSFIELD/assets/` (auto-detected) |
| Title | "Sunny's Cozy Quokka Bedtime Tales - Book N: [Story Title]" |
| Description | Auto-generated with full book list & next book link |
| Playlist | Automatically added to series playlist |

---

## Verify Success

After upload completes:
1. Visit YouTube Studio: https://studio.youtube.com/
2. Check **Videos** → all 17 should be there
3. Check **Playlists** → books should be in order
4. Edit descriptions/thumbnails as needed

---

## Common Commands

```bash
# Upload Book 5 only
python3 upload-book-to-youtube.py --book 5

# Upload Books 1-10 only
python3 batch-upload-all-books.py --start 1 --end 10

# Make videos public (instead of unlisted)
python3 batch-upload-all-books.py --status public

# Increase delay between uploads (default: 60s)
python3 batch-upload-all-books.py --delay 120
```

---

## Files Created

After first run:
- `.youtube_token.pickle` — stores auth (keep secret!)
- `.env` — stores channel/playlist IDs
- `youtube_upload_log.json` — each upload logged
- `youtube_batch_log.json` — batch summary

Add to `.gitignore`:
```
.youtube_token.pickle
youtube_oauth_credentials.json
.env
```

---

## Troubleshooting

**"No such file: youtube_oauth_credentials.json"**
→ Download OAuth JSON from Google Cloud Console and save it here

**"YOUTUBE_CHANNEL_ID not found"**
→ Run `python3 setup-youtube-channel.py` first

**"Video file not found for Book 1"**
→ Check video exists in `BOOK-001-FINAL/BOOK-001.mp4` or similar

**Rate limit errors**
→ Add `--delay 120` to space uploads further apart

---

## Full Documentation

See `YOUTUBE-UPLOAD-README.md` for complete details.

---

## Next Steps After Upload

1. Review videos in YouTube Studio
2. Update titles/descriptions if needed
3. Set custom thumbnails (if not auto-set)
4. Check playlist order
5. Change privacy to `public` when ready
6. Promote on social media

---

**Ready?** Run `python3 setup-youtube-channel.py` now!
