# Neural Twin Backend - API Testing Guide

**Purpose:** Quick reference for testing all 31 backend endpoints via curl  
**Audience:** Developers who want to verify backend without building mobile apps

---

## Prerequisites

- Backend running on `http://localhost:5000`
- `curl` installed (or Postman)
- Anthropic API key configured in `.env`

---

## Quick Test Script

Save this as `test-api.sh` and run `bash test-api.sh` to test all endpoints:

```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api"
TOKEN=""
USER_ID=""

echo "🧪 Testing Neural Twin API Endpoints..."
echo ""

# Test 1: Health Check
echo "📍 Health Check"
curl -s http://localhost:5000/health | jq . || echo "❌ Failed"
echo ""

# Test 2: Register
echo "📍 Auth: Register"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@neuraltwin.app",
    "password": "SecurePass123!",
    "name": "Test User"
  }')

echo $REGISTER_RESPONSE | jq .
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
USER_ID=$(echo $REGISTER_RESPONSE | jq -r '.user.id')
echo "Token: $TOKEN"
echo "User ID: $USER_ID"
echo ""

# Test 3: Login
echo "📍 Auth: Login"
curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@neuraltwin.app",
    "password": "SecurePass123!"
  }' | jq .
echo ""

# Test 4: Voice Upload
echo "📍 Voice: Upload"
curl -s -X POST $BASE_URL/voice \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "UklGRi4AAABXQVZFZm10IBAAAA...",
    "context": "morning motivation"
  }' | jq .
echo ""

# Test 5: Get Voice Recordings
echo "📍 Voice: List"
curl -s $BASE_URL/voice \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 6: Decision Logging
echo "📍 Decision: Log"
curl -s -X POST $BASE_URL/decisions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Career decision",
    "description": "Choosing between startup and corporate",
    "category": "professional",
    "planningClarity": 7,
    "strategyChosen": "Pro/con list",
    "monitoringComprehension": 8,
    "evaluationEffectiveness": 6,
    "reflectionInsights": "Both have merit"
  }' | jq .
echo ""

# Test 7: Get Decisions
echo "📍 Decision: List"
curl -s $BASE_URL/decisions \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 8: Twin Interaction
echo "📍 Twin: Chat"
curl -s -X POST $BASE_URL/twins/interaction \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "twinType": "coach",
    "userMessage": "I am feeling overwhelmed"
  }' | jq .
echo ""

# Test 9: Get Twins
echo "📍 Twin: List"
curl -s $BASE_URL/twins \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 10: Get Coherence
echo "📍 Coherence: Current"
curl -s $BASE_URL/coherence \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "✅ API tests complete!"
```

---

## Individual Endpoint Tests

### Authentication Endpoints

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "name": "Alice Johnson"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "clh1234567890abcdefghijk",
    "email": "alice@example.com",
    "name": "Alice Johnson"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response:**
```json
{
  "user": {"id": "...", "email": "alice@example.com", "name": "Alice Johnson"},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Voice Recording Endpoints

**Required:** Bearer token from login

#### 1. Upload Voice Recording
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/voice \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "data:audio/wav;base64,UklGRi4AAABXQVZFZm10IBAA...",
    "context": "expressing feelings about career",
    "location": "home office",
    "planningClarity": 6
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "recordingId": "voice_abc123",
  "primaryEmotion": "thoughtful",
  "emotionScores": {
    "happy": 0.3, "sad": 0.2, "angry": 0.1, "neutral": 0.15,
    "surprised": 0.05, "fearful": 0.1, "disgusted": 0.1
  },
  "acousticFeatures": {
    "pitch": 145.2, "speech_rate": 2.3, "jitter": 0.045,
    "prosody": {"intonation": 0.68, "rhythm": 0.72, "stress": 0.55}
  }
}
```

#### 2. Get Voice Recordings (List)
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:5000/api/voice \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "recordings": [
    {
      "id": "voice_abc123",
      "transcript": "I feel great today",
      "emotion": "happy",
      "emotionScore": 0.85,
      "context": "morning check-in",
      "createdAt": "2026-06-25T10:30:00Z"
    }
  ]
}
```

#### 3. Get Specific Voice Recording
```bash
TOKEN="your_jwt_token_here"
RECORDING_ID="voice_abc123"
curl http://localhost:5000/api/voice/$RECORDING_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### Decision Logging Endpoints

#### 1. Log Decision
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/decisions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Should I change jobs?",
    "description": "Current job offers stability but limited growth",
    "category": "professional",
    "planningClarity": 7,
    "strategyChosen": "Created decision matrix",
    "monitoringComprehension": 8,
    "evaluationEffectiveness": 7,
    "reflectionInsights": "Both paths have trade-offs"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "decisionId": "dec_xyz789",
  "metacognitiveScore": "0.73",
  "analysis": "Your decision shows strong metacognitive awareness...",
  "insights": {
    "planningClarity": 7,
    "monitoringComprehension": 8,
    "evaluationEffectiveness": 7,
    "hasReflection": true
  }
}
```

#### 2. Get Decisions (List)
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:5000/api/decisions \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Get Specific Decision
```bash
TOKEN="your_jwt_token_here"
DECISION_ID="dec_xyz789"
curl http://localhost:5000/api/decisions/$DECISION_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Get Decision Patterns
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:5000/api/decisions/patterns/analysis \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "patterns": {
    "totalDecisions": 5,
    "averageMetacognitiveScore": 0.71,
    "averageConfidence": 0.75,
    "categoryBreakdown": {"professional": 3, "personal": 2},
    "metacognitiveProgress": {
      "avgPlanning": "7.0",
      "avgMonitoring": "7.5",
      "avgEvaluating": "6.8",
      "avgReflecting": "7.2"
    }
  }
}
```

---

### Twin Interaction Endpoints

#### 1. Chat with Twin
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/twins/interaction \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "twinType": "coach",
    "userMessage": "I am feeling overwhelmed by too many choices"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "interactionId": "twin_int_123",
  "response": "I hear that you're feeling overwhelmed. Let's break this down...",
  "phase": "clarification"
}
```

#### 2. Get All Twins
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:5000/api/twins \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "twins": [
    {
      "type": "coach",
      "name": "Coach Twin",
      "emoji": "🎯",
      "subtitle": "Metacognitive guidance",
      "status": "online",
      "interactionCount": 12
    },
    {
      "type": "task",
      "name": "Task Twin",
      "emoji": "📋",
      "subtitle": "Productivity & workflows",
      "status": "online",
      "interactionCount": 23
    }
    // ... 7 more twins
  ]
}
```

#### 3. Get Twin Conversation History
```bash
TOKEN="your_jwt_token_here"
TWIN_TYPE="coach"
curl http://localhost:5000/api/twins/$TWIN_TYPE/history \
  -H "Authorization: Bearer $TOKEN"
```

---

### Coherence Endpoints

#### 1. Get Current Coherence
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:5000/api/coherence \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "coherenceState": "balanced",
  "overallCoherence": "0.73",
  "layers": [
    {
      "layer": 1,
      "name": "Heart-Brain Coherence",
      "value": "0.78",
      "description": "Synchronization between heart and brain"
    },
    {
      "layer": 2,
      "name": "Breath Coherence",
      "value": "0.72",
      "description": "Respiratory rhythm coherence"
    }
    // ... 6 more layers
  ],
  "recommendations": "Maintain meditation practice...",
  "timestamp": "2026-06-25T15:30:00Z"
}
```

#### 2. Get Coherence History
```bash
TOKEN="your_jwt_token_here"
curl "http://localhost:5000/api/coherence/history?timeframe=7d" \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Get Specific Coherence Metric
```bash
TOKEN="your_jwt_token_here"
METRIC_ID="coh_metric_456"
curl http://localhost:5000/api/coherence/$METRIC_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### Biometric Endpoints

#### 1. Log Biometric Data
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/biometrics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "heartRate": 72,
    "hrv": 45,
    "sleepDuration": 7.5,
    "sleepQuality": 8,
    "steps": 8432,
    "activeMinutes": 45
  }'
```

#### 2. Get Biometric Data
```bash
TOKEN="your_jwt_token_here"
curl "http://localhost:5000/api/biometrics?timeframe=24h" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Knowledge Endpoints

#### 1. Log Knowledge Entry
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/knowledge \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Decision Making",
    "insight": "The best decisions come from considering multiple perspectives",
    "source": "Psychology research",
    "applicability": ["personal", "professional"]
  }'
```

#### 2. Get Knowledge Base
```bash
TOKEN="your_jwt_token_here"
curl "http://localhost:5000/api/knowledge" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Accessibility Endpoints

#### 1. Scan Book
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/accessibility/scan-book \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "language": "en",
    "focusArea": "full"
  }'
```

#### 2. Get Accessibility Settings
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:5000/api/accessibility/settings \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Update Accessibility Settings
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/accessibility/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dyslexiaMode": true,
    "fontSize": 18,
    "highContrast": true
  }'
```

#### 4. Generate Text-to-Speech
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/accessibility/tts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The quick brown fox jumps over the lazy dog",
    "voiceId": "neural",
    "speed": 1.0
  }'
```

---

## Troubleshooting API Tests

### Issue: "Connection refused"
**Solution:** Backend not running. Run `npm run dev` in backend directory first.

### Issue: "401 Unauthorized"
**Solution:** Bearer token missing or invalid. Make sure to:
1. Get token from login/register response
2. Include `Authorization: Bearer $TOKEN` header
3. Token may have expired (24h expiration)

### Issue: "400 Bad Request"
**Solution:** Check request body format:
- Ensure JSON is valid (use `jq` to validate)
- Check all required fields are present
- Make sure field types match (int vs string)

### Issue: "500 Internal Server Error"
**Solution:** Backend error. Check:
- Backend logs for error details
- DATABASE_URL is correct and accessible
- ANTHROPIC_API_KEY is valid
- Prisma migrations ran successfully (`npx prisma migrate status`)

### Issue: "403 Forbidden"
**Solution:** Likely authentication middleware issue:
- Verify `JWT_SECRET` in `.env` is set correctly
- Check token hasn't expired
- Verify token structure is valid

---

## Batch Testing with Postman

Prefer Postman? Import this as a Postman collection:

```json
{
  "info": {
    "name": "Neural Twin API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"{{email}}\", \"password\": \"{{password}}\", \"name\": \"Test User\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"{{email}}\", \"password\": \"{{password}}\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:5000"},
    {"key": "email", "value": "test@example.com"},
    {"key": "password", "value": "SecurePass123!"}
  ]
}
```

---

## Performance Benchmarks

Target response times (p95):

| Endpoint | Expected | Notes |
|----------|----------|-------|
| Login | < 1s | Simple DB lookup |
| Register | < 1s | Password hashing, DB insert |
| Voice Upload | < 2s | Includes Claude API |
| Decision Log | < 2s | Includes Claude API |
| Twin Chat | < 3s | Long Claude API call |
| Get Coherence | < 500ms | Simple calculation |
| Get History | < 1s | Pagination applied |

---

## Success Checklist

After running tests, verify:

- [ ] Health check responds with `{"status":"ok"}`
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Receive valid JWT token
- [ ] Can use token in subsequent requests
- [ ] Voice upload works
- [ ] Decision logging works
- [ ] Twin chat returns response
- [ ] Coherence endpoint returns data
- [ ] All responses < 2s (except Twin chat)
- [ ] Error responses are helpful (not stack traces)

If all pass, backend is ready for mobile app testing! ✅

---

**Next:** Test with Android and iOS using PHASE2_VERIFICATION_CHECKLIST.md
