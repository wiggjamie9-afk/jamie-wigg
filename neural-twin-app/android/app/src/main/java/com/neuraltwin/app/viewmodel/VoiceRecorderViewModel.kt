package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

enum class Emotion {
    Happy, Sad, Angry, Neutral, Surprised, Fearful, Disgusted
}

data class EmotionResult(
    val emotion: Emotion,
    val confidence: Float,
    val acousticFeatures: Map<String, Float> = emptyMap()
)

@HiltViewModel
class VoiceRecorderViewModel @Inject constructor() : ViewModel() {
    private val _isRecording = MutableStateFlow(false)
    val isRecording: StateFlow<Boolean> = _isRecording

    private val _recordingTime = MutableStateFlow("0:00")
    val recordingTime: StateFlow<String> = _recordingTime

    private val _waveProgress = MutableStateFlow(0f)
    val waveProgress: StateFlow<Float> = _waveProgress

    private val _emotionResult = MutableStateFlow<EmotionResult?>(null)
    val emotionResult: StateFlow<EmotionResult?> = _emotionResult

    private val _audioUri = MutableStateFlow<String?>(null)
    val audioUri: StateFlow<String?> = _audioUri

    fun startRecording() {
        _isRecording.value = true
        _emotionResult.value = null
        _recordingTime.value = "0:00"
        // TODO: Initialize MediaRecorder and start recording
    }

    fun stopRecording() {
        _isRecording.value = false
        // TODO: Stop MediaRecorder, extract features, detect emotion
        _emotionResult.value = EmotionResult(
            emotion = Emotion.Neutral,
            confidence = 0.82f,
            acousticFeatures = mapOf(
                "pitch" to 120f,
                "speechRate" to 150f,
                "jitter" to 0.02f,
                "shimmer" to 0.05f,
            )
        )
        // TODO: Upload to backend
    }

    fun clearRecording() {
        _emotionResult.value = null
        _audioUri.value = null
        _recordingTime.value = "0:00"
    }

    fun updateWaveProgress(progress: Float) {
        _waveProgress.value = progress.coerceIn(0f, 1f)
    }
}
