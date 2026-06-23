# Week 1 Infrastructure Setup

## 🚀 Quick Start (90 minutes)

This guide gets all 6 products authenticated and monetized in one sprint. Follow the order below.

---

## Phase 1: Supabase Setup (30 min)

### 1. Create Supabase project
- Go to https://supabase.com/dashboard
- Click "New Project"
- Name: `rhythmix-platform`
- Region: `us-east-1` (closest to users)
- Password: Generate strong, store in 1Password
- Click "Create new project" (wait ~2 min)

### 2. Create database schema
In Supabase **SQL Editor**, run this script:

```sql
-- Enable extensions
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscription_tier text default 'free',
  credits_remaining integer default 0,
  stripe_customer_id text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Subscriptions table
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  stripe_subscription_id text unique,
  tier text not null,
  status text default 'active',
  current_period_start timestamp,
  current_period_end timestamp,
  cancel_at_period_end boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Video renders (Studio)
create table renders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  prompt text,
  model text,
  status text default 'pending',
  video_url text,
  created_at timestamp default now(),
  completed_at timestamp,
  cost_credits integer default 0
);

-- Buddy apps (Buddy Builder)
create table buddies (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references users(id),
  name text not null,
  system_prompt text,
  avatar_url text,
  description text,
  installed_by_count integer default 0,
  revenue_cents integer default 0,
  status text default 'draft',
  published_at timestamp,
  created_at timestamp default now()
);

-- HerdCheck screenings
create table screenings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  animal_id text,
  check_type text,
  score integer,
  image_data text,
  location text,
  created_at timestamp default now()
);

-- Recovery sessions
create table recovery_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  team_id uuid,
  session_type text,
  duration_minutes integer,
  intensity integer,
  notes text,
  created_at timestamp default now()
);

-- Agent Builder courses
create table courses (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references users(id),
  title text not null,
  description text,
  price_cents integer,
  video_count integer,
  enrolled_count integer,
  revenue_cents integer default 0,
  published_at timestamp,
  created_at timestamp default now()
);

-- Enable RLS (Row Level Security)
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table renders enable row level security;
alter table buddies enable row level security;
alter table screenings enable row level security;
alter table recovery_sessions enable row level security;
alter table courses enable row level security;

-- RLS Policies (users can only see their own data)
create policy "users_select" on users for select using (auth.uid() = id);
create policy "users_update" on users for update using (auth.uid() = id);

create policy "subscriptions_select" on subscriptions for select using (auth.uid() = user_id);
create policy "renders_select" on renders for select using (auth.uid() = user_id);
create policy "renders_insert" on renders for insert with check (auth.uid() = user_id);
create policy "screenings_select" on screenings for select using (auth.uid() = user_id);
create policy "recovery_select" on recovery_sessions for select using (auth.uid() = user_id);

-- Creator-accessible data (public)
create policy "buddies_select" on buddies for select using (true);
create policy "courses_select" on courses for select using (true);
```

### 3. Get Supabase keys
- Go to Settings → API
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

---

## Phase 2: Stripe Setup (20 min)

### 1. Create Stripe account
- Go to https://dashboard.stripe.com/register
- Complete verification (2-5 business days for full access, but test mode works immediately)
- For testing, Stripe is **live immediately in test mode**

### 2. Create products & prices
In Stripe Dashboard → **Products**, create these **recurring** products:

**Product 1: Pro**
- Name: `STARLIGHTMIX Studio Pro`
- Price: `$9.99/month`
- Billing period: `Monthly`
- Save price ID as: `price_pro_monthly`

**Product 2: Studio**
- Name: `STARLIGHTMIX Studio Enterprise`
- Price: `$99/month`
- Billing period: `Monthly`
- Save price ID as: `price_studio_monthly`

### 3. Get Stripe keys
- Go to Developers → API keys
- Copy **Secret key** (starts with `sk_test_` or `sk_live_`) → `STRIPE_SECRET_KEY`
- Copy **Publishable key** (starts with `pk_test_` or `pk_live_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 4. Configure webhooks
- Go to Developers → Webhooks
- Click "Add endpoint"
- Endpoint URL: `https://your-domain.com/api/webhooks/stripe` (we'll create this)
- Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Save signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Phase 3: Environment Configuration (10 min)

Create `.env.local` in repo root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# API
REPLICATE_API_TOKEN=your_token_here
ELEVENLABS_API_KEY=your_key_here
HIGGSFIELD_API_KEY=your_key_here
HIGGSFIELD_SECRET=your_secret_here
```

**⚠️ Never commit `.env.local` to git. Add to `.gitignore` if not already there.**

---

## Phase 4: Deploy to Cloudflare Pages (20 min)

### For Studio (`studio/` app):

1. **Install dependencies:**
   ```bash
   cd studio
   pnpm install
   pnpm build
   ```

2. **Deploy to Cloudflare Pages:**
   - Go to https://dash.cloudflare.com/
   - Pages → Connect to Git → Select `jamie-wigg` repo
   - Project name: `starlightmix-studio`
   - Build command: `pnpm build`
   - Build output: `out/`
   - Environment variables: Add all from `.env.local`
   - Deploy

3. **Set production domain:**
   - Pages → Custom domains → Add `studio.starlightmix.com`
   - (requires CNAME: `starlightmix-studio.pages.dev`)

---

## Phase 5: Webhook Handler (optional, but required for production)

Create `studio/app/api/webhooks/stripe/route.ts`:

```typescript
import { stripe } from '@/lib/payments';
import { supabase } from '@/lib/auth';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const subscriptionId = session.subscription;

      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const tier = subscription.metadata?.tier || 'pro';

      // Update user subscription in Supabase
      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          tier,
          status: 'active',
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
        });

      await supabase
        .from('users')
        .update({ subscription_tier: tier })
        .eq('id', userId);

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const tier = subscription.metadata?.tier || 'pro';

      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
        .eq('stripe_subscription_id', subscription.id);

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);

      break;
    }
  }

  return new Response(JSON.stringify({ received: true }));
}
```

---

## Testing Checklist ✓

- [ ] Supabase project created & schema deployed
- [ ] Stripe account active in test mode
- [ ] Products & prices created in Stripe
- [ ] `.env.local` populated with all keys
- [ ] Studio builds without errors: `pnpm build`
- [ ] Studio runs locally: `pnpm dev` (http://localhost:3000)
- [ ] Cloudflare Pages connected to GitHub
- [ ] Test Stripe checkout with test card: `4242 4242 4242 4242`, future expiry, any CVC

**Next:** Implement auth UI components in Studio (Day 2-3) and ship first paying customer.

---

## FAQ

**Q: Do I need production Stripe to test?**  
A: No, test mode works fully. Switch to live when ready.

**Q: How long does Stripe verification take?**  
A: Test mode is instant. Live mode: 2-5 business days.

**Q: What if I mess up the database schema?**  
A: Supabase → SQL Editor → drop the table and re-run.

**Q: Can I skip Supabase and use [other backend]?**  
A: Yes, but you'll need to rewrite auth/payment flows. Supabase is the fastest path.
