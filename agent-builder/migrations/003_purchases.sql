-- User Purchases & License Management
-- Tracks what customers bought and license key validation

CREATE TABLE IF NOT EXISTS user_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    app_id TEXT NOT NULL,
    app_name TEXT NOT NULL,
    category TEXT,
    license_key TEXT NOT NULL UNIQUE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL = lifetime license
    is_premium BOOLEAN DEFAULT false,
    is_lifetime BOOLEAN DEFAULT true,
    gumroad_transaction_id TEXT UNIQUE,
    gumroad_product_id TEXT,
    price_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- License validation cache (read-heavy)
CREATE TABLE IF NOT EXISTS license_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key TEXT NOT NULL UNIQUE REFERENCES user_purchases(license_key),
    last_validated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_valid BOOLEAN DEFAULT true,
    device_fingerprint TEXT, -- Optional: tie to device
    last_used_at TIMESTAMP WITH TIME ZONE,
    validation_count INTEGER DEFAULT 0
);

-- Premium features per purchase
CREATE TABLE IF NOT EXISTS premium_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES user_purchases(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(purchase_id, feature_name)
);

-- Subscription tier (for Pro/Premium)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'premium'
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'cancelled'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    renews_at TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT UNIQUE,
    price_monthly DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- App usage tracking (analytics)
CREATE TABLE IF NOT EXISTS app_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES user_purchases(id) ON DELETE CASCADE,
    app_id TEXT NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    is_premium_user BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Revenue tracking
CREATE TABLE IF NOT EXISTS revenue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'purchase', 'subscription', 'refund', 'upgrade'
    app_id TEXT,
    amount DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    source TEXT, -- 'gumroad', 'stripe', 'direct'
    gumroad_transaction_id TEXT,
    stripe_transaction_id TEXT,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_purchases_user ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_app ON user_purchases(app_id);
CREATE INDEX IF NOT EXISTS idx_purchases_license ON user_purchases(license_key);
CREATE INDEX IF NOT EXISTS idx_purchases_gumroad ON user_purchases(gumroad_transaction_id);
CREATE INDEX IF NOT EXISTS idx_license_valid ON license_validations(is_valid);
CREATE INDEX IF NOT EXISTS idx_license_validated ON license_validations(last_validated DESC);
CREATE INDEX IF NOT EXISTS idx_premium_features_purchase ON premium_features(purchase_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_app_sessions_purchase ON app_sessions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_app_sessions_app ON app_sessions(app_id);
CREATE INDEX IF NOT EXISTS idx_revenue_user ON revenue_events(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_app ON revenue_events(app_id);
CREATE INDEX IF NOT EXISTS idx_revenue_type ON revenue_events(event_type);

-- RLS Policies
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;

-- Users see only their purchases
CREATE POLICY "users_see_own_purchases"
    ON user_purchases FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "users_insert_own_purchases"
    ON user_purchases FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users see only their subscriptions
CREATE POLICY "users_see_own_subscriptions"
    ON subscriptions FOR SELECT
    USING (user_id = auth.uid());

-- Users see only their sessions
CREATE POLICY "users_see_own_sessions"
    ON app_sessions FOR SELECT
    USING (purchase_id IN (
        SELECT id FROM user_purchases WHERE user_id = auth.uid()
    ));

-- License validation is public (for app verification)
CREATE POLICY "license_validation_public_read"
    ON license_validations FOR SELECT
    USING (true);

-- Helper function: Generate license key
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT AS $$
BEGIN
    RETURN 'LIC-' || upper(substring(md5(random()::text), 1, 16));
END;
$$ LANGUAGE plpgsql;

-- Helper function: Validate license
CREATE OR REPLACE FUNCTION validate_license(p_license_key TEXT)
RETURNS TABLE (
    is_valid BOOLEAN,
    app_id TEXT,
    app_name TEXT,
    is_premium BOOLEAN,
    user_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CASE
            WHEN up.id IS NULL THEN false
            WHEN up.expires_at IS NOT NULL AND up.expires_at < now() THEN false
            ELSE true
        END as is_valid,
        up.app_id,
        up.app_name,
        up.is_premium,
        up.user_id
    FROM user_purchases up
    WHERE up.license_key = p_license_key;

    -- Update last_validated
    UPDATE license_validations
    SET
        last_validated = now(),
        validation_count = validation_count + 1,
        last_used_at = now()
    WHERE license_key = p_license_key;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_purchases_timestamp
    BEFORE UPDATE ON user_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subscriptions_timestamp
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
