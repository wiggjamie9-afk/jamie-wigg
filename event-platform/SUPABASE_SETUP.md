# Supabase Setup Guide

This guide walks you through setting up Supabase for the Event Platform with real-time sync (iPhone ↔ MacBook).

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project:
   - **Name:** `event-platform` (or your choice)
   - **Database Password:** Generate a strong one
   - **Region:** Choose closest to you (e.g., `us-east-1`)
3. Wait for the project to provision (~2 minutes)

## 2. Get Your Credentials

In your Supabase project dashboard:
1. Go to **Settings → API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Set Environment Variables

Create `.env.local` in `/event-platform/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 4. Initialize Database Schema

### Option A: SQL Editor (Recommended)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **+ New Query**
3. Copy all SQL from `supabase/schema.sql`
4. Paste and click **Run**

### Option B: Supabase CLI

```bash
npm install -g supabase
supabase db push supabase/schema.sql
```

## 5. Enable Real-time

1. In Supabase, go to **Database → Publications**
2. Enable `supabase_realtime` publication for:
   - ✅ `events` table
   - ✅ `attendees` table

(Already configured in `schema.sql` but verify it's enabled)

## 6. Configure Authentication (Optional)

For user accounts (sign-up/login):

1. Go to **Authentication → Providers**
2. Enable desired auth methods:
   - Email/Password (default)
   - Google OAuth
   - GitHub OAuth
   - etc.

## 7. Test the Connection

```bash
cd event-platform
npm run dev
```

Visit http://localhost:3000 and verify:
- ✅ Events load from Supabase
- ✅ Creating an event syncs in real-time
- ✅ Closing and reopening page shows persisted events

## 8. Test Real-time Sync (iPhone ↔ MacBook)

1. Build and deploy the Next.js app
2. Open on iPhone
3. Open same URL on MacBook
4. Create an event on iPhone → should appear instantly on MacBook (and vice versa)

**Real-time updates use Supabase's websocket subscriptions (enabled via `useEvents` hook)**

## Deployment

### Vercel (Recommended)

```bash
# Push .env.local to Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel deploy
```

### Self-hosted

```bash
# Build for production
npm run build

# Deploy `out/` directory to your hosting
# (GitHub Pages, Netlify, Cloudflare Pages, etc.)
```

## Row Level Security (RLS)

Events use RLS policies:
- **Anyone** can view events
- **Authenticated users** can create events (set as organizer)
- **Organizers** can edit/delete their own events
- **Users** can mark attendance

See `supabase/schema.sql` for detailed policies.

## Troubleshooting

### Events not loading?
```bash
# Check environment variables are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Restart dev server
npm run dev
```

### Real-time not working?
1. Check Supabase dashboard → **Logs**
2. Verify `supabase_realtime` publication includes `events` + `attendees`
3. Restart app and check browser console for errors

### 429 Rate limit errors?
Supabase free tier has request limits. Upgrade plan if needed.

## Next Steps

- Add **Authentication** UI (sign-up, login)
- Add **User profiles** (organizer bios, etc.)
- Add **Event search & filtering**
- Add **File storage** (event images, logos)
- Add **Comments/discussions** on events
- Deploy to iOS App Store via Capacitor

---

For more: [Supabase Docs](https://supabase.com/docs)
