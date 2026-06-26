package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.database.TwinChatDao
import com.neuraltwin.app.data.database.TwinChatEntity
import com.neuraltwin.app.data.models.TwinInteractionRequest
import com.neuraltwin.app.data.models.TwinsResponse
import com.neuraltwin.app.data.models.TwinHistoryResponse
import com.neuraltwin.app.data.network.Repository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Date
import java.util.UUID
import javax.inject.Inject

@HiltViewModel
class TwinViewModel @Inject constructor(
    private val repository: Repository,
    private val twinChatDao: TwinChatDao
) : ViewModel() {
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _isStreaming = MutableStateFlow(false)
    val isStreaming: StateFlow<Boolean> = _isStreaming

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _twins = MutableStateFlow<TwinsResponse?>(null)
    val twins: StateFlow<TwinsResponse?> = _twins

    private val _history = MutableStateFlow<TwinHistoryResponse?>(null)
    val history: StateFlow<TwinHistoryResponse?> = _history

    private val _twinResponse = MutableStateFlow<String?>(null)
    val twinResponse: StateFlow<String?> = _twinResponse

    private val _chatMessages = MutableStateFlow<List<TwinChatEntity>>(emptyList())
    val chatMessages: StateFlow<List<TwinChatEntity>> = _chatMessages.asStateFlow()

    private val _currentStreamingMessage = MutableStateFlow<String>("")
    val currentStreamingMessage: StateFlow<String> = _currentStreamingMessage.asStateFlow()

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

    fun loadChatHistory(twinType: String, userId: String) {
        viewModelScope.launch {
            try {
                val messages = twinChatDao.getChatHistory(twinType, userId)
                _chatMessages.value = messages
            } catch (e: Exception) {
                _error.value = "Failed to load chat history: ${e.localizedMessage}"
            }
        }
    }

    fun chatWithTwin(
        userId: String,
        twinType: String,
        twinName: String,
        twinEmoji: String,
        userMessage: String,
        metacognitivePhase: String? = null,
        contextData: Map<String, Any>? = null
    ) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _isStreaming.value = true
                _error.value = null
                _currentStreamingMessage.value = ""

                val messageId = UUID.randomUUID().toString()
                val timestamp = Date()

                // Save user message locally
                val userEntity = TwinChatEntity(
                    id = messageId,
                    twinType = twinType,
                    twinName = twinName,
                    twinEmoji = twinEmoji,
                    userId = userId,
                    userMessage = userMessage,
                    twinResponse = "",
                    isUserMessage = true,
                    metacognitivePhase = metacognitivePhase,
                    timestamp = timestamp,
                    isSynced = false
                )
                twinChatDao.insertMessage(userEntity)

                // Add to UI immediately
                val currentMessages = _chatMessages.value.toMutableList()
                currentMessages.add(userEntity)
                _chatMessages.value = currentMessages

                // Send to backend
                val request = TwinInteractionRequest(
                    userId = userId,
                    twinType = twinType,
                    userMessage = userMessage,
                    metacognitivePhase = metacognitivePhase,
                    contextData = contextData
                )

                val response = repository.chatWithTwin(request)
                if (response.isSuccessful) {
                    val twinResponse = response.body()?.response ?: ""

                    // Simulate streaming by progressively appending text
                    simulateStreamingResponse(
                        twinResponse,
                        messageId,
                        twinType,
                        twinName,
                        twinEmoji,
                        userId,
                        metacognitivePhase,
                        timestamp
                    )
                } else {
                    _error.value = "Failed to chat with twin: ${response.code()}"
                    _isStreaming.value = false
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
                _isStreaming.value = false
            } finally {
                _isLoading.value = false
            }
        }
    }

    private suspend fun simulateStreamingResponse(
        fullResponse: String,
        messageId: String,
        twinType: String,
        twinName: String,
        twinEmoji: String,
        userId: String,
        metacognitivePhase: String?,
        timestamp: Date
    ) {
        val responseMessageId = UUID.randomUUID().toString()
        var streamedText = ""

        // Simulate character-by-character streaming
        fullResponse.forEachIndexed { index, char ->
            streamedText += char
            _currentStreamingMessage.value = streamedText
            // Add a small delay to simulate streaming
            kotlinx.coroutines.delay(5)
        }

        // Save complete response locally
        val twinEntity = TwinChatEntity(
            id = responseMessageId,
            twinType = twinType,
            twinName = twinName,
            twinEmoji = twinEmoji,
            userId = userId,
            userMessage = "",
            twinResponse = fullResponse,
            isUserMessage = false,
            metacognitivePhase = metacognitivePhase,
            timestamp = Date(),
            isStreaming = false,
            isSynced = false
        )

        twinChatDao.insertMessage(twinEntity)
        twinChatDao.markAsSynced(messageId)

        // Add to UI
        val currentMessages = _chatMessages.value.toMutableList()
        currentMessages.add(twinEntity)
        _chatMessages.value = currentMessages

        _currentStreamingMessage.value = ""
        _twinResponse.value = fullResponse
        _isStreaming.value = false
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

    fun clearCurrentStreamingMessage() {
        _currentStreamingMessage.value = ""
    }

    fun refreshChatHistory(twinType: String, userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                // Fetch from backend and merge with local cache
                val response = repository.getTwinHistory(twinType, userId)
                if (response.isSuccessful) {
                    val backendInteractions = response.body()?.interactions ?: emptyList()

                    // Save backend interactions to local DB
                    backendInteractions.forEach { interaction ->
                        val entity = TwinChatEntity(
                            id = interaction.id,
                            twinType = twinType,
                            twinName = "",
                            twinEmoji = "",
                            userId = userId,
                            userMessage = interaction.userMessage,
                            twinResponse = interaction.twinResponse,
                            isUserMessage = false,
                            metacognitivePhase = interaction.phase,
                            timestamp = interaction.createdAt,
                            isSynced = true
                        )
                        twinChatDao.insertMessage(entity)
                    }

                    // Reload local messages
                    loadChatHistory(twinType, userId)
                }
            } catch (e: Exception) {
                _error.value = "Failed to refresh: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearChatHistory(twinType: String, userId: String) {
        viewModelScope.launch {
            try {
                twinChatDao.clearChatHistory(twinType, userId)
                _chatMessages.value = emptyList()
            } catch (e: Exception) {
                _error.value = "Failed to clear history: ${e.localizedMessage}"
            }
        }
    }
}
