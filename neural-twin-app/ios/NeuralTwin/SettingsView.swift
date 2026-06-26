import SwiftUI

// ============================================================================
// SETTINGS VIEW - User profile and app preferences
// ============================================================================

struct SettingsView: View {
  @EnvironmentObject var authManager: AuthManager
  @State private var showingLogoutAlert = false

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        // Header
        Text("Settings")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(.white)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing16)

        ScrollView {
          VStack(spacing: DesignTokens.spacing24) {
            // Profile Section
            if let user = authManager.user {
              VStack(spacing: DesignTokens.spacing12) {
                Text("Profile")
                  .font(.system(size: 14, weight: .semibold))
                  .foregroundColor(DesignTokens.textSecondary)
                  .frame(maxWidth: .infinity, alignment: .leading)

                VStack(spacing: DesignTokens.spacing16) {
                  // Avatar
                  ZStack {
                    Circle()
                      .fill(
                        LinearGradient(
                          gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
                          startPoint: .topLeading,
                          endPoint: .bottomTrailing
                        )
                      )

                    Text(String(user.name.prefix(1)))
                      .font(.system(size: 36, weight: .bold))
                      .foregroundColor(.white)
                  }
                  .frame(width: 80, height: 80)

                  VStack(spacing: 4) {
                    Text(user.name)
                      .font(.system(size: 18, weight: .bold))
                      .foregroundColor(.white)

                    Text(user.email)
                      .font(.system(size: 13, weight: .regular))
                      .foregroundColor(DesignTokens.textSecondary)
                  }
                }
                .frame(maxWidth: .infinity)
                .padding(DesignTokens.spacing16)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusMedium)
              }
              .padding(.horizontal, DesignTokens.spacing16)
            }

            // App Settings
            VStack(spacing: DesignTokens.spacing12) {
              Text("App")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

              VStack(spacing: 0) {
                SettingRow(
                  icon: "moon.stars.fill",
                  label: "Dark Mode",
                  value: "On",
                  color: DesignTokens.accentPurple
                )

                Divider()
                  .background(DesignTokens.surface2)
                  .padding(.horizontal, DesignTokens.spacing12)

                SettingRow(
                  icon: "bell.badge.fill",
                  label: "Notifications",
                  value: "On",
                  color: DesignTokens.warningOrange
                )

                Divider()
                  .background(DesignTokens.surface2)
                  .padding(.horizontal, DesignTokens.spacing12)

                SettingRow(
                  icon: "globe",
                  label: "Language",
                  value: "English",
                  color: DesignTokens.brandBlue
                )
              }
              .background(DesignTokens.surface1)
              .cornerRadius(DesignTokens.radiusSmall)
            }
            .padding(.horizontal, DesignTokens.spacing16)

            // Data & Privacy
            VStack(spacing: DesignTokens.spacing12) {
              Text("Data & Privacy")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

              VStack(spacing: 0) {
                NavigationLink(destination: EmptyView()) {
                  HStack {
                    HStack(spacing: DesignTokens.spacing12) {
                      Image(systemName: "lock.fill")
                        .font(.system(size: 16))
                        .foregroundColor(DesignTokens.successGreen)
                        .frame(width: 24)

                      Text("Privacy Policy")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(DesignTokens.textPrimary)
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                      .font(.system(size: 12, weight: .semibold))
                      .foregroundColor(DesignTokens.textSecondary)
                  }
                  .padding(DesignTokens.spacing12)
                }

                Divider()
                  .background(DesignTokens.surface2)
                  .padding(.horizontal, DesignTokens.spacing12)

                NavigationLink(destination: EmptyView()) {
                  HStack {
                    HStack(spacing: DesignTokens.spacing12) {
                      Image(systemName: "doc.text.fill")
                        .font(.system(size: 16))
                        .foregroundColor(DesignTokens.brandBlue)
                        .frame(width: 24)

                      Text("Terms of Service")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(DesignTokens.textPrimary)
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                      .font(.system(size: 12, weight: .semibold))
                      .foregroundColor(DesignTokens.textSecondary)
                  }
                  .padding(DesignTokens.spacing12)
                }

                Divider()
                  .background(DesignTokens.surface2)
                  .padding(.horizontal, DesignTokens.spacing12)

                Button(action: {}) {
                  HStack {
                    HStack(spacing: DesignTokens.spacing12) {
                      Image(systemName: "trash.fill")
                        .font(.system(size: 16))
                        .foregroundColor(DesignTokens.errorRed)
                        .frame(width: 24)

                      Text("Delete Account")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(DesignTokens.errorRed)
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                      .font(.system(size: 12, weight: .semibold))
                      .foregroundColor(DesignTokens.textSecondary)
                  }
                  .padding(DesignTokens.spacing12)
                }
              }
              .background(DesignTokens.surface1)
              .cornerRadius(DesignTokens.radiusSmall)
            }
            .padding(.horizontal, DesignTokens.spacing16)

            // About
            VStack(spacing: DesignTokens.spacing12) {
              Text("About")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

              VStack(spacing: DesignTokens.spacing8) {
                HStack {
                  Text("Version")
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(DesignTokens.textPrimary)

                  Spacer()

                  Text("1.0.0")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(DesignTokens.textSecondary)
                }

                HStack {
                  Text("Build")
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(DesignTokens.textPrimary)

                  Spacer()

                  Text("2026.06.26")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(DesignTokens.textSecondary)
                }
              }
              .padding(DesignTokens.spacing12)
              .background(DesignTokens.surface1)
              .cornerRadius(DesignTokens.radiusSmall)
            }
            .padding(.horizontal, DesignTokens.spacing16)

            // Sign Out Button
            Button(action: { showingLogoutAlert = true }) {
              HStack {
                Image(systemName: "rectangle.portrait.and.arrow.right.fill")
                Text("Sign Out")
              }
              .font(.system(size: 16, weight: .semibold))
              .frame(maxWidth: .infinity)
              .frame(height: 56)
              .foregroundColor(.white)
              .background(DesignTokens.errorRed)
              .cornerRadius(DesignTokens.radiusMedium)
            }
            .padding(.horizontal, DesignTokens.spacing16)

            Spacer(minLength: DesignTokens.spacing24)
          }
          .padding(.vertical, DesignTokens.spacing16)
        }
      }
    }
    .alert("Sign Out?", isPresented: $showingLogoutAlert) {
      Button("Cancel", role: .cancel) { }
      Button("Sign Out", role: .destructive) {
        authManager.logout()
      }
    } message: {
      Text("Are you sure you want to sign out?")
    }
  }
}

struct SettingRow: View {
  let icon: String
  let label: String
  let value: String
  let color: Color

  var body: some View {
    HStack(spacing: DesignTokens.spacing12) {
      Image(systemName: icon)
        .font(.system(size: 16))
        .foregroundColor(color)
        .frame(width: 24)

      Text(label)
        .font(.system(size: 14, weight: .regular))
        .foregroundColor(DesignTokens.textPrimary)

      Spacer()

      Text(value)
        .font(.system(size: 13, weight: .regular))
        .foregroundColor(DesignTokens.textSecondary)

      Image(systemName: "chevron.right")
        .font(.system(size: 12, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)
    }
    .padding(DesignTokens.spacing12)
  }
}

#Preview {
  SettingsView()
    .environmentObject(AuthManager())
    .preferredColorScheme(.dark)
}
