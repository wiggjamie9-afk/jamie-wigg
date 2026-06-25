package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.*
import com.neuraltwin.app.data.network.ApiService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.util.Base64
import javax.inject.Inject

data class BookScanState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val scannedText: String = "",
    val simplifiedText: String = "",
    val readingTime: Int = 0,
    val wordCount: Int = 0,
    val sections: List<String> = emptyList(),
    val characterCount: Int = 0,
    val scanId: String? = null,
    val ttsUrl: String? = null,
    val ttsPlaying: Boolean = false,
    val ttsSpeed: Float = 1.0f
)

data class AccessibilityState(
    val dyslexiaMode: Boolean = true,
    val adhdMode: Boolean = true,
    val fontSize: Int = 18,
    val lineSpacing: Float = 1.8f,
    val fontFamily: String = "OpenDyslexic",
    val highContrast: Boolean = false,
    val simplifyText: Boolean = true,
    val ttsEnabled: Boolean = true,
    val ttsSpeed: Float = 1.0f,
    val focusMode: Boolean = true
)

@HiltViewModel
class BookScannerViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {

    private val _scanState = MutableStateFlow(BookScanState())
    val scanState: StateFlow<BookScanState> = _scanState

    private val _accessibilityState = MutableStateFlow(AccessibilityState())
    val accessibilityState: StateFlow<AccessibilityState> = _accessibilityState

    fun scanBook(imageBase64: String, focusArea: String = "full") {
        viewModelScope.launch {
            _scanState.value = _scanState.value.copy(isLoading = true, error = null)
            try {
                val request = BookScanRequest(
                    imageBase64 = imageBase64,
                    language = "en",
                    focusArea = focusArea
                )
                val response = apiService.scanBook(request)

                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    _scanState.value = _scanState.value.copy(
                        isLoading = false,
                        scannedText = body.originalText,
                        simplifiedText = body.simplifiedText,
                        readingTime = body.readingTime,
                        wordCount = body.wordCount,
                        characterCount = body.characterCount,
                        sections = body.sections,
                        scanId = body.scanId,
                        error = null
                    )
                } else {
                    _scanState.value = _scanState.value.copy(
                        isLoading = false,
                        error = "Failed to scan book: ${response.code()}"
                    )
                }
            } catch (e: Exception) {
                _scanState.value = _scanState.value.copy(
                    isLoading = false,
                    error = "Error scanning book: ${e.message}"
                )
            }
        }
    }

    fun generateTTS(text: String, speed: Float = 1.0f) {
        viewModelScope.launch {
            _scanState.value = _scanState.value.copy(isLoading = true)
            try {
                val request = TextToSpeechRequest(
                    text = text,
                    voiceId = "neural",
                    speed = speed
                )
                val response = apiService.generateTextToSpeech(request)

                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    _scanState.value = _scanState.value.copy(
                        isLoading = false,
                        ttsUrl = body.audioUrl,
                        ttsSpeed = body.speed,
                        error = null
                    )
                } else {
                    _scanState.value = _scanState.value.copy(
                        isLoading = false,
                        error = "Failed to generate speech"
                    )
                }
            } catch (e: Exception) {
                _scanState.value = _scanState.value.copy(
                    isLoading = false,
                    error = "Error generating speech: ${e.message}"
                )
            }
        }
    }

    fun toggleTTS() {
        _scanState.value = _scanState.value.copy(
            ttsPlaying = !_scanState.value.ttsPlaying
        )
    }

    fun updateTTSSpeed(speed: Float) {
        _scanState.value = _scanState.value.copy(ttsSpeed = speed)
    }

    fun loadAccessibilitySettings() {
        viewModelScope.launch {
            try {
                val response = apiService.getAccessibilitySettings()
                if (response.isSuccessful && response.body() != null) {
                    val settings = response.body()!!.settings
                    _accessibilityState.value = AccessibilityState(
                        dyslexiaMode = settings.dyslexiaMode,
                        adhdMode = settings.adhdMode,
                        fontSize = settings.fontSize,
                        lineSpacing = settings.lineSpacing,
                        fontFamily = settings.fontFamily,
                        highContrast = settings.highContrast,
                        simplifyText = settings.simplifyText,
                        ttsEnabled = settings.ttsEnabled,
                        ttsSpeed = settings.ttsSpeed,
                        focusMode = settings.focusMode
                    )
                }
            } catch (e: Exception) {
                // Use defaults on error
            }
        }
    }

    fun updateAccessibilitySettings(settings: AccessibilityState) {
        viewModelScope.launch {
            try {
                val request = AccessibilitySettingsRequest(
                    dyslexiaMode = settings.dyslexiaMode,
                    adhdMode = settings.adhdMode,
                    fontSize = settings.fontSize,
                    lineSpacing = settings.lineSpacing,
                    fontFamily = settings.fontFamily,
                    highContrast = settings.highContrast,
                    simplifyText = settings.simplifyText,
                    ttsEnabled = settings.ttsEnabled,
                    ttsSpeed = settings.ttsSpeed,
                    focusMode = settings.focusMode
                )
                val response = apiService.updateAccessibilitySettings(request)

                if (response.isSuccessful) {
                    _accessibilityState.value = settings
                }
            } catch (e: Exception) {
                // Log error but don't crash
            }
        }
    }

    fun clearScan() {
        _scanState.value = BookScanState()
    }
}
