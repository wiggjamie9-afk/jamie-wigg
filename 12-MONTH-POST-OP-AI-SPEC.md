# 12-Month Post-Op Life Transformation AI — Complete Spec

**Status:** Ready for independent build  
**Architecture:** Standalone AI health monitoring system  
**Tech Stack:** Vanilla JS, Claude API, Wearable APIs, PWA  
**Timeline:** 12-month post-operative care companion  

---

## Overview

A medical-grade AI health monitoring and meal planning system for patients in their first 12 months after weight loss surgery (gastric sleeve, bypass, band, duodenal switch). Integrates doctor results, meal plans, wearable vitals (Apple Watch, Fitbit, Garmin), and Claude AI to generate personalized recipes, strategies, and real-time interventions.

---

## Core Features

### 1. Document Intake & Scanning
**What users upload:**
- Post-op checkup results (PDF/photo): weight, labs (protein, iron, B12, calcium, albumin), surgeon clearance
- Meal plan from surgeon/nutritionist (PDF/photo)
- Personal goals (weight loss target, fitness goals, confidence milestones, career goals)
- Surgery date, surgery type (gastric sleeve, bypass, band, duodenal switch)

**Technical:**
- OCR scanning (or manual entry)
- Store as JSON in localStorage
- Monthly re-upload workflow

### 2. Wearable Integration
**Supported wearables:**
- Apple Health (Apple Watch, iPhone)
- Google Fit (Android, Wear OS)
- Fitbit API
- Garmin Connect API
- Oura Ring API
- Withings (smart scales)

**Data synced:**
- Heart rate (real-time, resting, max, variability)
- Blood pressure (systolic/diastolic)
- Weight (daily/weekly trends)
- Sleep (duration, quality)
- Steps/activity (calories burned, movement)
- Temperature (some watches)

**Update frequency:** Real-time to daily (depending on wearable)

### 3. Claude AI Analysis Engine

**Inputs to Claude:**
```
User Profile:
- Surgery type, date, phase (Month 1-12)
- Doctor results: weight, labs, clearances
- Wearable data: HR, BP, weight trend, sleep, activity
- Goals: target weight loss, fitness, confidence, career
- Current meal plan from surgeon

Claude analyzes and outputs:
- Personalized recipes (safe for current phase, matching lab needs)
- Meal timing (exact times: 7am, 10am, 1pm, 4pm, 7pm)
- Calorie/macro targets (based on weight loss pace, muscle preservation)
- Strategies (salt reduction if BP high, iron supplementation if low, etc.)
- Fitness recommendations (phase-appropriate, cleared by surgeon)
- Alerts (anomalies, warnings, escalations)
- Monthly adjustments (as they heal and hit goals)
```

**Claude Prompt Template:**
```
You are a specialized post-operative nutrition and health AI coach for weight loss surgery patients.

PATIENT PROFILE:
- Surgery: [type], [date], [phase: Month X/12]
- Current weight: [Xkg], Target: [Ykg], Pace: [Xlbs/week]
- Doctor results: Protein [Xg/dL], Iron [Xµg/dL], B12 [Xpg/mL], Calcium [Xmg/dL]
- Surgeon clearances: [list]
- Wearable data: HR [avg/resting], BP [systolic/diastolic], Sleep [X hours], Activity [X steps]

GOALS (12 months):
- Weight: [X lbs loss]
- Fitness: [e.g., run 5K, lift Xlbs]
- Confidence: [e.g., feel comfortable in clothes, socialize]
- Career: [e.g., more energy, focus]

MEAL PLAN (surgeon's):
[paste surgeon/nutritionist meal plan]

Generate for next month:
1. Weekly meal plan (5 recipes, safe for current phase, matching lab deficiencies)
2. Daily meal timing (exact times, portion sizes in oz)
3. Macro targets (protein/carbs/fat for current goal pace)
4. Supplement timing (calcium, iron, B12, vitamin D — separate from meals)
5. Fitness plan (phase-appropriate exercises, cleared by surgeon, intensity)
6. Strategies (e.g., "Your BP is 145/92 — reduce sodium to <1500mg, add 20 min cardio")
7. Alerts (anomalies detected in wearable data, what to do)

Remember: Not a replacement for doctor. Escalate serious issues immediately.
```

### 4. Real-Time Vitals Dashboard
**Displays:**
- Heart rate: Current, resting, trends (is it improving post-op?)
- Blood pressure: Current, trends, safe ranges for post-op
- Weight: Daily/weekly/monthly graph, pace toward goal
- Sleep: Hours, quality, impact on metabolism
- Activity: Steps, calories burned, alignment with fitness goals
- Lab trends: Protein, iron, B12, calcium (from monthly uploads)

**Visual alerts (color-coded):**
- 🟢 Green: Normal, on track
- 🟡 Yellow: Warning (e.g., weight loss stalling, BP slightly elevated)
- 🔴 Red: Urgent (e.g., heart rate dangerously high, BP severely elevated, rapid weight loss)

### 5. Personalized Meal Planning
**Generated weekly:**
- 5 recipes (safe for current surgery phase)
- Exact meal times (7am breakfast, 10am snack, 1pm lunch, 4pm snack, 7pm dinner)
- Portion sizes (e.g., "4oz chicken + 2oz rice")
- Macro targets (protein/carbs/fat per meal)
- Shopping list (organized by aisle)

**Month-specific phases:**
```
Month 1-3 (Recovery):
- Clear liquids → purées → soft foods
- Calories: 800-1000/day (healing priority)
- Protein: 30-40g/day (from liquids/shakes)
- Focus: Hydration, nutrient absorption, healing

Month 4-6 (Build):
- Soft foods → solid foods
- Calories: 1200-1500/day
- Protein: 60-80g/day (muscle preservation)
- Focus: Strength, establishing habits, exercise prep

Month 7-9 (Accelerate):
- Regular foods (all textures safe)
- Calories: 1500-1800/day (fitness-dependent)
- Protein: 80-100g/day (if strength training)
- Focus: Fitness progress, confidence, social eating

Month 10-12 (Sustain):
- Maintenance phase
- Calories: 1800-2200/day (goal weight dependent)
- Protein: 80-120g/day (maintain muscle)
- Focus: Long-term habits, life integration
```

### 6. Fitness Programming
**Phase-appropriate exercises (cleared by surgeon):**
```
Month 1-3: Rest, gentle movement
- Walking: 5-10 min, 2-3x/day
- Stretching: gentle, avoid core
- No heavy lifting, no impact

Month 4-6: Light movement, bodyweight
- Walking: 15-30 min, 5x/week
- Bodyweight: squats, wall push-ups (no weights)
- Water aerobics: gentle
- No running, jumping, or heavy lifting

Month 7-9: Moderate exercise, light weights
- Cardio: 30-45 min, 4x/week (walking, cycling, elliptical)
- Strength: 2x/week, light weights (2-5kg), high reps
- Running: if cleared, start with walk/run intervals
- No max-effort training

Month 10-12: Full exercise, goal-dependent
- Cardio: 45-60 min, 5x/week (running, cycling, HIIT optional)
- Strength: 3x/week, progressive weights, lower reps
- Sports: cleared activities
- Performance: building toward 12-month goals
```

### 7. Medical Escalation & Safety Guardrails

**Auto-escalation triggers (tell user to call surgeon immediately):**
- Heart rate >120 at rest (post-op complication signal)
- Heart rate <50 (serious concern)
- Blood pressure >160/100 (hypertensive crisis risk)
- Blood pressure <90/60 (shock risk, post-op dehydration)
- Weight loss >3 lbs/week (malnutrition risk)
- Weight loss stalled >4 weeks (metabolic adaptation, review needed)
- Severe abdominal pain (not typical post-op soreness)
- Persistent vomiting (obstruction risk)
- Blood in vomit/stool (bleeding)
- Fever >101°F (infection)
- Signs of dumping syndrome (severe dizziness, sweating, palpitations)

**Auto-recommendations (safe to implement):**
- "Your sodium is 2800mg (target <1500) — next week's meals will be low-sodium"
- "Your sleep is 5 hours/night — prioritize 7-8 hours. Add melatonin 3mg at 9pm"
- "Your iron is low — reduce calcium at meals, increase red meat, consider iron supplement"
- "Your weight loss is 2 lbs/week (target 4) — increase protein by 20g, add 15 min cardio"
- "Your resting heart rate is trending up — reduce caffeine, increase sleep"

### 8. Monthly Re-Assessment Workflow

**Every month (user uploads new doctor results):**
1. Scan new weight, lab results
2. Claude re-analyzes: "You've lost 5 lbs this month (on pace!). Your protein is still low — next month recipes will have +15g protein per meal"
3. Update meal plan for next month
4. Adjust fitness intensity if needed
5. Celebrate milestones: "You've lost 20 lbs! Goal: 30 more by month 12."

### 9. Psychological Support & Milestones

**Tracks non-scale victories:**
- Energy level (1-10 daily rating)
- Confidence (1-10 weekly rating)
- Clothes fit changes (user uploads photos)
- Social wins (e.g., "Ate with friends without anxiety")
- Fitness milestones (e.g., "Walked 30 min without stopping!")
- Career/life wins (e.g., "More focused at work," "Started dating again")

**AI-generated affirmations:**
- "You're 1/3 through your journey — you're doing great!"
- "Weight loss stalled, but your sleep improved — body is healing"
- "Your strength is up 5 lbs — you're building muscle!"

### 10. Community (Optional)
- Connect with others in same month (Month 3 Buddy, Month 8 Buddy)
- Anonymous stories: "How I handled social eating in month 4"
- Support groups: link to Reddit, Facebook groups, therapist finder

---

## Technical Architecture

### Frontend
**Stack:** Vanilla JavaScript, HTML5, CSS (Stitch Vibe Design)

**Files:**
```
post-op-companion/
├── index.html              (main app shell)
├── app.js                  (core logic)
├── wearable-sync.js        (Apple Health, Google Fit, Fitbit integration)
├── claude-ai.js            (Claude API calls)
├── document-scanner.js     (OCR or manual entry)
├── dashboard.js            (vitals display)
├── meal-planner.js         (recipe display, timing)
├── fitness-planner.js      (exercise recommendations)
├── medical-tracker.js      (labs, weight trends)
├── settings.js             (API keys, wearable auth)
├── styles.css              (Stitch design system)
├── manifest.webmanifest    (PWA metadata)
├── sw.js                   (Service Worker, offline)
└── assets/                 (icons, graphics)
```

### Backend (Optional, for persistence)
**If storing data in cloud:**
- Node.js + Express
- PostgreSQL or Firebase
- Store: doctor results, meal plans, wearable history, goals
- Auth: OAuth (Apple, Google, Fitbit, Garmin)

**If offline-only (simpler):**
- localStorage + IndexedDB
- No server needed
- User's data stays on device (HIPAA-friendly)

### APIs to Integrate

**Wearable APIs:**
- Apple HealthKit: `/Health` framework (iOS native or web)
- Google Fit: `https://www.googleapis.com/fitness/v1/`
- Fitbit: `https://api.fitbit.com/`
- Garmin: `https://developer.garmin.com/`
- Oura: `https://api.ouraring.com/`
- Withings: `https://developer.withings.com/`

**Claude API:**
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_API_KEY,
  },
  body: JSON.stringify({
    model: 'claude-opus-4-8',
    max_tokens: 2048,
    system: `You are a post-operative nutrition AI...`,
    messages: [
      {
        role: 'user',
        content: `Patient profile: [JSON of doctor results, wearables, goals]\n\nGenerate personalized meal plan and fitness recommendations.`
      }
    ]
  })
});
```

---

## UI/UX Flow

### Tab Structure (6 tabs)
1. **Dashboard** — vitals, alerts, quick stats
2. **Meal Plan** — weekly recipes, meal timing, shopping list
3. **Fitness** — exercise recommendations, workout calendar
4. **Medical Tracker** — lab trends, weight, BP, sleep graph
5. **Documents** — upload doctor results, meal plans, goals
6. **Settings** — API keys, wearable auth, profile

### Design System (Stitch Vibe Design)
- **Color:** Warm, compassionate (soft pink primary #FFE4E1, warm secondary #FFDAB9)
- **Typography:** Clear, large (accessibility for varied ages)
- **Animation pace:** Slow (800ms) — supportive, not rushed
- **Spacing:** Generous (12px baseline grid)
- **Alerts:** Color-coded (🟢 green, 🟡 yellow, 🔴 red)

---

## Data Model (JSON Structure)

```javascript
// User profile
{
  userId: "user-123",
  surgery: {
    type: "gastric-sleeve", // "gastric-sleeve", "bypass", "band", "duodenal-switch"
    date: "2026-01-15",
    phase: 6, // Month 1-12
  },
  goals: {
    weightLoss: 50, // lbs
    targetWeight: 180,
    fitnessGoals: ["run 5K", "lift 135lbs"],
    confidenceGoals: ["feel comfortable dating"],
    careerGoals: ["more focus at work"],
  },
  doctorResults: [
    {
      date: "2026-02-15",
      weight: 245,
      labs: {
        protein: 6.5, // g/dL
        iron: 45, // µg/dL
        b12: 450, // pg/mL
        calcium: 8.2, // mg/dL
      },
      clearances: ["soft foods", "light walking"],
    },
    // ... more months
  ],
  wearableData: {
    apple_health: { linked: true, synced: "2026-06-16T10:45:00Z" },
    fitbit: { linked: false },
    garmin: { linked: true, synced: "2026-06-16T10:30:00Z" },
  },
  currentMetrics: {
    heartRate: 72, // bpm, current
    heartRateResting: 68, // bpm, avg last 7 days
    bloodPressure: "128/82", // current
    weight: 215, // current
    sleep: 7.5, // hours, last night
    steps: 8432, // today
  },
  mealPlan: [
    {
      day: "Monday",
      meals: [
        { time: "07:00", name: "Protein Smoothie", portions: "8oz", recipe: {...} },
        { time: "10:00", name: "Greek Yogurt", portions: "2oz", recipe: {...} },
        { time: "13:00", name: "Chicken Broth", portions: "4oz", recipe: {...} },
        { time: "16:00", name: "Vitamin", portions: "1 tablet", recipe: {...} },
        { time: "19:00", name: "Salmon + Veggies", portions: "3oz + 2oz", recipe: {...} },
      ],
      macros: { protein: 65, carbs: 45, fat: 18 },
    },
    // ... rest of week
  ],
  fitnessSchedule: [
    { day: "Monday", exercise: "Walking", duration: "30 min", intensity: "easy" },
    { day: "Wednesday", exercise: "Bodyweight Squats", reps: "3x10", notes: "no weights" },
    // ...
  ],
  alerts: [
    { date: "2026-06-16T08:30:00Z", level: "yellow", message: "Heart rate elevated (92 bpm). Rest more today." },
    { date: "2026-06-15T20:00:00Z", level: "green", message: "Sleep was 8 hours — great recovery!" },
  ],
  freemium: {
    premium: false,
    features_unlocked: ["basic-recipes", "meal-timing"],
    features_locked: ["advanced-tracking", "monthly-ai-analysis"],
  }
}
```

---

## Freemium Model

**Free Tier:**
- Basic meal planning (Claude generates 1 recipe/day)
- Wearable sync (read-only)
- Manual vitals tracking (input weight, BP manually)
- Basic alerts ("Weight loss on pace")
- Community access (read-only)

**Premium ($9.99/mo or $99.99/yr):**
- Advanced meal planning (5 recipes/week, optimized for lab results)
- Medical tracker (blood sugar, weight, BP graphs, trends)
- Monthly Claude re-analysis (labs → full meal plan + strategy update)
- Fitness programming (personalized per phase)
- Real-time alerts (anomalies, escalations)
- One-on-one AI coaching (ask questions, get Claude response)
- Therapist/nutritionist finder (vetted professionals)
- Premium affirmations + motivation

---

## Build Checklist

- [ ] Frontend shell (6 tabs, basic navigation)
- [ ] Document upload/scanning (OCR or manual entry)
- [ ] Wearable API integration (start with Apple Health)
- [ ] Claude API integration (meal planning)
- [ ] Dashboard (vitals display, alerts)
- [ ] Meal planner (recipe display, timing)
- [ ] Fitness planner (phase-appropriate exercises)
- [ ] Medical tracker (graphs, trends)
- [ ] Monthly re-assessment workflow
- [ ] Freemium paywall
- [ ] Stitch Vibe Design styling
- [ ] PWA (Service Worker, offline capability)
- [ ] Testing (vitals, recipes, alerts, escalations)
- [ ] Deploy (static host or server)

---

## Security & Compliance

**HIPAA Considerations:**
- If storing lab data: encrypt at rest + in transit
- If cloud: Business Associate Agreement (BAA) required
- If offline-only (recommended): zero liability, zero PHI on servers

**API Security:**
- Store Claude API key securely (not in frontend code)
- Use environment variables or secure backend endpoint
- Rate-limit Claude calls (avoid token waste)

**Wearable Auth:**
- OAuth 2.0 (don't store passwords)
- Request minimal scopes (heart rate, weight only)
- User can revoke access anytime

---

## Deployment Options

1. **Static (Simplest)**
   - GitHub Pages
   - Cloudflare Pages
   - Netlify
   - Cost: $0 (if offline-only)

2. **With Server (Premium Features)**
   - Node.js + Express
   - Firebase / Supabase
   - AWS Lambda
   - Cost: $10-50/mo

3. **Mobile Wrapper (Optional)**
   - Capacitor (iOS/Android wrapper)
   - Same as buddy apps
   - Cost: $99/yr (Apple Developer)

---

## Success Metrics

✅ Users lose weight at target pace (not too fast, not stalled)  
✅ Wearable data shows healthy HR/BP trends  
✅ Meal plan compliance (user logs meals, matches AI plan)  
✅ Lab improvements (protein, iron, B12, calcium normalize)  
✅ Fitness milestones hit (strength, endurance goals)  
✅ Psychological wins (confidence, energy, social wins)  
✅ Zero serious medical complications (escalations prevented by AI monitoring)  
✅ 12-month transformation (at goal weight, sustained habits, new lifestyle)

---

## Notes for Builder

- **Medical Accuracy First:** Every meal plan must be safe for post-op. When in doubt, escalate to doctor.
- **Emotional Support:** This is a major life surgery. Warmth, encouragement, celebration of wins matters.
- **Personalization:** Claude AI is the key — every recommendation should feel custom, not generic.
- **Wearable as Feedback Loop:** Vitals + weight + activity = real data to optimize meal plans. This is what makes it powerful.
- **Safety Guardrails:** Non-negotiable. Too restrictive is okay; too permissive is dangerous.

---

**Ready to build.** All spec is here. Work independently. Good luck! 🚀
