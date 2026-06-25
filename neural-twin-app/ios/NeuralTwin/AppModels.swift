import Foundation

// ============================================================================
// Voice Models
// ============================================================================

struct VoiceRecordingRequest: Codable {
  let userId: String
  let audioBase64: String
  let context: String?
  let location: String?
  let decisionTitle: String?
  let planningClarity: Int?
}

struct VoiceRecordingResponse: Codable {
  let success: Bool
  let recordingId: String
  let transcript: String
  let emotion: EmotionResult
  let acousticFeatures: AcousticFeatures
}

struct VoiceRecordingsResponse: Codable {
  let success: Bool
  let recordings: [VoiceRecordingItem]
}

struct VoiceRecordingDetailResponse: Codable {
  let success: Bool
  let recording: VoiceRecordingDetail
}

struct VoiceRecordingItem: Codable {
  let id: String
  let transcript: String
  let emotion: String
  let emotionScore: Float
  let context: String?
  let createdAt: Date
}

struct VoiceRecordingDetail: Codable {
  let id: String
  let userId: String
  let audioUrl: String
  let duration: Float
  let primaryEmotion: String
  let emotionScore: Float
  let acousticFeatures: AcousticFeatures
  let transcript: String
  let context: String?
  let createdAt: Date
}

struct EmotionResult: Codable {
  let primaryEmotion: String
  let confidence: Float
  let all_emotions: [String: Float]
}

struct AcousticFeatures: Codable {
  let pitch: Float
  let speech_rate: Float
  let jitter: Float
  let formants: [Float]
  let mfcc: [Float]
  let prosody: Prosody
}

struct Prosody: Codable {
  let intonation: Float
  let rhythm: Float
  let stress_patterns: Float
}

// ============================================================================
// Decision Models
// ============================================================================

struct DecisionRequest: Codable {
  let userId: String
  let title: String
  let description: String
  let options: [String: String]
  let chosenOption: String
  let reasoning: String
  let category: String?
  let confidence: Float?
  let planningClarity: Int
  let strategyChosen: String?
  let monitoringComprehension: Int
  let evaluationEffectiveness: Int
  let reflectionInsights: String?
}

struct DecisionResponse: Codable {
  let success: Bool
  let decisionId: String
  let metacognitiveScore: String
  let analysis: String
  let insights: InsightData
}

struct InsightData: Codable {
  let planningClarity: Int
  let monitoringComprehension: Int
  let evaluationEffectiveness: Int
  let hasReflection: Bool
}

struct DecisionsResponse: Codable {
  let success: Bool
  let decisions: [DecisionItem]
  let count: Int
}

struct DecisionDetailResponse: Codable {
  let success: Bool
  let decision: DecisionDetail
}

struct DecisionItem: Codable {
  let id: String
  let title: String
  let category: String
  let chosenOption: String
  let confidence: Float
  let metacognitiveScore: Float
  let createdAt: Date
}

struct DecisionDetail: Codable {
  let id: String
  let userId: String
  let title: String
  let description: String
  let options: [String: String]
  let chosenOption: String
  let reasoning: String
  let category: String
  let confidence: Float
  let planningClarity: Int
  let strategyChosen: String
  let monitoringComprehension: Int
  let evaluationEffectiveness: Int
  let reflectionInsights: String
  let metacognitiveScore: Float
  let createdAt: Date
}

struct DecisionPatternsResponse: Codable {
  let success: Bool
  let patterns: DecisionPatterns
}

struct DecisionPatterns: Codable {
  let totalDecisions: Int
  let averageMetacognitiveScore: Float
  let averageConfidence: Float
  let categoryBreakdown: [String: Int]
  let metacognitiveProgress: MetacognitiveProgress?
}

struct MetacognitiveProgress: Codable {
  let avgPlanning: String
  let avgMonitoring: String
  let avgEvaluating: String
  let avgReflecting: String
}

// ============================================================================
// Twin Models
// ============================================================================

struct TwinInteractionRequest: Codable {
  let userId: String
  let twinType: String
  let userMessage: String
  let metacognitivePhase: String?
  let contextData: [String: AnyCodable]?
}

struct AnyCodable: Codable {
  let value: AnyCodableValue

  init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    if let bool = try? container.decode(Bool.self) {
      value = .bool(bool)
    } else if let int = try? container.decode(Int.self) {
      value = .int(int)
    } else if let double = try? container.decode(Double.self) {
      value = .double(double)
    } else if let string = try? container.decode(String.self) {
      value = .string(string)
    } else if let array = try? container.decode([AnyCodable].self) {
      value = .array(array)
    } else if let dict = try? container.decode([String: AnyCodable].self) {
      value = .dict(dict)
    } else {
      throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot decode AnyCodable")
    }
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    switch value {
    case .bool(let b): try container.encode(b)
    case .int(let i): try container.encode(i)
    case .double(let d): try container.encode(d)
    case .string(let s): try container.encode(s)
    case .array(let a): try container.encode(a)
    case .dict(let d): try container.encode(d)
    }
  }
}

enum AnyCodableValue {
  case bool(Bool)
  case int(Int)
  case double(Double)
  case string(String)
  case array([AnyCodable])
  case dict([String: AnyCodable])
}

struct TwinInteractionResponse: Codable {
  let success: Bool
  let interactionId: String
  let response: String
  let phase: String?
}

struct TwinsResponse: Codable {
  let success: Bool
  let twins: [TwinItem]
}

struct TwinHistoryResponse: Codable {
  let success: Bool
  let interactions: [TwinInteractionItem]
}

struct TwinItem: Codable {
  let type: String
  let emoji: String
  let name: String
  let subtitle: String
  let status: String
  let interactionCount: Int
}

struct TwinInteractionItem: Codable {
  let id: String
  let userMessage: String
  let twinResponse: String
  let phase: String?
  let createdAt: Date
}

// ============================================================================
// Coherence Models
// ============================================================================

struct CoherenceResponse: Codable {
  let success: Bool
  let coherenceState: String
  let overallCoherence: String
  let layers: [CoherenceLayer]
  let recommendations: String
  let timestamp: Date
}

struct CoherenceHistoryResponse: Codable {
  let success: Bool
  let timeframe: String
  let physicalCoherence: PhysicalCoherence
  let metacognitiveCoherence: MetacognitiveCoherence
  let history: [CoherencePoint]
}

struct CoherenceDetailResponse: Codable {
  let success: Bool
  let metric: CoherenceMetricDetail
}

struct CoherenceLayer: Codable {
  let layer: Int
  let name: String
  let value: String
  let description: String
}

struct PhysicalCoherence: Codable {
  let average: String
  let dataPoints: Int
  let trend: String
}

struct MetacognitiveCoherence: Codable {
  let average: String
  let dataPoints: Int
}

struct CoherencePoint: Codable {
  let timestamp: Date
  let overall: Float
  let state: String
}

struct CoherenceMetricDetail: Codable {
  let id: String
  let heartBrainCoh: Float?
  let breathCoh: Float?
  let brainCoh: Float?
  let vagalTone: Float?
  let circadianAlign: Float?
  let biofieldCoh: Float?
  let decisionCoh: Float?
  let overallCoherence: Float
  let coherenceState: String
  let timestamp: Date
}

// ============================================================================
// Accessibility Models
// ============================================================================

struct BookScanRequest: Codable {
  let imageBase64: String
  let language: String
  let focusArea: String
}

struct BookScanResponse: Codable {
  let success: Bool
  let scanId: String
  let originalText: String
  let simplifiedText: String
  let sections: [String]
  let readingTime: Int
  let characterCount: Int
  let wordCount: Int
}

struct TextToSpeechRequest: Codable {
  let text: String
  let voiceId: String
  let speed: Float
}

struct TextToSpeechResponse: Codable {
  let success: Bool
  let audioUrl: String
  let duration: Float
  let voice: String
  let speed: Float
  let characterCount: Int
  let wordCount: Int
}

struct AccessibilitySettingsRequest: Codable {
  let dyslexiaMode: Bool?
  let adhdMode: Bool?
  let fontSize: Int?
  let lineSpacing: Float?
  let fontFamily: String?
  let backgroundColor: String?
  let textColor: String?
  let highContrast: Bool?
  let simplifyText: Bool?
  let readingPane: Bool?
  let ttsEnabled: Bool?
  let ttsSpeed: Float?
  let ttsVoice: String?
  let focusMode: Bool?
  let wordHighlight: Bool?
  let sectionBreaks: Bool?
  let wordCount: Bool?
  let estimatedReadingTime: Bool?
}

struct AccessibilitySettingsResponse: Codable {
  let success: Bool
  let settings: AccessibilitySettings
}

struct AccessibilitySettings: Codable {
  let userId: String?
  let dyslexiaMode: Bool
  let adhdMode: Bool
  let fontSize: Int
  let lineSpacing: Float
  let fontFamily: String
  let backgroundColor: String
  let textColor: String
  let highContrast: Bool
  let simplifyText: Bool
  let readingPane: Bool
  let ttsEnabled: Bool
  let ttsSpeed: Float
  let ttsVoice: String
  let focusMode: Bool
  let wordHighlight: Bool
  let sectionBreaks: Bool
  let wordCount: Bool
  let estimatedReadingTime: Bool
}
