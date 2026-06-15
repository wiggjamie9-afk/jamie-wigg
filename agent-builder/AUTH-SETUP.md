# Authentication Setup Guide

## Overview

The agent-builder uses **Supabase Auth** for user authentication and **PostgREST** for database access. Users can sign up, log in, and manage projects with full Row Level Security (RLS) policies.

## Schema Design

### Tables

1. **users**: Extended auth.users profile
   - `id` (UUID, FK to auth.users) — primary key
   - `email` (TEXT, unique) — user email
   - `name` (TEXT) — display name
   - `tier` ('starter' | 'pro' | 'addon') — subscription tier
   - `created_at`, `updated_at` — timestamps with auto-update triggers

2. **projects**: Agent configurations per user
   - `id` (UUID) — project primary key
   - `user_id` (UUID, FK to users) — owner
   - `agent_type` (TEXT) — one of 6 types (code-review, document-processing, research, security-audit, data-analysis, customer-support)
   - `config` (JSONB) — agent environment + session + events settings
   - `tier` — project's pricing tier
   - `created_at`, `updated_at` — timestamps

3. **analytics**: Event tracking for usage and cost monitoring
   - `id` (UUID) — event primary key
   - `project_id` (UUID, FK to projects) — which agent generated the event
   - `event_type` (TEXT) — event name (session_start, message_sent, tool_used, etc.)
   - `metadata` (JSONB) — additional context
   - `timestamp` — event time (indexed DESC for fast queries)

### Row Level Security (RLS)

- **users**: Users can only read/update their own profile
- **projects**: Users can only see/manage projects they own
- **analytics**: Users can only access analytics for their own projects

This prevents data leaks and ensures multi-tenant safety.

## Auth Flow

1. **Signup**: `signup(email, password, name?)` → creates auth.users + users profile row
2. **Login**: `login(email, password)` → Supabase Auth session
3. **Logout**: `logout()` → revokes session
4. **Get Current User**: `getCurrentUser()` → fetches users profile with auth context
5. **Protected Routes**: Use `withAuth()` in route handlers to check auth, or `requireAuth()` to enforce

## Environment Setup

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Fill in your Supabase credentials from https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Initialization

1. Create a new Supabase project at https://supabase.com
2. In the SQL Editor, paste the contents of `migrations/001_users.sql` and run it
3. This creates tables, indexes, RLS policies, and auto-update triggers

## File Structure

```
agent-builder/
├── lib/
│   ├── db.ts            — Database client + TypeScript types
│   ├── auth.ts          — Signup, login, user queries, middleware
│   ├── agent-templates.ts
│   ├── schemas.ts
│   └── prompt-export.ts
├── migrations/
│   └── 001_users.sql    — Schema & RLS policies
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/             — Route handlers using withAuth()
│   └── dashboard/       — Protected pages using requireAuth()
├── .env.example
└── package.json
```

## Usage Examples

### Client-side Signup (with Next.js)
```typescript
import { signup } from '@/lib/auth';

async function handleSignup(email: string, password: string, name: string) {
  try {
    const { user, session } = await signup(email, password, name);
    console.log('User created:', user.id);
    // Redirect to dashboard
  } catch (error) {
    console.error('Signup failed:', error.message);
  }
}
```

### Route Handler with Auth Check
```typescript
// app/api/projects/route.ts
import { withAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

### Server Component with Redirect
```typescript
// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await requireAuth();
  if (!user) redirect('/login');

  return <div>Welcome, {user.name}</div>;
}
```

## Features

- ✅ Email/password authentication via Supabase Auth
- ✅ User profiles with tier tracking
- ✅ Project CRUD with ownership RLS
- ✅ Analytics event tracking
- ✅ TypeScript types for all tables
- ✅ Auto-updating timestamps
- ✅ Ready for protected routes and API endpoints

## Next Steps

1. Deploy migrations to your Supabase project
2. Build signup/login forms in `app/auth/`
3. Create protected dashboard page in `app/dashboard/`
4. Build API endpoints in `app/api/projects/`, `app/api/analytics/`, etc.
