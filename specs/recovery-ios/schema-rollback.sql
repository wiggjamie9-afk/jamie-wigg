-- Recovery iOS — Supabase Schema Rollback
-- WARNING: This script destroys all data in Recovery iOS tables.
-- Only run if you need to completely reset the schema.

-- ============================================================================
-- 1. DROP TRIGGERS (must drop before functions)
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_pain_spike ON daily_checkins;
DROP TRIGGER IF EXISTS trigger_rom_regression ON daily_checkins;
DROP TRIGGER IF EXISTS trigger_low_adherence ON daily_checkins;

-- ============================================================================
-- 2. DROP FUNCTIONS
-- ============================================================================

DROP FUNCTION IF EXISTS check_pain_spike();
DROP FUNCTION IF EXISTS check_rom_regression();
DROP FUNCTION IF EXISTS check_low_adherence();
DROP FUNCTION IF EXISTS athlete_compliance_percentage(injury_id UUID);
DROP FUNCTION IF EXISTS coach_manages_athlete(coach_id UUID, athlete_id UUID);
DROP FUNCTION IF EXISTS is_coach(user_id UUID);

-- ============================================================================
-- 3. DROP TABLES (in reverse dependency order)
-- ============================================================================

DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS push_subscriptions CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS daily_checkins CASCADE;
DROP TABLE IF EXISTS rehab_protocols CASCADE;
DROP TABLE IF EXISTS injuries CASCADE;
DROP TABLE IF EXISTS athlete_profiles CASCADE;

-- ============================================================================
-- 4. DROP ENUM TYPES
-- ============================================================================

DROP TYPE IF EXISTS device_platform;
DROP TYPE IF EXISTS injury_status;
DROP TYPE IF EXISTS alert_severity;
DROP TYPE IF EXISTS alert_type;

-- ============================================================================
-- Migration complete. Schema is now clean.
-- ============================================================================
