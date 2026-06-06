# Code & Building — Engineering Tasks

MVP build for Sandbox Code Runner web app.

---

## Project Setup (T1–T5)

### T1: Initialize Next.js Project
**Description:** Create new Next.js 15 app with TypeScript, Tailwind, ESLint  
**Details:**
```bash
npx create-next-app@latest sandbox-runner --typescript --tailwind
cd sandbox-runner
npm install
```
**Acceptance:** `npm run dev` starts on http://localhost:3000, no build errors  
**Estimate:** 30 min  
**Owner:** You  

### T2: Set up Supabase (Auth + Database)
**Description:** Create Supabase project, initialize auth, set up database schema  
**Details:**
- Go to supabase.com, create new project
- Install Supabase client: `npm install @supabase/supabase-js`
- Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Create database tables:
  - `users` (id, email, created_at)
  - `sandboxes` (id, user_id, name, image, created_at)
  - `files` (id, sandbox_id, path, content, created_at)
  - `usage` (id, user_id, runs_today, last_reset, tier)

**Acceptance:** Can sign up, user appears in Supabase dashboard  
**Estimate:** 1 hour  
**Owner:** You  

### T3: Set up Stripe (Payments)
**Description:** Integrate Stripe for Pro/Business tier payments  
**Details:**
- Create Stripe account at stripe.com
- Install Stripe client: `npm install stripe @stripe/react-js`
- Create `.env.local` entries: `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`
- Create pricing API route: `/api/checkout-session`

**Acceptance:** Can reach Stripe checkout modal (test mode)  
**Estimate:** 1 hour  
**Owner:** You  

### T4: Set up Claude API Integration
**Description:** Wire up Claude API for code review  
**Details:**
- Get API key from console.anthropic.com
- Install: `npm install @anthropic-ai/sdk`
- Create `.env.local` entry: `ANTHROPIC_API_KEY`
- Create route: `/api/review` that accepts code + returns feedback

**Acceptance:** Claude API call succeeds, returns feedback  
**Estimate:** 30 min  
**Owner:** You  

### T5: Set up Error Tracking & Monitoring
**Description:** Add Sentry for error tracking, Vercel Analytics for performance  
**Details:**
- Install Sentry: `npm install @sentry/nextjs`
- Create Sentry project, add key to `.env.local`
- Configure `sentry.client.config.js` and `sentry.server.config.js`
- Optional: Add Vercel Analytics

**Acceptance:** Errors appear in Sentry dashboard  
**Estimate:** 30 min  
**Owner:** You  

---

## Frontend — Authentication (T6–T10)

### T6: Signup Page (`/auth/signup`)
**Description:** Build signup form with email + password validation  
**Details:**
- Create component: `components/auth/SignupForm.tsx`
- Form fields: Email, Password, Confirm Password, Checkbox (agree to terms)
- Validation: Email format, password >8 chars, matching passwords
- Submit: Call Supabase `auth.signUp()`
- Error handling: Show error messages in red
- Success: Redirect to onboarding

**Acceptance:** Can signup with valid email, redirects to onboarding  
**Estimate:** 1 hour  
**Owner:** You  

### T7: Login Page (`/auth/login`)
**Description:** Build login form  
**Details:**
- Create component: `components/auth/LoginForm.tsx`
- Form fields: Email, Password
- Submit: Call Supabase `auth.signInWithPassword()`
- Error: "Invalid email or password"
- Success: Redirect to dashboard

**Acceptance:** Can login with correct credentials  
**Estimate:** 45 min  
**Owner:** You  

### T8: GitHub OAuth
**Description:** Add "Sign in with GitHub" button  
**Details:**
- Configure GitHub OAuth in Supabase
- Add button in signup/login forms
- Call `auth.signInWithOAuth({ provider: 'github' })`
- Redirect to dashboard on success

**Acceptance:** Can login with GitHub, user created in Supabase  
**Estimate:** 45 min  
**Owner:** You  

### T9: Auth Guards (Middleware)
**Description:** Protect routes, redirect unauthenticated users  
**Details:**
- Create middleware: `middleware.ts` in root
- Check if user session exists
- If not authenticated: redirect to `/auth/login`
- If authenticated: allow access to `/editor`, `/dashboard`, etc.

**Acceptance:** Can't access /editor without being logged in  
**Estimate:** 30 min  
**Owner:** You  

### T10: Auth Context / Hooks
**Description:** Create React hook for accessing current user  
**Details:**
- Create: `hooks/useAuth.ts`
- Returns: `{ user, loading, logout }`
- Use in components to get current user

**Acceptance:** `useAuth()` returns user object in any component  
**Estimate:** 30 min  
**Owner:** You  

---

## Frontend — Onboarding (T11–T13)

### T11: Onboarding Flow Page (`/onboarding`)
**Description:** Step-by-step guide for first-time users  
**Details:**
- Create component: `pages/onboarding.tsx`
- Card-based flow: Welcome → Create Sandbox → Run Code → Success
- State management: Track which step user is on
- Navigation: Next button progresses steps

**Acceptance:** Can step through onboarding flow  
**Estimate:** 1.5 hours  
**Owner:** You  

### T12: Create First Sandbox (in Onboarding)
**Description:** Let user pick Docker image and create sandbox  
**Details:**
- Dropdown: Select from [Python 3.12, Node 20, Ruby 3.2, etc.]
- Button: "Create Sandbox"
- Call: `POST /api/sandboxes/create` with image name
- Wait for response, show loading spinner
- Redirect to editor on success

**Acceptance:** Can create sandbox in onboarding, appears in editor  
**Estimate:** 1 hour  
**Owner:** You  

### T13: Mark Onboarding Complete
**Description:** Don't show onboarding again for returning users  
**Details:**
- Add field to `users` table: `onboarding_complete` (boolean)
- On first visit: show onboarding
- After completion: set `onboarding_complete = true`
- On login: check flag, redirect to onboarding or dashboard

**Acceptance:** Onboarding only shows once per user  
**Estimate:** 30 min  
**Owner:** You  

---

## Frontend — Main Editor (T14–T22)

### T14: Editor Layout
**Description:** 3-column layout (sidebar | editor | results)  
**Details:**
- Create component: `components/Editor.tsx`
- Use CSS Grid: `grid-template-columns: 200px 1fr 300px`
- Left: Sidebar (sandboxes + files)
- Center: Code editor area
- Right: Results panel
- Make responsive (mobile: stacked)

**Acceptance:** Layout renders, proportions correct on desktop  
**Estimate:** 45 min  
**Owner:** You  

### T15: Left Sidebar — Sandboxes List
**Description:** Show list of user's sandboxes  
**Details:**
- Fetch from Supabase: `SELECT * FROM sandboxes WHERE user_id = ...`
- Display: Sandbox name, image, created date
- Click sandbox: Load it in editor
- Delete button (X): Remove sandbox from DB
- "+ New Sandbox" button: Open modal

**Acceptance:** Can see list, switch between sandboxes, delete  
**Estimate:** 1 hour  
**Owner:** You  

### T16: Left Sidebar — Files List
**Description:** Show files in current sandbox  
**Details:**
- Fetch from Supabase: `SELECT * FROM files WHERE sandbox_id = ...`
- Display: File name, size, created date
- Click file: Load content into editor
- Delete button (X): Remove file
- Upload button: Allow drag-drop or file picker

**Acceptance:** Can see files, click to open, delete, upload  
**Estimate:** 1 hour  
**Owner:** You  

### T17: Code Editor Component
**Description:** Syntax-highlighted text editor for code  
**Details:**
- Use Monaco Editor or CodeMirror
- Install: `npm install @monaco-editor/react` (or codemirror)
- Configure: Dark theme, Fira Code font, line numbers
- Support: Python, JavaScript, TypeScript, Ruby, Go
- Auto-save to local state (not DB yet)

**Acceptance:** Can type code, see syntax highlighting  
**Estimate:** 1.5 hours  
**Owner:** You  

### T18: Run Code Button
**Description:** Execute code in sandbox, show results  
**Details:**
- Button: "Run Code" (blue, large)
- On click: Call `POST /api/sandboxes/:id/execute`
- Body: `{ code: string }`
- Show loading spinner (1–2s)
- Response: `{ stdout: string, stderr: string, executionTime: number }`
- Display results in right panel

**Acceptance:** Can run `print("hello")`, see output  
**Estimate:** 1.5 hours  
**Owner:** You  

### T19: Results Panel — Output Tab
**Description:** Show stdout, stderr, execution metrics  
**Details:**
- Tabs: Output | Errors | AI Review
- Output tab:
  - `stdout` in green (#10B981)
  - `stderr` in red (#EF4444)
  - Line: "Completed in Xms"
  - Line: "Memory peak: XMB"
- Allow copy-to-clipboard

**Acceptance:** Can see code output, times, memory  
**Estimate:** 45 min  
**Owner:** You  

### T20: Get AI Review Button
**Description:** Call Claude to review user's code  
**Details:**
- Button: "Get AI Review"
- On click: Show loading spinner
- Call: `POST /api/code/review` with code
- Backend calls Claude API with prompt:
  ```
  "Review this code. Suggest improvements for:
  - Readability
  - Performance
  - Best practices
  - Error handling"
  ```
- Display feedback in "AI Review" tab

**Acceptance:** Click button, see Claude feedback in 5–10s  
**Estimate:** 1.5 hours  
**Owner:** You  

### T21: Free Tier Limit Display
**Description:** Show how many runs user has left today  
**Details:**
- Display at bottom: "4/5 runs used today" (or "Unlimited" for Pro users)
- Color: Amber when approaching limit (4/5)
- On limit reached: Show modal "Upgrade to Pro"
- Query: `SELECT runs_today FROM usage WHERE user_id = ...`

**Acceptance:** Free user sees limit, can't run after 5  
**Estimate:** 1 hour  
**Owner:** You  

### T22: Settings / Logout
**Description:** Settings menu, logout button  
**Details:**
- Icon: Gear icon (top-right)
- Click: Show dropdown
  - Account settings
  - API keys (for later)
  - Logout button
- Logout: Call `auth.signOut()`, redirect to landing page

**Acceptance:** Can logout, redirected to home  
**Estimate:** 30 min  
**Owner:** You  

---

## Frontend — Dashboard (T23–T24)

### T23: Dashboard Page (`/dashboard`)
**Description:** View all sandboxes, create new one  
**Details:**
- Fetch: `SELECT * FROM sandboxes WHERE user_id = ...`
- Grid layout: Card per sandbox
- Card shows: Name, image, created date, last run
- Buttons on card: Open, Delete, Rename
- Button: "+ New Sandbox"
- Click open: Redirect to `/editor?sandbox=:id`

**Acceptance:** Can see all sandboxes, click to edit, delete  
**Estimate:** 1.5 hours  
**Owner:** You  

### T24: Create New Sandbox Modal
**Description:** Modal to create new sandbox with image selection  
**Details:**
- Modal with dropdown: [Python 3.12 | Node 20 | Ruby 3.2 | Go 1.21 | Rust latest]
- Input field: Sandbox name (optional, default "Untitled")
- Button: "Create"
- Call: `POST /api/sandboxes/create`
- Success: Add to DB, redirect to editor

**Acceptance:** Can create new sandbox from dashboard  
**Estimate:** 1 hour  
**Owner:** You  

---

## Frontend — Pricing (T25–T26)

### T25: Pricing Page (`/pricing`)
**Description:** Display pricing tiers, upgrade CTA  
**Details:**
- 3-column layout: Free | Pro | Business
- Show: Price, features, CTA button
- Free: "Current Plan" (if user is free)
- Pro/Business: "Upgrade" button
- Feature comparison table below

**Acceptance:** Can see pricing, click upgrade  
**Estimate:** 1 hour  
**Owner:** You  

### T26: Upgrade to Pro Flow
**Description:** Take payment, unlock Pro features  
**Details:**
- Click: "Upgrade to Pro"
- Redirect to Stripe Checkout
- After payment: Webhook updates user tier to "pro"
- Redirect to `/dashboard` with success message
- User can now run unlimited code

**Acceptance:** Can pay, see confirmation, tier updated in DB  
**Estimate:** 1.5 hours  
**Owner:** You  

---

## Backend — API Routes (T27–T35)

### T27: Auth Routes
**Description:** Signup, login, logout endpoints  
**Details:**
- `POST /api/auth/signup` — create user
- `POST /api/auth/login` — verify credentials
- `POST /api/auth/logout` — clear session
- All use Supabase auth

**Acceptance:** Can signup, login, logout via API  
**Estimate:** 1 hour  
**Owner:** You  

### T28: Sandboxes Routes
**Description:** Create, read, delete sandboxes  
**Details:**
- `POST /api/sandboxes/create` — create sandbox
  - Body: `{ image: string, name?: string }`
  - Returns: `{ id, name, image, created_at }`
- `GET /api/sandboxes` — list user's sandboxes
  - Returns: array of sandboxes
- `DELETE /api/sandboxes/:id` — delete sandbox

**Acceptance:** Can CRUD sandboxes via API  
**Estimate:** 1.5 hours  
**Owner:** You  

### T29: Files Routes
**Description:** Upload, read, delete files  
**Details:**
- `POST /api/sandboxes/:id/files/upload` — upload file
  - Body: FormData with file
  - Returns: `{ path, size, created_at }`
- `GET /api/sandboxes/:id/files` — list files
  - Returns: array of files
- `GET /api/sandboxes/:id/files/:path` — read file content
  - Returns: `{ content }`
- `DELETE /api/sandboxes/:id/files/:path` — delete file

**Acceptance:** Can upload, list, read, delete files  
**Estimate:** 1.5 hours  
**Owner:** You  

### T30: Execute Code Route
**Description:** Run code in sandbox, return output  
**Details:**
- `POST /api/sandboxes/:id/execute`
- Body: `{ code: string }`
- Backend:
  - Call OpenSandbox SDK: `Sandbox.create(image)`
  - Write code to file
  - Run: `sandbox.commands.run("python script.py")`
  - Capture stdout, stderr, execution time
  - Kill sandbox
  - Return: `{ stdout, stderr, executionTime }`
- Error handling: Timeouts, crashes

**Acceptance:** Can execute code, get output  
**Estimate:** 2 hours  
**Owner:** You  

### T31: Code Review Route
**Description:** Call Claude API to review code  
**Details:**
- `POST /api/code/review`
- Body: `{ code: string }`
- Backend:
  - Call Claude with system prompt (code reviewer)
  - Return: `{ feedback: string }`
- Rate limit: 1 review per 10 seconds (to avoid abuse)

**Acceptance:** Can call review endpoint, get feedback  
**Estimate:** 1 hour  
**Owner:** You  

### T32: Usage Tracking Routes
**Description:** Track runs per day, enforce limits  
**Details:**
- On every `execute` call:
  - Query: `SELECT runs_today FROM usage WHERE user_id = ...`
  - If free user + runs_today >= 5: return 402 (payment required)
  - Increment: `runs_today += 1`
  - Update DB
- `GET /api/usage` — return current usage for user

**Acceptance:** Free users capped at 5 runs/day  
**Estimate:** 1 hour  
**Owner:** You  

### T33: Stripe Webhook Route
**Description:** Handle payment confirmations  
**Details:**
- `POST /api/webhooks/stripe`
- Listen for: `checkout.session.completed`
- On payment: Update user tier to "pro" in DB
- Return: 200 OK

**Acceptance:** After payment, user tier changes to "pro"  
**Estimate:** 1 hour  
**Owner:** You  

### T34: Usage Reset Cron (Daily)
**Description:** Reset daily run count at midnight UTC  
**Details:**
- Daily job (cron): Reset `runs_today = 0` for all users
- Options:
  - Vercel Cron Functions (simplest)
  - External service (e.g., GitHub Actions)
  - Supabase Cron Extension

**Acceptance:** Run count resets daily  
**Estimate:** 45 min  
**Owner:** You  

### T35: Error Handling & Validation
**Description:** Add input validation, error responses to all routes  
**Details:**
- Validate all inputs (code length, sandbox ID, etc.)
- Return consistent error format: `{ error: string, code: string }`
- Log errors to Sentry
- HTTP status codes: 400 (bad request), 401 (auth), 402 (payment), 500 (server)

**Acceptance:** Invalid inputs return 400, errors in Sentry  
**Estimate:** 1 hour  
**Owner:** You  

---

## Testing (T36–T38)

### T36: Unit Tests (Frontend)
**Description:** Test React components with Vitest  
**Details:**
- Test: SignupForm, LoginForm, Editor, Results
- Use: `npm install --save-dev vitest @testing-library/react`
- Coverage: >80% of components
- Run: `npm run test`

**Acceptance:** Tests pass, >80% coverage  
**Estimate:** 2 hours  
**Owner:** You  

### T37: API Tests (Backend)
**Description:** Test API routes with integration tests  
**Details:**
- Test: `/api/sandboxes`, `/api/auth`, `/api/execute`
- Use: `npm install --save-dev jest supertest`
- Test real OpenSandbox execution
- Coverage: >80% of routes

**Acceptance:** API tests pass  
**Estimate:** 2 hours  
**Owner:** You  

### T38: Manual Testing
**Description:** Test entire user flow end-to-end  
**Details:**
- [ ] Signup → Onboarding → Create Sandbox
- [ ] Write code → Run → See output
- [ ] Get AI review
- [ ] Hit free limit → See upgrade modal
- [ ] Upgrade to Pro → Run unlimited
- [ ] Mobile responsiveness
- [ ] Error states (disconnect, timeout, etc.)

**Acceptance:** All flows work, no console errors  
**Estimate:** 2 hours  
**Owner:** You  

---

## Deployment (T39–T41)

### T39: Deploy to Vercel
**Description:** Deploy frontend to Vercel  
**Details:**
- Push code to GitHub
- Connect repo to Vercel
- Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, etc.
- Deploy: `vercel deploy --prod`
- Domain: `sandbox-runner.vercel.app` (or custom)

**Acceptance:** Live at URL, no build errors  
**Estimate:** 30 min  
**Owner:** You  

### T40: Deploy OpenSandbox Server
**Description:** Run OpenSandbox server (local or cloud)  
**Details:**
- Option 1: Docker (local): `docker run -p 8080:8080 opensandbox`
- Option 2: Cloud (AWS/GCP): Deploy container to cloud
- Set env: `OPENSANDBOX_SERVER_URL=http://localhost:8080`
- Or: Use managed OpenSandbox service (if available)

**Acceptance:** OpenSandbox server running, reachable from Vercel  
**Estimate:** 1 hour  
**Owner:** You  

### T41: Set up Monitoring & Alerts
**Description:** Monitor production, get alerts on errors  
**Details:**
- Sentry: Already set up (T5)
- Vercel: Monitor performance, uptime
- Alerts: Email on 500 errors
- Dashboard: Check metrics daily

**Acceptance:** Monitoring active, can see errors in Sentry  
**Estimate:** 30 min  
**Owner:** You  

---

## Summary

**Total Tasks:** 41  
**Estimated Time:** 35–45 hours (core MVP)  
**Parallel Work:** Frontend + Backend can run in parallel after T1–T5  
**Critical Path:** T1 → T2 → T3 → T4 → T30 (execute code) is the core flow  

**Phase Timeline:**
- **Week 1 (T1–T5):** Project setup
- **Week 2–3 (T6–T26):** Frontend UI (auth, editor, dashboard)
- **Week 2–3 (T27–T35):** Backend API (parallel with frontend)
- **Week 4 (T36–T41):** Testing, deployment, polish

**Dependencies:**
- T6–T10 depend on T2 (Supabase)
- T18–T20 depend on T4 + T30 (Claude API + sandbox execution)
- T25–T26 depend on T3 (Stripe)
- T39 depends on everything

**Next:** Start with T1 (project setup) and begin building!
