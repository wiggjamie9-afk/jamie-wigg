# Code & Building — Requirements Specification

AI-powered IDE companion for indie developers, students, and solopreneurs building with OpenSandbox.

---

## Overview

**Product:** Sandbox Code Runner (working name)  
**Platform:** Web-first (React/Next.js), then iOS/Android via Capacitor  
**Core Value:** Run code safely in isolated sandboxes, get AI feedback on architecture/debugging  
**Target User:** Solo developer, student learning to code, indie founder building tools  

---

## User Personas

### Persona 1: Alex (Indie Developer)
- Age: 28, building SaaS solo
- Pain: Wants to test untrusted code without crashing his machine
- Goal: Run user-submitted scripts safely, iterate quickly
- Willingness to pay: $10–15/month

### Persona 2: Jordan (Student)
- Age: 20, learning Python/JavaScript
- Pain: Local environment setup is intimidating
- Goal: Run code in browser without Docker/setup
- Willingness to pay: Free → $5/month (if they graduate to paid)

### Persona 3: Casey (Technical Founder)
- Age: 35, building AI product
- Pain: Need isolated execution for code interpretation
- Goal: Integrate into product as white-label solution
- Willingness to pay: $30–50/month (team tier)

---

## Core Requirements

### R1: User Authentication
- [ ] Email + password signup
- [ ] OAuth (GitHub, Google)
- [ ] Email verification
- [ ] Password reset flow
- Acceptance: User can sign up, verify email, login within 2 minutes

### R2: Create & Manage Sandboxes
- [ ] Create sandbox (pick Docker image)
- [ ] View active sandboxes
- [ ] Kill sandbox (manual + auto-cleanup after 30 min idle)
- [ ] Rename/label sandboxes
- Acceptance: User can create 5 sandboxes, see list, kill them

### R3: Execute Commands
- [ ] Run arbitrary shell commands
- [ ] Capture stdout + stderr
- [ ] Show execution time + resource usage
- [ ] Timeout protection (kill after 30 seconds)
- [ ] Show real-time output as it streams
- Acceptance: `echo "hello"` returns output within 1 second

### R4: File Operations
- [ ] Write files to sandbox
- [ ] Read files from sandbox
- [ ] List directory contents
- [ ] Download file to local machine
- [ ] Upload file from local machine
- Acceptance: User can create file, write code, execute, download output

### R5: Multiple Languages
- [ ] Python 3.9, 3.10, 3.11, 3.12
- [ ] Node.js 18, 20
- [ ] (Nice-to-have) Ruby, Go, Rust
- Acceptance: Dropdown menu shows 6+ languages, each boots in <5 seconds

### R6: AI-Powered Features
- [ ] Code review (Claude analyzes code, suggests improvements)
- [ ] Error explanation (Claude explains error message)
- [ ] Architecture feedback (Claude reviews design)
- [ ] Generate boilerplate (Claude writes skeleton code)
- Acceptance: User clicks "Get AI Review", Claude returns feedback in <10 seconds

### R7: Pricing & Limits
- [ ] Free tier: 5 runs/day, Python only, read-only files
- [ ] Pro tier: Unlimited runs, all languages, read/write files, AI features
- [ ] Enforcement: Show countdown timer when approaching limits
- [ ] Upgrade prompt: "You've used 5/5 runs today" → button to upgrade
- Acceptance: Free user hits limit after 5th run, sees upgrade prompt

### R8: Error Handling
- [ ] Sandbox crashes → show friendly error message
- [ ] Command timeout → show "took >30 seconds, killed"
- [ ] Auth failure → redirect to login
- [ ] API errors → retry automatically, then show error after 3 attempts
- Acceptance: All error states have clear messaging

### R9: Performance & Reliability
- [ ] Page load <2 seconds
- [ ] Sandbox creation <3 seconds
- [ ] Command execution <1 second (for simple commands)
- [ ] 99.9% uptime (monitored with Sentry)
- Acceptance: Performance metrics tracked in analytics

### R10: Mobile Responsiveness
- [ ] Layout works on iPhone 14, iPad
- [ ] Touch-friendly buttons (48px+)
- [ ] Code editor scales down gracefully
- [ ] Works offline (cached UI, pending uploads)
- Acceptance: User can run code on iPhone

---

## Feature Tiers

### Free Tier
- 5 command runs per day
- Python 3.12 only
- Read-only file access
- No AI features
- Community support (Discord)

### Pro Tier ($9.99/month)
- Unlimited runs
- All Docker images (Python, Node, Ruby, Go, Rust)
- Read/write file access + persistence
- AI code review, error explanation, architecture feedback
- Email support + priority

### Business Tier ($29.99/month)
- Everything in Pro, plus:
- Team workspace (up to 5 users)
- Usage analytics dashboard
- Custom Docker images
- Dedicated support + Slack channel
- API access for integrations

---

## User Flows

### Flow 1: First-Time User (5 min)
1. Land on landing page
2. Click "Try for Free"
3. Sign up with email or GitHub
4. See welcome tutorial (3 code examples)
5. Create first sandbox (Python 3.12)
6. Run `print("hello")`, see output
7. Try uploading a file
8. Done! Sent to onboarding email

### Flow 2: Run Code (1 min)
1. Home → My Sandboxes
2. Click "New Sandbox"
3. Pick Docker image (Python 3.12, Node 20, etc.)
4. Click "Create"
5. Paste code into editor
6. Click "Run"
7. See output in result panel
8. (Opt) Click "Get AI Review"

### Flow 3: Upgrade to Pro (30 sec)
1. Hit free tier limit (5 runs)
2. See modal: "You've used your 5 daily runs. Upgrade to Pro for unlimited."
3. Click "Upgrade"
4. See pricing page
5. Enter card details (Stripe)
6. Confirm payment
7. Redirect back to sandbox, ready to run

---

## Non-Functional Requirements

### Performance
- Page load: <2s (Lighthouse score 90+)
- Sandbox creation: <3s
- Command execution: <1s (simple commands)
- Database query: <200ms

### Reliability
- Uptime: 99.9% (monitored with UptimeRobot)
- Error tracking: Sentry (alerting on 5+ errors/min)
- Backups: Daily DB backups, 30-day retention
- Failover: Code runs on Vercel + Cloudflare (geographic redundancy)

### Security
- Auth: Supabase (JWT tokens, session management)
- Data: Encrypted at rest (Supabase encryption)
- API: Rate limiting (100 req/min per user)
- Sandboxes: Isolated (cannot access other users' data)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation (Tab, Enter, Escape)
- Color contrast: 4.5:1 minimum
- Screen reader support (code editor labeled)

---

## Out of Scope (Phase 1)

- ❌ Database persistence within sandbox
- ❌ Scheduled/cron tasks
- ❌ GPU access (ML training)
- ❌ Visual debugging (step-through debugger)
- ❌ Collaborative editing (real-time co-coding)
- ❌ Git integration
- ❌ Monorepo support

---

## Success Criteria

| Metric | Target | Owner |
|---|---|---|
| Signup completion rate | >80% | Product |
| Time to first code run | <5 min | UX/Product |
| Pro conversion (free→paid) | 3–5% | Monetization |
| User retention (week 4) | >30% | Product |
| Error rate | <0.1% | Engineering |
| Support response time | <24 hours | Support |

---

## Dependencies & Risks

### Key Dependencies
- **OpenSandbox API:** Requires running server (stable)
- **Claude API:** For AI features (depends on Anthropic availability)
- **Stripe:** For payments (well-established)
- **Supabase:** For auth + database (well-established)

### Key Risks
| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Sandbox crashes | Medium | High | Error tracking + graceful fallback |
| API rate limiting | Low | Medium | Implement queue + backoff |
| Churn in week 2 | High | High | Improve onboarding tutorial |
| Abuse (spam runs) | Medium | Medium | Rate limiting + abuse detection |

---

## Acceptance Criteria (MVP Definition)

- [ ] User can sign up with email or GitHub
- [ ] User can create sandbox in <3 seconds
- [ ] User can execute Python + Node.js commands
- [ ] User can read/write files
- [ ] Free tier limits work (5 runs/day, Python only)
- [ ] Pro tier unlocks (Stripe payment works)
- [ ] AI code review works (calls Claude API)
- [ ] Error messages are clear and actionable
- [ ] Mobile layout is usable (iPhone 14)
- [ ] <100ms database latency
- [ ] 99%+ uptime in first week

---

## Next Steps

1. Get stakeholder sign-off on this spec
2. Create `design.md` with wireframes + user flows
3. Create `tasks.md` with 25+ engineering tasks + estimates
4. Assign tasks + start building (Week 9)
