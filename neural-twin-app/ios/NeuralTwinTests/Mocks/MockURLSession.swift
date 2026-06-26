import Foundation

/// Mock URLSession for testing network requests without hitting real servers
class MockURLSession: URLSession {
  var data: Data?
  var response: URLResponse?
  var error: Error?

  var lastRequest: URLRequest?

  func setMockResponse(data: Data, statusCode: Int = 200) {
    self.data = data
    let httpResponse = HTTPURLResponse(
      url: URL(string: "http://localhost:5000/api")!,
      statusCode: statusCode,
      httpVersion: nil,
      headerFields: ["Content-Type": "application/json"]
    )
    self.response = httpResponse
  }

  func setMockError(_ error: Error) {
    self.error = error
  }

  override func data(for request: URLRequest) async throws -> (Data, URLResponse) {
    lastRequest = request
    if let error = error {
      throw error
    }
    guard let data = data, let response = response else {
      throw URLError(.badServerResponse)
    }
    return (data, response)
  }
}

/// Mock URLSessionConfiguration for testing
class MockURLSessionConfiguration: URLSessionConfiguration {
  override class var `default`: URLSessionConfiguration {
    let config = URLSessionConfiguration()
    config.timeoutIntervalForRequest = 60
    config.timeoutIntervalForResource = 60
    return config
  }
}
