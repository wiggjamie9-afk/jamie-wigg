package com.neuraltwin.app.data.network

import com.neuraltwin.app.data.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // Voice endpoints
    @POST("voice")
    suspend fun uploadVoiceRecording(@Body request: VoiceRecordingRequest): Response<VoiceRecordingResponse>

    @GET("voice")
    suspend fun getVoiceRecordings(@Query("userId") userId: String): Response<VoiceRecordingsResponse>

    @GET("voice/{id}")
    suspend fun getVoiceRecording(@Path("id") id: String): Response<VoiceRecordingDetailResponse>

    // Decision endpoints
    @POST("decisions")
    suspend fun logDecision(@Body request: DecisionRequest): Response<DecisionResponse>

    @GET("decisions")
    suspend fun getDecisions(
        @Query("userId") userId: String,
        @Query("category") category: String? = null
    ): Response<DecisionsResponse>

    @GET("decisions/{id}")
    suspend fun getDecision(@Path("id") id: String): Response<DecisionDetailResponse>

    @GET("decisions/patterns/analysis")
    suspend fun analyzeDecisionPatterns(@Query("userId") userId: String): Response<DecisionPatternsResponse>

    // Twin endpoints
    @POST("twins/interaction")
    suspend fun chatWithTwin(@Body request: TwinInteractionRequest): Response<TwinInteractionResponse>

    @GET("twins")
    suspend fun getTwins(@Query("userId") userId: String): Response<TwinsResponse>

    @GET("twins/{type}/history")
    suspend fun getTwinHistory(
        @Path("type") type: String,
        @Query("userId") userId: String
    ): Response<TwinHistoryResponse>

    // Biometric endpoints
    @POST("biometrics")
    suspend fun logBiometricData(@Body request: BiometricDataRequest): Response<BiometricDataResponse>

    @GET("biometrics")
    suspend fun getBiometricData(
        @Query("userId") userId: String,
        @Query("timeframe") timeframe: String = "24h"
    ): Response<BiometricDataListResponse>

    @GET("biometrics/{id}")
    suspend fun getBiometricReading(@Path("id") id: String): Response<BiometricReadingDetailResponse>

    // Knowledge endpoints
    @POST("knowledge")
    suspend fun logKnowledgeEntry(@Body request: KnowledgeEntryRequest): Response<KnowledgeEntryResponse>

    @GET("knowledge")
    suspend fun getKnowledgeBase(
        @Query("userId") userId: String,
        @Query("topic") topic: String? = null
    ): Response<KnowledgeBaseResponse>

    @GET("knowledge/{id}")
    suspend fun getKnowledgeEntry(@Path("id") id: String): Response<KnowledgeEntryDetailResponse>

    @POST("knowledge/learning-loop")
    suspend fun createLearningLoop(@Body request: LearningLoopRequest): Response<LearningLoopResponse>

    @GET("knowledge/loops/history")
    suspend fun getLearningLoops(@Query("userId") userId: String): Response<LearningLoopsResponse>

    // Coherence endpoints
    @GET("coherence")
    suspend fun getCoherence(@Query("userId") userId: String): Response<CoherenceResponse>

    @GET("coherence/history")
    suspend fun getCoherenceHistory(
        @Query("userId") userId: String,
        @Query("timeframe") timeframe: String = "7d"
    ): Response<CoherenceHistoryResponse>

    @GET("coherence/{id}")
    suspend fun getCoherenceMetric(@Path("id") id: String): Response<CoherenceDetailResponse>

    // Accessibility endpoints
    @POST("accessibility/scan-book")
    suspend fun scanBook(@Body request: BookScanRequest): Response<BookScanResponse>

    @GET("accessibility/settings")
    suspend fun getAccessibilitySettings(): Response<AccessibilitySettingsResponse>

    @POST("accessibility/settings")
    suspend fun updateAccessibilitySettings(@Body settings: AccessibilitySettingsRequest): Response<AccessibilitySettingsResponse>

    @POST("accessibility/tts")
    suspend fun generateTextToSpeech(@Body request: TextToSpeechRequest): Response<TextToSpeechResponse>
}
