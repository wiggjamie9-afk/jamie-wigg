import Foundation

class TokenStore {
  static let shared = TokenStore()

  private let defaults = UserDefaults.standard
  private let tokenKey = "neural_twin_token"
  private let userIdKey = "neural_twin_user_id"
  private let emailKey = "neural_twin_email"
  private let nameKey = "neural_twin_name"

  var token: String? {
    defaults.string(forKey: tokenKey)
  }

  var userId: String? {
    defaults.string(forKey: userIdKey)
  }

  var email: String? {
    defaults.string(forKey: emailKey)
  }

  var name: String? {
    defaults.string(forKey: nameKey)
  }

  var isLoggedIn: Bool {
    token != nil && userId != nil
  }

  func saveSession(token: String, userId: String, email: String, name: String) {
    defaults.set(token, forKey: tokenKey)
    defaults.set(userId, forKey: userIdKey)
    defaults.set(email, forKey: emailKey)
    defaults.set(name, forKey: nameKey)
  }

  func clear() {
    defaults.removeObject(forKey: tokenKey)
    defaults.removeObject(forKey: userIdKey)
    defaults.removeObject(forKey: emailKey)
    defaults.removeObject(forKey: nameKey)
  }
}
