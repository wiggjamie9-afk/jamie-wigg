# Strength Coach

Your AI strength training coach with real-time voice guidance for lifting. Progressive overload, perfect form, PR tracking.

**Built on:** Next.js 15 + React 19 + Web Speech API + Claude Haiku

---

## Quick Start (Web Testing)

```bash
cd strength-coach
pnpm install
pnpm dev
```

Opens at **http://localhost:3000** — test on your phone's browser.

---

## How It Works

1. **Setup:** Enter your Claude API key + lifting goal (e.g., "Add 50 lbs to my deadlift")
2. **Pick Coach Name & Personality:** "Iron Mike" / Tough? Encouraging? Funny?
3. **Start Workout:** Say "Let's go" → app listens for your exercise
4. **Say Your Lift:** "5 reps of squats at 315 pounds" or "just did 3 sets of bench press"
5. **Get Real-Time Coaching:** Form cues, PR celebrations, progressive overload tips
6. **Finish:** App saves your session for memory-based future coaching

---

## What Makes It Strength-Specific

- **Form Cues:** Specific guidance (chest up, elbows in, depth on squats)
- **Progressive Overload Focus:** Encourages adding weight/reps intelligently
- **PR Tracking:** Celebrates new personal records
- **Recovery Tips:** Mentions rest between sets
- **History Memory:** Remembers your lifts to give context-aware coaching

---

## Example Interactions

**You say:** "Just did 3 reps of deadlifts at 405 pounds"  
**Coach responds:** "That's a new PR! Keep that lower back neutral — chest up through the whole pull. Great form."

**You say:** "Form feels off on bench"  
**Coach responds:** "Chest up, elbows 45°. Control the descent—don't bounce it. You've got this."

**You say:** "4 sets of squats done"  
**Coach responds:** "Deep depth on those! Next session, add 5 lbs per side. Progressive overload baby."

---

## Testing Checklist

- [ ] Setup works (API key saves)
- [ ] Voice input works (say an exercise, see it transcribed)
- [ ] Claude coaching returns (1-2 sec response)
- [ ] Coaching is strength-specific (form cues, not cardio tips)
- [ ] Voice output plays (coach speaks back)
- [ ] Finish workout saves session
- [ ] Dashboard shows recent lifts

---

## Next Steps After Testing

1. **Feedback:** What needs fixing? (UI, coaching tone, form cues?)
2. **Build Cardio Coach** (same structure, different Claude prompts)
3. **Build Yoga Coach** (poses, breathing, flexibility)
4. **Build Wellness Coach** (general fitness + mental health)
5. **Deploy to App Store/Play** via Capacitor wrapper

---

## Tech Notes

- **Offline:** Everything works offline except Claude coaching (needs API)
- **Voice:** Uses browser's Web Speech API (Chrome/Safari/Android native)
- **Database:** IndexedDB (local storage of workouts + history)
- **Privacy:** API key never leaves your device

---

## API Key

Get yours at [console.anthropic.com](https://console.anthropic.com) — free tier starts with $5 credits.

**Cost per workout:** ~$0.001-0.01 (Haiku is cheap!)
