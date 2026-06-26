// Reference: DecisionLoggingScreen Data Model & ViewModel Integration

package com.neuraltwin.app.data.models

import com.google.gson.annotations.SerializedName

// ============================================================================
// REQUEST MODEL (What the screen sends to the API)
// ============================================================================

data class DecisionRequest(
    val userId: String,
    val title: String,
    val description: String,
    val options: Map<String, String> = emptyMap(),
    val chosenOption: String,
    val reasoning: String,
    val category: String? = null,
    val confidence: Float? = null,
    val planningClarity: Int = 5,
    val strategyChosen: String? = null,
    val monitoringComprehension: Int = 5,
    val evaluationEffectiveness: Int = 5,
    val reflectionInsights: String? = null
)

// Example JSON request from DecisionLoggingScreen:
/*
{
  "userId": "user_123",
  "title": "Career Change Decision",
  "description": "Considering switch from engineering to product management",
  "options": {},
  "chosenOption": "Accept product manager role at TechCo",
  "reasoning": "Better growth opportunities, more strategic impact, aligned with long-term goals",
  "category": "career",
  "planningClarity": 7,
  "monitoringComprehension": 6,
  "evaluationEffectiveness": 5,
  "reflectionInsights": "Realized I need to focus on cross-functional communication skills"
}
*/

// ============================================================================
// RESPONSE MODEL (What the API returns)
// ============================================================================

data class DecisionResponse(
    @SerializedName("decisionId")
    val decisionId: String,

    @SerializedName("message")
    val message: String,

    @SerializedName("analysis")
    val analysis: String? = null,

    @SerializedName("score")
    val score: Float? = null,

    @SerializedName("timestamp")
    val timestamp: String? = null
)

// Example API response:
/*
{
  "decisionId": "dec_abc123def456",
  "message": "Decision logged successfully",
  "analysis": "Strong planning clarity with good reasoning. Consider monitoring outcomes more closely.",
  "score": 72.5,
  "timestamp": "2024-01-15T10:30:00Z"
}
*/

// ============================================================================
// UI MODEL (What the screen displays after success)
// ============================================================================

data class DecisionLoggingResponse(
    val id: String,
    val title: String,
    val description: String,
    val metacognitiveBreakdown: MetacognitiveBreakdown,
    val insightData: String? = null,
    val timestamp: String
)

data class MetacognitiveBreakdown(
    val planning: Int,           // 1-10
    val monitoring: Int,         // 1-10
    val evaluation: Int          // 1-10
)

// Example UI response (what DecisionViewModel creates):
/*
DecisionLoggingResponse(
  id = "dec_abc123def456",
  title = "Career Change Decision",
  description = "Considering switch from engineering to product management",
  metacognitiveBreakdown = MetacognitiveBreakdown(
    planning = 7,
    monitoring = 6,
    evaluation = 5
  ),
  insightData = "Strong planning clarity with good reasoning...",
  timestamp = "Jan 15, 2024 at 10:30"
)
*/

// ============================================================================
// DECISION HISTORY MODEL (For displaying past decisions)
// ============================================================================

data class DecisionsResponse(
    @SerializedName("decisions")
    val decisions: List<DecisionItem>,

    @SerializedName("total")
    val total: Int,

    @SerializedName("page")
    val page: Int
)

data class DecisionItem(
    @SerializedName("id")
    val id: String,

    @SerializedName("title")
    val title: String,

    @SerializedName("category")
    val category: String,

    @SerializedName("chosenOption")
    val chosenOption: String,

    @SerializedName("reasoning")
    val reasoning: String,

    @SerializedName("metacognitiveScore")
    val metacognitiveScore: Float,  // Average of planning, monitoring, evaluation

    @SerializedName("createdAt")
    val createdAt: String
)

// ============================================================================
// PATTERNS MODEL (For decision analysis)
// ============================================================================

data class DecisionPatternsResponse(
    @SerializedName("patterns")
    val patterns: List<DecisionPattern>,

    @SerializedName("insights")
    val insights: String,

    @SerializedName("recommendations")
    val recommendations: List<String>
)

data class DecisionPattern(
    @SerializedName("category")
    val category: String,

    @SerializedName("averageScore")
    val averageScore: Float,

    @SerializedName("decisionCount")
    val decisionCount: Int,

    @SerializedName("trend")
    val trend: String  // "improving", "declining", "stable"
)

// ============================================================================
// VIEWMODEL IMPLEMENTATION REFERENCE
// ============================================================================

/*
class DecisionViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {

    // UI State
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _decisionResponse = MutableStateFlow<DecisionLoggingResponse?>(null)
    val decisionResponse: StateFlow<DecisionLoggingResponse?> = _decisionResponse

    // Main logging function (called by DecisionLoggingScreen)
    fun logDecision(
        userId: String,
        title: String,
        description: String,
        chosenOption: String,
        reasoning: String,
        category: String? = null,
        planningClarity: Int = 5,
        monitoringComprehension: Int = 5,
        evaluationEffectiveness: Int = 5,
        reflectionInsights: String? = null
    ) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                // Build request from screen inputs
                val request = DecisionRequest(
                    userId = userId,
                    title = title,
                    description = description,
                    options = emptyMap(),
                    chosenOption = chosenOption,
                    reasoning = reasoning,
                    category = category,
                    planningClarity = planningClarity,
                    monitoringComprehension = monitoringComprehension,
                    evaluationEffectiveness = evaluationEffectiveness,
                    reflectionInsights = reflectionInsights
                )

                // Call API
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

    fun resetResponse() {
        _decisionResponse.value = null
    }

    fun clearError() {
        _error.value = null
    }

    private fun getCurrentTimestamp(): String {
        val formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm")
        return LocalDateTime.now().format(formatter)
    }
}
*/

// ============================================================================
// REPOSITORY IMPLEMENTATION REFERENCE
// ============================================================================

/*
class Repository @Inject constructor(
    private val apiService: ApiService
) {

    suspend fun logDecision(request: DecisionRequest): Response<DecisionResponse> {
        return apiService.logDecision(request)
    }

    suspend fun getDecisions(userId: String, category: String? = null): Response<DecisionsResponse> {
        return apiService.getDecisions(userId, category)
    }

    suspend fun analyzeDecisionPatterns(userId: String): Response<DecisionPatternsResponse> {
        return apiService.analyzeDecisionPatterns(userId)
    }
}
*/

// ============================================================================
// API SERVICE INTERFACE
// ============================================================================

/*
interface ApiService {

    @POST("/api/decisions/log")
    suspend fun logDecision(@Body request: DecisionRequest): Response<DecisionResponse>

    @GET("/api/decisions")
    suspend fun getDecisions(
        @Query("userId") userId: String,
        @Query("category") category: String? = null
    ): Response<DecisionsResponse>

    @GET("/api/decisions/patterns")
    suspend fun analyzeDecisionPatterns(
        @Query("userId") userId: String
    ): Response<DecisionPatternsResponse>
}
*/

// ============================================================================
// FLOW DIAGRAM: DecisionLoggingScreen → ViewModel → Repository → API
// ============================================================================

/*
USER INPUT (DecisionLoggingScreen)
        ↓
  [Form State]
        ↓
  Submit Button Click
        ↓
  viewModel.logDecision(
    title = "Career Change",
    chosenOption = "Accept PM role",
    reasoning = "Better growth...",
    planningClarity = 7,
    monitoringComprehension = 6,
    evaluationEffectiveness = 5
  )
        ↓
  [ViewModel: isLoading = true]
        ↓
  [Repository.logDecision(request)]
        ↓
  [Retrofit: POST /api/decisions/log]
        ↓
  API Response
        ↓
  Success: DecisionResponse(id=..., analysis=...)
  Error: response.code() 400/500/etc
        ↓
  [ViewModel: isLoading = false]
        ↓
  [ViewModel: error = null OR error = message]
        ↓
  [ViewModel: decisionResponse = uiResponse]
        ↓
  [Screen: collectAsState() updates UI]
        ↓
  Success Card Displays
        ↓
  Auto-Dismisses (3 seconds)
        ↓
  Form Clears
        ↓
  Ready for next decision
*/

// ============================================================================
// SAMPLE API REQUEST/RESPONSE
// ============================================================================

// REQUEST (from DecisionLoggingScreen.submitButton):
/*
POST /api/decisions/log
Content-Type: application/json

{
  "userId": "user_123",
  "title": "Career Change Decision",
  "description": "Considering switch from engineering to product management",
  "options": {},
  "chosenOption": "Accept product manager role at TechCo",
  "reasoning": "Better growth opportunities, more strategic impact, aligned with long-term goals",
  "category": "career",
  "confidence": null,
  "planningClarity": 7,
  "strategyChosen": null,
  "monitoringComprehension": 6,
  "evaluationEffectiveness": 5,
  "reflectionInsights": "Realized I need to focus on cross-functional communication skills"
}
*/

// RESPONSE (API returns):
/*
HTTP/1.1 200 OK
Content-Type: application/json

{
  "decisionId": "dec_abc123def456",
  "message": "Decision logged successfully",
  "analysis": "Strong planning clarity (7/10) with good reasoning. Monitor outcomes more closely.",
  "score": 72.5,
  "timestamp": "2024-01-15T10:30:00Z"
}
*/

// UI RESULT (Screen displays):
/*
✓ Decision logged successfully!

[Form clears after 3 seconds]

Planning Clarity: 7/10
Monitoring: 6/10
Evaluation: 5/10

Insight: "Strong planning clarity (7/10) with good reasoning..."
*/

// ============================================================================
// VALIDATION RULES
// ============================================================================

/*
REQUIRED FIELDS (Screen validation):
✓ decisionTitle - Must not be empty
✓ chosenOption - Must not be empty
✓ reasoning - Must not be empty
✓ category - Must be one of: general, financial, career, health, relationship, other

RANGE VALIDATION:
✓ planningClarity - 1-10 (Integer)
✓ monitoringComprehension - 1-10 (Integer)
✓ evaluationEffectiveness - 1-10 (Integer)

OPTIONAL FIELDS (Can be null/empty):
- description
- reflectionInsights

SERVER-SIDE VALIDATION (API should verify):
- title length (e.g., max 255 chars)
- reasoning length (e.g., max 2000 chars)
- Valid userId exists
- Valid category
- Sliders are integers 1-10
*/

// ============================================================================
// ERROR SCENARIOS & HANDLING
// ============================================================================

/*
SCENARIO 1: Network Error
viewModel.error = "Error: Unable to connect to server"
→ Red card displays
→ User can retry

SCENARIO 2: Invalid Request (400)
viewModel.error = "Failed to log decision: 400"
→ Red card displays
→ Likely validation error on backend

SCENARIO 3: Server Error (500)
viewModel.error = "Failed to log decision: 500"
→ Red card displays
→ Server-side issue, retry later

SCENARIO 4: Missing Required Field
Submit button disabled
→ User must fill: title, chosenOption, reasoning
→ Visual cue: red asterisks on field labels

SCENARIO 5: Slow Network
isLoading = true → Spinner shows in button
→ Button disabled during request
→ User cannot double-submit
*/
