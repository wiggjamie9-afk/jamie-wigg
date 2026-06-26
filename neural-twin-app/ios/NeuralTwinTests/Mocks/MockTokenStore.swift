import Foundation

/// Mock TokenStore for testing authentication without UserDefaults
class MockTokenStore: TokenStore {
  private var _token: String?
  private var _userId: String?
  private var _email: String?
  private var _name: String?

  override var token: String? {
    _token
  }

  override var userId: String? {
    _userId
  }

  override var email: String? {
    _email
  }

  override var name: String? {
    _name
  }

  override var isLoggedIn: Bool {
    _token != nil && _userId != nil
  }

  override func saveSession(token: String, userId: String, email: String, name: String) {
    _token = token
    _userId = userId
    _email = email
    _name = name
  }

  override func clear() {
    _token = nil
    _userId = nil
    _email = nil
    _name = nil
  }

  /// Test helper to set individual values
  func setToken(_ token: String) {
    _token = token
  }

  func setUserId(_ userId: String) {
    _userId = userId
  }

  func setEmail(_ email: String) {
    _email = email
  }

  func setName(_ name: String) {
    _name = name
  }
}
