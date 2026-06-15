# ship-app-to-store

End-to-end workflow for building and launching an app to iOS/Android app stores (8 weeks).

## Trigger

User runs: `/ship-app-to-store "App idea"` or loads this skill for full-stack app development.

## What this skill does

Orchestrates app development across 8-week pipeline:

**Week 1-2: Design & Spec**
- Data model design (app-architect agent)
- API specification (backend-engineer agent)
- Figma prototype (frontend-engineer agent)

**Week 3-4: Backend Development**
- Node.js API routes (backend-engineer agent)
- Database schema + migrations (backend-engineer agent)
- Auth system setup (backend-engineer agent)
- CI/CD pipeline (devops-engineer agent)

**Week 5-6: Frontend & Mobile**
- React component library (frontend-engineer agent)
- Mobile native build (mobile-engineer agent)
- TestFlight beta setup (beta-tester-coordinator agent)

**Week 7: Polish & Optimize**
- Performance testing (devops-engineer agent)
- Security audit (devops-engineer agent)
- Event tracking setup (analytics-engineer agent)

**Week 8: Launch**
- App Store listing (app-store-optimizer agent)
- Press kit + announcement (product-launch-coordinator agent)
- Paid ads launch (paid-ads-strategist agent)

## Requires

- App concept (elevator pitch)
- Supabase project (for backend)
- GitHub repository
- Apple Developer + Google Play accounts
- Stripe account (for in-app purchases)
- Analytics setup (Mixpanel / Segment)

## Related docs

- `ECOSYSTEM.md` — Full agent roster
- `docs/workflows/app-development.md` — Detailed dev workflow
- `studio/` — Reference: STARLIGHTMIX Studio (Next.js app example)

## Agent chain

```
app-concept
  → app-architect (design spec)
  → frontend-engineer (component library)
  → backend-engineer (API routes + database)
  → mobile-engineer (iOS/Android build)
  → devops-engineer (CI/CD + performance)
  → beta-tester-coordinator (TestFlight beta)
  → app-store-optimizer (listing + screenshots)
  → product-launch-coordinator (announcement)
  → video-producer (app walkthrough video)
  → paid-ads-strategist (user acquisition)
  → analytics-engineer (funnel tracking)
  → financial-forecaster (LTV modeling)
```

## Output artifacts

- iOS app (TestFlight → App Store)
- Android app (Play Beta → Google Play)
- API documentation (OpenAPI spec)
- Admin dashboard (metrics, user management)
- Press kit (app description, screenshots, demo video)
- Paid ads campaigns (Google UAC, Facebook)
- Analytics dashboard (daily active users, retention, revenue)
