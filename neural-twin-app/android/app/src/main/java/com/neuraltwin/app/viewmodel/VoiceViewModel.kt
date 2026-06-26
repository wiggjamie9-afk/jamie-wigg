package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.EmotionResult
import com.neuraltwin.app.data.models.VoiceRecordingRequest
import com.neuraltwin.app.data.models.VoiceRecordingResponse
import com.neuraltwin.app.data.models.VoiceRecordingsResponse
import com.neuraltwin.app.data.network.Repository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * VoiceViewModel handles voice recording data fetching and history management.
 * For actual recording operations, use VoiceRecorderViewModel.
 */
@HiltViewModel
class VoiceViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _uploadSuccess = MutableStateFlow(false)
    val uploadSuccess: StateFlow<Boolean> = _uploadSuccess

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _voiceRecordings = MutableStateFlow<VoiceRecordingsResponse?>(null)
    val voiceRecordings: StateFlow<VoiceRecordingsResponse?> = _voiceRecordings

    private val _lastEmotionResult = MutableStateFlow<EmotionResult?>(null)
    val lastEmotionResult: StateFlow<EmotionResult?> = _lastEmotionResult

    fun uploadVoiceRecording(
        userId: String,
        audioBase64: String,
        context: String? = null,
        location: String? = null,
        decisionTitle: String? = null,
        planningClarity: Int? = null
    ) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val request = VoiceRecordingRequest(
                    userId = userId,
                    audioBase64 = audioBase64,
                    context = context,
                    location = location,
                    decisionTitle = decisionTitle,
                    planningClarity = planningClarity
                )

                val response = repository.uploadVoiceRecording(request)
                if (response.isSuccessful) {
                    _uploadSuccess.value = true
                    _error.value = null
                    // Store emotion result from response
                    response.body()?.emotion?.let { emotion ->
                        _lastEmotionResult.value = emotion
                    }
                } else {
                    _error.value = "Failed to upload voice recording: ${response.code()} ${response.message()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getVoiceRecordings(userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = repository.getVoiceRecordings(userId)
                if (response.isSuccessful) {
                    _voiceRecordings.value = response.body()
                } else {
                    _error.value = "Failed to fetch recordings: ${response.code()}"
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

    fun resetUploadSuccess() {
        _uploadSuccess.value = false
    }
}
