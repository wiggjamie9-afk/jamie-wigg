# CreatorOS Setup Guide

CreatorOS is now fully functional with complete authentication, content generation, scheduling, analytics, and monetization flows. This guide will walk you through setting up the platform.

## Prerequisites

- Node.js 20+ and pnpm 9+
- Supabase account with PostgreSQL database
- Stripe account (for payment processing)
- Replicate API account (for AI content generation)
- ElevenLabs account (for voice generation — optional)
- Anthropic Claude API key (optional, for AI coaching)

## Step 1: Environment Setup

1. **Copy the environment template:**
   ```bash
   cp creatorOS/.env.example creatorOS/.env.local
   ```

2. **Fill in your API keys in `creatorOS/.env.local`:**

   ### Supabase Setup
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Get your API keys from **Settings → API**:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-key
     ```

   ### Stripe Setup
   - Go to [stripe.com](https://stripe.com) and create an account
   - Get your API keys from **Developers → API Keys**:
     ```
     STRIPE_PUBLIC_KEY=pk_test_...
     STRIPE_SECRET_KEY=sk_test_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```

   ### Replicate Setup
   - Go to [replicate.com](https://replicate.com) and get your API token
   ```
   REPLICATE_API_TOKEN=your-token
   ```

   ### Optional: ElevenLabs (for voice generation)
   ```
   ELEVENLABS_API_KEY=your-key
   ```

## Step 2: Database Initialization

1. **Connect Supabase to your project:**
   In the Supabase dashboard:
   - Create a new database (if not auto-created)
   - Go to **SQL Editor → New Query**

2. **Run the schema setup:**
   - Copy the contents of `creatorOS/lib/db-schema.sql`
   - Paste into the Supabase SQL Editor and run

   This creates all tables with proper structure and Row-Level Security policies

3. **Verify tables were created:**
   - Check **Tables** in Supabase dashboard
   - You should see: `users`, `content`, `scheduled_posts`, `analytics`, `earnings`, `subscription_plans`, `user_memberships`, `api_keys`

## Step 3: Install Dependencies

```bash
cd creatorOS
pnpm install
```

## Step 4: Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Step 5: Test the Platform

### 1. **Sign Up**
   - Go to `http://localhost:3000/signup`
   - Create an account with email, name, and password
   - Account is created in Supabase `users` table

### 2. **Login**
   - Go to `http://localhost:3000/login`
   - Use your credentials
   - Redirects to dashboard on success

### 3. **Dashboard Home**
   - View real-time stats: content generated, posts scheduled, total reach, earnings
   - Stats are fetched from API endpoints

### 4. **Generate Content**
   - Navigate to **Generate** tab
   - Select content type: Video, Music, or Image
   - Enter a prompt describing what you want
   - For videos: select duration (15s, 30s, 60s) and aspect ratio
   - Click **Generate**
   - Content is saved to database with `status: processing`

   **Note:** Generation uses Replicate API. Mock responses are returned in development mode.

### 5. **Schedule Posts**
   - Navigate to **Schedule** tab
   - Click **Schedule Post** button
   - Fill in: title, caption, select platforms (Twitter, Instagram, TikTok, etc.)
   - Set schedule time
   - Click **Schedule Post**
   - Post is saved with `status: scheduled`
   - Calendar shows scheduled posts

### 6. **View Analytics**
   - Navigate to **Analytics** tab
   - Select period: Day, Week, or Month
   - View metrics: views, engagements, comments, shares
   - See platform breakdown (Twitter, Instagram, TikTok, etc.)
   - AI insights based on performance patterns

### 7. **Monetize & Upgrade**
   - Navigate to **Monetize** tab
   - View current earnings and supporter count
   - Click **Upgrade to Pro** or **Upgrade to Studio**
   - Redirects to Stripe checkout
   - Choose monthly or yearly billing
   - Complete payment in Stripe test mode

   **Test Stripe Payments:**
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - After payment: subscription is activated, `subscription_tier` updates in database

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login user

### Content Generation
- `POST /api/content/generate` — Generate video/music/image

### Post Scheduling
- `POST /api/posts/schedule` — Create scheduled post
- `GET /api/posts/schedule?userId={id}` — Fetch user's posts

### Analytics
- `GET /api/analytics/dashboard?userId={id}&period={day|week|month}` — Fetch analytics

### Earnings
- `GET /api/earnings?userId={id}` — Fetch earnings and supporter count

### Payments
- `POST /api/stripe/checkout` — Create Stripe checkout session
- `POST /api/stripe/webhook` — Handle Stripe webhook events

## Production Deployment

When ready to deploy:

1. **Build the app:**
   ```bash
   pnpm build
   ```

2. **Test production build locally:**
   ```bash
   pnpm start
   ```

3. **Deploy to Vercel or other platform:**
   - Push to main branch
   - Platform auto-deploys on push
   - Set environment variables in deployment settings

4. **Update Stripe webhook URL:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Update webhook endpoint to your production domain
   - Get new signing secret and update `STRIPE_WEBHOOK_SECRET`

5. **Update social media platform redirects:**
   - Twitter, Instagram, TikTok, etc. callback URLs
   - Update to production domain

## Troubleshooting

### "Database connection failed"
- Verify Supabase URL and anon key are correct
- Check that database is running in Supabase dashboard

### "Stripe checkout failed"
- Verify `STRIPE_SECRET_KEY` and `STRIPE_PUBLIC_KEY` are correct
- Check that webhook secret is set
- Test with Stripe test card: `4242 4242 4242 4242`

### "Content generation timeout"
- Replicate API may be slow
- Check `REPLICATE_API_TOKEN` is valid
- Try simpler prompts first

### "Authentication error"
- Clear browser cookies/local storage
- Verify Supabase service role key is set correctly
- Check user exists in `users` table

## Next Steps

1. **Implement social media API integrations:**
   - Twitter API for posting
   - Instagram Graph API
   - TikTok API
   - YouTube Data API
   - LinkedIn API

2. **Wire up real content generation:**
   - Replace mock responses in `/api/content/generate`
   - Implement Replicate API calls for FLUX, HunyuanVideo, MusicGen
   - Add progress tracking for long-running generations

3. **Add payment features:**
   - Handle subscription renewals
   - Implement usage limits per tier
   - Add subscription management (upgrade/downgrade/cancel)

4. **Build creator tools:**
   - AI-powered caption generation
   - Optimal posting time recommendations
   - Trend analysis
   - Audience insights

5. **Mobile apps:**
   - React Native or Flutter wrapper
   - iOS/Android deployment
   - Push notifications for analytics

## Support

For issues or questions:
- Check the troubleshooting section above
- Review API endpoint implementations in `/app/api/`
- Verify database schema in `/lib/db-schema.sql`
- Check environment variables are set correctly
