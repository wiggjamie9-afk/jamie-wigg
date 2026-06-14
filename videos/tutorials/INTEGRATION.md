# Tutorial Video Integration Guide

How to integrate these tutorial videos into your educational apps.

## Overview

These three tutorial videos are designed to drive user adoption by showing new users exactly what each app does in the first 8 seconds.

## Integration Points

### 1. App Landing Pages

Add tutorial videos prominently on each app's marketing page.

#### MathTutor Pro (`/apps/mathtutor-pro.html`)

```html
<section class="tutorial-section">
    <h2>See MathTutor Pro in Action</h2>
    <video width="100%" max-width="600px" controls poster="thumb.jpg">
        <source src="/videos/tutorials/mathtutor-pro/mathtutor-pro.mp4" type="video/mp4">
        Your browser does not support videos.
    </video>
    <p>Watch how MathTutor Pro provides step-by-step guidance for any math problem.</p>
    <button class="cta">Try MathTutor Pro Free</button>
</section>
```

#### BookReader Pro (`/apps/bookreader-pro.html`)

```html
<section class="tutorial-section">
    <h2>How BookReader Pro Works</h2>
    <video width="100%" max-width="600px" controls poster="thumb.jpg">
        <source src="/videos/tutorials/bookreader-pro/bookreader-pro.mp4" type="video/mp4">
        Your browser does not support videos.
    </video>
    <p>Listen while reading with word-by-word highlighting and natural narration.</p>
    <button class="cta">Start Reading Now</button>
</section>
```

#### LanguageLens (`/apps/languagelens.html`)

```html
<section class="tutorial-section">
    <h2>Learn Languages with LanguageLens</h2>
    <video width="100%" max-width="600px" controls poster="thumb.jpg">
        <source src="/videos/tutorials/languagelens/languagelens.mp4" type="video/mp4">
        Your browser does not support videos.
    </video>
    <p>Get real-time pronunciation feedback as you speak, powered by AI.</p>
    <button class="cta">Master a Language</button>
</section>
```

### 2. In-App Onboarding

Show tutorial on first launch to help users get started.

#### Modal/Dialog Approach

```html
<div class="onboarding-modal">
    <video autoplay muted playsinline>
        <source src="/videos/tutorials/mathtutor-pro/mathtutor-pro.mp4" type="video/mp4">
    </video>
    <button class="skip">Skip Tutorial</button>
    <button class="next primary">Get Started</button>
</div>
```

#### CSS for Modal

```css
.onboarding-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.onboarding-modal video {
    width: 90vw;
    max-width: 800px;
    border-radius: 12px;
    margin-bottom: 20px;
}

.onboarding-modal button {
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: white;
    color: #333;
    margin: 8px;
}

.onboarding-modal .skip {
    background: transparent;
    color: white;
    text-decoration: underline;
}
```

#### JavaScript Control

```javascript
// Show onboarding modal only on first visit
if (!localStorage.getItem('seen_tutorial_mathtutor')) {
    document.querySelector('.onboarding-modal').style.display = 'flex';
    
    document.querySelector('.skip').addEventListener('click', () => {
        closeTutorial();
    });
    
    document.querySelector('.next').addEventListener('click', () => {
        closeTutorial();
    });
}

function closeTutorial() {
    localStorage.setItem('seen_tutorial_mathtutor', 'true');
    document.querySelector('.onboarding-modal').style.display = 'none';
}
```

### 3. Help/FAQ Pages

Add videos to your help section to answer "How do I use this?" questions.

```html
<section class="faq-with-video">
    <h3>How does MathTutor Pro work?</h3>
    <video width="100%" controls>
        <source src="/videos/tutorials/mathtutor-pro/mathtutor-pro.mp4" type="video/mp4">
    </video>
    <details>
        <summary>Read more about features</summary>
        <p>MathTutor Pro uses advanced AI to...</p>
    </details>
</section>
```

### 4. Social Media & Marketing

Use rendered videos to drive traffic to your apps.

#### YouTube
1. Upload MP4 to YouTube
2. Create playlist: "App Tutorials"
3. Link from landing pages
4. Add to email campaigns

#### TikTok / Instagram Reels / YouTube Shorts
1. Render portrait version (1080×1920)
2. Upload native video
3. Add captions/text overlay
4. Link to app download in bio

#### Twitter/X
1. Upload MP4 natively
2. Tweet: "Learn how [App] works in 8 seconds 👇"
3. Link to app page

### 5. Email Campaigns

Include video in welcome emails.

```html
<!-- Email template (most email clients don't support video directly) -->
<table>
    <tr>
        <td>
            <a href="https://yourdomain.com/apps/mathtutor-pro">
                <img src="/videos/tutorials/mathtutor-pro/thumbnail.jpg" 
                     alt="MathTutor Pro Tutorial" 
                     width="600" />
            </a>
            <p><a href="https://yourdomain.com/apps/mathtutor-pro">
                Watch how MathTutor Pro works (8 seconds)
            </a></p>
        </td>
    </tr>
</table>
```

### 6. Ad Creative

Use video clips in paid advertising.

#### Facebook Ads
1. Upload MP4
2. Video will auto-play muted in feed
3. Link to app landing page
4. Target students interested in education

#### Google Ads
1. Upload MP4 to YouTube
2. Use for YouTube ads
3. Set 5-8 second view targets
4. Link to conversion page

#### LinkedIn
1. Upload MP4 natively
2. Post in company page
3. Highlight for education professionals
4. Link to app page

## Rendering for Specific Platforms

### YouTube (1920×1080)
```bash
npm run render:all
# Files ready: mathtutor-pro.mp4, bookreader-pro.mp4, languagelens.mp4
```

### TikTok / Instagram Reels / YouTube Shorts (1080×1920)

Edit each composition to portrait:

**Step 1:** Edit `mathtutor-pro/index.html` CSS
```css
body {
    width: 1080px;
    height: 1920px;  /* changed from 1080 */
}
```

**Step 2:** Edit `mathtutor-pro/hyperframes.json`
```json
{
    "width": 1080,
    "height": 1920
}
```

**Step 3:** Render
```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 render
```

### Instagram Feed (1080×1080)

Edit to square format:

**Step 1:** Edit `mathtutor-pro/index.html` CSS
```css
body {
    width: 1080px;
    height: 1080px;  /* square */
}
```

**Step 2:** Edit `mathtutor-pro/hyperframes.json`
```json
{
    "width": 1080,
    "height": 1080
}
```

**Step 3:** Render
```bash
cd mathtutor-pro
npx --yes hyperframes@0.4.42 render
```

## Optimization by Platform

### YouTube
- **Resolution:** 1920×1080 (16:9)
- **Codec:** H.264 MP4
- **Bitrate:** 5-8 Mbps
- **Duration:** 8 seconds (perfect for intro)
- **Thumbnail:** Auto-generated from first frame

### TikTok
- **Resolution:** 1080×1920 (9:16)
- **Format:** MP4 or vertical video
- **Duration:** 3-10 seconds
- **Captions:** Recommended
- **File size:** <100 MB

### Instagram Reels
- **Resolution:** 1080×1920 (9:16) or 1080×1080 (1:1)
- **Duration:** 3-90 seconds
- **Format:** MP4
- **Aspect ratio:** Portrait preferred
- **Captions:** Highly recommended

### LinkedIn
- **Resolution:** 1200×627 (16:9) or 1080×1080
- **Duration:** 3-10 minutes (but 8s is perfect)
- **Format:** MP4
- **Codec:** H.264
- **Upload:** Native video or link to YouTube

### Facebook
- **Resolution:** 1200×628 (16:9) or square
- **Duration:** No limit (8s is fine)
- **Format:** MP4 or video link
- **Autoplay:** Muted (sound enabled on click)

## Adding Captions/Subtitles

### Auto-Generated (YouTube)
1. Upload to YouTube
2. Go to Subtitles → Auto-generated
3. Review and publish
4. Captions appear automatically

### Manual Subtitles

Create `.vtt` file:

```vtt
WEBVTT

00:00:00.000 --> 00:00:02.000
Welcome to MathTutor Pro

00:00:02.000 --> 00:00:04.000
The AI-powered math tutor

00:00:04.000 --> 00:00:06.000
Get step-by-step solutions

00:00:06.000 --> 00:00:08.000
Master mathematics with AI
```

Embed in HTML:

```html
<video controls>
    <source src="mathtutor-pro.mp4" type="video/mp4">
    <track kind="subtitles" src="mathtutor-pro.vtt" srclang="en">
</video>
```

## Measuring Performance

### YouTube Analytics
- **Views:** How many watched
- **Watch time:** Average duration watched
- **Click-through rate:** Links clicked in description
- **Conversion:** Users who went to app

### Web Analytics

Track video engagement:

```javascript
// Google Analytics
gtag('event', 'video_play', {
    'video_title': 'MathTutor Pro Tutorial',
    'video_duration': 8
});

gtag('event', 'video_complete', {
    'video_title': 'MathTutor Pro Tutorial'
});
```

### Social Media Metrics
- **Impressions:** How many saw it
- **Engagement:** Likes, comments, shares
- **Shares:** How many shared to stories
- **Follows:** New followers from video
- **Clicks:** Visits to app page

## Launch Checklist

- [ ] Render all 3 tutorials to MP4
- [ ] Create YouTube thumbnails
- [ ] Upload to YouTube
- [ ] Add links to app landing pages
- [ ] Create onboarding modal (optional)
- [ ] Render portrait versions (optional)
- [ ] Post to social media
- [ ] Add to email campaigns
- [ ] Track performance metrics
- [ ] Iterate on copy/design

## Testing Before Launch

### Desktop
- [ ] Chrome, Firefox, Safari
- [ ] 1080p display
- [ ] Fast internet (5 Mbps)
- [ ] Slow internet (1 Mbps)

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 4G/LTE connection
- [ ] WiFi connection
- [ ] Vertical/portrait orientation
- [ ] Horizontal/landscape orientation

### Video Quality
- [ ] Plays smoothly (no stuttering)
- [ ] Audio works
- [ ] Controls visible
- [ ] Thumbnail visible while loading
- [ ] Quality adapts to connection

### Landing Pages
- [ ] Video loads quickly
- [ ] CTA button works
- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] Clicks convert to app

## Maintenance

### Regular Updates
- Check video performance monthly
- Update based on user feedback
- Refresh designs annually
- Test on new devices/platforms

### Version Management
Keep original compositions so you can update them:
```
mathtutor-pro/index.html  (original composition)
mathtutor-pro-v2/         (updated version if needed)
mathtutor-pro.mp4         (rendered video)
```

## Advanced: Custom Integrations

### Embedded Dashboard
Create page with all videos:

```html
<div class="tutorials-dashboard">
    <div class="tutorial-card">
        <iframe src="/videos/tutorials/mathtutor-pro/mathtutor-pro.mp4"
                width="600" height="338" frameborder="0"></iframe>
        <h3>MathTutor Pro</h3>
        <p>Learn how MathTutor Pro helps you solve any math problem.</p>
    </div>
    <!-- More cards -->
</div>
```

### Progressive Enhancement
Start with still image, enhance with video:

```html
<picture>
    <source srcset="/videos/tutorials/mathtutor-pro/mathtutor-pro.mp4" type="video/mp4">
    <img src="/images/mathtutor-pro-poster.jpg" alt="MathTutor Pro Tutorial">
</picture>
```

### Video Analytics SDK
Use Wistia, Vidyard, or Vimeo for detailed analytics:

```html
<script src="https://fast.wistia.net/embed/medias/[VIDEO_ID].jsonp" async></script>
<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;">
    <div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">
        <iframe src="https://fast.wistia.net/embed/iframe/[VIDEO_ID]" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allow="autoplay; fullscreen" allowfullscreen msallowfullscreen width="100%" height="100%"></iframe>
    </div>
</div>
```

## Support

For integration questions:
1. Review this guide
2. Check README.md for technical details
3. See SETUP.md for rendering options
4. Review CLAUDE.md for RHYTHMIX pipeline context

---

**Happy integrating!** 🎬✨

These videos should significantly improve app discovery and user onboarding by demonstrating value in the first 8 seconds.
