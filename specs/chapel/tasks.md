# Tasks: Chapel

- [x] **T1** — Scaffold chapel/ Vite + React + TypeScript + Tailwind app
  - **files**: `chapel/`, `chapel/package.json`, `chapel/vite.config.ts`, `chapel/tsconfig.json`, `chapel/index.html`, `chapel/src/main.tsx`, `chapel/src/App.tsx`, `chapel/src/index.css`
  - **depends**: —
  - **satisfies**: R9
  - **acceptance**: `npm run dev` inside `chapel/` starts the dev server with a blank React page; Tailwind classes apply correctly

- [x] **T2** — Supabase schema migrations (all tables + RLS policies)
  - **files**: `chapel/supabase/migrations/001_initial_schema.sql`
  - **depends**: —
  - **satisfies**: R2, N1
  - **acceptance**: migration applies cleanly to a fresh Supabase project; RLS policies exist on all tables; a query from a different user's session returns 0 rows

- [x] **T3** — Supabase client + auth context (magic link, session, org resolution)
  - **files**: `chapel/src/lib/supabase.ts`, `chapel/src/context/AuthContext.tsx`, `chapel/src/pages/Login.tsx`, `chapel/src/pages/Onboarding.tsx`
  - **depends**: T1, T2
  - **satisfies**: R1, R2
  - **acceptance**: clicking "Send magic link" emails the user; clicking the link in email signs them in; new users are prompted to create a church name; `org_id` is available in auth context for all subsequent pages

- [x] **T4** — React Router layout with mobile-first nav shell
  - **files**: `chapel/src/App.tsx`, `chapel/src/components/Layout.tsx`, `chapel/src/components/BottomNav.tsx`
  - **depends**: T1, T3
  - **satisfies**: R9
  - **acceptance**: bottom navigation bar with links to Dashboard, Members, Schedules, Attendance renders on mobile viewport; protected routes redirect unauthenticated users to Login

- [x] **T5** — Role management page (define church service roles)
  - **files**: `chapel/src/pages/Roles.tsx`, `chapel/src/components/RoleForm.tsx`
  - **depends**: T3, T4
  - **satisfies**: R3
  - **acceptance**: admin can add a role ("Sound Tech"), see it listed, and delete it; roles are org-scoped (not visible to other orgs)

- [x] **T6** — Member directory page (add, view, edit members + their eligible roles)
  - **files**: `chapel/src/pages/Members.tsx`, `chapel/src/components/MemberForm.tsx`
  - **depends**: T3, T4, T5
  - **satisfies**: R4, R8
  - **acceptance**: admin can add a member with name + email + eligible roles; member appears in the list; adding a 31st member on the free tier shows the upgrade prompt instead of saving

- [x] **T7** — Schedule builder (create Sunday service, assign members to roles)
  - **files**: `chapel/src/pages/Schedules.tsx`, `chapel/src/components/ScheduleEditor.tsx`
  - **depends**: T3, T4, T5, T6
  - **satisfies**: R5
  - **acceptance**: admin picks a Sunday date; for each role they can select an eligible member; saving writes `services` + `assignments` rows; schedule appears in the upcoming list

- [x] **T8** — Attendance tracker (mark present/absent for a past service)
  - **files**: `chapel/src/pages/Attendance.tsx`
  - **depends**: T3, T4, T7
  - **satisfies**: R7
  - **acceptance**: services whose date has passed show a "Record Attendance" button; admin can tap each assigned member to toggle present/absent; state persists on refresh

- [x] **T9** — Dashboard (upcoming Sunday card + last attendance summary)
  - **files**: `chapel/src/pages/Dashboard.tsx`
  - **depends**: T3, T4, T7, T8
  - **satisfies**: R9
  - **acceptance**: dashboard shows the next upcoming service date and its assigned roles; shows a count of present/absent from the most recent completed service

- [x] **T10** — Email reminder Vercel cron job (Resend)
  - **files**: `chapel/api/send-reminders.ts`, `chapel/vercel.json`
  - **depends**: T2, T7
  - **satisfies**: R6, N2
  - **acceptance**: hitting `POST /api/send-reminders` with the correct `CRON_SECRET` header queries services 3 days out, sends a Resend email to each assigned volunteer, and writes `reminder_sent_at`; re-running does not double-send (idempotency check on `reminder_sent_at`)

- [x] **T11** — Billing gate + upgrade prompt (Stripe scaffold, tier enforcement)
  - **files**: `chapel/src/lib/billing.ts`, `chapel/src/components/UpgradePrompt.tsx`, `chapel/api/create-checkout.ts`
  - **depends**: T2, T3, T6
  - **satisfies**: R8
  - **acceptance**: free orgs are blocked from adding a 31st member and see an upgrade CTA; Stripe Checkout session endpoint returns a valid session URL (even if Stripe is not yet live-mode); paid orgs with `stripe_subscription_status = 'active'` are allowed up to 150 members

- [x] **T12** — Vercel + Supabase env wiring + deployment
  - **files**: `chapel/.env.example`, `chapel/vercel.json`
  - **depends**: T1, T2, T10, T11
  - **satisfies**: N3
  - **acceptance**: `chapel/` deploys to Vercel with environment variables set; the live URL loads the dashboard in under 2 seconds on a throttled mobile connection; cron job appears in Vercel dashboard
