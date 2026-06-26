-- Monetization System Schema
-- Shared by all 7 products (RHYTHMIX, HerdCheck, STARLIGHTMIX Studio, HUM, DREAMS, RESONANCE, Reset)

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_emoji TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pricing tiers for each product (supports subscription or one-time)
CREATE TABLE pricing_tiers (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  interval TEXT CHECK (interval IN ('month', 'year', 'one-time')),
  stripe_price_id TEXT,
  features TEXT[], -- JSON array of feature strings
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users (extends Supabase auth users)
CREATE TABLE app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Purchases/Subscriptions
CREATE TABLE purchases (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_users(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  tier_id TEXT NOT NULL REFERENCES pricing_tiers(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  license_key TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')),
  purchased_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- License validation log
CREATE TABLE license_validations (
  id TEXT PRIMARY KEY,
  license_key TEXT NOT NULL REFERENCES purchases(license_key),
  validated_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT
);

-- Revenue tracking
CREATE TABLE revenue_events (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES app_users(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  purchase_id TEXT REFERENCES purchases(id),
  event_type TEXT CHECK (event_type IN ('purchase', 'subscription_renewed', 'refund', 'upgrade', 'downgrade')),
  amount_usd DECIMAL(10, 2) NOT NULL,
  stripe_charge_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_product_id ON purchases(product_id);
CREATE INDEX idx_purchases_license_key ON purchases(license_key);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_license_validations_license_key ON license_validations(license_key);
CREATE INDEX idx_revenue_events_user_id ON revenue_events(user_id);
CREATE INDEX idx_revenue_events_product_id ON revenue_events(product_id);

-- RLS Policies
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_validations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view their own profile" ON app_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON app_users
  FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own purchases
CREATE POLICY "Users can view their own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Revenue events are visible only to purchase owner
CREATE POLICY "Users can view their own revenue events" ON revenue_events
  FOR SELECT USING (auth.uid() = user_id);
