import Foundation

enum APIError: Error, LocalizedError {
  case invalidURL
  case invalidRequest
  case networkError(Error)
  case invalidResponse
  case decodingError(Error)
  case serverError(code: Int, message: String)

  var errorDescription: String? {
    switch self {
    case .invalidURL:
      return "Invalid URL"
    case .invalidRequest:
      return "Invalid request"
    case .networkError(let error):
      return "Network error: \(error.localizedDescription)"
    case .invalidResponse:
      return "Invalid response from server"
    case .decodingError(let error):
      return "Failed to decode response: \(error.localizedDescription)"
    case .serverError(let code, let message):
      return "Server error (\(code)): \(message)"
    }
  }
}

class APIClient {
  static let shared = APIClient()

  private let baseURL = "http://localhost:5000/api"
  private let session: URLSession

  init() {
    let config = URLSessionConfiguration.default
    config.timeoutIntervalForRequest = 60
    config.timeoutIntervalForResource = 60
    config.httpShouldSetCookies = true
    config.httpCookieAcceptPolicy = .always
    config.httpShouldUsePipelining = true
    self.session = URLSession(configuration: config)
  }

  private func buildRequest(
    _ path: String,
    method: String = "GET",
    body: Data? = nil
  ) -> URLRequest? {
    guard let url = URL(string: baseURL + path) else {
      return nil
    }

    var request = URLRequest(url: url)
    request.httpMethod = method
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("application/json", forHTTPHeaderField: "Accept")

    // Add auth token if not an auth route and token exists
    if !path.contains("/auth/") {
      if let token = TokenStore.shared.token {
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
      }
    }

    if let body = body {
      request.httpBody = body
    }

    return request
  }

  func login(email: String, password: String) async throws -> AuthResponse {
    let loginRequest = LoginRequest(email: email, password: password)
    let data = try JSONEncoder().encode(loginRequest)

    guard let request = buildRequest("/auth/login", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func register(email: String, password: String, name: String) async throws -> AuthResponse {
    let registerRequest = RegisterRequest(email: email, password: password, name: name)
    let data = try JSONEncoder().encode(registerRequest)

    guard let request = buildRequest("/auth/register", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  // ============================================================================
  // Voice Endpoints
  // ============================================================================

  /// Upload voice recording with emotion analysis
  /// Backend contract: POST /api/voice
  /// Request: {audioBase64, context, location, decisionTitle, planningClarity}
  /// Response: {id, userId, audioUrl, emotionResult: {emotions, confidence}, timestamp}
  func uploadVoiceRecording(
    audioBase64: String,
    context: String? = nil,
    location: String? = nil,
    decisionTitle: String? = nil,
    planningClarity: Int? = nil
  ) async throws -> VoiceRecordingResponse {
    guard let userId = TokenStore.shared.userId else {
      throw APIError.serverError(code: 401, message: "Not authenticated")
    }

    let voiceRequest = VoiceRecordingRequest(
      userId: userId,
      audioBase64: audioBase64,
      context: context,
      location: location,
      decisionTitle: decisionTitle,
      planningClarity: planningClarity
    )
    let data = try JSONEncoder().encode(voiceRequest)

    guard let request = buildRequest("/voice", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getVoiceRecordings() async throws -> VoiceRecordingsResponse {
    guard let request = buildRequest("/voice", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getVoiceRecording(id: String) async throws -> VoiceRecordingDetailResponse {
    guard let request = buildRequest("/voice/\(id)", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  // ============================================================================
  // Decision Endpoints
  // ============================================================================

  func logDecision(
    title: String,
    description: String,
    category: String?,
    chosenOption: String = "",
    reasoning: String = "",
    planningClarity: Int = 5,
    monitoringComprehension: Int = 5,
    evaluationEffectiveness: Int = 5,
    reflectionInsights: String? = nil
  ) async throws -> DecisionResponse {
    guard let userId = TokenStore.shared.userId else {
      throw APIError.serverError(code: 401, message: "Not authenticated")
    }

    let decisionRequest = DecisionRequest(
      userId: userId,
      title: title,
      description: description,
      options: [:],
      chosenOption: chosenOption,
      reasoning: reasoning,
      category: category ?? "general",
      confidence: nil,
      planningClarity: planningClarity,
      strategyChosen: nil,
      monitoringComprehension: monitoringComprehension,
      evaluationEffectiveness: evaluationEffectiveness,
      reflectionInsights: reflectionInsights
    )
    let data = try JSONEncoder().encode(decisionRequest)

    guard let request = buildRequest("/decisions", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getDecisions() async throws -> DecisionsResponse {
    guard let request = buildRequest("/decisions", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getDecision(id: String) async throws -> DecisionDetailResponse {
    guard let request = buildRequest("/decisions/\(id)", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func analyzeDecisionPatterns() async throws -> DecisionPatternsResponse {
    guard let request = buildRequest("/decisions/patterns/analysis", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  // ============================================================================
  // Twin Endpoints
  // ============================================================================

  func chatWithTwin(twinType: String, userMessage: String) async throws -> TwinInteractionResponse {
    guard let userId = TokenStore.shared.userId else {
      throw APIError.serverError(code: 401, message: "Not authenticated")
    }

    let interactionRequest = TwinInteractionRequest(
      userId: userId,
      twinType: twinType,
      userMessage: userMessage,
      metacognitivePhase: nil,
      contextData: nil
    )
    let data = try JSONEncoder().encode(interactionRequest)

    guard let request = buildRequest("/twins/interaction", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getTwins() async throws -> TwinsResponse {
    guard let request = buildRequest("/twins", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getTwinHistory(twinType: String) async throws -> TwinHistoryResponse {
    guard let request = buildRequest("/twins/\(twinType)/history", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  /// Stream chat response from Twin (for real-time response display)
  /// Returns an async sequence of String chunks from Claude API
  func streamTwinResponse(twinType: String, userMessage: String) async throws -> AsyncThrowingStream<String, Error> {
    guard let userId = TokenStore.shared.userId else {
      throw APIError.serverError(code: 401, message: "Not authenticated")
    }

    let interactionRequest = TwinInteractionRequest(
      userId: userId,
      twinType: twinType,
      userMessage: userMessage,
      metacognitivePhase: nil,
      contextData: nil
    )
    let data = try JSONEncoder().encode(interactionRequest)

    guard let request = buildRequest("/twins/interaction/stream", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return AsyncThrowingStream { continuation in
      Task {
        do {
          let (asyncBytes, response) = try await session.bytes(for: request)

          guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
          }

          if !(200..<300).contains(httpResponse.statusCode) {
            throw APIError.serverError(
              code: httpResponse.statusCode,
              message: "Stream error: HTTP \(httpResponse.statusCode)"
            )
          }

          // Process streaming response line by line (SSE format)
          for try await line in asyncBytes.lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            if trimmed.isEmpty { continue }

            // Parse Server-Sent Events format: "data: {json}" or "data: text"
            if trimmed.hasPrefix("data: ") {
              let dataContent = String(trimmed.dropFirst(6))
              // Try JSON parsing first (if structured), otherwise treat as plain text
              if let jsonData = dataContent.data(using: .utf8) {
                if let json = try? JSONDecoder().decode([String: String].self, from: jsonData),
                   let content = json["content"] {
                  continuation.yield(content)
                } else {
                  // Fallback to plain text
                  continuation.yield(dataContent)
                }
              }
            }
          }

          continuation.finish()
        } catch {
          continuation.finish(throwing: error)
        }
      }
    }
  }

  // ============================================================================
  // Coherence Endpoints
  // ============================================================================

  func getCoherence() async throws -> CoherenceResponse {
    guard let request = buildRequest("/coherence", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getCoherenceHistory(timeframe: String = "7d") async throws -> CoherenceHistoryResponse {
    guard let request = buildRequest("/coherence/history?timeframe=\(timeframe)", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getCoherenceMetric(id: String) async throws -> CoherenceDetailResponse {
    guard let request = buildRequest("/coherence/\(id)", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  // ============================================================================
  // Accessibility Endpoints
  // ============================================================================

  func scanBook(imageBase64: String) async throws -> BookScanResponse {
    let scanRequest = BookScanRequest(
      imageBase64: imageBase64,
      language: "en",
      focusArea: "full"
    )
    let data = try JSONEncoder().encode(scanRequest)

    guard let request = buildRequest("/accessibility/scan-book", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func getAccessibilitySettings() async throws -> AccessibilitySettingsResponse {
    guard let request = buildRequest("/accessibility/settings", method: "GET") else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func updateAccessibilitySettings(_ settings: AccessibilitySettingsRequest) async throws -> AccessibilitySettingsResponse {
    let data = try JSONEncoder().encode(settings)

    guard let request = buildRequest("/accessibility/settings", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  func generateTextToSpeech(text: String) async throws -> TextToSpeechResponse {
    let ttsRequest = TextToSpeechRequest(text: text, voiceId: "neural", speed: 1.0)
    let data = try JSONEncoder().encode(ttsRequest)

    guard let request = buildRequest("/accessibility/tts", method: "POST", body: data) else {
      throw APIError.invalidRequest
    }

    return try await performRequest(request)
  }

  private func performRequest<T: Decodable>(_ request: URLRequest) async throws -> T {
    let (data, response) = try await session.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse else {
      throw APIError.invalidResponse
    }

    if httpResponse.statusCode == 401 {
      throw APIError.serverError(code: 401, message: "Invalid email or password.")
    }

    if httpResponse.statusCode == 409 {
      throw APIError.serverError(code: 409, message: "An account with that email already exists.")
    }

    if httpResponse.statusCode == 400 {
      throw APIError.serverError(code: 400, message: "Please check your details and try again.")
    }

    if !(200..<300).contains(httpResponse.statusCode) {
      throw APIError.serverError(
        code: httpResponse.statusCode,
        message: "Something went wrong. Please try again."
      )
    }

    do {
      return try JSONDecoder().decode(T.self, from: data)
    } catch {
      throw APIError.decodingError(error)
    }
  }
}
