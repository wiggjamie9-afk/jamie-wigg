# Course Platform — Week 1

AI course marketplace with enrollment and Stripe payments.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account (local or cloud)
- Stripe account

### 1. Setup

```bash
cd course-platform
pnpm install
```

### 2. Database

Copy `.env.example` → `.env.local` and fill in Supabase credentials:

```bash
# Option A: Local Supabase
supabase start
supabase status  # Copy credentials to .env.local

# Option B: Cloud Supabase
# Create project at https://supabase.com
# Copy URL + anon key to .env.local
```

Run migrations in Supabase SQL editor:

```bash
# From supabase dashboard SQL editor, run in order:
# 1. migrations/001_courses.sql
# 2. migrations/002_enrollments.sql
# 3. migrations/003_videos.sql
```

### 3. Stripe Setup

Create test Stripe account at https://stripe.com

Get your keys:
- Public key: `pk_test_...`
- Secret key: `sk_test_...`

Add to `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From CLI: stripe listen
```

### 4. Seed Hardcoded Course (Week 1)

```sql
-- Run in Supabase SQL editor after migrations
INSERT INTO courses (creator_id, title, description, price_cents, video_count)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your@email.com'),
  'AI Agent Mastery',
  'Learn to build and deploy AI agents using Claude API and LangChain',
  9900,
  1
);
```

### 5. Run Dev Server

```bash
pnpm dev
```

Visit http://localhost:3000

## Project Structure

```
course-platform/
├── app/
│   ├── page.tsx                    # Course listing
│   ├── course/[id]/page.tsx         # Course detail + enroll
│   ├── creator/dashboard/page.tsx   # Creator view
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts        # Stripe checkout
│   │   └── webhooks/stripe/route.ts # Stripe webhook
│   └── globals.css
├── lib/
│   ├── supabase-client.ts           # Auth client
│   ├── courses.ts                   # Course API functions
│   └── stripe.ts                    # Stripe utilities
├── migrations/
│   ├── 001_courses.sql
│   ├── 002_enrollments.sql
│   └── 003_videos.sql
└── package.json
```

## Week 1 Features

✓ Course listing page  
✓ Course detail page with video preview  
✓ Enroll button → Stripe checkout  
✓ Creator dashboard (view courses, revenue)  
✓ User authentication (signup, login)  
✓ Database with RLS policies  

## Testing

### Test Auth Flow

1. Visit http://localhost:3000/auth/signup
2. Create account with test@example.com / password123
3. Visit http://localhost:3000/creator/dashboard
4. Should show "No courses yet" (you're not creator of hardcoded course)

### Test Enrollment Flow

1. Visit http://localhost:3000
2. Click course card
3. Click "Enroll Now"
4. Use Stripe test card: 4242 4242 4242 4242
5. After payment, should show "Access Granted"

### Test Creator View

1. Update hardcoded course creator_id to your user id:
   ```sql
   UPDATE courses SET creator_id = (SELECT id FROM auth.users WHERE email = 'test@example.com');
   ```
2. Visit /creator/dashboard
3. Should show the course + $99 revenue

## Deployment

### Option A: Vercel (Recommended)

```bash
git add .
git commit -m "Course platform Week 1"
git push origin main
```

1. Import repo to Vercel
2. Set environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
3. Deploy

### Option B: Cloudflare Pages

```bash
pnpm build
# Deploy `out/` directory
```

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| NEXT_PUBLIC_SUPABASE_URL | ✓ | https://xxx.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✓ | eyJx... |
| STRIPE_SECRET_KEY | ✓ | sk_test_... |
| STRIPE_WEBHOOK_SECRET | ✓ | whsec_... |
| NEXT_PUBLIC_APP_URL | | http://localhost:3000 |
| SUPABASE_SERVICE_ROLE_KEY | (optional) | For admin tasks |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Supabase credentials not configured" | Check .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY |
| "RLS policy denies all writes" | Run migrations 001-003 in Supabase SQL editor |
| Stripe checkout fails | Verify STRIPE_SECRET_KEY is set; check console for error |
| Webhook not firing | Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and copy STRIPE_WEBHOOK_SECRET |

## Week 2 Roadmap

- [ ] Upload videos (creator flow)
- [ ] Video player with enrollment gating
- [ ] Admin panel to create courses dynamically
- [ ] Analytics dashboard
- [ ] Course completion tracking
- [ ] Certificates
- [ ] Affiliate program

## Notes

- This is a **Week 1 MVP** — hardcoded course data
- Video hosting via Vimeo links (not embedded yet)
- No user profiles or comments yet
- No email notifications
- Stripe test mode only (no real payments until production)

## Support

See SUPABASE_SETUP.md for detailed database setup.
See AUTH-SETUP.md for authentication flow details.
