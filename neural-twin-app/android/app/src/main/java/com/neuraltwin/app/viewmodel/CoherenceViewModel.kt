package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.CoherenceResponse
import com.neuraltwin.app.data.models.CoherenceHistoryResponse
import com.neuraltwin.app.data.models.CoherenceMetricDetail
import com.neuraltwin.app.data.network.Repository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CoherenceViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _isHistoryLoading = MutableStateFlow(false)
    val isHistoryLoading: StateFlow<Boolean> = _isHistoryLoading

    private val _isDetailLoading = MutableStateFlow(false)
    val isDetailLoading: StateFlow<Boolean> = _isDetailLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _coherenceData = MutableStateFlow<CoherenceResponse?>(null)
    val coherenceData: StateFlow<CoherenceResponse?> = _coherenceData

    private val _coherenceHistory = MutableStateFlow<CoherenceHistoryResponse?>(null)
    val coherenceHistory: StateFlow<CoherenceHistoryResponse?> = _coherenceHistory

    private val _coherenceMetric = MutableStateFlow<CoherenceMetricDetail?>(null)
    val coherenceMetric: StateFlow<CoherenceMetricDetail?> = _coherenceMetric

    private val _selectedLayerId = MutableStateFlow<String?>(null)
    val selectedLayerId: StateFlow<String?> = _selectedLayerId

    fun getCoherence(userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = repository.getCoherence(userId)
                if (response.isSuccessful) {
                    _coherenceData.value = response.body()
                } else {
                    _error.value = "Failed to fetch coherence: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getCoherenceHistory(userId: String, timeframe: String = "7d") {
        viewModelScope.launch {
            try {
                _isHistoryLoading.value = true
                _error.value = null

                val response = repository.getCoherenceHistory(userId, timeframe)
                if (response.isSuccessful) {
                    _coherenceHistory.value = response.body()
                } else {
                    _error.value = "Failed to fetch history: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isHistoryLoading.value = false
            }
        }
    }

    fun getCoherenceMetric(metricId: String) {
        viewModelScope.launch {
            try {
                _isDetailLoading.value = true
                _error.value = null

                val response = repository.getCoherenceMetric(metricId)
                if (response.isSuccessful) {
                    _coherenceMetric.value = response.body()?.metric
                } else {
                    _error.value = "Failed to fetch metric: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isDetailLoading.value = false
            }
        }
    }

    fun selectLayer(layerId: String?) {
        _selectedLayerId.value = layerId
    }

    fun clearError() {
        _error.value = null
    }
}
