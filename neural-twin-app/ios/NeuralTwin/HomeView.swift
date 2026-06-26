import SwiftUI

// ============================================================================
// HOME VIEW - Dashboard with quick stats
// ============================================================================

@MainActor
class HomeViewModel: ObservableObject {
  @Published var recentRecordings: [VoiceRecordingResponse] = []
  @Published var recentDecisions: [DecisionResponse] = []
  @Published var coherenceScore: Double = 0
  @Published var isLoading = false

  private let apiClient = APIClient.shared

  func loadDashboardData() {
    isLoading = true

    Task {
      async let recordings = loadRecordings()
      async let decisions = loadDecisions()
      async let coherence = loadCoherence()

      _ = await (recordings, decisions, coherence)

      isLoading = false
    }
  }

  private func loadRecordings() async {
    do {
      let response = try await apiClient.getVoiceRecordings()
      self.recentRecordings = Array(response.recordings.prefix(3))
    } catch {
      print("Failed to load recordings: \(error)")
    }
  }

  private func loadDecisions() async {
    do {
      let response = try await apiClient.getDecisions()
      self.recentDecisions = Array(response.decisions.prefix(3))
    } catch {
      print("Failed to load decisions: \(error)")
    }
  }

  private func loadCoherence() async {
    do {
      let response = try await apiClient.getCoherence()
      self.coherenceScore = Double(response.overallCoherence) ?? 0
    } catch {
      print("Failed to load coherence: \(error)")
    }
  }
}

struct HomeView: View {
  @StateObject private var viewModel = HomeViewModel()
  @EnvironmentObject var authManager: AuthManager

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      ScrollView {
        VStack(spacing: DesignTokens.spacing24) {
          // Header with greeting
          VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
            Text("Welcome back")
              .font(.system(size: 14, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)

            HStack {
              Text(authManager.user?.name ?? "User")
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.white)

              Spacer()

              Image(systemName: "sun.max.fill")
                .font(.system(size: 24))
                .foregroundColor(DesignTokens.warningOrange)
            }
          }
          .frame(maxWidth: .infinity)
          .padding(DesignTokens.spacing16)

          // Quick stats cards
          VStack(spacing: DesignTokens.spacing12) {
            // Coherence card
            StatCard(
              title: "Coherence",
              value: String(format: "%.0f%%", viewModel.coherenceScore),
              icon: "waveform.circle.fill",
              color: DesignTokens.brandBlue,
              description: "Overall system coherence"
            )

            // Activity cards
            HStack(spacing: DesignTokens.spacing12) {
              StatCard(
                title: "Recordings",
                value: "\(viewModel.recentRecordings.count)",
                icon: "mic.circle.fill",
                color: DesignTokens.accentPurple,
                description: "This week"
              )

              StatCard(
                title: "Decisions",
                value: "\(viewModel.recentDecisions.count)",
                icon: "checkmark.circle.fill",
                color: DesignTokens.successGreen,
                description: "Logged"
              )
            }
          }
          .padding(.horizontal, DesignTokens.spacing16)

          // Recent activity
          VStack(spacing: DesignTokens.spacing12) {
            Text("Recent Activity")
              .font(.system(size: 14, weight: .semibold))
              .foregroundColor(DesignTokens.textSecondary)
              .frame(maxWidth: .infinity, alignment: .leading)
              .padding(.horizontal, DesignTokens.spacing16)

            // Recent recordings
            if !viewModel.recentRecordings.isEmpty {
              VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
                Text("Latest Recordings")
                  .font(.system(size: 12, weight: .semibold))
                  .foregroundColor(DesignTokens.textPrimary)
                  .padding(.horizontal, DesignTokens.spacing12)

                VStack(spacing: DesignTokens.spacing8) {
                  ForEach(viewModel.recentRecordings.prefix(2), id: \.id) { recording in
                    HStack(spacing: DesignTokens.spacing8) {
                      Image(systemName: "waveform")
                        .foregroundColor(DesignTokens.brandBlue)

                      VStack(alignment: .leading, spacing: 2) {
                        Text("Voice Note")
                          .font(.system(size: 12, weight: .semibold))
                          .foregroundColor(.white)

                        Text(recording.createdAt.formatted(date: .abbreviated, time: .shortened))
                          .font(.system(size: 11, weight: .regular))
                          .foregroundColor(DesignTokens.textSecondary)
                      }

                      Spacer()

                      Text("😊")
                        .font(.system(size: 14))
                    }
                    .padding(DesignTokens.spacing10)
                    .background(DesignTokens.surface2)
                    .cornerRadius(DesignTokens.radiusSmall)
                  }
                }
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
              }
            }

            // Recent decisions
            if !viewModel.recentDecisions.isEmpty {
              VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
                Text("Recent Decisions")
                  .font(.system(size: 12, weight: .semibold))
                  .foregroundColor(DesignTokens.textPrimary)
                  .padding(.horizontal, DesignTokens.spacing12)

                VStack(spacing: DesignTokens.spacing8) {
                  ForEach(viewModel.recentDecisions.prefix(2), id: \.id) { decision in
                    HStack(spacing: DesignTokens.spacing8) {
                      Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(DesignTokens.successGreen)

                      VStack(alignment: .leading, spacing: 2) {
                        Text(decision.title)
                          .font(.system(size: 12, weight: .semibold))
                          .foregroundColor(.white)

                        Text(decision.category)
                          .font(.system(size: 11, weight: .regular))
                          .foregroundColor(DesignTokens.textSecondary)
                      }

                      Spacer()

                      Text(String(format: "%.0f%%", decision.metacognitiveScore))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(DesignTokens.brandBlue)
                    }
                    .padding(DesignTokens.spacing10)
                    .background(DesignTokens.surface2)
                    .cornerRadius(DesignTokens.radiusSmall)
                  }
                }
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
              }
            }
          }
          .padding(.horizontal, DesignTokens.spacing16)

          // Quick actions
          VStack(spacing: DesignTokens.spacing12) {
            Text("Quick Actions")
              .font(.system(size: 14, weight: .semibold))
              .foregroundColor(DesignTokens.textSecondary)
              .frame(maxWidth: .infinity, alignment: .leading)

            HStack(spacing: DesignTokens.spacing12) {
              QuickActionButton(
                icon: "mic.fill",
                label: "Record",
                color: DesignTokens.brandBlue
              )

              QuickActionButton(
                icon: "checkmark.circle.fill",
                label: "Decide",
                color: DesignTokens.successGreen
              )

              QuickActionButton(
                icon: "waveform.circle.fill",
                label: "Coherence",
                color: DesignTokens.accentPurple
              )
            }
          }
          .padding(.horizontal, DesignTokens.spacing16)

          Spacer(minLength: DesignTokens.spacing24)
        }
        .padding(.vertical, DesignTokens.spacing16)
      }
    }
    .onAppear {
      viewModel.loadDashboardData()
    }
  }
}

struct StatCard: View {
  let title: String
  let value: String
  let icon: String
  let color: Color
  let description: String

  var body: some View {
    HStack(spacing: DesignTokens.spacing12) {
      VStack(alignment: .leading, spacing: DesignTokens.spacing4) {
        Text(title)
          .font(.system(size: 12, weight: .semibold))
          .foregroundColor(DesignTokens.textSecondary)

        Text(value)
          .font(.system(size: 24, weight: .bold))
          .foregroundColor(.white)

        Text(description)
          .font(.system(size: 11, weight: .regular))
          .foregroundColor(DesignTokens.textSecondary)
      }

      Spacer()

      Image(systemName: icon)
        .font(.system(size: 40))
        .foregroundColor(color)
        .opacity(0.3)
    }
    .padding(DesignTokens.spacing16)
    .background(DesignTokens.surface1)
    .cornerRadius(DesignTokens.radiusMedium)
  }
}

struct QuickActionButton: View {
  let icon: String
  let label: String
  let color: Color

  var body: some View {
    VStack(spacing: DesignTokens.spacing8) {
      Image(systemName: icon)
        .font(.system(size: 28))
        .foregroundColor(color)

      Text(label)
        .font(.system(size: 12, weight: .semibold))
        .foregroundColor(.white)
    }
    .frame(maxWidth: .infinity)
    .frame(height: 80)
    .background(DesignTokens.surface1)
    .cornerRadius(DesignTokens.radiusMedium)
  }
}

#Preview {
  HomeView()
    .environmentObject(AuthManager())
    .preferredColorScheme(.dark)
}
