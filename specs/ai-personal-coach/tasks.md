# AI Personal Coach — Development Tasks

**Total Build Time**: 3-4 weeks  
**Team Size**: 1-2 developers  
**Priority**: 🔴 P1 (Start immediately)  

---

## PHASE 1: Setup & Auth (3-4 days)

### T1: Project scaffolding
- [ ] Create Next.js 15 app with TypeScript
- [ ] Setup Tailwind CSS v4
- [ ] Create folder structure: `/components`, `/pages`, `/lib`, `/hooks`
- [ ] Setup environment variables (OpenAI, Supabase, Stripe)
- **Depends**: None
- **Est**: 4 hours

### T2: Supabase setup
- [ ] Create Postgres database
- [ ] Create users, workouts, meals, chat_messages tables
- [ ] Setup Supabase Auth (email/password)
- [ ] Create RLS policies (users only see own data)
- [ ] Create edge functions for API endpoints
- **Depends**: None
- **Est**: 6 hours

### T3: Auth UI (Signup, Login, Logout)
- [ ] Signup page with email + password
- [ ] Email verification (if needed)
- [ ] Login page
- [ ] Logout button in profile
- [ ] Redirect logic (logged in → dashboard, not logged in → login)
- [ ] Error handling + validation
- **Depends**: T2
- **Est**: 4 hours

### T4: Onboarding flow
- [ ] Create 5-screen onboarding component (stepper)
  - Screen 1: Welcome
  - Screen 2: Fitness profile
  - Screen 3: Constraints (equipment, injuries, time)
  - Screen 4: Nutrition (dietary, preferences)
  - Screen 5: Baseline (photo + measurements)
- [ ] Save onboarding data to Supabase
- [ ] Photo upload to storage (Supabase)
- [ ] Redirect to dashboard after completion
- **Depends**: T3
- **Est**: 8 hours

---

## PHASE 2: Core Dashboard & Workouts (1 week)

### T5: Dashboard layout
- [ ] Create 5-tab navigation (Dashboard, Workout, Nutrition, Chat, Profile)
- [ ] Dashboard screen with:
  - Coach welcome message
  - Today's workout card
  - Macro progress bars
  - Streak counter
  - Quick action buttons
- [ ] Responsive design (mobile-first)
- [ ] RHYTHMIX colors + branding
- **Depends**: T4
- **Est**: 6 hours

### T6: AI workout generation
- [ ] Create function to call OpenAI GPT-4 with user profile
- [ ] System prompt tailored to user goals + constraints
- [ ] Parse GPT response into structured workout format
- [ ] Save generated workouts to Supabase (weeks 1-12)
- [ ] Handle errors and retries
- **Depends**: T2
- **Est**: 8 hours

### T7: Workout display & logging
- [ ] Workout tab: Display today's workout
  - List exercises: name, sets × reps, rest, equipment
  - Play video links (YouTube)
  - Check off each exercise
  - Notes field for difficulty feedback
- [ ] Logging: Save workout completion + details to DB
- [ ] Weekly view: Show completed/upcoming workouts
- [ ] Modify button: Trigger workout regeneration
- **Depends**: T6
- **Est**: 8 hours

### T8: Progress tracking basics
- [ ] Weight + measurements tracking
- [ ] Streak counter (days in a row of workouts)
- [ ] Weekly completion rate
- [ ] Basic dashboard stats
- [ ] Store in Supabase
- **Depends**: T5
- **Est**: 4 hours

---

## PHASE 3: Nutrition & Meals (1 week)

### T9: Food database integration
- [ ] Integrate Spoonacular API (or EDAMAM)
- [ ] Create food search endpoint
- [ ] Cache popular foods/meals
- [ ] Store macro information (protein, carbs, fat)
- **Depends**: T2
- **Est**: 6 hours

### T10: Meal logging UI
- [ ] Nutrition tab: Macro tracker (circular progress for P/C/F)
- [ ] "Add Meal" button → search food → select → log
- [ ] Meal list view (daily)
- [ ] Total macros at bottom (vs. daily goal)
- [ ] Edit/delete meals
- **Depends**: T9
- **Est**: 6 hours

### T11: AI meal planning
- [ ] Create function to call GPT-4 for personalized meal plans
- [ ] Generate 7-day meal plans based on:
  - Calorie goals
  - Macro targets
  - Dietary restrictions
  - Food preferences
- [ ] Save to Supabase
- [ ] Display in meal plan view (swipeable cards)
- **Depends**: T9, T10
- **Est**: 8 hours

### T12: Nutrition dashboard
- [ ] Macro tracker: Daily progress (visual + numbers)
- [ ] Meal plan: View next 7 days
- [ ] Shopping list: Generated from meal plan
- [ ] Quick meal suggestions
- **Depends**: T11
- **Est**: 4 hours

---

## PHASE 4: AI Chat & Coaching (1 week)

### T13: Chat UI
- [ ] Chat tab: Message list + input
- [ ] Display messages (user on right, AI on left)
- [ ] Input field + send button
- [ ] Loading state while waiting for AI
- [ ] Scroll to latest message
- [ ] Delete/edit messages (optional)
- **Depends**: T5
- **Est**: 4 hours

### T14: OpenAI integration
- [ ] Setup OpenAI API client
- [ ] Create system prompt (personalized for user)
- [ ] Send user message → get AI response
- [ ] Store conversation in Supabase (for context)
- [ ] Handle token limits (cache if needed)
- [ ] Cost optimization (don't send full history every time)
- **Depends**: T13, T2
- **Est**: 6 hours

### T15: Coaching logic
- [ ] Daily tips: AI generates (cron job or manual trigger)
- [ ] Weekly review: AI analyzes progress → suggestions
- [ ] Suggestion prompts: "Ask me about...", "How are you feeling?"
- [ ] Quick replies for common questions
- [ ] Motivation: Detect at-risk users (low engagement)
- **Depends**: T14
- **Est**: 8 hours

### T16: Form check (optional MVP+)
- [ ] Allow user to upload video of exercise
- [ ] Send to vision model (Claude or GPT-4V)
- [ ] Get AI feedback on form
- [ ] Return feedback to user
- **Depends**: T14
- **Est**: 6 hours

---

## PHASE 5: Profile & Analytics (3-4 days)

### T17: Profile screen
- [ ] Show user data (age, goals, fitness level)
- [ ] Edit button to update preferences
- [ ] Progress timeline (photos + weight graph)
- [ ] Subscription tier + manage button
- [ ] Settings (notifications, units, etc.)
- [ ] Logout button
- **Depends**: T5, T8
- **Est**: 6 hours

### T18: Progress analytics
- [ ] Weight trend graph (line chart)
- [ ] Completion rate (bar chart, weekly)
- [ ] Macro adherence (% days hitting targets)
- [ ] Workout volume (total sets/reps over time)
- [ ] Milestone badges (5 lbs lost, 50 workouts, etc.)
- **Depends**: T8, T12
- **Est**: 6 hours

### T19: Notifications setup
- [ ] Firebase Cloud Messaging setup
- [ ] Daily workout reminder (configurable time)
- [ ] Coaching tips (daily)
- [ ] Milestone celebrations
- [ ] Low engagement warning
- **Depends**: T5
- **Est**: 4 hours

---

## PHASE 6: Monetization & Launch (3-4 days)

### T20: Subscription tiers
- [ ] Free tier: chat + basic template workouts
- [ ] Starter ($9.99/mo): personalized workouts + nutrition
- [ ] Pro ($19.99/mo): daily coaching + form checks
- [ ] Premium ($49.99/mo): 1:1 monthly call
- [ ] Stripe integration
- [ ] Paywall UI (upgrade buttons)
- [ ] Trial logic (7-day free)
- **Depends**: T17
- **Est**: 8 hours

### T21: Analytics & tracking
- [ ] Segment or Mixpanel setup
- [ ] Track: signup, onboarding completion, first workout, churn
- [ ] Dashboard: Cohort analysis, LTV, D7/D30 retention
- [ ] Email campaigns (win-back, upsell)
- **Depends**: None
- **Est**: 4 hours

### T22: Mobile app (Capacitor)
- [ ] Create Capacitor project
- [ ] Sync web app code
- [ ] Build for iOS (Xcode)
- [ ] Build for Android (Android Studio)
- [ ] Submit to App Store + Google Play
- [ ] Setup push notifications on mobile
- **Depends**: All web features
- **Est**: 8 hours

### T23: Launch & polish
- [ ] Bug fixes + polish
- [ ] App Store screenshots + description
- [ ] Landing page (on rhythmixapp.com.au)
- [ ] Product Hunt launch preparation
- [ ] Social media content
- [ ] Email list seeding
- **Depends**: T22
- **Est**: 8 hours

---

## TIMELINE

### Week 1: Auth + Dashboard
- Days 1-2: Setup (T1, T2)
- Days 3-4: Auth UI (T3, T4)
- Days 4-5: Dashboard (T5)

### Week 2: Workouts + Nutrition
- Days 1-3: AI workout generation (T6, T7)
- Days 3-5: Meal logging (T9, T10, T11)
- Days 5-6: Progress tracking (T8, T12)

### Week 3: Chat + Coaching
- Days 1-3: Chat UI + OpenAI (T13, T14)
- Days 3-5: Coaching logic (T15, T16)
- Days 5-6: Profile (T17, T18)

### Week 4: Mobile + Launch
- Days 1-3: Notifications + monetization (T19, T20)
- Days 3-4: Mobile app (T22)
- Days 4-5: Launch prep (T23)

---

## Success Criteria

**Week 1**: 
- [ ] Auth + onboarding working
- [ ] Can view today's workout
- [ ] Data persists to Supabase

**Week 2**:
- [ ] AI generates personalized workouts
- [ ] Can log workouts + track progress
- [ ] Meal logging functional

**Week 3**:
- [ ] Chat with AI coach working
- [ ] Profile shows progress analytics
- [ ] All core features functional

**Week 4**:
- [ ] iOS app submitted to App Store
- [ ] Android app submitted to Play Store
- [ ] Landing page live
- [ ] 50+ beta users
- [ ] Stripe payments working

