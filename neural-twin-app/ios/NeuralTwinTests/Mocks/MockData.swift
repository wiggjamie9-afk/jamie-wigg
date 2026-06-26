import Foundation

/// Test fixtures and mock data for all test scenarios
struct MockData {
  // MARK: - Auth Fixtures

  static let validAuthResponse = """
  {
    "user": {
      "id": "user-123",
      "email": "test@example.com",
      "name": "Test User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  """

  static let invalidAuthResponse = """
  {
    "error": "Invalid email or password"
  }
  """

  static let signupDuplicateError = """
  {
    "error": "An account with that email already exists."
  }
  """

  // MARK: - Voice Recording Fixtures

  static let voiceRecordingResponse = """
  {
    "id": "voice-456",
    "userId": "user-123",
    "audioUrl": "https://api.example.com/audio/voice-456.wav",
    "emotionResult": {
      "emotions": {
        "joy": 0.7,
        "sadness": 0.1,
        "anger": 0.05,
        "calm": 0.15
      },
      "confidence": 0.92,
      "primary_emotion": "joy"
    },
    "timestamp": "2024-06-26T10:00:00Z",
    "transcript": "This is a test recording",
    "context": "morning"
  }
  """

  static let voiceRecordingsListResponse = """
  {
    "success": true,
    "recordings": [
      {
        "id": "voice-456",
        "userId": "user-123",
        "audioUrl": "https://api.example.com/audio/voice-456.wav",
        "emotionResult": {
          "emotions": {
            "joy": 0.7,
            "sadness": 0.1,
            "anger": 0.05,
            "calm": 0.15
          },
          "confidence": 0.92,
          "primary_emotion": "joy"
        },
        "timestamp": "2024-06-26T10:00:00Z",
        "transcript": "This is a test recording",
        "context": "morning"
      }
    ]
  }
  """

  static let emotionAnalysisResponse = """
  {
    "emotions": {
      "joy": 0.65,
      "sadness": 0.15,
      "anger": 0.1,
      "calm": 0.1
    },
    "confidence": 0.88,
    "primary_emotion": "joy"
  }
  """

  // MARK: - Decision Fixtures

  static let decisionResponse = """
  {
    "id": "decision-789",
    "userId": "user-123",
    "title": "Career Change Decision",
    "description": "Should I change my career path?",
    "category": "career",
    "chosenOption": "Start preparation phase",
    "reasoning": "Aligned with long-term goals",
    "planningClarity": 8,
    "monitoringComprehension": 7,
    "evaluationEffectiveness": 8,
    "reflectionInsights": "This decision requires careful planning",
    "timestamp": "2024-06-26T10:30:00Z"
  }
  """

  static let decisionsListResponse = """
  {
    "success": true,
    "decisions": [
      {
        "id": "decision-789",
        "userId": "user-123",
        "title": "Career Change Decision",
        "description": "Should I change my career path?",
        "category": "career",
        "chosenOption": "Start preparation phase",
        "reasoning": "Aligned with long-term goals",
        "planningClarity": 8,
        "monitoringComprehension": 7,
        "evaluationEffectiveness": 8,
        "reflectionInsights": "This decision requires careful planning",
        "timestamp": "2024-06-26T10:30:00Z"
      }
    ]
  }
  """

  // MARK: - Twin Chat Fixtures

  static let twinInteractionResponse = """
  {
    "id": "interaction-001",
    "userId": "user-123",
    "twinType": "mentor",
    "userMessage": "How do I improve my decision-making?",
    "twinResponse": "Based on your decision history, I recommend focusing on planning clarity...",
    "metadata": {
      "responseTime": 2.45,
      "tokensUsed": 156
    },
    "timestamp": "2024-06-26T11:00:00Z"
  }
  """

  static let twinHistoryResponse = """
  {
    "success": true,
    "twinType": "mentor",
    "history": [
      {
        "id": "interaction-001",
        "userMessage": "How do I improve my decision-making?",
        "twinResponse": "Based on your decision history, I recommend focusing on planning clarity...",
        "timestamp": "2024-06-26T11:00:00Z"
      },
      {
        "id": "interaction-002",
        "userMessage": "Tell me about my patterns",
        "twinResponse": "Your recent decisions show a strong trend toward analytical thinking...",
        "timestamp": "2024-06-26T11:30:00Z"
      }
    ]
  }
  """

  static let streamingTwinResponse = """
  data: {"content": "Hello, "}
  data: {"content": "I'm your "}
  data: {"content": "mentor "}
  data: {"content": "twin."}
  """

  // MARK: - Coherence Fixtures

  static let coherenceResponse = """
  {
    "success": true,
    "coherence": {
      "id": "coherence-001",
      "userId": "user-123",
      "timestamp": "2024-06-26T12:00:00Z",
      "layers": [
        {
          "name": "Emotional Coherence",
          "score": 0.82,
          "components": ["mood_stability", "emotional_awareness"]
        },
        {
          "name": "Cognitive Coherence",
          "score": 0.78,
          "components": ["clarity", "focus"]
        },
        {
          "name": "Decision Coherence",
          "score": 0.85,
          "components": ["consistency", "alignment"]
        },
        {
          "name": "Narrative Coherence",
          "score": 0.76,
          "components": ["story_consistency", "identity"]
        },
        {
          "name": "Social Coherence",
          "score": 0.71,
          "components": ["relationship_alignment", "social_harmony"]
        },
        {
          "name": "Value Coherence",
          "score": 0.88,
          "components": ["value_alignment", "integrity"]
        },
        {
          "name": "Temporal Coherence",
          "score": 0.79,
          "components": ["past_connection", "future_vision"]
        },
        {
          "name": "Existential Coherence",
          "score": 0.75,
          "components": ["purpose", "meaning"]
        }
      ],
      "overallScore": 0.79
    }
  }
  """

  static let coherenceHistoryResponse = """
  {
    "success": true,
    "history": [
      {
        "timestamp": "2024-06-20T12:00:00Z",
        "overallScore": 0.75
      },
      {
        "timestamp": "2024-06-21T12:00:00Z",
        "overallScore": 0.76
      },
      {
        "timestamp": "2024-06-22T12:00:00Z",
        "overallScore": 0.78
      },
      {
        "timestamp": "2024-06-23T12:00:00Z",
        "overallScore": 0.77
      },
      {
        "timestamp": "2024-06-24T12:00:00Z",
        "overallScore": 0.80
      },
      {
        "timestamp": "2024-06-25T12:00:00Z",
        "overallScore": 0.81
      },
      {
        "timestamp": "2024-06-26T12:00:00Z",
        "overallScore": 0.79
      }
    ]
  }
  """

  // MARK: - Error Responses

  static let serverErrorResponse = """
  {
    "error": "Internal server error",
    "code": 500
  }
  """

  static let unauthorizedErrorResponse = """
  {
    "error": "Unauthorized",
    "code": 401
  }
  """

  static let invalidRequestErrorResponse = """
  {
    "error": "Invalid request parameters",
    "code": 400
  }
  """

  // MARK: - Accessibility Fixtures

  static let textToSpeechResponse = """
  {
    "success": true,
    "audioUrl": "https://api.example.com/audio/tts-123.wav",
    "duration": 3.5
  }
  """

  // MARK: - Helper Methods

  static func jsonData(_ json: String) -> Data {
    json.data(using: .utf8) ?? Data()
  }

  static func createAuthResponse(
    userId: String = "user-123",
    email: String = "test@example.com",
    name: String = "Test User",
    token: String = "test-token"
  ) -> Data {
    let response = """
    {
      "user": {
        "id": "\(userId)",
        "email": "\(email)",
        "name": "\(name)"
      },
      "token": "\(token)"
    }
    """
    return jsonData(response)
  }

  static func createVoiceRecordingResponse(
    id: String = "voice-456",
    primaryEmotion: String = "joy",
    confidence: Double = 0.92
  ) -> Data {
    let response = """
    {
      "id": "\(id)",
      "userId": "user-123",
      "audioUrl": "https://api.example.com/audio/\(id).wav",
      "emotionResult": {
        "emotions": {
          "joy": 0.7,
          "sadness": 0.1,
          "anger": 0.05,
          "calm": 0.15
        },
        "confidence": \(confidence),
        "primary_emotion": "\(primaryEmotion)"
      },
      "timestamp": "2024-06-26T10:00:00Z",
      "transcript": "Test recording",
      "context": "test"
    }
    """
    return jsonData(response)
  }
}
