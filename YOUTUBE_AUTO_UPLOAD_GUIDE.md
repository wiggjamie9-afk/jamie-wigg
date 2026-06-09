# 🤖 YouTube Shorts Auto-Uploader
## Automatic Upload Pipeline (One Command = Published)

---

## 📋 SETUP (One-Time, ~15 minutes)

### **Step 1: Get YouTube API Credentials**

1. Go to: **https://console.cloud.google.com**
2. Click "Create Project" → Name: "ADHD Vibes"
3. Search for **"YouTube Data API v3"** → Click it → Enable
4. Click "Create Credentials" → OAuth 2.0 (Desktop app)
5. Download JSON file
6. Rename to: `youtube_credentials.json`
7. Place in: `/home/user/jamie-wigg/` (same folder as this script)

---

### **Step 2: Install Python Libraries**

```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

---

### **Step 3: Authenticate Once**

```bash
python youtube_auto_uploader.py \
  adhd-vibes-video-1/renders/adhd-vibes-video-1.mp4 \
  adhd-vibes-video-1/metadata.txt \
  --thumbnail adhd-vibes-video-1/thumbnail.png
```

First time only:
- Browser will open
- Click "Allow"
- Script saves `token.pickle` (reuses for future uploads)

---

## 🚀 UPLOAD ANY VIDEO (After Setup)

### **Simple One-Liner**

```bash
python youtube_auto_uploader.py <VIDEO.mp4> <metadata.txt> --thumbnail <thumbnail.png>
```

### **Example for Video 1**

```bash
python youtube_auto_uploader.py \
  adhd-vibes-video-1/renders/adhd-vibes-video-1.mp4 \
  adhd-vibes-video-1/metadata.txt \
  --thumbnail adhd-vibes-video-1/thumbnail.png
```

**Output:**
```
📤 Uploading: The Lie We Tell Ourselves Every Single Day 🤥 #ADHD
   Video: adhd-vibes-video-1/renders/adhd-vibes-video-1.mp4
   Upload progress: 0%
   Upload progress: 25%
   Upload progress: 50%
   Upload progress: 75%
   Upload progress: 100%
✅ Video uploaded! ID: dQw4w9WgXcQ
✅ Thumbnail set!
✅ Video set as YouTube Short!

🎉 Successfully uploaded!
   Watch: https://youtu.be/dQw4w9WgXcQ
   Edit: https://studio.youtube.com/video/dQw4w9WgXcQ
```

---

## 🔄 BATCH UPLOAD (Multiple Videos)

Create file: `upload_batch.sh`

```bash
#!/bin/bash

# Video 1
python youtube_auto_uploader.py \
  adhd-vibes-video-1/renders/adhd-vibes-video-1.mp4 \
  adhd-vibes-video-1/metadata.txt \
  --thumbnail adhd-vibes-video-1/thumbnail.png

# Wait 30 seconds between uploads (YouTube rate limiting)
sleep 30

# Video 2
python youtube_auto_uploader.py \
  adhd-vibes-video-2/renders/adhd-vibes-video-2.mp4 \
  adhd-vibes-video-2/metadata.txt \
  --thumbnail adhd-vibes-video-2/thumbnail.png

# And so on...
```

Run:
```bash
bash upload_batch.sh
```

Uploads all videos automatically, one after another. ✅

---

## 📁 FILE STRUCTURE (What Script Expects)

```
adhd-vibes-video-1/
├── renders/
│   └── adhd-vibes-video-1.mp4          ← Video file
├── metadata.txt                         ← YouTube metadata
├── thumbnail.png                        ← Thumbnail (1280×720 PNG)
└── [other files]

adhd-vibes-video-2/
├── renders/
│   └── adhd-vibes-video-2.mp4
├── metadata.txt
├── thumbnail.png
└── [other files]
```

---

## ⚙️ WHAT THE SCRIPT DOES AUTOMATICALLY

✅ **Reads metadata.txt** and extracts:
- Title
- Description
- Tags
- Hashtags

✅ **Uploads MP4** to your YouTube account

✅ **Sets thumbnail** (custom image)

✅ **Marks as Short** (YouTube automatically detects via 9:16 aspect ratio + <60s)

✅ **Publishes publicly** (visible immediately)

✅ **Sets category** to "Entertainment"

✅ **Sets NOT made for kids** (appropriate for 14-18 audience)

---

## 🎯 WORKFLOW

### **For Each Video:**

1. **Generate narration** (on your computer)
   ```bash
   cd adhd-vibes-video-1
   kokoro-tts < narration_clean.txt > narration.wav
   ```

2. **Render video** (on your computer)
   ```bash
   npm run render
   ```
   Creates: `renders/adhd-vibes-video-1.mp4`

3. **Design thumbnail** (Canva, Photoshop, etc.)
   Save as: `thumbnail.png` in the video folder

4. **Auto-upload to YouTube**
   ```bash
   python youtube_auto_uploader.py \
     adhd-vibes-video-1/renders/adhd-vibes-video-1.mp4 \
     adhd-vibes-video-1/metadata.txt \
     --thumbnail adhd-vibes-video-1/thumbnail.png
   ```

5. **Video is LIVE** ✅

---

## 🚨 TROUBLESHOOTING

**"ModuleNotFoundError: No module named 'google_auth_oauthlib'"**
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

**"Video file not found"**
- Make sure you ran `npm run render` (creates MP4)
- Check path is correct

**"Credentials not found"**
- Make sure `youtube_credentials.json` is in same folder
- Run authentication step again

**"Upload fails with 403 error"**
- YouTube API credentials might not have upload permission
- Go back to Google Cloud Console → Verify OAuth scope includes `youtube.upload`

**"Thumbnail too large"**
- Thumbnail must be PNG or JPG
- Max size: 2MB
- Recommended: 1280×720 pixels

---

## 📊 SCALING TO 5+ VIDEOS/WEEK

Once you have the system:

**Week 1:**
- Render Video 1 → Upload
- Render Video 2 → Upload
- (Total: ~4 hours work)

**Week 2+:**
- Render Videos 3-5 in parallel
- Upload all at once via batch script
- Stagger uploads 1 per day to avoid YouTube suppressing similar content

**Batch upload 5 videos:**
```bash
# Create all thumbnails
# Create all videos
# Run one command
bash upload_batch.sh
```

Done. ✅

---

## 🎬 YOU'RE NOW FULLY AUTOMATED

**Process:**
1. ✅ Script generated (this file)
2. ✅ YouTube API credentials (your step)
3. ✅ Authenticate once (your step)
4. ✅ Run uploader for each video (one command)

**No more manual uploading to YouTube.**

Just render → Upload → Video is live in 5 minutes.

---

## 📞 NEXT STEPS

1. **Get YouTube API credentials** (link above)
2. **Place `youtube_credentials.json` in project folder**
3. **Run:** `pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client`
4. **Test upload Video 1** (authenticate once)
5. **Video is live** ✅

---

**Questions?** Let me know the error and I'll help debug.

**Ready to go?** Start with Step 1 above. 🚀
