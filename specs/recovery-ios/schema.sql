-- Recovery iOS — Supabase Schema Migration
-- Athlete rehab tracking: profiles, injuries, protocols, daily check-ins, alerts, push subscriptions
-- RLS: Athletes see own data; coaches see assigned athletes

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

CREATE TYPE alert_type AS ENUM (
  'pain_spike',
  'rom_regression',
  'missed_checkin',
  'low_adherence'
);

CREATE TYPE alert_severity AS ENUM (
  'info',
  'warning',
  'critical'
);

CREATE TYPE injury_status AS ENUM (
  'active',
  'completed',
  'reinjured',
  'paused'
);

CREATE TYPE device_platform AS ENUM (
  'ios',
  'android'
);

-- ============================================================================
-- 2. ATHLETE PROFILE TABLE
-- ============================================================================

CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  date_of_birth DATE,
  sport VARCHAR(100),
  position VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_athlete_profiles_user_id ON athlete_profiles(user_id);
CREATE INDEX idx_athlete_profiles_team_id ON athlete_profiles(team_id);
CREATE INDEX idx_athlete_profiles_created_at ON athlete_profiles(created_at DESC);

-- ============================================================================
-- 3. INJURY TABLE
-- ============================================================================

CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  icd10_code VARCHAR(10) NOT NULL,
  diagnosis TEXT NOT NULL,
  onset_date DATE NOT NULL,
  severity INT CHECK (severity >= 1 AND severity <= 5),
  location VARCHAR(100),
  status injury_status DEFAULT 'active',
  closed_date DATE,
  baseline_pain INT CHECK (baseline_pain >= 0 AND baseline_pain <= 10),
  baseline_rom INT CHECK (baseline_rom >= 0 AND baseline_rom <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_injuries_athlete_id ON injuries(athlete_id);
CREATE INDEX idx_injuries_icd10_code ON injuries(icd10_code);
CREATE INDEX idx_injuries_status ON injuries(status);
CREATE INDEX idx_injuries_created_at ON injuries(created_at DESC);
CREATE INDEX idx_injuries_onset_date ON injuries(onset_date);

-- Full-text search index on diagnosis
CREATE INDEX idx_injuries_diagnosis_fts ON injuries USING GIN (
  to_tsvector('english', diagnosis)
);

-- ============================================================================
-- 4. REHAB PROTOCOL TABLE
-- ============================================================================

CREATE TABLE rehab_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  injury_id UUID NOT NULL REFERENCES injuries(id) ON DELETE CASCADE UNIQUE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  estimated_duration_days INT NOT NULL,
  exercises JSONB DEFAULT '[]',
  adherence_target INT CHECK (adherence_target >= 0 AND adherence_target <= 100),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_rehab_protocols_injury_id ON rehab_protocols(injury_id);
CREATE INDEX idx_rehab_protocols_provider_id ON rehab_protocols(provider_id);
CREATE INDEX idx_rehab_protocols_created_at ON rehab_protocols(created_at DESC);

-- ============================================================================
-- 5. DAILY CHECKIN TABLE
-- ============================================================================

CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  injury_id UUID NOT NULL REFERENCES injuries(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  pain_score INT CHECK (pain_score >= 0 AND pain_score <= 10),
  range_of_motion INT CHECK (range_of_motion >= 0 AND range_of_motion <= 100),
  exercises_completed INT DEFAULT 0,
  exercises_total INT DEFAULT 0,
  notes TEXT,
  photo_url TEXT,
  synced BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_daily_checkins_athlete_id ON daily_checkins(athlete_id);
CREATE INDEX idx_daily_checkins_injury_id ON daily_checkins(injury_id);
CREATE INDEX idx_daily_checkins_check_in_date ON daily_checkins(check_in_date DESC);
CREATE INDEX idx_daily_checkins_created_at ON daily_checkins(created_at DESC);

-- Composite index for querying check-ins by athlete + date range
CREATE INDEX idx_daily_checkins_athlete_date ON daily_checkins(athlete_id, check_in_date DESC);

-- Full-text search index on notes
CREATE INDEX idx_daily_checkins_notes_fts ON daily_checkins USING GIN (
  to_tsvector('english', notes)
);

-- ============================================================================
-- 6. ALERT TABLE
-- ============================================================================

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  injury_id UUID NOT NULL REFERENCES injuries(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  severity alert_severity DEFAULT 'warning',
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  coach_notified BOOLEAN DEFAULT false,
  coach_response TEXT,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_alerts_athlete_id ON alerts(athlete_id);
CREATE INDEX idx_alerts_injury_id ON alerts(injury_id);
CREATE INDEX idx_alerts_alert_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_triggered_at ON alerts(triggered_at DESC);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

-- Composite index for querying unacknowledged alerts
CREATE INDEX idx_alerts_unacknowledged ON alerts(athlete_id, acknowledged_at)
WHERE acknowledged_at IS NULL;

-- ============================================================================
-- 7. PUSH SUBSCRIPTION TABLE
-- ============================================================================

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token TEXT NOT NULL,
  platform device_platform NOT NULL,
  device_info JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_device_token ON push_subscriptions(device_token);
CREATE INDEX idx_push_subscriptions_platform ON push_subscriptions(platform);
CREATE INDEX idx_push_subscriptions_enabled ON push_subscriptions(enabled);
CREATE INDEX idx_push_subscriptions_created_at ON push_subscriptions(created_at DESC);

-- Unique constraint: one device_token per user per platform
CREATE UNIQUE INDEX idx_push_subscriptions_user_platform ON push_subscriptions(user_id, device_token);

-- ============================================================================
-- 8. NOTIFICATION PREFERENCES TABLE (optional, for future)
-- ============================================================================

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  check_in_time TIME DEFAULT '08:00:00',
  check_in_enabled BOOLEAN DEFAULT true,
  alert_enabled BOOLEAN DEFAULT true,
  message_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9.1 ATHLETE PROFILES RLS
-- ============================================================================

-- Athletes can view their own profile
CREATE POLICY "athletes_view_own_profile" ON athlete_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Athletes can update their own profile
CREATE POLICY "athletes_update_own_profile" ON athlete_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Coaches can view profiles of athletes on their team
CREATE POLICY "coaches_view_team_athletes" ON athlete_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = athlete_profiles.team_id
        AND teams.coach_id = auth.uid()
    )
  );

-- ============================================================================
-- 9.2 INJURIES RLS
-- ============================================================================

-- Athletes can view their own injuries
CREATE POLICY "athletes_view_own_injuries" ON injuries
  FOR SELECT USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
  );

-- Athletes can insert their own injuries
CREATE POLICY "athletes_insert_own_injuries" ON injuries
  FOR INSERT WITH CHECK (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
  );

-- Athletes can update their own injuries
CREATE POLICY "athletes_update_own_injuries" ON injuries
  FOR UPDATE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
  );

-- Coaches can view injuries of assigned athletes
CREATE POLICY "coaches_view_team_injuries" ON injuries
  FOR SELECT USING (
    athlete_id IN (
      SELECT ap.id FROM athlete_profiles ap
      JOIN teams t ON ap.team_id = t.id
      WHERE t.coach_id = auth.uid()
    )
  );

-- Coaches can update injuries of assigned athletes
CREATE POLICY "coaches_update_team_injuries" ON injuries
  FOR UPDATE USING (
    athlete_id IN (
      SELECT ap.id FROM athlete_profiles ap
      JOIN teams t ON ap.team_id = t.id
      WHERE t.coach_id = auth.uid()
    )
  );

-- ============================================================================
-- 9.3 REHAB PROTOCOLS RLS
-- ============================================================================

-- Athletes can view protocols for their injuries
CREATE POLICY "athletes_view_own_protocols" ON rehab_protocols
  FOR SELECT USING (
    injury_id IN (
      SELECT id FROM injuries
      WHERE athlete_id IN (
        SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Coaches (providers) can view and update their protocols
CREATE POLICY "providers_view_own_protocols" ON rehab_protocols
  FOR SELECT USING (provider_id = auth.uid());

CREATE POLICY "providers_update_own_protocols" ON rehab_protocols
  FOR UPDATE USING (provider_id = auth.uid());

-- Coaches can insert protocols for their athletes' injuries
CREATE POLICY "coaches_insert_protocols" ON rehab_protocols
  FOR INSERT WITH CHECK (
    provider_id = auth.uid()
    AND injury_id IN (
      SELECT id FROM injuries
      WHERE athlete_id IN (
        SELECT ap.id FROM athlete_profiles ap
        JOIN teams t ON ap.team_id = t.id
        WHERE t.coach_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 9.4 DAILY CHECKINS RLS
-- ============================================================================

-- Athletes can view their own check-ins
CREATE POLICY "athletes_view_own_checkins" ON daily_checkins
  FOR SELECT USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
  );

-- Athletes can insert their own check-ins
CREATE POLICY "athletes_insert_own_checkins" ON daily_checkins
  FOR INSERT WITH CHECK (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
  );

-- Athletes can update their own check-ins (within 24 hours)
CREATE POLICY "athletes_update_own_checkins" ON daily_checkins
  FOR UPDATE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
    AND created_at > now() - INTERVAL '24 hours'
  );

-- Coaches can view check-ins for their team's athletes
CREATE POLICY "coaches_view_team_checkins" ON daily_checkins
  FOR SELECT USING (
    athlete_id IN (
      SELECT ap.id FROM athlete_profiles ap
      JOIN teams t ON ap.team_id = t.id
      WHERE t.coach_id = auth.uid()
    )
  );

-- ============================================================================
-- 9.5 ALERTS RLS
-- ============================================================================

-- Athletes can view their own alerts
CREATE POLICY "athletes_view_own_alerts" ON alerts
  FOR SELECT USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
  );

-- Athletes can acknowledge their own alerts
CREATE POLICY "athletes_acknowledge_own_alerts" ON alerts
  FOR UPDATE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
    )
  );

-- Coaches can view alerts for their team's athletes
CREATE POLICY "coaches_view_team_alerts" ON alerts
  FOR SELECT USING (
    athlete_id IN (
      SELECT ap.id FROM athlete_profiles ap
      JOIN teams t ON ap.team_id = t.id
      WHERE t.coach_id = auth.uid()
    )
  );

-- Coaches can respond to alerts
CREATE POLICY "coaches_respond_to_alerts" ON alerts
  FOR UPDATE USING (
    athlete_id IN (
      SELECT ap.id FROM athlete_profiles ap
      JOIN teams t ON ap.team_id = t.id
      WHERE t.coach_id = auth.uid()
    )
  );

-- System service account can insert alerts (via DB trigger or API)
CREATE POLICY "system_insert_alerts" ON alerts
  FOR INSERT WITH CHECK (
    -- This policy allows inserts from authenticated users (coaches/system)
    -- In production, restrict to a specific service role
    auth.uid() IS NOT NULL
  );

-- ============================================================================
-- 9.6 PUSH SUBSCRIPTIONS RLS
-- ============================================================================

-- Users can view their own push subscriptions
CREATE POLICY "users_view_own_subscriptions" ON push_subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own subscriptions
CREATE POLICY "users_insert_own_subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own subscriptions
CREATE POLICY "users_update_own_subscriptions" ON push_subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own subscriptions
CREATE POLICY "users_delete_own_subscriptions" ON push_subscriptions
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- 9.7 NOTIFICATION PREFERENCES RLS
-- ============================================================================

-- Users can view their own preferences
CREATE POLICY "users_view_own_prefs" ON notification_preferences
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "users_insert_own_prefs" ON notification_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "users_update_own_prefs" ON notification_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- 10. HELPER FUNCTIONS
-- ============================================================================

-- Function: Check if user is a coach (optional, for future use)
CREATE OR REPLACE FUNCTION is_coach(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams WHERE coach_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if coach manages athlete
CREATE OR REPLACE FUNCTION coach_manages_athlete(coach_id UUID, athlete_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM athlete_profiles ap
    JOIN teams t ON ap.team_id = t.id
    WHERE ap.id = athlete_id AND t.coach_id = coach_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get athlete compliance percentage for injury
CREATE OR REPLACE FUNCTION athlete_compliance_percentage(injury_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_exercises INT;
  completed_exercises INT;
BEGIN
  SELECT
    COALESCE(SUM(exercises_total), 0),
    COALESCE(SUM(exercises_completed), 0)
  INTO total_exercises, completed_exercises
  FROM daily_checkins
  WHERE daily_checkins.injury_id = athlete_compliance_percentage.injury_id;

  IF total_exercises = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((completed_exercises::NUMERIC / total_exercises) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Function: Trigger alerts on pain spike
CREATE OR REPLACE FUNCTION check_pain_spike()
RETURNS TRIGGER AS $$
DECLARE
  baseline_pain INT;
  previous_pain INT;
BEGIN
  SELECT baseline_pain INTO baseline_pain
  FROM injuries WHERE id = NEW.injury_id;

  SELECT pain_score INTO previous_pain
  FROM daily_checkins
  WHERE injury_id = NEW.injury_id
    AND check_in_date < NEW.check_in_date
  ORDER BY check_in_date DESC
  LIMIT 1;

  -- Alert if pain spike >= 4 points from baseline or previous
  IF baseline_pain IS NOT NULL AND NEW.pain_score >= (baseline_pain + 4) THEN
    INSERT INTO alerts (athlete_id, injury_id, alert_type, severity, message, data)
    VALUES (
      NEW.athlete_id,
      NEW.injury_id,
      'pain_spike',
      'critical',
      'Pain spike detected. Current pain: ' || NEW.pain_score || '/10',
      jsonb_build_object(
        'baseline_pain', baseline_pain,
        'current_pain', NEW.pain_score,
        'check_in_id', NEW.id
      )
    );
  ELSIF previous_pain IS NOT NULL AND NEW.pain_score >= (previous_pain + 4) THEN
    INSERT INTO alerts (athlete_id, injury_id, alert_type, severity, message, data)
    VALUES (
      NEW.athlete_id,
      NEW.injury_id,
      'pain_spike',
      'warning',
      'Pain increase detected. Current pain: ' || NEW.pain_score || '/10',
      jsonb_build_object(
        'previous_pain', previous_pain,
        'current_pain', NEW.pain_score,
        'check_in_id', NEW.id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Call check_pain_spike on daily_checkins insert/update
CREATE TRIGGER trigger_pain_spike
AFTER INSERT OR UPDATE ON daily_checkins
FOR EACH ROW
EXECUTE FUNCTION check_pain_spike();

-- Function: Trigger alerts on ROM regression
CREATE OR REPLACE FUNCTION check_rom_regression()
RETURNS TRIGGER AS $$
DECLARE
  previous_rom INT;
BEGIN
  SELECT range_of_motion INTO previous_rom
  FROM daily_checkins
  WHERE injury_id = NEW.injury_id
    AND check_in_date < NEW.check_in_date
  ORDER BY check_in_date DESC
  LIMIT 1;

  -- Alert if ROM regression >= 10% from previous day
  IF previous_rom IS NOT NULL
     AND NEW.range_of_motion < (previous_rom * 0.9)
     AND NEW.range_of_motion IS NOT NULL THEN
    INSERT INTO alerts (athlete_id, injury_id, alert_type, severity, message, data)
    VALUES (
      NEW.athlete_id,
      NEW.injury_id,
      'rom_regression',
      'warning',
      'Range of motion regression detected. Current ROM: ' || NEW.range_of_motion || '%',
      jsonb_build_object(
        'previous_rom', previous_rom,
        'current_rom', NEW.range_of_motion,
        'regression_percent', ROUND((1 - (NEW.range_of_motion::NUMERIC / previous_rom)) * 100, 2),
        'check_in_id', NEW.id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Call check_rom_regression on daily_checkins insert/update
CREATE TRIGGER trigger_rom_regression
AFTER INSERT OR UPDATE ON daily_checkins
FOR EACH ROW
EXECUTE FUNCTION check_rom_regression();

-- Function: Trigger alerts on low adherence
CREATE OR REPLACE FUNCTION check_low_adherence()
RETURNS TRIGGER AS $$
DECLARE
  adherence_pct NUMERIC;
  target_adherence INT;
BEGIN
  SELECT adherence_target INTO target_adherence
  FROM rehab_protocols
  WHERE injury_id = NEW.injury_id;

  IF NEW.exercises_total > 0 THEN
    adherence_pct := (NEW.exercises_completed::NUMERIC / NEW.exercises_total) * 100;

    IF target_adherence IS NULL THEN
      target_adherence := 80;
    END IF;

    -- Alert if adherence < 50% (MVP rule: low_adherence)
    IF adherence_pct < 50 THEN
      INSERT INTO alerts (athlete_id, injury_id, alert_type, severity, message, data)
      VALUES (
        NEW.athlete_id,
        NEW.injury_id,
        'low_adherence',
        'warning',
        'Low exercise adherence: ' || ROUND(adherence_pct, 0) || '%',
        jsonb_build_object(
          'exercises_completed', NEW.exercises_completed,
          'exercises_total', NEW.exercises_total,
          'adherence_pct', ROUND(adherence_pct, 2),
          'check_in_id', NEW.id
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Call check_low_adherence on daily_checkins insert/update
CREATE TRIGGER trigger_low_adherence
AFTER INSERT OR UPDATE ON daily_checkins
FOR EACH ROW
EXECUTE FUNCTION check_low_adherence();

-- ============================================================================
-- 11. MIGRATIONS NOTES
-- ============================================================================
--
-- This schema assumes:
-- 1. `auth.users` table exists (Supabase Auth)
-- 2. `teams` table exists (from Wave 1 setup) with coach_id FK
--
-- To apply this migration in Supabase:
--   1. Go to SQL Editor
--   2. Create a new query
--   3. Paste this entire file
--   4. Click "Run"
--
-- To rollback (WARNING: destroys data):
--   1. Run the rollback script (schema-rollback.sql)
--
-- ============================================================================
