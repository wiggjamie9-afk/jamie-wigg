# Batch 1 Lovable Build Briefs

## App 1: BookReader Pro

**Lovable Prompt:**
```
Build a reading app for dyslexic and visually-impaired users. Features:
- Camera/file scanner with OCR (text extraction from images)
- Text-to-speech narration with adjustable speed (0.5x–2x)
- Dark mode (dark bg, large sans-serif text, high contrast)
- Font size slider (14px–32px)
- Line height adjuster (1.4–2.0)
- Highlight/annotation tools
- Reading progress tracking
- Offline support (localStorage)
- Natural voice options (ElevenLabs API optional, fallback to browser TTS)

Design vibe: Clean, accessibility-first, no clutter. Serif headers (Playfair), sans-serif body (Inter). Dark navy bg (#1a1a2e), gold accents (#c9b800). 

Who: Dyslexic readers, visually impaired, ESL learners.
```

---

## App 2: MathTutor Pro

**Lovable Prompt:**
```
Build an AI math tutoring app. Features:
- Problem solver: user enters math problem (text or handwriting via canvas)
- Step-by-step solution walkthrough
- Visual diagrams (fractions, graphs, geometry)
- Practice problem generator (algebra, geometry, calculus)
- Streak tracker (consecutive correct answers)
- Dark mode (navy bg, white text, green accent for correct)
- Offline mode (localStorage for cached problems)
- Claude API integration (optional, for AI explanation enhancement)

Design vibe: Education-focused, dark 2026 look. Blue accents (#5B7FBE), clean typography.

Who: Middle/high school students, parents helping with homework, test prep.
```

---

## App 3: Buddy 1 (Companion)

**Lovable Prompt:**
```
Build a wellness companion app. Features:
- Mood journal (log mood + note, today/weekly view)
- Daily affirmations (rotating motivational quotes)
- Guided breathing exercises (4-4-4 box breathing, visual timer)
- Notes/thoughts capture
- Dark mode (charcoal bg, soft white text)
- No sign-in required (localStorage for persistence)
- Streak counter (consecutive days visited)
- Offline-first

Design vibe: Calm, nurturing, Google Stitch aesthetic. Mauve accent (#C97A9A).

Who: Anyone seeking daily wellness, journaling, mindfulness.
```

---

## App 4: FoodBuddy 1 (Nutrition)

**Lovable Prompt:**
```
Build a nutrition logging app. Features:
- Food/meal logger (quick add with calorie estimates)
- Hydration tracker (water intake counter with visual goal bar)
- Meal plan suggestions (simple weekly template)
- Nutritional breakdown (macro estimator: protein/carbs/fats)
- Dark mode (forest green bg #2d5016, light text)
- Offline support
- Daily/weekly summary view
- Optional: barcode scanner or food photo recognition (Claude vision API)

Design vibe: Fresh, health-focused. Green accent (#4CAF50). Clean cards.

Who: Fitness enthusiasts, health-conscious eaters, people tracking nutrition goals.
```

---

## App 5: FitCoach Pro

**Lovable Prompt:**
```
Build a fitness coaching app. Features:
- Workout logger (exercise name, reps, sets, weight, duration)
- Workout streak counter (consecutive days with logged exercise)
- Progress charts (1-week, 1-month, 3-month views of volume/reps)
- Exercise library (50+ common exercises with form tips)
- Dark mode (dark charcoal #1a1a1a, orange accent #FF9800)
- Goal setting (target workouts per week, target volume)
- Rest day tracker
- Offline-first, localStorage persistence

Design vibe: Energy-driven, modern 2026. Orange accents, bold typography.

Who: Gym-goers, personal training clients, fitness enthusiasts tracking progress.
```

---

## How to Use These

1. **Copy each prompt above** (just the section inside the triple-backticks)
2. **Paste into Lovable** (`lovable.dev`) as a new project
3. **Let it build** the initial app
4. **Iterate** if needed (add/remove features, tweak UI)
5. **Export** when ready
6. **Share link** back here for final polish + packaging

---

## After Lovable: App Factory Polish

Once Lovable exports the app:
```
/nexus finish my Lovable app "[app-name]" — 
add dark mode refinement, offline PWA manifest, 
optimize for 2026 standards, then package for iOS (Capacitor) + Android.
```

This will:
- Wrap in Capacitor
- Build APK (Android)
- Build IPA (iOS, unsigned)
- Generate web version
- Upload to GitHub Pages at `rhythmixapp.com.au/apps/[name]/`

