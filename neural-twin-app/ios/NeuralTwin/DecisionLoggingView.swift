import SwiftUI

// ============================================================================
// DECISION LOGGING VIEW - Log decisions, track metacognitive pillars
// ============================================================================

@MainActor
class DecisionLoggingViewModel: ObservableObject {
  @Published var title = ""
  @Published var description = ""
  @Published var category = "general"
  @Published var chosenOption = ""
  @Published var reasoning = ""
  @Published var planningClarity: Double = 5
  @Published var monitoringComprehension: Double = 5
  @Published var evaluationEffectiveness: Double = 5
  @Published var reflectionInsights = ""

  @Published var decisions: [DecisionResponse] = []
  @Published var selectedDecision: DecisionResponse?
  @Published var isLoading = false
  @Published var error: String?
  @Published var showError = false
  @Published var showSuccessMessage = false

  private let apiClient = APIClient.shared

  let categories = ["general", "career", "personal", "health", "financial", "relationship", "creative"]

  func submitDecision() {
    guard !title.isEmpty, !chosenOption.isEmpty, !reasoning.isEmpty else {
      error = "Please fill in all required fields"
      showError = true
      return
    }

    isLoading = true
    error = nil

    Task {
      do {
        let response = try await apiClient.logDecision(
          title: title,
          description: description,
          category: category,
          planningClarity: Int(planningClarity),
          monitoringComprehension: Int(monitoringComprehension),
          evaluationEffectiveness: Int(evaluationEffectiveness)
        )

        selectedDecision = response
        showSuccessMessage = true

        // Reset form
        resetForm()

        // Reload decisions
        loadDecisions()

      } catch {
        self.error = "Failed to log decision: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
    }
  }

  func loadDecisions() {
    isLoading = true

    Task {
      do {
        let response = try await apiClient.getDecisions()
        decisions = response.decisions
      } catch {
        self.error = "Failed to load decisions: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
    }
  }

  func resetForm() {
    title = ""
    description = ""
    category = "general"
    chosenOption = ""
    reasoning = ""
    planningClarity = 5
    monitoringComprehension = 5
    evaluationEffectiveness = 5
    reflectionInsights = ""
  }

  func calculateMetacognitiveScore() -> Double {
    let planning = planningClarity / 10 * 0.25
    let monitoring = monitoringComprehension / 10 * 0.25
    let evaluating = evaluationEffectiveness / 10 * 0.25
    let reflecting = reflectionInsights.isEmpty ? 0.0 : 0.25
    return (planning + monitoring + evaluating + reflecting) * 100
  }
}

struct DecisionLoggingView: View {
  @StateObject private var viewModel = DecisionLoggingViewModel()
  @State private var showForm = false

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        // Header
        HStack {
          Text("Decisions")
            .font(.system(size: 28, weight: .bold))
            .foregroundColor(.white)

          Spacer()

          Button(action: { showForm.toggle() }) {
            Image(systemName: "plus.circle.fill")
              .font(.system(size: 24))
              .foregroundColor(DesignTokens.brandBlue)
          }
        }
        .padding(.horizontal, DesignTokens.spacing16)

        // Form or list
        if showForm {
          DecisionForm(viewModel: viewModel, showForm: $showForm)
        } else {
          DecisionsList(viewModel: viewModel)
        }

        Spacer()
      }
      .padding(DesignTokens.spacing16)
    }
    .onAppear {
      viewModel.loadDecisions()
    }
    .alert("Error", isPresented: $viewModel.showError, presenting: viewModel.error) { _ in
      Button("OK") { viewModel.showError = false }
    } message: { error in
      Text(error)
    }
    .alert("Success", isPresented: $viewModel.showSuccessMessage) {
      Button("OK") { viewModel.showSuccessMessage = false }
    } message: {
      Text("Decision logged successfully!")
    }
  }
}

struct DecisionForm: View {
  @ObservedObject var viewModel: DecisionLoggingViewModel
  @Binding var showForm: Bool

  var body: some View {
    ScrollView {
      VStack(spacing: DesignTokens.spacing16) {
        // Title
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Decision Title")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          TextField("What decision are you making?", text: $viewModel.title)
            .font(.system(size: 14))
            .foregroundColor(DesignTokens.textPrimary)
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface2)
            .cornerRadius(DesignTokens.radiusSmall)
        }

        // Category
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Category")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          Picker("Category", selection: $viewModel.category) {
            ForEach(viewModel.categories, id: \.self) { cat in
              Text(cat.capitalized).tag(cat)
            }
          }
          .pickerStyle(.segmented)
        }

        // Description
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Description")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          TextEditor(text: $viewModel.description)
            .font(.system(size: 14))
            .foregroundColor(DesignTokens.textPrimary)
            .frame(height: 80)
            .padding(DesignTokens.spacing8)
            .background(DesignTokens.surface2)
            .cornerRadius(DesignTokens.radiusSmall)
        }

        // Chosen option
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Chosen Option")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          TextField("What did you decide?", text: $viewModel.chosenOption)
            .font(.system(size: 14))
            .foregroundColor(DesignTokens.textPrimary)
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface2)
            .cornerRadius(DesignTokens.radiusSmall)
        }

        // Reasoning
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Why did you choose this?")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          TextEditor(text: $viewModel.reasoning)
            .font(.system(size: 14))
            .foregroundColor(DesignTokens.textPrimary)
            .frame(height: 80)
            .padding(DesignTokens.spacing8)
            .background(DesignTokens.surface2)
            .cornerRadius(DesignTokens.radiusSmall)
        }

        // Metacognitive sliders
        VStack(spacing: DesignTokens.spacing16) {
          Text("Metacognitive Awareness")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)
            .frame(maxWidth: .infinity, alignment: .leading)

          MetacognitiveSlider(
            label: "Planning Clarity",
            value: $viewModel.planningClarity,
            description: "How clear was your thinking before deciding?"
          )

          MetacognitiveSlider(
            label: "Monitoring Comprehension",
            value: $viewModel.monitoringComprehension,
            description: "How well did you understand the decision process?"
          )

          MetacognitiveSlider(
            label: "Evaluation Effectiveness",
            value: $viewModel.evaluationEffectiveness,
            description: "How thoroughly did you evaluate options?"
          )
        }
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusSmall)

        // Reflection
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Reflection (Optional)")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          TextEditor(text: $viewModel.reflectionInsights)
            .font(.system(size: 14))
            .foregroundColor(DesignTokens.textPrimary)
            .frame(height: 60)
            .padding(DesignTokens.spacing8)
            .background(DesignTokens.surface2)
            .cornerRadius(DesignTokens.radiusSmall)
        }

        // Score display
        VStack(spacing: DesignTokens.spacing8) {
          Text("Metacognitive Score")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)
            .frame(maxWidth: .infinity, alignment: .leading)

          Text(String(format: "%.0f%%", viewModel.calculateMetacognitiveScore()))
            .font(.system(size: 32, weight: .bold))
            .foregroundColor(DesignTokens.brandBlue)
        }
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusSmall)

        // Submit button
        Button(action: viewModel.submitDecision) {
          HStack {
            if viewModel.isLoading {
              ProgressView()
                .tint(.white)
            }
            Text("Log Decision")
              .font(.system(size: 16, weight: .semibold))
          }
          .frame(maxWidth: .infinity)
          .frame(height: 56)
          .foregroundColor(.white)
          .background(DesignTokens.brandBlue)
          .cornerRadius(DesignTokens.radiusMedium)
        }
        .disabled(viewModel.isLoading)

        // Cancel button
        Button(action: { showForm = false }) {
          Text("Cancel")
            .font(.system(size: 14, weight: .semibold))
            .frame(maxWidth: .infinity)
            .frame(height: 44)
            .foregroundColor(DesignTokens.textSecondary)
            .background(DesignTokens.surface1)
            .cornerRadius(DesignTokens.radiusSmall)
        }
      }
      .padding(DesignTokens.spacing16)
      .background(DesignTokens.background)
    }
  }
}

struct DecisionsList: View {
  @ObservedObject var viewModel: DecisionLoggingViewModel

  var body: some View {
    VStack(spacing: DesignTokens.spacing12) {
      if viewModel.isLoading {
        ProgressView()
          .frame(maxWidth: .infinity)
          .frame(height: 200)
      } else if viewModel.decisions.isEmpty {
        VStack(spacing: DesignTokens.spacing12) {
          Image(systemName: "checkmark.circle")
            .font(.system(size: 48))
            .foregroundColor(DesignTokens.brandBlue)

          Text("No decisions yet")
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(DesignTokens.textPrimary)

          Text("Tap + to log your first decision")
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 200)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusMedium)
      } else {
        ScrollView {
          VStack(spacing: DesignTokens.spacing12) {
            ForEach(viewModel.decisions, id: \.id) { decision in
              DecisionListItem(
                decision: decision,
                isSelected: viewModel.selectedDecision?.id == decision.id
              ) {
                viewModel.selectedDecision = decision
              }
            }
          }
        }
      }
    }
    .frame(maxHeight: .infinity, alignment: .top)
  }
}

struct DecisionListItem: View {
  let decision: DecisionResponse
  let isSelected: Bool
  let onSelect: () -> Void

  var body: some View {
    Button(action: onSelect) {
      HStack(spacing: DesignTokens.spacing12) {
        VStack(alignment: .leading, spacing: 4) {
          Text(decision.title)
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.textPrimary)

          HStack(spacing: 8) {
            Text(decision.category)
              .font(.system(size: 11, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)

            Divider()
              .frame(height: 12)

            Text(decision.createdAt.formatted(date: .abbreviated, time: .omitted))
              .font(.system(size: 11, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
          }
        }

        Spacer()

        VStack(alignment: .trailing, spacing: 4) {
          Text(String(format: "%.0f%%", decision.metacognitiveScore))
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(scoreColor(decision.metacognitiveScore))
        }
      }
      .padding(DesignTokens.spacing12)
      .background(isSelected ? DesignTokens.surface2 : DesignTokens.surface1)
      .cornerRadius(DesignTokens.radiusSmall)
    }
  }

  private func scoreColor(_ score: Double) -> Color {
    if score >= 80 {
      return DesignTokens.successGreen
    } else if score >= 60 {
      return DesignTokens.warningOrange
    } else {
      return DesignTokens.errorRed
    }
  }
}

struct MetacognitiveSlider: View {
  let label: String
  @Binding var value: Double
  let description: String

  var body: some View {
    VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
      HStack {
        Text(label)
          .font(.system(size: 13, weight: .semibold))
          .foregroundColor(DesignTokens.textPrimary)

        Spacer()

        Text(String(format: "%.0f/10", value))
          .font(.system(size: 12, weight: .semibold))
          .foregroundColor(DesignTokens.brandBlue)
      }

      Slider(value: $value, in: 1...10, step: 1)
        .tint(DesignTokens.brandBlue)

      Text(description)
        .font(.system(size: 11, weight: .regular))
        .foregroundColor(DesignTokens.textSecondary)
    }
  }
}

#Preview {
  DecisionLoggingView()
    .preferredColorScheme(.dark)
}
