package com.neuraltwin.app.data.network

import com.neuraltwin.app.data.models.*
import com.neuraltwin.app.data.local.DecisionLocalDataSource
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class Repository @Inject constructor(
    private val apiService: ApiService,
    private val decisionLocalDataSource: DecisionLocalDataSource? = null
) {
    // ============================================================================
    // Auth Operations
    // ============================================================================

    suspend fun register(request: RegisterRequest) =
        apiService.register(request)

    suspend fun login(request: LoginRequest) =
        apiService.login(request)

    // ============================================================================
    // Voice Operations
    // ============================================================================

    suspend fun uploadVoiceRecording(request: VoiceRecordingRequest) =
        apiService.uploadVoiceRecording(request)

    suspend fun getVoiceRecordings(userId: String) =
        apiService.getVoiceRecordings(userId)

    suspend fun getVoiceRecording(id: String) =
        apiService.getVoiceRecording(id)

    // ============================================================================
    // Decision Operations
    // ============================================================================

    suspend fun logDecision(request: DecisionRequest) = apiService.logDecision(request).also { response ->
        // Save to local database if successful
        if (response.isSuccessful && response.body() != null) {
            try {
                decisionLocalDataSource?.saveDecision(
                    response = response.body()!!,
                    userId = request.userId,
                    title = request.title,
                    description = request.description,
                    category = request.category,
                    chosenOption = request.chosenOption,
                    reasoning = request.reasoning,
                    confidence = request.confidence,
                    planningClarity = request.planningClarity,
                    strategyChosen = request.strategyChosen,
                    monitoringComprehension = request.monitoringComprehension,
                    evaluationEffectiveness = request.evaluationEffectiveness,
                    reflectionInsights = request.reflectionInsights
                )
            } catch (e: Exception) {
                // Log error but don't fail the main operation
                e.printStackTrace()
            }
        }
    }

    suspend fun getDecisions(userId: String, category: String? = null) =
        apiService.getDecisions(userId, category)

    suspend fun getDecision(id: String) =
        apiService.getDecision(id)

    suspend fun analyzeDecisionPatterns(userId: String) =
        apiService.analyzeDecisionPatterns(userId)

    // ============================================================================
    // Decision Local Operations
    // ============================================================================

    fun getUserDecisions(userId: String) =
        decisionLocalDataSource?.getUserDecisions(userId)

    fun getUserDecisionsByCategory(userId: String, category: String) =
        decisionLocalDataSource?.getUserDecisionsByCategory(userId, category)

    suspend fun getRecentDecisions(userId: String, limit: Int = 10) =
        decisionLocalDataSource?.getRecentDecisions(userId, limit)

    suspend fun getDecisionCount(userId: String) =
        decisionLocalDataSource?.getDecisionCount(userId)

    suspend fun deleteDecision(decisionId: Long) {
        decisionLocalDataSource?.let {
            val decision = it.getDecision(decisionId)
            if (decision != null) {
                it.deleteDecision(decision)
            }
        }
    }

    // ============================================================================
    // Twin Operations
    // ============================================================================

    suspend fun chatWithTwin(request: TwinInteractionRequest) =
        apiService.chatWithTwin(request)

    suspend fun getTwins(userId: String) =
        apiService.getTwins(userId)

    suspend fun getTwinHistory(type: String, userId: String) =
        apiService.getTwinHistory(type, userId)

    // ============================================================================
    // Biometric Operations
    // ============================================================================

    suspend fun logBiometricData(request: BiometricDataRequest) =
        apiService.logBiometricData(request)

    suspend fun getBiometricData(userId: String, timeframe: String = "24h") =
        apiService.getBiometricData(userId, timeframe)

    suspend fun getBiometricReading(id: String) =
        apiService.getBiometricReading(id)

    // ============================================================================
    // Knowledge Operations
    // ============================================================================

    suspend fun logKnowledgeEntry(request: KnowledgeEntryRequest) =
        apiService.logKnowledgeEntry(request)

    suspend fun getKnowledgeBase(userId: String, topic: String? = null) =
        apiService.getKnowledgeBase(userId, topic)

    suspend fun getKnowledgeEntry(id: String) =
        apiService.getKnowledgeEntry(id)

    suspend fun createLearningLoop(request: LearningLoopRequest) =
        apiService.createLearningLoop(request)

    suspend fun getLearningLoops(userId: String) =
        apiService.getLearningLoops(userId)

    // ============================================================================
    // Coherence Operations
    // ============================================================================

    suspend fun getCoherence(userId: String) =
        apiService.getCoherence(userId)

    suspend fun getCoherenceHistory(userId: String, timeframe: String = "7d") =
        apiService.getCoherenceHistory(userId, timeframe)

    suspend fun getCoherenceMetric(id: String) =
        apiService.getCoherenceMetric(id)
}
