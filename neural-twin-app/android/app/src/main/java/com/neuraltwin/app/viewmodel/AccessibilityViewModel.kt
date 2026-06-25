package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.network.ApiClient
import com.neuraltwin.app.data.network.ApiService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Query

interface AccessibilityApiService {
    @POST("accessibility/scan-book")
    suspend fun scanBook(@Body request: BookScanRequest): retrofit2.Response<BookScanResponse>

    @POST("accessibility/tts")
    suspend fun textToSpeech(@Body request: TextToSpeechRequest): retrofit2.Response<TextToSpeechResponse>

    @GET("accessibility/settings")
    suspend fun getAccessibilitySettings(@Query("userId") userId: String): retrofit2.Response<AccessibilitySettingsResponse>

    @POST("accessibility/settings")
    suspend fun updateAccessibilitySettings(@Body request: AccessibilitySettingsRequest): retrofit2.Response<AccessibilitySettingsResponse>
}

data class BookScanRequest(
    val userId: String,
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
    val userId: String,
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

data class AccessibilitySettingsResponse(
    val success: Boolean,
    val settings: AccessibilitySettings
)

data class AccessibilitySettingsRequest(
    val userId: String,
    val dyslexiaMode: Boolean = true,
    val adhdMode: Boolean = true,
    val fontSize: Int = 18,
    val lineSpacing: Float = 1.8f,
    val fontFamily: String = "OpenDyslexic",
    val backgroundColor: String = "#F5F5DC",
    val textColor: String = "#333333",
    val highContrast: Boolean = false,
    val simplifyText: Boolean = true,
    val readingPane: Boolean = true,
    val ttsEnabled: Boolean = true,
    val ttsSpeed: Float = 1.0f,
    val ttsVoice: String = "neural",
    val focusMode: Boolean = true,
    val wordHighlight: Boolean = true,
    val sectionBreaks: Boolean = true,
    val wordCount: Boolean = true,
    val estimatedReadingTime: Boolean = true
)

data class AccessibilitySettings(
    val userId: String,
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

@HiltViewModel
class AccessibilityViewModel @Inject constructor() : ViewModel() {
    private val apiService = ApiClient.retrofit.create(AccessibilityApiService::class.java)

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _scanResult = MutableStateFlow<BookScanResponse?>(null)
    val scanResult: StateFlow<BookScanResponse?> = _scanResult

    private val _accessibilitySettings = MutableStateFlow<AccessibilitySettings?>(null)
    val accessibilitySettings: StateFlow<AccessibilitySettings?> = _accessibilitySettings

    fun scanBook(userId: String, imageBase64: String, language: String = "en", focusArea: String = "full") {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val request = BookScanRequest(userId, imageBase64, language, focusArea)
                val response = apiService.scanBook(request)

                if (response.isSuccessful) {
                    _scanResult.value = response.body()
                } else {
                    _error.value = "Failed to scan book: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getAccessibilitySettings(userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = apiService.getAccessibilitySettings(userId)
                if (response.isSuccessful) {
                    _accessibilitySettings.value = response.body()?.settings
                } else {
                    _error.value = "Failed to fetch settings: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun updateAccessibilitySettings(request: AccessibilitySettingsRequest) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = apiService.updateAccessibilitySettings(request)
                if (response.isSuccessful) {
                    _accessibilitySettings.value = response.body()?.settings
                } else {
                    _error.value = "Failed to update settings: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}
