# 🤖 AI Personal Assistance — Stage One

A portfolio of four AI-powered apps across different life methods.

**Goal:** Build, ship, and monetize AI companions that address the six life methods explored in AI-ASSISTANCE-REVOLUTION.md.

---

## The Four Domains

### 1. **Code & Building** (`01-code-building/`)
AI companion for solopreneurs and indie developers.
- **Focus:** OpenSandbox-powered code execution, debugging, architecture review
- **Platforms:** Web-first, then mobile
- **Monetization:** $7.99–$14.99/month subscription
- **Target user:** Solo founder, indie dev, learner

### 2. **Creative Assets** (`02-creative-assets/`)
AI image/video generation for creators.
- **Focus:** Visual content generation (covers, thumbnails, social clips)
- **Platforms:** Web + iOS/Android
- **Monetization:** Freemium (free tier 5 renders/month, paid unlimited)
- **Target user:** Content creator, author, marketer, designer

### 3. **Learning Tools** (`03-learning-tools/`)
Self-directed skill-building with AI feedback.
- **Focus:** Spaced repetition + real-time feedback on practice
- **Platforms:** Web + iOS/Android
- **Monetization:** Freemium + subscription ($9.99/month)
- **Target user:** Career changer, skill-stacker, learner

### 4. **Wellness & Reflection** (`04-wellness-reflection/`)
Journaling + AI insight extraction (healing path).
- **Focus:** Safe externalization space + pattern recognition
- **Platforms:** Web + iOS/Android
- **Monetization:** Freemium + premium ($7.99/month for AI insights)
- **Target user:** Reflective person, healing journey, clarity seeker

---

## Folder Structure

```
ai-personal-assistance/
├── README.md (this file)
├── STRATEGY.md (monetization, pricing, go-to-market)
├── ROADMAP.md (phases, timeline, priorities)
│
├── 01-code-building/
│   ├── specs/
│   │   ├── requirements.md
│   │   ├── design.md
│   │   └── tasks.md
│   ├── code/
│   ├── assets/
│   └── research/
│
├── 02-creative-assets/
│   ├── specs/
│   ├── code/
│   ├── assets/
│   └── research/
│
├── 03-learning-tools/
│   ├── specs/
│   ├── code/
│   ├── assets/
│   └── research/
│
└── 04-wellness-reflection/
    ├── specs/
    ├── code/
    ├── assets/
    └── research/
```

---

## Phase Timeline

**Phase 1 (Weeks 1–4):** Research + Spec
- Market validation for each domain
- User interviews (target 5 per domain)
- Competitive teardown
- Spec + design for winner domain

**Phase 2 (Weeks 5–12):** Build first MVP
- Choose one domain to ship first (likely code or creative)
- Build web + landing page
- Beta with 100 users

**Phase 3 (Weeks 13–20):** Mobile + Monetization
- iOS/Android apps (Capacitor/React Native)
- Payment integration (Stripe, Apple IAP, Google Play)
- App store submission

**Phase 4 (Ongoing):** Scale + Expand
- User feedback loops
- Iterate based on retention
- Launch 2nd domain if #1 succeeds

---

## Key Metrics to Track

| Domain | Success Metric | Target (Year 1) |
|---|---|---|
| Code | Monthly active users | 500+ |
| Code | Paid conversion | 3–5% |
| Creative | Monthly renders | 10k+ |
| Creative | Paid users | 1000+ |
| Learning | Course completions | 50+ |
| Learning | Retention (week 4) | 20%+ |
| Wellness | Daily active users | 300+ |
| Wellness | Insight generation | 50+ unique patterns |

---

## Technology Stack

- **Frontend:** Next.js 15 (React 19), TypeScript, Tailwind
- **Backend:** Node.js / Supabase (auth, database, storage)
- **AI:** Claude API (reasoning, feedback, insights)
- **Payment:** Stripe (web), Apple IAP + Google Play (mobile)
- **Mobile:** Capacitor (iOS/Android from web)
- **Hosting:** Vercel (web), Cloudflare (workers for API)

---

## Start Here

1. Pick a domain (recommendation: **code-building** or **creative-assets** — highest market demand)
2. Read `specs/requirements.md` in that folder
3. Run user interviews (5 people in target segment)
4. Refine spec based on feedback
5. Design first flow + prototype

Next: Create `STRATEGY.md` with pricing tiers, CAC, LTV models.
