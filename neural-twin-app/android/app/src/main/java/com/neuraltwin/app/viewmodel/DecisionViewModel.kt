package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.DecisionRequest
import com.neuraltwin.app.data.models.DecisionsResponse
import com.neuraltwin.app.data.models.DecisionPatternsResponse
import com.neuraltwin.app.data.models.DecisionResponse
import com.neuraltwin.app.data.network.Repository
import com.neuraltwin.app.ui.screens.DecisionLoggingResponse
import com.neuraltwin.app.ui.screens.MetacognitiveBreakdown
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import javax.inject.Inject

@HiltViewModel
class DecisionViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _decisions = MutableStateFlow<DecisionsResponse?>(null)
    val decisions: StateFlow<DecisionsResponse?> = _decisions

    private val _patterns = MutableStateFlow<DecisionPatternsResponse?>(null)
    val patterns: StateFlow<DecisionPatternsResponse?> = _patterns

    private val _decisionResponse = MutableStateFlow<DecisionLoggingResponse?>(null)
    val decisionResponse: StateFlow<DecisionLoggingResponse?> = _decisionResponse

    fun logDecision(
        userId: String,
        title: String,
        description: String,
        options: Map<String, String> = emptyMap(),
        chosenOption: String = "",
        reasoning: String,
        category: String? = null,
        confidence: Float? = null,
        planningClarity: Int = 5,
        strategyChosen: String? = null,
        monitoringComprehension: Int = 5,
        evaluationEffectiveness: Int = 5,
        reflectionInsights: String? = null
    ) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val request = DecisionRequest(
                    userId = userId,
                    title = title,
                    description = description,
                    options = options,
                    chosenOption = chosenOption.ifEmpty { category ?: "decision" },
                    reasoning = reasoning,
                    category = category,
                    confidence = confidence,
                    planningClarity = planningClarity,
                    strategyChosen = strategyChosen,
                    monitoringComprehension = monitoringComprehension,
                    evaluationEffectiveness = evaluationEffectiveness,
                    reflectionInsights = reflectionInsights
                )

                val response = repository.logDecision(request)
                if (response.isSuccessful) {
                    val apiResponse = response.body()
                    if (apiResponse != null) {
                        // Transform API response to UI model
                        val uiResponse = DecisionLoggingResponse(
                            id = apiResponse.decisionId,
                            title = title,
                            description = description,
                            metacognitiveBreakdown = MetacognitiveBreakdown(
                                planning = planningClarity,
                                monitoring = monitoringComprehension,
                                evaluation = evaluationEffectiveness
                            ),
                            insightData = apiResponse.analysis,
                            timestamp = getCurrentTimestamp()
                        )
                        _decisionResponse.value = uiResponse
                    }
                    _error.value = null
                } else {
                    _error.value = "Failed to log decision: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getDecisions(userId: String, category: String? = null) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = repository.getDecisions(userId, category)
                if (response.isSuccessful) {
                    _decisions.value = response.body()
                } else {
                    _error.value = "Failed to fetch decisions: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Error: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun analyzePatterns(userId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                val response = repository.analyzeDecisionPatterns(userId)
                if (response.isSuccessful) {
                    _patterns.value = response.body()
                } else {
                    _error.value = "Failed to analyze patterns: ${response.code()}"
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

    fun resetResponse() {
        _decisionResponse.value = null
    }

    private fun getCurrentTimestamp(): String {
        val formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm")
        return LocalDateTime.now().format(formatter)
    }
}
