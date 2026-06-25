import Foundation

struct LoginRequest: Codable {
  let email: String
  let password: String
}

struct RegisterRequest: Codable {
  let email: String
  let password: String
  let name: String
}

struct AuthUser: Codable {
  let id: String
  let email: String
  let name: String
}

struct AuthResponse: Codable {
  let user: AuthUser
  let token: String
}
