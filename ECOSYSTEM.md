# RHYTHMIX + STARLIGHTMIX Production Ecosystem

**Vision:** State-of-the-art AI agent network for end-to-end creative production, app development, and commerce automation. One command to go from concept → video → app → sales funnel → revenue.

**Status:** MVP architecture (Phase 1 of 3)

---

## Agent Roster by Domain

### 🎬 Creative Production

| Agent | Purpose | Tools |
|-------|---------|-------|
| **video-producer** | End-to-end video: script → storyboard → animation → render | HyperFrames, Kokoro TTS, Replicate (video), ffmpeg |
| **animation-choreographer** | Character motion, keyframe control, smooth transitions | GSAP, Blender API (future), motion capture (future) |
| **motion-graphics-designer** | Title sequences, transitions, effects, visual polish | After Effects (via MCP), GSAP, Lottie |
| **3d-artist** | 3D models, renders, product visualization | Blender MCP, Replicate (3D), texture generation |
| **illustrator** | Character design, backgrounds, concept art | Higgsfield Soul, FLUX (Replicate), Midjourney (future) |
| **cartoon-animator** | Full cartoon/anime pipeline: storyboard → layout → animation | Krita, OpenToonz (future), frame interpolation |

### 💻 App Development

| Agent | Purpose | Tools |
|-------|---------|-------|
| **app-architect** | Full-stack design: data model → API → UI → deployment | TypeScript, React, Next.js, Supabase |
| **frontend-engineer** | React/Vue/Svelte components, responsive design, accessibility | TypeScript, Tailwind, Storybook, Playwright |
| **backend-engineer** | APIs, databases, auth, integrations, scaling | Node.js, Python, PostgreSQL, Redis |
| **mobile-engineer** | iOS/Android native and cross-platform (React Native, Flutter) | Xcode, Android Studio, Capacitor, Expo |
| **devops-engineer** | CI/CD, infrastructure, monitoring, security | GitHub Actions, Docker, Vercel, Cloudflare, AWS |

### 📱 App Stores & Distribution

| Agent | Purpose | Tools |
|-------|---------|-------|
| **app-store-optimizer** | App listing, screenshots, reviews, ratings, ASO | App Store Connect, Google Play Console, Sensor Tower |
| **beta-tester-coordinator** | TestFlight/Play Beta, feedback loops, crash reporting | TestFlight, Firebase Crashlytics, Amplitude |

### 📺 YouTube & Content Distribution

| Agent | Purpose | Tools |
|-------|---------|-------|
| **youtube-strategist** | Channel growth, series planning, upload optimization, analytics | YouTube API, TubeBuddy, VidIQ |
| **thumbnail-designer** | Eye-catching thumbnails, A/B testing, consistency | Figma, FLUX (Replicate), Canva |
| **shorts-producer** | TikTok/Reels/Shorts adaptation, fast-turnaround edits | Replicate (video), ffmpeg, short-form optimization |
| **community-manager** | Comments, community posts, Discord/Twitter engagement | Discord API, Twitter API, Notion |

### 💰 Sales & Marketing

| Agent | Purpose | Tools |
|-------|---------|-------|
| **funnel-architect** | Landing pages → email sequences → payment → retention | Supabase, Stripe, Mailchimp, Segment |
| **copywriter** | Sales pages, emails, ad copy, value propositions | Claude (prompts), Anthropic API, A/B testing |
| **paid-ads-strategist** | Google Ads, Facebook Ads, TikTok Ads, retargeting | Google Ads API, Facebook Marketing API, pixel tracking |
| **affiliate-manager** | Partner programs, influencer outreach, commission tracking | Refersion, PartnerStack, custom dashboards |
| **product-launch-coordinator** | Timeline, messaging, press kit, go-live checklist | Linear, GitHub Issues, Slack automation |

### 📊 Business Intelligence & Ops

| Agent | Purpose | Tools |
|-------|---------|-------|
| **analytics-engineer** | Dashboards, metrics, revenue tracking, cohort analysis | Mixpanel, Segment, Looker, dbt |
| **financial-forecaster** | Revenue projections, CAC/LTV, pricing models, unit economics | Jupyter, Python, Stripe API |
| **contract-lawyer** | Terms of service, privacy, refund policies, licensing | LawGeex (future), template library |

---

## Core Workflows

### Workflow 1: Video → YouTube → Revenue

```
concept
  ↓
scriptwriter (writes script + voiceover cues)
  ↓
video-producer (HyperFrames composition)
  ↓
motion-graphics-designer (polish, titles, transitions)
  ↓
voicebox-agent (clone voice, record narration)
  ↓
video-producer (render → MP4)
  ↓
youtube-strategist (optimize title, tags, description)
  ↓
thumbnail-designer (A/B test 3 thumbnails)
  ↓
shorts-producer (extract 15-second clips for TikTok/Reels)
  ↓
community-manager (pin comments, respond to top comments)
  ↓
analytics-engineer (track watch time, CTR, conversion to next video)
  ↓
funnel-architect (retarget viewers → product landing page)
  ↓
copywriter (craft email sequence for viewers)
  ↓
financial-forecaster (measure CAC from YouTube → LTV)
```

### Workflow 2: App Concept → App Store → Monetization

```
product-idea
  ↓
app-architect (spec design → Supabase schema → API routes)
  ↓
frontend-engineer (React components, Figma → code)
  ↓
backend-engineer (Node.js APIs, auth, database)
  ↓
mobile-engineer (React Native or native iOS/Android)
  ↓
devops-engineer (GitHub Actions → TestFlight/Play Beta)
  ↓
beta-tester-coordinator (TestFlight beta, crash analysis)
  ↓
app-store-optimizer (app listing, screenshots, A/B test icons)
  ↓
product-launch-coordinator (press kit, announcement video)
  ↓
video-producer (app trailer, feature walkthrough)
  ↓
shorts-producer (30-second app feature clips)
  ↓
paid-ads-strategist (Google UAC, Facebook App Install Ads)
  ↓
analytics-engineer (install tracking, onboarding funnel)
  ↓
financial-forecaster (LTV modeling, pricing strategy)
  ↓
community-manager (support Discord, feature voting)
```

### Workflow 3: Animated Series → Multiple Platforms → Merch

```
story-concept
  ↓
storyboard-artist (Figma boards, scene breakdown)
  ↓
illustrator (character design, background art)
  ↓
cartoon-animator (keyframe animation, lip-sync)
  ↓
motion-graphics-designer (title cards, transitions)
  ↓
voicebox-agent (multi-character voice recording)
  ↓
sound-engineer (SFX, music, mix to stereo)
  ↓
video-producer (final render, color grade)
  ↓
youtube-strategist (upload, series playlist, community tab)
  ↓
shorts-producer (extract funny moments for TikTok/Reels)
  ↓
thumbnail-designer (character-driven thumbnails)
  ↓
3d-artist (generate merchandise designs from characters)
  ↓
print-on-demand-agent (upload to Printful, Teespring)
  ↓
affiliate-manager (creator partnerships, fan stores)
  ↓
paid-ads-strategist (retarget fans → merch store)
  ↓
analytics-engineer (series performance, merch revenue attribution)
```

---

## MCP Servers (Integrations)

| Server | Endpoint | Purpose |
|--------|----------|---------|
| **creative-stack** | local node | Replicate (FLUX, HunyuanVideo, MusicGen) + ElevenLabs TTS |
| **voicebox** | `http://127.0.0.1:17493/mcp` | Voice cloning, TTS, voice-in/voice-out agent workflows |
| **higgsfield** | local | Soul (text-to-image), DOP (image-to-video), character refs |
| **github** | https | PR/issue automation, CI/CD triggers, release coordination |
| **stripe** | https | Payment processing, subscription webhooks, revenue tracking |
| **youtube-api** | https | Video uploads, playlist management, analytics |
| **supabase** | https | Auth, database, real-time sync for apps |
| **slack** | https | Notifications, workflow coordination, async updates |

---

## Skill Playbooks (Key Templates)

Each playbook is a repeatable, runbook-style workflow for common tasks.

### Playbook 1: Launch a Video Series (4 weeks)

```
Week 1: Concept → Script
  - story-concept → storyboard-artist
  - scriptwriter: 5-minute script with voiceover cues
  - voicebox-agent: record narration (Jamie profile)

Week 2: Storyboard → Animation
  - illustrator: character design + backgrounds
  - cartoon-animator: 5-minute animated sequence
  - motion-graphics-designer: title + transitions

Week 3: Render → Publish
  - video-producer: final render (1080p, 24fps)
  - youtube-strategist: upload, playlist, SEO
  - thumbnail-designer: 3 A/B variants

Week 4: Distribute → Measure
  - shorts-producer: TikTok/Reels clips
  - community-manager: pin top comments
  - analytics-engineer: weekly performance dashboard
```

### Playbook 2: Ship an App (8 weeks)

```
Week 1-2: Design & Spec
  - app-architect: full data model + API spec
  - frontend-engineer: component library
  - designer: Figma prototype

Week 3-4: Backend Development
  - backend-engineer: API routes, auth, database
  - devops-engineer: GitHub Actions setup

Week 5-6: Frontend & Mobile
  - frontend-engineer: React build
  - mobile-engineer: React Native / native iOS build
  - beta-tester-coordinator: TestFlight setup

Week 7: Polish & Optimize
  - devops-engineer: performance tuning, security audit
  - analytics-engineer: event tracking setup

Week 8: Launch
  - product-launch-coordinator: press kit, announcement
  - app-store-optimizer: listing, screenshots, keywords
  - paid-ads-strategist: first campaigns live
```

### Playbook 3: Monetize Existing Content

```
Step 1: Audience Segmentation
  - analytics-engineer: cohort analysis of top viewers

Step 2: Offer Design
  - copywriter: 3 offer variations (app, course, merch)
  - funnel-architect: landing page layout

Step 3: Creative Assets
  - video-producer: product demo video
  - thumbnail-designer: landing page hero image

Step 4: Funnel Activation
  - funnel-architect: email sequence (5 emails over 7 days)
  - paid-ads-strategist: retargeting audience (YouTube viewers)

Step 5: Measure & Iterate
  - analytics-engineer: daily revenue dashboard
  - copywriter: A/B test email subject lines
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15 (React 19, TypeScript, Tailwind v4)
- **Animation:** GSAP, Framer Motion
- **UI Component:** shadcn/ui, Storybook
- **Testing:** Vitest, Playwright

### Backend
- **Runtime:** Node.js 20, Python 3.11+
- **Database:** PostgreSQL (Supabase)
- **Cache:** Redis
- **Message Queue:** Bull (Redis-backed)
- **APIs:** REST + GraphQL (Apollo)

### Creative Tools
- **Video:** HyperFrames, FFmpeg, Kokoro TTS, Replicate
- **Image:** FLUX (Replicate), Higgsfield Soul, DALL-E 3 (future)
- **Animation:** Lottie, Three.js, Blender (future)
- **Audio:** ElevenLabs, Voicebox, Suno (Replicate)

### Deployment & Infra
- **Web:** Vercel / Cloudflare Pages
- **Mobile:** App Store / Google Play (Codemagic)
- **Storage:** Cloudflare R2, AWS S3
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, LogRocket, Posthog

### Commerce & Analytics
- **Payments:** Stripe, Gumroad
- **Email:** Mailchimp, Resend
- **Analytics:** Mixpanel, Segment, Looker
- **CRM:** Linear, Notion

---

## Phase 2 & 3 (Future)

### Phase 2: AI Model Training & Fine-tuning
- Train custom Dreambooth models for character consistency
- Fine-tune LLMs for domain-specific copywriting
- Optimize video interpolation models for smoother animation

### Phase 3: Autonomous Orchestration
- Multi-agent orchestrator (handles task sequencing, error recovery)
- Real-time revenue dashboard with predictive forecasts
- Fully autonomous product launch (concept → code → live → monetized in 24h)

---

## Getting Started

1. **Set up MCP servers** (see `.mcp.json`)
2. **Load skill playbooks** (run `/playbook-launch-video-series`, etc.)
3. **Connect to Stripe, YouTube, Supabase** (environment variables in `.env`)
4. **Run first workflow** (e.g., `/launch-video-series "Frequency Healing Documentary"`)

---

## Success Metrics

- **Content Velocity:** New video / week
- **App Velocity:** New app / quarter
- **Revenue:** $X / month from video + apps + merch
- **Community:** X subscribers, X daily active users
- **Team:** All workflows fully automated, hands-off operation

---

*Generated by ecosystem architect agent. Last updated: 2026-06-15.*
