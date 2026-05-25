# Design: Chapel

## Approach
Chapel is a multi-tenant React SPA (Vite + Tailwind) deployed on Vercel, backed by Supabase for auth, database, and row-level security. Each church is an `org` row; RLS policies on every table filter by `org_id` so no cross-church data leaks at the DB layer (R2, N1). Magic-link auth via Supabase removes the password friction for non-technical admins (R1). Email reminders are dispatched by a Vercel Cron job hitting a Supabase Edge Function (or a serverless API route) that queries upcoming services 3 days out and sends via Resend (R6).

## Components

### Auth + Onboarding
- **Responsibility**: Magic-link sign-in; new user creates or joins a church org on first login.
- **Files**: `chapel/src/pages/Login.tsx`, `chapel/src/pages/Onboarding.tsx`, `chapel/src/lib/supabase.ts`
- **Interface**: Supabase `auth.signInWithOtp({ email })` → redirect → `onAuthStateChange` sets session; onboarding writes `orgs` + `org_members` rows.
- **Satisfies**: R1, R2

### Member Directory
- **Responsibility**: CRUD for church members including their name, email, and eligible roles.
- **Files**: `chapel/src/pages/Members.tsx`, `chapel/src/components/MemberForm.tsx`
- **Interface**: Supabase queries on `members` table filtered by `org_id` via RLS; enforces R8 member-count limit before insert.
- **Satisfies**: R4, R8

### Role Management
- **Responsibility**: Admin defines the named service roles used by their church.
- **Files**: `chapel/src/pages/Roles.tsx`, `chapel/src/components/RoleForm.tsx`
- **Interface**: CRUD on `roles` table (`id`, `org_id`, `name`).
- **Satisfies**: R3

### Schedule Builder
- **Responsibility**: Admin picks a Sunday date and assigns members to roles for that service.
- **Files**: `chapel/src/pages/Schedules.tsx`, `chapel/src/components/ScheduleEditor.tsx`
- **Interface**: Writes to `services` (`id`, `org_id`, `date`) and `assignments` (`service_id`, `member_id`, `role_id`). Date picker defaults to next Sunday.
- **Satisfies**: R5

### Attendance Tracker
- **Responsibility**: After a service, admin marks each scheduled member present or absent.
- **Files**: `chapel/src/pages/Attendance.tsx`
- **Interface**: Upserts `attendance` (`assignment_id`, `status: present | absent`). Only unlocked for services whose date has passed.
- **Satisfies**: R7

### Email Reminder Job
- **Responsibility**: Daily cron that finds services in exactly 3 days and emails each assigned volunteer.
- **Files**: `chapel/api/send-reminders.ts` (Vercel serverless function), `chapel/vercel.json` (cron schedule)
- **Interface**: `GET /api/send-reminders` (protected by `CRON_SECRET` header); queries `services JOIN assignments JOIN members` for services where `date = today + 3`; sends via Resend `emails.send()`.
- **Satisfies**: R6, N2

### Dashboard
- **Responsibility**: Home screen showing upcoming Sunday, quick-action buttons, and last attendance snapshot.
- **Files**: `chapel/src/pages/Dashboard.tsx`
- **Interface**: Reads next upcoming `services` row + its `assignments`; mobile-first card layout.
- **Satisfies**: R9

### Billing Gate
- **Responsibility**: Enforces free (≤30 members) vs paid (≤150 members) tier; shows upgrade prompt when limit is hit.
- **Files**: `chapel/src/lib/billing.ts`, `chapel/src/components/UpgradePrompt.tsx`
- **Interface**: `getOrgTier(orgId)` checks `orgs.stripe_subscription_status`; member-add flow calls this before insert. Stripe Checkout session created server-side via `chapel/api/create-checkout.ts`. Full billing wiring is scaffolded but not activated in v1 — the free tier simply caps at 30.
- **Satisfies**: R8

## Data

```sql
-- orgs: one row per church
create table orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  member_count int not null default 0,
  stripe_customer_id text,
  stripe_subscription_status text default 'free',
  created_at timestamptz default now()
);

-- org_members: maps auth users to orgs (admin role only in v1)
create table org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'admin',
  unique(org_id, user_id)
);

-- members: people in the church directory
create table members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

-- roles: service roles defined by the church
create table roles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  name text not null
);

-- member_roles: which roles a member is eligible for
create table member_roles (
  member_id uuid references members(id) on delete cascade,
  role_id uuid references roles(id) on delete cascade,
  primary key (member_id, role_id)
);

-- services: a Sunday service date
create table services (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  date date not null,
  created_at timestamptz default now()
);

-- assignments: member assigned to a role for a service
create table assignments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  role_id uuid references roles(id) on delete cascade,
  reminder_sent_at timestamptz
);

-- attendance: present/absent per assignment
create table attendance (
  assignment_id uuid references assignments(id) on delete cascade primary key,
  status text not null check (status in ('present','absent')),
  recorded_at timestamptz default now()
);
```

RLS: every table (except `orgs` and `org_members`) has a policy `using (org_id = (select org_id from org_members where user_id = auth.uid() limit 1))`.

## Risks

- **Reminder delivery timing**: Vercel Cron fires daily at 08:00 UTC; churches in non-UTC zones may receive reminders at unusual hours. Mitigation: log send time in `reminder_sent_at`; add per-org timezone in v2.
- **Member count drift**: `member_count` on `orgs` is denormalised for quick tier checks. Mitigation: use a Postgres trigger to keep it in sync rather than application-layer updates.
