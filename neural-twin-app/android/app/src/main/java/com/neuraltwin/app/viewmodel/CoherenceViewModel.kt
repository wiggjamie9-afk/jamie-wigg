package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.CoherenceResponse
import com.neuraltwin.app.data.models.CoherenceHistoryResponse
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

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _coherenceData = MutableStateFlow<CoherenceResponse?>(null)
    val coherenceData: StateFlow<CoherenceResponse?> = _coherenceData

    private val _coherenceHistory = MutableStateFlow<CoherenceHistoryResponse?>(null)
    val coherenceHistory: StateFlow<CoherenceHistoryResponse?> = _coherenceHistory

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
                _isLoading.value = true
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
                _isLoading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}
