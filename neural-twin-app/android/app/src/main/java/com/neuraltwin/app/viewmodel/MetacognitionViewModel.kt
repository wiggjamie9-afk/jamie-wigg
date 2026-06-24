package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

data class MetacognitiveMetrics(
  val planningScore: Float = 0f,        // 0-1, clarity of goal setting
  val monitoringScore: Float = 0f,      // 0-1, awareness of thinking
  val evaluatingScore: Float = 0f,      // 0-1, critical assessment
  val reflectingScore: Float = 0f,      // 0-1, learning integration
  val metacognitiveCoherence: Float = 0f // 0-100, weighted average
)

data class DecisionMetacognition(
  val title: String,
  val planningClarity: Int = 5,          // 1-10
  val strategyChosen: String = "",
  val monitoringComprehension: Int = 5,  // 1-10
  val evaluationEffectiveness: Int = 5,  // 1-10
  val reflectionInsights: String = "",
  val metacognitiveScore: Float = 0.5f   // 0-1
)

data class MetacognitivePhasePrompt(
  val phase: String,  // planning, monitoring, evaluating, reflecting
  val prompt: String,
  val examples: List<String>,
  val focusAreas: List<String>
)

@HiltViewModel
class MetacognitionViewModel @Inject constructor() : ViewModel() {

  private val _metacognitiveMetrics = MutableStateFlow(MetacognitiveMetrics())
  val metacognitiveMetrics: StateFlow<MetacognitiveMetrics> = _metacognitiveMetrics

  private val _currentPhase = MutableStateFlow("planning")
  val currentPhase: StateFlow<String> = _currentPhase

  private val _decisionMetacognition = MutableStateFlow(DecisionMetacognition(""))
  val decisionMetacognition: StateFlow<DecisionMetacognition> = _decisionMetacognition

  private val _phasePrompt = MutableStateFlow<MetacognitivePhasePrompt?>(null)
  val phasePrompt: StateFlow<MetacognitivePhasePrompt?> = _phasePrompt

  private val _thinkingPatterns = MutableStateFlow<Map<String, Any>>(emptyMap())
  val thinkingPatterns: StateFlow<Map<String, Any>> = _thinkingPatterns

  private val _cognitiveLoad = MutableStateFlow(0f)  // 0-1, perceived mental effort
  val cognitiveLoad: StateFlow<Float> = _cognitiveLoad

  fun getPhasePrompt(phase: String) {
    val prompt = when (phase) {
      "planning" -> MetacognitivePhasePrompt(
        phase = "planning",
        prompt = "How clear is your goal? What strategy will you use?",
        examples = listOf(
          "My goal is to decide between career options",
          "I'll compare pros/cons of each option systematically",
          "I need to identify what matters most to me first"
        ),
        focusAreas = listOf(
          "Goal clarity (1-10)",
          "Strategy selection",
          "Resource assessment",
          "Timeline consideration"
        )
      )
      "monitoring" -> MetacognitivePhasePrompt(
        phase = "monitoring",
        prompt = "What are you noticing about your thinking? Are you on track?",
        examples = listOf(
          "I'm noticing I'm avoiding certain options",
          "My emotions are influencing my logic",
          "I'm gathering enough information before deciding"
        ),
        focusAreas = listOf(
          "Thought awareness",
          "Emotion detection",
          "Progress tracking",
          "Bias recognition"
        )
      )
      "evaluating" -> MetacognitivePhasePrompt(
        phase = "evaluating",
        prompt = "How well is your approach working? What would you change?",
        examples = listOf(
          "This strategy is revealing important trade-offs",
          "I'm not considering all perspectives yet",
          "My confidence in the decision is growing"
        ),
        focusAreas = listOf(
          "Approach effectiveness (1-10)",
          "Gap identification",
          "Confidence assessment",
          "Quality check"
        )
      )
      "reflecting" -> MetacognitivePhasePrompt(
        phase = "reflecting",
        prompt = "What have you learned? How will this shape future thinking?",
        examples = listOf(
          "I learned that my values matter more than I realized",
          "This process showed me how emotions cloud judgment",
          "Next time I'll trust my instincts more"
        ),
        focusAreas = listOf(
          "Key insights",
          "Pattern recognition",
          "Knowledge integration",
          "Growth identification"
        )
      )
      else -> null
    }
    _phasePrompt.value = prompt
  }

  fun updateDecisionMetacognition(
    title: String,
    planningClarity: Int? = null,
    strategyChosen: String? = null,
    monitoringComprehension: Int? = null,
    evaluationEffectiveness: Int? = null,
    reflectionInsights: String? = null
  ) {
    val current = _decisionMetacognition.value.copy(
      title = title,
      planningClarity = planningClarity ?: _decisionMetacognition.value.planningClarity,
      strategyChosen = strategyChosen ?: _decisionMetacognition.value.strategyChosen,
      monitoringComprehension = monitoringComprehension ?: _decisionMetacognition.value.monitoringComprehension,
      evaluationEffectiveness = evaluationEffectiveness ?: _decisionMetacognition.value.evaluationEffectiveness,
      reflectionInsights = reflectionInsights ?: _decisionMetacognition.value.reflectionInsights
    )
    _decisionMetacognition.value = current
    calculateMetacognitiveScore(current)
  }

  fun updatePhase(newPhase: String) {
    _currentPhase.value = newPhase
    getPhasePrompt(newPhase)
  }

  fun updateCognitiveLoad(load: Float) {
    _cognitiveLoad.value = load.coerceIn(0f, 1f)
  }

  private fun calculateMetacognitiveScore(decision: DecisionMetacognition) {
    // Calculate composite score from 4 pillars
    val planningComponent = decision.planningClarity / 10f * 0.25f
    val monitoringComponent = decision.monitoringComprehension / 10f * 0.25f
    val evaluatingComponent = decision.evaluationEffectiveness / 10f * 0.25f
    val reflectingComponent = if (decision.reflectionInsights.isNotEmpty()) 0.25f else 0f

    val score = (planningComponent + monitoringComponent + evaluatingComponent + reflectingComponent).coerceIn(0f, 1f)

    _decisionMetacognition.value = _decisionMetacognition.value.copy(
      metacognitiveScore = score
    )
  }

  fun analyzeThinkingPatterns(decisions: List<DecisionMetacognition>) {
    // Analyze patterns across multiple decisions
    val patterns = mutableMapOf<String, Any>()

    if (decisions.isNotEmpty()) {
      val avgPlanning = decisions.map { it.planningClarity }.average()
      val avgMonitoring = decisions.map { it.monitoringComprehension }.average()
      val avgEvaluating = decisions.map { it.evaluationEffectiveness }.average()
      val strategies = decisions.map { it.strategyChosen }.filter { it.isNotEmpty() }.groupingBy { it }.eachCount()

      patterns["averagePlanning"] = avgPlanning
      patterns["averageMonitoring"] = avgMonitoring
      patterns["averageEvaluating"] = avgEvaluating
      patterns["favoriteStrategies"] = strategies.toList().sortedByDescending { it.second }.take(3)
      patterns["reflectionDepth"] = decisions.count { it.reflectionInsights.isNotEmpty() } / decisions.size.toFloat()

      // Identify growth areas
      val growthAreas = mutableListOf<String>()
      if (avgPlanning < 6) growthAreas.add("Planning clarity needs work")
      if (avgMonitoring < 6) growthAreas.add("Develop better self-monitoring")
      if (avgEvaluating < 6) growthAreas.add("Strengthen critical evaluation")

      patterns["growthAreas"] = growthAreas
    }

    _thinkingPatterns.value = patterns
  }

  fun calculateMetacognitiveCoherence(metrics: MetacognitiveMetrics): Float {
    // Weighted average of 4 pillars for 8th coherence layer
    val weight = 0.25f
    return ((metrics.planningScore +
             metrics.monitoringScore +
             metrics.evaluatingScore +
             metrics.reflectingScore) / 4f * 100f).coerceIn(0f, 100f)
  }
}
