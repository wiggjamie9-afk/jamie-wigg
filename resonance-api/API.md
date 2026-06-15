# RESONANCE API Documentation

**Base URL:** `https://api.resonance.local` (or `http://localhost:3000` in development)

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://api.resonance.local/api/v1/me
```

### POST `/api/v1/auth/signup`

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure-password",
  "displayName": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "subscriptionStatus": "free"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### POST `/api/v1/auth/login`

Authenticate with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response:** `200 OK`
```json
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### POST `/api/v1/auth/voice-verify`

Authenticate using voice biometric.

**Request:**
```
Content-Type: audio/wav
[WAV audio data]
```

**Response:** `200 OK`
```json
{
  "verified": true,
  "user": { ... },
  "accessToken": "..."
}
```

---

## Apps & Lessons

### GET `/api/v1/apps`

Fetch all 17 apps with basic metadata.

**Response:**
```json
{
  "apps": [
    {
      "id": "bright-brains",
      "name": "Bright Brains",
      "description": "For kids with learning differences",
      "tracks": 4,
      "lessonsTotal": 20,
      "theme": "light",
      "accentColor": "#FF6B6B"
    },
    ...
  ]
}
```

### GET `/api/v1/apps/:appId`

Get full app data including all lessons.

**Response:**
```json
{
  "id": "bright-brains",
  "name": "Bright Brains",
  "description": "...",
  "tracks": [
    {
      "id": "reading",
      "name": "Reading",
      "lessons": [
        {
          "id": "lesson_1",
          "appId": "bright-brains",
          "trackId": "reading",
          "index": 0,
          "title": "Understanding Your Brain",
          "body": ["paragraph 1", "paragraph 2", ...],
          "affirmation": "I am capable of learning.",
          "strength": "Resilience"
        },
        ...
      ]
    },
    ...
  ]
}
```

### GET `/api/v1/apps/:appId/track/:trackId/lessons`

Get 5 lessons for a specific track (paginated).

**Query Params:**
- `page` (optional, default: 1)

**Response:**
```json
{
  "track": "reading",
  "lessons": [...],
  "totalCount": 5,
  "page": 1
}
```

---

## Progress & Streaks

### GET `/api/v1/progress`

Get user's overall progress across all apps.

**Response:** `200 OK`
```json
{
  "totalLessonsCompleted": 42,
  "currentStreak": 7,
  "longestStreak": 15,
  "lastCompletedDay": "2026-06-15T20:30:00Z",
  "appsProgress": [
    {
      "appId": "bright-brains",
      "lessonsCompleted": 12,
      "streakDays": 5,
      "tracksCompleted": {
        "reading": 5,
        "numbers": 3,
        "focus": 4,
        "mixed": 0
      }
    }
  ]
}
```

### POST `/api/v1/progress/complete`

Mark a lesson as completed.

**Request:**
```json
{
  "appId": "bright-brains",
  "trackId": "reading",
  "lessonIndex": 2,
  "timeSpent": 300,
  "emotionalRating": 4
}
```

**Response:** `201 Created`
```json
{
  "progressId": "progress_123",
  "appId": "bright-brains",
  "trackId": "reading",
  "lessonIndex": 2,
  "completedAt": "2026-06-15T20:45:00Z",
  "newStreakDays": 8,
  "celebration": {
    "type": "streak-milestone",
    "message": "🔥 7-day streak! You're building amazing habits!",
    "earnedCrystals": 25
  }
}
```

### GET `/api/v1/progress/:appId`

Get progress for a specific app.

**Response:**
```json
{
  "appId": "bright-brains",
  "lessonsCompleted": 12,
  "totalLessons": 20,
  "percentComplete": 60,
  "currentTrack": "reading",
  "currentLessonIndex": 3
}
```

---

## Biometrics & Health

### POST `/api/v1/biometrics`

Submit biometric data (from Apple Watch, Google Fit, or manual entry).

**Request:**
```json
{
  "heartRate": 72,
  "hrv": 45,
  "breathingRate": 16,
  "stressLevel": 32,
  "emotionalState": "calm",
  "source": "apple_health",
  "detectedAt": "2026-06-15T20:30:00Z"
}
```

**Response:** `201 Created`
```json
{
  "biometricId": "bio_123",
  "userId": "user_123",
  "recorded": true,
  "recommendation": "Your stress levels are low. Great time for a challenging lesson!"
}
```

### GET `/api/v1/biometrics/latest`

Get user's most recent biometric data.

**Response:**
```json
{
  "heartRate": 72,
  "hrv": 45,
  "breathingRate": 16,
  "stressLevel": 32,
  "emotionalState": "calm",
  "timestamp": "2026-06-15T20:30:00Z"
}
```

### WebSocket `/ws/biometrics`

Stream live biometric updates (Apple Watch real-time).

**Message (incoming):**
```json
{
  "type": "subscribe",
  "biometricTypes": ["heartRate", "hrv", "breathingRate"]
}
```

**Message (outgoing):**
```json
{
  "type": "biometric_update",
  "heartRate": 75,
  "timestamp": "2026-06-15T20:31:00Z"
}
```

---

## Chat & AI Companion

### POST `/api/v1/chat`

Send a message to the AI companion (Claude-powered).

**Request:**
```json
{
  "sessionId": "session_123",
  "message": "I'm feeling overwhelmed today",
  "appId": "mum-brain",
  "includeStreaming": true
}
```

**Response:** `200 OK` (or streaming if `includeStreaming: true`)
```json
{
  "sessionId": "session_123",
  "response": "I hear you. Parenting is incredibly demanding. Your nervous system is likely in overdrive. Let's do a simple breathing exercise...",
  "emotionalTone": "compassionate",
  "suggestions": [
    {
      "type": "breathing",
      "duration": 60,
      "instruction": "Try the 4-4-4 breathing: inhale for 4, hold for 4, exhale for 4"
    }
  ]
}
```

### WebSocket `/ws/chat`

Stream AI responses in real-time.

**Message (incoming):**
```json
{
  "type": "message",
  "content": "What should I do when I'm really angry?"
}
```

**Message (outgoing):**
```json
{
  "type": "chunk",
  "content": "Anger is a signal that something matters to you. Let's explore what's beneath..."
}
```

---

## Voice Commands

### POST `/api/v1/voice/command`

Send a transcribed voice command.

**Request:**
```json
{
  "transcript": "Start breathing exercise",
  "confidence": 0.95
}
```

**Response:**
```json
{
  "intent": "breathing",
  "action": "start",
  "parameters": {
    "durationSeconds": 60,
    "frequency": 432
  }
}
```

### WebSocket `/ws/voice-commands`

Stream voice transcription in real-time.

---

## Text-to-Speech

### POST `/api/v1/tts/generate`

Generate emotional speech from text.

**Request:**
```json
{
  "text": "You are doing an amazing job.",
  "voiceId": "voice_123",
  "emotionalTone": "compassionate",
  "language": "en-US"
}
```

**Response:**
```json
{
  "audioUrl": "https://resonance-audio.s3.amazonaws.com/cache/audio_123.mp3",
  "duration": 3.2,
  "cached": false
}
```

---

## Subscriptions & Payment

### POST `/api/v1/subscribe`

Create or upgrade a subscription.

**Request:**
```json
{
  "plan": "pro",
  "paymentMethodId": "pm_123"
}
```

**Response:**
```json
{
  "subscriptionId": "sub_123",
  "status": "active",
  "plan": "pro",
  "currentPeriodStart": "2026-06-15T00:00:00Z",
  "currentPeriodEnd": "2026-07-15T00:00:00Z",
  "nextBillingDate": "2026-07-15T00:00:00Z"
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "AUTH_FAILED",
  "timestamp": "2026-06-15T20:30:00Z"
}
```

**Common Status Codes:**
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `429` Rate Limited (100 req/min per user)
- `500` Internal Server Error

---

## Rate Limiting

All authenticated endpoints: **100 requests per minute per user**

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1686785400
```

---

## Pagination

Endpoints returning lists support pagination:

**Query Params:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 142,
    "totalPages": 8
  }
}
```
