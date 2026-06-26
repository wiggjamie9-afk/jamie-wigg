package com.neuraltwin.app.viewmodel

import android.content.Context
import android.media.MediaRecorder
import android.os.Build
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.EmotionResult
import com.neuraltwin.app.data.models.VoiceRecordingRequest
import com.neuraltwin.app.data.network.Repository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.io.File
import java.util.Base64
import javax.inject.Inject

enum class Emotion {
    Happy, Sad, Angry, Neutral, Surprised, Fearful, Disgusted
}

data class EmotionResultLocal(
    val emotion: Emotion,
    val confidence: Float,
    val acousticFeatures: Map<String, Float> = emptyMap()
)

@HiltViewModel
class VoiceRecorderViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _isRecording = MutableStateFlow(false)
    val isRecording: StateFlow<Boolean> = _isRecording

    private val _recordingTime = MutableStateFlow("0:00")
    val recordingTime: StateFlow<String> = _recordingTime

    private val _waveProgress = MutableStateFlow(0f)
    val waveProgress: StateFlow<Float> = _waveProgress

    private val _emotionResult = MutableStateFlow<EmotionResultLocal?>(null)
    val emotionResult: StateFlow<EmotionResultLocal?> = _emotionResult

    private val _audioUri = MutableStateFlow<String?>(null)
    val audioUri: StateFlow<String?> = _audioUri

    private val _isUploading = MutableStateFlow(false)
    val isUploading: StateFlow<Boolean> = _isUploading

    private val _uploadError = MutableStateFlow<String?>(null)
    val uploadError: StateFlow<String?> = _uploadError

    private val _uploadSuccess = MutableStateFlow(false)
    val uploadSuccess: StateFlow<Boolean> = _uploadSuccess

    private var mediaRecorder: MediaRecorder? = null
    private var recordingFile: File? = null
    private var recordingStartTime: Long = 0L
    private var timerJob: Job? = null
    private var currentContext: Context? = null

    fun initializeRecorder(context: Context) {
        this.currentContext = context
    }

    fun startRecording() {
        if (currentContext == null) {
            _uploadError.value = "Context not initialized"
            return
        }

        try {
            _isRecording.value = true
            _emotionResult.value = null
            _recordingTime.value = "0:00"
            _uploadSuccess.value = false

            // Create audio file in cache directory
            recordingFile = File(currentContext!!.cacheDir, "voice_${System.currentTimeMillis()}.wav")

            // Initialize MediaRecorder
            mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                MediaRecorder(currentContext!!)
            } else {
                @Suppress("DEPRECATION")
                MediaRecorder()
            }

            mediaRecorder?.apply {
                setAudioSource(MediaRecorder.AudioSource.MIC)
                setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                setAudioSamplingRate(44100)
                setAudioEncodingBitRate(128000)
                setOutputFile(recordingFile!!.absolutePath)
                prepare()
                start()
            }

            recordingStartTime = System.currentTimeMillis()
            startTimerUpdates()
            _uploadError.value = null
        } catch (e: Exception) {
            _isRecording.value = false
            _uploadError.value = "Failed to start recording: ${e.localizedMessage}"
        }
    }

    fun stopRecording() {
        try {
            mediaRecorder?.apply {
                stop()
                release()
            }
            mediaRecorder = null
            timerJob?.cancel()
            _isRecording.value = false

            // Simulate emotion detection (in production, send to backend or ML model)
            _emotionResult.value = EmotionResultLocal(
                emotion = Emotion.Neutral,
                confidence = 0.82f,
                acousticFeatures = mapOf(
                    "pitch" to 120f,
                    "speechRate" to 150f,
                    "jitter" to 0.02f,
                    "shimmer" to 0.05f,
                )
            )
        } catch (e: Exception) {
            _uploadError.value = "Failed to stop recording: ${e.localizedMessage}"
            _isRecording.value = false
        }
    }

    fun uploadRecording(
        userId: String,
        context: String? = null,
        location: String? = null,
        decisionTitle: String? = null,
        planningClarity: Int? = null
    ) {
        if (recordingFile == null || !recordingFile!!.exists()) {
            _uploadError.value = "No recording file found"
            return
        }

        viewModelScope.launch(Dispatchers.IO) {
            try {
                _isUploading.value = true
                _uploadError.value = null

                // Read file and convert to Base64
                val audioBytes = recordingFile!!.readBytes()
                val audioBase64 = Base64.getEncoder().encodeToString(audioBytes)

                // Create upload request
                val request = VoiceRecordingRequest(
                    userId = userId,
                    audioBase64 = audioBase64,
                    context = context,
                    location = location,
                    decisionTitle = decisionTitle,
                    planningClarity = planningClarity
                )

                // Upload to backend
                val response = repository.uploadVoiceRecording(request)

                if (response.isSuccessful) {
                    _uploadSuccess.value = true
                    _uploadError.value = null
                    // Clean up file after successful upload
                    recordingFile?.delete()
                    recordingFile = null
                } else {
                    _uploadError.value = "Upload failed: ${response.code()} ${response.message()}"
                }
            } catch (e: Exception) {
                _uploadError.value = "Upload error: ${e.localizedMessage}"
            } finally {
                _isUploading.value = false
            }
        }
    }

    fun clearRecording() {
        _emotionResult.value = null
        _audioUri.value = null
        _recordingTime.value = "0:00"
        _uploadSuccess.value = false
        recordingFile?.delete()
        recordingFile = null
    }

    fun updateWaveProgress(progress: Float) {
        _waveProgress.value = progress.coerceIn(0f, 1f)
    }

    fun clearError() {
        _uploadError.value = null
    }

    private fun startTimerUpdates() {
        timerJob = viewModelScope.launch {
            while (_isRecording.value) {
                val elapsed = System.currentTimeMillis() - recordingStartTime
                val seconds = (elapsed / 1000) % 60
                val minutes = (elapsed / 60000) % 60
                _recordingTime.value = String.format("%d:%02d", minutes, seconds)

                // Animate wave progress
                val wavePhase = (elapsed % 1000) / 1000f
                updateWaveProgress(0.5f + 0.5f * kotlin.math.sin(wavePhase * Math.PI.toFloat()))

                delay(100)
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        mediaRecorder?.release()
        mediaRecorder = null
        timerJob?.cancel()
        recordingFile?.delete()
    }
}
