# AI Personal Coach — Product Requirements

**Status**: 🚀 Ready to build  
**Market Confidence**: 95%  
**Revenue Potential**: $50-200K/mo  
**Build Time**: 3-4 weeks  
**Stack**: React + TypeScript + Supabase + OpenAI + Capacitor  

---

## Overview

An AI-powered personal health & fitness coach that creates personalized workout plans, nutrition guidance, and habit tracking through conversational AI. Uses GPT-4 to understand user fitness goals, constraints, and preferences, then delivers a customized 12-week program with daily workouts, meal plans, and progress tracking.

**Unique Positioning**: Unlike generic fitness apps, this coach learns your goals, injuries, equipment, dietary restrictions, and preferences through natural conversation, then provides truly personalized guidance that evolves as you progress.

---

## R1: User Authentication & Onboarding

- [ ] Email/password signup with email verification
- [ ] Onboarding flow: 5 screens capturing fitness profile
  - Age, weight, height, fitness level (beginner/intermediate/advanced)
  - Goals (weight loss / muscle gain / endurance / flexibility / general health)
  - Equipment access (home / gym / none)
  - Injuries / limitations
  - Dietary restrictions
  - Available time per week
- [ ] Progress tracking setup: baseline photos + measurements
- [ ] Supabase Auth integration

---

## R2: AI Conversation Engine

- [ ] Chat interface for user-AI coach conversations
- [ ] GPT-4 integration for personalized recommendations
- [ ] Context awareness: remembers previous conversations, goals, preferences
- [ ] Response types:
  - Immediate: Quick Q&A (form checks, motivation, technique tips)
  - Personalized: Custom workout modifications, meal suggestions
  - Scheduled: Daily coaching tips, weekly progress reviews
- [ ] System prompt: Coach persona (encouraging, knowledgeable, data-driven)
- [ ] Token limits: Cache long conversations to reduce API costs

---

## R3: Personalized Workout Plans

- [ ] 12-week progressive programs (generated per user)
- [ ] Daily workouts with:
  - Exercise list (name, sets, reps, rest time, form tips)
  - Video demonstrations (linked to YouTube or form guide)
  - Equipment alternatives for home/gym
  - Rest day schedules
- [ ] Auto-adjust based on user feedback
  - "Too hard" → reduce volume/intensity
  - "Too easy" → increase weight/volume
  - "Shoulder pain" → swap exercises
- [ ] Templates: Full-body, upper/lower, push/pull/legs, sports-specific

---

## R4: Nutrition & Meal Planning

- [ ] AI generates personalized meal plans based on:
  - Calorie goals (derived from goals + activity)
  - Macros (calculated per user goals: cutting/bulking/maintaining)
  - Dietary restrictions (vegan, gluten-free, paleo, keto, etc.)
  - Food preferences
- [ ] Meal database with 500+ recipes (macros included)
- [ ] Shopping list generation
- [ ] Macro tracker: Log meals → track daily totals
- [ ] Integration with recipe APIs (Spoonacular, EDAMAM)

---

## R5: Progress Tracking

- [ ] Daily check-ins: Weight, how you feel, energy level
- [ ] Weekly metrics dashboard:
  - Weight trend (graphed)
  - Workout completion rate
  - Macro adherence
  - Progress photos (side-by-side comparison)
- [ ] Milestone celebrations (5 lbs lost, 50 workouts completed, etc.)
- [ ] Progress reports: AI generates weekly summary + next week adjustments

---

## R6: Habit Streaks & Motivation

- [ ] Daily habit tracking: Workout completed, meals logged, water intake, sleep
- [ ] Streak counter: Days in a row of consistency
- [ ] Badges/achievements unlocked
- [ ] Weekly challenges (e.g., "3 workouts this week", "Macro target 5/7 days")
- [ ] Push notifications: Daily reminders, milestone celebrations
- [ ] Community leaderboard (optional): Compare streaks with friends

---

## R7: Coaching Features

- [ ] Daily AI coaching tips (pushed at set time)
- [ ] Weekly progress review from coach (auto-generated)
- [ ] Form check: User submits video → AI feedback (via vision models)
- [ ] Injury recovery: AI adapts workouts if user reports pain
- [ ] Motivation: AI identifies when user is at risk of dropout, sends personalized encouragement
- [ ] FAQ: Common questions answered by AI (form, nutrition, recovery, motivation)

---

## R8: Mobile App (iOS + Android)

- [ ] Native app via Capacitor
- [ ] Offline capability: Sync workouts/meals when back online
- [ ] Push notifications: Workout reminders, coaching tips
- [ ] Camera access: Progress photos, form checks
- [ ] Home screen widget: Today's workout, macro progress

---

## R9: Monetization

- [ ] Free tier: Chat with coach (basic), browse workouts (no personalization)
- [ ] Starter: $9.99/mo → personalized workouts + nutrition plans
- [ ] Pro: $19.99/mo → all above + daily coaching + form checks
- [ ] Premium: $49.99/mo → all above + 1:1 monthly check-in call with human coach
- [ ] Annual discounts: 20% off (paid yearly)
- [ ] Stripe integration for payments
- [ ] Trial: 7-day free trial for paid plans

---

## R10: Analytics & Retention

- [ ] Collect: Workout completion, meal adherence, engagement, churn signals
- [ ] Dashboard for creators: Cohort analysis, LTV, churn rate
- [ ] Email campaigns: Win-back for inactive users, upsell to higher tier
- [ ] In-app messaging: Personalized offers based on usage

---

## User Stories

**US1**: As a user, I want to sign up and tell the coach my fitness goals so I get a personalized program.  
**US2**: As a user, I want to chat with the coach and ask for workout modifications so my program stays relevant.  
**US3**: As a user, I want to log my workouts and see my progress over 12 weeks so I stay motivated.  
**US4**: As a user, I want personalized meal plans and macro tracking so I fuel my workouts properly.  
**US5**: As a user, I want push notifications for workouts and daily coaching tips so I stay on track.  
**US6**: As a user, I want my data synced across phone/web so I can access my coach anywhere.  

---

## Success Metrics (Month 1)

- [ ] 100+ users signed up
- [ ] 60%+ activate (start a program)
- [ ] 50%+ complete week 1
- [ ] 30%+ complete week 4
- [ ] 80% user satisfaction (NPS >50)
- [ ] 5+ reviews on App Store (4.5+ stars)

---

## Success Metrics (Month 3)

- [ ] 500+ users
- [ ] 200+ paying (Starter+)
- [ ] $8K-15K MRR
- [ ] 40%+ completion rate (full 12 weeks)
- [ ] <5% churn (from paying)
- [ ] 50+ testimonials/success stories

---

## Success Metrics (Month 12)

- [ ] 5,000+ users
- [ ] 2,000+ paying
- [ ] $40-80K MRR
- [ ] Featured on App Stores
- [ ] 10K+ Instagram followers
- [ ] Podcast appearances / media coverage
