-- RESONANCE PostgreSQL Schema
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  voice_fingerprint BYTEA,
  apple_healthkit_token TEXT,
  google_fit_token TEXT,
  subscription_status VARCHAR(50) DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_subscription_status (subscription_status)
);

-- Apps table
CREATE TABLE apps (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  read_aloud_rate DECIMAL(3, 2) DEFAULT 0.95,
  theme VARCHAR(20) DEFAULT 'light',
  accent_color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table
CREATE TABLE tracks (
  id VARCHAR(100) PRIMARY KEY,
  app_id VARCHAR(100) NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_app_id (app_id)
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id VARCHAR(100) NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  track_id VARCHAR(100) NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  lesson_index INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  affirmation TEXT,
  strength VARCHAR(255),
  audio_url TEXT,
  audio_emotional_tone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_app_id (app_id),
  INDEX idx_track_id (track_id),
  UNIQUE (app_id, track_id, lesson_index)
);

-- Progress table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id VARCHAR(100) NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  track_id VARCHAR(100) NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  lesson_index INT NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  time_spent INT,
  emotional_rating INT,
  streak_days INT DEFAULT 0,
  last_completed_day DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_app_id (app_id),
  INDEX idx_completed_at (completed_at),
  UNIQUE (user_id, app_id, track_id, lesson_index)
);

-- Biometrics table
CREATE TABLE biometrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  heart_rate INT,
  hrv INT,
  breathing_rate INT,
  stress_level INT,
  emotional_state VARCHAR(50),
  source VARCHAR(50),
  detected_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_detected_at (detected_at)
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL,
  app_id VARCHAR(100) REFERENCES apps(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_timestamp (timestamp)
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  tier VARCHAR(50),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  renews_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Voice commands table
CREATE TABLE voice_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  intent VARCHAR(50),
  confidence DECIMAL(3, 2),
  emotional_tone VARCHAR(50),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_intent (intent)
);

-- Create indexes for common queries
CREATE INDEX idx_progress_user_app ON progress(user_id, app_id);
CREATE INDEX idx_progress_streak ON progress(user_id, streak_days DESC);
CREATE INDEX idx_biometrics_user_time ON biometrics(user_id, detected_at DESC);
CREATE INDEX idx_chat_session_time ON chat_messages(session_id, timestamp DESC);
