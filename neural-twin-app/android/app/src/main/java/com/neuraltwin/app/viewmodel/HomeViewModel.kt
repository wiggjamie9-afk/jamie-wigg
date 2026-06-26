package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.VoiceRecordingItem
import com.neuraltwin.app.data.models.DecisionItem
import com.neuraltwin.app.data.network.Repository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _userName = MutableStateFlow("User")
    val userName: StateFlow<String> = _userName

    private val _coherenceScore = MutableStateFlow(0)
    val coherenceScore: StateFlow<Int> = _coherenceScore

    private val _recordingCount = MutableStateFlow(0)
    val recordingCount: StateFlow<Int> = _recordingCount

    private val _decisionCount = MutableStateFlow(0)
    val decisionCount: StateFlow<Int> = _decisionCount

    private val _recentRecordings = MutableStateFlow<List<VoiceRecordingItem>>(emptyList())
    val recentRecordings: StateFlow<List<VoiceRecordingItem>> = _recentRecordings

    private val _recentDecisions = MutableStateFlow<List<DecisionItem>>(emptyList())
    val recentDecisions: StateFlow<List<DecisionItem>> = _recentDecisions

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun loadDashboard(userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                // Load user info (from stored auth data)
                _userName.value = "Welcome back"

                // Load coherence
                val coherenceResponse = repository.getCoherence(userId)
                if (coherenceResponse.isSuccessful) {
                    val body = coherenceResponse.body()
                    body?.let {
                        val score = it.overallCoherence.toIntOrNull() ?: 0
                        _coherenceScore.value = score
                    }
                }

                // Load recordings
                val recordingsResponse = repository.getVoiceRecordings(userId)
                if (recordingsResponse.isSuccessful) {
                    val body = recordingsResponse.body()
                    body?.let {
                        _recentRecordings.value = it.recordings
                        _recordingCount.value = it.recordings.size
                    }
                }

                // Load decisions
                val decisionsResponse = repository.getDecisions(userId)
                if (decisionsResponse.isSuccessful) {
                    val body = decisionsResponse.body()
                    body?.let {
                        _recentDecisions.value = it.decisions
                        _decisionCount.value = it.count
                    }
                }
            } catch (e: Exception) {
                _error.value = "Error loading dashboard: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}
