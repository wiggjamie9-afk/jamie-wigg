-- Migration: Add referral system tables and fields

-- Add referral_code to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE DEFAULT gen_random_uuid()::text;

-- Create referrals tracking table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  reward_amount DECIMAL(10,2) DEFAULT 10.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(referrer_id, referred_user_id)
);

-- Add email tracking table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  email_address TEXT NOT NULL,
  subject TEXT,
  status TEXT CHECK (status IN ('sent', 'failed', 'opened', 'clicked')) DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

-- Add conversion tracking table
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  source_url TEXT,
  medium TEXT,
  campaign TEXT,
  conversion_type TEXT CHECK (conversion_type IN ('signup', 'upgrade', 'purchase')) DEFAULT 'signup',
  value DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Enable Row Level Security
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own referrals
CREATE POLICY "users_can_view_own_referrals" ON referrals
  FOR SELECT USING (auth.uid()::text = referrer_id::text);

-- RLS Policy: Users can only see their own email logs
CREATE POLICY "users_can_view_own_email_logs" ON email_logs
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- RLS Policy: Users can only see their own conversions
CREATE POLICY "users_can_view_own_conversions" ON conversions
  FOR SELECT USING (auth.uid()::text = user_id::text);
