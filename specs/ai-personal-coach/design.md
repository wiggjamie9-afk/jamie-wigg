# AI Personal Coach — Design & Architecture

---

## UI/UX Flow

### 1. Onboarding (5 screens)

**Screen 1: Welcome**
- Headline: "Your AI Personal Coach"
- Subheading: "Get personalized workouts & nutrition"
- CTA: "Start Free Trial" (7 days)
- Alt: "Sign In"

**Screen 2: Fitness Profile**
- Age, weight, height, fitness level (segmented buttons)
- Goals (checkboxes: weight loss, muscle, endurance, flexibility, health)

**Screen 3: Constraints**
- Equipment access (home, gym, none)
- Injuries / limitations (text field)
- Time available per week (slider: 3-10 hours)

**Screen 4: Nutrition**
- Dietary restrictions (vegan, keto, paleo, gluten-free, none)
- Food preferences (favorites/hates)

**Screen 5: Baseline**
- Take progress photo (front, side, back)
- Measurements: chest, waist, hips, arms

### 2. Main App Screens

**Dashboard** (Tab 1)
- Welcome message from coach
- Today's workout (card with start button)
- Daily macro progress (bar chart)
- Streak counter (days in a row)
- Quick actions: Chat with coach, View meal plan

**Workout** (Tab 2)
- Today's workout expanded view
  - Exercises listed with: sets × reps, rest, form video
  - Check off each exercise as done
  - Notes field for difficulty feedback
- Weekly calendar showing completed/upcoming workouts
- Modify button: AI adjusts next workout

**Nutrition** (Tab 3)
- Daily macro tracker (protein, carbs, fat circles)
- Meal log: tap to add meals (AI searches food database)
- Shopping list for week
- Meal plan view: swipe through next 7 days

**Chat** (Tab 4)
- Message thread with AI coach
- Ask questions about form, workouts, nutrition, motivation
- Suggestions: "Ask me about your goals", "How are you feeling?"
- Quick tips from coach

**Profile** (Tab 5)
- Progress timeline (photos + stats)
- Subscription tier
- Settings (notifications, units, etc.)

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  created_at TIMESTAMP,
  subscription_tier ENUM ('free', 'starter', 'pro', 'premium'),
  subscription_expires TIMESTAMP,
  
  -- Profile
  age INT,
  weight_lbs DECIMAL,
  height_inches INT,
  fitness_level ENUM ('beginner', 'intermediate', 'advanced'),
  
  -- Preferences
  goals TEXT[], -- ['weight_loss', 'muscle', ...]
  equipment ENUM ('home', 'gym', 'none'),
  injuries TEXT,
  weekly_hours INT,
  dietary_restrictions TEXT[],
  
  -- Metrics
  baseline_photo_url VARCHAR,
  baseline_weight DECIMAL,
  baseline_date TIMESTAMP
);
```

### Workouts Table
```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  week INT,
  day INT,
  workout_data JSONB, -- {exercises: [{name, sets, reps, rest_sec, video_url}, ...]}
  created_at TIMESTAMP,
  regenerated_count INT DEFAULT 0
);
```

### Workout Logs Table
```sql
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  workout_id UUID REFERENCES workouts(id),
  completed_at TIMESTAMP,
  exercises_completed JSONB, -- {exercise_name: {actual_sets, actual_reps, weight}, ...}
  difficulty_feedback TEXT, -- 'easy', 'just_right', 'hard'
  notes TEXT
);
```

### Meals Table
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  meal_date DATE,
  meal_type ENUM ('breakfast', 'lunch', 'dinner', 'snack'),
  food_name VARCHAR,
  calories INT,
  protein_g DECIMAL,
  carbs_g DECIMAL,
  fat_g DECIMAL,
  created_at TIMESTAMP
);
```

### Chat History Table
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role ENUM ('user', 'assistant'),
  content TEXT,
  created_at TIMESTAMP,
  tokens_used INT
);
```

---

## API Endpoints

### Auth
- `POST /api/auth/signup` → Create account + onboarding
- `POST /api/auth/login` → JWT token
- `POST /api/auth/refresh` → New token
- `POST /api/auth/logout` → Invalidate

### Workouts
- `GET /api/workouts/current` → Today's workout
- `GET /api/workouts/week/:week` → All workouts for week
- `POST /api/workouts/:id/complete` → Log completed workout
- `POST /api/workouts/:id/modify` → Regenerate workout (too hard/easy)

### Nutrition
- `GET /api/meals/today` → Daily meals + macros
- `POST /api/meals` → Log meal (search food DB, AI calculates macros)
- `GET /api/meals/plan/:week` → Weekly meal plan
- `POST /api/meals/regenerate` → New meal plan

### Chat
- `POST /api/chat` → Send message → get AI response (OpenAI)
- `GET /api/chat/history` → Conversation history (paginated)

### Profile
- `GET /api/profile` → User data
- `PUT /api/profile` → Update goals, preferences
- `POST /api/profile/photo` → Upload progress photo
- `GET /api/profile/progress` → Timeline + metrics

---

## Tech Stack

**Frontend**:
- React 19 + TypeScript
- Tailwind CSS v4 for styling
- TanStack Query for data fetching
- Zustand for state management
- Shadcn/ui for components

**Mobile**:
- Capacitor for iOS/Android
- Camera access (progress photos)
- Push notifications (Firebase Cloud Messaging)
- Local storage (offline workouts)

**Backend**:
- Supabase (PostgreSQL, auth, real-time)
- Node.js/TypeScript for edge functions
- OpenAI API (GPT-4 for coaching)
- Spoonacular API (food database, recipes)

**Hosting**:
- Frontend: Vercel (Next.js)
- Backend: Supabase
- Mobile: App Store + Google Play

---

## Component Architecture

```
App
├── Auth (Login, Signup, Onboarding)
├── Dashboard
│  ├── WorkoutCard
│  ├── MacroProgress
│  ├── StreakCounter
│  └── CoachWelcome
├── Workout
│  ├── WorkoutList
│  ├── ExerciseItem
│  └── CompletionForm
├── Nutrition
│  ├── MacroTracker
│  ├── MealLog
│  ├── FoodSearch
│  └── MealPlan
├── Chat
│  ├── MessageList
│  ├── MessageInput
│  └── Suggestions
└── Profile
   ├── ProgressTimeline
   ├── Measurements
   └── SubscriptionStatus
```

---

## AI/Coaching Logic

### System Prompt (GPT-4)
```
You are an expert personal fitness coach with deep knowledge of anatomy, 
exercise science, and nutrition. Your goal is to help the user achieve 
their specific fitness goals through personalized guidance.

User Profile:
- Age: {age}
- Goals: {goals}
- Fitness Level: {fitness_level}
- Constraints: {constraints}
- Progress: {weeks_completed} weeks, {weight_change} lbs change

Always:
1. Be encouraging and positive
2. Ask clarifying questions if advice could be personalized
3. Explain the "why" behind recommendations
4. Adapt advice based on user feedback
5. Suggest modifications if user reports pain or struggles
6. Celebrate wins and progress
```

### Personalization Rules
- If user: missed 2 workouts → ask what's blocking, offer modifications
- If user: reports pain → replace exercise with alternatives
- If user: asks about form → either explain or recommend video
- If user: not losing weight → analyze meal log, suggest adjustments
- Every week: Generate progress report + next week modifications

---

## Screens (Wireframe)

All screens 100% mobile-first, RHYTHMIX branded:
- Primary: #9333EA (purple)
- Accent: #F97316 (orange)
- Secondary: #3B82F6 (blue)
- Success: #10B981 (green)

Safe area handling: Notch support for iPhone 12+
Tab size: 44px+ (touch-friendly)
Font: System fonts + clear hierarchy
