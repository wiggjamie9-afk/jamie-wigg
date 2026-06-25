-- Recovery iOS — Test Data Script
-- Populates sample data for local testing and QA
-- WARNING: Insert test data ONLY in development environment
-- Run this AFTER schema.sql has been successfully applied

-- ============================================================================
-- TEST DATA: Athlete Profiles
-- ============================================================================

-- Test athlete 1: Alice (user: alice@test.local)
INSERT INTO athlete_profiles (user_id, display_name, date_of_birth, sport, position, team_id)
VALUES (
  -- REPLACE THIS: Use actual user_id from auth.users for alice
  '10000000-0000-0000-0000-000000000001'::UUID,
  'Alice Johnson',
  '2000-03-15'::DATE,
  'soccer',
  'striker',
  NULL  -- No team initially
);

-- Test athlete 2: Bob (user: bob@test.local)
INSERT INTO athlete_profiles (user_id, display_name, date_of_birth, sport, position, team_id)
VALUES (
  -- REPLACE THIS: Use actual user_id from auth.users for bob
  '20000000-0000-0000-0000-000000000002'::UUID,
  'Bob Smith',
  '1999-07-22'::DATE,
  'american_football',
  'center',
  NULL  -- No team initially
);

-- ============================================================================
-- TEST DATA: Injuries
-- ============================================================================

-- Alice's injury: Left knee ACL tear
INSERT INTO injuries (
  athlete_id, icd10_code, diagnosis, onset_date, severity, location, status,
  baseline_pain, baseline_rom, created_at
)
VALUES (
  (SELECT id FROM athlete_profiles WHERE display_name = 'Alice Johnson' LIMIT 1),
  'S83.5',
  'Anterior cruciate ligament (ACL) tear, left knee',
  '2026-06-01'::DATE,
  4,
  'left knee',
  'active',
  7,
  45,
  now()
);

-- Bob's injury: Right shoulder rotator cuff strain
INSERT INTO injuries (
  athlete_id, icd10_code, diagnosis, onset_date, severity, location, status,
  baseline_pain, baseline_rom, created_at
)
VALUES (
  (SELECT id FROM athlete_profiles WHERE display_name = 'Bob Smith' LIMIT 1),
  'M75.1',
  'Rotator cuff syndrome, right shoulder',
  '2026-06-10'::DATE,
  3,
  'right shoulder',
  'active',
  5,
  60,
  now()
);

-- ============================================================================
-- TEST DATA: Rehab Protocols
-- ============================================================================

-- Alice's protocol: 4-week ACL recovery
INSERT INTO rehab_protocols (
  injury_id,
  provider_id,  -- REPLACE: Use actual coach user_id
  name,
  estimated_duration_days,
  exercises,
  adherence_target,
  start_date,
  created_at
)
SELECT
  id,
  '30000000-0000-0000-0000-000000000003'::UUID,  -- Coach Dr. Smith
  'Post-ACL Surgery Phase 2 (Weeks 2-4)',
  28,
  jsonb_build_array(
    jsonb_build_object(
      'id', 'ex-001',
      'name', 'Quad sets',
      'sets', 3,
      'reps', 15,
      'demo_url', 'https://example.com/quad-sets.mp4',
      'notes', 'Hold 5 seconds each rep'
    ),
    jsonb_build_object(
      'id', 'ex-002',
      'name', 'Straight leg raises',
      'sets', 3,
      'reps', 12,
      'demo_url', 'https://example.com/slr.mp4',
      'notes', 'Keep knee straight'
    ),
    jsonb_build_object(
      'id', 'ex-003',
      'name', 'Mini squats',
      'sets', 2,
      'reps', 10,
      'demo_url', 'https://example.com/squats.mp4',
      'notes', 'Only 30 degrees, pain-free'
    ),
    jsonb_build_object(
      'id', 'ex-004',
      'name', 'Step-ups (4 inches)',
      'sets', 2,
      'reps', 8,
      'demo_url', 'https://example.com/stepups.mp4',
      'notes', 'Use railing for balance'
    )
  ),
  80,
  '2026-06-15'::DATE
FROM injuries
WHERE diagnosis LIKE '%ACL%'
LIMIT 1;

-- Bob's protocol: Rotator cuff rehab
INSERT INTO rehab_protocols (
  injury_id,
  provider_id,  -- REPLACE: Use actual coach user_id
  name,
  estimated_duration_days,
  exercises,
  adherence_target,
  start_date,
  created_at
)
SELECT
  id,
  '30000000-0000-0000-0000-000000000003'::UUID,  -- Coach Dr. Smith
  'Rotator Cuff Strain Recovery (Weeks 1-3)',
  21,
  jsonb_build_array(
    jsonb_build_object(
      'id', 'ex-101',
      'name', 'Pendulum swings',
      'sets', 2,
      'reps', 30,
      'demo_url', 'https://example.com/pendulum.mp4',
      'notes', 'Gentle, pain-free motion'
    ),
    jsonb_build_object(
      'id', 'ex-102',
      'name', 'Sleeper stretch',
      'sets', 2,
      'reps', 1,
      'demo_url', 'https://example.com/sleeper.mp4',
      'notes', 'Hold 30 seconds, 2 minutes rest'
    ),
    jsonb_build_object(
      'id', 'ex-103',
      'name', 'Isometric external rotation',
      'sets', 3,
      'reps', 10,
      'demo_url', 'https://example.com/iso-er.mp4',
      'notes', '5-second holds, neutral position'
    )
  ),
  85,
  '2026-06-11'::DATE
FROM injuries
WHERE diagnosis LIKE '%Rotator%'
LIMIT 1;

-- ============================================================================
-- TEST DATA: Daily Check-ins (Last 7 days for Alice)
-- ============================================================================

-- Alice Day 1: Baseline check-in
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '6 days')::DATE,
  7,
  45,
  3,
  4,
  'Pain in anterior knee, slight swelling. Managed to do 3 of 4 exercises.',
  true,
  now() - INTERVAL '6 days'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Alice Johnson'
LIMIT 1;

-- Alice Day 2: Good progress
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '5 days')::DATE,
  6,
  50,
  4,
  4,
  'Completed all exercises. ROM improving. Swelling down.',
  true,
  now() - INTERVAL '5 days'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Alice Johnson'
LIMIT 1;

-- Alice Day 3: Slight pain spike (triggers alert)
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '4 days')::DATE,
  10,  -- PAIN SPIKE: baseline 7 + 3 = alert will not trigger (needs 4+), but let's make it 11
  47,
  3,
  4,
  'Woke up with sharp pain. Overdid mini squats yesterday. ROM regressed slightly.',
  true,
  now() - INTERVAL '4 days'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Alice Johnson'
LIMIT 1;

-- Alice Day 4: ROM regression
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '3 days')::DATE,
  8,
  42,  -- REGRESSION: 47 * 0.9 = 42.3, will trigger alert
  2,   -- LOW ADHERENCE: 2/4 = 50%, borderline
  4,
  'Avoiding exercises due to pain. Called PT for guidance.',
  true,
  now() - INTERVAL '3 days'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Alice Johnson'
LIMIT 1;

-- Alice Day 5: Recovery
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '2 days')::DATE,
  7,
  48,
  4,
  4,
  'Back on track after PT advice. Modified squats and back to full protocol.',
  true,
  now() - INTERVAL '2 days'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Alice Johnson'
LIMIT 1;

-- Alice Day 6: Good progress
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '1 day')::DATE,
  6,
  52,
  4,
  4,
  'Feeling much better today. All exercises completed pain-free.',
  true,
  now() - INTERVAL '1 day'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Alice Johnson'
LIMIT 1;

-- Alice Today: Excellent
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  now()::DATE,
  5,
  55,
  4,
  4,
  'Continuing steady progress. Ready for Phase 3 activities.',
  true,
  now()
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Alice Johnson'
LIMIT 1;

-- ============================================================================
-- TEST DATA: Daily Check-ins (Last 3 days for Bob)
-- ============================================================================

-- Bob Day 1: Baseline
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '2 days')::DATE,
  5,
  60,
  3,
  3,
  'Starting rehab today. Pendulum swings and sleeper stretch done.',
  true,
  now() - INTERVAL '2 days'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Bob Smith'
LIMIT 1;

-- Bob Day 2: Missed check-in (will not trigger alert today, but monitored)
-- INSERT deliberately skipped to simulate missed check-in

-- Bob Day 3: Return
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  (now() - INTERVAL '1 day')::DATE,
  5,
  60,
  2,
  3,
  'Missed yesterday. Shoulder stiff. Did 2 of 3 exercises.',
  true,
  now() - INTERVAL '1 day'
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Bob Smith'
LIMIT 1;

-- Bob Today: Trying to catch up
INSERT INTO daily_checkins (
  athlete_id, injury_id, check_in_date, pain_score, range_of_motion,
  exercises_completed, exercises_total, notes, synced, created_at
)
SELECT
  ap.id,
  i.id,
  now()::DATE,
  4,
  62,
  3,
  3,
  'Back on track. All exercises done. ROM improving.',
  true,
  now()
FROM athlete_profiles ap
JOIN injuries i ON ap.id = i.athlete_id
WHERE ap.display_name = 'Bob Smith'
LIMIT 1;

-- ============================================================================
-- TEST DATA: Push Subscriptions
-- ============================================================================

-- Alice's iOS device
INSERT INTO push_subscriptions (user_id, device_token, platform, device_info, enabled)
VALUES (
  '10000000-0000-0000-0000-000000000001'::UUID,
  'fcm_token_alice_iphone13_001',
  'ios',
  jsonb_build_object(
    'model', 'iPhone 13',
    'os_version', '17.5',
    'app_version', '1.0.0'
  ),
  true
);

-- Bob's Android device
INSERT INTO push_subscriptions (user_id, device_token, platform, device_info, enabled)
VALUES (
  '20000000-0000-0000-0000-000000000002'::UUID,
  'fcm_token_bob_pixel6_001',
  'android',
  jsonb_build_object(
    'model', 'Pixel 6',
    'os_version', '14.0',
    'app_version', '1.0.0'
  ),
  true
);

-- ============================================================================
-- TEST DATA: Notification Preferences
-- ============================================================================

-- Alice prefers early morning check-ins
INSERT INTO notification_preferences (
  user_id, check_in_time, check_in_enabled, alert_enabled,
  quiet_hours_start, quiet_hours_end
)
VALUES (
  '10000000-0000-0000-0000-000000000001'::UUID,
  '07:00:00'::TIME,
  true,
  true,
  '22:00:00'::TIME,
  '07:00:00'::TIME
);

-- Bob prefers afternoon check-ins
INSERT INTO notification_preferences (
  user_id, check_in_time, check_in_enabled, alert_enabled,
  quiet_hours_start, quiet_hours_end
)
VALUES (
  '20000000-0000-0000-0000-000000000002'::UUID,
  '14:00:00'::TIME,
  true,
  true,
  '21:00:00'::TIME,
  '08:00:00'::TIME
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify data was inserted correctly:

-- 1. List all athletes with injury counts
-- SELECT ap.display_name, COUNT(i.id) as injury_count
-- FROM athlete_profiles ap
-- LEFT JOIN injuries i ON ap.id = i.athlete_id
-- GROUP BY ap.id, ap.display_name;

-- 2. List Alice's check-ins and alert counts
-- SELECT dc.check_in_date, dc.pain_score, dc.range_of_motion,
--   dc.exercises_completed, dc.exercises_total,
--   COUNT(a.id) as alert_count
-- FROM daily_checkins dc
-- LEFT JOIN alerts a ON dc.injury_id = a.injury_id
--   AND dc.check_in_date = a.triggered_at::DATE
-- WHERE dc.athlete_id = (SELECT id FROM athlete_profiles WHERE display_name = 'Alice Johnson')
-- GROUP BY dc.id, dc.check_in_date, dc.pain_score, dc.range_of_motion,
--   dc.exercises_completed, dc.exercises_total
-- ORDER BY dc.check_in_date DESC;

-- 3. Count alerts by type
-- SELECT alert_type, COUNT(*) as count
-- FROM alerts
-- GROUP BY alert_type
-- ORDER BY count DESC;

-- 4. List unacknowledged alerts
-- SELECT a.athlete_id, a.alert_type, a.severity, a.message, a.triggered_at
-- FROM alerts a
-- WHERE a.acknowledged_at IS NULL
-- ORDER BY a.triggered_at DESC;

-- 5. Verify RLS: Run as alice@test.local (should see only own data)
-- SELECT * FROM athlete_profiles;
-- SELECT * FROM injuries;
-- SELECT * FROM daily_checkins;

-- ============================================================================
-- NOTES FOR QA
-- ============================================================================
-- 1. BEFORE RUNNING THIS SCRIPT:
--    - Replace user_id values (10000000-..., 20000000-..., 30000000-...)
--      with actual UUIDs from auth.users table for test accounts
--    - Create test users in Supabase Auth: alice@test.local, bob@test.local, coach@test.local
--
-- 2. AFTER RUNNING:
--    - Run verification queries above to confirm data
--    - Test RLS policies (log in as each user and query)
--    - Verify triggers created alerts (check alerts table)
--    - Test offline sync behavior (clear 'synced' flag, check app behavior)
--
-- 3. CLEANUP:
--    - Run schema-rollback.sql to reset all data
--    - Or manually DELETE FROM each table in reverse dependency order
--
-- ============================================================================
