# Course Platform Setup Guide

Complete setup instructions for Week 1 MVP.

## Step 1: Clone & Install

```bash
cd /path/to/jamie-wigg
cd course-platform
pnpm install
```

## Step 2: Supabase Setup

### Option A: Local Supabase (Recommended for Dev)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Check status
supabase status
```

You'll see output like:

```
API URL: http://localhost:54321
anon key: eyJhbGc...
service_role key: eyJhbGc...
```

Copy these to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Option B: Cloud Supabase

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → API Keys
4. Copy URL and anon key to `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## Step 3: Run Database Migrations

### Local Supabase

```bash
# Open Supabase dashboard
supabase db console

# Or use SQL Editor:
supabase link  # Link to your project
supabase db pull
```

### Cloud Supabase

1. Go to Supabase dashboard → SQL Editor
2. Create new query
3. Copy contents of `migrations/001_courses.sql`
4. Run
5. Repeat for `migrations/002_enrollments.sql`
6. Repeat for `migrations/003_videos.sql`

## Step 4: Stripe Setup

1. Go to https://stripe.com
2. Create test account
3. Go to Developers → API Keys
4. Copy:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

Add to `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Stripe Webhook (Optional for local testing)

Install Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl https://files.stripe.com/stripe-cli/install.sh -o install.sh
sudo bash install.sh

# Windows
choco install stripe
```

Forward webhooks:

```bash
stripe login  # Authenticate with your Stripe account
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret and add to `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 5: Create Seed Course

### For Local Supabase

```bash
# Open Supabase SQL Editor
supabase db console
```

### For Cloud Supabase

Go to SQL Editor in Supabase dashboard.

### Run This Query

First, get your user ID by signing up in the app:

1. Start dev server: `pnpm dev`
2. Visit http://localhost:3000/auth/signup
3. Sign up with any email (e.g., test@example.com / password123)
4. Open Supabase dashboard
5. Go to SQL Editor
6. Run:

```sql
-- Get your user ID
SELECT id, email FROM auth.users WHERE email = 'test@example.com';
-- Copy the ID

-- Create hardcoded course with your ID
INSERT INTO courses (creator_id, title, description, price_cents, video_count, enrolled_count)
VALUES (
  'YOUR_USER_ID_HERE',  -- Paste the ID from above
  'AI Agent Mastery',
  'Learn to build and deploy autonomous AI agents using Claude API, LangChain, and serverless backends.',
  9900,
  1,
  0
);
```

## Step 6: Test the App

```bash
pnpm dev
```

Open http://localhost:3000

### Test Checklist

- [ ] Course listing shows 1 course
- [ ] Click course → details page loads
- [ ] "Enroll Now" button visible
- [ ] Click "Enroll Now" → Stripe checkout opens
- [ ] Sign up for new account
- [ ] Visit /creator/dashboard → should be empty (not your course)
- [ ] Try signup → login → logout flows
- [ ] No TypeScript errors: `pnpm lint`

## Step 7: Test Enrollment

1. On course detail page, click "Enroll Now"
2. Stripe checkout modal opens
3. Use test card: **4242 4242 4242 4242**
4. Use any future date for expiry (e.g., 12/25)
5. Use any 3-digit CVC
6. Click "Pay"
7. Should redirect to `/course/[id]?success=true`
8. Should show "Access Granted"

## Troubleshooting

### Error: "Supabase credentials not configured"

Check `.env.local`:

```bash
cat .env.local
```

Should have:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Error: "RLS policy denies all writes"

Make sure migrations ran. Check Supabase → Tables:

- [ ] courses table exists
- [ ] enrollments table exists
- [ ] course_videos table exists

If missing, run migrations again.

### Error: "Stripe key not found"

Check `.env.local` has:

```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Checkout doesn't create enrollment

1. Check Stripe webhook is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Check webhook secret is in `.env.local`
3. Check logs for errors

### TypeScript errors

```bash
pnpm lint
```

Should pass with 0 errors.

## Next Steps

After setup:

1. Test all flows (signup, login, course view, enrollment)
2. Verify database records created
3. Check Stripe test payments succeeded
4. Ready for Week 2: video uploads + player

## Environment Checklist

```bash
# Verify all env vars set
echo "NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "NEXT_PUBLIC_STRIPE_PUBLIC_KEY: $NEXT_PUBLIC_STRIPE_PUBLIC_KEY"
echo "STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:0:10}..." # Show only first 10 chars
```

All should show values (not empty).

## Support

- **Supabase docs:** https://supabase.com/docs
- **Stripe docs:** https://stripe.com/docs
- **Next.js docs:** https://nextjs.org/docs
