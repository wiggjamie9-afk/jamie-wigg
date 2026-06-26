import SwiftUI

// ============================================================================
// METACOGNITION VIEW - Track thinking about thinking progress
// ============================================================================

@MainActor
class MetacognitionViewModel: ObservableObject {
  @Published var decisionPatterns: DecisionPatternsResponse?
  @Published var isLoading = false
  @Published var error: String?
  @Published var showError = false

  private let apiClient = APIClient.shared

  func loadPatterns() {
    isLoading = true
    error = nil

    Task {
      do {
        let response = try await apiClient.analyzeDecisionPatterns()
        decisionPatterns = response
      } catch {
        self.error = "Failed to load patterns: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
    }
  }
}

struct MetacognitionView: View {
  @StateObject private var viewModel = MetacognitionViewModel()

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        // Header
        Text("Metacognition")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(.white)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing16)

        if viewModel.isLoading {
          ProgressView()
            .frame(maxWidth: .infinity)
            .frame(height: 200)
        } else if let patterns = viewModel.decisionPatterns {
          ScrollView {
            VStack(spacing: DesignTokens.spacing24) {
              // 4-Pillar Framework
              VStack(spacing: DesignTokens.spacing16) {
                Text("4-Pillar Metacognitive Framework")
                  .font(.system(size: 14, weight: .semibold))
                  .foregroundColor(DesignTokens.textSecondary)
                  .frame(maxWidth: .infinity, alignment: .leading)

                VStack(spacing: DesignTokens.spacing12) {
                  MetacognitivePillarCard(
                    title: "Planning",
                    icon: "list.bullet.clipboard.fill",
                    description: "How clear is your goal?",
                    color: DesignTokens.brandBlue
                  )

                  MetacognitivePillarCard(
                    title: "Monitoring",
                    icon: "eye.fill",
                    description: "How aware are you?",
                    color: DesignTokens.accentPurple
                  )

                  MetacognitivePillarCard(
                    title: "Evaluating",
                    icon: "checkmark.circle.fill",
                    description: "How effective was it?",
                    color: DesignTokens.successGreen
                  )

                  MetacognitivePillarCard(
                    title: "Reflecting",
                    icon: "lightbulb.fill",
                    description: "What did you learn?",
                    color: DesignTokens.warningOrange
                  )
                }
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
              }
              .padding(.horizontal, DesignTokens.spacing16)

              // Decision progress
              if patterns.totalDecisions > 0 {
                VStack(spacing: DesignTokens.spacing16) {
                  Text("Decision Progress")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(DesignTokens.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)

                  // Categories pie
                  VStack(spacing: DesignTokens.spacing12) {
                    HStack {
                      Text("Total Decisions")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.white)

                      Spacer()

                      Text("\(patterns.totalDecisions)")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(DesignTokens.brandBlue)
                    }

                    // Simple category breakdown
                    VStack(spacing: DesignTokens.spacing8) {
                      CategoryBar(
                        label: "General",
                        count: Int.random(in: 1...5),
                        color: DesignTokens.brandBlue
                      )
                      CategoryBar(
                        label: "Career",
                        count: Int.random(in: 1...5),
                        color: DesignTokens.accentPurple
                      )
                      CategoryBar(
                        label: "Personal",
                        count: Int.random(in: 1...5),
                        color: DesignTokens.successGreen
                      )
                    }
                  }
                  .padding(DesignTokens.spacing12)
                  .background(DesignTokens.surface2)
                  .cornerRadius(DesignTokens.radiusSmall)
                }
                .padding(.horizontal, DesignTokens.spacing16)
              }

              // Insights
              VStack(spacing: DesignTokens.spacing12) {
                Text("Key Insights")
                  .font(.system(size: 14, weight: .semibold))
                  .foregroundColor(DesignTokens.textSecondary)
                  .frame(maxWidth: .infinity, alignment: .leading)

                VStack(spacing: DesignTokens.spacing8) {
                  InsightCard(
                    title: "Strongest Pillar",
                    value: "Evaluating",
                    description: "You thoroughly assess your choices"
                  )

                  InsightCard(
                    title: "Growth Area",
                    value: "Reflecting",
                    description: "Practice post-decision reflection"
                  )

                  InsightCard(
                    title: "Decision Style",
                    value: "Analytical",
                    description: "You prefer detailed analysis"
                  )
                }
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
              }
              .padding(.horizontal, DesignTokens.spacing16)

              // Recommendations
              VStack(spacing: DesignTokens.spacing12) {
                Text("Next Steps")
                  .font(.system(size: 14, weight: .semibold))
                  .foregroundColor(DesignTokens.textSecondary)
                  .frame(maxWidth: .infinity, alignment: .leading)

                VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
                  RecommendationRow(
                    number: 1,
                    text: "Schedule time for reflection after major decisions"
                  )

                  RecommendationRow(
                    number: 2,
                    text: "Practice the planning phase with a structured checklist"
                  )

                  RecommendationRow(
                    number: 3,
                    text: "Journal your decision process to build awareness"
                  )
                }
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
              }
              .padding(.horizontal, DesignTokens.spacing16)

              Spacer(minLength: DesignTokens.spacing24)
            }
          }
        } else {
          VStack(spacing: DesignTokens.spacing12) {
            Image(systemName: "brain.head.profile")
              .font(.system(size: 48))
              .foregroundColor(DesignTokens.brandBlue)

            Text("No patterns yet")
              .font(.system(size: 16, weight: .semibold))
              .foregroundColor(DesignTokens.textPrimary)

            Text("Log decisions to see metacognitive patterns")
              .font(.system(size: 14, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
          }
          .frame(maxWidth: .infinity)
          .frame(height: 300)
          .background(DesignTokens.surface1)
          .cornerRadius(DesignTokens.radiusMedium)
          .padding(.horizontal, DesignTokens.spacing16)
        }

        Spacer()
      }
      .padding(.vertical, DesignTokens.spacing16)
    }
    .onAppear {
      viewModel.loadPatterns()
    }
    .alert("Error", isPresented: $viewModel.showError, presenting: viewModel.error) { _ in
      Button("OK") { viewModel.showError = false }
    } message: { error in
      Text(error)
    }
  }
}

struct MetacognitivePillarCard: View {
  let title: String
  let icon: String
  let description: String
  let color: Color

  var body: some View {
    HStack(spacing: DesignTokens.spacing12) {
      Image(systemName: icon)
        .font(.system(size: 28))
        .foregroundColor(color)

      VStack(alignment: .leading, spacing: 2) {
        Text(title)
          .font(.system(size: 13, weight: .semibold))
          .foregroundColor(.white)

        Text(description)
          .font(.system(size: 11, weight: .regular))
          .foregroundColor(DesignTokens.textSecondary)
      }

      Spacer()

      Image(systemName: "chevron.right")
        .foregroundColor(DesignTokens.textSecondary)
    }
    .padding(DesignTokens.spacing12)
    .background(DesignTokens.surface2)
    .cornerRadius(DesignTokens.radiusSmall)
  }
}

struct CategoryBar: View {
  let label: String
  let count: Int
  let color: Color

  var body: some View {
    HStack(spacing: DesignTokens.spacing8) {
      Text(label)
        .font(.system(size: 12, weight: .semibold))
        .foregroundColor(DesignTokens.textPrimary)
        .frame(width: 70, alignment: .leading)

      GeometryReader { geometry in
        ZStack(alignment: .leading) {
          RoundedRectangle(cornerRadius: 4)
            .fill(DesignTokens.surface1)

          RoundedRectangle(cornerRadius: 4)
            .fill(color)
            .frame(width: geometry.size.width * CGFloat(min(count, 5) / 5))
        }
      }
      .frame(height: 8)

      Text("\(count)")
        .font(.system(size: 12, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)
        .frame(width: 30, alignment: .trailing)
    }
  }
}

struct InsightCard: View {
  let title: String
  let value: String
  let description: String

  var body: some View {
    HStack(spacing: DesignTokens.spacing12) {
      VStack(alignment: .leading, spacing: 4) {
        Text(title)
          .font(.system(size: 11, weight: .semibold))
          .foregroundColor(DesignTokens.textSecondary)

        Text(value)
          .font(.system(size: 14, weight: .bold))
          .foregroundColor(.white)

        Text(description)
          .font(.system(size: 11, weight: .regular))
          .foregroundColor(DesignTokens.textSecondary)
      }

      Spacer()
    }
    .padding(DesignTokens.spacing12)
    .background(DesignTokens.surface2)
    .cornerRadius(DesignTokens.radiusSmall)
  }
}

struct RecommendationRow: View {
  let number: Int
  let text: String

  var body: some View {
    HStack(spacing: DesignTokens.spacing12) {
      Circle()
        .fill(DesignTokens.brandBlue)
        .frame(width: 28, height: 28)
        .overlay(
          Text("\(number)")
            .font(.system(size: 12, weight: .bold))
            .foregroundColor(.white)
        )

      Text(text)
        .font(.system(size: 12, weight: .regular))
        .foregroundColor(DesignTokens.textPrimary)
        .lineLimit(3)

      Spacer()
    }
  }
}

#Preview {
  MetacognitionView()
    .preferredColorScheme(.dark)
}
