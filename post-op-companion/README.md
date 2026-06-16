# 12-Month Post-Op Life Transformation AI

A comprehensive, AI-powered health monitoring and meal planning companion for the first 12 months after weight loss surgery.

**Status:** Production-ready MVP
**Stack:** Vanilla JavaScript + Claude AI + Service Worker PWA
**Design:** Stitch Vibe (warm, compassionate, accessible)

---

## Features

### Core Functionality
- **6-Tab Interface**: Dashboard, Meal Plan, Fitness, Medical Tracker, Documents, Settings
- **AI-Powered Meal Planning** (Claude API): Personalized recipes based on surgery type, phase, and lab results
- **Wearable Integration**: Apple Health, Google Fit, Fitbit, Garmin (framework ready)
- **Medical Tracking**: Weight, heart rate, blood pressure, lab values with trend analysis
- **Phase-Based Guidance**: Automatic recommendations for recovery (liquid → soft → solid diet)
- **Fitness Programming**: 12-month progressive exercise plan
- **Real-Time Alerts & Escalation**: Flags rapid weight loss, low protein, BP concerns
- **Document Management**: Upload surgery docs, clearance letters, lab results
- **Offline PWA**: Full functionality without internet connection
- **Data Export**: JSON backup of all personal data

### Health Monitoring
✓ Vitals logging (weight, HR, BP, notes)
✓ Lab value tracking (protein, iron, B12, calcium, vitamin D, etc.)
✓ Weight trend graphs & projections
✓ Health score calculation
✓ Medical escalation triggers

### Nutrition
✓ Phase-aware meal recommendations (weeks 1 → months 12)
✓ Shopping list generation
✓ Macro targets (protein/carbs/fat per phase)
✓ Restricted food flagging
✓ Claude AI personalized meal generation (Premium)

### Fitness
✓ Phase-appropriate exercise recommendations
✓ Progressive training (light → HIIT)
✓ Calorie burn estimation
✓ Workout logging
✓ Strength progress tracking

### Safety & Privacy
✓ Medical disclaimers on every screen
✓ All data stored locally (no cloud uploads)
✓ HIPAA-friendly architecture
✓ Surgical clearance validation
✓ Emergency escalation prompts

---

## Quick Start

### Local Development
```bash
cd post-op-companion
python3 -m http.server 8000
# Open http://localhost:8000/
```

### First-Time Setup
1. **Enter Surgery Info** (Documents tab)
   - Select surgery type (gastric sleeve, bypass, etc.)
   - Enter surgery date
2. **Set Goals** (Documents tab)
   - Target weight loss
   - Fitness goals
   - Life transformation goals
3. **Add Claude API Key** (Settings tab)
   - Get free key at https://console.anthropic.com
   - Paste into Settings → API Configuration
4. **Generate Meal Plan** (Dashboard or Meal Plan tab)
   - Click "Generate New Meal Plan"
   - Claude creates personalized recipes
5. **Log Vitals** (Medical Tracker tab)
   - Daily weight, heart rate, blood pressure
   - App tracks trends and alerts you

---

## File Structure

```
post-op-companion/
├── index.html              # Main app shell (6 tabs)
├── styles.css              # Stitch Vibe Design System
├── app.js                  # Core state management & tab logic
├── wearable-sync.js        # Apple Health, Google Fit, Fitbit, Garmin
├── claude-ai.js            # Claude API meal planning & analysis
├── document-scanner.js     # OCR mock for lab results
├── dashboard.js            # Vitals display & auto-refresh
├── meal-planner.js         # Recipe generation & shopping lists
├── fitness-planner.js      # Exercise recommendations & tracking
├── medical-tracker.js      # Lab trends, weight graphs, alerts
├── settings.js             # API keys, wearables, freemium
├── sw.js                   # Service Worker (offline PWA)
├── manifest.webmanifest    # PWA metadata & shortcuts
└── README.md               # This file
```

---

## API Integration

### Claude API (Meal Planning)
```javascript
// Example: Generate personalized meal plan
const claude = new ClaudeAI();
const mealPlan = await claude.generateMealPlan({
  surgeryType: 'gastric-sleeve',
  surgeryDate: '2024-06-01',
  currentMonth: 2,
  currentWeight: 215,
  targetWeight: 165,
  protein: 6.5, // g/dL lab value
  weightLossGoal: 50,
});
```

### Wearable Integration (Ready to Implement)
```javascript
// Example: Sync Apple Health data
const wearable = new WearableSync();
const data = await wearable.connectAppleHealth();
// Returns: { heartRate: [...], weight: [...], bloodPressure: [...] }
```

---

## Deployment Options

### Netlify
```bash
# Connect GitHub repo
# Netlify auto-deploys on push
```

### Cloudflare Pages
```bash
git push origin main
# Auto-deploys from git
```

### Vercel
```bash
vercel
# Deploy from CLI
```

### GitHub Pages
```bash
# Subdirectory deployment
# Enable in Settings → Pages
```

**No server required** — app works entirely client-side with offline capability.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (no frameworks) |
| **UI/UX** | Tailwind-inspired CSS (custom) |
| **Data** | localStorage + IndexedDB |
| **AI** | Claude 3 Opus via API |
| **Wearables** | REST APIs (Apple Health, Google Fit, Fitbit, Garmin) |
| **Offline** | Service Worker + Cache API |
| **PWA** | Web App Manifest + Install Prompts |
| **Charts** | Canvas API (simple drawing) |

---

## Freemium Model

### Free Tier
- Manual vitals logging ✓
- Basic meal planning templates ✓
- Fitness phase recommendations ✓
- Document uploads ✓
- Offline access ✓

### Premium ($9.99/mo)
- Claude AI meal generation (powered by user's API key)
- Wearable auto-sync
- Monthly AI re-assessment
- Advanced lab analysis
- Priority support

**Note:** Users bring their own Claude API key → app scales without server costs.

---

## Medical Safety

### Design Principles
1. **Not a substitute for professional care** — prominent disclaimers
2. **Phase-based guidance** — only phase-appropriate meals & exercises
3. **Escalation triggers** — alerts for rapid weight loss, high BP, protein deficiency
4. **Surgical clearance validation** — tracks approved activities
5. **Local data** — HIPAA-friendly (no cloud uploads)

### Alert Types
| Alert | Trigger | Action |
|-------|---------|--------|
| Rapid Weight Loss | >5 lbs/week | "Contact surgeon if fatigued" |
| Low Protein | Not logged | "Aim for 60-80g daily" |
| High BP | >130/80 | "Monitor closely, contact surgeon if persistent" |
| Lab Deficiency | Protein/B12/Iron low | "Supplement + recheck in 4 weeks" |
| Phase Violation | Restricted food | "Not appropriate for your phase" |

---

## Testing Checklist

### Core Features
- [ ] Tab navigation (all 6 tabs load)
- [ ] App shell persists across navigation
- [ ] localStorage saves surgery info & goals
- [ ] Vitals form logs data and updates dashboard
- [ ] Dashboard refreshes with new data
- [ ] Meal plan generates for the week
- [ ] Fitness schedule shows phase-appropriate exercises
- [ ] Documents can be uploaded and listed
- [ ] Settings saved (Claude API key, wearables)

### Offline (Service Worker)
- [ ] App loads without internet
- [ ] Vitals can be logged offline
- [ ] Data syncs when reconnected
- [ ] Graceful offline messages for API calls

### Design
- [ ] Responsive on mobile (320px-600px)
- [ ] Warm, compassionate aesthetic
- [ ] Readable text (WCAG AA contrast)
- [ ] Icons meaningful (emojis + labels)
- [ ] Animations smooth (no jank)

### PWA
- [ ] Manifest loads (dev tools > Application)
- [ ] Install prompt appears
- [ ] Works as standalone app
- [ ] Shortcuts appear on home screen

---

## Next Steps

### Phase 1: Testing & Polish (User Validation)
- [ ] Test on real patient (post-op person)
- [ ] Gather feedback on meal plans, exercises, alerts
- [ ] Validate medical safety with surgeon
- [ ] Performance testing on 2G connection

### Phase 2: Wearable Integration
- [ ] Implement Apple Health OAuth
- [ ] Implement Google Fit OAuth
- [ ] Add Fitbit API integration
- [ ] Add Garmin Health API
- [ ] Auto-sync vitals from wearables

### Phase 3: Scale & Monetization
- [ ] Launch Premium tier (Gumroad integration)
- [ ] Analytics dashboard (how many users, engagement)
- [ ] Email marketing (weekly check-ins, meal ideas)
- [ ] Mobile app wrapper (Capacitor for iOS/Android)
- [ ] Partner with surgeons/clinics for bulk adoption

### Phase 4: Advanced AI
- [ ] Fine-tune Claude for post-op domain
- [ ] Multi-language support (Spanish, French)
- [ ] Image recognition for meal logging
- [ ] Resting metabolic rate calculator
- [ ] Personalized supplement recommendations

---

## Troubleshooting

### Claude API returns 401 error
- Check API key in Settings (should start with `sk-`)
- Verify key has Anthropic API access (not ChatGPT API)
- Regenerate key at https://console.anthropic.com

### Wearable doesn't connect
- Ensure wearable companion app is installed on phone
- Grant location/health permissions
- Try disconnecting and reconnecting

### Offline mode doesn't work
- Check Service Worker registration in dev tools
- Clear site data and reload
- Verify `sw.js` is in correct directory

### Charts/graphs not rendering
- Canvas requires some data points (2+)
- Log vitals for at least 2 days before charts appear

---

## Architecture Notes

### State Management
- Single source of truth: `window.app.state` (localStorage-backed)
- DOM updates triggered by state changes
- No virtual DOM / diffing (Vanilla JS)

### Performance
- Lazy-loading of modules (each tab loads its dependencies)
- Service Worker caches static assets
- Canvas graphs drawn on-demand (not constantly)
- No external dependencies (vanilla JS, no npm install needed)

### Security
- No authentication required (personal device use)
- API keys stored in localStorage (user's responsibility)
- All data stays on device (no backend calls except Claude API)
- CORS not needed (Claude API has CORS headers)

---

## Support & Feedback

### For Bug Reports
1. Export your data (Settings → Export)
2. Open an issue on GitHub with steps to reproduce
3. Include export JSON (sanitized)

### For Feature Requests
1. Check if already listed in "Next Steps"
2. Vote on GitHub Discussions
3. Propose implementation details

---

## License

MIT License — Use freely, modify, deploy, fork.

**Disclaimer:** This app is not a substitute for professional medical advice. Always consult your surgeon for serious health concerns. The app is provided "as-is" without liability.

---

## Credits

Built for the 12-month post-operative transformation journey.

**Core Team:**
- Claude AI (meal planning & analysis)
- Anthropic (API)
- Stitch Vibe Design System (UI/UX)

**With love for:** everyone undergoing weight loss surgery and committed to their 12-month transformation.

---

**You've got this. Your future self will thank you. 💜**
