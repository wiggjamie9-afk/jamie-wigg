package com.neuraltwin.app.data.models

import java.util.*

// ============================================================================
// Voice Models
// ============================================================================

data class VoiceRecordingRequest(
    val userId: String,
    val audioBase64: String,
    val context: String? = null,
    val location: String? = null,
    val decisionTitle: String? = null,
    val planningClarity: Int? = null
)

data class VoiceRecordingResponse(
    val success: Boolean,
    val recordingId: String,
    val transcript: String,
    val emotion: EmotionResult,
    val acousticFeatures: AcousticFeatures
)

data class VoiceRecordingsResponse(
    val success: Boolean,
    val recordings: List<VoiceRecordingItem>
)

data class VoiceRecordingDetailResponse(
    val success: Boolean,
    val recording: VoiceRecordingDetail
)

data class VoiceRecordingItem(
    val id: String,
    val transcript: String,
    val emotion: String,
    val emotionScore: Float,
    val context: String?,
    val createdAt: Date
)

data class VoiceRecordingDetail(
    val id: String,
    val userId: String,
    val audioUrl: String,
    val duration: Float,
    val primaryEmotion: String,
    val emotionScore: Float,
    val acousticFeatures: AcousticFeatures,
    val transcript: String,
    val context: String?,
    val createdAt: Date
)

data class EmotionResult(
    val primaryEmotion: String,
    val confidence: Float,
    val all_emotions: Map<String, Float>
)

data class AcousticFeatures(
    val pitch: Float,
    val speech_rate: Float,
    val jitter: Float,
    val formants: List<Float>,
    val mfcc: List<Float>,
    val prosody: Prosody
)

data class Prosody(
    val intonation: Float,
    val rhythm: Float,
    val stress_patterns: Float
)

// ============================================================================
// Decision Models
// ============================================================================

data class DecisionRequest(
    val userId: String,
    val title: String,
    val description: String,
    val options: Map<String, String>,
    val chosenOption: String,
    val reasoning: String,
    val category: String? = null,
    val confidence: Float? = null,
    val planningClarity: Int = 5,
    val strategyChosen: String? = null,
    val monitoringComprehension: Int = 5,
    val evaluationEffectiveness: Int = 5,
    val reflectionInsights: String? = null
)

data class DecisionResponse(
    val success: Boolean,
    val decisionId: String,
    val metacognitiveScore: String,
    val analysis: String,
    val insights: InsightData
)

data class InsightData(
    val planningClarity: Int,
    val monitoringComprehension: Int,
    val evaluationEffectiveness: Int,
    val hasReflection: Boolean
)

data class DecisionsResponse(
    val success: Boolean,
    val decisions: List<DecisionItem>,
    val count: Int
)

data class DecisionDetailResponse(
    val success: Boolean,
    val decision: DecisionDetail
)

data class DecisionItem(
    val id: String,
    val title: String,
    val category: String,
    val chosenOption: String,
    val confidence: Float,
    val metacognitiveScore: Float,
    val createdAt: Date
)

data class DecisionDetail(
    val id: String,
    val userId: String,
    val title: String,
    val description: String,
    val options: Map<String, String>,
    val chosenOption: String,
    val reasoning: String,
    val category: String,
    val confidence: Float,
    val planningClarity: Int,
    val strategyChosen: String,
    val monitoringComprehension: Int,
    val evaluationEffectiveness: Int,
    val reflectionInsights: String,
    val metacognitiveScore: Float,
    val createdAt: Date
)

data class DecisionPatternsResponse(
    val success: Boolean,
    val patterns: DecisionPatterns
)

data class DecisionPatterns(
    val totalDecisions: Int,
    val averageMetacognitiveScore: Float,
    val averageConfidence: Float,
    val categoryBreakdown: Map<String, Int>,
    val metacognitiveProgress: MetacognitiveProgress?
)

data class MetacognitiveProgress(
    val avgPlanning: String,
    val avgMonitoring: String,
    val avgEvaluating: String,
    val avgReflecting: String
)

// ============================================================================
// Twin Models
// ============================================================================

data class TwinInteractionRequest(
    val userId: String,
    val twinType: String,
    val userMessage: String,
    val metacognitivePhase: String? = null,
    val contextData: Map<String, Any>? = null
)

data class TwinInteractionResponse(
    val success: Boolean,
    val interactionId: String,
    val response: String,
    val phase: String?
)

data class TwinsResponse(
    val success: Boolean,
    val twins: List<TwinItem>
)

data class TwinHistoryResponse(
    val success: Boolean,
    val interactions: List<TwinInteractionItem>
)

data class TwinItem(
    val type: String,
    val emoji: String,
    val name: String,
    val subtitle: String,
    val status: String,
    val interactionCount: Int
)

data class TwinInteractionItem(
    val id: String,
    val userMessage: String,
    val twinResponse: String,
    val phase: String?,
    val createdAt: Date
)

// ============================================================================
// Biometric Models
// ============================================================================

data class BiometricDataRequest(
    val userId: String,
    val heartRate: Float? = null,
    val hrv: Float? = null,
    val breathingRate: Float? = null,
    val sleepDuration: Float? = null,
    val sleepQuality: Int? = null,
    val steps: Int? = null,
    val activeMinutes: Int? = null,
    val temperature: Float? = null,
    val bloodPressure: Map<String, Int>? = null,
    val posture: String? = null,
    val source: String? = null,
    val timeOfDay: String? = null
)

data class BiometricDataResponse(
    val success: Boolean,
    val biometricId: String,
    val coherence: CoherenceScore
)

data class BiometricDataListResponse(
    val success: Boolean,
    val biometrics: List<BiometricItem>,
    val coherence: CoherenceTrend
)

data class BiometricReadingDetailResponse(
    val success: Boolean,
    val biometric: BiometricDetail
)

data class BiometricItem(
    val id: String,
    val heartRate: Float?,
    val hrv: Float?,
    val breathingRate: Float?,
    val sleepQuality: Int?,
    val posture: String?,
    val timestamp: Date
)

data class BiometricDetail(
    val id: String,
    val userId: String,
    val heartRate: Float?,
    val hrv: Float?,
    val breathingRate: Float?,
    val sleepDuration: Float?,
    val sleepQuality: Int?,
    val steps: Int?,
    val activeMinutes: Int?,
    val temperature: Float?,
    val bloodPressure: Map<String, Int>?,
    val posture: String?,
    val source: String,
    val timestamp: Date
)

data class CoherenceScore(
    val heartBrainCoh: String,
    val breathCoh: String,
    val vagalTone: String,
    val circadianAlign: String,
    val overallCoherence: String,
    val coherenceState: String
)

data class CoherenceTrend(
    val latest: Any?,
    val average: String,
    val trend: String
)

// ============================================================================
// Knowledge Models
// ============================================================================

data class KnowledgeEntryRequest(
    val userId: String,
    val topic: String,
    val insight: String,
    val source: String? = null,
    val evidence: String? = null,
    val applicability: List<String>? = null,
    val relatedTopics: List<String>? = null
)

data class KnowledgeEntryResponse(
    val success: Boolean,
    val entryId: String,
    val topic: String,
    val insight: String,
    val source: String,
    val createdAt: Date
)

data class KnowledgeBaseResponse(
    val success: Boolean,
    val entries: List<KnowledgeEntryItem>,
    val topicClusters: List<String>,
    val count: Int
)

data class KnowledgeEntryDetailResponse(
    val success: Boolean,
    val entry: KnowledgeEntryDetail
)

data class KnowledgeEntryItem(
    val id: String,
    val topic: String,
    val insight: String,
    val source: String,
    val applicability: List<String>,
    val createdAt: Date
)

data class KnowledgeEntryDetail(
    val id: String,
    val userId: String,
    val topic: String,
    val insight: String,
    val source: String,
    val evidence: String?,
    val applicability: List<String>,
    val relatedTopics: List<String>,
    val createdAt: Date
)

data class LearningLoopRequest(
    val userId: String,
    val cycle: Int,
    val cycleType: String,
    val keyInsights: List<String>
)

data class LearningLoopResponse(
    val success: Boolean,
    val loopId: String,
    val cycle: Int,
    val keyInsights: List<String>,
    val metacognitiveInsights: String,
    val coherence: Float
)

data class LearningLoopsResponse(
    val success: Boolean,
    val loops: List<LearningLoopItem>,
    val count: Int
)

data class LearningLoopItem(
    val id: String,
    val cycle: Int,
    val cycleType: String,
    val keyInsights: List<String>,
    val metacognitiveCoherence: Float,
    val createdAt: Date
)

// ============================================================================
// Coherence Models
// ============================================================================

data class CoherenceResponse(
    val success: Boolean,
    val coherenceState: String,
    val overallCoherence: String,
    val layers: List<CoherenceLayer>,
    val recommendations: String,
    val timestamp: Date
)

data class CoherenceHistoryResponse(
    val success: Boolean,
    val timeframe: String,
    val physicalCoherence: PhysicalCoherence,
    val metacognitiveCoherence: MetacognitiveCoherence,
    val history: List<CoherencePoint>
)

data class CoherenceDetailResponse(
    val success: Boolean,
    val metric: CoherenceMetricDetail
)

data class CoherenceLayer(
    val layer: Int,
    val name: String,
    val value: String,
    val description: String
)

data class PhysicalCoherence(
    val average: String,
    val dataPoints: Int,
    val trend: String
)

data class MetacognitiveCoherence(
    val average: String,
    val dataPoints: Int
)

data class CoherencePoint(
    val timestamp: Date,
    val overall: Float,
    val state: String
)

data class CoherenceMetricDetail(
    val id: String,
    val heartBrainCoh: Float?,
    val breathCoh: Float?,
    val brainCoh: Float?,
    val vagalTone: Float?,
    val circadianAlign: Float?,
    val biofieldCoh: Float?,
    val decisionCoh: Float?,
    val overallCoherence: Float,
    val coherenceState: String,
    val timestamp: Date
)

// ============================================================================
// Accessibility Models (Book Scanner & Text-to-Speech)
// ============================================================================

data class BookScanRequest(
    val imageBase64: String,
    val language: String = "en",
    val focusArea: String = "full"
)

data class BookScanResponse(
    val success: Boolean,
    val scanId: String,
    val originalText: String,
    val simplifiedText: String,
    val sections: List<String>,
    val readingTime: Int,
    val characterCount: Int,
    val wordCount: Int
)

data class TextToSpeechRequest(
    val text: String,
    val voiceId: String = "neural",
    val speed: Float = 1.0f
)

data class TextToSpeechResponse(
    val success: Boolean,
    val audioUrl: String,
    val duration: Float,
    val voice: String,
    val speed: Float,
    val characterCount: Int,
    val wordCount: Int
)

data class AccessibilitySettingsRequest(
    val dyslexiaMode: Boolean? = null,
    val adhdMode: Boolean? = null,
    val fontSize: Int? = null,
    val lineSpacing: Float? = null,
    val fontFamily: String? = null,
    val backgroundColor: String? = null,
    val textColor: String? = null,
    val highContrast: Boolean? = null,
    val simplifyText: Boolean? = null,
    val readingPane: Boolean? = null,
    val ttsEnabled: Boolean? = null,
    val ttsSpeed: Float? = null,
    val ttsVoice: String? = null,
    val focusMode: Boolean? = null,
    val wordHighlight: Boolean? = null,
    val sectionBreaks: Boolean? = null,
    val wordCount: Boolean? = null,
    val estimatedReadingTime: Boolean? = null
)

data class AccessibilitySettingsResponse(
    val success: Boolean,
    val settings: AccessibilitySettings
)

data class AccessibilitySettings(
    val userId: String? = null,
    val dyslexiaMode: Boolean,
    val adhdMode: Boolean,
    val fontSize: Int,
    val lineSpacing: Float,
    val fontFamily: String,
    val backgroundColor: String,
    val textColor: String,
    val highContrast: Boolean,
    val simplifyText: Boolean,
    val readingPane: Boolean,
    val ttsEnabled: Boolean,
    val ttsSpeed: Float,
    val ttsVoice: String,
    val focusMode: Boolean,
    val wordHighlight: Boolean,
    val sectionBreaks: Boolean,
    val wordCount: Boolean,
    val estimatedReadingTime: Boolean
)
