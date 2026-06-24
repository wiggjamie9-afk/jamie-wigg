package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.TwinInteractionRequest
import com.neuraltwin.app.data.models.TwinsResponse
import com.neuraltwin.app.data.models.TwinHistoryResponse
import com.neuraltwin.app.data.network.Repository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class TwinViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _twins = MutableStateFlow<TwinsResponse?>(null)
    val twins: StateFlow<TwinsResponse?> = _twins

    private val _history = MutableStateFlow<TwinHistoryResponse?>(null)
    val history: StateFlow<TwinHistoryResponse?> = _history

    private val _twinResponse = MutableStateFlow<String?>(null)
    val twinResponse: StateFlow<String?> = _twinResponse

    fun getTwins(userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = repository.getTwins(userId)
                if (response.isSuccessful) {
                    _twins.value = response.body()
                } else {
                    _error.value = "Failed to fetch twins: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun chatWithTwin(
        userId: String,
        twinType: String,
        userMessage: String,
        metacognitivePhase: String? = null,
        contextData: Map<String, Any>? = null
    ) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val request = TwinInteractionRequest(
                    userId = userId,
                    twinType = twinType,
                    userMessage = userMessage,
                    metacognitivePhase = metacognitivePhase,
                    contextData = contextData
                )

                val response = repository.chatWithTwin(request)
                if (response.isSuccessful) {
                    _twinResponse.value = response.body()?.response
                } else {
                    _error.value = "Failed to chat with twin: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getTwinHistory(twinType: String, userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = repository.getTwinHistory(twinType, userId)
                if (response.isSuccessful) {
                    _history.value = response.body()
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
