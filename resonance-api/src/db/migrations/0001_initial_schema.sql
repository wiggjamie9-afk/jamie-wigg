-- Initial RESONANCE schema migration
-- Users table
CREATE TABLE IF NOT EXISTS users (
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
  last_active_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  read_aloud_rate DECIMAL(3, 2) DEFAULT 0.95,
  theme VARCHAR(20) DEFAULT 'light',
  accent_color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id VARCHAR(100) PRIMARY KEY,
  app_id VARCHAR(100) NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tracks_app_id ON tracks(app_id);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
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
  UNIQUE(app_id, track_id, lesson_index)
);

CREATE INDEX IF NOT EXISTS idx_lessons_app_id ON lessons(app_id);
CREATE INDEX IF NOT EXISTS idx_lessons_track_id ON lessons(track_id);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
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
  UNIQUE(user_id, app_id, track_id, lesson_index)
);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_app_id ON progress(app_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed_at ON progress(completed_at);
CREATE INDEX IF NOT EXISTS idx_progress_user_app ON progress(user_id, app_id);
CREATE INDEX IF NOT EXISTS idx_progress_streak ON progress(user_id, streak_days DESC);

-- Biometrics table
CREATE TABLE IF NOT EXISTS biometrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  heart_rate INT,
  hrv INT,
  breathing_rate INT,
  stress_level INT,
  emotional_state VARCHAR(50),
  source VARCHAR(50),
  detected_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_biometrics_user_id ON biometrics(user_id);
CREATE INDEX IF NOT EXISTS idx_biometrics_detected_at ON biometrics(detected_at);
CREATE INDEX IF NOT EXISTS idx_biometrics_user_time ON biometrics(user_id, detected_at DESC);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL,
  app_id VARCHAR(100) REFERENCES apps(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_session_time ON chat_messages(session_id, timestamp DESC);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  tier VARCHAR(50),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  renews_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Voice commands table
CREATE TABLE IF NOT EXISTS voice_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  intent VARCHAR(50),
  confidence DECIMAL(3, 2),
  emotional_tone VARCHAR(50),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_commands_user_id ON voice_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_commands_intent ON voice_commands(intent);
