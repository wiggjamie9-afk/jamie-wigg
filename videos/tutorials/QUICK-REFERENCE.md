# Quick Reference - AI Tutorial Videos

## 📍 Location
```
/home/user/jamie-wigg/videos/tutorials/
```

## 🎬 Three Tutorials

### 1. MathTutor Pro
- **Folder:** `mathtutor-pro/`
- **Color:** Emerald green (#10b981)
- **Icon:** ∑
- **Features:** Step-by-step solutions, AI explanations, Visual demonstrations

### 2. BookReader Pro
- **Folder:** `bookreader-pro/`
- **Color:** Violet (#a78bfa)
- **Icon:** 📖
- **Features:** Word-by-word highlighting, Natural narration, Reading comprehension

### 3. LanguageLens
- **Folder:** `languagelens/`
- **Color:** Blue (#3b82f6)
- **Icon:** 🌐
- **Features:** Pronunciation feedback, Interactive lessons, Fluency tracking

## 📋 Files in Each Folder

```
mathtutor-pro/
├── index.html          ← HyperFrames composition (edit here to customize)
├── package.json        ← Build config
├── hyperframes.json    ← Video metadata
├── meta.json           ← Version info
└── mathtutor-pro.mp4   ← Output (after rendering)
```

Same structure for `bookreader-pro/` and `languagelens/`

## 🚀 One-Liner Commands

### Preview (No Installation)
```bash
# MathTutor Pro
cd /home/user/jamie-wigg/videos/tutorials/mathtutor-pro && npx --yes hyperframes@0.4.42 preview

# BookReader Pro
cd /home/user/jamie-wigg/videos/tutorials/bookreader-pro && npx --yes hyperframes@0.4.42 preview

# LanguageLens
cd /home/user/jamie-wigg/videos/tutorials/languagelens && npx --yes hyperframes@0.4.42 preview
```

### Render to MP4
```bash
# MathTutor Pro
cd /home/user/jamie-wigg/videos/tutorials/mathtutor-pro && npx --yes hyperframes@0.4.42 render

# All at once (requires FFmpeg)
cd /home/user/jamie-wigg/videos/tutorials && bash render-all.sh
```

## 🎨 Edit Colors

**File:** `mathtutor-pro/index.html` (same for others)

Find and edit:
```css
:root {
    --primary: #10b981;        /* Main color */
    --primary-bright: #34d399; /* Lighter version */
    --accent: #06b6d4;         /* Accent color */
    --bg: #0b1120;             /* Background */
    --text: #f3f6fb;           /* Text color */
}
```

## 📝 Edit Text

**File:** `mathtutor-pro/index.html`

Look for:
```html
<h1 class="title">MathTutor Pro</h1>
<p class="tagline">Solve Math Problems Step-by-Step</p>
<p class="description">...</p>

<div class="feature">
    <div class="feature-text">Step-by-step solutions</div>
</div>
```

## 📐 Change Size

**For Portrait (9:16 - TikTok/Reels):**

Edit `mathtutor-pro/index.html`:
```css
body {
    width: 1080px;
    height: 1920px;  /* was 1080 */
}
```

Edit `mathtutor-pro/hyperframes.json`:
```json
{
    "width": 1080,
    "height": 1920
}
```

**For Square (1:1 - Instagram):**

```css
body {
    width: 1080px;
    height: 1080px;
}
```

```json
{
    "width": 1080,
    "height": 1080
}
```

## 📚 Documentation

| Document | Purpose |
|---|---|
| **README.md** | Overview, features, customization |
| **SETUP.md** | Installation, config, troubleshooting |
| **INTEGRATION.md** | How to add videos to your apps |
| **TUTORIAL-VIDEOS-SUMMARY.md** | Full implementation details |

## 🔧 NPM Scripts

```bash
cd /home/user/jamie-wigg/videos/tutorials

npm run dev:math         # Preview MathTutor Pro
npm run dev:book         # Preview BookReader Pro
npm run dev:lang         # Preview LanguageLens

npm run render:math      # Render MathTutor Pro
npm run render:book      # Render BookReader Pro
npm run render:lang      # Render LanguageLens

npm run render:all       # Render all three

npm run lint:all         # Validate all compositions
```

## ⚠️ Troubleshooting

**FFmpeg not found?**
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg
```

**Preview won't load?**
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)
- Check http://localhost:8080 (not 3000)

**Render fails?**
- Run: `npx hyperframes@0.4.42 lint`
- Verify FFmpeg: `ffmpeg -version`

## 📹 Video Specs

| Property | Value |
|---|---|
| Resolution | 1920×1080 (landscape) |
| Duration | 8 seconds |
| FPS | 30 |
| Codec | H.264 MP4 |
| File size | 8-12 MB |
| Format | Universal MP4 |

## 🎯 Use Cases

**Landing Pages:** Add to `/apps/mathtutor-pro.html`, etc.
**YouTube:** Upload MP4, link from app pages
**Social Media:** TikTok/Reels (render portrait first)
**Email:** Link to video, auto-play muted on web
**Help Pages:** Add to FAQ section
**Onboarding:** Show on first app launch

## 🔗 Integration Example

```html
<section class="tutorial">
    <h2>See It In Action</h2>
    <video width="100%" max-width="600px" controls>
        <source src="/videos/tutorials/mathtutor-pro/mathtutor-pro.mp4" 
                type="video/mp4">
    </video>
    <button onclick="goToApp()">Start Learning</button>
</section>
```

## 📊 Performance

| Action | Time |
|---|---|
| Preview load | <1 second |
| MP4 render (8s) | 30-60 seconds |
| All 3 renders | 2-5 minutes |

## ✅ Checklist

- [ ] Preview a tutorial
- [ ] Render to MP4
- [ ] Test playback
- [ ] Customize colors/text
- [ ] Upload to YouTube
- [ ] Add to landing page
- [ ] Share on social media
- [ ] Track performance

## 🌐 Platforms Ready

✅ YouTube  
✅ LinkedIn  
✅ Twitter/X  
✅ Facebook  
✅ Web pages  
✅ Email (link)  

⚠️ TikTok, Reels (render portrait first)  
⚠️ Instagram (render square first)

## 🚀 Next Step

```bash
cd /home/user/jamie-wigg/videos/tutorials/mathtutor-pro
npx --yes hyperframes@0.4.42 preview
```

Opens browser preview at http://localhost:8080

---

Created June 2026 for RHYTHMIX educational content pipeline.
