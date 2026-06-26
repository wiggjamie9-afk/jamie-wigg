# Neural Twin Phase 2 — Curl Command Reference

## Setup

```bash
export BASE_URL="http://localhost:5000"
export TEST_EMAIL="test-$(date +%s)@example.com"
export TEST_PASSWORD="SecurePass123!"
```

---

## 1. Health Check

```bash
curl -X GET "$BASE_URL/health" | jq .
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-26T12:34:56.789Z",
  "environment": "development"
}
```

---

## 2. Auth Endpoints

### Register
```bash
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"name\": \"Test User\",
    \"password\": \"$TEST_PASSWORD\"
  }" | jq .
```

**Save JWT Token:**
```bash
export JWT=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"name\": \"Test User\",
    \"password\": \"$TEST_PASSWORD\"
  }" | jq -r '.token')

echo "Token: $JWT"
```

### Login
```bash
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" | jq .
```

### Verify Token
```bash
curl -X POST "$BASE_URL/api/auth/verify" \
  -H "Authorization: Bearer $JWT" | jq .
```

### OAuth (Apple/Google) - Stub
```bash
curl -X POST "$BASE_URL/api/auth/oauth" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "apple",
    "idToken": "stub-token-here"
  }' | jq .
```

---

## 3. Voice Endpoints

### Upload Voice Recording
```bash
curl -X POST "$BASE_URL/api/voice" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==",
    "context": "Decision about work project",
    "location": "Office",
    "decisionTitle": "Choose project tech stack",
    "planningClarity": 8
  }' | jq .
```

**Save Recording ID:**
```bash
export RECORDING_ID=$(curl -s -X POST "$BASE_URL/api/voice" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==",
    "context": "test"
  }' | jq -r '.recordingId')

echo "Recording ID: $RECORDING_ID"
```

### List Voice Recordings
```bash
curl -X GET "$BASE_URL/api/voice" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Get Specific Recording
```bash
curl -X GET "$BASE_URL/api/voice/$RECORDING_ID" \
  -H "Authorization: Bearer $JWT" | jq .
```

---

## 4. Decision Endpoints

### Create Decision
```bash
curl -X POST "$BASE_URL/api/decisions" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Choose new job offer",
    "description": "Evaluating two job offers with different trade-offs",
    "options": {
      "option1": "Stay at current company",
      "option2": "Take new role at startup",
      "option3": "Freelance"
    },
    "chosenOption": "Take new role at startup",
    "reasoning": "Better growth potential and learning opportunities",
    "category": "career",
    "confidence": 0.8,
    "planningClarity": 9,
    "strategyChosen": "Pros-cons matrix with values alignment",
    "monitoringComprehension": 8,
    "evaluationEffectiveness": 7,
    "reflectionInsights": "Learned that I value growth over stability"
  }' | jq .
```

**Save Decision ID:**
```bash
export DECISION_ID=$(curl -s -X POST "$BASE_URL/api/decisions" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"test","description":"test","options":{"a":"opt1"},
    "chosenOption":"opt1","reasoning":"test","category":"general",
    "planningClarity":5,"monitoringComprehension":5,
    "evaluationEffectiveness":5,"reflectionInsights":"test"
  }' | jq -r '.decisionId')

echo "Decision ID: $DECISION_ID"
```

### List Decisions
```bash
curl -X GET "$BASE_URL/api/decisions" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Get Specific Decision
```bash
curl -X GET "$BASE_URL/api/decisions/$DECISION_ID" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Analyze Decision Patterns
```bash
curl -X GET "$BASE_URL/api/decisions/patterns/analysis" \
  -H "Authorization: Bearer $JWT" | jq .
```

---

## 5. Twins Endpoints

### Get All Twins
```bash
curl -X GET "$BASE_URL/api/twins" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Chat with Coach Twin
```bash
curl -X POST "$BASE_URL/api/twins/interaction" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "twinType": "coach",
    "userMessage": "I just made a major career decision. How can I deepen my reflection on this?",
    "metacognitivePhase": "reflecting",
    "contextData": {
      "decisionTitle": "New job offer",
      "emotionalState": "excited but uncertain"
    }
  }' | jq .
```

### Chat with Growth Twin
```bash
curl -X POST "$BASE_URL/api/twins/interaction" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "twinType": "growth",
    "userMessage": "What learning opportunities does this new role offer?",
    "contextData": {
      "decisionTitle": "New job offer"
    }
  }' | jq .
```

### Get Twin Interaction History
```bash
# Coach Twin history
curl -X GET "$BASE_URL/api/twins/coach/history" \
  -H "Authorization: Bearer $JWT" | jq .

# Task Twin history
curl -X GET "$BASE_URL/api/twins/task/history" \
  -H "Authorization: Bearer $JWT" | jq .

# Health Twin history
curl -X GET "$BASE_URL/api/twins/health/history" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Available Twin Types
```
- task        (Productivity)
- coach       (Guidance)
- growth      (Learning)
- health      (Wellness)
- relationship (Connection)
- financial   (Money)
- creative    (Expression)
- research    (Knowledge)
- metacognition (Thinking)
```

### Metacognitive Phases
```
- planning
- monitoring
- evaluating
- reflecting
```

---

## 6. Knowledge Endpoints

### Create Knowledge Entry
```bash
curl -X POST "$BASE_URL/api/knowledge" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Decision-Making",
    "insight": "Taking time to reflect improves decision quality",
    "source": "personal-experience",
    "evidence": "My recent career decision benefited from deep reflection",
    "applicability": ["career", "relationships", "health"],
    "relatedTopics": ["metacognition", "emotional-intelligence"]
  }' | jq .
```

**Save Knowledge ID:**
```bash
export KNOWLEDGE_ID=$(curl -s -X POST "$BASE_URL/api/knowledge" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "topic":"test","insight":"test insight","source":"experience"
  }' | jq -r '.entryId')

echo "Knowledge ID: $KNOWLEDGE_ID"
```

### List Knowledge Entries
```bash
curl -X GET "$BASE_URL/api/knowledge" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Get Specific Entry
```bash
curl -X GET "$BASE_URL/api/knowledge/$KNOWLEDGE_ID" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Create Learning Loop
```bash
curl -X POST "$BASE_URL/api/knowledge/learning-loop" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "cycle": 1,
    "cycleType": "weekly",
    "keyInsights": [
      "Reflection deepens decision quality",
      "Metacognitive awareness improves choices"
    ]
  }' | jq .
```

### Get Learning Loop History
```bash
curl -X GET "$BASE_URL/api/knowledge/loops/history" \
  -H "Authorization: Bearer $JWT" | jq .
```

---

## 7. Biometrics Endpoints

### Log Biometric Data
```bash
curl -X POST "$BASE_URL/api/biometrics" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "heartRate": 72,
    "hrv": 55,
    "breathingRate": 14,
    "sleepDuration": 7.5,
    "sleepQuality": 85,
    "steps": 8000,
    "activeMinutes": 45,
    "temperature": 98.2,
    "bloodPressure": {"systolic": 120, "diastolic": 80},
    "posture": "good",
    "source": "apple-health",
    "timeOfDay": "morning"
  }' | jq .
```

**Save Biometric ID:**
```bash
export BIOMETRIC_ID=$(curl -s -X POST "$BASE_URL/api/biometrics" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "heartRate":72,"hrv":55,"breathingRate":14,"sleepQuality":85
  }' | jq -r '.biometricId')

echo "Biometric ID: $BIOMETRIC_ID"
```

### Get Biometric Data (Latest 24h)
```bash
curl -X GET "$BASE_URL/api/biometrics" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Get Biometric Data by Timeframe
```bash
# 24 hours
curl -X GET "$BASE_URL/api/biometrics?timeframe=24h" \
  -H "Authorization: Bearer $JWT" | jq .

# 7 days
curl -X GET "$BASE_URL/api/biometrics?timeframe=7d" \
  -H "Authorization: Bearer $JWT" | jq .

# 30 days
curl -X GET "$BASE_URL/api/biometrics?timeframe=30d" \
  -H "Authorization: Bearer $JWT" | jq .

# All
curl -X GET "$BASE_URL/api/biometrics?timeframe=all" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Get Specific Biometric Reading
```bash
curl -X GET "$BASE_URL/api/biometrics/$BIOMETRIC_ID" \
  -H "Authorization: Bearer $JWT" | jq .
```

---

## 8. Coherence Endpoints

### Get Current 8-Layer Coherence
```bash
curl -X GET "$BASE_URL/api/coherence" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Get Coherence History
```bash
# 24 hours
curl -X GET "$BASE_URL/api/coherence/history?timeframe=24h" \
  -H "Authorization: Bearer $JWT" | jq .

# 7 days (default)
curl -X GET "$BASE_URL/api/coherence/history?timeframe=7d" \
  -H "Authorization: Bearer $JWT" | jq .

# 30 days
curl -X GET "$BASE_URL/api/coherence/history?timeframe=30d" \
  -H "Authorization: Bearer $JWT" | jq .

# All time
curl -X GET "$BASE_URL/api/coherence/history?timeframe=all" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Get Specific Coherence Metric
```bash
# First, get a coherence metric ID from the history
export COHERENCE_ID="<id-from-history>"

curl -X GET "$BASE_URL/api/coherence/$COHERENCE_ID" \
  -H "Authorization: Bearer $JWT" | jq .
```

---

## 9. Accessibility Endpoints

### Get Accessibility Settings
```bash
curl -X GET "$BASE_URL/api/accessibility/settings" \
  -H "Authorization: Bearer $JWT" | jq .
```

### Update Accessibility Settings
```bash
curl -X POST "$BASE_URL/api/accessibility/settings" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "fontSize": 20,
    "lineSpacing": 2.0,
    "ttsSpeed": 0.9,
    "focusMode": true,
    "dyslexiaMode": true,
    "adhdMode": true,
    "highContrast": false
  }' | jq .
```

### Scan Book Image (OCR)
```bash
# Create a base64-encoded image
# For testing, use a simple test image or generate one
curl -X POST "$BASE_URL/api/accessibility/scan-book" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "language": "en",
    "focusArea": "full"
  }' | jq .
```

### Generate Text-to-Speech
```bash
curl -X POST "$BASE_URL/api/accessibility/tts" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a test of the text-to-speech system. It converts written text into spoken audio.",
    "voiceId": "neural",
    "speed": 1.0
  }' | jq .
```

---

## 10. Values Endpoints

### Create/Update Values
```bash
curl -X POST "$BASE_URL/api/values" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "values": ["growth", "authenticity", "connection", "learning"]
  }' | jq .
```

### Get Values
```bash
curl -X GET "$BASE_URL/api/values" \
  -H "Authorization: Bearer $JWT" | jq .
```

---

## Error Handling

### Missing Token (401)
```bash
curl -X GET "$BASE_URL/api/voice"
# Response: {"error": "Authentication required"}
```

### Invalid Token (401)
```bash
curl -X GET "$BASE_URL/api/voice" \
  -H "Authorization: Bearer invalid-token"
# Response: {"error": "Invalid or expired token"}
```

### Validation Error (400)
```bash
curl -X POST "$BASE_URL/api/decisions" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'
# Response: {"error": "Missing required fields: ..."}
```

### Not Found (404)
```bash
curl -X GET "$BASE_URL/api/voice/nonexistent-id" \
  -H "Authorization: Bearer $JWT"
# Response: {"error": "Recording not found"}
```

### Duplicate (409)
```bash
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"name\": \"Test\",
    \"password\": \"$TEST_PASSWORD\"
  }"
# Response: {"error": "User already exists"}
```

---

## Useful Curl Flags

```bash
# Pretty-print JSON
| jq .

# Extract specific field
| jq '.fieldName'

# Extract array
| jq '.array[0]'

# Format as CSV
| jq -r '.[] | [.id, .name] | @csv'

# Save to variable
RESULT=$(curl -s ... | jq -r '.fieldName')

# See response headers
-i

# See full request/response
-v

# Follow redirects
-L

# Set timeout (seconds)
--max-time 30

# Silent mode
-s

# Show errors
-S (with -s)

# Output to file
-o filename

# Continue on errors
--continue-at -

# Only show HTTP code
-w '%{http_code}'
```

---

## Batch Testing

```bash
#!/bin/bash

# Register and get token
REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"batch-test@example.com\",\"name\":\"Test\",\"password\":\"SecurePass123!\"}")

JWT=$(echo "$REGISTER" | jq -r '.token')

# Test multiple endpoints
for endpoint in "/api/voice" "/api/decisions" "/api/twins" "/api/coherence"; do
  echo "Testing $endpoint"
  curl -s -X GET "$BASE_URL$endpoint" \
    -H "Authorization: Bearer $JWT" | jq '.success'
done
```

---

## Performance Testing with curl

```bash
# Measure request time
curl -X GET "$BASE_URL/api/voice" \
  -H "Authorization: Bearer $JWT" \
  -w "\nTime: %{time_total}s\nSize: %{size_download} bytes\n"

# Repeat 10 times and measure average
for i in {1..10}; do
  curl -s -X GET "$BASE_URL/api/voice" \
    -H "Authorization: Bearer $JWT" \
    -w "%{time_total}\n" \
    -o /dev/null
done | awk '{sum+=$1} END {print "Average: " sum/NR "s"}'
```

---

## Saving Responses to Files

```bash
# Save full response
curl -s -X GET "$BASE_URL/api/coherence" \
  -H "Authorization: Bearer $JWT" > coherence-response.json

# Format and save
curl -s -X GET "$BASE_URL/api/coherence" \
  -H "Authorization: Bearer $JWT" | jq . > coherence-response.json

# Append to file
curl -s -X GET "$BASE_URL/api/twins" \
  -H "Authorization: Bearer $JWT" >> twins-history.jsonl
```

---

## Tips

1. Always use `-s` for curl in scripts (silent mode)
2. Pipe through `jq` for JSON formatting
3. Save JWT token to environment variable: `export JWT="..."`
4. Use `$(...)` for command substitution to extract values
5. Test error cases before success cases
6. Check response codes with `-w "%{http_code}"`
7. Use `-v` only for debugging (very verbose)
8. For large requests, use `-d @file.json` to read from file
