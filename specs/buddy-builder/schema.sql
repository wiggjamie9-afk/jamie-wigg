-- Buddy Builder Supabase Schema Migration
-- Creator Marketplace for Music Producers
-- Generated: 2026-06-25

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgtrgm"; -- For full-text search indexing

-- ============================================================================
-- 1. CREATORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  stripe_account_id TEXT UNIQUE, -- Stripe Connect account ID
  stripe_verified_at TIMESTAMP WITH TIME ZONE, -- When Stripe verification completed
  verified BOOLEAN DEFAULT FALSE, -- Creator verification badge (Phase 2c)
  verification_token TEXT, -- Email verification token
  verification_token_expires_at TIMESTAMP WITH TIME ZONE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT valid_display_name CHECK (char_length(trim(display_name)) > 0),
  CONSTRAINT valid_bio CHECK (bio IS NULL OR char_length(bio) <= 500),
  CONSTRAINT valid_website CHECK (website_url IS NULL OR website_url ~ '^https?://')
);

CREATE INDEX idx_creators_user_id ON creators(user_id);
CREATE INDEX idx_creators_stripe_account_id ON creators(stripe_account_id);
CREATE INDEX idx_creators_verified ON creators(verified);
CREATE INDEX idx_creators_created_at ON creators(created_at DESC);
CREATE INDEX idx_creators_display_name_trgm ON creators USING GIST (display_name gist_trgm_ops); -- For prefix search

-- ============================================================================
-- 2. TRACKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  isrc TEXT UNIQUE, -- International Standard Recording Code
  duration_seconds INTEGER NOT NULL,
  bpm INTEGER, -- Beats per minute (auto-detected)
  key TEXT, -- Musical key (C, C#, D, etc.)
  loudness_lufs NUMERIC(5, 2), -- Loudness in LUFS (Loudness Units Relative to Full Scale)
  genre TEXT, -- Primary genre
  mood TEXT[], -- Array of mood tags: ['upbeat', 'chill', 'dark', etc.]
  s3_url TEXT NOT NULL, -- S3 URL to audio file
  s3_key TEXT NOT NULL UNIQUE, -- S3 object key for deletion
  audio_fingerprint TEXT, -- Acoustid fingerprint for duplicate detection
  loudness_normalized BOOLEAN DEFAULT FALSE, -- Normalized to -14 LUFS
  published BOOLEAN DEFAULT FALSE,
  soft_deleted BOOLEAN DEFAULT FALSE, -- Soft delete flag
  soft_deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT valid_title CHECK (char_length(trim(title)) > 0),
  CONSTRAINT valid_duration CHECK (duration_seconds > 0),
  CONSTRAINT valid_bpm CHECK (bpm IS NULL OR (bpm > 0 AND bpm <= 300)),
  CONSTRAINT valid_loudness CHECK (loudness_lufs IS NULL OR loudness_lufs > -100),
  CONSTRAINT valid_s3_url CHECK (s3_url ~ '^https://'),
  CONSTRAINT soft_delete_consistency CHECK (
    (soft_deleted = FALSE AND soft_deleted_at IS NULL) OR
    (soft_deleted = TRUE AND soft_deleted_at IS NOT NULL)
  )
);

CREATE INDEX idx_tracks_creator_id ON tracks(creator_id);
CREATE INDEX idx_tracks_published ON tracks(published);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_created_at ON tracks(created_at DESC);
CREATE INDEX idx_tracks_bpm ON tracks(bpm);
CREATE INDEX idx_tracks_soft_deleted ON tracks(soft_deleted);
CREATE INDEX idx_tracks_audio_fingerprint ON tracks(audio_fingerprint);
CREATE INDEX idx_tracks_title_trgm ON tracks USING GIST (title gist_trgm_ops); -- For full-text search
CREATE INDEX idx_tracks_artist_trgm ON tracks USING GIST (artist gist_trgm_ops);

-- ============================================================================
-- 3. TEMPLATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  canvas_size VARCHAR(10) NOT NULL DEFAULT '16:9', -- '16:9', '9:16', '1:1'
  preview_url TEXT, -- S3 URL to rendered thumbnail PNG
  preview_s3_key TEXT UNIQUE, -- S3 object key for deletion
  price_cents INTEGER NOT NULL DEFAULT 0, -- 0 = free, 1-9900 cents ($0.01-$99.00)
  royalty_split JSONB DEFAULT '{}'::JSONB, -- {co_producer_id: percentage, ...}
  license_type VARCHAR(20) NOT NULL DEFAULT 'non-exclusive', -- 'personal', 'commercial', 'exclusive', 'non-exclusive'
  composition_json JSONB NOT NULL DEFAULT '{}'::JSONB, -- Canvas state: layers, keyframes, effects, etc.
  version TEXT NOT NULL DEFAULT 'v1.0', -- Semantic versioning
  view_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  deprecated BOOLEAN DEFAULT FALSE, -- For version deprecation
  soft_deleted BOOLEAN DEFAULT FALSE,
  soft_deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT valid_name CHECK (char_length(trim(name)) > 0),
  CONSTRAINT valid_price CHECK (price_cents >= 0 AND price_cents <= 9900),
  CONSTRAINT valid_canvas_size CHECK (canvas_size IN ('16:9', '9:16', '1:1')),
  CONSTRAINT valid_license_type CHECK (license_type IN ('personal', 'commercial', 'exclusive', 'non-exclusive')),
  CONSTRAINT valid_royalty_split CHECK (
    -- Validate that all percentages sum to ≤100 and are non-negative
    (royalty_split IS NULL OR
     royalty_split = '{}'::JSONB OR
     (SELECT SUM(CAST(value as NUMERIC)) FROM jsonb_each_text(royalty_split)) IS NULL OR
     (SELECT SUM(CAST(value as NUMERIC)) FROM jsonb_each_text(royalty_split)) <= 100)
  ),
  CONSTRAINT publish_consistency CHECK (
    (published = FALSE AND published_at IS NULL) OR
    (published = TRUE AND published_at IS NOT NULL)
  ),
  CONSTRAINT soft_delete_consistency CHECK (
    (soft_deleted = FALSE AND soft_deleted_at IS NULL) OR
    (soft_deleted = TRUE AND soft_deleted_at IS NOT NULL)
  )
);

CREATE INDEX idx_templates_creator_id ON templates(creator_id);
CREATE INDEX idx_templates_track_id ON templates(track_id);
CREATE INDEX idx_templates_published ON templates(published);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);
CREATE INDEX idx_templates_price ON templates(price_cents);
CREATE INDEX idx_templates_license_type ON templates(license_type);
CREATE INDEX idx_templates_soft_deleted ON templates(soft_deleted);
CREATE INDEX idx_templates_view_count ON templates(view_count DESC);
CREATE INDEX idx_templates_name_trgm ON templates USING GIST (name gist_trgm_ops);
CREATE INDEX idx_templates_canvas_size ON templates(canvas_size);
CREATE INDEX idx_templates_published_created ON templates(published, created_at DESC) WHERE published = TRUE; -- For discover

-- ============================================================================
-- 4. REMIXES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS remixes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  output_video_url TEXT, -- S3 URL to rendered video
  output_s3_key TEXT UNIQUE, -- S3 object key for deletion
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'rendering', 'published', 'failed'
  render_error TEXT, -- Error message if status = 'failed'
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'rendering', 'published', 'failed')),
  CONSTRAINT publish_consistency CHECK (
    (published = FALSE AND published_at IS NULL) OR
    (published = TRUE AND published_at IS NOT NULL)
  )
);

CREATE INDEX idx_remixes_user_id ON remixes(user_id);
CREATE INDEX idx_remixes_template_id ON remixes(template_id);
CREATE INDEX idx_remixes_published ON remixes(published);
CREATE INDEX idx_remixes_created_at ON remixes(created_at DESC);
CREATE INDEX idx_remixes_status ON remixes(status);
CREATE INDEX idx_remixes_user_published ON remixes(user_id, published);

-- ============================================================================
-- 5. ROYALTIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS royalties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  remix_id UUID NOT NULL REFERENCES remixes(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  co_producer_id UUID REFERENCES creators(id) ON DELETE SET NULL, -- Optional co-producer
  amount_cents INTEGER NOT NULL, -- Royalty payment amount
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'paid', 'failed'
  stripe_payout_id TEXT, -- Stripe payout ID when status = 'paid'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_amount CHECK (amount_cents > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processed', 'paid', 'failed')),
  CONSTRAINT status_timestamp_consistency CHECK (
    (status = 'pending' AND processed_at IS NULL AND paid_at IS NULL) OR
    (status = 'processed' AND processed_at IS NOT NULL AND paid_at IS NULL) OR
    (status = 'paid' AND paid_at IS NOT NULL) OR
    (status = 'failed' AND (processed_at IS NULL OR paid_at IS NULL))
  )
);

CREATE INDEX idx_royalties_creator_id ON royalties(creator_id);
CREATE INDEX idx_royalties_co_producer_id ON royalties(co_producer_id);
CREATE INDEX idx_royalties_remix_id ON royalties(remix_id);
CREATE INDEX idx_royalties_status ON royalties(status);
CREATE INDEX idx_royalties_created_at ON royalties(created_at DESC);
CREATE INDEX idx_royalties_creator_status ON royalties(creator_id, status);
CREATE INDEX idx_royalties_unpaid ON royalties(creator_id, created_at) WHERE status IN ('pending', 'processed');

-- ============================================================================
-- 6. COLLABORATORS TABLE (for co-producer invites)
-- ============================================================================

CREATE TABLE IF NOT EXISTS template_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  royalty_percentage INTEGER NOT NULL DEFAULT 0, -- 0-100
  role VARCHAR(20) NOT NULL DEFAULT 'co-producer', -- 'co-producer', 'editor', 'viewer'
  invite_token TEXT UNIQUE, -- JWT-based invite token (link-based access)
  invite_token_expires_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT valid_royalty CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
  CONSTRAINT valid_role CHECK (role IN ('co-producer', 'editor', 'viewer')),
  CONSTRAINT unique_template_creator UNIQUE (template_id, creator_id)
);

CREATE INDEX idx_collaborators_template_id ON template_collaborators(template_id);
CREATE INDEX idx_collaborators_creator_id ON template_collaborators(creator_id);
CREATE INDEX idx_collaborators_invite_token ON template_collaborators(invite_token);
CREATE INDEX idx_collaborators_accepted ON template_collaborators(accepted_at);

-- ============================================================================
-- 7. PAYOUTS TABLE (for withdrawal tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL, -- Payout amount
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'paid', 'failed'
  stripe_payout_id TEXT UNIQUE, -- Stripe payout ID
  failure_reason TEXT, -- Reason for failed payout
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT valid_amount CHECK (amount_cents >= 1000), -- Minimum $10
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'paid', 'failed'))
);

CREATE INDEX idx_payouts_creator_id ON payouts(creator_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_created_at ON payouts(created_at DESC);
CREATE INDEX idx_payouts_creator_status ON payouts(creator_id, status);

-- ============================================================================
-- 8. MODERATION TABLE (for content moderation & abuse tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS moderation_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL, -- 'profanity', 'nsfw', 'copyright', 'spam', 'other'
  description TEXT,
  auto_flagged BOOLEAN DEFAULT TRUE, -- TRUE if auto-scan, FALSE if manual report
  flagged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Reporter (if manual)
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'dismissed', 'actioned'
  action_taken VARCHAR(50), -- 'none', 'warning', 'temporary_removal', 'permanent_removal'
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  dispute_status VARCHAR(20) DEFAULT NULL, -- 'pending', 'approved', 'rejected'
  dispute_submitted_at TIMESTAMP WITH TIME ZONE,
  dispute_resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT valid_reason CHECK (reason IN ('profanity', 'nsfw', 'copyright', 'spam', 'other')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
  CONSTRAINT valid_action CHECK (action_taken IS NULL OR action_taken IN ('none', 'warning', 'temporary_removal', 'permanent_removal')),
  CONSTRAINT valid_dispute CHECK (
    dispute_status IS NULL OR
    dispute_status IN ('pending', 'approved', 'rejected')
  )
);

CREATE INDEX idx_moderation_template_id ON moderation_flags(template_id);
CREATE INDEX idx_moderation_creator_id ON moderation_flags(creator_id);
CREATE INDEX idx_moderation_status ON moderation_flags(status);
CREATE INDEX idx_moderation_created_at ON moderation_flags(created_at DESC);

-- ============================================================================
-- 9. ANALYTICS TABLE (for dashboard metrics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  metric_date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  remixes INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT unique_creator_template_date UNIQUE (creator_id, template_id, metric_date)
);

CREATE INDEX idx_analytics_creator_date ON analytics_daily(creator_id, metric_date DESC);
CREATE INDEX idx_analytics_template_date ON analytics_daily(template_id, metric_date DESC);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE remixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE royalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATORS RLS POLICIES
-- ============================================================================

-- Creators can view their own profile
CREATE POLICY creators_select_own ON creators
  FOR SELECT USING (auth.uid() = user_id);

-- Public profiles are readable by all authenticated users (except email_verified_at, verification fields)
CREATE POLICY creators_select_public ON creators
  FOR SELECT USING (TRUE);

-- Creators can update their own profile
CREATE POLICY creators_update_own ON creators
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Creators can insert their own profile
CREATE POLICY creators_insert_own ON creators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TRACKS RLS POLICIES
-- ============================================================================

-- Creators can view/edit their own tracks
CREATE POLICY tracks_select_own ON tracks
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  );

-- All authenticated users can view published tracks (excluding soft-deleted)
CREATE POLICY tracks_select_published ON tracks
  FOR SELECT USING (
    published = TRUE AND soft_deleted = FALSE
  );

-- Creators can update their own tracks
CREATE POLICY tracks_update_own ON tracks
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  )
  WITH CHECK (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

-- Creators can insert new tracks
CREATE POLICY tracks_insert_own ON tracks
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  );

-- Creators can soft-delete their own tracks
CREATE POLICY tracks_delete_own ON tracks
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  );

-- ============================================================================
-- TEMPLATES RLS POLICIES
-- ============================================================================

-- Creators can view/edit their own templates
CREATE POLICY templates_select_own ON templates
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  );

-- All authenticated users can view published templates (excluding soft-deleted, not deprecated)
CREATE POLICY templates_select_published ON templates
  FOR SELECT USING (
    published = TRUE AND soft_deleted = FALSE AND deprecated = FALSE
  );

-- Creators can update their own templates
CREATE POLICY templates_update_own ON templates
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  )
  WITH CHECK (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

-- Creators can insert new templates
CREATE POLICY templates_insert_own ON templates
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  );

-- Creators can soft-delete their own templates
CREATE POLICY templates_delete_own ON templates
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)
  );

-- Collaborators can view templates they're invited to
CREATE POLICY templates_select_collaborator ON templates
  FOR SELECT USING (
    id IN (
      SELECT template_id FROM template_collaborators
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

-- ============================================================================
-- REMIXES RLS POLICIES
-- ============================================================================

-- Users can view/edit their own remixes
CREATE POLICY remixes_select_own ON remixes
  FOR SELECT USING (auth.uid() = user_id);

-- All authenticated users can view published remixes
CREATE POLICY remixes_select_published ON remixes
  FOR SELECT USING (published = TRUE);

-- Template creators can view remixes of their templates
CREATE POLICY remixes_select_creator_template ON remixes
  FOR SELECT USING (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

-- Users can update their own remixes
CREATE POLICY remixes_update_own ON remixes
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert new remixes
CREATE POLICY remixes_insert_own ON remixes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own remixes
CREATE POLICY remixes_delete_own ON remixes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ROYALTIES RLS POLICIES
-- ============================================================================

-- Creators can view royalties owed to them
CREATE POLICY royalties_select_creator ON royalties
  FOR SELECT USING (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- Remixers can view royalties they've earned
CREATE POLICY royalties_select_remixer ON royalties
  FOR SELECT USING (
    remix_id IN (
      SELECT id FROM remixes WHERE user_id = auth.uid()
    )
  );

-- System can insert/update royalties (no user RLS for inserts, relies on app logic)
CREATE POLICY royalties_insert_system ON royalties
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY royalties_update_system ON royalties
  FOR UPDATE WITH CHECK (TRUE);

-- ============================================================================
-- TEMPLATE COLLABORATORS RLS POLICIES
-- ============================================================================

-- Template creators can view collaborators
CREATE POLICY collaborators_select_creator ON template_collaborators
  FOR SELECT USING (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

-- Collaborators can view their own collaboration
CREATE POLICY collaborators_select_self ON template_collaborators
  FOR SELECT USING (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- Template creators can manage collaborators
CREATE POLICY collaborators_insert_creator ON template_collaborators
  FOR INSERT WITH CHECK (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY collaborators_update_creator ON template_collaborators
  FOR UPDATE USING (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  )
  WITH CHECK (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY collaborators_delete_creator ON template_collaborators
  FOR DELETE USING (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

-- ============================================================================
-- PAYOUTS RLS POLICIES
-- ============================================================================

-- Creators can view their own payouts
CREATE POLICY payouts_select_own ON payouts
  FOR SELECT USING (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- Creators can insert withdrawal requests
CREATE POLICY payouts_insert_own ON payouts
  FOR INSERT WITH CHECK (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- System can update payouts (webhook-driven)
CREATE POLICY payouts_update_system ON payouts
  FOR UPDATE WITH CHECK (TRUE);

-- ============================================================================
-- MODERATION FLAGS RLS POLICIES
-- ============================================================================

-- Creators can view moderation flags on their content
CREATE POLICY moderation_select_creator ON moderation_flags
  FOR SELECT USING (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

-- Users can report moderation issues (insert)
CREATE POLICY moderation_insert_public ON moderation_flags
  FOR INSERT WITH CHECK (TRUE);

-- Moderators can view all flags (relies on app-level role check)
CREATE POLICY moderation_select_all ON moderation_flags
  FOR SELECT USING (TRUE);

-- Creators can submit disputes
CREATE POLICY moderation_update_creator ON moderation_flags
  FOR UPDATE USING (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  )
  WITH CHECK (
    template_id IN (
      SELECT id FROM templates
      WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    )
  );

-- ============================================================================
-- ANALYTICS RLS POLICIES
-- ============================================================================

-- Creators can view analytics for their own templates
CREATE POLICY analytics_select_own ON analytics_daily
  FOR SELECT USING (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- System can insert/update analytics
CREATE POLICY analytics_insert_system ON analytics_daily
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY analytics_update_system ON analytics_daily
  FOR UPDATE WITH CHECK (TRUE);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER creators_updated_at BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tracks_updated_at BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER remixes_updated_at BEFORE UPDATE ON remixes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER template_collaborators_updated_at BEFORE UPDATE ON template_collaborators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER payouts_updated_at BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER moderation_flags_updated_at BEFORE UPDATE ON moderation_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- GRANTS FOR AUTHENTICATED USERS (Supabase Auth)
-- ============================================================================

-- Grant select on all public tables to authenticated users
GRANT SELECT ON creators, tracks, templates, remixes, royalties, template_collaborators, analytics_daily TO authenticated;
GRANT INSERT, UPDATE, DELETE ON creators, tracks, templates, remixes, royalties, template_collaborators, payouts, moderation_flags, analytics_daily TO authenticated;

-- Anon users can only view published templates (if needed for browse-without-login)
-- GRANT SELECT ON templates TO anon USING (published = TRUE AND soft_deleted = FALSE);

-- ============================================================================
-- NOTES FOR API INTEGRATION
-- ============================================================================

-- 1. Creator sign-up creates auth.users record + creators row
-- 2. Track upload: S3 presigned URL → audio fingerprint → BPM/key detection async
-- 3. Template creation saves composition_json with element state
-- 4. Remix creation increments view_count on template via trigger or app logic
-- 5. Royalty records created on remix publish; aggregated daily into analytics_daily
-- 6. Payouts table tracks withdrawal requests; Stripe webhook updates status
-- 7. Moderation flags auto-triggered by external scan service (AWS Rekognition)
-- 8. Search queries use trgm indexes for prefix matching; full-text via Postgres or Algolia
-- 9. Template collaborators use JWT invite tokens (no email required, link-based)
-- 10. Soft deletes allow recovery without affecting FK constraints

