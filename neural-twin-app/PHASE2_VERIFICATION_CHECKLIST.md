# Phase 2 Verification Checklist

**Status:** Ready for Testing  
**Updated:** 2026-06-25  
**Prepared for:** User verification on Mac with live backend

---

## Overview

This checklist guides you through verifying all Phase 2 features are working end-to-end: backend, Android, and iOS.

**Prerequisites:**
- Mac with Node.js 20+, Docker, or local Postgres
- Anthropic API key (already provided in .env)
- Android Studio or emulator (for Android testing)
- Xcode or iOS simulator (for iOS testing)
- Neon/Supabase PostgreSQL connection (or local Postgres)

---

## Part 1: Backend Verification (Week 9)

### 1.1 Setup Database & Environment

- [ ] Create `.env` in `backend/` with:
  - `ANTHROPIC_API_KEY=sk-ant-...` (provided)
  - `DATABASE_URL=postgresql://...` (from Neon or Supabase)
  - `JWT_SECRET=` (run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - `PORT=5000`
  - `NODE_ENV=development`

**Command:**
```bash
cd neural-twin-app/backend
cp .env.example .env
# Edit .env with your values
```

### 1.2 Initialize Database

- [ ] Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

- [ ] Verify schema created:
```bash
npx prisma studio  # Opens web UI to browse database
```

### 1.3 Seed Test Data

- [ ] Check `prisma/seed.ts` exists and looks correct
- [ ] Run seed script:
```bash
npm run seed
```

**Expected:** Test user created with email `test@neuraltwin.com` and password `test123`

### 1.4 Start Backend

- [ ] Run dev server:
```bash
npm run dev
```

**Expected output:**
```
✓ Server running on http://localhost:5000
✓ API docs: http://localhost:5000/api-docs
✓ Connected to PostgreSQL
```

---

## Part 2: Backend API Testing (Week 9)

### 2.1 Health Check

- [ ] Verify server is responding:
```bash
curl http://localhost:5000/health
```

**Expected:** `{"status":"ok"}`

### 2.2 Authentication (JWT)

**Test 2.2.1: Register**
- [ ] Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "name": "Alice"
  }'
```

**Expected:** 
```json
{
  "user": {"id":"...", "email":"alice@example.com", "name":"Alice"},
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Test 2.2.2: Login**
- [ ] Login with credentials:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com", "password":"SecurePass123!"}'
```

**Expected:** Returns `token` and `user` object

**Test 2.2.3: Use Token**
- [ ] Save token from login response
- [ ] Test authenticated request:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl http://localhost:5000/api/coherence \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Returns coherence data (status 200)

### 2.3 Voice Recording Endpoint

- [ ] Test voice upload (without real audio, use placeholder):
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:5000/api/voice \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "data:audio/wav;base64,UklGRi4AAABXQVZFZm10IBAA...",
    "context": "morning motivation"
  }'
```

**Expected:** Returns voice recording ID and emotion detection results

### 2.4 Decision Logging Endpoint

- [ ] Test decision logging:
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:5000/api/decisions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Choose career path",
    "description": "Deciding between startup vs corporate job",
    "category": "professional",
    "planningClarity": 7,
    "strategyChosen": "List pros and cons",
    "monitoringComprehension": 8,
    "evaluationEffectiveness": 6,
    "reflectionInsights": "Corporate offers stability"
  }'
```

**Expected:** Returns decision ID and metacognitive scores

### 2.5 Twin Interaction Endpoint

- [ ] Test Twin chat:
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:5000/api/twins/interaction \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "twinType": "coach",
    "userMessage": "I am feeling overwhelmed with decision making"
  }'
```

**Expected:** Returns Twin response from Claude API

### 2.6 Coherence Endpoint

- [ ] Test coherence retrieval:
```bash
TOKEN="your_token_here"
curl http://localhost:5000/api/coherence \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Returns 8-layer coherence data with scores

---

## Part 3: Android Verification (Week 10)

### 3.1 Configure for Local Backend

- [ ] Open `android/app/src/main/java/com/neuraltwin/app/data/network/ApiClient.kt`
- [ ] Verify `BASE_URL = "http://10.0.2.2:5000/api/"` (for emulator)
- [ ] Or change to your Mac's IP if on real device:
  - Get Mac IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
  - Use: `http://192.168.x.x:5000/api/` (replace with your IP)

### 3.2 Launch Emulator & App

- [ ] Start Android emulator:
```bash
cd neural-twin-app/android
./gradlew emulateDebug  # Or use Android Studio
```

- [ ] Build and run app:
```bash
./gradlew runDebug
```

### 3.3 Test Auth Flow

- [ ] **Signup Screen:**
  - [ ] Enter name, email, password
  - [ ] Tap "Create Account"
  - [ ] Verify no error messages
  - [ ] App should show main screen (Home tab)

- [ ] **Auto-login on Restart:**
  - [ ] Kill app
  - [ ] Restart app
  - [ ] Should skip login, show Home screen directly

- [ ] **Logout:**
  - [ ] Go to Settings tab
  - [ ] Tap "Sign Out"
  - [ ] Should return to login screen

### 3.4 Test Voice Recording

- [ ] Go to Voice Recording tab
- [ ] Tap "Start Recording"
- [ ] Speak for 5 seconds: "I'm feeling optimistic about my upcoming presentation"
- [ ] Tap "Stop Recording"
- [ ] Verify emotion detection result appears (e.g., "Happy 82%")

**Expected:** Emotion displayed with confidence score

### 3.5 Test Decision Logging (if UI wired)

- [ ] Go to Home → "Log Decision" quick action (or find in menu)
- [ ] Enter decision title: "Should I take the job offer?"
- [ ] Enter context
- [ ] Select metacognitive scores (1-10 sliders)
- [ ] Submit
- [ ] Verify metacognitive breakdown displayed

### 3.6 Test Twin Chat (if UI wired)

- [ ] Go to Twins tab
- [ ] Tap any Twin (e.g., "Coach")
- [ ] Type message: "I'm struggling with focus"
- [ ] Verify Twin response appears from API

### 3.7 Verify Coherence Display

- [ ] Go to Coherence tab
- [ ] Verify 8-layer breakdown displays
- [ ] Tap each metric to see details

---

## Part 4: iOS Verification (Week 11)

### 4.1 Configure for Local Backend

- [ ] Open `ios/NeuralTwin/APIClient.swift`
- [ ] Verify `baseURL = "http://localhost:5000/api"` (iOS simulator on Mac)
- [ ] If testing on real device or different Mac, use:
  - `"http://YOUR_MAC_IP:5000/api"` (get IP from `ifconfig`)

### 4.2 Launch Simulator & App

- [ ] Open Xcode project:
```bash
cd neural-twin-app/ios
open NeuralTwin.xcodeproj
```

- [ ] Select "iPhone 15" simulator
- [ ] Tap Play (▶) to build and run

### 4.3 Test Auth Flow

- [ ] **Signup Screen:**
  - [ ] Enter name, email, password
  - [ ] Tap "Create Account"
  - [ ] Verify no error messages
  - [ ] App should show main screen

- [ ] **Auto-login on Restart:**
  - [ ] Stop simulator
  - [ ] Restart app
  - [ ] Should skip login, show Home screen

- [ ] **Logout:**
  - [ ] Go to Settings tab (gear icon)
  - [ ] Tap "Sign Out"
  - [ ] Should return to login screen

### 4.4-4.7 Same Tests as Android

Repeat Part 3.4-3.7 (Voice Recording, Decision Logging, Twin Chat, Coherence) for iOS.

---

## Part 5: Cross-Platform Verification (Week 11)

### 5.1 Shared Backend State

- [ ] Login on Android with email A
- [ ] Login on iOS with same email A
- [ ] **On Android:** Log a decision
- [ ] **On iOS:** Go to Coherence tab, see decision reflected
- [ ] Verify both devices show consistent data

### 5.2 Data Persistence

- [ ] Create voice recording on Android
- [ ] Kill app completely
- [ ] Relaunch app
- [ ] Go to Voice Recording history
- [ ] Verify recording still exists

---

## Part 6: Error Handling Verification

### 6.1 Network Errors

- [ ] Disconnect Mac from internet
- [ ] Try to login on mobile app
- [ ] Verify friendly error: "Can't reach the server..."
- [ ] Reconnect internet
- [ ] Try again—should work

### 6.2 Invalid Credentials

- [ ] Try login with wrong password
- [ ] Verify error: "Invalid email or password."

### 6.3 Duplicate Email

- [ ] Try signup with email already used
- [ ] Verify error: "An account with that email already exists."

### 6.4 Token Expiration (24h)

- [ ] After 24 hours, any API call should return 401
- [ ] App should redirect to login screen
- [ ] User can login again to get fresh token

---

## Part 7: Performance Verification (Week 15)

### 7.1 API Response Time

- [ ] Enable network debugging in mobile apps
- [ ] Check API response times:
  - [ ] Login: < 1s
  - [ ] Voice upload: < 2s (depends on Claude API)
  - [ ] Decision logging: < 2s
  - [ ] Twin chat: < 3s (Claude API thinks)
  - [ ] Coherence fetch: < 500ms

### 7.2 App Startup

- [ ] Measure time from tap to first screen display
- [ ] Target: < 3 seconds

### 7.3 Memory Usage

- [ ] Use Xcode/Android Studio profilers
- [ ] Check memory after:
  - [ ] Login
  - [ ] Scroll through history
  - [ ] View Twins carousel
- [ ] Target: < 150MB peak memory

---

## Part 8: Security Verification

### 8.1 JWT Token Security

- [ ] Verify token is stored securely:
  - [ ] Android: In SharedPreferences (encrypted with EncryptedSharedPreferences for production)
  - [ ] iOS: In Keychain

### 8.2 HTTPS for Production

- [ ] Current: HTTP (localhost) is OK for development
- [ ] Before launch: Switch to HTTPS in backend
- [ ] Update mobile apps to enforce HTTPS (fail if server sends HTTP)

### 8.3 Password Hashing

- [ ] Verify passwords are bcrypt hashed in database:
```bash
sqlite3 database.db "SELECT email, passwordHash FROM User LIMIT 1;"
# Should show hashed value, not plaintext
```

### 8.4 CORS Headers

- [ ] Verify backend only accepts requests from known origins
- [ ] Check Android/iOS don't leak auth tokens in logs

---

## Part 9: Deployment Preparation (Week 15-16)

### 9.1 Environment Configurations

- [ ] Create `.env.staging` for staging backend
- [ ] Create `.env.production` for production backend
- [ ] Verify sensitive keys NOT in git:
```bash
git log -p -- .env | grep -i "ANTHROPIC_API_KEY"  # Should be empty
```

### 9.2 Build Signed APK (Android)

```bash
cd neural-twin-app/android
./gradlew assembleRelease  # Creates release APK
# Location: app/build/outputs/apk/release/app-release.apk
```

### 9.3 Build for TestFlight (iOS)

```bash
cd neural-twin-app/ios
xcodebuild -scheme NeuralTwin -configuration Release archive
# Then upload via Xcode Organizer
```

### 9.4 Database Backups

- [ ] If using Neon: Enable automated backups
- [ ] Test restore procedure
- [ ] Verify 24-hour backup cycle

---

## Part 10: Success Criteria (Phase 2 Definition of Done)

- [ ] ✅ Backend compiles, runs locally, all endpoints respond
- [ ] ✅ Database migrations succeed, data persists
- [ ] ✅ Android connects to backend:
  - [ ] Signup/login works
  - [ ] Voice recording sends to backend
  - [ ] Decision logging works
  - [ ] Twin chat works
  - [ ] Coherence displays real data
- [ ] ✅ iOS connects to backend (same as Android)
- [ ] ✅ JWT auth working (login/logout, token stored, auto-login on restart)
- [ ] ✅ No critical crashes
- [ ] ✅ Error messages are friendly (not stack traces)
- [ ] ✅ API response times < 500ms (p95)

---

## Part 11: Known Issues & Workarounds

### Issue: "Cannot reach backend on Android emulator"
**Solution:** Emulator must use `http://10.0.2.2:5000/api/` (special alias for host machine)

### Issue: "Port 5000 already in use"
**Solution:** Run `lsof -i :5000` to find process, then `kill -9 <PID>`

### Issue: "Prisma migration fails"
**Solution:** Drop database and re-run `npx prisma migrate dev --name init` (data will be lost)

### Issue: "Claude API quota exhausted"
**Solution:** Responses fall back to mock data (check backend logs for "QUOTA_EXCEEDED")

### Issue: "iOS app can't connect to local backend"
**Solution:** Verify firewall allows port 5000 on Mac: `sudo pfctl -f /etc/pf.conf`

---

## What's Next (After Phase 2 Complete)

### Phase 2.5 (Weeks 17-18)
- OAuth2 (Google Sign-In, Apple Sign-In)
- Push notifications
- Weekly/monthly reports

### Phase 3 (Weeks 19+)
- App Store submission (iOS)
- Google Play submission (Android)
- Real biometric integration (Apple Health, Google Fit)

---

## Support & Questions

If you hit issues:
1. Check the troubleshooting section above
2. Check backend logs: `npm run dev` shows all API calls
3. Check mobile app logs (Xcode/Android Studio)
4. Verify `.env` has correct values (no typos)

---

**Good luck with Phase 2! 🚀**

You have a solid foundation. This checklist will help you verify everything works before launching the closed beta.
