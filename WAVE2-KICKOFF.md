# Wave 2 Kickoff Guide — Week 5-8 Execution Plan

**Status:** Ready to deploy (after Wave 1 is live for 48 hours and stable)  
**Timeline:** 4 weeks (Week 5-8)  
**Total effort:** 210-260 hours (3 FTE concurrent)  
**Branch:** `claude/cybersecurity-skills-agents-70sxup`

---

## 🎯 Wave 2 Objectives

**Expand the STARLIGHTMIX ecosystem** from solo users to creators, athletes, and AI-powered backend services.

Three products launched in parallel:
1. **Buddy Builder** — Creator marketplace (Stripe Connect payouts)
2. **Recovery iOS** — Athlete rehab app (native iOS)
3. **RHYTHMIX Platform** — Unified backend API (AI orchestration)

---

## 📊 Product Overview (Summary)

| Product | Users | Launch | Effort | Status |
|---------|-------|--------|--------|--------|
| **Buddy Builder** | Music producers | Week 6-7 | 80-100h | Specs ✓ |
| **Recovery iOS** | Athletes + coaches | Week 7-8 | 60-80h | Specs ✓ |
| **RHYTHMIX Platform** | All Wave 1+2 | Week 8 | 70-90h | Specs ✓ |

---

## 📁 Documentation Structure

All specs in `specs/` directory. Each product has 3 files:

- `requirements.md` — What it does (8 functional requirements each)
- `design.md` — How it looks/works (architecture, UI, patterns)
- `tasks.md` — How to build it (implementation phases, subtasks)

**Quick reference:**
- `WAVE2-STATUS.md` — Overview + infrastructure + success metrics
- `WAVE2-DEPLOYMENT.md` — Production deployment runbook (create post-launch)
- `WAVE2-QUICKSTART.md` — 90-minute local setup (create post-launch)

---

## ⏱️ Weekly Timeline

### Week 5: Foundation + Buddy Builder Backend

**Days 1-3 (Mon-Wed): Parallel setup**
- [ ] **Buddy Builder**: Supabase schema + Track upload API (T1-T3)
- [ ] **Recovery iOS**: Capacitor setup + auth (T2)
- [ ] **RHYTHMIX Platform**: Redis + S3 + schema setup (T1)

**Days 4-5 (Thu-Fri): Continued implementation**
- [ ] **Buddy Builder**: Creator onboarding flow (T2)
- [ ] **Recovery iOS**: Athlete onboarding form (T3)
- [ ] **RHYTHMIX Platform**: Job submission API (T2)

**Blockers to watch:**
- Stripe Connect OAuth flow
- Capacitor iOS build setup (Xcode required)
- Redis provisioning (might take 1-2 hours)

---

### Week 6: Buddy Builder MVP → Live

**Days 1-3: Core features**
- [ ] **Buddy Builder**: Template editor (T4), Marketplace (T5)
- [ ] **Recovery iOS**: Injury intake + protocol (T4-T5)
- [ ] **RHYTHMIX Platform**: Model router + quotas (T3-T4)

**Days 4-5: Monetization**
- [ ] **Buddy Builder**: Monetization setup + earnings dashboard (T6)
- [ ] **Recovery iOS**: Daily check-in form (T5)
- [ ] **RHYTHMIX Platform**: Caching layer (T5)

**Launch Buddy Builder** (end of Week 6)
- [ ] Deploy to Vercel
- [ ] 500+ creators invited
- [ ] Run internal stress test

---

### Week 7: Recovery iOS → Beta, RHYTHMIX Platform Core

**Days 1-3: Mobile refinement**
- [ ] **Recovery iOS**: Alerts & notifications (T6)
- [ ] **Recovery iOS**: Offline support (T9)
- [ ] **RHYTHMIX Platform**: Webhooks (T6)

**Days 4-5: Finalization**
- [ ] **Recovery iOS**: QA & bug fixes (T10)
- [ ] **RHYTHMIX Platform**: Feature gating (T7)
- [ ] **RHYTHMIX Platform**: Analytics setup (T8)

**Beta release: Recovery iOS**
- [ ] TestFlight build created
- [ ] 50 beta testers invited
- [ ] Feedback loop active

---

### Week 8: All Products → Production, QA, Deploy

**Days 1-2: Final integration**
- [ ] **All**: Cross-product testing (Buddy Builder → RHYTHMIX Platform)
- [ ] **All**: Webhook integration testing
- [ ] **Recovery iOS**: App Store submission

**Days 3-4: Deployment prep**
- [ ] **All**: Performance tuning + load testing
- [ ] **All**: Monitoring + alerting setup
- [ ] **All**: Documentation complete

**Days 5: Production Launch**
- [ ] Deploy Buddy Builder (if not already)
- [ ] Deploy RHYTHMIX Platform
- [ ] Release Recovery iOS to App Store (if approved)
- [ ] Monitor for 24 hours (on-call)

---

## 👥 Team Allocation (Recommended)

**3 full-time engineers + 1 devops/QA hybrid:**

| Role | Product | Effort | Person |
|------|---------|--------|--------|
| Frontend | Buddy Builder | 50h | FE dev 1 |
| Backend | Buddy Builder | 30h | Backend dev |
| Mobile | Recovery iOS | 70h | React Native / Capacitor dev |
| Backend | RHYTHMIX Platform | 90h | Backend dev (senior) |
| QA + DevOps | All | 40h | DevOps/QA (shared) |

**Notes:**
- Backend dev can split time between Buddy Builder + Platform
- Mobile dev focuses solely on iOS (parallel path)
- QA starts Week 7 (validation phase)
- DevOps starts Week 1 (infrastructure setup)

---

## 🚀 Execution Checklist (Per Product)

### Buddy Builder

**Pre-launch (Week 5-6):**
- [ ] Supabase migrations complete (T1.1)
- [ ] Creator API endpoints working (T1-T2)
- [ ] Track upload + BPM detection working (T3)
- [ ] Template editor renders (T4.1)
- [ ] Marketplace search <200ms (T5)
- [ ] Stripe Connect integration complete (T6.2)
- [ ] Mobile responsive (all pages)
- [ ] No console errors

**Launch readiness (Week 6-7):**
- [ ] Creator onboarding tested end-to-end
- [ ] First template uploaded + rendered successfully
- [ ] Payout test: creator balance shows, withdraw works
- [ ] Marketplace visible, at least 10 templates live
- [ ] Lighthouse score ≥90 (mobile)
- [ ] Load test: 100 concurrent users, <200ms latency

---

### Recovery iOS

**Pre-launch (Week 6-7):**
- [ ] Capacitor project builds in Xcode
- [ ] Auth flow works (sign up → authenticated state)
- [ ] Injury intake form completes (T3)
- [ ] Daily check-in form saves locally + syncs (T4-T9)
- [ ] Pain spike alert triggers (T6.1)
- [ ] FCM push notifications working (T6.2)
- [ ] App launches in <2s
- [ ] Voice-over labels all interactive elements

**Beta readiness (Week 7-8):**
- [ ] TestFlight build created + uploaded
- [ ] 50 beta testers added
- [ ] Crash reporting (Sentry or similar) active
- [ ] Daily check-in recorded in Supabase
- [ ] Offline check-in syncs on reconnect
- [ ] PDF export generates + downloads
- [ ] No critical bugs (P0)

---

### RHYTHMIX Platform

**Pre-launch (Week 7-8):**
- [ ] Vercel deployment working (cold start <100ms)
- [ ] Job submission returns job_id in <200ms (T2.1)
- [ ] Status polling <100ms latency (T2.2)
- [ ] Model router selects correct fallback (T3.4)
- [ ] Quota enforcement works (T4)
- [ ] Cache hit rate ≥95% (T5)
- [ ] Webhook delivery succeeds 99.9% (T6)
- [ ] Monitoring dashboard shows all metrics (T8.2)

**Production readiness (Week 8):**
- [ ] Load test: 1000 concurrent requests, p99 <500ms
- [ ] Error rate <1%
- [ ] Uptime 99.95% (over 24h)
- [ ] All endpoints secured with JWT (T7.1)
- [ ] Deployment documented + tested

---

## 🔗 Integration Points (Cross-Product)

### Wave 1 → Wave 2

**Studio** uses **RHYTHMIX Platform** for video generation:
```
Studio user submits → RHYTHMIX Platform job → Replicate → S3 → Studio user downloads
```

**Buddy Builder** uses **RHYTHMIX Platform** for template rendering + video gen:
```
Creator build template → RHYTHMIX preview render → CloudFront CDN
User remixes → RHYTHMIX video gen → S3 → user download
```

**Recovery iOS** uses **RHYTHMIX Platform** for optional voice alerts:
```
Alert triggered → RHYTHMIX TTS (ElevenLabs) → FCM notification → iOS device
```

---

## 🎯 Success Metrics (Week 8 Exit Criteria)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Buddy Builder** | 500+ creators | Sign-ups counter |
| **Buddy Builder** | 100+ templates | Live count |
| **Buddy Builder** | $50k+ GMV | Stripe analytics |
| **Recovery iOS** | 50 beta testers | TestFlight |
| **RHYTHMIX Platform** | 1000+ API calls/day | Monitoring dashboard |
| **All** | Uptime 99.95% | CloudWatch / Datadog |
| **All** | <1% error rate | Logs aggregation |
| **All** | Monitoring active | Alerts + dashboards |

---

## 📚 Key Files to Review

**Start here (in order):**
1. `WAVE2-STATUS.md` — Product overview + infrastructure
2. `specs/buddy-builder/requirements.md` — What Buddy Builder does
3. `specs/recovery-ios/requirements.md` — What Recovery iOS does
4. `specs/rhythmix-platform/design.md` — How the backend works
5. `specs/buddy-builder/tasks.md` — Implementation breakdown (use for sprint planning)

**Reference during implementation:**
- `specs/*/design.md` — Architecture, UI patterns, security
- `specs/*/tasks.md` — Subtask breakdown + acceptance criteria
- `WAVE1-DEPLOYMENT.md` — Similar pattern for Wave 1 (reference only)

---

## ⚠️ Known Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Stripe Connect OAuth delays | High | Test OAuth flow immediately (Week 5 Day 1) |
| Capacitor iOS setup complex | High | Allocate 1 FTE mobile dev full-time |
| Redis provisioning slow | Medium | Use Upstash (instant setup) instead of self-hosted |
| Model fallback logic bugs | High | Unit test model router thoroughly before launch |
| Webhook delivery failures | Medium | Implement exponential backoff + delivery audit log |
| App Store rejection | Medium | Submit Recovery iOS Week 7 (2-week approval buffer) |
| Performance degradation at scale | Medium | Load test Week 8 (before production) |

---

## 📞 Communication Plan

**Daily standup** (5-10 min, async Slack updates):
- What did you ship yesterday?
- What are you shipping today?
- Any blockers?

**Weekly sync** (30 min, Thursday at 4 PM UTC):
- Product health check
- Dependency review (Buddy Builder → RHYTHMIX, etc.)
- Risk escalation
- Next week priorities

**Deployment window** (Week 8, Friday):
- All three products go live
- On-call rotation: 72 hours (Week 8 Fri - Mon)
- Incident response: Slack → War room if needed

---

## 🎓 Onboarding Checklist (For new team members)

If joining Wave 2 team:

- [ ] Read `WAVE2-STATUS.md` (10 min)
- [ ] Read your product's requirements.md (15 min)
- [ ] Read your product's design.md (15 min)
- [ ] Skim tasks.md to understand scope (10 min)
- [ ] Set up local environment per `WAVE2-QUICKSTART.md` (45 min)
- [ ] Deploy to staging (verify build works)
- [ ] Pair with team member on first task (1-2 hours)

**Total onboarding: ~2 hours**

---

## ✅ Pre-Launch Checklist (Day Before Deploy)

**All products:**
- [ ] All tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No console errors in browser (Wave 1+2 products)
- [ ] No console warnings in CLI deployments (Platform)
- [ ] Environment variables set correctly (prod)
- [ ] Secrets rotated (API keys, webhooks)
- [ ] On-call rotation confirmed (24/7 for 72 hours)
- [ ] Incident response doc published
- [ ] Rollback procedure tested (at least documented)
- [ ] Monitoring + alerts confirmed active
- [ ] Database backups recent (<1 hour old)

**Buddy Builder:**
- [ ] Stripe keys verified (prod vs test)
- [ ] CloudFront cache cleared
- [ ] Vercel deployment preview tested

**Recovery iOS:**
- [ ] App Store upload verified (in review status)
- [ ] TestFlight build on latest code
- [ ] Push notification service verified (APNs cert current)

**RHYTHMIX Platform:**
- [ ] Replicate API key verified (prod tier, sufficient quota)
- [ ] ElevenLabs API verified
- [ ] Redis connection pooling active
- [ ] S3 lifecycle policies confirmed

---

## 🚨 Rollback Procedure

If critical issue found after deploy:

1. **Buddy Builder** (Vercel):
   - `vercel rollback` to previous stable build
   - Or revert commit + `git push` + Vercel auto-deploys

2. **Recovery iOS** (App Store):
   - Submit new build (faster than waiting for review of rollback)
   - Or disable version server-side (feature flag)

3. **RHYTHMIX Platform** (Vercel + DB):
   - `vercel rollback` for functions
   - Database: restore from backup (if data corruption)
   - Redis: flush cache, restart (if cache issue)

**Estimated rollback time: <5 min (functions), <30 min (database restore)**

---

## 📈 Post-Launch Monitoring (Week 9)

**First 72 hours:**
- [ ] On-call team monitoring 24/7
- [ ] Slack alerts → war room escalation
- [ ] Daily health check (uptime, error rate, user feedback)

**Week 9 (Day 4-7):**
- [ ] Reduce on-call to business hours only
- [ ] Publish post-launch analysis (what went well, what didn't)
- [ ] Retrospective with team (1 hour)
- [ ] Address critical feedback from users

**Week 10 (Phase 2 start):**
- [ ] Wave 2 Phase 2 kickoff (improvements, scaling)
- [ ] Start Wave 3 planning (Buddy Builder expansions, Recovery iOS enterprise)

---

## 🎉 Success Criteria (Wave 2 Complete)

By end of Week 8:

- ✅ Buddy Builder live (500+ creators, 100+ templates)
- ✅ Recovery iOS in App Store (or rejected → resubmit)
- ✅ RHYTHMIX Platform stable (99.95% uptime)
- ✅ All monitoring active
- ✅ Zero critical data loss
- ✅ Team trained on operations
- ✅ Documentation complete

**Post-launch goals (Week 9-12):**

- 1k+ Buddy Builder creators
- $1M+ revenue (Studio + Pro tiers)
- 200+ Recovery iOS athletes
- RHYTHMIX Platform <100ms latency (p99)
- Zero unplanned downtime

---

## 📞 Questions?

Refer to:
- **Technical**: Product specs in `specs/*/` (requirements + design)
- **Execution**: `specs/*/tasks.md` (phase-by-phase breakdown)
- **Infrastructure**: `WAVE2-STATUS.md` (costs, scaling)
- **Deployment**: `WAVE1-DEPLOYMENT.md` (similar pattern, reference)

**Live chat support:** Slack #wave-2-team (during business hours)

---

**Wave 2 is ready. Let's ship it. 🚀**
