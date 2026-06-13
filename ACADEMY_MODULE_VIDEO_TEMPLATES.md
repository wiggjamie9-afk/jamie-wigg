# EventAI Academy — Module Intro Video Templates (HyperFrames)

## Overview

Each module gets a 30-second intro video in HyperFrames format. These play before the main module content and establish visual brand consistency using RHYTHMIX colors.

## RHYTHMIX Brand Colors (Used in Templates)

- **Primary**: `#3B82F6` (Blue) — backgrounds, accents
- **Accent**: `#9333EA` (Purple) — highlights, buttons, emphasis
- **Highlight**: `#F97316` (Orange) — key callouts, transitions
- **Success**: `#10B981` (Green) — checkmarks, progress
- **Error**: `#EF4444` (Red) — warnings, cautions

## Template 1: Module Intro (30 seconds)

**File**: `module-intro-template/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module Intro - EventAI Academy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1920px;
      height: 1080px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }

    .container {
      text-align: center;
      color: white;
      z-index: 10;
    }

    .module-number {
      font-size: 4rem;
      font-weight: bold;
      color: #9333EA;
      margin-bottom: 20px;
      text-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
    }

    .module-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 30px;
      line-height: 1.2;
      max-width: 1200px;
    }

    .module-desc {
      font-size: 1.5rem;
      opacity: 0.8;
      margin-bottom: 60px;
      max-width: 1000px;
      line-height: 1.6;
    }

    .week-badge {
      display: inline-block;
      background: rgba(147, 51, 234, 0.2);
      border: 2px solid #9333EA;
      color: #9333EA;
      padding: 12px 30px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.1rem;
    }

    /* Animated background shapes */
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.05;
    }

    .shape-1 {
      width: 600px;
      height: 600px;
      background: #9333EA;
      top: -200px;
      right: -200px;
    }

    .shape-2 {
      width: 500px;
      height: 500px;
      background: #F97316;
      bottom: -150px;
      left: -150px;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(20px);
      }
    }

    .float {
      animation: float 6s ease-in-out infinite;
    }
  </style>
</head>
<body>
  <div class="bg-shape shape-1 float"></div>
  <div class="bg-shape shape-2 float"></div>

  <div class="container">
    <div class="module-number" id="moduleNum">Module 5</div>
    <h1 class="module-title" id="moduleTitle">Real-time Sync with Supabase</h1>
    <p class="module-desc" id="modulDesc">
      Connect your event platform to PostgreSQL and broadcast changes instantly to all users
    </p>
    <span class="week-badge" id="weekBadge">Week 3</span>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    const timeline = gsap.timeline();

    // Stagger in from bottom
    timeline.from('.module-number', {
      duration: 0.8,
      opacity: 0,
      y: 100,
      ease: 'power2.out'
    });

    timeline.from('.module-title', {
      duration: 0.8,
      opacity: 0,
      y: 100,
      ease: 'power2.out'
    }, '-=0.4');

    timeline.from('.module-desc', {
      duration: 0.8,
      opacity: 0,
      y: 100,
      ease: 'power2.out'
    }, '-=0.4');

    timeline.from('.week-badge', {
      duration: 0.6,
      opacity: 0,
      scale: 0.8,
      ease: 'back.out'
    }, '-=0.4');

    // Subtle glow pulse on accent
    gsap.to('.module-number', {
      textShadow: '0 4px 20px rgba(147, 51, 234, 0.6)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  </script>
</body>
</html>
```

## Template 2: Checkpoint Reminder (20 seconds)

**For use in weekly email reminder videos**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkpoint Reminder - EventAI Academy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1920px;
      height: 1080px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }

    .container {
      text-align: center;
      color: white;
    }

    .checkpoint-box {
      background: rgba(147, 51, 234, 0.1);
      border-left: 8px solid #F97316;
      border-radius: 12px;
      padding: 60px 80px;
      margin-bottom: 40px;
      max-width: 900px;
    }

    .checkpoint-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .checkpoint-desc {
      font-size: 1.3rem;
      opacity: 0.8;
      margin-bottom: 30px;
    }

    .due-date {
      font-size: 1.1rem;
      color: #F97316;
      font-weight: 600;
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #9333EA, #7e22ce);
      color: white;
      padding: 18px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.2rem;
      margin-top: 30px;
      box-shadow: 0 8px 20px rgba(147, 51, 234, 0.3);
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 8px 20px rgba(147, 51, 234, 0.3);
      }
      50% {
        box-shadow: 0 8px 30px rgba(147, 51, 234, 0.6);
      }
    }

    .cta-button {
      animation: pulse 2s ease-in-out infinite;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="checkpoint-box">
      <h2 class="checkpoint-title">📝 Checkpoint Due Soon</h2>
      <p class="checkpoint-desc" id="checkpointDesc">
        Submit your Module 4 checkpoint to get mentor feedback
      </p>
      <p class="due-date" id="dueDate">Due by Friday, 11:59 PM ET</p>
      <div class="cta-button">Submit Now →</div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    const timeline = gsap.timeline();

    timeline.from('.checkpoint-box', {
      duration: 0.6,
      opacity: 0,
      scale: 0.9,
      ease: 'back.out'
    });

    timeline.from('.cta-button', {
      duration: 0.4,
      opacity: 0,
      y: 20,
      ease: 'power2.out'
    }, '-=0.3');
  </script>
</body>
</html>
```

## Template 3: Win Celebration (15 seconds)

**Plays when student launches their platform**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Shipped! - EventAI Academy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1920px;
      height: 1080px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }

    .container {
      text-align: center;
      color: white;
    }

    .rocket {
      font-size: 10rem;
      margin-bottom: 40px;
    }

    .celebration-text {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 30px;
      line-height: 1.2;
    }

    .platform-name {
      font-size: 2rem;
      opacity: 0.9;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #F97316;
      border-radius: 50%;
    }

    @keyframes confetti-fall {
      0% {
        transform: translateY(-100px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(800px) rotate(360deg);
        opacity: 0;
      }
    }

    .confetti {
      animation: confetti-fall 3s ease-in forwards;
    }
  </style>
</head>
<body>
  <div id="confetti-container"></div>

  <div class="container">
    <div class="rocket">🚀</div>
    <h1 class="celebration-text">You Shipped!</h1>
    <p class="platform-name" id="platformName">EventFlow is live</p>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    // Generate confetti
    const container = document.getElementById('confetti-container');
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.delay = Math.random() * 0.5 + 's';
      container.appendChild(confetti);
    }

    const timeline = gsap.timeline();

    timeline.from('.rocket', {
      duration: 0.6,
      opacity: 0,
      scale: 0,
      ease: 'back.out'
    });

    timeline.from('.celebration-text', {
      duration: 0.6,
      opacity: 0,
      y: 50,
      ease: 'power2.out'
    }, '-=0.3');

    timeline.from('.platform-name', {
      duration: 0.5,
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    }, '-=0.3');
  </script>
</body>
</html>
```

## Template 4: Week Start (20 seconds)

**Motivational weekly kickoff video**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Week Start - EventAI Academy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1920px;
      height: 1080px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }

    .container {
      text-align: center;
      color: white;
    }

    .week-number {
      font-size: 6rem;
      font-weight: 800;
      background: linear-gradient(135deg, #9333EA, #F97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
    }

    .week-label {
      font-size: 2rem;
      opacity: 0.8;
      margin-bottom: 60px;
    }

    .modules-list {
      max-width: 600px;
      margin: 0 auto;
      text-align: left;
    }

    .module-item {
      display: flex;
      align-items: center;
      padding: 20px;
      margin-bottom: 15px;
      background: rgba(147, 51, 234, 0.1);
      border-left: 4px solid #F97316;
      border-radius: 8px;
      font-size: 1.2rem;
    }

    .module-item::before {
      content: '▶';
      color: #F97316;
      margin-right: 20px;
      font-size: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="week-number">WEEK 3</div>
    <p class="week-label">You're halfway through! 🎉</p>

    <div class="modules-list">
      <div class="module-item">Event Filtering & Search</div>
      <div class="module-item">User Preferences</div>
      <div class="module-item">Analytics Dashboard</div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    const timeline = gsap.timeline();

    timeline.from('.week-number', {
      duration: 0.8,
      opacity: 0,
      scale: 0.5,
      ease: 'back.out'
    });

    timeline.from('.week-label', {
      duration: 0.6,
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    }, '-=0.4');

    gsap.from('.module-item', {
      duration: 0.5,
      opacity: 0,
      x: -50,
      stagger: 0.2,
      ease: 'power2.out',
      delay: 0.6
    });
  </script>
</body>
</html>
```

## Usage Instructions

1. **Copy template** into `rhythmix-module-<N>-<length>/index.html`
2. **Update IDs** with actual module data via script
3. **Generate narration** with Kokoro TTS:
   ```bash
   npx --yes hyperframes@0.4.42 tts --text "Module 5: Real-time Sync with Supabase. Connect your event platform to PostgreSQL and broadcast changes instantly to all users."
   ```
4. **Render to MP4**:
   ```bash
   npx --yes hyperframes@0.4.42 render
   ```
5. **Upload to YouTube** as unlisted
6. **Link from dashboard** or email

## Customization

### Colors (RHYTHMIX)
Replace these values globally:
- `#9333EA` → `#3B82F6` for primary color
- `#F97316` → custom highlight color
- `#10B981` → success color

### Duration
- Default module intro: 30 seconds (adjust with GSAP timeline durations)
- Checkpoint reminder: 20 seconds
- Win celebration: 15 seconds
- Week start: 20 seconds

### Fonts
Templates use `Inter` (default system fallback). Replace with:
- Georgia or serif font for titles
- Monospace for code snippets if needed

## Automation with n8n

Coming: n8n workflow to:
1. Read module schedule from Supabase
2. Generate video via template
3. Upload to YouTube
4. Email students with video link
5. Post to Discord

See `ACADEMY_N8N_WORKFLOWS_SOCIAL.md` for details.
