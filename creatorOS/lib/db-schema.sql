-- CreatorOS Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'studio'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'past_due'
  stripe_customer_id TEXT UNIQUE,
  generation_limit_video INT DEFAULT 5,
  generation_limit_music INT DEFAULT 5,
  generation_limit_image INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Content table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'video', 'music', 'image'
  title TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT,
  file_size_bytes INT,
  status TEXT DEFAULT 'ready', -- 'processing', 'ready', 'failed'
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Scheduled Posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  platforms TEXT[] NOT NULL, -- ['twitter', 'instagram', 'tiktok', 'youtube', 'linkedin']
  schedule_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  published_at TIMESTAMP WITH TIME ZONE,
  media_urls TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_schedule ON scheduled_posts(user_id, schedule_time),
  INDEX idx_status ON scheduled_posts(status)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES scheduled_posts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_platform ON analytics(user_id, platform, created_at)
);

-- Monetization Earnings table
CREATE TABLE IF NOT EXISTS earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method TEXT NOT NULL, -- 'membership', 'sponsorship', 'tips', 'affiliate'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  stripe_transaction_id TEXT,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_date ON earnings(user_id, created_at)
);

-- Subscription Plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier TEXT NOT NULL UNIQUE, -- 'free', 'pro', 'studio'
  monthly_price DECIMAL(10,2),
  yearly_price DECIMAL(10,2),
  features TEXT[],
  generation_limits JSONB,
  max_scheduled_posts INT,
  analytics_retention_days INT,
  team_seats INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Memberships table
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- API Keys table (for user API access)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_user ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_platforms ON scheduled_posts USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_earnings_user ON earnings(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own content" ON content
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own posts" ON scheduled_posts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own analytics" ON analytics
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own earnings" ON earnings
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Insert default subscription plans
INSERT INTO subscription_plans (tier, monthly_price, yearly_price, features, generation_limits, max_scheduled_posts, analytics_retention_days, team_seats) VALUES
  ('free', 0, 0, ARRAY['5 video generations/month', '5 music generations/month', '10 image generations/month', 'Basic scheduling', 'Basic analytics', 'Community support'], '{"video": 5, "music": 5, "image": 10}'::jsonb, 20, 30, 1),
  ('pro', 49, 490, ARRAY['Unlimited generations', 'Advanced scheduling', 'Full analytics', 'Email support', 'Priority queue', 'API access'], '{"video": 999, "music": 999, "image": 999}'::jsonb, 100, 90, 1),
  ('studio', 199, 1990, ARRAY['Everything in Pro', 'Team collaboration (up to 5 users)', 'Advanced monetization tools', 'Webhook integrations', 'Dedicated support', 'Custom integrations'], '{"video": 9999, "music": 9999, "image": 9999}'::jsonb, 999, 365, 5);
