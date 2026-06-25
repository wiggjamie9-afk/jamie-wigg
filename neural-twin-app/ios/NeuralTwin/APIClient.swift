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
